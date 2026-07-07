import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdminUser, fetchAdminUsers } from "../api/credupe";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";

interface Props {
  onBack: () => void;
}

const ROLES = ["ALL", "CUSTOMER", "PARTNER", "ADMIN"] as const;
type RoleFilter = (typeof ROLES)[number];

export const AdminUsersScreen: React.FC<Props> = ({ onBack }) => {
  const { colors } = useTheme();
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<RoleFilter>("ALL");

  const load = useCallback(async () => {
    const r = await fetchAdminUsers();
    setItems(r.success && r.data?.items ? r.data.items : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (role === "ALL") return items;
    return items.filter((u) => u.role === role);
  }, [items, role]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const u of items) c[u.role] = (c[u.role] ?? 0) + 1;
    return c;
  }, [items]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <View style={{ padding: spacing.lg }}>
        <Pressable onPress={onBack} accessibilityLabel="back-btn">
          <Text style={{ color: colors.primary, fontWeight: "700" }}>‹ Back</Text>
        </Pressable>
        <Text style={[typography.h1, { color: colors.text, marginTop: spacing.md }]}>Users</Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>
          {items.length} accounts across all roles.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 8 }}
        style={{ flexGrow: 0, marginBottom: spacing.sm }}
      >
        {ROLES.map((r) => (
          <Pressable
            key={r}
            onPress={() => setRole(r)}
            style={[
              styles.chip,
              {
                backgroundColor: role === r ? colors.primary : colors.card,
                borderColor: role === r ? colors.primary : colors.border,
              },
            ]}
            accessibilityLabel={`role-${r}`}
          >
            <Text style={{ color: role === r ? colors.textInverted : colors.text, fontWeight: "700", fontSize: 12 }}>
              {r}{r !== "ALL" && counts[r] ? ` · ${counts[r]}` : ""}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(u) => u.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => (
            <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.avatar, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
                <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 16 }}>
                  {(item.fullName?.[0] ?? item.email[0]).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "800", fontSize: 15 }}>
                  {item.fullName ?? item.email.split("@")[0]}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                  {item.email}{item.phone ? ` · ${item.phone}` : ""}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>
                  joined {new Date(item.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </Text>
              </View>
              <View style={[styles.roleBadge, { backgroundColor: colors.primary }]}>
                <Text style={{ color: colors.textInverted, fontWeight: "800", fontSize: 11 }}>{item.role}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={[styles.empty, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textMuted, textAlign: "center" }}>No users in this role.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.pill, borderWidth: 1 },
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
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  empty: { padding: spacing.xl, borderRadius: radii.lg, borderWidth: 1, borderStyle: "dashed" },
});
