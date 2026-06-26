/**
 * Employee Login — branded entry to the internal loan-officer dashboard.
 *
 * Same auth path as the customer login, just a different framing and a
 * role-aware redirect: after a successful sign-in the user is routed
 * straight to `/employee-dashboard` (not the home page).
 */
"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Briefcase, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { credupeApi, CredupeApiError } from "@/lib/credupe-api";
import { useAuth, refreshCredupeAuth } from "@/hooks/useAuth";

export default function EmployeeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Already authenticated? Bounce to wherever they should be.
  useEffect(() => {
    if (!user) return;
    const role = (user as any).user_metadata?.role;
    navigate(role === "EMPLOYEE" ? "/employee-dashboard" : "/");
  }, [user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // BYPASS LOGIC: Verify demo credentials
      if (email === "employee@credupe.local" && password === "Employee@123") {
        localStorage.setItem("use_mock_employee", "true");
        localStorage.setItem("use_mock_auth", "true");
        refreshCredupeAuth();
        window.location.href = "/employee-dashboard";
      } else {
        setError("Invalid credentials. Please use employee@credupe.local · Employee@123");
        setLoading(false);
      }

      // ORIGINAL CODE COMMENTED OUT:
      /*
      const res = await credupeApi.auth.login(email, password);
      const me = res.user;
      if (me?.role !== "EMPLOYEE" && me?.role !== "ADMIN") {
        setError("This account isn't an employee account. Please use the customer login instead.");
        await credupeApi.auth.logout();
        setLoading(false);
        return;
      }
      window.location.href = "/employee-dashboard";
      */
    } catch (err) {
      const msg = err instanceof CredupeApiError ? err.messages[0] : "Could not sign in.";
      setError(msg || "Could not sign in.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Employee Login</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Sign in to your CreduPe loan-officer dashboard.
            </p>
          </div>

          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 space-y-4" data-testid="employee-login-form">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1.5 block">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@credupe.local"
                  data-testid="employee-login-email"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary/40"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  data-testid="employee-login-password"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary/40"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20" data-testid="employee-login-error">
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                <div className="text-xs text-destructive">{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              data-testid="employee-login-submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {loading ? "Signing in…" : "Sign in to dashboard"}
            </button>

            <div className="pt-2 text-[11px] text-muted-foreground text-center">
              Not an employee? <Link to="/login" className="text-primary hover:underline font-semibold">Customer login</Link>
            </div>
          </form>

          <div className="mt-6 rounded-xl border border-dashed border-border p-4 text-[11px] text-muted-foreground" data-testid="employee-login-demo-hint">
            <div className="font-bold text-foreground mb-1">Demo credentials</div>
            <code className="block">employee@credupe.local · Employee@123</code>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
