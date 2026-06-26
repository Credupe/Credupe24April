import { Shield, Zap, Lock, Unlock, CheckCircle, ArrowRight } from "lucide-react";

const collateralComparison = [
  { aspect: "Interest Rate", collateral: "Generally lower", nonCollateral: "Slightly higher" },
  { aspect: "Loan Amount", collateral: "Higher funding possible", nonCollateral: "Limited based on profile" },
  { aspect: "Approval Time", collateral: "Slower due to asset checks", nonCollateral: "Faster processing" },
  { aspect: "Eligibility", collateral: "Suitable if assets are available", nonCollateral: "Strong academics/co-applicant needed" },
];

const collateralTypes = [
  { title: "Tangible Assets", items: ["Residential house or flat", "Vacant plot or non-agricultural land", "Commercial property"] },
  { title: "Financial Assets", items: ["Fixed Deposits (FDs)", "Life Insurance Policies (LIC)", "Government bonds"] },
  { title: "Third-Party Collateral", items: ["Relative's property can be pledged", "Original ownership documents required", "Close family members accepted"] },
];

const whyCredupe = [
  { t: "Stress-Free Process", d: "We handle the money stuff. You focus on the degree." },
  { t: "Tax Savings", d: "Eligible tax deductions help reduce overall loan cost." },
  { t: "Flexible Repayment", d: "Extended tenures for comfortable monthly instalments." },
  { t: "100% Financing", d: "Complete support for tuition fees and living expenses." },
  { t: "Pan-India Support", d: "Partner branches across India ensure seamless support." },
  { t: "No Hidden Charges", d: "What you see is exactly what you pay." },
];

const EducationLoanProducts = () => (
  <div className="space-y-16 pb-16">
    {/* Study in India */}
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Education Loan – Study in India</h2>
      </div>
      <div className="bg-card rounded-xl border border-border p-6">
        <p className="text-sm text-muted-foreground mb-4">Finance your education in India with competitive interest rates and flexible repayment options. CreduPe partners with top banks to bring you the best deals.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {whyCredupe.map((item) => (
            <div key={item.t} className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <h3 className="text-sm font-bold text-foreground">{item.t}</h3>
              <p className="text-xs text-muted-foreground mt-1">{item.d}</p>
            </div>
          ))}
        </div>
        <button className="mt-6 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
          Apply Now
        </button>
      </div>
    </section>

    {/* Collateral vs Non-Collateral */}
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Lock className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Collateral vs Non-Collateral Loans</h2>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[hsl(var(--purple-deep))] text-white">
              <th className="text-left p-3 font-semibold">Aspect</th>
              <th className="text-left p-3 font-semibold"><Lock className="w-3.5 h-3.5 inline mr-1" />Collateral-Based</th>
              <th className="text-left p-3 font-semibold"><Unlock className="w-3.5 h-3.5 inline mr-1" />Non-Collateral</th>
            </tr>
          </thead>
          <tbody>
            {collateralComparison.map((row, i) => (
              <tr key={row.aspect} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                <td className="p-3 font-medium text-foreground">{row.aspect}</td>
                <td className="p-3 text-muted-foreground">{row.collateral}</td>
                <td className="p-3 text-muted-foreground">{row.nonCollateral}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    {/* Types of Collateral */}
    <section>
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">Types of Collateral Accepted</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {collateralTypes.map((type) => (
          <div key={type.title} className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">{type.title}</h3>
            <ul className="space-y-2">
              {type.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>

    {/* How to Apply */}
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">How to Apply via CreduPe</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { step: "1", title: "Check Eligibility", desc: "Use CreduPe's free tool to verify eligibility and view offers" },
          { step: "2", title: "Talk to Experts", desc: "Connect with CreduPe counselors for personalized guidance" },
          { step: "3", title: "Upload Documents", desc: "Admission letter, academic records, ID, financials" },
          { step: "4", title: "Get Approved", desc: "Sanction letter issued, funds released pre-visa" },
        ].map((s) => (
          <div key={s.step} className="bg-card rounded-xl border border-border p-5 relative">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mb-3">{s.step}</div>
            <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default EducationLoanProducts;
