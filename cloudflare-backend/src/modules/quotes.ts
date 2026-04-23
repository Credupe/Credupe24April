import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { and, eq, isNull } from "drizzle-orm";
import type { AppEnv } from "../env";
import { quotes, loanProducts, lenders, LOAN_TYPES } from "../db/schema";
import { ok, fail } from "../lib/envelope";
import { optionalAuth, requireAuth } from "../middleware/auth";
import { newId, newSlug } from "../lib/ids";

const route = new Hono<AppEnv>();

// Reuse the eligibility logic inline (simplified).
async function rankOffers(db: any, input: any) {
  const rows = await db.select().from(loanProducts).where(
    and(eq(loanProducts.active, true), eq(loanProducts.loanType, input.loanType))
  );
  const amountPaise = Math.round(input.amount * 100);
  const incomePaise = input.monthlyIncome ? Math.round(input.monthlyIncome * 100) : null;
  const matched = rows.filter((p: any) => {
    if (amountPaise < p.minAmountPaise || amountPaise > p.maxAmountPaise) return false;
    if (input.tenureMonths && (input.tenureMonths < p.minTenureMonths || input.tenureMonths > p.maxTenureMonths)) return false;
    if (p.minMonthlyIncomePaise && incomePaise != null && incomePaise < p.minMonthlyIncomePaise) return false;
    if (p.minCibilScore && input.cibilScore != null && input.cibilScore < p.minCibilScore) return false;
    return true;
  });
  const lenderIds = [...new Set(matched.map((r: any) => r.lenderId))];
  const lenderRows = lenderIds.length ? await db.select().from(lenders) : [];
  const byLender = new Map(lenderRows.map((l: any) => [l.id, l]));
  return matched.map((p: any) => {
    const l: any = byLender.get(p.lenderId);
    // Simple EMI calc
    const principal = amountPaise / 100;
    const rateMonthly = (p.minInterestRateBps / 100) / 12 / 100;
    const n = input.tenureMonths || p.minTenureMonths;
    const emi = rateMonthly > 0
      ? (principal * rateMonthly * Math.pow(1 + rateMonthly, n)) / (Math.pow(1 + rateMonthly, n) - 1)
      : principal / n;
    return {
      productId: p.id,
      lender: l ? { id: l.id, name: l.name, slug: l.slug, logoUrl: l.logoUrl } : null,
      productName: p.name,
      loanType: p.loanType,
      minRate: p.minInterestRateBps / 100,
      maxRate: p.maxInterestRateBps / 100,
      processingFeePct: p.processingFeeBps ? p.processingFeeBps / 100 : null,
      estEmi: Math.round(emi),
      tenureMonths: n,
      amount: principal,
    };
  }).sort((a: any, b: any) => a.minRate - b.minRate);
}

route.post("/", optionalAuth, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { loanType, amount, tenureMonths, monthlyIncome, cibilScore, city, state, fullName, mobile, email } = body as any;
  if (!loanType || !LOAN_TYPES.includes(loanType)) return fail(c, 400, "VALIDATION_ERROR", "loanType required");
  if (typeof amount !== "number" || amount <= 0) return fail(c, 400, "VALIDATION_ERROR", "amount required");
  if (!tenureMonths) return fail(c, 400, "VALIDATION_ERROR", "tenureMonths required");
  const db = drizzle(c.env.DB);
  const offers = await rankOffers(db, { loanType, amount, tenureMonths, monthlyIncome, cibilScore, city, state });
  if (!offers.length) return fail(c, 422, "NO_MATCHING_OFFER", "No offers match the given criteria");
  const id = newId("q");
  const user = c.get("user");
  await db.insert(quotes).values({
    id,
    userId: user?.sub ?? null,
    loanType,
    amountPaise: Math.round(amount * 100),
    tenureMonths,
    monthlyIncomePaise: monthlyIncome ? Math.round(monthlyIncome * 100) : null,
    cibilScore: cibilScore ?? null,
    city: city ?? null,
    state: state ?? null,
    offersJson: JSON.stringify(offers),
    fullName: fullName ?? null,
    mobile: mobile ?? null,
    email: email ?? null,
  });
  return ok(c, { id, loanType, amount, tenureMonths, count: offers.length, offers });
});

route.get("/:id", optionalAuth, async (c) => {
  const id = c.req.param("id");
  const db = drizzle(c.env.DB);
  const row = (await db.select().from(quotes).where(eq(quotes.id, id)).limit(1))[0];
  if (!row) return fail(c, 404, "NOT_FOUND", "Quote not found");
  return ok(c, {
    id: row.id,
    loanType: row.loanType,
    amount: row.amountPaise / 100,
    tenureMonths: row.tenureMonths,
    offers: JSON.parse(row.offersJson),
    createdAt: row.createdAt,
  });
});

route.post("/:id/share", requireAuth, async (c) => {
  const id = c.req.param("id");
  const db = drizzle(c.env.DB);
  const row = (await db.select().from(quotes).where(eq(quotes.id, id)).limit(1))[0];
  if (!row) return fail(c, 404, "NOT_FOUND", "Quote not found");
  const slug = newSlug(10);
  const expires = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
  await db.update(quotes).set({ shareSlug: slug, shareExpiresAt: expires }).where(eq(quotes.id, id));
  return ok(c, { slug, url: `/quotes/s/${slug}`, expiresAt: expires });
});

route.get("/s/:slug", async (c) => {
  const slug = c.req.param("slug");
  const db = drizzle(c.env.DB);
  const row = (await db.select().from(quotes).where(eq(quotes.shareSlug, slug)).limit(1))[0];
  if (!row) return fail(c, 404, "NOT_FOUND", "Shared quote not found");
  if (row.shareExpiresAt && new Date(row.shareExpiresAt) < new Date()) return fail(c, 410, "EXPIRED", "Share link expired");
  // Strip PII
  return ok(c, {
    loanType: row.loanType,
    amount: row.amountPaise / 100,
    tenureMonths: row.tenureMonths,
    offers: JSON.parse(row.offersJson),
    createdAt: row.createdAt,
  });
});

route.post("/:id/apply", requireAuth, async (c) => {
  // Stub — the loan-applications module owns creation; this endpoint just
  // records the user intent. Frontend currently POSTs to /loan-applications.
  return ok(c, { applied: true, quoteId: c.req.param("id") });
});

export default route;
