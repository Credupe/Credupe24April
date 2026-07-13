import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CredupeLogo } from "../components/CredupeLogo";
import { ApiUser, fetchMyApplications, getCachedUser, LoanApplication } from "../api/credupe";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";

interface LoanCategory {
  key: string;
  title: string;
  caption: string;
  icon: string;
}

const CATEGORIES: LoanCategory[] = [
  { key: "PERSONAL_LOAN", title: "Personal Loan", caption: "Up to ₹50L · from 10.49%", icon: "₹" },
  { key: "HOME_LOAN", title: "Home Loan", caption: "Up to ₹5Cr · from 8.35%", icon: "⌂" },
  { key: "BUSINESS_LOAN", title: "Business Loan", caption: "Up to ₹1Cr · from 13.99%", icon: "▤" },
  { key: "CAR_LOAN", title: "Car Loan", caption: "Up to ₹50L · from 8.75%", icon: "⛟" },
  { key: "GOLD_LOAN", title: "Gold Loan", caption: "Up to ₹20L · from 9.50%", icon: "✦" },
];

const STATUS_COLOR: Record<string, "success" | "warning" | "danger"> = {
  APPROVED: "success",
  DISBURSED: "success",
  UNDER_REVIEW: "warning",
  DOC_PENDING: "warning",
  LOGIN: "warning",
  LEAD: "warning",
  REJECTED: "danger",
};

export const HomeScreen: React.FC<{ onSelectCategory: (k: string) => void }> = ({ onSelectCategory }) => {
  const { colors, mode, toggle } = useTheme();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [apps, setApps] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const u = await getCachedUser();
    setUser(u);
    const r = await fetchMyApplications();
    setApps(r.success && r.data?.items ? r.data.items : []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <CredupeLogo size={28} layout="row" withWordmark />
          <Pressable
            onPress={toggle}
            style={[styles.themeChip, { borderColor: colors.border, backgroundColor: colors.card }]}
            accessibilityLabel="toggle-theme"
          >
            <Text style={{ color: colors.text, fontWeight: "700" }}>{mode === "dark" ? "☾" : "☀"}</Text>
          </Pressable>
        </View>

        {/* Greeting */}
        <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.xl }]}>
          Hi 👋
        </Text>
        <Text style={[typography.display, { color: colors.text }]}>
          {(user?.fullName || user?.email?.split("@")[0] || "there").toLowerCase()}
        </Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.xs }]}>
          Find a loan that matches your goals.
        </Text>

        {/* Eligibility CTA */}
        <Pressable
          style={[
            styles.ctaCard,
            {
              backgroundColor: colors.cardElevated,
              borderColor: colors.border,
            },
          ]}
          onPress={() => onSelectCategory("PERSONAL_LOAN")}
          accessibilityLabel="check-eligibility-cta"
        >
          <View
            style={[
              styles.ctaIcon,
              { backgroundColor: colors.primaryMuted, borderColor: colors.primary },
            ]}
          >
            <Text style={{ color: colors.primary, fontSize: 28, fontWeight: "800" }}>≡</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[typography.h2, { color: colors.text }]}>Check your eligibility</Text>
            <Text style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]}>
              Instant match across 7+ banks
            </Text>
            <Text style={{ color: colors.primary, marginTop: 6, fontWeight: "700" }}>Start now →</Text>
          </View>
        </Pressable>

        {/* Loan Categories */}
        <Text style={[typography.micro, { color: colors.textMuted, marginTop: spacing.xxl, marginBottom: spacing.md }]}>
          PICK A LOAN
        </Text>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c.key}
            onPress={() => onSelectCategory(c.key)}
            style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
            accessibilityLabel={`category-${c.key}`}
          >
            <View style={[styles.rowIcon, { backgroundColor: colors.primaryMuted }]}>
              <Text style={{ color: colors.primary, fontSize: 22, fontWeight: "800" }}>{c.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typography.h2, { color: colors.text, fontSize: 17 }]}>{c.title}</Text>
              <Text style={[typography.caption, { color: colors.textMuted }]}>{c.caption}</Text>
            </View>
            <Text style={{ color: colors.textMuted, fontSize: 22 }}>›</Text>
          </Pressable>
        ))}

        {/* My Applications */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.micro, { color: colors.textMuted }]}>MY APPLICATIONS</Text>
          <Text style={{ color: colors.primary, fontWeight: "700" }}>See all</Text>
        </View>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
        ) : apps.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={{ color: colors.textMuted, textAlign: "center" }}>
              No applications yet — pick a loan above to start.
            </Text>
          </View>
        ) : (
          apps.slice(0, 4).map((a) => <ApplicationRow key={a.id} app={a} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const ApplicationRow: React.FC<{ app: LoanApplication }> = ({ app }) => {
  const { colors } = useTheme();
  const tone = STATUS_COLOR[app.status] ?? "warning";
  const toneColor = tone === "success" ? colors.success : tone === "danger" ? colors.danger : colors.warning;
  return (
    <View style={[styles.appRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>{app.referenceNo}</Text>
        <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 2 }}>
          {app.loanType.replace(/_/g, " ")} · ₹{(Number(app.amount) / 100000).toFixed(2)} L
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: radii.pill,
          backgroundColor: toneColor + "22",
          borderWidth: 1,
          borderColor: toneColor,
        }}
      >
        <Text style={{ color: toneColor, fontWeight: "800", fontSize: 12 }}>{app.status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  themeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  ctaCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  ctaIcon: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  emptyCard: {
    padding: spacing.xl,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  appRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
});
