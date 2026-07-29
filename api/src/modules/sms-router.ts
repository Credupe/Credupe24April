import type { AppEnv } from "../env";
import type { SmsResult } from "./sms-types";
import { SMS_CONFIG } from "./sms-config";
import { PROVIDERS_MAP } from "./sms-providers";
import { detectCountry, normalizePhone, retryWithBackoff } from "./sms-utils";
import { drizzle } from "drizzle-orm/d1";
import { smsLogs } from "../db/schema";
import { newId } from "../lib/ids";

/**
 * Normalizes phone number, detects country, determines provider priority list,
 * attempts delivery sequentially with retries/failover, and logs every attempt.
 */
export async function sendRoutedSms(
  rawPhone: string,
  message: string,
  purpose: string,
  env: AppEnv["Bindings"]
): Promise<SmsResult> {
  const phone = normalizePhone(rawPhone);
  const country = detectCountry(phone);

  const config = SMS_CONFIG[country] || SMS_CONFIG.DEFAULT;
  const providersToTry = config.providers;

  if (!providersToTry || providersToTry.length === 0) {
    return {
      success: false,
      provider: "twilio",
      error: `No providers configured for country ${country}`,
    };
  }

  const db = drizzle(env.DB);
  const attempts: string[] = [];

  for (const providerName of providersToTry) {
    const provider = PROVIDERS_MAP[providerName];
    if (!provider) {
      console.warn(`[sms-router] Provider ${providerName} is configured but not implemented.`);
      continue;
    }

    const startTime = Date.now();
    let result: SmsResult;

    try {
      result = await retryWithBackoff(
        () => provider.sendOTP(phone, message, env),
        2, // Try up to 2 times to failover quickly if a provider is completely down
        500
      );
    } catch (err) {
      result = {
        success: false,
        provider: providerName,
        error: err instanceof Error ? err.message : String(err),
      };
    }

    const responseTime = Date.now() - startTime;

    try {
      await db.insert(smsLogs).values({
        id: newId("smsl"),
        phone,
        country,
        provider: providerName,
        status: result.success ? "SUCCESS" : "FAILED",
        purpose,
        messageId: result.messageId ?? null,
        error: result.error ?? null,
        responseTime,
        cost: result.cost ?? null,
      });
    } catch (logErr) {
      console.error(`[sms-router] Failed to write SMS log to database:`, logErr);
    }

    if (result.success) {
      return result;
    } else {
      attempts.push(`${providerName}: ${result.error || "Unknown error"}`);
    }
  }

  return {
    success: false,
    provider: providersToTry[0],
    error: `All routing attempts failed: ${attempts.join(" | ")}`,
  };
}
