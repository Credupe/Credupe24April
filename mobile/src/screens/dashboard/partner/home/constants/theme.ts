import { COLORS } from "./colors";

export const THEME = {
  colors: COLORS,
  typography: {
    headerTitle: {
      fontSize: 16,
      fontWeight: "800" as const,
      color: COLORS.text,
    },
    headerSubtitle: {
      fontSize: 11,
      fontWeight: "500" as const,
      color: COLORS.textMuted,
    },
    cardTitle: {
      fontSize: 11,
      fontWeight: "700" as const,
      color: COLORS.text,
      textAlign: "center" as const,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "800" as const,
      color: COLORS.text,
      marginBottom: 12,
    },
  },
  shadow: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  shadowSoft: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
};
