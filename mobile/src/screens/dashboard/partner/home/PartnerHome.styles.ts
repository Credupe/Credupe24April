import { StyleSheet } from "react-native";
import { COLORS } from "./constants/colors";
import { THEME } from "./constants/theme";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110, // Extra padding to avoid overlay by the floating bottom navigation
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    ...THEME.typography.sectionTitle,
  },
  sectionSubtitle: {
    ...THEME.typography.subtitle,
    marginTop: 2,
  },
  menuContainer: {
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});
