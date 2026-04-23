import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import type { AppEnv } from "../env";
import { users, ROLES } from "../db/schema";
import { ok, fail } from "../lib/envelope";
import { requireAuth, requireRole } from "../middleware/auth";

const route = new Hono<AppEnv>();

route.get("/me", requireAuth, async (c) => {
  const user = c.get("user")!;
  const db = drizzle(c.env.DB);
  const row = (await db.select().from(users).where(eq(users.id, user.sub)).limit(1))[0];
  if (!row) return fail(c, 404, "NOT_FOUND", "User not found");
  const { passwordHash, ...safe } = row as any;
  return ok(c, safe);
});

route.get("/", requireAuth, requireRole("ADMIN"), async (c) => {
  const q = c.req.query();
  const db = drizzle(c.env.DB);
  const where = q.role && ROLES.includes(q.role as any) ? eq(users.role, q.role as any) : undefined;
  const rows = await db.select().from(users).where(where);
  return ok(c, { items: rows.map((r) => { const { passwordHash, ...s } = r as any; return s; }), total: rows.length });
});

export default route;
