"use client";

import { useEffect, useState, createContext, useContext } from "react";

type Theme = "light" | "dark";
interface ThemeCtx { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void; }

const ThemeContext = createContext<ThemeCtx>({
  theme: "light",
  setTheme: () => {},
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // `mounted` guards against hydration mismatch — we honour whatever the
  // pre-render script set on <html> first, then sync React state on mount.
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && window.localStorage.getItem("theme")) as Theme | null;
    const initial: Theme = stored === "dark" ? "dark" : "light";
    apply(initial);
    setThemeState(initial);
  }, []);

  const apply = (t: Theme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(t);
    root.style.colorScheme = t;
  };

  const setTheme = (t: Theme) => {
    apply(t);
    setThemeState(t);
    try { window.localStorage.setItem("theme", t); }
    catch (err) {
      // localStorage can throw (quota exceeded, private browsing, disabled
      // cookies). Surface it in dev so we notice regressions, but don't
      // break the UI in prod — the theme still applies for the session.
      if (process.env.NODE_ENV !== "production") {
        console.warn("[theme] persist failed:", err);
      }
    }
  };

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

// `themePreloadScript` is no longer exported — the same logic now lives
// in `public/theme-preload.js` and is loaded via a <Script src="…">
// tag in app/layout.tsx, so the app no longer needs
// dangerouslySetInnerHTML.
