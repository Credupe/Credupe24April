import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useUIConfigStore } from "@/stores/uiConfigStore";
import { Briefcase, Code, Rocket, Headphones, Mail, ArrowRight, Sparkles, GraduationCap, Shield, Compass, Target, Eye } from "lucide-react";
const careersIllustration = "/assets/careers-illustration.png";
import CareerApplicationModal from "@/components/CareerApplicationModal";

const pillars = [
  {
    icon: Code,
    title: "Create & Develop",
    desc: "Build cutting-edge fintech products that simplify financial decisions for millions of Indians.",
    color: "from-[hsl(var(--purple-deep))] to-[hsl(var(--purple-mid))]",
  },
  {
    icon: Rocket,
    title: "Grow & Expand",
    desc: "Drive growth strategies, partnerships, and market expansion across India and beyond.",
    color: "from-[hsl(var(--purple-mid))] to-[hsl(var(--lavender))]",
  },
  {
    icon: Headphones,
    title: "Support & Manage",
    desc: "Ensure seamless operations, customer success, and operational excellence at scale.",
    color: "from-[hsl(var(--lavender))] to-[hsl(var(--lavender-light))]",
  },
];

const perks = [
  "Competitive salary & ESOPs",
  "Flexible work culture",
  "Health & wellness benefits",
  "Learning & development budget",
  "Team offsites & events",
  "Work with renowned banking partners",
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const Careers = () => {
  const { config } = useUIConfigStore();

  const filteredPerks = perks.filter(perk => {
    if (perk === "Competitive salary & ESOPs" && config.sections?.hideCareersSalaryPerk) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="py-10 md:py-16 px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] p-8 md:p-12 text-[hsl(var(--primary-foreground))]"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[hsl(var(--lavender-light))] font-medium mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Careers at CreduPe
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Open Positions at <span className="text-[hsl(var(--lavender-light))]">CreduPe</span>
              </h1>
              <p className="text-sm md:text-base opacity-90 mb-6 leading-relaxed max-w-lg">
                You Create & Develop the product, Grow and Expand the reach, Support and Manage operations. Join us in shaping India's financial future.
              </p>
              <CareerApplicationModal
                trigger={
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(var(--primary-foreground))] text-[hsl(var(--primary))] font-semibold text-sm hover:opacity-90 transition-opacity">
                    <Mail className="w-4 h-4" />
                    Apply Now
                  </button>
                }
              />
            </div>
            <div className="flex justify-center">
              <img
                src={careersIllustration}
                alt="Team collaborating at CreduPe"
                width={800}
                height={600}
                className="w-full max-w-md rounded-xl"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* About CreduPe Section */}
      <section className="py-16 px-6 md:px-12 lg:px-20 border-y border-border bg-gradient-to-b from-transparent to-[hsl(var(--purple-soft))]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column */}
            <motion.div
              className="lg:col-span-5 space-y-6"
              {...fadeUp}
            >
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="w-3.5 h-3.5" /> About CreduPe
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-3 leading-tight">
                  Smarter Lending Starts with Better Choices
                </h2>
                <p className="text-muted-foreground text-sm md:text-base font-medium">
                  Built to Simplify Borrowing. Backed by Decades of Experience.
                </p>
              </div>

              {/* Elite Credentials */}
              <div className="flex flex-wrap gap-2 pt-2">
                {["IIT Kharagpur", "IIM Lucknow", "IIM Calcutta"].map((inst) => (
                  <span key={inst} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-background border border-border shadow-sm text-foreground">
                    <GraduationCap className="w-3.5 h-3.5 text-primary" />
                    {inst}
                  </span>
                ))}
              </div>

              {/* Quote Block */}
              <div className="p-6 rounded-2xl bg-card border border-border relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-[hsl(var(--purple-mid))]" />
                <p className="text-foreground font-semibold italic text-base leading-relaxed pl-3">
                  "We believe borrowing should be simple, transparent, and personalized."
                </p>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              className="lg:col-span-7 space-y-6"
              {...fadeUp}
            >
              {/* Card 1 */}
              <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base mb-1.5">Technology-Driven Marketplace</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      CreduPe is a technology-driven lending marketplace built by banking professionals &amp; fintech innovators who understand the complexities of borrowing in today's financial landscape.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base mb-1.5">Backed by Decades of Experience</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      With decades of experience across banking, lending, credit distribution, and financial services, we have witnessed firsthand the challenges borrowers face—multiple applications, fragmented information, limited transparency, and difficulty finding the right lender.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base mb-1.5">Empowering Borrowers</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      That's why we created CreduPe—a platform that leverages technology, data, and industry expertise to help borrowers discover, compare, and access the most suitable credit solutions with confidence.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why CreduPe Section */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-primary font-semibold text-sm tracking-wider uppercase">Why CreduPe?</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Smarter Solutions for Modern Borrowers
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <motion.div
              className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
              {...fadeUp}
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-foreground text-lg">Evolving Ecosystem</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The lending ecosystem is evolving rapidly, yet borrowers often struggle to navigate an increasingly complex marketplace.
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
              {...fadeUp}
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-foreground text-lg">Simplifying Choices</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Finding the right loan shouldn't require visiting multiple lenders, comparing countless offers, or deciphering complicated terms and conditions.
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
              {...fadeUp}
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Rocket className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-foreground text-lg">Unified Platform</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  CreduPe brings together leading financial institutions and lending partners on a single platform, empowering customers with greater visibility, smarter choices, and a seamless borrowing experience.
                </p>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
              {...fadeUp}
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-foreground text-lg">Personal Goals</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Whether you're financing education, buying a home, growing a business, or meeting personal financial goals, CreduPe helps you find the deal that's right for you.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[hsl(var(--purple-soft))] to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission Card */}
            <motion.div
              className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-card to-background border border-border shadow-md flex flex-col justify-between relative overflow-hidden"
              {...fadeUp}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 blur-xl" />
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">Our Mission</h3>
                <p className="text-foreground/90 font-medium text-base md:text-lg leading-relaxed">
                  To democratize access to credit by making lending more transparent, efficient, and customer-centric.
                </p>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  We are committed to helping borrowers make informed financial decisions through technology, trusted partnerships, and personalized solutions.
                </p>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[hsl(var(--purple-deep))] to-[hsl(var(--purple-dark))] text-primary-foreground shadow-xl flex flex-col justify-between relative overflow-hidden"
              {...fadeUp}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-lavender/10 rounded-full -mr-12 -mt-12 blur-2xl" />
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[hsl(var(--lavender-light))]">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">Our Vision</h3>
                <p className="text-white/90 font-medium text-base md:text-lg leading-relaxed">
                  We envision a future where access to credit is effortless, transparent, and empowering.
                </p>
                <p className="text-[hsl(var(--lavender-light))]/80 text-sm md:text-base leading-relaxed">
                  A future where every borrower can confidently navigate financial choices and unlock opportunities that help them grow, achieve, and succeed.
                </p>
                <p className="text-[hsl(var(--lavender-light))]/70 text-xs md:text-sm italic border-t border-white/10 pt-4">
                  At CreduPe, we're not just connecting borrowers with lenders—we're building a smarter financial ecosystem that works for everyone.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="container py-16">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-primary font-medium mb-2">What You'll Do</p>
          <h2 className="text-3xl font-bold text-foreground">Three Pillars of Impact</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((p) => (
            <motion.div
              key={p.title}
              {...fadeUp}
              className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-xl transition-shadow group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center mx-auto mb-5`}>
                <p.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{p.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="gradient-soft py-16">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-10">
            {/* <p className="text-primary font-medium mb-2">Why CreduPe</p> */}
            <h2 className="text-3xl font-bold text-foreground">Perks & Benefits</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {filteredPerks.map((perk) => (
              <motion.div
                key={perk}
                {...fadeUp}
                className="flex items-center gap-3 bg-card border border-border rounded-xl px-5 py-4"
              >
                <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-foreground font-medium text-sm">{perk}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Statement Section */}
      <section className="pb-20 pt-18 px-6 md:px-12 lg:px-20 bg-background relative overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[hsl(var(--purple-mid))]/5 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto">
          <motion.div
            className="relative rounded-3xl bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] p-8 md:p-16 text-center shadow-2xl overflow-hidden border border-white/10"
            {...fadeUp}
          >
            {/* Visual Grid Lines Pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              {/* Sleek Emblem Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--lavender-light))] animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[hsl(var(--lavender-light))]">
                  CreduPe
                </span>
              </div>

              {/* High-end Slogan Typography */}
              <h3 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none md:leading-tight">
                Smarter Lending. <br className="hidden md:inline" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--lavender-light))] via-white to-[hsl(var(--lavender-light))]">
                  The Deal You Deserve.
                </span>
              </h3>

              {/* Decorative Subtle Accent Divider */}
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto my-4" />

              <p className="text-white/60 text-xs md:text-sm font-medium tracking-widest uppercase">
                Simplifying Financial Journeys. Backed by Excellence.
              </p>
            </div>

            {/* Glowing Corner Accents */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[hsl(var(--lavender))]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          </motion.div>
        </div>
      </section>


      {/* CTA */}
      <section className="gradient-purple-band py-16">
        <div className="container text-center">
          <motion.div {...fadeUp}>
            <Mail className="w-10 h-10 text-primary-foreground mx-auto mb-4 opacity-80" />
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to join us?</h2>
            <p className="text-primary-foreground/70 mb-2 max-w-xl mx-auto">
              For career related information please write to us with your CV and the team will get back to you based on the openings available.
            </p>
            <CareerApplicationModal
              trigger={
                <button className="inline-flex items-center gap-2 mt-6 px-8 py-3 rounded-full bg-primary-foreground text-primary font-semibold hover:opacity-90 transition-opacity">
                  <Mail className="w-4 h-4" />
                  Apply Now — careers@credupe.com
                </button>
              }
            />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;
