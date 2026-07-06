import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiUser, fetchAdminFunnel, getCachedUser } from "../api/credupe";
import { CredupeLogo } from "../components/CredupeLogo";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";

interface Props {
  onOpenApplications: (status?: string) => void;
  onOpenDocuments: () => void;
  onOpenUsers: () => void;
  onOpenLenders: () => void;
  onOpenProducts: () => void;
}

const FUNNEL_ORDER = ["LEAD", "LOGIN", "DOC_PENDING", "UNDER_REVIEW", "APPROVED", "DISBURSED", "REJECTED", "CANCELLED"];

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "primary"> = {
  DISBURSED: "success",
  APPROVED: "success",
  UNDER_REVIEW: "warning",
  DOC_PENDING: "warning",
  LOGIN: "warning",
  LEAD: "primary",
  REJECTED: "danger",
  CANCELLED: "danger",
};

export const AdminHomeScreen: React.FC<Props> = ({ onOpenApplications, onOpenDocuments, onOpenUsers, onOpenLenders, onOpenProducts }) => {
  const { colors, mode, toggle } = useTheme();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [total, setTotal] = useState(0);
  const [byStatus, setByStatus] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const u = await getCachedUser();
    setUser(u);
    const r = await fetchAdminFunnel();
    if (r.success && r.data) {
      setTotal(r.data.total);
      setByStatus(r.data.byStatus);
    }
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

        <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.xl }]}>
          Admin console 🛠
        </Text>
        <Text style={[typography.display, { color: colors.text }]}>
          {(user?.fullName || user?.email?.split("@")[0] || "admin").toLowerCase()}
        </Text>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xxl }} />
        ) : (
          <>
            {/* Total apps hero */}
            <View style={[styles.heroCard, { backgroundColor: colors.cardElevated, borderColor: colors.primary }]}>
              <Text style={[typography.micro, { color: colors.textMuted }]}>LOAN APPLICATIONS</Text>
              <Text style={{ color: colors.primary, fontSize: 44, fontWeight: "800", marginTop: 2 }}>{total}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>across every stage</Text>
            </View>

            {/* Funnel grid */}
            <Text style={[typography.micro, { color: colors.textMuted, marginTop: spacing.xxl, marginBottom: spacing.sm }]}>
              FUNNEL BY STATUS — TAP TO FILTER
            </Text>
            <View style={styles.funnelGrid}>
              {FUNNEL_ORDER.map((s) => {
                const count = byStatus[s] ?? 0;
                const tone = STATUS_TONE[s] ?? "primary";
                const tc =
                  tone === "success" ? colors.success : tone === "danger" ? colors.danger : tone === "warning" ? colors.warning : colors.primary;
                return (
                  <Pressable
                    key={s}
                    onPress={() => onOpenApplications(s)}
                    style={[styles.funnelTile, { backgroundColor: colors.card, borderColor: colors.border }]}
                    accessibilityLabel={`funnel-${s}`}
                  >
                    <Text style={{ color: tc, fontSize: 24, fontWeight: "800" }}>{count}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: "700", letterSpacing: 0.4, marginTop: 2 }}>
                      {s.replace(/_/g, " ")}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Quick links */}
            <Text style={[typography.micro, { color: colors.textMuted, marginTop: spacing.xxl, marginBottom: spacing.sm }]}>
              QUICK LINKS
            </Text>
            <LinkRow icon="▤" label="All applications" caption="State machine + manual transitions" onPress={() => onOpenApplications(undefined)} testID="qa-apps" />
            <LinkRow icon="✓" label="KYC review queue" caption="Verify or reject uploaded documents" onPress={onOpenDocuments} testID="qa-docs" />
            <LinkRow icon="⌥" label="Users" caption="All customers, partners & admins" onPress={onOpenUsers} testID="qa-users" />
            <LinkRow icon="◈" label="Lenders" caption="Partner-lender catalogue — tap to edit / add" onPress={onOpenLenders} testID="qa-lenders" />
            <LinkRow icon="₹" label="Loan products" caption="Amount, tenure, rate & eligibility bands" onPress={onOpenProducts} testID="qa-products" />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const LinkRow: React.FC<{
  icon: string;
  label: string;
  caption: string;
  onPress: () => void;
  testID?: string;
}> = ({ icon, label, caption, onPress, testID }) => {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      style={[styles.linkRow, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.linkIcon, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
        <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 18 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: "800", fontSize: 15 }}>{label}</Text>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>{caption}</Text>
      </View>
      <Text style={{ color: colors.textMuted, fontSize: 22 }}>›</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  themeChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.pill, borderWidth: 1 },
  heroCard: { marginTop: spacing.xl, padding: spacing.lg, borderRadius: radii.lg, borderWidth: 2 },
  funnelGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  funnelTile: {
    width: "31.5%",
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  linkIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
