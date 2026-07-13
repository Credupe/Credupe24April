import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { ArrowLeft, User, Phone, Mail, ShieldCheck, ChevronDown } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../../../App";
import { useTheme } from "../../../theme/ThemeProvider";
import { startPartnerOnboarding } from "../../../api/credupe";

const logoImage = require("../../../../assets/logo.png");

type Props = NativeStackScreenProps<RootStackParamList, "SignupContactDetails">;

const countries = [
  { code: "+91", flag: "🇮🇳", label: "India" },
  { code: "+1", flag: "🇺🇸", label: "United States" },
  { code: "+44", flag: "🇬🇧", label: "United Kingdom" },
  { code: "+971", flag: "🇦🇪", label: "United Arab Emirates" },
  { code: "+65", flag: "🇸🇬", label: "Singapore" },
  { code: "+1", flag: "🇨🇦", label: "Canada" },
  { code: "+966", flag: "🇸🇦", label: "Saudi Arabia" },
  { code: "+61", flag: "🇦🇺", label: "Australia" },
  { code: "+49", flag: "🇩🇪", label: "Germany" },
  { code: "+33", flag: "🇫🇷", label: "France" },
];

export const SignupContactDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { mode } = useTheme();
  const insets = useSafeAreaInsets();
  
  const isDark = mode === "dark";

  // Form State
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState(""); // local digits
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<"name" | "mobile" | "email" | null>(null);

  // Country Code Picker State
  const [country, setCountry] = useState({ code: "+91", flag: "🇮🇳", label: "India" });
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const selectedBusinessType = route.params?.businessType;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleMobileChange = (text: string) => {
    const filtered = text.replace(/\D/g, "");
    setMobile(filtered);
  };

  const handleSendOTPs = async () => {
    if (!name.trim()) {
      Toast.show({ type: "error", text1: "Please enter your full name" });
      return;
    }

    const isIndian = country.code === "+91";
    if (isIndian && !mobile.match(/^\d{10}$/)) {
      Toast.show({ type: "error", text1: "Please enter a valid 10-digit mobile number" });
      return;
    }
    if (!isIndian && (mobile.length < 7 || mobile.length > 15)) {
      Toast.show({ type: "error", text1: "Please enter a valid mobile number" });
      return;
    }

    if (!email.includes("@")) {
      Toast.show({ type: "error", text1: "Please enter a valid email address" });
      return;
    }

    const fullMobile = isIndian ? mobile : `${country.code}${mobile}`;

    setIsLoading(true);
    const r = await startPartnerOnboarding(email.trim().toLowerCase(), fullMobile, name.trim());
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
      mobile: fullMobile,
      email: email.trim(),
      businessType: selectedBusinessType,
      onboardingToken: r.data.onboardingToken,
    });
  };

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
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={[styles.headingText, { color: isDark ? "#FFFFFF" : "#111827" }]}>
              Tell us about yourself
            </Text>
            <Text style={[styles.subtitleText, { color: isDark ? "#94A3B8" : "#6B7280" }]}>
              Let's verify your contact details to continue.
            </Text>
          </View>

          {/* Form Card */}
          <Animated.View
            style={[
              styles.formCard,
              isDark && styles.formCardDark,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Field: Contact Person */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.inputLabel, { color: isDark ? "#E2E8F0" : "#374151" }]}>
                Contact Person
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  isDark && styles.inputContainerDark,
                  focusedInput === "name" && styles.inputContainerFocused,
                ]}
              >
                <User
                  size={22}
                  color={focusedInput === "name" ? "#6D28D9" : isDark ? "#64748B" : "#9CA3AF"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, { color: isDark ? "#FFFFFF" : "#111827" }]}
                  placeholder="Your full name"
                  placeholderTextColor={isDark ? "#64748B" : "#9CA3AF"}
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setFocusedInput("name")}
                  onBlur={() => setFocusedInput(null)}
                  autoCorrect={false}
                  textContentType="name"
                  autoComplete="name"
                />
              </View>
            </View>

            {/* Field: Mobile Number */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.inputLabel, { color: isDark ? "#E2E8F0" : "#374151" }]}>
                Mobile
              </Text>
              <View style={styles.phoneRow}>
                {/* Country Code */}
                <Pressable
                  style={({ pressed }) => [
                    styles.countryCodeBox,
                    isDark && styles.countryCodeBoxDark,
                    pressed && (isDark ? styles.countryCodeBoxPressedDark : styles.countryCodeBoxPressed),
                  ]}
                  onPress={() => setShowCountryPicker(true)}
                >
                  <Text style={styles.countryFlag}>{country.flag}</Text>
                  <Text style={[styles.countryCodeText, { color: isDark ? "#FFFFFF" : "#111827" }]}>
                    {country.code}
                  </Text>
                  <ChevronDown size={14} color={isDark ? "#94A3B8" : "#6B7280"} style={{ marginLeft: 4 }} />
                </Pressable>

                {/* Number Input */}
                <View
                  style={[
                    styles.mobileInputContainer,
                    isDark && styles.inputContainerDark,
                    focusedInput === "mobile" && styles.inputContainerFocused,
                  ]}
                >
                  <Phone
                    size={22}
                    color={focusedInput === "mobile" ? "#6D28D9" : isDark ? "#64748B" : "#9CA3AF"}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.textInput, { color: isDark ? "#FFFFFF" : "#111827" }]}
                    placeholder={country.code === "+91" ? "98765 43210" : "Enter phone number"}
                    placeholderTextColor={isDark ? "#64748B" : "#9CA3AF"}
                    value={mobile}
                    onChangeText={handleMobileChange}
                    keyboardType="phone-pad"
                    maxLength={country.code === "+91" ? 10 : 15}
                    onFocus={() => setFocusedInput("mobile")}
                    onBlur={() => setFocusedInput(null)}
                    textContentType="telephoneNumber"
                    autoComplete="tel"
                  />
                </View>
              </View>
            </View>

            {/* Field: Work Email */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.inputLabel, { color: isDark ? "#E2E8F0" : "#374151" }]}>
                Work Email
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  isDark && styles.inputContainerDark,
                  focusedInput === "email" && styles.inputContainerFocused,
                ]}
              >
                <Mail
                  size={22}
                  color={focusedInput === "email" ? "#6D28D9" : isDark ? "#64748B" : "#9CA3AF"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, { color: isDark ? "#FFFFFF" : "#111827" }]}
                  placeholder="you@yourfirm.com"
                  placeholderTextColor={isDark ? "#64748B" : "#9CA3AF"}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                  textContentType="emailAddress"
                  autoComplete="email"
                />
              </View>
            </View>
          </Animated.View>

          {/* OTP Information Box */}
          <View style={[styles.infoBox, { backgroundColor: isDark ? "#1E1B4B" : "#F5F3FF" }]}>
            <ShieldCheck size={22} color={isDark ? "#C084FC" : "#5B21B6"} style={styles.infoIcon} />
            <Text style={[styles.infoText, { color: isDark ? "#C084FC" : "#5B21B6" }]}>
              We'll send secure OTPs to verify your mobile number and email address.
            </Text>
          </View>

          {/* Submit Button */}
          <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleSendOTPs}
              disabled={isLoading}
              android_ripple={{ color: "rgba(255, 255, 255, 0.2)" }}
              style={styles.buttonPressable}
            >
              <LinearGradient
                colors={["#7C3AED", "#9333EA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.gradientBg, isLoading && styles.buttonDisabled]}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Send OTPs</Text>
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footerWrap}>
            <Text style={[styles.footerText, { color: isDark ? "#94A3B8" : "#6B7280" }]}>
              🔒 Your information is encrypted and completely secure.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Code Picker Modal */}
      <Modal
        visible={showCountryPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowCountryPicker(false)}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <View style={[styles.modalHeader, isDark && styles.modalHeaderDark]}>
              <Text style={[styles.modalTitle, { color: isDark ? "#FFFFFF" : "#111827" }]}>
                Select Country
              </Text>
              <Pressable onPress={() => setShowCountryPicker(false)}>
                <Text style={styles.closeBtnText}>Close</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.countryList}>
              {countries.map((c) => (
                <Pressable
                  key={`${c.code}-${c.label}`}
                  style={({ pressed }) => [
                    styles.countryItem,
                    pressed && (isDark ? styles.countryItemPressedDark : styles.countryItemPressed)
                  ]}
                  onPress={() => {
                    setCountry(c);
                    setMobile(""); // Clear field when country changes to avoid validation mismatch
                    setShowCountryPicker(false);
                  }}
                >
                  <Text style={styles.countryItemFlag}>{c.flag}</Text>
                  <Text style={[styles.countryItemLabel, { color: isDark ? "#FFFFFF" : "#111827" }]}>
                    {c.label}
                  </Text>
                  <Text style={[styles.countryItemCode, { color: isDark ? "#94A3B8" : "#6B7280" }]}>
                    {c.code}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
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
    marginBottom: 20,
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
  welcomeText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6B7280",
    fontFamily: "Plus Jakarta Sans",
    marginBottom: 4,
    paddingHorizontal: 24,
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
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 5,
    marginBottom: 20,
  },
  formCardDark: {
    backgroundColor: "#161C24",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    fontFamily: "Plus Jakarta Sans",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
  },
  inputContainerDark: {
    backgroundColor: "#1C2430",
    borderColor: "#232A33",
  },
  inputContainerFocused: {
    borderColor: "#6D28D9",
    borderWidth: 1.5,
    shadowColor: "#6D28D9",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Plus Jakarta Sans",
    padding: 0,
    ...Platform.select({
      web: {
        outlineStyle: "none" as any,
      },
    }),
  },
  phoneRow: {
    flexDirection: "row",
    gap: 12,
  },
  countryCodeBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
  },
  countryCodeBoxDark: {
    backgroundColor: "#1C2430",
    borderColor: "#232A33",
  },
  countryCodeBoxPressed: {
    backgroundColor: "#F1F5F9",
  },
  countryCodeBoxPressedDark: {
    backgroundColor: "#2E3A4B",
  },
  countryFlag: {
    fontSize: 18,
    marginRight: 6,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Plus Jakarta Sans",
  },
  mobileInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    fontFamily: "Plus Jakarta Sans",
  },
  buttonContainer: {
    marginHorizontal: 24,
    height: 56,
    borderRadius: 18,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 6,
    marginBottom: 20,
  },
  buttonPressable: {
    flex: 1,
    borderRadius: 18,
    overflow: "hidden",
  },
  gradientBg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Plus Jakarta Sans",
  },
  buttonDisabled: {
    opacity: 0.6,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: "50%",
  },
  modalContentDark: {
    backgroundColor: "#161C24",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalHeaderDark: {
    borderBottomColor: "#232A33",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Plus Jakarta Sans",
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6D28D9",
  },
  countryList: {
    paddingVertical: 8,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  countryItemPressed: {
    backgroundColor: "#F8FAFC",
  },
  countryItemPressedDark: {
    backgroundColor: "#1C2430",
  },
  countryItemFlag: {
    fontSize: 22,
    marginRight: 14,
  },
  countryItemLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Plus Jakarta Sans",
  },
  countryItemCode: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Plus Jakarta Sans",
  },
});
