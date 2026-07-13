import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BrokerageSummary,
  CommissionItem,
  fetchBrokerageSummary,
  fetchCommissions,
} from "../api/credupe";
import { inr, pct } from "../lib/format";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";

interface Props {
  onBack?: () => void;
}

const STATUS_FILTER = ["ALL", "PENDING", "APPROVED", "PAID", "CANCELLED"] as const;
type Filter = (typeof STATUS_FILTER)[number];

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "primary"> = {
  PAID: "success",
  APPROVED: "primary",
  PENDING: "warning",
  CANCELLED: "danger",
};

export const CommissionsScreen: React.FC<Props> = ({ onBack }) => {
  const { colors } = useTheme();
  const [summary, setSummary] = useState<BrokerageSummary | null>(null);
  const [items, setItems] = useState<CommissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("ALL");

  const load = useCallback(async () => {
    const [s, c] = await Promise.all([fetchBrokerageSummary(), fetchCommissions()]);
    if (s.success && s.data) setSummary(s.data);
    setItems(c.success && c.data?.items ? c.data.items : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === "ALL") return items;
    return items.filter((i) => i.status === filter);
  }, [items, filter]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <View style={{ padding: spacing.lg }}>
        {onBack ? (
          <Pressable onPress={onBack} accessibilityLabel="back-btn">
            <Text style={{ color: colors.primary, fontWeight: "700" }}>‹ Back</Text>
          </Pressable>
        ) : null}
        <Text style={[typography.h1, { color: colors.text, marginTop: spacing.md }]}>Commissions</Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>
          Live ledger of payouts across every disbursed loan.
        </Text>
      </View>

      {/* Summary card */}
      <View style={{ paddingHorizontal: spacing.lg }}>
        <View style={[styles.kpiCard, { backgroundColor: colors.cardElevated, borderColor: colors.primary }]}>
          <Text style={[typography.micro, { color: colors.textMuted }]}>TOTAL PAYOUT</Text>
          <Text style={{ color: colors.primary, fontSize: 32, fontWeight: "800", marginTop: 2 }}>
            {inr(summary?.totalPayout ?? 0)}
          </Text>
          <View style={styles.kpiRow}>
            <Kpi label="Pending" value={inr(summary?.pending ?? 0)} color={colors.warning} />
            <Kpi label="Approved" value={inr(summary?.approved ?? 0)} color={colors.primary} />
            <Kpi label="Paid" value={inr(summary?.paid ?? 0)} color={colors.success} />
          </View>
        </View>
      </View>

      {/* Filter chips */}
      <View style={styles.chipRow}>
        {STATUS_FILTER.map((s) => {
          const active = s === filter;
          return (
            <Pressable
              key={s}
              onPress={() => setFilter(s)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.primary : colors.card,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
              accessibilityLabel={`filter-${s}`}
            >
              <Text style={{ color: active ? colors.textInverted : colors.text, fontWeight: "700", fontSize: 12 }}>{s}</Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => <CommissionRow item={item} />}
          ListEmptyComponent={
            <View style={[styles.empty, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textMuted, textAlign: "center" }}>
                No commissions {filter === "ALL" ? "yet" : `in ${filter}`}.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const Kpi: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: "700", letterSpacing: 0.4 }}>
        {label.toUpperCase()}
      </Text>
      <Text style={{ color, fontSize: 16, fontWeight: "800", marginTop: 2 }}>{value}</Text>
    </View>
  );
};

const CommissionRow: React.FC<{ item: CommissionItem }> = ({ item }) => {
  const { colors } = useTheme();
  const tone = STATUS_TONE[item.status] ?? "warning";
  const c =
    tone === "success" ? colors.success : tone === "danger" ? colors.danger : tone === "warning" ? colors.warning : colors.primary;
  return (
    <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>
          {item.lead?.customer_name ?? "—"}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
          {item.product?.name ?? item.lead?.loan_type ?? ""}{" "}
          {item.payoutPct != null ? `· ${pct(item.payoutPct, 2)} payout` : ""}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ color: c, fontWeight: "800", fontSize: 18 }}>{inr(item.amount)}</Text>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: radii.pill,
            backgroundColor: c + "22",
            borderWidth: 1,
            borderColor: c,
            marginTop: 4,
          }}
        >
          <Text style={{ color: c, fontWeight: "800", fontSize: 10 }}>{item.status}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  kpiCard: { padding: spacing.lg, borderRadius: radii.lg, borderWidth: 2 },
  kpiRow: { flexDirection: "row", marginTop: spacing.md, gap: spacing.md },
  chipRow: { flexDirection: "row", gap: 8, paddingHorizontal: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.sm, flexWrap: "wrap" },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.pill, borderWidth: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  empty: { padding: spacing.xl, borderRadius: radii.lg, borderWidth: 1, borderStyle: "dashed" },
});
