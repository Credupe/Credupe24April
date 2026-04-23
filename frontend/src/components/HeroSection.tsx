import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";
import { Link } from "react-router-dom";
const loanIllustration = "/assets/loan-illustration.png";
const HeroSection = () => {
  return (
    <section className="gradient-hero relative overflow-hidden">
      <div className="container pt-2 pb-4 md:pt-3 md:pb-5 relative z-10">
        <div className="grid lg:grid-cols-2 gap-4 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
              India's Best
              <br />
              Platform for
              <br />
              <span className="text-gradient">Loans & Cards</span>
            </h1>

            <div className="mt-6 space-y-2">
              {[
                "Compare offers from 80+ banks & NBFCs",
                "Check your credit score for free",
                "Get instant loan approval online",
              ].map((point) => (
                <div key={point} className="flex items-center gap-2 text-muted-foreground text-sm md:text-base">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/login" className="px-7 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                Check Eligibility <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/calculators" className="px-7 py-3 rounded-full border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors">
                Explore Products
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative w-full max-w-xl flex items-center justify-center">
              <div className="absolute inset-0 bg-purple-soft/30 rounded-full blur-[80px] scale-75" />
              <img
                src={loanIllustration}
                alt="Loan approval and financial services illustration"
                width={1024}
                height={1024}
                className="relative z-10 w-full h-auto object-contain drop-shadow-2xl scale-[1.15]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
