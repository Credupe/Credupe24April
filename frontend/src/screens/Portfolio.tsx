import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home, Briefcase, Car, GraduationCap, Building2, CreditCard,
  Sparkles, ArrowRight, Shield, ChevronRight, AlertCircle, CheckCircle2,
  Wallet, BarChart3, IndianRupee, Brain, Zap, Loader2, RefreshCw, X, ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth, refreshCredupeAuth } from "@/hooks/useAuth";
import { credupeApi, CredupeApiError } from "@/lib/credupe-api";
import { toast } from "@/components/ui/sonner";

/* ─────────────────────── Types (mirror backend shape) ───────────────── */
type Loan = {
  id: string; source: string; lender: string; productName: string | null;
  loanType: "HOME_LOAN" | "PERSONAL_LOAN" | "CAR_LOAN" | "EDUCATION_LOAN" |
  "LOAN_AGAINST_PROPERTY" | "BUSINESS_LOAN" | "CREDIT_CARD" |
  "GOLD_LOAN" | "TWO_WHEELER_LOAN" | "USED_CAR_LOAN" | "MICRO_LOAN";
  outstanding: number; emi: number; rate: number; marketRate: number | null;
  tenureLeftMonths: number; disbursedOn: string | null;
};
type Insight = {
  loanId: string; kind: string; loanType: Loan["loanType"];
  currentLender: string; currentRate: number; suggestedRate: number;
  currentEmi: number; newEmi: number; monthlySaving: number;
  lifetimeSaving: number; reason: string;
};
type PortfolioData = {
  loans: Loan[];
  summary: { totalOutstanding: number; totalEmi: number; weightedAvgRate: number; lenderCount: number; loanCount: number };
  insights: Insight[];
  hasData: boolean;
  demo?: boolean;
};

const LOAN_META: Record<Loan["loanType"], { label: string; icon: any; tint: string }> = {
  HOME_LOAN: { label: "Home Loan", icon: Home, tint: "from-[hsl(258_60%_52%)] to-[hsl(275_45%_58%)]" },
  PERSONAL_LOAN: { label: "Personal Loan", icon: Briefcase, tint: "from-[hsl(275_45%_58%)] to-[hsl(252_55%_72%)]" },
  CAR_LOAN: { label: "Auto Loan", icon: Car, tint: "from-[hsl(258_60%_52%)] to-[hsl(252_55%_72%)]" },
  USED_CAR_LOAN: { label: "Used Car Loan", icon: Car, tint: "from-[hsl(258_60%_52%)] to-[hsl(252_55%_72%)]" },
  TWO_WHEELER_LOAN: { label: "Two-Wheeler Loan", icon: Car, tint: "from-[hsl(275_45%_58%)] to-[hsl(252_55%_72%)]" },
  EDUCATION_LOAN: { label: "Education Loan", icon: GraduationCap, tint: "from-[hsl(258_60%_52%)] to-[hsl(258_60%_42%)]" },
  LOAN_AGAINST_PROPERTY: { label: "Loan Against Property", icon: Building2, tint: "from-[hsl(258_60%_52%)] to-[hsl(252_55%_72%)]" },
  BUSINESS_LOAN: { label: "Business Loan", icon: Briefcase, tint: "from-[hsl(275_45%_58%)] to-[hsl(258_60%_52%)]" },
  GOLD_LOAN: { label: "Gold Loan", icon: Wallet, tint: "from-[hsl(258_60%_52%)] to-[hsl(252_55%_72%)]" },
  MICRO_LOAN: { label: "Micro Loan", icon: Briefcase, tint: "from-[hsl(275_45%_58%)] to-[hsl(252_55%_72%)]" },
  CREDIT_CARD: { label: "Credit Card", icon: CreditCard, tint: "from-[hsl(252_55%_72%)] to-[hsl(258_60%_52%)]" },
};

/* ─────────────────────── Helpers ──────────────────────────────────────── */
const inr = (n: number) =>
  n >= 10_000_000 ? `₹${(n / 10_000_000).toFixed(2)} Cr`
    : n >= 100_000 ? `₹${(n / 100_000).toFixed(2)} L`
      : `₹${Math.round(n).toLocaleString("en-IN")}`;
const inrFull = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const sinceLabel = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const m = Math.max(0, Math.round((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 30)));
  const y = Math.floor(m / 12); const mm = m % 12;
  return y ? `${y}y ${mm}m ago` : `${mm}m ago`;
};

/* ─────────────────────── Sahamati AA Consent Modal ─────────────────────
 * Drives the user through: idle → REQUESTING → PENDING (poll loop) →
 * APPROVED → SYNCING → CONSUMED (done). On any failure, surfaces an error.
 * In production the redirect URL opens the user's chosen AA app; here we
 * just simulate the round-trip and let the polling auto-complete in ~3s. */
type AAState = "idle" | "requesting" | "pending" | "approved" | "syncing" | "consumed" | "error";
function AAConsentModal({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: () => void }) {
  const [state, setState] = useState<AAState>("idle");
  const [handle, setHandle] = useState<string>("");
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const [polls, setPolls] = useState(0);
  // Mirror onDone into a ref so the sync effect's identity stays stable
  // across parent re-renders — otherwise the effect cancels itself before
  // the sync promise resolves and the modal hangs in the "syncing" state.
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  // Reset whenever the modal opens.
  useEffect(() => {
    if (open) { setState("idle"); setHandle(""); setRedirectUrl(""); setErr(""); setPolls(0); }
  }, [open]);

  // Poll consent status until APPROVED / EXPIRED / REJECTED.
  useEffect(() => {
    if (state !== "pending" || !handle) return;
    let cancelled = false;
    const tick = async () => {
      try {
        const data: any = await credupeApi.portfolio.consentStatus(handle);
        if (cancelled || !data) return;
        setPolls((p) => p + 1);
        if (data.status === "APPROVED") setState("approved");
        else if (data.status === "EXPIRED" || data.status === "REJECTED") {
          setErr(data.errorReason || "Consent denied"); setState("error");
        }
      } catch (e) {
        if (!cancelled) { setErr(e instanceof CredupeApiError ? e.messages[0] : "Network error"); setState("error"); }
      }
    };
    const id = setInterval(tick, 1500);
    return () => { cancelled = true; clearInterval(id); };
  }, [state, handle]);

  // Once approved, immediately sync. We MUST guard against the effect
  // self-cancelling: setting `state="syncing"` inside this effect would
  // re-run it (state is in deps) and the cleanup would null out our own
  // `.then` callback before the sync resolves. Use a ref to remember we've
  // already kicked off the sync for this consent handle.
  const syncStartedFor = useRef<string | null>(null);
  useEffect(() => {
    if (state !== "approved" || !handle) return;
    if (syncStartedFor.current === handle) return;
    syncStartedFor.current = handle;
    setState("syncing");
    credupeApi.portfolio.sync(handle)
      .then(() => { setState("consumed"); setTimeout(() => onDoneRef.current(), 900); })
      .catch((e) => { setErr(e instanceof CredupeApiError ? e.messages[0] : "Sync failed"); setState("error"); });
  }, [state, handle]);

  async function startConsent() {
    // COMMENTED OUT FOR BYPASS:
    /*
    setState("requesting"); setErr("");
    try {
      const data: any = await credupeApi.portfolio.requestConsent();
      if (!data) throw new Error("No data");
      setHandle(data.consentHandle); setRedirectUrl(data.redirectUrl); setState("pending");
    } catch (e) {
      setErr(e instanceof CredupeApiError ? e.messages[0] : "Failed to start consent");
      setState("error");
    }
    */

    // TEMPORARY BYPASS: Immediately simulate successful consent sync and close
    setState("consumed");
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mock_has_synced", "true");
    }
    setTimeout(() => {
      onDoneRef.current();
    }, 500);
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" data-testid="aa-modal">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Connect via Account Aggregator</h2>
          </div>
          <button onClick={onClose} data-testid="aa-modal-close" className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 min-h-[280px]">
          {state === "idle" && (
            <>
              <p className="text-sm text-muted-foreground">
                CreduPe uses the <strong className="text-foreground">RBI-licensed Sahamati Account Aggregator</strong> framework to fetch your loans, deposits and credit report from every bank you've used. We never see your credentials. You can revoke consent any time.
              </p>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> One-time consent (10 minute window)</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Read-only access — no money movement possible</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Aggregates Home, Personal, Auto, Education, LAP, Business loans</li>
              </ul>
              <button onClick={startConsent} data-testid="aa-modal-start" className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                Continue to Sahamati AA
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-[10px] text-muted-foreground text-center italic">Sandbox · mocked AA provider — no real account data is fetched.</div>
            </>
          )}

          {state === "requesting" && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
              <div className="text-sm font-medium text-foreground">Generating consent request…</div>
            </div>
          )}

          {state === "pending" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
                <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                <div className="text-xs text-foreground">
                  Waiting for you to approve consent in your AA app{polls > 0 && ` · polled ${polls}×`}
                </div>
              </div>
              <a href={redirectUrl} target="_blank" rel="noreferrer" data-testid="aa-modal-redirect" className="block w-full text-center px-4 py-3 rounded-xl bg-card border border-border text-xs font-semibold text-foreground hover:border-primary/40">
                <ExternalLink className="w-3.5 h-3.5 inline -mt-0.5 mr-1.5" />
                Open AA app to approve →
              </a>
              <p className="text-[11px] text-muted-foreground italic">In production this redirects to the user's chosen AA app (OneMoney, Finvu, CAMS Finserv, NADL, Anumati). In the sandbox we auto-approve after a few seconds.</p>
            </div>
          )}

          {(state === "approved" || state === "syncing") && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <RefreshCw className="w-7 h-7 text-primary animate-spin" />
              <div className="text-sm font-medium text-foreground">Pruning your loans, deposits & credit report…</div>
              <div className="text-xs text-muted-foreground">This usually takes 2–5 seconds.</div>
            </div>
          )}

          {state === "consumed" && (
            <div className="flex flex-col items-center justify-center py-8 gap-3" data-testid="aa-modal-success">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-primary" />
              </div>
              <div className="text-base font-bold text-foreground">All set!</div>
              <div className="text-sm text-muted-foreground">Your portfolio has been imported.</div>
            </div>
          )}

          {state === "error" && (
            <div className="space-y-3" data-testid="aa-modal-error">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                <div className="text-xs text-destructive">{err || "Something went wrong."}</div>
              </div>
              <button onClick={startConsent} className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Top 3 — re-rank with approval probability ─────
 * Backend `eligibility` endpoint returns lender offers sorted by rate.
 * We re-rank using a composite score that the brief specifies:
 *   total cost (60%) + approval probability (30%) + profile fit (10%).
 * Approval probability is heuristic: higher CIBIL, lower DTI → higher.
 */
function approvalProbability(rate: number, totalEmiBurden: number, cibil = 745): number {
  // Base on CIBIL, then penalise for high DTI (existing EMI / 80k assumed income)
  // and slightly penalise for higher rate (lender is being cautious).
  const cibilScore = Math.min(100, Math.max(40, (cibil - 600) / 2));
  const dti = Math.min(60, totalEmiBurden / 800);   // 80k assumed monthly income
  const rateScore = Math.max(0, 20 - (rate - 8) * 2);
  return Math.round(Math.min(95, Math.max(50, cibilScore - dti + rateScore)));
}

function rerankOffers(offers: any[], amount: number, tenureMonths: number, currentEmiBurden: number) {
  return offers.map((o) => {
    const rate = Number(o.interestRateRange?.min ?? 12);
    const r = (rate / 100) / 12;
    const emi = r === 0 ? amount / tenureMonths
      : (amount * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
    const procFee = Number(o.processingFeePct ?? 0.5) / 100 * amount;
    const totalCost = emi * tenureMonths + procFee;
    const approval = approvalProbability(rate, currentEmiBurden);
    // composite — lower totalCost is better (inverted), higher approval is better
    const score = (1_000_000 / totalCost) * 60 + approval * 30 + (rate < 9 ? 10 : rate < 10 ? 5 : 0);
    return {
      lender: o.lender?.name ?? "Lender",
      logoUrl: o.lender?.logoUrl ?? null,
      product: o.productName,
      rate,
      emi: Math.round(emi),
      procFeePct: Number(o.processingFeePct ?? 0.5),
      totalCost,
      approval,
      score,
      reasons: buildReasons(rate, approval, Number(o.processingFeePct ?? 0.5), o.lender?.name),
    };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((o, i) => ({ ...o, rank: i + 1 }));
}

function buildReasons(rate: number, approval: number, fee: number, lender?: string) {
  const why: string[] = [];
  if (rate <= 9) why.push("Lowest rate among matches");
  if (approval >= 90) why.push(`${approval}% approval probability`);
  if (fee <= 0.3) why.push(`Lowest processing fee (${fee}%)`);
  if (lender?.toLowerCase().includes("hdfc") || lender?.toLowerCase().includes("icici")) why.push("Existing-customer benefits");
  if (why.length < 2) why.push("Solid tenure flexibility");
  return why.slice(0, 3);
}

/* ─────────────────────── Page ─────────────────────────────────────────── */
const Portfolio = () => {
  const { user, isReady } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [aaOpen, setAAOpen] = useState(false);
  const [topOffers, setTopOffers] = useState<any[]>([]);
  const [applyingBT, setApplyingBT] = useState<string | null>(null);
  const [appliedBT, setAppliedBT] = useState<Record<string, string>>({});

  async function handleApplyBalanceTransfer(ins: Insight) {
    if (!user) {
     try {
        sessionStorage.setItem("credupe_bt_intent", JSON.stringify({ loanId: ins.loanId }));
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[portfolio] sessionStorage stash failed:", err);
        }
      }
      navigate("/login");
      return;
    }
    if (applyingBT) return;
    setApplyingBT(ins.loanId);
    try {
      const res = await credupeApi.portfolio.applyBalanceTransfer(ins.loanId, {
        targetLender: undefined,           
        targetRatePct: ins.suggestedRate,
        expectedMonthlySaving: ins.monthlySaving,
        expectedLifetimeSaving: ins.lifetimeSaving,
      });
      const refNo = res?.application?.referenceNo || res?.application?.id || "submitted";
      setAppliedBT((m) => ({ ...m, [ins.loanId]: refNo }));
      toast.success("Balance transfer initiated", {
        description: `Application ${refNo} created. Track it in your dashboard.`,
      });
    } catch (e) {
      const msg = e instanceof CredupeApiError ? e.messages[0] : "Could not start balance transfer. Please try again.";
      toast.error("Couldn't start balance transfer", { description: msg });
    } finally {
      setApplyingBT(null);
    }
  }

  const reload = async () => {
    setLoading(true);
    try {
      const portfolio = user
        ? await credupeApi.portfolio.me()
        : await credupeApi.portfolio.demo();
      setData(portfolio as PortfolioData);
    } catch (e) {
       if (process.env.NODE_ENV !== "production") {
        console.warn("[portfolio] /me failed, falling back to /demo:", e);
      }
      try {
        const fallback = await credupeApi.portfolio.demo();
        setData(fallback as PortfolioData);
      } catch (e2) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[portfolio] /demo also failed:", e2);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isReady) return;
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, user?.id]);
 useEffect(() => {
    if (!data) return;
    let cancelled = false;
    credupeApi.loanProducts.eligibility({
      loanType: "CAR_LOAN", amount: 1_000_000, tenureMonths: 60,
      monthlyIncome: 80_000, cibilScore: 745, city: "Mumbai",
    }).then((res) => {
      if (cancelled || !res.offers) return;
      setTopOffers(rerankOffers(res.offers, 1_000_000, 60, data.summary.totalEmi));
    }).catch(() => { /* keep silent; section just won't render */ });
    return () => { cancelled = true; };
  }, [data]);

  const totalMonthlySaving = useMemo(
    () => (data?.insights ?? []).reduce((s, i) => s + i.monthlySaving, 0),
    [data],
  );
  const totalAnnualSaving = totalMonthlySaving * 12;
  const totalLifetimeSaving = useMemo(
    () => (data?.insights ?? []).reduce((s, i) => s + i.lifetimeSaving, 0),
    [data],
  );

  if (!isReady) return <FullPageSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Header ────────────────────────────────────────────────────── */}
      <section className="container pt-10 pb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold text-primary tracking-widest uppercase mb-2">My Loan Portfolio</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="portfolio-title">
              Every loan you hold. One screen.
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              {user ? <>Welcome back, <strong className="text-foreground">{user.email}</strong>. Your portfolio is aggregated via the RBI-licensed Sahamati AA framework.</>
                : "Connect via Sahamati Account Aggregator to import your real loans across every bank & NBFC."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {data?.demo && !user && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold" data-testid="portfolio-demo-badge">
                Demo data · log in to import your real portfolio
              </span>
            )}
            {user && data?.hasData && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold" data-testid="portfolio-status-connected">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Connected · {data.summary.loanCount} loan{data.summary.loanCount > 1 ? "s" : ""}
              </span>
            )}
            {user && (
              <button onClick={() => setAAOpen(true)} data-testid="portfolio-connect-btn" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                <Shield className="w-4 h-4" />
                {data?.hasData ? "Re-sync via AA" : "Connect Account Aggregator"}
              </button>
            )}
            {!user && (
              <button
                onClick={() => {
                  // Commented out to bypass login page and redirect to mock portfolio directly
                  // navigate("/login");
                  localStorage.setItem("use_mock_auth", "true");
                  refreshCredupeAuth();
                }}
                data-testid="portfolio-login-cta"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
              >
                <Shield className="w-4 h-4" />
                Login to connect
              </button>
            )}
          </div>
        </div>
      </section>

      {loading && <FullPageSpinner inline />}

      {!loading && data && (
        <>
          {/* ── Empty state (logged in, no AA pull yet) ─────────────────── */}
          {user && !data.hasData && (
            <section className="container pb-10">
              <div className="rounded-2xl border-2 border-dashed border-border bg-card p-10 text-center" data-testid="portfolio-empty">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Bring your loans onto CreduPe</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                  Click below to give consent via the RBI-licensed Sahamati AA. We'll pull every active loan you have — across every bank and NBFC — in under 10 seconds.
                </p>
                <button onClick={() => setAAOpen(true)} data-testid="portfolio-empty-connect" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                  Connect via Sahamati AA
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {/* ── KPI cards ─────────────────────────────────────────────────── */}
          {data.hasData && (
            <section className="container pb-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" data-testid="portfolio-kpis">
                {[
                  { label: "Total outstanding", value: inr(data.summary.totalOutstanding), icon: Wallet, sub: `${data.summary.loanCount} active loans` },
                  { label: "Monthly EMI outflow", value: inrFull(data.summary.totalEmi), icon: IndianRupee, sub: "across all lenders" },
                  { label: "Weighted avg. rate", value: `${data.summary.weightedAvgRate.toFixed(2)}%`, icon: BarChart3, sub: "p.a." },
                  { label: "Lenders", value: String(data.summary.lenderCount), icon: Building2, sub: "banks & NBFCs" },
                ].map((k) => {
                  const Icon = k.icon;
                  return (
                    <div key={k.label} className="rounded-2xl border border-border bg-card p-4">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-foreground leading-none">{k.value}</div>
                      <div className="text-[11px] text-muted-foreground mt-1.5 uppercase tracking-wider">{k.label}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{k.sub}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── AI Savings banner ─────────────────────────────────────────── */}
          {data.insights.length > 0 && (
            <section className="container pb-6">
              <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/8 via-background to-[hsl(275_45%_58%)]/8 p-6 md:p-8" data-testid="portfolio-savings-banner">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3 max-w-2xl">
                    <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-primary tracking-widest uppercase mb-1">Credu AI · Optimisation</div>
                      <h2 className="text-xl md:text-2xl font-bold text-foreground leading-snug">
                        You could save <span className="text-primary">{inrFull(totalMonthlySaving)}</span> every month
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {data.insights.length} refinance opportunit{data.insights.length > 1 ? "ies" : "y"} detected · {inrFull(totalAnnualSaving)} annually · {inr(totalLifetimeSaving)} over remaining tenure.
                      </p>
                    </div>
                  </div>
                  <a href="#optimisation" data-testid="portfolio-savings-cta" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity self-center">
                    See recommendations
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* ── Loans grid ────────────────────────────────────────────────── */}
          {data.hasData && (
            <section className="container pb-8">
              <h2 className="text-lg font-bold text-foreground mb-4">Active loans</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.loans.map((l) => {
                  const meta = LOAN_META[l.loanType] ?? LOAN_META.PERSONAL_LOAN;
                  const Icon = meta.icon;
                  const gap = l.marketRate != null ? l.rate - l.marketRate : 0;
                  return (
                    <div key={l.id} data-testid={`portfolio-loan-${l.id}`} className="rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.tint} flex items-center justify-center shrink-0`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">{meta.label}</div>
                            <h3 className="text-base font-bold text-foreground leading-tight">{l.lender}</h3>
                            <div className="text-[11px] text-muted-foreground">{l.productName ?? meta.label} · {sinceLabel(l.disbursedOn)}</div>
                          </div>
                        </div>
                        {gap > 0.25 && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-[10px] font-bold">
                            <AlertCircle className="w-3 h-3" />
                            +{gap.toFixed(2)}% above market
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <KV label="Outstanding" value={inr(l.outstanding)} />
                        <KV label="Monthly EMI" value={inrFull(l.emi)} />
                        <KV label="Interest rate" value={`${l.rate.toFixed(2)}%`} />
                        <KV label="Tenure left" value={`${Math.floor(l.tenureLeftMonths / 12)}y ${l.tenureLeftMonths % 12}m`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── AI optimisation insights ──────────────────────────────────── */}
          {data.insights.length > 0 && (
            <section id="optimisation" className="container pb-8 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">AI-powered optimisation</h2>
                <span className="text-xs text-muted-foreground">· {data.insights.length} opportunit{data.insights.length === 1 ? "y" : "ies"}</span>
              </div>
              <div className="space-y-3" data-testid="portfolio-optimisations">
                {data.insights.map((ins) => {
                  const meta = LOAN_META[ins.loanType] ?? LOAN_META.PERSONAL_LOAN;
                  const Icon = meta.icon;
                  return (
                    <div key={ins.loanId} data-testid={`portfolio-opt-${ins.loanId}`} className="rounded-2xl border border-border bg-card overflow-hidden">
                      <div className="p-5 md:p-6 flex flex-wrap items-start gap-5">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.tint} flex items-center justify-center shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-[240px]">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Balance Transfer · Refinance</span>
                            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">Smart save</span>
                          </div>
                          <h3 className="text-lg font-bold text-foreground leading-snug">
                            Move your <span className="underline decoration-primary decoration-2">{meta.label}</span> from {ins.currentLender} to a HDFC at {ins.suggestedRate.toFixed(2)}%
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{ins.reason} We'll handle the paperwork end-to-end.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:flex-shrink-0">
                          <div className="text-right sm:text-left">
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Save / month</div>
                            <div className="text-xl font-bold text-primary">{inrFull(ins.monthlySaving)}</div>
                          </div>
                          <div className="text-right sm:text-left">
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Lifetime</div>
                            <div className="text-xl font-bold text-foreground">{inr(ins.lifetimeSaving)}</div>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-border bg-muted/30 px-5 py-3 flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Zap className="w-3.5 h-3.5 text-primary" />
                          New EMI: <strong className="text-foreground">{inrFull(ins.newEmi)}</strong> · vs current {inrFull(ins.currentEmi)}
                        </div>
                        {appliedBT[ins.loanId] ? (
                          <Link
                            to="/customer-dashboard"
                            data-testid={`portfolio-opt-cta-applied-${ins.loanId}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/15 text-primary text-xs font-semibold hover:bg-primary/20"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Application {appliedBT[ins.loanId]} · Track
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleApplyBalanceTransfer(ins)}
                            disabled={applyingBT === ins.loanId}
                            data-testid={`portfolio-opt-cta-${ins.loanId}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-wait"
                          >
                            {applyingBT === ins.loanId ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Starting…
                              </>
                            ) : (
                              <>
                                {user ? "Apply for balance transfer" : "Start balance transfer"}
                                <ChevronRight className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Top 3 NEW loan recommendations ────────────────────────────── */}
          {topOffers.length > 0 && (
            <section className="container pb-12">
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="p-5 md:p-6 border-b border-border flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-primary tracking-widest uppercase">Credu AI · Top 3 for your next loan</span>
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-foreground">Best ₹10 Lakh Car Loan offers for your profile</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ranked by total borrowing cost, approval probability and profile fit — re-ranked using your current EMI burden ({inrFull(data.summary.totalEmi)}/mo).
                    </p>
                  </div>
                  <Link to="/car-loan" className="text-xs font-semibold text-primary hover:underline">Change loan type →</Link>
                </div>
                <div className="divide-y divide-border" data-testid="portfolio-top3">
                  {topOffers.map((o) => (
                    <div key={o.rank} data-testid={`portfolio-top3-rank-${o.rank}`} className="p-5 md:p-6 flex flex-wrap items-start gap-5 hover:bg-muted/30 transition-colors">
                      <div className={`relative w-12 h-12 rounded-xl ${o.rank === 1 ? "bg-primary" : "bg-muted"} flex items-center justify-center shrink-0`}>
                        <span className={`text-xl font-bold ${o.rank === 1 ? "text-primary-foreground" : "text-foreground"}`}>#{o.rank}</span>
                        {o.rank === 1 && (
                          <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-md bg-foreground text-background text-[9px] font-bold tracking-wider">BEST</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-[260px]">
                        <h3 className="text-base font-bold text-foreground leading-tight">{o.lender}</h3>
                        <div className="text-[11px] text-muted-foreground">{o.product}</div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {o.reasons.map((w: string) => (
                            <span key={w} className="px-2 py-0.5 rounded-full bg-primary/8 text-primary text-[10px] font-medium">{w}</span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 sm:gap-5 text-center sm:text-left">
                        <KV label="Rate" value={`${o.rate.toFixed(2)}%`} bold />
                        <KV label="EMI" value={inrFull(o.emi)} bold />
                        <KV label="Approval" value={`${o.approval}%`} accent />
                      </div>
                      <Link to="/login" data-testid={`portfolio-top3-apply-${o.rank}`} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 self-center">
                        Apply
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* ── Footer CTA strip ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] text-primary-foreground">
        <div className="container py-12 md:py-16 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-bold text-primary-foreground/70 tracking-widest uppercase mb-2">Continuous savings</div>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              We'll keep watching rates 24/7. The moment a better offer appears — you'll know.
            </h2>
          </div>
          <Link to="/loan-intelligence" data-testid="portfolio-learn-more" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[hsl(var(--purple-deep))] text-sm font-semibold hover:bg-white/95 transition-colors">
            How Credu intelligence works
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />

      <AAConsentModal open={aaOpen} onClose={() => setAAOpen(false)} onDone={() => { setAAOpen(false); reload(); }} />
    </div>
  );
};

function KV({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className={`${bold ? "text-base" : "text-lg"} font-bold ${accent ? "text-primary" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

function FullPageSpinner({ inline = false }: { inline?: boolean }) {
  return (
    <div className={inline ? "container py-20 flex items-center justify-center" : "min-h-screen bg-background flex items-center justify-center"}>
      <Loader2 className="w-7 h-7 text-primary animate-spin" />
    </div>
  );
}

export default Portfolio;
