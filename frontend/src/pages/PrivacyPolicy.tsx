import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-8">Last updated: April 12, 2026</p>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-foreground">Personal Information:</strong> Name, email address, phone number, date of birth, PAN, Aadhaar (as required by lending partners).</li>
              <li><strong className="text-foreground">Financial Information:</strong> Income details, employment information, and credit history accessed with your consent.</li>
              <li><strong className="text-foreground">Usage Data:</strong> Browser type, IP address, pages visited, and interaction patterns on the Platform.</li>
              <li><strong className="text-foreground">Device Information:</strong> Device type, operating system, and unique device identifiers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To process and facilitate loan and credit card applications with our lending partners.</li>
              <li>To provide personalized product recommendations based on your financial profile.</li>
              <li>To display your credit score and report from authorized bureaus.</li>
              <li>To communicate important updates, offers, and service notifications.</li>
              <li>To improve our Platform, services, and user experience.</li>
              <li>To comply with legal and regulatory obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Data Sharing</h2>
            <p>We share your information only with:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li><strong className="text-foreground">Lending Partners:</strong> Banks and NBFCs to process your applications.</li>
              <li><strong className="text-foreground">Credit Bureaus:</strong> To retrieve your credit score with your explicit consent.</li>
              <li><strong className="text-foreground">Service Providers:</strong> Third-party vendors who assist in platform operations under strict confidentiality agreements.</li>
              <li><strong className="text-foreground">Legal Authorities:</strong> When required by law, regulation, or legal process.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Data Security</h2>
            <p>We implement industry-standard encryption (SSL/TLS), access controls, and regular security audits to protect your data. However, no method of electronic transmission is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Cookies & Tracking</h2>
            <p>We use cookies and similar technologies to enhance your browsing experience, analyze usage patterns, and deliver targeted content. You can manage cookie preferences through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Your Rights</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Access, correct, or delete your personal information.</li>
              <li>Withdraw consent for data processing at any time.</li>
              <li>Opt out of marketing communications.</li>
              <li>Request a copy of your data in a portable format.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Data Retention</h2>
            <p>We retain your data for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, and resolve disputes. Inactive accounts may be purged after 24 months of inactivity.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Contact</h2>
            <p>For privacy-related inquiries, contact our Data Protection Officer at <a href="mailto:contact@credupe.com" className="text-primary hover:underline">contact@credupe.com</a>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
