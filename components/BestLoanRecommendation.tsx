/**
 * Best-Loan Recommendation Engine
 * ============================================================================
 * Renders on every product page between the lender-offerings table and the
 * eligibility-criteria block. The recommendation is derived from the *same*
 * list of lenders the page is showing — single source of truth — so the
 * page's headline rate and the recommendation can never disagree.
 *
 * Inputs
 * ------
 * • `loanType`   — used only for default amount/tenure/income/CIBIL sliders.
 * • `offerings`  — the lender rows shown on the page. The component does NOT
 *                  call the backend; it parses the rate (string like
 *                  "8.75% p.a." or "9.50% – 11.50%") into a number, computes
 *                  EMI / total cost / approval probability, and scores each
 *                  row with: 60% total cost + 30% approval + 10% profile fit.
 * • `applyHref`  — destination for the "Apply" CTAs (defaults to /login).
 *
 * The hero card surfaces the single best pick. Two runners-up follow.
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Brain, Award, TrendingUp, Loader2, ChevronRight, ShieldCheck } from "lucide-react";
import type { LoanType } from "@/lib/credupe-api";

export type OfferingInput = {
  /** Display name of the bank / NBFC. */
  lender: string;
  /** Rate string from the page — "8.75% p.a.", "9.50% – 11.50%", "5.09% onwards", "NA", etc. */
  rateText: string;
  /** Optional processing-fee string — "0.50%", "1.5%", "Rs.2825 to Rs.5150", "NIL". */
  processingText?: string;
  /** Optional display product name; defaults to "<lender> <loanType>". */
  productName?: string;
};

type Offer = {
  rank: number;
  lender: string;
  product: string;
  rate: number;
  emi: number;
  procFeePct: number;
  totalCost: number;
  approval: number;
  score: number;
  reasons: string[];
};

const DEFAULTS: Record<LoanType, { amount: number; tenureMonths: number; income: number; cibil: number; minAmount: number; maxAmount: number; step: number; tenureMax: number }> = {
  HOME_LOAN:             { amount: 5_000_000, tenureMonths: 240, income: 120_000, cibil: 760, minAmount: 500_000,  maxAmount: 100_000_000, step: 500_000, tenureMax: 360 },
  LOAN_AGAINST_PROPERTY: { amount: 5_000_000, tenureMonths: 180, income: 120_000, cibil: 750, minAmount: 500_000,  maxAmount: 5_000_0000,  step: 500_000, tenureMax: 240 },
  CAR_LOAN:              { amount: 1_000_000, tenureMonths: 60,  income: 80_000,  cibil: 745, minAmount: 100_000,  maxAmount: 10_000_000,  step: 100_000, tenureMax: 84 },
  USED_CAR_LOAN:         { amount: 500_000,   tenureMonths: 48,  income: 70_000,  cibil: 730, minAmount: 100_000,  maxAmount: 5_000_000,   step: 100_000, tenureMax: 60 },
  TWO_WHEELER_LOAN:      { amount: 120_000,   tenureMonths: 36,  income: 35_000,  cibil: 700, minAmount: 30_000,   maxAmount: 500_000,     step: 10_000,  tenureMax: 60 },
  PERSONAL_LOAN:         { amount: 500_000,   tenureMonths: 36,  income: 80_000,  cibil: 740, minAmount: 50_000,   maxAmount: 4_000_000,   step: 50_000,  tenureMax: 84 },
  EDUCATION_LOAN:        { amount: 2_000_000, tenureMonths: 120, income: 60_000,  cibil: 720, minAmount: 100_000,  maxAmount: 15_000_000,  step: 100_000, tenureMax: 180 },
  BUSINESS_LOAN:         { amount: 2_500_000, tenureMonths: 60,  income: 200_000, cibil: 740, minAmount: 100_000,  maxAmount: 50_000_000,  step: 100_000, tenureMax: 84 },
  GOLD_LOAN:             { amount: 200_000,   tenureMonths: 12,  income: 50_000,  cibil: 700, minAmount: 25_000,   maxAmount: 5_000_000,   step: 25_000,  tenureMax: 36 },
  MICRO_LOAN:            { amount: 50_000,    tenureMonths: 24,  income: 25_000,  cibil: 680, minAmount: 10_000,   maxAmount: 500_000,     step: 5_000,   tenureMax: 60 },
  CREDIT_CARD:           { amount: 100_000,   tenureMonths: 12,  income: 50_000,  cibil: 720, minAmount: 50_000,   maxAmount: 1_000_000,   step: 10_000,  tenureMax: 36 },
};

const LABEL: Record<LoanType, string> = {
  HOME_LOAN: "home loan",
  LOAN_AGAINST_PROPERTY: "loan against property",
  CAR_LOAN: "car loan",
  USED_CAR_LOAN: "used car loan",
  TWO_WHEELER_LOAN: "two-wheeler loan",
  PERSONAL_LOAN: "personal loan",
  EDUCATION_LOAN: "education loan",
  BUSINESS_LOAN: "business loan",
  GOLD_LOAN: "gold loan",
  MICRO_LOAN: "micro loan",
  CREDIT_CARD: "credit card",
};

const inr = (n: number) =>
  n >= 10_000_000 ? `₹${(n / 10_000_000).toFixed(2)} Cr`
  : n >= 100_000 ? `₹${(n / 100_000).toFixed(2)} L`
  : `₹${Math.round(n).toLocaleString("en-IN")}`;
const inrFull = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/**
 * Parse a rate string into the *starting* (lowest) numeric rate.
 * "8.75% p.a."          → 8.75
 * "9.50% – 11.50%"      → 9.50
 * "8.0 - 9.75%"         → 8.0   (range with only trailing %)
 * "9.25% onwards"       → 9.25
 * "NA" / "Depends on…"  → null
 */
function parseRate(text: string): number | null {
  if (!text) return null;
  // Just grab the first decimal number that appears — handles all of:
  //   "8.75% p.a."  /  "9.50% – 11.50%"  /  "8.0 - 9.75%"  /  "5.09% onwards"
  // and rejects "NA" / "Depends on the applicant's profile".
  const m = text.match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const v = Number(m[1]);
  return Number.isFinite(v) ? v : null;
}

/**
 * Parse a processing-fee string into a percent number. We only handle %-based
 * fees; flat-fee or "NIL" fall back to 0.5% (a reasonable industry default
 * so a free-fee lender doesn't artificially out-rank everyone else).
 */
function parseProcessingPct(text: string | undefined): number {
  if (!text) return 0.5;
  if (/nil|free|waived/i.test(text)) return 0;
  const m = text.match(/(\d+(?:\.\d+)?)\s*%/);
  if (!m) return 0.5;
  const v = Number(m[1]);
  return Number.isFinite(v) ? v : 0.5;
}

function emi(amount: number, ratePct: number, n: number) {
  const r = ratePct / 100 / 12;
  if (r === 0) return amount / n;
  return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function approvalProbability(rate: number, cibil: number, dtiPct: number): number {
  const cibilScore = Math.min(100, Math.max(40, (cibil - 600) / 2));
  const dtiPenalty = Math.min(35, dtiPct * 0.6);
  const rateBonus = Math.max(0, 18 - (rate - 8) * 2);
  return Math.round(Math.min(95, Math.max(50, cibilScore - dtiPenalty + rateBonus)));
}

function buildReasons(o: { rate: number; approval: number; procFeePct: number; lender: string; isLowestRate: boolean; isLowestCost: boolean }): string[] {
  const reasons: string[] = [];
  if (o.isLowestRate) reasons.push("Lowest rate among all listed lenders");
  if (o.isLowestCost && !o.isLowestRate) reasons.push("Lowest total borrowing cost");
  if (o.approval >= 90) reasons.push(`${o.approval}% approval probability for your profile`);
  if (o.procFeePct <= 0.35) reasons.push(o.procFeePct === 0 ? "No processing fee" : `Low processing fee (${o.procFeePct}%)`);
  if (/hdfc|icici|axis|sbi|kotak|bank of baroda|pnb|punjab national/i.test(o.lender)) reasons.push("Existing-customer benefits available");
  if (reasons.length < 2) reasons.push("Flexible tenure options");
  return reasons.slice(0, 3);
}

function rerankFromOfferings(
  offerings: OfferingInput[],
  loanType: LoanType,
  amount: number,
  tenureMonths: number,
  income: number,
  cibil: number,
): Offer[] {
  const scored = offerings
    .map((o) => {
      const rate = parseRate(o.rateText);
      if (rate == null) return null;
      const procFeePct = parseProcessingPct(o.processingText);
      const monthlyEmi = emi(amount, rate, tenureMonths);
      const procFee = (procFeePct / 100) * amount;
      const totalCost = monthlyEmi * tenureMonths + procFee;
      const dtiPct = income > 0 ? (monthlyEmi / income) * 100 : 100;
      const approval = approvalProbability(rate, cibil, dtiPct);
      return {
        lender: o.lender,
        product: o.productName ?? `${o.lender} ${LABEL[loanType].replace(/\b\w/g, (c) => c.toUpperCase())}`,
        rate,
        emi: Math.round(monthlyEmi),
        procFeePct,
        totalCost,
        approval,
      };
    })
    .filter(Boolean) as Array<{
      lender: string; product: string; rate: number; emi: number;
      procFeePct: number; totalCost: number; approval: number;
    }>;

  if (!scored.length) return [];
  const lowestRate = Math.min(...scored.map((o) => o.rate));
  const lowestCost = Math.min(...scored.map((o) => o.totalCost));

  return scored
    .map((o) => {
      // Composite: 60% cost (normalised so lowestCost == max contribution), 30% approval, 10% profile fit (low-rate bonus).
      const score = (lowestCost / o.totalCost) * 60 + o.approval * 0.3 + (o.rate <= lowestRate + 0.05 ? 10 : o.rate <= lowestRate + 0.5 ? 5 : 0);
      const reasons = buildReasons({
        rate: o.rate, approval: o.approval, procFeePct: o.procFeePct, lender: o.lender,
        isLowestRate: Math.abs(o.rate - lowestRate) < 0.01,
        isLowestCost: Math.abs(o.totalCost - lowestCost) < 1,
      });
      return { ...o, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((o, i) => ({ ...o, rank: i + 1 }));
}

export function BestLoanRecommendation({
  loanType,
  offerings,
  applyHref = "/login",
}: {
  loanType: LoanType;
  offerings: OfferingInput[];
  applyHref?: string;
}) {
  const defaults = DEFAULTS[loanType];
  const [amount, setAmount] = useState(defaults.amount);
  const [tenureMonths, setTenureMonths] = useState(defaults.tenureMonths);
  const [income, setIncome] = useState(defaults.income);
  const [cibil, setCibil] = useState(defaults.cibil);
  const [ready, setReady] = useState(false);

  // Run computation client-side only (avoids SSR/CSR hydration mismatch on tiny rounding diffs).
  useEffect(() => { setReady(true); }, []);

  const offers = useMemo(
    () => rerankFromOfferings(offerings, loanType, amount, tenureMonths, income, cibil),
    [offerings, loanType, amount, tenureMonths, income, cibil],
  );

  const best = offers[0];
  const runnersUp = offers.slice(1, 3);
  const tenureYears = useMemo(() => Math.round(tenureMonths / 12), [tenureMonths]);
  const monthlySavingVsAvg = useMemo(() => {
    if (!best || offers.length < 2) return 0;
    const avgEmi = offers.reduce((s, o) => s + o.emi, 0) / offers.length;
    return Math.max(0, Math.round(avgEmi - best.emi));
  }, [best, offers]);

  return (
    <section className="scroll-mt-24 mb-10" data-testid={`best-loan-rec-${loanType.toLowerCase()}`}>
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/8 via-background to-[hsl(275_45%_58%)]/8 overflow-hidden">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-primary/15 flex items-start justify-between flex-wrap gap-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-primary tracking-widest uppercase mb-1">Credu AI · Best loan recommendation</div>
              <h2 className="text-lg md:text-xl font-bold text-foreground leading-snug">
                The best {LABEL[loanType]} for your profile — from the {offerings.length} lenders above
              </h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
                Ranked using the rates shown above. Composite score: total cost (60%) + approval probability (30%) + profile fit (10%).
              </p>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="px-5 md:px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-3 bg-card/40 border-b border-primary/10">
          <Field label="Loan amount" value={inr(amount)}>
            <input
              type="range" min={defaults.minAmount} max={defaults.maxAmount} step={defaults.step}
              value={amount} onChange={(e) => setAmount(Number(e.target.value))}
              data-testid="best-rec-input-amount" className="w-full accent-primary"
            />
          </Field>
          <Field label="Tenure" value={`${tenureYears} yr`}>
            <input
              type="range" min={6} max={defaults.tenureMax} step={6}
              value={tenureMonths} onChange={(e) => setTenureMonths(Number(e.target.value))}
              data-testid="best-rec-input-tenure" className="w-full accent-primary"
            />
          </Field>
          <Field label="Monthly income" value={inrFull(income)}>
            <input
              type="range" min={15_000} max={500_000} step={5_000}
              value={income} onChange={(e) => setIncome(Number(e.target.value))}
              data-testid="best-rec-input-income" className="w-full accent-primary"
            />
          </Field>
          <Field label="CIBIL score" value={String(cibil)}>
            <input
              type="range" min={600} max={850} step={5}
              value={cibil} onChange={(e) => setCibil(Number(e.target.value))}
              data-testid="best-rec-input-cibil" className="w-full accent-primary"
            />
          </Field>
        </div>

        {/* Body */}
        <div className="p-5 md:p-6">
          {!ready && (
            <div className="flex items-center justify-center py-10 gap-3 text-sm text-muted-foreground">
              <Loader2 className="w-5 h-5 text-primary animate-spin" /> Analysing the lenders above…
            </div>
          )}

          {ready && !best && (
            <div className="text-center py-10 text-sm text-muted-foreground">
              Couldn't pick a recommendation — the rates above weren't in a parseable format.
            </div>
          )}

          {ready && best && (
            <div className="space-y-4" data-testid="best-loan-rec-results">
              {/* Hero: best pick */}
              <div className="rounded-xl border-2 border-primary bg-card p-5 md:p-6 flex flex-wrap items-start gap-5 relative overflow-hidden" data-testid="best-loan-rec-best">
                <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-primary text-primary-foreground text-[10px] font-bold tracking-widest">
                  BEST FOR YOU
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                  <Award className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-[240px]">
                  <h3 className="text-lg md:text-xl font-bold text-foreground" data-testid="best-loan-rec-best-lender">{best.lender}</h3>
                  <div className="text-xs text-muted-foreground">{best.product}</div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {best.reasons.map((w) => (
                      <span key={w} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/12 text-primary text-[10px] font-semibold">
                        <Sparkles className="w-3 h-3" /> {w}
                      </span>
                    ))}
                  </div>
                  {monthlySavingVsAvg > 0 && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
                      <TrendingUp className="w-3 h-3" />
                      Saves {inrFull(monthlySavingVsAvg)}/mo vs the average of these 3
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4 sm:gap-5">
                  <Stat label="Rate" value={`${best.rate.toFixed(2)}%`} accent dataTestId="best-loan-rec-best-rate" />
                  <Stat label="EMI" value={inrFull(best.emi)} />
                  <Stat label="Approval" value={`${best.approval}%`} accent />
                </div>
                <Link
                  to={applyHref}
                  data-testid="best-loan-rec-apply-best"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 self-center"
                >
                  Apply with this lender
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Runners-up */}
              {runnersUp.length > 0 && (
                <div className="grid md:grid-cols-2 gap-3">
                  {runnersUp.map((o) => (
                    <div key={`${o.lender}-${o.rank}`} data-testid={`best-loan-rec-rank-${o.rank}`} className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <span className="text-base font-bold text-foreground">#{o.rank}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-foreground truncate">{o.lender}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{o.product}</div>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                          <span className="text-primary font-semibold">{o.rate.toFixed(2)}%</span>
                          <span>EMI {inrFull(o.emi)}</span>
                          <span>· {o.approval}% approval</span>
                        </div>
                      </div>
                      <Link
                        to={applyHref}
                        data-testid={`best-loan-rec-apply-${o.rank}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary/40 text-primary text-[11px] font-semibold hover:bg-primary/8 whitespace-nowrap"
                      >
                        Apply <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer trust line */}
              <div className="flex items-start gap-2 pt-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <p>
                  Recommendations are derived from the {offerings.length} lender offerings listed above. We do <strong className="text-foreground">not</strong> charge customers — lenders pay us a referral fee, equal across all partners, so our ranking stays unbiased.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="text-xs font-bold text-foreground">{value}</span>
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value, accent, dataTestId }: { label: string; value: string; accent?: boolean; dataTestId?: string }) {
  return (
    <div className="text-center sm:text-left">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
      <div data-testid={dataTestId} className={`text-base font-bold ${accent ? "text-primary" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

export default BestLoanRecommendation;
