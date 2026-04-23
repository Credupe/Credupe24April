// Shim kept for API compatibility with the original (Lovable-generated) code.
// The original integration requires `@lovable.dev/cloud-auth-js` which isn't
// available outside the Lovable runtime, so we provide a no-op stub that
// degrades gracefully. When Supabase env vars are wired up, standard
// `supabase.auth.signInWith*` flows will still work from the pages.
import { supabase } from "../supabase/client";

type SignInOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

export const lovable = {
  auth: {
    signInWithOAuth: async (
      provider: "google" | "apple" | "microsoft",
      opts?: SignInOptions,
    ) => {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo:
              opts?.redirect_uri ??
              (typeof window !== "undefined" ? window.location.origin : undefined),
            queryParams: opts?.extraParams,
          },
        });
        if (error) return { error };
        return { redirected: true, data };
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
    },
  },
};
