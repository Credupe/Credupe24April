import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchLoanProducts, LoanProduct } from "../api/credupe";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";

export const LoansScreen: React.FC = () => {
  const { colors } = useTheme();
  const [items, setItems] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const r = await fetchLoanProducts({ limit: 50 });
    setItems(r.success && r.data?.items ? r.data.items : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <View style={{ padding: spacing.lg }}>
        <Text style={[typography.h1, { color: colors.text }]}>Loan products</Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>
          Live offers across partner lenders.
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xxl }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>{item.name}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 2 }}>
                  {item.lenderName ?? item.lenderId} · {item.loanType.replace(/_/g, " ")}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 6 }}>
                  ₹{(item.minAmount / 100000).toFixed(0)}L – ₹{(item.maxAmount / 100000).toFixed(0)}L ·{" "}
                  {item.minTenureMonths}–{item.maxTenureMonths} mo
                </Text>
              </View>
              <View style={[styles.ratePill, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
                <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 14 }}>
                  {Number(item.baseRatePct).toFixed(2)}%
                </Text>
                <Text style={{ color: colors.primary, fontSize: 10 }}>p.a.</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: colors.textMuted, textAlign: "center", padding: spacing.xl }}>
              No products available.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
  },
  ratePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: "center",
  },
});
