import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { and, desc, eq } from "drizzle-orm";
import type { AppEnv } from "../env";
import { loanApplications, applicationStatusHistory, LOAN_TYPES, APPLICATION_STATUSES, users, customerProfiles, partnerProfiles, leads } from "../db/schema";
import { ok, fail } from "../lib/envelope";
import { requireAuth, requireRole } from "../middleware/auth";
import { newId, newReferenceNo } from "../lib/ids";

const route = new Hono<AppEnv>();

route.post("/", requireAuth, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { loanType, amount, tenureMonths, productId, lenderId, purpose, formData } = body as any;
  if (!loanType || !LOAN_TYPES.includes(loanType)) return fail(c, 400, "VALIDATION_ERROR", "loanType required");
  if (typeof amount !== "number" || amount <= 0) return fail(c, 400, "VALIDATION_ERROR", "amount required");
  if (!tenureMonths) return fail(c, 400, "VALIDATION_ERROR", "tenureMonths required");
  const user = c.get("user")!;
  const id = newId("app");
  const refNo = newReferenceNo();
  const db = drizzle(c.env.DB);
  await db.insert(loanApplications).values({
    id,
    referenceNo: refNo,
    userId: user.sub,
    productId: productId ?? null,
    lenderId: lenderId ?? null,
    loanType,
    amountRequestedPaise: Math.round(amount * 100),
    tenureMonths,
    purpose: purpose ?? null,
    formDataJson: formData ? JSON.stringify(formData) : null,
    status: "LEAD",
    createdBy: user.sub,
  });
  await db.insert(applicationStatusHistory).values({
    id: newId("ash"),
    applicationId: id,
    fromStatus: null,
    toStatus: "LEAD",
    changedBy: user.sub,
    note: "Application created",
  });
  return ok(c, { id, referenceNo: refNo, status: "LEAD" }, 201);
});

route.get("/mine", requireAuth, async (c) => {
  const user = c.get("user")!;
  const db = drizzle(c.env.DB);
  const rows = await db.select().from(loanApplications)
    .where(eq(loanApplications.userId, user.sub))
    .orderBy(desc(loanApplications.createdAt));
  return ok(c, {
    items: rows.map((r) => ({
      id: r.id,
      referenceNo: r.referenceNo,
      loanType: r.loanType,
      amount: r.amountRequestedPaise / 100,
      tenureMonths: r.tenureMonths,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    })),
    total: rows.length,
  });
});

route.get("/:id", requireAuth, async (c) => {
  const id = c.req.param("id");
  const user = c.get("user")!;
  const db = drizzle(c.env.DB);
  const row = (await db.select().from(loanApplications).where(eq(loanApplications.id, id)).limit(1))[0];
  if (!row) return fail(c, 404, "NOT_FOUND", "Application not found");
  if (row.userId !== user.sub && user.role !== "ADMIN") return fail(c, 403, "FORBIDDEN", "Not your application");
  const history = await db.select().from(applicationStatusHistory)
    .where(eq(applicationStatusHistory.applicationId, id))
    .orderBy(desc(applicationStatusHistory.createdAt));
  return ok(c, {
    id: row.id,
    referenceNo: row.referenceNo,
    loanType: row.loanType,
    amount: row.amountRequestedPaise / 100,
    tenureMonths: row.tenureMonths,
    status: row.status,
    formData: row.formDataJson ? JSON.parse(row.formDataJson) : null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    history: history.map((h) => ({ from: h.fromStatus, to: h.toStatus, note: h.note, at: h.createdAt })),
  });
});

route.patch("/:id", requireAuth, async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const user = c.get("user")!;
  const db = drizzle(c.env.DB);
  const row = (await db.select().from(loanApplications).where(eq(loanApplications.id, id)).limit(1))[0];
  if (!row) return fail(c, 404, "NOT_FOUND", "Application not found");
  if (row.userId !== user.sub && user.role !== "ADMIN") return fail(c, 403, "FORBIDDEN", "Not your application");
  const patch: any = { updatedBy: user.sub, updatedAt: new Date().toISOString() };
  if (body.formData !== undefined) patch.formDataJson = JSON.stringify(body.formData);
  if (body.purpose !== undefined) patch.purpose = body.purpose;
  await db.update(loanApplications).set(patch).where(eq(loanApplications.id, id));
  return ok(c, { id, updated: true });
});

route.post("/:id/transition", requireAuth, requireRole("ADMIN", "PARTNER"), async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const toStatus = body.toStatus as typeof APPLICATION_STATUSES[number];
  if (!APPLICATION_STATUSES.includes(toStatus)) return fail(c, 400, "VALIDATION_ERROR", "Invalid toStatus");
  const db = drizzle(c.env.DB);
  const row = (await db.select().from(loanApplications).where(eq(loanApplications.id, id)).limit(1))[0];
  if (!row) return fail(c, 404, "NOT_FOUND", "Application not found");
  const user = c.get("user")!;
  await db.update(loanApplications).set({
    status: toStatus,
    updatedBy: user.sub,
    updatedAt: new Date().toISOString(),
    ...(toStatus === "DISBURSED" ? { disbursedAt: new Date().toISOString() } : {}),
  }).where(eq(loanApplications.id, id));
  await db.insert(applicationStatusHistory).values({
    id: newId("ash"),
    applicationId: id,
    fromStatus: row.status,
    toStatus,
    changedBy: user.sub,
    note: body.note ?? null,
  });
  return ok(c, { id, status: toStatus });
});

// Admin: list all
route.get("/", requireAuth, requireRole("ADMIN"), async (c) => {
  const q = c.req.query();
  const db = drizzle(c.env.DB);
  const where: any[] = [];
  if (q.status && APPLICATION_STATUSES.includes(q.status as any)) where.push(eq(loanApplications.status, q.status as any));
  const rows = await db.select().from(loanApplications)
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(loanApplications.createdAt));
  return ok(c, { items: rows.map((r) => ({ ...r, amount: r.amountRequestedPaise / 100 })), total: rows.length });
});

// POST /public: public endpoint to create loan application + partner lead
route.post("/public", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { loanType, amount, tenureMonths, lenderId, formData, partnerCode } = body as any;

  if (!loanType || !LOAN_TYPES.includes(loanType)) {
    return fail(c, 400, "VALIDATION_ERROR", "loanType required");
  }
  if (typeof amount !== "number" || amount <= 0) {
    return fail(c, 400, "VALIDATION_ERROR", "amount required");
  }
  if (!tenureMonths) {
    return fail(c, 400, "VALIDATION_ERROR", "tenureMonths required");
  }
  if (!formData || !formData.mobile || !formData.firstName || !formData.lastName) {
    return fail(c, 400, "VALIDATION_ERROR", "mobile, firstName, lastName are required in formData");
  }

  const { mobile, firstName, lastName, dob, gender, pincode, employmentType } = formData;
  const db = drizzle(c.env.DB);

  // 1. Find or create user
  let userId: string;
  const existingUser = (await db.select().from(users).where(eq(users.mobile, mobile)).limit(1))[0];
  
  if (existingUser) {
    userId = existingUser.id;
  } else {
    const existingByEmail = (await db.select().from(users).where(eq(users.email, mobile)).limit(1))[0];
    if (existingByEmail) {
      userId = existingByEmail.id;
    } else {
      userId = newId("u");
      await db.insert(users).values({
        id: userId,
        email: mobile,
        mobile: mobile,
        role: "CUSTOMER",
      });
      
      // Create customer profile
      await db.insert(customerProfiles).values({
        id: newId("cp"),
        userId: userId,
        firstName: firstName || null,
        lastName: lastName || null,
        dob: dob || null,
        gender: gender || null,
        pincode: pincode || null,
        employmentType: employmentType || null,
      });
    }
  }

  // 2. Find partner profile by partnerCode
  let partnerId: string | null = null;
  let partnerUserId: string | null = null;
  if (partnerCode) {
    const rows = await db.select().from(partnerProfiles).where(eq(partnerProfiles.partnerCode, partnerCode)).limit(1);
    if (rows[0]) {
      partnerId = rows[0].id;
      partnerUserId = rows[0].userId;
    }
  }

  // Fallback partner if none found
  if (!partnerId || !partnerUserId) {
    const fallbackRows = await db.select().from(partnerProfiles).limit(1);
    if (fallbackRows[0]) {
      partnerId = fallbackRows[0].id;
      partnerUserId = fallbackRows[0].userId;
    } else {
      const adminUser = await db.select().from(users).where(eq(users.role, "ADMIN")).limit(1);
      if (adminUser[0]) {
        partnerUserId = adminUser[0].id;
      }
    }
  }

  // 3. Insert loan application
  const appId = newId("app");
  const refNo = newReferenceNo();
  await db.insert(loanApplications).values({
    id: appId,
    referenceNo: refNo,
    userId: userId,
    productId: null,
    lenderId: lenderId || null,
    loanType,
    amountRequestedPaise: Math.round(amount * 100),
    tenureMonths,
    purpose: null,
    formDataJson: JSON.stringify(formData),
    status: "LEAD",
    createdBy: partnerUserId || userId,
  });

  // 4. Create history entry
  await db.insert(applicationStatusHistory).values({
    id: newId("ash"),
    applicationId: appId,
    fromStatus: null,
    toStatus: "LEAD",
    changedBy: partnerUserId || userId,
    note: "Application created publicly via UTM link",
  });

  // 5. Create lead entry for the partner
  if (partnerId && partnerUserId) {
    const leadId = newId("lead");
    const notesText = `Submitted via public personal loan link. Partner Code: ${partnerCode || "None"}`;
    await db.insert(leads).values({
      id: leadId,
      partnerId: partnerId,
      createdById: partnerUserId,
      customerName: `${firstName} ${lastName}`,
      customerMobile: mobile,
      customerEmail: null,
      loanType,
      amountRequestedPaise: Math.round(amount * 100),
      productId: null,
      city: null,
      status: "APPLICATION_CREATED",
      notes: notesText,
      applicationId: appId,
    });
  }

  return ok(c, { id: appId, referenceNo: refNo, status: "LEAD" }, 201);
});

export default route;
