import type { AppEnv } from "../env";

export type SmsProviderName = "bird" | "plivo" | "telnyx" | "twilio" | "infobip";

export interface SmsResult {
  success: boolean;
  provider: SmsProviderName;
  messageId?: string;
  error?: string;
  cost?: number; // Optional/nullable, in paise or micro-units
}

export interface SmsProvider {
  name: SmsProviderName;
  sendOTP(phone: string, message: string, env: AppEnv["Bindings"]): Promise<SmsResult>;
}

export interface SmsConfig {
  providers: SmsProviderName[];
}

export type SmsConfigMap = Record<string, SmsConfig>;

export interface SendOtpRequest {
  phone: string;
  otp: string;
  purpose: string;
}
