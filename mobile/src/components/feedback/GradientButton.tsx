import React, { useRef } from "react";
import { StyleSheet, Text, Pressable, Animated, ActivityIndicator, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GradientButtonProps {
  onPress: () => void;
  disabled: boolean;
  loading: boolean;
  title: string;
}

const FONT_FAMILY = Platform.select({
  ios: "SF Pro Display",
  android: "sans-serif-medium",
  default: "System",
});

export const GradientButton: React.FC<GradientButtonProps> = ({
  onPress,
  disabled,
  loading,
  title,
}) => {
  const btnScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.timing(btnScale, {
      toValue: 0.96,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(btnScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  const colors: readonly [string, string, ...string[]] = disabled
    ? ["#E5E7EB", "#D1D5DB"] // Elegant gray gradient when disabled
    : ["#8B5CF6", "#6C2BD9"]; // Rich premium purple gradient when enabled

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={styles.pressable}
    >
      <Animated.View style={[styles.animatedContainer, { transform: [{ scale: btnScale }] }]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={[styles.text, disabled && styles.textDisabled]}>
              {title}
            </Text>
          )}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
    borderRadius: 16,
    shadowColor: "#6C2BD9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  animatedContainer: {
    width: "100%",
  },
  gradient: {
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    fontFamily: FONT_FAMILY,
  },
  textDisabled: {
    color: "#9CA3AF",
  },
});
