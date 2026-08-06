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
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../../../App";
import { useTheme } from "../../../theme/ThemeProvider";
import { radii, spacing, typography } from "../../../theme/colors";
import { finalizePartnerOnboarding } from "../../../api/credupe";

const logoImage = require("../../../../assets/logo.png");

type Props = NativeStackScreenProps<RootStackParamList, "SignupPayoutAccount">;

export const SignupPayoutAccountScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    onboardingToken,
    businessName,
    gstNumber,
    panNumber,
    city,
    state,
    pincode,
    address,
  } = route.params || {};

  const handleFinishOnboarding = async () => {
    if (!bankName.trim()) {
      Toast.show({ type: "error", text1: "Please enter bank name" });
      return;
    }
    if (!accountNumber.trim()) {
      Toast.show({ type: "error", text1: "Please enter account number" });
      return;
    }
    if (!ifscCode.trim()) {
      Toast.show({ type: "error", text1: "Please enter IFSC code" });
      return;
    }

    setIsLoading(true);
    const r = await finalizePartnerOnboarding({
      onboardingToken,
      businessName,
      gstNumber,
      panNumber,
      city,
      state,
      pincode,
      address,
      bankName: bankName.trim(),
      accountHolder: accountHolder.trim() || undefined,
      accountNumber: accountNumber.trim(),
      ifsc: ifscCode.trim().toUpperCase(),
    });
    setIsLoading(false);

    if (r.success && r.data) {
      navigation.replace("PartnerOnboardingSuccess", {
        partnerCode: r.data.partner.partnerCode,
        tempPassword: r.data.generatedPassword,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Onboarding failed",
        text2: r.error?.message?.join("\n") ?? "Unable to finalize partner profile. Try again.",
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.safeArea} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="always">
          <View style={styles.heroSection}>


            <View style={styles.dotPattern} />

            <View style={styles.logoWrap}>
              <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
            </View>



            <Text style={[styles.title, { color: colors.text }]}>Payout account</Text>

            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Account information will be transferred here weekly.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.fullRow}>
              <Text style={[styles.label, { color: colors.text }]}>
                Bank Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, { borderColor: "#E5E7FF", color: colors.text }]}
                placeholder="HDFC Bank"
                placeholderTextColor="#98A1C0"
                value={bankName}
                onChangeText={setBankName}
              />
            </View>

            <View style={styles.fullRow}>
              <Text style={[styles.label, { color: colors.text }]}>Account Holder</Text>
              <TextInput
                style={[styles.input, { borderColor: "#E5E7FF", color: colors.text }]}
                placeholder="Rajat"
                placeholderTextColor="#98A1C0"
                value={accountHolder}
                onChangeText={setAccountHolder}
              />
            </View>

            <View style={styles.fullRow}>
              <Text style={[styles.label, { color: colors.text }]}>
                Account Number <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, { borderColor: "#E5E7FF", color: colors.text }]}
                placeholder="00012345678"
                placeholderTextColor="#98A1C0"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.fullRow}>
              <Text style={[styles.label, { color: colors.text }]}>
                IFSC Code <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, { borderColor: "#E5E7FF", color: colors.text }]}
                placeholder="HDFC0C00234"
                placeholderTextColor="#98A1C0"
                value={ifscCode}
                onChangeText={setIfscCode}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.infoStrip}>
              <Text style={styles.infoIcon}>🔒</Text>
              <Text style={styles.infoText}>Your bank details are encrypted and secure.</Text>
            </View>

          </View>

          <Text style={styles.footerText}>Your details are secure with us.</Text>
        </ScrollView>

        <View style={styles.stickyActionBar}>
          <View style={styles.buttonGroup}>
            <Pressable
              style={[styles.secondaryBtn, { borderColor: colors.border }]}
              onPress={navigation.goBack}
              hitSlop={8}
            >
              <Text style={[styles.secondaryBtnText, { color: colors.text }]}>‹ Back</Text>
            </Pressable>

            <Pressable
              style={[styles.primaryBtn, { backgroundColor: colors.primary, opacity: isLoading ? 0.6 : 1 }]}
              onPress={handleFinishOnboarding}
              disabled={isLoading}
              hitSlop={8}
            >
              <Text style={styles.primaryBtnText}>{isLoading ? "Processing..." : "Finish onboarding"}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FCFBFF",
  },
  scrollContainer: {
    paddingBottom: spacing.xxl + 110,
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
  fullRow: {
    marginTop: spacing.md,
  },
  label: {
    ...typography.caption,
    marginBottom: spacing.xs,
    fontSize: 16,
    fontWeight: "700",
  },
  required: {
    color: "#E74C3C",
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "#FFFFFF",
  },
  infoStrip: {
    marginTop: spacing.lg,
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: "#F7F5FF",
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 18,
    color: "#6C63FF",
    lineHeight: 20,
  },
  infoText: {
    flex: 1,
    color: "#636A88",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: spacing.lg,
    marginTop: spacing.sm,
    position: "relative",
    zIndex: 10,
  },
  stickyActionBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    backgroundColor: "#FCFBFF",
    borderTopWidth: 1,
    borderTopColor: "#EEEAFB",
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
  footerText: {
    textAlign: "center",
    marginTop: spacing.xl,
    color: "#70789B",
    fontSize: 18,
    fontWeight: "500",
  },
});
