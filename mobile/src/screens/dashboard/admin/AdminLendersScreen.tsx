import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchLenders, Lender } from "../../../api/credupe";
import { useTheme } from "../../../theme/ThemeProvider";
import { radii, spacing, typography } from "../../../theme/colors";

interface Props {
  onBack: () => void;
  onEdit: (lender: Lender) => void;
  onCreate: () => void;
}

export const AdminLendersScreen: React.FC<Props> = ({ onBack, onEdit, onCreate }) => {
  const { colors } = useTheme();
  const [items, setItems] = useState<Lender[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const r = await fetchLenders();
    setItems(r.success && r.data?.items ? r.data.items : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <View style={{ padding: spacing.lg }}>
        <Pressable onPress={onBack} accessibilityLabel="back-btn">
          <Text style={{ color: colors.primary, fontWeight: "700" }}>‹ Back</Text>
        </Pressable>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.h1, { color: colors.text }]}>Lenders</Text>
            <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>
              {items.length} partner-lenders in the catalogue. Tap to edit.
            </Text>
          </View>
          <Pressable
            onPress={onCreate}
            style={[styles.newBtn, { backgroundColor: colors.primary }]}
            accessibilityLabel="new-lender-btn"
          >
            <Text style={{ color: colors.textInverted, fontWeight: "800" }}>+ New</Text>
          </Pressable>
        </View>
      </View>

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
              onPress={() => onEdit(item)}
              style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
              accessibilityLabel={`lender-${item.slug}`}
            >
              <View style={[styles.avatar, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
                <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 16 }}>
                  {item.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>{item.name}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
                  slug:{item.slug} · {item.integrationMode ?? "mock"}
                  {item.productCount != null ? ` · ${item.productCount} products` : ""}
                  {item.active === false ? " · INACTIVE" : ""}
                </Text>
              </View>
              <Text style={{ color: colors.textMuted, fontSize: 22 }}>›</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={[styles.empty, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textMuted, textAlign: "center" }}>No lenders configured.</Text>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center", borderWidth: 1,
  },
  empty: { padding: spacing.xl, borderRadius: radii.lg, borderWidth: 1, borderStyle: "dashed" },
});
