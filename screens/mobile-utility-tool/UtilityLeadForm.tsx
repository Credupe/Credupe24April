"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Check, Mail, Phone, User, X, ChevronRight, ShieldCheck, Sparkles, GraduationCap, Banknote, CreditCard as CardIcon } from "lucide-react";
import credupeApi from "@/lib/credupe-api";

export default function UtilityLeadForm() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract type of form
  const slug = params.slug || "credit-card";
  const partnerCode = searchParams.get("partner") || "";

  // Form states
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [partnerName, setPartnerName] = useState("Credupe Techfin Pvt Ltd");
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Get dynamic titles and graphics based on slug
  let pageTitle = "Perfect Credit Card";
  let themeColor = "from-pink-500 to-rose-600";
  let buttonColor = "bg-[#00e5a3] hover:bg-[#00c98f]";
  let iconComponent = <CardIcon className="w-12 h-12 text-rose-500" />;

  if (slug === "personal-loan") {
    pageTitle = "Perfect Personal Loan";
    themeColor = "from-emerald-500 to-teal-600";
    iconComponent = <Banknote className="w-12 h-12 text-emerald-500" />;
  } else if (slug === "education-loan") {
    pageTitle = "Perfect Education Loan";
    themeColor = "from-blue-500 to-indigo-600";
    iconComponent = <GraduationCap className="w-12 h-12 text-blue-500" />;
  }

  // Fetch partner business name on mount
  useEffect(() => {
    if (partnerCode) {
      credupeApi.partnerPublic.getBusinessName(partnerCode)
        .then((res) => {
          if (res && res.businessName) {
            setPartnerName(res.businessName);
          }
        })
        .catch((err) => {
          console.warn("Failed to fetch partner name:", err);
        });
    }
  }, [partnerCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }
    if (mobile.replace(/\D/g, "").length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number");
      return;
    }
    if (email && !email.includes("@")) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await credupeApi.leads.createPublic({
        customerName: name,
        customerMobile: mobile,
        customerEmail: email || undefined,
        loanType: slug,
        partnerCode: partnerCode || undefined
      });
      setShowSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to submit interest. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-between font-sans antialiased text-slate-800">
      
      {/* Top Header Row */}
      <header className="w-full max-w-xl px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-2" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <img src="/assets/credupe-icon.png" alt="Credupe" className="w-8 h-8 object-contain" onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }} />
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Credupe
          </span>
        </div>
        
        {/* Partner Name Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/80 rounded-full border border-slate-200/50 shadow-sm max-w-[200px] sm:max-w-xs truncate">
          <div className="w-4 h-4 bg-violet-600 rounded-full flex items-center justify-center text-[9px] text-white font-bold">
            P
          </div>
          <span className="text-xs font-semibold text-slate-600 truncate">
            {partnerName}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-xl flex-grow px-6 py-8 flex flex-col justify-start">
        
        {/* Call to Action Titles */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-snug sm:text-3xl">
            Unlock the Benefits of the Perfect{" "}
            <span className={`block sm:inline bg-gradient-to-r ${themeColor} bg-clip-text text-transparent`}>
              {pageTitle.replace("Perfect ", "")}!
            </span>
          </h1>
        </div>

        {/* Product Visual Cards (matches mockup layout) */}
        <div className="flex justify-center items-center py-4 mb-6">
          {slug === "credit-card" ? (
            <div className="relative w-56 h-36 flex items-center justify-center">
              {/* Card 1: Black (back) */}
              <div className="absolute w-44 h-28 bg-slate-900 rounded-xl shadow-lg border border-slate-800 flex flex-col justify-between p-3 transform -rotate-12 translate-x-4 -translate-y-2 opacity-90">
                <div className="flex justify-between items-start">
                  <div className="w-6 h-5 bg-yellow-500/80 rounded" />
                  <div className="w-8 h-4 bg-white/20 rounded" />
                </div>
                <div className="text-[10px] text-slate-400 font-mono tracking-widest">•••• •••• •••• 9012</div>
              </div>
              {/* Card 2: Blue (middle) */}
              <div className="absolute w-44 h-28 bg-gradient-to-tr from-sky-400 to-blue-600 rounded-xl shadow-lg flex flex-col justify-between p-3 transform rotate-3 -translate-x-4 translate-y-1 opacity-95">
                <div className="flex justify-between items-start">
                  <div className="w-6 h-5 bg-yellow-500/80 rounded" />
                  <div className="w-8 h-4 bg-white/25 rounded" />
                </div>
                <div className="text-[10px] text-white/90 font-mono tracking-widest">•••• •••• •••• 5678</div>
              </div>
              {/* Card 3: Pink (front) */}
              <div className="absolute w-44 h-28 bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 rounded-xl shadow-2xl flex flex-col justify-between p-3 transform -rotate-6">
                <div className="flex justify-between items-start">
                  <div className="w-6 h-5 bg-yellow-400 rounded" />
                  <div className="text-xs font-bold text-white tracking-widest italic font-serif">CREDIT CARD</div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-[10px] text-white/90 font-mono tracking-widest">•••• •••• •••• 1234</div>
                  <div className="text-[8px] text-white/60 font-mono">08/30</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center border border-slate-100">
              {iconComponent}
            </div>
          )}
        </div>

        {/* Lead Form Container */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              Enter Your Details to Start Your Application!
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Quick, Easy, and Secure - Just a Few Steps Away.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Field */}
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 ml-1">
                <User className="w-3.5 h-3.5" /> Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition"
              />
            </div>

            {/* Mobile Number Field */}
            <div className="space-y-1">
              <label htmlFor="mobile" className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 ml-1">
                <Phone className="w-3.5 h-3.5" /> Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Enter 10-digit mobile number"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition"
              />
            </div>

            {/* Email Field (Added Option) */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 ml-1">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition"
              />
            </div>

            {errorMsg && (
              <div className="text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-lg p-2.5 text-center font-medium">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 ${buttonColor} text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2`}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Apply Now <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security / Consent Note */}
        <div className="mt-6 flex gap-2.5 px-3 py-2 bg-slate-100/50 border border-slate-200/20 rounded-xl items-start">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Your information is 100% secure. We never share your details without your consent.
          </p>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="w-full max-w-xl py-6 text-center text-xs text-slate-400 font-medium">
        © {new Date().getFullYear()} Credupe Techfin Pvt Ltd. All rights reserved.
      </footer>

      {/* Success Modal Popup (Image 3 layout) */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button X */}
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Interest Submitted Header */}
            <div className="w-full text-left mb-6">
              <h3 className="text-lg font-bold text-slate-800">Interest submitted</h3>
              <div className="w-12 h-1 bg-slate-800 rounded mt-1.5" />
            </div>

            {/* Green Circular Checkmark */}
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 animate-ping absolute opacity-30" />
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>
            </div>

            {/* Message Body */}
            <h4 className="text-xl font-bold text-slate-900 mb-2">Thank You!</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[240px] mb-6">
              Thank you for showing your interest. Our agent will get in touch with you soon.
            </p>

            {/* Back to Site Button */}
            <button
              onClick={() => {
                setShowSuccess(false);
                // navigate back to home page
                window.location.href = "/";
              }}
              className="w-full py-3.5 px-4 bg-[#00e5a3] hover:bg-[#00c98f] text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              Back to Site <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
