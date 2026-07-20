"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Check, ShieldCheck, User, Calendar, FileText, Home, MapPin, Briefcase, ChevronRight, X } from "lucide-react";
import credupeApi from "@/lib/credupe-api";

const EMPLOYMENT_OPTIONS = [
  { label: "Salaried", value: "SALARIED" },
  { label: "Self Employed", value: "SELF_EMPLOYED" },
  { label: "Business", value: "BUSINESS" },
  { label: "Freelancer", value: "FREELANCER" },
  { label: "Unemployed", value: "UNEMPLOYED" },
  { label: "Student", value: "STUDENT" },
];

export default function PersonalLoan() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const bankSlug = searchParams.get("bank") || "";
  const partnerCode = searchParams.get("partner") || "";

  // Data states
  const [lender, setLender] = useState<any>(null);
  const [partnerName, setPartnerName] = useState("Credupe Techfin Pvt Ltd");

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState(""); // DD-MM-YYYY
  const [pan, setPan] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "">("");
  const [fathersFirstName, setFathersFirstName] = useState("");
  const [fathersLastName, setFathersLastName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [pincode, setPincode] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [refNo, setRefNo] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");

  // Fetch lender & partner info
  useEffect(() => {
    if (bankSlug) {
      credupeApi.lenders.get(bankSlug)
        .then((res) => {
          if (res) setLender(res);
        })
        .catch((err) => {
          console.warn("Failed to fetch lender details:", err);
        });
    }

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
  }, [bankSlug, partnerCode]);

  // Format DOB input automatically with dashes (DD-MM-YYYY)
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;
    
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)}`;
    }
    
    setDob(formatted.slice(0, 10));
    if (errors.dob) setErrors({ ...errors, dob: "" });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = "First Name is required";
    if (!lastName.trim()) newErrors.lastName = "Last Name is required";
    
    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!dob.trim()) {
      newErrors.dob = "DOB is required";
    } else if (!/^\d{2}-\d{2}-\d{4}$/.test(dob)) {
      newErrors.dob = "Format must be DD-MM-YYYY";
    } else {
      const parts = dob.split("-");
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      const dateObj = new Date(year, month - 1, day);
      if (
        isNaN(dateObj.getTime()) ||
        dateObj.getFullYear() !== year ||
        dateObj.getMonth() !== month - 1 ||
        dateObj.getDate() !== day
      ) {
        newErrors.dob = "Enter a valid calendar date";
      }
    }

    if (!pan.trim()) {
      newErrors.pan = "PAN is required";
    } else if (!/^[A-Z]{5}\d{4}[A-Z]{1}$/i.test(pan)) {
      newErrors.pan = "Enter a valid PAN card number (e.g. ABCDE1234F)";
    }

    if (!gender) newErrors.gender = "Gender is required";
    if (!fathersFirstName.trim()) newErrors.fathersFirstName = "Father's First Name is required";
    if (!fathersLastName.trim()) newErrors.fathersLastName = "Father's Last Name is required";
    if (!addressLine1.trim()) newErrors.addressLine1 = "Address Line 1 is required";
    if (!addressLine2.trim()) newErrors.addressLine2 = "Address Line 2 is required";

    if (!pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = "Enter a valid 6-digit Pincode";
    }

    if (!employmentType) newErrors.employmentType = "Employment type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    if (!validate()) return;

    setLoading(true);

    const submissionData = {
      loanType: "PERSONAL_LOAN",
      amount: 100000, 
      tenureMonths: 12, 
      lenderId: lender?.id || null,
      formData: {
        firstName,
        lastName,
        mobile,
        dob,
        pan: pan.toUpperCase(),
        gender,
        fathersFirstName,
        fathersLastName,
        addressLine1,
        addressLine2,
        pincode,
        employmentType,
        bankName: lender?.name || "Personal Loan",
      },
      partnerCode: partnerCode || undefined,
    };

    try {
      const res = await credupeApi.applications.createPublic(submissionData);
      if (res && res.referenceNo) {
        setRefNo(res.referenceNo);
        setShowSuccess(true);
      } else {
        setGeneralError("Form submission failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setGeneralError(err.message || "Something went wrong. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-between font-sans antialiased text-slate-800">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-100 shadow-sm flex justify-center">
        <div className="w-full max-w-6xl px-6 py-4 flex items-center justify-between">
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
        </div>
      </header>

      {/* Main content form */}
      <main className="w-full max-w-2xl px-4 py-8 flex-grow">
        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-md border border-slate-100">
          <div className="border-b border-slate-100 pb-5 mb-6">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              {lender ? `${lender.name} Personal Loan Application` : "Personal Loan Application"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Please fill in your details accurately to submit your loan application.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step label / personal details */}
            <div className="flex items-center gap-3 bg-violet-50/50 border border-violet-100/30 p-3.5 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Personal Details</h3>
                <span className="text-[11px] text-slate-400 block">Step 1 of 1</span>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); if (errors.firstName) setErrors({...errors, firstName: ""}); }}
                  placeholder="Enter first name"
                  className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.firstName ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-violet-200 focus:border-violet-600'} rounded-xl text-sm focus:outline-none focus:ring-2 transition`}
                />
                {errors.firstName && <p className="text-[11px] text-red-500 font-medium">{errors.firstName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); if (errors.lastName) setErrors({...errors, lastName: ""}); }}
                  placeholder="Enter last name"
                  className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.lastName ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-violet-200 focus:border-violet-600'} rounded-xl text-sm focus:outline-none focus:ring-2 transition`}
                />
                {errors.lastName && <p className="text-[11px] text-red-500 font-medium">{errors.lastName}</p>}
              </div>
            </div>

            {/* Mobile & DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Mobile No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); if (errors.mobile) setErrors({...errors, mobile: ""}); }}
                  placeholder="Enter 10-digit mobile number"
                  className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.mobile ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-violet-200 focus:border-violet-600'} rounded-xl text-sm focus:outline-none focus:ring-2 transition`}
                />
                {errors.mobile && <p className="text-[11px] text-red-500 font-medium">{errors.mobile}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> DOB (DD-MM-YYYY) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={dob}
                  onChange={handleDobChange}
                  placeholder="DD-MM-YYYY"
                  className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.dob ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-violet-200 focus:border-violet-600'} rounded-xl text-sm focus:outline-none focus:ring-2 transition`}
                />
                {errors.dob && <p className="text-[11px] text-red-500 font-medium">{errors.dob}</p>}
              </div>
            </div>

            {/* PAN & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> PAN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={pan}
                  onChange={(e) => { setPan(e.target.value.toUpperCase().slice(0, 10)); if (errors.pan) setErrors({...errors, pan: ""}); }}
                  placeholder="Enter 10-char PAN"
                  className={`w-full uppercase px-4 py-2.5 bg-slate-50 border ${errors.pan ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-violet-200 focus:border-violet-600'} rounded-xl text-sm focus:outline-none focus:ring-2 transition`}
                />
                {errors.pan && <p className="text-[11px] text-red-500 font-medium">{errors.pan}</p>}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 block mb-1">Gender <span className="text-red-500">*</span></span>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={gender === "Male"}
                      onChange={() => { setGender("Male"); if (errors.gender) setErrors({...errors, gender: ""}); }}
                      className="w-4 h-4 text-violet-600 border-slate-300 focus:ring-violet-500 focus:ring-2"
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={gender === "Female"}
                      onChange={() => { setGender("Female"); if (errors.gender) setErrors({...errors, gender: ""}); }}
                      className="w-4 h-4 text-violet-600 border-slate-300 focus:ring-violet-500 focus:ring-2"
                    />
                    Female
                  </label>
                </div>
                {errors.gender && <p className="text-[11px] text-red-500 font-medium">{errors.gender}</p>}
              </div>
            </div>

            {/* Father's Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Father's First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fathersFirstName}
                  onChange={(e) => { setFathersFirstName(e.target.value); if (errors.fathersFirstName) setErrors({...errors, fathersFirstName: ""}); }}
                  placeholder="Enter father's first name"
                  className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.fathersFirstName ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-violet-200 focus:border-violet-600'} rounded-xl text-sm focus:outline-none focus:ring-2 transition`}
                />
                {errors.fathersFirstName && <p className="text-[11px] text-red-500 font-medium">{errors.fathersFirstName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Father's Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fathersLastName}
                  onChange={(e) => { setFathersLastName(e.target.value); if (errors.fathersLastName) setErrors({...errors, fathersLastName: ""}); }}
                  placeholder="Enter father's last name"
                  className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.fathersLastName ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-violet-200 focus:border-violet-600'} rounded-xl text-sm focus:outline-none focus:ring-2 transition`}
                />
                {errors.fathersLastName && <p className="text-[11px] text-red-500 font-medium">{errors.fathersLastName}</p>}
              </div>
            </div>

            {/* Address fields */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-slate-400" /> Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => { setAddressLine1(e.target.value); if (errors.addressLine1) setErrors({...errors, addressLine1: ""}); }}
                  placeholder="Flat, House no., Building, Apartment"
                  className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.addressLine1 ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-violet-200 focus:border-violet-600'} rounded-xl text-sm focus:outline-none focus:ring-2 transition`}
                />
                {errors.addressLine1 && <p className="text-[11px] text-red-500 font-medium">{errors.addressLine1}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-slate-400" /> Address Line 2 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => { setAddressLine2(e.target.value); if (errors.addressLine2) setErrors({...errors, addressLine2: ""}); }}
                  placeholder="Area, Street, Sector, Village"
                  className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.addressLine2 ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-violet-200 focus:border-violet-600'} rounded-xl text-sm focus:outline-none focus:ring-2 transition`}
                />
                {errors.addressLine2 && <p className="text-[11px] text-red-500 font-medium">{errors.addressLine2}</p>}
              </div>
            </div>

            {/* Pincode & Employment Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "").slice(0, 6)); if (errors.pincode) setErrors({...errors, pincode: ""}); }}
                  placeholder="6-digit pincode"
                  className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.pincode ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-violet-200 focus:border-violet-600'} rounded-xl text-sm focus:outline-none focus:ring-2 transition`}
                />
                {errors.pincode && <p className="text-[11px] text-red-500 font-medium">{errors.pincode}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Employment Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => { setEmploymentType(e.target.value); if (errors.employmentType) setErrors({...errors, employmentType: ""}); }}
                  className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.employmentType ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-violet-200 focus:border-violet-600'} rounded-xl text-sm focus:outline-none focus:ring-2 transition`}
                >
                  <option value="">Select Employment Type</option>
                  {EMPLOYMENT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.employmentType && <p className="text-[11px] text-red-500 font-medium">{errors.employmentType}</p>}
              </div>
            </div>

            {generalError && (
              <div className="text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-lg p-2.5 text-center font-medium">
                {generalError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-violet-500/10 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Submit Application <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="w-full py-6 text-center text-xs text-slate-400 font-medium border-t border-slate-100/50 mt-auto flex justify-center bg-white">
        <div className="w-full max-w-6xl px-6">
          © {new Date().getFullYear()} Credupe Techfin Pvt Ltd. All rights reserved.
        </div>
      </footer>

      {/* Success Modal Popup */}
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

            {/* Title */}
            <div className="w-full text-left mb-6">
              <h3 className="text-lg font-bold text-slate-800">Application Submitted</h3>
              <div className="w-12 h-1 bg-violet-600 rounded mt-1.5" />
            </div>

            {/* Checkmark */}
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 animate-ping absolute opacity-30" />
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>
            </div>

            {/* Message Body */}
            <h4 className="text-xl font-bold text-slate-900 mb-2">Thank You!</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-1">
              Your application has been received successfully.
            </p>
            <p className="text-xs font-mono bg-slate-50 px-2 py-1 border border-slate-100 rounded text-slate-600 font-semibold mb-6">
              Ref: {refNo}
            </p>

            {/* Back to Site Button */}
            <button
              onClick={() => {
                setShowSuccess(false);
                window.location.href = "/";
              }}
              className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"
            >
              Back to Site <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
