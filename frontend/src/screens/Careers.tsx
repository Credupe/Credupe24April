import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Briefcase, Code, Rocket, Headphones, Mail, ArrowRight } from "lucide-react";
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
  "Work with 80+ banking partners",
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const Careers = () => {
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
            <p className="text-primary font-medium mb-2">Why CreduPe</p>
            <h2 className="text-3xl font-bold text-foreground">Perks & Benefits</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {perks.map((perk) => (
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
