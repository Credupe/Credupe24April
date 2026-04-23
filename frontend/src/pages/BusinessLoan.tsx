import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductSidebar from "@/components/ProductSidebar";
import SidebarContentPanel from "@/components/SidebarContentPanel";
import { useSidebarContent } from "@/hooks/useSidebarContent";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
const businessLoanHero = "/assets/business-loan-hero.png";
import {
  CheckCircle2, ChevronDown, FileText, IndianRupee, Percent, Shield, Building2, Users,
  ArrowRight, Briefcase, Wallet, Clock, Zap, BadgePercent, Star, Receipt, CreditCard,
  TrendingUp, Landmark, BarChart3, HandCoins, Target, PiggyBank
} from "lucide-react";

const tabs = ["About", "Interest Rates", "Eligibility", "Fees & Charges", "Documents", "Features", "FAQ"];

const overviewCards = [
  { title: "Business Loan", description: "Quick business loans starting at 14% p.a. with minimal documentation", icon: Briefcase, highlighted: true },
  { title: "Business Loan Interest Rates", description: "Compare rates from top banks starting at 14% p.a.", icon: IndianRupee },
  { title: "Business Loan Eligibility", description: "Check eligibility criteria for business loans", icon: Users },
  { title: "Business Loan EMI Calculator", description: "Calculate your monthly EMI instantly", icon: Receipt },
  { title: "Business Loan by Bank", description: "Compare offers from SBI, HDFC, ICICI & more", icon: Building2 },
  { title: "MSME & Startup Loans", description: "Special schemes for MSMEs and startups", icon: TrendingUp },
  { title: "Working Capital Loan", description: "Manage day-to-day operational expenses", icon: Wallet },
  { title: "Business Loan Balance Transfer", description: "Transfer existing loan at lower rates", icon: ArrowRight },
];

const bankRates = [
  { bank: "HDFC Bank", rate: "14.00% onwards", amount: "Up to ₹50 Lakh" },
  { bank: "State Bank of India", rate: "14.30% onwards", amount: "Up to ₹25 Lakh" },
  { bank: "ICICI Bank", rate: "15.50% onwards", amount: "Up to ₹50 Lakh" },
  { bank: "Axis Bank", rate: "14.25% onwards", amount: "Up to ₹50 Lakh" },
  { bank: "Kotak Mahindra Bank", rate: "16.00% onwards", amount: "Up to ₹75 Lakh" },
  { bank: "IndusInd Bank", rate: "15.00% onwards", amount: "Up to ₹30 Lakh" },
  { bank: "Bajaj Finserv", rate: "14.00% onwards", amount: "Up to ₹80 Lakh" },
  { bank: "Tata Capital", rate: "15.00% onwards", amount: "Up to ₹75 Lakh" },
];

const eligibilityData = [
  { param: "Applicant's Profile", value: "Self-employed professionals, proprietors, partnership firms, private limited companies, LLPs" },
  { param: "Minimum Age", value: "21 Years" },
  { param: "Maximum Age", value: "65 Years" },
  { param: "Business Vintage", value: "Minimum 2-3 years of business existence" },
  { param: "Minimum Annual Turnover", value: "₹10 Lakh to ₹15 Lakh (varies by lender)" },
  { param: "Minimum Loan Amount", value: "₹50,000" },
  { param: "Maximum Loan Amount", value: "Up to ₹50 Lakh (unsecured); Up to ₹5 Cr (secured)" },
  { param: "Maximum Repayment Tenure", value: "1 to 5 Years" },
  { param: "CIBIL Score", value: "700 and above preferred" },
];

const feesData = [
  { param: "Processing Fees", value: "1% to 3% of the loan amount (Subject to maximum as per lender's policy)" },
  { param: "Foreclosure Charges", value: "2% to 5% of outstanding principal (Depends on EMIs paid)" },
  { param: "Part-prepayment Charges", value: "2% to 4% of the prepaid amount" },
  { param: "Overdue Charges", value: "2% to 3% per month on outstanding EMI (Varies by lender)" },
  { param: "Cheque Bounce / EMI Return", value: "₹500 to ₹1,000 per instance" },
  { param: "Stamp Duty", value: "At actual, as per state government norms" },
  { param: "GST", value: "18% GST applicable on processing fees and other charges" },
];

const documentsData = [
  { title: "Identity Proof", items: ["PAN Card (mandatory)", "Aadhaar Card / Passport / Voter ID / Driving License"] },
  { title: "Address Proof", items: ["Utility bills (electricity/gas/water)", "Rental agreement or property ownership documents", "Aadhaar Card with current address"] },
  { title: "Business Proof", items: ["GST Registration Certificate", "Shop & Establishment Certificate", "Udyam / MSME Registration", "Partnership Deed / MOA & AOA (for companies)"] },
  { title: "Financial Documents", items: ["Last 12 months' bank statements", "Last 2-3 years' ITR with computation of income", "Audited Balance Sheet & Profit/Loss statement", "GST returns for last 12 months"] },
  { title: "Additional Documents", items: ["Business plan (for startups)", "Collateral documents (for secured loans)", "Proof of business continuity"] },
];

const featuresItems = [
  { title: "Collateral-free Loans", description: "No security or collateral required for unsecured business loans up to ₹50 Lakh", icon: Shield },
  { title: "Quick Disbursement", description: "Funds disbursed within 24-72 hours of approval", icon: Zap },
  { title: "Flexible Tenure", description: "Choose repayment tenure from 1 to 5 years", icon: Clock },
  { title: "Minimal Documentation", description: "Simple paperwork with digital verification process", icon: FileText },
  { title: "Competitive Rates", description: "Interest rates starting from 14% p.a.", icon: BadgePercent },
  { title: "High Loan Amount", description: "Avail loans up to ₹5 Crore for secured business loans", icon: TrendingUp },
  { title: "No End-use Restriction", description: "Use funds for any legitimate business purpose", icon: Target },
  { title: "Overdraft Facility", description: "Pay interest only on the amount you use", icon: HandCoins },
];

const businessTypes = [
  { title: "Term Loan", description: "Fixed amount with scheduled repayment for expansion or equipment", icon: Landmark, bgColor: "bg-violet-50", iconColor: "text-violet-500" },
  { title: "Working Capital Loan", description: "Manage day-to-day cash flow and operational expenses", icon: Wallet, bgColor: "bg-emerald-50", iconColor: "text-emerald-500" },
  { title: "MSME Loan", description: "Special schemes under Mudra and CGTMSE for small businesses", icon: Building2, bgColor: "bg-blue-50", iconColor: "text-blue-500" },
  { title: "Startup Loan", description: "Funding solutions for new ventures and startups", icon: TrendingUp, bgColor: "bg-amber-50", iconColor: "text-amber-500" },
  { title: "Equipment Finance", description: "Purchase machinery, tools, and business equipment", icon: BarChart3, bgColor: "bg-rose-50", iconColor: "text-rose-500" },
  { title: "Invoice Financing", description: "Get advance against unpaid invoices and receivables", icon: Receipt, bgColor: "bg-teal-50", iconColor: "text-teal-500" },
  { title: "Overdraft Facility", description: "Flexible credit line for intermittent funding needs", icon: CreditCard, bgColor: "bg-sky-50", iconColor: "text-sky-500" },
  { title: "Govt. Subsidy Loans", description: "PMEGP, Stand-Up India, and other government-backed schemes", icon: PiggyBank, bgColor: "bg-pink-50", iconColor: "text-pink-500" },
];

const faqData = [
  { q: "What is a business loan and who can apply?", a: "A business loan is a type of financing provided to businesses for various purposes like expansion, working capital, equipment purchase, or any other legitimate business need. Self-employed professionals, sole proprietors, partnership firms, private limited companies, and LLPs with a minimum business vintage of 2-3 years can apply." },
  { q: "What is the maximum loan amount I can get?", a: "For unsecured business loans, you can typically get up to ₹50 Lakh depending on your business turnover, profitability, and credit profile. For secured business loans (with collateral), the amount can go up to ₹5 Crore or more." },
  { q: "What is the interest rate for business loans?", a: "Business loan interest rates start from 14% p.a. and can go up to 24% p.a. depending on the lender, your business profile, credit score, turnover, and loan amount. Secured loans generally have lower interest rates than unsecured loans." },
  { q: "Can I get a business loan without collateral?", a: "Yes, many banks and NBFCs offer unsecured business loans (without collateral) up to ₹50 Lakh. However, the interest rates may be slightly higher compared to secured business loans. Government schemes like CGTMSE also provide collateral-free loans to MSMEs." },
  { q: "What is the minimum CIBIL score required for a business loan?", a: "Most lenders prefer a CIBIL score of 700 and above for business loans. However, some NBFCs may consider applications with scores as low as 650, though at higher interest rates." },
  { q: "How long does it take to get a business loan disbursed?", a: "Once all documents are verified and the loan is approved, disbursement typically happens within 24-72 hours for unsecured loans. For secured loans, it may take 7-10 working days due to property verification and legal checks." },
  { q: "Can startups get a business loan?", a: "Yes, startups can avail business loans through government schemes like Mudra Loan (up to ₹10 Lakh), PMEGP, and Stand-Up India. Some NBFCs also offer startup-specific loan products, though they may require a minimum 1-year business vintage." },
  { q: "What happens if I miss an EMI payment?", a: "Missing an EMI payment attracts penalty charges of 2-3% per month on the outstanding amount. Repeated defaults negatively impact your CIBIL score, making future borrowing difficult. In case of secured loans, the lender may initiate recovery proceedings against the collateral." },
];

const BusinessLoan = () => {
  const [activeTab, setActiveTab] = useState("About");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { selectedSlug, selectedType, handleItemClick, handleClose, contentRef } = useSidebarContent();

  const sectionRefs = {
    About: useRef<HTMLDivElement>(null),
    "Interest Rates": useRef<HTMLDivElement>(null),
    Eligibility: useRef<HTMLDivElement>(null),
    "Fees & Charges": useRef<HTMLDivElement>(null),
    Documents: useRef<HTMLDivElement>(null),
    Features: useRef<HTMLDivElement>(null),
    FAQ: useRef<HTMLDivElement>(null),
  };

  const scrollToSection = (tab: string) => {
    setActiveTab(tab);
    sectionRefs[tab as keyof typeof sectionRefs]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-6 pb-0">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] min-h-[320px] md:min-h-[360px]">
          <img
            src={businessLoanHero}
            alt="Business loan illustration"
            width={800}
            height={800}
            className="absolute right-[5%] md:right-[10%] bottom-0 h-[105%] w-auto object-contain opacity-95 hidden md:block"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-deep))]/75 to-transparent" />

          <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end h-full min-h-[320px] md:min-h-[360px]">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Business Loan</h1>
              <p className="text-white/70 text-sm md:text-base max-w-md">
                Fuel your business growth with quick and hassle-free business loans tailored for entrepreneurs and enterprises.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="text-white/80">
                <span className="text-xs block">Interest rate starts from</span>
                <span className="text-3xl md:text-4xl font-bold text-primary">14% p.a</span>
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
              onClick={() => scrollToSection(tab)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
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
          <span className="text-foreground font-medium">Business Loan</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Overview — <span className="text-gradient">Financial Hub</span>
        </h2>
      </section>

      {/* Overview Card Grid */}
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
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${
                    isHighlighted ? "bg-white/15" : "bg-muted"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isHighlighted ? "text-white" : "text-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-xs font-bold leading-tight ${isHighlighted ? "text-white" : "text-foreground"}`}>
                    {card.title}
                  </h3>
                  <p className={`text-[11px] leading-snug mt-0.5 line-clamp-2 ${isHighlighted ? "text-white/70" : "text-muted-foreground"}`}>
                    {card.description}
                  </p>
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
            <SidebarContentPanel productName="Business Loan" selectedSlug={selectedSlug} selectedType={selectedType} onClose={handleClose} />
          </div>
      {/* About Section */}
      <div ref={sectionRefs.About} className="scroll-mt-32">
        <section className="py-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Business Loan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                A business loan is a financial product designed to help entrepreneurs, small business owners, and enterprises meet their funding requirements. Whether you need capital for expansion, working capital management, equipment purchase, or any other business need, a business loan provides the necessary funds with flexible repayment options.
              </p>
              <p>
                Business loans are available in both secured and unsecured forms. Unsecured business loans don't require any collateral and are ideal for short-term funding needs up to <strong className="text-foreground">₹50 Lakh</strong>. Secured business loans, backed by property or other assets, offer higher loan amounts up to <strong className="text-foreground">₹5 Crore</strong> at comparatively lower interest rates.
              </p>
              <p>
                At <strong className="text-foreground">Credupe</strong>, we help you compare business loan offers from top banks and NBFCs including HDFC Bank, SBI, ICICI Bank, Bajaj Finserv, and more. Our digital-first approach ensures quick approvals, minimal documentation, and fast disbursal so you can focus on growing your business.
              </p>
            </div>
            <div className="flex justify-center items-start">
              <img src={businessLoanHero} alt="Business loan" width={300} height={225} loading="lazy" className="w-full max-w-[280px]" />
            </div>
          </div>
        </section>

        {/* Credupe Advantage */}
        <section className="py-8">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                Credupe <span className="text-gradient">Advantage</span>
              </h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-lg">
                Why thousands of Indian businesses trust Credupe for their financing needs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: Shield, title: "100% Secure", desc: "Bank-grade encryption for all your data" },
                  { icon: Zap, title: "Fast Approval", desc: "Get approved within 24 hours" },
                  { icon: BadgePercent, title: "Best Rates", desc: "Compare rates from 30+ lenders" },
                  { icon: Clock, title: "Quick Disbursal", desc: "Funds credited within 72 hours" },
                  { icon: FileText, title: "Minimal Docs", desc: "Paperless digital verification" },
                  { icon: Users, title: "Dedicated RM", desc: "Personal relationship manager assigned" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Business Loan Types */}
      <section className="py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
            <Briefcase className="w-5 h-5" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Types of Business Loans</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {businessTypes.map((card) => {
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
      </section>

      {/* Interest Rates */}
      <div ref={sectionRefs["Interest Rates"]} className="scroll-mt-32">
        <section className="py-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            Business Loan Interest Rates — <span className="text-gradient">Top Banks & NBFCs</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Compare business loan interest rates and maximum loan amounts from India's leading banks and NBFCs.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--purple-deep))] text-white">
                  <th className="text-left px-4 py-3 font-semibold">Banks and NBFCs</th>
                  <th className="text-left px-4 py-3 font-semibold">Interest Rate (p.a.)</th>
                  <th className="text-left px-4 py-3 font-semibold">Max Loan Amount</th>
                  <th className="text-center px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {bankRates.map((b, i) => (
                  <tr key={i} className={`border-t border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                    <td className="px-4 py-3 font-medium text-foreground flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" />
                      {b.bank}
                    </td>
                    <td className="px-4 py-3 text-primary font-bold">{b.rate}</td>
                    <td className="px-4 py-3 text-foreground">{b.amount}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90">
                        Apply Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-destructive font-medium mt-4">
            Note: The mentioned interest rates, fees, and charges are subject to change and depend on the sole discretion of the bank and RBI. GST and service tax shall be levied extra on the mentioned charges.
          </p>
        </section>
      </div>

      {/* Eligibility */}
      <div ref={sectionRefs.Eligibility} className="scroll-mt-32">
        <section className="py-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            Business Loan <span className="text-gradient">Eligibility Criteria</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Although each bank and financial institute has its own criteria, below is the indicative list of eligibility criteria for business loans:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {eligibilityData.map((item) => (
              <div key={item.param} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <span className="text-xs text-muted-foreground">{item.param}</span>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Fees & Charges */}
      <div ref={sectionRefs["Fees & Charges"]} className="scroll-mt-32">
        <section className="py-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            Business Loan <span className="text-gradient">Fees & Charges</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Know the applicable fees and charges before applying for a business loan.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--purple-deep))] text-white">
                  <th className="text-left px-4 py-3 font-semibold">Charge Type</th>
                  <th className="text-left px-4 py-3 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {feesData.map((f, i) => (
                  <tr key={i} className={`border-t border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                    <td className="px-4 py-3 font-medium text-foreground">{f.param}</td>
                    <td className="px-4 py-3 text-muted-foreground">{f.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Documents */}
      <div ref={sectionRefs.Documents} className="scroll-mt-32">
        <section className="py-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            Documents Required for <span className="text-gradient">Business Loan</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Keep the following documents ready before applying for a business loan.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentsData.map((doc) => (
              <div key={doc.title} className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  {doc.title}
                </h3>
                <ul className="space-y-2">
                  {doc.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Features */}
      <div ref={sectionRefs.Features} className="scroll-mt-32">
        <section className="py-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            Business Loan <span className="text-gradient">Features & Benefits</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Discover the key features and benefits of business loans available through Credupe.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuresItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/20 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* FAQ */}
      <div ref={sectionRefs.FAQ} className="scroll-mt-32">
        <section className="py-8 pb-16">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Find answers to common questions about business loans.
          </p>
          <div className="space-y-3 max-w-3xl">
            {faqData.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-foreground pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
        </div>

        <ProductSidebar
          productName="Business Loan"
          insights={["MSME Loan Schemes by Government", "How to Improve Business Loan Approval Chances"]}
          topLenders={["HDFC Business Loan", "SBI Business Loan", "Bajaj Finserv Business Loan"]}
          interestRates={["HDFC Business Loan Rate", "SBI Business Loan Rate"]}
          eligibilityDocs={["How to Apply?", "Eligibility Criteria", "Documents Required"]}
          ctaIcon={Briefcase}
          ctaDescription="Compare business loan offers from 30+ lenders."
          onItemClick={handleItemClick}
          activeSlug={selectedSlug}
        />
      </div>

      <Footer />
    </div>
  );
};

export default BusinessLoan;
