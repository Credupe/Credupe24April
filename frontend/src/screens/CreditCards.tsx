import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductSidebar from "@/components/ProductSidebar";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useSidebarContent } from "@/hooks/useSidebarContent";
import SidebarContentPanel from "@/components/SidebarContentPanel";
import {
  CreditCard, IndianRupee, FileText, Shield, Zap, Clock, CheckCircle, ChevronRight,
  Building2, TrendingUp, HelpCircle, Award, ArrowRight, BadgePercent,
  Gift, Wallet, ShoppingBag, Plane, Star, Percent, Gem, Users,
  Heart, Fuel, Utensils, Sparkles, Globe, Banknote, Receipt, ExternalLink
} from "lucide-react";
const creditCardHero = "/assets/credit-card-hero.png";
const hdfcDinersBlack = "/assets/cards/hdfc-diners-black.png";
const axisReserve = "/assets/cards/axis-reserve.png";
const axisAtlas = "/assets/cards/axis-atlas.png";
const hdfcRegaliaGold = "/assets/cards/hdfc-regalia-gold.png";
const yesPaisasave = "/assets/cards/yes-paisasave.png";
const sbiCashback = "/assets/cards/sbi-cashback.png";
const amexPlatinum = "/assets/cards/amex-platinum.png";
const axisSelect = "/assets/cards/axis-select.png";
const tataNeuHdfc = "/assets/cards/tata-neu-hdfc.png";
const indianoilRbl = "/assets/cards/indianoil-rbl.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const tabs = [
  "About", "Top Cards", "Types", "Features", "Eligibility", "Documents",
  "How to Apply", "Fees & Charges", "Do's & Don'ts", "FAQ"
];

const topCreditCards = [
  {
    name: "HDFC Diners Club Black Metal Edition",
    image: hdfcDinersBlack,
    rating: "4/5",
    joiningFee: "₹10,000",
    annualFee: "₹10,000",
    highlight1: "Unlimited airport lounge access for primary and add-on members",
    highlight2: "High base rewards rate of 3.33% with 5 reward points per ₹150 spent",
    tags: ["Travel", "Premium", "Rewards"],
    details: [
      "Up to 10X reward points on SmartBuy and 2X on weekend dining with up to 1:1 redemption ratio",
      "Annual memberships of Club Marriott, Amazon and Swiggy One on joining",
      "Low forex markup fee of 2% and renewal of annual complimentary memberships on ₹8 lakh annual spends",
      "10,000 reward points on spending ₹4 lakh or more in a quarter",
      "6 complimentary golf games in a calendar quarter",
    ],
  },
  {
    name: "Axis Bank Reserve Credit Card",
    image: axisReserve,
    rating: "3.5/5",
    joiningFee: "₹50,000",
    annualFee: "₹50,000",
    highlight1: "Unlimited domestic & international lounge visits via Priority Pass",
    highlight2: "Low forex mark-up fee of 1.5% with 2X reward points on international spends",
    tags: ["Travel", "Premium", "Rewards"],
    details: [
      "Up to 30 EDGE reward points for every ₹200 spent",
      "B1G1 offer on BookMyShow tickets with up to 5 offer tickets per month",
      "ITC Culinaire, Accorplus, Club Marriott & EazyDiner Prime memberships",
      "50 free golf rounds every year across select golf courses in India",
    ],
  },
  {
    name: "Axis Atlas Credit Card",
    image: axisAtlas,
    rating: "4/5",
    joiningFee: "₹5,000",
    annualFee: "₹5,000",
    highlight1: "2.5X EDGE Miles on Travel spends",
    highlight2: "Up to 12 international and 18 domestic lounge access every year",
    tags: ["Travel", "Lounge Access", "Rewards"],
    details: [
      "Up to 2,500 bonus EDGE Miles as welcome benefit",
      "Up to 5 EDGE Miles per ₹100 spent on travel",
      "Redeem EDGE Miles at value of 1 EDGE Mile = 2 Partner Points",
      "Milestone benefits of up to 5,000 EDGE Miles",
    ],
  },
  {
    name: "HDFC Regalia Gold Credit Card",
    image: hdfcRegaliaGold,
    rating: "4/5",
    joiningFee: "₹2,500",
    annualFee: "₹2,500",
    highlight1: "5X reward points on Nykaa, Myntra, Marks & Spencer and Reliance Digital",
    highlight2: "4 reward points per ₹150 across all retail spends",
    tags: ["Travel", "Shopping", "Rewards"],
    details: [
      "Complimentary Swiggy One & MMT Black Elite Memberships",
      "Gift voucher worth ₹2,500 on the payment of joining fee",
      "6 complimentary international lounge visits & 12 domestic airport lounge visits per year",
      "Marks & Spencer/Reliance Digital/Myntra/Marriott vouchers of ₹1,500 on ₹1.5 Lakh quarterly spends",
      "Flight vouchers worth ₹5,000 on annual spends of ₹5 Lakh",
    ],
  },
  {
    name: "YES BANK PaisaSave Credit Card",
    image: yesPaisasave,
    rating: "4/5",
    joiningFee: "₹0",
    annualFee: "₹499",
    highlight1: "6% cashback on travel and dining spends",
    highlight2: "Unlimited 1% cashback on all other spends, including UPI",
    tags: ["Travel", "Dining", "Cashback"],
    details: [
      "6% cashback is capped at ₹3,000 per month, post which 1% cashback will apply",
      "Earned reward points can be redeemed as statement credit in 1:1 ratio at zero redemption fee",
      "Renewal fee waived off on reaching ₹1.2 lakh annual spends",
      "1% fuel surcharge waiver, up to ₹250 per month, on all fuel spends worth ₹500 to ₹3,000",
    ],
  },
  {
    name: "Cashback SBI Card",
    image: sbiCashback,
    rating: "4/5",
    joiningFee: "₹999",
    annualFee: "₹999",
    highlight1: "5% cashback on all online spends",
    highlight2: "1% cashback across all offline spends",
    tags: ["Cashback", "Online Shopping"],
    details: [
      "5% cashback across all online spends with no merchant restriction",
      "1% cashback across all offline spends",
      "Earn cashback of up to ₹5,000 per month",
      "Renewal fee reversed on spending at least ₹2 lakh in a year",
      "1% fuel surcharge waiver of up to ₹100 per month",
    ],
  },
  {
    name: "American Express® Platinum Card",
    image: amexPlatinum,
    rating: "4/5",
    joiningFee: "₹66,000",
    annualFee: "₹66,000",
    highlight1: "Vouchers of up to ₹60,000 from Taj, Reliance or Postcard Hotels on spending ₹50,000 in first 2 months",
    highlight2: "Complimentary access to multiple lounge access programs",
    tags: ["Travel", "Premium", "Shopping"],
    details: [
      "Benefits of ₹44,300 at the finest hotels/resorts worldwide like Four Seasons, Mandarin Oriental, The Ritz-Carlton",
      "Access to top-tier hotel loyalty programs like Marriott Bonvoy™ Gold Elite, Hilton Honors Gold, Taj Reimagined Epicure",
      "Invitations to VIP-only events & access to pre-sale tickets at Fashion Week, Grammy Awards, Wimbledon",
      "Eazy Diner Prime membership with up to 50% off at premium restaurants in India",
      "Vouchers worth ₹35,000 from Taj Hotels, Reliance Brands on annual spends of ₹20 Lakh",
    ],
  },
  {
    name: "Axis Bank SELECT Credit Card",
    image: axisSelect,
    rating: "4/5",
    joiningFee: "₹3,000",
    annualFee: "₹3,000",
    highlight1: "Up to 20 EDGE Reward Points per ₹200 spent",
    highlight2: "10,000 EDGE Reward Points worth ₹2,000 as welcome benefit",
    tags: ["Shopping", "Rewards"],
    details: [
      "Buy 1 get 1 movie ticket of up to ₹250 on District app, once a month",
      "Flat ₹500 off per month on BigBasket on minimum spend of ₹2,500",
      "₹200 off on Swiggy, twice a month, on minimum spend of ₹1,000",
      "Up to 12 complimentary international lounge visits in a year & 2 domestic lounge visits per quarter",
      "Up to 12 complimentary golf rounds in a year",
    ],
  },
  {
    name: "Tata Neu Plus HDFC Credit Card",
    image: tataNeuHdfc,
    rating: "3/5",
    joiningFee: "₹0",
    annualFee: "₹499",
    highlight1: "Up to 7% value back on Tata Neu spends",
    highlight2: "4 domestic lounge access per year",
    tags: ["Shopping"],
    details: [
      "499 NeuCoins after the first spend within 30 days of card issuance",
      "2% NeuCoins on Non-EMI spends on Tata Neu and partner Tata brands",
      "1% NeuCoins on UPI, non-Tata brand and merchant EMI spends",
      "Additional 5% NeuCoins on select spends at Tata Neu app/website",
    ],
  },
  {
    name: "IndianOil RBL Bank Credit Card",
    image: indianoilRbl,
    rating: "3.5/5",
    joiningFee: "₹500",
    annualFee: "₹500",
    highlight1: "Up to 6% savings on IndianOil fuel purchases",
    highlight2: "1,000 Fuel Points as welcome benefit",
    tags: ["Rewards", "Fuel"],
    details: [
      "5% savings as 10 Fuel Points per ₹100 spent on IndianOil fuel",
      "1 Fuel Point per ₹100 spent on other categories; 1 Fuel Point = ₹0.50 for IOCL fuel purchase",
      "1% fuel surcharge waiver, up to ₹100 per month, on fuel spends",
      "Annual fee waived off on ₹1.75 lakh annual spends",
    ],
  },
];

const cardTypes = [
  { title: "Rewards Credit Cards", description: "Earn points on every transaction. Redeem for flights, merchandise, vouchers.", icon: Gift, bgColor: "bg-violet-50", iconColor: "text-violet-500" },
  { title: "Cashback Credit Cards", description: "Get instant cashback on spends. Up to 5% on groceries, dining, and online shopping.", icon: Percent, bgColor: "bg-emerald-50", iconColor: "text-emerald-500" },
  { title: "Travel Credit Cards", description: "Complimentary lounge access, air miles, zero forex markup, and travel insurance.", icon: Plane, bgColor: "bg-sky-50", iconColor: "text-sky-500" },
  { title: "Fuel Credit Cards", description: "1% fuel surcharge waiver, bonus points at fuel stations, and partner discounts.", icon: Fuel, bgColor: "bg-amber-50", iconColor: "text-amber-500" },
  { title: "Shopping Credit Cards", description: "Extra discounts on e-commerce platforms, EMI conversion, and exclusive sale access.", icon: ShoppingBag, bgColor: "bg-pink-50", iconColor: "text-pink-500" },
  { title: "Lifestyle Credit Cards", description: "Dining privileges, movie & entertainment offers, spa access, and golf memberships.", icon: Heart, bgColor: "bg-rose-50", iconColor: "text-rose-500" },
  { title: "Business Credit Cards", description: "Expense management tools, higher credit limits, and rewards on business spending.", icon: Building2, bgColor: "bg-blue-50", iconColor: "text-blue-500" },
  { title: "Premium/Super Premium", description: "Concierge services, luxury hotel stays, exclusive event access, and elite reward rates.", icon: Gem, bgColor: "bg-purple-50", iconColor: "text-purple-500" },
];

const features = [
  { title: "Easy Access to Funds", description: "The credit limit adds to your purchasing power and can be helpful in financial emergencies.", icon: Wallet },
  { title: "Build Credit Profile", description: "Disciplined use with timely payments helps build a good credit score for future loan approvals.", icon: TrendingUp },
  { title: "Value-back on Purchases", description: "Earn reward points, cashback, or direct discounts on select brands with every transaction.", icon: Gift },
  { title: "EMI Conversion", description: "Convert big-ticket purchases into easy EMIs to divide total cost into smaller monthly payments.", icon: Receipt },
  { title: "Airport Lounge Access", description: "Complimentary domestic and international airport lounge visits with select credit cards.", icon: Plane },
  { title: "Fuel Surcharge Waiver", description: "Most credit cards offer 1% fuel surcharge waiver on fuel transactions.", icon: Fuel },
  { title: "Insurance Cover", description: "Complimentary insurance for air accidents, emergency hospitalization, lost card liability, and luggage loss.", icon: Shield },
  { title: "Concierge Service", description: "Premium cards offer complimentary concierge for travel bookings, gift deliveries, and roadside assistance.", icon: Star },
];

const eligibilityCriteria = [
  { label: "Age", value: "21 to 65 years (18+ for add-on cards)" },
  { label: "Income (Salaried)", value: "Min ₹15,000–₹25,000/month" },
  { label: "Income (Self-Employed)", value: "Min ₹3L–₹6L annual income" },
  { label: "CIBIL Score", value: "750+ for best cards, 650+ for basic cards" },
  { label: "Employment", value: "Salaried, self-employed, or business owner" },
  { label: "Credit Limit", value: "₹10,000 to ₹20 Lakh+ based on profile" },
];

const documents = [
  "PAN Card (mandatory for all credit card applications)",
  "Aadhaar Card / Passport / Voter ID (identity proof)",
  "Salary slips (last 3 months) for salaried applicants",
  "Bank statements (last 3–6 months)",
  "ITR / Form 16 (last 2 years) for self-employed",
  "Passport-size photographs",
  "Address proof (Utility Bill, Rent Agreement, Passport)",
];

const howToApplySteps = [
  { step: 1, title: "Compare Cards on CreduPe", description: "Use CreduPe to compare credit cards based on rewards, fees, benefits, and eligibility." },
  { step: 2, title: "Check Eligibility", description: "Verify your eligibility instantly without impacting your CIBIL score." },
  { step: 3, title: "Choose Your Card", description: "Select the card that best matches your spending habits and lifestyle." },
  { step: 4, title: "Submit Application", description: "Fill the online application form and upload KYC documents digitally." },
  { step: 5, title: "Card Delivery", description: "Once approved, your credit card is delivered to your doorstep within 7–15 working days." },
];

const feesAndCharges = [
  { charge: "Annual/Renewal Fee", range: "₹0 – ₹66,000+", note: "Varies by card tier; many cards waive on spend targets" },
  { charge: "Interest Rate (Revolving Credit)", range: "24% – 42% p.a.", note: "Applicable when full bill is not paid by due date" },
  { charge: "Late Payment Fee", range: "₹100 – ₹1,300", note: "Depends on outstanding amount slab" },
  { charge: "Cash Advance Fee", range: "2.5% of amount", note: "Minimum ₹300–₹500; interest from day 1" },
  { charge: "Foreign Currency Markup", range: "1% – 3.5%", note: "Applied on international transactions" },
  { charge: "Over-Limit Fee", range: "₹500 – ₹600", note: "Charged when spending exceeds credit limit" },
  { charge: "GST on Fees & Interest", range: "18%", note: "Applicable on all fees and interest charges" },
  { charge: "EMI Conversion Fee", range: "₹199 – ₹499", note: "One-time processing fee per conversion" },
];

const dosAndDonts = {
  dos: [
    "Always pay your credit card bill in full before the due date",
    "Keep your credit utilization ratio below 30% of your limit",
    "Review your credit card statement every month for errors",
    "Set up auto-pay for at least the minimum amount due",
    "Use reward points before they expire — check expiry policy",
    "Report lost or stolen cards immediately to the bank",
  ],
  donts: [
    "Don't pay only the minimum amount due — it leads to high interest",
    "Don't use credit card for cash withdrawals — fees apply from day 1",
    "Don't apply for multiple credit cards in a short period",
    "Don't share your CVV, OTP, or card PIN with anyone",
    "Don't exceed your credit limit — it affects your credit score",
    "Don't ignore annual fee charges — request waiver or downgrade if unused",
  ],
};

const relatedArticles = [
  "Best Credit Cards in India 2026 – Complete Guide",
  "How to Choose the Right Credit Card for Your Lifestyle",
  "Credit Card vs Debit Card – Key Differences Explained",
  "How to Increase Your Credit Card Limit",
  "Understanding Credit Card Billing Cycle & Due Date",
  "Top 10 Mistakes to Avoid with Credit Cards",
];

const creditCardByBank = [
  "HDFC Credit Cards", "SBI Credit Cards", "ICICI Credit Cards",
  "Axis Credit Cards", "Kotak Credit Cards", "IndusInd Credit Cards",
  "Yes Bank Credit Cards", "AU Bank Credit Cards", "IDFC First Credit Cards",
  "RBL Credit Cards", "American Express Cards",
];

const creditCardByType = [
  "Best Rewards Credit Cards",
  "Best Cashback Credit Cards",
  "Best Travel Credit Cards",
  "Best Fuel Credit Cards",
  "Best Lifetime Free Credit Cards",
  "Best Premium Credit Cards",
  "Best Student Credit Cards",
];

const creditCardDetails = [
  "How to Apply for Credit Card Online?",
  "Credit Card Eligibility Checker",
  "Credit Card EMI Calculator",
  "Credit Card Bill Payment",
  "Credit Card Reward Points Calculator",
  "Credit Card Annual Fee Comparison",
];

const faqs = [
  { q: "What is the minimum salary required to get a credit card?", a: "Most banks require a minimum monthly salary of ₹15,000–₹25,000 for entry-level credit cards. Premium cards may require ₹50,000+ monthly income. Some lifetime free cards like IDFC First and OneCard have lower income thresholds." },
  { q: "How is a credit card different from a debit card?", a: "A credit card lets you borrow money from the bank up to a pre-set limit, while a debit card deducts directly from your bank account. Credit cards offer rewards, EMI options, and help build credit history. You get a billing cycle (typically 45–50 days interest-free) to repay." },
  { q: "What is a credit card billing cycle?", a: "A billing cycle is the period (usually 30 days) between two statement dates. All transactions during this period appear on your monthly statement. You typically get 15–20 days after the statement date (due date) to pay without interest charges." },
  { q: "Does applying for a credit card affect my CIBIL score?", a: "Yes, each credit card application triggers a 'hard inquiry' on your credit report, which can temporarily lower your score by 5–10 points. Multiple applications in a short period can significantly impact your score. Use CreduPe's eligibility checker to check without affecting your score." },
  { q: "What is the minimum amount due on a credit card?", a: "The minimum amount due (MAD) is typically 5% of the total outstanding balance or ₹200, whichever is higher. While paying only MAD avoids late fees, interest (24–42% p.a.) is charged on the remaining balance. Always try to pay the full amount to avoid high interest." },
  { q: "Can I get a credit card with a low CIBIL score?", a: "It's difficult to get a regular credit card with a CIBIL score below 650. However, you can apply for a secured credit card (backed by FD) or cards from NBFCs that have more relaxed criteria. Building good credit habits will improve your score over time." },
  { q: "What are the charges on a credit card?", a: "Common charges include: Annual/renewal fee (₹0–₹12,500+), interest on revolving credit (24–42% p.a.), late payment fee (₹100–₹1,300), cash advance fee (2.5%), foreign currency markup (1–3.5%), over-limit fee, and GST (18%) on all fees and interest." },
  { q: "How can I increase my credit card limit?", a: "You can increase your limit by: maintaining a good repayment track record, increasing card usage, updating salary/income details with the bank, requesting a limit enhancement through the bank's app/website, or getting a new card with a higher limit from another bank." },
];

const tagColors: Record<string, string> = {
  Travel: "bg-sky-100 text-sky-700",
  Premium: "bg-purple-100 text-purple-700",
  Rewards: "bg-amber-100 text-amber-700",
  Cashback: "bg-emerald-100 text-emerald-700",
  Shopping: "bg-pink-100 text-pink-700",
  "Online Shopping": "bg-pink-100 text-pink-700",
  Dining: "bg-orange-100 text-orange-700",
  Fuel: "bg-red-100 text-red-700",
  "Lounge Access": "bg-indigo-100 text-indigo-700",
};

const CreditCards = () => {
  const { selectedSlug, selectedType, handleItemClick, handleClose, contentRef } = useSidebarContent();
  const sectionRefs = {
    About: useRef<HTMLDivElement>(null),
    "Top Cards": useRef<HTMLDivElement>(null),
    Types: useRef<HTMLDivElement>(null),
    Features: useRef<HTMLDivElement>(null),
    Eligibility: useRef<HTMLDivElement>(null),
    Documents: useRef<HTMLDivElement>(null),
    "How to Apply": useRef<HTMLDivElement>(null),
    "Fees & Charges": useRef<HTMLDivElement>(null),
    "Do's & Don'ts": useRef<HTMLDivElement>(null),
    FAQ: useRef<HTMLDivElement>(null),
  };

  const scrollToSection = (tab: string) => {
    const ref = sectionRefs[tab as keyof typeof sectionRefs];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-6 pb-0">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] min-h-[320px] md:min-h-[360px]">
          <img
            src={creditCardHero}
            alt="Credit cards with rewards and cashback"
            width={800}
            height={800}
            className="absolute right-[5%] md:right-[10%] bottom-0 h-[105%] w-auto object-contain opacity-95 hidden md:block"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-deep))]/75 to-transparent" />
          <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end h-full min-h-[320px] md:min-h-[360px]">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Credit Cards</h1>
              <p className="text-white/70 text-sm md:text-base max-w-md">
                Compare & apply for the best credit cards in India. Rewards, cashback, travel perks — find the card that fits your lifestyle.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="text-white/80">
                <span className="text-xs block">100+ Cards from</span>
                <span className="text-3xl md:text-4xl font-bold text-primary">30+ Banks</span>
              </div>
              <Link to="/login" className="px-6 py-3 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
                Check Eligibility
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                Compare Credit Cards
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="mt-4 rounded-xl border border-border bg-card flex items-center gap-0 overflow-x-auto">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => scrollToSection(tab)}
              className={`px-5 py-3 text-xs font-medium whitespace-nowrap transition-colors relative text-muted-foreground hover:text-primary ${
                i < tabs.length - 1 ? "border-r border-border" : ""
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-6 mb-2">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Credit Cards</span>
        </div>
      </section>

      {/* Main Content + Sidebar Layout */}
      <div className="flex gap-8 pb-16">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div ref={contentRef}>
            <SidebarContentPanel productName="Credit Cards" selectedSlug={selectedSlug} selectedType={selectedType} onClose={handleClose} />
          </div>
          {/* About Section */}
          <div ref={sectionRefs.About} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Apply Credit Card Online
            </h2>
            <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
              <p>
                With a wide range of options available in the market, choosing the right credit card can be a difficult task. 
                The best credit cards in India are designed to offer an array of benefits, including cashback, rewards and other deals, 
                that are tailored to varied lifestyles and needs ranging from travel to shopping.
              </p>
              <p>
                It is important to compare credit cards from different issuers and apply for a credit card that helps you save on shopping, 
                travel, dining and other spending categories, as per your preferences. Credit cards allow cardholders to borrow up to a 
                predefined credit limit to pay for goods and services.
              </p>
              <p>
                <strong className="text-foreground">CreduPe</strong> helps you compare credit cards from 30+ leading banks based on rewards, fees, 
                benefits, and eligibility — so you can find the perfect card that matches your spending habits and lifestyle. 
                Check your eligibility without impacting your credit score.
              </p>
            </div>
          </div>

          {/* Top Cards Section - Paisabazaar Style */}
          <div ref={sectionRefs["Top Cards"]} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Compare & Apply for Top Credit Cards in April 2026
            </h2>

            <div className="space-y-4">
              {topCreditCards.map((card, index) => (
                <div key={card.name} className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {/* Card Image */}
                    <div className="md:w-[180px] shrink-0 flex items-center justify-center p-4 md:p-5 bg-muted/20 border-b md:border-b-0 md:border-r border-border">
                      <img
                        src={card.image}
                        alt={card.name}
                        loading="lazy"
                        className="w-[140px] h-auto object-contain"
                      />
                    </div>

                    {/* Card Details */}
                    <div className="flex-1 p-4 md:p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-foreground leading-tight">{card.name}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < Math.floor(parseFloat(card.rating)) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`} />
                              ))}
                            </div>
                            <span className="text-[11px] text-muted-foreground ml-1">{card.rating}</span>
                          </div>
                        </div>
                        <span className="text-[11px] bg-muted px-2 py-0.5 rounded font-medium text-muted-foreground shrink-0">#{index + 1}</span>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-2">
                        <span>Joining fee: <strong className="text-foreground">{card.joiningFee}</strong></span>
                        <span>Annual Fee: <strong className="text-foreground">{card.annualFee}</strong></span>
                      </div>

                      <div className="space-y-1 mb-3">
                        <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          {card.highlight1}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          {card.highlight2}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {card.tags.map((tag) => (
                          <span key={tag} className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${tagColors[tag] || "bg-muted text-muted-foreground"}`}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Expandable Details */}
                      <Accordion type="single" collapsible>
                        <AccordionItem value="details" className="border-none">
                          <AccordionTrigger className="text-xs font-medium text-primary hover:no-underline py-0 gap-1">
                            Product Details
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-0">
                            <ul className="space-y-1.5">
                              {card.details.map((detail, i) => (
                                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0 mt-1.5" />
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    {/* CTA */}
                    <div className="md:w-[160px] shrink-0 p-4 md:p-5 flex flex-row md:flex-col items-center justify-center gap-2 border-t md:border-t-0 md:border-l border-border bg-muted/10">
                      <Link to="/login" className="w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity text-center block">
                        Check Eligibility
                      </Link>
                      <button className="w-full px-4 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1">
                        Know More <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-muted-foreground mt-3 italic">
              *HDFC Infinia is not included as it is an invite-only card. Details as of April 2026.
            </p>
          </div>

          {/* Types Section */}
          <div ref={sectionRefs.Types} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" /> Types of Credit Cards
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cardTypes.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="rounded-xl border border-border bg-card p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${card.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{card.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div ref={sectionRefs.Features} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" /> Credit Card Features & Benefits
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-xl border border-border bg-card p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Eligibility Section */}
          <div ref={sectionRefs.Eligibility} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" /> Credit Card Eligibility Criteria
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {eligibilityCriteria.map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground">{item.label}</span>
                    <span className="text-xs text-muted-foreground block">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Section */}
          <div ref={sectionRefs.Documents} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Documents Required for Credit Card
            </h2>
            <div className="rounded-xl border border-border bg-card p-5">
              <ul className="space-y-3">
                {documents.map((doc, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    </div>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* How to Apply Section */}
          <div ref={sectionRefs["How to Apply"]} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-primary" /> How to Apply for a Credit Card?
            </h2>
            <div className="space-y-4">
              {howToApplySteps.map((s) => (
                <div key={s.step} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--purple-deep))] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fees & Charges Section */}
          <div ref={sectionRefs["Fees & Charges"]} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-primary" /> Credit Card – Fees & Charges
            </h2>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[hsl(var(--purple-deep))] text-white">
                    <th className="text-left px-4 py-3 font-semibold text-xs">Charge Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs">Range</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs hidden md:table-cell">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {feesAndCharges.map((row, i) => (
                    <tr key={row.charge} className={`${i % 2 === 0 ? "bg-card" : "bg-muted/30"} border-t border-border`}>
                      <td className="px-4 py-3 text-xs font-medium text-foreground">{row.charge}</td>
                      <td className="px-4 py-3 text-xs text-primary font-semibold">{row.range}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Do's & Don'ts Section */}
          <div ref={sectionRefs["Do's & Don'ts"]} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Credit Card – Do's and Don'ts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-bold text-emerald-600 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Do's ✅
                </h3>
                <ul className="space-y-2.5">
                  {dosAndDonts.dos.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-bold text-red-500 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Don'ts ❌
                </h3>
                <ul className="space-y-2.5">
                  {dosAndDonts.donts.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <ArrowRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div ref={sectionRefs.FAQ} className="scroll-mt-24 mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" /> FAQs on Credit Cards
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-4 overflow-hidden">
                  <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground pb-4 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <ProductSidebar
          productName="Credit Cards"
          insights={relatedArticles}
          topLenders={creditCardByBank}
          interestRates={creditCardByType}
          eligibilityDocs={creditCardDetails}
          ctaIcon={CreditCard}
          ctaTitle="Find Your Perfect Card"
          ctaDescription="Compare credit cards from 30+ banks. Check eligibility without affecting your CIBIL score."
          ctaButtonText="Compare Cards Now"
          onItemClick={handleItemClick}
          activeSlug={selectedSlug}
        />
      </div>

      <Footer />
    </div>
  );
};

export default CreditCards;
