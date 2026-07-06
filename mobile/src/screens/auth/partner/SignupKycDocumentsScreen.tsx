import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as DocumentPicker from "expo-document-picker";

import { RootStackParamList } from "../../../../App";
import { useTheme } from "../../../theme/ThemeProvider";
import { radii, spacing, typography } from "../../../theme/colors";

const logoImage = require("../../../../assets/logo.png");

type Props = NativeStackScreenProps<RootStackParamList, "SignupKycDocuments">;

interface DocumentState {
  uri?: string;
  name?: string;
  size?: number;
  mimeType?: string;
}

export const SignupKycDocumentsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [panCard, setPanCard] = useState<DocumentState>({});
  const [aadhaarCard, setAadhaarCard] = useState<DocumentState>({});
  const [gstCertificate, setGstCertificate] = useState<DocumentState>({});
  const [photograph, setPhotograph] = useState<DocumentState>({});
  const [cancelledCheque, setCancelledCheque] = useState<DocumentState>({});
  const [isLoading, setIsLoading] = useState(false);

  const pickDocument = async (
    setter: React.Dispatch<React.SetStateAction<DocumentState>>,
    fileType: string,
    maxSize: number,
  ) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: fileType,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        if (asset.size && asset.size > maxSize) {
          Alert.alert("File too large", `Please select a file smaller than ${maxSize / (1024 * 1024)} MB`);
          return;
        }

        setter({
          uri: asset.uri,
          name: asset.name,
          size: asset.size,
          mimeType: asset.mimeType,
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document. Please try again.");
    }
  };

  const handleContinue = async () => {
    // Validate required documents
    if (!panCard.uri) {
      Alert.alert("Missing Document", "Please upload your PAN Card");
      return;
    }
    if (!aadhaarCard.uri) {
      Alert.alert("Missing Document", "Please upload your Aadhaar Card");
      return;
    }
    if (!photograph.uri) {
      Alert.alert("Missing Document", "Please upload your Recent Photograph");
      return;
    }
    if (!cancelledCheque.uri) {
      Alert.alert("Missing Document", "Please upload a Cancelled Cheque");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call API to upload KYC documents
      // const formData = new FormData();
      // formData.append("panCard", { uri: panCard.uri, name: panCard.name, type: panCard.mimeType });
      // formData.append("aadhaarCard", { uri: aadhaarCard.uri, name: aadhaarCard.name, type: aadhaarCard.mimeType });
      // if (gstCertificate.uri) {
      //   formData.append("gstCertificate", { uri: gstCertificate.uri, name: gstCertificate.name, type: gstCertificate.mimeType });
      // }
      // formData.append("photograph", { uri: photograph.uri, name: photograph.name, type: photograph.mimeType });
      // formData.append("cancelledCheque", { uri: cancelledCheque.uri, name: cancelledCheque.name, type: cancelledCheque.mimeType });
      // await uploadKycDocuments(formData);

      // Navigate to payout account screen
      setTimeout(() => {
        navigation.replace("SignupPayoutAccount" as any);
      }, 500);
    } catch (error) {
      Alert.alert("Error", "Failed to upload documents. Please try again.");
      setIsLoading(false);
    }
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
          </View>

          <View style={styles.formCard}>
            {/* PAN Card */}
            <DocumentUploadBox
              title="PAN Card"
              subtitle="JPG/PDF • ≤ 5 MB"
              required
              document={panCard}
              onPress={() => pickDocument(setPanCard, "image/jpeg,application/pdf", 5 * 1024 * 1024)}
              colors={colors}
            />

            {/* Aadhaar Card */}
            <DocumentUploadBox
              title="Aadhaar Card"
              subtitle="Front + back single PDF"
              required
              document={aadhaarCard}
              onPress={() => pickDocument(setAadhaarCard, "application/pdf", 10 * 1024 * 1024)}
              colors={colors}
            />

            {/* GST Certificate */}
            <DocumentUploadBox
              title="GST Certificate"
              subtitle="Optional, for registered businesses"
              required={false}
              document={gstCertificate}
              onPress={() => pickDocument(setGstCertificate, "application/pdf,image/jpeg", 5 * 1024 * 1024)}
              colors={colors}
            />

            {/* Recent Photograph */}
            <DocumentUploadBox
              title="Recent Photograph"
              subtitle="Passport-sized • JPG"
              required
              document={photograph}
              onPress={() => pickDocument(setPhotograph, "image/jpeg", 5 * 1024 * 1024)}
              colors={colors}
            />

            {/* Cancelled Cheque */}
            <DocumentUploadBox
              title="Cancelled Cheque"
              subtitle="Bank account proof"
              required
              document={cancelledCheque}
              onPress={() => pickDocument(setCancelledCheque, "image/jpeg,application/pdf", 5 * 1024 * 1024)}
              colors={colors}
            />

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
        <View>
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
    alignItems: "center",
  },
  documentTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
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
});
