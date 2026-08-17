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
  bg: "#060913", // Rich midnight navy/black
  bgGradientTo: "#0E1326", // Deep space navy
  card: "#0F1626", // Deep slate card
  cardElevated: "#172237", // Lighter slate card
  border: "rgba(255, 255, 255, 0.06)", // Elegant, ultra-fine semi-transparent border
  text: "#F8FAFC", // Bright slate-50
  textMuted: "#94A3B8", // Slate-400
  textInverted: "#FFFFFF",
  primary: "#6366F1",       // Vibrant modern Indigo
  primaryMuted: "#1E1B4B",  // Deep Indigo
  success: "#10B981",       // Emerald Green
  warning: "#F59E0B",       // Amber Gold
  danger: "#EF4444",        // Vibrant Red
  info: "#06B6D4",          // Cyan
  tabBg: "#0B0F19",
  tabActive: "#6366F1",
  tabInactive: "#64748B",
};

export const light: ThemeColors = {
  bg: "#F8FAFC", // Cool slate-50 background
  bgGradientTo: "#F1F5F9", // Slate-100 gradient
  card: "#FFFFFF",
  cardElevated: "#FFFFFF",
  border: "rgba(0, 0, 0, 0.05)", // Soft, clean financial-grade neutral border
  text: "#0F172A", // Slate-900
  textMuted: "#64748B", // Slate-500
  textInverted: "#FFFFFF",
  primary: "#4F46E5", // Indigo-600
  primaryMuted: "#EEF2FF", // Light indigo tint
  success: "#10B981", // Emerald
  warning: "#F59E0B", // Amber
  danger: "#EF4444", // Red
  info: "#06B6D4", // Cyan
  tabBg: "#FFFFFF",
  tabActive: "#4F46E5",
  tabInactive: "#94A3B8",
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
  display: { fontSize: 30, fontWeight: "700" as const, letterSpacing: -0.5 },
  h1: { fontSize: 24, fontWeight: "700" as const, letterSpacing: -0.3 },
  h2: { fontSize: 18, fontWeight: "600" as const },
  body: { fontSize: 14, fontWeight: "400" as const },
  caption: { fontSize: 12, fontWeight: "400" as const },
  micro: { fontSize: 11, fontWeight: "500" as const, letterSpacing: 0.6 },
};

export const shadows = {
  argon: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    shadowOpacity: 0.03,
    elevation: 2,
  },
  soft: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.015,
    shadowRadius: 6,
    elevation: 1,
  }
};
