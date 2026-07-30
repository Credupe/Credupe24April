import { motion } from "framer-motion";
import { ArrowRight, User, GraduationCap, Home, Building, Car, CarFront, Bike, Coins, Briefcase, CreditCard } from "lucide-react";
import { useUIConfigStore } from "@/stores/uiConfigStore";

const products = [
  { icon: GraduationCap, title: "Education Loan", desc: "Fund your dreams with education loans up to ₹75 lakhs at low rates", highlight: true },
  { icon: User, title: "Personal Loan", desc: "Quick personal loans starting at 10.49% p.a. with minimal documentation", highlight: false },
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
  const { config } = useUIConfigStore();

  const filteredProducts = products.filter((p) => {
    if (p.title === "Car Loan" && config.sections?.hideProductCarLoan) return false;
    if (p.title === "Used Car Loan" && config.sections?.hideProductUsedCarLoan) return false;
    if (p.title === "Two Wheeler Loan" && config.sections?.hideProductTwoWheelerLoan) return false;
    if (p.title === "Gold Loan" && config.sections?.hideProductGoldLoan) return false;
    if (p.title === "Business Loan" && config.sections?.hideProductBusinessLoan) return false;
    if (p.title === "Micro Loan" && config.sections?.hideProductMicroLoan) return false;
    if (p.title === "Home Loan" && config.navbar?.hideHomeLoan) return false;
    if (p.title === "Loan Against Property" && config.navbar?.hideLoanAgainstProperty) return false;
    return true;
  });

  return (
    <section className="py-16 bg-purple-soft">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Choose the best for your <span className="text-gradient">credit requirements</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">Compare a wide range of loan offers from top lenders, tailored for you.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {filteredProducts.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: p.highlight 
                  ? "0 20px 40px -15px rgba(109, 40, 217, 0.6)" 
                  : "0 20px 35px -15px rgba(139, 92, 246, 0.2)"
              }}
              whileTap={{ scale: 0.98 }}
              className={`w-[calc(50%-8px)] sm:w-[260px] lg:w-[460px] min-h-[220px] sm:min-h-[250px] lg:min-h-[180px] flex flex-col justify-between flex-shrink-0 flex-grow-0 rounded-2xl p-6 sm:p-7 border transition-all duration-300 group cursor-pointer ${p.highlight
                ? "bg-purple-deep text-primary-foreground border-purple-deep/80 hover:bg-purple-deep/95"
                : "bg-card border-border hover:border-purple-deep/40"
                }`}
            >
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start flex-grow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${p.highlight ? "bg-primary-foreground/20 group-hover:bg-primary-foreground/30" : "bg-accent group-hover:bg-purple-deep/10"
                  }`}>
                  <p.icon className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${p.highlight ? "text-primary-foreground" : "text-purple-deep"}`} />
                </div>
                <div className="flex-grow flex flex-col justify-between self-stretch">
                  <div>
                    <h3 className={`text-base sm:text-lg font-bold leading-tight ${p.highlight ? "text-primary-foreground" : "text-foreground"}`}>{p.title}</h3>
                    <p className={`mt-2 text-xs sm:text-sm leading-relaxed line-clamp-3 ${p.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{p.desc}</p>
                  </div>
                  <div className="mt-4 hidden lg:block">
                    <button className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold ${p.highlight ? "text-purple-light" : "text-purple-mid"
                      }`}>
                      Apply Now <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 lg:hidden">
                <button className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold ${p.highlight ? "text-purple-light" : "text-purple-mid"
                  }`}>
                  Apply Now <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCardsSection;
