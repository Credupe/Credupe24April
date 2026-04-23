import { motion } from "framer-motion";
import { QrCode, Banknote, Receipt, Repeat, ArrowRight } from "lucide-react";

const payments = [
  { icon: QrCode, title: "Scan & Pay", desc: "Pay instantly with QR codes at any merchant" },
  { icon: Banknote, title: "Bill Payments", desc: "Pay electricity, water, gas, broadband & more" },
  { icon: Receipt, title: "Recharges", desc: "Mobile, DTH, and data card recharges in seconds" },
  { icon: Repeat, title: "Auto-Pay", desc: "Set up recurring payments for subscriptions & EMIs" },
];

const investments = [
  { title: "Mutual Funds", desc: "Start SIP from ₹500/month" },
  { title: "Digital Gold", desc: "Buy 24K gold from ₹1" },
  { title: "Insurance", desc: "Life & health cover in minutes" },
];

const PaymentsSection = () => {
  return (
    <section className="py-20 bg-purple-soft">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Payments made <span className="text-gradient">effortless</span>
            </h2>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {payments.map((p) => (
                <div key={p.title} className="bg-card rounded-2xl p-5 border border-border hover:border-primary/30 hover:shadow-sm transition-all">
                  <p.icon className="w-7 h-7 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground text-sm">{p.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Spending made <span className="text-gradient">rewarding</span>
            </h2>
            <div className="mt-8 space-y-4">
              {investments.map((inv) => (
                <div key={inv.title} className="bg-card rounded-2xl p-5 border border-border hover:border-primary/30 hover:shadow-sm transition-all flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{inv.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{inv.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PaymentsSection;
