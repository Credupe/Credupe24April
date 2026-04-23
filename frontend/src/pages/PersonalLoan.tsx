import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductSidebar from "@/components/ProductSidebar";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useSidebarContent } from "@/hooks/useSidebarContent";
import SidebarContentPanel from "@/components/SidebarContentPanel";
import {
  User, IndianRupee, FileText, Shield, Zap, Clock, CheckCircle, ChevronRight,
  Building2, TrendingUp, HelpCircle, Award, ArrowRight, BadgePercent,
  Receipt, Wallet, HeartPulse, Briefcase, Coins, Banknote, CreditCard, Stethoscope,
  Plane, Heart, TrendingDown
} from "lucide-react";
const personalLoanHero = "/assets/personal-loan-hero.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const tabs = [
  "About", "Features", "Interest Rates", "Eligibility", "Documents",
  "How to Apply", "By Need", "FAQ"
];

const overviewCards = [
  { title: "Personal Loan", description: "Quick personal loans starting at 10.49% p.a. with minimal documentation", icon: User, highlighted: true },
  { title: "Pre Approved Personal Loan", description: "Get instant approval on pre-qualified offers with zero hassle", icon: FileText },
  { title: "Personal Loan Interest Rates", description: "Compare interest rates from top banks starting at 10.49% p.a.", icon: IndianRupee },
  { title: "Personal Loan APP", description: "Apply, track & manage your loan on the go with our mobile app", icon: Wallet },
  { title: "Personal Loan Low CIBIL Score", description: "Loan options available even with a credit score as low as 600", icon: HeartPulse },
  { title: "Personal Loan Balance Transfer", description: "Transfer your existing loan at lower rates & save on EMIs", icon: ArrowRight },
  { title: "Instant Personal Loan", description: "Get funds disbursed in minutes with instant digital verification", icon: Coins },
  { title: "Loan on Credit Card", description: "Convert your credit card limit into an affordable personal loan", icon: Briefcase },
];

const features = [
  { title: "No Collateral Required", description: "Personal loans are unsecured — no need to pledge any asset or property as security.", icon: Shield },
  { title: "Quick Disbursal", description: "Get loan amount credited to your bank account within 24 hours of approval.", icon: Zap },
  { title: "Flexible Tenure", description: "Choose repayment tenure from 12 months to 60 months as per your convenience.", icon: Clock },
  { title: "Minimal Documentation", description: "Apply with just basic KYC, income proof, and bank statements. No lengthy paperwork.", icon: FileText },
  { title: "Competitive Interest Rates", description: "Interest rates starting from 10.49% p.a. — compare and get the best deal.", icon: BadgePercent },
  { title: "Multipurpose Usage", description: "Use for medical expenses, travel, weddings, home renovation, debt consolidation, or any personal need.", icon: Award },
];

const interestRates = [
  { lender: "HDFC Bank", rate: "10.50% p.a.", maxAmount: "₹40 Lakh", tenure: "Up to 60 months" },
  { lender: "ICICI Bank", rate: "10.75% p.a.", maxAmount: "₹50 Lakh", tenure: "Up to 60 months" },
  { lender: "State Bank of India", rate: "11.00% p.a.", maxAmount: "₹20 Lakh", tenure: "Up to 72 months" },
  { lender: "Axis Bank", rate: "10.49% p.a.", maxAmount: "₹40 Lakh", tenure: "Up to 60 months" },
  { lender: "Kotak Mahindra Bank", rate: "10.99% p.a.", maxAmount: "₹40 Lakh", tenure: "Up to 60 months" },
  { lender: "Bajaj Finserv", rate: "11.00% p.a.", maxAmount: "₹35 Lakh", tenure: "Up to 84 months" },
  { lender: "Tata Capital", rate: "10.99% p.a.", maxAmount: "₹35 Lakh", tenure: "Up to 72 months" },
  { lender: "IndusInd Bank", rate: "10.49% p.a.", maxAmount: "₹25 Lakh", tenure: "Up to 60 months" },
  { lender: "Yes Bank", rate: "10.99% p.a.", maxAmount: "₹40 Lakh", tenure: "Up to 60 months" },
  { lender: "Punjab National Bank", rate: "11.49% p.a.", maxAmount: "₹10 Lakh", tenure: "Up to 60 months" },
];

const eligibilityCriteria = [
  { label: "Age", value: "21 to 60 years" },
  { label: "Income (Salaried)", value: "Min ₹15,000/month" },
  { label: "Income (Self-Employed)", value: "Min ₹2L annual income" },
  { label: "Employment", value: "Min 1 year experience" },
  { label: "CIBIL Score", value: "650+ preferred" },
  { label: "Loan Amount", value: "₹50,000 to ₹40 Lakh" },
];

const documents = [
  "PAN Card & Aadhaar Card",
  "Salary slips (last 3 months)",
  "Bank statements (last 6 months)",
  "Form 16 / ITR (last 2 years)",
  "Passport-size photographs",
  "Address proof (Utility Bill, Passport)",
  "Employment proof / Offer letter",
];

const howToApplySteps = [
  { step: 1, title: "Check Eligibility", description: "Use CreduPe's free tool to verify your personal loan eligibility instantly." },
  { step: 2, title: "Compare Offers", description: "Compare interest rates, tenure, and processing fees from 80+ lenders." },
  { step: 3, title: "Submit Application", description: "Fill out the online application form and upload required documents." },
  { step: 4, title: "Loan Approval", description: "Lender verifies your details and approves the loan within hours." },
  { step: 5, title: "Disbursal", description: "Loan amount is credited directly to your bank account within 24 hours." },
];

const byNeedCards = [
  { title: "Medical Loan", description: "Cover medical emergencies & treatments", icon: Stethoscope, bgColor: "bg-rose-50", iconColor: "text-rose-500" },
  { title: "Travel Loan", description: "Fund your dream vacations", icon: Plane, bgColor: "bg-sky-50", iconColor: "text-sky-500" },
  { title: "Debt Consolidation", description: "Merge multiple loans into one", icon: TrendingDown, bgColor: "bg-amber-50", iconColor: "text-amber-500" },
  { title: "Wedding Loan", description: "Make your special day perfect", icon: Heart, bgColor: "bg-pink-50", iconColor: "text-pink-500" },
  { title: "Overdraft Loan", description: "Flexible credit when you need it", icon: CreditCard, bgColor: "bg-violet-50", iconColor: "text-violet-500" },
  { title: "Flexi Loan", description: "Borrow & repay as per convenience", icon: Zap, bgColor: "bg-emerald-50", iconColor: "text-emerald-500" },
  { title: "Short Term Loan", description: "Quick funds for short-term needs", icon: Clock, bgColor: "bg-blue-50", iconColor: "text-blue-500" },
  { title: "Term Loan", description: "Fixed tenure with predictable EMIs", icon: Receipt, bgColor: "bg-teal-50", iconColor: "text-teal-500" },
];

const relatedArticles = [
  "How to Get a Personal Loan with Low CIBIL Score",
  "Personal Loan vs Credit Card Loan – Which is Better?",
  "5 Things to Check Before Taking a Personal Loan",
  "How to Reduce Personal Loan Interest Rate",
  "Personal Loan Tax Benefits – Section 80E",
];

const personalLoanByBank = [
  "SBI Personal Loan", "HDFC Personal Loan", "ICICI Personal Loan",
  "Axis Personal Loan", "Kotak Personal Loan", "Bajaj Finserv Personal Loan",
  "IndusInd Personal Loan", "Yes Bank Personal Loan",
];

const interestRateByBank = [
  "SBI Personal Loan Interest Rate",
  "HDFC Personal Loan Interest Rate",
  "ICICI Personal Loan Interest Rate",
  "Axis Bank Personal Loan Interest Rate",
  "Bajaj Finserv Personal Loan Interest Rate",
];

const personalLoanDetails = [
  "How to Apply Online?", "Personal Loan EMI Calculator",
  "Eligibility Checker", "Documents Required",
  "Personal Loan vs Gold Loan",
];

const faqs = [
  { q: "What is the minimum salary required for a personal loan?", a: "Most banks require a minimum monthly salary of ₹15,000–₹25,000 for personal loan eligibility. However, this varies by lender. Some NBFCs may approve loans for lower salary brackets with higher interest rates." },
  { q: "Can I get a personal loan with a low CIBIL score?", a: "Yes, some lenders offer personal loans for CIBIL scores as low as 600. However, you may get a lower loan amount and higher interest rate. Improving your score to 750+ will get you the best rates and higher loan amounts." },
  { q: "How long does it take to get a personal loan disbursed?", a: "Most digital lenders and banks disburse personal loans within 24–48 hours of approval. Some instant loan providers like Bajaj Finserv can disburse within 2 hours if you have a pre-approved offer." },
  { q: "Is there any prepayment penalty on personal loans?", a: "Most lenders charge a prepayment/foreclosure fee of 2–5% of the outstanding principal. However, some banks offer zero prepayment charges after a lock-in period of 6–12 months. Always check the terms before taking the loan." },
  { q: "Can I take a personal loan for debt consolidation?", a: "Yes, personal loans can be used for debt consolidation — merging multiple high-interest debts (credit cards, EMIs) into a single lower-interest personal loan. This simplifies payments and can save money on interest." },
];

const PersonalLoan = () => {
  const { selectedSlug, selectedType, handleItemClick, handleClose, contentRef } = useSidebarContent();
  const sectionRefs = {
    About: useRef<HTMLDivElement>(null),
    Features: useRef<HTMLDivElement>(null),
    "Interest Rates": useRef<HTMLDivElement>(null),
    Eligibility: useRef<HTMLDivElement>(null),
    Documents: useRef<HTMLDivElement>(null),
    "How to Apply": useRef<HTMLDivElement>(null),
    "By Need": useRef<HTMLDivElement>(null),
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
            src={personalLoanHero}
            alt="Professional woman applying for personal loan"
            width={800}
            height={800}
            className="absolute right-[5%] md:right-[10%] bottom-0 h-[105%] w-auto object-contain opacity-95 hidden md:block"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-deep))]/75 to-transparent" />
          <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end h-full min-h-[320px] md:min-h-[360px]">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Personal Loan</h1>
              <p className="text-white/70 text-sm md:text-base max-w-md">
                Apply for a personal loan and meet all your financial needs. Quick approval, minimal documentation.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="text-white/80">
                <span className="text-xs block">Interest rate starts from</span>
                <span className="text-3xl md:text-4xl font-bold text-primary">10.49% p.a</span>
              </div>
              <Link to="/login" className="px-6 py-3 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
                Check Eligibility
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                Apply for Personal Loan
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
          <span className="text-foreground font-medium">Personal Loan</span>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="pb-8">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
          Overview — <span className="text-gradient">Personal Loan Hub</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                className={`group relative text-left rounded-xl border p-3.5 transition-all duration-300 flex items-center gap-3 ${
                  card.highlighted
                    ? "bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] border-[hsl(var(--purple-mid))] text-white shadow-lg"
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
          {/* Dynamic Sidebar Content */}
          <div ref={contentRef}>
            <SidebarContentPanel productName="Personal Loan" selectedSlug={selectedSlug} selectedType={selectedType} onClose={handleClose} />
          </div>
          {/* About Section */}
          <div ref={sectionRefs.About} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> What is a Personal Loan?
            </h2>
            <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
              <p>
                A Personal Loan is an unsecured loan offered by banks and NBFCs to individuals for meeting various personal financial needs. 
                Unlike home or car loans, personal loans don't require any collateral or security. The loan amount can be used for any purpose 
                — medical emergencies, travel, weddings, home renovation, debt consolidation, or education expenses.
              </p>
              <p>
                Personal loans typically come with fixed interest rates and fixed monthly EMIs, making it easy to plan your repayment. 
                With loan amounts ranging from ₹50,000 to ₹40 Lakh and tenure options of 12 to 60 months, personal loans offer great flexibility.
              </p>
              <p>
                <strong className="text-foreground">CreduPe</strong> helps you compare personal loan offers from 80+ leading banks and NBFCs 
                so you can find the lowest interest rate, flexible tenure, and fastest disbursal — all in one platform.
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div ref={sectionRefs.Features} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" /> Features and Benefits of Personal Loan
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
              <IndianRupee className="w-5 h-5 text-primary" /> Personal Loan Interest Rates by Various Lenders
            </h2>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] text-white">
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
            <p className="text-[11px] text-muted-foreground mt-2 italic">*Rates as of April 2026. Actual rates may vary.</p>
          </div>

          {/* Eligibility Section */}
          <div ref={sectionRefs.Eligibility} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" /> Personal Loan Eligibility Criteria
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
              <FileText className="w-5 h-5 text-primary" /> Documents Required for Personal Loan
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
              <Banknote className="w-5 h-5 text-primary" /> How to Apply for Personal Loan?
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

          {/* By Need Section */}
          <div ref={sectionRefs["By Need"]} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-primary" /> Personal Loan By Need
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {byNeedCards.map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.title}
                    className="group flex flex-col items-center text-center hover:scale-105 transition-all duration-300"
                  >
                    <div className={`w-20 h-20 rounded-full ${card.bgColor} flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow duration-300`}>
                      <Icon className={`w-8 h-8 ${card.iconColor}`} />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">{card.title}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[140px]">{card.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div ref={sectionRefs.FAQ} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" /> FAQs on Personal Loan
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
          productName="Personal Loan"
          insights={relatedArticles}
          topLenders={personalLoanByBank}
          interestRates={interestRateByBank}
          eligibilityDocs={personalLoanDetails}
          ctaIcon={User}
          ctaDescription="Compare offers from 80+ lenders and get the best rates instantly."
          onItemClick={handleItemClick}
          activeSlug={selectedSlug}
        />
      </div>

      <Footer />
    </div>
  );
};

export default PersonalLoan;
