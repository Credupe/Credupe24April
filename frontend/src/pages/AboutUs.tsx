import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Target, Eye, Users, Award, TrendingUp, Shield, Heart, Zap, Sparkles, Building2, BarChart3, PiggyBank } from "lucide-react";
const aboutUsIllustration = "/assets/about-us-illustration.png";
const stats = [
  { value: "10M+", label: "Users Served" },
  { value: "80+", label: "Banking Partners" },
  { value: "₹50,000Cr+", label: "Loans Disbursed" },
  { value: "4.8★", label: "App Rating" },
];

const values = [
  { icon: Shield, title: "Trust & Transparency", desc: "We believe in honest, clear communication with zero hidden charges or surprises." },
  { icon: Heart, title: "Customer First", desc: "Every decision we make starts with how it benefits our users and their financial journey." },
  { icon: Zap, title: "Innovation", desc: "We leverage cutting-edge technology to simplify complex financial processes." },
  { icon: TrendingUp, title: "Empowerment", desc: "We empower millions of Indians to make smarter financial decisions with data-driven insights." },
];

const team = [
  { name: "Rahul Sharma", role: "Co-Founder & CEO", desc: "Former VP at HDFC Bank with 15+ years in financial services." },
  { name: "Priya Mehta", role: "Co-Founder & CTO", desc: "Ex-Google engineer with deep expertise in fintech infrastructure." },
  { name: "Amit Patel", role: "Chief Product Officer", desc: "Built products at Paytm & PhonePe reaching 100M+ users." },
  { name: "Sneha Kapoor", role: "Head of Partnerships", desc: "Managed partnerships across 50+ banks and NBFCs in India." },
];

const advisors = [
  { name: "Vikram Iyer", role: "Managing Director", org: "Peak Capital Partners" },
  { name: "Deepa Nair", role: "Former CEO", org: "ICICI Securities" },
  { name: "Rajesh Kumar", role: "Chief Strategy Officer", org: "Bajaj Finserv" },
  { name: "Anita Desai", role: "Partner", org: "Sequoia Capital India" },
];

const investors = ["Sequoia Capital", "Tiger Global", "Peak XV Partners", "Ribbit Capital", "Matrix Partners"];

const pressFeatures = [
  { name: "Economic Times", quote: "Revolutionizing how India accesses credit" },
  { name: "Mint", quote: "India's most trusted loan marketplace" },
  { name: "TechCrunch", quote: "Democratizing financial services for the masses" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-10 md:py-16 px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] p-8 md:p-12 text-[hsl(var(--primary-foreground))]"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[hsl(var(--lavender-light))] font-medium mb-2">About CreduPe</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Your Trusted Partner in <span className="text-[hsl(var(--lavender-light))]">Financial Growth</span>
              </h1>
              <p className="text-sm md:text-base opacity-90 mb-6 leading-relaxed max-w-lg">
                From comparing loan offers across 80+ banks to checking your credit score for free — CreduPe is India's most trusted platform for loans, credit cards, and investments.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <Shield className="w-4 h-4" />
                  <span>10M+ Users Served</span>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <Building2 className="w-4 h-4" />
                  <span>80+ Banking Partners</span>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <Sparkles className="w-4 h-4" />
                  <span>₹50,000Cr+ Disbursed</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={aboutUsIllustration}
                alt="CreduPe team empowering financial growth"
                width={800}
                height={600}
                className="w-full max-w-sm md:max-w-md rounded-xl"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <motion.div key={s.label} {...fadeUp} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container py-16">
        <div className="grid md:grid-cols-2 gap-10">
          <motion.div {...fadeUp} className="bg-card border border-border rounded-2xl p-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To democratize access to financial products by providing a transparent, technology-driven marketplace where every Indian can compare, choose, and apply for the best loans, credit cards, and investment options — all in one place.
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="bg-card border border-border rounded-2xl p-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              To become India's most trusted financial platform — a one-stop destination for all financial needs, empowering 100 million+ Indians to achieve their financial goals by 2030. We envision a future where financial literacy and access are universal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="gradient-soft py-16">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-primary font-medium mb-2">What Drives Us</p>
            <h2 className="text-3xl font-bold text-foreground">Our Core Values</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <motion.div key={v.title} {...fadeUp} className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="container py-16">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-primary font-medium mb-2">Our Founders</p>
          <h2 className="text-3xl font-bold text-foreground">Shaping CreduPe</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((m) => (
            <motion.div key={m.name} {...fadeUp} className="text-center">
              <div className="w-32 h-32 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-12 h-12 text-primary/40" />
              </div>
              <h3 className="font-semibold text-foreground">{m.name}</h3>
              <p className="text-sm text-primary font-medium">{m.role}</p>
              <p className="text-xs text-muted-foreground mt-2">{m.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <p className="text-muted-foreground mb-4">Build your career at CreduPe.</p>
          <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            Join Us
          </button>
        </div>
      </section>

      {/* Advisors */}
      <section className="border-t border-border py-16">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-primary font-medium mb-2">Our Advisors</p>
            <h2 className="text-3xl font-bold text-foreground">Supporting Us</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {advisors.map((a) => (
              <motion.div key={a.name} {...fadeUp} className="bg-card border border-border rounded-2xl p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-8 h-8 text-primary/40" />
                </div>
                <h3 className="font-semibold text-foreground">{a.name}</h3>
                <p className="text-sm text-primary">{a.role}</p>
                <p className="text-xs text-muted-foreground">{a.org}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investors */}
      <section className="gradient-soft py-16">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-10">
            <p className="text-primary font-medium mb-2">Our Investors</p>
            <h2 className="text-3xl font-bold text-foreground">Backed By The Best</h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-6">
            {investors.map((inv) => (
              <motion.div key={inv} {...fadeUp} className="bg-card border border-border rounded-xl px-8 py-5 text-center min-w-[180px]">
                <span className="font-bold text-foreground text-lg">{inv}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="container py-16">
        <motion.div {...fadeUp} className="text-center mb-10">
          <p className="text-primary font-medium mb-2">Featured</p>
          <h2 className="text-3xl font-bold text-foreground">In The Press</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {pressFeatures.map((p) => (
            <motion.div key={p.name} {...fadeUp} className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-foreground mb-3">{p.name}</h3>
              <p className="text-muted-foreground italic">"{p.quote}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-purple-band py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to start your financial journey?</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
            Join millions of Indians who trust CreduPe to find the best financial products.
          </p>
          <button className="px-8 py-3 rounded-full bg-primary-foreground text-primary font-semibold hover:opacity-90 transition-opacity">
            Get Started Today
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
