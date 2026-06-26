import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
const searchIllustration = "/assets/search-illustration.png";
const searchablePages = [
  { label: "Personal Loan", href: "/personal-loan", category: "Loans" },
  { label: "Home Loan", href: "/home-loan", category: "Loans" },
  { label: "Education Loan", href: "/education-loan", category: "Loans" },
  { label: "Business Loan", href: "/business-loan", category: "Loans" },
  { label: "Car Loan", href: "/car-loan", category: "Loans" },
  { label: "Used Car Loan", href: "/used-car-loan", category: "Loans" },
  { label: "Two Wheeler Loan", href: "/two-wheeler-loan", category: "Loans" },
  { label: "Gold Loan", href: "/gold-loan", category: "Loans" },
  { label: "Loan Against Property", href: "/loan-against-property", category: "Loans" },
  { label: "Micro Loan", href: "/micro-loan", category: "Loans" },
  { label: "Credit Cards", href: "/credit-cards", category: "Cards" },
  { label: "Credit Score", href: "/credit-score", category: "Credit" },
  { label: "Calculators", href: "/calculators", category: "Tools" },
  { label: "About Us", href: "/about-us", category: "Company" },
  { label: "Contact Us", href: "/contact-us", category: "Company" },
  { label: "Personal Loan EMI Calculator", href: "/calculator/personal-loan-emi-calculator", category: "Tools" },
  { label: "Home Loan EMI Calculator", href: "/calculator/home-loan-emi-calculator", category: "Tools" },
  { label: "Business Loan EMI Calculator", href: "/calculator/business-loan-emi-calculator", category: "Tools" },
];

const quickLinks = [
  { label: "Personal Loan", href: "/personal-loan" },
  { label: "Credit Score", href: "/credit-score" },
  { label: "EMI Calculator", href: "/calculators" },
  { label: "Credit Cards", href: "/credit-cards" },
  { label: "Home Loan", href: "/home-loan" },
];

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onOpenChange(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onOpenChange]);

  const filtered = query.length > 0
    ? searchablePages.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelect = (href: string) => {
    navigate(href);
    onOpenChange(false);
    setQuery("");
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onOpenChange(false);
      }}
    >
      <div className="max-w-2xl mx-auto px-6 pt-20 md:pt-32">
        {/* Close hint */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => onOpenChange(false)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded-lg border border-border"
          >
            ESC
          </button>
        </div>

        {/* Search input — Apple style */}
        <div className="flex items-center gap-3 border-b-2 border-border pb-4 mb-8">
          <Search className="w-6 h-6 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search CreduPe"
            className="flex-1 bg-transparent text-2xl md:text-3xl font-medium text-foreground placeholder:text-muted-foreground/50 outline-none"
          />
        </div>

        {/* Results or Quick Links */}
        {query.length === 0 && (
          <div className="flex justify-center mb-6">
            <img src={searchIllustration} alt="Search" className="w-40 h-40 opacity-60" loading="lazy" width={160} height={160} />
          </div>
        )}
        {query.length > 0 ? (
          <div className="space-y-1 max-h-[50vh] overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((page) => (
                <button
                  key={page.href}
                  onClick={() => handleSelect(page.href)}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left hover:bg-accent transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-base font-medium text-foreground">{page.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{page.category}</span>
                </button>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No results found for "{query}"
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-4">Quick Links</p>
            <div className="space-y-1">
              {quickLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleSelect(link.href)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-accent transition-colors group"
                >
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-base font-medium text-foreground">{link.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDialog;
