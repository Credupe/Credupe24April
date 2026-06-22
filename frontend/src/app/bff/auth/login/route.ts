import { NextRequest, NextResponse } from "next/server";
import { forwardJson } from "../../_lib/upstream";
import { setAuthCookies } from "../../_lib/cookies";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: { id: string; email: string; role: string };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { status, json } = await forwardJson<AuthTokens>("POST", "/auth/login", { body });
  if (!json.success || !json.data) {
    return NextResponse.json(json, { status });
  }
  // Only the user payload is exposed to the browser; tokens stay in cookies.
  const res = NextResponse.json({
    success: true,
    data: { user: json.data.user, expiresIn: json.data.expiresIn },
    error: null,
  });
  setAuthCookies(res, json.data);
  return res;
}
