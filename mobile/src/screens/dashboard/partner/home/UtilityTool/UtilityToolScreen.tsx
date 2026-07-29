import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  Share,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Image
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Search, Copy, Share2, Bell, Link2 } from "lucide-react-native";

import { apiFetch } from "../../../../../api/credupe";
import { COLORS } from "../constants/colors";
import { THEME } from "../constants/theme";

interface UtilityLinkItem {
  id: string;
  title: string;
  slug: string;
  productName: string;
}

const UTILITIES_DATA: UtilityLinkItem[] = [
  // {
  //   id: "credit-card",
  //   title: "Credit Card Lead Form UTM Link",
  //   slug: "credit-card",
  //   productName: "Credit Card",
  // },
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
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      {/* Redesigned Premium Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerWelcome}>Welcome</Text>
            <Text style={styles.headerCompanyName}>Credupe Techfin Pvt Ltd</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.logoCircle}>
              <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
            </View>
            <Pressable
              onPress={() => navigation.navigate("Notifications" as any)}
              style={styles.bellPressable}
            >
              <Bell size={22} color="#6B7280" strokeWidth={2} />
              <View style={styles.badge} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Premium Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            placeholder="Search Utility"
            placeholderTextColor="#6B7280"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="search-utility-tools"
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredItems.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Link2 size={20} color="#7C3AED" />
                </View>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>{item.productName} Lead Form</Text>
                  <Text style={styles.cardSubtitle}>Generate and share your lead form instantly.</Text>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.buttonRow}>
                {/* Copy Button */}
                <Pressable
                  onPress={() => handleCopy(item)}
                  style={({ pressed }) => [
                    styles.copyButton,
                    { transform: [{ scale: pressed ? 0.96 : 1 }] }
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`copy-utm-${item.id}`}
                >
                  <Copy size={16} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.copyText}>Copy</Text>
                </Pressable>

                {/* Share Button */}
                <Pressable
                  onPress={() => handleShare(item)}
                  style={({ pressed }) => [
                    styles.shareButton,
                    { transform: [{ scale: pressed ? 0.96 : 1 }] }
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`share-utm-${item.id}`}
                >
                  <Share2 size={16} color="#7C3AED" style={styles.buttonIcon} />
                  <Text style={styles.shareText}>Share</Text>
                </Pressable>
              </View>
            </View>
          ))}

          {filteredItems.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No matching utility links found</Text>
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
    backgroundColor: "#F8F9FC",
  },
  headerContainer: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
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
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "400",
    marginBottom: 4,
  },
  headerCompanyName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    backgroundColor: "#EF4444",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500",
    paddingVertical: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
    paddingTop: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "400",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  copyButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7C3AED",
    borderRadius: 14,
    height: 48,
    gap: 6,
  },
  copyText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#7C3AED",
    borderRadius: 14,
    height: 48,
    gap: 6,
  },
  shareText: {
    color: "#7C3AED",
    fontSize: 15,
    fontWeight: "500",
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
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
  },
});
