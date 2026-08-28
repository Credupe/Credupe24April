import React, { useCallback, useEffect, useState, useRef } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View, Text, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  ApiUser,
  BrokerageSummary,
  fetchBrokerageSummary,
  fetchPartnerAnalytics,
  getCachedUser,
  fetchPartnerProfile,
  PartnerProfile,
  submitFeedback,
} from "../../../../api/credupe";
import { RootStackParamList } from "../../../../../App";
import { Header, BannerCarousel, DashboardGrid } from "./components";
import { DASHBOARD_MENU, DashboardMenuItem } from "./data/dashboardMenu";
import { KycPopup } from "../kyc/kycpopup";
import { COLORS } from "./constants/colors";
import styles from "./PartnerHome.styles";
import { FeedbackModal } from "../../../../components/feedback/FeedbackModal";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";


interface Props {
  onOpenLeads: (status?: string) => void;
  onOpenCommissions: () => void;
  onNewLead: () => void;
  onBulkImport: () => void;
  onOpenKyc: () => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const PartnerHomeScreen: React.FC<Props> = ({
  onOpenLeads,
  onOpenCommissions,
  onNewLead,
  onBulkImport,
  onOpenKyc,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [brokerage, setBrokerage] = useState<BrokerageSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dismissedKycPopup, setDismissedKycPopup] = useState(false);

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const hasShownFeedback = useRef(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showKycPopup =
    !dismissedKycPopup &&
    partnerProfile?.kycStatus !== "VERIFIED" &&
    partnerProfile?.onboardingStep !== "COMPLETE";

  const load = useCallback(async () => {
    try {
      const u = await getCachedUser();
      setUser(u);
      const [b, a, p] = await Promise.all([
        fetchBrokerageSummary(),
        fetchPartnerAnalytics(),
        fetchPartnerProfile(),
      ]);
      if (b.success && b.data) setBrokerage(b.data);
      if (p.success && p.data?.profile) setPartnerProfile(p.data.profile);
    } catch (e) {
      console.warn("Failed to load dashboard data:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, fadeAnim]);

  useEffect(() => {
    if (!loading && !hasShownFeedback.current) {
      hasShownFeedback.current = true;
      const timer = setTimeout(() => {
        setShowFeedback(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleFeedbackSubmit = async (rating: number) => {
    setFeedbackLoading(true);
    try {
      const device = `${Device.brand || ""} ${Device.modelName || ""}`.trim() || "Unknown Device";
      const platform = Platform.OS;
      const appVersion = "1.0.0";

      const res = await submitFeedback(rating, {
        device,
        platform,
        appVersion,
      });

      if (res.success) {
        setShowFeedback(false);
        Toast.show({
          type: "success",
          text1: "Thank You!",
          text2: "We appreciate your feedback.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Submission Failed",
          text2: res.error?.message?.join("\n") || "Failed to submit feedback. Please try again.",
        });
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: err?.message || "Please check your internet connection.",
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleCardPress = useCallback((item: DashboardMenuItem) => {
    navigation.navigate(item.route as any);
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Header component */}
        <Header 
          onNotificationPress={() => navigation.navigate("Notifications")} 
          badgeCount={1} 
          businessName={partnerProfile?.businessName} 
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
              tintColor={COLORS.primary}
            />
          }
        >
          {/* Banner carousel section */}
          <BannerCarousel />

          {/* Quick Services Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Services</Text>
            <Text style={styles.sectionSubtitle}>Choose a loan category</Text>
          </View>

          {/* Dashboard Grid Menu */}
          <View style={styles.menuContainer}>
            <DashboardGrid data={DASHBOARD_MENU} onCardPress={handleCardPress} />
          </View>
        </ScrollView>

        {/* KYC popup if pending */}
        {showKycPopup ? (
          <KycPopup
            onCompleteKyc={onOpenKyc}
            onSkip={() => setDismissedKycPopup(true)}
          />
        ) : null}

        {/* Rating feedback modal */}
        <FeedbackModal
          visible={showFeedback}
          loading={feedbackLoading}
          onClose={() => setShowFeedback(false)}
          onSubmit={handleFeedbackSubmit}
        />
      </Animated.View>
    </SafeAreaView>
  );
};
