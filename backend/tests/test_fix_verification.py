"""
Verification tests for fixes applied after iteration 1:

HIGH-1: Starlette proxy must not forward stale Content-Encoding header.
HIGH-2: Body-parser limit raised; PayloadTooLargeError → 413; 3000-row still 400.
MINOR : Auth endpoints return 200 (not 201).
MINOR : GET /notifications uses {items,total,page,pageSize} envelope.
MINOR : POST /documents/presign returns both `storageKey` and `key`.
"""
import os
import uuid
import requests
import pytest


BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/")
API = f"{BASE_URL}/api/v1"

ADMIN = {"email": "admin@credupe.local", "password": "Admin@12345"}
CUSTOMER = {"email": "customer@credupe.local", "password": "Customer@123"}
PARTNER = {"email": "partner@credupe.local", "password": "Partner@123"}


def _login(creds):
    r = requests.post(f"{API}/auth/login", json=creds, timeout=30)
    assert r.status_code == 200, f"login must be 200, got {r.status_code}: {r.text}"
    return r.json()["data"]


# ---------- HIGH-1: proxy content-encoding sanitation ----------
def test_proxy_strips_content_encoding_on_gzip_accept():
    """Client that sends Accept-Encoding: gzip must get parseable body and NO
    content-encoding header (since httpx decompresses upstream already)."""
    r = requests.get(f"{API}/loan-products", headers={"Accept-Encoding": "gzip"}, timeout=30)
    assert r.status_code == 200, r.text
    # content-encoding must NOT be present (or must be 'identity'); anything gzip/br/deflate is a bug
    ce = r.headers.get("content-encoding", "").lower()
    assert ce in ("", "identity"), f"Proxy leaking content-encoding={ce!r}"
    # Body must parse as JSON (raw requests, no manual override)
    body = r.json()
    assert body["success"] is True
    assert "items" in body["data"]


def test_proxy_raw_bytes_are_plain_json_when_gzip_accept():
    """Fetch raw bytes; verify they are not gzip-magic (1f 8b) when client requests gzip."""
    r = requests.get(
        f"{API}/loan-products",
        headers={"Accept-Encoding": "gzip"},
        timeout=30,
        stream=True,
    )
    raw = r.raw.read(4) if hasattr(r.raw, "read") else r.content[:4]
    # Plain JSON starts with '{' (0x7b); gzip starts with 0x1f 0x8b
    assert not (len(raw) >= 2 and raw[0] == 0x1F and raw[1] == 0x8B), \
        "Body returned as gzip while client is supposed to get identity"


# ---------- MINOR: auth endpoints return HTTP 200 ----------
def test_login_returns_200_not_201():
    r = requests.post(f"{API}/auth/login", json=CUSTOMER, timeout=30)
    assert r.status_code == 200, f"expected 200 got {r.status_code}"


def test_refresh_returns_200_not_201():
    tokens = _login(CUSTOMER)
    r = requests.post(f"{API}/auth/refresh",
                      json={"refreshToken": tokens["refreshToken"]}, timeout=30)
    assert r.status_code == 200, f"expected 200 got {r.status_code} {r.text}"


def test_otp_request_and_verify_return_200_not_201():
    mobile = f"+91{uuid.uuid4().int % 10_000_000_000:010d}"
    r = requests.post(f"{API}/auth/otp/request",
                      json={"destination": mobile, "purpose": "login"}, timeout=30)
    assert r.status_code == 200, f"otp request expected 200 got {r.status_code} {r.text}"
    otp = r.json()["data"]["devOtp"]
    r2 = requests.post(f"{API}/auth/otp/verify",
                       json={"destination": mobile, "code": otp, "purpose": "login"},
                       timeout=30)
    assert r2.status_code == 200, f"otp verify expected 200 got {r2.status_code} {r2.text}"


def test_logout_returns_200_not_201():
    tokens = _login(CUSTOMER)
    r = requests.post(
        f"{API}/auth/logout",
        json={"refreshToken": tokens["refreshToken"]},
        headers={"Authorization": f"Bearer {tokens['accessToken']}"},
        timeout=30,
    )
    assert r.status_code == 200, f"expected 200 got {r.status_code} {r.text}"


# ---------- MINOR: notifications paginated envelope ----------
def test_notifications_returns_paginated_envelope():
    tok = _login(CUSTOMER)["accessToken"]
    r = requests.get(f"{API}/notifications",
                     headers={"Authorization": f"Bearer {tok}"}, timeout=30)
    assert r.status_code == 200, r.text
    d = r.json()["data"]
    assert isinstance(d, dict), f"expected dict envelope got {type(d).__name__}"
    for key in ("items", "total", "page", "pageSize"):
        assert key in d, f"missing `{key}` in notifications envelope: {list(d.keys())}"
    assert isinstance(d["items"], list)
    assert isinstance(d["total"], int)


# ---------- MINOR: presign returns both storageKey and key ----------
def test_presign_returns_storage_key_and_key_aliases():
    tok = _login(CUSTOMER)["accessToken"]
    r = requests.post(
        f"{API}/documents/presign",
        json={"fileName": "TEST_alias.pdf", "mimeType": "application/pdf", "tag": "KYC"},
        headers={"Authorization": f"Bearer {tok}"},
        timeout=30,
    )
    assert r.status_code in (200, 201), f"expected 2xx got {r.status_code} {r.text}"
    d = r.json()["data"]
    assert "storageKey" in d, f"missing storageKey: {d.keys()}"
    assert "key" in d, f"missing key: {d.keys()}"
    assert d["storageKey"] == d["key"], "storageKey and key must be identical"
    assert d.get("uploadUrl"), "uploadUrl missing"


# ---------- HIGH-2: bulk leads cap still returns 400 ----------
def test_bulk_leads_3000_rows_returns_400_row_cap():
    """3000 rows is under 10mb but over the 2000-row cap → 400 (not 413, not 500)."""
    tok = _login(PARTNER)["accessToken"]
    rows = [
        {"customerName": f"TEST_Cap_{i}", "customerMobile": f"+9199{i:08d}",
         "loanType": "PERSONAL_LOAN", "amountRequested": 10000}
        for i in range(3000)
    ]
    r = requests.post(
        f"{API}/leads/bulk",
        json={"rows": rows},
        headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json"},
        timeout=60,
    )
    assert r.status_code == 400, f"expected 400 got {r.status_code} {r.text[:300]}"
    body = r.json()
    assert body["success"] is False
    msg_val = body.get("error", {}).get("message") or ""
    # message may be a string or a list of validation messages
    msg = " ".join(msg_val) if isinstance(msg_val, list) else str(msg_val)
    msg = msg.lower()
    assert "2000" in msg or "max" in msg, f"expected row-cap message, got: {msg!r}"


# ---------- HIGH-2: genuinely > 10mb body → 413 PAYLOAD_TOO_LARGE ----------
def test_oversized_body_returns_413_payload_too_large():
    """Build a payload > 10mb (body-parser JSON limit) and expect 413."""
    tok = _login(PARTNER)["accessToken"]
    # ~11mb of junk in a single field
    junk = "x" * (11 * 1024 * 1024)
    payload = {"rows": [{"customerName": junk, "customerMobile": "+919999999999",
                         "loanType": "PERSONAL_LOAN"}]}
    r = requests.post(
        f"{API}/leads/bulk",
        json=payload,
        headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json"},
        timeout=60,
    )
    assert r.status_code == 413, f"expected 413 got {r.status_code} {r.text[:300]}"
    body = r.json()
    assert body["success"] is False
    code = body.get("error", {}).get("code", "")
    assert code == "PAYLOAD_TOO_LARGE", f"expected code PAYLOAD_TOO_LARGE got {code!r}"
