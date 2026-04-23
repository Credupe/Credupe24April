import { CheckCircle2, ArrowRight, Shield, Clock, Zap, BadgePercent, FileText, Users, Building2, CreditCard, Landmark, Wallet, TrendingUp, Calculator, Banknote, HandCoins, Phone, Globe, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
const aboutHeroImg = "/assets/personal-loan-about-hero.png";
const advantageImg = "/assets/credupe-advantage.png";
/* ─── What is Personal Loan ─── */
const WhatIsPersonalLoan = () => (
  <section className="py-8">
    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
      Personal Loan
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          A <strong className="text-foreground">personal loan</strong> is an unsecured loan offered by banks and NBFCs to individuals based on factors such as employment history, income, credit score and repayment capacity. Since it is an unsecured loan, there is no need for any collateral or security to avail the loan.
        </p>
        <p>
          Personal loans can be used for various purposes such as medical emergencies, travel, wedding expenses, home renovation, debt consolidation, and more. The interest rates on personal loans typically start from <strong className="text-foreground">10.49% p.a.</strong> and the loan amount can range from ₹50,000 to ₹40 Lakh depending on the lender and your profile.
        </p>
        <p>
          At <strong className="text-foreground">Credupe</strong>, we help you compare personal loan offers from 30+ banks and NBFCs to find the best deal that suits your needs. Our 100% digital process ensures instant approval and quick disbursal.
        </p>
      </div>
      <div className="flex justify-center items-start">
        <img src={aboutHeroImg} alt="Personal loan illustration" width={300} height={225} loading="lazy" className="w-full max-w-[280px]" />
      </div>
    </div>
  </section>
);

/* ─── Credupe Advantage ─── */
const advantageItems = [
  { icon: Shield, title: "100% Secure", desc: "Bank-grade encryption for all your data" },
  { icon: Zap, title: "Instant Approval", desc: "Get approved in under 2 minutes" },
  { icon: BadgePercent, title: "Best Rates", desc: "Compare rates from 30+ lenders" },
  { icon: Clock, title: "Quick Disbursal", desc: "Funds credited within 24 hours" },
  { icon: FileText, title: "Minimal Docs", desc: "Paperless digital verification" },
  { icon: Users, title: "Expert Support", desc: "Dedicated loan advisors available 24x7" },
];

const CredupeAdvantage = () => (
  <section className="py-8">
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
        <div className="md:col-span-3 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            Credupe <span className="text-gradient">Advantage</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-lg">
            Why thousands of Indians trust Credupe for their personal loan needs. We bring you the best offers with complete transparency.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {advantageItems.map((item) => {
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
        <div className="md:col-span-2 flex items-center justify-center bg-accent/30 p-6">
          <img src={advantageImg} alt="Credupe advantage" width={300} height={256} loading="lazy" className="w-full max-w-[260px]" />
        </div>
      </div>
    </div>
  </section>
);

/* ─── Top Banks ─── */
const topBanks = [
  { name: "HDFC Bank", rate: "10.50%", amount: "Up to ₹40 Lakh", tenure: "Up to 5 Years" },
  { name: "ICICI Bank", rate: "10.75%", amount: "Up to ₹30 Lakh", tenure: "Up to 5 Years" },
  { name: "SBI", rate: "11.00%", amount: "Up to ₹20 Lakh", tenure: "Up to 6 Years" },
  { name: "Axis Bank", rate: "10.49%", amount: "Up to ₹25 Lakh", tenure: "Up to 5 Years" },
  { name: "Kotak Mahindra", rate: "10.99%", amount: "Up to ₹40 Lakh", tenure: "Up to 5 Years" },
  { name: "Bajaj Finserv", rate: "11.00%", amount: "Up to ₹35 Lakh", tenure: "Up to 7 Years" },
  { name: "Tata Capital", rate: "10.99%", amount: "Up to ₹25 Lakh", tenure: "Up to 6 Years" },
  { name: "IndusInd Bank", rate: "10.49%", amount: "Up to ₹15 Lakh", tenure: "Up to 5 Years" },
];

const TopBanksSection = () => (
  <section className="py-8">
    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
      Personal Loan Interest Rates — <span className="text-gradient">Top Banks</span>
    </h2>
    <p className="text-sm text-muted-foreground mb-6">
      Compare interest rates from India's leading banks and NBFCs
    </p>
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[hsl(var(--purple-deep))] text-white">
            <th className="text-left px-4 py-3 font-semibold">Bank / NBFC</th>
            <th className="text-left px-4 py-3 font-semibold">Interest Rate (p.a.)</th>
            <th className="text-left px-4 py-3 font-semibold">Loan Amount</th>
            <th className="text-left px-4 py-3 font-semibold">Tenure</th>
            <th className="text-center px-4 py-3 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {topBanks.map((bank, i) => (
            <tr key={bank.name} className={`border-t border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
              <td className="px-4 py-3 font-medium text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                {bank.name}
              </td>
              <td className="px-4 py-3 text-primary font-bold">{bank.rate}</td>
              <td className="px-4 py-3 text-muted-foreground">{bank.amount}</td>
              <td className="px-4 py-3 text-muted-foreground">{bank.tenure}</td>
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
  </section>
);

/* ─── Personal Loan Amount Cards ─── */
const loanAmountCards = [
  { amount: "₹50,000", color: "bg-blue-500" },
  { amount: "₹1 Lakh", color: "bg-primary" },
  { amount: "₹2 Lakh", color: "bg-emerald-500" },
  { amount: "₹3 Lakh", color: "bg-amber-500" },
  { amount: "₹5 Lakh", color: "bg-rose-500" },
  { amount: "₹10 Lakh", color: "bg-violet-500" },
  { amount: "₹15 Lakh", color: "bg-sky-500" },
  { amount: "₹20 Lakh", color: "bg-teal-500" },
];

const PersonalLoanByAmount = () => (
  <section className="py-8">
    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
      Personal Loan by <span className="text-gradient">Amount</span>
    </h2>
    <p className="text-sm text-muted-foreground mb-6">Choose the amount that suits your requirement</p>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {loanAmountCards.map((card) => (
        <button key={card.amount} className={`${card.color} text-white rounded-xl py-5 px-4 text-center font-bold text-lg hover:opacity-90 transition-opacity shadow-md`}>
          {card.amount}
        </button>
      ))}
    </div>
  </section>
);

/* ─── Types of Personal Loan ─── */
const loanTypes = [
  { title: "Personal Loan for Salaried", desc: "Best offers for salaried professionals with competitive rates", icon: Wallet },
  { title: "Personal Loan for Self Employed", desc: "Flexible options for self-employed individuals and freelancers", icon: TrendingUp },
  { title: "Wedding Loan", desc: "Make your dream wedding a reality with easy financing", icon: Star },
  { title: "Medical Emergency Loan", desc: "Quick funds for medical emergencies and healthcare", icon: Shield },
  { title: "Travel Loan", desc: "Fund your travel plans and explore the world", icon: Globe },
  { title: "Debt Consolidation Loan", desc: "Merge multiple debts into a single manageable loan", icon: Calculator },
  { title: "Home Renovation Loan", desc: "Transform your home with affordable financing options", icon: Building2 },
  { title: "Education Loan", desc: "Invest in your future with personal education loans", icon: FileText },
];

const TypesOfPersonalLoan = () => (
  <section className="py-8">
    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
      Types of <span className="text-gradient">Personal Loan</span>
    </h2>
    <p className="text-sm text-muted-foreground mb-6">
      Explore various types of personal loans tailored to your specific needs
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {loanTypes.map((type) => {
        const Icon = type.icon;
        return (
          <button key={type.title} className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left hover:shadow-md hover:border-primary/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-foreground">{type.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{type.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-primary shrink-0" />
          </button>
        );
      })}
    </div>
  </section>
);

/* ─── How to Apply ─── */
const steps = [
  { step: "01", title: "Check Your Eligibility", desc: "Enter basic details like income, employment type, and city to check your eligibility instantly." },
  { step: "02", title: "Compare Loan Offers", desc: "Get personalized offers from 30+ banks and NBFCs. Compare rates, tenure, and processing fees." },
  { step: "03", title: "Submit Application", desc: "Fill in your details, upload documents digitally, and submit your loan application online." },
  { step: "04", title: "Get Funds Disbursed", desc: "Once approved, the loan amount is transferred directly to your bank account within 24 hours." },
];

const HowToApply = () => (
  <section className="py-8">
    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
      How to Apply for <span className="text-gradient">Personal Loan</span>
    </h2>
    <p className="text-sm text-muted-foreground mb-6">
      Get your personal loan approved in just 4 simple steps
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {steps.map((s) => (
        <div key={s.step} className="relative rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
          <span className="text-3xl font-extrabold text-primary/15">{s.step}</span>
          <h4 className="text-sm font-bold text-foreground mt-1">{s.title}</h4>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{s.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

/* ─── Documents Required ─── */
const documents = [
  { title: "Identity Proof", items: ["Aadhaar Card", "PAN Card", "Passport", "Voter ID"] },
  { title: "Address Proof", items: ["Aadhaar Card", "Utility Bills", "Rent Agreement", "Passport"] },
  { title: "Income Proof", items: ["Salary Slips (last 3 months)", "Bank Statement (last 6 months)", "Form 16 / ITR"] },
  { title: "Employment Proof", items: ["Employment Certificate", "Offer Letter", "Business Registration (Self-employed)"] },
];

const DocumentsRequired = () => (
  <section className="py-8">
    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
      Documents Required for <span className="text-gradient">Personal Loan</span>
    </h2>
    <p className="text-sm text-muted-foreground mb-6">
      Keep these documents ready for a smooth application process
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {documents.map((doc) => (
        <div key={doc.title} className="rounded-xl border border-border bg-card p-5">
          <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            {doc.title}
          </h4>
          <ul className="space-y-2">
            {doc.items.map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

/* ─── Factors Affecting Interest Rate ─── */
const factors = [
  { title: "Credit Score", desc: "A higher CIBIL score (750+) helps you get lower interest rates from lenders." },
  { title: "Income Level", desc: "Higher income demonstrates better repayment capacity, leading to better rates." },
  { title: "Employment Type", desc: "Salaried employees from reputed companies often get preferential rates." },
  { title: "Loan Amount & Tenure", desc: "The loan amount and repayment tenure can influence the applicable interest rate." },
  { title: "Existing Debt", desc: "Lower existing EMI obligations improve your eligibility for competitive rates." },
  { title: "Relationship with Bank", desc: "Existing customers may receive pre-approved offers at reduced rates." },
];

const FactorsAffecting = () => (
  <section className="py-8">
    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
      Factors Affecting <span className="text-gradient">Interest Rate</span>
    </h2>
    <p className="text-sm text-muted-foreground mb-6">
      Understanding what affects your personal loan interest rate
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {factors.map((f, i) => (
        <div key={f.title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
          <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
          <div>
            <h4 className="text-sm font-bold text-foreground">{f.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/* ─── Eligibility Criteria ─── */
const eligibilityCriteria = [
  { label: "Age", value: "21 – 60 years" },
  { label: "Minimum Income", value: "₹15,000 / month (Salaried)" },
  { label: "Employment", value: "Minimum 1 year work experience" },
  { label: "CIBIL Score", value: "650+ (750+ preferred)" },
  { label: "Nationality", value: "Indian Citizen or Resident" },
  { label: "Existing EMIs", value: "FOIR below 50% preferred" },
];

const EligibilityCriteria = () => (
  <section className="py-8">
    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
      Personal Loan <span className="text-gradient">Eligibility Criteria</span>
    </h2>
    <p className="text-sm text-muted-foreground mb-6">
      Check if you meet the basic eligibility requirements
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {eligibilityCriteria.map((item) => (
        <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
          <div>
            <span className="text-xs text-muted-foreground">{item.label}</span>
            <p className="text-sm font-semibold text-foreground">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/* ─── FAQs ─── */
const faqs = [
  { q: "What is a personal loan?", a: "A personal loan is an unsecured loan that doesn't require any collateral. It can be used for various purposes like medical emergencies, weddings, travel, home renovation, debt consolidation, and more. Interest rates typically start from 10.49% p.a." },
  { q: "What is the maximum personal loan amount I can get?", a: "The maximum personal loan amount varies by lender. Generally, you can get a personal loan ranging from ₹50,000 to ₹40 Lakh depending on your income, credit score, employment type, and other factors." },
  { q: "What is the minimum CIBIL score required for a personal loan?", a: "While most banks prefer a CIBIL score of 750 or above, some lenders offer personal loans to individuals with a score as low as 600-650. However, a higher score helps you get better interest rates and faster approval." },
  { q: "How long does it take to get a personal loan?", a: "With Credupe, you can get instant approval within 2 minutes. Once approved, the loan amount is typically disbursed within 24–48 hours directly to your bank account." },
  { q: "Can I prepay my personal loan?", a: "Yes, most lenders allow prepayment or foreclosure of personal loans. Some may charge a prepayment penalty (typically 2-5% of the outstanding amount), while others allow it free of charge after a lock-in period." },
  { q: "What documents are required for a personal loan?", a: "Basic documents include identity proof (Aadhaar, PAN), address proof, income proof (salary slips, bank statements), and employment proof. With Credupe's digital process, many documents can be verified online." },
  { q: "How is personal loan EMI calculated?", a: "EMI is calculated using the formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P = Principal, r = monthly interest rate, and n = number of months. You can use Credupe's EMI calculator for instant calculations." },
  { q: "Can I get a personal loan without income proof?", a: "Most lenders require income proof. However, some digital lenders and NBFCs offer personal loans based on alternative data like bank statements, UPI transaction history, and digital footprint." },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section className="py-8">
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
        Frequently Asked <span className="text-gradient">Questions</span>
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Everything you need to know about personal loans
      </p>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-sm font-semibold text-foreground pr-4">{faq.q}</span>
              {openIndex === i ? (
                <ChevronUp className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─── Main About Component ─── */
const PersonalLoanAbout = () => {
  return (
    <div>
      <WhatIsPersonalLoan />
      <CredupeAdvantage />
      <TopBanksSection />
      <PersonalLoanByAmount />
      <TypesOfPersonalLoan />
      <HowToApply />
      <EligibilityCriteria />
      <DocumentsRequired />
      <FactorsAffecting />
      <FAQSection />
    </div>
  );
};

export default PersonalLoanAbout;
