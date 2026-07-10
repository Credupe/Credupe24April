import React, { useEffect, useState } from "react";
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
import { requestPartnerOtp, verifyPartnerOtp } from "../../../api/credupe";

const logoImage = require("../../../../assets/logo.png");

type Props = NativeStackScreenProps<RootStackParamList, "SignupVerification">;

export const SignupVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const [mobileOtp, setMobileOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileResendTimer, setMobileResendTimer] = useState(21);
  const [emailResendTimer, setEmailResendTimer] = useState(60);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mobile, email, name, businessType, onboardingToken: initialOnboardingToken } = route.params || {};
  const [onboardingToken, setOnboardingToken] = useState(initialOnboardingToken || "");
  const [mobileDevOtp, setMobileDevOtp] = useState<string | null>(null);
  const [emailDevOtp, setEmailDevOtp] = useState<string | null>(null);

  const sendMobileOtp = async () => {
    setIsLoading(true);
    const r = await requestPartnerOtp(onboardingToken, "mobile", mobile);
    setIsLoading(false);
    if (r.success && r.data) {
      setMobileResendTimer(21);
      if (r.data.devOtp) {
        setMobileDevOtp(r.data.devOtp);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Error requesting OTP",
        text2: r.error?.message?.join("\n") ?? "Failed to request mobile OTP",
      });
    }
  };

  const sendEmailOtp = async (token = onboardingToken) => {
    setIsLoading(true);
    const r = await requestPartnerOtp(token, "email", email);
    setIsLoading(false);
    if (r.success && r.data) {
      setEmailResendTimer(60);
      if (r.data.devOtp) {
        setEmailDevOtp(r.data.devOtp);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Error requesting OTP",
        text2: r.error?.message?.join("\n") ?? "Failed to request email OTP",
      });
    }
  };

  // Initial OTP Request on Mount
  useEffect(() => {
    if (mobile) {
      sendMobileOtp();
    }
  }, [mobile]);

  // Mobile OTP Timer
  useEffect(() => {
    if (mobileResendTimer > 0 && !mobileVerified) {
      const timer = setTimeout(() => setMobileResendTimer(mobileResendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [mobileResendTimer, mobileVerified]);

  // Email OTP Timer
  useEffect(() => {
    if (emailResendTimer > 0 && !emailVerified) {
      const timer = setTimeout(() => setEmailResendTimer(emailResendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [emailResendTimer, emailVerified]);

  const handleVerifyMobile = async () => {
    if (mobileOtp.length !== 6) {
      Toast.show({ type: "error", text1: "Please enter a valid 6-digit code" });
      return;
    }
    setIsLoading(true);
    const r = await verifyPartnerOtp(onboardingToken, "mobile", mobile, mobileOtp);
    setIsLoading(false);

    if (r.success && r.data) {
      setMobileVerified(true);
      const newToken = r.data.onboardingToken;
      setOnboardingToken(newToken);
      // Request Email OTP with updated token
      await sendEmailOtp(newToken);
    } else {
      Toast.show({
        type: "error",
        text1: "Verification failed",
        text2: r.error?.message?.join("\n") ?? "Invalid code. Please try again.",
      });
    }
  };

  const handleVerifyEmail = async () => {
    if (emailOtp.length !== 6) {
      Toast.show({ type: "error", text1: "Please enter a valid 6-digit code" });
      return;
    }
    setIsLoading(true);
    const r = await verifyPartnerOtp(onboardingToken, "email", email, emailOtp);
    setIsLoading(false);

    if (r.success && r.data) {
      setEmailVerified(true);
      const finalToken = r.data.onboardingToken;
      setTimeout(() => {
        navigation.replace("SignupBusinessDetails" as any, { onboardingToken: finalToken });
      }, 500);
    } else {
      Toast.show({
        type: "error",
        text1: "Verification failed",
        text2: r.error?.message?.join("\n") ?? "Invalid code. Please try again.",
      });
    }
  };

  const handleResendMobileOtp = () => {
    sendMobileOtp();
    setMobileOtp("");
  };

  const handleResendEmailOtp = () => {
    sendEmailOtp();
    setEmailOtp("");
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    return `${name.slice(0, 3)}...@${domain}`;
  };

  const maskPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return `${digits.slice(0, 2)}${digits.slice(2, 4)}${digits.slice(4)}`.replace(
      /(\d{2})(\d{2})(\d+)/,
      "$1****$3"
    );
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

            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
              Complete Your Verification
            </Text>
          </View>

          <View style={styles.verificationContainer}>
            {/* Step 1: Mobile Verification */}
            <View style={[styles.stepCard, mobileVerified && styles.stepCardCompleted]}>
              <View style={styles.stepHeader}>
                <View style={styles.stepIconContainer}>
                  {mobileVerified ? (
                    <Text style={styles.checkmark}>✓</Text>
                  ) : (
                    <Text style={styles.stepIcon}>📱</Text>
                  )}
                </View>
                <View style={styles.stepHeaderText}>
                  <Text style={[styles.stepTitle, { color: colors.text }]}>Verify your mobile</Text>
                  <Text style={styles.stepSubtitle}>
                    We&apos;ve sent a 6-digit code to {maskPhone(mobile || "")}
                  </Text>
                </View>
                <Text style={styles.stepNumber}>Step 1</Text>
              </View>

              {!mobileVerified && (
                <>
                  <TextInput
                    style={[styles.otpInput, { borderColor: "#E5E7FF", color: colors.text }]}
                    placeholder="000000"
                    placeholderTextColor="#98A1C0"
                    value={mobileOtp}
                    onChangeText={setMobileOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                  />

                  {mobileDevOtp ? (
                    <Pressable onPress={() => setMobileOtp(mobileDevOtp)}>
                      <Text style={{ color: colors.textMuted, textAlign: "center", marginBottom: spacing.md, fontSize: 14 }}>
                        DEV OTP: <Text style={{ color: colors.primary, fontWeight: "800" }}>{mobileDevOtp}</Text> (tap to fill)
                      </Text>
                    </Pressable>
                  ) : null}

                  <Text style={styles.resendText}>
                    Resend in <Text style={styles.timer}>{mobileResendTimer}s</Text>
                  </Text>

                  {mobileResendTimer === 0 && (
                    <Pressable onPress={handleResendMobileOtp}>
                      <Text style={styles.resendLink}>Resend Code</Text>
                    </Pressable>
                  )}

                  <Pressable
                    style={[
                      styles.verifyBtn,
                      { backgroundColor: colors.primary, opacity: mobileOtp.length === 6 ? 1 : 0.5 },
                    ]}
                    onPress={handleVerifyMobile}
                    disabled={mobileOtp.length !== 6 || isLoading}
                  >
                    <Text style={styles.verifyBtnText}>
                      {isLoading ? "Verifying..." : "Verify Mobile"}
                    </Text>
                  </Pressable>
                </>
              )}

              {mobileVerified && (
                <Text style={styles.verifiedText}>Mobile verified successfully</Text>
              )}
            </View>

            {/* Step 2: Email Verification */}
            <View style={[styles.stepCard, emailVerified && styles.stepCardCompleted]}>
              <View style={styles.stepHeader}>
                <View style={styles.stepIconContainer}>
                  {emailVerified ? (
                    <Text style={styles.checkmark}>✓</Text>
                  ) : (
                    <Text style={styles.stepIcon}>📧</Text>
                  )}
                </View>
                <View style={styles.stepHeaderText}>
                  <Text style={[styles.stepTitle, { color: colors.text }]}>Verify your email</Text>
                  <Text style={styles.stepSubtitle}>
                    We&apos;ve also sent a 6-digit code to {maskEmail(email || "")}
                  </Text>
                </View>
                <Text style={styles.stepNumber}>Step 2</Text>
              </View>

              {!emailVerified && (
                <>
                  <TextInput
                    style={[styles.otpInput, { borderColor: "#E5E7FF", color: colors.text }]}
                    placeholder="000000"
                    placeholderTextColor="#98A1C0"
                    value={emailOtp}
                    onChangeText={setEmailOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={mobileVerified}
                  />

                  {emailDevOtp ? (
                    <Pressable onPress={() => setEmailOtp(emailDevOtp)}>
                      <Text style={{ color: colors.textMuted, textAlign: "center", marginBottom: spacing.md, fontSize: 14 }}>
                        DEV OTP: <Text style={{ color: colors.primary, fontWeight: "800" }}>{emailDevOtp}</Text> (tap to fill)
                      </Text>
                    </Pressable>
                  ) : null}

                  {mobileVerified && (
                    <>
                      <Text style={styles.resendText}>
                        Resend in <Text style={styles.timer}>{emailResendTimer}s</Text>
                      </Text>

                      {emailResendTimer === 0 && (
                        <Pressable onPress={handleResendEmailOtp}>
                          <Text style={styles.resendLink}>Resend Code</Text>
                        </Pressable>
                      )}

                      <Pressable
                        style={[
                          styles.verifyBtn,
                          {
                            backgroundColor: emailOtp.length === 6 ? colors.primary : "#D5D5D5",
                            opacity: emailOtp.length === 6 ? 1 : 0.5,
                          },
                        ]}
                        onPress={handleVerifyEmail}
                        disabled={emailOtp.length !== 6 || isLoading}
                      >
                        <Text style={styles.verifyBtnText}>
                          {isLoading ? "Verifying..." : "Verify Email & Complete"}
                        </Text>
                      </Pressable>
                    </>
                  )}

                  {!mobileVerified && (
                    <Text style={styles.disabledText}>
                      Complete mobile verification first
                    </Text>
                  )}
                </>
              )}

              {emailVerified && (
                <Text style={styles.verifiedText}>Email verified successfully</Text>
              )}
            </View>
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
  verificationContainer: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    gap: spacing.md,
  },
  stepCard: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    padding: spacing.lg,
    shadowColor: "#4F45D4",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  stepCardCompleted: {
    backgroundColor: "#F7F5FF",
    opacity: 0.7,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F5F2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  stepIcon: {
    fontSize: 24,
  },
  checkmark: {
    fontSize: 24,
    color: "#10B981",
    fontWeight: "bold",
  },
  stepHeaderText: {
    flex: 1,
    gap: spacing.xs,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
  },
  stepSubtitle: {
    fontSize: 14,
    color: "#636A88",
    lineHeight: 20,
    fontWeight: "500",
  },
  stepNumber: {
    fontSize: 12,
    color: "#98A1C0",
    fontWeight: "600",
  },
  otpInput: {
    borderWidth: 2,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: "600",
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 8,
    marginBottom: spacing.md,
  },
  resendText: {
    textAlign: "center",
    fontSize: 14,
    color: "#636A88",
    fontWeight: "500",
    marginBottom: spacing.md,
  },
  timer: {
    color: "#5C3DF5",
    fontWeight: "700",
  },
  resendLink: {
    textAlign: "center",
    fontSize: 14,
    color: "#5C3DF5",
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  verifyBtn: {
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  verifyBtnText: {
    fontWeight: "800",
    fontSize: 16,
    color: "#FFFFFF",
  },
  disabledText: {
    textAlign: "center",
    fontSize: 14,
    color: "#98A1C0",
    fontWeight: "500",
  },
  verifiedText: {
    textAlign: "center",
    fontSize: 14,
    color: "#10B981",
    fontWeight: "600",
  },
  footerText: {
    textAlign: "center",
    marginTop: spacing.xl,
    color: "#70789B",
    fontSize: 18,
    fontWeight: "500",
  },
});
