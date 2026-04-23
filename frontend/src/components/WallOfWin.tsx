import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Rajesh K.", role: "Home Loan Customer", text: "Got my home loan approved in just 3 days. The process was seamless and transparent.", rating: 5 },
  { name: "Priya S.", role: "Personal Loan Customer", text: "Best interest rates I found anywhere. CreduPe made comparison so easy.", rating: 5 },
  { name: "Amit D.", role: "Business Loan Customer", text: "My business loan was disbursed within a week. Exceptional support throughout.", rating: 5 },
  { name: "Sneha M.", role: "Credit Card Customer", text: "Found the perfect credit card for my needs. The recommendations were spot on.", rating: 4 },
  { name: "Vikram P.", role: "Education Loan Customer", text: "Funded my daughter's overseas education with the best rates available.", rating: 5 },
  { name: "Anita R.", role: "Car Loan Customer", text: "Drove my dream car home thanks to CreduPe's quick car loan process.", rating: 5 },
];

const WallOfWin = () => {
  return (
    <section className="py-10 md:py-14">
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold tracking-wide uppercase mb-3">
          Wall of Win
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Trusted by <span className="text-primary">Thousands</span>
        </h2>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm">
          Real stories from real customers who found their perfect financial products through CreduPe.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
            <div>
              <p className="text-sm font-semibold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WallOfWin;
