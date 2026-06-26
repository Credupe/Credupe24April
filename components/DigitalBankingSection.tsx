import { motion } from "framer-motion";
import { Zap, Shield, Globe, CreditCard } from "lucide-react";

const features = [
  { icon: Zap, title: "Instant Approvals", desc: "Get your credit limit sanctioned in seconds from top lenders." },
  { icon: Shield, title: "Secure Financing", desc: "Bank-grade encryption protecting your data and loan applications." },
  { icon: Globe, title: "Total Flexibility", desc: "Access personalized loan offers 24/7, wherever you are." },
  { icon: CreditCard, title: "One-Stop Credit", desc: "Quick, easy, and hassle-free solutions for all your financial needs." },
];

const DigitalBankingSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="pill-tag bg-accent text-primary border border-border mb-4">
            ✦ Empowering Your Financial Journey
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4">
            The best of <span className="text-gradient">digital lending</span> is now here
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Everything you need for a smarter financial life, built with cutting-edge technology.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <f.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DigitalBankingSection;
