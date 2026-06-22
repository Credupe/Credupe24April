/**
 * Loan-Intelligence portfolio service.
 *
 * Architecture decision: the Sahamati AA flow is wired end-to-end at the API
 * boundary (request consent → poll → sync) but the actual data-fetch step is
 * MOCKED for v1 — populating Mr. Sharma's seed portfolio so the marketing
 * narrative is demonstrable. To go live, replace `fetchAccountsFromAA()` with
 * a real Setu / Finvu / OneMoney FIU call and Sahamati certification.
 */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoanType, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { LoanApplicationsService } from '../loan-applications/loan-applications.service';

type LoanRow = {
  id: string;
  source: string;
  lender: string;
  productName: string | null;
  loanType: LoanType;
  outstanding: number;          // ₹
  emi: number;                  // ₹ / month
  rate: number;                 // % p.a.
  marketRate: number | null;    // % p.a.
  tenureLeftMonths: number;
  disbursedOn: string | null;
};

const PAISE = 100;
const BPS = 100;

function toRow(l: any): LoanRow {
  return {
    id: l.id,
    source: l.source,
    lender: l.lenderName,
    productName: l.productName,
    loanType: l.loanType,
    outstanding: Number(l.outstandingPaise) / PAISE,
    emi: Number(l.emiPaise) / PAISE,
    rate: l.rateBps / BPS,
    marketRate: l.marketRateBps != null ? l.marketRateBps / BPS : null,
    tenureLeftMonths: l.tenureLeftMonths,
    disbursedOn: l.disbursedOn ? l.disbursedOn.toISOString() : null,
  };
}

function emi(principal: number, ratePct: number, n: number): number {
  const r = ratePct / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function computeInsights(loans: LoanRow[]) {
  // Only flag a refinance opportunity if the gap exceeds 25 bps —
  // anything tighter isn't worth a balance-transfer's processing fee.
  return loans
    .filter((l) => l.marketRate != null && l.rate > l.marketRate + 0.25)
    .map((l) => {
      const newEmi = emi(l.outstanding, l.marketRate!, l.tenureLeftMonths);
      const monthlySaving = Math.max(0, l.emi - newEmi);
      return {
        loanId: l.id,
        kind: 'BALANCE_TRANSFER',
        loanType: l.loanType,
        currentLender: l.lender,
        currentRate: l.rate,
        suggestedRate: l.marketRate,
        currentEmi: l.emi,
        newEmi,
        monthlySaving,
        lifetimeSaving: monthlySaving * l.tenureLeftMonths,
        reason: `Your current rate is ${l.rate.toFixed(2)}%, today's best market rate is ${l.marketRate!.toFixed(2)}%.`,
      };
    })
    .sort((a, b) => b.monthlySaving - a.monthlySaving);
}

function summarise(loans: LoanRow[]) {
  const totalOutstanding = loans.reduce((s, l) => s + l.outstanding, 0);
  const totalEmi = loans.reduce((s, l) => s + l.emi, 0);
  const wAvgRate =
    totalOutstanding === 0 ? 0 : loans.reduce((s, l) => s + l.rate * l.outstanding, 0) / totalOutstanding;
  return {
    totalOutstanding,
    totalEmi,
    weightedAvgRate: wAvgRate,
    lenderCount: new Set(loans.map((l) => l.lender)).size,
    loanCount: loans.length,
  };
}

// ─── Mr. Sharma demo scenario — used for /demo and as the AA-sync payload ─
function mrSharmaSeed(userId: string): Prisma.AggregatedLoanCreateManyInput[] {
  const now = new Date();
  return [
    {
      userId,
      source: 'AA',
      lenderName: 'Axis Bank',
      productName: 'Axis Home Loan',
      loanType: LoanType.HOME_LOAN,
      outstandingPaise: BigInt(20_000_000) * BigInt(PAISE),  // ₹2 Cr
      emiPaise: BigInt(215_000) * BigInt(PAISE),
      rateBps: 940,
      marketRateBps: 850,
      tenureLeftMonths: 228,
      disbursedOn: new Date('2022-04-15'),
      externalAccountId: `aa-mock-home-${userId.slice(0, 6)}`,
    },
    {
      userId,
      source: 'AA',
      lenderName: 'ICICI Bank',
      productName: 'ICICI Personal Loan',
      loanType: LoanType.PERSONAL_LOAN,
      outstandingPaise: BigInt(1_000_000) * BigInt(PAISE),   // ₹10 L
      emiPaise: BigInt(35_000) * BigInt(PAISE),
      rateBps: 1499,
      marketRateBps: 1075,
      tenureLeftMonths: 34,
      disbursedOn: new Date('2023-09-10'),
      externalAccountId: `aa-mock-pl-${userId.slice(0, 6)}`,
    },
  ];
}

@Injectable()
export class PortfolioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly applications: LoanApplicationsService,
  ) {}

  /** Logged-in user's portfolio (real DB rows + computed insights). */
  async getPortfolio(userId: string) {
    const rows = await this.prisma.aggregatedLoan.findMany({
      where: { userId, active: true, deletedAt: null },
      orderBy: { outstandingPaise: 'desc' },
    });
    const loans = rows.map(toRow);
    return {
      loans,
      summary: summarise(loans),
      insights: computeInsights(loans),
      hasData: loans.length > 0,
    };
  }

  /** Anonymous fallback for marketing pages. Pure Mr. Sharma scenario. */
  getDemoPortfolio() {
    const loans: LoanRow[] = [
      {
        id: 'demo_home', source: 'DEMO', lender: 'Axis Bank', productName: 'Axis Home Loan',
        loanType: LoanType.HOME_LOAN, outstanding: 20_000_000, emi: 215_000,
        rate: 9.40, marketRate: 8.50, tenureLeftMonths: 228, disbursedOn: '2022-04-15',
      },
      {
        id: 'demo_pl', source: 'DEMO', lender: 'ICICI Bank', productName: 'ICICI Personal Loan',
        loanType: LoanType.PERSONAL_LOAN, outstanding: 1_000_000, emi: 35_000,
        rate: 14.99, marketRate: 10.75, tenureLeftMonths: 34, disbursedOn: '2023-09-10',
      },
    ];
    return { loans, summary: summarise(loans), insights: computeInsights(loans), hasData: true, demo: true };
  }

  // ── Sahamati AA mock flow ────────────────────────────────────────────
  async requestAAConsent(userId: string) {
    const handle = `aa-${randomUUID()}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min consent window
    // In real Sahamati flow: this returns a deep-link URL that opens the
    // customer's chosen AA app (OneMoney, Finvu, CAMS, NADL, Anumati…).
    const redirectUrl = `https://aa-mock.credupe.local/consent/${handle}`;
    const c = await this.prisma.aAConsent.create({
      data: { userId, handle, redirectUrl, expiresAt, status: 'PENDING' },
    });
    return {
      consentHandle: c.handle,
      redirectUrl: c.redirectUrl,
      status: c.status,
      expiresAt: c.expiresAt.toISOString(),
      mocked: true,
      providerNote: 'Sahamati AA — MOCK. Replace with Setu/Finvu/OneMoney FIU call for production.',
    };
  }

  async getConsentStatus(userId: string, handle: string) {
    const c = await this.prisma.aAConsent.findUnique({ where: { handle } });
    if (!c || c.userId !== userId) throw new NotFoundException('Consent not found');
    if (c.status === 'PENDING' && c.expiresAt > new Date()) {
      // Auto-advance after ~3 seconds since `requestedAt` (mock "user approved in AA app")
      if (Date.now() - c.requestedAt.getTime() > 3000) {
        const updated = await this.prisma.aAConsent.update({
          where: { handle },
          data: { status: 'APPROVED', approvedAt: new Date() },
        });
        return { status: updated.status, approvedAt: updated.approvedAt?.toISOString() };
      }
    }
    if (c.status === 'PENDING' && c.expiresAt <= new Date()) {
      const updated = await this.prisma.aAConsent.update({
        where: { handle },
        data: { status: 'EXPIRED', errorReason: 'Consent window expired' },
      });
      return { status: updated.status, errorReason: updated.errorReason };
    }
    return {
      status: c.status,
      approvedAt: c.approvedAt?.toISOString() ?? null,
      consumedAt: c.consumedAt?.toISOString() ?? null,
    };
  }

  async syncFromAA(userId: string, handle: string) {
    const c = await this.prisma.aAConsent.findUnique({ where: { handle } });
    if (!c || c.userId !== userId) throw new NotFoundException('Consent not found');
    if (c.status !== 'APPROVED') throw new BadRequestException(`Cannot sync; consent status is ${c.status}`);

    // In production: this is where you'd call Setu / Finvu / OneMoney to
    // pull the user's financial information packets (FI Packets) and parse
    // the loan tradelines out of them. For now we replay Mr. Sharma's seed.
    const accountsFromAA = mrSharmaSeed(userId);

    // Idempotent sync: upsert by externalAccountId; soft-delete loans no
    // longer present in the AA pull.
    const existing = await this.prisma.aggregatedLoan.findMany({
      where: { userId, deletedAt: null },
      select: { id: true, externalAccountId: true },
    });
    const incomingIds = new Set(accountsFromAA.map((a) => a.externalAccountId).filter(Boolean));
    const toDeactivate = existing.filter((e) => e.externalAccountId && !incomingIds.has(e.externalAccountId));

    for (const acc of accountsFromAA) {
      const found = existing.find((e) => e.externalAccountId === acc.externalAccountId);
      if (found) {
        await this.prisma.aggregatedLoan.update({
          where: { id: found.id },
          data: { ...acc, active: true, deletedAt: null },
        });
      } else {
        await this.prisma.aggregatedLoan.create({ data: acc });
      }
    }
    if (toDeactivate.length) {
      await this.prisma.aggregatedLoan.updateMany({
        where: { id: { in: toDeactivate.map((t) => t.id) } },
        data: { active: false, deletedAt: new Date() },
      });
    }
    await this.prisma.aAConsent.update({
      where: { handle },
      data: { status: 'CONSUMED', consumedAt: new Date() },
    });
    return { synced: accountsFromAA.length, deactivated: toDeactivate.length, status: 'CONSUMED' };
  }

  async removeLoan(userId: string, id: string) {
    const row = await this.prisma.aggregatedLoan.findUnique({ where: { id } });
    if (!row || row.userId !== userId) throw new NotFoundException('Loan not found');
    await this.prisma.aggregatedLoan.update({
      where: { id },
      data: { active: false, deletedAt: new Date() },
    });
    return { id, removed: true };
  }

  /**
   * 1-click balance transfer: convert an existing aggregated loan into a
   * pre-filled `LoanApplication` (status=LEAD) so the customer can complete
   * KYC + docs in the standard pipeline. The portfolio row is preserved
   * — it'll be marked closed only after the new loan disburses.
   *
   * `targetLender` / `targetRatePct` come from the AI insight card the user
   * clicked on the dashboard. We pick a matching product on the new lender
   * (best match by `loanType + interestRatePct`), and stash the BT context
   * on `formData` so the underwriting team can pull the foreclosure letter.
   */
  async applyBalanceTransfer(
    userId: string,
    loanId: string,
    input: { targetLender?: string; targetRatePct?: number; expectedMonthlySaving?: number; expectedLifetimeSaving?: number; productId?: string },
  ) {
    const loan = await this.prisma.aggregatedLoan.findUnique({ where: { id: loanId } });
    if (!loan || loan.userId !== userId || !loan.active || loan.deletedAt) {
      throw new NotFoundException('Loan not found on your portfolio');
    }

    // Try to resolve a product on the target lender (best-fit by rate). If
    // none is found we still create the LEAD without a productId — the ops
    // team picks one during underwriting.
    let productId = input.productId;
    if (!productId && input.targetLender) {
      const products = await this.prisma.loanProduct.findMany({
        where: {
          loanType: loan.loanType,
          active: true,
          lender: { name: { equals: input.targetLender, mode: 'insensitive' } },
        },
        include: { lender: { select: { name: true } } },
        orderBy: { minInterestRate: 'asc' },
        take: 5,
      });
      const target = input.targetRatePct;
      const best = target != null
        ? products.find((p) => Math.abs(Number(p.minInterestRate) - target) < 0.5) ?? products[0]
        : products[0];
      productId = best?.id;
    }
    if (!productId) {
      // Fallback — any product matching the loan type, lowest rate first.
      const fallback = await this.prisma.loanProduct.findFirst({
        where: { loanType: loan.loanType, active: true },
        orderBy: { minInterestRate: 'asc' },
      });
      productId = fallback?.id;
    }

    const outstandingRupees = Number(loan.outstandingPaise) / PAISE;
    const tenure = Math.max(6, loan.tenureLeftMonths);

    const application = await this.applications.create(userId, {
      loanType: loan.loanType,
      amountRequested: outstandingRupees,
      tenureMonths: tenure,
      productId,
      purpose: 'BALANCE_TRANSFER',
      formData: {
        sourceLoanId: loan.id,
        sourceLender: loan.lenderName,
        sourceProduct: loan.productName,
        sourceRatePct: loan.rateBps / BPS,
        sourceEmi: Number(loan.emiPaise) / PAISE,
        targetLender: input.targetLender,
        targetRatePct: input.targetRatePct,
        expectedMonthlySaving: input.expectedMonthlySaving,
        expectedLifetimeSaving: input.expectedLifetimeSaving,
        balanceTransfer: true,
      },
    });

    return {
      application,
      sourceLoanId: loan.id,
      message: 'Balance transfer application created. Track progress in your dashboard.',
    };
  }
}
