import React, { useEffect, useRef, useState } from "react";
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
  View,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Phone, Mail, ShieldCheck, ChevronDown, ChevronRight } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../../../App";
import { useTheme } from "../../../theme/ThemeProvider";
import { startPartnerOnboarding } from "../../../api/credupe";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Text } from "../../../components/ui/Text";

const logoImage = require("../../../../assets/logo.png");
const bgImage = require("../../../../assets/register-bg.png");

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

const FONT_FAMILY = Platform.select({
  ios: "SF Pro Display",
  android: "sans-serif-medium",
  default: "System",
});

export const SignupContactDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";

  // Form State
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Country Code Picker State
  const [country, setCountry] = useState({ code: "+91", flag: "🇮🇳", label: "India" });
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  // Animations
  const cardScale = useRef(new Animated.Value(0.95)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  const selectedBusinessType = route.params?.businessType;

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
    <View style={styles.safeArea}>
      <ImageBackground source={bgImage} style={{ flex: 1, width: "100%", height: "100%" }}>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={{ flex: 1, minHeight: 40 }} />

              {/* Logo floating above the sheet */}
              <View style={styles.floatingLogoContainer}>
                <Image source={logoImage} style={[styles.floatingLogo, { tintColor: "#FFFFFF" }]} resizeMode="contain" />
                <Text style={styles.floatingTagline}>
                  Tell us about yourself{"\n"}Let's verify your contact details.
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
                <View style={{ marginBottom: 24 }}>
                  <Input
                    placeholder="Your full name"
                    value={name}
                    onChangeText={setName}
                    icon={<User size={20} color="#6B7280" />}
                    autoCorrect={false}
                    textContentType="name"
                    autoComplete="name"
                  />
                </View>

                <View style={{ marginBottom: 24 }}>
                  <Input
                    placeholder={country.code === "+91" ? "98765 43210" : "Enter phone number"}
                    value={mobile}
                    onChangeText={handleMobileChange}
                    keyboardType="phone-pad"
                    maxLength={country.code === "+91" ? 10 : 15}
                    textContentType="telephoneNumber"
                    autoComplete="tel"
                    icon={
                      <Pressable 
                        onPress={() => setShowCountryPicker(true)} 
                        style={{ flexDirection: "row", alignItems: "center", borderRightWidth: 1, borderRightColor: colors.border, paddingRight: 10, marginRight: 6 }}
                      >
                        <Text style={{ fontSize: 16 }}>{country.flag}</Text>
                        <Text style={{ fontSize: 14, fontWeight: "600", marginLeft: 4, marginRight: 2, color: colors.text }}>{country.code}</Text>
                        <ChevronDown size={14} color="#6B7280" />
                      </Pressable>
                    }
                  />
                </View>

                <View style={{ marginBottom: 24 }}>
                  <Input
                    placeholder="you@yourfirm.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    autoComplete="email"
                    icon={<Mail size={20} color="#6B7280" />}
                  />
                </View>

                {/* OTP Information Box */}
                <View style={[styles.infoBox, { backgroundColor: isDark ? "#1E1B4B" : "#F5F3FF", borderColor: isDark ? "#312E81" : "#EDE9FE" }]}>
                  <ShieldCheck size={20} color={colors.primary} style={{ marginRight: 12, marginTop: 2 }} />
                  <Text style={{ flex: 1, fontSize: 13, lineHeight: 18, color: isDark ? "#C084FC" : "#5B21B6" }}>
                    We'll send secure OTPs to verify your mobile number and email address.
                  </Text>
                </View>

                <Button 
                  title="Send OTPs" 
                  onPress={handleSendOTPs} 
                  loading={isLoading} 
                  disabled={!name || !mobile || !email}
                  style={{ marginTop: 8, marginBottom: 16 }}
                />

                <View style={styles.footerWrap}>
                  <Text style={[styles.footerText, { color: colors.textMuted }]}>
                    🔒 Your information is encrypted and completely secure.
                  </Text>
                </View>

              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>

      {/* Country Code Picker Modal */}
      <Modal
        visible={showCountryPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowCountryPicker(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Country</Text>
              <Pressable onPress={() => setShowCountryPicker(false)}>
                <Text style={{ fontSize: 16, fontWeight: "600", color: colors.primary }}>Close</Text>
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {countries.map((c) => (
                <Pressable
                  key={`${c.code}-${c.label}`}
                  style={({ pressed }) => [
                    styles.countryItem,
                    pressed && { backgroundColor: colors.border }
                  ]}
                  onPress={() => {
                    setCountry(c);
                    setMobile("");
                    setShowCountryPicker(false);
                  }}
                >
                  <Text style={styles.countryItemFlag}>{c.flag}</Text>
                  <Text style={[styles.countryItemLabel, { color: colors.text }]}>{c.label}</Text>
                  <Text style={[styles.countryItemCode, { color: colors.textMuted }]}>{c.code}</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  bottomSheet: {
    width: "100%",
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
    fontSize: 16,
    fontFamily: FONT_FAMILY,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  footerWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    fontFamily: FONT_FAMILY,
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: "60%",
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: FONT_FAMILY,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  countryItemFlag: {
    fontSize: 22,
    marginRight: 14,
  },
  countryItemLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FONT_FAMILY,
  },
  countryItemCode: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FONT_FAMILY,
  },
});
