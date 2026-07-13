import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { and, desc, eq } from "drizzle-orm";
import type { AppEnv } from "../env";
import { leads, leadFollowUps, partnerProfiles, users, LOAN_TYPES, LEAD_STATUSES } from "../db/schema";
import { ok, fail } from "../lib/envelope";
import { requireAuth, requireRole } from "../middleware/auth";
import { newId } from "../lib/ids";

const route = new Hono<AppEnv>();

async function partnerIdFor(db: any, userId: string) {
  const rows = await db.select().from(partnerProfiles).where(eq(partnerProfiles.userId, userId)).limit(1);
  return rows[0]?.id ?? null;
}

async function sendLeadEmail(c: any, leadData: {
  customerName: string;
  customerMobile: string;
  customerEmail?: string | null;
  loanType: string;
  amount?: number | null;
  city?: string | null;
  partnerCode?: string | null;
  notes?: string | null;
}) {
  const apiKey = c.env.RESEND_API_KEY;
  const toEmail = c.env.NOTIFICATION_EMAIL || "av457508@gmail.com";
  const fromEmail = c.env.RESEND_FROM_EMAIL || "Credupe <onboarding@resend.dev>";
  
  if (!apiKey) {
    console.log(`[leads-email] Mock send to ${toEmail} since RESEND_API_KEY is not configured.`);
    return;
  }
  
  const subject = `New Lead: ${leadData.customerName} - ${leadData.loanType.replace(/_/g, " ")}`;
  const html = `
    <h3>New Lead Generated!</h3>
    <p>A new lead has been submitted in the system.</p>
    <table border="0" cellpadding="5" cellspacing="0">
      <tr><td><b>Name:</b></td><td>${leadData.customerName}</td></tr>
      <tr><td><b>Mobile:</b></td><td>${leadData.customerMobile}</td></tr>
      <tr><td><b>Email:</b></td><td>${leadData.customerEmail || "Not provided"}</td></tr>
      <tr><td><b>Loan Type:</b></td><td>${leadData.loanType.replace(/_/g, " ")}</td></tr>
      <tr><td><b>Amount:</b></td><td>${leadData.amount ? "₹" + leadData.amount : "Not specified"}</td></tr>
      <tr><td><b>City:</b></td><td>${leadData.city || "Not specified"}</td></tr>
      <tr><td><b>Partner Code:</b></td><td>${leadData.partnerCode || "None"}</td></tr>
      <tr><td><b>Notes:</b></td><td>${leadData.notes || "None"}</td></tr>
    </table>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("[leads-email] Failed to send email via Resend:", data);
    } else {
      console.log(`[leads-email] Notification sent successfully to ${toEmail}`);
    }
  } catch (err) {
    console.error("[leads-email] Error sending email via Resend:", err);
  }
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

  const partnerRow = (await db.select().from(partnerProfiles).where(eq(partnerProfiles.id, partnerId)).limit(1))[0];
  const partnerCode = partnerRow?.partnerCode ?? null;
  await sendLeadEmail(c, {
    customerName,
    customerMobile,
    customerEmail,
    loanType,
    amount,
    city,
    partnerCode,
    notes,
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

route.post("/public", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { customerName, customerMobile, customerEmail, loanType, partnerCode } = body as any;
  if (!customerName || !customerMobile || !loanType) {
    return fail(c, 400, "VALIDATION_ERROR", "customerName, customerMobile, loanType required");
  }
  const db = drizzle(c.env.DB);
  
  // Find partner profile by partnerCode
  let partnerId: string | null = null;
  let createdById: string | null = null;
  
  if (partnerCode) {
    const rows = await db.select().from(partnerProfiles).where(eq(partnerProfiles.partnerCode, partnerCode)).limit(1);
    if (rows[0]) {
      partnerId = rows[0].id;
      createdById = rows[0].userId;
    }
  }
  
  if (!partnerId || !createdById) {
    // Fallback: get the first partner in the system
    const fallbackRows = await db.select().from(partnerProfiles).limit(1);
    if (fallbackRows[0]) {
      partnerId = fallbackRows[0].id;
      createdById = fallbackRows[0].userId;
    } else {
      // Fallback: get the first admin user
      const adminUser = await db.select().from(users).where(eq(users.role, "ADMIN")).limit(1);
      if (adminUser[0]) {
        createdById = adminUser[0].id;
        // Since we need partnerId, look for any partner profile, or return an error if none exists.
        return fail(c, 400, "PARTNER_NOT_FOUND", "No valid partner profile found in system");
      }
    }
  }

  // Normalize loanType for DB schema
  let mappedLoanType = loanType.toUpperCase().replace(/-/g, "_");
  if (!LOAN_TYPES.includes(mappedLoanType as any)) {
    return fail(c, 400, "VALIDATION_ERROR", `Invalid loanType. Supported values: ${LOAN_TYPES.join(", ")}`);
  }

  const id = newId("lead");
  const notesText = `Submitted via public Utility Tool. Partner Code: ${partnerCode || "None"}`;
  await db.insert(leads).values({
    id,
    partnerId: partnerId!,
    createdById: createdById!,
    customerName,
    customerMobile,
    customerEmail: customerEmail ?? null,
    loanType: mappedLoanType as any,
    status: "NEW",
    notes: notesText,
  });

  await sendLeadEmail(c, {
    customerName,
    customerMobile,
    customerEmail,
    loanType: mappedLoanType,
    partnerCode,
    notes: notesText,
  });

  return ok(c, { id, status: "NEW" }, 201);
});

export default route;
