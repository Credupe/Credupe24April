import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Shield, TrendingUp, FileText, AlertTriangle, ThumbsUp, BarChart3, Clock, Users, Star, ChevronRight, Eye, Languages, Smartphone, Sparkles, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tabItems = [
  "Credit Score FREE",
  "CIBIL Score Check Free Online by Pan Number",
  "SBI CIBIL Score",
  "How to Increase CIBIL Score",
  "CIBIL Score for Personal Loan",
  "How to Raise & Resolve CIBIL Dispute",
];

const bureaus = [
  { name: "CIBIL", range: "300–900", icon: "📊" },
  { name: "Experian", range: "300–900", icon: "📈" },
  { name: "Equifax", range: "300–900", icon: "📉" },
  { name: "CRIF High Mark", range: "300–900", icon: "📋" },
];

const scoreRanges = [
  { range: "750–900", label: "Excellent", color: "bg-green-500", desc: "Best loan rates, instant approvals" },
  { range: "700–749", label: "Good", color: "bg-emerald-400", desc: "Competitive rates, easy approvals" },
  { range: "650–699", label: "Fair", color: "bg-yellow-400", desc: "Higher rates, some restrictions" },
  { range: "550–649", label: "Poor", color: "bg-orange-400", desc: "Limited options, high interest" },
  { range: "300–549", label: "Very Poor", color: "bg-red-500", desc: "Loan rejection likely" },
];

const improvementTips = [
  { icon: Clock, title: "Pay Bills on Time", desc: "Timely payment of EMIs and credit card bills is the single most impactful factor. Set up auto-pay to never miss a deadline." },
  { icon: BarChart3, title: "Keep Credit Utilization Low", desc: "Use less than 30% of your total credit limit. High utilization signals financial stress to lenders." },
  { icon: FileText, title: "Maintain a Healthy Credit Mix", desc: "A balanced mix of secured (home, car) and unsecured (personal, credit card) loans shows responsible borrowing." },
  { icon: Eye, title: "Review Your Credit Report Regularly", desc: "Check for errors, unauthorized accounts, or incorrect balances. Dispute inaccuracies promptly with the bureau." },
  { icon: AlertTriangle, title: "Avoid Multiple Loan Applications", desc: "Each hard inquiry lowers your score. Space out applications and only apply when confident of approval." },
  { icon: Users, title: "Limit Co-signing & Guarantor Roles", desc: "Being a guarantor makes you liable if the borrower defaults, directly impacting your credit score." },
];

const benefitsOfGoodScore = [
  { icon: ThumbsUp, title: "Faster Loan Approvals", desc: "Banks prioritize applicants with scores above 750, often processing loans within hours." },
  { icon: TrendingUp, title: "Lower Interest Rates", desc: "A good score can save you lakhs in interest over the tenure of a home or car loan." },
  { icon: Star, title: "Higher Credit Limits", desc: "Banks offer premium credit cards and higher limits to customers with excellent credit history." },
  { icon: Shield, title: "Better Negotiating Power", desc: "Walk into any bank with confidence and negotiate better terms on processing fees and rates." },
];

const factorsAffecting = [
  { factor: "Payment History", weight: "35%", desc: "On-time payments of EMIs, credit card bills, and other dues." },
  { factor: "Credit Utilization", weight: "30%", desc: "Ratio of credit used vs total credit available across all cards." },
  { factor: "Credit History Length", weight: "15%", desc: "Longer credit history demonstrates reliability to lenders." },
  { factor: "Credit Mix", weight: "10%", desc: "Diversity of credit products — secured and unsecured loans." },
  { factor: "New Credit Inquiries", weight: "10%", desc: "Number of recent hard inquiries from loan or card applications." },
];

const articles = [
  { title: "Understanding Your CIBIL Score: A Complete Guide for 2026", category: "Guide" },
  { title: "How to Read Your Credit Report in 5 Minutes", category: "Tutorial" },
  { title: "Top 7 Myths About Credit Scores Debunked", category: "Insights" },
  { title: "Credit Score vs Credit Report: What's the Difference?", category: "Education" },
  { title: "How EMI Defaults Impact Your Credit Score", category: "Warning" },
  { title: "Building Credit Score from Scratch: Tips for Freshers", category: "Beginner" },
];

const faqs = [
  { q: "What is a Credit Score?", a: "A credit score is a three-digit number ranging from 300 to 900 that represents your creditworthiness. It is calculated based on your credit history, repayment patterns, outstanding debts, and credit utilization. Lenders use this score to assess the risk of lending money to you." },
  { q: "How often should I check my Credit Score?", a: "You should check your credit score at least once every quarter. Regular monitoring helps you spot errors, track improvements, and stay prepared for loan applications. Checking your own score is a 'soft inquiry' and does not affect your score." },
  { q: "Does checking my Credit Score lower it?", a: "No. When you check your own credit score, it is classified as a soft inquiry which has zero impact on your score. Only hard inquiries made by lenders when you apply for credit can temporarily lower your score." },
  { q: "What is the minimum CIBIL Score required for a Personal Loan?", a: "Most banks require a minimum CIBIL score of 700–750 for personal loan approval. However, some NBFCs and fintech lenders may consider applications with scores as low as 650, albeit at higher interest rates." },
  { q: "How long does it take to improve a Credit Score?", a: "Improving your credit score is a gradual process. Minor improvements can be seen in 3–6 months with consistent on-time payments. Significant improvements from a poor score may take 12–18 months of disciplined financial behavior." },
  { q: "Can I get a loan with a low Credit Score?", a: "Yes, but options are limited and interest rates will be significantly higher. Some NBFCs offer loans to individuals with lower scores. You can also consider secured loans (against property or fixed deposits) which have easier approval criteria." },
];

const CreditScore = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <Navbar />

      {/* Hero Banner — Calculator-style gradient */}
      <section className="py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] p-8 md:p-12 text-[hsl(var(--primary-foreground))]"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Check Free <span className="text-[hsl(var(--lavender-light))]">Credit Score</span> & Report
              </h1>
              <p className="text-sm md:text-base opacity-90 mb-6 leading-relaxed max-w-lg">
                Monitor your creditworthiness across all 4 bureaus. Get instant access to your score, detailed report analysis, and personalized tips to improve your financial health — all for free on CreduPe.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <Shield className="w-4 h-4" />
                  <span>100% Free & Secure</span>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <Target className="w-4 h-4" />
                  <span>4 Bureau Coverage</span>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <Sparkles className="w-4 h-4" />
                  <span>Monthly Tracking</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "5.7Cr+", label: "Reports Checked" },
                  { value: "4", label: "Bureau Coverage" },
                  { value: "800+", label: "Cities Served" },
                ].map((s) => (
                  <div key={s.label} className="text-center bg-[hsl(var(--primary-foreground))]/10 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-xs opacity-70">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Illustration */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-64 h-64 md:w-72 md:h-72">
                <div className="absolute inset-0 rounded-full bg-[hsl(var(--lavender))] opacity-20 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-[hsl(var(--purple-mid))] opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-[hsl(var(--primary-foreground))] rounded-2xl p-6 shadow-2xl transform -rotate-3">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto rounded-full border-4 border-[hsl(var(--primary))] flex items-center justify-center mb-2">
                        <span className="text-2xl font-bold text-[hsl(var(--primary))]">780</span>
                      </div>
                      <p className="text-xs font-semibold text-[hsl(var(--primary))]">Excellent</p>
                      <div className="mt-2 flex gap-1 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`w-6 h-1.5 rounded-full ${i < 4 ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--border))]"}`} />
                        ))}
                      </div>
                      <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">CIBIL Score</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Get Your Free Score Form */}
      <section className="py-10">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl mx-auto bg-card rounded-2xl shadow-lg border border-border p-8">
          <h3 className="text-xl font-bold text-foreground mb-6">Get Your Free Score</h3>
          <div className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full px-4 py-3 rounded-lg border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            <input type="tel" placeholder="Mobile Number" className="w-full px-4 py-3 rounded-lg border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" maxLength={10} />
            <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-lg border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            <p className="text-xs text-muted-foreground">
              By proceeding, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">Terms</a> &{" "}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
            <button className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              Get Free Credit Score <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">Powered by</p>
            <div className="flex items-center justify-center gap-3">
              {["CIBIL", "Experian", "Equifax", "CRIF"].map((name) => (
                <span key={name} className="text-xs font-semibold text-foreground/60 bg-secondary/50 px-3 py-1.5 rounded border border-border">{name}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tab Navigation */}
      <section className="py-4">
        <div className="bg-primary/5 border border-border rounded-xl p-1 flex flex-wrap gap-1">
          {tabItems.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${activeTab === i ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* What is Credit Score */}
      <section className="py-10" id="what-is-credit-score">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">What is a Credit Score?</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-4xl">
            A credit score is a numerical representation of your creditworthiness, typically ranging from 300 to 900. It is computed by credit bureaus like CIBIL, Experian, Equifax, and CRIF High Mark based on your borrowing and repayment history. A higher score indicates lower risk to lenders, making you eligible for better loan terms, lower interest rates, and faster approvals. In India, CIBIL Score is the most widely recognized, but lenders may check reports from any of the four RBI-licensed bureaus.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-accent/30 rounded-xl p-6 border border-border">
              <Smartphone className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Instant Digital Access</h4>
              <p className="text-xs text-muted-foreground">Check your score anytime from your phone. No paperwork, no branch visits — just instant results.</p>
            </div>
            <div className="bg-accent/30 rounded-xl p-6 border border-border">
              <Languages className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Multi-Language Reports</h4>
              <p className="text-xs text-muted-foreground">Read and understand your credit report in Hindi, Tamil, Telugu, Marathi, and more regional languages.</p>
            </div>
            <div className="bg-accent/30 rounded-xl p-6 border border-border">
              <Shield className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Bank-Grade Security</h4>
              <p className="text-xs text-muted-foreground">Your data is encrypted with 256-bit SSL and never shared with third parties without your consent.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Compare Bureaus */}
      <section className="py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Compare Your Credit Report Across 4 Bureaus</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bureaus.map((b) => (
              <div key={b.name} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h4 className="font-bold text-foreground">{b.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">Score Range: {b.range}</p>
                <button className="mt-3 text-xs text-primary font-medium hover:underline flex items-center justify-center gap-1 mx-auto">
                  Check Score <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Credit Score Ranges */}
      <section className="py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Credit Score Ranges & What They Mean</h2>
          <div className="grid gap-3">
            {scoreRanges.map((s) => (
              <div key={s.range} className="flex items-center gap-4 bg-card border border-border rounded-xl px-6 py-4">
                <div className={`w-3 h-3 rounded-full ${s.color} shrink-0`} />
                <div className="w-24 shrink-0">
                  <span className="font-bold text-foreground text-sm">{s.range}</span>
                </div>
                <div className="w-24 shrink-0">
                  <span className="text-sm font-semibold text-foreground">{s.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Factors Affecting */}
      <section className="py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Factors That Affect Your Credit Score</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-3xl">Understanding what influences your score helps you take targeted action to improve it.</p>
          <div className="space-y-3">
            {factorsAffecting.map((f) => (
              <div key={f.factor} className="bg-card border border-border rounded-xl px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground text-sm">{f.factor}</span>
                  <span className="text-primary font-bold text-sm">{f.weight}</span>
                </div>
                <div className="w-full bg-accent rounded-full h-2 mb-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: f.weight }} />
                </div>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How to Improve */}
      <section className="py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">How to Improve Your Credit Score</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {improvementTips.map((tip) => {
              const Icon = tip.icon;
              return (
                <div key={tip.title} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                  <Icon className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">{tip.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="py-10 bg-accent/20 -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20 rounded-none">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Benefits of a Good Credit Score</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefitsOfGoodScore.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{b.title}</h4>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Credit Score Articles */}
      <section className="py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Credit Score Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((a) => (
              <div key={a.title} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer">
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-1 rounded">{a.category}</span>
                <h4 className="font-semibold text-foreground mt-3 mb-2 text-sm">{a.title}</h4>
                <a href="#" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                  Read More <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQs */}
      <section className="py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">FAQs on Credit Score</h2>
          <div className="space-y-3 max-w-3xl">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-semibold text-foreground text-sm">{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${openFaq === i ? "rotate-90" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* What Our Customers Say */}
      <section className="py-10 bg-accent/20 -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "Priya Sharma", city: "Mumbai", text: "CreduPe helped me understand my credit report in Hindi. I improved my score from 620 to 780 in just 8 months!" },
              { name: "Rajesh Kumar", city: "Delhi", text: "I was able to compare all 4 bureau scores and found an error in my Experian report. Got it resolved quickly." },
              { name: "Anitha Reddy", city: "Hyderabad", text: "The monthly tracking alerts are amazing. I got notified instantly when my score changed. Highly recommended!" },
            ].map((t) => (
              <div key={t.name} className="bg-card border border-border rounded-xl p-6">
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.city}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default CreditScore;
