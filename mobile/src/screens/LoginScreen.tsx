import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
  Image,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  User,
  Sun,
  Moon,
  ArrowRight,
  ChevronRight,
} from "lucide-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const logoImage = require("../../assets/logo.png");
const bgImage = require("../../assets/register-bg.png");
import { getApiConfig, loginEmail, requestOtp, verifyOtp, forgotPassword, resetPassword, apiFetch } from "../api/credupe";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing } from "../theme/colors";
import Toast from "react-native-toast-message";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

type Mode = "otp" | "email" | "forgot";

const FONT_FAMILY = Platform.select({
  ios: "SF Pro Display",
  android: "sans-serif-medium",
  default: "System",
});

export const LoginScreen: React.FC<{ onAuthed: () => void; onSignup?: () => void }> = ({ onAuthed, onSignup }) => {
  const { colors } = useTheme();
  const [tab, setTab] = useState<Mode>("otp");

  // Entrance animations for the login card
  const cardScale = useRef(new Animated.Value(0.95)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.safeArea}>
      <ImageBackground source={bgImage} style={{ flex: 1, width: "100%", height: "100%" }}>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View style={styles.topBar}>
              <ThemeToggle />
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={{ flex: 1, minHeight: 60 }} />

              {/* Logo floating above the sheet */}
              <View style={styles.floatingLogoContainer}>
                <Image source={logoImage} style={[styles.floatingLogo, { tintColor: "#FFFFFF" }]} resizeMode="contain" />
                <Text style={styles.floatingTagline}>
                  One marketplace. Every loan.{"\n"}Designed for partners and customers.
                </Text>
              </View>

              <Animated.View
                style={[
                  styles.bottomSheet,
                  {
                    transform: [{ scale: cardScale }],
                    opacity: cardOpacity,
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >

                {/* Sliding Pill Tab Selector */}
                {tab !== "forgot" ? (
                  <SlidingTabSelector tab={tab} setTab={setTab} />
                ) : (
                  <View style={styles.resetHeaderContainer}>
                    <Text style={styles.resetTitle}>Reset Password</Text>
                  </View>
                )}

                {/* Panels Wrapper to prevent layout shift */}
                <View style={{ minHeight: 310 }}>
                  {tab === "otp" ? (
                    <OtpPanel onAuthed={onAuthed} />
                  ) : tab === "email" ? (
                    <EmailPanel onAuthed={onAuthed} onForgotPassword={() => setTab("forgot")} />
                  ) : (
                    <ForgotPasswordPanel onCancel={() => setTab("email")} />
                  )}
                </View>

                {/* Sign Up Action */}
                {onSignup && tab !== "forgot" ? (
                  <Pressable
                    onPress={onSignup}
                    style={styles.signupRedirectWrap}
                    accessibilityLabel="open-signup"
                  >
                    <Text style={[styles.signupLabel, { color: colors.textMuted }]}>Don't have an account? </Text>
                    <View style={styles.signupButtonWrap}>
                      <Text style={[styles.signupText, { color: colors.primary }]}>Create Account</Text>
                      <ChevronRight size={14} color={colors.primary} />
                    </View>
                  </Pressable>
                ) : null}

                {/* Footer Disclaimer */}
                <View style={styles.footerWrap}>
                  <Text style={[styles.footerText, { color: colors.textMuted }]}>
                    By continuing, you agree to our{" "}
                    <Text style={[styles.footerLink, { color: colors.primary }]}>Terms of Service</Text>
                    {" "}&amp;{" "}
                    <Text style={[styles.footerLink, { color: colors.primary }]}>Privacy Policy</Text>.
                  </Text>
                </View>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

/* ==========================================
   Helper UI Components
   ========================================== */

// 1. Argon-style Discrete Tab Selector
const SlidingTabSelector: React.FC<{
  tab: Mode;
  setTab: (t: Mode) => void;
}> = ({ tab, setTab }) => {
  return (
    <View style={styles.tabSelectorBg}>
      <Pressable onPress={() => setTab("otp")} style={[styles.tabButton, tab === "otp" && styles.tabButtonActive]}>
        <Text style={[styles.tabButtonText, { color: tab === "otp" ? "#FFFFFF" : "#8898AA" }]}>
          Mobile + OTP
        </Text>
      </Pressable>
      <Pressable onPress={() => setTab("email")} style={[styles.tabButton, tab === "email" && styles.tabButtonActive]}>
        <Text style={[styles.tabButtonText, { color: tab === "email" ? "#FFFFFF" : "#8898AA" }]}>
          Email + Password
        </Text>
      </Pressable>
    </View>
  );
};

// 2. Premium Animated Theme Toggle Switch
const ThemeToggle: React.FC = () => {
  const { mode, toggle } = useTheme();
  const toggleAnim = useRef(new Animated.Value(mode === "dark" ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(toggleAnim, {
      toValue: mode === "dark" ? 1 : 0,
      useNativeDriver: false,
      tension: 90,
      friction: 8,
    }).start();
  }, [mode]);

  const sliderLeft = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <Pressable
      onPress={toggle}
      style={[
        styles.themeToggleTrack,
        {
          backgroundColor: mode === "dark" ? "#1E1E24" : "#E2E8F0",
        },
      ]}
    >
      <Animated.View
        style={[
          styles.themeToggleThumb,
          {
            left: sliderLeft,
            backgroundColor: mode === "dark" ? "#8B5CF6" : "#F59E0B",
          },
        ]}
      >
        {mode === "dark" ? (
          <Moon size={10} color="#FFFFFF" />
        ) : (
          <Sun size={10} color="#FFFFFF" />
        )}
      </Animated.View>
    </Pressable>
  );
};

// 3. Reusable Floating Label Text Field
const FloatingInput: React.FC<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "number-pad" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  maxLength?: number;
  testID?: string;
  accessibilityLabel?: string;
  prefix?: string;
}> = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  rightIcon,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
  maxLength,
  testID,
  accessibilityLabel,
  prefix,
}) => {
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const isActive = isFocused || value.length > 0;

    return (
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={[
          styles.textFieldContainer,
          {
            borderColor: isFocused ? colors.primary : colors.border,
            backgroundColor: "#FFFFFF",
          },
        ]}
      >
        {icon && <View style={styles.textFieldIcon}>{icon}</View>}
        {prefix && (
          <Text style={[styles.textFieldPrefix, { color: colors.text }]}>{prefix}</Text>
        )}
        <View style={styles.textFieldContent}>
          {isActive && (
            <Text style={[styles.textFieldLabelSmall, { color: isFocused ? colors.primary : colors.textMuted }]}>
              {label}
            </Text>
          )}
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isActive ? placeholder : label}
            placeholderTextColor={colors.textMuted}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            maxLength={maxLength}
            testID={testID}
            accessibilityLabel={accessibilityLabel}
            style={[
              isActive ? styles.textFieldInputActive : styles.textFieldInputInactiveText,
              { color: colors.text }
            ]}
          />
        </View>
        {rightIcon && <View style={styles.textFieldRightIcon}>{rightIcon}</View>}
      </Pressable>
    );
  };

// 4. Premium Fintech Gradient Button
const PremiumButton: React.FC<{
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  testID?: string;
}> = ({ label, onPress, loading, disabled, testID }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.timing(scaleValue, {
      toValue: 0.96,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      testID={testID}
      style={styles.primaryButtonPressable}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }], width: "100%" }}>
        <LinearGradient
          colors={disabled ? ["#E5E7EB", "#D1D5DB"] : ["#8B5CF6", "#6D28D9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primaryButtonGradient}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.primaryButtonContent}>
              <Text style={[styles.primaryButtonText, disabled && { color: "#9CA3AF" }]}>
                {label}
              </Text>
              {!disabled && <ArrowRight size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />}
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

// 5. Collapsible Developer Quick Login
const CollapsibleDevCard: React.FC<{
  onPrefill: (email: string, password: string) => void;
  devAdminEmail: string;
  devAdminPassword: string;
}> = ({ onPrefill, devAdminEmail, devAdminPassword }) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(rotationAnim, {
      toValue: expanded ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [expanded]);

  const chevronRotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View style={[styles.devCardContainer, { borderColor: colors.border, backgroundColor: "#F8FAFC" }]}>
      <Pressable onPress={() => setExpanded(!expanded)} style={styles.devCardHeader}>
        <View style={styles.devCardHeaderTitleWrap}>
          <User size={18} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={[styles.devCardTitleText, { color: colors.text }]}>Developer Quick Login</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
          <ChevronRight size={18} color={colors.textMuted} />
        </Animated.View>
      </Pressable>

      {expanded && (
        <View style={styles.devCardChipsContainer}>
          <Pressable
            onPress={() => onPrefill(devAdminEmail, devAdminPassword)}
            style={styles.devRoleChip}
          >
            <View style={styles.devRoleHeader}>
              <Text style={styles.devRoleBadgeAdmin}>Admin</Text>
              <Text style={styles.devRoleFillText}>Tap to autofill</Text>
            </View>
            <Text style={styles.devRoleEmail}>{devAdminEmail}</Text>
          </Pressable>

          <Pressable
            onPress={() => onPrefill("partner@credupe.local", "Partner@123")}
            style={styles.devRoleChip}
          >
            <View style={styles.devRoleHeader}>
              <Text style={styles.devRoleBadgePartner}>Partner</Text>
              <Text style={styles.devRoleFillText}>Tap to autofill</Text>
            </View>
            <Text style={styles.devRoleEmail}>partner@credupe.local</Text>
          </Pressable>

          <Pressable
            onPress={() => onPrefill("customer@credupe.local", "Customer@123")}
            style={styles.devRoleChip}
          >
            <View style={styles.devRoleHeader}>
              <Text style={styles.devRoleBadgeCustomer}>Customer</Text>
              <Text style={styles.devRoleFillText}>Tap to autofill</Text>
            </View>
            <Text style={styles.devRoleEmail}>customer@credupe.local</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

/* ==========================================
   Login Panels
   ========================================== */

/* ─── OTP Panel ─── */
const OtpPanel: React.FC<{ onAuthed: () => void }> = ({ onAuthed }) => {
  const { colors } = useTheme();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const send = useCallback(async () => {
    setPhoneError(null);
    if (phone.length < 10) {
      setPhoneError("Enter a 10-digit mobile number");
      return;
    }
    setLoading(true);
    const r = await requestOtp(phone);
    setLoading(false);
    if (!r.success) {
      if (r.error?.code === "NETWORK") {
        const cfg = getApiConfig();
        Toast.show({
          type: "error",
          text1: "Backend unreachable",
          text2: [
            ...((r.error?.message ?? []).slice(0, 2)),
            `Current API: ${cfg.api}`,
          ].join("\n"),
        });
        return;
      }
      Toast.show({
        type: "error",
        text1: "Could not send OTP",
        text2: r.error?.message?.join("\n") ?? "Try again",
      });
      return;
    }
    setDevOtp(r.data?.devOtp ?? null);
    setStage("otp");
  }, [phone]);

  const verify = useCallback(async () => {
    setLoading(true);
    const r = await verifyOtp(phone, otp);
    setLoading(false);
    if (!r.success) {
      if (r.error?.code === "NETWORK") {
        const cfg = getApiConfig();
        Toast.show({
          type: "error",
          text1: "Backend unreachable",
          text2: [
            ...((r.error?.message ?? []).slice(0, 2)),
            `Current API: ${cfg.api}`,
          ].join("\n"),
        });
        return;
      }
      Toast.show({
        type: "error",
        text1: "OTP invalid",
        text2: r.error?.message?.join("\n") ?? "Try again",
      });
      return;
    }
    onAuthed();
  }, [phone, otp, onAuthed]);

  if (stage === "phone") {
    return (
      <View style={{ width: "100%", marginTop: 16 }}>
        <View style={{ marginBottom: phoneError ? 8 : 16 }}>
          <Input
            placeholder="Mobile number (e.g. 9999000001)"
            value={phone}
            onChangeText={(txt) => {
              setPhone(txt);
              if (phoneError) setPhoneError(null);
            }}
            keyboardType="phone-pad"
            maxLength={10}
            icon={<Smartphone size={20} color="#6B7280" />}
            testID="phone-input"
            error={!!phoneError}
          />
          {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
        </View>

        <Button title="Send OTP" onPress={send} loading={loading} testID="send-otp-btn" style={{ marginBottom: 16 }} />

        <View style={styles.devTipsContainer}>
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            Try <Text style={{ color: colors.primary, fontWeight: "700" }}>9999000001</Text> (Customer) or{" "}
            <Text style={{ color: colors.primary, fontWeight: "700" }}>9999000002</Text> (Partner)
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ width: "100%", marginTop: 16 }}>
      <View style={{ marginBottom: 16 }}>
        <Input
          placeholder={`Enter OTP sent to +91 ${phone}`}
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          icon={<Smartphone size={20} color="#6B7280" />}
          testID="otp-input"
        />
      </View>

      {devOtp ? (
        <Pressable onPress={() => setOtp(devOtp)} style={{ marginBottom: 16 }}>
          <View style={styles.devOtpFillCard}>
            <Text style={{ color: colors.text, fontSize: 13 }}>
              DEV OTP: <Text style={{ color: colors.primary, fontWeight: "800" }}>{devOtp}</Text>
            </Text>
            <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "700" }}>Tap to autofill</Text>
          </View>
        </Pressable>
      ) : null}

      <Button title="Verify & Sign In" onPress={verify} loading={loading} testID="verify-otp-btn" style={{ marginBottom: 16 }} />

      <Pressable onPress={() => setStage("phone")} style={styles.changeNumberBtn}>
        <Text style={{ color: colors.textMuted, fontSize: 14, fontWeight: "600" }}>Change number</Text>
      </Pressable>
    </View>
  );
};

/* ─── Email Panel ─── */
const EmailPanel: React.FC<{ onAuthed: () => void; onForgotPassword: () => void }> = ({ onAuthed, onForgotPassword }) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Field validation states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [devAdminEmail, setDevAdminEmail] = useState("admin@credupe.local");
  const [devAdminPassword, setDevAdminPassword] = useState("Admin@123");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch<{ email: string; password: string }>("/auth/dev-credentials");
        if (res.success && res.data?.email && res.data?.password) {
          setDevAdminEmail(res.data.email);
          setDevAdminPassword(res.data.password);
        }
      } catch (err) {
        // Fail silently
      }
    })();
  }, []);

  const handlePrefill = (e: string, p: string) => {
    setEmail(e);
    setPwd(p);
    setEmailError(null);
    setPasswordError(null);
  };

  const submit = useCallback(async () => {
    let hasError = false;
    setEmailError(null);
    setPasswordError(null);

    if (!email.trim()) {
      setEmailError("Email cannot be empty");
      hasError = true;
    } else if (!email.includes("@")) {
      setEmailError("Enter a valid email address");
      hasError = true;
    }

    if (!pwd) {
      setPasswordError("Password cannot be empty");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    let r = await loginEmail(email.trim(), pwd);

    if (!r.success && email.trim() === devAdminEmail && pwd !== devAdminPassword) {
      r = await loginEmail(email.trim(), devAdminPassword);
    }

    setLoading(false);
    if (!r.success) {
      if (r.error?.code === "NETWORK") {
        const cfg = getApiConfig();
        Toast.show({
          type: "error",
          text1: "Backend unreachable",
          text2: [
            ...((r.error?.message ?? []).slice(0, 2)),
            `Current API: ${cfg.api}`,
          ].join("\n"),
        });
        return;
      }
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: r.error?.message?.join("\n") ?? "Try again",
      });
      return;
    }
    onAuthed();
  }, [email, pwd, devAdminEmail, devAdminPassword, onAuthed]);

  const isDevMode = typeof __DEV__ !== "undefined" && __DEV__;

  return (
    <View style={{ width: "100%", marginTop: 16 }}>
      {/* Email Input */}
      <View style={{ marginBottom: emailError ? 8 : 16 }}>
        <Input
          placeholder="Enter your email"
          value={email}
          onChangeText={(txt) => {
            setEmail(txt);
            if (emailError) setEmailError(null);
          }}
          keyboardType="email-address"
          icon={<Mail size={20} color="#6B7280" />}
          testID="email-input"
          error={!!emailError}
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}
      </View>

      {/* Password Input */}
      <View style={{ marginBottom: passwordError ? 8 : 12 }}>
        <Input
          placeholder="Enter your password"
          value={pwd}
          onChangeText={(txt) => {
            setPwd(txt);
            if (passwordError) setPasswordError(null);
          }}
          secureTextEntry={!showPassword}
          icon={<Lock size={20} color="#6B7280" />}
          rightIcon={
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color="#6B7280" />
              ) : (
                <Eye size={20} color="#6B7280" />
              )}
            </Pressable>
          }
          testID="password-input"
          error={!!passwordError}
        />
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
      </View>

      {/* Forgot Password */}
      <Pressable onPress={onForgotPassword} style={styles.forgotBtn}>
        <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "600" }}>Forgot Password?</Text>
      </Pressable>

      {/* Sign In Button */}
      <Button
        title="Sign In"
        onPress={submit}
        loading={loading}
        disabled={!email || !pwd}
        testID="signin-btn"
        style={{ marginBottom: 16 }}
      />

      {/* Collapsible Quick Login */}
      {isDevMode && (
        <CollapsibleDevCard
          onPrefill={handlePrefill}
          devAdminEmail={devAdminEmail}
          devAdminPassword={devAdminPassword}
        />
      )}
    </View>
  );
};

/* ─── Forgot Password Panel ─── */
const ForgotPasswordPanel: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [stage, setStage] = useState<"request" | "reset">("request");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Field validations
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleRequest = useCallback(async () => {
    setEmailError(null);
    if (!email.trim() || !email.includes("@")) {
      setEmailError("Enter a valid email address");
      return;
    }
    setLoading(true);
    const r = await forgotPassword(email.trim().toLowerCase());
    setLoading(false);
    if (!r.success) {
      Toast.show({
        type: "error",
        text1: "Request failed",
        text2: r.error?.message?.join("\n") ?? "Unable to send reset code. Try again.",
      });
      return;
    }
    setDevOtp(r.data?.devOtp ?? null);
    setStage("reset");
    Toast.show({ type: "success", text1: "Reset code sent to your email" });
  }, [email]);

  const handleReset = useCallback(async () => {
    if (code.length !== 6) {
      Toast.show({ type: "error", text1: "Enter the 6-digit code" });
      return;
    }
    if (newPassword.length < 6) {
      Toast.show({ type: "error", text1: "Password must be at least 6 characters" });
      return;
    }
    setLoading(true);
    const r = await resetPassword(email.trim().toLowerCase(), code.trim(), newPassword);
    setLoading(false);
    if (!r.success) {
      Toast.show({
        type: "error",
        text1: "Reset failed",
        text2: r.error?.message?.join("\n") ?? "Invalid code or reset failed.",
      });
      return;
    }
    Toast.show({ type: "success", text1: "Password reset successful. Please log in." });
    onCancel();
  }, [email, code, newPassword, onCancel]);

  if (stage === "request") {
    return (
      <View style={{ width: "100%", marginTop: 16 }}>
        <View style={{ marginBottom: emailError ? 8 : 16 }}>
          <Input
            placeholder="Enter your email"
            value={email}
            onChangeText={(txt) => {
              setEmail(txt);
              if (emailError) setEmailError(null);
            }}
            keyboardType="email-address"
            icon={<Mail size={20} color="#6B7280" />}
            error={!!emailError}
          />
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}
        </View>

        <Button title="Send Reset Code" onPress={handleRequest} loading={loading} style={{ marginBottom: 16 }} />

        <Pressable onPress={onCancel} style={styles.changeNumberBtn}>
          <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 14 }}>Back to Login</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ width: "100%", marginTop: 16 }}>
      <View style={{ marginBottom: 16 }}>
        <Input
          placeholder="6-digit verification code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          icon={<Mail size={20} color="#6B7280" />}
        />
      </View>

      {devOtp ? (
        <Pressable onPress={() => setCode(devOtp)} style={{ marginBottom: 16 }}>
          <View style={styles.devOtpFillCard}>
            <Text style={{ color: colors.text, fontSize: 13 }}>
              DEV Reset Code: <Text style={{ color: colors.primary, fontWeight: "800" }}>{devOtp}</Text>
            </Text>
            <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "700" }}>Tap to autofill</Text>
          </View>
        </Pressable>
      ) : null}

      <View style={{ marginBottom: 16 }}>
        <Input
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showPassword}
          icon={<Lock size={20} color="#6B7280" />}
          rightIcon={
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color="#6B7280" />
              ) : (
                <Eye size={20} color="#6B7280" />
              )}
            </Pressable>
          }
        />
      </View>

      <Button title="Reset Password" onPress={handleReset} loading={loading} style={{ marginBottom: 16 }} />

      <Pressable onPress={onCancel} style={styles.changeNumberBtn}>
        <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 14 }}>Back to Login</Text>
      </Pressable>
    </View>
  );
};

/* ==========================================
   Styles System
   ========================================== */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  bottomSheet: {
    width: "100%",
    backgroundColor: "#F4F5F7",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    shadowColor: "black",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  floatingLogoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  floatingLogo: {
    width: 210,
    height: 75,
    alignSelf: "center",
    marginBottom: 12,
  },
  floatingTagline: {
    fontSize: 14,
    fontFamily: FONT_FAMILY,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  // Tab styles (Argon inspired)
  tabSelectorBg: {
    flexDirection: "row",
    height: 44,
    marginBottom: 20,
    justifyContent: "space-between",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: "#5E72E4",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: FONT_FAMILY,
  },
  // Theme Toggle Switch
  themeToggleTrack: {
    width: 48,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: "center",
  },
  themeToggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  // Floating Inputs
  textFieldContainer: {
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  textFieldIcon: {
    marginRight: 10,
  },
  textFieldPrefix: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FONT_FAMILY,
    marginRight: 6,
  },
  textFieldRightIcon: {
    marginLeft: 10,
  },
  textFieldContent: {
    flex: 1,
    justifyContent: "center",
  },
  inputActiveContainer: {
    justifyContent: "center",
  },
  inputInactiveContainer: {
    justifyContent: "center",
  },
  textFieldLabelSmall: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: FONT_FAMILY,
    marginBottom: 1,
  },
  textFieldLabelLarge: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: FONT_FAMILY,
  },
  textFieldInputActive: {
    height: Platform.OS === "android" ? 30 : 24,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FONT_FAMILY,
    padding: 0,
    paddingVertical: 0,
    textAlignVertical: "center",
    borderWidth: 0,
    ...Platform.select({
      web: {
        outlineStyle: "none",
        outlineWidth: 0,
      },
    }),
  } as any,
  textFieldInputInactiveText: {
    height: 40,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FONT_FAMILY,
    padding: 0,
    paddingVertical: 0,
    textAlignVertical: "center",
    borderWidth: 0,
    ...Platform.select({
      web: {
        outlineStyle: "none",
        outlineWidth: 0,
      },
    }),
  } as any,
  // Custom Reset Pass Header
  resetHeaderContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  resetTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    fontFamily: FONT_FAMILY,
  },
  // Validation Errors
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: FONT_FAMILY,
    marginTop: 4,
    marginLeft: 8,
  },
  // Dev Helper prefill
  devOtpFillCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  devTipsContainer: {
    alignItems: "center",
    marginTop: 12,
  },
  hint: {
    fontSize: 12,
    fontFamily: FONT_FAMILY,
    lineHeight: 18,
    textAlign: "center",
  },
  changeNumberBtn: {
    marginTop: 18,
    alignItems: "center",
    paddingVertical: 4,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: -2,
    paddingVertical: 4,
  },
  // Premium Buttons
  primaryButtonPressable: {
    marginTop: 20,
    width: "100%",
    borderRadius: 30,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonGradient: {
    height: 58,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.5,
  },
  // Collapsible Developer Card styles
  devCardContainer: {
    marginTop: 24,
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  devCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  devCardHeaderTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  devCardTitleText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: FONT_FAMILY,
  },
  devCardChipsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  devRoleChip: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
  },
  devRoleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  devRoleBadgeAdmin: {
    fontSize: 10,
    fontWeight: "800",
    color: "#DC2626",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  devRoleBadgePartner: {
    fontSize: 10,
    fontWeight: "800",
    color: "#7C3AED",
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  devRoleBadgeCustomer: {
    fontSize: 10,
    fontWeight: "800",
    color: "#2563EB",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  devRoleFillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#10B981",
  },
  devRoleEmail: {
    fontSize: 12,
    color: "#4B5563",
    fontFamily: FONT_FAMILY,
  },
  // Redirect Sign Up Section
  signupRedirectWrap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    paddingVertical: 8,
  },
  signupLabel: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: FONT_FAMILY,
  },
  signupButtonWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  signupText: {
    color: "#7C3AED",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: FONT_FAMILY,
  },
  // Footer Disclaimer
  footerWrap: {
    marginTop: 28,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    lineHeight: 18,
    textAlign: "center",
    fontFamily: FONT_FAMILY,
  },
  footerLink: {
    color: "#7C3AED",
    fontWeight: "600",
  },
});
