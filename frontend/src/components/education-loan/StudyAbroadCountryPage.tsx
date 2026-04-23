import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, ChevronDown, ChevronUp, MapPin, Star, BookOpen, DollarSign, Award, FileText, Briefcase, HelpCircle, ArrowRight } from "lucide-react";
import { CountryData } from "@/data/studyAbroadCountries";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Props {
  country: CountryData;
  heroImg: string;
}

const StudyAbroadCountryPage = ({ country, heroImg }: Props) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <Navbar />

      {/* Hero Banner - Calculator page banner color */}
      <section className="pt-6 pb-0">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-dark))] to-[hsl(var(--purple-mid))] min-h-[320px] md:min-h-[380px]">
          <img
            src={heroImg}
            alt={`Study in ${country.name}`}
            width={800}
            height={600}
            className="absolute right-[2%] md:right-[5%] bottom-0 h-[90%] w-auto object-contain opacity-90 hidden md:block"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--purple-deep))] via-[hsl(var(--purple-deep))]/80 to-transparent" />
          <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end h-full min-h-[320px] md:min-h-[380px]">
            <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
              <Link to="/education-loan" className="hover:text-white transition-colors">Education Loan</Link>
              <span>/</span>
              <span className="text-white/80">Study in {country.name}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">Study in {country.name}</h1>
            <p className="text-white/70 text-sm md:text-base max-w-2xl mb-5">{country.description}</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/education-loan" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                Apply for Education Loan
              </Link>
              <button className="px-6 py-3 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
                Check Eligibility
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Study Here */}
      <section className="py-12">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">What makes {country.name} a top study destination?</h2>
        <p className="text-muted-foreground text-sm text-center mb-8">Discover why thousands of Indian students choose {country.name}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {country.whyStudy.map((item) => (
            <div key={item.title} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
              <span className="text-2xl mb-2 block">{item.icon}</span>
              <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Did You Know */}
      <section className="py-10 bg-muted/30 -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-6">Did You Know?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {country.didYouKnow.map((fact, i) => (
            <div key={i} className="flex items-start gap-3 bg-card rounded-xl border border-border p-4">
              <span className="text-primary text-lg mt-0.5">✓</span>
              <p className="text-sm text-muted-foreground">{fact}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Programs */}
      <section className="py-12">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">Top Programs designed for your success</h2>
        {country.topPrograms.map((cat) => (
          <div key={cat.category} className="mb-8">
            <h3 className="text-base font-bold text-foreground mb-4">{cat.category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.programs.map((prog) => (
                <div key={prog.name} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-bold text-foreground">{prog.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">Duration: {prog.duration}</p>
                  <p className="text-xs text-muted-foreground">Avg Fee: {prog.avgFee}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Cost Breakdown with Education Loan CTA */}
      <section className="py-12 bg-muted/30 -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2">
          Cost of Studying in {country.name} for Indian Students
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-8">Plan your budget with our comprehensive cost breakdown</p>
        
        <div className="overflow-x-auto rounded-xl border border-border bg-card mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[hsl(var(--purple-deep))] text-white">
                <th className="text-left p-3 font-semibold">Expense Category</th>
                <th className="text-left p-3 font-semibold">Estimated Cost</th>
                <th className="text-left p-3 font-semibold">In INR (Approx.)</th>
              </tr>
            </thead>
            <tbody>
              {country.costBreakdown.map((item, i) => (
                <tr key={item.item} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                  <td className="p-3 font-medium text-foreground">{item.item}</td>
                  <td className="p-3 text-muted-foreground">{item.range}</td>
                  <td className="p-3 text-muted-foreground">{item.inr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground italic mb-6">{country.totalCostNote}</p>

        {/* Prominent Education Loan CTA */}
        <div className="bg-[hsl(var(--purple-deep))] rounded-2xl p-6 md:p-8 text-center">
          <GraduationCap className="w-10 h-10 text-white mx-auto mb-3" />
          <h3 className="text-lg md:text-xl font-bold text-white mb-2">Need help funding your education in {country.name}?</h3>
          <p className="text-white/70 text-sm mb-5 max-w-lg mx-auto">
            Get an Education Loan with competitive interest rates starting from 6.85% p.a. Quick approvals, zero hassle.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/education-loan" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity">
              Apply for Education Loan <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/education-loan" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
              Check Eligibility
            </Link>
          </div>
        </div>
      </section>

      {/* Universities */}
      <section className="py-12">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">Most preferred Universities in {country.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {country.universities.map((uni) => (
            <div key={uni.name} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">{uni.name}</h3>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" /> {uni.location}
              </div>
              <p className="text-xs text-primary font-medium mt-1">{uni.ranking}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-10 bg-muted/30 -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">Eligibility Criteria for Admission in {country.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {country.eligibility.map((item) => (
            <div key={item.requirement} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">{item.requirement}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{item.details}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Scholarships */}
      <section className="py-12">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">Top Scholarships for Indian Students in {country.name}</h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[hsl(var(--purple-deep))] text-white">
                <th className="text-left p-3 font-semibold">Scholarship</th>
                <th className="text-left p-3 font-semibold">Amount</th>
                <th className="text-left p-3 font-semibold">Eligibility</th>
              </tr>
            </thead>
            <tbody>
              {country.scholarships.map((s, i) => (
                <tr key={s.name} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}>
                  <td className="p-3 font-medium text-foreground">{s.name}</td>
                  <td className="p-3 text-muted-foreground">{s.amount}</td>
                  <td className="p-3 text-muted-foreground">{s.eligibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Visa */}
      <section className="py-10 bg-muted/30 -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">Visa Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {country.visa.map((v) => (
            <div key={v.requirement} className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-bold text-foreground mb-1">{v.requirement}</h3>
              <p className="text-xs text-muted-foreground">{v.details}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Part-Time Work */}
      <section className="py-12">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">Part-Time Work While Studying in {country.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {country.partTimeWork.map((w) => (
            <div key={w.title} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">{w.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{w.details}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Education Loan CTA Banner */}
      <section className="py-6">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-foreground mb-1">Start your journey to study in {country.name}</h3>
            <p className="text-sm text-muted-foreground">Get personalized education loan options with rates starting from 6.85% p.a.</p>
          </div>
          <Link to="/education-loan" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity shrink-0">
            Get Education Loan <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">FAQs – Study in {country.name}</h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {country.faqs.map((faq, i) => (
            <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StudyAbroadCountryPage;
