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

const logoImage = require("../../../../assets/logo.png");

type Props = NativeStackScreenProps<RootStackParamList, "SignupBusinessDetails">;

export const SignupBusinessDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const [businessName, setBusinessName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { onboardingToken } = route.params || {};

  const handleContinue = async () => {
    if (!businessName.trim()) {
      Toast.show({ type: "error", text1: "Please enter your business/firm name" });
      return;
    }
    if (!panNumber.trim()) {
      Toast.show({ type: "error", text1: "Please enter PAN number" });
      return;
    }
    if (!city.trim()) {
      Toast.show({ type: "error", text1: "Please enter city" });
      return;
    }
    if (!state.trim()) {
      Toast.show({ type: "error", text1: "Please enter state" });
      return;
    }
    if (!pincode.trim() || pincode.length !== 6) {
      Toast.show({ type: "error", text1: "Please enter a valid 6-digit pincode" });
      return;
    }
    if (!officeAddress.trim()) {
      Toast.show({ type: "error", text1: "Please enter office address" });
      return;
    }

    setIsLoading(true);
    try {
      navigation.replace("SignupPayoutAccount" as any, {
        onboardingToken,
        businessName: businessName.trim(),
        gstNumber: gstNumber.trim() || undefined,
        panNumber: panNumber.trim().toUpperCase(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        address: officeAddress.trim(),
      });
    } catch (error) {
      Toast.show({ type: "error", text1: "Failed to submit business details. Please try again." });
    } finally {
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

            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
              Business details
            </Text>

            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Tell us about the entity you&apos;ll be transacting through.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.fullRow}>
              <Text style={[styles.label, { color: colors.text }]}>Business / Firm Name *</Text>
              <TextInput
                style={[styles.input, { borderColor: "#E5E7FF", color: colors.text }]}
                placeholder="ABC Financial Services LLP"
                placeholderTextColor="#98A1C0"
                value={businessName}
                onChangeText={setBusinessName}
              />
            </View>

            <View style={styles.fullRow}>
              <Text style={[styles.label, { color: colors.text }]}>GST Number (optional)</Text>
              <TextInput
                style={[styles.input, { borderColor: "#E5E7FF", color: colors.text }]}
                placeholder="27AABCT2354EIZ5"
                placeholderTextColor="#98A1C0"
                value={gstNumber}
                onChangeText={setGstNumber}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.fullRow}>
              <Text style={[styles.label, { color: colors.text }]}>PAN of Business / Proprietor *</Text>
              <TextInput
                style={[styles.input, { borderColor: "#E5E7FF", color: colors.text }]}
                placeholder="ABCDE1234F"
                placeholderTextColor="#98A1C0"
                value={panNumber}
                onChangeText={setPanNumber}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={[styles.label, { color: colors.text }]}>City *</Text>
                <TextInput
                  style={[styles.input, { borderColor: "#E5E7FF", color: colors.text }]}
                  placeholder="Mumbai"
                  placeholderTextColor="#98A1C0"
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              <View style={styles.col}>
                <Text style={[styles.label, { color: colors.text }]}>State *</Text>
                <TextInput
                  style={[styles.input, { borderColor: "#E5E7FF", color: colors.text }]}
                  placeholder="Maharashtra"
                  placeholderTextColor="#98A1C0"
                  value={state}
                  onChangeText={setState}
                />
              </View>
            </View>

            <View style={styles.fullRow}>
              <Text style={[styles.label, { color: colors.text }]}>Pincode *</Text>
              <TextInput
                style={[styles.input, { borderColor: "#E5E7FF", color: colors.text }]}
                placeholder="400001"
                placeholderTextColor="#98A1C0"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <View style={styles.fullRow}>
              <Text style={[styles.label, { color: colors.text }]}>Office Address *</Text>
              <TextInput
                style={[styles.input, styles.textArea, { borderColor: "#E5E7FF", color: colors.text }]}
                placeholder="Building, street, area, landmark"
                placeholderTextColor="#98A1C0"
                value={officeAddress}
                onChangeText={setOfficeAddress}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.infoStrip}>
              <Text style={styles.infoIcon}>🔒</Text>
              <Text style={styles.infoText}>Your business information is secure with us and used only for verification.</Text>
            </View>

            <Pressable
              style={[styles.primaryBtn, { backgroundColor: colors.primary, opacity: isLoading ? 0.6 : 1 }]}
              onPress={handleContinue}
              disabled={isLoading}
            >
              <Text style={styles.primaryBtnText}>{isLoading ? "Processing..." : "Continue"}</Text>
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
    lineHeight: 26,
    fontSize: 16,
    paddingHorizontal: spacing.md,
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
    marginTop: spacing.md,
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
  textArea: {
    paddingVertical: 12,
    minHeight: 120,
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
