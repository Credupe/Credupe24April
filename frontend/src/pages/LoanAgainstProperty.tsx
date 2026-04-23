import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductSidebar from "@/components/ProductSidebar";
import SidebarContentPanel from "@/components/SidebarContentPanel";
import { useSidebarContent } from "@/hooks/useSidebarContent";
import { Home, IndianRupee, Building2, Users, ArrowRight, Shield, Zap, Clock, Percent, FileText, CheckCircle, Landmark, HandCoins, TrendingDown, Calculator, Briefcase, User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
const lapHero = "/assets/loan-against-property-hero.png";
const tabs = ["Overview", "Interest Rates", "Eligibility", "How to Apply", "FAQ"];

const overviewCards = [
  { title: "Loan Against Property", description: "Unlock property value with loans starting at 8.50% p.a.", icon: Building2, highlighted: true },
  { title: "LAP Interest Rates", description: "Compare rates from top banks & NBFCs for the best deal", icon: Percent },
  { title: "LAP EMI Calculator", description: "Calculate monthly EMI for your loan against property", icon: Calculator },
  { title: "LAP Balance Transfer", description: "Transfer existing LAP to lower rate & save on EMIs", icon: ArrowRight },
  { title: "LAP Eligibility", description: "Check eligibility based on property value & income", icon: CheckCircle },
  { title: "LAP Tax Benefits", description: "Tax deductions under Section 37(1) for business use", icon: FileText },
  { title: "LAP for Business", description: "Fund business expansion using your property as collateral", icon: Briefcase },
  { title: "Pre-Approved LAP", description: "Get instant approval with pre-qualified offers", icon: Zap },
];

const topBanks = [
  { bank: "SBI", rate: "8.50% – 11.20%", amount: "Up to ₹7.5 Cr", tenure: "Up to 15 yrs", processing: "Up to 1%", ltv: "Up to 65%" },
  { bank: "HDFC Bank", rate: "9.50% – 11.50%", amount: "Up to ₹10 Cr", tenure: "Up to 15 yrs", processing: "Up to 1.5%", ltv: "Up to 65%" },
  { bank: "ICICI Bank", rate: "9.00% – 11.25%", amount: "Up to ₹5 Cr", tenure: "Up to 15 yrs", processing: "Up to 1%", ltv: "Up to 60%" },
  { bank: "Axis Bank", rate: "10.50% – 12.00%", amount: "Up to ₹5 Cr", tenure: "Up to 20 yrs", processing: "1%", ltv: "Up to 60%" },
  { bank: "Bank of Baroda", rate: "8.60% – 10.90%", amount: "Up to ₹7.5 Cr", tenure: "Up to 15 yrs", processing: "Up to 1%", ltv: "Up to 65%" },
  { bank: "PNB", rate: "8.45% – 10.25%", amount: "Up to ₹10 Cr", tenure: "Up to 15 yrs", processing: "Up to 1%", ltv: "Up to 65%" },
  { bank: "Kotak Mahindra", rate: "9.50% – 12.00%", amount: "Up to ₹5 Cr", tenure: "Up to 15 yrs", processing: "Up to 1%", ltv: "Up to 60%" },
  { bank: "Bajaj Finance", rate: "9.50% – 13.00%", amount: "Up to ₹5 Cr", tenure: "Up to 18 yrs", processing: "Up to 2%", ltv: "Up to 75%" },
  { bank: "Tata Capital", rate: "10.10% – 12.00%", amount: "Up to ₹3 Cr", tenure: "Up to 15 yrs", processing: "Up to 2%", ltv: "Up to 60%" },
  { bank: "LIC Housing", rate: "9.40% – 11.40%", amount: "Up to ₹10 Cr", tenure: "Up to 15 yrs", processing: "Up to 1%", ltv: "Up to 65%" },
  { bank: "Fedbank Financial", rate: "10.00% – 14.00%", amount: "Up to ₹3 Cr", tenure: "Up to 15 yrs", processing: "Up to 3%", ltv: "Up to 70%" },
];

const whyChoose = [
  { title: "Wide Lender Network", desc: "Compare offers from 30+ banks & NBFCs in one place", icon: Landmark },
  { title: "Best Interest Rates", desc: "Rates starting at just 8.50% p.a. with special offers", icon: TrendingDown },
  { title: "Quick Approval", desc: "Get approval in as fast as 72 hours with minimal paperwork", icon: Zap },
  { title: "High Loan Amount", desc: "Get up to ₹10 Cr based on your property value", icon: IndianRupee },
  { title: "Flexible Tenure", desc: "Repayment tenure up to 20 years for manageable EMIs", icon: Clock },
  { title: "Expert Guidance", desc: "Dedicated loan advisors to guide you through the process", icon: Users },
];

const features = [
  "Loan amount up to 65-75% of property's market value (LTV ratio)",
  "Competitive interest rates starting from 8.50% p.a.",
  "Flexible repayment tenure ranging from 5 to 20 years",
  "Loan can be used for any purpose — business, education, medical, wedding",
  "Both residential and commercial properties accepted as collateral",
  "Overdraft facility available with select lenders for flexible withdrawals",
  "No restriction on end-use of funds unlike home loans",
  "Balance transfer facility to shift existing LAP to lower rates",
  "Minimal documentation with quick disbursal within 7-10 working days",
  "Tax benefits available under Section 37(1) for business use",
];

const eligibilitySalaried = [
  { label: "Age", value: "25–65 years" },
  { label: "Min Income", value: "₹30,000/month" },
  { label: "Employment", value: "Min 3 years total, 1 year current employer" },
  { label: "CIBIL Score", value: "700+ preferred" },
  { label: "Property", value: "Residential or commercial, freehold, clear title" },
  { label: "Property Age", value: "Should not exceed 40 years at loan maturity" },
];

const eligibilitySelfEmployed = [
  { label: "Age", value: "25–70 years" },
  { label: "Min Income", value: "₹5L annual net profit" },
  { label: "Business Vintage", value: "Min 3 years" },
  { label: "CIBIL Score", value: "700+ preferred" },
  { label: "Property", value: "Residential or commercial, freehold, clear title" },
  { label: "ITR", value: "Last 3 years filed" },
];

const documents = [
  "PAN Card & Aadhaar Card",
  "Passport-size photographs",
  "Address proof (utility bill / passport)",
  "Salary slips (last 3 months) — for salaried",
  "Bank statements (last 6-12 months)",
  "Form 16 / ITR (last 2-3 years)",
  "Business proof & financials — for self-employed",
  "Property documents (sale deed, title deed, mutation)",
  "Approved building plan & occupancy certificate",
  "Existing loan statement (for balance transfer)",
];

const processingCharges = [
  { item: "Processing Fee", value: "0.5% – 3% of loan amount" },
  { item: "Valuation Charges", value: "₹1,500 – ₹5,000" },
  { item: "Legal Charges", value: "₹2,000 – ₹5,000" },
  { item: "Stamp Duty", value: "As per state laws" },
  { item: "Franking Charges", value: "As applicable" },
  { item: "Prepayment Penalty", value: "Nil for floating rate (as per RBI)" },
  { item: "Foreclosure Charges", value: "2-4% for fixed rate" },
];

const homeLoanVsLAP = [
  { parameter: "Purpose", homeLoan: "Purchase or construction of home", lap: "Any purpose — business, personal, medical" },
  { parameter: "Interest Rate", homeLoan: "8.35% – 9.50%", lap: "8.50% – 14.00%" },
  { parameter: "LTV Ratio", homeLoan: "Up to 90%", lap: "Up to 65-75%" },
  { parameter: "Tenure", homeLoan: "Up to 30 years", lap: "Up to 15-20 years" },
  { parameter: "Tax Benefits", homeLoan: "Section 24(b) + 80C", lap: "Section 37(1) for business use only" },
  { parameter: "End-Use Restriction", homeLoan: "Only for property purchase", lap: "No restriction on usage" },
];

const faqs = [
  { q: "What is a Loan Against Property?", a: "A Loan Against Property (LAP) is a secured loan where you pledge your residential or commercial property as collateral to avail funds. You continue to retain ownership and use of the property while repaying the loan in EMIs." },
  { q: "How is Loan Against Property different from a Home Loan?", a: "A home loan can only be used for purchasing, constructing, or renovating a property. LAP can be used for any purpose — business expansion, education, medical emergencies, debt consolidation, or personal needs. LAP typically has slightly higher interest rates and lower LTV ratios compared to home loans." },
  { q: "What is the maximum amount I can get as LAP?", a: "You can typically get 60-75% of the property's market value as a loan. The exact amount depends on the lender, property type, location, your income, and credit profile." },
  { q: "Which properties are accepted for LAP?", a: "Most lenders accept residential apartments, independent houses, commercial offices, shops, and plots. The property must be freehold with a clear title and located within municipal/corporation limits." },
  { q: "What is the eligibility criteria for LAP?", a: "Both salaried and self-employed individuals can apply. Key criteria include a minimum age of 25, income above ₹30,000/month (salaried) or ₹5L annual (self-employed), CIBIL score of 700+, and an unencumbered property with clear title." },
  { q: "Can I prepay or foreclose LAP?", a: "Yes, for floating rate LAP, banks cannot charge prepayment or foreclosure penalties as per RBI guidelines. For fixed rate LAP, a penalty of 2-4% may be applicable." },
  { q: "What is the Loan-to-Value (LTV) ratio for LAP?", a: "LTV for LAP typically ranges from 50-75% depending on the lender and property type. Residential properties usually get a higher LTV compared to commercial properties." },
  { q: "Is it mandatory to have property insurance for LAP?", a: "Yes, most lenders mandate property insurance for the tenure of the loan. This protects both the borrower and lender in case of any damage to the property." },
  { q: "What are the tax benefits of Loan Against Property?", a: "If LAP is used for business purposes, the interest paid is deductible under Section 37(1) as a business expense. If used for home purchase/construction, benefits under Section 24(b) and 80C apply." },
  { q: "How long does LAP disbursement take?", a: "After all documents are submitted, LAP disbursement typically takes 7-15 working days. This includes property valuation, legal verification, and final approval." },
  { q: "Can NRIs avail Loan Against Property?", a: "Yes, some lenders offer LAP to NRIs. The property must be in India and the NRI should meet additional criteria like power of attorney, NRE/NRO account statements, and employment documents from abroad." },
];

const LoanAgainstProperty = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { selectedSlug, selectedType, handleItemClick, handleClose, contentRef } = useSidebarContent();

  const overviewRef = useRef<HTMLDivElement>(null);
  const ratesRef = useRef<HTMLDivElement>(null);
  const eligibilityRef = useRef<HTMLDivElement>(null);
  const applyRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    const refMap: Record<string, React.RefObject<HTMLDivElement>> = {
      Overview: overviewRef,
      "Interest Rates": ratesRef,
      Eligibility: eligibilityRef,
      "How to Apply": applyRef,
      FAQ: faqRef,
    };
    const ref = refMap[tab];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-6 pb-0">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] min-h-[320px] md:min-h-[360px]">
          <img
            src={lapHero}
            alt="Loan against property illustration"
            width={800}
            height={800}
            className="absolute right-[5%] md:right-[10%] bottom-0 h-[105%] w-auto object-contain opacity-95 hidden md:block"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-deep))]/75 to-transparent" />
          <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end h-full min-h-[320px] md:min-h-[360px]">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Loan Against Property</h1>
              <p className="text-white/70 text-sm md:text-base max-w-md">
                Unlock the value of your property with affordable loan against property options from top banks.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="text-white/80">
                <span className="text-xs block">Interest rate starts from</span>
                <span className="text-3xl md:text-4xl font-bold text-primary">8.50% p.a</span>
              </div>
              <Link to="/login" className="px-6 py-3 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
                Check Eligibility
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                Apply for Loan
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="mt-4 rounded-xl border border-border bg-card flex items-center gap-0 overflow-x-auto">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
              } ${i < tabs.length - 1 ? "border-r border-border" : ""}`}
            >
              {tab}
              {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
            </button>
          ))}
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-6 mb-2">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Loan Against Property</span>
        </div>
      </section>

      {/* Overview Section */}
      <section ref={overviewRef} className="pb-12">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
          Overview — <span className="text-gradient">Loan Against Property Hub</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewCards.map((card) => {
            const Icon = card.icon;
            const hl = card.highlighted;
            return (
              <button
                key={card.title}
                className={`group relative text-left rounded-xl border p-3.5 transition-all duration-300 flex items-center gap-3 ${
                  hl ? "bg-[hsl(var(--purple-deep))] border-[hsl(var(--purple-deep))] text-white shadow-lg" : "bg-card border-border hover:shadow-md hover:border-primary/20"
                }`}
              >
                <div className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${hl ? "bg-white/15" : "bg-muted"}`}>
                  <Icon className={`w-4 h-4 ${hl ? "text-white" : "text-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-xs font-bold leading-tight ${hl ? "text-white" : "text-foreground"}`}>{card.title}</h3>
                  <p className={`text-[11px] leading-snug mt-0.5 line-clamp-2 ${hl ? "text-white/70" : "text-muted-foreground"}`}>{card.description}</p>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${hl ? "text-white/70" : "text-primary"}`} />
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content + Sidebar Layout */}
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <div ref={contentRef}>
            <SidebarContentPanel productName="Loan Against Property" selectedSlug={selectedSlug} selectedType={selectedType} onClose={handleClose} />
          </div>
      {/* Why Choose CreduPe */}
      <section className="pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Why Choose CreduPe for Loan Against Property?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {whyChoose.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="group rounded-xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* What is LAP */}
      <section className="pb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">What is Loan Against Property?</h2>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            A Loan Against Property (LAP) is a secured loan where borrowers pledge their residential or commercial property as collateral to avail funds from a bank or NBFC. The borrower continues to retain ownership and use of the property while repaying the loan through EMIs. LAP is one of the most cost-effective borrowing options as interest rates are significantly lower compared to unsecured loans like personal loans.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            The loan amount sanctioned is typically 50-75% of the property's market value, known as the Loan-to-Value (LTV) ratio. LAP can be used for any purpose including business expansion, education, medical emergencies, debt consolidation, wedding expenses, or home renovation — making it highly versatile.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">CreduPe</strong> helps you compare LAP offers from 30+ banks and NBFCs to find the best interest rate, highest loan amount, and lowest processing fees — ensuring you get the most value from your property.
          </p>
        </div>
      </section>

      {/* Interest Rates Table */}
      <section ref={ratesRef} className="pb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Landmark className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Loan Against Property Interest Rates</h2>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[hsl(var(--purple-deep))] text-white">
                <th className="text-left p-3 font-semibold">Lender</th>
                <th className="text-left p-3 font-semibold">Interest Rate</th>
                <th className="text-left p-3 font-semibold">Max Amount</th>
                <th className="text-left p-3 font-semibold">Max Tenure</th>
                <th className="text-left p-3 font-semibold">Processing Fee</th>
                <th className="text-left p-3 font-semibold">LTV Ratio</th>
              </tr>
            </thead>
            <tbody>
              {topBanks.map((b, i) => (
                <tr key={b.bank} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                  <td className="p-3 font-bold text-foreground">{b.bank}</td>
                  <td className="p-3 text-primary font-semibold">{b.rate}</td>
                  <td className="p-3 text-muted-foreground">{b.amount}</td>
                  <td className="p-3 text-muted-foreground">{b.tenure}</td>
                  <td className="p-3 text-muted-foreground">{b.processing}</td>
                  <td className="p-3 text-muted-foreground">{b.ltv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="pb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Features and Benefits of Loan Against Property</h2>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section ref={eligibilityRef} className="pb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Loan Against Property Eligibility Criteria</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" /> Salaried Individuals
            </h3>
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              {eligibilitySalaried.map((e) => (
                <div key={e.label} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-foreground">{e.label}: </span>
                    <span className="text-sm text-muted-foreground">{e.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Self-Employed Individuals
            </h3>
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              {eligibilitySelfEmployed.map((e) => (
                <div key={e.label} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-foreground">{e.label}: </span>
                    <span className="text-sm text-muted-foreground">{e.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EMI Calculator Info */}
      <section className="pb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Loan Against Property EMI Calculator</h2>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            The EMI for Loan Against Property depends on three key factors — loan amount, interest rate, and tenure. Use the formula: <strong className="text-foreground">EMI = [P × r × (1+r)^n] / [(1+r)^n – 1]</strong> where P = principal, r = monthly interest rate, n = number of months.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--purple-deep))] text-white">
                  <th className="text-left p-3 font-semibold">Loan Amount</th>
                  <th className="text-left p-3 font-semibold">Interest Rate</th>
                  <th className="text-left p-3 font-semibold">Tenure</th>
                  <th className="text-left p-3 font-semibold">Monthly EMI</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { amount: "₹10 Lakh", rate: "9.00%", tenure: "10 yrs", emi: "₹12,668" },
                  { amount: "₹20 Lakh", rate: "9.50%", tenure: "12 yrs", emi: "₹23,248" },
                  { amount: "₹30 Lakh", rate: "10.00%", tenure: "15 yrs", emi: "₹32,238" },
                  { amount: "₹50 Lakh", rate: "9.00%", tenure: "15 yrs", emi: "₹50,713" },
                  { amount: "₹1 Crore", rate: "9.50%", tenure: "15 yrs", emi: "₹1,04,426" },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                    <td className="p-3 font-bold text-foreground">{row.amount}</td>
                    <td className="p-3 text-primary font-semibold">{row.rate}</td>
                    <td className="p-3 text-muted-foreground">{row.tenure}</td>
                    <td className="p-3 font-semibold text-foreground">{row.emi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Documents Required */}
      <section className="pb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Documents Required for Loan Against Property</h2>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          {documents.map((doc) => (
            <div key={doc} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{doc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Processing Fees */}
      <section className="pb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Processing Fees and Charges</h2>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[hsl(var(--purple-deep))] text-white">
                <th className="text-left p-3 font-semibold">Charge Type</th>
                <th className="text-left p-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              {processingCharges.map((c, i) => (
                <tr key={c.item} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                  <td className="p-3 font-bold text-foreground">{c.item}</td>
                  <td className="p-3 text-muted-foreground">{c.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Home Loan vs LAP */}
      <section className="pb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Home Loan vs Loan Against Property</h2>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[hsl(var(--purple-deep))] text-white">
                <th className="text-left p-3 font-semibold">Parameter</th>
                <th className="text-left p-3 font-semibold">Home Loan</th>
                <th className="text-left p-3 font-semibold">Loan Against Property</th>
              </tr>
            </thead>
            <tbody>
              {homeLoanVsLAP.map((row, i) => (
                <tr key={row.parameter} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                  <td className="p-3 font-bold text-foreground">{row.parameter}</td>
                  <td className="p-3 text-muted-foreground">{row.homeLoan}</td>
                  <td className="p-3 text-muted-foreground">{row.lap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How to Apply */}
      <section ref={applyRef} className="pb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">How to Apply for Loan Against Property via CreduPe</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: "1", title: "Check Eligibility", desc: "Enter your property details, income, and credit score to check eligibility instantly" },
            { step: "2", title: "Compare Offers", desc: "Compare LAP offers from 30+ banks & NBFCs — rates, LTV, tenure & fees" },
            { step: "3", title: "Upload Documents", desc: "Submit KYC, income proof, and property documents online securely" },
            { step: "4", title: "Get Disbursal", desc: "Property valuation, legal check, loan sanction & fund disbursal in 7-15 days" },
          ].map((s) => (
            <div key={s.step} className="bg-card rounded-xl border border-border p-5">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mb-3">{s.step}</div>
              <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Things to Know */}
      <section className="pb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Things to Know Before Applying for LAP</h2>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 space-y-3">
          {[
            "Ensure your property has a clear title and is free from any legal disputes or encumbrances.",
            "The property will be mortgaged to the bank until the loan is fully repaid — failure to repay can result in property seizure.",
            "Get your property valued by an independent valuer before applying to estimate the loan amount.",
            "Maintain a CIBIL score of 700+ for the best interest rates and higher approval chances.",
            "Compare offers from multiple lenders as rates and terms vary significantly across banks.",
            "Factor in all associated costs — processing fees, valuation charges, legal fees, and stamp duty.",
            "If you're using LAP for business, maintain proper documentation for tax deduction claims.",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
              <span className="text-sm text-muted-foreground">{tip}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqRef} className="pb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
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
                <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

        </div>

        <ProductSidebar
          productName="Loan Against Property"
          insights={["LAP vs Home Loan – Key Differences", "How to Maximize LAP Amount"]}
          topLenders={["SBI LAP", "HDFC LAP", "Bajaj Finance LAP"]}
          interestRates={["SBI LAP Interest Rate", "HDFC LAP Interest Rate"]}
          eligibilityDocs={["How to Apply?", "Eligibility Criteria", "Documents Required"]}
          ctaIcon={Building2}
          ctaDescription="Compare LAP offers from 15+ lenders."
          onItemClick={handleItemClick}
          activeSlug={selectedSlug}
        />
      </div>

      <Footer />
    </div>
  );
};

export default LoanAgainstProperty;
