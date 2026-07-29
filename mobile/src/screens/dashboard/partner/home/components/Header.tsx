import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Building2 } from "lucide-react-native";
import { NotificationBell } from "./NotificationBell";
import { COLORS } from "../constants/colors";
import { THEME } from "../constants/theme";

interface Props {
  onNotificationPress?: () => void;
  badgeCount?: number;
}

const logoImage = require("../../../../../../assets/logo.png");

export const Header: React.FC<Props> = React.memo(({ onNotificationPress, badgeCount = 1 }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.content}>
        {/* Left Side */}
        <View style={styles.leftSection}>
          <View style={styles.companyRow}>
            <Building2 size={20} color={COLORS.primary} style={styles.companyIcon} />
            <Text style={styles.companyName} numberOfLines={1}>
              Credupe Techfin Pvt Ltd
            </Text>
          </View>
          <View style={styles.badgeContainer}>
            <Text style={styles.dashboardBadge}>Partner Dashboard</Text>
          </View>
        </View>

        {/* Right Side */}
        <View style={styles.rightSection}>
          <View style={styles.logoCard}>
            <Image source={logoImage} style={styles.logo} resizeMode="contain" />
          </View>
          <NotificationBell onPress={onNotificationPress} badgeCount={badgeCount} />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...THEME.shadowSoft,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 8,
  },
  greeting: {
    ...THEME.typography.greeting,
    marginBottom: 4,
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  companyIcon: {
    marginRight: 6,
  },
  companyName: {
    ...THEME.typography.companyName,
    flex: 1,
  },
  badgeContainer: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dashboardBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoCard: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
  },
  logo: {
    width: 32,
    height: 32,
  },
});
