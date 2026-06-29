import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, isNull, desc, count, sum, sql } from "drizzle-orm";
import type { AppEnv } from "../env";
import { partnerProfiles, leads, commissions, commissionRules, documents } from "../db/schema";
import { ok, fail } from "../lib/envelope";
import { requireAuth, requireRole } from "../middleware/auth";

const route = new Hono<AppEnv>();

// Use authentication and partner role validation for all dashboard routes
route.use("*", requireAuth, requireRole("PARTNER", "ADMIN"));

// Helper to get partner profile from user sub
async function getPartnerByUserId(db: any, userId: string) {
  const rows = await db
    .select()
    .from(partnerProfiles)
    .where(and(eq(partnerProfiles.userId, userId), isNull(partnerProfiles.deletedAt)))
    .limit(1);
  return rows[0] ?? null;
}

// ─── GET /home: KPI tiles + status funnel ──────────────────────────────────
route.get("/home", async (c) => {
  const user = c.get("user")!;
  const db = drizzle(c.env.DB);
  const partner = await getPartnerByUserId(db, user.sub);

  if (!partner) {
    return fail(c, 404, "NOT_FOUND", "Partner profile not found");
  }

  // 1. Total Leads Count
  const totalLeadsRes = await db
    .select({ value: count() })
    .from(leads)
    .where(and(eq(leads.partnerId, partner.id), isNull(leads.deletedAt)));
  const totalLeads = totalLeadsRes[0]?.value ?? 0;

  // 2. Leads grouped by status
  const leadsByStatusRes = await db
    .select({ status: leads.status, count: count() })
    .from(leads)
    .where(and(eq(leads.partnerId, partner.id), isNull(leads.deletedAt)))
    .groupBy(leads.status);
  
  const leadsByStatus: Record<string, number> = {};
  for (const row of leadsByStatusRes) {
    if (row.status) leadsByStatus[row.status] = row.count;
  }

  // 3. Commission sums (paise in SQLite, convert to rupees / float)
  const totalCommRes = await db
    .select({ value: sum(commissions.amountPaise) })
    .from(commissions)
    .where(eq(commissions.partnerId, partner.id));
  const totalCommissionEarned = Number(totalCommRes[0]?.value ?? 0) / 100;

  const paidCommRes = await db
    .select({ value: sum(commissions.amountPaise) })
    .from(commissions)
    .where(and(eq(commissions.partnerId, partner.id), eq(commissions.status, "PAID")));
  const commissionPaid = Number(paidCommRes[0]?.value ?? 0) / 100;

  // Pending includes PENDING and APPROVED
  const pendingCommRes = await db
    .select({ value: sum(commissions.amountPaise) })
    .from(commissions)
    .where(
      and(
        eq(commissions.partnerId, partner.id),
        eq(commissions.status, "PENDING")
      )
    );
  const approvedCommRes = await db
    .select({ value: sum(commissions.amountPaise) })
    .from(commissions)
    .where(
      and(
        eq(commissions.partnerId, partner.id),
        eq(commissions.status, "APPROVED")
      )
    );
  
  const commissionPending = (Number(pendingCommRes[0]?.value ?? 0) + Number(approvedCommRes[0]?.value ?? 0)) / 100;

  // 4. Rank Calculation
  const rankRows = await db
    .select({ partnerId: commissions.partnerId, totalAmount: sum(commissions.amountPaise) })
    .from(commissions)
    .groupBy(commissions.partnerId)
    .orderBy(desc(sum(commissions.amountPaise)));

  const sortedPartnerIds = rankRows.map((r: any) => r.partnerId);
  const myIndex = sortedPartnerIds.indexOf(partner.id);
  const rank = myIndex >= 0 ? myIndex + 1 : null;

  // 5. Total Partners Active Count
  const activeCountRes = await db
    .select({ value: count() })
    .from(partnerProfiles)
    .where(isNull(partnerProfiles.deletedAt));
  const totalPartners = activeCountRes[0]?.value ?? 0;

  const conversions = leadsByStatus["CONVERTED"] ?? 0;
  const conversionRate = totalLeads ? Number(((conversions / totalLeads) * 100).toFixed(1)) : 0;

  return ok(c, {
    partner: {
      id: partner.id,
      partnerCode: partner.partnerCode,
      businessName: partner.businessName,
      tier: partner.tier ?? "BRONZE",
      kycStatus: partner.kycStatus ?? "PENDING",
      onboardingStep: partner.onboardingStep ?? "CONTACT",
      activatedAt: partner.activatedAt,
      joinedAt: partner.createdAt,
    },
    kpis: {
      totalLeads,
      conversions,
      conversionRate,
      totalCommissionEarned,
      commissionPaid,
      commissionPending,
      rank,
      totalPartners,
    },
    leadsByStatus,
  });
});

// ─── GET /earnings: Detailed Commission & Rates ────────────────────────────
route.get("/earnings", async (c) => {
  const user = c.get("user")!;
  const db = drizzle(c.env.DB);
  const partner = await getPartnerByUserId(db, user.sub);

  if (!partner) {
    return fail(c, 404, "NOT_FOUND", "Partner profile not found");
  }

  // Group commissions by status
  const byStatusRes = await db
    .select({ status: commissions.status, amountSum: sum(commissions.amountPaise), count: count() })
    .from(commissions)
    .where(eq(commissions.partnerId, partner.id))
    .groupBy(commissions.status);

  let totalPaise = 0;
  let paidPaise = 0;
  let approvedPaise = 0;
  let pendingPaise = 0;
  let reversedPaise = 0;

  for (const row of byStatusRes) {
    const val = Number(row.amountSum ?? 0);
    totalPaise += val;
    if (row.status === "PAID") paidPaise = val;
    else if (row.status === "APPROVED") approvedPaise = val;
    else if (row.status === "PENDING") pendingPaise = val;
    else if (row.status === "REVERSED") reversedPaise = val;
  }

  // Monthly breakdown: last 6 months
  // SQLite version of grouping by month. We format the YYYY-MM prefix from created_at
  const monthlyRes = await db
    .select({
      monthStr: sql<string>`strftime('%Y-%m', ${commissions.createdAt})`,
      amountSum: sum(commissions.amountPaise),
    })
    .from(commissions)
    .where(eq(commissions.partnerId, partner.id))
    .groupBy(sql`strftime('%Y-%m', ${commissions.createdAt})`)
    .orderBy(desc(sql`strftime('%Y-%m', ${commissions.createdAt})`))
    .limit(6);

  const monthly = monthlyRes
    .map((r: any) => ({
      month: r.monthStr + "-01T00:00:00.000Z", // convert to standard Date ISO
      total: Number(r.amountSum ?? 0) / 100,
    }))
    .reverse();

  // Recent 20 commissions with lead links
  // In Drizzle, we do a left join with leads to fetch customer metadata
  const recentComms = await db
    .select({
      id: commissions.id,
      amountPaise: commissions.amountPaise,
      payoutBps: commissions.payoutBps,
      status: commissions.status,
      paidAt: commissions.paidAt,
      createdAt: commissions.createdAt,
      leadId: leads.id,
      customerName: leads.customerName,
      loanType: leads.loanType,
      amountRequestedPaise: leads.amountRequestedPaise,
    })
    .from(commissions)
    .leftJoin(leads, eq(commissions.leadId, leads.id))
    .where(eq(commissions.partnerId, partner.id))
    .orderBy(desc(commissions.createdAt))
    .limit(20);

  const recent = recentComms.map((c: any) => ({
    id: c.id,
    amount: Number(c.amountPaise ?? 0) / 100,
    payoutPct: c.payoutBps ? Number(c.payoutBps) / 100 : null,
    status: c.status,
    paidAt: c.paidAt,
    createdAt: c.createdAt,
    lead: c.leadId
      ? {
          id: c.leadId,
          customerName: c.customerName,
          loanType: c.loanType,
          amountRequested: c.amountRequestedPaise ? Number(c.amountRequestedPaise) / 100 : null,
        }
      : null,
  }));

  // Rate cards (commission rules)
  const rules = await db
    .select()
    .from(commissionRules)
    .where(eq(commissionRules.active, true))
    .orderBy(commissionRules.loanType);

  const rateCard = rules.map((r: any) => ({
    loanType: r.loanType,
    ruleType: r.ruleType,
    payoutPct: r.payoutBps ? Number(r.payoutBps) / 100 : null,
    flatAmount: r.flatAmountPaise ? Number(r.flatAmountPaise) / 100 : null,
    notes: r.notes,
  }));

  return ok(c, {
    summary: {
      total: totalPaise / 100,
      paid: paidPaise / 100,
      approved: approvedPaise / 100,
      pending: pendingPaise / 100,
      reversed: reversedPaise / 100,
    },
    monthly,
    recent,
    rateCard,
  });
});

// ─── GET /leaderboard: Leaderboard Ranks ───────────────────────────────────
route.get("/leaderboard", async (c) => {
  const user = c.get("user")!;
  const metric = c.req.query("metric") || "disbursed"; // disbursed | leads | commission
  const limit = Number(c.req.query("limit") || "25");

  const db = drizzle(c.env.DB);
  const me = await getPartnerByUserId(db, user.sub);

  if (!me) {
    return fail(c, 404, "NOT_FOUND", "Partner profile not found");
  }

  interface LeaderItem {
    partnerId: string;
    value: number;
  }
  let rankRows: LeaderItem[] = [];

  if (metric === "commission") {
    const grp = await db
      .select({ partnerId: commissions.partnerId, totalAmount: sum(commissions.amountPaise) })
      .from(commissions)
      .groupBy(commissions.partnerId);
    rankRows = grp.map((g: any) => ({ partnerId: g.partnerId, value: Number(g.totalAmount ?? 0) / 100 }));
  } else if (metric === "leads") {
    // leads where status is CONVERTED or APPLICATION_CREATED
    const grp = await db
      .select({ partnerId: leads.partnerId, count: count() })
      .from(leads)
      .where(and(isNull(leads.deletedAt), eq(leads.status, "CONVERTED"))) // Simplify to converted leads for conversion value
      .groupBy(leads.partnerId);
    rankRows = grp.map((g: any) => ({ partnerId: g.partnerId, value: g.count }));
  } else {
    // disbursed amount (mocked aggregate value or sum of converted leads' amountRequestedPaise)
    const grp = await db
      .select({ partnerId: leads.partnerId, totalDisbursed: sum(leads.amountRequestedPaise) })
      .from(leads)
      .where(and(isNull(leads.deletedAt), eq(leads.status, "CONVERTED")))
      .groupBy(leads.partnerId);
    rankRows = grp.map((g: any) => ({ partnerId: g.partnerId, value: Number(g.totalDisbursed ?? 0) / 100 }));
  }

  // Get all partners to map business names and ensure all partners appear
  const allPartners = await db
    .select({
      id: partnerProfiles.id,
      partnerCode: partnerProfiles.partnerCode,
      businessName: partnerProfiles.businessName,
      city: partnerProfiles.city,
      tier: partnerProfiles.tier,
    })
    .from(partnerProfiles)
    .where(isNull(partnerProfiles.deletedAt));

  const partnerMap = new Map<string, typeof allPartners[0]>();
  for (const p of allPartners) partnerMap.set(p.id, p);

  // Fill in missing partners with 0 value
  const knownIds = new Set(rankRows.map((r) => r.partnerId));
  for (const p of allPartners) {
    if (!knownIds.has(p.id)) {
      rankRows.push({ partnerId: p.id, value: 0 });
    }
  }

  // Sort descending
  rankRows.sort((a, b) => b.value - a.value);

  const ranked = rankRows.map((r, i) => {
    const pm = partnerMap.get(r.partnerId);
    return {
      rank: i + 1,
      partnerId: r.partnerId,
      partnerCode: pm?.partnerCode ?? null,
      businessName: pm?.businessName ?? "(unknown)",
      city: pm?.city ?? null,
      tier: pm?.tier ?? "BRONZE",
      value: r.value,
      isMe: r.partnerId === me.id,
    };
  });

  const myEntry = ranked.find((r) => r.partnerId === me.id) ?? null;

  return ok(c, {
    metric,
    total: ranked.length,
    top: ranked.slice(0, limit),
    me: myEntry,
  });
});

// ─── GET /documents: KYC uploaded files ────────────────────────────────────
route.get("/documents", async (c) => {
  const user = c.get("user")!;
  const db = drizzle(c.env.DB);
  const rows = await db
    .select()
    .from(documents)
    .where(and(eq(documents.ownerUserId, user.sub), isNull(documents.deletedAt)))
    .orderBy(desc(documents.createdAt));
  
  return ok(c, rows);
});

export default route;
