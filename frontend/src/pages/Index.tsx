import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DigitalBankingSection from "@/components/DigitalBankingSection";
import ProductCardsSection from "@/components/ProductCardsSection";
import CreditCardBanner from "@/components/CreditCardBanner";
import CreditScoreSection from "@/components/CreditScoreSection";
import EMICalculator from "@/components/EMICalculator";
import StatsSection from "@/components/StatsSection";
import BankingPartnersSection from "@/components/BankingPartnersSection";
import BecomePartner from "@/components/BecomePartner";
import WallOfWin from "@/components/WallOfWin";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 [&>section]:py-10 [&>section]:md:py-14">
      <Navbar />
      <HeroSection />
      <CreditScoreSection />
      <DigitalBankingSection />
      <ProductCardsSection />
      <CreditCardBanner />
      <BecomePartner />
      <EMICalculator />
      <WallOfWin />
      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Our Integrated <span className="text-primary">Banking Ecosystem</span>
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto text-sm">
          A unified platform connecting customers, partners, and financial institutions for seamless lending and credit solutions.
        </p>
      </section>
      <BankingPartnersSection />
      <StatsSection />
      <Footer />
    </div>
  );
};

export default Index;
