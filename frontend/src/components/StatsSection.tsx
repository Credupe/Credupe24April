import { motion } from "framer-motion";
import { Users, MapPin, TrendingUp, ArrowRight } from "lucide-react";

const stats = [
  { icon: Users, value: "2,950+", label: "Branches Pan India" },
  { icon: MapPin, value: "1000+", label: "Cities & Towns Covered" },
  { icon: TrendingUp, value: "3.27Cr+", label: "Happy Customers" },
];

const StatsSection = () => {
  return (
    <section className="py-20 gradient-purple-band">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-background">
            Ready to elevate your lifestyle?
          </h2>
          <p className="mt-3 text-background/60 max-w-lg mx-auto">
            Our growth is a reflection of the trust you place in us
          </p>
          <button className="mt-6 px-7 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <s.icon className="w-7 h-7 text-background/50 mx-auto mb-3" />
              <p className="text-3xl md:text-4xl font-bold text-background">{s.value}</p>
              <p className="text-background/50 text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
