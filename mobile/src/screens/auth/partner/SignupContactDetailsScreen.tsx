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
  useWindowDimensions,
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
  const { width, height } = useWindowDimensions();

  const isDark = mode === "dark";
  const isTablet = width > 600;

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

  const themeColors = useMemo(() => {
    return {
      primary: isDark ? "#A78BFA" : "#7C3AED",
      primaryDark: isDark ? "#8B5CF6" : "#6D28D9",
      bgGradient: (isDark ? ["#0B0F14", "#131922"] : ["#F8F7FF", "#FCFCFF"]) as [string, string],
      cardBg: isDark ? "#161C24" : "#FFFFFF",
      inputBg: isDark ? "#1C2430" : "#F8FAFC",
      inputBgFocused: isDark ? "#1E1B4B" : "#F5F3FF",
      inputBorder: isDark ? "#232A33" : "#E5E7EB",
      textMain: isDark ? "#FFFFFF" : "#111827",
      textMuted: isDark ? "#94A3B8" : "#6B7280",
      infoBg: isDark ? "#1E1B4B" : "#F5F3FF",
      infoBorder: isDark ? "#312E81" : "#EDE9FE",
      infoText: isDark ? "#C084FC" : "#5B21B6",
      btnGradient: (isDark ? ["#7C3AED", "#5B21B6"] : ["#7C3AED", "#9333EA"]) as [string, string],
      shadowColor: isDark ? "#000000" : "#7C3AED",
    };
  }, [isDark]);

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        position: "relative",
        overflow: "hidden",
      },
      scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        paddingTop: insets.top + (isTablet ? 30 : 16),
        paddingBottom: insets.bottom + 24,
      },
      animatedContent: {
        flex: 1,
        justifyContent: "center",
      },
      topRightShape: {
        position: "absolute",
        top: -100,
        right: -100,
        width: 320,
        height: 320,
        borderRadius: 160,
        backgroundColor: themeColors.primary,
        opacity: isDark ? 0.08 : 0.05,
      },
      bottomLeftShape: {
        position: "absolute",
        bottom: -120,
        left: -120,
        width: 380,
        height: 380,
        borderRadius: 190,
        backgroundColor: themeColors.primary,
        opacity: isDark ? 0.08 : 0.05,
      },
      headerBar: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        maxWidth: 500,
        width: "100%",
        alignSelf: "center",
      },
      backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: themeColors.cardBg,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: themeColors.inputBorder,
      },
      backBtnPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.95 }],
      },
      logoSection: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: isTablet ? 32 : 12,
        marginBottom: isTablet ? 32 : 24,
        maxWidth: 500,
        width: isTablet ? 500 : "100%",
        alignSelf: "center",
      },
      logoWrap: {
        width: 150,
        height: 54,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
      },
      logoImage: {
        width: "100%",
        height: "100%",
      },
      welcomeText: {
        fontSize: 13,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1.5,
        color: themeColors.primary,
        textAlign: "center",
        marginBottom: 8,
        fontFamily: "Plus Jakarta Sans",
      },
      headingText: {
        fontSize: width < 360 ? 28 : 34,
        fontWeight: "800",
        color: themeColors.textMain,
        textAlign: "center",
        lineHeight: width < 360 ? 34 : 40,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontFamily: "Plus Jakarta Sans",
      },
      subtitleText: {
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 20,
        color: themeColors.textMuted,
        textAlign: "center",
        paddingHorizontal: 24,
        fontFamily: "Plus Jakarta Sans",
      },
      formCard: {
        backgroundColor: themeColors.cardBg,
        borderRadius: 24,
        padding: width < 360 ? 18 : 24,
        alignSelf: isTablet ? "center" : "stretch",
        width: isTablet ? 500 : undefined,
        marginHorizontal: isTablet ? 0 : 20,
        shadowColor: themeColors.shadowColor,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: isDark ? 0.3 : 0.05,
        shadowRadius: 20,
        elevation: 4,
        borderWidth: 1,
        borderColor: themeColors.inputBorder,
        marginBottom: 20,
      },
      fieldGroup: {
        marginBottom: 18,
      },
      inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: themeColors.textMuted,
        marginBottom: 8,
        fontFamily: "Plus Jakarta Sans",
      },
      inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 58,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: themeColors.inputBorder,
        backgroundColor: themeColors.inputBg,
        paddingHorizontal: 16,
      },
      inputContainerFocused: {
        borderColor: themeColors.primary,
        backgroundColor: themeColors.inputBgFocused,
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
        color: themeColors.textMain,
        padding: 0,
        ...Platform.select({
          web: {
            outlineStyle: "none" as any,
          },
        }),
      },
      phoneRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        gap: 12,
        marginTop: 2,
      },
      countryCodeBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 58,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: themeColors.inputBorder,
        backgroundColor: themeColors.inputBg,
        paddingHorizontal: 12,
      },
      countryCodeBoxFocused: {
        borderColor: themeColors.primary,
        backgroundColor: themeColors.inputBgFocused,
      },
      countryCodeBoxPressed: {
        opacity: 0.85,
      },
      countryFlag: {
        fontSize: 18,
        marginRight: 6,
      },
      countryCodeText: {
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "Plus Jakarta Sans",
        color: themeColors.textMain,
      },
      mobileInputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        height: 58,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: themeColors.inputBorder,
        backgroundColor: themeColors.inputBg,
        paddingHorizontal: 16,
      },
      infoBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        borderRadius: 16,
        padding: 16,
        alignSelf: isTablet ? "center" : "stretch",
        width: isTablet ? 500 : undefined,
        marginHorizontal: isTablet ? 0 : 20,
        backgroundColor: themeColors.infoBg,
        borderWidth: 1,
        borderColor: themeColors.infoBorder,
        marginBottom: 20,
      },
      infoIcon: {
        marginRight: 12,
        marginTop: 2,
      },
      infoText: {
        flex: 1,
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 20,
        fontFamily: "Plus Jakarta Sans",
        color: themeColors.infoText,
      },
      buttonContainer: {
        alignSelf: isTablet ? "center" : "stretch",
        width: isTablet ? 500 : undefined,
        marginHorizontal: isTablet ? 0 : 20,
        height: 56,
        borderRadius: 28,
        shadowColor: themeColors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: isDark ? 0.4 : 0.25,
        shadowRadius: 16,
        elevation: 5,
        marginBottom: 20,
      },
      buttonPressable: {
        flex: 1,
        borderRadius: 28,
        overflow: "hidden",
      },
      gradientBg: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 28,
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
        marginBottom: 32,
        paddingHorizontal: 24,
        alignSelf: isTablet ? "center" : "stretch",
        width: isTablet ? 500 : undefined,
      },
      footerText: {
        fontSize: 13,
        fontWeight: "500",
        textAlign: "center",
        fontFamily: "Plus Jakarta Sans",
        lineHeight: 18,
        color: themeColors.textMuted,
      },
      modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: isTablet ? "center" : "flex-end",
        alignItems: isTablet ? "center" : "stretch",
      },
      modalContent: {
        backgroundColor: themeColors.cardBg,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderBottomLeftRadius: isTablet ? 24 : 0,
        borderBottomRightRadius: isTablet ? 24 : 0,
        paddingBottom: isTablet ? 24 : 40,
        width: isTablet ? 400 : "100%",
        maxHeight: "50%",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
      },
      modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: themeColors.inputBorder,
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        fontFamily: "Plus Jakarta Sans",
        color: themeColors.textMain,
      },
      closeBtnText: {
        fontSize: 16,
        fontWeight: "600",
        color: themeColors.primary,
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
        backgroundColor: themeColors.inputBg,
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
        color: themeColors.textMain,
      },
      countryItemCode: {
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "Plus Jakarta Sans",
        color: themeColors.textMuted,
      },
    });
  }, [insets, width, height, isDark, themeColors, isTablet]);

  return (
    <LinearGradient
      colors={themeColors.bgGradient}
      style={styles.container}
    >
      {/* Background Shapes */}
      <View style={styles.topRightShape} pointerEvents="none" />
      <View style={styles.bottomLeftShape} pointerEvents="none" />

      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.animatedContent,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              {/* Logo & Headline */}
              <View style={styles.logoSection}>
                <View style={styles.logoWrap}>
                  <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
                </View>
                <Text style={styles.welcomeText}>Welcome</Text>
                <Text style={styles.headingText}>
                  Tell us about yourself
                </Text>
                <Text style={styles.subtitleText}>
                  Let's verify your contact details to continue.
                </Text>
              </View>

              {/* Form Card */}
              <View style={styles.formCard}>
                {/* Field: Contact Person */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>
                    Contact Person
                  </Text>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === "name" && styles.inputContainerFocused,
                    ]}
                  >
                    <User
                      size={20}
                      color={focusedInput === "name" ? themeColors.primary : themeColors.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Your full name"
                      placeholderTextColor={themeColors.textMuted}
                      value={name}
                      onChangeText={setName}
                      onFocus={() => setFocusedInput("name")}
                      onBlur={() => setFocusedInput(null)}
                      autoCorrect={false}
                      textContentType="name"
                      autoComplete="name"
                      accessibilityLabel="Contact Person Name Input"
                    />
                  </View>
                </View>

                {/* Field: Mobile Number */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>
                    Mobile
                  </Text>
                  <View style={styles.phoneRow}>
                    {/* Country Code */}
                    <Pressable
                      style={({ pressed }) => [
                        styles.countryCodeBox,
                        showCountryPicker && styles.countryCodeBoxFocused,
                        pressed && styles.countryCodeBoxPressed,
                      ]}
                      onPress={() => setShowCountryPicker(true)}
                      accessibilityLabel="Country code picker"
                      accessibilityRole="button"
                    >
                      <Text style={styles.countryFlag}>{country.flag}</Text>
                      <Text style={styles.countryCodeText}>
                        {country.code}
                      </Text>
                      <ChevronDown size={14} color={themeColors.textMuted} style={{ marginLeft: 4 }} />
                    </Pressable>

                    {/* Number Input */}
                    <View
                      style={[
                        styles.mobileInputContainer,
                        focusedInput === "mobile" && styles.inputContainerFocused,
                      ]}
                    >
                      <Phone
                        size={20}
                        color={focusedInput === "mobile" ? themeColors.primary : themeColors.textMuted}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.textInput}
                        placeholder={country.code === "+91" ? "98765 43210" : "Enter phone number"}
                        placeholderTextColor={themeColors.textMuted}
                        value={mobile}
                        onChangeText={handleMobileChange}
                        keyboardType="phone-pad"
                        maxLength={country.code === "+91" ? 10 : 15}
                        onFocus={() => setFocusedInput("mobile")}
                        onBlur={() => setFocusedInput(null)}
                        textContentType="telephoneNumber"
                        autoComplete="tel"
                        accessibilityLabel="Mobile Number Input"
                      />
                    </View>
                  </View>
                </View>

                {/* Field: Work Email */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>
                    Work Email
                  </Text>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedInput === "email" && styles.inputContainerFocused,
                    ]}
                  >
                    <Mail
                      size={20}
                      color={focusedInput === "email" ? themeColors.primary : themeColors.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="you@yourfirm.com"
                      placeholderTextColor={themeColors.textMuted}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() => setFocusedInput("email")}
                      onBlur={() => setFocusedInput(null)}
                      textContentType="emailAddress"
                      autoComplete="email"
                      accessibilityLabel="Work Email Input"
                    />
                  </View>
                </View>
              </View>

              {/* OTP Information Box */}
              <View style={styles.infoBox}>
                <ShieldCheck size={20} color={themeColors.primary} style={styles.infoIcon} />
                <Text style={styles.infoText}>
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
                  accessibilityLabel="Send OTPs Button"
                  accessibilityRole="button"
                >
                  <LinearGradient
                    colors={themeColors.btnGradient}
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
                <Text style={styles.footerText}>
                  🔒 Your information is encrypted and completely secure.
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* Country Code Picker Modal */}
      <Modal
        visible={showCountryPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowCountryPicker(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select Country
              </Text>
              <Pressable onPress={() => setShowCountryPicker(false)} accessibilityRole="button" accessibilityLabel="Close country picker">
                <Text style={styles.closeBtnText}>Close</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.countryList} showsVerticalScrollIndicator={false}>
              {countries.map((c) => (
                <Pressable
                  key={`${c.code}-${c.label}`}
                  style={({ pressed }) => [
                    styles.countryItem,
                    pressed && styles.countryItemPressed
                  ]}
                  onPress={() => {
                    setCountry(c);
                    setMobile(""); // Clear field when country changes to avoid validation mismatch
                    setShowCountryPicker(false);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${c.label}`}
                >
                  <Text style={styles.countryItemFlag}>{c.flag}</Text>
                  <Text style={styles.countryItemLabel}>
                    {c.label}
                  </Text>
                  <Text style={styles.countryItemCode}>
                    {c.code}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
};

