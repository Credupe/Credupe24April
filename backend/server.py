"""
Supervisor-compatible launcher for the NestJS backend.
=======================================================

The platform's supervisor config is read-only and expects:

    /root/.venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001 --reload

To keep that contract while running NestJS, this file exposes an ASGI
app (`app`) that:

  1. Best-effort bootstraps local Postgres + Redis (idempotent, safe when
     they're already running or when services aren't installed).
  2. Spawns the NestJS service on 127.0.0.1:$NEST_PORT as a child process
     at startup (using `yarn start:prod` once built, or `yarn start:dev`
     if `dist/main.js` is absent).
  3. Reverse-proxies all HTTP requests to the NestJS process.
  4. Health-checks NestJS and re-spawns it if it dies.

Nothing in this file touches business logic — it's a transparent shim.
"""
from __future__ import annotations

import asyncio
import json
import os
import shutil as _shutil
import signal
import subprocess
import sys
from pathlib import Path
from typing import Optional

import httpx
from dotenv import load_dotenv
from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import JSONResponse, Response, StreamingResponse
from starlette.routing import Route

# Load /app/backend/.env explicitly BEFORE reading any env vars, so
# EMERGENT_LLM_KEY is available when the AI chat endpoint is invoked.
load_dotenv(Path(__file__).parent / ".env")

BACKEND_DIR = Path(__file__).parent.resolve()
NEST_HOST = os.environ.get("NEST_HOST", "127.0.0.1")
NEST_PORT = int(os.environ.get("NEST_PORT", "4000"))
NEST_BASE = f"http://{NEST_HOST}:{NEST_PORT}"

_proc: Optional[subprocess.Popen] = None
_client: Optional[httpx.AsyncClient] = None


def _ensure_local_services() -> None:
    """Best-effort bootstrap for local Postgres + Redis.

    The Emergent container is ephemeral: when it's recycled, services
    installed under /etc aren't guaranteed to be running. We idempotently
    try to start them here so the NestJS process always finds a DB and
    cache available. All commands are best-effort — if they fail we log
    and continue (production envs using Cloudflare / hosted Postgres
    won't have pg_ctlcluster installed, and that's fine).
    """
    # Postgres
    try:
        if _shutil.which("pg_ctlcluster"):
            result = subprocess.run(
                ["pg_ctlcluster", "15", "main", "start"],
                capture_output=True, text=True, timeout=15,
            )
            msg = (result.stderr or result.stdout or "").strip()
            if result.returncode == 0:
                print("[launcher] Postgres: started", flush=True)
            elif "already running" in msg.lower():
                print("[launcher] Postgres: already running", flush=True)
            else:
                print(f"[launcher] Postgres bootstrap note: {msg}", flush=True)
    except Exception as e:  # noqa: BLE001
        print(f"[launcher] Postgres bootstrap skipped: {e}", flush=True)

    # Redis
    try:
        if _shutil.which("redis-cli"):
            probe = subprocess.run(
                ["redis-cli", "-p", "6379", "ping"],
                capture_output=True, text=True, timeout=3,
            )
            if probe.returncode == 0 and "PONG" in (probe.stdout or ""):
                print("[launcher] Redis: already running", flush=True)
                return
        if _shutil.which("redis-server"):
            subprocess.run(
                ["redis-server", "--daemonize", "yes",
                 "--port", "6379", "--bind", "127.0.0.1"],
                capture_output=True, text=True, timeout=5,
            )
            print("[launcher] Redis: started", flush=True)
    except Exception as e:  # noqa: BLE001
        print(f"[launcher] Redis bootstrap skipped: {e}", flush=True)


def _spawn_nest() -> subprocess.Popen:
    """Start the NestJS dev server as a child process."""
    dist_main = BACKEND_DIR / "dist" / "main.js"
    if dist_main.is_file():
        cmd = ["node", str(dist_main)]
    else:
        cmd = ["yarn", "start:dev"]

    env = os.environ.copy()
    env["PORT"] = str(NEST_PORT)
    env["HOST"] = NEST_HOST
    return subprocess.Popen(
        cmd,
        cwd=str(BACKEND_DIR),
        env=env,
        stdout=sys.stdout,
        stderr=sys.stderr,
        preexec_fn=os.setsid,
    )


async def _wait_for_nest(timeout_sec: float = 90.0) -> None:
    assert _client is not None
    deadline = asyncio.get_event_loop().time() + timeout_sec
    last_err: Optional[Exception] = None
    while asyncio.get_event_loop().time() < deadline:
        try:
            r = await _client.get(f"{NEST_BASE}/api/v1/health", timeout=2.0)
            if r.status_code < 500:
                return
        except Exception as e:  # noqa: BLE001
            last_err = e
        await asyncio.sleep(0.5)
    raise RuntimeError(f"NestJS did not become ready in {timeout_sec}s: {last_err}")


async def _startup() -> None:
    global _proc, _client
    _ensure_local_services()
    _client = httpx.AsyncClient(timeout=None)
    _proc = _spawn_nest()
    try:
        await _wait_for_nest()
        print(f"[launcher] NestJS ready on {NEST_BASE}", flush=True)
    except Exception as e:  # noqa: BLE001
        print(f"[launcher] startup warning: {e}", flush=True)


async def _shutdown() -> None:
    global _proc, _client
    if _client is not None:
        await _client.aclose()
    if _proc is not None and _proc.poll() is None:
        try:
            os.killpg(os.getpgid(_proc.pid), signal.SIGTERM)
            _proc.wait(timeout=10)
        except Exception:  # noqa: BLE001
            try:
                os.killpg(os.getpgid(_proc.pid), signal.SIGKILL)
            except Exception:
                pass


async def _proxy(request: Request) -> Response:
    assert _client is not None
    # ensure NestJS is alive — respawn if it crashed
    global _proc
    if _proc is None or _proc.poll() is not None:
        _ensure_local_services()
        _proc = _spawn_nest()
        try:
            await _wait_for_nest(timeout_sec=30)
        except Exception as e:  # noqa: BLE001
            return JSONResponse(
                {
                    "success": False,
                    "data": None,
                    "error": {
                        "code": "UPSTREAM_DOWN",
                        "status": 502,
                        "message": [f"NestJS upstream unavailable: {e}"],
                    },
                },
                status_code=502,
            )

    upstream_url = f"{NEST_BASE}{request.url.path}"
    if request.url.query:
        upstream_url += f"?{request.url.query}"

    # Strip hop-by-hop headers AND content-coding/length — httpx has already
    # decoded the upstream body, so forwarding `content-encoding: gzip` would
    # lie to the client. Content-length is re-computed from returned bytes.
    excluded = {
        "host", "connection", "keep-alive", "proxy-authenticate", "proxy-authorization",
        "te", "trailers", "transfer-encoding", "upgrade", "content-length", "content-encoding",
    }
    headers = {k: v for k, v in request.headers.items() if k.lower() not in excluded}
    headers["accept-encoding"] = "identity"

    body = await request.body()

    try:
        resp = await _client.request(
            request.method,
            upstream_url,
            headers=headers,
            content=body,
            follow_redirects=False,
            timeout=60.0,
        )
    except httpx.RequestError as e:
        return JSONResponse(
            {
                "success": False,
                "data": None,
                "error": {
                    "code": "PROXY_ERROR",
                    "status": 502,
                    "message": [f"Upstream error: {e}"],
                },
            },
            status_code=502,
        )

    resp_headers = {k: v for k, v in resp.headers.items() if k.lower() not in excluded}
    return Response(content=resp.content, status_code=resp.status_code, headers=resp_headers)


# ───────────────────────── Credu AI chat endpoint ──────────────────────────
_CREDU_SYSTEM_PROMPT = """You are **Credu AI**, the friendly, knowledgeable lending assistant for **CreduPe** — India's marketplace for personal loans, home loans, business loans, credit cards, and credit scores.

Scope you help with:
- Personal loans, home loans, LAP, business loans, car/two-wheeler/used-car loans, gold loans, education loans, micro-loans, credit cards.
- Credit scores & CIBIL — what they mean, how to improve them, the 4 Indian bureaus.
- EMI / eligibility calculators (principal, rate, tenure maths).
- Documents typically required (KYC, income proof, bank statements).
- Fees, interest rate ranges, tenure ranges on the Indian market.

Style:
- Warm, concise, practical. Plain English (or Hinglish numbers like ₹50,000 / ₹1 lakh / ₹1 crore).
- Structure with short bullet points (`- foo`) and bold headings (`**Heading**`) when helpful.
- Keep answers under 180 words unless the user explicitly asks for detail.
- If you don't know a bank-specific number, say so and suggest using CreduPe's comparison tool.
- NEVER give legally-binding advice or claim to approve/reject anyone.

**Every response MUST end on its own line with exactly:**
`⚠️ Disclaimer: This is AI-generated guidance by Credu AI. For personalized advice, please consult a CreduPe financial advisor.`
"""


async def _stream_llm_openai_sse(messages: list[dict]):
    """Streams a Claude Sonnet 4.5 response as OpenAI-compatible SSE chunks.

    Emits `data: {"choices":[{"delta":{"content":"..."}}]}\\n\\n` so the
    frontend (which already parses this format) works unchanged. Falls back
    to an error chunk if the LLM call fails.
    """
    api_key = os.environ.get("EMERGENT_LLM_KEY", "").strip()
    if not api_key:
        yield f"data: {json.dumps({'error': 'EMERGENT_LLM_KEY not configured'})}\n\n"
        yield "data: [DONE]\n\n"
        return

    # emergentintegrations is a sync-await-friendly facade over the underlying
    # provider client. We run it per-request (new session each call) and
    # simulate streaming by chunking the final text — the library in its
    # current version returns the full string after model completion, so we
    # split on whitespace to emit delta chunks the browser can render
    # progressively (feels native without requiring a provider-level stream).
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
    except Exception as e:  # noqa: BLE001
        yield f"data: {json.dumps({'error': f'emergentintegrations import failed: {e}'})}\n\n"
        yield "data: [DONE]\n\n"
        return

    # Collapse the user-supplied history into a single prompt the chat SDK
    # can consume (the LlmChat facade is single-session; we rebuild each call).
    convo_lines = []
    for m in messages[:-1]:
        role = m.get("role", "user")
        txt = str(m.get("content", "")).strip()
        if not txt:
            continue
        prefix = "User" if role == "user" else "Credu AI"
        convo_lines.append(f"{prefix}: {txt}")
    last = messages[-1] if messages else {"role": "user", "content": ""}
    last_text = str(last.get("content", "")).strip() or "Hi"
    prompt = (
        "\n".join(convo_lines) + ("\n\n" if convo_lines else "") + f"User: {last_text}\nCredu AI:"
    )

    try:
        chat = LlmChat(
            api_key=api_key,
            session_id=f"credu-ai-{os.urandom(4).hex()}",
            system_message=_CREDU_SYSTEM_PROMPT,
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        reply = await chat.send_message(UserMessage(text=prompt))
    except Exception as e:  # noqa: BLE001
        yield f"data: {json.dumps({'error': f'LLM call failed: {e}'})}\n\n"
        yield "data: [DONE]\n\n"
        return

    # Stream word-by-word so the UI "types" the response.
    reply = str(reply or "").strip()
    if not reply:
        reply = "I couldn't generate a response right now. Please try again.\n\n⚠️ Disclaimer: This is AI-generated guidance by Credu AI. For personalized advice, please consult a CreduPe financial advisor."

    # Keep whitespace tokens so line breaks render.
    import re
    tokens = re.findall(r"\S+\s*|\n", reply)
    for tok in tokens:
        payload = {"choices": [{"delta": {"content": tok}}]}
        yield f"data: {json.dumps(payload)}\n\n"
        await asyncio.sleep(0.01)  # lets the reader flush frame-by-frame
    yield "data: [DONE]\n\n"


async def _ai_chat(request: Request) -> Response:
    # CORS preflight
    if request.method == "OPTIONS":
        return Response(
            status_code=204,
            headers={
                "access-control-allow-origin": request.headers.get("origin", "*"),
                "access-control-allow-methods": "POST, OPTIONS",
                "access-control-allow-headers": "authorization, content-type",
                "access-control-max-age": "86400",
            },
        )

    try:
        body = await request.json()
    except Exception:  # noqa: BLE001
        return JSONResponse(
            {"success": False, "data": None, "error": {"code": "BAD_JSON", "status": 400, "message": ["Invalid JSON body"]}},
            status_code=400,
        )

    messages = body.get("messages") or []
    if not isinstance(messages, list) or not messages:
        return JSONResponse(
            {"success": False, "data": None, "error": {"code": "VALIDATION_ERROR", "status": 400, "message": ["messages[] required"]}},
            status_code=400,
        )

    return StreamingResponse(
        _stream_llm_openai_sse(messages),
        media_type="text/event-stream",
        headers={
            "cache-control": "no-cache, no-transform",
            "x-accel-buffering": "no",
            "connection": "keep-alive",
            "access-control-allow-origin": request.headers.get("origin", "*"),
        },
    )


app = Starlette(
    routes=[
        Route("/api/v1/ai/chat", _ai_chat, methods=["POST", "OPTIONS"]),
        Route("/{path:path}", _proxy, methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]),
    ],
    on_startup=[_startup],
    on_shutdown=[_shutdown],
)
