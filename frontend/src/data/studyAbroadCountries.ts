export interface CountryData {
  slug: string;
  name: string;
  heroImage: string;
  description: string;
  whyStudy: { title: string; desc: string; icon: string }[];
  didYouKnow: string[];
  topPrograms: { category: string; programs: { name: string; duration: string; avgFee: string }[] }[];
  costBreakdown: { item: string; range: string; inr: string }[];
  totalCostNote: string;
  universities: { name: string; ranking: string; location: string }[];
  eligibility: { requirement: string; details: string }[];
  scholarships: { name: string; amount: string; eligibility: string }[];
  visa: { requirement: string; details: string }[];
  partTimeWork: { title: string; details: string }[];
  faqs: { q: string; a: string }[];
}

export const studyAbroadCountries: Record<string, CountryData> = {
  australia: {
    slug: "australia",
    name: "Australia",
    heroImage: "study-australia-hero.png",
    description: "Australia offers world-class universities, globally recognised degrees, and strong industry-focused learning. With 9 of QS Top 100 universities, safe multicultural cities, and excellent post-graduate opportunities, it remains a top choice for Indian students.",
    whyStudy: [
      { title: "World-Class Education", desc: "9 universities in QS Top 100 rankings", icon: "🎓" },
      { title: "Post-Study Work Visa", desc: "2-4 years post-study work rights", icon: "💼" },
      { title: "High Quality of Life", desc: "Safe, multicultural & student-friendly cities", icon: "🏙️" },
      { title: "Strong Research Focus", desc: "Cutting-edge research opportunities", icon: "🔬" },
      { title: "Scholarship Options", desc: "Government & university scholarships available", icon: "💰" },
      { title: "Part-Time Work", desc: "Work up to 48 hrs/fortnight during studies", icon: "⏰" },
    ],
    didYouKnow: [
      "Australia is the 3rd most popular destination for international students globally.",
      "Over 1,00,000 Indian students currently study in Australia.",
      "Australian degrees are recognised worldwide by employers and institutions.",
      "Melbourne & Sydney consistently rank among the world's best student cities.",
    ],
    topPrograms: [
      { category: "After 12th/UG", programs: [
        { name: "Bachelor of Engineering", duration: "4 years", avgFee: "AUD 35,000–45,000/yr" },
        { name: "Bachelor of Business", duration: "3 years", avgFee: "AUD 30,000–40,000/yr" },
        { name: "Bachelor of IT", duration: "3 years", avgFee: "AUD 28,000–38,000/yr" },
      ]},
      { category: "Post Graduation", programs: [
        { name: "Master of Data Science", duration: "2 years", avgFee: "AUD 35,000–45,000/yr" },
        { name: "MBA", duration: "1.5–2 years", avgFee: "AUD 40,000–60,000/yr" },
        { name: "Master of Engineering", duration: "2 years", avgFee: "AUD 33,000–45,000/yr" },
      ]},
    ],
    costBreakdown: [
      { item: "Tuition Fees (UG)", range: "AUD 20,000–45,000/yr", inr: "₹11L–24.5L" },
      { item: "Tuition Fees (PG)", range: "AUD 22,000–50,000/yr", inr: "₹12L–27.5L" },
      { item: "Living Expenses", range: "AUD 21,041/yr (govt. estimate)", inr: "₹11.5L" },
      { item: "Accommodation", range: "AUD 8,000–15,000/yr", inr: "₹4.4L–8.2L" },
      { item: "Health Insurance (OSHC)", range: "AUD 500–700/yr", inr: "₹27K–38K" },
      { item: "Visa Application Fee", range: "AUD 710", inr: "₹39K" },
    ],
    totalCostNote: "Total estimated annual cost: AUD 40,000–65,000 (₹22L–36L approx.)",
    universities: [
      { name: "University of Melbourne", ranking: "#14 QS 2024", location: "Melbourne, VIC" },
      { name: "University of Sydney", ranking: "#19 QS 2024", location: "Sydney, NSW" },
      { name: "UNSW Sydney", ranking: "#19 QS 2024", location: "Sydney, NSW" },
      { name: "Australian National University", ranking: "#34 QS 2024", location: "Canberra, ACT" },
      { name: "Monash University", ranking: "#42 QS 2024", location: "Melbourne, VIC" },
      { name: "University of Queensland", ranking: "#43 QS 2024", location: "Brisbane, QLD" },
    ],
    eligibility: [
      { requirement: "Academic Scores", details: "Minimum 60-65% in previous qualification" },
      { requirement: "English Proficiency", details: "IELTS 6.0-7.0 or TOEFL 79-100" },
      { requirement: "Standardised Tests", details: "GRE/GMAT for select PG courses" },
      { requirement: "SOP & LOR", details: "Statement of Purpose + 2-3 Letters of Recommendation" },
    ],
    scholarships: [
      { name: "Australia Awards", amount: "Full tuition + living", eligibility: "Indian citizens, merit-based" },
      { name: "Destination Australia", amount: "AUD 15,000/yr", eligibility: "Regional campus students" },
      { name: "University Merit Scholarships", amount: "AUD 5,000–25,000", eligibility: "High academic achievers" },
    ],
    visa: [
      { requirement: "Student Visa (Subclass 500)", details: "Allows study for up to 5 years" },
      { requirement: "Financial Proof", details: "AUD 21,041/yr living costs + tuition + travel" },
      { requirement: "OSHC Health Insurance", details: "Mandatory for visa duration" },
      { requirement: "English Proficiency", details: "IELTS/TOEFL scores required" },
    ],
    partTimeWork: [
      { title: "During Studies", details: "Up to 48 hours per fortnight during semester" },
      { title: "During Breaks", details: "Unlimited hours during scheduled breaks" },
      { title: "Post-Study Work Visa", details: "2-4 years depending on qualification level" },
    ],
    faqs: [
      { q: "What is the cost of studying in Australia for Indian students?", a: "Annual costs range from AUD 40,000-65,000 (₹22-36 lakhs) including tuition and living expenses." },
      { q: "Can I work while studying in Australia?", a: "Yes, international students can work up to 48 hours per fortnight during the academic session." },
      { q: "What are the top universities in Australia?", a: "University of Melbourne, University of Sydney, UNSW, ANU, and Monash are among the top-ranked." },
      { q: "Is IELTS mandatory for Australia?", a: "Yes, IELTS 6.0-7.0 or equivalent English proficiency test is required for most programs." },
    ],
  },
  france: {
    slug: "france",
    name: "France",
    heroImage: "study-france-hero.png",
    description: "France offers affordable world-class education, rich cultural experiences, and strong career prospects. With low tuition at public universities and globally recognised Grande Écoles, it's an attractive destination for Indian students.",
    whyStudy: [
      { title: "Affordable Tuition", desc: "Public universities charge as low as €243/yr", icon: "💰" },
      { title: "Global Recognition", desc: "Home to top Grande Écoles & research institutions", icon: "🎓" },
      { title: "Post-Study Work", desc: "2-year post-study work permit available", icon: "💼" },
      { title: "Rich Culture", desc: "World-renowned art, cuisine & lifestyle", icon: "🗼" },
      { title: "English Programs", desc: "1,500+ English-taught programs available", icon: "🌍" },
      { title: "Research Hub", desc: "Strong focus on innovation & technology", icon: "🔬" },
    ],
    didYouKnow: [
      "France is the #1 non-English speaking destination for international students.",
      "French public universities charge only €243-601/year for EU/non-EU students in many programs.",
      "France has 71 universities and 270+ engineering schools.",
      "Paris is ranked the #1 best student city in the world by QS.",
    ],
    topPrograms: [
      { category: "After 12th/UG", programs: [
        { name: "Bachelor in Business", duration: "3 years", avgFee: "€5,000–15,000/yr" },
        { name: "Bachelor of Engineering", duration: "3 years", avgFee: "€243–10,000/yr" },
        { name: "Bachelor of Arts", duration: "3 years", avgFee: "€243–8,000/yr" },
      ]},
      { category: "Post Graduation", programs: [
        { name: "Master in Management", duration: "2 years", avgFee: "€10,000–30,000/yr" },
        { name: "MBA", duration: "1-2 years", avgFee: "€20,000–60,000/yr" },
        { name: "MSc in Engineering", duration: "2 years", avgFee: "€243–15,000/yr" },
      ]},
    ],
    costBreakdown: [
      { item: "Tuition (Public UG)", range: "€243/yr", inr: "₹22K" },
      { item: "Tuition (Public PG)", range: "€601/yr", inr: "₹55K" },
      { item: "Tuition (Grande Écoles)", range: "€10,000–30,000/yr", inr: "₹9L–27L" },
      { item: "Living Expenses", range: "€800–1,200/month", inr: "₹73K–1.1L/month" },
      { item: "Health Insurance", range: "€200–800/yr", inr: "₹18K–73K" },
      { item: "Visa Fee", range: "€99", inr: "₹9K" },
    ],
    totalCostNote: "Total estimated annual cost: €8,000–25,000 (₹7.3L–23L approx.)",
    universities: [
      { name: "Université PSL", ranking: "#24 QS 2024", location: "Paris" },
      { name: "Institut Polytechnique de Paris", ranking: "#38 QS 2024", location: "Paris" },
      { name: "Sorbonne University", ranking: "#59 QS 2024", location: "Paris" },
      { name: "Université Paris-Saclay", ranking: "#71 QS 2024", location: "Paris" },
      { name: "HEC Paris", ranking: "#1 in Europe (FT)", location: "Paris" },
    ],
    eligibility: [
      { requirement: "Academic Scores", details: "Minimum 60% in previous qualification" },
      { requirement: "Language", details: "IELTS 6.0+ for English programs or DELF B2 for French" },
      { requirement: "Application", details: "Through Campus France (mandatory for Indian students)" },
      { requirement: "SOP & LOR", details: "Statement of Purpose + Letters of Recommendation" },
    ],
    scholarships: [
      { name: "Eiffel Excellence Scholarship", amount: "€1,181/month (Master)", eligibility: "Non-French students, merit-based" },
      { name: "Charpak Scholarship", amount: "€615-767/month", eligibility: "Indian students specifically" },
      { name: "University Scholarships", amount: "Varies", eligibility: "Merit & need-based" },
    ],
    visa: [
      { requirement: "Long-Stay Student Visa", details: "Valid for duration of studies" },
      { requirement: "Financial Proof", details: "€615/month minimum resources" },
      { requirement: "Campus France Registration", details: "Mandatory pre-visa step" },
      { requirement: "Health Insurance", details: "Included in French social security" },
    ],
    partTimeWork: [
      { title: "During Studies", details: "Up to 964 hours/year (approx. 20 hrs/week)" },
      { title: "Post-Study", details: "2-year post-study work permit (APS visa)" },
    ],
    faqs: [
      { q: "Is studying in France affordable?", a: "Yes, public universities charge only €243-601/year. Living costs are €800-1,200/month." },
      { q: "Do I need to know French?", a: "Not necessarily. Over 1,500 programs are taught in English." },
      { q: "Can I work in France after studying?", a: "Yes, a 2-year post-study work permit is available for Master's graduates." },
    ],
  },
  germany: {
    slug: "germany",
    name: "Germany",
    heroImage: "study-germany-hero.png",
    description: "Germany offers tuition-free education at public universities, world-class engineering programs, and Europe's strongest economy. With 18-month post-study work visas and a booming tech sector, it's ideal for career-focused Indian students.",
    whyStudy: [
      { title: "Free Tuition", desc: "Most public universities charge no tuition", icon: "💰" },
      { title: "Engineering Excellence", desc: "World-renowned TU9 technical universities", icon: "⚙️" },
      { title: "Strong Economy", desc: "Europe's largest economy with job opportunities", icon: "📈" },
      { title: "Post-Study Work", desc: "18-month post-study work visa", icon: "💼" },
      { title: "English Programs", desc: "1,800+ English-taught programs", icon: "🌍" },
      { title: "Innovation Hub", desc: "Home to Siemens, BMW, SAP & more", icon: "🔬" },
    ],
    didYouKnow: [
      "Germany has no tuition fees at most public universities — only a semester fee of €150-350.",
      "Over 30,000 Indian students study in Germany currently.",
      "Germany has the 3rd highest number of Nobel laureates globally.",
      "Munich, Berlin & Hamburg are among Europe's top tech hubs.",
    ],
    topPrograms: [
      { category: "After 12th/UG", programs: [
        { name: "Bachelor of Engineering", duration: "3-4 years", avgFee: "€150-350/semester" },
        { name: "Bachelor of Computer Science", duration: "3 years", avgFee: "€150-350/semester" },
        { name: "Bachelor of Business", duration: "3 years", avgFee: "€150-350/semester" },
      ]},
      { category: "Post Graduation", programs: [
        { name: "MSc in Data Science", duration: "2 years", avgFee: "€150-350/semester" },
        { name: "MS in Mechanical Engineering", duration: "2 years", avgFee: "€150-350/semester" },
        { name: "MBA", duration: "1-2 years", avgFee: "€10,000-30,000 total" },
      ]},
    ],
    costBreakdown: [
      { item: "Tuition (Public)", range: "€0 (semester fee only)", inr: "₹0" },
      { item: "Semester Contribution", range: "€150-350/semester", inr: "₹14K-32K" },
      { item: "Living Expenses", range: "€934/month (blocked account)", inr: "₹85K/month" },
      { item: "Health Insurance", range: "€110/month", inr: "₹10K/month" },
      { item: "Visa Fee", range: "€75", inr: "₹6.8K" },
    ],
    totalCostNote: "Total estimated annual cost: €10,000-12,000 (₹9L-11L approx.) — one of the most affordable!",
    universities: [
      { name: "TU Munich", ranking: "#37 QS 2024", location: "Munich, Bavaria" },
      { name: "LMU Munich", ranking: "#54 QS 2024", location: "Munich, Bavaria" },
      { name: "Heidelberg University", ranking: "#47 QS 2024", location: "Heidelberg" },
      { name: "RWTH Aachen", ranking: "#106 QS 2024", location: "Aachen" },
      { name: "TU Berlin", ranking: "#154 QS 2024", location: "Berlin" },
    ],
    eligibility: [
      { requirement: "Academic Scores", details: "Minimum 70% or equivalent GPA" },
      { requirement: "Language", details: "IELTS 6.0-6.5 for English programs or TestDaF for German" },
      { requirement: "APS Certificate", details: "Mandatory for Indian students" },
      { requirement: "Blocked Account", details: "€11,208/year proof of finances" },
    ],
    scholarships: [
      { name: "DAAD Scholarships", amount: "€861-1,200/month", eligibility: "Outstanding Indian students" },
      { name: "Deutschlandstipendium", amount: "€300/month", eligibility: "High-performing students" },
      { name: "Heinrich Böll Foundation", amount: "€934/month", eligibility: "Social commitment" },
    ],
    visa: [
      { requirement: "Student Visa", details: "Apply at German Embassy/Consulate" },
      { requirement: "Blocked Account", details: "€11,208 in a blocked bank account" },
      { requirement: "Health Insurance", details: "Mandatory, ~€110/month" },
      { requirement: "APS Certificate", details: "Academic evaluation mandatory" },
    ],
    partTimeWork: [
      { title: "During Studies", details: "120 full days or 240 half days per year" },
      { title: "Post-Study", details: "18-month job-seeking visa after graduation" },
    ],
    faqs: [
      { q: "Is education really free in Germany?", a: "Yes, most public universities charge no tuition. Only a semester contribution of €150-350 applies." },
      { q: "Do I need to learn German?", a: "Not for English-taught programs, but basic German helps for daily life." },
      { q: "What is the APS certificate?", a: "It's a mandatory academic evaluation for Indian students applying to German universities." },
    ],
  },
  usa: {
    slug: "usa",
    name: "United States",
    heroImage: "study-usa-hero.png",
    description: "The USA hosts the world's top universities, offers unmatched research opportunities, and provides diverse career pathways. With cutting-edge programs in STEM, business, and liberal arts, it remains the #1 destination for Indian students.",
    whyStudy: [
      { title: "Top Universities", desc: "Home to MIT, Stanford, Harvard & more", icon: "🎓" },
      { title: "Research Excellence", desc: "World's largest R&D investment", icon: "🔬" },
      { title: "OPT Work Visa", desc: "1-3 years post-study work (STEM OPT)", icon: "💼" },
      { title: "Flexible Curriculum", desc: "Choose major after enrollment", icon: "📚" },
      { title: "Scholarship Opportunities", desc: "Generous merit & need-based aid", icon: "💰" },
      { title: "Global Network", desc: "Alumni networks spanning every industry", icon: "🌍" },
    ],
    didYouKnow: [
      "The USA has over 2,00,000 Indian students — the second-largest international group.",
      "US universities produce the most Nobel Prize winners globally.",
      "STEM graduates can work up to 3 years on OPT without an H-1B visa.",
      "The US has 4,000+ accredited universities & colleges.",
    ],
    topPrograms: [
      { category: "After 12th/UG", programs: [
        { name: "BS in Computer Science", duration: "4 years", avgFee: "$30,000-55,000/yr" },
        { name: "BS in Engineering", duration: "4 years", avgFee: "$25,000-50,000/yr" },
        { name: "BBA", duration: "4 years", avgFee: "$20,000-45,000/yr" },
      ]},
      { category: "Post Graduation", programs: [
        { name: "MS in Computer Science", duration: "2 years", avgFee: "$30,000-60,000/yr" },
        { name: "MBA", duration: "2 years", avgFee: "$50,000-80,000/yr" },
        { name: "MS in Data Science", duration: "1.5-2 years", avgFee: "$35,000-55,000/yr" },
      ]},
    ],
    costBreakdown: [
      { item: "Tuition (Public In-State)", range: "$10,000-15,000/yr", inr: "₹8.5L-12.8L" },
      { item: "Tuition (Public Out-of-State)", range: "$25,000-40,000/yr", inr: "₹21L-34L" },
      { item: "Tuition (Private)", range: "$35,000-60,000/yr", inr: "₹30L-51L" },
      { item: "Living Expenses", range: "$10,000-18,000/yr", inr: "₹8.5L-15.3L" },
      { item: "Health Insurance", range: "$1,500-3,000/yr", inr: "₹1.3L-2.6L" },
      { item: "Visa Fee (SEVIS + F-1)", range: "$510", inr: "₹43K" },
    ],
    totalCostNote: "Total estimated annual cost: $25,000-55,000 (₹21L-47L approx.)",
    universities: [
      { name: "MIT", ranking: "#1 QS 2024", location: "Cambridge, MA" },
      { name: "Stanford University", ranking: "#5 QS 2024", location: "Stanford, CA" },
      { name: "Harvard University", ranking: "#4 QS 2024", location: "Cambridge, MA" },
      { name: "Caltech", ranking: "#15 QS 2024", location: "Pasadena, CA" },
      { name: "University of Chicago", ranking: "#11 QS 2024", location: "Chicago, IL" },
    ],
    eligibility: [
      { requirement: "Academic Scores", details: "Strong GPA (3.0+ preferred)" },
      { requirement: "English Proficiency", details: "TOEFL 80-100 or IELTS 6.5-7.0" },
      { requirement: "Standardised Tests", details: "SAT/ACT (UG), GRE/GMAT (PG)" },
      { requirement: "SOP, LOR, Resume", details: "Comprehensive application package required" },
    ],
    scholarships: [
      { name: "Fulbright-Nehru Fellowship", amount: "Full funding", eligibility: "Indian citizens, merit-based" },
      { name: "University Scholarships", amount: "$5,000-30,000/yr", eligibility: "Academic merit" },
      { name: "Assistantships (TA/RA)", amount: "Tuition waiver + stipend", eligibility: "Graduate students" },
    ],
    visa: [
      { requirement: "F-1 Student Visa", details: "Standard visa for full-time students" },
      { requirement: "I-20 Form", details: "Issued by university after admission" },
      { requirement: "Financial Proof", details: "1 year of tuition + living costs" },
      { requirement: "SEVIS Registration", details: "$350 SEVIS fee required" },
    ],
    partTimeWork: [
      { title: "On-Campus Work", details: "Up to 20 hrs/week during semester" },
      { title: "CPT/OPT", details: "Curricular & Optional Practical Training" },
      { title: "STEM OPT Extension", details: "Up to 3 years total for STEM graduates" },
    ],
    faqs: [
      { q: "How much does it cost to study in the USA?", a: "Annual costs range from $25,000-55,000 (₹21-47 lakhs) depending on university type." },
      { q: "Can I work while studying in the USA?", a: "Yes, on-campus work up to 20 hrs/week is allowed. Off-campus requires CPT/OPT authorization." },
      { q: "What is STEM OPT?", a: "STEM graduates get a 24-month extension on their 12-month OPT, totaling 3 years of work authorization." },
    ],
  },
  uk: {
    slug: "uk",
    name: "United Kingdom",
    heroImage: "study-uk-hero.png",
    description: "The UK offers prestigious Russell Group universities, shorter course durations, and a 2-year post-study Graduate Route visa. With world-renowned institutions like Oxford, Cambridge, and Imperial, the UK delivers exceptional value for Indian students.",
    whyStudy: [
      { title: "Prestigious Universities", desc: "Oxford, Cambridge, Imperial & more", icon: "🎓" },
      { title: "Shorter Courses", desc: "1-year Master's saves time & money", icon: "⏱️" },
      { title: "Graduate Route", desc: "2-year post-study work visa", icon: "💼" },
      { title: "Global Recognition", desc: "UK degrees respected worldwide", icon: "🌍" },
      { title: "Diverse Programs", desc: "Wide range of specializations", icon: "📚" },
      { title: "NHS Healthcare", desc: "Access to free healthcare via IHS", icon: "🏥" },
    ],
    didYouKnow: [
      "UK Master's programs are typically just 1 year — saving you a full year of fees & living costs.",
      "Over 55,000 Indian students study in the UK annually.",
      "The UK has 4 of the world's top 10 universities.",
      "The Graduate Route visa allows 2 years of work after graduation.",
    ],
    topPrograms: [
      { category: "After 12th/UG", programs: [
        { name: "BSc in Computer Science", duration: "3 years", avgFee: "£12,000-25,000/yr" },
        { name: "BEng Engineering", duration: "3-4 years", avgFee: "£15,000-30,000/yr" },
        { name: "BA Business Management", duration: "3 years", avgFee: "£12,000-20,000/yr" },
      ]},
      { category: "Post Graduation", programs: [
        { name: "MSc in Data Science", duration: "1 year", avgFee: "£15,000-35,000" },
        { name: "MBA", duration: "1 year", avgFee: "£20,000-60,000" },
        { name: "MSc in Finance", duration: "1 year", avgFee: "£18,000-40,000" },
      ]},
    ],
    costBreakdown: [
      { item: "Tuition (UG)", range: "£10,000-25,000/yr", inr: "₹10.7L-26.8L" },
      { item: "Tuition (PG)", range: "£12,000-35,000", inr: "₹12.8L-37.5L" },
      { item: "Living Expenses", range: "£9,207-12,006/yr", inr: "₹9.9L-12.8L" },
      { item: "IHS (Health Surcharge)", range: "£776/yr", inr: "₹83K" },
      { item: "Visa Fee", range: "£490", inr: "₹52K" },
    ],
    totalCostNote: "Total estimated annual cost: £22,000-47,000 (₹23.5L-50L approx.)",
    universities: [
      { name: "University of Oxford", ranking: "#3 QS 2024", location: "Oxford" },
      { name: "University of Cambridge", ranking: "#2 QS 2024", location: "Cambridge" },
      { name: "Imperial College London", ranking: "#6 QS 2024", location: "London" },
      { name: "UCL", ranking: "#9 QS 2024", location: "London" },
      { name: "University of Edinburgh", ranking: "#22 QS 2024", location: "Edinburgh" },
    ],
    eligibility: [
      { requirement: "Academic Scores", details: "Minimum 60-70% or equivalent" },
      { requirement: "English Proficiency", details: "IELTS 6.0-7.0 or TOEFL 80-100" },
      { requirement: "UCAS Application", details: "Required for UG admissions" },
      { requirement: "SOP & LOR", details: "Personal statement + references" },
    ],
    scholarships: [
      { name: "Chevening Scholarship", amount: "Full funding", eligibility: "Leadership potential, work experience" },
      { name: "Commonwealth Scholarships", amount: "Full funding", eligibility: "Developing country citizens" },
      { name: "GREAT Scholarships", amount: "£10,000", eligibility: "Indian students specifically" },
    ],
    visa: [
      { requirement: "Student Visa", details: "Tier 4 visa for 6+ month courses" },
      { requirement: "CAS Number", details: "Confirmation of Acceptance for Studies from university" },
      { requirement: "Financial Proof", details: "Course fees + £1,023/month (London) or £820/month" },
      { requirement: "IHS Payment", details: "Immigration Health Surcharge mandatory" },
    ],
    partTimeWork: [
      { title: "During Term", details: "Up to 20 hrs/week" },
      { title: "During Vacations", details: "Full-time work permitted" },
      { title: "Graduate Route", details: "2-year post-study work visa" },
    ],
    faqs: [
      { q: "Why choose the UK over USA?", a: "UK Master's is 1 year (vs 2 in USA), making it more cost-effective. Plus, the Graduate Route visa offers 2 years of work." },
      { q: "Is the UK expensive for Indian students?", a: "Annual costs range from £22,000-47,000. Scholarships like Chevening can cover full costs." },
      { q: "Can I stay and work after studying?", a: "Yes, the Graduate Route visa allows 2 years of post-study work (3 years for PhD)." },
    ],
  },
  netherlands: {
    slug: "netherlands",
    name: "Netherlands",
    heroImage: "study-netherlands-hero.png",
    description: "The Netherlands offers innovative education, with 95% of the population speaking English. Known for its problem-based learning approach, strong tech ecosystem, and excellent work-life balance, it's a hidden gem for Indian students.",
    whyStudy: [
      { title: "English-Friendly", desc: "95% of Dutch speak English fluently", icon: "🌍" },
      { title: "Innovative Teaching", desc: "Problem-based learning approach", icon: "💡" },
      { title: "Tech Hub", desc: "Home to ASML, Philips, Booking.com", icon: "💻" },
      { title: "Orientation Year", desc: "1-year post-study job-seeking visa", icon: "💼" },
      { title: "Affordable", desc: "Lower costs than UK/USA", icon: "💰" },
      { title: "Central Location", desc: "Easy access to all of Europe", icon: "✈️" },
    ],
    didYouKnow: [
      "The Netherlands has 2,100+ English-taught programs — the most in non-English Europe.",
      "Dutch universities consistently rank in the global top 100.",
      "The Orientation Year visa allows graduates to stay for 1 year to find work.",
      "Amsterdam, Delft, and Eindhoven are major tech & startup hubs.",
    ],
    topPrograms: [
      { category: "After 12th/UG", programs: [
        { name: "BSc Computer Science", duration: "3 years", avgFee: "€8,000-15,000/yr" },
        { name: "BSc Business Administration", duration: "3 years", avgFee: "€8,000-12,000/yr" },
      ]},
      { category: "Post Graduation", programs: [
        { name: "MSc in AI", duration: "2 years", avgFee: "€14,000-20,000/yr" },
        { name: "MSc in Finance", duration: "1-2 years", avgFee: "€15,000-25,000/yr" },
        { name: "MBA", duration: "1-2 years", avgFee: "€20,000-40,000" },
      ]},
    ],
    costBreakdown: [
      { item: "Tuition (Non-EU)", range: "€8,000-20,000/yr", inr: "₹7.3L-18.2L" },
      { item: "Living Expenses", range: "€800-1,100/month", inr: "₹73K-1L/month" },
      { item: "Health Insurance", range: "€40-120/month", inr: "₹3.6K-11K/month" },
      { item: "Visa Fee (MVV)", range: "€210", inr: "₹19K" },
    ],
    totalCostNote: "Total estimated annual cost: €18,000-35,000 (₹16.4L-32L approx.)",
    universities: [
      { name: "TU Delft", ranking: "#47 QS 2024", location: "Delft" },
      { name: "University of Amsterdam", ranking: "#53 QS 2024", location: "Amsterdam" },
      { name: "Eindhoven University of Technology", ranking: "#124 QS 2024", location: "Eindhoven" },
      { name: "Leiden University", ranking: "#126 QS 2024", location: "Leiden" },
    ],
    eligibility: [
      { requirement: "Academic Scores", details: "Minimum 65-75% or equivalent" },
      { requirement: "English Proficiency", details: "IELTS 6.0-6.5 or TOEFL 80-90" },
      { requirement: "Nuffic Certificate", details: "Required for credential evaluation" },
    ],
    scholarships: [
      { name: "Holland Scholarship", amount: "€5,000", eligibility: "Non-EU students, first year" },
      { name: "Orange Tulip Scholarship", amount: "Varies (up to full tuition)", eligibility: "Indian students specifically" },
    ],
    visa: [
      { requirement: "MVV + Residence Permit", details: "University applies on your behalf" },
      { requirement: "Financial Proof", details: "€11,000-13,000/year" },
      { requirement: "Health Insurance", details: "Dutch or international policy required" },
    ],
    partTimeWork: [
      { title: "During Studies", details: "Up to 16 hrs/week or full-time in summer" },
      { title: "Orientation Year", details: "1-year post-study job-seeking visa" },
    ],
    faqs: [
      { q: "Do I need to speak Dutch?", a: "No, the Netherlands has 2,100+ English-taught programs and 95% English proficiency." },
      { q: "Is the Netherlands affordable?", a: "Yes, annual costs range from €18,000-35,000, lower than UK/USA." },
    ],
  },
  "new-zealand": {
    slug: "new-zealand",
    name: "New Zealand",
    heroImage: "study-newzealand-hero.png",
    description: "New Zealand offers a safe, welcoming environment with world-class education. All 8 universities rank in the global top 500, and the country provides excellent post-study work opportunities with a pathway to residency.",
    whyStudy: [
      { title: "All 8 Unis Ranked", desc: "Every NZ university is in QS top 500", icon: "🎓" },
      { title: "Post-Study Work", desc: "Up to 3-year post-study work visa", icon: "💼" },
      { title: "Safe & Welcoming", desc: "Among the world's safest countries", icon: "🛡️" },
      { title: "PR Pathway", desc: "Strong pathway to permanent residency", icon: "🏠" },
      { title: "Affordable", desc: "Lower costs than Australia/USA", icon: "💰" },
      { title: "Natural Beauty", desc: "Stunning landscapes & outdoor lifestyle", icon: "🏔️" },
    ],
    didYouKnow: [
      "New Zealand is ranked #1 globally for preparing students for the future (Economist Intelligence Unit).",
      "All 8 NZ universities are ranked in the global top 500.",
      "Post-study work visas can be up to 3 years based on study level.",
      "New Zealand has one of the world's best quality of life indexes.",
    ],
    topPrograms: [
      { category: "After 12th/UG", programs: [
        { name: "Bachelor of Engineering", duration: "4 years", avgFee: "NZD 25,000-35,000/yr" },
        { name: "Bachelor of IT", duration: "3 years", avgFee: "NZD 22,000-30,000/yr" },
      ]},
      { category: "Post Graduation", programs: [
        { name: "Master of IT", duration: "1.5-2 years", avgFee: "NZD 28,000-40,000/yr" },
        { name: "MBA", duration: "1-2 years", avgFee: "NZD 30,000-50,000" },
      ]},
    ],
    costBreakdown: [
      { item: "Tuition (UG)", range: "NZD 22,000-35,000/yr", inr: "₹11.5L-18.2L" },
      { item: "Tuition (PG)", range: "NZD 26,000-45,000/yr", inr: "₹13.5L-23.4L" },
      { item: "Living Expenses", range: "NZD 20,000-25,000/yr", inr: "₹10.4L-13L" },
      { item: "Visa Fee", range: "NZD 375", inr: "₹19.5K" },
    ],
    totalCostNote: "Total estimated annual cost: NZD 42,000-70,000 (₹22L-36L approx.)",
    universities: [
      { name: "University of Auckland", ranking: "#68 QS 2024", location: "Auckland" },
      { name: "University of Otago", ranking: "#206 QS 2024", location: "Dunedin" },
      { name: "Victoria University of Wellington", ranking: "#241 QS 2024", location: "Wellington" },
    ],
    eligibility: [
      { requirement: "Academic Scores", details: "Minimum 60-70%" },
      { requirement: "English Proficiency", details: "IELTS 6.0-6.5 or equivalent" },
    ],
    scholarships: [
      { name: "NZ Excellence Awards", amount: "NZD 10,000-25,000", eligibility: "Academic merit" },
      { name: "University Scholarships", amount: "Varies", eligibility: "International students" },
    ],
    visa: [
      { requirement: "Student Visa", details: "Valid for course duration" },
      { requirement: "Financial Proof", details: "NZD 20,000/yr living costs" },
    ],
    partTimeWork: [
      { title: "During Studies", details: "Up to 20 hrs/week" },
      { title: "Post-Study", details: "1-3 year post-study work visa" },
    ],
    faqs: [
      { q: "Is New Zealand good for Indian students?", a: "Yes, it offers safety, quality education, and strong PR pathways." },
      { q: "Can I get PR after studying?", a: "Yes, NZ has strong pathways from post-study work visa to permanent residency." },
    ],
  },
  ireland: {
    slug: "ireland",
    name: "Ireland",
    heroImage: "study-ireland-hero.png",
    description: "Ireland is Europe's tech capital, hosting headquarters of Google, Facebook, Apple, and LinkedIn. With 1-2 year Stay Back visas and a booming job market, Ireland offers Indian students excellent career prospects alongside quality education.",
    whyStudy: [
      { title: "Tech Capital of Europe", desc: "HQ of Google, Meta, Apple, LinkedIn", icon: "💻" },
      { title: "English-Speaking", desc: "Native English-speaking country", icon: "🌍" },
      { title: "Stay Back Visa", desc: "1-2 year post-study work permission", icon: "💼" },
      { title: "Welcoming Culture", desc: "Friendly & multicultural society", icon: "🤝" },
      { title: "EU Access", desc: "Gateway to European job market", icon: "🇪🇺" },
      { title: "Quality Education", desc: "Top-ranked universities globally", icon: "🎓" },
    ],
    didYouKnow: [
      "Ireland hosts the European HQs of 9 out of 10 top US tech companies.",
      "Ireland has the youngest population in Europe — median age 38.",
      "Trinity College Dublin is older than Harvard University.",
      "Ireland offers a 2-year Stay Back visa for Master's graduates.",
    ],
    topPrograms: [
      { category: "After 12th/UG", programs: [
        { name: "BSc in Computer Science", duration: "3-4 years", avgFee: "€10,000-20,000/yr" },
        { name: "BEng Engineering", duration: "4 years", avgFee: "€12,000-22,000/yr" },
      ]},
      { category: "Post Graduation", programs: [
        { name: "MSc in Data Analytics", duration: "1-2 years", avgFee: "€15,000-25,000/yr" },
        { name: "MSc in AI", duration: "1 year", avgFee: "€18,000-28,000" },
        { name: "MBA", duration: "1-2 years", avgFee: "€20,000-35,000" },
      ]},
    ],
    costBreakdown: [
      { item: "Tuition (UG)", range: "€10,000-22,000/yr", inr: "₹9.1L-20L" },
      { item: "Tuition (PG)", range: "€12,000-30,000/yr", inr: "₹10.9L-27.3L" },
      { item: "Living Expenses", range: "€7,000-12,000/yr", inr: "₹6.4L-10.9L" },
      { item: "Visa Fee", range: "€60", inr: "₹5.5K" },
    ],
    totalCostNote: "Total estimated annual cost: €20,000-42,000 (₹18L-38L approx.)",
    universities: [
      { name: "Trinity College Dublin", ranking: "#81 QS 2024", location: "Dublin" },
      { name: "University College Dublin", ranking: "#126 QS 2024", location: "Dublin" },
      { name: "University of Galway", ranking: "#270 QS 2024", location: "Galway" },
    ],
    eligibility: [
      { requirement: "Academic Scores", details: "Minimum 60-65%" },
      { requirement: "English Proficiency", details: "IELTS 6.0-6.5" },
    ],
    scholarships: [
      { name: "Government of Ireland Scholarships", amount: "€10,000/yr", eligibility: "Non-EU students" },
      { name: "University Scholarships", amount: "€2,000-5,000", eligibility: "Merit-based" },
    ],
    visa: [
      { requirement: "Study Visa (D)", details: "For courses longer than 3 months" },
      { requirement: "Financial Proof", details: "€10,000 in bank account" },
    ],
    partTimeWork: [
      { title: "During Term", details: "Up to 20 hrs/week" },
      { title: "During Holidays", details: "Up to 40 hrs/week" },
      { title: "Stay Back Visa", details: "1 year (Level 8) or 2 years (Level 9)" },
    ],
    faqs: [
      { q: "Why is Ireland popular for tech students?", a: "Ireland hosts European HQs of Google, Meta, Apple, and LinkedIn, offering excellent job prospects." },
      { q: "Can I work after studying in Ireland?", a: "Yes, the Stay Back visa allows 1-2 years of post-study work." },
    ],
  },
  sweden: {
    slug: "sweden",
    name: "Sweden",
    heroImage: "study-sweden-hero.png",
    description: "Sweden offers innovative, student-centered education with a strong focus on sustainability and equality. Known for its high quality of life, Sweden provides generous scholarships and a vibrant startup ecosystem for ambitious students.",
    whyStudy: [
      { title: "Innovation Leader", desc: "Home to Spotify, IKEA, Volvo, Ericsson", icon: "💡" },
      { title: "English Proficiency", desc: "90%+ of Swedes speak English", icon: "🌍" },
      { title: "Sustainability Focus", desc: "World leader in sustainable development", icon: "🌱" },
      { title: "Post-Study Visa", desc: "1-year post-study job-seeking permit", icon: "💼" },
      { title: "Quality of Life", desc: "Consistently ranked top in global indexes", icon: "⭐" },
      { title: "Generous Scholarships", desc: "Swedish Institute & university scholarships", icon: "💰" },
    ],
    didYouKnow: [
      "Sweden is the birthplace of Spotify, Skype, and the Nobel Prize.",
      "Swedish universities are known for flat hierarchies — professors are approachable.",
      "Sweden offers free PhD programs with a monthly salary.",
      "Stockholm is Europe's second-largest tech hub after London.",
    ],
    topPrograms: [
      { category: "After 12th/UG", programs: [
        { name: "BSc in Computer Science", duration: "3 years", avgFee: "SEK 100,000-180,000/yr" },
        { name: "BSc in Engineering", duration: "3 years", avgFee: "SEK 120,000-200,000/yr" },
      ]},
      { category: "Post Graduation", programs: [
        { name: "MSc in AI & ML", duration: "2 years", avgFee: "SEK 140,000-200,000/yr" },
        { name: "MSc in Sustainable Development", duration: "2 years", avgFee: "SEK 100,000-170,000/yr" },
        { name: "MBA", duration: "1-2 years", avgFee: "SEK 200,000-400,000" },
      ]},
    ],
    costBreakdown: [
      { item: "Tuition (Non-EU)", range: "SEK 80,000-200,000/yr", inr: "₹6.4L-16L" },
      { item: "Living Expenses", range: "SEK 8,568/month", inr: "₹68K/month" },
      { item: "Health Insurance", range: "Included (if registered)", inr: "Free" },
      { item: "Residence Permit Fee", range: "SEK 1,500", inr: "₹12K" },
    ],
    totalCostNote: "Total estimated annual cost: SEK 180,000-300,000 (₹14.4L-24L approx.)",
    universities: [
      { name: "KTH Royal Institute of Technology", ranking: "#73 QS 2024", location: "Stockholm" },
      { name: "Lund University", ranking: "#85 QS 2024", location: "Lund" },
      { name: "Uppsala University", ranking: "#105 QS 2024", location: "Uppsala" },
      { name: "Chalmers University of Technology", ranking: "#125 QS 2024", location: "Gothenburg" },
    ],
    eligibility: [
      { requirement: "Academic Scores", details: "Minimum 65-70%" },
      { requirement: "English Proficiency", details: "IELTS 6.5 or TOEFL 90" },
      { requirement: "Application via", details: "Universityadmissions.se (centralized)" },
    ],
    scholarships: [
      { name: "Swedish Institute Scholarships", amount: "Full tuition + SEK 10,000/month", eligibility: "Selected countries including India" },
      { name: "University Scholarships", amount: "25-100% tuition waiver", eligibility: "Merit-based" },
    ],
    visa: [
      { requirement: "Residence Permit", details: "Apply online via Migrationsverket" },
      { requirement: "Financial Proof", details: "SEK 8,568/month for living costs" },
      { requirement: "Health Insurance", details: "Covered if studying 12+ months" },
    ],
    partTimeWork: [
      { title: "During Studies", details: "No hour restrictions for students" },
      { title: "Post-Study", details: "1-year job-seeking residence permit" },
    ],
    faqs: [
      { q: "Are there any work hour limits in Sweden?", a: "No, Sweden has no restrictions on working hours for international students." },
      { q: "Is Sweden expensive?", a: "Tuition is moderate and scholarships are generous. Living costs are similar to other Nordic countries." },
    ],
  },
};
