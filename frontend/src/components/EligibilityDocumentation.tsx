const featuresList = [
  "Loan amount from ₹6,000 to ₹10 Lakhs (*Maximum amount may be contingent upon Applicant's employment and financial status)",
  "Interest Rates ranging from 10.49% to 28.5% per annum",
  "Tenure ranging from 6 months to 60 months",
  "Processing fee up to 5.1% + GST",
  "Quick & direct transfer to the Bank Account",
];

const eligibilityList = [
  "Indian Citizen",
  "Age to be 21 years and above",
  "Minimum monthly personal income of ₹10,000",
  "Monthly household income more than ₹25,000",
  "Possess Government-approved Valid Identity Proof & Address Proof",
  "Aadhaar-linked mobile number",
];

const EligibilityDocumentation = () => {
  return (
    <section className="pb-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Eligibility & Documentation For Instant Personal Loans Online
        </h2>
        <div className="w-12 h-1 bg-primary mx-auto rounded-full mb-4" />
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Learn about the eligibility requirements and necessary documentation for quick loan approval.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Features */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-1">Features</h3>
          <div className="w-10 h-0.5 bg-primary rounded-full mb-4" />
          <ul className="space-y-3">
            {featuresList.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Eligibility */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-1">Eligibility Criteria</h3>
          <div className="w-10 h-0.5 bg-primary rounded-full mb-4" />
          <ul className="space-y-3">
            {eligibilityList.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default EligibilityDocumentation;
