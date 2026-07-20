import { COLORS } from "./colors";

export const THEME = {
  colors: COLORS,
  typography: {
    greeting: {
      fontSize: 14,
      fontWeight: "500" as const,
      color: COLORS.textMuted,
    },
    companyName: {
      fontSize: 22,
      fontWeight: "800" as const,
      color: COLORS.text,
      letterSpacing: -0.5,
    },
    screenTitle: {
      fontSize: 30,
      fontWeight: "800" as const,
      color: COLORS.text,
      letterSpacing: -1,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: COLORS.text,
    },
    subtitle: {
      fontSize: 13,
      fontWeight: "400" as const,
      color: COLORS.textMuted,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: COLORS.text,
      letterSpacing: -0.5,
    },
    buttonText: {
      fontSize: 15,
      fontWeight: "500" as const,
      color: COLORS.white,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "800" as const,
      color: COLORS.text,
    },
    headerSubtitle: {
      fontSize: 14,
      fontWeight: "500" as const,
      color: COLORS.textMuted,
    },
  },
  shadow: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },
  shadowSoft: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
};
