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
  Modal,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AdminApplication,
  APPLICATION_STATUSES,
  ApplicationStatus,
  fetchAdminApplications,
  fetchApplicationDetails,
  transitionApplication,
} from "../../../api/credupe";
import { inr } from "../../../lib/format";
import { useTheme } from "../../../theme/ThemeProvider";
import { radii, spacing, typography } from "../../../theme/colors";

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

  // Modal and details states
  const [selectedApp, setSelectedApp] = useState<AdminApplication | null>(null);
  const [details, setDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
        Toast.show({
          type: "error",
          text1: "Could not transition",
          text2: r.error?.message?.join("\n") ?? "Try again",
        });
        return;
      }
      // If modal is visible and viewing the same app, refresh details
      if (selectedApp && selectedApp.id === app.id) {
        try {
          const res = await fetchApplicationDetails(app.id);
          if (res.success && res.data) {
            setDetails(res.data);
          }
        } catch (e) {
          // ignore
        }
      }
      load(statusFilter);
    },
    [load, statusFilter, selectedApp],
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

  const handleViewDetails = useCallback(async (app: AdminApplication) => {
    setSelectedApp(app);
    setModalVisible(true);
    setLoadingDetails(true);
    setDetails(null);
    try {
      const res = await fetchApplicationDetails(app.id);
      if (res.success && res.data) {
        setDetails(res.data);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: res.error?.message?.join("\n") ?? "Could not load application details",
        });
      }
    } catch (e) {
      console.warn("Error fetching application details:", e);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Network request failed. Try again.",
      });
    } finally {
      setLoadingDetails(false);
    }
  }, []);

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
                onPress={() => handleViewDetails(item)}
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

      {/* Application Details Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Application Details</Text>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={{ color: colors.textMuted, fontSize: 18, fontWeight: "700" }}>✕</Text>
              </Pressable>
            </View>

            {loadingDetails ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.xl }} />
            ) : details ? (
              <ScrollView contentContainerStyle={{ padding: spacing.lg }} showsVerticalScrollIndicator={false}>
                {/* Meta details */}
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Application Info</Text>
                  <DetailRow label="Reference No" value={details.referenceNo} />
                  <DetailRow label="Loan Type" value={details.loanType?.replace(/_/g, " ")} />
                  <DetailRow label="Amount" value={inr(details.amount)} />
                  <DetailRow label="Tenure" value={`${details.tenureMonths} Months`} />
                  <DetailRow label="Status" value={details.status} highlight valueColor={STATUS_TONE[details.status] ?? "primary"} />
                  <DetailRow label="Created At" value={new Date(details.createdAt).toLocaleDateString("en-IN")} />
                </View>

                {/* Form data details */}
                {details.formData ? (
                  <View style={[styles.section, { marginTop: spacing.md }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Customer Form Details</Text>
                    <DetailRow label="First Name" value={details.formData.firstName} />
                    <DetailRow label="Last Name" value={details.formData.lastName} />
                    <DetailRow label="Mobile No" value={details.formData.mobile} />
                    <DetailRow label="DOB" value={details.formData.dob} />
                    <DetailRow label="PAN" value={details.formData.pan} />
                    <DetailRow label="Gender" value={details.formData.gender} />
                    <DetailRow label="Father's First Name" value={details.formData.fathersFirstName} />
                    <DetailRow label="Father's Last Name" value={details.formData.fathersLastName} />
                    <DetailRow label="Address Line 1" value={details.formData.addressLine1} />
                    <DetailRow label="Address Line 2" value={details.formData.addressLine2} />
                    <DetailRow label="Pincode" value={details.formData.pincode} />
                    <DetailRow label="Employment Type" value={details.formData.employmentType} />
                    {details.formData.bankName && <DetailRow label="Lender Bank" value={details.formData.bankName} />}
                  </View>
                ) : (
                  <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: spacing.md, fontStyle: "italic" }}>
                    No form data found for this application.
                  </Text>
                )}

                {/* History details */}
                {details.history && details.history.length > 0 ? (
                  <View style={[styles.section, { marginTop: spacing.md, borderBottomWidth: 0 }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Status History</Text>
                    {details.history.map((h: any, index: number) => (
                      <View key={index} style={{ marginBottom: spacing.xs }}>
                        <Text style={{ color: colors.text, fontSize: 12, fontWeight: "700" }}>
                          {h.from ? `${h.from} → ` : ""}{h.to}
                        </Text>
                        {h.note && <Text style={{ color: colors.textMuted, fontSize: 11 }}>{h.note}</Text>}
                        <Text style={{ color: colors.textMuted, fontSize: 10, marginTop: 1 }}>
                          {new Date(h.at).toLocaleString("en-IN")}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : null}

                {/* Transition Action Button */}
                <Pressable
                  onPress={() => {
                    if (selectedApp) {
                      promptTransition({
                        ...selectedApp,
                        status: details.status as any,
                      });
                    }
                  }}
                  style={[styles.actionButton, { backgroundColor: colors.primary, marginTop: spacing.lg }]}
                >
                  <Text style={{ color: colors.textInverted, fontWeight: "700", fontSize: 14 }}>
                    Change Status
                  </Text>
                </Pressable>
              </ScrollView>
            ) : (
              <View style={{ padding: spacing.xl }}>
                <Text style={{ color: colors.textMuted, textAlign: "center" }}>Failed to load details.</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const DetailRow: React.FC<{
  label: string;
  value?: string | number | null;
  highlight?: boolean;
  valueColor?: "success" | "warning" | "danger" | "primary";
}> = ({ label, value, highlight, valueColor }) => {
  const { colors } = useTheme();
  const tc =
    valueColor === "success"
      ? colors.success
      : valueColor === "danger"
        ? colors.danger
        : valueColor === "warning"
          ? colors.warning
          : colors.primary;

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}>
      <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: "500" }}>{label}</Text>
      <Text
        style={{
          color: highlight ? tc : colors.text,
          fontSize: 13,
          fontWeight: highlight ? "800" : "600",
          flex: 1,
          textAlign: "right",
          paddingLeft: 12,
        }}
        numberOfLines={2}
      >
        {value ?? "—"}
      </Text>
    </View>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  closeButton: {
    padding: 6,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: spacing.sm,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
  },
});
