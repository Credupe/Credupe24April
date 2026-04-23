import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, FileText, ChevronRight, CheckCircle, HelpCircle, Shield, Clock, Percent, Banknote, Users, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CalculatorSidebar from "@/components/CalculatorSidebar";
import { getCalculatorBySlug, calculatorProducts } from "@/data/calculatorProducts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ProductCalculator = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getCalculatorBySlug(slug || "");

  const [amount, setAmount] = useState(product?.defaultAmount || 500000);
  const [rate, setRate] = useState(product?.defaultRate || 10);
  const [tenure, setTenure] = useState(product?.defaultTenure || 5);

  // For eligibility calculators
  const [income, setIncome] = useState(80000);
  const [existingEmi, setExistingEmi] = useState(0);

  // For prepayment calculators
  const [prepayAmount, setPrepayAmount] = useState(100000);

  const isEligibility = slug?.includes("eligibility");
  const isPrepayment = slug?.includes("prepayment");

  const emiResult = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure * 12;
    if (r === 0) return { emi: Math.round(amount / n), totalInterest: 0, totalAmount: amount };
    const emiVal = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emiVal * n;
    return { emi: Math.round(emiVal), totalInterest: Math.round(total - amount), totalAmount: Math.round(total) };
  }, [amount, rate, tenure]);

  const eligResult = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure * 12;
    const maxEmi = (income * 0.5) - existingEmi;
    const maxLoan = maxEmi > 0 ? (maxEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)) : 0;
    return { maxLoan: Math.round(Math.max(0, maxLoan)), maxEmi: Math.round(Math.max(0, maxEmi)) };
  }, [income, existingEmi, rate, tenure]);

  const prepayResult = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure * 12;
    const emiOrig = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalOrig = emiOrig * n;
    const newPrincipal = Math.max(0, amount - prepayAmount);
    const emiNew = newPrincipal > 0 ? (newPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
    const totalNew = emiNew * n;
    return {
      originalEmi: Math.round(emiOrig),
      newEmi: Math.round(emiNew),
      interestSaved: Math.round((totalOrig - amount) - (totalNew - newPrincipal)),
    };
  }, [amount, rate, tenure, prepayAmount]);

  const principalPercent = emiResult.totalAmount > 0 ? (amount / emiResult.totalAmount) * 100 : 50;

  if (!product) {
    return (
      <div className="min-h-screen bg-background max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <Navbar />
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Calculator Not Found</h1>
          <Link to="/calculators" className="text-primary hover:underline">← Back to Calculators</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = product.icon;

  const renderSlider = (label: string, value: number, setValue: (v: number) => void, min: number, max: number, step: number, format: (v: number) => string, minL: string, maxL: string) => (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full accent-primary h-2 rounded-full appearance-none bg-accent cursor-pointer" />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{minL}</span><span>{maxL}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <Navbar />

      <div className="py-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/calculators" className="hover:text-foreground">Calculators</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-medium">{product.name}</span>
      </div>

      <section className="py-6 md:py-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <CalculatorSidebar activeSlug={slug} />
          </motion.div>

          <div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{product.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-7">
              {isEligibility ? (
                <>
                  {renderSlider("Monthly Income", income, setIncome, 20000, 500000, 5000, (v) => `₹${v.toLocaleString("en-IN")}`, "₹20K", "₹5L")}
                  {renderSlider("Existing EMIs", existingEmi, setExistingEmi, 0, 200000, 1000, (v) => `₹${v.toLocaleString("en-IN")}`, "₹0", "₹2L")}
                  {renderSlider("Interest Rate (p.a.)", rate, (v) => setRate(v), product.minRate, product.maxRate, 0.1, (v) => `${v}%`, `${product.minRate}%`, `${product.maxRate}%`)}
                  {renderSlider("Loan Tenure", tenure, setTenure, 1, product.maxTenure, 1, (v) => `${v} Years`, "1 Yr", `${product.maxTenure} Yrs`)}
                </>
              ) : isPrepayment ? (
                <>
                  {renderSlider("Outstanding Loan Amount", amount, setAmount, product.minAmount, product.maxAmount, product.stepAmount, (v) => `₹${v.toLocaleString("en-IN")}`, product.minLabel, product.maxLabel)}
                  {renderSlider("Interest Rate (p.a.)", rate, (v) => setRate(v), product.minRate, product.maxRate, 0.1, (v) => `${v}%`, `${product.minRate}%`, `${product.maxRate}%`)}
                  {renderSlider("Remaining Tenure", tenure, setTenure, 1, product.maxTenure, 1, (v) => `${v} Years`, "1 Yr", `${product.maxTenure} Yrs`)}
                  {renderSlider("Prepayment Amount", prepayAmount, setPrepayAmount, 10000, amount, 10000, (v) => `₹${v.toLocaleString("en-IN")}`, "₹10K", `₹${(amount / 100000).toFixed(0)}L`)}
                </>
              ) : (
                <>
                  {renderSlider("Loan Amount", amount, setAmount, product.minAmount, product.maxAmount, product.stepAmount, (v) => `₹${v.toLocaleString("en-IN")}`, product.minLabel, product.maxLabel)}
                  {renderSlider("Interest Rate (p.a.)", rate, (v) => setRate(v), product.minRate, product.maxRate, 0.1, (v) => `${v}%`, `${product.minRate}%`, `${product.maxRate}%`)}
                  {renderSlider("Loan Tenure", tenure, setTenure, 1, product.maxTenure, 1, (v) => `${v} Years`, "1 Yr", `${product.maxTenure} Yrs`)}
                </>
              )}
            </div>

            <div className="flex flex-col items-center justify-center">
              {isEligibility ? (
                <div className="bg-accent/30 rounded-2xl p-8 text-center w-full">
                  <TrendingUp className="w-10 h-10 text-primary mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-1">Maximum Loan Eligibility</p>
                  <p className="text-3xl font-bold text-foreground mb-4">₹{eligResult.maxLoan.toLocaleString("en-IN")}</p>
                  <div className="border-t border-border pt-4 mt-4">
                    <p className="text-sm text-muted-foreground mb-1">Maximum Affordable EMI</p>
                    <p className="text-xl font-bold text-primary">₹{eligResult.maxEmi.toLocaleString("en-IN")}/mo</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">Based on 50% of net income eligibility rule.</p>
                </div>
              ) : isPrepayment ? (
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
              ) : (
                <>
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
                </>
              )}
              <button className="mt-6 w-full px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity text-sm">
                Apply Now
              </button>
            </div>
          </div>
        </motion.div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">Key Highlights</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 text-center">
              <Percent className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Interest Rate</p>
              <p className="text-sm font-bold text-foreground mt-1">{product.interestRateRange}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 text-center">
              <Banknote className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Max Loan Amount</p>
              <p className="text-sm font-bold text-foreground mt-1">{product.maxLoanAmount}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 text-center">
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Tenure</p>
              <p className="text-sm font-bold text-foreground mt-1">{product.tenureRange}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 text-center">
              <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Processing Fee</p>
              <p className="text-sm font-bold text-foreground mt-1">{product.processingFee}</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">{product.aboutTitle}</h2>
          <div className="space-y-3">
            {product.aboutDescription.map((para, i) => (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed">{para}</p>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-10">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" /> Features & Benefits
            </h3>
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              {product.features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{f}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Eligibility Criteria
            </h3>
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              {product.eligibilityCriteria.map((c, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">{i + 1}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{c}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> {product.shortName} Interest Rates Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-card border border-border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-accent/50">
                  <th className="text-left text-xs font-semibold text-foreground px-4 py-3">Bank / NBFC</th>
                  <th className="text-left text-xs font-semibold text-foreground px-4 py-3">Interest Rate</th>
                  <th className="text-left text-xs font-semibold text-foreground px-4 py-3">Max Amount</th>
                  <th className="text-left text-xs font-semibold text-foreground px-4 py-3">Tenure</th>
                </tr>
              </thead>
              <tbody>
                {product.banks.map((bank, i) => (
                  <tr key={i} className="border-t border-border hover:bg-accent/20 transition-colors">
                    <td className="text-sm text-foreground font-medium px-4 py-3">{bank.name}</td>
                    <td className="text-sm text-primary font-semibold px-4 py-3">{bank.rate}</td>
                    <td className="text-sm text-muted-foreground px-4 py-3">{bank.maxAmount}</td>
                    <td className="text-sm text-muted-foreground px-4 py-3">{bank.tenure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">*Interest rates are indicative and may vary based on individual profile and market conditions.</p>
        </motion.div>
      </section>

      {!isEligibility && !isPrepayment && (
        <section className="py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">How is {product.shortName} EMI Calculated?</h2>
            <div className="bg-card border border-border rounded-xl p-6 max-w-3xl">
              <p className="text-sm text-muted-foreground mb-4">The EMI is calculated using the reducing balance method:</p>
              <div className="bg-accent/30 rounded-lg p-4 text-center mb-4">
                <p className="font-mono text-foreground font-semibold">EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ - 1)</p>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><span className="font-semibold text-foreground">P</span> = Principal loan amount</p>
                <p><span className="font-semibold text-foreground">r</span> = Monthly interest rate (annual rate / 12 / 100)</p>
                <p><span className="font-semibold text-foreground">n</span> = Total number of monthly installments (tenure × 12)</p>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      <section className="py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" /> Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="max-w-3xl">
            {product.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>

      <section className="py-10 bg-accent/20 -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">Explore Other Calculators</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {calculatorProducts
              .filter((c) => c.slug !== slug)
              .slice(0, 8)
              .map((c) => {
                const CIcon = c.icon;
                return (
                  <Link key={c.slug} to={`/calculator/${c.slug}`} className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/30 hover:shadow-sm transition-all group">
                    <CIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    <span className="text-xs text-foreground font-medium truncate">{c.shortName}</span>
                  </Link>
                );
              })}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductCalculator;
