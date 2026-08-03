import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Share,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Image,
  Pressable
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Search, Copy, Share2, Bell, Link2 } from "lucide-react-native";

import { apiFetch } from "../../../../../api/credupe";
import { useTheme } from "../../../../../theme/ThemeProvider";
import { Text } from "../../../../../components/ui/Text";
import { Button } from "../../../../../components/ui/Button";
import { Card } from "../../../../../components/ui/Card";
import { Input } from "../../../../../components/ui/Input";

interface UtilityLinkItem {
  id: string;
  title: string;
  slug: string;
  productName: string;
}

const UTILITIES_DATA: UtilityLinkItem[] = [
  {
    id: "personal-loan",
    title: "Personal Loan Lead Form UTM Link",
    slug: "personal-loan",
    productName: "Personal Loan",
  },
  {
    id: "education-loan",
    title: "Education Loan Lead Form UTM Link",
    slug: "education-loan",
    productName: "Education Loan",
  },
];

export const UtilityToolScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [partnerCode, setPartnerCode] = useState("CRD-PA00000");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  // Fetch partner profile on mount to get the actual partner code
  useEffect(() => {
    const fetchPartnerCode = async () => {
      try {
        const res = await apiFetch<{ profile: { partnerCode: string } | null }>("/partners/me");
        if (res.success && res.data?.profile?.partnerCode) {
          setPartnerCode(res.data.profile.partnerCode);
        }
      } catch (e) {
        console.warn("Could not fetch partner profile, using default:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPartnerCode();
  }, []);

  const getUtmLink = (slug: string) => {
    return `https://credupe.com/mobile-utility-tool/${slug}?partner=${partnerCode}`;
  };

  const handleCopy = async (item: UtilityLinkItem) => {
    const utmLink = getUtmLink(item.slug);
    try {
      let success = false;
      if (Platform.OS === "web") {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(utmLink);
          success = true;
        }
      } else {
        try {
          const NativeClipboard = require("react-native").Clipboard;
          if (NativeClipboard && typeof NativeClipboard.setString === "function") {
            NativeClipboard.setString(utmLink);
            success = true;
          }
        } catch (e) {
          // Native module not found
        }
      }

      if (success) {
        Toast.show({
          type: "success",
          text1: "UTM Copied!",
          text2: `${item.productName} UTM copied to clipboard.`,
        });
      } else {
        // Fallback to share
        await Share.share({
          message: `Apply for ${item.productName} here: ${utmLink}`,
          title: `Share UTM Link`,
        });
      }
    } catch (err) {
      console.error("Failed to copy/share UTM link:", err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to copy or share the UTM link.",
      });
    }
  };

  const handleShare = async (item: UtilityLinkItem) => {
    const utmLink = getUtmLink(item.slug);
    try {
      await Share.share({
        message: `Apply for ${item.productName} here: ${utmLink}`,
        title: `Share UTM Link`,
      });
    } catch (err) {
      console.error("Failed to share UTM link:", err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to share the UTM link.",
      });
    }
  };

  const filteredItems = UTILITIES_DATA.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const logoImage = require("../../../../../../assets/logo.png");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["left", "right"]}>
      {/* Redesigned Premium Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 16, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text variant="caption" muted style={styles.headerWelcome}>Welcome</Text>
            <Text variant="h2" color={colors.text}>Credupe Techfin Pvt Ltd</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.logoCircle, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
            </View>
            <Pressable
              onPress={() => navigation.navigate("Notifications" as any)}
              style={[styles.bellPressable, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Bell size={22} color={colors.textMuted} strokeWidth={2} />
              <View style={[styles.badge, { backgroundColor: colors.danger }]} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Premium Search Bar */}
      <View style={styles.searchContainer}>
        <Input 
          placeholder="Search Utility"
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={<Search size={18} color={colors.textMuted} />}
          accessibilityLabel="search-utility-tools"
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredItems.map((item) => (
            <Card key={item.id} elevated>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconContainer, { backgroundColor: colors.primaryMuted }]}>
                  <Link2 size={20} color={colors.primary} />
                </View>
                <View style={styles.cardTitleContainer}>
                  <Text variant="body" bold>{item.productName} Lead Form</Text>
                  <Text variant="caption" muted>Generate and share your lead form instantly.</Text>
                </View>
              </View>

              <View style={[styles.separator, { backgroundColor: colors.border }]} />

              <View style={styles.buttonRow}>
                {/* Copy Button */}
                <Button 
                  style={styles.flex1}
                  variant="primary"
                  title="Copy"
                  icon={<Copy size={16} color={colors.textInverted} style={styles.buttonIcon} />}
                  onPress={() => handleCopy(item)}
                  accessibilityLabel={`copy-utm-${item.id}`}
                />

                {/* Share Button */}
                <Button 
                  style={styles.flex1}
                  variant="outline"
                  title="Share"
                  icon={<Share2 size={16} color={colors.primary} style={styles.buttonIcon} />}
                  onPress={() => handleShare(item)}
                  accessibilityLabel={`share-utm-${item.id}`}
                />
              </View>
            </Card>
          ))}

          {filteredItems.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text variant="body" muted>No matching utility links found</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
  },
  headerWelcome: {
    marginBottom: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  bellPressable: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
    paddingTop: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitleContainer: {
    flex: 1,
  },
  separator: {
    height: 1,
    marginVertical: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  buttonIcon: {
    marginRight: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
});
