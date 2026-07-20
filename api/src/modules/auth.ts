import { Hono } from "hono";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, desc } from "drizzle-orm";
import type { AppEnv } from "../env";
import { users, refreshTokens, customerProfiles, partnerProfiles, otpCodes } from "../db/schema";
import { ok, fail } from "../lib/envelope";
import { hashPassword, verifyPassword } from "../lib/password";
import { signJwt, verifyJwt } from "../lib/jwt";
import { newId, sha256 } from "../lib/ids";
import { sendOTP, verifyOTP } from "./sms";

const route = new Hono<AppEnv>();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  mobile: z.string().optional(),
  role: z.enum(["CUSTOMER", "PARTNER"]).default("CUSTOMER"),
  businessName: z.string().optional(),
});

async function issueTokens(c: any, u: { id: string; email: string; role: any }) {
  const accessTtl = Number(c.env.JWT_ACCESS_TTL || 900);
  const refreshTtl = Number(c.env.JWT_REFRESH_TTL || 2592000);
  const accessToken = await signJwt({ sub: u.id, email: u.email, role: u.role, typ: "access" }, c.env.JWT_ACCESS_SECRET, accessTtl);
  const refreshToken = await signJwt({ sub: u.id, email: u.email, role: u.role, typ: "refresh" }, c.env.JWT_REFRESH_SECRET, refreshTtl);
  const db = drizzle(c.env.DB);
  await db.insert(refreshTokens).values({
    id: newId("rt"),
    userId: u.id,
    tokenHash: await sha256(refreshToken),
    expiresAt: new Date(Date.now() + refreshTtl * 1000).toISOString(),
  });
  return { accessToken, refreshToken, expiresIn: accessTtl, user: { id: u.id, email: u.email, role: u.role } };
}

route.post("/register", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return fail(c, 400, "VALIDATION_ERROR", parsed.error.issues.map((i) => i.message));
  const { email, password, firstName, lastName, mobile, role, businessName } = parsed.data;
  const db = drizzle(c.env.DB);
  
  // Check for duplicate email
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length) return fail(c, 409, "UNIQUE_VIOLATION", "Email already registered");
  
  // Sanitize mobile: treat empty strings as null to prevent SQLite UNIQUE constraint failures
  const mobileValue = (mobile && mobile.trim()) ? mobile.trim() : null;
  if (mobileValue) {
    const existingMobile = await db.select().from(users).where(eq(users.mobile, mobileValue)).limit(1);
    if (existingMobile.length) return fail(c, 409, "UNIQUE_VIOLATION", "Mobile number already registered");
  }

  const id = newId("u");
  const passwordHash = await hashPassword(password, Number(c.env.BCRYPT_SALT_ROUNDS || 10));
  await db.insert(users).values({ id, email, mobile: mobileValue, passwordHash, role });
  if (role === "CUSTOMER") {
    await db.insert(customerProfiles).values({ id: newId("cp"), userId: id, firstName: firstName ?? null, lastName: lastName ?? null });
  } else if (role === "PARTNER") {
    const fallback = `${firstName ?? ""} ${lastName ?? ""}`.trim() || "Partner";
    const partnerCode = "CRD-PA" + Math.floor(10000 + Math.random() * 90000);
    await db.insert(partnerProfiles).values({
      id: newId("pp"),
      userId: id,
      partnerCode,
      businessName: businessName ?? fallback,
    });
  }
  return ok(c, await issueTokens(c, { id, email, role }), 201);
});

route.post("/login", async (c) => {
  const body = await c.req.json().catch(() => null);
  const { email, password } = z.object({ email: z.string().email(), password: z.string() }).parse(body);
  const db = drizzle(c.env.DB);
  const row = (await db.select().from(users).where(eq(users.email, email)).limit(1))[0];
  if (!row || !row.passwordHash || !row.isActive) return fail(c, 401, "INVALID_CREDENTIALS", "Invalid email or password");
  const okPw = await verifyPassword(password, row.passwordHash);
  if (!okPw) return fail(c, 401, "INVALID_CREDENTIALS", "Invalid email or password");
  await db.update(users).set({ lastLoginAt: new Date().toISOString() }).where(eq(users.id, row.id));
  return ok(c, await issueTokens(c, row));
});

route.post("/refresh", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const refreshToken: string = body?.refreshToken ?? "";
  if (!refreshToken) return fail(c, 400, "VALIDATION_ERROR", "refreshToken required");
  const claims = await verifyJwt(refreshToken, c.env.JWT_REFRESH_SECRET);
  if (!claims || claims.typ !== "refresh") return fail(c, 401, "INVALID_TOKEN", "Invalid or expired refresh token");
  const db = drizzle(c.env.DB);
  const hash = await sha256(refreshToken);
  const stored = (await db.select().from(refreshTokens).where(and(eq(refreshTokens.tokenHash, hash), eq(refreshTokens.userId, claims.sub))).limit(1))[0];
  if (!stored || stored.revokedAt) return fail(c, 401, "INVALID_TOKEN", "Refresh token revoked");
  // rotate
  await db.update(refreshTokens).set({ revokedAt: new Date().toISOString() }).where(eq(refreshTokens.id, stored.id));
  return ok(c, await issueTokens(c, { id: claims.sub, email: claims.email, role: claims.role }));
});

route.post("/logout", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const refreshToken: string = body?.refreshToken ?? "";
  if (refreshToken) {
    const db = drizzle(c.env.DB);
    await db.update(refreshTokens)
      .set({ revokedAt: new Date().toISOString() })
      .where(eq(refreshTokens.tokenHash, await sha256(refreshToken)));
  }
  return ok(c, { loggedOut: true });
});

route.get("/me", async (c) => {
  const auth = c.req.header("authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return fail(c, 401, "UNAUTHENTICATED", "Login required");
  const claims = await verifyJwt(m[1], c.env.JWT_ACCESS_SECRET);
  if (!claims) return fail(c, 401, "UNAUTHENTICATED", "Invalid token");
  return ok(c, { sub: claims.sub, email: claims.email, role: claims.role });
});

// ── OTP (mocked — returns devOtp in non-production) ────────────────────
route.post("/otp/request", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const destination: string = body?.destination ?? "";
  if (!destination) return fail(c, 400, "VALIDATION_ERROR", "destination required");
  const isEmail = destination.includes("@");
  const code = isEmail ? String(Math.floor(100000 + Math.random() * 900000)) : "123456";
  const db = drizzle(c.env.DB);

  await db.insert(otpCodes).values({
    id: newId("otp"),
    channel: isEmail ? "email" : "mobile",
    destination,
    codeHash: await sha256(code),
    purpose: "login",
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  });

  if (isEmail && c.env.RESEND_API_KEY) {
    const subject = "Verify your email - Credupe";
    const html = `<!DOCTYPE html><html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>Dear User,</p>
      <p>Your verification code is: <strong style="font-size: 20px; color: #4C5CD3; letter-spacing: 2px;">${code}</strong></p>
      <p>This code will remain valid for the next 5 minutes. If you did not request this, you can safely ignore this email.</p>
      <br/>
      <p>Best regards,<br/>Credupe Support Team</p>
      </body></html>`;

    const fromAddress = c.env.RESEND_FROM_EMAIL ?? "Credupe Staging <noreply+staging@credupe.com>";
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${c.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [destination],
          subject,
          html,
        }),
      });
    } catch (err) {
      console.error("[login-otp-email-error]", err);
    }
  }

  if (!isEmail) {
    const res = await sendOTP(destination, code, c.env, "login");
    if (!res.success && c.env.ENV === "production") {
      return fail(c, 500, "SMS_SEND_FAILED", res.error || "Failed to send SMS OTP");
    }
  }

  const isDev = c.env.ENV !== "production";
  return ok(c, { destination, expiresInSec: 300, ...(isDev ? { devOtp: code } : {}) });
});

route.post("/send-otp", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const phone = body?.phone ?? body?.destination ?? "";
  if (!phone) return fail(c, 400, "VALIDATION_ERROR", "phone/destination required");

  const code = "123456";
  const db = drizzle(c.env.DB);

  await db.insert(otpCodes).values({
    id: newId("otp"),
    channel: "mobile",
    destination: phone,
    codeHash: await sha256(code),
    purpose: "login",
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  });

  const res = await sendOTP(phone, code, c.env, "login");
  if (!res.success) {
    return fail(c, 500, "SMS_SEND_FAILED", res.error || "Failed to send SMS OTP");
  }

  const isDev = c.env.ENV !== "production";
  return ok(c, { destination: phone, expiresInSec: 300, ...(isDev ? { devOtp: code } : {}) });
});

route.post("/otp/verify", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const destination: string = body?.destination ?? "";
  const code: string = body?.code ?? "";
  if (!destination || !code) return fail(c, 400, "VALIDATION_ERROR", "destination & code required");

  const isEmail = destination.includes("@");
  if (!isEmail) {
    const verifyRes = await verifyOTP(destination, code, c.env, "login");
    if (!verifyRes.success) {
      return fail(c, 401, "INVALID_OTP", verifyRes.error || "OTP invalid or expired");
    }
  } else {
    const db = drizzle(c.env.DB);
    const rows = await db.select().from(otpCodes)
      .where(and(eq(otpCodes.destination, destination), eq(otpCodes.codeHash, await sha256(code))))
      .limit(1);
    const otp = rows[0];
    if (!otp || otp.consumedAt || new Date(otp.expiresAt) < new Date()) {
      return fail(c, 401, "INVALID_OTP", "OTP invalid or expired");
    }
    await db.update(otpCodes).set({ consumedAt: new Date().toISOString() }).where(eq(otpCodes.id, otp.id));
  }

  // Find-or-create user keyed on destination
  const db = drizzle(c.env.DB);
  let user = (await db.select().from(users).where(eq(users.email, destination)).limit(1))[0];
  if (!user) {
    const id = newId("u");
    await db.insert(users).values({ id, email: destination, role: "CUSTOMER" });
    user = { id, email: destination, role: "CUSTOMER" } as any;
  }
  return ok(c, await issueTokens(c, user));
});

route.post("/forgot-password", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const email: string = (body?.email ?? "").toLowerCase().trim();
  if (!email) return fail(c, 400, "VALIDATION_ERROR", "email required");
  
  const db = drizzle(c.env.DB);
  const user = (await db.select().from(users).where(eq(users.email, email)).limit(1))[0];
  if (!user || !user.isActive) {
    return fail(c, 404, "NOT_FOUND", "Account not found or inactive");
  }

  // Generate 6-digit reset code
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = await sha256(code);

  await db.insert(otpCodes).values({
    id: newId("otp"),
    userId: user.id,
    channel: "email",
    destination: email,
    codeHash,
    purpose: "reset",
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes TTL
    attempts: 0,
  });

  // Try to send email via Resend if API key is configured
  const isDev = !c.env.RESEND_API_KEY;
  if (c.env.RESEND_API_KEY) {
    const subject = "Reset your password - Credupe";
    const html = `<!DOCTYPE html><html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>Dear User,</p>
      <p>You requested a password reset code for your Credupe account.</p>
      <p>Your password reset code is: <strong style="font-size: 20px; color: #4C5CD3; letter-spacing: 2px;">${code}</strong></p>
      <p>This code will remain valid for the next 10 minutes. If you did not request this, you can safely ignore this email.</p>
      <br/>
      <p>Best regards,<br/>Credupe Support Team</p>
      </body></html>`;

    const fromAddress = c.env.RESEND_FROM_EMAIL ?? "Credupe Staging <noreply+staging@credupe.com>";
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${c.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [email],
          subject,
          html,
        }),
      });
    } catch (err) {
      console.error("[forgot-password-email-error]", err);
    }
  }

  return ok(c, { email, expiresInSec: 600, ...(isDev ? { devOtp: code } : {}) });
});

route.post("/reset-password", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const email: string = (body?.email ?? "").toLowerCase().trim();
  const code: string = (body?.code ?? "").trim();
  const newPassword: string = body?.newPassword ?? "";

  if (!email || !code || !newPassword) {
    return fail(c, 400, "VALIDATION_ERROR", "email, code, and newPassword are required");
  }
  if (newPassword.length < 6) {
    return fail(c, 400, "VALIDATION_ERROR", "Password must be at least 6 characters");
  }

  const db = drizzle(c.env.DB);
  const user = (await db.select().from(users).where(eq(users.email, email)).limit(1))[0];
  if (!user || !user.isActive) {
    return fail(c, 404, "NOT_FOUND", "Account not found or inactive");
  }

  // Find valid OTP
  const hash = await sha256(code);
  const rows = await db.select().from(otpCodes)
    .where(and(
      eq(otpCodes.destination, email),
      eq(otpCodes.codeHash, hash),
      eq(otpCodes.purpose, "reset")
    ))
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);

  const otp = rows[0];
  if (!otp || otp.consumedAt || new Date(otp.expiresAt) < new Date()) {
    return fail(c, 401, "INVALID_OTP", "Reset code is invalid or expired");
  }

  // Update attempts
  if (otp.attempts >= 5) {
    return fail(c, 401, "INVALID_OTP", "Too many attempts");
  }
  await db.update(otpCodes).set({ attempts: otp.attempts + 1 }).where(eq(otpCodes.id, otp.id));

  // Update password
  const passwordHash = await hashPassword(newPassword, Number(c.env.BCRYPT_SALT_ROUNDS || 10));
  await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));

  // Mark OTP as consumed
  await db.update(otpCodes).set({ consumedAt: new Date().toISOString() }).where(eq(otpCodes.id, otp.id));

  return ok(c, { success: true });
});

route.get("/dev-credentials", async (c) => {
  if (c.env.DEV_ADMIN_EMAIL && c.env.DEV_ADMIN_PASSWORD) {
    return ok(c, {
      email: c.env.DEV_ADMIN_EMAIL,
      password: c.env.DEV_ADMIN_PASSWORD,
    });
  }
  return fail(c, 404, "NOT_FOUND", "Dev credentials not configured");
});

export default route;
