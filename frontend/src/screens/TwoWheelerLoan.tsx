import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductSidebar from "@/components/ProductSidebar";
import SidebarContentPanel from "@/components/SidebarContentPanel";
import { useSidebarContent } from "@/hooks/useSidebarContent";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
const twoWheelerHero = "/assets/two-wheeler-loan-hero.png";
import {
  CheckCircle2, ChevronDown, FileText, IndianRupee, Percent, Shield, Building2, Users,
  ArrowRight, Bike, Wallet, Clock, Zap, BadgePercent, Star, Receipt, CreditCard
} from "lucide-react";

const tabs = ["About", "Interest Rates", "Eligibility", "Fees & Charges", "Documents", "Features", "FAQ"];

const overviewCards = [
  { title: "Two Wheeler Loan", description: "Quick two wheeler loans starting at 9.05% p.a.", icon: Bike, highlighted: true },
  { title: "Two Wheeler Loan Interest Rates", description: "Compare rates from top banks starting at 5.09% p.a.", icon: IndianRupee },
  { title: "Two Wheeler Loan Eligibility", description: "Check eligibility criteria for two wheeler loans", icon: Users },
  { title: "Two Wheeler Loan EMI Calculator", description: "Calculate your monthly EMI instantly", icon: Receipt },
  { title: "Two Wheeler Loan by Bank", description: "Compare offers from SBI, HDFC, ICICI & more", icon: Building2 },
  { title: "Pre Approved Two Wheeler Loan", description: "Instant approval on pre-qualified offers", icon: FileText },
  { title: "Two Wheeler Loan Documents", description: "Know the documents required for loan approval", icon: Shield },
  { title: "Two Wheeler Loan Balance Transfer", description: "Transfer existing loan at lower rates", icon: ArrowRight },
];

const bankRates = [
  { bank: "HDFC Bank", rate: "5.09% onwards" },
  { bank: "Punjab National Bank", rate: "11.05% onwards" },
  { bank: "ICICI Bank", rate: "11.57% onwards" },
  { bank: "State Bank of India", rate: "9.25% onwards" },
  { bank: "Axis Bank", rate: "15% onwards" },
  { bank: "Hero Fincorp", rate: "Depends on the applicant's profile" },
];

const eligibilityData = [
  { param: "Applicant's Profile", value: "Employed or self employed" },
  { param: "Minimum Age", value: "18 Years" },
  { param: "Maximum Age", value: "65 Years" },
  { param: "Minimum Loan Amount", value: "Rs. 10,000" },
  { param: "Maximum Loan Amount", value: "Rs. 25 Lakh, subject to the price of two wheeler and other eligibility criteria" },
  { param: "Maximum Repayment Tenure", value: "5 Years" },
  { param: "Residential Status", value: "Should be resident of the city for more than 1 year" },
  { param: "Net monthly income", value: "Rs. 6000 or more" },
  { param: "Disbursement time", value: "6 hours to 2 days" },
];

const feesData = [
  { param: "Processing Fees", value: "1% to 3% of the loan amount. (Subject to the maximum amount as per lender's policy)" },
  { param: "Foreclosure Charges", value: "Varies from 3% to 6% of the loan outstanding. (Depends on the number of EMIs paid)" },
  { param: "Overdue charges", value: "2.5% per month (May vary from bank to bank)" },
  { param: "Cheque Bounce or EMI return charges", value: "Rs.500" },
  { param: "Stamp Duty", value: "At actual" },
  { param: "NOC Charges", value: "Nil, for the first time. Rs.500 for duplicate NOC" },
];

const documentsData = [
  { title: "Mandatory Document", items: ["PAN Card"] },
  { title: "Identification Documents", items: ["Passport", "Voter ID", "Aadhar Card", "Driving License (Only one document)"] },
  { title: "Address Proof", items: ["If identification documents bear the current residential address, no separate document is required", "In case of a change in address, latest electricity bill, gas bill or water bill, rental agreement or property document is admissible"] },
  { title: "Income Proof", items: ["Last 3 months' pay-slip", "Last 6 months' bank statement", "Last 3 years' income tax statement (waived off in certain cases)"] },
];

const featuresItems = [
  { title: "100% online process", description: "Apply from anywhere, anytime", icon: Zap },
  { title: "Financing up to 100%", description: "Get up to 100% of on-road price", icon: Wallet },
  { title: "Hassle-free documentation", description: "Minimal paperwork required", icon: FileText },
  { title: "Quick Disbursement", description: "Funds in 6 hours to 2 days", icon: Clock },
  { title: "Competitive Rates", description: "Starting from 5.09% p.a.", icon: BadgePercent },
  { title: "Flexible Tenure", description: "Repayment up to 5 years", icon: Star },
];

const faqData = [
  { q: "What is the minimum income required for a two wheeler loan?", a: "Most banks and NBFCs require a minimum net monthly income of Rs. 6,000 or more to qualify for a two wheeler loan. However, this may vary from lender to lender." },
  { q: "Can I get a two wheeler loan without a down payment?", a: "Some lenders offer up to 100% financing of the on-road price of the two wheeler. However, most banks finance 80-90% and require a 10-20% down payment." },
  { q: "What is the maximum tenure for a two wheeler loan?", a: "The maximum repayment tenure for a two wheeler loan is typically 5 years (60 months). Some lenders may offer shorter maximum tenures of 3-4 years." },
  { q: "Can I prepay my two wheeler loan?", a: "Yes, most lenders allow prepayment of two wheeler loans. However, foreclosure charges of 3-6% of the outstanding loan amount may apply depending on the lender and the number of EMIs already paid." },
  { q: "Is a driving license mandatory for a two wheeler loan?", a: "While a driving license is not always mandatory at the time of loan application, it is one of the accepted identification documents. You will need a valid driving license to ride the two wheeler." },
  { q: "What happens if I miss an EMI payment?", a: "Missing an EMI payment will attract overdue charges of approximately 2.5% per month. It will also negatively impact your CIBIL score. Repeated defaults may lead to the lender repossessing the vehicle." },
];

const TwoWheelerLoan = () => {
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
            src={twoWheelerHero}
            alt="Two wheeler loan illustration"
            width={800}
            height={800}
            className="absolute right-[5%] md:right-[10%] bottom-0 h-[105%] w-auto object-contain opacity-95 hidden md:block"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-deep))]/75 to-transparent" />

          <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end h-full min-h-[320px] md:min-h-[360px]">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Two Wheeler Loan</h1>
              <p className="text-white/70 text-sm md:text-base max-w-md">
                Apply for a two wheeler loan and ride your dream bike home.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="text-white/80">
                <span className="text-xs block">Interest rate starts from</span>
                <span className="text-3xl md:text-4xl font-bold text-primary">9.05% p.a</span>
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
          <span className="text-foreground font-medium">Two Wheeler Loan</span>
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
            <SidebarContentPanel productName="Two Wheeler Loan" selectedSlug={selectedSlug} selectedType={selectedType} onClose={handleClose} />
          </div>
      {/* About Section */}
      <div ref={sectionRefs.About} className="scroll-mt-32">
        <section className="py-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Two Wheeler Loan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Driving a two wheeler makes commuting bit convenient and time saving for daily commuters. However, buying a two wheeler requires a sizable amount that may not be possible to arrange upfront payment for some of the people. You can avail two-wheeler loans that can be repaid in easy EMIs as per your choice and budget.
              </p>
              <p>
                You can apply for two wheeler loan online from the comfort of your home or office. Usually, you can avail two-wheeler loans at an interest rate of <strong className="text-foreground">9.05% onwards</strong>.
              </p>
              <p>
                At <strong className="text-foreground">Credupe</strong>, we help you compare two wheeler loan offers from top banks and NBFCs to find the best deal. Our 100% digital process ensures quick approval and fast disbursal.
              </p>
            </div>
            <div className="flex justify-center items-start">
              <img src={twoWheelerHero} alt="Two wheeler loan" width={300} height={225} loading="lazy" className="w-full max-w-[280px]" />
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
                Why thousands of Indians trust Credupe for their two wheeler loan needs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: Shield, title: "100% Secure", desc: "Bank-grade encryption for all your data" },
                  { icon: Zap, title: "Instant Approval", desc: "Get approved in under 2 minutes" },
                  { icon: BadgePercent, title: "Best Rates", desc: "Compare rates from top lenders" },
                  { icon: Clock, title: "Quick Disbursal", desc: "Funds credited within 24 hours" },
                  { icon: FileText, title: "Minimal Docs", desc: "Paperless digital verification" },
                  { icon: Users, title: "Expert Support", desc: "Dedicated loan advisors 24x7" },
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

      {/* Interest Rates */}
      <div ref={sectionRefs["Interest Rates"]} className="scroll-mt-32">
        <section className="py-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            Two Wheeler Loan Interest Rates — <span className="text-gradient">Top Banks</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Compare interest rates from India's leading banks and NBFCs for two wheeler loans.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--purple-deep))] text-white">
                  <th className="text-left px-4 py-3 font-semibold">Banks and NBFCs</th>
                  <th className="text-left px-4 py-3 font-semibold">Interest Rate (p.a.)</th>
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
            Two Wheeler Loan <span className="text-gradient">Eligibility Criteria</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Although each bank and financial institute has its own criteria, below is the indicative list of eligibility criteria:
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
            Fees & Charges for <span className="text-gradient">Two Wheeler Loan</span>
          </h2>
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
            Documents Required for <span className="text-gradient">Two Wheeler Loan</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Keep these documents ready for a smooth application process
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {documentsData.map((doc) => (
              <div key={doc.title} className="rounded-xl border border-border bg-card p-5">
                <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  {doc.title}
                </h4>
                <ul className="space-y-2">
                  {doc.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Features & Benefits */}
      <div ref={sectionRefs.Features} className="scroll-mt-32">
        <section className="pb-16">
          <div className="bg-[hsl(var(--purple-deep))] rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
              Features & Benefits
            </h2>
            <div className="w-12 h-1 bg-primary mx-auto rounded-full mb-4" />
            <p className="text-white/70 text-sm md:text-base text-center max-w-3xl mx-auto mb-10">
              Discover the best features designed to provide a smooth and hassle-free experience when applying for a two wheeler loan.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuresItems.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{f.title}</h3>
                      <p className="text-xs text-white/60 mt-0.5">{f.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* FAQ */}
      <div ref={sectionRefs.FAQ} className="scroll-mt-32">
        <section className="pb-16">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <div className="space-y-3">
            {faqData.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-medium text-foreground text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ml-4 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
        </div>

        <ProductSidebar
          productName="Two Wheeler Loan"
          insights={["Electric Two Wheeler Loan – A Complete Guide", "0% Down Payment Two Wheeler Loans"]}
          topLenders={["HDFC Two Wheeler Loan", "SBI Two Wheeler Loan", "Hero FinCorp Two Wheeler Loan"]}
          interestRates={["HDFC Two Wheeler Loan Rate", "SBI Two Wheeler Loan Rate"]}
          eligibilityDocs={["How to Apply?", "EMI Calculator", "Eligibility & Documents"]}
          ctaIcon={Bike}
          ctaDescription="Compare two wheeler loan offers from top lenders."
          onItemClick={handleItemClick}
          activeSlug={selectedSlug}
        />
      </div>

      <Footer />
    </div>
  );
};

export default TwoWheelerLoan;
