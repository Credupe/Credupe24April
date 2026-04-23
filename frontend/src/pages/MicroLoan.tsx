import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductSidebar from "@/components/ProductSidebar";
import SidebarContentPanel from "@/components/SidebarContentPanel";
import { useSidebarContent } from "@/hooks/useSidebarContent";
import { FileText, IndianRupee, Users, HeartPulse, User, Coins, Briefcase, Wallet, ArrowRight, ShoppingCart, Store, Smartphone, Banknote, Clock, Zap, HandCoins, Receipt, TrendingDown, CheckCircle2, CreditCard, ShieldCheck, Percent, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
const microLoanHero = "/assets/micro-loan-hero.png";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const advantageImg = "/assets/credupe-advantage.png";
const overviewCards = [
  { title: "Micro Loan", description: "Small-ticket loans up to ₹1 lakh with instant approval & easy repayment", icon: Banknote, highlighted: true },
  { title: "Instant Micro Loan", description: "Get funds in minutes with zero paperwork through digital verification", icon: Zap },
  { title: "Micro Loan Interest Rates", description: "Compare micro loan rates starting from 12% p.a. across lenders", icon: IndianRupee },
  { title: "Micro Loan App", description: "Apply, track & manage your micro loan on the go with our mobile app", icon: Smartphone },
  { title: "Micro Loan for Business", description: "Quick working capital for small businesses & entrepreneurs", icon: Store },
  { title: "Emergency Micro Loan", description: "Instant funds for medical, travel or other urgent financial needs", icon: HeartPulse },
  { title: "Micro Loan Low CIBIL", description: "Loan options available even with credit score as low as 550", icon: BadgeCheck },
  { title: "Micro Loan for Shopping", description: "Finance your purchases with affordable EMI options", icon: ShoppingCart },
];

const tabs = ["About", "Interest Rates", "Eligibility", "Fees & Charges", "Documents", "Features", "FAQ"];

const interestRates = [
  { lender: "KreditBee", rate: "12% – 29.95%", processing: "1% – 6%", tenure: "3 – 15 months", amount: "₹1,000 – ₹1,00,000" },
  { lender: "MoneyTap", rate: "13% – 25%", processing: "2%", tenure: "2 – 36 months", amount: "₹3,000 – ₹5,00,000" },
  { lender: "EarlySalary", rate: "14% – 30%", processing: "2% – 4%", tenure: "3 – 24 months", amount: "₹5,000 – ₹2,00,000" },
  { lender: "CASHe", rate: "15% – 33%", processing: "1.5% – 3%", tenure: "3 – 18 months", amount: "₹5,000 – ₹3,00,000" },
  { lender: "MoneyView", rate: "14% – 36%", processing: "2% – 6%", tenure: "3 – 60 months", amount: "₹5,000 – ₹5,00,000" },
  { lender: "Navi", rate: "12% – 29%", processing: "Nil – 4%", tenure: "3 – 60 months", amount: "₹5,000 – ₹5,00,000" },
  { lender: "PaySense", rate: "16% – 36%", processing: "2% – 6%", tenure: "3 – 60 months", amount: "₹5,000 – ₹5,00,000" },
  { lender: "Stashfin", rate: "11.99% – 36%", processing: "1% – 5%", tenure: "3 – 36 months", amount: "₹1,000 – ₹5,00,000" },
];

const eligibilityCriteria = [
  { label: "Age", value: "18 – 60 years", icon: User },
  { label: "Minimum Income", value: "₹8,000/month", icon: IndianRupee },
  { label: "Employment", value: "Salaried / Self-employed", icon: Briefcase },
  { label: "Credit Score", value: "550+ (varies by lender)", icon: BadgeCheck },
  { label: "Nationality", value: "Indian Citizen / Resident", icon: Users },
  { label: "Work Experience", value: "Minimum 3 months", icon: Clock },
];

const documents = [
  "Aadhaar Card / PAN Card",
  "Last 3 months bank statements",
  "Salary slips (last 2 months) or income proof",
  "Selfie with ID proof",
  "Address proof (utility bill / rent agreement)",
  "Business proof (for self-employed – GST certificate, shop license)",
];

const features = [
  { icon: Zap, title: "Instant Disbursal", desc: "Funds transferred to your account within minutes of approval" },
  { icon: FileText, title: "Minimal Documentation", desc: "Just Aadhaar, PAN & bank statement – 100% digital process" },
  { icon: ShieldCheck, title: "No Collateral Needed", desc: "Completely unsecured loans with no asset pledging required" },
  { icon: Percent, title: "Flexible Tenure", desc: "Repay in easy EMIs over 3 to 36 months as per convenience" },
  { icon: CreditCard, title: "Low Credit Score OK", desc: "Options available even for applicants with score as low as 550" },
  { icon: HandCoins, title: "Affordable EMIs", desc: "EMIs starting as low as ₹500/month for small loan amounts" },
];

const faqs = [
  { q: "What is a micro loan?", a: "A micro loan is a small-ticket personal loan typically ranging from ₹1,000 to ₹1,00,000, designed for short-term financial needs like emergencies, small purchases, or working capital for micro businesses." },
  { q: "Who is eligible for a micro loan?", a: "Any Indian citizen aged 18-60 with a minimum monthly income of ₹8,000 and a basic credit history can apply. Some lenders offer micro loans even with credit scores as low as 550." },
  { q: "How quickly can I get a micro loan?", a: "Most micro loans are disbursed within 15-30 minutes of application through digital platforms. The entire process from application to disbursal can be completed on your smartphone." },
  { q: "What documents are needed for a micro loan?", a: "You typically need Aadhaar Card, PAN Card, last 3 months bank statements, and salary slips or income proof. Some lenders may accept just Aadhaar and PAN for small amounts." },
  { q: "What are the interest rates for micro loans?", a: "Interest rates for micro loans typically range from 12% to 36% p.a. depending on the lender, loan amount, tenure, and your credit profile." },
  { q: "Can I get a micro loan without a CIBIL score?", a: "Some fintech lenders offer micro loans to first-time borrowers without a CIBIL score by using alternative data like bank transaction history, digital footprint, and employment verification." },
  { q: "What is the maximum tenure for a micro loan?", a: "Micro loan tenures typically range from 3 to 36 months. Shorter tenures of 3-6 months are common for very small amounts, while larger micro loans may have tenures up to 36 months." },
  { q: "Are there any prepayment charges?", a: "Most micro loan providers allow prepayment without additional charges after a lock-in period of 1-3 months. However, some lenders may charge 2-4% foreclosure fees." },
];

const MicroLoan = () => {
  const [activeTab, setActiveTab] = useState("About");
  const { selectedSlug, selectedType, handleItemClick, handleClose, contentRef } = useSidebarContent();

  const aboutRef = useRef<HTMLDivElement>(null);
  const ratesRef = useRef<HTMLDivElement>(null);
  const eligibilityRef = useRef<HTMLDivElement>(null);
  const feesRef = useRef<HTMLDivElement>(null);
  const docsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement>> = {
    "About": aboutRef,
    "Interest Rates": ratesRef,
    "Eligibility": eligibilityRef,
    "Fees & Charges": feesRef,
    "Documents": docsRef,
    "Features": featuresRef,
    "FAQ": faqRef,
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    sectionRefs[tab]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-6 pb-0">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] min-h-[320px] md:min-h-[360px]">
          <img
            src={microLoanHero}
            alt="Micro loan instant approval on smartphone"
            width={800}
            height={800}
            className="absolute right-[5%] md:right-[10%] bottom-0 h-[105%] w-auto object-contain opacity-95 hidden md:block"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-deep))]/75 to-transparent" />

          <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end h-full min-h-[320px] md:min-h-[360px]">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Micro Loan</h1>
              <p className="text-white/70 text-sm md:text-base max-w-md">
                Instant small-ticket loans for your immediate financial needs — quick, paperless & hassle-free.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="text-white/80">
                <span className="text-xs block">Interest rate starts from</span>
                <span className="text-3xl md:text-4xl font-bold text-primary">12% p.a</span>
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
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-6 mb-2">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Micro Loan</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Overview — <span className="text-gradient">Micro Finance Hub</span>
        </h2>
      </section>

      {/* Overview Cards */}
      <section className="pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewCards.map((card) => {
            const Icon = card.icon;
            const isHighlighted = card.highlighted;
            return (
              <button
                key={card.title}
                className={`group relative text-left rounded-xl border p-3.5 transition-all duration-300 flex items-center gap-3 ${
                  isHighlighted
                    ? "bg-[hsl(var(--purple-deep))] border-[hsl(var(--purple-deep))] text-white shadow-lg"
                    : "bg-card border-border hover:shadow-md hover:border-primary/20"
                }`}
              >
                <div className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${isHighlighted ? "bg-white/15" : "bg-muted"}`}>
                  <Icon className={`w-4 h-4 ${isHighlighted ? "text-white" : "text-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-xs font-bold leading-tight ${isHighlighted ? "text-white" : "text-foreground"}`}>{card.title}</h3>
                  <p className={`text-[11px] leading-snug mt-0.5 line-clamp-2 ${isHighlighted ? "text-white/70" : "text-muted-foreground"}`}>{card.description}</p>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isHighlighted ? "text-white/70" : "text-primary"}`} />
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content + Sidebar Layout */}
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <div ref={contentRef}>
            <SidebarContentPanel productName="Micro Loan" selectedSlug={selectedSlug} selectedType={selectedType} onClose={handleClose} />
          </div>
      {/* About Section */}
      <section ref={aboutRef} className="pb-12 scroll-mt-32">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
            <Banknote className="w-5 h-5" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">About Micro Loans</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              A <strong className="text-foreground">micro loan</strong> is a small-value personal loan typically ranging from ₹1,000 to ₹1,00,000, designed to meet short-term financial needs. These loans are ideal for salaried individuals, small business owners, freelancers, and gig workers who need quick access to funds without extensive paperwork.
            </p>
            <p>
              Micro loans have gained massive popularity in India through fintech platforms that offer <strong className="text-foreground">instant digital processing</strong>, minimal documentation, and quick disbursals — often within minutes. They serve as a lifeline for emergency expenses, medical needs, small business working capital, and bridging salary gaps.
            </p>
            <p>
              Unlike traditional bank loans, micro loans leverage technology for credit assessment, using alternative data like digital footprints, transaction history, and social signals. This enables even first-time borrowers or those with limited credit history to access formal credit.
            </p>
          </div>
          <div className="rounded-2xl bg-[hsl(var(--purple-deep))] p-6 text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <img src={advantageImg} alt="CreduPe Advantage" className="w-6 h-6" />
              CreduPe Advantage
            </h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Compare micro loan offers from 15+ lenders in one place</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Get personalized rates based on your credit profile</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> 100% digital process — apply from your smartphone</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Instant approval & disbursal within 15 minutes</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Dedicated support for first-time borrowers</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> No hidden charges — complete fee transparency</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interest Rates Table */}
      <section ref={ratesRef} className="pb-12 scroll-mt-32">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
            <IndianRupee className="w-5 h-5" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Micro Loan Interest Rates</h2>
        </div>
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--purple-deep))] text-white">
                  <th className="text-left px-4 py-3 font-semibold">Lender</th>
                  <th className="text-left px-4 py-3 font-semibold">Interest Rate (p.a.)</th>
                  <th className="text-left px-4 py-3 font-semibold">Processing Fee</th>
                  <th className="text-left px-4 py-3 font-semibold">Tenure</th>
                  <th className="text-left px-4 py-3 font-semibold">Loan Amount</th>
                </tr>
              </thead>
              <tbody>
                {interestRates.map((row, i) => (
                  <tr key={row.lender} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                    <td className="px-4 py-3 font-medium text-foreground">{row.lender}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.rate}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.processing}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.tenure}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section ref={eligibilityRef} className="pb-12 scroll-mt-32">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Eligibility Criteria</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {eligibilityCriteria.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fees & Charges */}
      <section ref={feesRef} className="pb-12 scroll-mt-32">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
            <Receipt className="w-5 h-5" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Fees & Charges</h2>
        </div>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[hsl(var(--purple-deep))] text-white">
                <th className="text-left px-4 py-3 font-semibold">Fee Type</th>
                <th className="text-left px-4 py-3 font-semibold">Charges</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Processing Fee", "1% – 6% of loan amount"],
                ["Prepayment / Foreclosure", "Nil – 4% (after lock-in period)"],
                ["Late Payment Penalty", "₹200 – ₹500 + GST per instance"],
                ["Bounce Charges", "₹350 – ₹750 per bounce + GST"],
                ["GST on Fees", "18% on all applicable fees"],
                ["Stamp Duty", "As per state government norms"],
                ["Documentation Charges", "Nil for most digital lenders"],
              ].map(([type, charge], i) => (
                <tr key={type} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                  <td className="px-4 py-3 font-medium text-foreground">{type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{charge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Documents */}
      <section ref={docsRef} className="pb-12 scroll-mt-32">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Required Documents</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {documents.map((doc, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm text-foreground">{doc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features & Benefits */}
      <section ref={featuresRef} className="pb-12 scroll-mt-32">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Features & Benefits</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-xl bg-[hsl(var(--purple-deep))] p-5 text-white">
                <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold mb-1">{f.title}</h3>
                <p className="text-xs text-white/70 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqRef} className="pb-16 scroll-mt-32">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
        </div>
        <Accordion type="single" collapsible className="rounded-xl border border-border bg-card overflow-hidden">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="px-5 text-sm font-semibold text-foreground hover:no-underline">{faq.q}</AccordionTrigger>
              <AccordionContent className="px-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

        </div>

        <ProductSidebar
          productName="Micro Loan"
          insights={["Micro Loan vs Personal Loan – Which to Choose?"]}
          topLenders={["KreditBee Micro Loan", "MoneyTap Micro Loan", "EarlySalary Micro Loan"]}
          interestRates={["KreditBee Interest Rate"]}
          eligibilityDocs={["How to Apply?", "Eligibility Criteria"]}
          ctaIcon={Banknote}
          ctaDescription="Compare micro loan offers from 15+ digital lenders."
          onItemClick={handleItemClick}
          activeSlug={selectedSlug}
        />
      </div>

      <Footer />
    </div>
  );
};

export default MicroLoan;
