import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useUIConfigStore } from "@/stores/uiConfigStore";
const loanIllustration = "/assets/loan-illustration.png";
const HeroSection = () => {
  const { config } = useUIConfigStore();
  return (
    <section className="gradient-hero relative overflow-hidden">
      <div className="container pt-6 pb-4 md:pt-8 md:pb-5 relative z-10">
        <div className="flex justify-center mt-2 mb-12 relative z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.1 }}
            className="relative flex flex-col items-center justify-center select-none"
          >
            {/* Background thin circle ring */}
            <div className="absolute w-[240px] h-[240px] md:w-[280px] md:h-[280px] border-4 border-[hsl(var(--primary))]/20 rounded-full z-0 pointer-events-none" />

            {/* Top-Left blue rays (confetti) */}
            <div className="absolute left-[20%] top-[0px] flex gap-1.5 -rotate-[30deg] z-0">
              <span className="w-1.5 h-4 bg-[hsl(var(--primary))]/70 rounded-full"></span>
              <span className="w-1.5 h-5.5 bg-[hsl(var(--primary))] rounded-full transform -translate-y-1"></span>
              <span className="w-1.5 h-4 bg-[hsl(var(--primary))]/70 rounded-full"></span>
            </div>

            {/* Top-Right blue rays (confetti) */}
            <div className="absolute right-[20%] top-[0px] flex gap-1.5 rotate-[30deg] z-0">
              <span className="w-1.5 h-4 bg-[hsl(var(--primary))]/70 rounded-full"></span>
              <span className="w-1.5 h-5.5 bg-[hsl(var(--primary))] rounded-full transform -translate-y-1"></span>
              <span className="w-1.5 h-4 bg-[hsl(var(--primary))]/70 rounded-full"></span>
            </div>

            {/* Top Block: "WE ARE" (white pill with purple border) */}
            <div className="relative z-10 -mb-2 transform -skew-x-[10deg] bg-background border-2 border-[hsl(var(--primary))]/60 px-6 py-1.5 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
              <span className="block text-[hsl(var(--primary))] text-xs md:text-sm font-black uppercase tracking-[0.25em] skew-x-[10deg] leading-none">
                WE ARE
              </span>
            </div>

            {/* Middle Block: "LAUNCHING" (large purple gradient skewed pill) */}
            <div className="relative z-20 transform -skew-x-[10deg] bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--purple-accent))] to-[hsl(var(--primary))] px-8 py-3.5 md:px-11 md:py-4.5 rounded-2xl shadow-[0_10px_25px_rgba(139,92,246,0.35)] border border-white/10 flex items-center justify-center">
              <span className="text-white text-3xl md:text-5xl font-black italic uppercase tracking-widest skew-x-[10deg] drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] leading-none">
                LAUNCHING
              </span>
            </div>

            {/* Bottom Block: "SOON!" (amber skewed pill shifted to right) */}
            <div className="relative z-10 -mt-2.5 ml-16 transform -skew-x-[10deg] bg-amber-400 border border-amber-300 px-6 py-2 md:px-8 md:py-3.5 rounded-xl shadow-[0_6px_16px_rgba(245,158,11,0.3)] flex items-center justify-center">
              <span className="text-slate-950 text-xl md:text-3xl font-black italic uppercase tracking-widest skew-x-[10deg] leading-none">
                SOON!
              </span>

              {/* Accent yellow rays on the right of SOON! */}
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex gap-1 rotate-[45deg] scale-75">
                <span className="w-1.5 h-3.5 bg-amber-400 rounded-full"></span>
                <span className="w-1.5 h-4.5 bg-amber-400 rounded-full transform -translate-y-0.5"></span>
                <span className="w-1.5 h-3.5 bg-amber-400 rounded-full"></span>
              </div>
            </div>

            {/* Overlapping Megaphone Sticker */}
            <div className="absolute left-[8%] bottom-[-5px] z-30 transform -rotate-[10deg] filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)] hover:scale-110 hover:-rotate-[5deg] transition-all duration-300 cursor-pointer">
              {/* Yellow rays shooting out from megaphone mouth */}
              <div className="absolute -right-5 -top-5 flex gap-1 -rotate-[45deg] scale-90">
                <span className="w-1 h-3.5 bg-amber-400 rounded-full"></span>
                <span className="w-1 h-4.5 bg-amber-400 rounded-full transform -translate-y-0.5"></span>
                <span className="w-1 h-3.5 bg-amber-400 rounded-full"></span>
              </div>

              <svg
                viewBox="0 0 100 100"
                className="w-18 h-18 md:w-22 md:h-22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Sticker background */}
                <path
                  d="M35 45 L55 30 C60 26 65 30 65 35 L65 65 C65 70 60 74 55 70 L35 55 Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinejoin="round"
                />
                <path
                  d="M35 40 H25 C22 40 20 42 20 45 V55 C20 58 22 60 25 60 H35"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M65 40 C72 40 78 45 78 50 C78 55 72 60 65 60"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M45 55 L45 70 C45 72 43 74 41 74 H39 C37 74 35 72 35 70 L35 55"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinejoin="round"
                />

                {/* Megaphone body */}
                <path
                  d="M35 45 L55 30 C58 28 62 30 62 34 L62 66 C62 70 58 72 55 70 L35 55 Z"
                  fill="white"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                {/* Handle */}
                <path
                  d="M45 55 L45 70 C45 72 43 74 41 74 H39 C37 74 35 72 35 70 L35 55"
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                {/* Back piece */}
                <path
                  d="M35 40 H25 C22 40 20 42 20 45 V55 C20 58 22 60 25 60 H35 Z"
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                {/* Speaker bell */}
                <ellipse
                  cx="62"
                  cy="50"
                  rx="4"
                  ry="16"
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </motion.div>
        </div>
        <div className="grid lg:grid-cols-2 gap-4 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
              India's Trusted
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

            {!config.sections?.hideHeroCtas && (
              <div className="flex flex-wrap gap-3 mt-8">
                <button className="px-7 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                  Check Eligibility <ArrowRight className="w-4 h-4" />
                </button>
                <button className="px-7 py-3 rounded-full border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors">
                  Explore Products
                </button>
              </div>
            )}
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
