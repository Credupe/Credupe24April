import { motion } from "framer-motion";
import { ArrowRight, User, GraduationCap, Home, Building, Car, CarFront, Bike, Coins, Briefcase, CreditCard } from "lucide-react";

const products = [
  { icon: User, title: "Personal Loan", desc: "Quick personal loans starting at 10.49% p.a. with minimal documentation", highlight: true },
  { icon: GraduationCap, title: "Education Loan", desc: "Fund your dreams with education loans up to ₹75 lakhs at low rates", highlight: false },
  { icon: Home, title: "Home Loan", desc: "Affordable home loans starting at 8.5% p.a. with quick approval", highlight: false },
  { icon: Building, title: "Loan Against Property", desc: "Unlock your property's value with loans up to ₹10 crore", highlight: false },
  { icon: Car, title: "Car Loan", desc: "Drive your dream car with loans at competitive rates from top lenders", highlight: false },
  { icon: CarFront, title: "Used Car Loan", desc: "Affordable financing for pre-owned cars with flexible EMI options", highlight: true },
  { icon: Bike, title: "Two Wheeler Loan", desc: "Easy two-wheeler financing starting at 8.5% p.a. with fast disbursal", highlight: false },
  { icon: Coins, title: "Gold Loan", desc: "Instant gold loans at attractive rates with minimal paperwork", highlight: false },
  { icon: Briefcase, title: "Business Loan", desc: "Grow your business with loans up to ₹50 lakhs, no collateral needed", highlight: false },
  { icon: CreditCard, title: "Micro Loan", desc: "Small-ticket loans up to ₹1 lakh with instant approval & easy repayment", highlight: false },
];

const ProductCardsSection = () => {
  return (
    <section className="py-16 bg-purple-soft">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Choose the best for your <span className="text-gradient">credit requirements</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">Compare a wide range of loan offers from top lenders, tailored for you.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {products.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl p-4 border transition-all group cursor-pointer hover:shadow-md ${
                p.highlight
                  ? "bg-purple-deep text-primary-foreground border-purple-deep/80 hover:bg-purple-deep/90"
                  : "bg-card border-border hover:border-purple-deep/40"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                p.highlight ? "bg-primary-foreground/20" : "bg-accent group-hover:bg-purple-deep/10"
              }`}>
                <p.icon className={`w-4 h-4 ${p.highlight ? "text-primary-foreground" : "text-purple-deep"}`} />
              </div>
              <h3 className={`mt-2.5 text-sm font-semibold leading-tight ${p.highlight ? "text-primary-foreground" : "text-foreground"}`}>{p.title}</h3>
              <p className={`mt-1 text-[11px] leading-snug line-clamp-2 ${p.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{p.desc}</p>
              <button className={`mt-2.5 inline-flex items-center gap-1 text-xs font-semibold hover:gap-2 transition-all ${
                p.highlight ? "text-purple-light" : "text-purple-mid"
              }`}>
                Apply Now <ArrowRight className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCardsSection;
