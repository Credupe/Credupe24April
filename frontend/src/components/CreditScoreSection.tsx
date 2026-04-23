import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

const benefits = [
  "Check Credit Score from All 4 Bureaus",
  "Track Credit Score Seamlessly Every Month",
  "Read Credit Report in Multiple Languages",
];

const stats = [
  { value: "5.7Cr+", label: "Satisfied Customers" },
  { value: "4", label: "Bureau Coverage" },
  { value: "800+", label: "Cities across India" },
];

const CreditScoreSection = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Check Your Free Credit Score
          </h2>
          <p className="mt-2 text-muted-foreground text-sm max-w-xl mx-auto">
            Compare your credit score across all 4 credit bureaus. Get your free credit score instantly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-foreground">
              Why Check Your Credit Score?
            </h3>
            <div className="space-y-3">
              {benefits.map((b) => (
                <div
                  key={b}
                  className="flex items-center gap-3 bg-card rounded-full px-5 py-3 shadow-sm border border-border"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium text-foreground">{b}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <div className="relative w-48 h-28">
                <svg viewBox="0 0 200 110" className="w-full h-full">
                  <defs>
                    <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(0, 80%, 55%)" />
                      <stop offset="25%" stopColor="hsl(30, 80%, 55%)" />
                      <stop offset="50%" stopColor="hsl(50, 80%, 55%)" />
                      <stop offset="75%" stopColor="hsl(100, 60%, 45%)" />
                      <stop offset="100%" stopColor="hsl(140, 70%, 40%)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="url(#gaugeGrad)"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <motion.line
                    x1="100"
                    y1="100"
                    x2="55"
                    y2="45"
                    stroke="hsl(var(--foreground))"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ rotate: -60, originX: "100px", originY: "100px" }}
                    whileInView={{ rotate: 30, originX: "100px", originY: "100px" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <circle cx="100" cy="100" r="5" fill="hsl(var(--primary))" />
                  <text x="20" y="108" fontSize="8" fill="hsl(var(--muted-foreground))" textAnchor="middle">Poor</text>
                  <text x="100" y="25" fontSize="8" fill="hsl(var(--muted-foreground))" textAnchor="middle">Fair</text>
                  <text x="180" y="108" fontSize="8" fill="hsl(var(--muted-foreground))" textAnchor="middle">Excellent</text>
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl shadow-lg border border-border p-8"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">
              Let's Get Started
            </h3>

            <div className="space-y-4">
              <div>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  maxLength={10}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  You will receive an OTP on mentioned number
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                By logging in, you agree to the following{" "}
                <a href="#" className="text-primary hover:underline">Terms of Use</a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </p>

              <button className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                Get Free Credit Score <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3">Powered by</p>
              <div className="flex items-center justify-center gap-4">
                {["CIBIL", "Experian", "Equifax", "CRIF"].map((name) => (
                  <span
                    key={name}
                    className="text-xs font-semibold text-foreground/60 bg-secondary/50 px-3 py-1.5 rounded border border-border"
                  >
                    {name}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 mt-4">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground font-medium">
                  5.7 Crore reports checked so far
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CreditScoreSection;
