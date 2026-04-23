import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRef, useState } from "react";
import { useSidebarContent } from "@/hooks/useSidebarContent";
import SidebarContentPanel from "@/components/SidebarContentPanel";
import { Link } from "react-router-dom";
const carLoanHero = "/assets/car-loan-hero.png";
import ProductSidebar from "@/components/ProductSidebar";
import { Car, IndianRupee, FileText, Calculator, HelpCircle, CheckCircle2, ChevronDown, Building2, Users, Percent, Clock, Shield } from "lucide-react";

const tabs = ["Overview", "Interest Rates", "Eligibility", "How to Apply", "FAQ"];

const bankRates = [
  { bank: "SBI", rate: "9.25% onwards", processing: "0.50% of Loan Amount +ST; Min: Rs.950.00 +ST, Max: Rs.9100.00 +ST" },
  { bank: "HDFC Bank", rate: "9.35% onwards", processing: "Rs.2825 to Rs.5150 (depends on the loan amount)" },
  { bank: "ICICI Bank", rate: "9.55% onwards", processing: "Rs.2500 to Rs.5000 (depends on the loan amount)" },
  { bank: "Axis Bank", rate: "9.50% onwards", processing: "Rs.3500 to Rs.5500" },
  { bank: "Citibank", rate: "9.05% onwards", processing: "NIL" },
  { bank: "Punjab National Bank", rate: "9.25% onwards", processing: "1% of the loan amount (Max Rs.6000)" },
  { bank: "Bank of India", rate: "9.25% onwards", processing: "Rs.500/- plus S.T. or 1% of loan amount. Min: Rs.500 and Max: Rs.10,000" },
  { bank: "Syndicate Bank", rate: "10.1% onwards", processing: "Up to 2 Lakhs: Rs.1.25 per thousand. Minimum: Rs.125/- Above 2 Lakhs: Rs.200 per lakh." },
];

const sbiSchemes = [
  { scheme: "SBI Car Loan Scheme", tenure: "For All Tenure", rateM: "0.55% above base rate i.e. 9.85% p.a.", rateW: "0.50% above base rate i.e. 9.80% p.a." },
  { scheme: "SBI Combo Loan Scheme", tenure: "For All Tenure", rateM: "0.55% above base rate i.e. 9.85% p.a.", rateW: "0.50% above base rate i.e. 9.80% p.a." },
  { scheme: "NRI Car Loan", tenure: "For All Tenure", rateM: "0.55% above base rate i.e. 9.85% p.a.", rateW: "0.50% above base rate i.e. 9.80% p.a." },
  { scheme: "Used Car Loans", tenure: "Up to 3 years", rateM: "7.60% above Base Rate i.e. 16.90% p.a.", rateW: "—" },
  { scheme: "Used Car Loans", tenure: "Above 3 yrs up to 7 yrs", rateM: "7.85% above Base Rate i.e. 17.15% p.a.", rateW: "—" },
  { scheme: "Certified Pre-owned Car Loan", tenure: "Up to 3 years", rateM: "6.35% above Base Rate i.e. 15.05% p.a.", rateW: "—" },
  { scheme: "Certified Pre-owned Car Loan", tenure: "Above 3 yrs up to 7 yrs", rateM: "6.85% above Base Rate i.e. 16.15% p.a.", rateW: "—" },
  { scheme: "SBI Loyalty Car Loan Scheme", tenure: "Car Loan, Combo Loan, NRI Car Loan", rateM: "0.30% above BR i.e. 9.60% p.a.", rateW: "0.25% above BR i.e. 9.55% p.a." },
  { scheme: "SBI Nano Youth Car Loan Scheme", tenure: "For All Tenure", rateM: "0.80% above base rate i.e. 10.10% p.a.", rateW: "0.75% above base rate i.e. 10.05% p.a." },
];

const carLoanByBank = [
  "SBI Car Loan", "ICICI Car Loan", "HDFC Car Loan", "Axis Bank Car Loan",
  "Kotak Car Loan", "PNB Car Loan", "Bank of India Car Loan", "IDBI Car Loan", "Yes Bank Car Loan"
];

const carLoanDetails = [
  "Interest Rates", "How to Apply Online?", "Car Loan Eligibility Calculator",
  "Car Loan EMI Calculator", "What are the benefits?", "Car Loan Documents Required", "FAQs"
];

const faqData = [
  { q: "What is the minimum CIBIL score required for a car loan?", a: "Most banks require a minimum CIBIL score of 700 for car loan approval. However, some NBFCs may consider applicants with scores as low as 650 with higher interest rates." },
  { q: "Can I get a loan for a used car?", a: "Yes, many banks including SBI, HDFC, and ICICI offer used car loans. The interest rates are typically higher (12-18% p.a.) compared to new car loans, and the car should usually not be older than 5-7 years." },
  { q: "What is the maximum tenure for a car loan?", a: "The maximum tenure for a new car loan is typically 7 years (84 months). For used car loans, the maximum tenure is usually 5 years. Some banks may offer up to 8 years for new cars." },
  { q: "What documents are required for a car loan?", a: "Typically you need: Identity proof (Aadhaar/PAN), Address proof, Income proof (salary slips for last 3-6 months), Bank statements (last 6 months), Passport-size photographs, and the proforma invoice of the car." },
  { q: "Is there any prepayment penalty on car loans?", a: "As per RBI guidelines, floating rate car loans do not have any prepayment or foreclosure charges. However, fixed rate car loans may attract a penalty of 2-5% of the outstanding principal." },
  { q: "What is the loan-to-value ratio for car loans?", a: "Most banks finance up to 80-90% of the on-road price of the car. Some banks may offer up to 100% financing for select models or for customers with excellent credit profiles." },
];

const CarLoan = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { selectedSlug, selectedType, handleItemClick, handleClose, contentRef } = useSidebarContent();
  const sectionRefs = {
    Overview: useRef<HTMLDivElement>(null),
    "Interest Rates": useRef<HTMLDivElement>(null),
    Eligibility: useRef<HTMLDivElement>(null),
    "How to Apply": useRef<HTMLDivElement>(null),
    FAQ: useRef<HTMLDivElement>(null),
  };

  const scrollToSection = (tab: string) => {
    setActiveTab(tab);
    sectionRefs[tab as keyof typeof sectionRefs]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] text-primary-foreground py-10 md:py-16">
        <div className="container flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <p className="text-sm font-medium opacity-80">Home &gt; Loans &gt; Car Loan Interest Rates</p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">Car Loan Interest Rates – Compare and Apply</h1>
            <p className="text-lg opacity-90 max-w-xl">Get the best car loan deals starting at <span className="font-bold text-white text-2xl">9.05% p.a.</span> Compare offers from top banks and NBFCs on CreduPe</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/login" className="px-6 py-3 bg-white text-primary font-semibold rounded-full hover:bg-white/90 transition-colors">Check Eligibility</Link>
              <Link to="/calculator/car-loan-emi-calculator" className="px-6 py-3 border-2 border-white/50 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">EMI Calculator</Link>
            </div>
            <div className="flex gap-6 pt-4 text-sm">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Lowest Interest Rates</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Quick Approval</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 100% Online Process</div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <img src={carLoanHero} alt="Car Loan" width={300} height={300} className="drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Tab Bar */}
      <div className="sticky top-[88px] z-40 bg-card border-b border-border shadow-sm">
        <div className="container flex items-center gap-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => scrollToSection(tab)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-10 space-y-16">
        {/* Overview */}
        <div ref={sectionRefs.Overview} className="scroll-mt-32">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div ref={contentRef}>
                <SidebarContentPanel productName="Car Loan" selectedSlug={selectedSlug} selectedType={selectedType} onClose={handleClose} />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Car Loan Interest Rates Comparison for All Banks</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-primary/10">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Bank/Lender Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Car Loan Interest Rate</th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Loan Processing Fees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bankRates.map((b, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                        <td className="px-4 py-3 font-medium text-foreground">{b.bank}</td>
                        <td className="px-4 py-3 text-muted-foreground">{b.rate}</td>
                        <td className="px-4 py-3 text-muted-foreground">{b.processing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                <p>Car loan is the lump sum amount borrowed from banks or other lending institution to buy a new or used car. Here the loan amount is repaid in easy installments.</p>
                <p>Car loan interest rate varies from one bank to the other and is influenced by your monthly income, profession, existing EMI, credit score etc. On CreduPe you can compare car loan interest rate of top banks in India and apply for the lowest rate loan with maximum features and flexible tenure.</p>
                <p>Car loan interest rate calculator can help you analyze at what interest rate you can borrow the amount and what would be your EMI. The lender will check for your existing EMIs so that the repayment is not a burden for you.</p>
              </div>
            </div>

            {/* Sidebar */}
            <ProductSidebar
              productName="Car Loan"
              insights={carLoanDetails}
              topLenders={carLoanByBank}
              interestRates={carLoanByBank.map(b => `${b} Interest Rate`)}
              eligibilityDocs={["Car Loan Eligibility", "Documents Required", "How to Apply Online?", "Car Loan EMI Calculator", "Car Loan vs Used Car Loan"]}
              ctaIcon={Car}
              ctaDescription="Compare car loan offers from top banks and drive your dream car today."
              onItemClick={handleItemClick}
              activeSlug={selectedSlug}
            />
          </div>
        </div>

        {/* Interest Rates */}
        <div ref={sectionRefs["Interest Rates"]} className="scroll-mt-32 space-y-8">
          <h2 className="text-2xl font-bold text-foreground">SBI Car Loan Interest Rate</h2>
          <p className="text-muted-foreground text-sm">SBI offers different types of loans for buying a car for all kinds of customers. Here is the list of SBI Car Loan interest rate offered against each loan.</p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-primary/10">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Scheme Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Tenure</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">For Men</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">For Women</th>
                </tr>
              </thead>
              <tbody>
                {sbiSchemes.map((s, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                    <td className="px-4 py-3 font-medium text-foreground">{s.scheme}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.tenure}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.rateM}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.rateW}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-foreground pt-4">HDFC Car Loan Interest Rate</h2>
          <p className="text-muted-foreground text-sm">HDFC car loan is a fast and hassle free process with flexible tenure of up to 7 years and fixed interest rate i.e. not affected by fluctuating market rates.</p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-primary/10">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Min IRR</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Max IRR</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Avg IRR</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-background">
                  <td className="px-4 py-3 font-medium text-foreground">AUTO LOAN</td>
                  <td className="px-4 py-3 text-muted-foreground">9.35%</td>
                  <td className="px-4 py-3 text-muted-foreground">13.59%</td>
                  <td className="px-4 py-3 text-muted-foreground">10.31%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground text-sm">There are some charges attached to the loan such as foreclosure, part-payment, late payment etc.</p>

          <h2 className="text-2xl font-bold text-foreground pt-4">IDBI Car Loan Interest Rate</h2>
          <p className="text-muted-foreground text-sm">Processing fees waived in full during Festival Offer period</p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-primary/10">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Parameter</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-background"><td className="px-4 py-3 font-medium text-foreground">Interest Rate</td><td className="px-4 py-3 text-muted-foreground">BPLR(3.5)% i.e., 10.10%; I-Base – 9.75%</td></tr>
                <tr className="bg-muted/30"><td className="px-4 py-3 font-medium text-foreground">Loan Tenure</td><td className="px-4 py-3 text-muted-foreground">1 year to 7 years</td></tr>
                <tr className="bg-background"><td className="px-4 py-3 font-medium text-foreground">Pre-closure Charges</td><td className="px-4 py-3 text-muted-foreground">Upto 1%</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Eligibility */}
        <div ref={sectionRefs.Eligibility} className="scroll-mt-32 space-y-8">
          <h2 className="text-2xl font-bold text-foreground">Car Loan Eligibility Criteria</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border p-6 bg-card space-y-4">
              <div className="flex items-center gap-3"><Users className="w-5 h-5 text-primary" /><h3 className="font-semibold text-foreground text-lg">Salaried Individuals</h3></div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Age: 21 to 65 years at the time of loan maturity</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Minimum monthly income: ₹15,000 - ₹25,000</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Minimum work experience: 1 year (6 months in current job)</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />CIBIL Score: 700 or above preferred</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Existing EMI obligations within permissible FOIR limits</li>
              </ul>
            </div>
            <div className="rounded-xl border border-border p-6 bg-card space-y-4">
              <div className="flex items-center gap-3"><Building2 className="w-5 h-5 text-primary" /><h3 className="font-semibold text-foreground text-lg">Self-Employed Individuals</h3></div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Age: 21 to 65 years at the time of loan maturity</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Minimum annual income: ₹2 Lakhs - ₹3 Lakhs</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Business vintage: Minimum 2-3 years</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />ITR filed for last 2-3 years</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Stable business with proof of income</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-bold text-foreground pt-4">Documents Required</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Identity Proof", items: ["Aadhaar Card", "PAN Card", "Passport", "Voter ID"] },
              { title: "Income Proof", items: ["Salary Slips (3 months)", "Bank Statements (6 months)", "ITR (2-3 years)", "Form 16"] },
              { title: "Other Documents", items: ["Address Proof", "Passport-size Photos", "Proforma Invoice", "Driving License"] },
            ].map((doc) => (
              <div key={doc.title} className="rounded-xl border border-border p-5 bg-card space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2"><FileText className="w-4 h-4 text-primary" />{doc.title}</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {doc.items.map((item) => (
                    <li key={item} className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" />{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* How to Apply */}
        <div ref={sectionRefs["How to Apply"]} className="scroll-mt-32 space-y-8">
          <h2 className="text-2xl font-bold text-foreground">How to Apply for a Car Loan on CreduPe</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Compare Rates", desc: "Browse and compare car loan interest rates from top banks", icon: Percent },
              { step: "02", title: "Check Eligibility", desc: "Use our eligibility calculator to check your loan qualification", icon: Shield },
              { step: "03", title: "Submit Application", desc: "Fill the simple online form with your details and documents", icon: FileText },
              { step: "04", title: "Get Disbursement", desc: "Loan amount disbursed directly to the dealer after approval", icon: IndianRupee },
            ].map((s) => (
              <div key={s.step} className="rounded-xl border border-border p-6 bg-card text-center space-y-3 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary">STEP {s.step}</span>
                <h3 className="font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div ref={sectionRefs.FAQ} className="scroll-mt-32 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqData.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-medium text-foreground text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CarLoan;
