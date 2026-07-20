import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Normalizes a phone number to E.164 format.
 * If invalid or parsing fails, returns the original trimmed string.
 */
export function normalizePhone(phone: string): string {
  let cleaned = phone.trim().replace(/[-\s()]/g, "");
  if (!cleaned.startsWith("+")) {
    if (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) {
      cleaned = `+91${cleaned}`;
    } else {
      cleaned = `+${cleaned}`;
    }
  }
  const parsed = parsePhoneNumberFromString(cleaned);
  if (parsed && parsed.isValid()) {
    return parsed.format("E.164");
  }
  return cleaned;
}

/**
 * Detects the 2-letter ISO country code from a phone number.
 * Returns "DEFAULT" if parsing fails or country is unknown.
 */
export function detectCountry(phone: string): string {
  let cleaned = phone.trim().replace(/[-\s()]/g, "");
  if (!cleaned.startsWith("+")) {
    if (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) {
      cleaned = `+91${cleaned}`;
    } else {
      cleaned = `+${cleaned}`;
    }
  }
  const parsed = parsePhoneNumberFromString(cleaned);
  if (parsed && parsed.country) {
    return parsed.country.toUpperCase();
  }
  return "DEFAULT";
}

/**
 * Utility to retry an operation with standard error logging and/or basic delay.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 500
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt > retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, attempt - 1)));
    }
  }
}
export default {
  normalizePhone,
  detectCountry,
  retryWithBackoff,
};
