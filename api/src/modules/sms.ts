import { sendRoutedSms } from "./sms-router";
import type { AppEnv } from "../env";
import type { SmsResult } from "./sms-types";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, desc } from "drizzle-orm";
import { otpCodes } from "../db/schema";
import { sha256 } from "../lib/ids";

/**
 * Sends a newly generated OTP using the SMS routing engine.
 */
export async function sendOTP(
  phone: string,
  otp: string,
  env: AppEnv["Bindings"],
  purpose = "login"
): Promise<SmsResult> {
  const message = `Your Credupe verification code is: ${otp}. Please do not share this code with anyone.`;
  return sendRoutedSms(phone, message, purpose, env);
}

/**
 * Resends an OTP using the SMS routing engine.
 */
export async function resendOTP(
  phone: string,
  otp: string,
  env: AppEnv["Bindings"],
  purpose = "login"
): Promise<SmsResult> {
  const message = `Your Credupe verification code is: ${otp}. Please do not share this code with anyone.`;
  return sendRoutedSms(phone, message, `resend_${purpose}`, env);
}

/**
 * Verifies an OTP code for a destination from the database.
 */
export async function verifyOTP(
  phone: string,
  code: string,
  env: AppEnv["Bindings"],
  purpose = "login"
): Promise<{ success: boolean; error?: string }> {
  const db = drizzle(env.DB);
  const hash = await sha256(code);
  const rows = await db
    .select()
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.destination, phone),
        eq(otpCodes.codeHash, hash),
        eq(otpCodes.purpose, purpose)
      )
    )
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);

  const otp = rows[0];
  if (!otp || otp.consumedAt || new Date(otp.expiresAt) < new Date()) {
    return { success: false, error: "OTP invalid or expired" };
  }

  // Update consumedAt
  await db
    .update(otpCodes)
    .set({ consumedAt: new Date().toISOString() })
    .where(eq(otpCodes.id, otp.id));

  return { success: true };
}
