import { Monitor, HandCoins, FileText, Clock, Zap, BadgePercent } from "lucide-react";

const features = [
  { title: "100% online process", description: "Apply from anywhere, anytime", icon: Monitor },
  { title: "Loans from ₹6,000 to ₹10 Lakhs", description: "Flexible loan amounts for every need", icon: HandCoins },
  { title: "Hassle-free documentation", description: "Minimal paperwork required", icon: FileText },
  { title: "Available 24x7", description: "Round the clock service", icon: Clock },
  { title: "Loan disbursal in minutes", description: "Quick fund transfer to your account", icon: Zap },
  { title: "Interest rates from 10.49% p.a.", description: "Competitive rates for all profiles", icon: BadgePercent },
];

const FeaturesAndBenefits = () => {
  return (
    <section className="pb-16">
      <div className="bg-[hsl(var(--purple-deep))] rounded-2xl p-8 md:p-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
          Features And Benefits
        </h2>
        <div className="w-12 h-1 bg-primary mx-auto rounded-full mb-4" />
        <p className="text-white/70 text-sm md:text-base text-center max-w-3xl mx-auto mb-10">
          Discover the best features designed to provide a smooth and hassle-free experience when applying for the best personal loans. With our fully online process, competitive interest rates, and quick disbursal options, securing the funds you need has never been easier.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{f.title}</h3>
                  <p className="text-xs text-white/60 mt-0.5">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesAndBenefits;
