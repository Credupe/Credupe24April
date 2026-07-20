import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useUIConfigStore } from "@/stores/uiConfigStore";
import { useTheme } from "@/components/ThemeProvider";

const lightIcon = "/assets/credupe-icon.png";
const darkIcon = "/assets/credupe-icon-darkmode.png";
const footerLinks = {
  "Products": [
    { label: "Education Loan", href: "/education-loan" },
    { label: "Personal Loan", href: "/personal-loan" },
    { label: "Home Loan", href: "/home-loan" },
    { label: "Loan Against Property", href: "/loan-against-property" },
    { label: "Business Loan", href: "/business-loan" },
    { label: "Credit Cards", href: "/credit-cards" },
    { label: "Gold Loan", href: "/gold-loan" },
  ],
  "Quick Links": [
    { label: "Credit Score", href: "/credit-score" },
    { label: "EMI Calculators", href: "/calculators" },
    { label: "Car Loan", href: "/car-loan" },
    { label: "Two Wheeler Loan", href: "/two-wheeler-loan" },
  ],
  "Company": [
    { label: "About Us", href: "/about-us" },
    { label: "Careers", href: "/careers" },
    { label: "Contact Us", href: "/contact-us" },
  ],
  "Legal": [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
  ],
};

const Footer = () => {
  const { config } = useUIConfigStore();
  const { theme } = useTheme();

  return (
    <footer className="bg-background border-t border-border">
      <div className="container py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={theme === "dark" ? darkIcon : lightIcon} alt="CreduPe" className="h-9 w-auto object-contain" />
              <span className="font-bold text-lg text-foreground">CreduPe</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your trusted digital financial marketplace connecting you with the best lending partners.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <a href="mailto:contact@credupe.com" className="hover:text-foreground transition-colors">contact@credupe.com</a>
            </div>
            <div className="flex gap-2 mt-5">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-accent transition-colors">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {!config.sections?.hideAllFooterLinks && Object.entries(footerLinks).map(([title, links]) => {
            const filteredLinks = links.filter((link) => {
              if (link.label === "Car Loan" && config.sections?.hideFooterCarLoan) return false;
              if (link.label === "Two Wheeler Loan" && config.sections?.hideFooterTwoWheelerLoan) return false;
              if (link.label === "Business Loan" && config.sections?.hideFooterBusinessLoan) return false;
              if (link.label === "Gold Loan" && config.sections?.hideFooterGoldLoan) return false;
              if (link.label === "Credit Cards" && config.sections?.hideFooterCreditCard) return false;
              if (link.label === "Home Loan" && config.navbar?.hideHomeLoan) return false;
              if (link.label === "Loan Against Property" && config.navbar?.hideLoanAgainstProperty) return false;
              return true;
            });

            if (filteredLinks.length === 0) return null;

            return (
              <div key={title}>
                <h4 className="font-semibold text-sm mb-4 text-foreground">{title}</h4>
                <ul className="space-y-2.5">
                  {filteredLinks.map((link) => (
                    <li key={link.label}>
                      <Link to={link.href} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-5 rounded-xl bg-muted/50 border border-border">
          <h4 className="text-xs font-semibold text-foreground mb-2">Disclaimer</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            CreduPe is a digital financial marketplace and not a lender, bank, or NBFC. All loan products, credit cards, and financial services displayed on this platform are offered by third-party lending partners and financial institutions. Interest rates, terms, fees, and eligibility criteria are determined solely by the respective lending partner. Applying for financial products may involve a credit inquiry by the lender, which could impact your credit score. CreduPe does not guarantee approval of any application. Users are advised to read all terms and conditions of the financial product before proceeding. By using this platform, you consent to sharing your information with our lending partners as outlined in our <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs">
            © 2026 CreduPe. All rights reserved.
          </p>
          {!config.sections?.hideFooterBottomLinks && (
            <div className="flex items-center gap-4 text-xs">
              <Link to="/terms-and-conditions" className="text-muted-foreground hover:text-foreground transition-colors">Terms & Conditions</Link>
              <span className="text-border">|</span>
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <span className="text-border">|</span>
              <Link to="/contact-us" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
