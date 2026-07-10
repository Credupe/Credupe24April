import React, { useCallback, useEffect, useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CredupeLogo } from "../components/CredupeLogo";
import { getApiConfig, loginEmail, requestOtp, verifyOtp, forgotPassword, resetPassword } from "../api/credupe";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";
import Toast from "react-native-toast-message";

type Mode = "otp" | "email" | "forgot";

export const LoginScreen: React.FC<{ onAuthed: () => void; onSignup?: () => void }> = ({ onAuthed, onSignup }) => {
  const { colors, mode, toggle } = useTheme();
  const [tab, setTab] = useState<Mode>("otp");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Theme toggle pill */}
          <Pressable
            onPress={toggle}
            style={[styles.themePill, { borderColor: colors.border, backgroundColor: colors.card }]}
            accessibilityLabel="toggle-theme"
          >
            <Text style={{ color: colors.text, fontWeight: "700" }}>
              {mode === "dark" ? "☾ Dark" : "☀ Light"}
            </Text>
          </Pressable>

          <View style={styles.header}>
            <CredupeLogo size={56} layout="stacked" withWordmark />
            <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.md, textAlign: "center" }]}>
              One marketplace, every loan.{"\n"}Designed for partners and customers.
            </Text>
          </View>

          {/* Segmented control */}
          {tab !== "forgot" ? (
            <View style={[styles.tabs, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TabButton active={tab === "otp"} onPress={() => setTab("otp")} label="Mobile + OTP" />
              <TabButton active={tab === "email"} onPress={() => setTab("email")} label="Email + Password" />
            </View>
          ) : (
            <View style={{ marginBottom: spacing.lg }}>
              <Text style={[typography.h2, { color: colors.text, textAlign: "center", fontWeight: "700", fontSize: 20 }]}>
                Reset Password
              </Text>
            </View>
          )}

          {tab === "otp" ? (
            <OtpPanel onAuthed={onAuthed} />
          ) : tab === "email" ? (
            <EmailPanel onAuthed={onAuthed} onForgotPassword={() => setTab("forgot")} />
          ) : (
            <ForgotPasswordPanel onCancel={() => setTab("email")} />
          )}

          {onSignup && tab !== "forgot" ? (
            <Pressable
              onPress={onSignup}
              style={{ marginTop: spacing.lg }}
              accessibilityLabel="open-signup"
            >
              <Text style={{ color: colors.primary, fontWeight: "700" }}>New here? Sign up</Text>
            </Pressable>
          ) : null}

          <Text style={[typography.micro, { color: colors.textMuted, marginTop: spacing.xxl, textAlign: "center" }]}>
            BY CONTINUING YOU AGREE TO OUR TERMS &amp; PRIVACY
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const TabButton: React.FC<{ active: boolean; onPress: () => void; label: string }> = ({
  active,
  onPress,
  label,
}) => {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tabBtn,
        active && { backgroundColor: colors.primary },
      ]}
      accessibilityLabel={`tab-${label}`}
    >
      <Text
        style={{
          color: active ? colors.textInverted : colors.text,
          fontWeight: "700",
          fontSize: 14,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

/* ─── OTP Panel ─── */
const OtpPanel: React.FC<{ onAuthed: () => void }> = ({ onAuthed }) => {
  const { colors } = useTheme();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const send = useCallback(async () => {
    if (phone.length < 10) {
      Toast.show({ type: "error", text1: "Enter a 10-digit mobile number" });
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
      <View style={{ width: "100%" }}>
        <Text style={[typography.caption, { color: colors.textMuted, marginBottom: spacing.xs }]}>
          Mobile number
        </Text>
        <View style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: "row", alignItems: "center" }]}>
          <Text style={{ color: colors.textMuted, marginRight: spacing.sm, fontSize: 16 }}>+91</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="number-pad"
            placeholder="9999000001"
            placeholderTextColor={colors.textMuted}
            style={{ flex: 1, color: colors.text, fontSize: 16 }}
            maxLength={10}
            accessibilityLabel="phone-input"
          />
        </View>
        <PrimaryButton label="Send OTP" onPress={send} loading={loading} testID="send-otp-btn" />
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          Try <Text style={{ color: colors.primary, fontWeight: "700" }}>9999000001</Text> (Customer) or{" "}
          <Text style={{ color: colors.primary, fontWeight: "700" }}>9999000002</Text> (Partner)
        </Text>
      </View>
    );
  }

  return (
    <View style={{ width: "100%" }}>
      <Text style={[typography.caption, { color: colors.textMuted, marginBottom: spacing.xs }]}>
        Enter OTP sent to +91 {phone}
      </Text>
      <TextInput
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        placeholder="6-digit OTP"
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text, fontSize: 18, letterSpacing: 6, textAlign: "center" }]}
        maxLength={6}
        accessibilityLabel="otp-input"
      />
      {devOtp ? (
        <Pressable onPress={() => setOtp(devOtp)}>
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            DEV OTP: <Text style={{ color: colors.primary, fontWeight: "800" }}>{devOtp}</Text> (tap to fill)
          </Text>
        </Pressable>
      ) : null}
      <PrimaryButton label="Verify &amp; sign in" onPress={verify} loading={loading} testID="verify-otp-btn" />
      <Pressable onPress={() => setStage("phone")} style={{ marginTop: spacing.sm, alignItems: "center" }}>
        <Text style={{ color: colors.textMuted }}>Change number</Text>
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

  const submit = useCallback(async () => {
    setLoading(true);
    const r = await loginEmail(email.trim(), pwd);
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
  }, [email, pwd, onAuthed]);

  return (
    <View style={{ width: "100%" }}>
      <Text style={[typography.caption, { color: colors.textMuted, marginBottom: spacing.xs }]}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="customer@credupe.local"
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text, fontSize: 16 }]}
        accessibilityLabel="email-input"
      />
      <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.md, marginBottom: spacing.xs }]}>Password</Text>
      <TextInput
        value={pwd}
        onChangeText={setPwd}
        secureTextEntry
        placeholder="••••••••"
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text, fontSize: 16 }]}
        accessibilityLabel="password-input"
      />
      <Pressable
        onPress={onForgotPassword}
        style={{ alignSelf: "flex-end", marginTop: spacing.xs, marginBottom: spacing.md }}
      >
        <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "600" }}>Forgot Password?</Text>
      </Pressable>
      <PrimaryButton label="Sign in" onPress={submit} loading={loading} testID="signin-btn" />
      <View style={{ alignItems: "center", marginTop: spacing.md, gap: 4 }}>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>
          Partner: <Text style={{ color: colors.primary, fontWeight: "700" }}>partner@credupe.local</Text> / Partner@123
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>
          Customer: <Text style={{ color: colors.primary, fontWeight: "700" }}>customer@credupe.local</Text> / Customer@123
        </Text>
      </View>
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

  const handleRequest = useCallback(async () => {
    if (!email.trim() || !email.includes("@")) {
      Toast.show({ type: "error", text1: "Enter a valid email address" });
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
      <View style={{ width: "100%" }}>
        <Text style={[typography.caption, { color: colors.textMuted, marginBottom: spacing.xs }]}>
          Enter your email
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="yourname@domain.com"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text, fontSize: 16 }]}
        />
        <PrimaryButton label="Send Reset Code" onPress={handleRequest} loading={loading} />
        <Pressable onPress={onCancel} style={{ marginTop: spacing.sm, alignItems: "center" }}>
          <Text style={{ color: colors.primary, fontWeight: "600" }}>Back to Login</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ width: "100%" }}>
      <Text style={[typography.caption, { color: colors.textMuted, marginBottom: spacing.xs }]}>
        6-Digit Verification Code
      </Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="000000"
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text, fontSize: 18, letterSpacing: 6, textAlign: "center" }]}
      />
      {devOtp ? (
        <Pressable onPress={() => setCode(devOtp)} style={{ marginBottom: spacing.md }}>
          <Text style={{ color: colors.textMuted, textAlign: "center", fontSize: 13 }}>
            DEV OTP: <Text style={{ color: colors.primary, fontWeight: "800" }}>{devOtp}</Text> (tap to fill)
          </Text>
        </Pressable>
      ) : null}
      
      <Text style={[typography.caption, { color: colors.textMuted, marginBottom: spacing.xs }]}>
        New Password
      </Text>
      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholder="Choose new password"
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text, fontSize: 16, marginBottom: spacing.lg }]}
      />
      
      <PrimaryButton label="Reset Password" onPress={handleReset} loading={loading} />
      <Pressable onPress={onCancel} style={{ marginTop: spacing.sm, alignItems: "center" }}>
        <Text style={{ color: colors.primary, fontWeight: "600" }}>Back to Login</Text>
      </Pressable>
    </View>
  );
};

const PrimaryButton: React.FC<{ label: string; onPress: () => void; loading?: boolean; testID?: string }> = ({
  label,
  onPress,
  loading,
  testID,
}) => {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      testID={testID}
      style={[styles.btn, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textInverted} />
      ) : (
        <Text style={{ color: colors.textInverted, fontWeight: "800", fontSize: 16 }}>{label}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing.xl, paddingTop: spacing.xxl, alignItems: "center", minHeight: "100%" },
  header: { alignItems: "center", marginVertical: spacing.xl },
  themePill: {
    alignSelf: "flex-end",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  tabs: {
    flexDirection: "row",
    padding: 4,
    borderRadius: radii.pill,
    marginBottom: spacing.xl,
    borderWidth: 1,
    gap: 4,
    width: "100%",
  },
  tabBtn: { flex: 1, paddingVertical: 12, borderRadius: radii.pill, alignItems: "center" },
  input: {
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  btn: {
    marginTop: spacing.xl,
    paddingVertical: 16,
    borderRadius: radii.pill,
    alignItems: "center",
  },
  hint: { fontSize: 13, marginTop: spacing.md, textAlign: "center" },
});
