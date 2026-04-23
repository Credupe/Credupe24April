import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import type { AppEnv } from "../env";
import { partnerProfiles } from "../db/schema";
import { ok } from "../lib/envelope";
import { requireAuth, requireRole } from "../middleware/auth";

const route = new Hono<AppEnv>();

route.get("/me", requireAuth, requireRole("PARTNER", "ADMIN"), async (c) => {
  const user = c.get("user")!;
  const db = drizzle(c.env.DB);
  const row = (await db.select().from(partnerProfiles).where(eq(partnerProfiles.userId, user.sub)).limit(1))[0];
  return ok(c, { profile: row ?? null });
});

route.patch("/me", requireAuth, requireRole("PARTNER", "ADMIN"), async (c) => {
  const user = c.get("user")!;
  const body = await c.req.json().catch(() => ({}));
  const db = drizzle(c.env.DB);
  const patch: any = { updatedAt: new Date().toISOString(), updatedBy: user.sub };
  const fields = ["businessName", "contactPerson", "city", "state", "pincode", "gstNumber", "panLast4"];
  for (const f of fields) if (body[f] !== undefined) patch[f] = body[f];
  await db.update(partnerProfiles).set(patch).where(eq(partnerProfiles.userId, user.sub));
  return ok(c, { updated: true });
});

export default route;
