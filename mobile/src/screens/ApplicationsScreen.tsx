import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchMyApplications, LoanApplication } from "../api/credupe";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";

const STATUSES = ["LEAD", "LOGIN", "DOC_PENDING", "UNDER_REVIEW", "APPROVED", "DISBURSED"] as const;

export const ApplicationsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [apps, setApps] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const r = await fetchMyApplications();
    setApps(r.success && r.data?.items ? r.data.items : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <View style={{ padding: spacing.lg }}>
        <Text style={[typography.h1, { color: colors.text }]}>Applications</Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>
          Track every loan you've applied for.
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xxl }} />
      ) : (
        <FlatList
          data={apps}
          keyExtractor={(a) => a.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          renderItem={({ item }) => <AppCard app={item} />}
          ListEmptyComponent={
            <View style={[styles.empty, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textMuted, textAlign: "center" }}>
                No applications yet.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const AppCard: React.FC<{ app: LoanApplication }> = ({ app }) => {
  const { colors } = useTheme();
  const stage = STATUSES.indexOf(app.status as (typeof STATUSES)[number]);
  const progressed = Math.max(0, stage);
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: colors.text, fontWeight: "800", fontSize: 17 }}>{app.referenceNo}</Text>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>
          {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </Text>
      </View>
      <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 4 }}>
        {app.loanType.replace(/_/g, " ")} · ₹{(Number(app.amount) / 100000).toFixed(2)} L
      </Text>

      {/* Progress dots */}
      <View style={styles.progressRow}>
        {STATUSES.map((s, i) => (
          <View key={s} style={{ flex: 1, alignItems: "center" }}>
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: i <= progressed ? colors.primary : colors.border,
                borderWidth: i === progressed ? 3 : 0,
                borderColor: colors.primary,
              }}
            />
            <Text
              style={{
                color: i <= progressed ? colors.text : colors.textMuted,
                fontSize: 9,
                marginTop: 4,
                fontWeight: "700",
              }}
              numberOfLines={1}
            >
              {s}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: spacing.lg, borderRadius: radii.lg, borderWidth: 1 },
  progressRow: { flexDirection: "row", marginTop: spacing.md, alignItems: "flex-start" },
  empty: {
    padding: spacing.xl,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    marginHorizontal: spacing.lg,
  },
});
