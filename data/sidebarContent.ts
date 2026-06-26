// Dynamic sidebar content data for all product pages
// Each product has lender-specific details that load when sidebar items are clicked

export interface LenderDetail {
  name: string;
  slug: string;
  interestRate: string;
  processingFee: string;
  maxAmount: string;
  tenure: string;
  eligibility: string[];
  documents: string[];
  features: string[];
  description: string;
}

export interface InsightArticle {
  title: string;
  slug: string;
  summary: string;
  keyPoints: string[];
}

export interface RateComparison {
  title: string;
  slug: string;
  bank: string;
  rate: string;
  effectiveRate: string;
  processingFee: string;
  prepayment: string;
  details: string[];
}

export interface EligibilityDetail {
  title: string;
  slug: string;
  description: string;
  points: string[];
}

export interface ProductSidebarData {
  lenders: LenderDetail[];
  insights: InsightArticle[];
  rates: RateComparison[];
  eligibilityDocs: EligibilityDetail[];
}

const personalLoanData: ProductSidebarData = {
  lenders: [
    {
      name: "SBI Personal Loan",
      slug: "sbi-personal-loan",
      interestRate: "11.00% – 14.00% p.a.",
      processingFee: "Up to 1.50% of loan amount",
      maxAmount: "₹20 Lakh",
      tenure: "Up to 72 months",
      eligibility: [
        "Age: 21 – 58 years for salaried, up to 65 for pensioners",
        "Minimum income: ₹15,000/month",
        "CIBIL Score: 700+ preferred",
        "Employment: Minimum 1 year in current organization",
        "Available for SBI account holders and non-account holders"
      ],
      documents: ["PAN Card & Aadhaar", "Last 3 months salary slips", "6 months bank statements", "Form 16 / ITR"],
      features: ["Pre-approved offers for existing SBI customers", "Doorstep service available", "No collateral required", "Online application via YONO app"],
      description: "SBI Xpress Credit Personal Loan offers competitive rates for salaried individuals with quick disbursal through the YONO platform."
    },
    {
      name: "HDFC Personal Loan",
      slug: "hdfc-personal-loan",
      interestRate: "10.50% – 21.00% p.a.",
      processingFee: "Up to 2.50% of loan amount",
      maxAmount: "₹40 Lakh",
      tenure: "Up to 60 months",
      eligibility: [
        "Age: 21 – 60 years",
        "Minimum income: ₹25,000/month (metro), ₹20,000 (non-metro)",
        "CIBIL Score: 750+ for best rates",
        "Employment: Minimum 2 years total, 1 year current",
        "Salaried & self-employed both eligible"
      ],
      documents: ["PAN Card & Aadhaar", "Last 3 months salary slips", "6 months bank statements", "Passport-size photos"],
      features: ["Top-up loan facility available", "Balance transfer option", "Instant approval for pre-approved customers", "Flexible EMI options"],
      description: "HDFC Bank offers personal loans with flexible tenure options and competitive interest rates for both salaried and self-employed professionals."
    },
    {
      name: "ICICI Personal Loan",
      slug: "icici-personal-loan",
      interestRate: "10.75% – 19.00% p.a.",
      processingFee: "Up to 2.25% of loan amount",
      maxAmount: "₹50 Lakh",
      tenure: "Up to 60 months",
      eligibility: [
        "Age: 23 – 58 years",
        "Minimum income: ₹17,500/month",
        "CIBIL Score: 700+ preferred",
        "Employment: Minimum 2 years experience",
        "Available for salaried & self-employed individuals"
      ],
      documents: ["PAN Card & Aadhaar", "3 months salary slips", "6 months bank statements", "Employment proof"],
      features: ["Instant disbursal via iMobile app", "Overdraft facility available", "Step-up EMI option", "No foreclosure charges after 12 months"],
      description: "ICICI Bank provides instant personal loans with competitive rates and the convenience of applying through the iMobile Pay app."
    },
    {
      name: "Axis Personal Loan",
      slug: "axis-personal-loan",
      interestRate: "10.49% – 22.00% p.a.",
      processingFee: "Up to 2.00% of loan amount",
      maxAmount: "₹40 Lakh",
      tenure: "Up to 60 months",
      eligibility: [
        "Age: 21 – 60 years",
        "Minimum income: ₹15,000/month",
        "CIBIL Score: 700+ preferred",
        "Employment: Minimum 1 year in current company",
        "Salaried employees of listed companies preferred"
      ],
      documents: ["PAN Card & Aadhaar", "Salary slips (3 months)", "Bank statements (6 months)", "Address proof"],
      features: ["Flexible tenure up to 5 years", "Instant approval for pre-approved customers", "Balance transfer facility", "No hidden charges"],
      description: "Axis Bank offers personal loans with one of the lowest starting interest rates in the market and quick digital processing."
    },
    {
      name: "Kotak Personal Loan",
      slug: "kotak-personal-loan",
      interestRate: "10.99% – 24.00% p.a.",
      processingFee: "Up to 2.50% of loan amount",
      maxAmount: "₹40 Lakh",
      tenure: "Up to 60 months",
      eligibility: [
        "Age: 21 – 60 years",
        "Minimum income: ₹20,000/month",
        "CIBIL Score: 700+ preferred",
        "Employment: Minimum 1 year total experience",
        "Available pan-India"
      ],
      documents: ["PAN Card & Aadhaar", "Salary slips (3 months)", "Bank statements (6 months)", "Passport-size photos"],
      features: ["Zero foreclosure charges after 6 months", "Online application with instant approval", "Loan top-up available", "Dedicated relationship manager"],
      description: "Kotak Mahindra Bank offers personal loans with attractive rates and a seamless digital application process."
    },
    {
      name: "Bajaj Finserv Personal Loan",
      slug: "bajaj-finserv-personal-loan",
      interestRate: "11.00% – 25.00% p.a.",
      processingFee: "Up to 3.54% of loan amount",
      maxAmount: "₹35 Lakh",
      tenure: "Up to 84 months",
      eligibility: [
        "Age: 23 – 55 years",
        "Minimum income: ₹22,000/month",
        "CIBIL Score: 750+ for best rates",
        "Employment: Minimum 3 years total, 1 year current",
        "Self-employed professionals also eligible"
      ],
      documents: ["PAN Card & Aadhaar", "3 months salary slips", "3 months bank statements", "Latest Form 16"],
      features: ["Longest tenure option up to 7 years", "Flexi loan facility available", "Pre-approved offers", "Part-prepayment allowed"],
      description: "Bajaj Finserv offers one of the longest tenure personal loans in the market with a unique flexi loan facility."
    },
    {
      name: "IndusInd Personal Loan",
      slug: "indusind-personal-loan",
      interestRate: "10.49% – 26.00% p.a.",
      processingFee: "Up to 3.00% of loan amount",
      maxAmount: "₹25 Lakh",
      tenure: "Up to 60 months",
      eligibility: [
        "Age: 21 – 60 years",
        "Minimum income: ₹15,000/month",
        "CIBIL Score: 700+ preferred",
        "Employment: Minimum 2 years total experience",
        "Salaried employees of reputed organizations"
      ],
      documents: ["PAN Card & Aadhaar", "Salary slips (3 months)", "Bank statements (6 months)", "Photo ID proof"],
      features: ["Competitive starting rate of 10.49%", "Quick disbursal within 48 hours", "Flexible repayment options", "No guarantor required"],
      description: "IndusInd Bank offers personal loans with competitive starting rates and quick processing for salaried professionals."
    },
    {
      name: "Yes Bank Personal Loan",
      slug: "yes-bank-personal-loan",
      interestRate: "10.99% – 20.00% p.a.",
      processingFee: "Up to 2.50% of loan amount",
      maxAmount: "₹40 Lakh",
      tenure: "Up to 60 months",
      eligibility: [
        "Age: 21 – 60 years",
        "Minimum income: ₹20,000/month",
        "CIBIL Score: 725+ preferred",
        "Employment: Minimum 2 years total experience",
        "Available for salaried and self-employed"
      ],
      documents: ["PAN Card & Aadhaar", "3 months salary slips", "6 months bank statements", "Employment proof"],
      features: ["Instant approval for existing customers", "Flexible EMI plans", "Balance transfer at lower rates", "No collateral needed"],
      description: "Yes Bank provides personal loans with attractive interest rates and dedicated customer support for a seamless borrowing experience."
    }
  ],
  insights: [
    {
      title: "How to Get a Personal Loan with Low CIBIL Score",
      slug: "personal-loan-low-cibil",
      summary: "A low CIBIL score doesn't mean you can't get a personal loan. Several lenders offer loans for scores as low as 600, though at higher rates.",
      keyPoints: [
        "Apply with NBFCs like Bajaj Finserv or Tata Capital that accept lower scores",
        "Consider a secured personal loan against FD or gold for better approval chances",
        "Add a co-applicant with a strong credit score to improve eligibility",
        "Start with smaller loan amounts to build trust with lenders",
        "Work on improving your score: pay bills on time, reduce credit utilization below 30%"
      ]
    },
    {
      title: "Personal Loan vs Credit Card Loan – Which is Better?",
      slug: "personal-loan-vs-credit-card",
      summary: "Both options serve different purposes. Personal loans offer lower rates for larger amounts, while credit card loans provide quick access for smaller needs.",
      keyPoints: [
        "Personal loans: 10.49%–24% p.a. vs Credit card loans: 15%–40% p.a.",
        "Personal loans offer higher amounts (up to ₹40L) vs credit card limits",
        "Credit card EMI conversion is instant but usually costlier",
        "Personal loans have fixed tenure; credit card debt can revolve indefinitely",
        "Choose personal loan for amounts above ₹1 Lakh; credit card for smaller, short-term needs"
      ]
    },
    {
      title: "5 Things to Check Before Taking a Personal Loan",
      slug: "things-to-check-personal-loan",
      summary: "Before signing a personal loan agreement, verify these critical factors to avoid hidden costs and ensure you get the best deal.",
      keyPoints: [
        "Compare the Annual Percentage Rate (APR), not just the interest rate",
        "Check processing fees — they can range from 0.5% to 3.5% of loan amount",
        "Understand prepayment/foreclosure charges and lock-in periods",
        "Read the fine print for hidden charges like documentation fees, late payment penalties",
        "Verify the total cost of the loan including all fees over the entire tenure"
      ]
    },
    {
      title: "How to Reduce Personal Loan Interest Rate",
      slug: "reduce-personal-loan-rate",
      summary: "There are several strategies to get a lower interest rate on your personal loan, from improving your profile to negotiating with lenders.",
      keyPoints: [
        "Maintain a CIBIL score above 750 for the best rates",
        "Apply through your salary account bank for preferential rates",
        "Consider balance transfer to a lender offering lower rates",
        "Negotiate with your existing lender citing competitive offers",
        "Opt for shorter tenure — some lenders offer rate discounts for shorter terms"
      ]
    },
    {
      title: "Personal Loan Tax Benefits – Section 80E",
      slug: "personal-loan-tax-benefits",
      summary: "While personal loans generally don't offer tax benefits, there are specific scenarios where you can claim deductions.",
      keyPoints: [
        "Personal loan for home renovation: Interest deductible under Section 24(b) up to ₹30,000",
        "Personal loan for business: Interest deductible as a business expense",
        "Personal loan for education: Interest deductible under Section 80E (no upper limit)",
        "Principal repayment generally not tax deductible for personal loans",
        "Always maintain proper documentation of fund usage for tax claims"
      ]
    }
  ],
  rates: [
    {
      title: "SBI Personal Loan Interest Rate",
      slug: "sbi-personal-loan-rate",
      bank: "State Bank of India",
      rate: "11.00% – 14.00% p.a.",
      effectiveRate: "11.65% (incl. processing fee)",
      processingFee: "1.50% of loan amount + GST",
      prepayment: "3% of outstanding principal after 6 months",
      details: [
        "Floating rate linked to RBI repo rate",
        "Special rate of 10.75% for SBI salary account holders",
        "Rate varies based on CIBIL score and income level",
        "No rate negotiation available — system-generated based on profile"
      ]
    },
    {
      title: "HDFC Personal Loan Interest Rate",
      slug: "hdfc-personal-loan-rate",
      bank: "HDFC Bank",
      rate: "10.50% – 21.00% p.a.",
      effectiveRate: "11.45% (incl. processing fee)",
      processingFee: "Up to 2.50% of loan amount + GST",
      prepayment: "4% of outstanding principal",
      details: [
        "Fixed interest rate throughout the tenure",
        "Pre-approved customers get rates as low as 10.50%",
        "Processing fee waiver during festive offers",
        "Rate depends on employer category, income, and credit score"
      ]
    },
    {
      title: "ICICI Personal Loan Interest Rate",
      slug: "icici-personal-loan-rate",
      bank: "ICICI Bank",
      rate: "10.75% – 19.00% p.a.",
      effectiveRate: "11.85% (incl. processing fee)",
      processingFee: "Up to 2.25% of loan amount + GST",
      prepayment: "No charges after 12 EMIs",
      details: [
        "Fixed rate for entire tenure",
        "Pre-approved offers via iMobile app",
        "Lower rates for ICICI salary account holders",
        "Step-up EMI option available for young professionals"
      ]
    },
    {
      title: "Axis Bank Personal Loan Interest Rate",
      slug: "axis-personal-loan-rate",
      bank: "Axis Bank",
      rate: "10.49% – 22.00% p.a.",
      effectiveRate: "11.25% (incl. processing fee)",
      processingFee: "Up to 2.00% of loan amount + GST",
      prepayment: "5% of outstanding after 12 months",
      details: [
        "One of the lowest starting rates in the market",
        "Rate based on employer category and relationship with bank",
        "Part-prepayment allowed after 12 EMIs",
        "Special rates for Axis salary account customers"
      ]
    },
    {
      title: "Bajaj Finserv Personal Loan Interest Rate",
      slug: "bajaj-finserv-personal-loan-rate",
      bank: "Bajaj Finserv",
      rate: "11.00% – 25.00% p.a.",
      effectiveRate: "12.50% (incl. processing fee)",
      processingFee: "Up to 3.54% of loan amount + GST",
      prepayment: "Part-prepayment allowed after 12 EMIs",
      details: [
        "Flexi loan facility — borrow and repay as needed",
        "Longer tenure of up to 7 years for lower EMIs",
        "Pre-approved offers for existing Bajaj Finserv customers",
        "Higher processing fee but competitive effective rate for high amounts"
      ]
    }
  ],
  eligibilityDocs: [
    {
      title: "How to Apply Online?",
      slug: "how-to-apply-online",
      description: "Step-by-step guide to applying for a personal loan online through CreduPe.",
      points: [
        "Visit CreduPe and click 'Apply for Personal Loan'",
        "Enter basic details: name, income, employer, loan amount needed",
        "Compare offers from 80+ lenders side by side",
        "Select the best offer and complete KYC verification online",
        "Upload required documents (salary slips, bank statements, ID proof)",
        "Receive approval within hours and disbursal within 24 hours"
      ]
    },
    {
      title: "Personal Loan EMI Calculator",
      slug: "personal-loan-emi-calculator",
      description: "Understand how EMI is calculated and plan your repayment effectively.",
      points: [
        "EMI = [P × R × (1+R)^N] / [(1+R)^N – 1] where P = Principal, R = Monthly rate, N = Months",
        "Example: ₹5L at 11% for 36 months = ₹16,369/month EMI",
        "Example: ₹10L at 10.5% for 48 months = ₹25,608/month EMI",
        "Lower interest rate can save ₹10,000–₹50,000 over the loan tenure",
        "Use CreduPe's EMI calculator for instant and accurate calculations"
      ]
    },
    {
      title: "Eligibility Checker",
      slug: "eligibility-checker",
      description: "Key factors that determine your personal loan eligibility.",
      points: [
        "CIBIL Score: 700+ recommended (650 minimum with some lenders)",
        "Monthly income: ₹15,000+ for salaried, ₹2L+ annual for self-employed",
        "Age: 21–60 years (varies by lender)",
        "Employment: Minimum 1–2 years total work experience",
        "Existing debt: EMI-to-income ratio should be below 50%",
        "Employer category: Government/PSU employees get preferential treatment"
      ]
    },
    {
      title: "Documents Required",
      slug: "documents-required",
      description: "Complete list of documents needed for personal loan application.",
      points: [
        "Identity Proof: PAN Card (mandatory), Aadhaar Card, Passport, Voter ID",
        "Address Proof: Aadhaar, utility bill, rent agreement, passport",
        "Income Proof: Last 3 months salary slips, Form 16, ITR (2 years)",
        "Bank Statements: Last 6 months from salary account",
        "Employment Proof: Offer letter, experience certificate, employee ID",
        "Photos: 2 passport-size photographs"
      ]
    },
    {
      title: "Personal Loan vs Gold Loan",
      slug: "personal-loan-vs-gold-loan",
      description: "Comparison between personal loans and gold loans to help you choose the right option.",
      points: [
        "Personal Loan: Unsecured, 10.49%–24% p.a. | Gold Loan: Secured, 7%–12% p.a.",
        "Personal Loan: No collateral needed | Gold Loan: Gold jewellery required",
        "Personal Loan: CIBIL score mandatory | Gold Loan: No credit check",
        "Personal Loan: Higher amount (up to ₹40L) | Gold Loan: Limited by gold value (75% LTV)",
        "Personal Loan: Longer tenure (up to 7 years) | Gold Loan: Shorter (up to 3 years)",
        "Choose Personal Loan for larger, unsecured needs; Gold Loan for quick, low-cost borrowing"
      ]
    }
  ]
};

const goldLoanData: ProductSidebarData = {
  lenders: [
    {
      name: "SBI Gold Loan",
      slug: "sbi-gold-loan",
      interestRate: "7.30% – 7.50% p.a.",
      processingFee: "0.50% of loan amount + GST",
      maxAmount: "₹50 Lakh",
      tenure: "Up to 36 months",
      eligibility: ["Age: 18 – 70 years", "Indian citizen", "Gold purity: 18–24 carat", "Minimum 10 grams gold", "No income proof required"],
      documents: ["Aadhaar & PAN Card", "Passport-size photos", "Gold ornaments for pledge", "Address proof"],
      features: ["Lowest gold loan rates among banks", "Overdraft facility available", "Online application via YONO", "Bullet repayment option"],
      description: "SBI offers the lowest interest rates on gold loans among all major banks, with flexible repayment options and secure gold storage."
    },
    {
      name: "HDFC Gold Loan",
      slug: "hdfc-gold-loan",
      interestRate: "8.50% – 17.86% p.a.",
      processingFee: "1.50% of loan amount + GST",
      maxAmount: "₹50 Lakh",
      tenure: "Up to 24 months",
      eligibility: ["Age: 18 – 65 years", "Salaried or self-employed", "Gold purity: 22 carat minimum", "Minimum weight varies by branch", "Valid KYC documents"],
      documents: ["PAN Card & Aadhaar", "Address proof", "Passport-size photos", "Gold for pledging"],
      features: ["Quick processing within 45 minutes", "Doorstep gold pick-up in select cities", "Multiple repayment options", "Top-up facility available"],
      description: "HDFC Bank provides gold loans with quick processing and the convenience of doorstep gold pickup service in select cities."
    },
    {
      name: "ICICI Gold Loan",
      slug: "icici-gold-loan",
      interestRate: "10.00% – 17.00% p.a.",
      processingFee: "1.00% of loan amount + GST",
      maxAmount: "₹1 Crore",
      tenure: "Up to 12 months",
      eligibility: ["Age: 18 – 70 years", "Indian resident", "18–24 carat gold accepted", "No income documents needed", "Available pan-India"],
      documents: ["Valid photo ID", "Address proof", "Gold ornaments", "PAN Card (for loans above ₹50,000)"],
      features: ["High loan amount up to ₹1 Crore", "30-minute disbursal", "Online gold loan renewal", "Insured gold storage"],
      description: "ICICI Bank offers gold loans with one of the highest loan amounts in the market and 30-minute quick disbursal."
    },
    {
      name: "Axis Gold Loan",
      slug: "axis-gold-loan",
      interestRate: "9.75% – 17.00% p.a.",
      processingFee: "1.00% of loan amount + GST",
      maxAmount: "₹25 Lakh",
      tenure: "Up to 24 months",
      eligibility: ["Age: 18 – 70 years", "Indian citizen", "Minimum 18 carat gold", "Valid KYC mandatory", "No credit score check"],
      documents: ["Aadhaar & PAN Card", "Passport-size photos", "Gold jewellery", "Address proof"],
      features: ["No credit score requirement", "Interest-only EMI option", "Secure vault storage", "Part-release of gold allowed"],
      description: "Axis Bank offers gold loans with flexible EMI options and the unique benefit of partial gold release on partial repayment."
    },
    {
      name: "Canara Gold Loan",
      slug: "canara-gold-loan",
      interestRate: "7.65% – 9.85% p.a.",
      processingFee: "0.50% of loan amount + GST",
      maxAmount: "₹35 Lakh",
      tenure: "Up to 12 months",
      eligibility: ["Age: 18 – 70 years", "Indian national", "18–24 carat gold", "Minimum 10 grams", "Existing or new customer"],
      documents: ["Photo ID proof", "Address proof", "Gold ornaments", "Passport-size photos"],
      features: ["Among the lowest rates in PSU banks", "Quick 20-minute processing", "No foreclosure charges", "Renewal facility available"],
      description: "Canara Bank offers affordable gold loans with one of the lowest processing fees and quick turnaround time."
    },
    {
      name: "PNB Gold Loan",
      slug: "pnb-gold-loan",
      interestRate: "7.70% – 8.75% p.a.",
      processingFee: "0.70% of loan amount + GST",
      maxAmount: "₹25 Lakh",
      tenure: "Up to 12 months",
      eligibility: ["Age: 18 – 75 years", "Indian citizen", "18–24 carat gold accepted", "No minimum income required", "Available at all PNB branches"],
      documents: ["Aadhaar Card", "PAN Card", "Gold jewellery", "Passport-size photos"],
      features: ["Competitive PSU bank rates", "No income proof needed", "Bullet payment option", "Safe locker storage"],
      description: "Punjab National Bank provides gold loans at competitive public sector rates with minimal documentation requirements."
    },
    {
      name: "Muthoot Gold Loan",
      slug: "muthoot-gold-loan",
      interestRate: "12.00% – 26.00% p.a.",
      processingFee: "1.00% of loan amount + GST",
      maxAmount: "₹1.5 Crore",
      tenure: "Up to 24 months",
      eligibility: ["Age: 18 – 75 years", "Indian resident", "18–24 carat gold", "Minimum 1 gram gold", "No income verification"],
      documents: ["Any valid photo ID", "Address proof", "Gold ornaments", "One photo"],
      features: ["India's largest gold loan NBFC", "5,600+ branches nationwide", "Instant disbursal", "Multiple loan schemes available"],
      description: "Muthoot Finance is India's largest gold loan NBFC with the widest branch network and instant disbursal facility."
    },
    {
      name: "Manappuram Gold Loan",
      slug: "manappuram-gold-loan",
      interestRate: "12.00% – 26.00% p.a.",
      processingFee: "1.00% of loan amount + GST",
      maxAmount: "₹1 Crore",
      tenure: "Up to 12 months",
      eligibility: ["Age: 18 – 75 years", "Indian national", "18 carat and above gold", "No minimum weight requirement", "Walk-in facility at any branch"],
      documents: ["Photo ID proof", "Address proof", "Gold jewellery/coins", "One photograph"],
      features: ["Online gold loan scheme (OGL)", "3,000+ branches", "Quick renewal process", "Interest-only payment option"],
      description: "Manappuram Finance offers flexible gold loan schemes including an innovative online gold loan facility."
    }
  ],
  insights: [
    {
      title: "5 Loan Options With No CIBIL Score Check",
      slug: "no-cibil-loan-options",
      summary: "Gold loans, loans against FD, and other secured lending options that don't require a credit score check.",
      keyPoints: [
        "Gold Loans: Use gold as collateral, no CIBIL check required",
        "Loan Against Fixed Deposit: Borrow up to 90% of FD value without credit check",
        "Loan Against Insurance Policy: Use LIC or other insurance as collateral",
        "Loan Against Mutual Funds: Pledge your MF units for instant credit",
        "Peer-to-Peer Lending: Alternative platforms with relaxed credit requirements"
      ]
    },
    {
      title: "What is 916 Gold? 22K vs 24K Purity",
      slug: "916-gold-22k-vs-24k",
      summary: "Understanding gold purity is essential when pledging gold for a loan. 916 hallmark means 22 carat (91.6% pure gold).",
      keyPoints: [
        "916 Gold = 22 Carat = 91.6% pure gold (most common for jewellery)",
        "24K Gold = 99.9% pure gold (too soft for jewellery, used in coins/bars)",
        "18K Gold = 75% pure gold (minimum accepted by most lenders)",
        "Higher purity = Higher per-gram valuation for your gold loan",
        "Always check for BIS hallmark before pledging gold"
      ]
    },
    {
      title: "Gold vs Silver – Which is Better as Collateral?",
      slug: "gold-vs-silver-collateral",
      summary: "While gold is the most widely accepted collateral, understanding how silver compares helps make informed decisions.",
      keyPoints: [
        "Gold loans are offered by almost all banks & NBFCs; silver loans are rare",
        "Gold has a higher per-gram value, requiring less quantity for larger loans",
        "Gold loan interest rates (7%–12%) are lower than silver loan rates",
        "Gold is more liquid and easier to appraise than silver",
        "Silver loans are offered by select NBFCs with higher rates and lower LTV"
      ]
    },
    {
      title: "RBI Rules for Gold Loan – Latest 2024",
      slug: "rbi-gold-loan-rules",
      summary: "Key RBI regulations governing gold loans including LTV ratio, auction rules, and lender compliance requirements.",
      keyPoints: [
        "Maximum LTV ratio capped at 75% of gold's market value",
        "Mandatory 30-day notice before auctioning defaulted gold",
        "All gold must be stored in insured, secure vaults by the lender",
        "NBFCs must maintain a minimum net owned fund of ₹2 crore",
        "Gold appraisal must be done by a certified appraiser"
      ]
    },
    {
      title: "4 Primary Ways to Finance With Gold",
      slug: "ways-to-finance-gold",
      summary: "Beyond traditional gold loans, there are multiple ways to leverage your gold for financing needs.",
      keyPoints: [
        "Gold Loan from Banks: Lowest rates (7%–10% p.a.) with secure storage",
        "Gold Loan from NBFCs: Higher rates but faster processing and wider access",
        "Gold Credit Card: Some banks offer credit against gold collateral",
        "Gold Monetisation Scheme: Earn interest on idle gold deposited with banks"
      ]
    }
  ],
  rates: [
    {
      title: "SBI Gold Loan Interest Rate",
      slug: "sbi-gold-loan-rate",
      bank: "State Bank of India",
      rate: "7.30% – 7.50% p.a.",
      effectiveRate: "7.55% (incl. processing fee)",
      processingFee: "0.50% of loan amount + GST",
      prepayment: "No prepayment charges",
      details: ["Linked to RBI repo rate", "Lowest among all banks", "Different rates for different gold loan schemes", "Renewal at prevailing rates"]
    },
    {
      title: "HDFC Gold Loan Interest Rate",
      slug: "hdfc-gold-loan-rate",
      bank: "HDFC Bank",
      rate: "8.50% – 17.86% p.a.",
      effectiveRate: "9.25% (incl. processing fee)",
      processingFee: "1.50% of loan amount + GST",
      prepayment: "No prepayment charges",
      details: ["Rate varies based on loan scheme selected", "Lower rates for existing HDFC customers", "Bullet repayment option available", "Top-up at same rate for existing loans"]
    },
    {
      title: "Muthoot Finance Interest Rate",
      slug: "muthoot-gold-loan-rate",
      bank: "Muthoot Finance",
      rate: "12.00% – 26.00% p.a.",
      effectiveRate: "13.00% (incl. processing fee)",
      processingFee: "1.00% + GST",
      prepayment: "No prepayment charges",
      details: ["Multiple schemes with different rates", "Rates depend on loan amount and tenure", "Special festive season rate offers", "Online renewal at reduced rates"]
    },
    {
      title: "Manappuram Interest Rate",
      slug: "manappuram-gold-loan-rate",
      bank: "Manappuram Finance",
      rate: "12.00% – 26.00% p.a.",
      effectiveRate: "13.25% (incl. processing fee)",
      processingFee: "1.00% + GST",
      prepayment: "No prepayment penalty",
      details: ["Multiple loan schemes for different needs", "OGL scheme with competitive rates", "Interest calculated on reducing balance", "Rate depends on scheme and tenure"]
    },
    {
      title: "ICICI Gold Loan Interest Rate",
      slug: "icici-gold-loan-rate",
      bank: "ICICI Bank",
      rate: "10.00% – 17.00% p.a.",
      effectiveRate: "10.75% (incl. processing fee)",
      processingFee: "1.00% + GST",
      prepayment: "No prepayment charges",
      details: ["Flat rate applicable on some schemes", "Preferential rates for ICICI account holders", "Rate varies based on gold weight and loan amount", "Online renewal facility available"]
    }
  ],
  eligibilityDocs: [
    {
      title: "How to Apply Online?",
      slug: "how-to-apply-gold-loan",
      description: "Step-by-step guide to applying for a gold loan online or at a branch.",
      points: [
        "Visit CreduPe and compare gold loan offers from 30+ lenders",
        "Select a lender with the best rate and nearest branch",
        "Visit the branch with your gold ornaments and KYC documents",
        "Gold appraiser evaluates purity and weight",
        "Loan sanctioned based on gold value (up to 75% LTV)",
        "Amount disbursed to your bank account or via cheque within 30 minutes"
      ]
    },
    {
      title: "Gold Loan EMI Calculator",
      slug: "gold-loan-emi-calculator",
      description: "Calculate your gold loan EMI and plan repayment options.",
      points: [
        "Bullet repayment: Pay interest monthly, principal at maturity",
        "Regular EMI: Fixed monthly payments of principal + interest",
        "Interest-only: Pay interest periodically, principal at end",
        "Example: ₹5L at 8.5% for 12 months = ₹43,587/month EMI",
        "Use CreduPe's calculator for instant and accurate EMI computation"
      ]
    },
    {
      title: "Eligibility Checker",
      slug: "gold-loan-eligibility",
      description: "Key factors that determine your gold loan eligibility.",
      points: [
        "Age: 18–75 years (varies by lender)",
        "Gold Purity: Minimum 18 carat (22K preferred)",
        "No income proof or CIBIL score required",
        "Both new and existing customers eligible",
        "Gold coins up to 50 grams accepted",
        "Studded jewellery accepted but only gold portion valued"
      ]
    },
    {
      title: "Documents Required",
      slug: "gold-loan-documents",
      description: "Minimal documentation needed for a gold loan.",
      points: [
        "Photo ID: Aadhaar, PAN, Voter ID, or Passport",
        "Address Proof: Aadhaar, utility bill, or rent agreement",
        "Passport-size photographs (1-2)",
        "Gold jewellery or gold coins for pledging",
        "No income proof or bank statements required"
      ]
    },
    {
      title: "Gold Loan vs Personal Loan",
      slug: "gold-vs-personal-loan",
      description: "Detailed comparison to help you choose between gold loan and personal loan.",
      points: [
        "Gold Loan: 7%–12% p.a. | Personal Loan: 10.49%–24% p.a.",
        "Gold Loan: No credit check | Personal Loan: CIBIL 650+ needed",
        "Gold Loan: 30-minute disbursal | Personal Loan: 24–48 hours",
        "Gold Loan: Shorter tenure (up to 3 yrs) | Personal Loan: Up to 7 years",
        "Gold Loan: Risk of losing gold on default | Personal Loan: No asset risk",
        "Choose Gold Loan for quick, low-cost funds; Personal Loan for higher amounts"
      ]
    }
  ]
};

const homeLoanData: ProductSidebarData = {
  lenders: [
    {
      name: "SBI Home Loan",
      slug: "sbi-home-loan",
      interestRate: "8.50% – 9.85% p.a.",
      processingFee: "0.35% of loan amount + GST",
      maxAmount: "Up to ₹10 Crore",
      tenure: "Up to 30 years",
      eligibility: ["Age: 18 – 70 years", "Minimum income: ₹25,000/month", "CIBIL Score: 700+", "Min 2 years employment", "Property must be SBI approved"],
      documents: ["PAN & Aadhaar", "Salary slips (6 months)", "Bank statements (12 months)", "Property documents", "ITR (2 years)"],
      features: ["Lowest rates among large banks", "No prepayment charges on floating rate", "Top-up loan available", "Balance transfer facility"],
      description: "SBI offers the most competitive home loan rates among large banks with the widest branch network for easy access."
    },
    {
      name: "HDFC Home Loan",
      slug: "hdfc-home-loan",
      interestRate: "8.75% – 9.65% p.a.",
      processingFee: "0.50% of loan amount + GST",
      maxAmount: "Up to ₹10 Crore",
      tenure: "Up to 30 years",
      eligibility: ["Age: 21 – 65 years", "Minimum income: ₹30,000/month", "CIBIL Score: 725+", "Min 3 years work experience", "Salaried and self-employed eligible"],
      documents: ["Identity & address proof", "Income proof (6 months)", "Bank statements (6 months)", "Property papers", "Builder/society documents"],
      features: ["India's largest home loan provider", "Dedicated relationship manager", "Online tracking portal", "Flexible EMI options"],
      description: "HDFC Bank is India's largest home loan lender with decades of experience and a seamless digital loan journey."
    },
    {
      name: "ICICI Home Loan",
      slug: "icici-home-loan",
      interestRate: "8.75% – 9.85% p.a.",
      processingFee: "0.50% of loan amount + GST",
      maxAmount: "Up to ₹5 Crore",
      tenure: "Up to 30 years",
      eligibility: ["Age: 21 – 62 years", "Minimum income: ₹25,000/month", "CIBIL Score: 700+", "Min 2 years employment", "Indian citizen or NRI"],
      documents: ["KYC documents", "Salary slips (3 months)", "Bank statements (6 months)", "Property documents", "Builder agreement"],
      features: ["Instant sanction for pre-approved", "NRI home loan available", "Step-up EMI option", "Online EMI payment"],
      description: "ICICI Bank provides home loans with digital-first processing and special schemes for NRI borrowers."
    },
    {
      name: "Axis Home Loan",
      slug: "axis-home-loan",
      interestRate: "8.75% – 13.30% p.a.",
      processingFee: "1.00% of loan amount + GST",
      maxAmount: "Up to ₹5 Crore",
      tenure: "Up to 20 years",
      eligibility: ["Age: 21 – 60 years", "Minimum income: ₹25,000/month", "CIBIL Score: 700+", "Min 2 years work experience", "Salaried professionals preferred"],
      documents: ["PAN & Aadhaar", "Income proof", "Bank statements (6 months)", "Property documents", "Employment proof"],
      features: ["Quick approval process", "Overdraft facility on home loan", "Balance transfer with top-up", "Attractive rates for women borrowers"],
      description: "Axis Bank offers home loans with a quick approval process and attractive rates for women borrowers."
    },
    {
      name: "Bank of Baroda Home Loan",
      slug: "bob-home-loan",
      interestRate: "8.40% – 10.65% p.a.",
      processingFee: "0.25% of loan amount + GST",
      maxAmount: "Up to ₹10 Crore",
      tenure: "Up to 30 years",
      eligibility: ["Age: 21 – 65 years", "Minimum income: ₹20,000/month", "CIBIL Score: 675+", "Min 2 years employment", "Indian residents and NRIs"],
      documents: ["Identity proof", "Income proof", "Property papers", "Bank statements (6 months)", "Form 16 / ITR"],
      features: ["Among lowest processing fees", "Competitive PSU bank rates", "No prepayment penalty", "NRI housing loan scheme"],
      description: "Bank of Baroda offers home loans at competitive public sector rates with one of the lowest processing fees in the market."
    },
    {
      name: "PNB Home Loan",
      slug: "pnb-home-loan",
      interestRate: "8.45% – 10.25% p.a.",
      processingFee: "0.35% of loan amount + GST",
      maxAmount: "Up to ₹10 Crore",
      tenure: "Up to 30 years",
      eligibility: ["Age: 18 – 65 years", "Minimum income: ₹20,000/month", "CIBIL Score: 675+", "Min 1 year employment", "Available pan-India"],
      documents: ["PAN & Aadhaar", "Salary slips (3 months)", "Bank statements (6 months)", "Property documents", "Photos"],
      features: ["Affordable PSU rates", "Long tenure up to 30 years", "No foreclosure charges", "PNB Housing Finance subsidiary support"],
      description: "Punjab National Bank provides affordable home loans with extensive branch coverage across India."
    },
    {
      name: "LIC Housing Finance",
      slug: "lic-home-loan",
      interestRate: "8.50% – 10.50% p.a.",
      processingFee: "0.50% of loan amount + GST",
      maxAmount: "Up to ₹10 Crore",
      tenure: "Up to 30 years",
      eligibility: ["Age: 18 – 65 years", "Minimum income: ₹25,000/month", "CIBIL Score: 700+", "Min 2 years employment", "LIC policyholders get preference"],
      documents: ["KYC documents", "Income proof", "Property documents", "Bank statements (6 months)", "LIC policy details (if applicable)"],
      features: ["Preferential rates for LIC policyholders", "Long-standing HFC with proven track record", "Online loan management portal", "Top-up loan facility"],
      description: "LIC Housing Finance is one of India's oldest housing finance companies offering preferential rates to LIC policyholders."
    },
    {
      name: "Kotak Home Loan",
      slug: "kotak-home-loan",
      interestRate: "8.75% – 9.65% p.a.",
      processingFee: "0.50% of loan amount + GST",
      maxAmount: "Up to ₹5 Crore",
      tenure: "Up to 20 years",
      eligibility: ["Age: 21 – 60 years", "Minimum income: ₹30,000/month", "CIBIL Score: 725+", "Min 2 years work experience", "Salaried and self-employed eligible"],
      documents: ["Identity & address proof", "Income documents", "Property documents", "Bank statements", "Employment proof"],
      features: ["Digital loan journey", "Quick sanction in 48 hours", "Flexible repayment options", "Dedicated loan advisor"],
      description: "Kotak Mahindra Bank offers a fully digital home loan experience with quick sanction and competitive rates."
    }
  ],
  insights: [
    { title: "Home Loan vs Rent – What's Better in 2026?", slug: "home-loan-vs-rent", summary: "Analysis of whether buying a home with a loan or continuing to rent is financially better in the current market.", keyPoints: ["EMI vs rent comparison for major Indian cities", "Property appreciation trends in tier-1 and tier-2 cities", "Tax benefits of home ownership reduce effective cost by 20-30%", "Renting gives flexibility; owning builds long-term wealth", "Break-even period: typically 7–10 years of ownership"] },
    { title: "How to Get Home Loan with Low CIBIL Score", slug: "home-loan-low-cibil", summary: "Strategies for getting a home loan approved even with a credit score below 700.", keyPoints: ["Apply with PSU banks which are more lenient (675+ accepted)", "Increase down payment to 30-40% to reduce lender risk", "Add co-applicant with strong income and credit score", "Consider smaller loan amount to improve approval chances", "Show stable income and employment for at least 3+ years"] },
    { title: "PMAY Subsidy – Complete Guide for First-Time Buyers", slug: "pmay-subsidy-guide", summary: "Everything you need to know about the Pradhan Mantri Awas Yojana interest subsidy for first-time home buyers.", keyPoints: ["EWS/LIG: 6.5% subsidy on ₹6L for 20 years (save up to ₹2.67L)", "MIG-I: 4% subsidy on ₹9L for 20 years (save up to ₹2.35L)", "MIG-II: 3% subsidy on ₹12L for 20 years (save up to ₹2.30L)", "Must be first-time home buyer with no pucca house in India", "Apply through any PMAY-approved lending institution"] },
    { title: "Home Loan Tax Benefits Under Section 80C & 24(b)", slug: "home-loan-tax-benefits", summary: "Maximize your tax savings with home loan deductions under the Income Tax Act.", keyPoints: ["Section 80C: Up to ₹1.5L deduction on principal repayment", "Section 24(b): Up to ₹2L deduction on interest paid (self-occupied)", "Section 80EEA: Additional ₹1.5L for first-time buyers (stamp value ≤ ₹45L)", "Joint home loan: Both borrowers can claim separate deductions", "Total savings: Up to ₹5L+ per year for joint borrowers in highest tax bracket"] },
    { title: "5 Mistakes to Avoid When Taking a Home Loan", slug: "home-loan-mistakes", summary: "Common pitfalls that can cost you lakhs over the life of your home loan.", keyPoints: ["Not comparing lenders: Rate difference of 0.5% = ₹5-10L savings on ₹50L loan", "Choosing longest tenure blindly: Pay 40-60% more as interest over 30 years vs 15 years", "Ignoring processing fees: Can add ₹25,000–₹50,000 to your cost", "Not checking for pre-approved offers: Miss out on lower rates", "Skipping home loan insurance: Risk of family burden in case of unforeseen events"] }
  ],
  rates: [
    { title: "SBI Home Loan Interest Rate", slug: "sbi-home-loan-rate", bank: "SBI", rate: "8.50% – 9.85% p.a.", effectiveRate: "8.75% (incl. processing fee)", processingFee: "0.35% + GST", prepayment: "No charges (floating rate)", details: ["Linked to External Benchmark (Repo Rate)", "Women borrowers get 0.05% concession", "Rate varies based on CIBIL score and loan amount", "Automatic rate revision with repo rate changes"] },
    { title: "HDFC Home Loan Interest Rate", slug: "hdfc-home-loan-rate", bank: "HDFC Bank", rate: "8.75% – 9.65% p.a.", effectiveRate: "9.10% (incl. processing fee)", processingFee: "0.50% + GST", prepayment: "No charges (floating rate)", details: ["RPLR-based pricing for existing customers", "Pre-approved offers at lower rates", "Processing fee often waived during festive seasons", "Rate depends on CIBIL score (725+ preferred)"] },
    { title: "ICICI Home Loan Interest Rate", slug: "icici-home-loan-rate", bank: "ICICI Bank", rate: "8.75% – 9.85% p.a.", effectiveRate: "9.15% (incl. processing fee)", processingFee: "0.50% + GST", prepayment: "No charges (floating rate)", details: ["External benchmark linked to repo rate", "Special rates for women and NRIs", "Rate varies by loan amount slab", "Digital pre-approval gets faster processing"] },
    { title: "Bank of Baroda Home Loan Rate", slug: "bob-home-loan-rate", bank: "Bank of Baroda", rate: "8.40% – 10.65% p.a.", effectiveRate: "8.60% (incl. processing fee)", processingFee: "0.25% + GST (lowest in market)", prepayment: "No charges", details: ["Repo rate linked", "Lowest processing fee among major banks", "Special rates for government employees", "Aggressive pricing for balance transfer customers"] },
    { title: "LIC Housing Finance Interest Rate", slug: "lic-home-loan-rate", bank: "LIC Housing Finance", rate: "8.50% – 10.50% p.a.", effectiveRate: "8.85% (incl. processing fee)", processingFee: "0.50% + GST", prepayment: "No charges on floating rate", details: ["RPLR-based pricing system", "0.10% concession for LIC policyholders", "Different rates for salaried vs self-employed", "Rate depends on loan amount and tenure"] }
  ],
  eligibilityDocs: [
    { title: "How to Apply Online?", slug: "how-to-apply-home-loan", description: "Complete guide to applying for a home loan through CreduPe.", points: ["Compare home loan offers from 20+ banks on CreduPe", "Check eligibility using our free tool based on income and property details", "Select the best offer and initiate application online", "Upload KYC, income proof, and property documents", "Lender conducts property verification and legal check", "Loan sanctioned and disbursed in stages (for under-construction) or lump sum"] },
    { title: "Home Loan EMI Calculator", slug: "home-loan-emi-calculator", description: "Plan your EMI and total cost effectively.", points: ["Example: ₹50L at 8.5% for 20 years = ₹43,391/month EMI", "Example: ₹30L at 8.75% for 15 years = ₹30,208/month EMI", "Shorter tenure saves significantly — ₹50L at 8.5%: 20-year interest = ₹54L vs 30-year = ₹88L", "Part-prepayment of ₹1L/year can reduce tenure by 5+ years", "Use CreduPe's calculator for instant computation with prepayment scenarios"] },
    { title: "Eligibility Checker", slug: "home-loan-eligibility", description: "Key factors determining your home loan eligibility.", points: ["CIBIL Score: 700+ recommended (675+ for PSU banks)", "Income: Minimum ₹25,000/month (salaried), ₹3L+ annual (self-employed)", "FOIR: Fixed Obligation to Income Ratio should be below 55%", "Age at loan maturity should not exceed 60-65 years", "Property should be legally clear and approved by the lender", "Co-applicant's income can be added to increase eligible amount"] },
    { title: "Documents Required", slug: "home-loan-documents", description: "Comprehensive list of documents for home loan application.", points: ["KYC: PAN Card, Aadhaar, Passport (mandatory)", "Income: 6 months salary slips, Form 16, ITR (2 years)", "Bank Statements: 12 months from primary salary account", "Property: Sale agreement, title deed, approved plan, NOC", "Builder: RERA registration, commencement certificate, OC (for ready properties)", "Employment: Appointment letter, experience certificate, company ID"] },
    { title: "Home Loan vs Loan Against Property", slug: "home-loan-vs-lap", description: "Understanding the differences between home loan and LAP.", points: ["Home Loan: Only for property purchase/construction | LAP: Any purpose", "Home Loan: 8.35%–10% p.a. | LAP: 8.50%–12% p.a.", "Home Loan: Up to 80-90% LTV | LAP: Up to 60-75% LTV", "Home Loan: Up to 30 years tenure | LAP: Up to 15-20 years", "Home Loan: Tax benefits on principal & interest | LAP: Limited tax benefits", "Choose Home Loan for property purchase; LAP for business/personal needs against owned property"] }
  ]
};

// Simplified data for other products
const carLoanData: ProductSidebarData = {
  lenders: [
    { name: "SBI Car Loan", slug: "sbi-car-loan", interestRate: "9.25% p.a. onwards", processingFee: "0.50% of loan amount + ST", maxAmount: "Up to ₹25 Lakh", tenure: "Up to 84 months", eligibility: ["Age: 21–65 years", "Minimum income: ₹15,000/month", "CIBIL Score: 700+", "Employment: Min 1 year"], documents: ["PAN & Aadhaar", "Salary slips (3 months)", "Bank statements (6 months)", "Proforma invoice of car"], features: ["Lowest rates among PSU banks", "Up to 85% on-road price financing", "NRI car loan scheme available", "Pre-approved offers for SBI customers"], description: "SBI offers competitive car loan rates with flexible tenure up to 7 years and special schemes for different customer segments." },
    { name: "ICICI Car Loan", slug: "icici-car-loan", interestRate: "9.55% p.a. onwards", processingFee: "₹2,500 – ₹5,000", maxAmount: "Up to ₹50 Lakh", tenure: "Up to 84 months", eligibility: ["Age: 21–65 years", "Minimum income: ₹20,000/month", "CIBIL Score: 700+", "Salaried & self-employed eligible"], documents: ["KYC documents", "Income proof", "Bank statements", "Car quotation"], features: ["Instant approval for pre-approved customers", "Up to 100% on-road price for select models", "Online application via iMobile app", "Flexible repayment options"], description: "ICICI Bank provides car loans with instant digital approval and financing up to 100% of on-road price for select customers." },
    { name: "HDFC Car Loan", slug: "hdfc-car-loan", interestRate: "9.35% p.a. onwards", processingFee: "₹2,825 – ₹5,150", maxAmount: "Up to ₹50 Lakh", tenure: "Up to 84 months", eligibility: ["Age: 21–60 years", "Minimum income: ₹20,000/month", "CIBIL Score: 725+", "Min 2 years work experience"], documents: ["PAN & Aadhaar", "Salary slips", "Bank statements", "Car proforma invoice"], features: ["Quick loan processing", "Balance transfer facility", "Top-up loan available", "No foreclosure charges on floating rate"], description: "HDFC Bank offers car loans with quick processing and attractive rates for both new and used cars." },
    { name: "Axis Bank Car Loan", slug: "axis-car-loan", interestRate: "9.50% p.a. onwards", processingFee: "₹3,500 – ₹5,500", maxAmount: "Up to ₹30 Lakh", tenure: "Up to 60 months", eligibility: ["Age: 21–60 years", "Minimum income: ₹15,000/month", "CIBIL Score: 700+", "Employment: Min 1 year current"], documents: ["Identity proof", "Income proof", "Address proof", "Car quotation"], features: ["Competitive interest rates", "Quick approval within 24 hours", "Online EMI calculator", "Flexible tenure options"], description: "Axis Bank provides car loans with quick approval turnaround and competitive rates for salaried professionals." },
    { name: "Kotak Car Loan", slug: "kotak-car-loan", interestRate: "9.10% p.a. onwards", processingFee: "₹2,000 – ₹5,000", maxAmount: "Up to ₹25 Lakh", tenure: "Up to 60 months", eligibility: ["Age: 21–65 years", "Minimum income: ₹15,000/month", "CIBIL Score: 700+", "Salaried & self-employed"], documents: ["PAN & Aadhaar", "Salary slips", "Bank statements", "Proforma invoice"], features: ["Among the lowest starting rates", "Digital application process", "Pre-approved offers", "No hidden charges"], description: "Kotak Mahindra Bank offers car loans with some of the lowest starting rates in the market." },
  ],
  insights: [
    { title: "New Car vs Used Car Loan – Which Saves More?", slug: "new-vs-used-car-loan", summary: "Comparing the total cost of financing a new car versus a used car.", keyPoints: ["New car loan: 9%–12% p.a. vs Used car: 12%–18% p.a.", "Depreciation is highest in first 2 years — used cars offer better value", "Insurance costs are lower for used cars", "New cars get longer tenure and higher financing", "2-3 year old cars offer the best value-for-money proposition"] },
    { title: "How to Get the Best Car Loan Deal", slug: "best-car-loan-deal", summary: "Tips for negotiating the lowest rate and best terms for your car loan.", keyPoints: ["Compare offers from at least 3-4 lenders before deciding", "Pre-approved offers usually have the best rates", "Dealer financing may seem convenient but is often costlier", "Higher down payment (25%+) gets better rates", "Festive season offers can save ₹10,000–₹25,000 on processing"] },
  ],
  rates: [
    { title: "SBI Car Loan Interest Rate", slug: "sbi-car-loan-rate", bank: "SBI", rate: "9.25% onwards", effectiveRate: "9.55% (incl. fees)", processingFee: "0.50% + ST", prepayment: "No charges on floating rate", details: ["Linked to repo rate", "Different schemes for new and used cars", "Special rates for SBI salary account holders", "NRI car loan at competitive rates"] },
    { title: "HDFC Car Loan Interest Rate", slug: "hdfc-car-loan-rate", bank: "HDFC Bank", rate: "9.35% onwards", effectiveRate: "9.75% (incl. fees)", processingFee: "₹2,825 – ₹5,150", prepayment: "2% of outstanding", details: ["Fixed rate for entire tenure", "Rate depends on car price and customer profile", "Lower rates for pre-approved customers", "Festive season discounts available"] },
  ],
  eligibilityDocs: [
    { title: "Interest Rates", slug: "car-loan-interest-rates", description: "Comprehensive comparison of car loan interest rates across banks.", points: ["SBI: 9.25% onwards — Best for PSU bank customers", "HDFC: 9.35% onwards — Quick processing", "ICICI: 9.55% onwards — Digital-first experience", "Rates depend on car model, loan amount, and customer profile", "Pre-approved offers can get rates 0.25%–0.50% lower"] },
    { title: "How to Apply Online?", slug: "car-loan-how-to-apply", description: "Apply for a car loan in simple steps.", points: ["Compare car loan offers on CreduPe from 10+ lenders", "Check eligibility and get pre-approved", "Select the car and get a proforma invoice from dealer", "Submit KYC and income documents online", "Loan sanctioned and disbursed directly to the dealer"] },
    { title: "Car Loan Eligibility Calculator", slug: "car-loan-eligibility", description: "Check how much car loan you can get.", points: ["Minimum income: ₹15,000/month for most banks", "Age: 21–65 years", "CIBIL Score: 700+ recommended", "Loan amount: Up to 85-100% of on-road price", "Existing EMI obligations reduce eligible amount"] },
    { title: "Car Loan EMI Calculator", slug: "car-loan-emi-calc", description: "Calculate your monthly car loan EMI.", points: ["₹5L at 9.25% for 5 years = ₹10,417/month", "₹8L at 9.50% for 7 years = ₹13,265/month", "Higher down payment reduces EMI significantly", "Shorter tenure = Higher EMI but much lower total interest"] },
    { title: "What are the benefits?", slug: "car-loan-benefits", description: "Key benefits of taking a car loan.", points: ["Own a car without depleting savings", "Tax benefits for self-employed on interest paid", "Build credit history with timely repayments", "Insurance bundling offers additional savings", "Flexible tenure options from 1 to 7 years"] },
    { title: "Car Loan Documents Required", slug: "car-loan-documents", description: "Documents needed for car loan application.", points: ["PAN Card & Aadhaar Card (mandatory)", "Salary slips (last 3-6 months)", "Bank statements (last 6 months)", "Proforma invoice from authorized dealer", "Passport-size photographs", "Address proof (utility bill/rent agreement)"] },
    { title: "FAQs", slug: "car-loan-faqs", description: "Common questions about car loans.", points: ["Minimum CIBIL: 700+ for best rates (650 accepted by some NBFCs)", "Maximum tenure: Up to 7 years for new cars, 5 years for used", "Down payment: Usually 10-20% of on-road price", "Prepayment: No charges on floating rate loans (per RBI)", "NRI eligible: Yes, most banks offer NRI car loan schemes"] },
  ]
};

const usedCarLoanData: ProductSidebarData = {
  lenders: [
    { name: "SBI Used Car Loan", slug: "sbi-used-car-loan", interestRate: "11.50% p.a. onwards", processingFee: "0.50% of loan amount", maxAmount: "₹10 Lakh", tenure: "Up to 60 months", eligibility: ["Age: 21–65 years", "Car age: Max 5 years old", "CIBIL: 700+", "Min income: ₹15,000/month"], documents: ["PAN & Aadhaar", "Income proof", "Car RC & insurance", "Valuation report"], features: ["Lowest used car loan rate", "Up to 80% of car value", "Quick processing", "No foreclosure charges"], description: "SBI offers the most competitive used car loan rates among major banks." },
    { name: "HDFC Used Car Loan", slug: "hdfc-used-car-loan", interestRate: "12.00% p.a. onwards", processingFee: "1.00% of loan amount", maxAmount: "₹15 Lakh", tenure: "Up to 60 months", eligibility: ["Age: 21–60 years", "Car age: Max 7 years old", "CIBIL: 700+", "Min income: ₹20,000/month"], documents: ["KYC documents", "Salary slips", "Bank statements", "Car documents"], features: ["Higher loan amount", "Certified pre-owned car loans", "Digital application", "Flexible tenure"], description: "HDFC Bank offers used car loans with higher loan amounts and certified pre-owned car financing." },
    { name: "ICICI Used Car Loan", slug: "icici-used-car-loan", interestRate: "12.50% p.a. onwards", processingFee: "1.00% of loan amount", maxAmount: "₹12 Lakh", tenure: "Up to 48 months", eligibility: ["Age: 21–58 years", "Car age: Max 5 years old", "CIBIL: 700+", "Salaried & self-employed"], documents: ["PAN & Aadhaar", "Income proof", "Car RC book", "Insurance copy"], features: ["Quick disbursal", "Online application", "Balance transfer option", "Part-prepayment allowed"], description: "ICICI Bank provides quick used car loans with online application and digital processing." },
  ],
  insights: [
    { title: "5 Tips for Buying a Used Car with Financing", slug: "used-car-buying-tips", summary: "Essential tips for making a smart used car purchase with loan financing.", keyPoints: ["Get the car inspected by an independent mechanic before buying", "Check the car's accident and service history thoroughly", "Compare loan rates from banks vs dealer financing", "Opt for certified pre-owned cars for better loan terms", "Negotiate the car price separately from the loan terms"] },
    { title: "Used Car Loan vs Personal Loan for Car Purchase", slug: "used-car-vs-personal-loan", summary: "Which loan type is better for buying a used car?", keyPoints: ["Used Car Loan: 11.50%–16% p.a. vs Personal Loan: 10.49%–24% p.a.", "Used Car Loan: Car is collateral vs Personal Loan: Unsecured", "Used Car Loan: Lower rates but car age restrictions apply", "Personal Loan: No car age limit but higher rates for lower credit scores", "Used Car Loan: Requires car valuation report and inspection"] },
  ],
  rates: [
    { title: "SBI Used Car Loan Interest Rate", slug: "sbi-used-car-rate", bank: "SBI", rate: "11.50% onwards", effectiveRate: "12.00%", processingFee: "0.50%", prepayment: "No charges", details: ["Lowest rate for used cars", "Car should not be older than 5 years", "Rate linked to repo rate"] },
    { title: "HDFC Used Car Loan Interest Rate", slug: "hdfc-used-car-rate", bank: "HDFC Bank", rate: "12.00% onwards", effectiveRate: "12.75%", processingFee: "1.00%", prepayment: "2% of outstanding", details: ["Accepts cars up to 7 years old", "Certified pre-owned cars get lower rates", "Processing fee may be waived during offers"] },
  ],
  eligibilityDocs: [
    { title: "How to Apply?", slug: "used-car-how-to-apply", description: "Steps to apply for a used car loan.", points: ["Compare used car loan offers on CreduPe", "Get the car inspected and valued", "Submit KYC, income proof, and car documents", "Loan sanctioned based on car valuation", "Amount disbursed to seller's account"] },
    { title: "Used Car Loan EMI Calculator", slug: "used-car-emi-calc", description: "Calculate your used car loan EMI.", points: ["₹3L at 12% for 3 years = ₹9,963/month", "₹5L at 12.5% for 4 years = ₹13,314/month", "Shorter tenure recommended for used cars", "Higher down payment reduces interest burden"] },
    { title: "Eligibility Criteria", slug: "used-car-eligibility", description: "Who can apply for a used car loan?", points: ["Age: 21–65 years", "Car age: Usually not older than 5–7 years at loan maturity", "CIBIL: 700+ for best rates", "Income: ₹15,000+/month", "The car must be registered and have valid insurance"] },
    { title: "Documents Required", slug: "used-car-documents", description: "Documents for used car loan.", points: ["PAN & Aadhaar", "Salary slips or income proof", "Car RC book and insurance copy", "Car valuation/inspection report", "Seller details and transfer documents"] },
  ]
};

const businessLoanData: ProductSidebarData = {
  lenders: [
    { name: "HDFC Business Loan", slug: "hdfc-business-loan", interestRate: "14.00% p.a. onwards", processingFee: "Up to 2.50%", maxAmount: "₹50 Lakh", tenure: "Up to 48 months", eligibility: ["Business vintage: Min 3 years", "Annual turnover: ₹15L+", "CIBIL: 700+", "Registered business entity"], documents: ["Business registration proof", "ITR (3 years)", "Bank statements (12 months)", "GST returns"], features: ["Quick disbursal within 72 hours", "No collateral required", "Overdraft facility", "Online application"], description: "HDFC Bank offers unsecured business loans with quick disbursal for established businesses." },
    { name: "SBI Business Loan", slug: "sbi-business-loan", interestRate: "14.30% p.a. onwards", processingFee: "Up to 1.50%", maxAmount: "₹25 Lakh", tenure: "Up to 48 months", eligibility: ["Business vintage: Min 2 years", "Annual turnover: ₹10L+", "CIBIL: 700+", "Indian business entity"], documents: ["Business proof", "ITR (2 years)", "Bank statements (6 months)", "KYC documents"], features: ["Lowest processing fee among banks", "MUDRA loans for micro businesses", "Stand-up India scheme", "No foreclosure charges"], description: "SBI offers business loans at competitive rates with government-backed MUDRA and Stand-up India schemes." },
    { name: "Bajaj Finserv Business Loan", slug: "bajaj-business-loan", interestRate: "14.00% p.a. onwards", processingFee: "Up to 3.50%", maxAmount: "₹80 Lakh", tenure: "Up to 60 months", eligibility: ["Business vintage: Min 3 years", "Annual turnover: ₹15L+", "CIBIL: 700+", "Self-employed professionals eligible"], documents: ["Business registration", "ITR (3 years)", "Bank statements (6 months)", "GST registration"], features: ["Highest loan amount among NBFCs", "Flexi loan facility", "Part-prepayment allowed", "Dedicated relationship manager"], description: "Bajaj Finserv provides the highest unsecured business loan amount in the market with flexible repayment." },
  ],
  insights: [
    { title: "MSME Loan Schemes by Government", slug: "msme-loan-schemes", summary: "Overview of government-backed loan schemes for micro, small, and medium enterprises.", keyPoints: ["MUDRA Loans: Up to ₹10L without collateral (Shishu/Kishore/Tarun)", "CGTMSE: Collateral-free loans up to ₹5 Cr with government guarantee", "Stand-up India: ₹10L–₹1Cr for SC/ST and women entrepreneurs", "PMEGP: Subsidy of 15-35% on project cost for new enterprises", "CLCSS: Technology upgradation subsidy of 15% on machinery"] },
    { title: "How to Improve Business Loan Approval Chances", slug: "improve-business-loan-approval", summary: "Strategies to increase your chances of getting a business loan approved.", keyPoints: ["Maintain a CIBIL score above 750", "Keep business bank account active with regular transactions", "File GST returns and ITR on time", "Show consistent revenue growth over 3+ years", "Apply for an amount proportional to your annual turnover (25-30%)"] },
  ],
  rates: [
    { title: "HDFC Business Loan Rate", slug: "hdfc-business-loan-rate", bank: "HDFC Bank", rate: "14.00% onwards", effectiveRate: "15.00%", processingFee: "Up to 2.50%", prepayment: "4% of outstanding", details: ["Fixed rate for entire tenure", "Rate based on business profile and CIBIL", "Festive discounts on processing fee"] },
    { title: "SBI Business Loan Rate", slug: "sbi-business-loan-rate", bank: "SBI", rate: "14.30% onwards", effectiveRate: "14.75%", processingFee: "Up to 1.50%", prepayment: "No charges after 12 EMIs", details: ["EBLR-linked rate", "Special MSME rates available", "MUDRA loans at subsidized rates"] },
  ],
  eligibilityDocs: [
    { title: "How to Apply?", slug: "business-loan-apply", description: "Steps to apply for a business loan.", points: ["Compare business loan offers on CreduPe", "Check eligibility based on turnover and vintage", "Upload business and financial documents", "Get approval within 72 hours", "Loan disbursed to business account"] },
    { title: "Eligibility Criteria", slug: "business-loan-eligibility", description: "Who can apply for a business loan?", points: ["Business vintage: Min 2–3 years", "Annual turnover: ₹10L–₹15L minimum", "CIBIL Score: 700+ preferred", "Business type: Proprietorship, partnership, Pvt Ltd, LLP", "Profitable for at least 2 consecutive years"] },
    { title: "Documents Required", slug: "business-loan-documents", description: "Documents for business loan application.", points: ["Business registration certificate", "GST registration and returns", "ITR with computation (3 years)", "Bank statements (12 months)", "KYC of proprietor/directors", "Audited financials (if applicable)"] },
  ]
};

const twoWheelerLoanData: ProductSidebarData = {
  lenders: [
    { name: "HDFC Two Wheeler Loan", slug: "hdfc-two-wheeler-loan", interestRate: "5.09% p.a. onwards", processingFee: "1% of loan amount", maxAmount: "Up to ₹5 Lakh", tenure: "Up to 48 months", eligibility: ["Age: 18–65 years", "Min income: ₹6,000/month", "Salaried & self-employed", "Valid driving license"], documents: ["PAN & Aadhaar", "Income proof", "Address proof", "Vehicle quotation"], features: ["Lowest two wheeler loan rate in market", "Up to 100% on-road financing", "Quick 2-hour disbursal", "No foreclosure charges"], description: "HDFC Bank offers the lowest two wheeler loan rates in the market with up to 100% financing." },
    { name: "SBI Two Wheeler Loan", slug: "sbi-two-wheeler-loan", interestRate: "9.25% p.a. onwards", processingFee: "0.50% of loan amount", maxAmount: "Up to ₹3 Lakh", tenure: "Up to 48 months", eligibility: ["Age: 21–65 years", "Min income: ₹10,000/month", "SBI account preferred", "Min 1 year employment"], documents: ["KYC documents", "Salary slips", "Bank statements", "Proforma invoice"], features: ["Competitive PSU rates", "Pre-approved offers for SBI customers", "No collateral required", "Simple documentation"], description: "SBI provides affordable two wheeler loans with pre-approved offers for existing customers." },
    { name: "Hero FinCorp Two Wheeler Loan", slug: "hero-fincorp-loan", interestRate: "Varies by profile", processingFee: "1.5% of loan amount", maxAmount: "Up to ₹3 Lakh", tenure: "Up to 36 months", eligibility: ["Age: 18–55 years", "Min income: ₹6,000/month", "Any employment type", "Valid KYC"], documents: ["Aadhaar Card", "PAN Card", "Income proof", "1 photograph"], features: ["Available at Hero dealerships", "Quick on-the-spot approval", "Flexible EMI options", "Minimal documentation"], description: "Hero FinCorp offers convenient two wheeler financing directly at Hero dealerships with on-the-spot approval." },
  ],
  insights: [
    { title: "Electric Two Wheeler Loan – A Complete Guide", slug: "electric-two-wheeler-loan", summary: "Everything about financing an electric scooter or bike.", keyPoints: ["Government subsidies under FAME II can reduce cost by ₹25,000–₹50,000", "Special green vehicle loan rates offered by some banks", "Lower running cost: ₹0.15/km vs ₹2/km for petrol", "Battery warranty is important — check before buying", "Resale value considerations for electric vehicles"] },
    { title: "0% Down Payment Two Wheeler Loans", slug: "zero-down-payment-two-wheeler", summary: "How to get a two wheeler loan with zero down payment.", keyPoints: ["HDFC and Bajaj Finance offer 100% financing for select models", "Zero down payment = higher EMI but immediate ownership", "Available mainly for new two wheelers from authorized dealers", "Good CIBIL score (700+) usually required", "Processing fee may be higher for 100% financing"] },
  ],
  rates: [
    { title: "HDFC Two Wheeler Loan Rate", slug: "hdfc-two-wheeler-rate", bank: "HDFC Bank", rate: "5.09% onwards", effectiveRate: "5.85%", processingFee: "1% of loan", prepayment: "No charges", details: ["Lowest rate in two wheeler segment", "Special rates for premium bikes", "100% financing available"] },
    { title: "SBI Two Wheeler Loan Rate", slug: "sbi-two-wheeler-rate", bank: "SBI", rate: "9.25% onwards", effectiveRate: "9.75%", processingFee: "0.50%", prepayment: "No charges on floating rate", details: ["PSU bank reliability", "Pre-approved offers for existing customers", "Linked to repo rate"] },
  ],
  eligibilityDocs: [
    { title: "How to Apply?", slug: "two-wheeler-how-to-apply", description: "Steps to get a two wheeler loan.", points: ["Compare offers on CreduPe", "Visit dealer with pre-approval", "Submit KYC and income proof", "Get approval within 2 hours", "Loan disbursed to dealer"] },
    { title: "EMI Calculator", slug: "two-wheeler-emi-calc", description: "Calculate two wheeler loan EMI.", points: ["₹1L at 9% for 2 years = ₹4,568/month", "₹1.5L at 5.09% for 3 years = ₹4,489/month", "Lower rate = significant savings over tenure"] },
    { title: "Eligibility & Documents", slug: "two-wheeler-eligibility-docs", description: "Requirements for two wheeler loan.", points: ["Age: 18–65 years", "Income: ₹6,000+/month", "Valid driving license (recommended)", "KYC: PAN & Aadhaar", "Vehicle proforma invoice from authorized dealer"] },
  ]
};

const microLoanData: ProductSidebarData = {
  lenders: [
    { name: "KreditBee Micro Loan", slug: "kreditbee-micro-loan", interestRate: "12% – 29.95% p.a.", processingFee: "1% – 6%", maxAmount: "₹1 Lakh", tenure: "3–15 months", eligibility: ["Age: 18–45 years", "Min income: ₹8,000/month", "Salaried or self-employed", "Active bank account"], documents: ["Aadhaar Card", "PAN Card", "Bank statement", "Selfie"], features: ["100% digital process", "Approval within 15 minutes", "No collateral", "Flexible tenure"], description: "KreditBee offers fully digital micro loans with approval in as little as 15 minutes." },
    { name: "MoneyTap Micro Loan", slug: "moneytap-micro-loan", interestRate: "13% – 25% p.a.", processingFee: "2%", maxAmount: "₹5 Lakh", tenure: "2–36 months", eligibility: ["Age: 21–55 years", "Min income: ₹15,000/month", "Salaried employees", "CIBIL: 600+"], documents: ["PAN & Aadhaar", "Salary slips", "Bank statements"], features: ["Credit line facility", "Pay interest only on amount used", "Instant top-up", "No usage charges"], description: "MoneyTap provides a credit line facility where you only pay interest on the amount you actually use." },
    { name: "EarlySalary Micro Loan", slug: "earlysalary-micro-loan", interestRate: "14% – 30% p.a.", processingFee: "2% – 4%", maxAmount: "₹2 Lakh", tenure: "3–24 months", eligibility: ["Age: 20–55 years", "Min income: ₹10,000/month", "Salaried & self-employed", "Active savings account"], documents: ["Aadhaar", "PAN", "Latest salary slip", "Bank statement"], features: ["Salary advance feature", "Instant approval", "Zero hidden charges", "Auto-repayment via mandate"], description: "EarlySalary specializes in salary advance and instant micro loans for working professionals." },
  ],
  insights: [
    { title: "Micro Loan vs Personal Loan – Which to Choose?", slug: "micro-vs-personal-loan", summary: "Understanding when to opt for a micro loan versus a regular personal loan.", keyPoints: ["Micro loans: ₹1K–₹5L, quick approval, higher rates | Personal loans: ₹50K–₹40L, lower rates", "Micro loans for urgent, small needs; personal loans for larger expenses", "Micro loans have simpler documentation requirements", "Personal loans offer longer tenure and lower EMIs", "Choose micro loans for emergencies; personal loans for planned expenses"] },
  ],
  rates: [
    { title: "KreditBee Interest Rate", slug: "kreditbee-rate", bank: "KreditBee", rate: "12%–29.95%", effectiveRate: "15%+", processingFee: "1%–6%", prepayment: "Allowed", details: ["Rate based on credit profile", "Lower rates for repeat customers", "Festive offers with reduced rates"] },
  ],
  eligibilityDocs: [
    { title: "How to Apply?", slug: "micro-loan-apply", description: "Apply for a micro loan in minutes.", points: ["Download the lender's app or visit CreduPe", "Complete KYC with Aadhaar and PAN", "Link bank account for auto-disbursal", "Get approval within 15–30 minutes", "Amount credited to bank instantly"] },
    { title: "Eligibility Criteria", slug: "micro-loan-eligibility", description: "Who can apply for a micro loan?", points: ["Age: 18–60 years", "Monthly income: ₹8,000+", "Active bank account with 3+ months history", "Valid Aadhaar and PAN", "No minimum CIBIL requirement with some lenders"] },
  ]
};

const loanAgainstPropertyData: ProductSidebarData = {
  lenders: [
    { name: "SBI LAP", slug: "sbi-lap", interestRate: "8.50% – 11.20% p.a.", processingFee: "Up to 1%", maxAmount: "Up to ₹7.5 Crore", tenure: "Up to 15 years", eligibility: ["Age: 21–65 years", "Property should be free from litigation", "Minimum income: ₹25,000/month", "CIBIL: 700+"], documents: ["Property documents", "KYC proof", "Income proof", "Bank statements (12 months)"], features: ["Lowest LAP rates among banks", "Both residential and commercial property accepted", "No end-use restriction", "Overdraft facility available"], description: "SBI offers the lowest loan against property rates with flexible end-use and overdraft facility." },
    { name: "HDFC LAP", slug: "hdfc-lap", interestRate: "9.50% – 11.50% p.a.", processingFee: "Up to 1.5%", maxAmount: "Up to ₹10 Crore", tenure: "Up to 15 years", eligibility: ["Age: 21–60 years", "Self-employed with 3+ years business vintage", "Salaried with 2+ years experience", "CIBIL: 725+"], documents: ["Property title deed", "Approved plan", "KYC documents", "ITR (3 years)", "Bank statements (12 months)"], features: ["Highest LAP amount in the market", "Quick processing within 7 working days", "Balance transfer with top-up", "Dedicated relationship manager"], description: "HDFC Bank provides the highest loan against property amount with quick processing and expert guidance." },
    { name: "Bajaj Finance LAP", slug: "bajaj-lap", interestRate: "9.50% – 13.00% p.a.", processingFee: "Up to 2%", maxAmount: "Up to ₹5 Crore", tenure: "Up to 18 years", eligibility: ["Age: 25–70 years at loan maturity", "Business vintage: 3+ years", "Property in approved locations", "CIBIL: 700+"], documents: ["Property documents", "Business proof", "ITR (3 years)", "Bank statements", "KYC documents"], features: ["Longest tenure in LAP segment (18 years)", "Flexi loan option available", "Part-prepayment without charges", "High LTV up to 75%"], description: "Bajaj Finance offers the longest LAP tenure with a unique flexi loan facility and high LTV ratio." },
  ],
  insights: [
    { title: "LAP vs Home Loan – Key Differences", slug: "lap-vs-home-loan", summary: "Understanding when to choose LAP over a home loan.", keyPoints: ["Home Loan: Only for property purchase | LAP: Any purpose allowed", "Home Loan: 8.35%–10% | LAP: 8.50%–13%", "Home Loan: Up to 90% LTV | LAP: Up to 75% LTV", "Home Loan: Better tax benefits | LAP: Limited deductions", "LAP is ideal when you need large funds for business or personal needs"] },
    { title: "How to Maximize LAP Amount", slug: "maximize-lap-amount", summary: "Strategies to get the highest possible loan against your property.", keyPoints: ["Ensure property is legally clear with no disputes", "Get a fresh market valuation from an approved valuer", "Apply with a lender offering higher LTV (70-75%)", "Add co-applicant to increase income eligibility", "Choose a lender that accepts commercial property for higher valuation"] },
  ],
  rates: [
    { title: "SBI LAP Interest Rate", slug: "sbi-lap-rate", bank: "SBI", rate: "8.50% – 11.20%", effectiveRate: "8.85%", processingFee: "Up to 1%", prepayment: "No charges (floating)", details: ["EBLR-linked rate", "Lowest LAP rate in market", "Special rates for govt employees"] },
    { title: "HDFC LAP Interest Rate", slug: "hdfc-lap-rate", bank: "HDFC Bank", rate: "9.50% – 11.50%", effectiveRate: "10.00%", processingFee: "Up to 1.5%", prepayment: "2% of outstanding", details: ["Fixed and floating rate options", "Rate based on property type and location", "Festive discounts available"] },
  ],
  eligibilityDocs: [
    { title: "How to Apply?", slug: "lap-how-to-apply", description: "Steps to apply for a loan against property.", points: ["Compare LAP offers on CreduPe from 15+ lenders", "Get property valued by approved valuer", "Submit property documents, KYC, and income proof", "Lender conducts legal and technical verification", "Loan sanctioned based on property value and income", "Amount disbursed to your bank account"] },
    { title: "Eligibility Criteria", slug: "lap-eligibility", description: "Who can apply for LAP?", points: ["Salaried: Min income ₹25,000/month with 2+ years experience", "Self-employed: Min 3 years business vintage with ₹5L+ annual income", "CIBIL Score: 700+ preferred", "Property: Should be free from encumbrances and legally clear", "Age: 21–65 years (at loan maturity)"] },
    { title: "Documents Required", slug: "lap-documents", description: "Documents for LAP application.", points: ["Property title deed and chain of documents", "Approved building plan and completion certificate", "Property tax receipts", "KYC: PAN, Aadhaar, photo ID", "Income proof: ITR (3 years), bank statements (12 months)", "Business proof (for self-employed)"] },
  ]
};

const creditCardsData: ProductSidebarData = {
  lenders: [
    { name: "HDFC Credit Cards", slug: "hdfc-credit-cards", interestRate: "3.49% per month (41.88% p.a.)", processingFee: "Joining fee: ₹500–₹10,000", maxAmount: "Up to ₹10 Lakh limit", tenure: "N/A", eligibility: ["Age: 21–60 years", "Min income: ₹15,000/month", "CIBIL: 700+", "Salaried or self-employed"], documents: ["PAN & Aadhaar", "Income proof", "Bank statements", "Address proof"], features: ["Largest credit card issuer in India", "Multiple card variants for every need", "SmartBuy portal for bonus rewards", "Diners Club lounge access"], description: "HDFC Bank is India's largest credit card issuer with a comprehensive range of cards from entry-level to ultra-premium." },
    { name: "SBI Credit Cards", slug: "sbi-credit-cards", interestRate: "3.35% per month (40.20% p.a.)", processingFee: "Joining fee: ₹499–₹4,999", maxAmount: "Up to ₹5 Lakh limit", tenure: "N/A", eligibility: ["Age: 21–60 years", "Min income: ₹12,000/month", "CIBIL: 650+", "Salaried employees preferred"], documents: ["PAN & Aadhaar", "Salary slips", "Bank statements"], features: ["Affordable annual fees", "Cashback and reward points", "SBI IRCTC card for train bookings", "EMI conversion facility"], description: "SBI offers affordable credit cards with competitive reward rates and special cards for specific spending categories." },
    { name: "Axis Credit Cards", slug: "axis-credit-cards", interestRate: "3.49% per month (41.88% p.a.)", processingFee: "Joining fee: ₹500–₹10,000", maxAmount: "Up to ₹8 Lakh limit", tenure: "N/A", eligibility: ["Age: 21–60 years", "Min income: ₹15,000/month", "CIBIL: 700+", "Salaried & self-employed"], documents: ["KYC documents", "Income proof", "Bank statements", "Employment proof"], features: ["Axis Reserve: Best for travel rewards", "Atlas: Best for flight bookings", "ACE: Best for utility payments", "Edge reward points program"], description: "Axis Bank offers premium credit cards with industry-leading travel rewards through the Edge Rewards program." },
  ],
  insights: [
    { title: "Best Credit Cards for Travel in 2026", slug: "best-travel-credit-cards", summary: "Top credit cards for domestic and international travel rewards.", keyPoints: ["HDFC Diners Club Black: Unlimited lounge access + 3.33% rewards", "Axis Reserve: 12 complimentary lounge visits + 1.5% forex markup", "Amex Platinum: Premium travel benefits + Marriott Gold status", "SBI ELITE: 5X rewards on travel + complimentary Priority Pass", "Look for low forex markup (1.5%–2%) for international travel"] },
    { title: "How to Maximize Credit Card Rewards", slug: "maximize-credit-card-rewards", summary: "Strategies to earn maximum rewards and cashback from your credit cards.", keyPoints: ["Use the right card for each spending category", "Stack offers: bank portal + credit card rewards + coupon codes", "Convert to EMI for large purchases to avoid interest", "Pay full balance every month to avoid 40%+ interest", "Use milestone rewards — many cards give bonuses at ₹1L, ₹2L, ₹4L spends"] },
  ],
  rates: [
    { title: "HDFC Credit Card Charges", slug: "hdfc-credit-card-charges", bank: "HDFC Bank", rate: "3.49%/month", effectiveRate: "41.88% p.a.", processingFee: "₹500–₹10,000 joining fee", prepayment: "No prepayment — pay in full each month", details: ["Finance charges apply on unpaid balance", "Late payment fee: ₹100–₹1,300", "Over-limit fee: 2.5% of over-limit amount", "Forex markup: 2%–3.5%"] },
    { title: "Axis Credit Card Charges", slug: "axis-credit-card-charges", bank: "Axis Bank", rate: "3.49%/month", effectiveRate: "41.88% p.a.", processingFee: "₹500–₹10,000 joining fee", prepayment: "No prepayment — pay in full", details: ["Finance charges on revolving balance", "Late payment fee: ₹200–₹1,200", "Forex markup: 1.5%–3.5% (varies by card)", "Annual fee waiver on spending thresholds"] },
  ],
  eligibilityDocs: [
    { title: "How to Apply?", slug: "credit-card-apply", description: "Apply for a credit card through CreduPe.", points: ["Compare credit cards by reward type and fees on CreduPe", "Check eligibility with a soft credit check (no impact on CIBIL)", "Select the best card and submit application online", "Upload KYC and income documents", "Card dispatched within 7–14 working days"] },
    { title: "Eligibility Criteria", slug: "credit-card-eligibility", description: "Who can apply for a credit card?", points: ["Age: 21–60 years (18+ for add-on cards)", "Income: ₹12,000+/month (varies by card tier)", "CIBIL Score: 700+ for premium cards, 650+ for basic cards", "Employment: Salaried (min 1 year) or self-employed (min 2 years)", "Existing credit card holders may get instant pre-approved offers"] },
    { title: "Documents Required", slug: "credit-card-documents", description: "Documents for credit card application.", points: ["PAN Card (mandatory)", "Aadhaar Card / Passport / Voter ID", "Salary slips (last 3 months) or ITR", "Bank statements (last 3 months)", "Passport-size photograph", "Current address proof"] },
  ]
};

const educationLoanData: ProductSidebarData = {
  lenders: [
    {
      name: "SBI Education Loan",
      slug: "sbi-education-loan",
      interestRate: "8.15% – 10.00% p.a.",
      processingFee: "Nil",
      maxAmount: "₹1.5 Crore (Abroad), ₹20 Lakh (India)",
      tenure: "Up to 15 years",
      eligibility: [
        "Indian national with confirmed admission in recognized institution",
        "Age: No upper limit (co-applicant required)",
        "Collateral required for loans above ₹7.5 Lakh",
        "Co-applicant (parent/guardian) mandatory"
      ],
      documents: [
        "Admission letter from institution",
        "Mark sheets of qualifying exams (10th, 12th, Graduation)",
        "KYC documents of student and co-applicant",
        "Income proof of co-applicant",
        "Collateral documents (for loans above ₹7.5 Lakh)",
        "Cost of study certificate from institution"
      ],
      features: [
        "No processing fee charged",
        "Repayment begins 1 year after course completion or 6 months after getting a job",
        "Covers tuition, hostel, books, travel & equipment",
        "Interest subsidy for economically weaker sections under CSIS",
        "Available for courses in India and abroad"
      ],
      description: "SBI Scholar Loan Scheme offers education loans at competitive rates with moratorium period and flexible repayment. It covers both domestic and international studies."
    },
    {
      name: "HDFC Credila Education Loan",
      slug: "hdfc-credila-education-loan",
      interestRate: "9.00% – 11.50% p.a.",
      processingFee: "1% of loan amount",
      maxAmount: "₹2 Crore (Abroad), ₹50 Lakh (India)",
      tenure: "Up to 15 years",
      eligibility: [
        "Indian national with confirmed admission",
        "Course should be from recognized university",
        "Co-applicant required (parent/guardian/spouse)",
        "Collateral may be required for higher loan amounts"
      ],
      documents: [
        "Admission letter / Offer letter",
        "Academic transcripts",
        "KYC of student and co-applicant",
        "Income documents of co-applicant",
        "Property documents (if collateral required)",
        "Passport & Visa (for abroad studies)"
      ],
      features: [
        "Specialized education loan NBFC with deep expertise",
        "Covers 100% of tuition and living expenses",
        "Quick sanction within 3-5 working days",
        "No prepayment/foreclosure charges",
        "Dedicated relationship manager for each student"
      ],
      description: "HDFC Credila is India's leading dedicated education loan provider offering customized solutions for students pursuing higher education in India and abroad."
    },
    {
      name: "Axis Bank Education Loan",
      slug: "axis-bank-education-loan",
      interestRate: "9.70% – 13.70% p.a.",
      processingFee: "Up to 1% + GST",
      maxAmount: "₹75 Lakh (Abroad), ₹10 Lakh (India)",
      tenure: "Up to 15 years",
      eligibility: [
        "Indian citizen with admission in recognized institution",
        "Age: 18 years and above",
        "Co-applicant (parent/guardian) mandatory",
        "Good academic record preferred"
      ],
      documents: [
        "Admission letter from university",
        "Academic records (10th, 12th, Graduation)",
        "KYC documents of student and co-applicant",
        "Income proof of co-applicant",
        "Cost of attendance breakdown",
        "Passport copy (for abroad)"
      ],
      features: [
        "100% financing of tuition fees",
        "Moratorium period: Course duration + 6 months",
        "Tax benefits under Section 80E",
        "Online application and tracking",
        "Covers pre-departure expenses"
      ],
      description: "Axis Bank education loans support students pursuing professional and technical courses at top institutions in India and abroad with flexible repayment."
    },
    {
      name: "Bank of Baroda Education Loan",
      slug: "bob-education-loan",
      interestRate: "8.30% – 9.85% p.a.",
      processingFee: "Nil",
      maxAmount: "₹1 Crore (Abroad), ₹40 Lakh (India)",
      tenure: "Up to 15 years",
      eligibility: [
        "Indian national with confirmed admission",
        "Secured admission in recognized institution in India or abroad",
        "Co-applicant required",
        "Collateral for loans above ₹4 Lakh"
      ],
      documents: [
        "Admission confirmation letter",
        "Mark sheets of last qualifying exam",
        "KYC documents",
        "Income proof of co-applicant",
        "Fee structure from institution",
        "Collateral documents if applicable"
      ],
      features: [
        "Among the lowest interest rates in the market",
        "No processing fee",
        "Covers tuition, books, travel, and living expenses",
        "Concession of 0.50% for girl students",
        "Interest subsidy under government schemes"
      ],
      description: "Bank of Baroda Baroda Scholar Loan offers competitive interest rates and comprehensive coverage for students pursuing higher education."
    },
    {
      name: "IDFC FIRST Education Loan",
      slug: "idfc-first-education-loan",
      interestRate: "9.00% – 12.00% p.a.",
      processingFee: "Up to 1% + GST",
      maxAmount: "₹1 Crore",
      tenure: "Up to 12 years",
      eligibility: [
        "Indian citizen aged 18+ with confirmed admission",
        "Admission in premier institution in India or abroad",
        "Co-applicant required",
        "Minimum academic score criteria may apply"
      ],
      documents: [
        "University admission letter",
        "Academic transcripts",
        "Student and co-applicant KYC",
        "Co-applicant income proof",
        "Fee structure details",
        "Passport & visa documents (for abroad)"
      ],
      features: [
        "Collateral-free loans up to ₹50 Lakh for premier institutions",
        "Covers tuition, accommodation, and living costs",
        "Quick digital processing",
        "Flexible EMI options post-moratorium",
        "Dedicated education loan team"
      ],
      description: "IDFC FIRST Bank offers education loans with attractive rates and collateral-free options for students admitted to premier institutions."
    },
    {
      name: "Punjab National Bank Education Loan",
      slug: "pnb-education-loan",
      interestRate: "8.45% – 10.45% p.a.",
      processingFee: "Nil",
      maxAmount: "₹1 Crore (Abroad), ₹20 Lakh (India)",
      tenure: "Up to 15 years",
      eligibility: [
        "Indian national with confirmed admission",
        "Course in India or abroad from recognized institution",
        "Co-applicant (parent/guardian) required",
        "Collateral for loans above ₹7.5 Lakh"
      ],
      documents: [
        "Admission letter",
        "Mark sheets of qualifying exams",
        "KYC documents of student and co-applicant",
        "Income proof of co-applicant",
        "Fee structure from institution",
        "Collateral documents if applicable"
      ],
      features: [
        "No processing fee",
        "Moratorium period: Course + 12 months",
        "Interest subsidy for economically weaker sections",
        "Covers all education-related expenses",
        "0.50% concession for girl students"
      ],
      description: "PNB Saraswati Education Loan provides affordable education financing with generous moratorium and government subsidy benefits."
    },
    {
      name: "Prodigy Finance Education Loan",
      slug: "prodigy-finance-education-loan",
      interestRate: "Variable (SOFR + margin)",
      processingFee: "Included in APR",
      maxAmount: "Up to full cost of attendance",
      tenure: "Up to 20 years",
      eligibility: [
        "Must be admitted to a Prodigy Finance-supported university",
        "No co-signer or collateral required",
        "Available for international students from 150+ countries",
        "Graduate and postgraduate courses only"
      ],
      documents: [
        "University offer letter",
        "Passport copy",
        "Academic transcripts",
        "Online application form",
        "No income proof required from student",
        "No collateral documents needed"
      ],
      features: [
        "No co-signer or collateral required",
        "Covers up to 100% of cost of attendance",
        "Community-funded lending model",
        "Available for top global MBA and Master's programs",
        "Simple online application process"
      ],
      description: "Prodigy Finance is a global education loan provider specializing in no-collateral, no-cosigner loans for postgraduate students at top international universities."
    },
    {
      name: "Auxilo Finserve Education Loan",
      slug: "auxilo-education-loan",
      interestRate: "10.25% – 14.00% p.a.",
      processingFee: "Up to 2% + GST",
      maxAmount: "₹75 Lakh",
      tenure: "Up to 10 years",
      eligibility: [
        "Indian national with confirmed admission",
        "Courses in India and abroad covered",
        "Co-applicant required",
        "Minimum academic performance criteria"
      ],
      documents: [
        "Admission offer letter",
        "Academic records",
        "KYC of student and co-applicant",
        "Income documents of co-applicant",
        "Fee structure from institution",
        "Passport (for abroad)"
      ],
      features: [
        "Specializes in education financing",
        "Customized loan structures",
        "Covers both UG and PG programs",
        "Quick sanction process",
        "Dedicated support team for students"
      ],
      description: "Auxilo Finserve is a dedicated education finance NBFC providing tailored education loan solutions for students across India."
    }
  ],
  insights: [
    {
      title: "How to Get an Education Loan Without Collateral",
      slug: "education-loan-without-collateral",
      summary: "Many banks and NBFCs offer collateral-free education loans up to ₹7.5–50 Lakh for courses at premier institutions. Learn how to qualify.",
      keyPoints: [
        "Government banks offer collateral-free loans up to ₹7.5 Lakh under model education loan scheme",
        "NBFCs like HDFC Credila and Prodigy Finance offer higher collateral-free limits for top-ranked universities",
        "Strong academic record and admission to a reputed institution increase your chances",
        "Interest rates may be slightly higher for unsecured education loans",
        "Consider government interest subsidy schemes like CSIS for economically weaker sections"
      ]
    },
    {
      title: "Education Loan vs Self-Funding – Which is Better?",
      slug: "education-loan-vs-self-funding",
      summary: "Compare the financial impact of taking an education loan versus self-funding your higher education.",
      keyPoints: [
        "Education loans provide tax benefits under Section 80E on interest paid",
        "Self-funding avoids interest costs but ties up family savings",
        "Loans help build credit history early in your career",
        "Moratorium period gives you time to start earning before repayment",
        "Consider opportunity cost of liquidating investments vs loan interest"
      ]
    },
    {
      title: "Top Scholarships to Reduce Education Loan Burden",
      slug: "scholarships-reduce-loan-burden",
      summary: "Discover major scholarships for Indian students that can significantly reduce the amount you need to borrow.",
      keyPoints: [
        "Government scholarships: National Overseas Scholarship, Central Sector Scholarship",
        "University-specific merit and need-based scholarships",
        "Country-specific scholarships: Chevening (UK), Fulbright (USA), DAAD (Germany)",
        "Corporate scholarships from Tata, Aditya Birla, and other foundations",
        "Apply early — most scholarships have deadlines 6-12 months before course start"
      ]
    },
    {
      title: "Section 80E Tax Benefits on Education Loans",
      slug: "section-80e-tax-benefits",
      summary: "Understanding how to claim tax deductions on education loan interest under Section 80E of the Income Tax Act.",
      keyPoints: [
        "Deduction available on entire interest paid — no upper limit",
        "Available for 8 consecutive years from the year you start repaying",
        "Only the person who repays the loan can claim the deduction",
        "Applicable for loans from recognized financial institutions only",
        "Covers loans for self, spouse, children, or student for whom you are legal guardian"
      ]
    },
    {
      title: "How to Choose the Right Education Loan Lender",
      slug: "choose-right-education-loan-lender",
      summary: "Key factors to compare when selecting an education loan provider for studying in India or abroad.",
      keyPoints: [
        "Compare interest rates — fixed vs floating and the effective APR",
        "Check moratorium period and repayment flexibility",
        "Evaluate collateral requirements and loan-to-value ratio",
        "Look for zero processing fee options from government banks",
        "Read reviews and check turnaround time for loan sanctioning"
      ]
    }
  ],
  rates: [
    {
      title: "SBI Education Loan Interest Rate",
      slug: "sbi-education-loan-rate",
      bank: "State Bank of India",
      rate: "8.15% – 10.00% p.a.",
      effectiveRate: "8.15% – 10.25% p.a.",
      processingFee: "Nil",
      prepayment: "No charges",
      details: [
        "Rate linked to 1-year MCLR (currently 8.15%)",
        "0.50% concession for female students",
        "Lower rates for loans up to ₹7.5 Lakh (no collateral needed)",
        "Interest subsidy available under government schemes for EWS",
        "Rate revision happens annually based on MCLR changes"
      ]
    },
    {
      title: "HDFC Credila Education Loan Interest Rate",
      slug: "hdfc-credila-education-loan-rate",
      bank: "HDFC Credila",
      rate: "9.00% – 11.50% p.a.",
      effectiveRate: "9.50% – 12.25% p.a.",
      processingFee: "1% of loan amount",
      prepayment: "No charges",
      details: [
        "Rate depends on course, university ranking, and loan amount",
        "Premier university students get preferential rates",
        "Fixed rate options available for budget planning",
        "Rate locked at sanction — no surprises during repayment",
        "Co-applicant income and credit score also influence the rate"
      ]
    },
    {
      title: "Bank of Baroda Education Loan Interest Rate",
      slug: "bob-education-loan-rate",
      bank: "Bank of Baroda",
      rate: "8.30% – 9.85% p.a.",
      effectiveRate: "8.30% – 9.85% p.a.",
      processingFee: "Nil",
      prepayment: "No charges",
      details: [
        "Among the most competitive rates in the market",
        "0.50% concession for girl students",
        "Linked to BRLLR (Baroda Repo Linked Lending Rate)",
        "No hidden charges or processing fees",
        "Additional concession for loans under Vidya Lakshmi portal"
      ]
    },
    {
      title: "Axis Bank Education Loan Interest Rate",
      slug: "axis-bank-education-loan-rate",
      bank: "Axis Bank",
      rate: "9.70% – 13.70% p.a.",
      effectiveRate: "10.00% – 14.50% p.a.",
      processingFee: "Up to 1% + GST",
      prepayment: "2% + GST on prepaid amount",
      details: [
        "Rate varies by loan amount, course, and institution ranking",
        "Higher rates for non-premier institutions",
        "Competitive rates for MBA programs at top B-schools",
        "Processing fee may be negotiable for large loan amounts",
        "EMI starts after moratorium period ends"
      ]
    },
    {
      title: "PNB Education Loan Interest Rate",
      slug: "pnb-education-loan-rate",
      bank: "Punjab National Bank",
      rate: "8.45% – 10.45% p.a.",
      effectiveRate: "8.45% – 10.45% p.a.",
      processingFee: "Nil",
      prepayment: "No charges",
      details: [
        "Linked to PNB's RLLR (Repo Linked Lending Rate)",
        "0.50% concession for female students",
        "No processing or prepayment fees",
        "Competitive rates for government scheme beneficiaries",
        "Simple interest during moratorium, EMI after"
      ]
    }
  ],
  eligibilityDocs: [
    {
      title: "Education Loan Eligibility Criteria",
      slug: "education-loan-eligibility",
      description: "General eligibility requirements for education loans in India for domestic and international studies.",
      points: [
        "Student must be an Indian national",
        "Must have secured admission in a recognized institution in India or abroad",
        "No age limit for student in most banks, but co-applicant is required",
        "Courses covered: Graduation, Post-Graduation, Diploma, PhD, Professional courses",
        "Good academic track record (generally 50%+ in qualifying exam)",
        "Co-applicant should have stable income source",
        "Collateral required for loans above ₹7.5 Lakh (varies by bank)"
      ]
    },
    {
      title: "Documents Required for Education Loan",
      slug: "education-loan-documents",
      description: "Comprehensive checklist of documents needed for education loan application.",
      points: [
        "Admission letter / Offer letter from the institution",
        "Mark sheets of 10th, 12th, and graduation (as applicable)",
        "Entrance exam scorecard (GRE, GMAT, IELTS, TOEFL etc.)",
        "Cost of study / Fee structure from the institution",
        "KYC documents: Aadhaar, PAN, Passport",
        "Passport and Visa documents (for study abroad)",
        "Co-applicant income proof: Salary slips, ITR, Bank statements",
        "Collateral documents: Property papers, FD receipts (if applicable)",
        "Passport-size photographs of student and co-applicant"
      ]
    },
    {
      title: "Courses Eligible for Education Loans",
      slug: "eligible-courses-education-loan",
      description: "Types of courses and programs that qualify for education loan financing from banks and NBFCs.",
      points: [
        "Engineering (B.Tech, M.Tech) from AICTE/UGC approved institutions",
        "MBA/PGDM from AICTE approved business schools",
        "Medical (MBBS, MD, MS, BDS) from MCI recognized colleges",
        "Law (LLB, LLM) from BCI recognized institutions",
        "Pure Sciences, Arts, Commerce — graduation and post-graduation",
        "Professional certifications (CA, CS, CFA, CPA)",
        "PhD and research programs in recognized universities",
        "Study abroad programs in QS/THE ranked universities"
      ]
    },
    {
      title: "Education Loan Repayment Guide",
      slug: "education-loan-repayment-guide",
      description: "Understanding the repayment structure, moratorium period, and EMI options for education loans.",
      points: [
        "Moratorium period: Course duration + 6-12 months (varies by lender)",
        "During moratorium, only simple interest accrues (no EMI required)",
        "Some banks allow partial interest payments during study to reduce total cost",
        "EMI calculation based on reducing balance method",
        "Typical repayment tenure: 5-15 years after moratorium",
        "Prepayment/foreclosure: Most banks allow with zero or minimal charges",
        "Auto-debit facility available for hassle-free repayment",
        "Missing EMIs can affect co-applicant's credit score too"
      ]
    }
  ]
};

export const productSidebarDataMap: Record<string, ProductSidebarData> = {
  "Personal Loan": personalLoanData,
  "Gold Loan": goldLoanData,
  "Home Loan": homeLoanData,
  "Car Loan": carLoanData,
  "Used Car Loan": usedCarLoanData,
  "Business Loan": businessLoanData,
  "Two Wheeler Loan": twoWheelerLoanData,
  "Micro Loan": microLoanData,
  "Loan Against Property": loanAgainstPropertyData,
  "Credit Cards": creditCardsData,
  "Education Loan": educationLoanData,
};
