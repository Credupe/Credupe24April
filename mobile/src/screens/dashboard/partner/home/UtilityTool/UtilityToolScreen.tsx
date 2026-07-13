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
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import { apiFetch } from "../../../../../api/credupe";
import { Header } from "../components/Header";
import { COLORS } from "../constants/colors";
import { THEME } from "../constants/theme";

interface UtilityLinkItem {
  id: string;
  title: string;
  slug: string;
  productName: string;
}

const UTILITIES_DATA: UtilityLinkItem[] = [
  {
    id: "credit-card",
    title: "Credit Card Lead Form UTM Link",
    slug: "credit-card",
    productName: "Credit Card",
  },
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

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      {/* Dynamic Header showing Partner Info */}
      <Header onNotificationPress={() => navigation.navigate("Notifications" as any)} badgeCount={1} />

      {/* Search Input Bar (Mockup design) */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search Here"
            placeholderTextColor="#7E8299"
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
              <Text style={styles.cardTitle}>{item.title}</Text>
              
              <View style={styles.buttonRow}>
                {/* Copy Button (Black bg) */}
                <Pressable
                  onPress={() => handleCopy(item)}
                  style={styles.copyButton}
                  accessibilityRole="button"
                  accessibilityLabel={`copy-utm-${item.id}`}
                >
                  <Text style={styles.copyIcon}>📄</Text>
                  <Text style={styles.copyText}>Copy</Text>
                </Pressable>

                {/* Share Button (White bg, black border) */}
                <Pressable
                  onPress={() => handleShare(item)}
                  style={styles.shareButton}
                  accessibilityRole="button"
                  accessibilityLabel={`share-utm-${item.id}`}
                >
                  <Text style={styles.shareIcon}>🔗</Text>
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
    backgroundColor: "#F8F9FD",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E3EA",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1E1E2D",
    fontWeight: "600",
    paddingVertical: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EFF2F5",
    padding: 16,
    marginBottom: 16,
    shadowColor: "#1E1E2D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E1E2D",
    marginBottom: 16,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
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
    backgroundColor: "#1E1E2D",
    borderRadius: 6,
    height: 44,
  },
  copyIcon: {
    fontSize: 14,
    color: "#FFFFFF",
    marginRight: 6,
  },
  copyText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#1E1E2D",
    borderRadius: 6,
    height: 44,
  },
  shareIcon: {
    fontSize: 14,
    color: "#1E1E2D",
    marginRight: 6,
  },
  shareText: {
    color: "#1E1E2D",
    fontSize: 14,
    fontWeight: "700",
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
    color: "#7E8299",
    fontSize: 14,
    fontWeight: "600",
  },
});
