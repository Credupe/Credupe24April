import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CustomerProfile,
  DocumentTag,
  fetchMyDocuments,
  fetchMyProfile,
  MyDocument,
  patchMyProfile,
  uploadDocument,
} from "../api/credupe";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";

interface Props {
  onBack: () => void;
}

interface UploadSlot {
  tag: DocumentTag;
  label: string;
  caption: string;
  accept: "image" | "doc";
}

const SLOTS: UploadSlot[] = [
  { tag: "KYC", label: "PAN card", caption: "Front side, clear photo", accept: "image" },
  { tag: "KYC", label: "Aadhaar card", caption: "Front + back (or e-Aadhaar PDF)", accept: "doc" },
  { tag: "KYC", label: "Selfie", caption: "Face clearly visible, good light", accept: "image" },
  { tag: "INCOME", label: "Income proof", caption: "Latest 3 payslips OR Form 16", accept: "doc" },
  { tag: "BANK_STATEMENT", label: "Bank statement", caption: "Last 6 months, PDF", accept: "doc" },
];

const STATUS_COLOR: Record<string, "success" | "warning" | "danger"> = {
  VERIFIED: "success",
  UPLOADED: "warning",
  PENDING: "warning",
  REJECTED: "danger",
};

export const KycScreen: React.FC<Props> = ({ onBack }) => {
  const { colors } = useTheme();
  const [profile, setProfile] = useState<CustomerProfile>({});
  const [docs, setDocs] = useState<MyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingTag, setUploadingTag] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [p, d] = await Promise.all([fetchMyProfile(), fetchMyDocuments()]);
    setProfile(p.success && p.data?.profile ? p.data.profile : {});
    setDocs(d.success && d.data?.items ? d.data.items : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onChange = (key: keyof CustomerProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const saveProfile = useCallback(async () => {
    setSaving(true);
    const monthlyIncome = profile.monthlyIncome
      ? Number(profile.monthlyIncome)
      : undefined;
    const r = await patchMyProfile({ ...profile, monthlyIncome });
    setSaving(false);
    if (!r.success) {
      Toast.show({
        type: "error",
        text1: "Could not save",
        text2: r.error?.message?.join("\n") ?? "Try again",
      });
      return;
    }
    Toast.show({
      type: "success",
      text1: "Saved",
      text2: "Your KYC details have been updated.",
    });
    refresh();
  }, [profile, refresh]);

  const pickAndUpload = useCallback(
    async (slot: UploadSlot, slotIndex: number) => {
      setUploadingTag(`${slot.tag}-${slotIndex}`);
      try {
        let asset:
          | { uri: string; name?: string; mimeType?: string; size?: number }
          | undefined;

        if (slot.accept === "image") {
          const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (Platform.OS !== "web" && !perm.granted) {
            Toast.show({
              type: "error",
              text1: "Permission needed",
              text2: "Grant photo-library access to upload.",
            });
            return;
          }
          const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.85,
            allowsEditing: false,
          });
          if (res.canceled || !res.assets?.[0]) return;
          const a = res.assets[0];
          asset = {
            uri: a.uri,
            name: a.fileName ?? `${slot.label.toLowerCase().replace(/\s+/g, "-")}.jpg`,
            mimeType: a.mimeType ?? "image/jpeg",
            size: a.fileSize,
          };
        } else {
          const res = await DocumentPicker.getDocumentAsync({
            type: ["application/pdf", "image/*"],
            multiple: false,
            copyToCacheDirectory: true,
          });
          if (res.canceled || !res.assets?.[0]) return;
          const a = res.assets[0];
          asset = {
            uri: a.uri,
            name: a.name,
            mimeType: a.mimeType ?? "application/octet-stream",
            size: a.size,
          };
        }

        if (!asset) return;

        // Convert the local URI to a Blob (works on both web & native)
        const blob = await (await fetch(asset.uri)).blob();
        const result = await uploadDocument(
          blob,
          asset.name ?? "upload.bin",
          slot.tag,
        );
        if (!result.ok) {
          Toast.show({
            type: "error",
            text1: "Upload failed",
            text2: result.error ?? "Unknown error",
          });
          return;
        }
        Toast.show({
          type: "success",
          text1: "Uploaded",
          text2: `${slot.label} added to your KYC.`,
        });
        refresh();
      } finally {
        setUploadingTag(null);
      }
    },
    [refresh],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={onBack} accessibilityLabel="back-btn">
          <Text style={{ color: colors.primary, fontWeight: "700" }}>‹ Back</Text>
        </Pressable>

        <Text style={[typography.h1, { color: colors.text, marginTop: spacing.md }]}>KYC &amp; Documents</Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>
          Lenders need these to approve your loan. Your data is encrypted at rest.
        </Text>

        {/* KYC status badge */}
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: colors.cardElevated,
              borderColor:
                profile.kycStatus === "VERIFIED"
                  ? colors.success
                  : profile.kycStatus === "REJECTED"
                  ? colors.danger
                  : colors.primary,
            },
          ]}
        >
          <Text style={[typography.micro, { color: colors.textMuted }]}>KYC STATUS</Text>
          <Text style={{ color: colors.text, fontWeight: "800", fontSize: 22, marginTop: 2 }}>
            {profile.kycStatus ?? "PENDING"}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          <>
            {/* Personal details */}
            <Section title="Personal details">
              <Field label="First name" value={profile.firstName ?? ""} onChange={(v) => onChange("firstName", v)} testID="first-name" />
              <Field label="Last name" value={profile.lastName ?? ""} onChange={(v) => onChange("lastName", v)} testID="last-name" />
              <Row>
                <Field label="DOB (YYYY-MM-DD)" value={profile.dob ?? ""} onChange={(v) => onChange("dob", v)} testID="dob" />
                <Field label="Gender (M/F/O)" value={profile.gender ?? ""} onChange={(v) => onChange("gender", v.toUpperCase().slice(0, 1))} testID="gender" />
              </Row>
            </Section>

            {/* Address */}
            <Section title="Address">
              <Field label="City" value={profile.city ?? ""} onChange={(v) => onChange("city", v)} />
              <Row>
                <Field label="State" value={profile.state ?? ""} onChange={(v) => onChange("state", v)} />
                <Field label="Pincode" value={profile.pincode ?? ""} onChange={(v) => onChange("pincode", v)} keyboard="number-pad" />
              </Row>
            </Section>

            {/* Identity */}
            <Section title="Identity (last 4 digits only)">
              <Row>
                <Field label="PAN last 4" value={profile.panLast4 ?? ""} onChange={(v) => onChange("panLast4", v.toUpperCase().slice(0, 4))} testID="pan-last4" />
                <Field label="Aadhaar last 4" value={profile.aadhaarLast4 ?? ""} onChange={(v) => onChange("aadhaarLast4", v.slice(0, 4))} keyboard="number-pad" testID="aadhaar-last4" />
              </Row>
            </Section>

            {/* Employment */}
            <Section title="Employment &amp; income">
              <Field label="Employment type (SALARIED / SELF_EMP / ...)" value={profile.employmentType ?? ""} onChange={(v) => onChange("employmentType", v.toUpperCase())} />
              <Field label="Employer name" value={profile.employerName ?? ""} onChange={(v) => onChange("employerName", v)} />
              <Field label="Monthly income (₹)" value={String(profile.monthlyIncome ?? "")} onChange={(v) => onChange("monthlyIncome" as any, v)} keyboard="number-pad" />
              <Field label="CIBIL range (e.g. 700-749)" value={profile.cibilRange ?? ""} onChange={(v) => onChange("cibilRange", v)} />
            </Section>

            <Pressable
              onPress={saveProfile}
              disabled={saving}
              style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: saving ? 0.7 : 1 }]}
              accessibilityLabel="save-kyc-btn"
            >
              {saving ? (
                <ActivityIndicator color={colors.textInverted} />
              ) : (
                <Text style={{ color: colors.textInverted, fontWeight: "800", fontSize: 16 }}>
                  Save KYC details
                </Text>
              )}
            </Pressable>

            {/* Document slots */}
            <Section title="Upload documents">
              {SLOTS.map((slot, i) => {
                const matched = docs.find((d) => d.tag === slot.tag && d.fileName.toLowerCase().includes(slot.label.split(" ")[0].toLowerCase()));
                const busy = uploadingTag === `${slot.tag}-${i}`;
                return (
                  <UploadRow
                    key={`${slot.label}-${i}`}
                    slot={slot}
                    doc={matched}
                    busy={busy}
                    onPick={() => pickAndUpload(slot, i)}
                  />
                );
              })}
            </Section>

            {/* All my docs */}
            {docs.length > 0 && (
              <Section title="All uploaded files">
                {docs.map((d) => (
                  <View
                    key={d.id}
                    style={[styles.docRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.text, fontWeight: "700" }}>{d.fileName}</Text>
                      <Text style={{ color: colors.textMuted, fontSize: 12 }}>{d.tag}</Text>
                    </View>
                    <StatusPill status={d.status} />
                  </View>
                ))}
              </Section>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const { colors } = useTheme();
  return (
    <View style={{ marginTop: spacing.xxl }}>
      <Text style={[typography.micro, { color: colors.textMuted, marginBottom: spacing.sm }]}>
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
};

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={{ flexDirection: "row", gap: spacing.md }}>
    {React.Children.map(children, (c, i) => (
      <View key={i} style={{ flex: 1 }}>
        {c}
      </View>
    ))}
  </View>
);

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboard?: "default" | "number-pad" | "decimal-pad";
  testID?: string;
}> = ({ label, value, onChange, keyboard = "default", testID }) => {
  const { colors } = useTheme();
  return (
    <View style={{ marginTop: spacing.sm }}>
      <Text style={[typography.caption, { color: colors.textMuted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard}
        testID={testID}
        style={[
          styles.input,
          { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
        ]}
      />
    </View>
  );
};

const UploadRow: React.FC<{
  slot: UploadSlot;
  doc?: MyDocument;
  busy: boolean;
  onPick: () => void;
}> = ({ slot, doc, busy, onPick }) => {
  const { colors } = useTheme();
  const uploaded = !!doc;
  return (
    <Pressable
      onPress={onPick}
      disabled={busy}
      style={[
        styles.uploadRow,
        {
          backgroundColor: colors.card,
          borderColor: uploaded ? colors.success : colors.border,
        },
      ]}
      accessibilityLabel={`upload-${slot.label}`}
    >
      <View
        style={[
          styles.uploadIcon,
          { backgroundColor: uploaded ? colors.success : colors.primaryMuted, borderColor: uploaded ? colors.success : colors.primary },
        ]}
      >
        <Text style={{ color: uploaded ? colors.textInverted : colors.primary, fontSize: 20, fontWeight: "800" }}>
          {uploaded ? "✓" : "+"}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: "700" }}>{slot.label}</Text>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>
          {doc ? doc.fileName : slot.caption}
        </Text>
      </View>
      {busy ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Text style={{ color: colors.primary, fontWeight: "700" }}>
          {uploaded ? "Replace" : "Upload"}
        </Text>
      )}
    </Pressable>
  );
};

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const { colors } = useTheme();
  const tone = STATUS_COLOR[status] ?? "warning";
  const c = tone === "success" ? colors.success : tone === "danger" ? colors.danger : colors.warning;
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: radii.pill,
        backgroundColor: c + "22",
        borderWidth: 1,
        borderColor: c,
      }}
    >
      <Text style={{ color: c, fontWeight: "800", fontSize: 11 }}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 2,
  },
  input: {
    marginTop: 4,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
  },
  saveBtn: {
    marginTop: spacing.xl,
    paddingVertical: 14,
    borderRadius: radii.pill,
    alignItems: "center",
  },
  uploadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 2,
    marginBottom: spacing.sm,
  },
  uploadIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.xs,
  },
});
