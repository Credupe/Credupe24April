import { Building2, Star, Zap, Shield, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";

const partners = [
  { bank: "SBI", limit: "₹50L (unsecured), up to ₹3 Cr (secured)", collateral: "Required above ₹50L", rate: "8.65% – 9.15%", time: "30–45 days (15–20 via CreduPe)" },
  { bank: "Axis Bank", limit: "₹1.5 Cr (Prime A), ₹50–75L (Prime B)", collateral: "Optional; unsecured up to ₹1 Cr", rate: "7% – 12.25%", time: "5–7 days" },
  { bank: "ICICI Bank", limit: "₹40L (unsecured), ₹1 Cr+ (secured)", collateral: "Required above ₹40L", rate: "9% – 12%", time: "15–25 days" },
  { bank: "IDFC First Bank", limit: "₹40L (unsecured), ₹1 Cr+ (secured)", collateral: "Required above ₹40L", rate: "9.5% – 11.5%", time: "20–25 days" },
  { bank: "Credila (HDFC)", limit: "₹40L (unsecured), higher with collateral", collateral: "Required above ₹40L", rate: "11% – 12%", time: "15–20 days" },
  { bank: "Avanse", limit: "₹40L (unsecured), up to ₹1.5 Cr (secured)", collateral: "Required above ₹40L", rate: "11% – 13%", time: "15–20 days" },
  { bank: "InCred", limit: "₹40L (unsecured), higher with collateral", collateral: "Required above ₹40L", rate: "11% – 13%", time: "15–20 days" },
  { bank: "Mpower Financing", limit: "Up to USD 100,000 equivalent", collateral: "No collateral, no co-signer", rate: "11% – 13%", time: "10–15 days" },
  { bank: "Prodigy Finance", limit: "Up to USD 100,000 equivalent", collateral: "No collateral, no co-signer", rate: "10% – 12%", time: "10–15 days" },
  { bank: "Bank of Baroda", limit: "₹40L (unsecured), up to ₹1.5 Cr (secured)", collateral: "Required above ₹40L", rate: "9% – 11%", time: "20–30 days" },
];

const insights = [
  { icon: Star, title: "Best for Large Amounts", desc: "SBI, Axis, Bank of Baroda (secured loans up to ₹3 Cr / ₹1.5 Cr)" },
  { icon: Shield, title: "Best Collateral-Free", desc: "Mpower & Prodigy (no collateral, no co-signer)" },
  { icon: Zap, title: "Fastest Processing", desc: "Axis (5–7 days), Mpower & Prodigy (10–15 days)" },
  { icon: TrendingDown, title: "Lowest Interest Rates", desc: "Axis (starting ~7%), SBI (female concessions)" },
];

const EducationLoanPartners = () => (
  <div className="space-y-16 pb-16">
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">CreduPe Partner Banks & Lenders</h2>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {insights.map((ins) => {
          const Icon = ins.icon;
          return (
            <div key={ins.title} className="bg-[hsl(var(--purple-deep))] rounded-xl p-4">
              <Icon className="w-5 h-5 text-white/80 mb-2" />
              <h3 className="text-sm font-bold text-white">{ins.title}</h3>
              <p className="text-xs text-white/70 mt-1">{ins.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Partner Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[hsl(var(--purple-deep))] text-white">
              <th className="text-left p-3 font-semibold">Bank / Lender</th>
              <th className="text-left p-3 font-semibold">Loan Limit</th>
              <th className="text-left p-3 font-semibold">Collateral Rules</th>
              <th className="text-left p-3 font-semibold">Interest Rate</th>
              <th className="text-left p-3 font-semibold">Processing Time</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p, i) => (
              <tr key={p.bank} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                <td className="p-3 font-bold text-foreground">{p.bank}</td>
                <td className="p-3 text-muted-foreground text-xs">{p.limit}</td>
                <td className="p-3 text-muted-foreground text-xs">{p.collateral}</td>
                <td className="p-3 text-primary font-semibold text-xs">{p.rate}</td>
                <td className="p-3 text-muted-foreground text-xs">{p.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    {/* CTA */}
    <section className="bg-[hsl(var(--purple-deep))] rounded-xl p-8 text-center">
      <h2 className="text-xl font-bold text-white mb-2">Ready to Fund Your Education?</h2>
      <p className="text-sm text-white/70 mb-6 max-w-md mx-auto">CreduPe experts help you find the best loan match, negotiate competitive rates, and get faster approvals.</p>
      <div className="flex items-center justify-center gap-4">
        <Link to="/login" className="px-6 py-3 rounded-lg bg-white text-[hsl(var(--purple-deep))] text-sm font-semibold hover:opacity-90 transition-opacity">
          Check Eligibility
        </Link>
        <Link to="/login" className="px-6 py-3 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
          Apply for Loan
        </Link>
      </div>
    </section>
  </div>
);

export default EducationLoanPartners;
