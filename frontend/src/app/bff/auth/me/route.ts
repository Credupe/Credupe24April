import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { forwardJson, refreshUpstream } from "../../_lib/upstream";
import { ACCESS_COOKIE, REFRESH_COOKIE, clearAuthCookies, setAuthCookies } from "../../_lib/cookies";

export async function GET(_req: NextRequest) {
  const jar = await cookies();
  let access = jar.get(ACCESS_COOKIE)?.value;
  const refresh = jar.get(REFRESH_COOKIE)?.value;

  if (!access && !refresh) {
    return NextResponse.json(
      { success: false, data: null, error: { status: 401, message: ["Not authenticated"] } },
      { status: 401 },
    );
  }

  let rotated: { accessToken: string; refreshToken: string; expiresIn: number } | null = null;

  // If access is missing or rejected, rotate via refresh exactly once.
  let { status, json } = access
    ? await forwardJson("GET", "/auth/me", { bearer: access })
    : { status: 401 as number, json: { success: false, data: null, error: { message: ["No access"] } } as any };

  if (status === 401 && refresh) {
    rotated = await refreshUpstream(refresh);
    if (rotated) {
      access = rotated.accessToken;
      ({ status, json } = await forwardJson("GET", "/auth/me", { bearer: access }));
    }
  }

  if (!json.success) {
    const res = NextResponse.json(json, { status });
    if (status === 401) clearAuthCookies(res);
    return res;
  }

  const res = NextResponse.json(json);
  if (rotated) setAuthCookies(res, rotated);
  return res;
}
