import type { SmsProvider, SmsResult } from "./sms-types";
import type { AppEnv } from "../env";

// --- Bird ---
export const birdProvider: SmsProvider = {
  name: "bird",
  async sendOTP(phone: string, message: string, env: AppEnv["Bindings"]): Promise<SmsResult> {
    if (!env.BIRD_API_KEY) {
      return { success: false, provider: "bird", error: "BIRD_API_KEY is not configured" };
    }
    try {
      if (env.BIRD_API_KEY.startsWith("bk_")) {
        const parts = env.BIRD_API_KEY.split("_");
        const region = parts[1] || "us1";
        const url = `https://${region}.platform.bird.com/v1/sms/messages`;

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.BIRD_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: phone,
            text: message,
            category: "authentication",
          }),
        });

        const data = await res.json() as any;
        if (res.ok && (data.id || data.messageId)) {
          return { success: true, provider: "bird", messageId: data.id || data.messageId };
        } else {
          const errorMsg = data.error?.message || data.errors?.[0]?.message || data.errors?.[0]?.description || `HTTP Error ${res.status} ${res.statusText}`;
          return { success: false, provider: "bird", error: errorMsg };
        }
      } else {
        const bodyParams = new URLSearchParams();
        bodyParams.append("recipients", phone);
        bodyParams.append("originator", "Credupe");
        bodyParams.append("body", message);

        const res = await fetch("https://rest.messagebird.com/messages", {
          method: "POST",
          headers: {
            "Authorization": `AccessKey ${env.BIRD_API_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: bodyParams.toString(),
        });

        const data = await res.json() as any;
        if (res.ok && data.id) {
          return { success: true, provider: "bird", messageId: data.id };
        } else {
          return {
            success: false,
            provider: "bird",
            error: data.errors?.[0]?.description || `HTTP Error ${res.status} ${res.statusText}`,
          };
        }
      }
    } catch (err) {
      return { success: false, provider: "bird", error: err instanceof Error ? err.message : String(err) };
    }
  },
};

// --- Plivo ---
export const plivoProvider: SmsProvider = {
  name: "plivo",
  async sendOTP(phone: string, message: string, env: AppEnv["Bindings"]): Promise<SmsResult> {
    if (!env.PLIVO_AUTH_ID || !env.PLIVO_AUTH_TOKEN) {
      return { success: false, provider: "plivo", error: "Plivo credentials are not configured" };
    }
    try {
      const auth = btoa(`${env.PLIVO_AUTH_ID}:${env.PLIVO_AUTH_TOKEN}`);
      const res = await fetch(`https://api.plivo.com/v1/Account/${env.PLIVO_AUTH_ID}/Message/`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          src: "Credupe",
          dst: phone,
          text: message,
        }),
      });

      const data = await res.json() as any;
      if (res.ok && data.message_uuid) {
        const messageId = Array.isArray(data.message_uuid) ? data.message_uuid[0] : data.message_uuid;
        return { success: true, provider: "plivo", messageId };
      } else {
        return {
          success: false,
          provider: "plivo",
          error: data.error || `HTTP Error ${res.status} ${res.statusText}`,
        };
      }
    } catch (err) {
      return { success: false, provider: "plivo", error: err instanceof Error ? err.message : String(err) };
    }
  },
};

// --- Telnyx ---
export const telnyxProvider: SmsProvider = {
  name: "telnyx",
  async sendOTP(phone: string, message: string, env: AppEnv["Bindings"]): Promise<SmsResult> {
    if (!env.TELNYX_API_KEY) {
      return { success: false, provider: "telnyx", error: "TELNYX_API_KEY is not configured" };
    }
    try {
      const fromNumber = env.TELNYX_SENDER || "Credupe";
      const res = await fetch("https://api.telnyx.com/v2/messages", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.TELNYX_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromNumber,
          to: phone,
          text: message,
        }),
      });

      const data = await res.json() as any;
      if (res.ok && data.data?.id) {
        return { success: true, provider: "telnyx", messageId: data.data.id };
      } else {
        return {
          success: false,
          provider: "telnyx",
          error: data.errors?.[0]?.detail || `HTTP Error ${res.status} ${res.statusText}`,
        };
      }
    } catch (err) {
      return { success: false, provider: "telnyx", error: err instanceof Error ? err.message : String(err) };
    }
  },
};

// --- Twilio ---
export const twilioProvider: SmsProvider = {
  name: "twilio",
  async sendOTP(phone: string, message: string, env: AppEnv["Bindings"]): Promise<SmsResult> {
    if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN) {
      return { success: false, provider: "twilio", error: "Twilio credentials are not configured" };
    }
    try {
      const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
      const fromNumber = env.TWILIO_SENDER || "Credupe";
      const bodyParams = new URLSearchParams();
      bodyParams.append("To", phone);
      bodyParams.append("From", fromNumber);
      bodyParams.append("Body", message);

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: bodyParams.toString(),
      });

      const data = await res.json() as any;
      if (res.ok && data.sid) {
        return { success: true, provider: "twilio", messageId: data.sid };
      } else {
        return {
          success: false,
          provider: "twilio",
          error: data.message || `HTTP Error ${res.status} ${res.statusText}`,
        };
      }
    } catch (err) {
      return { success: false, provider: "twilio", error: err instanceof Error ? err.message : String(err) };
    }
  },
};

// --- Infobip (placeholder) ---
export const infobipProvider: SmsProvider = {
  name: "infobip",
  async sendOTP(phone: string, message: string, env: AppEnv["Bindings"]): Promise<SmsResult> {
    console.log(`[Infobip Placeholder] OTP request received. Phone: ${phone}, Message: ${message}`);
    return {
      success: true,
      provider: "infobip",
      messageId: `infobip_mock_${Date.now()}`,
    };
  },
};

export const PROVIDERS_MAP: Record<string, SmsProvider> = {
  bird: birdProvider,
  plivo: plivoProvider,
  telnyx: telnyxProvider,
  twilio: twilioProvider,
  infobip: infobipProvider,
};
