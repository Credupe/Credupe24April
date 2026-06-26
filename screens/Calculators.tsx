import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calculator, TrendingUp, Home, Car, Briefcase, Coins, Bike,
  Building2, FileText, CreditCard, Landmark, ChevronRight,
  PiggyBank, BarChart3, Shield, Target, Sparkles, ArrowRight, Tractor
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CalculatorSidebar from "@/components/CalculatorSidebar";

const emiCalculators = [
  { name: "Personal Loan EMI Calculator", icon: CreditCard, href: "/calculator/personal-loan-emi-calculator" },
  { name: "Home Loan EMI Calculator", icon: Home, href: "/calculator/home-loan-emi-calculator" },
  { name: "Business Loan EMI Calculator", icon: Briefcase, href: "/calculator/business-loan-emi-calculator" },
  { name: "Gold Loan EMI Calculator", icon: Coins, href: "/calculator/gold-loan-emi-calculator" },
  { name: "Two Wheeler Loan EMI Calculator", icon: Bike, href: "/calculator/two-wheeler-loan-emi-calculator" },
  { name: "Loan Against Property EMI Calculator", icon: Building2, href: "/calculator/loan-against-property-emi-calculator" },
  { name: "Car Loan EMI Calculator", icon: Car, href: "/calculator/car-loan-emi-calculator" },
  { name: "Term Loan EMI Calculator", icon: FileText, href: "/calculator/term-loan-emi-calculator" },
  { name: "Tractor Loan EMI Calculator", icon: Tractor, href: "/calculator/tractor-loan-emi-calculator" },
  { name: "Mudra Loan EMI Calculator", icon: Landmark, href: "/calculator/mudra-loan-emi-calculator" },
];

const eligibilityCalculators = [
  { name: "Personal Loan Eligibility Calculator", icon: CreditCard, href: "/calculator/personal-loan-eligibility-calculator" },
  { name: "Home Loan Eligibility Calculator", icon: Home, href: "/calculator/home-loan-eligibility-calculator" },
  { name: "Home Loan Prepayment Calculator", icon: Home, href: "/calculator/home-loan-prepayment-calculator" },
  { name: "Personal Loan Prepayment Calculator", icon: CreditCard, href: "/calculator/personal-loan-prepayment-calculator" },
];

type CalcType = "emi" | "eligibility" | "prepayment";
const Calculators = () => {
  const [activeCalc, setActiveCalc] = useState<CalcType>("emi");
  

  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const [income, setIncome] = useState(80000);
  const [existingEmi, setExistingEmi] = useState(0);
  const [eligRate, setEligRate] = useState(9);
  const [eligTenure, setEligTenure] = useState(20);

  const [outstandingAmount, setOutstandingAmount] = useState(2000000);
  const [prepayRate, setPrepayRate] = useState(9);
  const [remainingTenure, setRemainingTenure] = useState(15);
  const [prepayAmount, setPrepayAmount] = useState(200000);

  const emiResult = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure * 12;
    const emiVal = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emiVal * n;
    return { emi: Math.round(emiVal), totalInterest: Math.round(total - amount), totalAmount: Math.round(total) };
  }, [amount, rate, tenure]);

  const eligResult = useMemo(() => {
    const r = eligRate / 12 / 100;
    const n = eligTenure * 12;
    const maxEmi = (income * 0.5) - existingEmi;
    const maxLoan = maxEmi > 0 ? (maxEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)) : 0;
    return { maxLoan: Math.round(Math.max(0, maxLoan)), maxEmi: Math.round(Math.max(0, maxEmi)) };
  }, [income, existingEmi, eligRate, eligTenure]);

  const prepayResult = useMemo(() => {
    const r = prepayRate / 12 / 100;
    const n = remainingTenure * 12;
    const emiOrig = (outstandingAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalOrig = emiOrig * n;
    const newPrincipal = outstandingAmount - prepayAmount;
    const emiNew = newPrincipal > 0 ? (newPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
    const totalNew = emiNew * n;
    return {
      originalEmi: Math.round(emiOrig),
      newEmi: Math.round(emiNew),
      interestSaved: Math.round((totalOrig - outstandingAmount) - (totalNew - newPrincipal)),
    };
  }, [outstandingAmount, prepayRate, remainingTenure, prepayAmount]);

  const principalPercent = (amount / emiResult.totalAmount) * 100;

  const renderSlider = (label: string, value: number, setValue: (v: number) => void, min: number, max: number, step: number, format: (v: number) => string, minLabel: string, maxLabel: string) => (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full accent-primary h-2 rounded-full appearance-none bg-accent cursor-pointer" />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{minLabel}</span><span>{maxLabel}</span>
      </div>
    </div>
  );

  

  return (
    <div className="min-h-screen bg-background max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <Navbar />

      {/* Hero Section with Illustration */}
      <section className="py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] p-8 md:p-12 text-[hsl(var(--primary-foreground))]"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Smart Financial <span className="text-[hsl(var(--lavender-light))]">Calculators</span>
              </h1>
              <p className="text-sm md:text-base opacity-90 mb-6 leading-relaxed max-w-lg">
                Make confident financial decisions with our suite of powerful calculators. Whether you're planning a home purchase, business expansion, or personal financing — get instant clarity on EMIs, eligibility, and savings.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <Shield className="w-4 h-4" />
                  <span>100% Free & Secure</span>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <Target className="w-4 h-4" />
                  <span>Accurate Results</span>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <Sparkles className="w-4 h-4" />
                  <span>14+ Calculators</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              {/* Illustration */}
              <div className="relative w-64 h-64 md:w-72 md:h-72">
                <div className="absolute inset-0 rounded-full bg-[hsl(var(--lavender))] opacity-20 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-[hsl(var(--purple-mid))] opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-[hsl(var(--primary-foreground))] rounded-2xl p-6 shadow-2xl transform rotate-3">
                    <div className="flex items-center gap-3 mb-4">
                      <Calculator className="w-8 h-8 text-[hsl(var(--primary))]" />
                      <div>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">Monthly EMI</p>
                        <p className="text-lg font-bold text-[hsl(var(--foreground))]">₹24,531</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 rounded-full bg-[hsl(var(--accent))] w-full">
                        <div className="h-2 rounded-full bg-[hsl(var(--primary))] w-3/5" />
                      </div>
                      <div className="flex justify-between text-[10px] text-[hsl(var(--muted-foreground))]">
                        <span>Principal</span><span>Interest</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute top-4 right-4 bg-[hsl(var(--primary-foreground))] rounded-xl p-3 shadow-lg transform -rotate-6">
                  <PiggyBank className="w-6 h-6 text-[hsl(var(--primary))]" />
                </div>
                <div className="absolute bottom-8 left-0 bg-[hsl(var(--primary-foreground))] rounded-xl p-3 shadow-lg transform rotate-6">
                  <BarChart3 className="w-6 h-6 text-[hsl(var(--primary))]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Calculator Type Tabs — Attractive Cards */}
      <section className="pb-6">
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
          {([
            { key: "emi" as CalcType, label: "EMI Calculator", desc: "Calculate monthly payments", icon: Calculator },
            { key: "eligibility" as CalcType, label: "Eligibility Calculator", desc: "Check loan eligibility", icon: TrendingUp },
            { key: "prepayment" as CalcType, label: "Prepayment Calculator", desc: "Estimate interest savings", icon: FileText },
          ]).map((t) => {
            const Icon = t.icon;
            const isActive = activeCalc === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveCalc(t.key)}
                className={`relative flex flex-col items-center gap-2 p-4 md:p-6 rounded-2xl text-center transition-all duration-300 border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                    : "bg-card text-foreground border-border hover:border-primary/30 hover:shadow-md"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? "bg-primary-foreground/20" : "bg-accent"}`}>
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                </div>
                <span className="text-sm font-semibold">{t.label}</span>
                <span className={`text-[10px] ${isActive ? "opacity-80" : "text-muted-foreground"}`}>{t.desc}</span>
                {isActive && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rotate-45 rounded-sm" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content: Sidebar + Calculator */}
      <section className="py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <CalculatorSidebar />
          </motion.div>

          {/* Calculator Area */}
          <div>
            {/* EMI Calculator */}
            {activeCalc === "emi" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" /> EMI Calculator
                </h2>
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    {renderSlider("Loan Amount", amount, setAmount, 100000, 10000000, 50000, (v) => `₹${v.toLocaleString("en-IN")}`, "₹1L", "₹1Cr")}
                    {renderSlider("Interest Rate (p.a.)", rate, setRate, 5, 25, 0.1, (v) => `${v}%`, "5%", "25%")}
                    {renderSlider("Loan Tenure", tenure, setTenure, 1, 30, 1, (v) => `${v} Years`, "1 Yr", "30 Yrs")}
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-48 h-48 mb-6">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--accent))" strokeWidth="12" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="12" strokeDasharray={`${principalPercent * 2.51} ${251.2 - principalPercent * 2.51}`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Calculator className="w-5 h-5 text-primary mb-1" />
                        <p className="text-xs text-muted-foreground">Monthly EMI</p>
                        <p className="text-lg font-bold text-foreground">₹{emiResult.emi.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    <div className="w-full space-y-3">
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Principal</span><span className="font-semibold text-foreground">₹{amount.toLocaleString("en-IN")}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Interest</span><span className="font-semibold text-foreground">₹{emiResult.totalInterest.toLocaleString("en-IN")}</span></div>
                      <div className="flex justify-between text-sm border-t border-border pt-3"><span className="text-muted-foreground font-medium">Total Amount</span><span className="font-bold text-foreground">₹{emiResult.totalAmount.toLocaleString("en-IN")}</span></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Eligibility Calculator */}
            {activeCalc === "eligibility" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> Eligibility Calculator
                </h2>
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    {renderSlider("Monthly Income", income, setIncome, 20000, 500000, 5000, (v) => `₹${v.toLocaleString("en-IN")}`, "₹20K", "₹5L")}
                    {renderSlider("Existing EMIs", existingEmi, setExistingEmi, 0, 200000, 1000, (v) => `₹${v.toLocaleString("en-IN")}`, "₹0", "₹2L")}
                    {renderSlider("Interest Rate (p.a.)", eligRate, setEligRate, 5, 20, 0.1, (v) => `${v}%`, "5%", "20%")}
                    {renderSlider("Loan Tenure", eligTenure, setEligTenure, 1, 30, 1, (v) => `${v} Years`, "1 Yr", "30 Yrs")}
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-accent/30 rounded-2xl p-8 text-center w-full">
                      <TrendingUp className="w-10 h-10 text-primary mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-1">Maximum Loan Eligibility</p>
                      <p className="text-3xl font-bold text-foreground mb-4">₹{eligResult.maxLoan.toLocaleString("en-IN")}</p>
                      <div className="border-t border-border pt-4 mt-4">
                        <p className="text-sm text-muted-foreground mb-1">Maximum Affordable EMI</p>
                        <p className="text-xl font-bold text-primary">₹{eligResult.maxEmi.toLocaleString("en-IN")}/mo</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">Based on 50% of net income eligibility rule used by most banks.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Prepayment Calculator */}
            {activeCalc === "prepayment" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Prepayment Calculator
                </h2>
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    {renderSlider("Outstanding Loan Amount", outstandingAmount, setOutstandingAmount, 100000, 10000000, 50000, (v) => `₹${v.toLocaleString("en-IN")}`, "₹1L", "₹1Cr")}
                    {renderSlider("Interest Rate (p.a.)", prepayRate, setPrepayRate, 5, 20, 0.1, (v) => `${v}%`, "5%", "20%")}
                    {renderSlider("Remaining Tenure", remainingTenure, setRemainingTenure, 1, 30, 1, (v) => `${v} Years`, "1 Yr", "30 Yrs")}
                    {renderSlider("Prepayment Amount", prepayAmount, setPrepayAmount, 10000, outstandingAmount, 10000, (v) => `₹${v.toLocaleString("en-IN")}`, "₹10K", `₹${(outstandingAmount / 100000).toFixed(0)}L`)}
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-accent/30 rounded-2xl p-8 text-center w-full space-y-4">
                      <FileText className="w-10 h-10 text-primary mx-auto mb-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Original EMI</p>
                        <p className="text-xl font-bold text-foreground">₹{prepayResult.originalEmi.toLocaleString("en-IN")}/mo</p>
                      </div>
                      <div className="border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground">New EMI After Prepayment</p>
                        <p className="text-xl font-bold text-primary">₹{prepayResult.newEmi.toLocaleString("en-IN")}/mo</p>
                      </div>
                      <div className="border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground">Total Interest Saved</p>
                        <p className="text-2xl font-bold text-green-600">₹{prepayResult.interestSaved.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Info Cards below calculator */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="bg-card border border-border rounded-xl p-5">
                <PiggyBank className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-semibold text-foreground text-sm mb-2">Budget Planning</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Know your exact monthly outgo before taking a loan. Plan your household budget around the EMI to avoid financial stress.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <BarChart3 className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-semibold text-foreground text-sm mb-2">Compare Loan Offers</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Quickly compare EMIs across different banks and NBFCs. Even a 0.5% rate difference can save you lakhs over a long tenure.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <Target className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-semibold text-foreground text-sm mb-2">Prepayment Decisions</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">See how lump-sum payments reduce your total interest burden and shorten loan tenure significantly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Calculator Links — Category Grid */}
      <section className="py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Explore All <span className="text-primary">Calculators</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-8">Choose from our comprehensive range of financial calculators</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* EMI Calculators */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Loan EMI Calculators</h3>
                  <p className="text-xs text-muted-foreground">Calculate monthly installments</p>
                </div>
              </div>
              <div className="space-y-0.5">
                {emiCalculators.map((c) => {
                  const Icon = c.icon;
                  return (
                    <Link key={c.name} to={c.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent/40 transition-colors group">
                      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">{c.name}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Eligibility & Prepayment Calculators */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Loan Eligibility Calculators</h3>
                  <p className="text-xs text-muted-foreground">Check eligibility & prepayment savings</p>
                </div>
              </div>
              <div className="space-y-0.5">
                {eligibilityCalculators.map((c) => {
                  const Icon = c.icon;
                  return (
                    <Link key={c.name} to={c.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent/40 transition-colors group">
                      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">{c.name}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* EMI Formula */}
      <section className="py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">How is EMI Calculated?</h2>
          <div className="bg-card border border-border rounded-xl p-6 max-w-3xl">
            <p className="text-sm text-muted-foreground mb-4">The EMI is calculated using the reducing balance method with the following formula:</p>
            <div className="bg-accent/30 rounded-lg p-4 text-center mb-4">
              <p className="font-mono text-foreground font-semibold">EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ - 1)</p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><span className="font-semibold text-foreground">P</span> = Principal loan amount</p>
              <p><span className="font-semibold text-foreground">r</span> = Monthly interest rate (annual rate / 12 / 100)</p>
              <p><span className="font-semibold text-foreground">n</span> = Total number of monthly installments (tenure in years × 12)</p>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Calculators;
