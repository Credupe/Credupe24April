import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Building2, TrendingUp, Users, BarChart3, Award, UserPlus, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const mockPartnerProfile = {
  company: "FinServe Solutions Pvt. Ltd.",
  contact: "Arun Mehta",
  email: "arun@finserve.in",
  phone: "+91 99887 76655",
  gst: "27AABCF1234A1Z5",
  tier: "Gold Partner",
  joined: "March 2024",
};

const mockMetrics = [
  { label: "Total Leads", value: "1,247", icon: Users, change: "+12%" },
  { label: "Conversions", value: "348", icon: TrendingUp, change: "+8%" },
  { label: "Commission Earned", value: "₹4,52,000", icon: BarChart3, change: "+15%" },
  { label: "Partner Rank", value: "#12", icon: Award, change: "↑3" },
];

const mockLeads = [
  { id: "LD-001", name: "Suresh P.", product: "Home Loan", status: "Approved", commission: "₹12,000" },
  { id: "LD-002", name: "Meena K.", product: "Personal Loan", status: "Documentation", commission: "—" },
  { id: "LD-003", name: "Rohan D.", product: "Business Loan", status: "Disbursed", commission: "₹18,500" },
  { id: "LD-004", name: "Kavita S.", product: "Credit Card", status: "Applied", commission: "—" },
];

const mockTeam = [
  { name: "Priya Sharma", role: "Sales Lead", email: "priya@finserve.in" },
  { name: "Rohit Nair", role: "Relationship Manager", email: "rohit@finserve.in" },
  { name: "Deepa Iyer", role: "Operations", email: "deepa@finserve.in" },
];

const statusColor: Record<string, string> = {
  Applied: "bg-blue-100 text-blue-700",
  Documentation: "bg-yellow-100 text-yellow-700",
  Underwriting: "bg-orange-100 text-orange-700",
  Approved: "bg-green-100 text-green-700",
  Disbursed: "bg-primary/10 text-primary",
};

const PartnerDashboard = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "performance" | "team">("performance");

  return (
    <div className="min-h-screen bg-background max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <Navbar />
      <div className="py-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Partner Dashboard</h1>
            <p className="text-sm text-muted-foreground">{mockPartnerProfile.company}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6 bg-muted rounded-xl p-1 w-fit">
          {([
            { key: "profile", label: "Partner Profile", icon: Building2 },
            { key: "performance", label: "Performance", icon: TrendingUp },
            { key: "team", label: "Team Admin", icon: Users },
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

        {/* Partner Profile */}
        {activeTab === "profile" && (
          <div className="mt-6 bg-card border border-border rounded-xl p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-foreground">Partner Credentials</h2>
              <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">{mockPartnerProfile.tier}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-6">Member since {mockPartnerProfile.joined}</p>
            <div className="space-y-4">
              {Object.entries(mockPartnerProfile).filter(([k]) => !["tier", "joined"].includes(k)).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground capitalize">{key.replace("_", " ")}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance */}
        {activeTab === "performance" && (
          <div className="mt-6 space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {mockMetrics.map((m) => (
                <div key={m.label} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <m.icon className="w-4 h-4 text-primary" />
                    <span className="text-xs text-green-600 font-medium">{m.change}</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{m.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Conversion Rate */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">Conversion Rate</p>
                <span className="text-sm font-bold text-primary">27.9%</span>
              </div>
              <Progress value={27.9} className="h-2" />
            </div>

            {/* Lead Status */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Recent Leads</h3>
              <div className="space-y-3">
                {mockLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.id} • {lead.product}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[lead.status] || ""}`}>{lead.status}</span>
                      <span className="text-xs font-medium text-foreground w-16 text-right">{lead.commission}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Admin */}
        {activeTab === "team" && (
          <div className="mt-6 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
                <p className="text-xs text-muted-foreground">{mockTeam.length}/5 seats used</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <UserPlus className="w-3.5 h-3.5" /> Add Member
              </button>
            </div>
            <div className="space-y-2">
              {mockTeam.map((member) => (
                <div key={member.email} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role} • {member.email}</p>
                    </div>
                  </div>
                  <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
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

export default PartnerDashboard;
