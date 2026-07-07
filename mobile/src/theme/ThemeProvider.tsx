import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { palette, ThemeColors, ThemeMode } from "./colors";

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
}

const STORAGE_KEY = "credupe.theme.mode";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>("dark");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === "dark" || saved === "light") setModeState(saved);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const setMode = useCallback(async (m: ThemeMode) => {
    setModeState(m);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, m);
    } catch {
      // non-fatal
    }
  }, []);

  const toggle = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, colors: palette[mode], toggle, setMode }),
    [mode, toggle, setMode],
  );

  if (!loaded) return null;
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const v = useContext(ThemeContext);
  if (!v) throw new Error("useTheme must be used inside <ThemeProvider />");
  return v;
};
