/**
 * Credupe — Employee Dashboard
 * ============================================================================
 * Single-page console for internal loan officers. Eight modules selectable
 * from a left rail: Overview · My Leads · Applications · Performance ·
 * Payouts · Tasks · Customer 360 · Quick Apply · Announcements.
 *
 * All data flows through the same `/bff/proxy/employee/*` namespace so the
 * server cookie session is reused.
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { credupeApi, CredupeApiError } from "@/lib/credupe-api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/sonner";
import {
  LayoutDashboard, Users, FileText, BarChart3, Wallet, ListChecks, Search,
  Zap, Megaphone, Loader2, TrendingUp, IndianRupee, Award, Target, ChevronRight,
  CheckCircle2, AlertCircle, CalendarClock, Filter, ArrowRight, Sparkles,
} from "lucide-react";

type Section =
  | "overview" | "leads" | "applications" | "performance"
  | "payouts" | "tasks" | "customer360" | "quickapply" | "announcements";

const NAV: { key: Section; label: string; icon: any }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "leads", label: "My Leads", icon: Users },
  { key: "applications", label: "Applications", icon: FileText },
  { key: "performance", label: "Performance", icon: BarChart3 },
  { key: "payouts", label: "Payouts", icon: Wallet },
  { key: "tasks", label: "Tasks", icon: ListChecks },
  { key: "customer360", label: "Customer 360", icon: Search },
  { key: "quickapply", label: "Quick Apply", icon: Zap },
  { key: "announcements", label: "Announcements", icon: Megaphone },
];

const inr = (n: number) =>
  n >= 1_00_00_000 ? `₹${(n / 1_00_00_000).toFixed(2)} Cr`
    : n >= 100_000 ? `₹${(n / 100_000).toFixed(2)} L`
      : `₹${Math.round(n).toLocaleString("en-IN")}`;
const inrFull = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const proxy = <T,>(path: string) =>
  fetch(`/bff/proxy${path}`, { credentials: "include" }).then(async (r) => {
    const j = await r.json();
    if (!j.success) throw new CredupeApiError(r.status, j.error?.message ?? ["Request failed"]);
    return j.data as T;
  });

// Centralised loader so every section gets identical error handling.
// `proxy` is module-level and `setData` is a stable useState setter, so the
// empty deps array is intentional — we want this to fire once on mount.
function useResource<T>(path: string): { data: T | null; error: string | null } {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    proxy<T>(path)
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => {
        if (cancelled) return;
        const msg = e instanceof CredupeApiError ? e.messages[0] : "Couldn't load this section.";
        setError(msg);
        if (process.env.NODE_ENV !== "production") console.warn(`[employee] ${path} failed:`, e);
      });
    return () => { cancelled = true; };
  }, [path]);
  return { data, error };
}

const EmployeeDashboard = () => {
  const { user, isReady, signOut } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("overview");
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;
    if (!user) { navigate("/login"); return; }
    proxy<any>("/employee/me")
      .then((d) => setMe(d))
      .catch((e) => {
        if (e instanceof CredupeApiError && e.status === 403) {
          toast.error("Not an employee account", { description: "Sign in with employee@credupe.local / Employee@123" });
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [isReady, user, navigate]);

  if (!isReady || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
      </div>
    );
  }
  if (!me) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Sidebar ──────────────────────────────────────────── */}
          <aside className="lg:w-64 shrink-0">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-base font-bold shrink-0">
                  {me.employee.fullName.split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-foreground truncate" data-testid="emp-name">{me.employee.fullName}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{me.employee.employeeCode}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{me.employee.designation}</div>
                </div>
              </div>
              <div className="border-t border-border pt-3 mb-2">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Branch</div>
                <div className="text-xs text-foreground">{me.employee.branch}</div>
              </div>
              <nav className="mt-3 space-y-1">
                {NAV.map((n) => {
                  const Icon = n.icon;
                  const active = section === n.key;
                  return (
                    <button
                      key={n.key}
                      onClick={() => setSection(n.key)}
                      data-testid={`emp-nav-${n.key}`}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{n.label}</span>
                    </button>
                  );
                })}
              </nav>
              <button
                onClick={async () => { await signOut(); navigate("/login"); }}
                className="w-full mt-4 text-[11px] text-muted-foreground hover:text-foreground"
                data-testid="emp-signout"
              >
                Sign out
              </button>
            </div>
          </aside>

          {/* ── Main panel ───────────────────────────────────────── */}
          <main className="flex-1 min-w-0 space-y-5">
            {section === "overview" && <Overview me={me} go={setSection} />}
            {section === "leads" && <LeadsSection />}
            {section === "applications" && <ApplicationsSection />}
            {section === "performance" && <PerformanceSection />}
            {section === "payouts" && <PayoutsSection />}
            {section === "tasks" && <TasksSection />}
            {section === "customer360" && <Customer360Section />}
            {section === "quickapply" && <QuickApplySection />}
            {section === "announcements" && <AnnouncementsSection />}
          </main>
        </div>
      </div>
    </div>
  );
};

/* ─────────── Overview ───────────────────────────────────────────────────── */
function Overview({ me, go }: { me: any; go: (s: Section) => void }) {
  const k = me.kpis;
  return (
    <>
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/8 via-card to-[hsl(275_45%_58%)]/8 p-6">
        <div className="text-xs font-bold text-primary tracking-widest uppercase mb-1">Good morning</div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back, {me.employee.fullName.split(" ")[0]}.</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          You're <strong className="text-foreground">rank #{k.rankInBranch}</strong> in your branch this month —
          <strong className="text-foreground"> {k.targetPct}%</strong> of your ₹{(me.employee.monthlyTarget / 1_00_00_000).toFixed(1)} Cr target achieved.
        </p>
        <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${k.targetPct}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" data-testid="emp-overview-kpis">
        <Kpi icon={IndianRupee} label="Disbursal · MTD" value={`₹${k.monthDisbursalCr.toFixed(2)} Cr`} sub="vs ₹5 Cr target" />
        <Kpi icon={Users} label="Leads · MTD" value={String(k.leadsThisMonth)} sub={`${k.convertedThisMonth} converted`} />
        <Kpi icon={TrendingUp} label="Conversion rate" value={`${k.conversionRate}%`} sub="rolling 30 days" />
        <Kpi icon={Award} label="Rank · Branch" value={`#${k.rankInBranch}`} sub={`#${k.rankNational} national`} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <button onClick={() => go("leads")} data-testid="emp-overview-leads-btn" className="rounded-2xl border border-border bg-card p-5 text-left hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold text-foreground">My Leads</div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">24 active leads · jump in and qualify them.</p>
        </button>
        <button onClick={() => go("tasks")} data-testid="emp-overview-tasks-btn" className="rounded-2xl border border-border bg-card p-5 text-left hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold text-foreground">Today's tasks</div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Open follow-ups, doc collection, site visits.</p>
        </button>
      </div>
    </>
  );
}

function Kpi({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="text-xl md:text-2xl font-bold text-foreground leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">{label}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}

/* ─────────── Leads ──────────────────────────────────────────────────────── */
function LeadsSection() {
  const { data, error } = useResource<any>("/employee/leads");
  const [filter, setFilter] = useState<string>("ALL");
  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;
  const shown = data.leads.filter((l: any) => filter === "ALL" || l.status === filter);
  return (
    <SectionShell title="My Leads" sub={`${data.leads.length} active across 6 stages`} testId="emp-leads">
      <div className="flex flex-wrap gap-2 mb-4">
        <Pill label={`All · ${data.leads.length}`} active={filter === "ALL"} onClick={() => setFilter("ALL")} />
        {Object.entries(data.summary).map(([k, v]: any) => (
          <Pill key={k} label={`${k.replace(/_/g, " ")} · ${v}`} active={filter === k} onClick={() => setFilter(k)} />
        ))}
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3 hidden md:table-cell">Loan</th>
              <th className="px-4 py-3 hidden sm:table-cell">Amount</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3 hidden lg:table-cell">Last action</th>
              <th className="px-4 py-3 hidden lg:table-cell">Source</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {shown.map((l: any) => (
              <tr key={l.id} className="hover:bg-muted/30" data-testid={`emp-lead-${l.id}`}>
                <td className="px-4 py-3">
                  <div className="text-xs font-bold text-foreground">{l.customerName}</div>
                  <div className="text-[10px] text-muted-foreground">{l.mobile} · {l.city}</div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-[11px] text-foreground">{l.loanType.replace(/_/g, " ")}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-[11px] text-primary font-semibold">{inr(l.amountRequested)}</td>
                <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                <td className="px-4 py-3 hidden lg:table-cell text-[11px] text-muted-foreground">{l.lastAction}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-[11px] text-muted-foreground">{l.source}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-[11px] font-semibold text-primary hover:underline">Open →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}

/* ─────────── Applications ───────────────────────────────────────────────── */
function ApplicationsSection() {
  const { data, error } = useResource<any>("/employee/applications");
  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;
  return (
    <SectionShell title="Applications" sub="Live applications across your branch" testId="emp-applications">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
        {Object.entries(data.counts).map(([k, v]: any) => (
          <div key={k} className="rounded-lg border border-border bg-card p-3">
            <div className="text-base font-bold text-foreground">{v as number}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{k.replace(/_/g, " ")}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Ref</th>
              <th className="px-4 py-3 hidden md:table-cell">Customer</th>
              <th className="px-4 py-3 hidden sm:table-cell">Loan</th>
              <th className="px-4 py-3 hidden sm:table-cell">Amount</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3 hidden lg:table-cell">Lender</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.applications.map((a: any) => (
              <tr key={a.id} className="hover:bg-muted/30" data-testid={`emp-app-${a.id}`}>
                <td className="px-4 py-3 text-[11px] font-mono text-foreground">{a.referenceNo}</td>
                <td className="px-4 py-3 hidden md:table-cell text-[11px] text-muted-foreground">{a.customerEmail}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-[11px]">{a.loanType.replace(/_/g, " ")}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-[11px] text-primary font-semibold">{inr(a.amountRequested)}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3 hidden lg:table-cell text-[11px] text-muted-foreground">{a.lender}</td>
              </tr>
            ))}
            {data.applications.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[11px] text-muted-foreground">No active applications.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}

/* ─────────── Performance ────────────────────────────────────────────────── */
function PerformanceSection() {
  const { data, error } = useResource<any>("/employee/performance");
  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;
  const k = data.kpis;
  const maxTrend = Math.max(...data.trend.map((t: any) => t.disbursalCr));
  return (
    <SectionShell title="Performance" sub="Your numbers vs branch and national peers" testId="emp-performance">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Kpi icon={IndianRupee} label="Disbursal · MTD" value={`₹${k.monthDisbursalCr.toFixed(2)} Cr`} sub={`${k.targetPct}% of target`} />
        <Kpi icon={TrendingUp} label="Conversion" value={`${k.conversionRate}%`} sub={`${k.convertedThisMonth}/${k.leadsThisMonth} leads`} />
        <Kpi icon={CalendarClock} label="Avg TAT" value={`${k.avgTat.toFixed(1)} d`} sub="lead → disbursal" />
        <Kpi icon={Award} label="Rank · National" value={`#${k.rankNational}`} sub={`#${k.rankInBranch} in branch`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-foreground">12-month disbursal trend</h3>
            <span className="text-[10px] text-muted-foreground">₹ Cr</span>
          </div>
          <div className="flex items-end gap-1.5 h-40">
            {data.trend.map((t: any) => (
              <div key={t.month} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full rounded-t bg-primary/80 hover:bg-primary transition-colors" style={{ height: `${(t.disbursalCr / maxTrend) * 100}%`, minHeight: 4 }} title={`${t.disbursalCr} Cr`} />
                <div className="text-[9px] text-muted-foreground">{t.month}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Product mix</h3>
          <div className="space-y-2.5">
            {data.productMix.map((p: any) => (
              <div key={p.loanType}>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-foreground">{p.loanType.replace(/_/g, " ")}</span>
                  <span className="text-muted-foreground font-semibold">{p.share}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${p.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground">Branch leaderboard · this month</h3>
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          {data.leaderboard.map((l: any) => (
            <div key={l.code} className={`flex items-center gap-3 p-2.5 rounded-lg ${l.you ? "bg-primary/8 border border-primary/20" : "hover:bg-muted/40"}`} data-testid={`emp-leader-${l.rank}`}>
              <div className={`w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold ${l.rank === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>#{l.rank}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  {l.name}
                  {l.you && <span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary text-[9px] font-bold">YOU</span>}
                </div>
                <div className="text-[10px] text-muted-foreground">{l.code}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-foreground">₹{l.disbursalCr.toFixed(2)} Cr</div>
                <div className="text-[10px] text-muted-foreground">{l.conversions} conv.</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

/* ─────────── Payouts ────────────────────────────────────────────────────── */
function PayoutsSection() {
  const { data, error } = useResource<any>("/employee/payouts");
  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;
  return (
    <SectionShell title="Payouts" sub="Commission earned, paid and pending" testId="emp-payouts">
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Kpi icon={IndianRupee} label="Earned · YTD" value={inr(data.totals.earned)} sub="gross commission" />
        <Kpi icon={CheckCircle2} label="Paid" value={inr(data.totals.paid)} sub="net of TDS" />
        <Kpi icon={AlertCircle} label="Pending" value={inr(data.totals.pending)} sub="awaiting processing" />
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Period</th>
              <th className="px-4 py-3 hidden sm:table-cell">Disbursal</th>
              <th className="px-4 py-3 hidden md:table-cell">Earned</th>
              <th className="px-4 py-3 hidden md:table-cell">TDS</th>
              <th className="px-4 py-3">Net</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Statement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.statements.map((s: any) => (
              <tr key={s.period} className="hover:bg-muted/30" data-testid={`emp-payout-${s.period.replace(/ /g, "-").toLowerCase()}`}>
                <td className="px-4 py-3 text-xs font-bold text-foreground">{s.period}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-[11px] text-foreground">₹{s.disbursalCr} Cr</td>
                <td className="px-4 py-3 hidden md:table-cell text-[11px] text-muted-foreground">{inrFull(s.earned)}</td>
                <td className="px-4 py-3 hidden md:table-cell text-[11px] text-muted-foreground">{inrFull(s.tds)}</td>
                <td className="px-4 py-3 text-[11px] text-primary font-semibold">{inrFull(s.net)}</td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3 text-right">
                  <a href={s.statementUrl} className="text-[11px] font-semibold text-primary hover:underline">Download</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}

/* ─────────── Tasks ──────────────────────────────────────────────────────── */
function TasksSection() {
  const { data, error } = useResource<any>("/employee/tasks");
  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;
  return (
    <SectionShell title="Tasks & Follow-ups" sub="What needs your attention today" testId="emp-tasks">
      <div className="grid grid-cols-4 gap-3 mb-5">
        <Kpi icon={AlertCircle} label="Overdue" value={String(data.summary.overdue)} sub="action now" />
        <Kpi icon={CalendarClock} label="Today" value={String(data.summary.today)} sub="scheduled" />
        <Kpi icon={ListChecks} label="Upcoming" value={String(data.summary.upcoming)} sub="this week" />
        <Kpi icon={CheckCircle2} label="Done" value={String(data.summary.done)} sub="this month" />
      </div>
      <div className="space-y-2">
        {data.tasks.map((t: any) => (
          <div key={t.id} className="rounded-xl border border-border bg-card p-4 flex flex-wrap items-center gap-3" data-testid={`emp-task-${t.id}`}>
            <div className={`w-2 h-10 rounded-full ${t.priority === "HIGH" ? "bg-destructive" : t.priority === "MEDIUM" ? "bg-amber-500" : "bg-emerald-500"}`} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-foreground">{t.title}</div>
              <div className="text-[10px] text-muted-foreground">{t.customer} · {new Date(t.dueAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
            </div>
            <StatusBadge status={t.status} />
            <button className="text-[11px] font-semibold text-primary hover:underline">Mark done</button>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ─────────── Customer 360 ───────────────────────────────────────────────── */
function Customer360Section() {
  const [q, setQ] = useState("");
  const [data, setData] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  useEffect(() => {
    if (q.trim().length < 2) { setData(null); return; }
    let cancelled = false;
    setSearching(true);
    const t = setTimeout(() => {
      proxy<any>(`/employee/customer-search?q=${encodeURIComponent(q.trim())}`)
        .then((d) => { if (!cancelled) setData(d); })
        .finally(() => { if (!cancelled) setSearching(false); });
    }, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [q]);
  return (
    <SectionShell title="Customer 360" sub="Search any Credupe customer by email or mobile" testId="emp-customer360">
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="search" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Email or mobile (min. 2 chars)…"
          data-testid="emp-c360-input"
          className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary/40"
        />
        {searching && <Loader2 className="w-4 h-4 text-primary animate-spin absolute right-3 top-1/2 -translate-y-1/2" />}
      </div>
      {data && data.results.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">No customers matched "{q}".</div>
      )}
      <div className="space-y-2">
        {data?.results.map((c: any) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-4 flex flex-wrap items-center gap-3" data-testid={`emp-c360-result-${c.id}`}>
            <div className="w-10 h-10 rounded-full bg-primary/12 flex items-center justify-center text-primary text-xs font-bold">
              {(c.name || c.email).slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-foreground">{c.name}</div>
              <div className="text-[10px] text-muted-foreground">{c.email} · {c.mobile ?? "—"} · {c.city ?? "—"}</div>
            </div>
            <div className="text-[11px] text-muted-foreground">
              <strong className="text-foreground">{c.applicationsCount}</strong> applications · CIBIL {c.cibilRange ?? "—"}
            </div>
            {c.latestApplication && (
              <span className="px-2 py-0.5 rounded-full bg-primary/12 text-primary text-[10px] font-semibold">
                Latest: {c.latestApplication.referenceNo}
              </span>
            )}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ─────────── Quick Apply ────────────────────────────────────────────────── */
function QuickApplySection() {
  const [step, setStep] = useState<"search" | "form" | "done">("search");
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [pick, setPick] = useState<any>(null);
  const [form, setForm] = useState({ loanType: "PERSONAL_LOAN", amount: "500000", tenure: "36" });
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<any>(null);

  useEffect(() => {
    if (q.trim().length < 2) { setResults([]); return; }
    const t = setTimeout(() => {
      proxy<any>(`/employee/customer-search?q=${encodeURIComponent(q.trim())}`).then((d) => setResults(d.results));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  async function submit() {
    if (!pick) return;
    setSubmitting(true);
    try {
      const r = await fetch("/bff/proxy/employee/quick-apply", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerUserId: pick.id,
          loanType: form.loanType,
          amountRequested: Number(form.amount),
          tenureMonths: Number(form.tenure),
        }),
      }).then((r) => r.json());
      if (!r.success) throw new Error(r.error?.message?.[0] ?? "Failed");
      setCreated(r.data); setStep("done");
      toast.success("Application created", { description: r.data.application.referenceNo });
    } catch (e: any) {
      toast.error("Could not file application", { description: e.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SectionShell title="Quick Apply" sub="File a fresh application on behalf of a walk-in customer" testId="emp-quickapply">
      {step === "search" && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search customer by email or mobile…"
              data-testid="emp-qa-search"
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary/40"
            />
          </div>
          {results.map((c) => (
            <button key={c.id} onClick={() => { setPick(c); setStep("form"); }} data-testid={`emp-qa-pick-${c.id}`} className="w-full text-left rounded-xl border border-border bg-card p-4 hover:border-primary/40">
              <div className="text-xs font-bold text-foreground">{c.name}</div>
              <div className="text-[10px] text-muted-foreground">{c.email} · {c.mobile ?? "—"}</div>
            </button>
          ))}
        </div>
      )}

      {step === "form" && pick && (
        <div className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1">Filing for</div>
            <div className="text-sm font-bold text-foreground">{pick.name}</div>
            <div className="text-[11px] text-muted-foreground">{pick.email}</div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <Labelled label="Loan Type">
              <select value={form.loanType} onChange={(e) => setForm({ ...form, loanType: e.target.value })} data-testid="emp-qa-loantype" className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs text-foreground">
                {["PERSONAL_LOAN", "HOME_LOAN", "CAR_LOAN", "BUSINESS_LOAN", "EDUCATION_LOAN", "LOAN_AGAINST_PROPERTY", "GOLD_LOAN", "TWO_WHEELER_LOAN", "USED_CAR_LOAN", "MICRO_LOAN"].map((t) => (
                  <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                ))}
              </select>
            </Labelled>
            <Labelled label="Amount (₹)">
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} data-testid="emp-qa-amount" className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs text-foreground" />
            </Labelled>
            <Labelled label="Tenure (months)">
              <input type="number" value={form.tenure} onChange={(e) => setForm({ ...form, tenure: e.target.value })} data-testid="emp-qa-tenure" className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs text-foreground" />
            </Labelled>
          </div>
          <div className="flex gap-2">
            <button onClick={submit} disabled={submitting} data-testid="emp-qa-submit" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              File application
            </button>
            <button onClick={() => setStep("search")} className="px-5 py-3 rounded-xl border border-border text-sm">Cancel</button>
          </div>
        </div>
      )}

      {step === "done" && created && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center" data-testid="emp-qa-done">
          <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="text-base font-bold text-foreground">Application filed</h3>
          <p className="text-xs text-muted-foreground mt-1">{created.application.referenceNo} · status {created.application.status}</p>
          <button onClick={() => { setStep("search"); setPick(null); setQ(""); setResults([]); setCreated(null); }} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline">
            File another <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </SectionShell>
  );
}

/* ─────────── Announcements ──────────────────────────────────────────────── */
function AnnouncementsSection() {
  const { data, error } = useResource<any>("/employee/announcements");
  if (error) return <ErrorState message={error} />;
  if (!data) return <Loading />;
  return (
    <SectionShell title="Announcements" sub="Policy, training, incentives and compliance updates" testId="emp-announcements">
      <div className="space-y-3">
        {data.announcements.map((a: any) => (
          <div key={a.id} className="rounded-xl border border-border bg-card p-5" data-testid={`emp-announce-${a.id}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold tracking-wider uppercase">{a.category}</span>
              <span className="text-[10px] text-muted-foreground">{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
            <h3 className="text-sm font-bold text-foreground">{a.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{a.body}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ─────────── Shared bits ────────────────────────────────────────────────── */
function SectionShell({ title, sub, children, testId }: { title: string; sub: string; children: any; testId: string }) {
  return (
    <div className="space-y-4" data-testid={testId}>
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </div>
      {children}
    </div>
  );
}

function Loading() {
  return <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 flex items-start gap-3" data-testid="emp-error">
      <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
      <div>
        <div className="text-sm font-bold text-foreground">Couldn't load this section</div>
        <div className="text-xs text-muted-foreground mt-0.5">{message}</div>
      </div>
    </div>
  );
}

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors ${active ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-primary/40"}`}>
      {label}
    </button>
  );
}

function Labelled({ label, children }: { label: string; children: any }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">{label}</div>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    NEW: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    CONTACTED: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    QUALIFIED: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    APPLICATION_CREATED: "bg-primary/15 text-primary",
    CONVERTED: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    DROPPED: "bg-muted text-muted-foreground",
    LEAD: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    LOGIN: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    DOC_PENDING: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    UNDER_REVIEW: "bg-primary/15 text-primary",
    APPROVED: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    OPEN: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    OVERDUE: "bg-destructive/15 text-destructive",
    DONE: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    PAID: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    PROCESSING: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  };
  return <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase ${map[status] ?? "bg-muted text-muted-foreground"}`}>{status.replace(/_/g, " ")}</span>;
}

export default EmployeeDashboard;
