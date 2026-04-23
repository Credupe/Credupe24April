import { useState } from "react";
import { Menu, X, Search, ChevronDown, CreditCard, Briefcase, BarChart3, Building2, Store, Mail, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SearchDialog from "@/components/SearchDialog";
import ThemeToggle from "@/components/ThemeToggle";
const icon = "/assets/credupe-icon.jpg";
const navItems = [
  { label: "Loans", hasDropdown: true, icon: Briefcase, dropdownItems: [{ label: "Personal Loan", href: "/personal-loan" }, { label: "Education Loan", href: "/education-loan" }, { label: "Home Loan", href: "/home-loan" }, { label: "Loan Against Property", href: "/loan-against-property" }, { label: "Car Loan", href: "/car-loan" }, { label: "Used Car Loan", href: "/used-car-loan" }, { label: "Two Wheeler Loan", href: "/two-wheeler-loan" }, { label: "Gold Loan", href: "/gold-loan" }] },
  { label: "Business Loans", hasDropdown: true, icon: Store, dropdownItems: [{ label: "Business Loan", href: "/business-loan" }, { label: "Micro Loan", href: "/micro-loan" }] },
  { label: "Credit Cards", hasDropdown: true, icon: CreditCard, dropdownItems: [{ label: "Credit Cards", href: "/credit-cards" }] },
  { label: "Credit Score", hasDropdown: false, icon: BarChart3, href: "/credit-score" },
  { label: "Calculators", hasDropdown: false, icon: Building2, href: "/calculators" },
  { label: "Partner Login", hasDropdown: false, icon: Briefcase, href: "/partner-gateway" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="border-b border-border/50 bg-gradient-to-r from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] text-primary-foreground">
          <div className="container flex h-9 items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              <a href="mailto:contact@credupe.com" className="hover:underline font-medium">contact@credupe.com</a>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <Link to="/about-us" className="hover:underline font-medium">About Us</Link>
              <Link to="/careers" className="hover:underline font-medium">Careers</Link>
              <Link to="/contact-us" className="hover:underline font-medium">Contact Us</Link>
            </div>
          </div>
        </div>

        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex flex-col items-center shrink-0 py-1">
            <img src={icon} alt="CreduPe" className="h-9 w-auto object-contain" />
            <span className="text-[10px] font-bold tracking-wide text-foreground leading-none">CreduPe</span>
          </Link>

          <nav className="hidden xl:flex items-center gap-0.5 mx-4">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && item.dropdownItems ? setOpenDropdown(item.label) : undefined}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.href ? (
                  <Link
                    to={item.href}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors whitespace-nowrap"
                  >
                    {item.label}
                    {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
                {openDropdown === item.label && item.dropdownItems && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-card border border-border rounded-xl shadow-lg py-1.5 z-50">
                    {item.dropdownItems.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.href}
                        className="block px-5 py-3 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-150 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setSearchOpen(true)} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Search className="w-4 h-4 text-muted-foreground" />
            </button>

            <ThemeToggle className="hidden sm:inline-flex" />

            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span className="text-foreground font-medium max-w-[120px] truncate">{user.email?.split("@")[0]}</span>
                </div>
                <button
                  onClick={signOut}
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login?mode=signup")}
                  className="hidden sm:inline-flex px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="hidden sm:inline-flex px-4 py-1.5 rounded-full border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
                >
                  Login
                </button>
              </>
            )}
            <button className="xl:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="xl:hidden border-t border-border bg-background p-4 space-y-1 max-h-[70vh] overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label}>
                  <button
                    className="flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    {item.label}
                  </button>
                  {item.dropdownItems && (
                    <div className="ml-11 space-y-0.5">
                      {item.dropdownItems.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.href}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="flex gap-2 pt-3">
              {user ? (
                <button onClick={signOut} className="flex-1 px-4 py-2.5 rounded-full border border-border text-foreground text-sm font-medium">
                  Logout
                </button>
              ) : (
                <>
                  <button onClick={() => navigate("/login?mode=signup")} className="flex-1 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    Get Started
                  </button>
                  <button onClick={() => navigate("/login")} className="flex-1 px-4 py-2.5 rounded-full border border-border text-foreground text-sm font-medium">
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
