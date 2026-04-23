import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductSidebar from "@/components/ProductSidebar";
import SidebarContentPanel from "@/components/SidebarContentPanel";
import { useSidebarContent } from "@/hooks/useSidebarContent";
import { Link } from "react-router-dom";
import { useState } from "react";
import { GraduationCap, FileText, Globe, Calendar, Building2, Search, Zap, ArrowRight, BookOpen, MapPin } from "lucide-react";
const educationLoanHero = "/assets/education-loan-hero.png";
import EducationLoanAbout from "@/components/education-loan/EducationLoanAbout";
import EducationLoanProducts from "@/components/education-loan/EducationLoanProducts";
import EducationLoanCost from "@/components/education-loan/EducationLoanCost";
import EducationLoanIntake from "@/components/education-loan/EducationLoanIntake";
import EducationLoanPartners from "@/components/education-loan/EducationLoanPartners";

const tabs = [
  { label: "Education Loan", icon: GraduationCap },
  { label: "Products", icon: FileText },
  { label: "Study in India", icon: BookOpen },
  { label: "Study Abroad", icon: Globe },
  { label: "Education Loan Cost – Study Abroad", icon: MapPin },
  { label: "Intake – Fall / Spring", icon: Calendar },
  { label: "Our Partners", icon: Building2 },
];

const overviewCards = [
  { title: "Find the Best Loan Deals", description: "The right loan—made simple.", icon: Search, highlighted: true },
  { title: "Quick & Stress-Free Loans", description: "We manage the entire process for faster approvals.", icon: Zap },
  { title: "Expert Assistance", description: "Competitive rates and complete support, free of charge.", icon: GraduationCap },
];

const studyAbroadCountries = [
  { name: "Australia", slug: "australia", flag: "🇦🇺", tuition: "AUD 20,000–45,000/yr" },
  { name: "United States", slug: "usa", flag: "🇺🇸", tuition: "$20,000–55,000/yr" },
  { name: "United Kingdom", slug: "uk", flag: "🇬🇧", tuition: "£10,000–35,000/yr" },
  { name: "Germany", slug: "germany", flag: "🇩🇪", tuition: "€0–350/semester" },
  { name: "France", slug: "france", flag: "🇫🇷", tuition: "€243–30,000/yr" },
  { name: "Netherlands", slug: "netherlands", flag: "🇳🇱", tuition: "€8,000–20,000/yr" },
  { name: "New Zealand", slug: "new-zealand", flag: "🇳🇿", tuition: "NZD 22,000–45,000/yr" },
  { name: "Ireland", slug: "ireland", flag: "🇮🇪", tuition: "€10,000–30,000/yr" },
  { name: "Sweden", slug: "sweden", flag: "🇸🇪", tuition: "SEK 80,000–200,000/yr" },
];

const educationInsights = [
  "How to Get an Education Loan Without Collateral",
  "Education Loan vs Self-Funding – Which is Better?",
  "Top Scholarships to Reduce Education Loan Burden",
  "Section 80E Tax Benefits on Education Loans",
  "How to Choose the Right Education Loan Lender",
];

const topLenders = [
  "SBI Education Loan", "HDFC Credila Education Loan", "Axis Bank Education Loan",
  "Bank of Baroda Education Loan", "IDFC FIRST Education Loan", "Punjab National Bank Education Loan",
  "Prodigy Finance Education Loan", "Auxilo Finserve Education Loan",
];

const interestRates = [
  "SBI Education Loan Interest Rate",
  "HDFC Credila Education Loan Interest Rate",
  "Bank of Baroda Education Loan Interest Rate",
  "Axis Bank Education Loan Interest Rate",
  "PNB Education Loan Interest Rate",
];

const eligibilityDocs = [
  "Education Loan Eligibility Criteria",
  "Documents Required for Education Loan",
  "Courses Eligible for Education Loans",
  "Education Loan Repayment Guide",
];

const EducationLoan = () => {
  const [activeTab, setActiveTab] = useState("Education Loan");
  const { selectedSlug, selectedType, handleItemClick, handleClose, contentRef } = useSidebarContent();

  return (
    <div className="min-h-screen bg-background max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-6 pb-0">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] min-h-[320px] md:min-h-[360px]">
          <img
            src={educationLoanHero}
            alt="Student applying for education loan"
            width={800}
            height={800}
            className="absolute right-[5%] md:right-[10%] bottom-0 h-[105%] w-auto object-contain opacity-95 hidden md:block"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-deep))]/75 to-transparent" />

          <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end h-full min-h-[320px] md:min-h-[360px]">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Education Loan</h1>
              <p className="text-white/70 text-sm md:text-base max-w-md">
                Secure an Education Loan for Studying in India and Abroad. Fund your future with the best rates.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="text-white/80">
                <span className="text-xs block">Interest rate starts from</span>
                <span className="text-3xl md:text-4xl font-bold text-primary">6.85% p.a</span>
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
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors relative ${
                  activeTab === tab.label ? "text-primary" : "text-muted-foreground hover:text-foreground"
                } ${i < tabs.length - 1 ? "border-r border-border" : ""}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {activeTab === tab.label && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-6 mb-2">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Education Loan</span>
        </div>
      </section>

      {/* Overview Cards - only on Education Loan tab */}
      {activeTab === "Education Loan" && (
        <section className="pb-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
            Overview — <span className="text-gradient">Education Hub</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {overviewCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={`rounded-xl border p-5 flex items-start gap-4 transition-all duration-300 ${
                    card.highlighted
                      ? "bg-[hsl(var(--purple-deep))] border-[hsl(var(--purple-deep))] text-white shadow-lg"
                      : "bg-card border-border hover:shadow-md"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${card.highlighted ? "bg-white/15" : "bg-muted"}`}>
                    <Icon className={`w-5 h-5 ${card.highlighted ? "text-white" : "text-foreground"}`} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${card.highlighted ? "text-white" : "text-foreground"}`}>{card.title}</h3>
                    <p className={`text-xs mt-1 ${card.highlighted ? "text-white/70" : "text-muted-foreground"}`}>{card.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Main Content + Sidebar Layout */}
      <div className="flex gap-8 pb-16">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Dynamic Sidebar Content */}
          <div ref={contentRef}>
            <SidebarContentPanel productName="Education Loan" selectedSlug={selectedSlug} selectedType={selectedType} onClose={handleClose} />
          </div>

          {/* Tab Content */}
          <section className="pb-4">
            {activeTab === "Education Loan" && <EducationLoanAbout />}
            {activeTab === "Products" && <EducationLoanProducts />}
            {activeTab === "Education Loan Cost – Study Abroad" && <EducationLoanCost />}
            {activeTab === "Intake – Fall / Spring" && <EducationLoanIntake />}
            {activeTab === "Our Partners" && <EducationLoanPartners />}
            
            {/* Study in India Tab */}
            {activeTab === "Study in India" && (
              <div className="py-8">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Study in India</h2>
                <p className="text-sm text-muted-foreground mb-6">Explore top institutions, affordable programs, and education loan options for studying in India.</p>
                <Link
                  to="/study-in-india"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  Explore Study in India <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Study Abroad Tab */}
            {activeTab === "Study Abroad" && (
              <div className="py-8">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Study Abroad</h2>
                <p className="text-sm text-muted-foreground mb-6">Explore country-specific guides with costs, universities, scholarships, and visa info.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studyAbroadCountries.map((c) => (
                    <Link
                      key={c.slug}
                      to={`/study-abroad/${c.slug}`}
                      className="bg-card rounded-xl border border-border p-5 hover:shadow-lg hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{c.flag}</span>
                        <div>
                          <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{c.name}</h3>
                          <p className="text-xs text-muted-foreground">Tuition: {c.tuition}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-primary font-medium">
                        View Complete Guide <ArrowRight className="w-3 h-3" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Sidebar */}
        <ProductSidebar
          productName="Education Loan"
          insights={educationInsights}
          topLenders={topLenders}
          interestRates={interestRates}
          eligibilityDocs={eligibilityDocs}
          ctaIcon={GraduationCap}
          ctaTitle="Get Education Loan"
          ctaDescription="Compare education loan offers from top lenders and get the best rates for your studies."
          ctaButtonText="Apply Now"
          onItemClick={handleItemClick}
          activeSlug={selectedSlug}
        />
      </div>

      <Footer />
    </div>
  );
};

export default EducationLoan;