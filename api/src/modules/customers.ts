import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import type { AppEnv } from "../env";
import { customerProfiles } from "../db/schema";
import { ok, fail } from "../lib/envelope";
import { requireAuth } from "../middleware/auth";
import { newId } from "../lib/ids";

const route = new Hono<AppEnv>();

route.get("/me", requireAuth, async (c) => {
  const user = c.get("user")!;
  const db = drizzle(c.env.DB);
  const row = (await db.select().from(customerProfiles).where(eq(customerProfiles.userId, user.sub)).limit(1))[0];
  if (!row) return ok(c, { profile: null });
  return ok(c, {
    profile: {
      ...row,
      monthlyIncome: row.monthlyIncomePaise != null ? row.monthlyIncomePaise / 100 : null,
    },
  });
});

route.patch("/me", requireAuth, async (c) => {
  const user = c.get("user")!;
  const body = await c.req.json().catch(() => ({}));
  const db = drizzle(c.env.DB);
  const existing = (await db.select().from(customerProfiles).where(eq(customerProfiles.userId, user.sub)).limit(1))[0];
  const patch: any = { updatedAt: new Date().toISOString(), updatedBy: user.sub };
  const fields = ["firstName", "lastName", "dob", "gender", "city", "state", "pincode", "panLast4", "aadhaarLast4", "employmentType", "employerName", "cibilRange"];
  for (const f of fields) if (body[f] !== undefined) patch[f] = body[f];
  if (body.monthlyIncome !== undefined) patch.monthlyIncomePaise = Math.round(body.monthlyIncome * 100);
  if (existing) {
    await db.update(customerProfiles).set(patch).where(eq(customerProfiles.userId, user.sub));
  } else {
    await db.insert(customerProfiles).values({ id: newId("cp"), userId: user.sub, ...patch });
  }
  return ok(c, { updated: true });
});

export default route;
