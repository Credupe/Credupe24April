import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useTheme } from "../theme/ThemeProvider";
import { spacing, radii, typography } from "../theme/colors";
import { User, House, ShieldCheck, FileText, Menu, Link2, DollarSign, LogOut } from "lucide-react-native";

interface CustomDrawerProps {
  state: any;
  navigation: any;
  descriptors: any;
  role: "CUSTOMER" | "PARTNER" | "ADMIN";
  onSignedOut: () => void;
}

export const DrawerContent: React.FC<CustomDrawerProps> = (props) => {
  const { colors, mode, toggle } = useTheme();
  
  const renderIcon = (name: string, focused: boolean) => {
    const iconColor = focused ? colors.textInverted : colors.primary;
    switch (name) {
      case "Console":
      case "Home":
        return <House color={iconColor} size={20} />;
      case "Apps":
      case "Applications":
        return <FileText color={iconColor} size={20} />;
      case "KYC":
        return <ShieldCheck color={iconColor} size={20} />;
      case "Profile":
        return <User color={iconColor} size={20} />;
      case "Utility Tool":
        return <Link2 color={iconColor} size={20} />;
      case "More":
        return <Menu color={iconColor} size={20} />;
      case "Loans":
        return <DollarSign color={iconColor} size={20} />;
      default:
        return <User color={iconColor} size={20} />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <DrawerContentScrollView {...props}>
        <View style={[styles.profileSection, { borderBottomColor: colors.border }]}>
          <View style={styles.profileHeader}>
            <Image 
              source={require("../../assets/logo.png")} 
              style={{ width: 160, height: 50, tintColor: mode === "dark" ? "#FFFFFF" : undefined, marginLeft: -8 }} 
              resizeMode="contain" 
            />
            <Pressable
              onPress={toggle}
              style={[styles.themeChip, { borderColor: colors.border, backgroundColor: colors.bg }]}
              accessibilityLabel="toggle-theme"
            >
              <Text style={{ color: colors.text, fontWeight: "700" }}>{mode === "dark" ? "☾" : "☀"}</Text>
            </Pressable>
          </View>
          <Text style={[typography.h3, { color: colors.text, marginTop: spacing.lg }]}>
            CreduPe {props.role.charAt(0) + props.role.slice(1).toLowerCase()}
          </Text>
          <Text style={[typography.micro, { color: colors.textMuted }]}>
            Manage your account
          </Text>
        </View>

        <View style={styles.menuSection}>
          {props.state.routes.map((route: any, index: number) => {
            const focused = index === props.state.index;
            return (
              <DrawerItem
                key={route.key}
                label={route.name}
                icon={() => renderIcon(route.name, focused)}
                focused={focused}
                activeBackgroundColor={colors.primary}
                inactiveBackgroundColor="transparent"
                activeTintColor={colors.textInverted}
                inactiveTintColor={colors.text}
                labelStyle={[typography.body, { fontWeight: focused ? "700" : "500" }]}
                style={{ borderRadius: radii.md, marginBottom: spacing.sm }}
                onPress={() => props.navigation.navigate(route.name)}
              />
            );
          })}
        </View>
      </DrawerContentScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <DrawerItem
          label="Sign Out"
          icon={() => <LogOut color={colors.danger} size={20} />}
          inactiveTintColor={colors.danger}
          labelStyle={[typography.body, { fontWeight: "700" }]}
          onPress={props.onSignedOut}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
    borderBottomWidth: 1,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  themeChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  menuSection: {
    padding: spacing.md,
  },
  footer: {
    borderTopWidth: 1,
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  }
});
