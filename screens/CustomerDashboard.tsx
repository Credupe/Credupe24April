import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, FileText, CreditCard, ChevronRight, Edit2, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { credupeApi } from "@/lib/credupe-api";
import { useAuth } from "@/hooks/useAuth";

const applicationStages = ["Applied", "Documentation", "Underwriting", "Approved", "Disbursed"];

// Map Credupe NestJS ApplicationStatus → UI progress-bar stage index.
const STATUS_TO_STAGE: Record<string, number> = {
  LEAD: 0,
  LOGIN: 0,
  DOC_PENDING: 1,
  UNDER_REVIEW: 2,
  APPROVED: 3,
  DISBURSED: 4,
  REJECTED: 2,
  CANCELLED: 0,
};

const LOAN_TYPE_LABEL: Record<string, string> = {
  PERSONAL_LOAN: "Personal Loan",
  HOME_LOAN: "Home Loan",
  LOAN_AGAINST_PROPERTY: "Loan Against Property",
  BUSINESS_LOAN: "Business Loan",
  CAR_LOAN: "Car Loan",
  USED_CAR_LOAN: "Used Car Loan",
  TWO_WHEELER_LOAN: "Two Wheeler Loan",
  EDUCATION_LOAN: "Education Loan",
  GOLD_LOAN: "Gold Loan",
  MICRO_LOAN: "Micro Loan",
  CREDIT_CARD: "Credit Card",
};

function formatAmount(n?: number | string | null) {
  if (n == null) return "—";
  const num = Number(n);
  if (!Number.isFinite(num) || num === 0) return "—";
  return `₹${num.toLocaleString("en-IN")}`;
}

const mockApplications = [
  { id: "APP-2024-001", product: "Personal Loan", amount: "₹5,00,000", stage: 3, date: "2024-12-15" },
  { id: "APP-2024-002", product: "Credit Card", amount: "—", stage: 4, date: "2024-11-20" },
  { id: "APP-2024-003", product: "Home Loan", amount: "₹45,00,000", stage: 1, date: "2025-01-05" },
];

const mockPortfolio = [
  { product: "Personal Loan", provider: "HDFC Bank", amount: "₹5,00,000", roi: "10.5%", tenure: "36 months", status: "Active" },
  { product: "Credit Card", provider: "ICICI Bank", amount: "₹2,00,000", roi: "—", tenure: "—", status: "Active" },
];

const mockProfile = {
  name: "Rajesh Kumar",
  email: "rajesh.kumar@email.com",
  phone: "+91 98765 43210",
  pan: "ABCPK1234H",
  city: "Mumbai",
};

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "tracker" | "portfolio">("tracker");
  const { authSource } = useAuth();
  const [liveApps, setLiveApps] = useState<typeof mockApplications | null>(null);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    if (authSource !== "credupe") return;
    let cancelled = false;
    setLoadingApps(true);
    credupeApi.applications
      .mine({ pageSize: 20 })
      .then((page) => {
        if (cancelled) return;
        const rows = (page.items || []).map((a: any) => ({
          id: a.referenceNo || a.id,
          product: LOAN_TYPE_LABEL[a.loanType] ?? a.loanType,
          amount: formatAmount(a.amountRequested),
          stage: STATUS_TO_STAGE[a.status] ?? 0,
          date: a.createdAt ? String(a.createdAt).slice(0, 10) : "",
        }));
        setLiveApps(rows);
      })
      .catch(() => {
        if (!cancelled) setLiveApps(null); // fall through to mock
      })
      .finally(() => {
        if (!cancelled) setLoadingApps(false);
      });
    return () => { cancelled = true; };
  }, [authSource]);

  const applicationsToShow = liveApps && liveApps.length > 0 ? liveApps : mockApplications;

  return (
    <div className="min-h-screen bg-background max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <Navbar />
      <div className="py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Customer Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, track applications, and view your portfolio.</p>

        {/* Tabs */}
        <div className="flex gap-1 mt-6 bg-muted rounded-xl p-1 w-fit">
          {([
            { key: "profile", label: "Profile", icon: User },
            { key: "tracker", label: "Applications", icon: FileText },
            { key: "portfolio", label: "Portfolio", icon: CreditCard },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="mt-6 bg-card border border-border rounded-xl p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">User Profile</h2>
              <button className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
            <div className="space-y-4">
              {Object.entries(mockProfile).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground capitalize">{key.replace("_", " ")}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tracker Tab */}
        {activeTab === "tracker" && (
          <div className="mt-6 space-y-4">
            {loadingApps && (
              <div className="text-sm text-muted-foreground">Loading your applications…</div>
            )}
            {applicationsToShow.map((app) => (
              <div key={app.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{app.product}</p>
                    <p className="text-xs text-muted-foreground">{app.id} • Applied {app.date}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">{app.amount}</span>
                </div>
                {/* Progress bar */}
                <Progress value={(app.stage / (applicationStages.length - 1)) * 100} className="h-2 mb-3" />
                <div className="flex justify-between">
                  {applicationStages.map((stage, i) => (
                    <div key={stage} className="flex flex-col items-center flex-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 ${
                        i <= app.stage ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        {i < app.stage ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
                      </div>
                      <span className={`text-[10px] ${i <= app.stage ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {stage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === "portfolio" && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Products Availed</h2>
            <div className="space-y-3">
              {mockPortfolio.map((item) => (
                <div key={item.product} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.product}</p>
                      <p className="text-xs text-muted-foreground">{item.provider}</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">{item.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Amount / Limit", value: item.amount },
                      { label: "ROI", value: item.roi },
                      { label: "Tenure", value: item.tenure },
                    ].map((d) => (
                      <div key={d.label}>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{d.label}</p>
                        <p className="text-sm font-semibold text-foreground mt-0.5">{d.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
