import React, { useMemo, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CheckCircle2, ArrowLeft } from "lucide-react-native";
import Toast from "react-native-toast-message";

import { SignupOptionsList } from "../../../../components/SignupOptionsList";
import { RootStackParamList } from "../../../../../App";
import { useTheme } from "../../../../theme/ThemeProvider";
import { radii, spacing, typography } from "../../../../theme/colors";
import {
  fetchPartnerProfile,
  PartnerProfile,
  uploadDocument,
  fetchMyDocuments,
  MyDocument,
} from "../../../../api/credupe";
import * as DocumentPicker from "expo-document-picker";

type Props = NativeStackScreenProps<RootStackParamList, "SignupSelection">;

export const SignupSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const options = useMemo(
    () => ["Proprietorship", "Individual", "Partnership", "Pvt Ltd"],
    []
  );

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [isKycComplete, setIsKycComplete] = useState(false);
  const [docs, setDocs] = useState<MyDocument[]>([]);

  useEffect(() => {
    fetchPartnerProfile()
      .then((res) => {
        if (res.success && res.data?.profile) {
          const profile = res.data.profile;
          setPartnerProfile(profile);
          if (profile.kycStatus === "VERIFIED" || profile.kycStatus === "REJECTED" || profile.onboardingStep === "COMPLETE" || profile.onboardingStep === "KYC_DOCS") {
            setIsKycComplete(true);
          }
        }
        return fetchMyDocuments();
      })
      .then((r) => {
        if (r && r.success && r.data?.items) {
          setDocs(r.data.items);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSelect = (value: string) => setSelectedOption(value);

  const handleContinue = () => {
    if (!selectedOption) return;
    navigation.navigate("SignupBasicDetails", { businessType: selectedOption });
  };

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
        const res = await fetchPartnerProfile();
        if (res.success && res.data?.profile) {
          setPartnerProfile(res.data.profile);
        }
        const r = await fetchMyDocuments();
        if (r.success && r.data?.items) {
          setDocs(r.data.items);
        }
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: error.message || "Failed to re-upload. Please try again.",
      });
    } finally {
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

  if (isKycComplete) {
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
                if (navigation.getState().routeNames.includes("Main")) {
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
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.safeArea} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Image source={require("../../../../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.title, typography.h1, { color: colors.text }]}>Create your account</Text>
            <Text style={[styles.subtitle, typography.body, { color: colors.textMuted }]}>Choose one business type to continue</Text>
          </View>

          <View style={styles.listWrap}>
            <SignupOptionsList
              options={options}
              selectedOption={selectedOption}
              onSelect={handleSelect}
            />
          </View>

          <Pressable
            style={[
              styles.continueBtn,
              {
                backgroundColor: colors.primary,
                opacity: selectedOption ? 1 : 0.6,
              },
            ]}
            disabled={!selectedOption}
            onPress={handleContinue}
          >
            <Text style={[styles.continueText, { color: colors.textInverted }]}>Continue</Text>
            <Text style={[styles.continueArrow, { color: colors.textInverted }]}>→</Text>
          </Pressable>

        
        </ScrollView>
      </KeyboardAvoidingView>
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
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logo: {
    width: 74,
    height: 74,
    marginBottom: spacing.md,
  },
  title: {
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  subtitle: {
    textAlign: "center",
  },
  listWrap: {
    marginBottom: spacing.lg,
  },
  continueBtn: {
    borderRadius: radii.pill,
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  continueText: {
    fontSize: 18,
    fontWeight: "800",
  },
  continueArrow: {
    position: "absolute",
    right: spacing.xl,
    fontSize: 22,
    fontWeight: "700",
  },
  signinRow: {
    marginTop: spacing.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signinText: {
    ...typography.body,
  },
  signinLink: {
    ...typography.body,
    fontWeight: "800",
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
    marginBottom: 8,
  },
  completeSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    width: "100%",
    marginBottom: 20,
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
    backgroundColor: "#EAFBF0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E9E52",
  },
  verifiedBadgeText: {
    color: "#1E9E52",
    fontSize: 11,
    fontWeight: "800",
  },
  badgeSuccess: {
    backgroundColor: "#EAFBF0",
    borderColor: "#1E9E52",
  },
  badgeWarning: {
    backgroundColor: "#FFF9E6",
    borderColor: "#F5A623",
  },
  badgeDanger: {
    backgroundColor: "#FCE8E6",
    borderColor: "#E74C3C",
  },
  textSuccess: {
    color: "#1E9E52",
  },
  textWarning: {
    color: "#F5A623",
  },
  textDanger: {
    color: "#E74C3C",
  },
  buttonWrap: {
    marginTop: 32,
  },
  backDashboardBtn: {
    height: 58,
    borderRadius: 30,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  backDashboardBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
