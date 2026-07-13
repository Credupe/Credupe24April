import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

interface Props {
  onPress?: () => void;
  badgeCount?: number;
}

export const NotificationBell: React.FC<Props> = React.memo(({ onPress, badgeCount = 1 }) => {
  return (
    <Pressable style={styles.container} onPress={onPress} accessibilityLabel="notification-bell">
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.text} />
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
    padding: 6,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: 1,
    top: 1,
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
