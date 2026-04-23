import { motion } from "framer-motion";
import { ArrowRight, Building2, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

const BecomePartner = () => {
  return (
    <section className="py-10 md:py-14">
      <div className="bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] rounded-2xl p-8 md:p-12 text-primary-foreground">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Become Our Partner
            </h2>
            <p className="mt-3 text-primary-foreground/80 text-sm md:text-base leading-relaxed">
              Join India's fastest-growing fintech ecosystem. Access premium leads, earn competitive commissions, and grow your business with CreduPe.
            </p>
            <Link
              to="/partner-gateway"
              className="inline-flex items-center gap-2 mt-6 px-7 py-3 rounded-full bg-white text-[hsl(var(--purple-deep))] font-semibold text-sm hover:bg-white/90 transition-colors"
            >
              Join Us <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              { icon: Building2, label: "500+", sub: "Partner Network" },
              { icon: TrendingUp, label: "₹200Cr+", sub: "Disbursed Monthly" },
              { icon: Users, label: "50K+", sub: "Leads Generated" },
            ].map((stat) => (
              <div key={stat.sub} className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-white/80" />
                <p className="text-xl font-bold">{stat.label}</p>
                <p className="text-xs text-white/70 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BecomePartner;
