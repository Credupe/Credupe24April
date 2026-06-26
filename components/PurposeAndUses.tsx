import { Plane, GraduationCap, AlertTriangle, ShoppingBag, Heart, ShieldPlus, Trophy, Gift, Lightbulb, Wallet, Home, PartyPopper } from "lucide-react";

const purposeItems = [
  { title: "Travel", icon: Plane },
  { title: "Education", icon: GraduationCap },
  { title: "Emergency", icon: AlertTriangle },
  { title: "Shopping", icon: ShoppingBag },
  { title: "Wedding", icon: Heart },
  { title: "Maternity", icon: ShieldPlus },
  { title: "Hobbies", icon: Trophy },
  { title: "Occasion", icon: PartyPopper },
  { title: "Gifting", icon: Gift },
  { title: "Opportunity", icon: Lightbulb },
  { title: "Low Salary", icon: Wallet },
  { title: "Home Renovation", icon: Home },
];

const PurposeAndUses = () => {
  return (
    <section className="pb-16">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Purpose And Uses
        </h2>
        <div className="w-12 h-1 bg-amber-400 rounded-full mx-auto mt-2 mb-4" />
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Discover how our personal loans can be tailored to meet your specific needs. Whether you need money for travel, education, emergencies, or any other purpose, find the right loan option to fit your unique situation.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {purposeItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-4 text-left hover:shadow-md hover:border-amber-200 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 shrink-0 group-hover:bg-amber-100 transition-colors">
                <Icon className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-semibold text-foreground">{item.title}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default PurposeAndUses;
