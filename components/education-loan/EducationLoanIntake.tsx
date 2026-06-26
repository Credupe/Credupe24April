import { Calendar, Leaf, Snowflake } from "lucide-react";
import { useState } from "react";

const fallData = [
  { country: "USA", period: "Aug–Sep", why: ["Widest course availability", "Better scholarships", "Summer internships after Year 1", "Strong orientation & networking"], timeline: "12–15 months before", highlights: "Largest intake, most competitive, aligns with Indian calendar" },
  { country: "UK", period: "Sep–Oct", why: ["Renowned universities", "Shorter courses", "Strong job opportunities", "Higher scholarships"], timeline: "12 months before", highlights: "Aligns with Indian academic cycle, most UG/PG courses open" },
  { country: "Canada", period: "Sep", why: ["Most courses open", "Strong co-op & internship options", "Better scholarship chances", "Easier PR pathways"], timeline: "12–15 months before", highlights: "Largest intake, high competition, strong employability" },
  { country: "Ireland", period: "Sep", why: ["Globally recognised universities", "Shorter Master's courses", "Post-study work visa options"], timeline: "12 months before", highlights: "Popular for PG programmes, strong tech & pharma sectors" },
  { country: "Netherlands", period: "Sep", why: ["Innovative courses", "English-taught programmes", "Strong research opportunities"], timeline: "12 months before", highlights: "Affordable tuition compared to UK/USA, strong EU exposure" },
  { country: "Germany", period: "Oct", why: ["Low tuition fees", "Strong engineering & STEM focus", "English-taught Master's"], timeline: "12–15 months before", highlights: "Affordable, strong industry links, scholarships available" },
  { country: "Australia", period: "Feb & Jul", why: ["Major intake", "Most courses open", "Strong job market alignment"], timeline: "12 months before", highlights: "Largest intake, strong scholarships, aligns with Indian cycle" },
  { country: "France", period: "Sep", why: ["Renowned for arts, fashion, business", "Affordable tuition", "English & French-taught courses"], timeline: "12 months before", highlights: "Strong cultural exposure, scholarships available" },
  { country: "Sweden", period: "Aug–Sep", why: ["Innovative, research-driven universities", "English-taught Master's", "Scholarships available"], timeline: "12 months before", highlights: "Strong focus on sustainability, tech, and innovation" },
  { country: "New Zealand", period: "Feb & Jul", why: ["Globally recognised degrees", "Welcoming environment", "Part-time work allowed"], timeline: "12 months before", highlights: "Smaller intakes, easier adjustment, strong work rights" },
];

const springData = [
  { country: "USA", period: "Jan–May", why: ["Smaller class sizes", "More personalized attention", "Faster progress", "Good if Fall deadlines missed"], timeline: "10–12 months before", highlights: "Second most popular intake, flexible" },
  { country: "UK", period: "Jan–Feb", why: ["Flexible entry for PG programmes", "Smaller intake, easier adjustment", "Good for missed Sep intake"], timeline: "9–12 months before", highlights: "Limited UG courses, strong PG options" },
  { country: "Canada", period: "Jan", why: ["Smaller batches, more professor access", "Easier admission competition", "Good for PG and diploma"], timeline: "10–12 months before", highlights: "Fewer courses than Fall, strong PG pathways" },
  { country: "Ireland", period: "Jan–Feb", why: ["Flexible PG entry", "Smaller intake, easier transition", "Good for missed Sep intake"], timeline: "9–12 months before", highlights: "Popular for Master's, strong tech & pharma" },
  { country: "Netherlands", period: "Feb", why: ["English-taught PG programmes", "Smaller intake, more personalized", "Easier admission"], timeline: "9–12 months before", highlights: "Limited UG courses, strong PG options" },
  { country: "New Zealand", period: "Jul", why: ["Mid-year intake", "Smaller batches, easier adjustment", "Good for PG & research"], timeline: "9–12 months before", highlights: "Smaller intake, flexible entry, strong work rights" },
  { country: "Germany", period: "Apr", why: ["Smaller intake for select PG courses", "Easier admission competition", "Good for research"], timeline: "10–12 months before", highlights: "Limited courses, strong PG focus" },
  { country: "Australia", period: "Jul", why: ["Mid-year intake", "Smaller batches, easier adjustment", "Good for PG & diploma"], timeline: "9–12 months before", highlights: "Smaller intake, flexible entry, strong employability" },
  { country: "France", period: "Jan", why: ["Flexible PG entry", "Smaller intake, easier transition", "Good for missed Sep intake"], timeline: "9–12 months before", highlights: "Limited UG courses, strong PG options" },
  { country: "Sweden", period: "Jan", why: ["Smaller intake for select PG programmes", "Easier admission", "Strong research opportunities"], timeline: "9–12 months before", highlights: "Limited courses, strong PG focus" },
];

const EducationLoanIntake = () => {
  const [activeIntake, setActiveIntake] = useState<"fall" | "spring">("fall");
  const data = activeIntake === "fall" ? fallData : springData;

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Intake Comparison – Detailed Guide</h2>
      </div>

      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveIntake("fall")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeIntake === "fall" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
        >
          <Leaf className="w-4 h-4" /> Fall Intake
        </button>
        <button
          onClick={() => setActiveIntake("spring")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeIntake === "spring" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
        >
          <Snowflake className="w-4 h-4" /> Spring Intake
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[hsl(var(--purple-deep))] text-white">
              <th className="text-left p-3 font-semibold">Country</th>
              <th className="text-left p-3 font-semibold">Period</th>
              <th className="text-left p-3 font-semibold min-w-[200px]">Why Choose?</th>
              <th className="text-left p-3 font-semibold">Prep Timeline</th>
              <th className="text-left p-3 font-semibold min-w-[200px]">Key Highlights</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.country} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                <td className="p-3 font-bold text-foreground">{row.country}</td>
                <td className="p-3 text-muted-foreground font-medium">{row.period}</td>
                <td className="p-3">
                  <ul className="space-y-0.5">
                    {row.why.map((w) => <li key={w} className="text-xs text-muted-foreground">• {w}</li>)}
                  </ul>
                </td>
                <td className="p-3 text-xs text-muted-foreground">{row.timeline}</td>
                <td className="p-3 text-xs text-muted-foreground">{row.highlights}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insight */}
      <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
        <h3 className="text-sm font-bold text-foreground mb-2">📅 CreduPe Insight</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {activeIntake === "fall"
            ? "Fall is the primary intake for most countries with the widest course selection, more scholarships, and better networking. Start preparing 12–15 months in advance for best results."
            : "Spring intake is ideal for students who missed Fall deadlines. While course options are limited, smaller batch sizes mean more personalized attention. Prepare 9–12 months in advance."}
        </p>
      </div>
    </div>
  );
};

export default EducationLoanIntake;
