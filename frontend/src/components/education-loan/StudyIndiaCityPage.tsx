import { Link } from "react-router-dom";
import { useState } from "react";
import { GraduationCap, MapPin, Building2, ArrowRight, BookOpen, Calendar, ExternalLink, ChevronRight, Star, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IndianCity } from "@/data/studyIndiaCities";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface StudyIndiaCityPageProps {
  city: IndianCity;
  heroImg: string;
}

const StudyIndiaCityPage = ({ city, heroImg }: StudyIndiaCityPageProps) => {
  const [streamFilter, setStreamFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");

  const streams = ["All", ...Array.from(new Set(city.topColleges.map(c => c.stream)))];
  const courseTypes = ["All", ...Array.from(new Set(city.courses.map(c => c.type)))];

  const filteredColleges = streamFilter === "All" ? city.topColleges : city.topColleges.filter(c => c.stream === streamFilter);
  const filteredCourses = courseFilter === "All" ? city.courses : city.courses.filter(c => c.type === courseFilter);

  return (
    <div className="min-h-screen bg-background max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <Navbar />

      {/* Hero */}
      <section className="pt-6 pb-0">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] min-h-[320px] md:min-h-[400px]">
          <img src={heroImg} alt={`Study in ${city.name}`} width={1024} height={768}
            className="absolute right-0 md:right-[2%] bottom-0 h-[85%] w-auto object-contain opacity-80 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-deep))]/80 to-transparent" />
          <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end h-full min-h-[320px] md:min-h-[400px]">
            <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
              <Link to="/education-loan" className="hover:text-white transition-colors">Education Loan</Link>
              <span>/</span>
              <Link to="/study-in-india" className="hover:text-white transition-colors">Study in India</Link>
              <span>/</span>
              <span className="text-white/80">{city.name}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
              Unlock Your Higher Education Journey in {city.name}
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-2xl mb-2">{city.tagline}</p>
            <p className="text-white/60 text-xs md:text-sm max-w-2xl mb-5">{city.description}</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/education-loan" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                Apply for Education Loan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Study Abroad or Study in India Toggle */}
      <section className="py-8 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">Study Abroad or Study in India?</h2>
        <p className="text-sm text-muted-foreground mb-4">We provide the best options for your education needs</p>
        <div className="inline-flex rounded-full border border-border overflow-hidden">
          <Link to="/education-loan" className="px-6 py-2.5 text-sm font-medium bg-card text-muted-foreground hover:bg-muted transition-colors">
            Study Abroad ✈️
          </Link>
          <Link to="/study-in-india" className="px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground">
            Study in India 🇮🇳
          </Link>
        </div>
      </section>

      {/* Why Study Here */}
      <section className="py-10">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">Why Study in {city.name}?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {city.whyStudy.map((item) => (
            <div key={item.title} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
              <span className="text-2xl mb-2 block">{item.icon}</span>
              <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Colleges by Stream */}
      <section className="py-10 bg-muted/30 -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">Top Colleges in {city.name} by Stream</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">Find the best institutions for your preferred field of study</p>
        
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {streams.map((stream) => (
            <button
              key={stream}
              onClick={() => setStreamFilter(stream)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                streamFilter === stream
                  ? "bg-gradient-to-br from-[hsl(var(--purple-deep))] to-[hsl(var(--purple-mid))] text-white"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {stream}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[hsl(var(--purple-deep))] to-[hsl(var(--purple-mid))] text-white">
                <th className="text-left p-3 font-semibold text-xs">#</th>
                <th className="text-left p-3 font-semibold text-xs">College</th>
                <th className="text-left p-3 font-semibold text-xs">Stream</th>
                <th className="text-left p-3 font-semibold text-xs">Ranking</th>
                <th className="text-left p-3 font-semibold text-xs hidden sm:table-cell">Fees</th>
                <th className="text-left p-3 font-semibold text-xs hidden md:table-cell">Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredColleges.map((college, i) => (
                <tr key={college.name} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                  <td className="p-3 text-xs text-muted-foreground">{i + 1}</td>
                  <td className="p-3 text-xs font-medium text-foreground">{college.name}</td>
                  <td className="p-3 text-xs text-muted-foreground">{college.stream}</td>
                  <td className="p-3 text-xs text-primary font-semibold">{college.ranking}</td>
                  <td className="p-3 text-xs text-muted-foreground hidden sm:table-cell">{college.fees}</td>
                  <td className="p-3 text-xs text-muted-foreground hidden md:table-cell">
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{college.location}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Ready to Shape Your Future CTA */}
      <section className="py-10">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Shape Your Future?</h2>
            <p className="text-white/70 text-sm mb-5 max-w-lg">
              Get the best education loan deals for studying in {city.name}. Compare offers from 80+ lenders and get instant approval.
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

        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {courseTypes.map((type) => (
            <button
              key={type}
              onClick={() => setCourseFilter(type)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                courseFilter === type
                  ? "bg-gradient-to-br from-[hsl(var(--purple-deep))] to-[hsl(var(--purple-mid))] text-white"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
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
          Important entrance exams for colleges in {city.name}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {city.upcomingExams.map((exam) => (
            <div key={exam.name} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{exam.level}</span>
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">{exam.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">{exam.date}</p>
              <a href={`https://${exam.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                Visit Website <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Cost of Education */}
      <section className="py-10">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">Cost of Education in {city.name}</h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-card mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[hsl(var(--purple-deep))] to-[hsl(var(--purple-mid))] text-white">
                <th className="text-left p-3 font-semibold">Expense</th>
                <th className="text-left p-3 font-semibold">Range</th>
                <th className="text-left p-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {city.costBreakdown.map((item, i) => (
                <tr key={item.item} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                  <td className="p-3 font-medium text-foreground">{item.item}</td>
                  <td className="p-3 text-primary font-semibold">{item.range}</td>
                  <td className="p-3 text-muted-foreground">{item.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] rounded-2xl p-6 md:p-8 text-center">
          <GraduationCap className="w-10 h-10 text-white mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Need an Education Loan?</h3>
          <p className="text-white/70 text-sm mb-5 max-w-lg mx-auto">Get an Education Loan with competitive rates starting from 6.85% p.a. for studying in {city.name}.</p>
          <Link to="/education-loan" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity">
            Apply for Education Loan <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Discover Your True Potential */}
      <section className="py-10 bg-muted/30 -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">Discover Your True Potential</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Take the right step in your education journey. Explore courses, compare colleges, and find the best financial options to make your dreams a reality.
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

      {/* FAQs */}
      <section className="py-10">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {city.faqs.map((faq, i) => (
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

export default StudyIndiaCityPage;
