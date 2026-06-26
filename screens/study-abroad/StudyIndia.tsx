import { Link } from "react-router-dom";
import { GraduationCap, MapPin, Building2, ArrowRight, BookOpen, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const heroImg = "/assets/study-delhi-hero.png";
const mumbaiImg = "/assets/study-mumbai-hero.png";
const chennaiImg = "/assets/study-chennai-hero.png";
const kolkataImg = "/assets/study-kolkata-hero.png";
const bangaloreImg = "/assets/study-bangalore-hero.png";
const hyderabadImg = "/assets/study-hyderabad-hero.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const topEducationHubs = [
  { name: "Delhi", img: heroImg, href: "/study-in-india/delhi", desc: "IIT Delhi, AIIMS, JNU, DU" },
  { name: "Mumbai", img: mumbaiImg, href: "/study-in-india/mumbai", desc: "IIT Bombay, TISS, NMIMS" },
  { name: "Bangalore", img: bangaloreImg, href: "/study-in-india/bangalore", desc: "IISc, IIM-B, NLSIU" },
  { name: "Chennai", img: chennaiImg, href: "/study-in-india/chennai", desc: "IIT Madras, Anna University" },
  { name: "Kolkata", img: kolkataImg, href: "/study-in-india/kolkata", desc: "IIM-C, Jadavpur, ISI" },
  { name: "Hyderabad", img: hyderabadImg, href: "/study-in-india/hyderabad", desc: "ISB, IIIT-H, NALSAR" },
];

const topCollegesByStream = [
  { name: "IIT Madras", stream: "Engineering", ranking: "NIRF #1", fees: "₹2.2L/yr", city: "Chennai" },
  { name: "IIT Delhi", stream: "Engineering", ranking: "NIRF #2", fees: "₹2.2L/yr", city: "Delhi" },
  { name: "IIT Bombay", stream: "Engineering", ranking: "NIRF #3", fees: "₹2.2L/yr", city: "Mumbai" },
  { name: "AIIMS Delhi", stream: "Medical", ranking: "NIRF #1", fees: "₹1,628/yr", city: "Delhi" },
  { name: "IIM Ahmedabad", stream: "Management", ranking: "NIRF #1", fees: "₹25L total", city: "Ahmedabad" },
  { name: "IIM Bangalore", stream: "Management", ranking: "NIRF #2", fees: "₹24L total", city: "Bangalore" },
  { name: "IISc Bangalore", stream: "Research", ranking: "NIRF #1", fees: "₹35K/yr", city: "Bangalore" },
  { name: "NLSIU Bangalore", stream: "Law", ranking: "NIRF #1", fees: "₹2.5L/yr", city: "Bangalore" },
  { name: "Delhi University", stream: "Arts & Science", ranking: "NIRF #12", fees: "₹10K-50K/yr", city: "Delhi" },
  { name: "JNU", stream: "Social Sciences", ranking: "NIRF #2 Univ.", fees: "₹500/sem", city: "Delhi" },
];

const courses = [
  { name: "B.Tech Computer Science", duration: "4 Years", fees: "₹2-8L/yr", type: "Full Time" },
  { name: "B.Tech Electronics", duration: "4 Years", fees: "₹2-6L/yr", type: "Full Time" },
  { name: "MBBS", duration: "5.5 Years", fees: "₹1.6K-25L/yr", type: "Full Time" },
  { name: "MBA", duration: "2 Years", fees: "₹5-25L total", type: "Full Time" },
  { name: "BA Economics (Hons)", duration: "3 Years", fees: "₹10K-1L/yr", type: "Full Time" },
  { name: "B.Com (Hons)", duration: "3 Years", fees: "₹15K-1L/yr", type: "Full Time" },
  { name: "B.Sc Physics (Hons)", duration: "3 Years", fees: "₹10K-50K/yr", type: "Full Time" },
  { name: "LLB", duration: "3-5 Years", fees: "₹20K-3L/yr", type: "Full Time" },
  { name: "BBA", duration: "3 Years", fees: "₹1-5L/yr", type: "Full Time" },
];

const upcomingExams = [
  { name: "JEE Main 2026", date: "April 2026", level: "National", desc: "For IITs, NITs, IIITs & other engineering colleges" },
  { name: "NEET UG 2026", date: "May 2026", level: "National", desc: "For MBBS, BDS and other medical programs" },
  { name: "CUET 2026", date: "May 2026", level: "National", desc: "For central university admissions" },
  { name: "CAT 2026", date: "Nov 2026", level: "National", desc: "For IIMs and top MBA colleges" },
];

const testimonials = [
  { name: "Sanjay M.", rating: 5, text: "CreduPe helped me get an education loan for IIT Delhi at the best interest rate. The process was seamless!", city: "Delhi" },
  { name: "Priya R.", rating: 5, text: "Got my education loan approved within 48 hours for studying at IIM Bangalore. Highly recommend CreduPe!", city: "Bangalore" },
  { name: "Arjun K.", rating: 5, text: "Compared 15+ lenders and got the lowest rate for my MBA at XLRI. Thanks CreduPe!", city: "Kolkata" },
];

const faqs = [
  { q: "What are the top education cities in India?", a: "Delhi, Mumbai, Bangalore, Chennai, Kolkata, and Hyderabad are the top education hubs in India, hosting the country's most prestigious institutions." },
  { q: "How much does it cost to study in India?", a: "Government colleges cost ₹5K-3L/yr while private institutions range from ₹1L-25L/yr. Living costs vary from ₹3K-15K/month depending on the city." },
  { q: "Can I get an education loan for studying in India?", a: "Yes, all major banks offer education loans for Indian institutions. Loan amounts range from ₹1L to ₹40L depending on the college and program. Apply through CreduPe for the best rates." },
  { q: "What are the major entrance exams in India?", a: "JEE Main/Advanced (Engineering), NEET (Medical), CAT (MBA), CUET (Central Universities), CLAT (Law), and various state-level exams like MHT CET, KCET, WBJEE." },
  { q: "Which is the cheapest city for education in India?", a: "Kolkata is the most affordable metro city for education, followed by Hyderabad and Chennai. Government colleges in these cities offer quality education at minimal fees." },
  { q: "How to choose the right college in India?", a: "Consider NIRF rankings, placement records, faculty quality, fees, location, and industry connections. Use CreduPe to compare financial options for your shortlisted colleges." },
];

const StudyIndia = () => {
  return (
    <div className="min-h-screen bg-background max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <Navbar />

      {/* Hero */}
      <section className="pt-6 pb-0">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] min-h-[320px] md:min-h-[400px]">
          <img src={heroImg} alt="Study in India - Delhi" width={1024} height={768}
            className="absolute right-0 md:right-[2%] bottom-0 h-[85%] w-auto object-contain opacity-80 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-deep))]/80 to-transparent" />
          <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end h-full min-h-[320px] md:min-h-[400px]">
            <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
              <Link to="/education-loan" className="hover:text-white transition-colors">Education Loan</Link>
              <span>/</span>
              <span className="text-white/80">Study in India</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
              Unlock Your Higher Education Journey with Us
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-2xl mb-5">
              India is home to world-renowned institutions like IITs, IIMs, and AIIMS. Explore top cities, colleges, courses, and get the best education loan deals.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/education-loan" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                Apply for Education Loan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Study Abroad or Study in India */}
      <section className="py-8 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">Study Abroad or Study in India?</h2>
        <p className="text-sm text-muted-foreground mb-4">We provide the best options for your education needs</p>
        <div className="inline-flex rounded-full border border-border overflow-hidden">
          <Link to="/education-loan" className="px-6 py-2.5 text-sm font-medium bg-card text-muted-foreground hover:bg-muted transition-colors">
            Study Abroad ✈️
          </Link>
          <span className="px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground">
            Study in India 🇮🇳
          </span>
        </div>
      </section>

      {/* Top Education Hubs */}
      <section className="py-10">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">Top Education Hubs</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {topEducationHubs.map((hub) => (
            <Link key={hub.name} to={hub.href} className="group">
              <div className="rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
                <div className="h-32 overflow-hidden">
                  <img src={hub.img} alt={hub.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3 text-center bg-card">
                  <h3 className="text-sm font-bold text-foreground">{hub.name}</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{hub.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Colleges by Stream */}
      <section className="py-10 bg-muted/30 -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">Top Colleges in India by Stream</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">Find the best institutions across all disciplines and locations</p>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[hsl(var(--purple-deep))] to-[hsl(var(--purple-mid))] text-white">
                <th className="text-left p-3 font-semibold text-xs">#</th>
                <th className="text-left p-3 font-semibold text-xs">College</th>
                <th className="text-left p-3 font-semibold text-xs">Stream</th>
                <th className="text-left p-3 font-semibold text-xs">Ranking</th>
                <th className="text-left p-3 font-semibold text-xs hidden sm:table-cell">Fees</th>
                <th className="text-left p-3 font-semibold text-xs hidden md:table-cell">City</th>
              </tr>
            </thead>
            <tbody>
              {topCollegesByStream.map((college, i) => (
                <tr key={college.name} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                  <td className="p-3 text-xs text-muted-foreground">{i + 1}</td>
                  <td className="p-3 text-xs font-medium text-foreground">{college.name}</td>
                  <td className="p-3 text-xs text-muted-foreground">{college.stream}</td>
                  <td className="p-3 text-xs text-primary font-semibold">{college.ranking}</td>
                  <td className="p-3 text-xs text-muted-foreground hidden sm:table-cell">{college.fees}</td>
                  <td className="p-3 text-xs text-muted-foreground hidden md:table-cell">
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{college.city}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Ready to Shape Your Future */}
      <section className="py-10">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Shape Your Future?</h2>
            <p className="text-white/70 text-sm mb-5 max-w-lg">
              Get the best education loan deals. Compare offers from 80+ lenders and get instant approval with competitive interest rates.
            </p>
            <Link to="/education-loan" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity">
              Apply for Education Loan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 flex items-center justify-center">
              <GraduationCap className="w-16 h-16 md:w-20 md:h-20 text-white/80" />
            </div>
          </div>
        </div>
      </section>

      {/* Find the Right Course */}
      <section className="py-10">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">Find the Right Course for You</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          There are thousands of courses across all streams and academic levels
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course.name} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">{course.name}</h3>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Duration: <span className="font-medium text-foreground">{course.duration}</span></p>
                <p className="text-xs text-muted-foreground">Fees: <span className="font-medium text-primary">{course.fees}</span></p>
                <p className="text-xs text-muted-foreground">Type: {course.type}</p>
              </div>
              <Link to="/education-loan" className="inline-flex items-center gap-1 mt-3 text-xs text-primary font-semibold hover:underline">
                Apply <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Exams */}
      <section className="py-10 bg-muted/30 -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">Upcoming Exams</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Lorem ipsum dolor sit amet, Entrance exams for colleges and universities in India
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {upcomingExams.map((exam) => (
            <div key={exam.name} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{exam.level}</span>
              <h3 className="text-sm font-bold text-foreground mt-2 mb-1">{exam.name}</h3>
              <p className="text-xs text-muted-foreground mb-1">{exam.date}</p>
              <p className="text-[11px] text-muted-foreground">{exam.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Discover Your True Potential */}
      <section className="py-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">Discover Your True Potential</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Take the right step in your education journey. Explore courses, compare colleges, and find the best financial options.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/education-loan" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              Apply for Education Loan
            </Link>
            <Link to="/calculators" className="px-6 py-3 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors">
              EMI Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* Wall of Wins */}
      <section className="py-10 bg-muted/30 -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">Wall of Wins</h2>
        <p className="text-sm text-muted-foreground text-center mb-8">What our students say about us</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mb-3 italic">"{t.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{t.name[0]}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-10">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
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
      </section>

      <Footer />
    </div>
  );
};

export default StudyIndia;
