import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { radii, spacing } from "../../theme/colors";

interface SignupOptionCardProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const SignupOptionCard: React.FC<SignupOptionCardProps> = ({ label, selected, onPress }) => {
  const { colors } = useTheme();
  const optionMeta = getOptionMeta(label);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: colors.card,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <View style={[styles.iconWrap, { backgroundColor: "#EEF0FF" }]}>
        <Text style={[styles.iconGlyph, { color: colors.primary }]}>{optionMeta.icon}</Text>
      </View>

      <View style={styles.textWrap}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>{optionMeta.description}</Text>
      </View>

      <View
        style={[
          styles.trailing,
          {
            borderColor: selected ? colors.primary : colors.border,
            backgroundColor: selected ? colors.primary : colors.card,
          },
        ]}
      >
        <Text style={[styles.trailingGlyph, { color: selected ? colors.textInverted : colors.textMuted }]}>
          {selected ? "✓" : "›"}
        </Text>
      </View>
    </Pressable>
  );
};

const getOptionMeta = (label: string): { description: string; icon: string } => {
  if (label === "Proprietor Proprietorship") {
    return { description: "Owned and run by one person.", icon: "⌂" };
  }
  if (label === "Individual") {
    return { description: "For individuals applying in their own name.", icon: "◦" };
  }
  if (label === "Partnership") {
    return { description: "Owned by two or more partners.", icon: "◎" };
  }
  return { description: "Private limited company registered under MCA.", icon: "▦" };
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderWidth: 1.5,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlyph: {
    fontSize: 20,
    fontWeight: "800",
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  trailing: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  trailingGlyph: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 20,
  },
});
