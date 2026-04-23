import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { credupeApi, CredupeApiError } from "@/lib/credupe-api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, KeyRound, Eye, EyeOff, User, Phone } from "lucide-react";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Try Credupe backend first (registers + auto-logs-in). Falls back to
        // Supabase on any network/server error so legacy env keeps working.
        try {
          await credupeApi.auth.register({
            email,
            password,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            mobile: phone ? `+${phone.replace(/\D/g, "")}` : undefined,
          });
          // Reload to re-bootstrap useAuth (Credupe tokens are in localStorage).
          window.location.href = "/";
          return;
        } catch (e) {
          if (e instanceof CredupeApiError && (e.status === 409 || e.status === 400)) {
            setError(e.messages[0] || "Could not sign up");
            setLoading(false);
            return;
          }
          // fall through to Supabase
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: `${firstName} ${lastName}`.trim(),
              phone,
            },
          },
        });
        if (error) {
          setError(error.message);
        } else {
          setSuccessMsg("Check your email to verify your account before signing in.");
        }
      } else {
        // Try Credupe backend first.
        try {
          await credupeApi.auth.login(email, password);
          window.location.href = "/";
          return;
        } catch (e) {
          if (e instanceof CredupeApiError && e.status === 401) {
            // Let Supabase try with the same creds — if THAT also fails we surface the original msg.
            const { error: supaErr } = await supabase.auth.signInWithPassword({ email, password });
            if (supaErr) {
              setError(e.messages[0] || supaErr.message);
            }
          } else if (e instanceof CredupeApiError) {
            setError(e.messages[0] || "Could not log in");
          } else {
            // Network / unknown — fall back to Supabase for resilience.
            const { error: supaErr } = await supabase.auth.signInWithPassword({ email, password });
            if (supaErr) setError(supaErr.message);
          }
        }
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) setError("Failed to sign in. Please try again.");
      if (result.redirected) return;
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setSuccessMsg("Password reset link sent to your email.");
    setLoading(false);
  };

  const InputField = ({
    label,
    icon: Icon,
    type = "text",
    value,
    onChange,
    placeholder,
    required = true,
    maxLength,
    showToggle,
    toggleState,
    onToggle,
  }: {
    label: string;
    icon: any;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    required?: boolean;
    maxLength?: number;
    showToggle?: boolean;
    toggleState?: boolean;
    onToggle?: () => void;
  }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-primary">{label}</label>
      <div className="flex items-center gap-3 bg-background rounded-xl border border-input px-4 py-3 focus-within:ring-2 focus-within:ring-ring">
        <Icon className="w-5 h-5 text-primary/60 shrink-0" />
        <input
          type={showToggle ? (toggleState ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          minLength={type === "password" ? 6 : undefined}
          className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none"
        />
        {showToggle && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="text-primary/60 hover:text-primary transition-colors"
          >
            {toggleState ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
      <Navbar />
      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              {isSignUp ? "Sign Up" : "Login"}
            </h1>
            <p className="text-muted-foreground mt-1 text-base">
              {isSignUp
                ? "Sign up to access your CreduPe portal"
                : "Login to access your CreduPe portal"}
            </p>
          </div>

          <div className="bg-secondary/40 rounded-2xl p-8 space-y-5">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="bg-primary/10 text-primary text-sm p-3 rounded-lg">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignUp && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="First name"
                    icon={User}
                    value={firstName}
                    onChange={setFirstName}
                    placeholder="Enter First Name"
                    maxLength={50}
                  />
                  <InputField
                    label="Last name"
                    icon={User}
                    value={lastName}
                    onChange={setLastName}
                    placeholder="Enter Last Name"
                    maxLength={50}
                  />
                </div>
              )}

              {isSignUp ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Email ID"
                    icon={Mail}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                  />
                  <InputField
                    label="Phone number"
                    icon={Phone}
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                    placeholder="Enter Phone Number"
                    required={false}
                    maxLength={10}
                  />
                </div>
              ) : (
                <InputField
                  label="Email ID"
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                />
              )}

              {isSignUp ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Password"
                    icon={KeyRound}
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="••••••••"
                    showToggle
                    toggleState={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                  />
                  <InputField
                    label="Confirm password"
                    icon={KeyRound}
                    type="password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Enter Confirm Password"
                    showToggle
                    toggleState={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>
              ) : (
                <>
                  <InputField
                    label="Password"
                    icon={KeyRound}
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="••••••••"
                    showToggle
                    toggleState={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                  />
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-primary font-medium hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                </>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto sm:min-w-[200px] mx-auto block py-3.5 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading
                  ? "Please wait..."
                  : isSignUp
                  ? "Signup"
                  : "Login"}
              </button>
            </form>

            {/* Toggle sign up / login */}
            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setSuccessMsg(null);
                  setConfirmPassword("");
                  setFirstName("");
                  setLastName("");
                  setPhone("");
                }}
                className="text-primary font-semibold hover:underline"
              >
                {isSignUp ? "Login" : "Sign up"}
              </button>
            </p>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">
                Or {isSignUp ? "Sign up" : "login"} with
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full sm:w-auto sm:min-w-[200px] mx-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl border border-border bg-background font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {googleLoading ? "Signing in..." : "Google"}
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-5">
            By signing in, you agree to CreduPe's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
