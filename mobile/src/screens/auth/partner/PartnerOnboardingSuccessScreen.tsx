import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Pressable, StyleSheet, Text, View, Clipboard } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Copy } from "lucide-react-native";
import Toast from "react-native-toast-message";

import { RootStackParamList } from "../../../../App";
import { useTheme } from "../../../theme/ThemeProvider";
import { radii, spacing, typography } from "../../../theme/colors";

const logoImage = require("../../../../assets/logo.png");

type Props = NativeStackScreenProps<RootStackParamList, "PartnerOnboardingSuccess"> & {
  onAuthed: () => void;
};

export const PartnerOnboardingSuccessScreen: React.FC<Props> = ({ navigation, route, onAuthed }) => {
  const { colors } = useTheme();
  const { partnerCode, tempPassword } = route.params || {};

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Toast.show({
      type: "success",
      text1: "Copied!",
      text2: `${label} copied to clipboard`,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />

        <View style={styles.checkWrap}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Welcome aboard!</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Your partner account is ready.</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>YOUR PARTNER CODE</Text>
          <View style={styles.valueRow}>
            <Text style={styles.cardValue}>{partnerCode || "CRD-PA00000"}</Text>
            <Pressable
              onPress={() => copyToClipboard(partnerCode || "CRD-PA00000", "Partner Code")}
              style={styles.copyBtn}
              accessibilityLabel="copy-partner-code"
            >
              <Copy size={20} color={colors.primary} />
            </Pressable>
          </View>
          <Text style={styles.cardHint}>Share this with customers to attribute leads to you.</Text>
        </View>

        {tempPassword ? (
          <View style={styles.passwordCard}>
            <Text style={styles.passwordLabel}>TEMPORARY PASSWORD</Text>
            <View style={styles.valueRow}>
              <Text style={styles.passwordValue}>{tempPassword}</Text>
              <Pressable
                onPress={() => copyToClipboard(tempPassword, "Temporary Password")}
                style={[styles.copyBtn, styles.copyBtnPassword]}
                accessibilityLabel="copy-temp-password"
              >
                <Copy size={20} color="#7C5A00" />
              </Pressable>
            </View>
            <Text style={styles.passwordHint}>Save it now. You can change it from the dashboard.</Text>
          </View>
        ) : null}

        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => onAuthed()}
        >
          <Text style={styles.buttonText}>Open my dashboard</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FCFBFF",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  logo: {
    width: 110,
    height: 68,
  },
  checkWrap: {
    marginTop: spacing.md,
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8FFF0",
  },
  checkIcon: {
    color: "#19B15F",
    fontSize: 38,
    fontWeight: "800",
  },
  title: {
    ...typography.h1,
    marginTop: spacing.lg,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.sm,
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
  },
  card: {
    width: "100%",
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: "#E7EAFB",
    borderRadius: radii.lg,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  cardLabel: {
    color: "#667090",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  cardValue: {
    color: "#111827",
    fontSize: 36,
    fontWeight: "900",
  },
  cardHint: {
    marginTop: spacing.sm,
    color: "#5A647F",
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
  passwordCard: {
    width: "100%",
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: "#F1E5B8",
    borderRadius: radii.lg,
    backgroundColor: "#FFFBEA",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  passwordLabel: {
    color: "#7C5A00",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  passwordValue: {
    color: "#2D2A25",
    fontSize: 34,
    fontWeight: "900",
  },
  passwordHint: {
    marginTop: spacing.sm,
    color: "#574A2B",
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
  button: {
    width: "100%",
    marginTop: spacing.xl,
    borderRadius: radii.pill,
    paddingVertical: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  copyBtn: {
    marginLeft: spacing.md,
    padding: spacing.sm,
    borderRadius: radii.sm,
    backgroundColor: "#F4F5FD",
    alignItems: "center",
    justifyContent: "center",
  },
  copyBtnPassword: {
    backgroundColor: "#FFF9E6",
  },
});
