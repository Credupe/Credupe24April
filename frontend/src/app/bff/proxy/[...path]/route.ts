/**
 * Generic NestJS proxy.
 *
 * Browser hits `/api/proxy/<anything>` with `credentials: "include"`. We attach
 * the httpOnly access cookie as a Bearer token, forward to NestJS, and on 401
 * try a one-time refresh + retry — silently rotating the cookies on the way
 * back so the SPA never sees a token.
 */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { nestUrl, refreshUpstream } from "../../_lib/upstream";
import { ACCESS_COOKIE, REFRESH_COOKIE, clearAuthCookies, setAuthCookies } from "../../_lib/cookies";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function handle(method: Method, req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  const { path: parts = [] } = await ctx.params;
  const search = req.nextUrl.search || "";
  const upstreamPath = `/${parts.join("/")}${search}`;

  const bodyText = method === "GET" || method === "DELETE" ? undefined : await req.text();

  const jar = await cookies();
  let access = jar.get(ACCESS_COOKIE)?.value;
  const refresh = jar.get(REFRESH_COOKIE)?.value;

  const doFetch = async (token?: string) => {
    const headers: Record<string, string> = {};
    const ct = req.headers.get("content-type");
    if (ct) headers["Content-Type"] = ct;
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(nestUrl(upstreamPath), {
      method,
      headers,
      body: bodyText && bodyText.length ? bodyText : undefined,
      cache: "no-store",
    });
  };

  let upstream = await doFetch(access);
  let rotated: { accessToken: string; refreshToken: string; expiresIn: number } | null = null;

  if (upstream.status === 401 && refresh) {
    rotated = await refreshUpstream(refresh);
    if (rotated) {
      access = rotated.accessToken;
      upstream = await doFetch(access);
    }
  }

  // Stream body through. We use text() so we can attach cookies; payloads are
  // JSON envelopes from NestJS so this is fine.
  const text = await upstream.text();
  const headers = new Headers();
  const ct = upstream.headers.get("content-type");
  if (ct) headers.set("content-type", ct);
  const res = new NextResponse(text, { status: upstream.status, headers });

  if (rotated) setAuthCookies(res, rotated);
  // If still unauthenticated, surface the situation by clearing stale cookies.
  if (upstream.status === 401 && !rotated && (access || refresh)) clearAuthCookies(res);
  return res;
}

export const GET = (req: NextRequest, ctx: any) => handle("GET", req, ctx);
export const POST = (req: NextRequest, ctx: any) => handle("POST", req, ctx);
export const PUT = (req: NextRequest, ctx: any) => handle("PUT", req, ctx);
export const PATCH = (req: NextRequest, ctx: any) => handle("PATCH", req, ctx);
export const DELETE = (req: NextRequest, ctx: any) => handle("DELETE", req, ctx);
