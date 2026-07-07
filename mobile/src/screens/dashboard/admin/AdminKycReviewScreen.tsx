import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdminDocument, fetchAdminDocuments, verifyDocument } from "../../../api/credupe";
import { useTheme } from "../../../theme/ThemeProvider";
import { radii, spacing, typography } from "../../../theme/colors";

interface Props {
  onBack?: () => void;
}

const FILTERS = ["ALL", "UPLOADED", "VERIFIED", "REJECTED"] as const;
type Filter = (typeof FILTERS)[number];

export const AdminKycReviewScreen: React.FC<Props> = ({ onBack }) => {
  const { colors } = useTheme();
  const [filter, setFilter] = useState<Filter>("UPLOADED");
  const [items, setItems] = useState<AdminDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (f: Filter) => {
    setLoading(true);
    const r = await fetchAdminDocuments(f === "ALL" ? {} : { status: f });
    setItems(r.success && r.data?.items ? r.data.items : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(filter);
  }, [load, filter]);

  const verify = useCallback(
    async (doc: AdminDocument, status: "VERIFIED" | "REJECTED", reason?: string) => {
      setBusyId(doc.id);
      const r = await verifyDocument(doc.id, status, reason);
      setBusyId(null);
      if (!r.success) {
        Alert.alert("Action failed", r.error?.message?.join("\n") ?? "Try again");
        return;
      }
      load(filter);
    },
    [filter, load],
  );

  const promptReject = (doc: AdminDocument) => {
    let reason = "";
    Alert.prompt
      ? Alert.prompt(
          "Reject document",
          `Why is ${doc.fileName} being rejected?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Reject",
              style: "destructive",
              onPress: (text?: string) => verify(doc, "REJECTED", text || "Not specified"),
            },
          ],
          "plain-text",
        )
      : verify(doc, "REJECTED", "Not specified"); // Android / web fallback
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <View style={{ padding: spacing.lg }}>
        {onBack ? (
          <Pressable onPress={onBack} accessibilityLabel="back-btn">
            <Text style={{ color: colors.primary, fontWeight: "700" }}>‹ Back</Text>
          </Pressable>
        ) : null}
        <Text style={[typography.h1, { color: colors.text, marginTop: onBack ? spacing.md : 0 }]}>KYC review</Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>
          Verify or reject documents uploaded by customers.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 8 }}
        style={{ flexGrow: 0, marginBottom: spacing.sm }}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.chip,
              {
                backgroundColor: filter === f ? colors.primary : colors.card,
                borderColor: filter === f ? colors.primary : colors.border,
              },
            ]}
            accessibilityLabel={`filter-${f}`}
          >
            <Text style={{ color: filter === f ? colors.textInverted : colors.text, fontWeight: "700", fontSize: 12 }}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => (
            <DocRow
              doc={item}
              busy={busyId === item.id}
              onApprove={() => verify(item, "VERIFIED")}
              onReject={() => promptReject(item)}
            />
          )}
          ListEmptyComponent={
            <View style={[styles.empty, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textMuted, textAlign: "center" }}>
                No documents {filter === "ALL" ? "" : `in ${filter}`}.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const DocRow: React.FC<{
  doc: AdminDocument;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
}> = ({ doc, busy, onApprove, onReject }) => {
  const { colors } = useTheme();
  const tc =
    doc.status === "VERIFIED" ? colors.success : doc.status === "REJECTED" ? colors.danger : colors.warning;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontWeight: "800", fontSize: 15 }}>{doc.fileName}</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
            user: {doc.ownerUserId} · tag: {doc.tag}
            {doc.sizeBytes ? ` · ${(doc.sizeBytes / 1024).toFixed(1)} KB` : ""}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>
            {new Date(doc.createdAt).toLocaleString("en-IN")}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: radii.pill,
            backgroundColor: tc + "22",
            borderWidth: 1,
            borderColor: tc,
          }}
        >
          <Text style={{ color: tc, fontWeight: "800", fontSize: 11 }}>{doc.status}</Text>
        </View>
      </View>

      {doc.rejectionReason ? (
        <Text style={{ color: colors.danger, fontSize: 12, marginTop: spacing.sm }}>
          Reason: {doc.rejectionReason}
        </Text>
      ) : null}

      {doc.status === "UPLOADED" ? (
        <View style={styles.actionRow}>
          <Pressable
            onPress={onApprove}
            disabled={busy}
            style={[styles.actionBtn, { backgroundColor: colors.success }]}
            accessibilityLabel={`approve-${doc.id}`}
          >
            {busy ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "800" }}>✓ Approve</Text>}
          </Pressable>
          <Pressable
            onPress={onReject}
            disabled={busy}
            style={[styles.actionBtn, { backgroundColor: "transparent", borderWidth: 2, borderColor: colors.danger }]}
            accessibilityLabel={`reject-${doc.id}`}
          >
            <Text style={{ color: colors.danger, fontWeight: "800" }}>✕ Reject</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.pill, borderWidth: 1 },
  card: { padding: spacing.md, borderRadius: radii.lg, borderWidth: 1 },
  actionRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radii.pill,
    alignItems: "center",
  },
  empty: { padding: spacing.xl, borderRadius: radii.lg, borderWidth: 1, borderStyle: "dashed" },
});
