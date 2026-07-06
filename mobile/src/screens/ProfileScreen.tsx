import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CredupeLogo } from "../components/CredupeLogo";
import { ApiUser, clearSession, getCachedUser, logout } from "../api/credupe";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";

interface ProfileScreenProps {
  onSignedOut: () => void;
  onOpenKyc: () => void;
  onOpenNotifications: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onSignedOut, onOpenKyc, onOpenNotifications }) => {
  const { colors, mode, setMode } = useTheme();
  const [user, setUser] = useState<ApiUser | null>(null);

  useEffect(() => {
    getCachedUser().then(setUser);
  }, []);

  const signOut = async () => {
    await clearSession();
    onSignedOut();
    void logout().catch(() => undefined);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <Text style={[typography.h1, { color: colors.text }]}>Profile</Text>

        {/* User card */}
        <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
            <Text style={{ color: colors.primary, fontSize: 28, fontWeight: "800" }}>
              {(user?.email?.[0] ?? "?").toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: "800", fontSize: 17 }}>
              {user?.fullName ?? user?.email?.split("@")[0] ?? "Guest"}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>{user?.email}</Text>
            <View style={[styles.roleBadge, { backgroundColor: colors.primary }]}>
              <Text style={{ color: colors.textInverted, fontWeight: "800", fontSize: 11 }}>{user?.role}</Text>
            </View>
          </View>
        </View>

        {/* Theme picker */}
        <Text style={[typography.micro, { color: colors.textMuted, marginTop: spacing.xxl }]}>ACCOUNT</Text>
        <Pressable
          onPress={onOpenNotifications}
          style={[styles.menuRow, { backgroundColor: colors.card, borderColor: colors.border }]}
          accessibilityLabel="open-notifications-btn"
        >
          <View style={[styles.menuIcon, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
            <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 18 }}>◔</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: "700" }}>Notifications</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              Application updates, lender responses, follow-ups
            </Text>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 22 }}>›</Text>
        </Pressable>
        <Pressable
          onPress={onOpenKyc}
          style={[styles.menuRow, { backgroundColor: colors.card, borderColor: colors.border }]}
          accessibilityLabel="open-kyc-btn"
        >
          <View style={[styles.menuIcon, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
            <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 18 }}>✓</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: "700" }}>KYC &amp; Documents</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              Personal details, identity, income proof
            </Text>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 22 }}>›</Text>
        </Pressable>

        <Text style={[typography.micro, { color: colors.textMuted, marginTop: spacing.xxl }]}>APPEARANCE</Text>
        <View style={[styles.themeRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ThemeOption
            label="Dark · neon"
            sub="Charcoal + lime"
            active={mode === "dark"}
            onPress={() => setMode("dark")}
            swatchBg="#0B0F14"
            swatchAccent="#D8FF85"
          />
          <ThemeOption
            label="Light · violet"
            sub="Paper + purple"
            active={mode === "light"}
            onPress={() => setMode("light")}
            swatchBg="#F7F5FF"
            swatchAccent="#7C3AED"
          />
        </View>

        {/* Brand mark */}
        <View style={{ alignItems: "center", marginTop: spacing.xxl }}>
          <CredupeLogo size={36} layout="stacked" withWordmark />
          <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 4 }}>
            Mobile · v1.0 (phase 1)
          </Text>
        </View>

        {/* Sign out */}
        <Pressable
          onPress={signOut}
          style={[styles.signOut, { borderColor: colors.danger }]}
          accessibilityLabel="sign-out-btn"
        >
          <Text style={{ color: colors.danger, fontWeight: "800" }}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const ThemeOption: React.FC<{
  label: string;
  sub: string;
  active: boolean;
  onPress: () => void;
  swatchBg: string;
  swatchAccent: string;
}> = ({ label, sub, active, onPress, swatchBg, swatchAccent }) => {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.themeOpt,
        {
          borderColor: active ? colors.primary : colors.border,
          backgroundColor: active ? colors.primaryMuted : "transparent",
        },
      ]}
      accessibilityLabel={`theme-${label}`}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: radii.md,
          backgroundColor: swatchBg,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: swatchAccent }} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: "700" }}>{label}</Text>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>{sub}</Text>
      </View>
      {active ? <Text style={{ color: colors.primary, fontWeight: "800" }}>✓</Text> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  userCard: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginTop: spacing.lg,
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.pill,
    marginTop: 6,
  },
  themeRow: {
    flexDirection: "column",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  themeOpt: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  signOut: {
    marginTop: spacing.xxl,
    paddingVertical: 14,
    borderRadius: radii.pill,
    borderWidth: 2,
    alignItems: "center",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
