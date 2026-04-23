import { GraduationCap, BookOpen, Shield, Clock, IndianRupee, FileText, CheckCircle, HelpCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "What exactly is a student loan?", a: "A student loan is a type of financial support that helps cover the expenses of higher education. This can include tuition fees, accommodation, books, equipment, and other costs directly related to your studies." },
  { q: "Is taking an education loan a wise choice?", a: "Yes. Education loans make it possible to pursue your academic goals without putting pressure on family savings. Repaying the loan on time also helps build a strong credit history and develops financial discipline." },
  { q: "Can I use the loan for personal or non-educational expenses?", a: "No. Education loan funds are meant exclusively for study-related costs, including tuition, living expenses, books, and equipment. They cannot be used for unrelated personal spending." },
  { q: "Who is eligible to apply for an education loan?", a: "Students admitted to recognised institutions in India or abroad—whether for undergraduate, postgraduate, or professional programs—can apply. A co-applicant, usually a parent or guardian, is generally required." },
  { q: "How do student loans work in India?", a: "In India, student loans help cover tuition, living costs, and other educational expenses. Repayment usually begins after a moratorium period following course completion. Loans may be secured (with collateral) or unsecured, depending on the amount and the lender's terms." },
];

const keyFeatures = [
  { title: "Loan Amount", desc: "Depends on the program, institution, and location. Larger loans available for overseas education.", icon: IndianRupee },
  { title: "Moratorium Period", desc: "Repayment begins after course completion, often with an additional 12-month buffer.", icon: Clock },
  { title: "Repayment Tenure", desc: "Flexible options ranging from 5 to 20 years for comfortable monthly installments.", icon: FileText },
  { title: "Collateral Options", desc: "Secured (backed by property/FDs) or unsecured, depending on financial profile.", icon: Shield },
];

const interestRates = [
  { bank: "Union Bank of India", secured: "8.0 - 9.75%", unsecured: "6.85 - 10.1%", maxSecured: "₹1.5 Cr", maxUnsecured: "₹40L" },
  { bank: "Axis Bank", secured: "8.75 - 11.75%", unsecured: "7.5 - 12.25%", maxSecured: "₹2 Cr", maxUnsecured: "₹1 Cr" },
  { bank: "ICICI Bank", secured: "9.25 - 12.5%", unsecured: "10.25 - 12.5%", maxSecured: "₹3 Cr", maxUnsecured: "₹1 Cr" },
  { bank: "IDFC First Bank", secured: "11.0 - 11.5%", unsecured: "10.8 - 13.0%", maxSecured: "₹50L", maxUnsecured: "₹1 Cr" },
  { bank: "Credila (HDFC)", secured: "9.5 - 11.5%", unsecured: "8.95 - 13.0%", maxSecured: "₹3.5 Cr", maxUnsecured: "₹4 Cr" },
  { bank: "Avanse", secured: "10.5 - 14.0%", unsecured: "10.25 - 14.5%", maxSecured: "₹1 Cr", maxUnsecured: "₹1.25 Cr" },
  { bank: "InCred", secured: "NA", unsecured: "11.0 - 14.0%", maxSecured: "NA", maxUnsecured: "₹1 Cr" },
  { bank: "Prodigy Finance", secured: "NA", unsecured: "8.47 - 13.0%", maxSecured: "NA", maxUnsecured: "₹82L" },
  { bank: "Mpower Finance", secured: "NA", unsecured: "9.99 - 13.99%", maxSecured: "NA", maxUnsecured: "₹82L" },
  { bank: "State Bank of India", secured: "8.4 - 8.9%", unsecured: "8.9%", maxSecured: "₹3 Cr", maxUnsecured: "₹50L" },
  { bank: "Bank of Baroda", secured: "6.9 - 10.45%", unsecured: "NA", maxSecured: "₹2 Cr", maxUnsecured: "NA" },
];

const EducationLoanAbout = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-16 pb-16">
      {/* What is Education Loan */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Funding Your Higher Education: A Complete Guide</h2>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Higher education is an important step toward building a successful future, but the costs can be significant. An <strong className="text-foreground">education loan</strong> helps students pursue their academic goals without placing immediate financial strain on their families. Whether you are planning to study in <strong className="text-foreground">India or overseas</strong>, an education loan can bridge the gap between your aspirations and your financial resources.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {["Tuition & course fees", "Accommodation & living", "Books & equipment", "Travel & visa costs"].map((item) => (
              <div key={item} className="flex items-center gap-2 bg-primary/5 rounded-lg p-3">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs font-medium text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Key Features of Education Loans</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keyFeatures.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-card rounded-xl border border-border p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{f.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose */}
      <section>
        <div className="bg-[hsl(var(--purple-deep))] rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4">Why Choose CreduPe for Education Loans?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { t: "Financial Freedom", d: "Focus on studies without straining family savings" },
              { t: "Tax Advantages", d: "Interest under Section 80E of Income Tax Act" },
              { t: "Credit History", d: "Build a strong credit profile early in life" },
              { t: "Visa Support", d: "Proof of approved funding strengthens applications" },
            ].map((b) => (
              <div key={b.t} className="bg-white/10 rounded-lg p-4">
                <h3 className="text-sm font-bold text-white">{b.t}</h3>
                <p className="text-xs text-white/70 mt-1">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interest Rates Table */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <IndianRupee className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Compare Interest Rates</h2>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[hsl(var(--purple-deep))] text-white">
                <th className="text-left p-3 font-semibold">Bank / Lender</th>
                <th className="text-left p-3 font-semibold">Secured Rate</th>
                <th className="text-left p-3 font-semibold">Unsecured Rate</th>
                <th className="text-left p-3 font-semibold">Max Secured</th>
                <th className="text-left p-3 font-semibold">Max Unsecured</th>
              </tr>
            </thead>
            <tbody>
              {interestRates.map((r, i) => (
                <tr key={r.bank} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                  <td className="p-3 font-medium text-foreground">{r.bank}</td>
                  <td className="p-3 text-muted-foreground">{r.secured}</td>
                  <td className="p-3 text-muted-foreground">{r.unsecured}</td>
                  <td className="p-3 text-muted-foreground">{r.maxSecured}</td>
                  <td className="p-3 text-muted-foreground">{r.maxUnsecured}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Eligibility */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Eligibility & Documents</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">Eligibility Criteria</h3>
            <ul className="space-y-2">
              {["Indian Citizenship", "Confirmed Admission to recognized institution", "Co-Applicant (parent/guardian) with steady income", "Good academic performance & entrance exam scores"].map((e) => (
                <li key={e} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">Required Documents</h3>
            <ul className="space-y-2">
              {["Aadhaar, PAN, Passport & Photos", "10th, 12th, Graduation marksheets", "Official admission letter", "Fee structure from institution", "Co-applicant income proof (salary slips, ITR)", "Collateral documents (if applicable)"].map((d) => (
                <li key={d} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <FileText className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <HelpCircle className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-medium text-foreground">{faq.q}</span>
                <span className={`text-primary transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EducationLoanAbout;
