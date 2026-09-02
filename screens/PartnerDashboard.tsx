"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2, TrendingUp, Users, Banknote, Trophy, FileText, BadgeCheck,
  Crown, Copy, ArrowUpRight, ArrowDownRight, AlertCircle, Loader2, IndianRupee,
  Wallet, Hourglass, CheckCircle2, XCircle, ListChecks, Award, Mail, Phone, MapPin,
  Upload,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { credupeApi, CredupeApiError } from "@/lib/credupe-api";

type Tab = "home" | "earnings" | "leaderboard" | "documents" | "profile";

const LOAN_TYPE_LABEL: Record<string, string> = {
  PERSONAL_LOAN: "Personal Loan",
  HOME_LOAN: "Home Loan",
  LOAN_AGAINST_PROPERTY: "Loan Against Property",
  BUSINESS_LOAN: "Business Loan",
  CAR_LOAN: "Car Loan",
  USED_CAR_LOAN: "Used Car Loan",
  TWO_WHEELER_LOAN: "Two-Wheeler Loan",
  EDUCATION_LOAN: "Education Loan",
  GOLD_LOAN: "Gold Loan",
  MICRO_LOAN: "Micro Loan",
  CREDIT_CARD: "Credit Card",
};

const TIER_STYLES: Record<string, { bg: string; text: string; ring: string; icon: any }> = {
  BRONZE: { bg: "bg-amber-700/15", text: "text-amber-700", ring: "ring-amber-700/30", icon: Award },
  SILVER: { bg: "bg-slate-400/20", text: "text-slate-500", ring: "ring-slate-400/40", icon: BadgeCheck },
  GOLD: { bg: "bg-yellow-500/15", text: "text-yellow-600", ring: "ring-yellow-500/40", icon: Trophy },
  PLATINUM: { bg: "bg-violet-500/15", text: "text-violet-500", ring: "ring-violet-500/40", icon: Crown },
};

const STATUS_PILL: Record<string, string> = {
  PAID: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  APPROVED: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  REVERSED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  NEW: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  CONTACTED: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  QUALIFIED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  CONVERTED: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  APPLICATION_CREATED: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  DROPPED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  UPLOADED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  VERIFIED: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

function fmtINR(v: number | null | undefined): string {
  if (v == null || isNaN(Number(v))) return "—";
  const n = Number(v);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
  return `₹${n.toFixed(0)}`;
}

function fmtFullINR(v: number | null | undefined): string {
  if (v == null) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(v));
}

/* ────────────────────────────────────────────────────────────────────────── */

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("home");
  const [home, setHome] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unauth, setUnauth] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadForm, setLeadForm] = useState({
    customerName: "",
    customerMobile: "",
    customerEmail: "",
    loanType: "PERSONAL_LOAN",
    amountRequested: "",
    city: "",
    notes: "",
  });

  const fetchHomeData = async () => {
    try {
      const h = await credupeApi.partner.home();
      setHome(h);
    } catch (err) {
      if (err instanceof CredupeApiError && (err.status === 401 || err.status === 403)) {
        setUnauth(true);
      } else {
        const msg = err instanceof CredupeApiError ? err.messages[0] : "Could not load dashboard";
        toast({ title: "Error", description: msg, variant: "destructive" });
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await fetchHomeData();
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, [toast]);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitting(true);
    try {
      await credupeApi.leads.create({
        customerName: leadForm.customerName,
        customerMobile: leadForm.customerMobile,
        customerEmail: leadForm.customerEmail || undefined,
        loanType: leadForm.loanType as any,
        amountRequested: leadForm.amountRequested ? Number(leadForm.amountRequested) : undefined,
        city: leadForm.city || undefined,
        notes: leadForm.notes || undefined,
      });
      toast({ title: "Success", description: "Lead submitted successfully." });
      setIsLeadModalOpen(false);
      setLeadForm({
        customerName: "",
        customerMobile: "",
        customerEmail: "",
        loanType: "PERSONAL_LOAN",
        amountRequested: "",
        city: "",
        notes: "",
      });
      await fetchHomeData();
    } catch (err) {
      const msg = err instanceof CredupeApiError ? err.messages[0] : "Failed to submit lead";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLeadSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (unauth || !home) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto mt-32 text-center px-6">
          <AlertCircle className="w-12 h-12 mx-auto text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Partner login required</h2>
          <p className="text-muted-foreground mb-6">
            Log in with your partner account or complete onboarding to see your dashboard.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm"
              data-testid="partner-login-cta"
            >
              Partner Login
            </button>
            <button
              onClick={() => navigate("/partner-gateway")}
              className="px-5 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm"
              data-testid="partner-onboard-cta"
            >
              Become a Partner
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const partner = home.partner;
  const tierStyles = TIER_STYLES[partner.tier] || TIER_STYLES.BRONZE;
  const TierIcon = tierStyles.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-8">
        {/* Header card */}
        <section className="mb-6">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Welcome back</p>
                <h1 className="text-xl md:text-2xl font-bold text-foreground" data-testid="dash-business-name">
                  {partner.businessName}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-muted-foreground" data-testid="dash-partner-code">
                    {partner.partnerCode}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(partner.partnerCode);
                      toast({ title: "Copied", description: "Partner code copied." });
                    }}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Copy className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${tierStyles.bg} ${tierStyles.text} ring-1 ${tierStyles.ring}`}>
                <TierIcon className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wider uppercase">{partner.tier}</span>
              </div>
              <KycBadge status={partner.kycStatus} />
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 w-fit mb-6 overflow-x-auto">
          {([
            { k: "home", label: "Overview", icon: TrendingUp },
            { k: "earnings", label: "Earnings", icon: Banknote },
            { k: "leaderboard", label: "Leaderboard", icon: Trophy },
            { k: "documents", label: "Documents", icon: FileText },
            { k: "profile", label: "Profile", icon: Building2 },
          ] as const).map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              data-testid={`dash-tab-${t.k}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${tab === t.k ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "home" && <HomeTab home={home} onNewLeadClick={() => setIsLeadModalOpen(true)} />}
        {tab === "earnings" && <EarningsTab />}
        {tab === "leaderboard" && <LeaderboardTab />}
        {tab === "documents" && <DocumentsTab />}
        {tab === "profile" && <ProfileTab home={home} />}
      </div>
      <Footer />

      {/* Lead Submission Modal */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setIsLeadModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">Submit Customer Lead</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Fill in the customer information to register a new loan lead.
              </p>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5 font-medium">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={leadForm.customerName}
                  onChange={(e) => setLeadForm({ ...leadForm, customerName: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5 font-medium">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit number"
                    value={leadForm.customerMobile}
                    onChange={(e) => setLeadForm({ ...leadForm, customerMobile: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={leadForm.customerEmail}
                    onChange={(e) => setLeadForm({ ...leadForm, customerEmail: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5 font-medium">
                    Loan Type *
                  </label>
                  <select
                    value={leadForm.loanType}
                    onChange={(e) => setLeadForm({ ...leadForm, loanType: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
                  >
                    {Object.entries(LOAN_TYPE_LABEL).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5 font-medium">
                    Amount Requested (INR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 500000"
                    value={leadForm.amountRequested}
                    onChange={(e) => setLeadForm({ ...leadForm, amountRequested: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5 font-medium">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={leadForm.city}
                    onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5 font-medium">
                  Notes / Remarks
                </label>
                <textarea
                  placeholder="Any additional details..."
                  value={leadForm.notes}
                  onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 h-20 resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsLeadModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-95 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {leadSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit Lead"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function KycBadge({ status }: { status: string }) {
  const map: Record<string, { text: string; cls: string; icon: any }> = {
    VERIFIED: { text: "KYC Verified", cls: "bg-green-500/10 text-green-600 ring-green-500/30", icon: CheckCircle2 },
    PENDING: { text: "KYC Pending", cls: "bg-amber-500/10 text-amber-600 ring-amber-500/30", icon: Hourglass },
    REJECTED: { text: "KYC Not Complete", cls: "bg-red-500/10 text-red-600 ring-red-500/30", icon: XCircle },
  };
  const m = map[status] || map.PENDING;
  const Icon = m.icon;
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-full ring-1 ${m.cls}`}>
      <Icon className="w-4 h-4" />
      <span className="text-xs font-semibold">{m.text}</span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Tab: Overview                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

function HomeTab({ home, onNewLeadClick }: { home: any; onNewLeadClick: () => void }) {
  const kpis = home.kpis;
  return (
    <div className="space-y-6">
      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiTile icon={Users} label="Total Leads" value={String(kpis.totalLeads)} sub={`${kpis.conversions} converted`} testId="kpi-leads" />
        <KpiTile icon={IndianRupee} label="Commission Earned" value={fmtINR(kpis.totalCommissionEarned)} sub={`${fmtINR(kpis.commissionPaid)} paid`} accent testId="kpi-commission" />
        <KpiTile icon={Hourglass} label="Pending Payout" value={fmtINR(kpis.commissionPending)} sub="Approved + pending" testId="kpi-pending" />
        <KpiTile icon={Trophy} label="Leaderboard Rank" value={kpis.rank ? `#${kpis.rank}` : "—"} sub={`of ${kpis.totalPartners} partners`} testId="kpi-rank" />
      </div>

      {/* Conversion + funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-foreground">Conversion Rate</p>
            <span className="text-2xl font-bold text-primary" data-testid="conv-rate">{kpis.conversionRate}%</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {kpis.conversions} of {kpis.totalLeads} leads became customers.
          </p>
          <Progress value={kpis.conversionRate} className="h-2" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 lg:col-span-2">
          <p className="text-sm font-semibold text-foreground mb-4">Lead Funnel</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {["NEW", "CONTACTED", "QUALIFIED", "APPLICATION_CREATED", "CONVERTED", "DROPPED"].map((s) => (
              <div key={s} className="rounded-lg bg-muted/40 px-3 py-2">
                <p className="text-xs text-muted-foreground">{s.replace("_", " ")}</p>
                <p className="text-lg font-bold text-foreground" data-testid={`funnel-${s.toLowerCase()}`}>
                  {home.leadsByStatus?.[s] || 0}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <p className="text-sm font-semibold text-foreground mb-4">Quick actions</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "New Lead", icon: Users, onClick: onNewLeadClick },
            { label: "Calculators", icon: ListChecks, href: "/calculators" },
            { label: "Loan Products", icon: FileText, href: "/loan-intelligence" },
            { label: "Credit Score", icon: BadgeCheck, href: "/credit-score" },
          ].map((q) => {
            const Component = q.onClick ? "button" : "a";
            const props = q.onClick ? { onClick: q.onClick, type: "button" as const } : { href: q.href };
            return (
              <Component
                key={q.label}
                {...(props as any)}
                className="flex items-center text-left w-full gap-3 p-3 rounded-xl border border-border hover:border-primary/40 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <q.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-foreground">{q.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
              </Component>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function KpiTile({
  icon: Icon, label, value, sub, accent, testId,
}: { icon: any; label: string; value: string; sub: string; accent?: boolean; testId?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-4 border ${accent ? "bg-primary/5 border-primary/20" : "bg-card border-border"}`}
      data-testid={testId}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-4 h-4 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <p className="text-xl md:text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
      <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Tab: Earnings                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

function EarningsTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const d = await credupeApi.partner.earnings();
        if (mounted) setData(d);
      } catch (err) {
        const msg = err instanceof CredupeApiError ? err.messages[0] : "Failed to load earnings";
        toast({ title: "Error", description: msg, variant: "destructive" });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [toast]);

  if (loading) return <SpinnerBlock />;
  if (!data) return null;

  const { summary, monthly, recent, rateCard } = data;

  return (
    <div className="space-y-6">
      {/* Summary tiles */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <SummaryTile label="Total" value={fmtFullINR(summary.total)} accent testId="earn-total" />
        <SummaryTile label="Paid" value={fmtFullINR(summary.paid)} icon={CheckCircle2} iconCls="text-green-500" testId="earn-paid" />
        <SummaryTile label="Approved" value={fmtFullINR(summary.approved)} icon={BadgeCheck} iconCls="text-blue-500" testId="earn-approved" />
        <SummaryTile label="Pending" value={fmtFullINR(summary.pending)} icon={Hourglass} iconCls="text-yellow-500" testId="earn-pending" />
        <SummaryTile label="Reversed" value={fmtFullINR(summary.reversed)} icon={XCircle} iconCls="text-red-500" testId="earn-reversed" />
      </div>

      {/* Recent payouts table */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <p className="text-sm font-semibold text-foreground mb-4">Recent commissions</p>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No commissions earned yet — share your partner code to start.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="py-2 pr-3">Customer</th>
                  <th className="py-2 px-3">Product</th>
                  <th className="py-2 px-3 text-right">Loan amt.</th>
                  <th className="py-2 px-3 text-right">Commission</th>
                  <th className="py-2 pl-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((c: any) => (
                  <tr key={c.id} className="border-b border-border/50 last:border-0" data-testid={`commission-row-${c.id}`}>
                    <td className="py-3 pr-3">
                      <p className="font-medium text-foreground">{c.lead?.customerName || "—"}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(c.createdAt).toLocaleDateString("en-IN")}</p>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {c.lead?.loanType ? LOAN_TYPE_LABEL[c.lead.loanType] : "—"}
                    </td>
                    <td className="py-3 px-3 text-right text-muted-foreground">{fmtINR(c.lead?.amountRequested)}</td>
                    <td className="py-3 px-3 text-right font-semibold text-foreground">{fmtFullINR(c.amount)}</td>
                    <td className="py-3 pl-3 text-right">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${STATUS_PILL[c.status] || ""}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rate card */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Commission rate card</p>
            <p className="text-xs text-muted-foreground">Standard rates — your tier may unlock higher slabs.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {rateCard.map((r: any) => (
            <div key={r.loanType} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 hover:border-primary/40 transition-colors">
              <p className="text-xs font-medium text-foreground">{LOAN_TYPE_LABEL[r.loanType]}</p>
              <span className="text-sm font-bold text-primary tabular-nums">
                {r.ruleType === "PERCENT" ? `${Number(r.payoutPct).toFixed(2)}%` : fmtFullINR(r.flatAmount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryTile({
  label, value, accent, icon: Icon, iconCls, testId,
}: { label: string; value: string; accent?: boolean; icon?: any; iconCls?: string; testId?: string }) {
  return (
    <div className={`rounded-2xl p-4 border ${accent ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`} data-testid={testId}>
      <div className="flex items-center justify-between mb-1">
        <p className={`text-xs ${accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{label}</p>
        {Icon && <Icon className={`w-4 h-4 ${iconCls}`} />}
      </div>
      <p className="text-lg md:text-xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Tab: Leaderboard                                                           */
/* ────────────────────────────────────────────────────────────────────────── */

function LeaderboardTab() {
  const [metric, setMetric] = useState<"disbursed" | "leads" | "commission">("disbursed");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const d = await credupeApi.partner.leaderboard(metric, 25);
        if (mounted) setData(d);
      } catch (err) {
        const msg = err instanceof CredupeApiError ? err.messages[0] : "Failed to load leaderboard";
        toast({ title: "Error", description: msg, variant: "destructive" });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [metric, toast]);

  const formatValue = (v: number) =>
    metric === "leads" ? `${v} leads` : fmtFullINR(v);

  return (
    <div className="space-y-4">
      {/* Metric tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 w-fit">
        {([
          { k: "disbursed", label: "Disbursed Amount", icon: Banknote },
          { k: "leads", label: "Converted Leads", icon: Users },
          { k: "commission", label: "Commission Earned", icon: IndianRupee },
        ] as const).map((m) => (
          <button
            key={m.k}
            onClick={() => setMetric(m.k)}
            data-testid={`leaderboard-tab-${m.k}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${metric === m.k ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <m.icon className="w-4 h-4" /> {m.label}
          </button>
        ))}
      </div>

      {loading ? (
        <SpinnerBlock />
      ) : !data ? null : (
        <>
          {/* My rank highlight */}
          {data.me && (
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  #{data.me.rank}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Your rank</p>
                  <p className="text-base font-bold text-foreground" data-testid="my-leaderboard-name">{data.me.businessName}</p>
                  <p className="text-xs text-muted-foreground">{data.me.partnerCode}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{metric === "leads" ? "Converted" : "Total"}</p>
                <p className="text-2xl font-bold text-foreground" data-testid="my-leaderboard-value">
                  {formatValue(data.me.value)}
                </p>
              </div>
            </div>
          )}

          {/* Top list */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Top {data.top.length} partners</p>
            </div>
            <div className="divide-y divide-border">
              {data.top.map((p: any) => (
                <div
                  key={p.partnerId}
                  data-testid={`leaderboard-row-${p.rank}`}
                  className={`flex items-center justify-between gap-4 px-5 py-3 ${p.isMe ? "bg-primary/5" : ""
                    }`}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${p.rank === 1 ? "bg-yellow-500/15 text-yellow-600" :
                        p.rank === 2 ? "bg-slate-400/20 text-slate-500" :
                          p.rank === 3 ? "bg-amber-700/15 text-amber-700" :
                            "bg-muted text-muted-foreground"
                      }`}>
                      {p.rank <= 3 ? <Trophy className="w-5 h-5" /> : `#${p.rank}`}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {p.businessName} {p.isMe && <span className="text-xs text-primary font-normal">(you)</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.partnerCode} {p.city ? `· ${p.city}` : ""} {p.tier ? `· ${p.tier}` : ""}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-foreground tabular-nums whitespace-nowrap">
                    {formatValue(p.value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Tab: Documents                                                             */
/* ────────────────────────────────────────────────────────────────────────── */

function DocumentsTab() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reuploadingDocId, setReuploadingDocId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const loadDocuments = async () => {
    try {
      const d = await credupeApi.partner.documents();
      setDocs(d || []);
    } catch (err) {
      const msg = err instanceof CredupeApiError ? err.messages[0] : "Failed to load documents";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await loadDocuments();
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !reuploadingDocId) return;

    // Reset input so re-selecting same file triggers onChange
    e.target.value = "";

    try {
      setIsSubmitting(reuploadingDocId);
      await credupeApi.partner.reuploadDocument(reuploadingDocId, file);
      toast({
        title: "Document Re-uploaded",
        description: `${file.name} uploaded successfully. Admin will review it shortly.`,
      });
      await loadDocuments();
    } catch (err: any) {
      const msg = err instanceof CredupeApiError ? err.messages[0] : err?.message || "Failed to re-upload document";
      toast({ title: "Re-upload failed", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(null);
      setReuploadingDocId(null);
    }
  };

  const triggerReupload = (docId: string) => {
    setReuploadingDocId(docId);
    fileInputRef.current?.click();
  };

  if (loading) return <SpinnerBlock />;

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Uploaded documents</p>
          <p className="text-xs text-muted-foreground">Manage your KYC verification files</p>
        </div>
      </div>
      {docs.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">No documents on file.</p>
      ) : (
        <div className="space-y-3">
          {docs.map((d) => {
            const isReuploaded = (d.version > 1 && d.status === "UPLOADED");
            return (
              <div
                key={d.id}
                className={`rounded-xl border p-4 transition-all ${
                  d.status === "REJECTED"
                    ? "border-red-200 dark:border-red-950/60 bg-red-50/20 dark:bg-red-950/10"
                    : isReuploaded
                    ? "border-amber-200 dark:border-amber-950/60 bg-amber-50/20 dark:bg-amber-950/10"
                    : "border-border"
                }`}
                data-testid={`doc-row-${d.id}`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      d.status === "REJECTED"
                        ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                        : isReuploaded
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                        : "bg-primary/10 text-primary"
                    }`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{d.fileName}</p>
                        {d.version > 1 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                            v{d.version}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {d.tag} · {new Date(d.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                        isReuploaded
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          : STATUS_PILL[d.status] || "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isReuploaded ? "RE-UPLOADED" : d.status || "PENDING"}
                    </span>

                    {d.status === "REJECTED" && (
                      <button
                        onClick={() => triggerReupload(d.id)}
                        disabled={isSubmitting === d.id}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-sm disabled:opacity-50"
                      >
                        {isSubmitting === d.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" /> Re-upload
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {d.status === "REJECTED" && d.rejectionReason && (
                  <div className="mt-2.5 pt-2.5 border-t border-red-200/60 dark:border-red-950/40 flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Rejection reason: </span>
                      <span>"{d.rejectionReason}"</span>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Please re-upload a clear and valid document.</p>
                    </div>
                  </div>
                )}

                {isReuploaded && (
                  <div className="mt-2.5 pt-2.5 border-t border-amber-200/60 dark:border-amber-950/40 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
                    <Hourglass className="w-3.5 h-3.5 shrink-0" />
                    <span>Your re-uploaded document has been submitted and is currently pending admin verification.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Tab: Profile                                                               */
/* ────────────────────────────────────────────────────────────────────────── */

function ProfileTab({ home }: { home: any }) {
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const m = await credupeApi.partner.me();
        if (mounted) setMe(m?.profile || null);
      } catch (err) {
        const msg = err instanceof CredupeApiError ? err.messages[0] : "Failed to load profile";
        toast({ title: "Error", description: msg, variant: "destructive" });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [toast]);

  if (loading) return <SpinnerBlock />;
  if (!me) return null;

  const rows: Array<{ label: string; value: string; icon?: any }> = [
    { label: "Partner Code", value: me.partnerCode || "—" },
    { label: "Business Name", value: me.businessName || "—" },
    { label: "Contact Person", value: me.contactPerson || "—" },
    { label: "Email", value: me.email || me.user?.email || "—", icon: Mail },
    { label: "Mobile", value: me.mobile || me.user?.mobile || "—", icon: Phone },
    { label: "City", value: [me.city, me.state, me.pincode].filter(Boolean).join(", ") || "—", icon: MapPin },
    { label: "GST", value: me.gstNumber || "—" },
    { label: "PAN", value: me.panNumber || (me.panLast4 ? `XXXXX${me.panLast4}` : "—") },
    { label: "Onboarding", value: me.onboardingStep || "—" },
  ];

  let bank: any = null;
  try {
    if (me.bankAccount) {
      bank = typeof me.bankAccount === "string" ? JSON.parse(me.bankAccount) : me.bankAccount;
    }
  } catch (e) {
    console.error("Failed to parse bankAccount JSON:", e);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-card border border-border rounded-2xl p-6">
        <p className="text-sm font-semibold text-foreground mb-4">Profile</p>
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
              <span className="text-xs text-muted-foreground flex items-center gap-2">
                {r.icon && <r.icon className="w-3.5 h-3.5" />} {r.label}
              </span>
              <span className="text-sm font-medium text-foreground text-right">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-sm font-semibold text-foreground mb-4">Payout account</p>
        {bank ? (
          <div className="space-y-2.5 text-sm">
            <Row label="Bank" value={bank.bankName} />
            <Row label="Account holder" value={bank.accountHolder} />
            <Row label="Account no." value={bank.accountNumber ? `••••${String(bank.accountNumber).slice(-4)}` : "—"} mono />
            <Row label="IFSC" value={bank.ifsc} mono />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No payout account on file.</p>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value?: string | null; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium text-foreground ${mono ? "font-mono" : ""}`}>{value || "—"}</span>
    </div>
  );
}

function SpinnerBlock() {
  return (
    <div className="py-16 flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-primary animate-spin" />
    </div>
  );
}
