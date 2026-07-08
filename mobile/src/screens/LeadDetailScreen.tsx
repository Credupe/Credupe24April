import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { Lead, LEAD_STATUSES, LeadStatus, patchLead, scheduleLeadFollowUp } from "../api/credupe";
import { inr } from "../lib/format";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";

interface Props {
  lead: Lead;
  onBack: () => void;
  onUpdated: () => void;
}

export const LeadDetailScreen: React.FC<Props> = ({ lead, onBack, onUpdated }) => {
  const { colors } = useTheme();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingFu, setSavingFu] = useState(false);

  const callCustomer = useCallback(() => {
    Linking.openURL(`tel:${lead.customerMobile}`).catch(() =>
      Toast.show({ type: "error", text1: "Could not open dialler" }),
    );
  }, [lead.customerMobile]);

  const whatsappCustomer = useCallback(() => {
    const msg = `Hi ${lead.customerName}, this is CreduPe. About your ${lead.loanType.replace(/_/g, " ").toLowerCase()} enquiry…`;
    Linking.openURL(`https://wa.me/91${lead.customerMobile}?text=${encodeURIComponent(msg)}`).catch(() =>
      Toast.show({ type: "error", text1: "Could not open WhatsApp" }),
    );
  }, [lead]);

  const saveStatus = useCallback(async () => {
    setSavingStatus(true);
    const r = await patchLead(lead.id, { status, notes });
    setSavingStatus(false);
    if (!r.success) {
      Toast.show({
        type: "error",
        text1: "Save failed",
        text2: r.error?.message?.join("\n") ?? "Try again",
      });
      return;
    }
    Toast.show({
      type: "success",
      text1: "Updated",
      text2: "Lead status saved.",
    });
    onUpdated();
  }, [lead, status, notes, onUpdated]);

  const scheduleFu = useCallback(async () => {
    if (!followUpDate) {
      Toast.show({
        type: "error",
        text1: "Pick a date/time for the follow-up (ISO format).",
      });
      return;
    }
    setSavingFu(true);
    const r = await scheduleLeadFollowUp(lead.id, followUpDate, followUpNote || undefined);
    setSavingFu(false);
    if (!r.success) {
      Toast.show({
        type: "error",
        text1: "Schedule failed",
        text2: r.error?.message?.join("\n") ?? "Try again",
      });
      return;
    }
    Toast.show({
      type: "success",
      text1: "Scheduled",
      text2: "Follow-up reminder created.",
    });
    setFollowUpDate("");
    setFollowUpNote("");
  }, [lead, followUpDate, followUpNote]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <Pressable onPress={onBack} accessibilityLabel="back-btn">
          <Text style={{ color: colors.primary, fontWeight: "700" }}>‹ Back</Text>
        </Pressable>

        {/* Customer card */}
        <View style={[styles.customerCard, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
            <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 26 }}>
              {lead.customerName.slice(0, 1).toUpperCase()}
            </Text>
          </View>
          <Text style={[typography.h1, { color: colors.text, marginTop: spacing.md }]}>{lead.customerName}</Text>
          <Text style={{ color: colors.textMuted, marginTop: 2 }}>
            {lead.customerMobile}
            {lead.customerEmail ? ` · ${lead.customerEmail}` : ""}
          </Text>
          <Text style={{ color: colors.textMuted, marginTop: 2 }}>
            {lead.loanType.replace(/_/g, " ")}
            {lead.amount ? ` · ${inr(lead.amount)}` : ""}
            {lead.city ? ` · ${lead.city}` : ""}
          </Text>

          {/* Quick actions */}
          <View style={styles.quickRow}>
            <QuickAction label="Call" glyph="☎" onPress={callCustomer} testID="call-btn" />
            <QuickAction label="WhatsApp" glyph="✉" onPress={whatsappCustomer} testID="wa-btn" />
          </View>
        </View>

        {/* Status workflow */}
        <Text style={[typography.micro, { color: colors.textMuted, marginTop: spacing.xxl }]}>UPDATE STATUS</Text>
        <View style={styles.statusGrid}>
          {LEAD_STATUSES.map((s) => {
            const active = status === s;
            return (
              <Pressable
                key={s}
                onPress={() => setStatus(s)}
                style={[
                  styles.statusChip,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
                accessibilityLabel={`status-${s}`}
              >
                <Text style={{ color: active ? colors.textInverted : colors.text, fontWeight: "700", fontSize: 12 }}>
                  {s}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Notes */}
        <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.lg, marginBottom: spacing.xs }]}>
          Internal notes
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          placeholder="What did the customer say?"
          placeholderTextColor={colors.textMuted}
          style={[
            styles.notes,
            { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
          ]}
          accessibilityLabel="lead-notes"
        />

        <Pressable
          onPress={saveStatus}
          disabled={savingStatus}
          style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: savingStatus ? 0.7 : 1 }]}
          accessibilityLabel="save-status-btn"
        >
          {savingStatus ? (
            <ActivityIndicator color={colors.textInverted} />
          ) : (
            <Text style={{ color: colors.textInverted, fontWeight: "800" }}>Save changes</Text>
          )}
        </Pressable>

        {/* Schedule follow-up */}
        <Text style={[typography.micro, { color: colors.textMuted, marginTop: spacing.xxl }]}>SCHEDULE FOLLOW-UP</Text>
        <View style={{ marginTop: spacing.sm }}>
          <Text style={[typography.caption, { color: colors.textMuted, marginBottom: spacing.xs }]}>
            When? (YYYY-MM-DD HH:mm or full ISO)
          </Text>
          <TextInput
            value={followUpDate}
            onChangeText={setFollowUpDate}
            placeholder="2026-06-25 11:00"
            placeholderTextColor={colors.textMuted}
            style={[
              styles.input,
              { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
            ]}
            accessibilityLabel="fu-date"
          />
          <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.md, marginBottom: spacing.xs }]}>
            Note (optional)
          </Text>
          <TextInput
            value={followUpNote}
            onChangeText={setFollowUpNote}
            placeholder="Send docs reminder, etc."
            placeholderTextColor={colors.textMuted}
            style={[
              styles.input,
              { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
            ]}
            accessibilityLabel="fu-note"
          />
          <Pressable
            onPress={scheduleFu}
            disabled={savingFu}
            style={[
              styles.outlineBtn,
              { borderColor: colors.primary, opacity: savingFu ? 0.7 : 1 },
            ]}
            accessibilityLabel="schedule-fu-btn"
          >
            {savingFu ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={{ color: colors.primary, fontWeight: "800" }}>Schedule follow-up</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const QuickAction: React.FC<{ label: string; glyph: string; onPress: () => void; testID?: string }> = ({
  label,
  glyph,
  onPress,
  testID,
}) => {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      style={[styles.quickBtn, { backgroundColor: colors.primary }]}
    >
      <Text style={{ color: colors.textInverted, fontSize: 16, fontWeight: "800" }}>{glyph}</Text>
      <Text style={{ color: colors.textInverted, fontWeight: "800" }}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  customerCard: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    alignItems: "center",
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", borderWidth: 2,
  },
  quickRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg, width: "100%" },
  quickBtn: {
    flex: 1, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center",
    paddingVertical: 12, borderRadius: radii.pill,
  },
  statusGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: spacing.sm },
  statusChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.pill, borderWidth: 1 },
  notes: {
    borderRadius: radii.md, borderWidth: 1, padding: spacing.md, fontSize: 15, minHeight: 100, textAlignVertical: "top",
  },
  saveBtn: {
    marginTop: spacing.lg, paddingVertical: 14, borderRadius: radii.pill, alignItems: "center",
  },
  input: { borderRadius: radii.md, borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: 12, fontSize: 15 },
  outlineBtn: {
    marginTop: spacing.md, paddingVertical: 12, borderRadius: radii.pill, borderWidth: 2, alignItems: "center",
  },
});
