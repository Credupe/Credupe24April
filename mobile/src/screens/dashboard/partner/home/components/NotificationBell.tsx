import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Bell } from "lucide-react-native";
import { COLORS } from "../constants/colors";

interface Props {
  onPress?: () => void;
  badgeCount?: number;
}

export const NotificationBell: React.FC<Props> = React.memo(({ onPress, badgeCount = 1 }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={onPress}
      accessibilityLabel="notification-bell"
      accessibilityRole="button"
    >
      <View style={styles.iconWrapper}>
        <Bell size={22} color={COLORS.text} strokeWidth={2} />
        {badgeCount > 0 && (
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
          </View>
        )}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  pressed: {
    opacity: 0.8,
    scale: 0.96,
  } as any,
  iconWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: -2,
    top: -2,
    backgroundColor: COLORS.redBadge,
    width: 8,
    height: 8,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.white,
  },
});
