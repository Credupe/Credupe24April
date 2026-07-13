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
    paddingBottom: 32,
  },
  menuContainer: {
    paddingHorizontal: 12,
    marginTop: 8,
  },
  sectionTitle: {
    ...THEME.typography.sectionTitle,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});
