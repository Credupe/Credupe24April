import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
const cardBlue = "/assets/cards/card-blue.jpeg";
const cardPurple = "/assets/cards/card-purple.jpeg";
const cardPlatinum = "/assets/cards/card-platinum.png";
const cards = [
  { image: cardBlue, alt: "Premium Blue Credit Card" },
  { image: cardPlatinum, alt: "Premium Platinum Credit Card" },
  { image: cardPurple, alt: "Premium Purple Credit Card" },
];

const CreditCardBanner = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="pill-tag bg-accent text-primary border border-border mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Featured Cards
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4">
            Elevate your spending with <span className="text-gradient">Smart Credit Cards</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Choose from our range of premium credit cards designed for every lifestyle.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.alt}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group flex items-center justify-center"
            >
              <div className="w-full aspect-[16/10] max-w-[360px] rounded-2xl overflow-hidden bg-muted/30 drop-shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <motion.img
                  src={card.image}
                  alt={card.alt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  whileHover={{ rotateY: 6, rotateX: -4 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CreditCardBanner;
