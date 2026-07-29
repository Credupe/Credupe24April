import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { and, eq, like, or } from "drizzle-orm";
import type { AppEnv } from "../env";
import { loanProducts, lenders, LOAN_TYPES } from "../db/schema";
import { ok, fail } from "../lib/envelope";
import { requireAuth, requireRole, optionalAuth } from "../middleware/auth";
import { verifyJwt } from "../lib/jwt";

const route = new Hono<AppEnv>();

// paise → rupees (number), bps → percent (number)
const toRupees = (p: number | null | undefined) => (p == null ? null : p / 100);
const fromBps = (b: number | null | undefined) => (b == null ? null : b / 100);

function rowToApi(p: any, l: any) {
  return {
    id: p.id,
    lender: l ? { id: l.id, name: l.name, slug: l.slug, logoUrl: l.logoUrl } : null,
    name: p.name,
    slug: p.slug,
    loanType: p.loanType,
    minAmount: toRupees(p.minAmountPaise),
    maxAmount: toRupees(p.maxAmountPaise),
    minTenureMonths: p.minTenureMonths,
    maxTenureMonths: p.maxTenureMonths,
    minInterestRate: fromBps(p.minInterestRateBps),
    maxInterestRate: fromBps(p.maxInterestRateBps),
    processingFeePct: fromBps(p.processingFeeBps),
    minMonthlyIncome: toRupees(p.minMonthlyIncomePaise),
    minCibilScore: p.minCibilScore,
    active: p.active,
  };
}

// GET /api/v1/loan-products (public and admin list)
route.get("/", optionalAuth, async (c) => {
  const q = c.req.query();
  const isAdminRoute = c.req.path.includes("/admin/loan-products");

  if (isAdminRoute) {
    const user = c.get("user");
    if (!user) return fail(c, 401, "UNAUTHENTICATED", "Login required");
    if (user.role !== "ADMIN") return fail(c, 403, "FORBIDDEN", "Insufficient privileges");
  }

  const page = Math.max(1, Number(q.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(q.pageSize ?? 20)));
  const loanType = q.loanType as any;
  const search = (q.search ?? "").trim();
  const activeParam = q.active; // "true" | "false"
  const lenderId = q.lenderId;

  const db = drizzle(c.env.DB);
  const whereClauses: any[] = [];

  if (!isAdminRoute) {
    whereClauses.push(eq(loanProducts.active, true));
  } else {
    if (activeParam === "true") {
      whereClauses.push(eq(loanProducts.active, true));
    } else if (activeParam === "false") {
      whereClauses.push(eq(loanProducts.active, false));
    }
  }

  if (lenderId) {
    whereClauses.push(eq(loanProducts.lenderId, lenderId));
  }
  if (loanType && LOAN_TYPES.includes(loanType)) {
    whereClauses.push(eq(loanProducts.loanType, loanType));
  }
  if (search) {
    whereClauses.push(
      or(
        like(loanProducts.name, `%${search}%`),
        like(loanProducts.slug, `%${search}%`)
      ) as any
    );
  }

  const rows = await db
    .select()
    .from(loanProducts)
    .where(whereClauses.length ? and(...whereClauses) : undefined);

  // Sort: newest first for admin, lowest rate first for public
  const sorted = rows.sort((a, b) => {
    if (isAdminRoute) {
      return b.createdAt.localeCompare(a.createdAt);
    } else {
      return (a.minInterestRateBps ?? 9999) - (b.minInterestRateBps ?? 9999);
    }
  });

  const totalRows = sorted.length;
  const sliced = sorted.slice((page - 1) * pageSize, page * pageSize);

  const lenderIds = [...new Set(sliced.map((r) => r.lenderId))];
  const lenderRows = lenderIds.length
    ? await db
        .select()
        .from(lenders)
        .where(or(...lenderIds.map((id) => eq(lenders.id, id))) as any)
    : [];
  const byLender = new Map(lenderRows.map((l) => [l.id, l]));

  return ok(c, {
    items: sliced.map((p) => rowToApi(p, byLender.get(p.lenderId))),
    total: totalRows,
    page,
    pageSize,
    totalPages: Math.ceil(totalRows / pageSize),
  });
});

// GET /api/v1/loan-products/:id (Get detail)
route.get("/:id", async (c) => {
  const id = c.req.param("id");
  const db = drizzle(c.env.DB);
  const product = (await db.select().from(loanProducts).where(eq(loanProducts.id, id)).limit(1))[0];
  if (!product) return fail(c, 404, "NOT_FOUND", "Loan product not found");

  const lender = (await db.select().from(lenders).where(eq(lenders.id, product.lenderId)).limit(1))[0];
  return ok(c, rowToApi(product, lender));
});

// POST /api/v1/loan-products (Create product)
route.post("/", requireAuth, requireRole("ADMIN"), async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return fail(c, 400, "BAD_REQUEST", "Invalid request body");

  const {
    name,
    lenderId,
    loanType,
    minAmount,
    maxAmount,
    minTenureMonths,
    maxTenureMonths,
    minInterestRate,
    maxInterestRate,
    processingFeePct,
    minMonthlyIncome,
    minCibilScore,
    active,
  } = body;

  // Validation
  if (!name || !name.trim()) return fail(c, 400, "VALIDATION_ERROR", "Display name is required");
  if (!lenderId) return fail(c, 400, "VALIDATION_ERROR", "Lender is required");
  if (!loanType || !LOAN_TYPES.includes(loanType)) return fail(c, 400, "VALIDATION_ERROR", "Valid Loan type is required");

  if (typeof minAmount !== "number" || minAmount <= 0) return fail(c, 400, "VALIDATION_ERROR", "Minimum amount must be positive");
  if (typeof maxAmount !== "number" || maxAmount <= 0) return fail(c, 400, "VALIDATION_ERROR", "Maximum amount must be positive");
  if (minAmount > maxAmount) return fail(c, 400, "VALIDATION_ERROR", "Min amount cannot exceed max amount");

  if (typeof minTenureMonths !== "number" || minTenureMonths <= 0) return fail(c, 400, "VALIDATION_ERROR", "Minimum tenure must be positive");
  if (typeof maxTenureMonths !== "number" || maxTenureMonths <= 0) return fail(c, 400, "VALIDATION_ERROR", "Maximum tenure must be positive");
  if (minTenureMonths > maxTenureMonths) return fail(c, 400, "VALIDATION_ERROR", "Min tenure cannot exceed max tenure");

  if (typeof minInterestRate !== "number" || minInterestRate < 0) return fail(c, 400, "VALIDATION_ERROR", "Minimum interest rate must be non-negative");
  if (typeof maxInterestRate !== "number" || maxInterestRate < 0) return fail(c, 400, "VALIDATION_ERROR", "Maximum interest rate must be non-negative");
  if (minInterestRate > maxInterestRate) return fail(c, 400, "VALIDATION_ERROR", "Min interest rate cannot exceed max interest rate");

  const db = drizzle(c.env.DB);
  const lenderExists = (await db.select().from(lenders).where(eq(lenders.id, lenderId)).limit(1))[0];
  if (!lenderExists) return fail(c, 400, "VALIDATION_ERROR", "Selected lender does not exist");

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.floor(1000 + Math.random() * 9000);
  const id = "lp_" + Math.random().toString(36).substring(2, 15);
  const user = c.get("user");

  await db.insert(loanProducts).values({
    id,
    lenderId,
    name: name.trim(),
    slug,
    loanType,
    minAmountPaise: Math.round(minAmount * 100),
    maxAmountPaise: Math.round(maxAmount * 100),
    minTenureMonths,
    maxTenureMonths,
    minInterestRateBps: Math.round(minInterestRate * 100),
    maxInterestRateBps: Math.round(maxInterestRate * 100),
    processingFeeBps: processingFeePct != null ? Math.round(processingFeePct * 100) : null,
    minMonthlyIncomePaise: minMonthlyIncome != null ? Math.round(minMonthlyIncome * 100) : null,
    minCibilScore: minCibilScore != null ? minCibilScore : null,
    active: active !== false,
    createdBy: user?.sub ?? "system",
    updatedBy: user?.sub ?? "system",
  });

  const newProduct = (await db.select().from(loanProducts).where(eq(loanProducts.id, id)).limit(1))[0];
  return ok(c, rowToApi(newProduct, lenderExists), 201);
});

// PUT & PATCH /api/v1/loan-products/:id (Edit product)
route.on(["PUT", "PATCH"], "/:id", requireAuth, requireRole("ADMIN"), async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => null);
  if (!body) return fail(c, 400, "BAD_REQUEST", "Invalid request body");

  const db = drizzle(c.env.DB);
  const existing = (await db.select().from(loanProducts).where(eq(loanProducts.id, id)).limit(1))[0];
  if (!existing) return fail(c, 404, "NOT_FOUND", "Loan product not found");

  const {
    name,
    lenderId,
    loanType,
    minAmount,
    maxAmount,
    minTenureMonths,
    maxTenureMonths,
    minInterestRate,
    maxInterestRate,
    processingFeePct,
    minMonthlyIncome,
    minCibilScore,
    active,
  } = body;

  const user = c.get("user");
  const updatePayload: any = {
    updatedBy: user?.sub ?? "system",
    updatedAt: new Date().toISOString(),
  };

  if (name !== undefined) {
    if (!name.trim()) return fail(c, 400, "VALIDATION_ERROR", "Display name is required");
    updatePayload.name = name.trim();
  }

  if (lenderId !== undefined) {
    if (!lenderId) return fail(c, 400, "VALIDATION_ERROR", "Lender is required");
    const lenderExists = (await db.select().from(lenders).where(eq(lenders.id, lenderId)).limit(1))[0];
    if (!lenderExists) return fail(c, 400, "VALIDATION_ERROR", "Lender does not exist");
    updatePayload.lenderId = lenderId;
  }

  if (loanType !== undefined) {
    if (!loanType || !LOAN_TYPES.includes(loanType)) return fail(c, 400, "VALIDATION_ERROR", "Valid Loan type is required");
    updatePayload.loanType = loanType;
  }

  // Validate amount ranges
  const finalMinAmt = minAmount !== undefined ? minAmount : toRupees(existing.minAmountPaise);
  const finalMaxAmt = maxAmount !== undefined ? maxAmount : toRupees(existing.maxAmountPaise);
  if (minAmount !== undefined || maxAmount !== undefined) {
    if (typeof finalMinAmt !== "number" || finalMinAmt <= 0) return fail(c, 400, "VALIDATION_ERROR", "Minimum amount must be positive");
    if (typeof finalMaxAmt !== "number" || finalMaxAmt <= 0) return fail(c, 400, "VALIDATION_ERROR", "Maximum amount must be positive");
    if (finalMinAmt > finalMaxAmt) return fail(c, 400, "VALIDATION_ERROR", "Min amount cannot exceed max amount");
    updatePayload.minAmountPaise = Math.round(finalMinAmt * 100);
    updatePayload.maxAmountPaise = Math.round(finalMaxAmt * 100);
  }

  // Validate tenure ranges
  const finalMinTenure = minTenureMonths !== undefined ? minTenureMonths : existing.minTenureMonths;
  const finalMaxTenure = maxTenureMonths !== undefined ? maxTenureMonths : existing.maxTenureMonths;
  if (minTenureMonths !== undefined || maxTenureMonths !== undefined) {
    if (typeof finalMinTenure !== "number" || finalMinTenure <= 0) return fail(c, 400, "VALIDATION_ERROR", "Minimum tenure must be positive");
    if (typeof finalMaxTenure !== "number" || finalMaxTenure <= 0) return fail(c, 400, "VALIDATION_ERROR", "Maximum tenure must be positive");
    if (finalMinTenure > finalMaxTenure) return fail(c, 400, "VALIDATION_ERROR", "Min tenure cannot exceed max tenure");
    updatePayload.minTenureMonths = finalMinTenure;
    updatePayload.maxTenureMonths = finalMaxTenure;
  }

  // Validate interest rate ranges
  const finalMinRate = minInterestRate !== undefined ? minInterestRate : fromBps(existing.minInterestRateBps);
  const finalMaxRate = maxInterestRate !== undefined ? maxInterestRate : fromBps(existing.maxInterestRateBps);
  if (minInterestRate !== undefined || maxInterestRate !== undefined) {
    if (typeof finalMinRate !== "number" || finalMinRate < 0) return fail(c, 400, "VALIDATION_ERROR", "Minimum interest rate must be non-negative");
    if (typeof finalMaxRate !== "number" || finalMaxRate < 0) return fail(c, 400, "VALIDATION_ERROR", "Maximum interest rate must be non-negative");
    if (finalMinRate > finalMaxRate) return fail(c, 400, "VALIDATION_ERROR", "Min interest rate cannot exceed max interest rate");
    updatePayload.minInterestRateBps = Math.round(finalMinRate * 100);
    updatePayload.maxInterestRateBps = Math.round(finalMaxRate * 100);
  }

  if (processingFeePct !== undefined) {
    updatePayload.processingFeeBps = processingFeePct != null ? Math.round(processingFeePct * 100) : null;
  }
  if (minMonthlyIncome !== undefined) {
    updatePayload.minMonthlyIncomePaise = minMonthlyIncome != null ? Math.round(minMonthlyIncome * 100) : null;
  }
  if (minCibilScore !== undefined) {
    updatePayload.minCibilScore = minCibilScore != null ? minCibilScore : null;
  }
  if (active !== undefined) {
    updatePayload.active = active;
  }

  await db.update(loanProducts).set(updatePayload).where(eq(loanProducts.id, id));

  const updated = (await db.select().from(loanProducts).where(eq(loanProducts.id, id)).limit(1))[0];
  const lender = (await db.select().from(lenders).where(eq(lenders.id, updated.lenderId)).limit(1))[0];
  return ok(c, rowToApi(updated, lender));
});

// PATCH /api/v1/loan-products/:id/status (Toggle status)
route.patch("/:id/status", requireAuth, requireRole("ADMIN"), async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => null);
  if (!body || typeof body.active !== "boolean") {
    return fail(c, 400, "BAD_REQUEST", "Expected { active: boolean }");
  }

  const db = drizzle(c.env.DB);
  const existing = (await db.select().from(loanProducts).where(eq(loanProducts.id, id)).limit(1))[0];
  if (!existing) return fail(c, 404, "NOT_FOUND", "Loan product not found");

  const user = c.get("user");
  await db
    .update(loanProducts)
    .set({
      active: body.active,
      updatedBy: user?.sub ?? "system",
      updatedAt: new Date().toISOString(),
    })
    .where(eq(loanProducts.id, id));

  return ok(c, { id, active: body.active, updated: true });
});

// DELETE /api/v1/loan-products/:id (Delete product)
route.delete("/:id", requireAuth, requireRole("ADMIN"), async (c) => {
  const id = c.req.param("id");
  const db = drizzle(c.env.DB);
  const existing = (await db.select().from(loanProducts).where(eq(loanProducts.id, id)).limit(1))[0];
  if (!existing) return fail(c, 404, "NOT_FOUND", "Loan product not found");

  await db.delete(loanProducts).where(eq(loanProducts.id, id));
  return ok(c, { id, deleted: true });
});

// Eligibility endpoint (POST /api/v1/loan-products/eligibility)
route.post("/eligibility", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { loanType, amount, tenureMonths, monthlyIncome, cibilScore, city, state } = body as any;
  if (!loanType || !LOAN_TYPES.includes(loanType)) return fail(c, 400, "VALIDATION_ERROR", "loanType required");
  if (typeof amount !== "number" || amount <= 0) return fail(c, 400, "VALIDATION_ERROR", "amount required");
  const amountPaise = Math.round(amount * 100);
  const incomePaise = monthlyIncome ? Math.round(monthlyIncome * 100) : null;
  const db = drizzle(c.env.DB);

  const rows = await db.select().from(loanProducts).where(and(eq(loanProducts.active, true), eq(loanProducts.loanType, loanType)));
  const matched = rows.filter((p) => {
    if (amountPaise < p.minAmountPaise || amountPaise > p.maxAmountPaise) return false;
    if (tenureMonths && (tenureMonths < p.minTenureMonths || tenureMonths > p.maxTenureMonths)) return false;
    if (p.minMonthlyIncomePaise && incomePaise != null && incomePaise < p.minMonthlyIncomePaise) return false;
    if (p.minCibilScore && cibilScore != null && cibilScore < p.minCibilScore) return false;
    if (p.allowedCitiesJson && p.allowedCitiesJson !== "[]" && city) {
      const cities: string[] = JSON.parse(p.allowedCitiesJson);
      if (cities.length && !cities.includes(city)) return false;
    }
    if (p.allowedStatesJson && p.allowedStatesJson !== "[]" && state) {
      const states: string[] = JSON.parse(p.allowedStatesJson);
      if (states.length && !states.includes(state)) return false;
    }
    return true;
  });

  const lenderIds = [...new Set(matched.map((r) => r.lenderId))];
  const lenderRows = lenderIds.length ? await db.select().from(lenders).where(or(...lenderIds.map((id) => eq(lenders.id, id))) as any) : [];
  const byLender = new Map(lenderRows.map((l) => [l.id, l]));

  const offers = matched
    .map((p) => rowToApi(p, byLender.get(p.lenderId)))
    .sort((a, b) => (a.minInterestRate ?? 999) - (b.minInterestRate ?? 999));

  return ok(c, { count: offers.length, offers });
});

export default route;
