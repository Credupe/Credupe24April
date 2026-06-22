import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { refreshUpstream } from "../../_lib/upstream";
import { REFRESH_COOKIE, clearAuthCookies, setAuthCookies } from "../../_lib/cookies";

export async function POST(_req: NextRequest) {
  const jar = await cookies();
  const refresh = jar.get(REFRESH_COOKIE)?.value;
  if (!refresh) {
    const res = NextResponse.json(
      { success: false, data: null, error: { status: 401, message: ["Missing refresh token"] } },
      { status: 401 },
    );
    clearAuthCookies(res);
    return res;
  }
  const rotated = await refreshUpstream(refresh);
  if (!rotated) {
    const res = NextResponse.json(
      { success: false, data: null, error: { status: 401, message: ["Refresh rejected"] } },
      { status: 401 },
    );
    clearAuthCookies(res);
    return res;
  }
  const res = NextResponse.json({ success: true, data: { rotated: true }, error: null });
  setAuthCookies(res, rotated);
  return res;
}
