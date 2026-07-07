import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AdminApplication,
  APPLICATION_STATUSES,
  ApplicationStatus,
  fetchAdminApplications,
  transitionApplication,
} from "../api/credupe";
import { inr } from "../lib/format";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";

interface Props {
  initialStatus?: ApplicationStatus;
  onBack?: () => void;
}

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

export const AdminApplicationsScreen: React.FC<Props> = ({ initialStatus, onBack }) => {
  const { colors } = useTheme();
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | undefined>(initialStatus);
  const [items, setItems] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (status?: ApplicationStatus) => {
    setLoading(true);
    const r = await fetchAdminApplications(status);
    setItems(r.success && r.data?.items ? r.data.items : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(statusFilter);
  }, [load, statusFilter]);

  const transition = useCallback(
    async (app: AdminApplication, to: ApplicationStatus) => {
      const r = await transitionApplication(app.id, to);
      if (!r.success) {
        Alert.alert("Could not transition", r.error?.message?.join("\n") ?? "Try again");
        return;
      }
      load(statusFilter);
    },
    [load, statusFilter],
  );

  const promptTransition = (app: AdminApplication) => {
    Alert.alert(
      app.referenceNo,
      `Currently ${app.status}. Move to:`,
      [
        ...APPLICATION_STATUSES.filter((s) => s !== app.status).map((s) => ({
          text: s,
          onPress: () => transition(app, s),
        })),
        { text: "Cancel", style: "cancel" as const },
      ],
      { cancelable: true },
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <View style={{ padding: spacing.lg }}>
        {onBack ? (
          <Pressable onPress={onBack} accessibilityLabel="back-btn">
            <Text style={{ color: colors.primary, fontWeight: "700" }}>‹ Back</Text>
          </Pressable>
        ) : null}
        <Text style={[typography.h1, { color: colors.text, marginTop: onBack ? spacing.md : 0 }]}>
          All applications
        </Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>
          Tap a row to transition state.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 8 }}
        style={{ flexGrow: 0, marginBottom: spacing.sm }}
      >
        <Chip label="ALL" active={!statusFilter} onPress={() => setStatusFilter(undefined)} />
        {APPLICATION_STATUSES.map((s) => (
          <Chip key={s} label={s.replace(/_/g, " ")} active={statusFilter === s} onPress={() => setStatusFilter(s)} />
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(a) => a.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => {
            const tone = STATUS_TONE[item.status] ?? "primary";
            const tc =
              tone === "success" ? colors.success : tone === "danger" ? colors.danger : tone === "warning" ? colors.warning : colors.primary;
            return (
              <Pressable
                onPress={() => promptTransition(item)}
                style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
                accessibilityLabel={`app-${item.referenceNo}`}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>{item.referenceNo}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
                    {item.loanType.replace(/_/g, " ")} · {inr(item.amount)}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>
                    {new Date(item.createdAt).toLocaleDateString("en-IN")} · {item.partnerId ? `partner ${item.partnerId}` : "direct"}
                  </Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: radii.pill,
                    backgroundColor: tc + "22",
                    borderWidth: 1,
                    borderColor: tc,
                  }}
                >
                  <Text style={{ color: tc, fontWeight: "800", fontSize: 11 }}>{item.status}</Text>
                </View>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <View style={[styles.empty, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textMuted, textAlign: "center" }}>No applications.</Text>
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
    >
      <Text style={{ color: active ? colors.textInverted : colors.text, fontWeight: "700", fontSize: 12 }}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
