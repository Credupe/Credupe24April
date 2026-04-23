import { Globe, TrendingUp, Lightbulb, DollarSign } from "lucide-react";
import { useState } from "react";

const countryFees = [
  { country: "United States", usd: "$20,000 – $40,000", inr: "₹16.5L – ₹33L" },
  { country: "United Kingdom", usd: "$15,000 – $35,000", inr: "₹12.3L – ₹28.8L" },
  { country: "Canada", usd: "$15,000 – $30,000", inr: "₹12.3L – ₹24.7L" },
  { country: "Australia", usd: "$20,000 – $45,000", inr: "₹16.5L – ₹37.1L" },
  { country: "Germany", usd: "$500 – $2,000", inr: "₹41K – ₹1.65L" },
  { country: "France", usd: "$3,000 – $5,000", inr: "₹2.4L – ₹4.1L" },
  { country: "New Zealand", usd: "$20,000 – $30,000", inr: "₹16.5L – ₹24.7L" },
  { country: "Singapore", usd: "$20,000 – $40,000", inr: "₹16.5L – ₹33L" },
  { country: "Ireland", usd: "$15,000 – $25,000", inr: "₹12.3L – ₹20.6L" },
  { country: "Netherlands", usd: "$8,000 – $20,000", inr: "₹6.6L – ₹16.5L" },
];

const countryDetails: Record<string, { why: string[]; avgCost: string; tuition: string[]; visa: string[]; living: string; tips: string[] }> = {
  "United States": {
    why: ["World-class universities", "Wide range of courses", "Strong job opportunities", "Scholarships & internships available"],
    avgCost: "$25,000 – $55,000 (₹21–47 lakhs approx.)",
    tuition: ["Public 2-Year: $4,050 (₹3.5L)", "Public 4-Year In-State: $11,610 (₹10L)", "Public 4-Year Out-of-State: $30,780 (₹26.5L)", "Private 4-Year: $43,350 (₹37.3L)"],
    visa: ["SEVIS Fee: $350 (₹30K)", "Visa Fee: $160 (₹14K)", "IELTS/TOEFL: $180–250 (₹15–22K)", "GRE/GMAT: $200–275 (₹17–24K)"],
    living: "₹10.7–15L per year",
    tips: ["Share accommodation", "Cook meals", "Use student discounts", "Part-time jobs (20 hrs/week)"],
  },
  "United Kingdom": {
    why: ["Russell Group universities", "1-year Master's programs", "Post-study work visa (2 years)", "Rich cultural experience"],
    avgCost: "£15,000 – £35,000 (₹15–36 lakhs approx.)",
    tuition: ["UG: £10,000 – £25,000", "PG: £12,000 – £35,000", "MBA: £20,000 – £60,000"],
    visa: ["Student Visa: £490 (₹52K)", "IHS: £776/year", "IELTS: £180 (₹19K)"],
    living: "₹10–14L per year",
    tips: ["Student Oyster card for transport", "NHS covers healthcare", "Campus part-time work", "Student discounts (NUS card)"],
  },
};

const factors = [
  { title: "Country & City", desc: "Tuition and living costs differ widely by location." },
  { title: "University & Course", desc: "Fees vary by institution type and specialization." },
  { title: "Living Costs", desc: "Rent, food, transport can significantly impact budgets." },
  { title: "Currency Exchange", desc: "Fluctuations affect total expenses." },
  { title: "Travel & Visa", desc: "Include flights, visa fees, and health insurance." },
];

const EducationLoanCost = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  return (
    <div className="space-y-16 pb-16">
      {/* Overview */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">How Much Does It Cost to Study Abroad?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Overall Cost Range</h3>
            </div>
            <p className="text-xs text-muted-foreground">Tuition Fees: $5,000–$50,000 annually</p>
            <p className="text-xs text-muted-foreground">Living Costs: $8,000–$15,000 annually</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Tips for Indian Students</h3>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>🌍 Choose affordable countries (Germany, Norway)</li>
              <li>💼 Work part-time to cover living expenses</li>
              <li>🎟️ Use student discounts</li>
              <li>📊 Plan & track expenses monthly</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Country-wise Fees Table */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">Abroad Study Fees by Country</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[hsl(var(--purple-deep))] text-white">
                <th className="text-left p-3 font-semibold">Country</th>
                <th className="text-left p-3 font-semibold">Annual Tuition (USD)</th>
                <th className="text-left p-3 font-semibold">Annual Tuition (INR)</th>
                <th className="text-left p-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              {countryFees.map((c, i) => (
                <tr key={c.country} className={`border-b border-border cursor-pointer hover:bg-primary/5 ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`} onClick={() => setSelectedCountry(selectedCountry === c.country ? null : c.country)}>
                  <td className="p-3 font-medium text-foreground">{c.country}</td>
                  <td className="p-3 text-muted-foreground">{c.usd}</td>
                  <td className="p-3 text-muted-foreground">{c.inr}</td>
                  <td className="p-3"><span className="text-primary text-xs font-medium">{countryDetails[c.country] ? "View →" : ""}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 italic">*Currency conversion based on April 2025 rate of 1 USD = ₹85.84. Figures are average estimates.</p>
      </section>

      {/* Country Detail Expand */}
      {selectedCountry && countryDetails[selectedCountry] && (
        <section className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Studying in {selectedCountry} – Quick Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Why Choose {selectedCountry}?</h3>
              <ul className="space-y-1">{countryDetails[selectedCountry].why.map((w) => <li key={w} className="text-xs text-muted-foreground">• {w}</li>)}</ul>
              <h3 className="text-sm font-bold text-foreground mt-4 mb-2">Tuition Fees</h3>
              <ul className="space-y-1">{countryDetails[selectedCountry].tuition.map((t) => <li key={t} className="text-xs text-muted-foreground">• {t}</li>)}</ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Visa & Application Costs</h3>
              <ul className="space-y-1">{countryDetails[selectedCountry].visa.map((v) => <li key={v} className="text-xs text-muted-foreground">• {v}</li>)}</ul>
              <h3 className="text-sm font-bold text-foreground mt-4 mb-2">Living Expenses</h3>
              <p className="text-xs text-muted-foreground">{countryDetails[selectedCountry].living}</p>
              <h3 className="text-sm font-bold text-foreground mt-4 mb-2">Budgeting Tips</h3>
              <ul className="space-y-1">{countryDetails[selectedCountry].tips.map((t) => <li key={t} className="text-xs text-muted-foreground">• {t}</li>)}</ul>
            </div>
          </div>
        </section>
      )}

      {/* Factors Influencing Costs */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Factors Influencing Costs</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {factors.map((f) => (
            <div key={f.title} className="bg-card rounded-xl border border-border p-4 text-center hover:shadow-md transition-shadow">
              <h3 className="text-sm font-bold text-foreground">{f.title}</h3>
              <p className="text-[11px] text-muted-foreground mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CreduPe Insight */}
      <section className="bg-primary/5 rounded-xl p-6 border border-primary/10">
        <h3 className="text-sm font-bold text-foreground mb-2">🌍 CreduPe Insight</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Studying abroad can range from highly affordable (Germany, France) to premium destinations (USA, UK, Australia). With smart planning — scholarships, loans, part-time work, and budgeting — Indian students can balance costs while accessing world-class education.
        </p>
      </section>
    </div>
  );
};

export default EducationLoanCost;
