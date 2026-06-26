// Ported from the original Lovable-generated client.
// Uses NEXT_PUBLIC_SUPABASE_* env vars (Next.js) instead of Vite's
// `import.meta.env.VITE_SUPABASE_*`. If env vars are missing (e.g. on
// first boot before the user wires Supabase up), we fall back to empty
// strings + a lazy no-op client so page renders don't crash server-side.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SUPABASE_URL) || "";
const SUPABASE_PUBLISHABLE_KEY =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  "";

const hasCredentials = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

export const supabase = hasCredentials
  ? createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : // Lightweight stub that mirrors the bits of the API we touch so that the
    // UI still renders and auth buttons just no-op instead of throwing.
    ({
      auth: {
        async getSession() {
          return { data: { session: null }, error: null } as any;
        },
        onAuthStateChange(_cb: any) {
          return { data: { subscription: { unsubscribe() {} } } } as any;
        },
        async signOut() {
          return { error: null } as any;
        },
        async signInWithOAuth() {
          return {
            data: null,
            error: new Error(
              "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to enable auth.",
            ),
          } as any;
        },
        async setSession() {
          return { data: null, error: null } as any;
        },
      },
      from() {
        return {
          select: async () => ({ data: [], error: null }),
          insert: async () => ({ data: null, error: null }),
        } as any;
      },
      functions: {
        invoke: async () => ({ data: null, error: null }),
      },
    } as any);
