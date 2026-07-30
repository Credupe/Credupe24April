import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles, ArrowRight, TrendingDown, Target, LayoutDashboard,
  CreditCard, Home, Car, Briefcase, GraduationCap, Building2,
  CheckCircle2, Brain, RefreshCw, BarChart3, Shield,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUIConfigStore } from "@/stores/uiConfigStore";

/* ─────────────────────── Static data — Mr. Sharma's journey ─────────── */
const JOURNEY_STEPS = [
  { id: 1, icon: Car, title: "Customer searches for ₹10L Car Loan",
    body: "Mr. Sharma visits CreduPe wanting a new car loan. A traditional marketplace would stop here.",
    accent: "from-[hsl(258_60%_52%)] to-[hsl(275_45%_58%)]" },
  { id: 2, icon: Target, title: "AI ranks Top 3 offers",
    body: "Beyond price — we factor approval probability, processing fees, customer profile fit, total borrowing cost.",
    accent: "from-[hsl(275_45%_58%)] to-[hsl(252_55%_72%)]" },
  { id: 3, icon: LayoutDashboard, title: "Consolidates all existing loans",
    body: "With consent, we pull every active loan via Account Aggregator + CIBIL — across all banks & NBFCs.",
    accent: "from-[hsl(252_55%_72%)] to-[hsl(258_60%_52%)]" },
  { id: 4, icon: Brain, title: "AI analyses the full debt portfolio",
    body: "Identifies rate gaps vs. live market, EMI inefficiencies, refinance opportunities, top-up potential.",
    accent: "from-[hsl(258_60%_52%)] to-[hsl(275_45%_58%)]" },
  { id: 5, icon: RefreshCw, title: "Recommends balance-transfer & refinance",
    body: "Home loan to a lower-rate lender. Personal loan refinance. Best car loan for the new requirement.",
    accent: "from-[hsl(275_45%_58%)] to-[hsl(252_55%_72%)]" },
  { id: 6, icon: TrendingDown, title: "Customer saves ₹25k / month — every month",
    body: "₹3 lakh annual savings. Better cash flow. Lower interest burden. Continuous optimisation.",
    accent: "from-[hsl(252_55%_72%)] to-[hsl(258_60%_52%)]" },
];

const DIFFERENTIATORS = [
  {
    icon: Target,
    title: "Best Loan Recommendation Engine",
    desc: "AI ranks Top 3 offers using interest rate, EMI, eligibility, approval probability, customer profile fit and total borrowing cost — not just a price-sorted list.",
    points: ["Eligibility-aware filtering", "Approval probability scoring", "Total-cost-of-borrowing ranking"],
  },
  {
    icon: LayoutDashboard,
    title: "Integrated Loan Portfolio",
    desc: "Single CRED-style dashboard of every active loan — Home, Personal, Auto, Education, LAP, Business, Consumer Durable — pulled via Account Aggregator + CIBIL.",
    points: ["Outstanding balances", "Lender-wise exposure", "Monthly debt obligation"],
  },
  {
    icon: Brain,
    title: "AI-Powered Optimisation",
    desc: "Continuously scans partner lender offerings and flags balance transfers, refinances, top-ups, and EMI-reduction moves the moment a saving is available.",
    points: ["Live rate-gap detection", "EMI-reduction modelling", "Top-up opportunity alerts"],
  },
];

const SUPPORTED_LOAN_TYPES = [
  { icon: Home, label: "Home Loans" }, { icon: Briefcase, label: "Personal Loans" },
  { icon: Car, label: "Auto Loans" }, { icon: GraduationCap, label: "Education Loans" },
  { icon: Building2, label: "Loan Against Property" }, { icon: Briefcase, label: "Business Loans" },
  { icon: CreditCard, label: "Consumer Durable Loans" },
];

const LoanIntelligence = () => {
  const { config } = useUIConfigStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (config.navbar?.hideLoanIntelligence) {
      navigate("/");
    }
  }, [config.navbar?.hideLoanIntelligence, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full bg-[hsl(275_45%_58%)]/10 blur-3xl pointer-events-none" />

        <div className="relative container py-20 md:py-28">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary mb-6" data-testid="li-hero-badge">
            <Sparkles className="w-3.5 h-3.5" />
            India's Integrated Loan Intelligence Platform
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight max-w-4xl" data-testid="li-hero-title">
            From <span className="text-muted-foreground line-through decoration-2 decoration-destructive/60">Loan Marketplace</span>{" "}
            to <span className="text-gradient">Loan Intelligence Platform</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-3xl leading-relaxed">
            Most marketplaces end the relationship the moment a loan is disbursed. <strong className="text-foreground">CreduPe begins it.</strong> A unified view of every loan you hold — across every bank and NBFC — with an AI that never stops looking for ways to lower your borrowing cost.
          </p>

          <p className="text-base font-semibold text-primary mt-4 tracking-wide uppercase" data-testid="li-hero-tagline">
            Single view · Smart recommendations · Continuous savings
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/portfolio" data-testid="li-hero-cta-portfolio" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              See your Loan Portfolio
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/calculators" data-testid="li-hero-cta-savings" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card text-foreground text-sm font-semibold hover:bg-muted transition-colors">
              Estimate my savings
            </Link>
          </div>

          {/* Headline stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl">
            {[
              { v: "₹3L", l: "Avg. annual savings" },
              { v: "80+", l: "Banks & NBFCs" },
              { v: "7", l: "Loan categories tracked" },
              { v: "24/7", l: "Continuous re-scoring" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-border bg-card/60 backdrop-blur p-4">
                <div className="text-2xl md:text-3xl font-bold text-foreground">{s.v}</div>
                <div className="text-[11px] text-muted-foreground mt-1 leading-tight">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core differentiators ─────────────────────────────────────── */}
      <section className="container py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold text-primary tracking-widest uppercase mb-3">Why CreduPe is different</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Three pillars no marketplace gives you</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {DIFFERENTIATORS.map((d, i) => {
            const Icon = d.icon;
            return (
              <div key={d.title} data-testid={`li-pillar-${i}`} className="group relative rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-xs font-bold text-primary tracking-widest uppercase mb-2">Pillar {i + 1}</div>
                <h3 className="text-lg font-bold text-foreground mb-2 leading-snug">{d.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{d.desc}</p>
                <ul className="space-y-1.5">
                  {d.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-xs text-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Mr. Sharma's Journey — 6 step infographic ─────────────────── */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background border-y border-border">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs font-bold text-primary tracking-widest uppercase mb-3">A real customer journey</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet Mr. Sharma. He came for a car loan — left with ₹3 lakh in annual savings.</h2>
            <p className="text-base text-muted-foreground mt-4 max-w-2xl mx-auto">
              Existing portfolio: <strong className="text-foreground">₹2 Cr home loan (Axis Bank)</strong> + <strong className="text-foreground">₹10L personal loan (ICICI Bank)</strong>. Total EMI outflow: <strong className="text-foreground">₹2.50L / month.</strong>
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* spine */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent -translate-x-1/2" />

            <div className="space-y-6 md:space-y-12">
              {JOURNEY_STEPS.map((step, i) => {
                const Icon = step.icon;
                const isLeft = i % 2 === 0;
                return (
                  <div key={step.id} data-testid={`li-journey-step-${step.id}`} className={`relative grid md:grid-cols-2 gap-4 md:gap-12 items-center ${isLeft ? "" : "md:[direction:rtl]"}`}>
                    <div className={`md:[direction:ltr] ${isLeft ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                      <div className={`inline-flex items-center gap-3 ${isLeft ? "md:flex-row-reverse" : ""}`}>
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.accent} flex items-center justify-center shrink-0 shadow-lg`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-3xl md:text-4xl font-bold text-primary/30">0{step.id}</div>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mt-4 leading-snug">{step.title}</h3>
                      <p className="text-sm md:text-base text-muted-foreground mt-2 leading-relaxed">{step.body}</p>
                    </div>
                    {/* dot on spine */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-md" />
                    <div className="md:[direction:ltr]" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Before / After card */}
          <div className="mt-16 max-w-4xl mx-auto rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 via-background to-[hsl(275_45%_58%)]/5 p-6 md:p-10" data-testid="li-savings-card">
            <p className="text-xs font-bold text-primary tracking-widest uppercase mb-4">The outcome</p>
            <div className="grid md:grid-cols-3 gap-6 items-center">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Before CreduPe</div>
                <div className="text-3xl md:text-4xl font-bold text-foreground line-through decoration-destructive/70 decoration-2">₹2,50,000</div>
                <div className="text-xs text-muted-foreground mt-1">monthly EMI outflow</div>
              </div>
              <div className="flex flex-col items-center">
                <ArrowRight className="w-8 h-8 text-primary md:rotate-0 rotate-90" />
                <div className="mt-3 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  AI-recommended refinance
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">After CreduPe</div>
                <div className="text-3xl md:text-4xl font-bold text-primary">₹2,25,000</div>
                <div className="text-xs text-muted-foreground mt-1">monthly EMI outflow</div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-border grid sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">₹25,000</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">saved every month</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">₹3,00,000</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">saved every year</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">Forever</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">continuous optimisation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Supported loan categories ────────────────────────────────── */}
      <section className="container py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold text-primary tracking-widest uppercase mb-3">Every loan on one screen</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Aggregates across <span className="text-gradient">all 7 loan categories</span></h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 max-w-5xl mx-auto">
          {SUPPORTED_LOAN_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.label} className="flex flex-col items-center justify-center text-center rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-[11px] font-semibold text-foreground leading-tight">{t.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Traditional vs CreduPe comparison ────────────────────────── */}
      <section className="container pb-20">
        <div className="max-w-5xl mx-auto rounded-2xl border border-border bg-card overflow-hidden">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-8 md:p-10 bg-muted/30">
              <div className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-3">Traditional marketplace</div>
              <h3 className="text-2xl font-bold text-foreground mb-4 italic">"Which loan should I take today?"</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><span className="text-destructive">✕</span> One-time transaction</li>
                <li className="flex gap-2"><span className="text-destructive">✕</span> Price-sorted listing only</li>
                <li className="flex gap-2"><span className="text-destructive">✕</span> Relationship ends at disbursal</li>
                <li className="flex gap-2"><span className="text-destructive">✕</span> No visibility on existing loans</li>
                <li className="flex gap-2"><span className="text-destructive">✕</span> No refinance triggers</li>
              </ul>
            </div>
            <div className="p-8 md:p-10 relative">
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-wider uppercase">CreduPe</div>
              <div className="text-xs font-bold text-primary tracking-widest uppercase mb-3">Loan Intelligence Platform</div>
              <h3 className="text-2xl font-bold text-foreground mb-4 italic">"How can I optimise my entire borrowing portfolio — forever?"</h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Lifelong financial relationship</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> AI-ranked Top 3 with reasoning</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Unified portfolio dashboard</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> 24/7 rate-gap monitoring</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Refinance & balance-transfer alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] text-primary-foreground">
        <div className="container py-16 md:py-20 text-center">
          <Shield className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to see how much you could save?</h2>
          <p className="text-base text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Connect your accounts via secure RBI-licensed Account Aggregator. We never store credentials, you control consent, and you can disconnect any time.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/portfolio" data-testid="li-final-cta-portfolio" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[hsl(var(--purple-deep))] text-sm font-semibold hover:bg-white/95 transition-colors">
              See my Loan Portfolio
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login?mode=signup" data-testid="li-final-cta-signup" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/30 text-primary-foreground text-sm font-semibold hover:bg-white/10 transition-colors">
              Create free account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LoanIntelligence;
