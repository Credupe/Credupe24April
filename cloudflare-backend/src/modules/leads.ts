import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { and, desc, eq } from "drizzle-orm";
import type { AppEnv } from "../env";
import { leads, leadFollowUps, partnerProfiles, LOAN_TYPES, LEAD_STATUSES } from "../db/schema";
import { ok, fail } from "../lib/envelope";
import { requireAuth, requireRole } from "../middleware/auth";
import { newId } from "../lib/ids";

const route = new Hono<AppEnv>();

async function partnerIdFor(db: any, userId: string) {
  const rows = await db.select().from(partnerProfiles).where(eq(partnerProfiles.userId, userId)).limit(1);
  return rows[0]?.id ?? null;
}

route.post("/", requireAuth, requireRole("PARTNER", "ADMIN"), async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { customerName, customerMobile, customerEmail, loanType, amount, productId, city, notes } = body as any;
  if (!customerName || !customerMobile || !loanType || !LOAN_TYPES.includes(loanType)) {
    return fail(c, 400, "VALIDATION_ERROR", "customerName, customerMobile, loanType required");
  }
  const db = drizzle(c.env.DB);
  const user = c.get("user")!;
  const partnerId = await partnerIdFor(db, user.sub);
  if (!partnerId) return fail(c, 403, "FORBIDDEN", "Partner profile not found");
  const id = newId("lead");
  await db.insert(leads).values({
    id, partnerId, createdById: user.sub,
    customerName, customerMobile, customerEmail: customerEmail ?? null,
    loanType, amountRequestedPaise: amount ? Math.round(amount * 100) : null,
    productId: productId ?? null, city: city ?? null, notes: notes ?? null, status: "NEW",
  });
  return ok(c, { id, status: "NEW" }, 201);
});

route.post("/bulk", requireAuth, requireRole("PARTNER", "ADMIN"), async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const items = Array.isArray(body?.items) ? body.items : [];
  if (!items.length) return fail(c, 400, "VALIDATION_ERROR", "items required");
  const db = drizzle(c.env.DB);
  const user = c.get("user")!;
  const partnerId = await partnerIdFor(db, user.sub);
  if (!partnerId) return fail(c, 403, "FORBIDDEN", "Partner profile not found");
  const created: string[] = [];
  for (const it of items) {
    if (!it.customerName || !it.customerMobile || !LOAN_TYPES.includes(it.loanType)) continue;
    const id = newId("lead");
    await db.insert(leads).values({
      id, partnerId, createdById: user.sub,
      customerName: it.customerName, customerMobile: it.customerMobile,
      customerEmail: it.customerEmail ?? null,
      loanType: it.loanType, amountRequestedPaise: it.amount ? Math.round(it.amount * 100) : null,
      city: it.city ?? null, notes: it.notes ?? null, status: "NEW",
    });
    created.push(id);
  }
  return ok(c, { created: created.length, ids: created }, 201);
});

route.get("/", requireAuth, requireRole("PARTNER", "ADMIN"), async (c) => {
  const db = drizzle(c.env.DB);
  const user = c.get("user")!;
  const q = c.req.query();
  const where: any[] = [];
  if (user.role === "PARTNER") {
    const partnerId = await partnerIdFor(db, user.sub);
    if (!partnerId) return ok(c, { items: [], total: 0 });
    where.push(eq(leads.partnerId, partnerId));
  }
  if (q.status && LEAD_STATUSES.includes(q.status as any)) where.push(eq(leads.status, q.status as any));
  const rows = await db.select().from(leads)
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(leads.createdAt));
  return ok(c, {
    items: rows.map((r) => ({ ...r, amount: r.amountRequestedPaise ? r.amountRequestedPaise / 100 : null })),
    total: rows.length,
  });
});

route.patch("/:id", requireAuth, requireRole("PARTNER", "ADMIN"), async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const db = drizzle(c.env.DB);
  const user = c.get("user")!;
  const patch: any = { updatedBy: user.sub, updatedAt: new Date().toISOString() };
  if (body.status && LEAD_STATUSES.includes(body.status)) patch.status = body.status;
  if (body.notes !== undefined) patch.notes = body.notes;
  await db.update(leads).set(patch).where(eq(leads.id, id));
  return ok(c, { id, updated: true });
});

route.post("/:id/follow-ups", requireAuth, requireRole("PARTNER", "ADMIN"), async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  if (!body.scheduledAt) return fail(c, 400, "VALIDATION_ERROR", "scheduledAt required");
  const db = drizzle(c.env.DB);
  const user = c.get("user")!;
  const fid = newId("lfu");
  await db.insert(leadFollowUps).values({
    id: fid, leadId: id, scheduledAt: body.scheduledAt, note: body.note ?? null, createdBy: user.sub,
  });
  return ok(c, { id: fid }, 201);
});

route.post("/:id/reassign", requireAuth, requireRole("ADMIN"), async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  if (!body.partnerId) return fail(c, 400, "VALIDATION_ERROR", "partnerId required");
  const db = drizzle(c.env.DB);
  await db.update(leads).set({ partnerId: body.partnerId, updatedAt: new Date().toISOString() }).where(eq(leads.id, id));
  return ok(c, { id, reassigned: true });
});

export default route;
