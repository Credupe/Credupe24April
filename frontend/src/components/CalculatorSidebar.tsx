import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calculator, ChevronRight, Home, Car, Briefcase, Coins, Bike,
  Building2, FileText, CreditCard, Landmark, Tractor
} from "lucide-react";

const emiCalculators = [
  { name: "Personal Loan EMI Calculator", icon: CreditCard, href: "/calculator/personal-loan-emi-calculator" },
  { name: "Home Loan EMI Calculator", icon: Home, href: "/calculator/home-loan-emi-calculator" },
  { name: "Business Loan EMI Calculator", icon: Briefcase, href: "/calculator/business-loan-emi-calculator" },
  { name: "Gold Loan EMI Calculator", icon: Coins, href: "/calculator/gold-loan-emi-calculator" },
  { name: "Two Wheeler Loan EMI Calculator", icon: Bike, href: "/calculator/two-wheeler-loan-emi-calculator" },
  { name: "Loan Against Property EMI Calculator", icon: Building2, href: "/calculator/loan-against-property-emi-calculator" },
  { name: "Car Loan EMI Calculator", icon: Car, href: "/calculator/car-loan-emi-calculator" },
  { name: "Term Loan EMI Calculator", icon: FileText, href: "/calculator/term-loan-emi-calculator" },
  { name: "Tractor Loan EMI Calculator", icon: Tractor, href: "/calculator/tractor-loan-emi-calculator" },
  { name: "Mudra Loan EMI Calculator", icon: Landmark, href: "/calculator/mudra-loan-emi-calculator" },
];

const eligibilityCalculators = [
  { name: "Personal Loan Eligibility Calculator", icon: CreditCard, href: "/calculator/personal-loan-eligibility-calculator" },
  { name: "Home Loan Eligibility Calculator", icon: Home, href: "/calculator/home-loan-eligibility-calculator" },
  { name: "Home Loan Prepayment Calculator", icon: Home, href: "/calculator/home-loan-prepayment-calculator" },
  { name: "Personal Loan Prepayment Calculator", icon: CreditCard, href: "/calculator/personal-loan-prepayment-calculator" },
];

type SidebarTab = "emi" | "eligibility";

interface CalculatorSidebarProps {
  activeSlug?: string;
}

const CalculatorSidebar = ({ activeSlug }: CalculatorSidebarProps) => {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("emi");
  const sidebarItems = sidebarTab === "emi" ? emiCalculators : eligibilityCalculators;

  return (
    <aside className="bg-card border border-border rounded-2xl p-5 h-fit sticky top-24">
      <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
        <Calculator className="w-4 h-4 text-primary" />
        Quick Navigation
      </h3>

      <div className="flex gap-1 mb-4 bg-accent/50 rounded-lg p-1">
        <button
          onClick={() => setSidebarTab("emi")}
          className={`flex-1 text-xs font-medium py-2 rounded-md transition-colors ${sidebarTab === "emi" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          EMI Calculators
        </button>
        <button
          onClick={() => setSidebarTab("eligibility")}
          className={`flex-1 text-xs font-medium py-2 rounded-md transition-colors ${sidebarTab === "eligibility" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Eligibility & More
        </button>
      </div>

      <div className="space-y-0.5">
        {sidebarItems.map((c) => {
          const Icon = c.icon;
          const isActive = activeSlug && c.href.includes(activeSlug);
          return (
            <Link
              key={c.name}
              to={c.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors group ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-accent/50 hover:text-primary"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
              <span className="text-xs leading-tight">{c.name}</span>
              <ChevronRight className={`w-3 h-3 ml-auto flex-shrink-0 transition-opacity ${isActive ? "text-primary opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100"}`} />
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default CalculatorSidebar;
