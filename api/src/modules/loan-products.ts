import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { and, eq, like, or } from "drizzle-orm";
import type { AppEnv } from "../env";
import { loanProducts, lenders, LOAN_TYPES } from "../db/schema";
import { ok, fail } from "../lib/envelope";

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

route.get("/", async (c) => {
  const q = c.req.query();
  const page = Math.max(1, Number(q.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(q.pageSize ?? 20)));
  const loanType = q.loanType as any;
  const search = (q.search ?? "").trim();
  const db = drizzle(c.env.DB);

  const whereClauses: any[] = [eq(loanProducts.active, true)];
  if (loanType && LOAN_TYPES.includes(loanType)) whereClauses.push(eq(loanProducts.loanType, loanType));
  if (search) whereClauses.push(or(like(loanProducts.name, `%${search}%`), like(loanProducts.slug, `%${search}%`)) as any);

  const rows = await db.select().from(loanProducts).where(and(...whereClauses));
  const totalRows = rows.length;
  const sliced = rows.slice((page - 1) * pageSize, page * pageSize);

  const lenderIds = [...new Set(sliced.map((r) => r.lenderId))];
  const lenderRows = lenderIds.length ? await db.select().from(lenders).where(or(...lenderIds.map((id) => eq(lenders.id, id))) as any) : [];
  const byLender = new Map(lenderRows.map((l) => [l.id, l]));

  return ok(c, {
    items: sliced.map((p) => rowToApi(p, byLender.get(p.lenderId))),
    total: totalRows,
    page,
    pageSize,
    totalPages: Math.ceil(totalRows / pageSize),
  });
});

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
