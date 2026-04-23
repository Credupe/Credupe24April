import { Hono } from "hono";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import { eq, and } from "drizzle-orm";
import type { AppEnv } from "../env";
import { users, refreshTokens, customerProfiles, partnerProfiles, otpCodes } from "../db/schema";
import { ok, fail } from "../lib/envelope";
import { hashPassword, verifyPassword } from "../lib/password";
import { signJwt, verifyJwt } from "../lib/jwt";
import { newId, sha256 } from "../lib/ids";

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
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length) return fail(c, 409, "UNIQUE_VIOLATION", "Email already registered");
  const id = newId("u");
  const passwordHash = await hashPassword(password, Number(c.env.BCRYPT_SALT_ROUNDS || 10));
  await db.insert(users).values({ id, email, mobile: mobile ?? null, passwordHash, role });
  if (role === "CUSTOMER") {
    await db.insert(customerProfiles).values({ id: newId("cp"), userId: id, firstName: firstName ?? null, lastName: lastName ?? null });
  } else if (role === "PARTNER") {
    const fallback = `${firstName ?? ""} ${lastName ?? ""}`.trim() || "Partner";
    await db.insert(partnerProfiles).values({ id: newId("pp"), userId: id, businessName: businessName ?? fallback });
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
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const db = drizzle(c.env.DB);
  await db.insert(otpCodes).values({
    id: newId("otp"),
    channel: destination.includes("@") ? "email" : "mobile",
    destination,
    codeHash: await sha256(code),
    purpose: "login",
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  });
  return ok(c, { destination, expiresInSec: 300, devOtp: code });
});

route.post("/otp/verify", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const destination: string = body?.destination ?? "";
  const code: string = body?.code ?? "";
  if (!destination || !code) return fail(c, 400, "VALIDATION_ERROR", "destination & code required");
  const db = drizzle(c.env.DB);
  const rows = await db.select().from(otpCodes)
    .where(and(eq(otpCodes.destination, destination), eq(otpCodes.codeHash, await sha256(code))))
    .limit(1);
  const otp = rows[0];
  if (!otp || otp.consumedAt || new Date(otp.expiresAt) < new Date()) {
    return fail(c, 401, "INVALID_OTP", "OTP invalid or expired");
  }
  await db.update(otpCodes).set({ consumedAt: new Date().toISOString() }).where(eq(otpCodes.id, otp.id));
  // Find-or-create user keyed on destination
  let user = (await db.select().from(users).where(eq(users.email, destination)).limit(1))[0];
  if (!user) {
    const id = newId("u");
    await db.insert(users).values({ id, email: destination, role: "CUSTOMER" });
    user = { id, email: destination, role: "CUSTOMER" } as any;
  }
  return ok(c, await issueTokens(c, user));
});

export default route;
