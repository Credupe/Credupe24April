import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductSidebar from "@/components/ProductSidebar";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useSidebarContent } from "@/hooks/useSidebarContent";
import SidebarContentPanel from "@/components/SidebarContentPanel";
import {
  Car, IndianRupee, FileText, Shield, Zap, Clock, CheckCircle, ChevronRight,
  Building2, TrendingUp, HelpCircle, Award, ArrowRight, BadgePercent,
  Receipt, Wallet, Briefcase, Banknote, Search, Wrench, ShieldCheck, CalendarCheck
} from "lucide-react";
const usedCarLoanHero = "/assets/used-car-loan-hero.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const tabs = [
  "About", "Features", "Interest Rates", "Eligibility", "Documents",
  "How to Apply", "Tips", "FAQ"
];

const overviewCards = [
  { title: "Used Car Loan", description: "Affordable used car loans starting at 11.50% p.a. with quick approval", icon: Car, highlighted: true },
  { title: "Pre-Approved Used Car Loan", description: "Get instant pre-qualified offers for certified pre-owned cars", icon: FileText },
  { title: "Used Car Loan Interest Rates", description: "Compare rates from top banks starting at 11.50% p.a.", icon: IndianRupee },
  { title: "Used Car Loan Calculator", description: "Calculate your EMI & plan repayment with our smart calculator", icon: Wallet },
  { title: "Certified Pre-Owned Cars", description: "Loan options for manufacturer-certified used cars at lower rates", icon: ShieldCheck },
  { title: "Used Car Loan Balance Transfer", description: "Transfer your existing used car loan to a lower interest rate", icon: ArrowRight },
  { title: "Instant Used Car Loan", description: "Get funds disbursed in 48 hours with digital verification", icon: Zap },
  { title: "Dealer Financing", description: "Get pre-approved financing before visiting the dealer", icon: Briefcase },
];

const features = [
  { title: "Competitive Interest Rates", description: "Used car loan rates starting from 11.50% p.a. — significantly lower than personal loans for car purchase.", icon: BadgePercent },
  { title: "Flexible Tenure", description: "Choose repayment tenure from 12 months to 60 months based on the car's age and your convenience.", icon: Clock },
  { title: "High Loan-to-Value Ratio", description: "Get up to 80-85% financing on the car's current market value with select lenders.", icon: TrendingUp },
  { title: "Minimal Documentation", description: "Apply with just basic KYC, income proof, car documents, and valuation report.", icon: FileText },
  { title: "Quick Disbursal", description: "Loan amount disbursed within 48 hours of document verification and car inspection.", icon: Zap },
  { title: "No Foreclosure Charges", description: "Floating rate used car loans have zero foreclosure or prepayment charges as per RBI guidelines.", icon: Shield },
];

const interestRates = [
  { lender: "SBI", rate: "11.50% p.a.", maxAmount: "₹10 Lakh", tenure: "Up to 60 months" },
  { lender: "HDFC Bank", rate: "12.00% p.a.", maxAmount: "₹15 Lakh", tenure: "Up to 60 months" },
  { lender: "ICICI Bank", rate: "12.50% p.a.", maxAmount: "₹12 Lakh", tenure: "Up to 48 months" },
  { lender: "Axis Bank", rate: "13.00% p.a.", maxAmount: "₹10 Lakh", tenure: "Up to 48 months" },
  { lender: "Kotak Mahindra Bank", rate: "12.75% p.a.", maxAmount: "₹12 Lakh", tenure: "Up to 60 months" },
  { lender: "Bank of Baroda", rate: "11.75% p.a.", maxAmount: "₹10 Lakh", tenure: "Up to 60 months" },
  { lender: "Punjab National Bank", rate: "12.25% p.a.", maxAmount: "₹8 Lakh", tenure: "Up to 48 months" },
  { lender: "IndusInd Bank", rate: "13.50% p.a.", maxAmount: "₹15 Lakh", tenure: "Up to 60 months" },
  { lender: "Yes Bank", rate: "13.00% p.a.", maxAmount: "₹10 Lakh", tenure: "Up to 48 months" },
  { lender: "Bajaj Finserv", rate: "12.99% p.a.", maxAmount: "₹12 Lakh", tenure: "Up to 60 months" },
];

const eligibilityCriteria = [
  { label: "Age", value: "21 to 65 years" },
  { label: "Income (Salaried)", value: "Min ₹15,000/month" },
  { label: "Income (Self-Employed)", value: "Min ₹2L annual income" },
  { label: "Car Age", value: "Not older than 7-10 years at loan maturity" },
  { label: "CIBIL Score", value: "700+ preferred" },
  { label: "Loan Amount", value: "₹1 Lakh to ₹15 Lakh" },
];

const documents = [
  "PAN Card & Aadhaar Card",
  "Salary slips (last 3 months) / ITR (last 2 years)",
  "Bank statements (last 6 months)",
  "Address proof (Utility Bill, Passport)",
  "Car Registration Certificate (RC)",
  "Insurance copy of the car",
  "Car valuation report from authorized evaluator",
  "NOC from previous financier (if applicable)",
];

const howToApplySteps = [
  { step: 1, title: "Find Your Car", description: "Choose a pre-owned car from a trusted dealer or private seller. Ensure the car is not older than the bank's maximum age limit." },
  { step: 2, title: "Check Eligibility", description: "Use CreduPe's free tool to verify your used car loan eligibility and get pre-approved offers." },
  { step: 3, title: "Compare Offers", description: "Compare interest rates, tenure, and processing fees from 50+ lenders on CreduPe." },
  { step: 4, title: "Car Inspection", description: "The lender arranges a physical inspection and valuation of the used car." },
  { step: 5, title: "Submit Documents", description: "Upload KYC, income proof, car RC, insurance, and valuation report." },
  { step: 6, title: "Loan Disbursal", description: "After verification, the loan is sanctioned and amount is disbursed within 48 hours." },
];

const buyingTips = [
  { title: "Check Vehicle History", description: "Always get a comprehensive vehicle history report including accident records, service history, and ownership transfers.", icon: Search },
  { title: "Get Pre-Approved Financing", description: "Secure loan pre-approval before negotiating with the seller — it gives you stronger bargaining power.", icon: CalendarCheck },
  { title: "Inspect Thoroughly", description: "Have the car inspected by an independent mechanic. Check engine, transmission, brakes, and bodywork.", icon: Wrench },
  { title: "Verify Documents", description: "Check RC, insurance validity, pollution certificate, and ensure no pending loans or challans on the vehicle.", icon: ShieldCheck },
];

const relatedArticles = [
  "How to Get the Best Deal on a Used Car Loan",
  "Used Car Loan vs Personal Loan – Which is Better?",
  "5 Things to Check Before Buying a Pre-Owned Car",
  "How to Negotiate Used Car Loan Interest Rates",
  "Certified Pre-Owned vs Regular Used Cars",
];

const usedCarLoanByBank = [
  "SBI Used Car Loan", "HDFC Used Car Loan", "ICICI Used Car Loan",
  "Axis Bank Used Car Loan", "Kotak Used Car Loan", "Bank of Baroda Used Car Loan",
  "IndusInd Used Car Loan", "Yes Bank Used Car Loan",
];

const interestRateByBank = [
  "SBI Used Car Loan Interest Rate",
  "HDFC Used Car Loan Interest Rate",
  "ICICI Used Car Loan Interest Rate",
  "Axis Bank Used Car Loan Interest Rate",
  "Bajaj Finserv Used Car Loan Interest Rate",
];

const usedCarLoanDetails = [
  "How to Apply Online?", "Used Car Loan EMI Calculator",
  "Eligibility Checker", "Documents Required",
  "Used Car Loan vs New Car Loan",
];

const faqs = [
  { q: "What is the maximum age of a used car that qualifies for a loan?", a: "Most banks require the car to not be older than 5-7 years at the time of purchase, and the total age (existing + loan tenure) should not exceed 10-12 years at loan maturity. Some lenders like SBI and HDFC allow cars up to 10 years old." },
  { q: "How is the loan amount for a used car determined?", a: "The loan amount is based on the car's current market value (depreciated value), not the original price. Banks typically finance 70-85% of the evaluated market value. The valuation is done by an authorized evaluator appointed by the bank." },
  { q: "Is a used car loan interest rate higher than a new car loan?", a: "Yes, used car loan interest rates are typically 2-5% higher than new car loan rates. This is because used cars are considered higher risk due to depreciation and potential mechanical issues. Rates usually range from 11.50% to 16% p.a." },
  { q: "Can I get a used car loan for a car purchased from a private seller?", a: "Yes, most banks offer used car loans for cars purchased from both authorized dealers and private sellers. However, loans for dealer purchases may get better terms and faster processing due to easier verification." },
  { q: "What happens if the used car I bought has a pending loan?", a: "You should always check for pending loans using the VAHAN portal or RTO records before purchase. If a car has a pending loan, the seller must get an NOC from the existing lender before transfer. CreduPe recommends always verifying this before finalizing any deal." },
  { q: "Are there any prepayment charges on used car loans?", a: "As per RBI guidelines, floating rate loans do not have prepayment or foreclosure charges. However, fixed rate used car loans may attract a penalty of 2-5% of outstanding principal. Always check with your lender before prepaying." },
];

const UsedCarLoan = () => {
  const { selectedSlug, selectedType, handleItemClick, handleClose, contentRef } = useSidebarContent();
  const sectionRefs = {
    About: useRef<HTMLDivElement>(null),
    Features: useRef<HTMLDivElement>(null),
    "Interest Rates": useRef<HTMLDivElement>(null),
    Eligibility: useRef<HTMLDivElement>(null),
    Documents: useRef<HTMLDivElement>(null),
    "How to Apply": useRef<HTMLDivElement>(null),
    Tips: useRef<HTMLDivElement>(null),
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
            src={usedCarLoanHero}
            alt="Pre-owned car with price tag for used car loan"
            width={800}
            height={800}
            className="absolute right-[5%] md:right-[10%] bottom-0 h-[105%] w-auto object-contain opacity-95 hidden md:block"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-deep))]/75 to-transparent" />
          <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end h-full min-h-[320px] md:min-h-[360px]">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Used Car Loan</h1>
              <p className="text-white/70 text-sm md:text-base max-w-md">
                Drive your dream pre-owned car with affordable financing. Quick approval, competitive rates, minimal paperwork.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="text-white/80">
                <span className="text-xs block">Interest rate starts from</span>
                <span className="text-3xl md:text-4xl font-bold text-primary">11.50% p.a</span>
              </div>
              <Link to="/login" className="px-6 py-3 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
                Check Eligibility
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                Apply for Used Car Loan
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
          <Link to="/car-loan" className="hover:text-foreground transition-colors">Car Loan</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Used Car Loan</span>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="pb-8">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
          Overview — <span className="text-gradient">Used Car Loan Hub</span>
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
            <SidebarContentPanel productName="Used Car Loan" selectedSlug={selectedSlug} selectedType={selectedType} onClose={handleClose} />
          </div>
          {/* About Section */}
          <div ref={sectionRefs.About} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" /> What is a Used Car Loan?
            </h2>
            <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
              <p>
                A Used Car Loan (also called a Pre-Owned Car Loan or Second-Hand Car Loan) is a secured loan offered by banks and NBFCs 
                to help you purchase a pre-owned vehicle. The car itself serves as collateral for the loan, making it more affordable than 
                taking a personal loan for buying a used car.
              </p>
              <p>
                Used car loans typically come with slightly higher interest rates compared to new car loans — starting from 11.50% p.a. — 
                but they are significantly cheaper than personal loans (which can go up to 18-24% p.a.). Most banks finance 70-85% of the 
                car's current market value, with tenure options of 12 to 60 months depending on the car's age.
              </p>
              <p>
                <strong className="text-foreground">CreduPe</strong> helps you compare used car loan offers from 50+ leading banks and NBFCs, 
                ensuring you get the lowest interest rate, maximum loan amount, and fastest disbursal — all from one platform. Whether you're 
                buying from a dealer or private seller, we help you find the best financing option.
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div ref={sectionRefs.Features} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" /> Features and Benefits of Used Car Loan
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
              <IndianRupee className="w-5 h-5 text-primary" /> Used Car Loan Interest Rates by Various Lenders
            </h2>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[hsl(var(--purple-deep))] text-white">
                    <th className="text-left px-4 py-3 font-semibold text-xs">Lender</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs">Interest Rate</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs hidden sm:table-cell">Max Amount</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs hidden md:table-cell">Tenure</th>
                  </tr>
                </thead>
                <tbody>
                  {interestRates.map((row, i) => (
                    <tr key={row.lender} className={`${i % 2 === 0 ? "bg-card" : "bg-muted/30"} border-t border-border`}>
                      <td className="px-4 py-3 text-xs font-medium text-foreground">{row.lender}</td>
                      <td className="px-4 py-3 text-xs text-primary font-semibold">{row.rate}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{row.maxAmount}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{row.tenure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 italic">*Rates as of April 2026. Actual rates may vary based on car age, condition, and borrower profile.</p>
          </div>

          {/* Eligibility Section */}
          <div ref={sectionRefs.Eligibility} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" /> Used Car Loan Eligibility Criteria
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
              <FileText className="w-5 h-5 text-primary" /> Documents Required for Used Car Loan
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
              <Banknote className="w-5 h-5 text-primary" /> How to Apply for Used Car Loan?
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

          {/* Buying Tips Section */}
          <div ref={sectionRefs.Tips} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" /> Used Car Buying Tips
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {buyingTips.map((tip) => {
                const Icon = tip.icon;
                return (
                  <div key={tip.title} className="rounded-xl border border-border bg-card p-5 flex items-start gap-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{tip.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div ref={sectionRefs.FAQ} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" /> FAQs on Used Car Loan
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
          productName="Used Car Loan"
          insights={relatedArticles}
          topLenders={usedCarLoanByBank}
          interestRates={interestRateByBank}
          eligibilityDocs={usedCarLoanDetails}
          ctaIcon={Car}
          ctaDescription="Compare offers from 50+ lenders and drive your dream car today."
          onItemClick={handleItemClick}
          activeSlug={selectedSlug}
        />
      </div>

      <Footer />
    </div>
  );
};

export default UsedCarLoan;
