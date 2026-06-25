import type { MiddlewareHandler } from "hono";
import type { AppEnv } from "../env";
import { verifyJwt } from "../lib/jwt";
import { fail } from "../lib/envelope";

/**
 * Required-auth middleware. Sets `c.var.user` on success.
 */
export const requireAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
  const auth = c.req.header("authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return fail(c, 401, "UNAUTHENTICATED", "Missing bearer token");
  const claims = await verifyJwt(m[1], c.env.JWT_ACCESS_SECRET);
  if (!claims || claims.typ !== "access") {
    return fail(c, 401, "UNAUTHENTICATED", "Invalid or expired token");
  }
  c.set("user", { sub: claims.sub, email: claims.email, role: claims.role });
  await next();
};

/**
 * Optional-auth middleware. Populates `c.var.user` if a valid token is
 * present, but does NOT 401 on absence. Used for routes that are
 * anonymous-by-default but personalise when logged in (e.g. quotes).
 */
export const optionalAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
  const auth = c.req.header("authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (m) {
    const claims = await verifyJwt(m[1], c.env.JWT_ACCESS_SECRET);
    if (claims && claims.typ === "access") {
      c.set("user", { sub: claims.sub, email: claims.email, role: claims.role });
    }
  }
  await next();
};

/**
 * Role-gate: must be called AFTER `requireAuth`.
 */
export const requireRole = (...roles: Array<"CUSTOMER" | "PARTNER" | "ADMIN">): MiddlewareHandler<AppEnv> =>
  async (c, next) => {
    const u = c.get("user");
    if (!u) return fail(c, 401, "UNAUTHENTICATED", "Login required");
    if (!roles.includes(u.role)) return fail(c, 403, "FORBIDDEN", "Insufficient privileges");
    await next();
  };
