import * as DocumentPicker from "expo-document-picker";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { bulkCreateLeads } from "../api/credupe";
import { parseLeadsCsv, SAMPLE_CSV } from "../lib/csv";
import { inr } from "../lib/format";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";

interface Props {
  onBack: () => void;
  onDone: (createdCount: number) => void;
}

export const BulkLeadsImportScreen: React.FC<Props> = ({ onBack, onDone }) => {
  const { colors } = useTheme();
  const [csv, setCsv] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const parsed = useMemo(() => (csv.trim() ? parseLeadsCsv(csv) : null), [csv]);

  const pickFile = useCallback(async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["text/csv", "text/plain", "application/vnd.ms-excel"],
      multiple: false,
      copyToCacheDirectory: true,
    });
    if (res.canceled || !res.assets?.[0]) return;
    try {
      const txt = await (await fetch(res.assets[0].uri)).text();
      setCsv(txt);
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Could not read file",
        text2: String(e?.message ?? e),
      });
    }
  }, []);

  const submit = useCallback(async () => {
    if (!parsed?.valid.length) {
      Toast.show({
        type: "error",
        text1: "Nothing to upload",
        text2: "Paste a CSV with at least one valid row first.",
      });
      return;
    }
    setSubmitting(true);
    const r = await bulkCreateLeads(parsed.valid);
    setSubmitting(false);
    if (!r.success || !r.data) {
      Toast.show({
        type: "error",
        text1: "Upload failed",
        text2: r.error?.message?.join("\n") ?? "Try again",
      });
      return;
    }
    Toast.show({
      type: "success",
      text1: "Imported",
      text2: `${r.data.created} of ${parsed.valid.length} valid rows created.\n${parsed.invalid.length ? `${parsed.invalid.length} rows skipped.` : ""}`,
    });
    onDone(r.data.created);
  }, [parsed, onDone]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }} keyboardShouldPersistTaps="handled">
        <Pressable onPress={onBack} accessibilityLabel="back-btn">
          <Text style={{ color: colors.primary, fontWeight: "700" }}>‹ Back</Text>
        </Pressable>

        <Text style={[typography.h1, { color: colors.text, marginTop: spacing.md }]}>Bulk import leads</Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>
          Paste CSV or pick a .csv file. Required columns:{" "}
          <Text style={{ color: colors.primary, fontWeight: "700" }}>customerName, customerMobile, loanType</Text>.
        </Text>

        {/* Quick actions */}
        <View style={styles.actionRow}>
          <Pressable
            onPress={pickFile}
            style={[styles.outlineBtn, { borderColor: colors.primary }]}
            accessibilityLabel="pick-csv-btn"
          >
            <Text style={{ color: colors.primary, fontWeight: "800" }}>📄 Pick .csv file</Text>
          </Pressable>
          <Pressable
            onPress={() => setCsv(SAMPLE_CSV)}
            style={[styles.outlineBtn, { borderColor: colors.border }]}
            accessibilityLabel="load-sample-btn"
          >
            <Text style={{ color: colors.text, fontWeight: "700" }}>Load sample</Text>
          </Pressable>
        </View>

        {/* CSV textarea */}
        <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.lg, marginBottom: spacing.xs }]}>
          CSV content
        </Text>
        <TextInput
          value={csv}
          onChangeText={setCsv}
          multiline
          numberOfLines={10}
          placeholder="customerName,customerMobile,loanType,amount,city,notes&#10;Rohan,9810030001,PERSONAL_LOAN,500000,Mumbai,Walk-in"
          placeholderTextColor={colors.textMuted}
          style={[
            styles.textarea,
            { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
          ]}
          accessibilityLabel="csv-input"
        />

        {/* Preview */}
        {parsed ? (
          <>
            <View style={[styles.summary, { backgroundColor: colors.cardElevated, borderColor: colors.primary }]}>
              <Text style={[typography.micro, { color: colors.textMuted }]}>PARSE SUMMARY</Text>
              <View style={{ flexDirection: "row", gap: spacing.lg, marginTop: 4 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.success, fontSize: 24, fontWeight: "800" }}>{parsed.valid.length}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: "700", letterSpacing: 0.5 }}>READY</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: parsed.invalid.length ? colors.danger : colors.textMuted, fontSize: 24, fontWeight: "800" }}>
                    {parsed.invalid.length}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: "700", letterSpacing: 0.5 }}>SKIPPED</Text>
                </View>
              </View>
            </View>

            {parsed.valid.length > 0 && (
              <>
                <Text style={[typography.micro, { color: colors.textMuted, marginTop: spacing.lg, marginBottom: spacing.sm }]}>
                  PREVIEW (first {Math.min(5, parsed.valid.length)} of {parsed.valid.length})
                </Text>
                {parsed.valid.slice(0, 5).map((row, i) => (
                  <View key={i} style={[styles.previewRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={{ color: colors.text, fontWeight: "800" }}>{row.customerName}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                      {row.customerMobile} · {row.loanType.replace(/_/g, " ")}
                      {row.amount ? ` · ${inr(row.amount)}` : ""}
                      {row.city ? ` · ${row.city}` : ""}
                    </Text>
                  </View>
                ))}
              </>
            )}

            {parsed.invalid.length > 0 && (
              <>
                <Text style={[typography.micro, { color: colors.danger, marginTop: spacing.lg, marginBottom: spacing.sm }]}>
                  SKIPPED ROWS
                </Text>
                {parsed.invalid.slice(0, 5).map((bad, i) => (
                  <View key={i} style={[styles.errorRow, { borderColor: colors.danger }]}>
                    <Text style={{ color: colors.danger, fontWeight: "700", fontSize: 12 }}>
                      Row {bad.row}: {bad.reason}
                    </Text>
                    <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }} numberOfLines={1}>
                      {bad.raw}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </>
        ) : null}

        <Pressable
          onPress={submit}
          disabled={submitting || !parsed?.valid.length}
          style={[
            styles.cta,
            {
              backgroundColor: colors.primary,
              opacity: submitting || !parsed?.valid.length ? 0.5 : 1,
            },
          ]}
          accessibilityLabel="import-btn"
        >
          {submitting ? (
            <ActivityIndicator color={colors.textInverted} />
          ) : (
            <Text style={{ color: colors.textInverted, fontWeight: "800", fontSize: 16 }}>
              Import {parsed?.valid.length ?? 0} {parsed?.valid.length === 1 ? "lead" : "leads"}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  actionRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg },
  outlineBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radii.pill,
    borderWidth: 2,
    alignItems: "center",
  },
  textarea: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
    fontSize: 13,
    minHeight: 160,
    textAlignVertical: "top",
    fontFamily: "monospace",
  },
  summary: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 2,
  },
  previewRow: {
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.xs,
  },
  errorRow: {
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: "dashed",
    marginBottom: spacing.xs,
  },
  cta: {
    marginTop: spacing.xxl,
    paddingVertical: 16,
    borderRadius: radii.pill,
    alignItems: "center",
  },
});
