/**
 * Cookie helpers for the Next.js BFF auth layer.
 *
 * We mint TWO httpOnly cookies on every successful auth event:
 *   - `credupe_access`  — short-lived bearer (NestJS `expiresIn` seconds, fallback 15 min)
 *   - `credupe_refresh` — long-lived rotator (~30 days)
 *
 * Reads happen via `cookies()` in Route Handlers; writes ride along on the
 * `NextResponse` we return (cookies().set() inside RH only works when the
 * response is the one we hand back).
 */
import type { NextResponse } from "next/server";

export const ACCESS_COOKIE = "credupe_access";
export const REFRESH_COOKIE = "credupe_refresh";

const REFRESH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const DEFAULT_ACCESS_MAX_AGE = 60 * 15;    // 15 minutes
const isProd = process.env.NODE_ENV === "production";

export function setAuthCookies(
  res: NextResponse,
  tokens: { accessToken: string; refreshToken?: string; expiresIn?: number },
) {
  const accessMaxAge = Number.isFinite(tokens.expiresIn) && (tokens.expiresIn as number) > 0
    ? Math.floor(tokens.expiresIn as number)
    : DEFAULT_ACCESS_MAX_AGE;

  res.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: accessMaxAge,
  });
  if (tokens.refreshToken) {
    res.cookies.set(REFRESH_COOKIE, tokens.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_MAX_AGE,
    });
  }
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set(ACCESS_COOKIE, "", { httpOnly: true, secure: isProd, sameSite: "lax", path: "/", maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { httpOnly: true, secure: isProd, sameSite: "lax", path: "/", maxAge: 0 });
}
