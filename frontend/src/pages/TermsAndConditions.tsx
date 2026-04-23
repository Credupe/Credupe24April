import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Terms & Conditions</h1>
        <p className="text-muted-foreground text-sm mb-8">Last updated: April 12, 2026</p>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using CreduPe's website, mobile applications, and services (collectively, the "Platform"), you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use the Platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Services Overview</h2>
            <p>CreduPe operates as a digital financial marketplace that connects consumers with lending partners, credit card issuers, and other financial service providers. CreduPe is not a lender, bank, or financial institution. All loan products, credit cards, and financial services displayed on the Platform are offered by third-party partners.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Eligibility</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You must be at least 18 years of age.</li>
              <li>You must be a resident of India with valid identification.</li>
              <li>You must provide accurate and complete information during registration and application processes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. User Account</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. Any activity occurring under your account is your responsibility. Notify us immediately at <a href="mailto:contact@credupe.com" className="text-primary hover:underline">contact@credupe.com</a> if you suspect unauthorized access.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Third-Party Products</h2>
            <p>CreduPe facilitates connections between users and financial institutions. The terms, interest rates, fees, and conditions of any financial product are determined solely by the respective lending partner or issuer. CreduPe does not guarantee approval of any application.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Credit Score Services</h2>
            <p>Credit scores displayed on the Platform are sourced from authorized credit bureaus. Accessing your credit score through CreduPe is a "soft inquiry" and does not impact your credit score. However, applying for financial products through our lending partners may result in a "hard inquiry" which could affect your score.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Intellectual Property</h2>
            <p>All content, trademarks, logos, and intellectual property on the Platform are owned by CreduPe or its licensors. Unauthorized reproduction, distribution, or use of any content is strictly prohibited.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
            <p>CreduPe shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of the Platform or any financial product obtained through our partners. All financial decisions are made at the user's own risk.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Governing Law</h2>
            <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Contact</h2>
            <p>For queries regarding these Terms, contact us at <a href="mailto:contact@credupe.com" className="text-primary hover:underline">contact@credupe.com</a>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
