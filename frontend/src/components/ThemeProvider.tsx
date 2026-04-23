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
    try { window.localStorage.setItem("theme", t); } catch { /* quota, etc. */ }
  };

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

/**
 * Inline script that runs before React hydration to set the correct class
 * on <html> so we never flash the wrong theme. Emit this in the <head>.
 */
export const themePreloadScript = `
(function(){try{
  var t = localStorage.getItem('theme');
  var d = t === 'dark';
  var r = document.documentElement;
  r.classList.remove('light','dark');
  r.classList.add(d ? 'dark' : 'light');
  r.style.colorScheme = d ? 'dark' : 'light';
}catch(e){}})();
`;
