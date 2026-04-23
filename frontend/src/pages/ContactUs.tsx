import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, User, MessageSquare, Briefcase, GraduationCap, HelpCircle, Handshake, Instagram, Linkedin, Facebook, Twitter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const contactHero = "/assets/contact-us-hero.png";
const categories = [
  { id: 1, icon: User, title: "Loan Enquiry", desc: "Questions about personal, home, car, or any other loan products and eligibility." },
  { id: 2, icon: Briefcase, title: "Business Partnership", desc: "Want to partner with us, integrate our platform, or explore co-lending opportunities." },
  { id: 3, icon: Handshake, title: "Service Partners", desc: "Are you a DSA, financial advisor, or channel partner wanting to join our network?" },
  { id: 4, icon: HelpCircle, title: "General Enquiry", desc: "Anything else — press, media, feedback, or technical issues." },
];

const interests = ["Personal Loan", "Home Loan", "Business Loan", "Credit Cards", "Education Loan", "Partner with Us", "Career Enquiry"];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const ContactUs = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl mx-4 md:mx-8 lg:mx-12 mt-6" style={{ background: "linear-gradient(135deg, hsl(var(--purple-deep)), hsl(var(--purple-dark)), hsl(var(--purple-mid)))" }}>
        <div className="container py-12 md:py-16 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div {...fadeUp}>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground leading-tight">
                Get in Touch
              </h1>
              <p className="mt-4 text-primary-foreground/70 max-w-lg">
                We're here to help you every step of the way, whether you're looking for a loan, a credit card, or a partnership. Get in touch with us below and we'll make sure the right person reaches out promptly.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:flex justify-center"
            >
              <img src={contactHero} alt="Contact support" width={800} height={600} className="w-72 h-auto drop-shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-14">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
          Let us know how we can help
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left — Categories */}
          <div>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {categories.map((cat) => (
                <motion.div
                  key={cat.id}
                  {...fadeUp}
                  className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mb-3">
                    {cat.id}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{cat.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{cat.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Image placeholder */}
            <div className="rounded-2xl overflow-hidden bg-accent/50 h-52 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 text-primary/30" />
                <p className="text-sm font-medium">We typically respond within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Right — Contact Form */}
          <motion.div {...fadeUp}>
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-5">
              {/* Interest Tags */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">I'm interested in...</label>
                <div className="flex flex-wrap gap-2">
                  {interests.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleInterest(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        selectedInterests.includes(tag)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border hover:border-primary/40"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Your Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Your Email"
                    maxLength={255}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Your Subject</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Your Subject"
                    maxLength={200}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Your Message</label>
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  maxLength={1000}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>

              <p className="text-xs text-muted-foreground">
                Your contact details and enquiry are handled with the utmost confidentiality. We securely manage your data and ensure no personal information is shared without your explicit consent.
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Connect With Us */}
      <section className="gradient-soft py-14">
        <div className="container">
          <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            Connect with us
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div {...fadeUp} className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Head Office (India)</h3>
                <p className="text-xs text-muted-foreground mt-1">Bangalore, Karnataka, India</p>
              </div>
            </motion.div>
            <motion.div {...fadeUp} className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Email Us</h3>
                <a href="mailto:contact@credupe.com" className="text-xs text-primary hover:underline mt-1 block">contact@credupe.com</a>
              </div>
            </motion.div>
            <motion.div {...fadeUp} className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Call Us</h3>
                <p className="text-xs text-muted-foreground mt-1">+91 80-XXXX-XXXX</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Follow Us */}
      <section className="container py-12 text-center">
        <motion.h2 {...fadeUp} className="text-2xl font-bold text-foreground mb-6">Follow us on</motion.h2>
        <div className="flex justify-center gap-4">
          {[Instagram, Linkedin, Facebook, Twitter].map((Icon, i) => (
            <motion.a
              key={i}
              {...fadeUp}
              href="#"
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors text-muted-foreground"
            >
              <Icon className="w-5 h-5" />
            </motion.a>
          ))}
        </div>
      </section>

      {/* Thank You Banner */}
      <section className="rounded-2xl mx-4 md:mx-8 lg:mx-12 py-14" style={{ background: "linear-gradient(135deg, hsl(var(--purple-deep)), hsl(var(--purple-dark)), hsl(var(--purple-mid)))" }}>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div {...fadeUp}>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">
                Thank you for reaching out
              </h2>
              <p className="mt-4 text-primary-foreground/70 max-w-lg">
                We appreciate your interest in CreduPe. Whether you're exploring loan options, credit cards, partnering with us, or simply seeking information — our team is excited to assist you. Let's discover the world of financial opportunities together.
              </p>
              <div className="mt-5 flex items-center gap-2 text-primary-foreground/80">
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@credupe.com</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden md:flex justify-center"
            >
              <img src={contactHero} alt="Thank you" width={800} height={600} loading="lazy" className="w-56 h-auto opacity-80" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Useful Links */}
      <section className="container py-14">
        <motion.h2 {...fadeUp} className="text-2xl font-bold text-foreground text-center mb-8">
          Useful Links & Self-Help
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { title: "Loan Products", icon: Briefcase },
            { title: "Credit Cards", icon: GraduationCap },
            { title: "EMI Calculator", icon: HelpCircle },
            { title: "Help Centre", icon: MessageSquare },
          ].map((link) => (
            <motion.div
              key={link.title}
              {...fadeUp}
              className="bg-card border border-border rounded-xl p-5 text-center hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <link.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">{link.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
