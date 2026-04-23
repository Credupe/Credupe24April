import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductSidebar from "@/components/ProductSidebar";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useSidebarContent } from "@/hooks/useSidebarContent";
import SidebarContentPanel from "@/components/SidebarContentPanel";
import {
  Coins, Shield, Clock, Zap, FileText, IndianRupee, CheckCircle, ChevronRight,
  Building2, TrendingUp, HelpCircle, Gem, Scale, Banknote, ArrowRight, BadgePercent,
  Receipt, Award, CreditCard, Landmark
} from "lucide-react";
const goldLoanHero = "/assets/gold-loan-hero.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const tabs = [
  "About", "Features", "Interest Rates", "Eligibility", "Documents",
  "How to Apply", "Repayment", "FAQ"
];

const overviewCards = [
  { title: "Gold Loan", description: "Instant loans against your gold jewellery at low interest rates", icon: Coins, highlighted: true },
  { title: "Low Interest Rates", description: "Gold loan interest rates starting from 7.00% p.a.", icon: BadgePercent },
  { title: "Quick Disbursal", description: "Get funds within 30 minutes with minimal paperwork", icon: Zap },
  { title: "No Credit Check", description: "No CIBIL score requirement for gold loan approval", icon: Shield },
  { title: "Flexible Tenure", description: "Choose repayment tenure from 3 months to 3 years", icon: Clock },
  { title: "Safe Gold Storage", description: "Your gold is stored safely in insured bank lockers", icon: Gem },
  { title: "High LTV Ratio", description: "Get up to 75% of your gold's market value as loan", icon: TrendingUp },
  { title: "Multiple Repayment Options", description: "Pay interest monthly or at maturity as per convenience", icon: Receipt },
];

const features = [
  { title: "Low Interest Rates", description: "Gold loan interest rates are among the lowest, starting from 7.00% p.a. compared to personal or business loans.", icon: BadgePercent },
  { title: "No Income Proof Required", description: "Unlike other loans, gold loans don't require income proof or salary slips for approval.", icon: FileText },
  { title: "No Credit Score Check", description: "Your gold acts as collateral, so lenders don't check your CIBIL score.", icon: Shield },
  { title: "Quick Processing", description: "Gold loans are processed and disbursed within 30 minutes at most lenders.", icon: Zap },
  { title: "Flexible Repayment", description: "Choose from bullet repayment, EMI, or interest-only payments.", icon: Clock },
  { title: "Varied Usage", description: "Gold loans can be used for medical emergencies, education, business, weddings, or any personal need.", icon: Award },
];

const interestRates = [
  { lender: "State Bank of India", rate: "7.30% p.a.", ltv: "75%", tenure: "Up to 36 months" },
  { lender: "Bank of India", rate: "7.35% p.a.", ltv: "75%", tenure: "Up to 12 months" },
  { lender: "Canara Bank", rate: "7.65% p.a.", ltv: "75%", tenure: "Up to 12 months" },
  { lender: "Punjab National Bank", rate: "7.70% p.a.", ltv: "75%", tenure: "Up to 12 months" },
  { lender: "HDFC Bank", rate: "8.50% p.a.", ltv: "75%", tenure: "Up to 24 months" },
  { lender: "ICICI Bank", rate: "10.00% p.a.", ltv: "75%", tenure: "Up to 12 months" },
  { lender: "Axis Bank", rate: "9.75% p.a.", ltv: "75%", tenure: "Up to 24 months" },
  { lender: "Muthoot Finance", rate: "12.00% p.a.", ltv: "75%", tenure: "Up to 24 months" },
  { lender: "Manappuram Finance", rate: "12.00% p.a.", ltv: "75%", tenure: "Up to 12 months" },
  { lender: "Federal Bank", rate: "8.90% p.a.", ltv: "75%", tenure: "Up to 12 months" },
];

const eligibilityCriteria = [
  { label: "Age", value: "18 to 70 years" },
  { label: "Gold Purity", value: "18 to 24 carat" },
  { label: "Minimum Gold Weight", value: "10 grams (varies by lender)" },
  { label: "Loan Amount", value: "₹10,000 to ₹1 Crore+" },
  { label: "LTV Ratio", value: "Up to 75% of gold value (as per RBI)" },
  { label: "Acceptable Gold", value: "Gold jewellery, coins (up to 50g)" },
];

const documents = [
  "Valid Photo ID (Aadhaar, PAN, Passport, Voter ID)",
  "Address Proof (Utility Bill, Aadhaar, Passport)",
  "Passport-size Photographs",
  "Gold Jewellery / Gold Coins for Pledging",
];

const howToApplySteps = [
  { step: 1, title: "Visit the Lender", description: "Visit the nearest bank branch or NBFC outlet with your gold ornaments." },
  { step: 2, title: "Gold Appraisal", description: "The lender will assess the purity and weight of your gold to determine loan value." },
  { step: 3, title: "Submit Documents", description: "Provide KYC documents like Aadhaar, PAN, and passport-size photos." },
  { step: 4, title: "Loan Approval", description: "Based on gold value, the lender sanctions the loan amount (up to 75% LTV)." },
  { step: 5, title: "Disbursal", description: "Loan amount is disbursed to your bank account or via cheque within minutes." },
];

const thingsToKnow = [
  { title: "Safety of Your Gold", description: "Always pledge your gold to authorized banks or RBI-registered NBFCs. Ensure your gold is stored in insured vaults." },
  { title: "Defaulting on Debt Loan", description: "Non-payment can lead to the lender auctioning your gold. Always pay interest on time to avoid losing your pledged gold." },
  { title: "Interest Calculation", description: "Gold loan interest is calculated on the principal amount. Some lenders charge simple interest while others charge compound interest." },
];

const relatedArticles = [
  "5 Loan Options With No CIBIL Score Check",
  "What is 916 Gold? 22K vs 24K Purity",
  "Gold vs Silver - Which is Better as Collateral?",
  "RBI Rules for Gold Loan - Latest 2024",
  "4 Primary Ways to Finance With Gold",
];

const goldLoanByBank = [
  "SBI Gold Loan", "HDFC Gold Loan", "ICICI Gold Loan",
  "Axis Gold Loan", "Canara Gold Loan", "PNB Gold Loan",
  "Muthoot Gold Loan", "Manappuram Gold Loan",
];

const interestRateByBank = [
  "SBI Gold Loan Interest Rate",
  "HDFC Gold Loan Interest Rate",
  "Muthoot Finance Interest Rate",
  "Manappuram Interest Rate",
  "ICICI Gold Loan Interest Rate",
];

const goldLoanDetails = [
  "How to Apply Online?", "Gold Loan EMI Calculator",
  "Eligibility Checker", "Documents Required",
  "Gold Loan vs Personal Loan",
];

const investInGold = [
  "Digital Gold Investment", "Sovereign Gold Bonds",
  "Gold ETFs in India", "Gold Mutual Funds",
  "Gold Price Today",
];

const faqs = [
  { q: "What type of gold jewellery or coin is accepted as collateral for a gold loan?", a: "Generally, all forms of gold jewellery including rings, chains, necklaces, bangles, etc. are accepted. Gold coins up to 50 grams are also accepted. The gold should be between 18-24 carat purity. Ornaments with high stone content may have reduced valuation as only the gold portion is considered." },
  { q: "What happens to the gold ornaments I use as collateral?", a: "Your gold ornaments are safely stored in the bank's or NBFC's insured vault/locker. They are returned to you in the same condition once you repay the loan in full. The lender is responsible for the safety of your pledged gold during the loan tenure." },
  { q: "Who decides the value of the gold I intend to use as collateral?", a: "The lender's trained gold appraiser evaluates the purity and weight of your gold. The current market rate on the day of pledging is used to determine the value. As per RBI guidelines, the maximum LTV (Loan-to-Value) ratio is 75%." },
  { q: "Is there an option for prepayment in case of a gold loan?", a: "Yes, most lenders allow prepayment of gold loans without any penalty. You can repay the principal and accumulated interest at any time to get your gold back. Some lenders may charge a nominal foreclosure fee." },
  { q: "Do I not have a decent credit score. Can I still get a gold loan?", a: "Yes! Gold loans are secured loans where your gold acts as collateral. Since the risk to the lender is minimal, CIBIL score or credit history is generally not checked. This makes gold loans ideal for individuals with low or no credit scores." },
];

const GoldLoan = () => {
  const { selectedSlug, selectedType, handleItemClick, handleClose, contentRef } = useSidebarContent();
  const sectionRefs = {
    About: useRef<HTMLDivElement>(null),
    Features: useRef<HTMLDivElement>(null),
    "Interest Rates": useRef<HTMLDivElement>(null),
    Eligibility: useRef<HTMLDivElement>(null),
    Documents: useRef<HTMLDivElement>(null),
    "How to Apply": useRef<HTMLDivElement>(null),
    Repayment: useRef<HTMLDivElement>(null),
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
            src={goldLoanHero}
            alt="Professional with gold loan document"
            width={800}
            height={800}
            className="absolute right-[5%] md:right-[10%] bottom-0 h-[105%] w-auto object-contain opacity-95 hidden md:block"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-deep))]/75 to-transparent" />
          <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end h-full min-h-[320px] md:min-h-[360px]">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Gold Loan</h1>
              <p className="text-white/70 text-sm md:text-base max-w-md">
                Unlock the value of your gold with instant loans at the lowest interest rates. Quick disbursal, minimal paperwork.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="text-white/80">
                <span className="text-xs block">Interest rate starts from</span>
                <span className="text-3xl md:text-4xl font-bold text-primary">7.00% p.a</span>
              </div>
              <Link to="/login" className="px-6 py-3 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
                Check Eligibility
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                Apply for Gold Loan
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
          <span className="text-foreground font-medium">Gold Loan</span>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="pb-8">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
          Overview — <span className="text-gradient">Gold Loan Hub</span>
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
            <SidebarContentPanel productName="Gold Loan" selectedSlug={selectedSlug} selectedType={selectedType} onClose={handleClose} />
          </div>
          {/* About Section */}
          <div ref={sectionRefs.About} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Coins className="w-5 h-5 text-primary" /> What is Gold Loan?
            </h2>
            <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
              <p>
                A Gold Loan is a secured loan that can be availed by pledging gold ornaments or jewellery as collateral with a bank or NBFC. 
                As ornaments or bars of gold act as security, gold loans can be availed for a variety of needs including higher education, 
                wedding expenses, medical emergencies, business expansion, or any other personal needs of cash.
              </p>
              <p>
                Since gold loans are secured loans, they usually offer lower interest rates compared to unsecured loans like personal loans. 
                The loan amount is determined based on the purity and weight of the gold pledged, with the maximum Loan-to-Value (LTV) ratio 
                set at 75% by the RBI. Gold loans are popular due to quick processing, minimal documentation, and no requirement of credit score checks.
              </p>
              <p>
                You can find a number of gold loan lenders on CreduPe. We help you compare and choose the best gold loan offer with the lowest 
                interest rates, flexible repayment options, and maximum loan value for your gold.
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div ref={sectionRefs.Features} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" /> Features and Benefits of Gold Loan
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
              <IndianRupee className="w-5 h-5 text-primary" /> Gold Loan Interest Rates by Various Lenders
            </h2>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[hsl(var(--purple-deep))] text-white">
                    <th className="text-left px-4 py-3 font-semibold text-xs">Lender</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs">Interest Rate</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs hidden sm:table-cell">Max LTV</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs hidden md:table-cell">Tenure</th>
                  </tr>
                </thead>
                <tbody>
                  {interestRates.map((row, i) => (
                    <tr key={row.lender} className={`${i % 2 === 0 ? "bg-card" : "bg-muted/30"} border-t border-border`}>
                      <td className="px-4 py-3 text-xs font-medium text-foreground">{row.lender}</td>
                      <td className="px-4 py-3 text-xs text-primary font-semibold">{row.rate}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{row.ltv}</td>
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
              <CheckCircle className="w-5 h-5 text-primary" /> Gold Loan Eligibility and Documentation
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

            <h3 className="text-sm font-bold text-foreground mt-6 mb-3">What type of gold is accepted as collateral?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Gold jewellery of 18-24 carat purity is accepted. This includes rings, chains, necklaces, bangles, earrings, etc. 
              Gold coins minted by banks (up to 50 grams) are also accepted. Items with excessive stone work may have reduced valuation 
              as only the net gold weight is considered.
            </p>
          </div>

          {/* Documents Section */}
          <div ref={sectionRefs.Documents} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Documents Required to Apply for Gold Loan
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
              <p className="text-xs text-muted-foreground mt-4 italic">
                *Most gold loan lenders require only basic KYC. No income proof or bank statements needed.
              </p>
            </div>
          </div>

          {/* How to Apply Section */}
          <div ref={sectionRefs["How to Apply"]} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-primary" /> How to Apply for Gold Loan?
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

            {/* Things to Know */}
            <h3 className="text-lg font-bold text-foreground mt-8 mb-4">Things to Know Before Applying for Gold Loan</h3>
            <div className="space-y-3">
              {thingsToKnow.map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-4">
                  <h4 className="text-sm font-bold text-foreground mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Repayment Section */}
          <div ref={sectionRefs.Repayment} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" /> Gold Loan Repayment
            </h2>
            <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
              <p>
                <strong className="text-foreground">Bullet Repayment:</strong> Pay the entire principal and interest at the end of the loan tenure. 
                Ideal for short-term gold loans.
              </p>
              <p>
                <strong className="text-foreground">Regular EMIs:</strong> Pay fixed monthly installments that include both principal and interest, 
                just like a regular loan.
              </p>
              <p>
                <strong className="text-foreground">Interest-Only Payments:</strong> Pay only the interest during the tenure and repay the principal 
                at maturity. This keeps your monthly outgo very low.
              </p>
              <p>
                <strong className="text-foreground">Part Payment & Foreclosure:</strong> Most lenders allow part payment or full prepayment without 
                penalties. You can pay back anytime to retrieve your gold.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div ref={sectionRefs.FAQ} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" /> FAQs on Gold Loan
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
          productName="Gold Loan"
          insights={relatedArticles}
          topLenders={goldLoanByBank}
          interestRates={interestRateByBank}
          eligibilityDocs={goldLoanDetails}
          ctaIcon={Gem}
          ctaDescription="Compare offers from 30+ lenders and get the best rates for your gold."
          onItemClick={handleItemClick}
          activeSlug={selectedSlug}
          extraSections={[{
            title: "Invest in Gold",
            items: investInGold,
            icon: TrendingUp,
            highlighted: true,
          }]}
        />
      </div>

      <Footer />
    </div>
  );
};

export default GoldLoan;
