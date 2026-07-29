import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CheckCircle2, ArrowLeft } from "lucide-react-native";
import Toast from "react-native-toast-message";
import * as DocumentPicker from "expo-document-picker";

import { useTheme } from "../../../../theme/ThemeProvider";
import { radii, spacing, typography } from "../../../../theme/colors";
import {
  fetchPartnerProfile,
  PartnerProfile,
  uploadDocument,
  fetchMyDocuments,
  MyDocument,
} from "../../../../api/credupe";

export const PartnerKycStatusScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [docs, setDocs] = useState<MyDocument[]>([]);

  const loadData = async () => {
    try {
      const res = await fetchPartnerProfile();
      if (res.success && res.data?.profile) {
        setPartnerProfile(res.data.profile);
      }
      const r = await fetchMyDocuments();
      if (r && r.success && r.data?.items) {
        setDocs(r.data.items);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReupload = async (doc: MyDocument) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf,image/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setLoading(true);

        const response = await fetch(asset.uri);
        const blob = await response.blob();
        const uploadRes = await uploadDocument(blob, doc.fileName, doc.tag, undefined, doc.documentName || doc.fileName);
        if (!uploadRes.ok) {
          throw new Error(uploadRes.error || "Failed to upload file");
        }

        Toast.show({
          type: "success",
          text1: "Uploaded Successfully",
          text2: `${doc.documentName || doc.fileName} has been re-uploaded and is pending verification.`,
        });

        // Re-load profile and documents
        await loadData();
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: error.message || "Failed to re-upload. Please try again.",
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg, justifyContent: "center", alignItems: "center" }]} edges={["top", "bottom"]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  // Derive status: if any doc is UPLOADED, override status to PENDING
  const anyPendingDoc = docs.some((d) => d.status === "UPLOADED");
  const rawStatus = partnerProfile?.kycStatus || "PENDING";
  const kycStatus = anyPendingDoc ? "PENDING" : rawStatus;

  const headerSubtext = kycStatus === "VERIFIED" ? "Verification Complete" : kycStatus === "REJECTED" ? "Action Required" : "Verification Pending";
  const completeTitle = kycStatus === "VERIFIED" ? "KYC Complete" : kycStatus === "REJECTED" ? "KYC Rejected" : "Verification Pending";
  const completeSubtitle = kycStatus === "VERIFIED"
    ? "Your KYC verification is complete. Your account has been verified, enabling full partner access."
    : kycStatus === "REJECTED"
    ? "Some of your documents were rejected. Please review them below and re-upload correct versions to continue."
    : "Your uploaded documents are currently being reviewed by our administrative team. We will update you shortly.";

  const statusBadgeColor = kycStatus === "VERIFIED" ? "#10B981" : kycStatus === "REJECTED" ? "#EF4444" : "#F59E0B";

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <View style={styles.headerContainer}>
        <Pressable onPress={navigation.goBack} hitSlop={12} style={styles.headerBackBtn}>
          <ArrowLeft size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitleText, { color: colors.text }]}>KYC &amp; Documents</Text>
          <Text style={[styles.headerSubtext, { color: colors.textMuted }]}>{headerSubtext}</Text>
        </View>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: colors.bg, justifyContent: "center", alignItems: "stretch", paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.completeCard}>
          <View style={styles.completeIconContainer}>
            <View style={styles.completeGlowBgCircle} />
            <CheckCircle2 size={64} color={statusBadgeColor} />
          </View>

          <Text style={styles.completeTitle}>{completeTitle}</Text>
          <Text style={styles.completeSubtitle}>
            {completeSubtitle}
          </Text>

          <View style={styles.divider} />

          {/* Document list */}
          {docs.length > 0 && (
            <View style={{ width: "100%", marginBottom: 16 }}>
              <Text style={{ fontSize: 15, fontWeight: "800", color: colors.text, alignSelf: "flex-start", marginBottom: 12 }}>
                Documents Status
              </Text>
              <View style={{ gap: 10 }}>
                {docs.map((doc) => {
                  const isRejected = doc.status === "REJECTED";
                  const isVerified = doc.status === "VERIFIED";
                  const docBadgeColor = isVerified ? "#10B981" : isRejected ? "#EF4444" : "#F59E0B";

                  return (
                    <View
                      key={doc.id}
                      style={{
                        padding: 12,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: colors.border,
                        backgroundColor: colors.card,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={{ color: colors.text, fontWeight: "700", fontSize: 13 }} numberOfLines={1}>
                          {doc.documentName || doc.fileName}
                        </Text>
                        <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>
                          Type: {doc.tag} {doc.rejectionReason ? `· Reason: ${doc.rejectionReason}` : ""}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: radii.pill,
                            backgroundColor: docBadgeColor + "15",
                            borderWidth: 1,
                            borderColor: docBadgeColor,
                          }}
                        >
                          <Text style={{ color: docBadgeColor, fontWeight: "800", fontSize: 9 }}>{doc.status}</Text>
                        </View>
                        {isRejected && (
                          <Pressable
                            onPress={() => handleReupload(doc)}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 6,
                              borderRadius: 6,
                              backgroundColor: colors.primary,
                            }}
                          >
                            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 11 }}>Reupload</Text>
                          </Pressable>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
              <View style={[styles.divider, { marginTop: 20 }]} />
            </View>
          )}

          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Business Name</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{partnerProfile?.businessName || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Partner Code</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{partnerProfile?.partnerCode || "N/A"}</Text>
            </View>
            {partnerProfile?.contactPerson ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Contact Person</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{partnerProfile.contactPerson}</Text>
              </View>
            ) : null}
            {partnerProfile?.panLast4 ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>PAN Card</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>******{partnerProfile.panLast4}</Text>
              </View>
            ) : null}
            {partnerProfile?.aadhaarLast4 ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Aadhaar Card</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>********{partnerProfile.aadhaarLast4}</Text>
              </View>
            ) : null}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <View style={[
                styles.verifiedBadge,
                kycStatus === "VERIFIED" ? styles.badgeSuccess :
                kycStatus === "REJECTED" ? styles.badgeDanger :
                styles.badgeWarning
              ]}>
                <Text style={[
                  styles.verifiedBadgeText,
                  kycStatus === "VERIFIED" ? styles.textSuccess :
                  kycStatus === "REJECTED" ? styles.textDanger :
                  styles.textWarning
                ]}>{kycStatus}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonWrap}>
          <Pressable
            onPress={() => {
              const state = navigation.getState();
              if (state && state.routeNames.includes("Main")) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Main" as never }],
                });
              } else {
                navigation.goBack();
              }
            }}
            style={styles.backDashboardBtn}
          >
            <Text style={styles.backDashboardBtnText}>BACK TO DASHBOARD</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FAFAFC",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#E5E7EB",
    borderWidth: 1,
  },
  headerTitleWrap: {
    flex: 1,
    paddingLeft: 16,
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: "700",
  },
  headerSubtext: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
  headerRightSpacer: {
    width: 40,
  },
  completeCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 20,
  },
  completeIconContainer: {
    position: "relative",
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  completeGlowBgCircle: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  completeSubtitle: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  infoList: {
    width: "100%",
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  verifiedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  verifiedBadgeText: {
    fontSize: 12,
    fontWeight: "800",
  },
  badgeSuccess: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderColor: "#10B981",
  },
  badgeDanger: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "#EF4444",
  },
  badgeWarning: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderColor: "#F59E0B",
  },
  textSuccess: {
    color: "#10B981",
  },
  textDanger: {
    color: "#EF4444",
  },
  textWarning: {
    color: "#F59E0B",
  },
  buttonWrap: {
    marginTop: 24,
  },
  backDashboardBtn: {
    backgroundColor: "#7C3AED",
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  backDashboardBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
