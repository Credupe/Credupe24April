import { IndianRupee } from "lucide-react";

const amountItems = [
  { title: "₹50,000" },
  { title: "₹1 Lakh" },
  { title: "₹2 Lakh" },
  { title: "₹3 Lakh" },
  { title: "₹5 Lakh" },
  { title: "₹7 Lakh" },
  { title: "₹10 Lakh" },
  { title: "₹15 Lakh" },
  { title: "₹20 Lakh" },
  { title: "₹25 Lakh" },
  { title: "₹30 Lakh" },
  { title: "₹50 Lakh" },
];

const LoanByAmount = () => {
  return (
    <div>
      <h3 className="text-lg font-bold text-foreground mb-1">By Amount</h3>
      <div className="w-10 h-1 bg-amber-400 rounded-full mb-4" />
      <div className="grid grid-cols-2 gap-3">
        {amountItems.map((item) => (
          <button
            key={item.title}
            className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left hover:shadow-md hover:border-amber-200 transition-all duration-300"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50 shrink-0 group-hover:bg-amber-100 transition-colors">
              <IndianRupee className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-sm font-semibold text-foreground">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LoanByAmount;
