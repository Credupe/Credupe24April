import React from "react";
import { StyleSheet, View, TextInput, Pressable } from "react-native";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { COLORS } from "../constants/colors";
import { THEME } from "../constants/theme";

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onFilterPress?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onFilterPress,
}) => {
  return (
    <View style={styles.container}>
      <Search size={20} color={COLORS.textMuted} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        placeholder="Search loan services..."
        placeholderTextColor={COLORS.textMuted}
        value={value}
        onChangeText={onChangeText}
      />
      <Pressable
        style={({ pressed }) => [
          styles.filterButton,
          pressed && styles.filterButtonPressed,
        ]}
        onPress={onFilterPress}
        accessibilityLabel="filter-button"
        accessibilityRole="button"
      >
        <SlidersHorizontal size={18} color={COLORS.primary} strokeWidth={2} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    height: 54,
    borderRadius: 18,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...THEME.shadowSoft,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
  },
  filterButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonPressed: {
    opacity: 0.8,
    scale: 0.95,
  } as any,
});
