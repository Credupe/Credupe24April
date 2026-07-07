import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../../../App";
import { useTheme } from "../../../theme/ThemeProvider";
import { radii, spacing, typography } from "../../../theme/colors";

const logoImage = require("../../../../assets/logo.png");

type Props = NativeStackScreenProps<RootStackParamList, "PartnerOnboardingSuccess">;

export const PartnerOnboardingSuccessScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

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
          <Text style={styles.cardValue}>CRD - PA0003</Text>
          <Text style={styles.cardHint}>Share this with customers to attribute leads to you.</Text>
        </View>

        <View style={styles.passwordCard}>
          <Text style={styles.passwordLabel}>TEMPORARY PASSWORD</Text>
          <Text style={styles.passwordValue}>u4ubr18w</Text>
          <Text style={styles.passwordHint}>Save it now. You can change it from the dashboard.</Text>
        </View>

        <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => navigation.replace("PartnerHomeDirect")}>
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
    marginTop: spacing.sm,
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
    marginTop: spacing.sm,
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
});
