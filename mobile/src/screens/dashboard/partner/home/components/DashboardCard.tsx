import React from "react";
import { StyleSheet, Text, View, Pressable, Platform } from "react-native";
import { MaterialCommunityIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { DIMENSIONS } from "../constants/dimensions";
import { THEME } from "../constants/theme";

interface Props {
  title: string;
  iconName: string;
  iconType?: "MaterialCommunityIcons" | "FontAwesome" | "Ionicons";
  onPress?: () => void;
}

export const DashboardCard: React.FC<Props> = React.memo(({
  title,
  iconName,
  iconType = "MaterialCommunityIcons",
  onPress,
}) => {
  const renderIcon = () => {
    switch (iconType) {
      case "FontAwesome":
        return <FontAwesome name={iconName as any} size={24} color={COLORS.primary} />;
      case "Ionicons":
        return <Ionicons name={iconName as any} size={24} color={COLORS.primary} />;
      case "MaterialCommunityIcons":
      default:
        return <MaterialCommunityIcons name={iconName as any} size={24} color={COLORS.primary} />;
    }
  };

  return (
    <View style={styles.cardOuter}>
      <Pressable
        onPress={onPress}
        style={styles.cardInner}
        android_ripple={{ color: COLORS.primaryLight, borderless: false }}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <View style={styles.iconContainer}>
          {renderIcon()}
        </View>
        <Text style={THEME.typography.cardTitle} numberOfLines={2}>
          {title}
        </Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  cardOuter: {
    width: "32%",
    aspectRatio: 0.88,
    padding: 4,
  },
  cardInner: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...THEME.shadowSoft,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.greyLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
});
