import React, { useRef } from "react";
import { StyleSheet, Text, View, Pressable, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Wallet, CreditCard, GraduationCap, ChevronRight } from "lucide-react-native";
import { COLORS } from "../constants/colors";
import { DIMENSIONS } from "../constants/dimensions";
import { THEME } from "../constants/theme";

interface Props {
  title: string;
  description: string;
  iconName: "Wallet" | "CreditCard" | "GraduationCap";
  onPress?: () => void;
}

export const DashboardCard: React.FC<Props> = React.memo(({
  title,
  description,
  iconName,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();
  };

  const renderIcon = () => {
    const iconProps = { size: 24, color: COLORS.white, strokeWidth: 2 };
    switch (iconName) {
      case "Wallet":
        return <Wallet {...iconProps} />;
      case "CreditCard":
        return <CreditCard {...iconProps} />;
      case "GraduationCap":
        return <GraduationCap {...iconProps} />;
    }
  };

  return (
    <Animated.View style={[styles.cardOuter, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.cardInner}
        android_ripple={{ color: "rgba(124, 58, 237, 0.08)", borderless: false }}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <View style={styles.cardHeader}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            {renderIcon()}
          </LinearGradient>
          <ChevronRight size={18} color={COLORS.textMuted} strokeWidth={2.5} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  cardOuter: {
    width: DIMENSIONS.cardWidth,
    height: 150,
    marginBottom: 16,
  },
  cardInner: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 20,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginTop: 8,
  },
  title: {
    ...THEME.typography.cardTitle,
    marginBottom: 4,
  },
  description: {
    ...THEME.typography.subtitle,
    fontSize: 12,
  },
});
