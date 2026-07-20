import React, { useCallback, useEffect, useState, useMemo } from "react";
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
  Modal,
  Image,
  Linking,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AdminDocument,
  fetchAdminDocuments,
  verifyDocument,
  getDocumentViewUrl,
  getDocumentViewHeaders,
} from "../../../api/credupe";
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

    const [selectedDoc, setSelectedDoc] = useState<AdminDocument | null>(null);
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);

  const handleViewDoc = async (doc: AdminDocument) => {
    const h = await getDocumentViewHeaders();
    setHeaders(h);
    setSelectedDoc(doc);
  };

  const load = useCallback(async (f: Filter) => {
    setLoading(true);
    const r = await fetchAdminDocuments(f === "ALL" ? {} : { status: f });
    setItems(r.success && r.data?.items ? r.data.items : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(filter);
  }, [load, filter]);

  // Group documents by ownerUserId
  const groupedUsers = useMemo(() => {
    const map: Record<string, { userId: string; name: string; docs: AdminDocument[] }> = {};
    for (const item of items) {
      const uid = item.ownerUserId;
      if (!map[uid]) {
        map[uid] = {
          userId: uid,
          name: item.ownerName || item.ownerUserId,
          docs: [],
        };
      }
      map[uid].docs.push(item);
    }
    return Object.values(map);
  }, [items]);

  const verify = useCallback(
    async (doc: AdminDocument, status: "VERIFIED" | "REJECTED", reason?: string) => {
      setBusyId(doc.id);
      const r = await verifyDocument(doc.id, status, reason);
      setBusyId(null);
      if (!r.success) {
        Toast.show({
          type: "error",
          text1: "Action failed",
          text2: r.error?.message?.join("\n") ?? "Try again",
        });
        return;
      }
      load(filter);
    },
    [filter, load],
  );

  const handleApproveAll = async (userGroup: typeof groupedUsers[number]) => {
    setLoading(true);
    try {
      const pendingDocs = userGroup.docs.filter((d) => d.status === "UPLOADED");
      for (const doc of pendingDocs) {
        const r = await verifyDocument(doc.id, "VERIFIED");
        if (!r.success) {
          throw new Error(`Failed to approve ${doc.fileName}: ${r.error?.message?.join("\n")}`);
        }
      }
      Toast.show({
        type: "success",
        text1: "Approved All",
        text2: "All pending documents for this user have been approved.",
      });
      await load(filter);
      setViewingUserId(null);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to process some documents",
      });
      load(filter);
    }
  };

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

    if (viewingUserId) {
    const userGroup = groupedUsers.find((g) => g.userId === viewingUserId);
    if (!userGroup) {
      setViewingUserId(null);
      return null;
    }

    const pendingDocs = userGroup.docs.filter((d) => d.status === "UPLOADED");

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
        <View style={{ padding: spacing.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Pressable onPress={() => setViewingUserId(null)} hitSlop={12}>
            <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 16 }}>‹ Back to Queue</Text>
          </Pressable>
          <Text style={{ color: colors.text, flex: 1, textAlign: "center", marginHorizontal: 8, fontSize: 18, fontWeight: "800" }} numberOfLines={1}>
            {userGroup.name}
          </Text>
          <View style={{ width: 80 }} /> {/* spacer */}
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}>
          {pendingDocs.length > 0 && (
            <Pressable
              onPress={() => handleApproveAll(userGroup)}
              style={[styles.approveAllBtn, { backgroundColor: colors.success, marginBottom: spacing.md }]}
            >
              <Text style={styles.approveAllText}>✓ Accept All Pending ({pendingDocs.length})</Text>
            </Pressable>
          )}

          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: "800", marginBottom: spacing.sm }}>
            DOCUMENTS UPLOADED BY THIS USER
          </Text>

          <View style={{ gap: spacing.md }}>
            {userGroup.docs.map((doc) => {
              const tc = doc.status === "VERIFIED" ? colors.success : doc.status === "REJECTED" ? colors.danger : colors.warning;
              return (
                <View key={doc.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Pressable onPress={() => handleViewDoc(doc)}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={{ color: colors.text, fontWeight: "800", fontSize: 15 }}>{doc.documentName || doc.fileName}</Text>
                        <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>
                          tag: {doc.tag} · size: {doc.sizeBytes ? `${(doc.sizeBytes / 1024).toFixed(1)} KB` : "N/A"}
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
                  </Pressable>

                  {doc.rejectionReason ? (
                    <Text style={{ color: colors.danger, fontSize: 12, marginTop: spacing.sm }}>
                      Reason: {doc.rejectionReason}
                    </Text>
                  ) : null}

                  {doc.status === "UPLOADED" && (
                    <View style={styles.actionRow}>
                      <Pressable
                        onPress={() => verify(doc, "VERIFIED")}
                        disabled={busyId === doc.id}
                        style={[styles.actionBtn, { backgroundColor: colors.success }]}
                      >
                        {busyId === doc.id ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "800" }}>✓ Approve</Text>}
                      </Pressable>
                      <Pressable
                        onPress={() => promptReject(doc)}
                        disabled={busyId === doc.id}
                        style={[styles.actionBtn, { backgroundColor: "transparent", borderWidth: 2, borderColor: colors.danger }]}
                      >
                        <Text style={{ color: colors.danger, fontWeight: "800" }}>✕ Reject</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Document Image Viewer Modal */}
        <Modal
          visible={!!selectedDoc}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedDoc(null)}
        >
          <SafeAreaView style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.bg }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalTitle, { color: colors.text }]} numberOfLines={1}>
                    {selectedDoc?.documentName || selectedDoc?.fileName || ""}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
                    Uploaded by: {selectedDoc?.ownerName || selectedDoc?.ownerUserId}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setSelectedDoc(null)}
                  style={[styles.modalCloseBtn, { backgroundColor: colors.border }]}
                  hitSlop={12}
                >
                  <Text style={{ color: colors.text, fontSize: 16, fontWeight: "800" }}>✕</Text>
                </Pressable>
              </View>

              <View style={styles.imageContainer}>
                {selectedDoc && (
                  selectedDoc.mimeType === "application/pdf" ||
                  selectedDoc.fileName.toLowerCase().endsWith(".pdf") ? (
                    <View style={styles.pdfFallbackContainer}>
                      <Text style={styles.pdfText}>PDF Document</Text>
                      <Text style={styles.pdfSubtext}>
                        This document is a PDF and cannot be previewed directly as an image.
                      </Text>
                      <Pressable
                        onPress={async () => {
                          const h = await getDocumentViewHeaders();
                          const token = h.Authorization ? h.Authorization.replace("Bearer ", "") : "";
                          const url = `${getDocumentViewUrl(selectedDoc.id)}?token=${token}`;
                          Linking.openURL(url);
                        }}
                        style={styles.openPdfBtn}
                      >
                        <Text style={styles.openPdfBtnText}>Open PDF in Browser</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Image
                      source={{
                        uri: getDocumentViewUrl(selectedDoc.id),
                        headers: headers,
                      }}
                      style={styles.docImage}
                      resizeMode="contain"
                    />
                  )
                )}
              </View>

              {selectedDoc && selectedDoc.status === "UPLOADED" && (
                <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                  <Pressable
                    onPress={() => {
                      const doc = selectedDoc;
                      setSelectedDoc(null);
                      verify(doc, "VERIFIED");
                    }}
                    style={[styles.modalActionBtn, { backgroundColor: colors.success }]}
                  >
                    <Text style={styles.modalActionText}>✓ Approve</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      const doc = selectedDoc;
                      setSelectedDoc(null);
                      promptReject(doc);
                    }}
                    style={[styles.modalActionBtn, { backgroundColor: "transparent", borderWidth: 2, borderColor: colors.danger }]}
                  >
                    <Text style={[styles.modalActionText, { color: colors.danger }]}>✕ Reject</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  }

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
          data={groupedUsers}
          keyExtractor={(u) => u.userId}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => {
            const pendingCount = item.docs.filter((d) => d.status === "UPLOADED").length;
            const totalCount = item.docs.length;
            return (
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>{item.name}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 4 }}>
                      {pendingCount} pending · {totalCount} total documents
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setViewingUserId(item.userId)}
                    style={[styles.actionBtn, { backgroundColor: colors.primary, maxWidth: 140, paddingVertical: 10 }]}
                  >
                    <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>View Documents</Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
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
  onPress: () => void;
}> = ({ doc, busy, onApprove, onReject, onPress }) => {
  const { colors } = useTheme();
  const tc =
    doc.status === "VERIFIED" ? colors.success : doc.status === "REJECTED" ? colors.danger : colors.warning;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Pressable onPress={onPress}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={{ color: colors.text, fontWeight: "800", fontSize: 15 }}>{doc.documentName || doc.fileName}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>
              user: <Text style={{ fontWeight: "800", color: colors.primary }}>{doc.ownerName || doc.ownerUserId}</Text> · tag: {doc.tag}
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
      </Pressable>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "85%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "#111827",
    alignItems: "stretch",
    justifyContent: "center",
    padding: 10,
  },
  docImage: {
    width: "100%",
    height: "100%",
  },
  modalFooter: {
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
  },
  modalActionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
    modalActionText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
  approveAllBtn: {
    paddingVertical: 14,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  approveAllText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },
  pdfFallbackContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  pdfText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  pdfSubtext: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  openPdfBtn: {
    backgroundColor: "#6D28D9",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  openPdfBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
});
