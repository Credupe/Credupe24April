import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fetchNotifications,
  InAppNotification,
  markAllNotificationsRead,
  markNotificationRead,
} from "../api/credupe";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";

interface Props {
  onBack: () => void;
}

export const NotificationsScreen: React.FC<Props> = ({ onBack }) => {
  const { colors } = useTheme();
  const [items, setItems] = useState<InAppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const r = await fetchNotifications();
    if (r.success && r.data) {
      setItems(r.data.items);
      setUnread(r.data.unread);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = useCallback(
    async (id: string) => {
      await markNotificationRead(id);
      load();
    },
    [load],
  );

  const markAll = useCallback(async () => {
    await markAllNotificationsRead();
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
            <Text style={[typography.h1, { color: colors.text }]}>Notifications</Text>
            <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>
              {unread > 0 ? `${unread} unread` : "You're all caught up"}
            </Text>
          </View>
          {unread > 0 ? (
            <Pressable
              onPress={markAll}
              style={[styles.markAll, { borderColor: colors.primary }]}
              accessibilityLabel="mark-all-read-btn"
            >
              <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}>Mark all read</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(n) => n.id}
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
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => {
            const isUnread = item.status !== "READ";
            return (
              <Pressable
                onPress={() => isUnread && markRead(item.id)}
                style={[
                  styles.card,
                  {
                    backgroundColor: isUnread ? colors.cardElevated : colors.card,
                    borderColor: isUnread ? colors.primary : colors.border,
                  },
                ]}
                accessibilityLabel={`notification-${item.id}`}
              >
                <View style={[styles.dot, { backgroundColor: isUnread ? colors.primary : "transparent" }]} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontWeight: "800", fontSize: 15 }}>{item.title}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 2 }}>{item.body}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 4 }}>
                    {new Date(item.createdAt).toLocaleString("en-IN")}
                    {item.category ? ` · ${item.category}` : ""}
                  </Text>
                </View>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <View style={[styles.empty, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textMuted, textAlign: "center" }}>
                No notifications yet — application updates and lender responses will appear here.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
  },
  markAll: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  empty: { padding: spacing.xl, borderRadius: radii.lg, borderWidth: 1, borderStyle: "dashed" },
});
