import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useTheme } from "../../theme/ThemeProvider";
import { Menu, Bell } from "lucide-react-native";
import { spacing } from "../../theme/colors";

interface HeaderProps {
  title: string;
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, transparent = false }) => {
  const { colors } = useTheme();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: transparent ? "transparent" : colors.bg,
          borderBottomWidth: transparent ? 0 : 1,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Pressable onPress={() => navigation.toggleDrawer()} style={styles.iconButton}>
        <Menu color={colors.text} size={24} />
      </Pressable>
      
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      
      <Pressable style={styles.iconButton}>
        <Bell color={colors.text} size={24} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    height: 56,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  iconButton: {
    padding: spacing.sm,
  },
});
