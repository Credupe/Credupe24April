import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.content}>
        {/* Left Side */}
        <View style={styles.leftSection}>
          <Text style={THEME.typography.headerSubtitle}>Welcome</Text>
          <Text style={THEME.typography.headerTitle}>Credupe Techfin Pvt Ltd</Text>
        </View>


        {/* Center/Right Logo */}
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Far Right Notification Bell */}
        <NotificationBell onPress={onNotificationPress} badgeCount={badgeCount} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingBottom: 12,
    paddingHorizontal: 16,
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
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
  },
  logo: {
    width: 80,
    height: 45,
  },
});
