import { Hono } from "hono";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, like, desc } from "drizzle-orm";
import { sign, verify } from "hono/jwt";
import type { AppEnv } from "../env";
import { users, partnerProfiles, otpCodes, documents, refreshTokens } from "../db/schema";
import { ok, fail } from "../lib/envelope";
import { hashPassword } from "../lib/password";
import { signJwt } from "../lib/jwt";
import { newId, sha256 } from "../lib/ids";
import { sendOTP } from "./sms";

const route = new Hono<AppEnv>();
const ONBOARDING_AUDIENCE = "partner-onboarding";
const TOKEN_TTL_SEC = 1800;

interface OnboardingTokenPayload {
  email: string;
  mobile: string;
  contactPerson: string;
  mobileVerified: boolean;
  emailVerified: boolean;
  aud: string;
  exp: number;
  [key: string]: any;
}

// Helper to sign onboarding JWT
async function signOnboardingToken(
  secret: string,
  payload: Omit<OnboardingTokenPayload, "aud" | "exp">
): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SEC;
  const tokenPayload: OnboardingTokenPayload = {
    email: payload.email,
    mobile: payload.mobile,
    contactPerson: payload.contactPerson,
    mobileVerified: payload.mobileVerified,
    emailVerified: payload.emailVerified,
    aud: ONBOARDING_AUDIENCE,
    exp,
  };
  return await sign(tokenPayload, secret, "HS256");
}

// Helper to verify onboarding JWT
async function verifyOnboardingToken(
  secret: string,
  token: string
): Promise<OnboardingTokenPayload> {
  try {
    const claims = (await verify(token, secret, "HS256")) as unknown as OnboardingTokenPayload;
    if (claims.aud !== ONBOARDING_AUDIENCE) {
      throw new Error("Invalid audience");
    }
    return claims;
  } catch (err: any) {
    console.error("[onboarding-jwt-error]", err);
    throw new Error(`Onboarding session expired or invalid — please start again. Details: ${err?.message || err}`);
  }
}

// Helper to send email via Resend
async function sendEmail(
  apiKey: string,
  to: string,
  subject: string,
  html: string,
  from?: string
): Promise<{ id?: string; error?: string }> {
  const fromAddress = from ?? "Credupe <onboarding@resend.dev>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        subject,
        html,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok) {
      return { error: data.message ?? `Resend error ${res.status}` };
    }
    return { id: data.id };
  } catch (err: any) {
    return { error: err?.message ?? String(err) };
  }
}

// Generate monotonically increasing Partner Code (CRD-PAxxxxx)
async function generatePartnerCode(db: any): Promise<string> {
  const rows = await db
    .select({ partnerCode: partnerProfiles.partnerCode })
    .from(partnerProfiles)
    .where(like(partnerProfiles.partnerCode, "CRD-PA%"))
    .orderBy(desc(partnerProfiles.partnerCode))
    .limit(1);

  let nextVal = 1;
  if (rows.length && rows[0].partnerCode) {
    const tail = parseInt(rows[0].partnerCode.replace("CRD-PA", ""), 10);
    if (!isNaN(tail)) {
      nextVal = tail + 1;
    }
  }

  // Double check uniqueness (5 attempts)
  for (let i = 0; i < 5; i++) {
    const candidate = `CRD-PA${String(nextVal + i).padStart(5, "0")}`;
    const check = await db
      .select({ id: partnerProfiles.id })
      .from(partnerProfiles)
      .where(eq(partnerProfiles.partnerCode, candidate))
      .limit(1);
    if (!check.length) {
      return candidate;
    }
  }

  // Random fallback
  return `CRD-PA${String(Math.floor(10000 + Math.random() * 90000))}`;
}

// ─── Step 1: Start ──────────────────────────────────────────────────────────
route.post("/start", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = z
    .object({
      email: z.string().email(),
      mobile: z.string().min(10),
      contactPerson: z.string().min(2),
    })
    .safeParse(body);

  if (!parsed.success) {
    return fail(c, 400, "VALIDATION_ERROR", parsed.error.issues.map((i) => i.message));
  }

  const { email, mobile, contactPerson } = parsed.data;
  const db = drizzle(c.env.DB);

  // Check email conflict
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);
  if (existingUser.length && existingUser[0].role === "PARTNER") {
    return fail(
      c,
      409,
      "UNIQUE_VIOLATION",
      "A partner account with this email already exists. Please log in instead."
    );
  }

  // Check mobile conflict
  const existingMobile = await db
    .select()
    .from(users)
    .where(eq(users.mobile, mobile.trim()))
    .limit(1);
  if (existingMobile.length && existingMobile[0].role === "PARTNER") {
    return fail(
      c,
      409,
      "UNIQUE_VIOLATION",
      "A partner account with this mobile already exists. Please log in instead."
    );
  }

  const token = await signOnboardingToken(c.env.JWT_ACCESS_SECRET, {
    email: email.toLowerCase().trim(),
    mobile: mobile.trim(),
    contactPerson: contactPerson.trim(),
    mobileVerified: false,
    emailVerified: false,
  });

  return ok(c, { onboardingToken: token, expiresInSec: TOKEN_TTL_SEC });
});

// ─── Step 2: Request OTP ───────────────────────────────────────────────────
route.post("/otp/request", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = z
    .object({
      onboardingToken: z.string(),
      channel: z.enum(["mobile", "email"]),
      destination: z.string(),
    })
    .safeParse(body);

  if (!parsed.success) {
    return fail(c, 400, "VALIDATION_ERROR", parsed.error.issues.map((i) => i.message));
  }

  const { onboardingToken, channel, destination } = parsed.data;
  let session;
  try {
    session = await verifyOnboardingToken(c.env.JWT_ACCESS_SECRET, onboardingToken);
  } catch (err: any) {
    return fail(c, 401, "EXPIRED_SESSION", err.message);
  }

  // Verify destination matches session info
  if (channel === "mobile" && destination.trim() !== session.mobile) {
    return fail(c, 400, "VALIDATION_ERROR", "Mobile number mismatch with onboarding session");
  }
  if (channel === "email" && destination.toLowerCase().trim() !== session.email) {
    return fail(c, 400, "VALIDATION_ERROR", "Email mismatch with onboarding session");
  }

  // Generate 6-digit OTP
  const code = channel === "email" ? String(Math.floor(100000 + Math.random() * 900000)) : "123456";
  const codeHash = await sha256(code);

  const db = drizzle(c.env.DB);
  await db.insert(otpCodes).values({
    id: newId("otp"),
    channel,
    destination: destination.toLowerCase().trim(),
    codeHash,
    purpose: "partner-onboarding",
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    attempts: 0,
  });

  const isDev = c.env.ENV !== "production";

  console.log("[partner-otp] channel:", channel, "destination:", destination);
  console.log("[partner-otp] RESEND_API_KEY exists:", !!c.env.RESEND_API_KEY, "val length:", c.env.RESEND_API_KEY?.length);
  console.log("[partner-otp] RESEND_FROM_EMAIL:", c.env.RESEND_FROM_EMAIL);

  if (channel === "mobile") {
    const res = await sendOTP(destination, code, c.env, "partner-onboarding");
    if (!res.success && c.env.ENV === "production") {
      return fail(c, 500, "SMS_SEND_FAILED", res.error || "Failed to send SMS OTP");
    }
  } else if (channel === "email" && c.env.RESEND_API_KEY) {
    const subject = "Verify your email - Credupe Partner Program";
    const html = `<!DOCTYPE html><html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>Dear Partner,</p>
      <p>Thank you for initiating your onboarding with Credupe.</p>
      <p>Your email verification code is: <strong style="font-size: 20px; color: #4C5CD3; letter-spacing: 2px;">${code}</strong></p>
      <p>This code will remain valid for the next 5 minutes. If you did not request this, you can safely ignore this email.</p>
      <br/>
      <p>Best regards,<br/>Credupe Support Team</p>
      </body></html>`;

    const result = await sendEmail(c.env.RESEND_API_KEY, destination, subject, html, c.env.RESEND_FROM_EMAIL);
    if (result.error) {
      console.error("[partner-otp] Failed to send email via Resend:", result.error);
    }
  }

  return ok(c, {
    channel,
    destination,
    expiresInSec: 300,
    ...(isDev ? { devOtp: code } : {}),
  });
});

// ─── Step 3: Verify OTP ────────────────────────────────────────────────────
route.post("/otp/verify", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = z
    .object({
      onboardingToken: z.string(),
      channel: z.enum(["mobile", "email"]),
      destination: z.string(),
      code: z.string(),
    })
    .safeParse(body);

  if (!parsed.success) {
    return fail(c, 400, "VALIDATION_ERROR", parsed.error.issues.map((i) => i.message));
  }

  const { onboardingToken, channel, destination, code } = parsed.data;
  let session;
  try {
    session = await verifyOnboardingToken(c.env.JWT_ACCESS_SECRET, onboardingToken);
  } catch (err: any) {
    return fail(c, 401, "EXPIRED_SESSION", err.message);
  }

  const db = drizzle(c.env.DB);
  const rows = await db
    .select()
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.channel, channel),
        eq(otpCodes.destination, destination.toLowerCase().trim()),
        eq(otpCodes.purpose, "partner-onboarding")
      )
    )
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);

  const otp = rows[0];
  if (!otp || otp.consumedAt || new Date(otp.expiresAt) < new Date()) {
    return fail(c, 401, "INVALID_OTP", "OTP code invalid or expired");
  }

  if (otp.attempts >= 5) {
    return fail(c, 401, "INVALID_OTP", "Too many attempts");
  }

  const targetHash = await sha256(code);
  const okCode = otp.codeHash === targetHash;

  await db
    .update(otpCodes)
    .set({
      attempts: otp.attempts + 1,
      consumedAt: okCode ? new Date().toISOString() : null,
    })
    .where(eq(otpCodes.id, otp.id));

  if (!okCode) {
    return fail(c, 401, "INVALID_OTP", "Incorrect OTP code");
  }

  const updatedToken = await signOnboardingToken(c.env.JWT_ACCESS_SECRET, {
    email: session.email,
    mobile: session.mobile,
    contactPerson: session.contactPerson,
    mobileVerified: channel === "mobile" ? true : session.mobileVerified,
    emailVerified: channel === "email" ? true : session.emailVerified,
  });

  const mobileVerified = channel === "mobile" ? true : session.mobileVerified;
  const emailVerified = channel === "email" ? true : session.emailVerified;

  return ok(c, {
    onboardingToken: updatedToken,
    mobileVerified,
    emailVerified,
    bothVerified: mobileVerified && emailVerified,
  });
});

// ─── Step 4: Finalize ──────────────────────────────────────────────────────
route.post("/finalize", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = z
    .object({
      onboardingToken: z.string(),
      businessName: z.string().min(2),
      gstNumber: z.string().optional(),
      panNumber: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
      address: z.string().optional(),
      password: z.string().min(6).optional(),
      bankName: z.string().optional(),
      accountHolder: z.string().optional(),
      accountNumber: z.string().optional(),
      ifsc: z.string().optional(),
      kycDocuments: z
        .array(
          z.object({
            tag: z.string(),
            fileName: z.string(),
            mimeType: z.string().optional(),
            sizeBytes: z.number().optional(),
            documentId: z.string().optional(),
            storageKey: z.string().optional(),
          })
        )
        .optional(),
    })
    .safeParse(body);

  if (!parsed.success) {
    return fail(c, 400, "VALIDATION_ERROR", parsed.error.issues.map((i) => i.message));
  }

  const dto = parsed.data;
  let session;
  try {
    session = await verifyOnboardingToken(c.env.JWT_ACCESS_SECRET, dto.onboardingToken);
  } catch (err: any) {
    return fail(c, 401, "EXPIRED_SESSION", err.message);
  }

  // Ensure both verified
  if (!session.mobileVerified || !session.emailVerified) {
    return fail(c, 400, "VALIDATION_ERROR", "Both email and mobile must be verified before finalizing");
  }

  const db = drizzle(c.env.DB);

  // Check email check duplicate in users
  const dup = await db.select().from(users).where(eq(users.email, session.email)).limit(1);
  if (dup.length) {
    return fail(c, 409, "UNIQUE_VIOLATION", "Email already registered");
  }

  // Generate unique passwords
  const password = dto.password || Math.random().toString(36).substring(2, 10);
  const passwordHash = await hashPassword(password, Number(c.env.BCRYPT_SALT_ROUNDS || 10));

  const partnerCode = await generatePartnerCode(db);
  const panLast4 = dto.panNumber ? dto.panNumber.slice(-4) : null;

  const bankAccount =
    dto.bankName || dto.accountNumber
      ? {
        accountHolder: dto.accountHolder || dto.businessName,
        accountNumber: dto.accountNumber,
        ifsc: dto.ifsc,
        bankName: dto.bankName,
      }
      : null;

  const hasKycDocs = !!(dto.kycDocuments && dto.kycDocuments.length);
  const hasBank = !!bankAccount;
  const onboardingStep =
    hasKycDocs && hasBank ? "COMPLETE" : hasKycDocs ? "BANK_DETAILS" : "BUSINESS_DETAILS";

  const userId = newId("u");
  const partnerProfileId = newId("pp");

  // Transaction insertion
  await db.insert(users).values({
    id: userId,
    email: session.email,
    mobile: session.mobile,
    passwordHash,
    role: "PARTNER",
    isActive: true,
    lastLoginAt: new Date().toISOString(),
  });

  await db.insert(partnerProfiles).values({
    id: partnerProfileId,
    userId,
    partnerCode,
    businessName: dto.businessName,
    contactPerson: session.contactPerson,
    email: session.email,
    mobile: session.mobile,
    city: dto.city ?? null,
    state: dto.state ?? null,
    pincode: dto.pincode ?? null,
    address: dto.address ?? null,
    gstNumber: dto.gstNumber ?? null,
    panNumber: dto.panNumber ?? null,
    panLast4,
    bankAccount: bankAccount ? JSON.stringify(bankAccount) : null,
    tier: "BRONZE",
    onboardingStep,
    kycStatus: "PENDING",
    mobileVerifiedAt: new Date().toISOString(),
    emailVerifiedAt: new Date().toISOString(),
    agreementSignedAt: new Date().toISOString(),
    activatedAt: onboardingStep === "COMPLETE" ? new Date().toISOString() : null,
  });

  // Write KYC document records
  if (dto.kycDocuments && dto.kycDocuments.length) {
    for (const doc of dto.kycDocuments) {
      const id = doc.documentId || newId("doc");
      const safeName = doc.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storageKey = doc.storageKey || `kyc/${userId}/${Date.now()}-${doc.tag}-${safeName}`;
      await db.insert(documents).values({
        id,
        ownerUserId: userId,
        tag: "KYC",
        fileName: doc.fileName,
        mimeType: doc.mimeType ?? null,
        sizeBytes: doc.sizeBytes ?? null,
        storageKey,
        status: "UPLOADED",
        createdBy: userId,
        updatedBy: userId,
      });
    }
  }

  // Issue token credentials
  const accessTtl = Number(c.env.JWT_ACCESS_TTL || 900);
  const refreshTtl = Number(c.env.JWT_REFRESH_TTL || 2592000);
  const accessToken = await signJwt({ sub: userId, email: session.email, role: "PARTNER", typ: "access" }, c.env.JWT_ACCESS_SECRET, accessTtl);
  const refreshToken = await signJwt({ sub: userId, email: session.email, role: "PARTNER", typ: "refresh" }, c.env.JWT_REFRESH_SECRET, refreshTtl);

  await db.insert(refreshTokens).values({
    id: newId("rt"),
    userId,
    tokenHash: await sha256(refreshToken),
    expiresAt: new Date(Date.now() + refreshTtl * 1000).toISOString(),
  });

  return ok(c, {
    accessToken,
    refreshToken,
    expiresIn: accessTtl,
    user: { id: userId, email: session.email, role: "PARTNER" },
    partner: {
      id: partnerProfileId,
      partnerCode,
      businessName: dto.businessName,
      onboardingStep,
      tier: "BRONZE",
    },
    ...(dto.password ? {} : { generatedPassword: password }),
  });
});

route.post("/presign-kyc", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = z
    .object({
      onboardingToken: z.string(),
      tag: z.string(),
      fileName: z.string(),
      mimeType: z.string().optional(),
      sizeBytes: z.number().optional(),
    })
    .safeParse(body);

  if (!parsed.success) {
    return fail(c, 400, "VALIDATION_ERROR", parsed.error.issues.map((i) => i.message));
  }

  const { onboardingToken, tag, fileName, mimeType } = parsed.data;
  let session;
  try {
    session = await verifyOnboardingToken(c.env.JWT_ACCESS_SECRET, onboardingToken);
  } catch (err: any) {
    return fail(c, 401, "EXPIRED_SESSION", err.message);
  }

  const docId = newId("doc");
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storageKey = `kyc-temp/${session.email}/${docId}/${safeName}`;

  return ok(c, {
    uploadUrl: `/api/v1/partner-onboarding/upload-kyc/${docId}?key=${encodeURIComponent(storageKey)}`,
    method: "PUT",
    headers: { "content-type": mimeType ?? "application/octet-stream" },
    storageKey,
    docId,
  });
});

route.put("/upload-kyc/:id", async (c) => {
  const id = c.req.param("id");
  const key = c.req.query("key");
  if (!key) {
    return fail(c, 400, "VALIDATION_ERROR", "key query parameter required");
  }

  if (c.env.DOCS) {
    const body = await c.req.arrayBuffer();
    await c.env.DOCS.put(key, body);
  }
  return ok(c, { uploaded: true, docId: id });
});

export default route;
