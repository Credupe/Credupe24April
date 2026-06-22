import { NextRequest, NextResponse } from "next/server";
import { forwardJson } from "../../../_lib/upstream";
import { setAuthCookies } from "../../../_lib/cookies";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { status, json } = await forwardJson<any>("POST", "/auth/otp/verify", { body });
  if (!json.success || !json.data) return NextResponse.json(json, { status });
  const res = NextResponse.json({
    success: true,
    data: { user: json.data.user, expiresIn: json.data.expiresIn },
    error: null,
  });
  setAuthCookies(res, json.data);
  return res;
}
