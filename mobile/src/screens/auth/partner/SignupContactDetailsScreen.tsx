import React, { useMemo, useState } from "react";
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
import { startPartnerOnboarding } from "../../../api/credupe";

const logoImage = require("../../../../assets/logo.png");

type Props = NativeStackScreenProps<RootStackParamList, "SignupContactDetails">;

export const SignupContactDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("+91 ");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedBusinessType = route.params?.businessType;

  const handleSendOTPs = async () => {
    if (!name.trim()) {
      Toast.show({ type: "error", text1: "Please enter your full name" });
      return;
    }
    const cleanMobile = mobile.replace(/\D/g, "");
    if (!cleanMobile.match(/\d{10}/)) {
      Toast.show({ type: "error", text1: "Please enter a valid 10-digit mobile number" });
      return;
    }
    if (!email.includes("@")) {
      Toast.show({ type: "error", text1: "Please enter a valid email address" });
      return;
    }

    setIsLoading(true);
    const r = await startPartnerOnboarding(email.trim().toLowerCase(), cleanMobile.slice(-10), name.trim());
    setIsLoading(false);

    if (!r.success || !r.data) {
      Toast.show({
        type: "error",
        text1: "Signup failed",
        text2: r.error?.message?.join("\n") ?? "Unable to initiate signup. Try again.",
      });
      return;
    }

    navigation.navigate("SignupVerification" as any, {
      name,
      mobile: cleanMobile.slice(-10),
      email: email.trim(),
      businessType: selectedBusinessType,
      onboardingToken: r.data.onboardingToken,
    });
  };


  const selectedLine = useMemo(() => {
    if (!selectedBusinessType) {
      return { label: "Selected", value: "Partnership" };
    }
    return { label: "Selected", value: selectedBusinessType };
  }, [selectedBusinessType]);

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

            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
              Tell us about you
            </Text>

            {/* <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              <Text style={[styles.subtitleStrong, { color: colors.text }]}>{selectedLine.label}: </Text>
              <Text style={styles.subtitleHighlight}>{selectedLine.value}. </Text>
              We&apos;ll send OTPs to verify both contacts.
            </Text> */}
          </View>

          <View style={styles.formCard}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={[styles.label, { color: colors.text }]}>Contact Person</Text>
                <TextInput
                  style={[styles.input, { borderColor: "#E5E7FF", color: colors.text }]}
                  placeholder="Your full name"
                  placeholderTextColor="#98A1C0"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.col}>
                <Text style={[styles.label, { color: colors.text }]}>Mobile</Text>
                <TextInput
                  style={[styles.input, { borderColor: "#E5E7FF", color: colors.text }]}
                  placeholder="+91"
                  placeholderTextColor="#98A1C0"
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.fullRow}>
              <Text style={[styles.label, { color: colors.text }]}>Work Email</Text>
              <TextInput
                style={[styles.input, { borderColor: "#E5E7FF", color: colors.text }]}
                placeholder="you@yourfirm.com"
                placeholderTextColor="#98A1C0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.infoStrip}>
              <Text style={styles.infoIcon}>🛡</Text>
              <Text style={styles.infoText}>We&apos;ll send OTPs to verify both the mobile number and email address.</Text>
            </View>

            <Pressable
              style={[styles.primaryBtn, { backgroundColor: colors.primary, opacity: isLoading ? 0.6 : 1 }]}
              onPress={handleSendOTPs}
              disabled={isLoading}
            >
              <Text style={styles.primaryBtnText}>{isLoading ? "Sending..." : "Send OTPs"}</Text>
            </Pressable>
          </View>

          <Text style={styles.footerText}>Your details are secure with us.</Text>
        </ScrollView>
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
  title: {
    ...typography.h1,
    marginTop: spacing.lg,
    textAlign: "center",
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700",
    letterSpacing: 0.2,
    paddingHorizontal: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    textAlign: "center",
    marginTop: spacing.sm,
    lineHeight: 30,
    fontSize: 20,
    paddingHorizontal: spacing.md,
  },
  subtitleStrong: {
    fontWeight: "700",
  },
  subtitleHighlight: {
    color: "#5C3DF5",
    fontWeight: "800",
  },
  formCard: {
    marginTop: spacing.xl,
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
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  col: {
    flex: 1,
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
  primaryBtn: {
    marginTop: spacing.lg,
    borderRadius: radii.pill,
    paddingVertical: 18,
    alignItems: "center",
  },
  primaryBtnText: {
    fontWeight: "800",
    fontSize: 24,
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
