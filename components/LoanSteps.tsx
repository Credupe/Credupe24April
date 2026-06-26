const loanStepsIllustration = "/assets/loan-steps-illustration.png";
const steps = [
  { number: 1, text: "Sign up using your mobile number." },
  { number: 2, text: "Enter your basic information & check eligibility." },
  { number: 3, text: "Verify your profile by uploading KYC documents." },
  { number: 4, text: "Provide your bank account details." },
  { number: 5, text: "Choose your loan amount and tenure." },
  { number: 6, text: "Get the loan disbursed directly into your bank account." },
];

const LoanSteps = () => {
  return (
    <section className="pb-16">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Get A Personal Loan In A Few Easy Steps
        </h2>
        <div className="w-12 h-1 bg-amber-400 rounded-full mx-auto mt-2 mb-4" />
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Follow these simple steps to quickly complete your application and get your loan disbursed directly into your bank account.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
        {/* Illustration */}
        <div className="w-full md:w-2/5 flex justify-center">
          <img
            src={loanStepsIllustration}
            alt="Person applying for loan on mobile"
            width={800}
            height={900}
            loading="lazy"
            className="w-64 md:w-80 h-auto"
          />
        </div>

        {/* Steps */}
        <div className="w-full md:w-3/5 flex flex-col gap-0">
          {steps.map((step, i) => (
            <div key={step.number} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-amber-400 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {step.number}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-8 border-l-2 border-dashed border-amber-300" />
                )}
              </div>
              <p className="text-sm font-medium text-foreground pt-2.5">{step.text}</p>
            </div>
          ))}
          <div className="mt-6 ml-14">
            <button className="px-6 py-3 rounded-lg bg-amber-400 text-foreground text-sm font-semibold hover:bg-amber-500 transition-colors">
              Check Eligibility
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanSteps;
