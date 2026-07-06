"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Mail, Phone, ShieldCheck, FileText, Banknote, Sparkles,
  ArrowRight, ArrowLeft, Check, Copy, Loader2, AlertCircle, UploadCloud, X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { credupeApi, CredupeApiError } from "@/lib/credupe-api";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Constants                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

type Step =
  | "contact"
  | "mobileOtp"
  | "emailOtp"
  | "business"
  | "kyc"
  | "bank"
  | "success";

const STEP_ORDER: Step[] = [
  "contact", "mobileOtp", "emailOtp", "business", "kyc", "bank", "success",
];

const STEP_LABEL: Record<Step, string> = {
  contact: "Contact",
  mobileOtp: "Mobile OTP",
  emailOtp: "Email OTP",
  business: "Business",
  kyc: "KYC Docs",
  bank: "Bank",
  success: "Done",
};

const KYC_DOC_SLOTS = [
  { tag: "PAN", label: "PAN Card", required: true,  hint: "JPG/PDF · ≤ 5 MB" },
  { tag: "AADHAAR", label: "Aadhaar Card", required: true,  hint: "Front + back single PDF" },
  { tag: "GST", label: "GST Certificate", required: false, hint: "Optional, for registered businesses" },
  { tag: "PHOTO", label: "Recent Photograph", required: true,  hint: "Passport-sized · JPG" },
  { tag: "CHEQUE", label: "Cancelled Cheque", required: true,  hint: "Bank account proof" },
] as const;

type KycDoc = {
  slot: string;
  fileName: string;
  documentId?: string;
  storageKey?: string;
  uploading: boolean;
  error?: string;
  mimeType?: string;
  sizeBytes?: number;
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  Onboarding flow component                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

export default function PartnerOnboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();

  /* form state — kept flat for simplicity */
  const [step, setStep] = useState<Step>("contact");
  const [submitting, setSubmitting] = useState(false);
  const [onboardingToken, setOnboardingToken] = useState<string>("");

  // contact
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("+91");
  const [contactPerson, setContactPerson] = useState("");

  // otp
  const [devMobileOtp, setDevMobileOtp] = useState<string | undefined>();
  const [devEmailOtp, setDevEmailOtp] = useState<string | undefined>();
  const [mobileCode, setMobileCode] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [mobileResendIn, setMobileResendIn] = useState(0);
  const [emailResendIn, setEmailResendIn] = useState(0);

  // business
  const [businessName, setBusinessName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");

  // kyc
  const [docs, setDocs] = useState<KycDoc[]>([]);

  // bank
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");

  // success
  const [createdPartner, setCreatedPartner] = useState<{
    partnerCode: string;
    businessName: string;
    generatedPassword?: string;
  } | null>(null);

  /* ─── resend timers ──────────────────────────────────────────────────── */
  useEffect(() => {
    if (mobileResendIn <= 0) return;
    const t = setTimeout(() => setMobileResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [mobileResendIn]);
  useEffect(() => {
    if (emailResendIn <= 0) return;
    const t = setTimeout(() => setEmailResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [emailResendIn]);

  const stepIdx = STEP_ORDER.indexOf(step);
  const progress = Math.round((stepIdx / (STEP_ORDER.length - 1)) * 100);

  /* ─── step handlers ──────────────────────────────────────────────────── */

  async function submitContact() {
    if (!email.includes("@") || mobile.replace(/\D/g, "").length < 10 || !contactPerson) {
      toast({ title: "Missing details", description: "Please fill all the fields correctly.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await credupeApi.partnerOnboarding.start({ email, mobile, contactPerson });
      setOnboardingToken(res.onboardingToken);
      // immediately request the mobile OTP
      const otpRes = await credupeApi.partnerOnboarding.requestOtp({
        channel: "mobile", destination: mobile, onboardingToken: res.onboardingToken,
      });
      setDevMobileOtp(otpRes.devOtp);
      setMobileResendIn(30);
      setStep("mobileOtp");
    } catch (err) {
      const msg = err instanceof CredupeApiError ? err.messages[0] : "Could not start onboarding";
      toast({ title: "Onboarding error", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  async function resendOtp(channel: "mobile" | "email") {
    try {
      const dest = channel === "mobile" ? mobile : email;
      const otpRes = await credupeApi.partnerOnboarding.requestOtp({
        channel, destination: dest, onboardingToken,
      });
      if (channel === "mobile") { setDevMobileOtp(otpRes.devOtp); setMobileResendIn(30); }
      else { setDevEmailOtp(otpRes.devOtp); setEmailResendIn(30); }
      toast({ title: "OTP sent", description: `Code sent to ${dest}.` });
    } catch (err) {
      const msg = err instanceof CredupeApiError ? err.messages[0] : "Could not resend";
      toast({ title: "Resend failed", description: msg, variant: "destructive" });
    }
  }

  async function verifyMobile() {
    if (mobileCode.length < 4) {
      toast({ title: "Invalid code", description: "Enter the 6-digit OTP.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await credupeApi.partnerOnboarding.verifyOtp({
        channel: "mobile", destination: mobile, code: mobileCode, onboardingToken,
      });
      setOnboardingToken(res.onboardingToken);
      // request email OTP
      const otpRes = await credupeApi.partnerOnboarding.requestOtp({
        channel: "email", destination: email, onboardingToken: res.onboardingToken,
      });
      setDevEmailOtp(otpRes.devOtp);
      setEmailResendIn(30);
      setStep("emailOtp");
    } catch (err) {
      const msg = err instanceof CredupeApiError ? err.messages[0] : "Invalid OTP";
      toast({ title: "Verification failed", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  async function verifyEmail() {
    if (emailCode.length < 4) {
      toast({ title: "Invalid code", description: "Enter the 6-digit OTP.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await credupeApi.partnerOnboarding.verifyOtp({
        channel: "email", destination: email, code: emailCode, onboardingToken,
      });
      setOnboardingToken(res.onboardingToken);
      setStep("business");
    } catch (err) {
      const msg = err instanceof CredupeApiError ? err.messages[0] : "Invalid OTP";
      toast({ title: "Verification failed", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  function submitBusiness() {
    if (!businessName) {
      toast({ title: "Business name required", description: "Please enter your firm's name.", variant: "destructive" });
      return;
    }
    if (gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNumber)) {
      toast({ title: "Invalid GSTIN", description: "Format must be a 15-character GSTIN (e.g. 27AABCD1234E1Z5).", variant: "destructive" });
      return;
    }
    if (panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber)) {
      toast({ title: "Invalid PAN", description: "Format must be ABCDE1234F.", variant: "destructive" });
      return;
    }
    setStep("kyc");
  }

  async function handleFile(slot: string, file: File) {
    const tempDocId = `temp-${slot}-${Date.now()}`;
    // Mark slot as uploading
    setDocs((prev) => [
      ...prev.filter((d) => d.slot !== slot),
      {
        slot,
        fileName: file.name,
        uploading: true,
        documentId: tempDocId,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
      } as KycDoc,
    ]);

    try {
      // 1. Get R2 presigned URL
      const presign = await credupeApi.partnerOnboarding.presignKyc({
        onboardingToken,
        tag: slot,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
      });

      // 2. Put file to R2 proxy endpoint (resolved to absolute backend host)
      const absoluteUploadUrl = presign.uploadUrl.startsWith("/api/v1")
        ? `${credupeApi.base}${presign.uploadUrl.substring(7)}`
        : presign.uploadUrl;

      const uploadResp = await fetch(absoluteUploadUrl, {
        method: presign.method,
        headers: presign.headers,
        body: file,
      });

      if (!uploadResp.ok) {
        throw new Error(`Failed to upload to R2 (HTTP ${uploadResp.status})`);
      }

      // 3. Mark upload complete and store reference keys
      setDocs((prev) => [
        ...prev.filter((d) => d.slot !== slot),
        {
          slot,
          fileName: file.name,
          uploading: false,
          documentId: presign.docId,
          storageKey: presign.storageKey,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
        } as KycDoc,
      ]);
    } catch (err: any) {
      console.error("[kyc-upload-error]", err);
      const errMsg = err?.message || String(err);
      toast({
        title: `Upload failed for ${slot}`,
        description: errMsg,
        variant: "destructive",
      });
      // Mark slot as errored
      setDocs((prev) => [
        ...prev.filter((d) => d.slot !== slot),
        {
          slot,
          fileName: file.name,
          uploading: false,
          error: errMsg,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
        } as KycDoc,
      ]);
    }
  }

  function removeDoc(slot: string) {
    setDocs((prev) => prev.filter((d) => d.slot !== slot));
  }

  function submitKyc() {
    const missing = KYC_DOC_SLOTS.filter(
      (s) => s.required && !docs.find((d) => d.slot === s.tag && d.documentId),
    );
    if (missing.length) {
      toast({
        title: "Missing documents",
        description: `Please upload: ${missing.map((m) => m.label).join(", ")}`,
        variant: "destructive",
      });
      return;
    }
    setStep("bank");
  }

  async function submitBank() {
    if (!bankName || !accountNumber || !ifsc) {
      toast({ title: "Bank details incomplete", description: "All bank fields are required.", variant: "destructive" });
      return;
    }
    if (!/^\d{9,18}$/.test(accountNumber)) {
      toast({ title: "Invalid Account Number", description: "Account number must be between 9 and 18 digits.", variant: "destructive" });
      return;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      toast({ title: "Invalid IFSC Code", description: "IFSC code must be 11 characters (e.g. HDFC0001234).", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const kycDocuments = docs
        .filter((d) => d.documentId && !d.documentId.startsWith("temp-"))
        .map((d) => ({
          tag: d.slot,
          fileName: d.fileName,
          mimeType: d.mimeType,
          sizeBytes: d.sizeBytes,
          documentId: d.documentId,
          storageKey: d.storageKey,
        }));
      const res = await credupeApi.partnerOnboarding.finalize({
        onboardingToken,
        businessName, gstNumber, panNumber,
        city, state, pincode, address,
        bankName, accountHolder: accountHolder || businessName, accountNumber, ifsc,
        kycDocuments,
      });
      setCreatedPartner({
        partnerCode: res.partner.partnerCode,
        businessName: res.partner.businessName,
        generatedPassword: res.generatedPassword,
      });
      setStep("success");
    } catch (err) {
      const msg = err instanceof CredupeApiError ? err.messages[0] : "Could not complete onboarding";
      toast({ title: "Onboarding error", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  /* ─── render ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10">
        {/* Banner */}
        <section className="mb-10">
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 rounded-3xl p-8 md:p-12 text-primary-foreground relative overflow-hidden">
            <Sparkles className="absolute right-8 top-8 w-16 h-16 text-white/10" />
            <Building2 className="w-10 h-10 mb-3 text-white/80" />
            <h1 className="text-3xl md:text-4xl font-bold">Become a CreduPe Partner</h1>
            <p className="text-primary-foreground/80 mt-2 max-w-xl text-sm md:text-base">
              Sign up in 5 minutes. Verify your contact, upload KYC, link your payout account — and start earning on every loan you refer.
            </p>
            <div className="flex flex-wrap gap-6 mt-6 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2"><Check className="w-4 h-4" /> 80+ lender catalogue</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4" /> Up to 2% commission</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4" /> Weekly payouts</div>
            </div>
          </div>
        </section>

        {/* Stepper */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground" data-testid="onboarding-current-step">
              Step {stepIdx + 1} of {STEP_ORDER.length} · {STEP_LABEL[step]}
            </p>
            <p className="text-xs text-muted-foreground">{progress}%</p>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="flex items-center justify-between mt-3 text-[10px] uppercase tracking-wide text-muted-foreground">
            {STEP_ORDER.map((s, i) => (
              <div key={s} className={`flex-1 text-center ${i <= stepIdx ? "text-primary font-semibold" : ""}`}>
                {STEP_LABEL[s]}
              </div>
            ))}
          </div>
        </section>

        {/* Step content */}
        <section className="bg-card border border-border rounded-2xl p-6 md:p-10">
          <AnimatePresence mode="wait">
            {step === "contact" && (
              <ContactStep
                key="contact"
                email={email} setEmail={setEmail}
                mobile={mobile} setMobile={setMobile}
                contactPerson={contactPerson} setContactPerson={setContactPerson}
                onSubmit={submitContact}
                submitting={submitting}
              />
            )}
            {step === "mobileOtp" && (
              <OtpStep
                key="mobileOtp"
                title="Verify your mobile"
                description={`We've sent a 6-digit code to ${mobile}.`}
                code={mobileCode} setCode={setMobileCode}
                onVerify={verifyMobile}
                onResend={() => resendOtp("mobile")}
                resendIn={mobileResendIn}
                devOtp={devMobileOtp}
                onBack={() => setStep("contact")}
                submitting={submitting}
                icon={<Phone className="w-6 h-6" />}
                testId="mobile-otp"
              />
            )}
            {step === "emailOtp" && (
              <OtpStep
                key="emailOtp"
                title="Verify your email"
                description={`We've sent a 6-digit code to ${email}.`}
                code={emailCode} setCode={setEmailCode}
                onVerify={verifyEmail}
                onResend={() => resendOtp("email")}
                resendIn={emailResendIn}
                devOtp={devEmailOtp}
                onBack={() => setStep("mobileOtp")}
                submitting={submitting}
                icon={<Mail className="w-6 h-6" />}
                testId="email-otp"
              />
            )}
            {step === "business" && (
              <BusinessStep
                key="business"
                businessName={businessName} setBusinessName={setBusinessName}
                gstNumber={gstNumber} setGstNumber={setGstNumber}
                panNumber={panNumber} setPanNumber={setPanNumber}
                city={city} setCity={setCity}
                state={state} setState={setState}
                pincode={pincode} setPincode={setPincode}
                address={address} setAddress={setAddress}
                onBack={() => setStep("emailOtp")}
                onSubmit={submitBusiness}
              />
            )}
            {step === "kyc" && (
              <KycStep
                key="kyc"
                docs={docs}
                onFile={handleFile}
                onRemove={removeDoc}
                onBack={() => setStep("business")}
                onSubmit={submitKyc}
              />
            )}
            {step === "bank" && (
              <BankStep
                key="bank"
                bankName={bankName} setBankName={setBankName}
                accountHolder={accountHolder} setAccountHolder={setAccountHolder}
                accountNumber={accountNumber} setAccountNumber={setAccountNumber}
                ifsc={ifsc} setIfsc={setIfsc}
                businessName={businessName}
                onBack={() => setStep("kyc")}
                onSubmit={submitBank}
                submitting={submitting}
              />
            )}
            {step === "success" && createdPartner && (
              <SuccessStep
                key="success"
                partner={createdPartner}
                onGoToDashboard={() => navigate("/partner-dashboard")}
              />
            )}
          </AnimatePresence>
        </section>

        {step === "contact" && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already a partner?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary font-semibold hover:underline"
              data-testid="partner-go-to-login"
            >
              Log in here
            </button>
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Sub-components                                                            */
/* ────────────────────────────────────────────────────────────────────────── */

function StepShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

function ContactStep(p: {
  email: string; setEmail: (v: string) => void;
  mobile: string; setMobile: (v: string) => void;
  contactPerson: string; setContactPerson: (v: string) => void;
  onSubmit: () => void; submitting: boolean;
}) {
  return (
    <StepShell>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Tell us about you</h2>
          <p className="text-sm text-muted-foreground">We&apos;ll send OTPs to verify both contacts.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Contact Person" icon={<Building2 className="w-4 h-4" />}>
          <input
            data-testid="onboard-contact-person"
            value={p.contactPerson}
            onChange={(e) => p.setContactPerson(e.target.value)}
            placeholder="Your full name"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </Field>
        <Field label="Mobile" icon={<Phone className="w-4 h-4" />}>
          <input
            data-testid="onboard-mobile"
            value={p.mobile}
            onChange={(e) => p.setMobile(e.target.value)}
            placeholder="+91 98765 43210"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </Field>
        <Field label="Work Email" icon={<Mail className="w-4 h-4" />} full>
          <input
            data-testid="onboard-email"
            value={p.email}
            onChange={(e) => p.setEmail(e.target.value)}
            placeholder="you@yourfirm.com"
            type="email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </Field>
      </div>
      <div className="flex justify-end mt-8">
        <PrimaryBtn onClick={p.onSubmit} disabled={p.submitting} testId="onboard-start-btn">
          {p.submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send OTPs"}
          {!p.submitting && <ArrowRight className="w-4 h-4" />}
        </PrimaryBtn>
      </div>

      <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <span>
          Your contact details are encrypted at rest. By continuing you agree to CreduPe&apos;s{" "}
          <a className="text-primary hover:underline" href="/terms-and-conditions">Partner Terms</a>.
        </span>
      </div>
    </StepShell>
  );
}

function OtpStep(p: {
  title: string; description: string;
  code: string; setCode: (v: string) => void;
  onVerify: () => void; onResend: () => void;
  resendIn: number; devOtp?: string;
  onBack: () => void; submitting: boolean;
  icon: React.ReactNode; testId: string;
}) {
  return (
    <StepShell>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {p.icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{p.title}</h2>
          <p className="text-sm text-muted-foreground">{p.description}</p>
        </div>
      </div>
      <input
        data-testid={`${p.testId}-input`}
        autoFocus
        inputMode="numeric"
        maxLength={6}
        value={p.code}
        onChange={(e) => p.setCode(e.target.value.replace(/\D/g, ""))}
        placeholder="000000"
        className="w-full md:w-64 text-center text-2xl font-bold tracking-[0.5em] py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
      />

      {p.devOtp && (
        <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>
            Dev mode (SMS/email mocked): your OTP is{" "}
            <strong className="font-mono">{p.devOtp}</strong>
          </span>
          <button
            onClick={() => { p.setCode(p.devOtp!); }}
            className="ml-auto text-xs px-2 py-1 rounded bg-amber-200 dark:bg-amber-800 hover:opacity-80"
            data-testid={`${p.testId}-autofill`}
          >
            Use it
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={p.onResend}
          disabled={p.resendIn > 0}
          className="text-sm text-primary hover:underline disabled:opacity-50 disabled:no-underline"
          data-testid={`${p.testId}-resend`}
        >
          {p.resendIn > 0 ? `Resend in ${p.resendIn}s` : "Resend code"}
        </button>
      </div>

      <div className="flex items-center justify-between mt-8">
        <SecondaryBtn onClick={p.onBack}>
          <ArrowLeft className="w-4 h-4" /> Back
        </SecondaryBtn>
        <PrimaryBtn onClick={p.onVerify} disabled={p.submitting} testId={`${p.testId}-verify`}>
          {p.submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & continue"}
          {!p.submitting && <ArrowRight className="w-4 h-4" />}
        </PrimaryBtn>
      </div>
    </StepShell>
  );
}

function BusinessStep(p: any) {
  return (
    <StepShell>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Business details</h2>
          <p className="text-sm text-muted-foreground">Tell us about the entity you&apos;ll be transacting through.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Business / Firm Name *" full>
          <input data-testid="onboard-business-name" value={p.businessName} onChange={(e) => p.setBusinessName(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" placeholder="ABC Financial Services LLP" />
        </Field>
        <Field label="GST Number (optional)">
          <input data-testid="onboard-gst" value={p.gstNumber} onChange={(e) => p.setGstNumber(e.target.value.toUpperCase())} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 font-mono" placeholder="27AABCD1234E1Z5" />
        </Field>
        <Field label="PAN of Business / Proprietor">
          <input data-testid="onboard-pan" value={p.panNumber} onChange={(e) => p.setPanNumber(e.target.value.toUpperCase())} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 font-mono" placeholder="ABCDE1234F" />
        </Field>
        <Field label="City">
          <input data-testid="onboard-city" value={p.city} onChange={(e) => p.setCity(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" placeholder="Mumbai" />
        </Field>
        <Field label="State">
          <input data-testid="onboard-state" value={p.state} onChange={(e) => p.setState(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" placeholder="Maharashtra" />
        </Field>
        <Field label="Pincode">
          <input data-testid="onboard-pincode" value={p.pincode} onChange={(e) => p.setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" placeholder="400001" />
        </Field>
        <Field label="Office Address" full>
          <textarea data-testid="onboard-address" value={p.address} onChange={(e) => p.setAddress(e.target.value)} rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 resize-none" placeholder="Building, street, area, landmark" />
        </Field>
      </div>
      <div className="flex items-center justify-between mt-8">
        <SecondaryBtn onClick={p.onBack}><ArrowLeft className="w-4 h-4" /> Back</SecondaryBtn>
        <PrimaryBtn onClick={p.onSubmit} testId="onboard-business-next">Continue <ArrowRight className="w-4 h-4" /></PrimaryBtn>
      </div>
    </StepShell>
  );
}

function KycStep(p: {
  docs: KycDoc[];
  onFile: (slot: string, f: File) => void;
  onRemove: (slot: string) => void;
  onBack: () => void; onSubmit: () => void;
}) {
  return (
    <StepShell>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">KYC documents</h2>
          <p className="text-sm text-muted-foreground">Upload clear scans — our team will verify within 24 hours.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {KYC_DOC_SLOTS.map((slot) => {
          const doc = p.docs.find((d) => d.slot === slot.tag);
          return (
            <DocSlot key={slot.tag} slot={slot} doc={doc} onFile={p.onFile} onRemove={p.onRemove} />
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-8">
        <SecondaryBtn onClick={p.onBack}><ArrowLeft className="w-4 h-4" /> Back</SecondaryBtn>
        <PrimaryBtn onClick={p.onSubmit} testId="onboard-kyc-next">Continue <ArrowRight className="w-4 h-4" /></PrimaryBtn>
      </div>
    </StepShell>
  );
}

function DocSlot({
  slot, doc, onFile, onRemove,
}: {
  slot: typeof KYC_DOC_SLOTS[number];
  doc?: KycDoc;
  onFile: (slot: string, f: File) => void;
  onRemove: (slot: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploaded = !!doc?.documentId;

  return (
    <div
      data-testid={`kyc-slot-${slot.tag.toLowerCase()}`}
      className={`rounded-xl border-2 border-dashed p-4 transition-colors ${
        uploaded ? "border-green-500/40 bg-green-500/5" : "border-border hover:border-primary/40"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {slot.label} {slot.required && <span className="text-red-500">*</span>}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{slot.hint}</p>
        </div>
        {uploaded && <Check className="w-5 h-5 text-green-600" />}
      </div>

      {doc && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {doc.uploading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          {doc.error && <AlertCircle className="w-4 h-4 text-red-500" />}
          <span className="truncate flex-1 text-foreground">{doc.fileName}</span>
          {!doc.uploading && (
            <button
              onClick={() => onRemove(slot.tag)}
              className="p-1 rounded text-muted-foreground hover:text-red-500"
              data-testid={`kyc-slot-${slot.tag.toLowerCase()}-remove`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {!uploaded && (
        <button
          onClick={() => inputRef.current?.click()}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
          data-testid={`kyc-slot-${slot.tag.toLowerCase()}-upload`}
        >
          <UploadCloud className="w-4 h-4" /> Choose file
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(slot.tag, f);
        }}
      />
    </div>
  );
}

function BankStep(p: any) {
  return (
    <StepShell>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Banknote className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Payout account</h2>
          <p className="text-sm text-muted-foreground">Your commission will be transferred here weekly.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Bank Name *">
          <input data-testid="onboard-bank-name" value={p.bankName} onChange={(e) => p.setBankName(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" placeholder="HDFC Bank" />
        </Field>
        <Field label="Account Holder">
          <input data-testid="onboard-account-holder" value={p.accountHolder} onChange={(e) => p.setAccountHolder(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" placeholder={p.businessName || "Same as business"} />
        </Field>
        <Field label="Account Number *">
          <input data-testid="onboard-account-no" value={p.accountNumber} onChange={(e) => p.setAccountNumber(e.target.value.replace(/\D/g, ""))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 font-mono" placeholder="000123456789" />
        </Field>
        <Field label="IFSC Code *">
          <input data-testid="onboard-ifsc" value={p.ifsc} onChange={(e) => p.setIfsc(e.target.value.toUpperCase())} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 font-mono" placeholder="HDFC0001234" />
        </Field>
      </div>
      <div className="flex items-center justify-between mt-8">
        <SecondaryBtn onClick={p.onBack}><ArrowLeft className="w-4 h-4" /> Back</SecondaryBtn>
        <PrimaryBtn onClick={p.onSubmit} disabled={p.submitting} testId="onboard-finalize-btn">
          {p.submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Finish onboarding"}
          {!p.submitting && <Check className="w-4 h-4" />}
        </PrimaryBtn>
      </div>
    </StepShell>
  );
}

function SuccessStep({
  partner, onGoToDashboard,
}: {
  partner: { partnerCode: string; businessName: string; generatedPassword?: string };
  onGoToDashboard: () => void;
}) {
  const { toast } = useToast();
  return (
    <StepShell>
      <div className="text-center py-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center text-green-600 mb-6"
        >
          <Check className="w-10 h-10" />
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="onboard-success-title">
          Welcome aboard, {partner.businessName}!
        </h2>
        <p className="text-muted-foreground mt-2">Your partner account is ready.</p>

        <div className="mt-8 inline-block bg-muted/40 border border-border rounded-xl p-5 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Partner Code</p>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-2xl font-bold font-mono text-primary" data-testid="onboard-partner-code">
              {partner.partnerCode}
            </p>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(partner.partnerCode);
                toast({ title: "Copied", description: "Partner code copied to clipboard." });
              }}
              className="p-1.5 rounded hover:bg-muted transition-colors"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Share this with customers to attribute leads to you.</p>
        </div>

        {partner.generatedPassword && (
          <div className="mt-4 inline-block bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl p-4 text-left max-w-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-200">
              Temporary password
            </p>
            <p className="text-sm font-mono mt-1 text-amber-900 dark:text-amber-200">{partner.generatedPassword}</p>
            <p className="text-xs text-amber-800 dark:text-amber-300/80 mt-1">Save it now — you can change it from the dashboard.</p>
          </div>
        )}

        <div className="mt-8">
          <PrimaryBtn onClick={onGoToDashboard} testId="onboard-goto-dashboard">
            Open my dashboard <ArrowRight className="w-4 h-4" />
          </PrimaryBtn>
        </div>
      </div>
    </StepShell>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Primitives                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

function Field({
  label, icon, children, full,
}: { label: string; icon?: React.ReactNode; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

function PrimaryBtn({
  children, onClick, disabled, testId,
}: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; testId?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
    >
      {children}
    </button>
  );
}

function SecondaryBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors"
      data-testid="onboard-back-btn"
    >
      {children}
    </button>
  );
}
