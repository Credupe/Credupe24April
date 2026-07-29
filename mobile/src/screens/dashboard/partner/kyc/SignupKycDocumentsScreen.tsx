import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as DocumentPicker from "expo-document-picker";

import { RootStackParamList } from "../../../../../App";
import { useTheme } from "../../../../theme/ThemeProvider";
import { radii, spacing, typography } from "../../../../theme/colors";
import { uploadDocument, patchPartnerProfile } from "../../../../api/credupe";

const logoImage = require("../../../../../assets/logo.png");

type Props = NativeStackScreenProps<RootStackParamList, "SignupKycDocuments">;

interface DocumentState {
  uri?: string;
  name?: string;
  size?: number;
  mimeType?: string;
}

type BusinessType = "Proprietorship" | "Individual" | "Partnership" | "Pvt Ltd";

type DocFieldKey =
  | "aadhaarCard"
  | "panCard"
  | "gstRegistration"
  | "cancelledCheque"
  | "passportPhoto"
  | "officePhoto"
  | "photoWithUm"
  | "partnershipDeed"
  | "letterOfAuthorization"
  | "certificateOfIncorporation";

interface DocStep {
  key: DocFieldKey;
  title: string;
  subtitle: string;
  required: boolean;
  fileType: string;
  maxSize: number;
}

const MB = 1024 * 1024;

const DOCUMENT_FLOW: Record<BusinessType, DocStep[]> = {
  Proprietorship: [
    { key: "aadhaarCard", title: "Aadhaar Card", subtitle: "PDF/JPG - <= 10 MB", required: true, fileType: "application/pdf,image/*", maxSize: 10 * MB },
    { key: "panCard", title: "PAN Card", subtitle: "PDF/JPG - <= 5 MB", required: true, fileType: "application/pdf,image/*", maxSize: 5 * MB },
    { key: "gstRegistration", title: "GST Registration (If Any)", subtitle: "Optional", required: false, fileType: "application/pdf,image/*", maxSize: 5 * MB },
    { key: "cancelledCheque", title: "Cancelled Cheque", subtitle: "Bank proof", required: true, fileType: "application/pdf,image/*", maxSize: 5 * MB },
    { key: "passportPhoto", title: "Passport Photo", subtitle: "Recent photo", required: true, fileType: "image/*", maxSize: 5 * MB },
    { key: "officePhoto", title: "Office Photo", subtitle: "Office premises", required: true, fileType: "image/*", maxSize: 5 * MB },
  ],
  Individual: [
    { key: "aadhaarCard", title: "Aadhaar Card", subtitle: "PDF/JPG - <= 10 MB", required: true, fileType: "application/pdf,image/*", maxSize: 10 * MB },
    { key: "panCard", title: "PAN Card", subtitle: "PDF/JPG - <= 5 MB", required: true, fileType: "application/pdf,image/*", maxSize: 5 * MB },
    { key: "gstRegistration", title: "GST Registration (If Any)", subtitle: "Optional", required: false, fileType: "application/pdf,image/*", maxSize: 5 * MB },
    { key: "cancelledCheque", title: "Cancelled Cheque", subtitle: "Bank proof", required: true, fileType: "application/pdf,image/*", maxSize: 5 * MB },
    { key: "passportPhoto", title: "Passport Photo", subtitle: "Recent photo", required: true, fileType: "image/*", maxSize: 5 * MB },
    { key: "photoWithUm", title: "Photo with Credupe Representative", subtitle: "Required", required: true, fileType: "image/*", maxSize: 5 * MB },
  ],
  Partnership: [
    { key: "panCard", title: "PAN Card", subtitle: "Entity PAN", required: true, fileType: "application/pdf,image/*", maxSize: 5 * MB },
    { key: "gstRegistration", title: "GST Registration (If Any)", subtitle: "Optional", required: false, fileType: "application/pdf,image/*", maxSize: 5 * MB },
    { key: "partnershipDeed", title: "Partnership Deed", subtitle: "PDF preferred", required: true, fileType: "application/pdf,image/*", maxSize: 10 * MB },
    { key: "cancelledCheque", title: "Cancelled Cheque", subtitle: "Bank proof", required: true, fileType: "application/pdf,image/*", maxSize: 5 * MB },
    { key: "letterOfAuthorization", title: "Letter of Authorization", subtitle: "Signed copy", required: true, fileType: "application/pdf,image/*", maxSize: 5 * MB },
    { key: "officePhoto", title: "Office Photo", subtitle: "Office premises", required: true, fileType: "image/*", maxSize: 5 * MB },
  ],
  "Pvt Ltd": [
    { key: "panCard", title: "PAN Card", subtitle: "Entity PAN", required: true, fileType: "application/pdf,image/*", maxSize: 5 * MB },
    { key: "gstRegistration", title: "GST Registration (If Any)", subtitle: "Optional", required: false, fileType: "application/pdf,image/*", maxSize: 5 * MB },
    { key: "certificateOfIncorporation", title: "Certificate of Incorporation", subtitle: "ROC certificate", required: true, fileType: "application/pdf,image/*", maxSize: 10 * MB },
    { key: "cancelledCheque", title: "Cancelled Cheque", subtitle: "Bank proof", required: true, fileType: "application/pdf,image/*", maxSize: 5 * MB },
    { key: "letterOfAuthorization", title: "Letter of Authorization", subtitle: "Signed copy", required: true, fileType: "application/pdf,image/*", maxSize: 5 * MB },
    { key: "officePhoto", title: "Office Photo", subtitle: "Office premises", required: true, fileType: "image/*", maxSize: 5 * MB },
  ],
};

export const SignupKycDocumentsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const selectedBusinessType = route.params?.businessType;
  const basicDetails = route.params?.basicDetails;
  const [documents, setDocuments] = useState<Record<DocFieldKey, DocumentState>>({
    aadhaarCard: {},
    panCard: {},
    gstRegistration: {},
    cancelledCheque: {},
    passportPhoto: {},
    officePhoto: {},
    photoWithUm: {},
    partnershipDeed: {},
    letterOfAuthorization: {},
    certificateOfIncorporation: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showKycCompleteModal, setShowKycCompleteModal] = useState(false);

  const businessType: BusinessType =
    selectedBusinessType === "Proprietorship" ||
      selectedBusinessType === "Individual" ||
      selectedBusinessType === "Partnership" ||
      selectedBusinessType === "Pvt Ltd"
      ? selectedBusinessType
      : "Proprietorship";

  const steps = DOCUMENT_FLOW[businessType];

  const pickDocument = async (key: DocFieldKey, fileType: string, maxSize: number) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: fileType,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        if (asset.size && asset.size > maxSize) {
          Toast.show({
            type: "error",
            text1: "File too large",
            text2: `Please select a file smaller than ${maxSize / (1024 * 1024)} MB`,
          });
          return;
        }

        setDocuments((prev) => ({
          ...prev,
          [key]: {
            uri: asset.uri,
            name: asset.name,
            size: asset.size,
            mimeType: asset.mimeType,
          },
        }));
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to pick document. Please try again.",
      });
    }
  };

  const handleContinue = async () => {
    const pendingRequired = steps.find((step) => step.required && !documents[step.key]?.uri);
    if (pendingRequired) {
      Toast.show({
        type: "error",
        text1: "Missing Document",
        text2: `Please upload ${pendingRequired.title}`,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Upload all selected documents
      for (const step of steps) {
        const doc = documents[step.key];
        if (doc?.uri) {
          const response = await fetch(doc.uri);
          const blob = await response.blob();
          const uploadRes = await uploadDocument(
            blob,
            doc.name || `${step.key}.bin`,
            "KYC",
            undefined,
            step.title
          );
          if (!uploadRes.ok) {
            throw new Error(uploadRes.error || `Failed to upload ${step.title}`);
          }
        }
      }

      // Mark onboarding step as COMPLETE and kycStatus as PENDING
      const patchRes = await patchPartnerProfile({
        onboardingStep: "COMPLETE",
        kycStatus: "PENDING",
      });
      if (!patchRes.success) {
        throw new Error(patchRes.error?.message?.join("\n") || "Failed to complete onboarding step");
      }

      setIsLoading(false);
      setShowKycCompleteModal(true);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to upload documents. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const goToDashboard = () => {
    setShowKycCompleteModal(false);
    if (navigation.getState().routeNames.includes("Main")) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" as never }],
      });
      return;
    }

    if (navigation.getState().routeNames.includes("PartnerHomeDirect")) {
      navigation.reset({
        index: 0,
        routes: [{ name: "PartnerHomeDirect" as never }],
      });
      return;
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.safeArea} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.heroSection}>
            <Pressable style={styles.backBtn} onPress={navigation.goBack}>
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>

            <View style={styles.dotPattern} />

            <View style={styles.logoWrap}>
              <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
            </View>

            {/* <View style={styles.iconContainer}>
              <Text style={styles.headerIcon}>📄</Text>
            </View> */}

            <Text style={[styles.title, { color: colors.text }]}>KYC documents</Text>

            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Upload clear scans — our team will verify within 24 hours.
            </Text>

            {(selectedBusinessType || basicDetails?.fullName) ? (
              <View style={styles.contextInfoWrap}>
                {selectedBusinessType ? <Text style={styles.contextInfoText}>Business type: {selectedBusinessType}</Text> : null}
                {basicDetails?.fullName ? <Text style={styles.contextInfoText}>Name: {basicDetails.fullName}</Text> : null}
              </View>
            ) : null}
          </View>

          <View style={styles.formCard}>
            {steps.map((step) => (
              <DocumentUploadBox
                key={step.key}
                title={step.title}
                subtitle={step.subtitle}
                required={step.required}
                document={documents[step.key]}
                onPress={() => pickDocument(step.key, step.fileType, step.maxSize)}
                colors={colors}
              />
            ))}

            <View style={styles.buttonGroup}>
              <Pressable style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={navigation.goBack}>
                <Text style={[styles.secondaryBtnText, { color: colors.text }]}>‹ Back</Text>
              </Pressable>

              <Pressable
                style={[styles.primaryBtn, { backgroundColor: colors.primary, opacity: isLoading ? 0.6 : 1 }]}
                onPress={handleContinue}
                disabled={isLoading}
              >
                <Text style={styles.primaryBtnText}>{isLoading ? "Uploading..." : "Continue"} →</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <Modal visible={showKycCompleteModal} transparent animationType="fade" onRequestClose={() => setShowKycCompleteModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalBadge}>
                <Text style={styles.modalBadgeText}>✓</Text>
              </View>
              <Text style={styles.modalTitle}>KYC Complete</Text>
              <Text style={styles.modalSubtitle}>Your KYC documents have been submitted successfully.</Text>



              <Pressable style={[styles.modalSecondaryBtn, { borderColor: colors.primary }]} onPress={goToDashboard}>
                <Text style={[styles.modalSecondaryBtnText, { color: colors.primary }]}>Back to Dashboard</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

interface DocumentUploadBoxProps {
  title: string;
  subtitle: string;
  required: boolean;
  document: DocumentState;
  onPress: () => void;
  colors: any;
}

const DocumentUploadBox: React.FC<DocumentUploadBoxProps> = ({
  title,
  subtitle,
  required,
  document,
  onPress,
  colors,
}) => {
  return (
    <Pressable style={[styles.documentBox, document.uri && styles.documentBoxFilled]} onPress={onPress}>
      <View style={styles.documentContent}>
        <View style={styles.documentInfoBlock}>
          <View style={styles.documentTitleRow}>
            <Text style={[styles.documentTitle, { color: colors.text }]}>{title}</Text>
            {required && <Text style={styles.requiredBadge}>*</Text>}
          </View>
          <Text style={styles.documentSubtitle}>{subtitle}</Text>
          {document.name && <Text style={styles.documentName}>✓ {document.name}</Text>}
        </View>

        <Pressable style={styles.chooseFileBtn} onPress={onPress}>
          <Text style={styles.chooseFileBtnText}>Choose file ⤒</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FCFBFF",
  },
  scrollContainer: {
    paddingBottom: spacing.xxl,
  },
  heroSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    position: "relative",
  },
  backBtn: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  backIcon: {
    fontSize: 30,
    color: "#2B3768",
    marginTop: -2,
  },
  dotPattern: {
    position: "absolute",
    right: spacing.xl,
    top: spacing.lg,
    width: 88,
    height: 88,
    borderRadius: 16,
    backgroundColor: "#F5F2FF",
    opacity: 0.8,
  },
  logoWrap: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  logoImage: {
    width: 120,
    height: 80,
  },
  iconContainer: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  headerIcon: {
    fontSize: 48,
    color: "#6C63FF",
  },
  title: {
    ...typography.h1,
    marginTop: spacing.md,
    textAlign: "center",
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  subtitle: {
    ...typography.body,
    textAlign: "center",
    marginTop: spacing.sm,
    lineHeight: 24,
    fontSize: 16,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  contextInfoWrap: {
    marginTop: spacing.sm,
    alignSelf: "center",
    backgroundColor: "#F5F0FF",
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 2,
  },
  contextInfoText: {
    color: "#5C3DF5",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  formCard: {
    marginHorizontal: spacing.lg,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    padding: spacing.lg,
    shadowColor: "#4F45D4",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 4,
  },
  documentBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#7C63D8",
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: "#FAFBFF",
  },
  documentBoxFilled: {
    backgroundColor: "#F0ECFF",
    borderColor: "#6C63FF",
  },
  documentContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  documentInfoBlock: {
    flex: 1,
    minWidth: 180,
  },
  documentTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    flexShrink: 1,
  },
  requiredBadge: {
    color: "#E74C3C",
    fontSize: 16,
    fontWeight: "700",
  },
  documentSubtitle: {
    color: "#636A88",
    fontSize: 14,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  documentName: {
    color: "#27AE60",
    fontSize: 13,
    marginTop: spacing.xs,
    fontWeight: "600",
  },
  chooseFileBtn: {
    borderWidth: 1.5,
    borderColor: "#7C63D8",
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  chooseFileBtnText: {
    color: "#7C63D8",
    fontSize: 15,
    fontWeight: "600",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#F7F5FF",
  },
  secondaryBtnText: {
    fontWeight: "800",
    fontSize: 18,
  },
  primaryBtn: {
    flex: 1.2,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnText: {
    fontWeight: "800",
    fontSize: 18,
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.42)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  modalBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EAFBF0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  modalBadgeText: {
    color: "#1E9E52",
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 34,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  modalPrimaryBtn: {
    width: "100%",
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalPrimaryBtnText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  modalSecondaryBtn: {
    width: "100%",
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    marginTop: spacing.sm,
  },
  modalSecondaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
