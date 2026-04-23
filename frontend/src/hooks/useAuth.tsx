"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { credupeApi, credupeTokens } from "@/lib/credupe-api";

/**
 * Hybrid auth. We look for a Credupe NestJS session first (JWT in
 * localStorage from credupeApi.auth.login). If none, we fall back to the
 * original Supabase session so existing Supabase-driven screens keep working.
 * The exposed shape is deliberately identical to the original hook so every
 * consuming component works unchanged.
 */
interface CredupeSessionUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
}

interface AuthContextType {
  user: (User | CredupeSessionUser) | null;
  session: Session | null;
  isReady: boolean;
  /** "credupe" when logged in via NestJS, "supabase" otherwise (for internal use). */
  authSource?: "credupe" | "supabase" | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isReady: false,
  authSource: null,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<(User | CredupeSessionUser) | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authSource, setAuthSource] = useState<"credupe" | "supabase" | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      // 1. Try Credupe backend first
      if (credupeApi.auth.isAuthenticated()) {
        try {
          const me = await credupeApi.auth.me();
          if (cancelled) return;
          setUser({
            id: me.sub,
            email: me.email,
            user_metadata: { role: me.role },
          });
          setAuthSource("credupe");
          setIsReady(true);
          return;
        } catch {
          credupeTokens.clear(); // invalid token — clear and fall through
        }
      }

      // 2. Fall back to Supabase
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setAuthSource(data.session ? "supabase" : null);
      setIsReady(true);
    }

    bootstrap();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (authSource === "credupe") return; // Credupe wins; don't clobber
      setSession(s);
      setUser(s?.user ?? null);
      setAuthSource(s ? "supabase" : null);
    });

    return () => { cancelled = true; subscription.unsubscribe(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    if (authSource === "credupe") {
      await credupeApi.auth.logout();
    } else {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setAuthSource(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, isReady, authSource, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

/**
 * Let pages/components trigger a fresh auth state read after logging in
 * via the Credupe API (since we don't have a shared emitter like Supabase).
 * Usage: after `await credupeApi.auth.login(...)`, call `refreshCredupeAuth()`
 * — it dispatches a storage event that the hook picks up on remount.
 */
export function refreshCredupeAuth() {
  if (typeof window !== "undefined") {
    // Force a reload of the auth hook's bootstrap by triggering a soft event.
    window.dispatchEvent(new Event("credupe:auth-changed"));
  }
}
