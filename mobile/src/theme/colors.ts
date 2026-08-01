/**
 * Credupe Theme System.
 *
 * Two themes:
 *  - dark  : neon-on-charcoal (matches the Next.js "night mode")
 *  - light : Argon Premium (vibrant modern colors inspired by Argon Design System)
 */

export type ThemeMode = "dark" | "light";

export interface ThemeColors {
  // Surfaces
  bg: string;
  bgGradientTo: string;
  card: string;
  cardElevated: string;
  border: string;
  // Text
  text: string;
  textMuted: string;
  textInverted: string; // text shown on `primary` background
  // Brand
  primary: string;
  primaryMuted: string;
  // Status
  success: string;
  warning: string;
  danger: string;
  info: string;
  // Tab bar
  tabBg: string;
  tabActive: string;
  tabInactive: string;
}

export const dark: ThemeColors = {
  bg: "#0B0F14",
  bgGradientTo: "#1A221A",
  card: "#161C24",
  cardElevated: "#1C2430",
  border: "#232A33",
  text: "#FFFFFF",
  textMuted: "#A1A8B3",
  textInverted: "#000000",
  primary: "#D8FF85",       // neon lime
  primaryMuted: "#1F2A14",
  success: "#7AE582",
  warning: "#FFB454",
  danger: "#FF6B6B",
  info: "#11CDEF",
  tabBg: "#0F1419",
  tabActive: "#D8FF85",
  tabInactive: "#6B7280",
};

export const light: ThemeColors = {
  bg: "#F8F9FE", // Argon secondary/background
  bgGradientTo: "#FFFFFF",
  card: "#FFFFFF",
  cardElevated: "#FFFFFF",
  border: "#E9ECEF", // Argon light border
  text: "#172B4D", // Argon default text
  textMuted: "#8898AA", // Argon muted text
  textInverted: "#FFFFFF",
  primary: "#5E72E4", // Argon primary
  primaryMuted: "#EAECEF", // Lightest shade
  success: "#2DCE89", // Argon success
  warning: "#FB6340", // Argon warning
  danger: "#F5365C", // Argon error
  info: "#11CDEF", // Argon info
  tabBg: "#FFFFFF",
  tabActive: "#5E72E4",
  tabInactive: "#ADB5BD",
};

export const palette: Record<ThemeMode, ThemeColors> = { dark, light };

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const typography = {
  display: { fontSize: 32, fontWeight: "800" as const, letterSpacing: -0.5 },
  h1: { fontSize: 26, fontWeight: "800" as const, letterSpacing: -0.3 },
  h2: { fontSize: 20, fontWeight: "700" as const },
  body: { fontSize: 15, fontWeight: "500" as const },
  caption: { fontSize: 13, fontWeight: "500" as const },
  micro: { fontSize: 11, fontWeight: "600" as const, letterSpacing: 0.6 },
};

export const shadows = {
  argon: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 4,
  },
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  }
};
