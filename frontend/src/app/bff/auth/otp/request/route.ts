import { NextRequest, NextResponse } from "next/server";
import { forwardJson } from "../../../_lib/upstream";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { status, json } = await forwardJson("POST", "/auth/otp/request", { body });
  return NextResponse.json(json, { status });
}
