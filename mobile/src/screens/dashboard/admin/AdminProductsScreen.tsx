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
import { useIsFocused } from "@react-navigation/native";
import { fetchLoanProducts, LoanProduct } from "../../../api/credupe";
import { inr, pct } from "../../../lib/format";
import { useTheme } from "../../../theme/ThemeProvider";
import { radii, spacing, typography } from "../../../theme/colors";

interface Props {
  onBack: () => void;
  onEdit: (product: LoanProduct) => void;
  onCreate: () => void;
}

const LOAN_TYPES_FILTER = ["ALL", "PERSONAL_LOAN", "HOME_LOAN", "BUSINESS_LOAN", "CAR_LOAN", "GOLD_LOAN"] as const;
type LoanTypeFilter = (typeof LOAN_TYPES_FILTER)[number];

export const AdminProductsScreen: React.FC<Props> = ({ onBack, onEdit, onCreate }) => {
  const { colors } = useTheme();
  const [items, setItems] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<LoanTypeFilter>("ALL");
  const isFocused = useIsFocused();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const r = await fetchLoanProducts({ limit: 200 });
    if (!r.success) {
      setError(r.error?.message?.join("\n") ?? "Failed to load products.");
      setItems([]);
    } else {
      setItems(r.data?.items ? r.data.items : []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isFocused) {
      load();
    }
  }, [isFocused, load]);

  const filtered = useMemo(() => {
    if (filter === "ALL") return items;
    return items.filter((i) => i.loanType === filter);
  }, [items, filter]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <View style={{ padding: spacing.lg }}>
        <Pressable onPress={onBack} accessibilityLabel="back-btn">
          <Text style={{ color: colors.primary, fontWeight: "700" }}>‹ Back</Text>
        </Pressable>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.h1, { color: colors.text }]}>Loan products</Text>
            <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>
              {items.length} products across all lenders. Tap to edit.
            </Text>
          </View>
          <Pressable
            onPress={onCreate}
            style={[styles.newBtn, { backgroundColor: colors.primary }]}
            accessibilityLabel="new-product-btn"
          >
            <Text style={{ color: colors.textInverted, fontWeight: "800" }}>+ New</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 8 }}
        style={{ flexGrow: 0, marginBottom: spacing.sm }}
      >
        {LOAN_TYPES_FILTER.map((t) => (
          <Pressable
            key={t}
            onPress={() => setFilter(t)}
            style={[
              styles.chip,
              {
                backgroundColor: filter === t ? colors.primary : colors.card,
                borderColor: filter === t ? colors.primary : colors.border,
              },
            ]}
            accessibilityLabel={`filter-${t}`}
          >
            <Text style={{ color: filter === t ? colors.textInverted : colors.text, fontWeight: "700", fontSize: 12 }}>
              {t.replace(/_/g, " ")}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={{ color: "#EF4444", textAlign: "center", marginBottom: spacing.md, fontSize: 14 }}>
            {error}
          </Text>
          <Pressable
            onPress={load}
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            accessibilityLabel="retry-btn"
          >
            <Text style={{ color: colors.textInverted, fontWeight: "700" }}>Retry</Text>
          </Pressable>
        </View>
      ) : loading && items.length === 0 ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(p) => p.id}
          refreshing={loading}
          onRefresh={load}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onEdit(item)}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              accessibilityLabel={`product-${item.slug}`}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "800", fontSize: 15 }}>{item.name}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
                  {item.lender?.name ?? item.lenderId} · {item.loanType.replace(/_/g, " ")}
                  {item.active === false ? " · INACTIVE" : ""}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>
                  {inr(item.minAmount)}–{inr(item.maxAmount)} · {item.minTenureMonths}–{item.maxTenureMonths} mo
                </Text>
              </View>
              <View style={[styles.ratePill, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
                <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 13 }}>
                  {pct(item.minInterestRate)}
                </Text>
                <Text style={{ color: colors.primary, fontSize: 9 }}>p.a.</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={[styles.empty, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textMuted, textAlign: "center" }}>
                No products {filter === "ALL" ? "" : `for ${filter}`}.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.md },
  newBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.pill },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.pill, borderWidth: 1 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  ratePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: "center",
  },
  empty: { padding: spacing.xl, borderRadius: radii.lg, borderWidth: 1, borderStyle: "dashed" },
  errorContainer: { padding: spacing.xl, alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  retryBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: radii.pill, marginTop: spacing.sm },
});
