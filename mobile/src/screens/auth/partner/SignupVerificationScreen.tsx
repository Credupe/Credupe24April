import React, { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, BadgeCheck, Mail, Smartphone, ShieldCheck, RotateCw } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../../../App";
import { useTheme } from "../../../theme/ThemeProvider";
import { requestPartnerOtp, verifyPartnerOtp, sendOtpDirect } from "../../../api/credupe";

const logoImage = require("../../../../assets/logo.png");

type Props = NativeStackScreenProps<RootStackParamList, "SignupVerification">;

export const SignupVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { mode } = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = mode === "dark";

  const { mobile, email, name, businessType, onboardingToken: initialOnboardingToken } = route.params || {};
  const [onboardingToken, setOnboardingToken] = useState(initialOnboardingToken || "");
  const [isLoading, setIsLoading] = useState(false);

  // Verifications states
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // OTP Array States (6 boxes)
  const [mobileOtp, setMobileOtp] = useState<string[]>(Array(6).fill(""));
  const [emailOtp, setEmailOtp] = useState<string[]>(Array(6).fill(""));

  const [focusedMobileIdx, setFocusedMobileIdx] = useState<number | null>(null);
  const [focusedEmailIdx, setFocusedEmailIdx] = useState<number | null>(null);

  // Timer states
  const [mobileResendTimer, setMobileResendTimer] = useState(21);
  const [emailResendTimer, setEmailResendTimer] = useState(60);

  // Dev OTPs
  const [mobileDevOtp, setMobileDevOtp] = useState<string | null>(null);
  const [emailDevOtp, setEmailDevOtp] = useState<string | null>(null);

  // Input refs
  const mobileRefs = useRef<Array<TextInput | null>>([]);
  const emailRefs = useRef<Array<TextInput | null>>([]);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mobileCardSlide = useRef(new Animated.Value(40)).current;
  const emailCardSlide = useRef(new Animated.Value(60)).current;

  const emailCardScale = useRef(new Animated.Value(0.98)).current;
  const emailCardOpacity = useRef(new Animated.Value(0.6)).current;

  const mobileCheckScale = useRef(new Animated.Value(0)).current;
  const emailCheckScale = useRef(new Animated.Value(0)).current;

  const mobileBtnScale = useRef(new Animated.Value(1)).current;
  const emailBtnScale = useRef(new Animated.Value(1)).current;

  // Mount animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(mobileCardSlide, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.timing(emailCardSlide, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  // Watch mobile verification to trigger email unlock animation & focus
  useEffect(() => {
    if (mobileVerified) {
      Animated.parallel([
        Animated.spring(emailCardScale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
        Animated.timing(emailCardOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.spring(mobileCheckScale, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]).start();

      // Focus first email input
      setTimeout(() => {
        emailRefs.current[0]?.focus();
      }, 600);
    }
  }, [mobileVerified]);

  useEffect(() => {
    if (emailVerified) {
      Animated.spring(emailCheckScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    }
  }, [emailVerified]);

  // Request Mobile OTP on mount
  useEffect(() => {
    if (mobile) {
      sendMobileOtp();
    }
  }, [mobile]);

  // Mobile Timer
  useEffect(() => {
    if (mobileResendTimer > 0 && !mobileVerified) {
      const timer = setTimeout(() => setMobileResendTimer(mobileResendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [mobileResendTimer, mobileVerified]);

  // Email Timer
  useEffect(() => {
    if (emailResendTimer > 0 && !emailVerified && mobileVerified) {
      const timer = setTimeout(() => setEmailResendTimer(emailResendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [emailResendTimer, emailVerified, mobileVerified]);

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

  const handleVerifyMobile = async () => {
    const otpStr = mobileOtp.join("");
    if (otpStr.length !== 6) {
      Toast.show({ type: "error", text1: "Please enter a valid 6-digit code" });
      return;
    }
    setIsLoading(true);
    const r = await verifyPartnerOtp(onboardingToken, "mobile", mobile, otpStr);
    setIsLoading(false);

    if (r.success && r.data) {
      setMobileVerified(true);
      const newToken = r.data.onboardingToken;
      setOnboardingToken(newToken);
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
    const otpStr = emailOtp.join("");
    if (otpStr.length !== 6) {
      Toast.show({ type: "error", text1: "Please enter a valid 6-digit code" });
      return;
    }
    setIsLoading(true);
    const r = await verifyPartnerOtp(onboardingToken, "email", email, otpStr);
    setIsLoading(false);

    if (r.success && r.data) {
      setEmailVerified(true);
      const finalToken = r.data.onboardingToken;
      setTimeout(() => {
        navigation.replace("SignupBusinessDetails" as any, { onboardingToken: finalToken });
      }, 1000);
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
    setMobileOtp(Array(6).fill(""));
    mobileRefs.current[0]?.focus();
  };

  const handleTestSmsEngine = async () => {
    setIsLoading(true);
    const r = await sendOtpDirect(mobile);
    setIsLoading(false);
    if (r.success) {
      Toast.show({
        type: "success",
        text1: "SMS Engine Triggered",
        text2: "SMS requested via global router. Check SMS logs!",
      });
      if (r.data?.devOtp) {
        setMobileDevOtp(r.data.devOtp);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "SMS Engine Failed",
        text2: r.error?.message?.join("\n") ?? "Failover triggered. All providers failed.",
      });
    }
  };

  const handleResendEmailOtp = () => {
    sendEmailOtp();
    setEmailOtp(Array(6).fill(""));
    emailRefs.current[0]?.focus();
  };

  // Masking helpers
  const maskPhone = (phoneStr: string) => {
    const digits = phoneStr.replace(/\D/g, "");
    const last4 = digits.slice(-4);
    return `+91 ••••••${last4}`;
  };

  const maskEmail = (emailStr: string) => {
    if (!emailStr) return "";
    const [name, domain] = emailStr.split("@");
    if (name.length <= 1) {
      return `${name}••••••@${domain}`;
    }
    return `${name[0]}••••••@${domain}`;
  };

  // OTP inputs handling
  const handleMobileOtpChange = (text: string, index: number) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 1) {
      // Handle paste
      const digits = cleaned.slice(0, 6).split("");
      const newOtp = [...mobileOtp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = digits[i] || "";
      }
      setMobileOtp(newOtp);
      const target = Math.min(digits.length - 1, 5);
      mobileRefs.current[target]?.focus();
      return;
    }

    const newOtp = [...mobileOtp];
    newOtp[index] = cleaned;
    setMobileOtp(newOtp);

    if (cleaned && index < 5) {
      mobileRefs.current[index + 1]?.focus();
    }
  };

  const handleMobileOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!mobileOtp[index] && index > 0) {
        const newOtp = [...mobileOtp];
        newOtp[index - 1] = "";
        setMobileOtp(newOtp);
        mobileRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleEmailOtpChange = (text: string, index: number) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, 6).split("");
      const newOtp = [...emailOtp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = digits[i] || "";
      }
      setEmailOtp(newOtp);
      const target = Math.min(digits.length - 1, 5);
      emailRefs.current[target]?.focus();
      return;
    }

    const newOtp = [...emailOtp];
    newOtp[index] = cleaned;
    setEmailOtp(newOtp);

    if (cleaned && index < 5) {
      emailRefs.current[index + 1]?.focus();
    }
  };

  const handleEmailOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!emailOtp[index] && index > 0) {
        const newOtp = [...emailOtp];
        newOtp[index - 1] = "";
        setEmailOtp(newOtp);
        emailRefs.current[index - 1]?.focus();
      }
    }
  };

  // Button spring triggers
  const playBtnSpring = (ref: Animated.Value, inOut: "in" | "out") => {
    Animated.spring(ref, {
      toValue: inOut === "in" ? 0.96 : 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const isMobileOtpComplete = mobileOtp.join("").length === 6;
  const isEmailOtpComplete = emailOtp.join("").length === 6;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0B0F14" : "#FFFFFF" }]}>
      {/* Background Shapes */}
      <View style={[styles.topRightShape, isDark && styles.topRightShapeDark]} pointerEvents="none" />
      <View style={[styles.bottomLeftShape, isDark && styles.bottomLeftShapeDark]} pointerEvents="none" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingTop: insets.top, paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <Pressable
              style={({ pressed }) => [
                styles.backBtn,
                pressed && styles.backBtnPressed,
                isDark && styles.backBtnDark,
              ]}
              onPress={navigation.goBack}
            >
              <ArrowLeft size={22} color={isDark ? "#FFFFFF" : "#111827"} />
            </Pressable>
          </View>

          {/* Logo & Headline */}
          <View style={styles.logoSection}>
            <View style={styles.logoWrap}>
              <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
            </View>
            <Text style={[styles.headingText, { color: isDark ? "#FFFFFF" : "#111827" }]}>
              Complete Your Verification
            </Text>
            <Text style={[styles.subtitleText, { color: isDark ? "#94A3B8" : "#6B7280" }]}>
              Verify your contact details to securely activate your account.
            </Text>
          </View>

          <View style={styles.cardsContainer}>
            {/* Step 1 Card: Mobile Verification */}
            <Animated.View
              style={[
                styles.stepCard,
                isDark && styles.stepCardDark,
                mobileVerified && styles.stepCardCompleted,
                mobileVerified && isDark && styles.stepCardCompletedDark,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: mobileCardSlide }],
                },
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <View style={styles.iconTitleRow}>
                  {mobileVerified ? (
                    <Animated.View style={{ transform: [{ scale: mobileCheckScale }] }}>
                      <BadgeCheck size={24} color="#10B981" />
                    </Animated.View>
                  ) : (
                    <Smartphone size={24} color="#7C3AED" />
                  )}
                  <Text style={[styles.cardTitle, { color: isDark ? "#FFFFFF" : "#111827" }]}>
                    Verify Mobile
                  </Text>
                </View>
                <View style={[styles.stepBadge, isDark && styles.stepBadgeDark]}>
                  <Text style={styles.stepBadgeText}>STEP 1</Text>
                </View>
              </View>

              <Text style={[styles.cardSubtitle, { color: isDark ? "#94A3B8" : "#6B7280" }]}>
                We've sent a verification code to{" "}
                <Text style={styles.maskedVal}>{maskPhone(mobile || "")}</Text>
              </Text>

              {!mobileVerified ? (
                <View style={styles.formContent}>
                  {/* OTP inputs */}
                  <View style={styles.otpWrapper}>
                    {Array(6)
                      .fill(0)
                      .map((_, index) => {
                        const isFocused = focusedMobileIdx === index;
                        const isFilled = !!mobileOtp[index];
                        return (
                          <TextInput
                            key={`mobile-otp-${index}`}
                            ref={(el) => { mobileRefs.current[index] = el; }}
                            style={[
                              styles.otpBox,
                              isDark && styles.otpBoxDark,
                              isFilled && styles.otpBoxFilled,
                              isFilled && isDark && styles.otpBoxFilledDark,
                              isFocused && styles.otpBoxFocused,
                            ]}
                            placeholder="-"
                            placeholderTextColor={isDark ? "#475569" : "#CBD5E1"}
                            keyboardType="number-pad"
                            maxLength={2} // allow 2 so paste triggers onChangeText
                            value={mobileOtp[index]}
                            onChangeText={(text) => handleMobileOtpChange(text, index)}
                            onKeyPress={(e) => handleMobileOtpKeyPress(e, index)}
                            onFocus={() => setFocusedMobileIdx(index)}
                            onBlur={() => setFocusedMobileIdx(null)}
                            selectTextOnFocus
                            editable={!isLoading}
                            autoFocus={index === 0}
                          />
                        );
                      })}
                  </View>





                  {/* Timer & Resend */}
                  <View style={styles.timerContainer}>
                    {mobileResendTimer > 0 ? (
                      <Text style={[styles.countdownText, { color: isDark ? "#94A3B8" : "#6B7280" }]}>
                        Didn't receive the code?{" "}
                        <Text style={styles.timerCount}>Resend in {mobileResendTimer}s</Text>
                      </Text>
                    ) : (
                      <Pressable onPress={handleResendMobileOtp} style={styles.resendBtn}>
                        <RotateCw size={14} color="#7C3AED" style={{ marginRight: 6 }} />
                        <Text style={styles.resendLink}>Resend Code</Text>
                      </Pressable>
                    )}
                  </View>

                  {/* Submit Button */}
                  <Animated.View style={[styles.btnContainer, { transform: [{ scale: mobileBtnScale }] }]}>
                    <Pressable
                      onPressIn={() => playBtnSpring(mobileBtnScale, "in")}
                      onPressOut={() => playBtnSpring(mobileBtnScale, "out")}
                      onPress={handleVerifyMobile}
                      disabled={!isMobileOtpComplete || isLoading}
                      android_ripple={{ color: "rgba(255, 255, 255, 0.2)" }}
                      style={styles.btnPressable}
                    >
                      <LinearGradient
                        colors={
                          isMobileOtpComplete
                            ? ["#7C3AED", "#9333EA"]
                            : isDark
                              ? ["#1E293B", "#1E293B"]
                              : ["#E2E8F0", "#E2E8F0"]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientBtnBg}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                          <Text
                            style={[
                              styles.btnText,
                              !isMobileOtpComplete && { color: isDark ? "#64748B" : "#94A3B8" },
                            ]}
                          >
                            Verify Mobile
                          </Text>
                        )}
                      </LinearGradient>
                    </Pressable>
                  </Animated.View>
                </View>
              ) : (
                <View style={styles.successStateRow}>
                  <BadgeCheck size={20} color="#10B981" style={{ marginRight: 6 }} />
                  <Text style={styles.successStateText}>Mobile Verified</Text>
                </View>
              )}
            </Animated.View>

            {/* Step 2 Card: Email Verification */}
            <Animated.View
              style={[
                styles.stepCard,
                isDark && styles.stepCardDark,
                emailVerified && styles.stepCardCompleted,
                emailVerified && isDark && styles.stepCardCompletedDark,
                {
                  opacity: mobileVerified ? emailCardOpacity : 0.6,
                  transform: [{ translateY: emailCardSlide }, { scale: emailCardScale }],
                },
              ]}
              pointerEvents={mobileVerified ? "auto" : "none"}
            >
              <View style={styles.cardHeaderRow}>
                <View style={styles.iconTitleRow}>
                  {emailVerified ? (
                    <Animated.View style={{ transform: [{ scale: emailCheckScale }] }}>
                      <BadgeCheck size={24} color="#10B981" />
                    </Animated.View>
                  ) : (
                    <Mail size={24} color={mobileVerified ? "#7C3AED" : isDark ? "#475569" : "#94A3B8"} />
                  )}
                  <Text
                    style={[
                      styles.cardTitle,
                      { color: mobileVerified ? (isDark ? "#FFFFFF" : "#111827") : isDark ? "#475569" : "#94A3B8" },
                    ]}
                  >
                    Verify Email
                  </Text>
                </View>
                <View
                  style={[
                    styles.stepBadge,
                    isDark && styles.stepBadgeDark,
                    !mobileVerified && { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" },
                  ]}
                >
                  <Text
                    style={[
                      styles.stepBadgeText,
                      !mobileVerified && { color: isDark ? "#64748B" : "#94A3B8" },
                    ]}
                  >
                    STEP 2
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.cardSubtitle,
                  { color: mobileVerified ? (isDark ? "#94A3B8" : "#6B7280") : isDark ? "#475569" : "#94A3B8" },
                ]}
              >
                We've also sent a verification code to{" "}
                <Text style={styles.maskedVal}>{maskEmail(email || "")}</Text>
              </Text>

              {mobileVerified && !emailVerified && (
                <View style={styles.formContent}>
                  {/* OTP inputs */}
                  <View style={styles.otpWrapper}>
                    {Array(6)
                      .fill(0)
                      .map((_, index) => {
                        const isFocused = focusedEmailIdx === index;
                        const isFilled = !!emailOtp[index];
                        return (
                          <TextInput
                            key={`email-otp-${index}`}
                            ref={(el) => { emailRefs.current[index] = el; }}
                            style={[
                              styles.otpBox,
                              isDark && styles.otpBoxDark,
                              isFilled && styles.otpBoxFilled,
                              isFilled && isDark && styles.otpBoxFilledDark,
                              isFocused && styles.otpBoxFocused,
                            ]}
                            placeholder="-"
                            placeholderTextColor={isDark ? "#475569" : "#CBD5E1"}
                            keyboardType="number-pad"
                            maxLength={2}
                            value={emailOtp[index]}
                            onChangeText={(text) => handleEmailOtpChange(text, index)}
                            onKeyPress={(e) => handleEmailOtpKeyPress(e, index)}
                            onFocus={() => setFocusedEmailIdx(index)}
                            onBlur={() => setFocusedEmailIdx(null)}
                            selectTextOnFocus
                            editable={!isLoading}
                          />
                        );
                      })}
                  </View>



                  {/* Timer & Resend */}
                  <View style={styles.timerContainer}>
                    {emailResendTimer > 0 ? (
                      <Text style={[styles.countdownText, { color: isDark ? "#94A3B8" : "#6B7280" }]}>
                        Didn't receive the code?{" "}
                        <Text style={styles.timerCount}>Resend in {emailResendTimer}s</Text>
                      </Text>
                    ) : (
                      <Pressable onPress={handleResendEmailOtp} style={styles.resendBtn}>
                        <RotateCw size={14} color="#7C3AED" style={{ marginRight: 6 }} />
                        <Text style={styles.resendLink}>Resend Code</Text>
                      </Pressable>
                    )}
                  </View>

                  {/* Submit Button */}
                  <Animated.View style={[styles.btnContainer, { transform: [{ scale: emailBtnScale }] }]}>
                    <Pressable
                      onPressIn={() => playBtnSpring(emailBtnScale, "in")}
                      onPressOut={() => playBtnSpring(emailBtnScale, "out")}
                      onPress={handleVerifyEmail}
                      disabled={!isEmailOtpComplete || isLoading}
                      android_ripple={{ color: "rgba(255, 255, 255, 0.2)" }}
                      style={styles.btnPressable}
                    >
                      <LinearGradient
                        colors={
                          isEmailOtpComplete
                            ? ["#7C3AED", "#9333EA"]
                            : isDark
                              ? ["#1E293B", "#1E293B"]
                              : ["#E2E8F0", "#E2E8F0"]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientBtnBg}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                          <Text
                            style={[
                              styles.btnText,
                              !isEmailOtpComplete && { color: isDark ? "#64748B" : "#94A3B8" },
                            ]}
                          >
                            Verify Email & Complete
                          </Text>
                        )}
                      </LinearGradient>
                    </Pressable>
                  </Animated.View>
                </View>
              )}

              {emailVerified && (
                <View style={styles.successStateRow}>
                  <BadgeCheck size={20} color="#10B981" style={{ marginRight: 6 }} />
                  <Text style={styles.successStateText}>Email Verified</Text>
                </View>
              )}

              {!mobileVerified && (
                <View style={[styles.lockedContainer, isDark && { borderColor: "#232A33", backgroundColor: "#1C2430" }]}>
                  <ShieldCheck size={20} color={isDark ? "#475569" : "#94A3B8"} style={{ marginRight: 8 }} />
                  <Text style={[styles.lockedText, { color: isDark ? "#475569" : "#94A3B8" }]}>
                    Complete mobile verification first
                  </Text>
                </View>
              )}
            </Animated.View>
          </View>

          {/* Footer */}
          <View style={styles.footerWrap}>
            <Text style={[styles.footerText, { color: isDark ? "#94A3B8" : "#6B7280" }]}>
              🔒 Your information is protected with bank-grade encryption.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  topRightShape: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#7C3AED",
    opacity: 0.08,
  },
  topRightShapeDark: {
    backgroundColor: "#A855F7",
    opacity: 0.12,
  },
  bottomLeftShape: {
    position: "absolute",
    bottom: -80,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#C084FC",
    opacity: 0.08,
  },
  bottomLeftShapeDark: {
    backgroundColor: "#C084FC",
    opacity: 0.12,
  },
  headerSection: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 20,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  backBtnDark: {
    backgroundColor: "#161C24",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
  },
  backBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  logoSection: {
    marginBottom: 24,
  },
  logoWrap: {
    width: 70,
    height: 70,
    marginLeft: 24,
    marginBottom: 16,
    justifyContent: "center",
  },
  logoImage: {
    width: 70,
    height: 70,
  },
  headingText: {
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 36,
    fontFamily: "Plus Jakarta Sans",
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  subtitleText: {
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 22,
    fontFamily: "Plus Jakarta Sans",
    paddingHorizontal: 24,
  },
  cardsContainer: {
    paddingHorizontal: 24,
    gap: 20,
    marginBottom: 20,
  },
  stepCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 4,
    borderWidth: 1,
    borderColor: "transparent",
  },
  stepCardDark: {
    backgroundColor: "#161C24",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
  },
  stepCardCompleted: {
    backgroundColor: "#F8FAFC",
  },
  stepCardCompletedDark: {
    backgroundColor: "#1C2430",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  iconTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Plus Jakarta Sans",
  },
  stepBadge: {
    backgroundColor: "#F3F0FF",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepBadgeDark: {
    backgroundColor: "#3B0764",
  },
  stepBadgeText: {
    color: "#6D28D9",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Plus Jakarta Sans",
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Plus Jakarta Sans",
    marginBottom: 20,
  },
  maskedVal: {
    fontWeight: "600",
  },
  formContent: {
    marginTop: 4,
  },
  otpWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 16,
  },
  otpBox: {
    flex: 1,
    height: 60,
    maxWidth: 52,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "Plus Jakarta Sans",
    padding: 0,
    ...Platform.select({
      web: {
        outlineStyle: "none" as any,
      },
    }),
  },
  otpBoxDark: {
    backgroundColor: "#1C2430",
    borderColor: "#232A33",
    color: "#FFFFFF",
  },
  otpBoxFilled: {
    backgroundColor: "#F5F3FF",
    borderColor: "#7C3AED",
  },
  otpBoxFilledDark: {
    backgroundColor: "#1E1B4B",
    borderColor: "#A855F7",
  },
  otpBoxFocused: {
    borderColor: "#7C3AED",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  devOtpContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  devOtpText: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "Plus Jakarta Sans",
  },
  devOtpHighlight: {
    color: "#7C3AED",
    fontWeight: "700",
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Plus Jakarta Sans",
  },
  timerCount: {
    color: "#7C3AED",
    fontWeight: "600",
  },
  resendBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  resendLink: {
    color: "#7C3AED",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Plus Jakarta Sans",
  },
  btnContainer: {
    height: 56,
    borderRadius: 18,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 6,
    marginBottom: 8,
  },
  btnPressable: {
    flex: 1,
    borderRadius: 18,
    overflow: "hidden",
  },
  gradientBtnBg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Plus Jakarta Sans",
  },
  successStateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(16, 185, 129, 0.08)",
  },
  successStateText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#10B981",
    fontFamily: "Plus Jakarta Sans",
  },
  lockedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#E5E7EB",
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
  },
  lockedText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Plus Jakarta Sans",
  },
  footerWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    fontFamily: "Plus Jakarta Sans",
    lineHeight: 18,
  },
});
