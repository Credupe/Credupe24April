import type { SmsConfigMap } from "./sms-types";

export const SMS_CONFIG: SmsConfigMap = {
  DEFAULT: {
    providers: ["twilio"],
  },
  US: {
    providers: ["telnyx", "twilio"],
  },
  CA: {
    providers: ["telnyx", "twilio"],
  },
  IN: {
    providers: ["bird", "twilio"],
  },
  SG: {
    providers: ["bird", "plivo", "twilio"],
  },
  MY: {
    providers: ["bird", "plivo", "twilio"],
  },
  ID: {
    providers: ["bird", "plivo", "twilio"],
  },
  DE: {
    providers: ["plivo", "twilio"],
  },
  FR: {
    providers: ["plivo", "twilio"],
  },
};
