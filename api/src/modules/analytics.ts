import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { and, eq, sql } from "drizzle-orm";
import type { AppEnv } from "../env";
import { loanApplications, leads, partnerProfiles } from "../db/schema";
import { ok } from "../lib/envelope";
import { requireAuth, requireRole } from "../middleware/auth";

const route = new Hono<AppEnv>();

// Admin funnel: count by status
route.get("/admin/funnel", requireAuth, requireRole("ADMIN"), async (c) => {
  const db = drizzle(c.env.DB);
  const result = await c.env.DB.prepare("SELECT status, COUNT(*) as count FROM loan_applications WHERE deleted_at IS NULL GROUP BY status").all();
  const byStatus: Record<string, number> = {};
  for (const row of (result.results ?? []) as any[]) byStatus[row.status] = Number(row.count);
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
  return ok(c, { total, byStatus });
});

route.get("/partner/summary", requireAuth, requireRole("PARTNER", "ADMIN"), async (c) => {
  const db = drizzle(c.env.DB);
  const user = c.get("user")!;
  let partnerId: string | null = null;
  if (user.role === "PARTNER") {
    const row = (await db.select().from(partnerProfiles).where(eq(partnerProfiles.userId, user.sub)).limit(1))[0];
    partnerId = row?.id ?? null;
    if (!partnerId) return ok(c, { leads: { total: 0, byStatus: {} } });
  }
  const query = partnerId
    ? c.env.DB.prepare("SELECT status, COUNT(*) as count FROM leads WHERE partner_id = ? AND deleted_at IS NULL GROUP BY status").bind(partnerId)
    : c.env.DB.prepare("SELECT status, COUNT(*) as count FROM leads WHERE deleted_at IS NULL GROUP BY status");
  const result = await query.all();
  const byStatus: Record<string, number> = {};
  for (const r of (result.results ?? []) as any[]) byStatus[r.status] = Number(r.count);
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
  return ok(c, { leads: { total, byStatus } });
});

export default route;
