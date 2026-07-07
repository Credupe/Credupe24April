import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ApiUser,
  BrokerageSummary,
  fetchBrokerageSummary,
  fetchPartnerAnalytics,
  getCachedUser,
} from "../../../../api/credupe";
import { CredupeLogo } from "../../../../components/CredupeLogo";
import { KycPopup } from "../kyc/kycpopup";
import { inr } from "../../../../lib/format";
import { useTheme } from "../../../../theme/ThemeProvider";
import { radii, spacing, typography } from "../../../../theme/colors";

interface Props {
  onOpenLeads: (status?: string) => void;
  onOpenCommissions: () => void;
  onNewLead: () => void;
  onBulkImport: () => void;
  onOpenKyc: () => void;
}

export const PartnerHomeScreen: React.FC<Props> = ({ onOpenLeads, onOpenCommissions, onNewLead, onBulkImport, onOpenKyc }) => {
  const { colors, mode, toggle } = useTheme();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [brokerage, setBrokerage] = useState<BrokerageSummary | null>(null);
  const [leadsByStatus, setLeadsByStatus] = useState<Record<string, number>>({});
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dismissedKycPopup, setDismissedKycPopup] = useState(false);

  const showKycPopup = !dismissedKycPopup && (user?.kycStatus == null || user?.kycStatus === "PENDING");

  const load = useCallback(async () => {
    const u = await getCachedUser();
    setUser(u);
    const [b, a] = await Promise.all([fetchBrokerageSummary(), fetchPartnerAnalytics()]);
    if (b.success && b.data) setBrokerage(b.data);
    if (a.success && a.data) {
      setLeadsByStatus(a.data.leads.byStatus);
      setTotalLeads(a.data.leads.total);
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

        <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.xl }]}>
          Hello partner 👋
        </Text>
        <Text style={[typography.display, { color: colors.text }]}>
          {(user?.fullName || user?.email?.split("@")[0] || "partner").toLowerCase()}
        </Text>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xxl }} />
        ) : (
          <>
            {/* Brokerage KPI card */}
            <Pressable
              onPress={onOpenCommissions}
              style={[styles.kpiCard, { backgroundColor: colors.cardElevated, borderColor: colors.primary }]}
              accessibilityLabel="brokerage-kpi"
            >
              <Text style={[typography.micro, { color: colors.textMuted }]}>TOTAL PAYOUT (LIFETIME)</Text>
              <Text style={{ color: colors.primary, fontSize: 36, fontWeight: "800", marginTop: 2 }}>
                {inr(brokerage?.totalPayout ?? 0)}
              </Text>
              <View style={styles.kpiRow}>
                <KpiTile label="Pending" value={inr(brokerage?.pending ?? 0)} color={colors.warning} />
                <KpiTile label="Approved" value={inr(brokerage?.approved ?? 0)} color={colors.primary} />
                <KpiTile label="Paid" value={inr(brokerage?.paid ?? 0)} color={colors.success} />
              </View>
              <Text style={{ color: colors.primary, marginTop: spacing.md, fontWeight: "700" }}>
                See commission ledger →
              </Text>
            </Pressable>

            {/* Leads pipeline */}
            <View style={styles.pipelineHeader}>
              <Text style={[typography.micro, { color: colors.textMuted }]}>LEAD PIPELINE · {totalLeads}</Text>
              <Pressable onPress={() => onOpenLeads(undefined)} accessibilityLabel="open-all-leads">
                <Text style={{ color: colors.primary, fontWeight: "700" }}>See all</Text>
              </Pressable>
            </View>
            <View style={styles.pipelineGrid}>
              {["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "DROPPED"].map((s) => (
                <Pressable
                  key={s}
                  onPress={() => onOpenLeads(s)}
                  style={[styles.pipelineTile, { backgroundColor: colors.card, borderColor: colors.border }]}
                  accessibilityLabel={`pipeline-${s}`}
                >
                  <Text style={{ color: colors.text, fontSize: 28, fontWeight: "800" }}>
                    {leadsByStatus[s] ?? 0}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginTop: 2 }}>
                    {s}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* New lead CTA + Bulk import */}
            <View style={styles.ctaRow}>
              <Pressable
                onPress={onNewLead}
                style={[styles.newLead, { backgroundColor: colors.primary }]}
                accessibilityLabel="new-lead-btn"
              >
                <Text style={{ color: colors.textInverted, fontWeight: "800", fontSize: 16 }}>
                  + Add new lead
                </Text>
              </Pressable>
              <Pressable
                onPress={onBulkImport}
                style={[styles.bulkBtn, { borderColor: colors.primary }]}
                accessibilityLabel="bulk-import-btn"
              >
                <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 14 }}>📑 Bulk CSV</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
      {showKycPopup ? (
        <KycPopup
          onCompleteKyc={onOpenKyc}
          onSkip={() => setDismissedKycPopup(true)}
        />
      ) : null}
    </SafeAreaView>
  );
};

const KpiTile: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: "700", letterSpacing: 0.4 }}>
        {label.toUpperCase()}
      </Text>
      <Text style={{ color, fontSize: 17, fontWeight: "800", marginTop: 2 }}>{value}</Text>
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
  kpiCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 2,
  },
  kpiRow: { flexDirection: "row", marginTop: spacing.md, gap: spacing.md },
  pipelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
  },
  pipelineGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  pipelineTile: {
    width: "31.5%",
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  newLead: {
    marginTop: spacing.xxl,
    paddingVertical: 16,
    borderRadius: radii.pill,
    alignItems: "center",
  },
});
