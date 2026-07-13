import React, { useEffect, useRef } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ShieldCheck,
  Sparkles,
  BadgeCheck,
  CircleCheck,
  ArrowRight,
} from "lucide-react-native";

import { useTheme } from "../../../../theme/ThemeProvider";

const logoImage = require("../../../../../assets/logo.png");

type KycPopupProps = {
  onCompleteKyc: () => void;
  onSkip: () => void;
};

const bullets = [
  "Instant payouts",
  "Secure one-time verification",
  "Higher earning potential",
  "Access to premium features",
];

const FONT_FAMILY = Platform.select({
  ios: "SF Pro Display",
  android: "sans-serif-medium",
  default: "System",
});

export const KycPopup: React.FC<KycPopupProps> = ({ onCompleteKyc, onSkip }) => {
  const { colors } = useTheme();

  // Animation values
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const illustrationOpacity = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  // Staggered benefit row animations
  const benefitAnims = useRef(bullets.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // 1. Overlay backdrop fade in
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    // 2. Card scale & fade in
    Animated.spring(cardScale, {
      toValue: 1,
      friction: 8,
      tension: 45,
      useNativeDriver: true,
    }).start();

    Animated.timing(cardOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // 3. Illustration fade in
    Animated.timing(illustrationOpacity, {
      toValue: 1,
      duration: 350,
      delay: 150,
      useNativeDriver: true,
    }).start();

    // 4. Staggered benefit slide-up & fade-in
    const anims = benefitAnims.map((anim) =>
      Animated.spring(anim, {
        toValue: 1,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      })
    );
    Animated.stagger(80, anims).start();
  }, []);

  const handlePressIn = () => {
    Animated.timing(btnScale, {
      toValue: 0.96,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(btnScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
      <View style={styles.backGlowTop} />
      <View style={styles.backGlowBottom} />

      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale: cardScale }],
            opacity: cardOpacity,
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardScrollContent}
        >

          {/* Heading */}
          <Text style={styles.title}>
            Complete your KYC{"\n"}
            <Text style={{ color: "#7C3AED" }}>Faster Payouts</Text>
          </Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Verify your identity once to unlock instant payouts, higher limits, and exclusive partner benefits.
          </Text>

          {/* Illustration Card */}
          <Animated.View style={[styles.illustrationCard, { opacity: illustrationOpacity }]}>
            <LinearGradient
              colors={["#F5F3FF", "#EDE9FE"]}
              style={styles.illustrationGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.illustrationContent}>
                <View style={styles.iconContainer}>
                  <View style={styles.glowBgCircle} />
                  <ShieldCheck size={72} color="#7C3AED" style={styles.shieldIcon} />
                  <BadgeCheck size={28} color="#10B981" style={styles.checkBadgeIcon} />
                </View>
                <Sparkles size={24} color="#A78BFA" style={styles.sparkleIconLeft} />
                <Sparkles size={20} color="#FDBA74" style={styles.sparkleIconRight} />
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Benefits Section */}
          <View style={styles.benefitsContainer}>
            {bullets.map((item, index) => {
              const translateY = benefitAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [15, 0],
              });
              const opacity = benefitAnims[index];

              return (
                <Animated.View
                  key={item}
                  style={[
                    styles.benefitCard,
                    {
                      opacity,
                      transform: [{ translateY }],
                    },
                  ]}
                >
                  <View style={styles.checkCircleIconWrap}>
                    <CircleCheck size={20} color="#10B981" />
                  </View>
                  <Text style={styles.benefitText}>{item}</Text>
                </Animated.View>
              );
            })}
          </View>

          {/* Primary Button */}
          <Pressable
            onPress={onCompleteKyc}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.primaryButtonPressable}
          >
            <Animated.View style={{ transform: [{ scale: btnScale }], width: "100%" }}>
              <LinearGradient
                colors={["#8B5CF6", "#6D28D9"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryButtonText}>Complete KYC</Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>
          </Pressable>

          {/* Skip Button */}
          <Pressable style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </Pressable>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(13, 16, 38, 0.78)",
    zIndex: 999,
  },
  backGlowTop: {
    position: "absolute",
    top: 50,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255, 224, 122, 0.15)",
  },
  backGlowBottom: {
    position: "absolute",
    bottom: 50,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(122, 90, 248, 0.15)",
  },
  card: {
    width: "92%",
    maxWidth: 400,
    maxHeight: "80%",
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    overflow: "hidden",
  },
  cardScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: "stretch",
  },
  logo: {
    width: 40,
    height: 40,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    color: "#111827",
    textAlign: "center",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    fontFamily: FONT_FAMILY,
  },
  subtitle: {
    marginTop: 12,
    color: "#6B7280",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
    fontFamily: FONT_FAMILY,
  },
  // Illustration styles
  illustrationCard: {
    marginTop: 24,
    height: 140,
    borderRadius: 20,
    overflow: "hidden",
  },
  illustrationGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationContent: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    position: "relative",
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  glowBgCircle: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(124, 58, 237, 0.12)",
  },
  shieldIcon: {
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  checkBadgeIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
  },
  sparkleIconLeft: {
    position: "absolute",
    left: "20%",
    top: "25%",
  },
  sparkleIconRight: {
    position: "absolute",
    right: "20%",
    bottom: "25%",
  },
  // Benefits styles
  benefitsContainer: {
    marginTop: 20,
    gap: 10,
  },
  benefitCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  checkCircleIconWrap: {
    marginRight: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
    fontFamily: FONT_FAMILY,
  },
  // Button styles
  primaryButtonPressable: {
    marginTop: 28,
    width: "100%",
    borderRadius: 30,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonGradient: {
    height: 58,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.5,
    marginRight: 8,
  },
  skipButton: {
    marginTop: 20,
    marginBottom: 8,
    alignItems: "center",
    paddingVertical: 8,
  },
  skipButtonText: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "500",
    fontFamily: FONT_FAMILY,
  },
});
