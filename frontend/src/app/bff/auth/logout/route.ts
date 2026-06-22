import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { forwardJson } from "../../_lib/upstream";
import { clearAuthCookies, REFRESH_COOKIE } from "../../_lib/cookies";

export async function POST(_req: NextRequest) {
  const jar = await cookies();
  const refreshToken = jar.get(REFRESH_COOKIE)?.value;
  // Best-effort upstream revoke; never block the client logout on it.
  if (refreshToken) {
    try { await forwardJson("POST", "/auth/logout", { body: { refreshToken } }); }
    catch (err) {
      // We still clear cookies below — upstream may already have revoked the
      // token, or the auth service may be momentarily unreachable. Surface it
      // in dev so we notice systemic regressions.
      if (process.env.NODE_ENV !== "production") {
        console.warn("[bff/logout] upstream revoke failed:", err);
      }
    }
  }
  const res = NextResponse.json({ success: true, data: { ok: true }, error: null });
  clearAuthCookies(res);
  return res;
}
