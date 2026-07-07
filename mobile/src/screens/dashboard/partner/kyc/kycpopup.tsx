import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const logoImage = require("../../../../../assets/logo.png");

type KycPopupProps = {
  onCompleteKyc: () => void;
  onSkip: () => void;
};

const bullets = [
  "Easy and fast payout process",
  "Secure, one-time KYC",
  "Earnings & commission dashboard",
];

export const KycPopup: React.FC<KycPopupProps> = ({ onCompleteKyc, onSkip }) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.backGlowTop} />
      <View style={styles.backGlowBottom} />

      <View style={styles.centerWrap}>
        <View style={styles.card}>
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Complete KYC. Faster Payouts</Text>
        <Text style={styles.subtitle}>
          Start your journey as a verified Channel Partner and unlock Premium Features:
        </Text>

        <View style={styles.illustrationWrap}>
          <View style={styles.illustrationCircle} />
          <View style={styles.illustrationCardLarge} />
          <View style={styles.illustrationCardSmall} />
          <Text style={styles.illustrationIcon}>✓</Text>
        </View>

        <View style={styles.bulletList}>
          {bullets.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <View style={styles.tickCircle}>
                <Text style={styles.tickText}>✓</Text>
              </View>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.primaryButton} onPress={onCompleteKyc}>
          <Text style={styles.primaryButtonText}>Complete KYC Now</Text>
        </Pressable>

        <Pressable style={styles.ghostButton} onPress={onSkip}>
          <Text style={styles.ghostButtonText}>I'll do it later</Text>
        </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D1026CC",
    paddingHorizontal: 18,
    zIndex: 999,
  },
  centerWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  backGlowTop: {
    position: "absolute",
    top: 70,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#FFE07A33",
  },
  backGlowBottom: {
    position: "absolute",
    bottom: 80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#7A5AF833",
  },
  card: {
    width: "100%",
    maxWidth: 430,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 20,
    shadowColor: "#050816",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  logo: {
    width: 126,
    height: 52,
    alignSelf: "center",
    marginBottom: 14,
  },
  title: {
    color: "#111827",
    textAlign: "center",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 14,
    color: "#374151",
    textAlign: "left",
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "500",
  },
  illustrationWrap: {
    marginTop: 18,
    height: 170,
    borderRadius: 18,
    backgroundColor: "#F6F7FF",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationCircle: {
    position: "absolute",
    left: 30,
    top: 26,
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#6B4CF633",
    borderWidth: 1,
    borderColor: "#6B4CF655",
  },
  illustrationCardLarge: {
    position: "absolute",
    width: 158,
    height: 88,
    borderRadius: 14,
    backgroundColor: "#E8EAFD",
    borderWidth: 1,
    borderColor: "#D4D8FC",
  },
  illustrationCardSmall: {
    position: "absolute",
    right: 70,
    top: 52,
    width: 70,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCD3FF",
  },
  illustrationIcon: {
    color: "#2F6CFF",
    fontSize: 42,
    fontWeight: "900",
  },
  bulletList: {
    marginTop: 22,
    gap: 14,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tickCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#86E0A8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "#ECFFF3",
  },
  tickText: {
    color: "#26B05F",
    fontSize: 13,
    fontWeight: "900",
  },
  bulletText: {
    flex: 1,
    color: "#111827",
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "600",
  },
  primaryButton: {
    marginTop: 28,
    borderRadius: 999,
    backgroundColor: "#6B4CF6",
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#6B4CF6",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "900",
    letterSpacing: 0.2,
    textTransform: "capitalize",
  },
  ghostButton: {
    marginTop: 14,
    alignItems: "center",
    paddingVertical: 6,
  },
  ghostButtonText: {
    color: "#A294CC",
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
  },
});
