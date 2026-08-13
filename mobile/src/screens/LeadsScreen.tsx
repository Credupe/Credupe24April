import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchLeads, Lead, LEAD_STATUSES, LeadStatus } from "../api/credupe";
import { inr } from "../lib/format";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";

interface Props {
  initialStatus?: LeadStatus;
  onBack?: () => void;
  onOpenLead: (lead: Lead) => void;
  onNewLead: () => void;
}

const STATUS_TONES: Record<LeadStatus, "success" | "warning" | "danger" | "primary"> = {
  NEW: "primary",
  CONTACTED: "warning",
  QUALIFIED: "warning",
  CONVERTED: "success",
  DROPPED: "danger",
};

export const LeadsScreen: React.FC<Props> = ({ initialStatus, onBack, onOpenLead, onNewLead }) => {
  const { colors } = useTheme();
  const [statusFilter, setStatusFilter] = useState<LeadStatus | undefined>(initialStatus);
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (status?: LeadStatus) => {
    setLoading(true);
    const r = await fetchLeads(status);
    setItems(r.success && r.data?.items ? r.data.items : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(statusFilter);
  }, [load, statusFilter]);

  useEffect(() => {
    setStatusFilter(initialStatus);
  }, [initialStatus]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const it of items) c[it.status] = (c[it.status] ?? 0) + 1;
    return c;
  }, [items]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <View style={{ padding: spacing.lg }}>
        {onBack ? (
          <Pressable onPress={onBack} accessibilityLabel="back-btn">
            <Text style={{ color: colors.primary, fontWeight: "700" }}>‹ Back</Text>
          </Pressable>
        ) : null}
        <View style={styles.headerRow}>
          <Text style={[typography.h1, { color: colors.text }]}>Leads</Text>
          <Pressable
            onPress={onNewLead}
            style={[styles.newBtn, { backgroundColor: colors.primary }]}
            accessibilityLabel="new-lead-btn"
          >
            <Text style={{ color: colors.textInverted, fontWeight: "800" }}>+ New</Text>
          </Pressable>
        </View>
      </View>

      {/* Status filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 8 }}
        style={{ flexGrow: 0, marginBottom: spacing.sm }}
      >
        <Chip
          label="ALL"
          active={!statusFilter}
          onPress={() => setStatusFilter(undefined)}
        />
        {LEAD_STATUSES.map((s) => (
          <Chip
            key={s}
            label={`${s}${counts[s] ? ` · ${counts[s]}` : ""}`}
            active={statusFilter === s}
            onPress={() => setStatusFilter(s)}
          />
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(l) => l.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onOpenLead(item)}
              style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
              accessibilityLabel={`lead-${item.id}`}
            >
              <View style={[styles.avatar, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
                <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 18 }}>
                  {item.customerName.slice(0, 1).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>{item.customerName}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                  {item.customerMobile} · {item.loanType.replace(/_/g, " ")}
                  {item.amount ? ` · ${inr(item.amount)}` : ""}
                </Text>
              </View>
              <StatusPill status={item.status} />
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={[styles.empty, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textMuted, textAlign: "center" }}>
                No leads {statusFilter ? `in ${statusFilter}` : ""} yet.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const Chip: React.FC<{ label: string; active: boolean; onPress: () => void }> = ({ label, active, onPress }) => {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: radii.pill,
        backgroundColor: active ? colors.primary : colors.card,
        borderColor: active ? colors.primary : colors.border,
        borderWidth: 1,
      }}
      accessibilityLabel={`filter-${label}`}
    >
      <Text style={{ color: active ? colors.textInverted : colors.text, fontWeight: "700", fontSize: 12 }}>{label}</Text>
    </Pressable>
  );
};

const StatusPill: React.FC<{ status: LeadStatus }> = ({ status }) => {
  const { colors } = useTheme();
  const tone = STATUS_TONES[status];
  const c =
    tone === "success" ? colors.success : tone === "danger" ? colors.danger : tone === "warning" ? colors.warning : colors.primary;
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radii.pill,
        backgroundColor: c + "22",
        borderWidth: 1,
        borderColor: c,
      }}
    >
      <Text style={{ color: c, fontWeight: "800", fontSize: 11 }}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.md },
  newBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.pill },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", borderWidth: 1,
  },
  empty: { padding: spacing.xl, borderRadius: radii.lg, borderWidth: 1, borderStyle: "dashed" },
});
