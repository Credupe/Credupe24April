import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // Main Containers
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Light header safe area background
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F5FF", // Light violet-tinted background
  },
  
  // Custom Themed Header
  header: {
    height: 60,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E3F0",
  },
  headerBackButton: {
    padding: 8,
    marginRight: 8,
  },
  headerBackButtonText: {
    color: "#7C3AED", // CreduPe brand violet
    fontSize: 24,
    fontWeight: "600",
  },
  headerTitle: {
    color: "#0B0B14", // Dark text
    fontSize: 18,
    fontWeight: "700",
  },

  // Bank List Screen
  listContent: {
    padding: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#5B5B6B", // Muted text
    marginBottom: 16,
    marginTop: 8,
  },
  bankCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E3F0", // Light border
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bankName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0B0B14", // Dark text
    flex: 1,
    marginRight: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  copyButton: {
    borderWidth: 1,
    borderColor: "#7C3AED", // Violet border
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  copyButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#7C3AED", // Violet text
  },
  applyButton: {
    backgroundColor: "#7C3AED", // Violet background
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  applyButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF", // White text
  },

  // Form Screen Styling
  formScrollView: {
    flex: 1,
    backgroundColor: "#F7F5FF", // Light violet-tinted background
  },
  formScrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formContainerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E3F0",
    padding: 16,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Card Brand Header
  cardBrandHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E3F0",
    paddingBottom: 16,
    marginBottom: 16,
  },
  applicationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B0B14",
    flex: 1,
    marginLeft: 12,
  },

  // Step Indicators
  stepIndicatorContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#7C3AED", // Violet step circle
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  stepCircleText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0B0B14",
  },

  // Step Header Details
  stepsSub: {
    fontSize: 13,
    color: "#5B5B6B",
    marginBottom: 4,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0B0B14",
    marginBottom: 16,
  },

  // Input styling
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5B5B6B",
    marginBottom: 6,
  },
  requiredAsterisk: {
    color: "#EF4444",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E3F0",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#0B0B14",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    fontSize: 11,
    color: "#EF4444",
    marginTop: 4,
  },

  // Radio styling for Gender
  radioContainer: {
    marginBottom: 16,
  },
  radioLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5B5B6B",
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
    paddingVertical: 6,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E5E3F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioCircleSelected: {
    borderColor: "#7C3AED",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#7C3AED",
  },
  radioText: {
    fontSize: 14,
    color: "#0B0B14",
    fontWeight: "600",
  },

  // Custom Dropdown / Picker styling
  pickerPressable: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E3F0",
    borderRadius: 6,
    paddingVertical: 11,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerText: {
    fontSize: 14,
    color: "#0B0B14",
  },
  pickerPlaceholder: {
    fontSize: 14,
    color: "#5B5B6B",
  },
  caretIcon: {
    borderTopWidth: 6,
    borderTopColor: "#5B5B6B",
    borderLeftWidth: 5,
    borderLeftColor: "transparent",
    borderRightWidth: 5,
    borderRightColor: "transparent",
    width: 0,
    height: 0,
    marginRight: 4,
  },

  // Submit button container and element
  submitButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  submitButtonDisabled: {
    backgroundColor: "#E5E3F0",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginRight: 6,
  },

  // Bottom Sheet Modal (Employment Type Selection)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "50%",
    paddingBottom: 24,
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E3F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B0B14",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5B5B6B",
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E3F0",
  },
  optionText: {
    fontSize: 15,
    color: "#0B0B14",
    fontWeight: "600",
  },
  optionTextSelected: {
    color: "#7C3AED", // CreduPe primary color
    fontWeight: "700",
  },
});
