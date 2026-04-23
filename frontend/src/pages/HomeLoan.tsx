import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductSidebar from "@/components/ProductSidebar";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useSidebarContent } from "@/hooks/useSidebarContent";
import SidebarContentPanel from "@/components/SidebarContentPanel";
import {
  Home, IndianRupee, FileText, Shield, Zap, Clock, CheckCircle, ChevronRight,
  Building2, TrendingUp, HelpCircle, Award, ArrowRight, BadgePercent,
  Receipt, Landmark, Banknote, Users, Calculator, Percent, HandCoins, TrendingDown,
  Heart
} from "lucide-react";
const homeLoanHero = "/assets/home-loan-hero.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const tabs = [
  "About", "Features", "Interest Rates", "Eligibility", "Documents",
  "How to Apply", "By Scheme", "FAQ"
];

const overviewCards = [
  { title: "Home Loan", description: "Affordable home loans starting at 8.35% p.a. with long tenures", icon: Home, highlighted: true },
  { title: "Home Loan Interest Rates", description: "Compare rates from top banks & NBFCs for the best deal", icon: Percent },
  { title: "Home Loan EMI Calculator", description: "Plan your EMI with our easy-to-use calculator tool", icon: Calculator },
  { title: "Home Loan Balance Transfer", description: "Switch your existing loan to a lower rate and save lakhs", icon: ArrowRight },
  { title: "Home Loan Eligibility", description: "Check how much home loan you can get based on your income", icon: CheckCircle },
  { title: "Home Loan Tax Benefits", description: "Save up to ₹5L per year under Section 80C & 24(b)", icon: FileText },
  { title: "Home Loan for NRI", description: "Special schemes for NRIs looking to buy property in India", icon: Landmark },
  { title: "Pre-Approved Home Loan", description: "Get instant approval with pre-qualified offers", icon: Zap },
];

const features = [
  { title: "Low Interest Rates", description: "Home loan interest rates start from 8.35% p.a. — among the lowest of all loan products.", icon: BadgePercent },
  { title: "Long Tenure up to 30 Years", description: "Repay comfortably with tenures up to 30 years, keeping your EMI affordable.", icon: Clock },
  { title: "Tax Benefits", description: "Save up to ₹5 Lakh per year on principal (80C) and interest (24b) deductions.", icon: FileText },
  { title: "High Loan Amount", description: "Get home loans up to ₹10 Crore based on your income and property value.", icon: IndianRupee },
  { title: "Balance Transfer Facility", description: "Switch your existing home loan to a lender with lower rates and save lakhs.", icon: ArrowRight },
  { title: "Top-Up Loan Option", description: "Get additional funds over your existing home loan for renovation or other needs.", icon: HandCoins },
];

const interestRates = [
  { lender: "State Bank of India", rate: "8.50% p.a.", maxAmount: "Up to ₹10 Cr", tenure: "Up to 30 yrs", processing: "0.35%" },
  { lender: "HDFC Bank", rate: "8.75% p.a.", maxAmount: "Up to ₹10 Cr", tenure: "Up to 30 yrs", processing: "0.50%" },
  { lender: "ICICI Bank", rate: "8.75% p.a.", maxAmount: "Up to ₹5 Cr", tenure: "Up to 30 yrs", processing: "0.50%" },
  { lender: "Axis Bank", rate: "8.75% p.a.", maxAmount: "Up to ₹5 Cr", tenure: "Up to 20 yrs", processing: "1.00%" },
  { lender: "Bank of Baroda", rate: "8.40% p.a.", maxAmount: "Up to ₹10 Cr", tenure: "Up to 30 yrs", processing: "0.25%" },
  { lender: "Punjab National Bank", rate: "8.45% p.a.", maxAmount: "Up to ₹10 Cr", tenure: "Up to 30 yrs", processing: "0.35%" },
  { lender: "Kotak Mahindra Bank", rate: "8.75% p.a.", maxAmount: "Up to ₹5 Cr", tenure: "Up to 20 yrs", processing: "0.50%" },
  { lender: "LIC Housing Finance", rate: "8.50% p.a.", maxAmount: "Up to ₹10 Cr", tenure: "Up to 30 yrs", processing: "0.50%" },
  { lender: "Federal Bank", rate: "8.80% p.a.", maxAmount: "Up to ₹5 Cr", tenure: "Up to 30 yrs", processing: "0.50%" },
  { lender: "Canara Bank", rate: "8.40% p.a.", maxAmount: "Up to ₹10 Cr", tenure: "Up to 30 yrs", processing: "0.25%" },
];

const eligibilityCriteria = [
  { label: "Age", value: "21 to 65 years (at loan maturity)" },
  { label: "Income (Salaried)", value: "Min ₹25,000/month" },
  { label: "Income (Self-Employed)", value: "Min ₹3L annual income" },
  { label: "Employment", value: "Min 2 years experience" },
  { label: "CIBIL Score", value: "700+ preferred" },
  { label: "Property", value: "Must be approved by the lender" },
];

const documents = [
  "PAN Card & Aadhaar Card",
  "Salary slips (last 3 months)",
  "Bank statements (last 6 months)",
  "Form 16 / ITR (last 2 years)",
  "Property documents & agreement",
  "Passport-size photographs",
  "Address proof",
  "Employment proof / Business proof",
];

const howToApplySteps = [
  { step: 1, title: "Check Eligibility", description: "Use CreduPe's free tool to verify your home loan eligibility and view best offers." },
  { step: 2, title: "Compare Offers", description: "Compare interest rates, tenure, and processing fees from 20+ leading banks." },
  { step: 3, title: "Upload Documents", description: "Submit KYC, income proof, and property documents online through our platform." },
  { step: 4, title: "Property Verification", description: "Lender verifies property documents, conducts technical & legal checks." },
  { step: 5, title: "Loan Sanction & Disbursal", description: "Loan sanctioned and amount disbursed directly to builder/seller." },
];

const bySchemeItems = [
  { title: "PMAY (Pradhan Mantri Awas Yojana)", desc: "Subsidy up to ₹2.67L for first-time buyers under EWS/LIG/MIG", icon: Landmark },
  { title: "Home Loan Balance Transfer", desc: "Switch to a lower rate from your current lender and save on EMIs", icon: ArrowRight },
  { title: "Home Extension Loan", desc: "Finance the expansion or renovation of your existing home", icon: Building2 },
  { title: "Plot + Construction Loan", desc: "Combined financing for purchasing a plot and building your home", icon: Home },
  { title: "Top-Up Home Loan", desc: "Get additional funds on your existing home loan at attractive rates", icon: HandCoins },
  { title: "Home Improvement Loan", desc: "Renovate, repair, or upgrade your home interiors and exteriors", icon: Shield },
  { title: "NRI Home Loan", desc: "Special loan schemes for NRIs to purchase property in India", icon: Landmark },
  { title: "Affordable Housing Loan", desc: "Low-cost home loans for economically weaker sections", icon: TrendingDown },
];

const relatedArticles = [
  "Home Loan vs Rent – What's Better in 2026?",
  "How to Get Home Loan with Low CIBIL Score",
  "PMAY Subsidy – Complete Guide for First-Time Buyers",
  "Home Loan Tax Benefits Under Section 80C & 24(b)",
  "5 Mistakes to Avoid When Taking a Home Loan",
];

const homeLoanByBank = [
  "SBI Home Loan", "HDFC Home Loan", "ICICI Home Loan",
  "Axis Home Loan", "Bank of Baroda Home Loan", "PNB Home Loan",
  "LIC Housing Finance", "Kotak Home Loan",
];

const interestRateByBank = [
  "SBI Home Loan Interest Rate",
  "HDFC Home Loan Interest Rate",
  "ICICI Home Loan Interest Rate",
  "Bank of Baroda Home Loan Rate",
  "LIC Housing Finance Interest Rate",
];

const homeLoanDetails = [
  "How to Apply Online?", "Home Loan EMI Calculator",
  "Eligibility Checker", "Documents Required",
  "Home Loan vs Loan Against Property",
];

const faqs = [
  { q: "What is the minimum CIBIL score required for a home loan?", a: "Most banks require a minimum CIBIL score of 700. However, some lenders may approve loans with scores as low as 650 at slightly higher interest rates. A score of 750+ gets you the best rates and higher loan amounts." },
  { q: "Can I get a home loan for an under-construction property?", a: "Yes, most banks offer home loans for under-construction properties. The loan is disbursed in stages based on construction progress. Ensure the project is RERA registered for loan approval." },
  { q: "What is PMAY and am I eligible?", a: "PMAY (Pradhan Mantri Awas Yojana) provides interest subsidy of up to ₹2.67L for first-time home buyers in EWS, LIG, and MIG categories. You must not own a pucca house anywhere in India to be eligible." },
  { q: "Can I prepay my home loan without penalty?", a: "Yes, as per RBI guidelines, banks cannot charge prepayment penalties on floating rate home loans. You can prepay any amount at any time. Fixed rate loans may have prepayment charges of 2-3%." },
  { q: "What is the maximum tenure for a home loan?", a: "Most banks offer home loans for up to 30 years, subject to the borrower's age at loan maturity not exceeding 60–65 years. Longer tenure means lower EMI but higher total interest paid." },
];

const HomeLoan = () => {
  const { selectedSlug, selectedType, handleItemClick, handleClose, contentRef } = useSidebarContent();
  const sectionRefs = {
    About: useRef<HTMLDivElement>(null),
    Features: useRef<HTMLDivElement>(null),
    "Interest Rates": useRef<HTMLDivElement>(null),
    Eligibility: useRef<HTMLDivElement>(null),
    Documents: useRef<HTMLDivElement>(null),
    "How to Apply": useRef<HTMLDivElement>(null),
    "By Scheme": useRef<HTMLDivElement>(null),
    FAQ: useRef<HTMLDivElement>(null),
  };

  const scrollToSection = (tab: string) => {
    const ref = sectionRefs[tab as keyof typeof sectionRefs];
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
            src={homeLoanHero}
            alt="Family with new home"
            width={800}
            height={800}
            className="absolute right-[5%] md:right-[10%] bottom-0 h-[105%] w-auto object-contain opacity-95 hidden md:block"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-deep))]/75 to-transparent" />
          <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end h-full min-h-[320px] md:min-h-[360px]">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Home Loan</h1>
              <p className="text-white/70 text-sm md:text-base max-w-md">
                Make your dream home a reality with affordable home loans from top banks. Low rates, long tenure, tax benefits.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="text-white/80">
                <span className="text-xs block">Interest rate starts from</span>
                <span className="text-3xl md:text-4xl font-bold text-primary">8.35% p.a</span>
              </div>
              <Link to="/login" className="px-6 py-3 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
                Check Eligibility
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                Apply for Home Loan
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="mt-4 rounded-xl border border-border bg-card flex items-center gap-0 overflow-x-auto">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => scrollToSection(tab)}
              className={`px-5 py-3 text-xs font-medium whitespace-nowrap transition-colors relative text-muted-foreground hover:text-primary ${
                i < tabs.length - 1 ? "border-r border-border" : ""
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-6 mb-2">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Home Loan</span>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="pb-8">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
          Overview — <span className="text-gradient">Home Loan Hub</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                className={`group relative text-left rounded-xl border p-3.5 transition-all duration-300 flex items-center gap-3 ${
                  card.highlighted
                    ? "bg-[hsl(var(--purple-deep))] border-[hsl(var(--purple-deep))] text-white shadow-lg"
                    : "bg-card border-border hover:shadow-md hover:border-primary/20"
                }`}
              >
                <div className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${card.highlighted ? "bg-white/15" : "bg-muted"}`}>
                  <Icon className={`w-4 h-4 ${card.highlighted ? "text-white" : "text-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-xs font-bold leading-tight ${card.highlighted ? "text-white" : "text-foreground"}`}>{card.title}</h3>
                  <p className={`text-[11px] leading-snug mt-0.5 line-clamp-2 ${card.highlighted ? "text-white/70" : "text-muted-foreground"}`}>{card.description}</p>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${card.highlighted ? "text-white/70" : "text-primary"}`} />
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content + Sidebar Layout */}
      <div className="flex gap-8 pb-16">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div ref={contentRef}>
            <SidebarContentPanel productName="Home Loan" selectedSlug={selectedSlug} selectedType={selectedType} onClose={handleClose} />
          </div>
          {/* About Section */}
          <div ref={sectionRefs.About} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" /> What is a Home Loan?
            </h2>
            <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
              <p>
                A Home Loan is a financial product offered by banks and NBFCs that allows individuals to purchase, construct, or renovate 
                a residential property. The loan amount is repaid in monthly installments (EMIs) over a period of up to 30 years. 
                Home loans are secured loans where the property itself serves as collateral.
              </p>
              <p>
                Home loans offer some of the lowest interest rates among all loan products, starting from 8.35% p.a. Additionally, 
                borrowers can avail significant tax benefits under Section 80C (up to ₹1.5 Lakh on principal) and Section 24(b) 
                (up to ₹2 Lakh on interest) of the Income Tax Act.
              </p>
              <p>
                <strong className="text-foreground">CreduPe</strong> helps you compare home loan offers from 20+ leading banks and NBFCs 
                so you can find the best interest rate, lowest processing fee, and maximum loan amount — all in one place.
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div ref={sectionRefs.Features} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" /> Features and Benefits of Home Loan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-xl border border-border bg-card p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interest Rates Section */}
          <div ref={sectionRefs["Interest Rates"]} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-primary" /> Home Loan Interest Rates by Various Lenders
            </h2>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[hsl(var(--purple-deep))] text-white">
                    <th className="text-left px-4 py-3 font-semibold text-xs">Lender</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs">Interest Rate</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs hidden sm:table-cell">Max Amount</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs hidden md:table-cell">Tenure</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs hidden lg:table-cell">Processing Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {interestRates.map((row, i) => (
                    <tr key={row.lender} className={`${i % 2 === 0 ? "bg-card" : "bg-muted/30"} border-t border-border`}>
                      <td className="px-4 py-3 text-xs font-medium text-foreground">{row.lender}</td>
                      <td className="px-4 py-3 text-xs text-primary font-semibold">{row.rate}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{row.maxAmount}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{row.tenure}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">{row.processing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 italic">*Rates as of April 2026. Actual rates may vary.</p>
          </div>

          {/* Eligibility Section */}
          <div ref={sectionRefs.Eligibility} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" /> Home Loan Eligibility Criteria
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {eligibilityCriteria.map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground">{item.label}</span>
                    <span className="text-xs text-muted-foreground block">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Section */}
          <div ref={sectionRefs.Documents} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Documents Required for Home Loan
            </h2>
            <div className="rounded-xl border border-border bg-card p-5">
              <ul className="space-y-3">
                {documents.map((doc, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    </div>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* How to Apply Section */}
          <div ref={sectionRefs["How to Apply"]} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-primary" /> How to Apply for Home Loan?
            </h2>
            <div className="space-y-4">
              {howToApplySteps.map((s) => (
                <div key={s.step} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--purple-deep))] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By Scheme Section */}
          <div ref={sectionRefs["By Scheme"]} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Home Loan By Scheme
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bySchemeItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-xl border border-border bg-card p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div ref={sectionRefs.FAQ} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" /> FAQs on Home Loan
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-4 overflow-hidden">
                  <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground pb-4 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <ProductSidebar
          productName="Home Loan"
          insights={relatedArticles}
          topLenders={homeLoanByBank}
          interestRates={interestRateByBank}
          eligibilityDocs={homeLoanDetails}
          ctaIcon={Home}
          ctaTitle="Get Best Home Loan Offer"
          ctaDescription="Compare offers from 20+ banks and get the lowest rates for your dream home."
          onItemClick={handleItemClick}
          activeSlug={selectedSlug}
        />
      </div>

      <Footer />
    </div>
  );
};

export default HomeLoan;
