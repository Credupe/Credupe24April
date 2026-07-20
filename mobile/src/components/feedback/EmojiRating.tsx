import React, { useRef } from "react";
import { View, StyleSheet, Text, Pressable, Animated, Platform } from "react-native";

export interface EmojiOption {
  rating: number;
  emoji: string;
  label: string;
}

export const EMOJI_OPTIONS: EmojiOption[] = [
  { rating: 1, emoji: "😣", label: "Very Bad" },
  { rating: 2, emoji: "🙁", label: "Bad" },
  { rating: 3, emoji: "😐", label: "Neutral" },
  { rating: 4, emoji: "😊", label: "Good" },
  { rating: 5, emoji: "😍", label: "Excellent" },
];

interface EmojiRatingProps {
  selectedRating: number | null;
  onSelectRating: (rating: number) => void;
}

const FONT_FAMILY = Platform.select({
  ios: "SF Pro Display",
  android: "sans-serif-medium",
  default: "System",
});

export const EmojiRating: React.FC<EmojiRatingProps> = ({ selectedRating, onSelectRating }) => {
  return (
    <View style={styles.container}>
      {EMOJI_OPTIONS.map((option) => {
        const isSelected = selectedRating === option.rating;
        return (
          <EmojiItem
            key={option.rating}
            option={option}
            isSelected={isSelected}
            onPress={() => onSelectRating(option.rating)}
          />
        );
      })}
    </View>
  );
};

const EmojiItem: React.FC<{
  option: EmojiOption;
  isSelected: boolean;
  onPress: () => void;
}> = ({ option, isSelected, onPress }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: isSelected ? 1.2 : 1.0,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  return (
    <Pressable onPress={onPress} style={styles.itemContainer}>
      <Animated.View
        style={[
          styles.circle,
          isSelected && styles.circleSelected,
          { transform: [{ scale: scaleValue }] },
        ]}
      >
        <Text style={styles.emojiText}>{option.emoji}</Text>
      </Animated.View>
      <Text style={[styles.labelText, isSelected && styles.labelTextSelected]}>
        {option.label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
  },
  itemContainer: {
    alignItems: "center",
    flex: 1,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3E8FF", // Soft lavender background matching design
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  circleSelected: {
    backgroundColor: "#6C2BD9", // Selected background is primary purple
    shadowColor: "#6C2BD9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  emojiText: {
    fontSize: 24,
    lineHeight: 28,
  },
  labelText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
    fontFamily: FONT_FAMILY,
  },
  labelTextSelected: {
    color: "#6C2BD9",
    fontWeight: "700",
  },
});
