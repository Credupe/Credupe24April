import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Image, useColorScheme, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import { Pencil, Bell, ShieldCheck, FileBadge, Sun, Moon, Monitor, LogOut, ChevronRight } from "lucide-react-native";

import { ApiUser, clearSession, getCachedUser, logout, fetchMyDocuments, MyDocument } from "../api/credupe";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";

const logoImage = require("../../assets/logo.png");

const FONT_FAMILY = Platform.select({
  ios: "System",
  android: "sans-serif",
  default: "System",
});

const FONT_FAMILY_BOLD = Platform.select({
  ios: "System",
  android: "sans-serif-medium",
  default: "System",
});

interface ProfileScreenProps {
  onSignedOut: () => void;
  onOpenKyc: () => void;
  onOpenNotifications: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onSignedOut, onOpenKyc, onOpenNotifications }) => {
  const { colors, mode, setMode } = useTheme();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "system">(() => {
    return mode;
  });
  const systemColorScheme = useColorScheme();

  const [docs, setDocs] = useState<MyDocument[]>([]);

  useEffect(() => {
    getCachedUser().then(setUser);
    fetchMyDocuments()
      .then((r) => {
        if (r.success && r.data?.items) {
          setDocs(r.data.items);
        }
      })
      .catch(() => undefined);
  }, []);

  const kycStatusInfo = (() => {
    if (docs.length === 0) {
      return {
        text: "Verify your identity",
        color: colors.textMuted,
      };
    }

    const anyPending = docs.some((d) => d.status === "UPLOADED");
    if (anyPending) {
      return {
        text: "Verification pending",
        color: colors.warning,
      };
    }

    const anyRejected = docs.some((d) => d.status === "REJECTED");
    if (anyRejected) {
      return {
        text: "Some documents rejected. Kindly reupload.",
        color: colors.danger,
      };
    }

    const allVerified = docs.every((d) => d.status === "VERIFIED");
    if (allVerified) {
      return {
        text: "Documents verified",
        color: colors.success,
      };
    }

    return {
      text: "Verify your identity",
      color: colors.textMuted,
    };
  })();

  const signOut = async () => {
    await clearSession();
    onSignedOut();
    void logout().catch(() => undefined);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: mode === "light" ? "#F8F9FC" : colors.bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        {/* Premium Header */}
        <View style={styles.header}>
          <View style={styles.headerTextRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>Manage your account settings</Text>
            </View>
            <Image
              source={logoImage}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Circular avatar with gradient */}
          <LinearGradient
            colors={["#7C3AED", "#A855F7"]}
            style={styles.avatarGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.avatarText}>
              {(user?.email?.[0] ?? "?").toUpperCase()}
            </Text>
          </LinearGradient>

          <View style={styles.profileDetails}>
            <Text style={[styles.username, { color: colors.text }]}>
              {user?.fullName ?? user?.email?.split("@")[0] ?? "Guest"}
            </Text>
            <Text style={[styles.email, { color: colors.textMuted }]}>{user?.email}</Text>

            {/* Role Badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {user?.role === "PARTNER" ? "PARTNER" : String(user?.role || "GUEST").toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Edit Button in top right */}
          <Pressable
            style={({ pressed }) => [
              styles.editButton,
              { transform: [{ scale: pressed ? 0.9 : 1 }] }
            ]}
            onPress={() => {
              Toast.show({
                type: "info",
                text1: "Edit Profile",
                text2: "Edit functionality is under development."
              });
            }}
          >
            <Pencil size={14} color="#6B7280" />
          </Pressable>
        </View>

        {/* Account / Settings items */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ACCOUNT</Text>
        <View style={styles.settingsGroup}>
          <Pressable
            onPress={onOpenNotifications}
            style={({ pressed }) => [
              styles.settingsCard,
              { backgroundColor: colors.card, borderColor: colors.border, transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
            accessibilityLabel="open-notifications-btn"
          >
            <View style={styles.settingsIconWrapper}>
              <ShieldCheck size={20} color="#7C3AED" />
            </View>
            <View style={styles.settingsTextWrapper}>
              <Text style={[styles.settingsTitle, { color: colors.text }]}>Notifications</Text>
              <Text style={[styles.settingsSubtitle, { color: colors.textMuted }]}>
                Application updates and alerts
              </Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </Pressable>

          <Pressable
            onPress={onOpenKyc}
            style={({ pressed }) => [
              styles.settingsCard,
              { backgroundColor: colors.card, borderColor: colors.border, transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
            accessibilityLabel="open-kyc-btn"
          >
            <View style={styles.settingsIconWrapper}>
              <FileBadge size={20} color="#7C3AED" />
            </View>
            <View style={styles.settingsTextWrapper}>
              <Text style={[styles.settingsTitle, { color: colors.text }]}>KYC &amp; Documents</Text>
              <Text style={[styles.settingsSubtitle, { color: kycStatusInfo.color, fontWeight: "600" }]}>
                {kycStatusInfo.text}
              </Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Appearance Row */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>APPEARANCE</Text>
        <View style={styles.themeRow}>
          {/* Light Mode Card */}
          <Pressable
            onPress={() => {
              setSelectedTheme("light");
              setMode("light");
            }}
            style={({ pressed }) => [
              styles.themeCard,
              selectedTheme === "light" && styles.themeCardActive,
              {
                backgroundColor: colors.card,
                borderColor: selectedTheme === "light" ? "#7C3AED" : colors.border,
                transform: [{ scale: pressed ? 0.96 : 1 }]
              }
            ]}
          >
            <View style={styles.themeCardHeader}>
              <Sun size={18} color={selectedTheme === "light" ? "#7C3AED" : "#6B7280"} />
              <Text style={[styles.themeCardTitle, { color: colors.text }]}>Light</Text>
            </View>

            {/* Light preview grid */}
            <View style={styles.previewContainerLight}>
              <View style={styles.previewBarLight} />
              <View style={styles.previewBtnLight} />
            </View>

            {selectedTheme === "light" && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </Pressable>

          {/* Dark Mode Card */}
          <Pressable
            onPress={() => {
              setSelectedTheme("dark");
              setMode("dark");
            }}
            style={({ pressed }) => [
              styles.themeCard,
              selectedTheme === "dark" && styles.themeCardActive,
              {
                backgroundColor: colors.card,
                borderColor: selectedTheme === "dark" ? "#7C3AED" : colors.border,
                transform: [{ scale: pressed ? 0.96 : 1 }]
              }
            ]}
          >
            <View style={styles.themeCardHeader}>
              <Moon size={18} color={selectedTheme === "dark" ? "#7C3AED" : "#6B7280"} />
              <Text style={[styles.themeCardTitle, { color: colors.text }]}>Dark</Text>
            </View>

            {/* Dark preview grid */}
            <View style={styles.previewContainerDark}>
              <View style={styles.previewBarDark} />
              <View style={styles.previewBtnDark} />
            </View>

            {selectedTheme === "dark" && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </Pressable>

          {/* System Mode Card */}
          <Pressable
            onPress={() => {
              setSelectedTheme("system");
              if (systemColorScheme === "light" || systemColorScheme === "dark") {
                setMode(systemColorScheme);
              }
            }}
            style={({ pressed }) => [
              styles.themeCard,
              selectedTheme === "system" && styles.themeCardActive,
              {
                backgroundColor: colors.card,
                borderColor: selectedTheme === "system" ? "#7C3AED" : colors.border,
                transform: [{ scale: pressed ? 0.96 : 1 }]
              }
            ]}
          >
            <View style={styles.themeCardHeader}>
              <Monitor size={18} color={selectedTheme === "system" ? "#7C3AED" : "#6B7280"} />
              <Text style={[styles.themeCardTitle, { color: colors.text }]}>System</Text>
            </View>

            {/* System preview grid */}
            <View style={styles.previewContainerSystem}>
              <View style={styles.previewBarSystem} />
              <View style={styles.previewBtnSystem} />
            </View>

            {selectedTheme === "system" && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Sign out */}
        <Pressable
          onPress={signOut}
          style={({ pressed }) => [
            styles.signOutPressable,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              transform: [{ scale: pressed ? 0.98 : 1 }]
            }
          ]}
          accessibilityLabel="sign-out-btn"
        >
          <LogOut size={18} color="#EF4444" style={styles.signOutIcon} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

        {/* Brand mark & Version */}
        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            CreduPe · Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 4,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerLogo: {
    width: 110,
    height: 44,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
    fontFamily: FONT_FAMILY_BOLD,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
    fontFamily: FONT_FAMILY,
  },
  profileCard: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    marginTop: 16,
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 4,
  },
  avatarGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    fontFamily: FONT_FAMILY_BOLD,
  },
  profileDetails: {
    flex: 1,
    marginLeft: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: FONT_FAMILY_BOLD,
  },
  email: {
    fontSize: 14,
    marginTop: 2,
    fontFamily: FONT_FAMILY,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 6,
    backgroundColor: "#7C3AED",
  },
  badgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 10,
    fontFamily: FONT_FAMILY_BOLD,
  },
  editButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    marginTop: 28,
    marginBottom: 12,
    paddingHorizontal: 4,
    fontFamily: FONT_FAMILY_BOLD,
  },
  settingsGroup: {
    gap: 12,
  },
  settingsCard: {
    flexDirection: "row",
    alignItems: "center",
    height: 72,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  settingsIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsTextWrapper: {
    flex: 1,
    marginLeft: 14,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FONT_FAMILY_BOLD,
  },
  settingsSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: FONT_FAMILY,
  },
  themeRow: {
    flexDirection: "row",
    gap: 10,
  },
  themeCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  themeCardActive: {
    backgroundColor: "#EDE9FE",
  },
  themeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  themeCardTitle: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: FONT_FAMILY_BOLD,
  },
  checkmark: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "800",
    fontFamily: FONT_FAMILY_BOLD,
  },
  
  // Theme previews
  previewContainerLight: {
    width: "100%",
    height: 36,
    backgroundColor: "#F7F5FF",
    borderRadius: 6,
    padding: 5,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E3F0",
  },
  previewBarLight: {
    height: 4,
    backgroundColor: "#E5E3F0",
    borderRadius: 2,
    width: "60%",
  },
  previewBtnLight: {
    height: 10,
    backgroundColor: "#7C3AED",
    borderRadius: 3,
    width: "100%",
  },
  
  previewContainerDark: {
    width: "100%",
    height: 36,
    backgroundColor: "#0B0F14",
    borderRadius: 6,
    padding: 5,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#232A33",
  },
  previewBarDark: {
    height: 4,
    backgroundColor: "#232A33",
    borderRadius: 2,
    width: "60%",
  },
  previewBtnDark: {
    height: 10,
    backgroundColor: "#D8FF85",
    borderRadius: 3,
    width: "100%",
  },

  previewContainerSystem: {
    width: "100%",
    height: 36,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    padding: 5,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  previewBarSystem: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    width: "60%",
  },
  previewBtnSystem: {
    height: 10,
    backgroundColor: "#9CA3AF",
    borderRadius: 3,
    width: "100%",
  },

  // Footer branding
  footerContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: FONT_FAMILY,
  },

  // Sign out button
  signOutPressable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 32,
    gap: 8,
  },
  signOutText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: FONT_FAMILY_BOLD,
  },
  signOutIcon: {
    marginRight: 4,
  },
});
