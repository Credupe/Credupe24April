import React, { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createLead } from "../api/credupe";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";
import Toast from "react-native-toast-message";

interface Props {
  onBack: () => void;
  onCreated: () => void;
}

const LOAN_TYPES = [
  { key: "PERSONAL_LOAN", label: "Personal" },
  { key: "HOME_LOAN", label: "Home" },
  { key: "BUSINESS_LOAN", label: "Business" },
  { key: "CAR_LOAN", label: "Car" },
  { key: "GOLD_LOAN", label: "Gold" },
];

export const NewLeadScreen: React.FC<Props> = ({ onBack, onCreated }) => {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [loanType, setLoanType] = useState("PERSONAL_LOAN");
  const [amount, setAmount] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = useCallback(async () => {
    if (!name.trim()) {
      Toast.show({ type: "error", text1: "Customer name required" });
      return;
    }
    if (mobile.length < 10) {
      Toast.show({ type: "error", text1: "Enter a valid 10-digit mobile" });
      return;
    }
    setSaving(true);
    const r = await createLead({
      customerName: name.trim(),
      customerMobile: mobile.trim(),
      customerEmail: email.trim() || undefined,
      loanType,
      amount: Number(amount) || undefined,
      city: city.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    setSaving(false);
    if (!r.success || !r.data) {
      Toast.show({
        type: "error",
        text1: "Could not create lead",
        text2: r.error?.message?.join("\n") ?? "Try again",
      });
      return;
    }
    Toast.show({
      type: "success",
      text1: "Lead created",
      text2: `Customer ${name} added to your inbox.`,
    });
    onCreated();
  }, [name, mobile, email, loanType, amount, city, notes, onCreated]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }} keyboardShouldPersistTaps="handled">
        <Pressable onPress={onBack} accessibilityLabel="back-btn">
          <Text style={{ color: colors.primary, fontWeight: "700" }}>‹ Back</Text>
        </Pressable>
        <Text style={[typography.h1, { color: colors.text, marginTop: spacing.md }]}>New lead</Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>
          Capture a customer enquiry — you can refine later.
        </Text>

        <Field label="Customer name" value={name} onChange={setName} testID="lead-name" />
        <Field label="Mobile (10 digits)" value={mobile} onChange={(v) => setMobile(v.replace(/\D/g, "").slice(0, 10))} keyboard="number-pad" testID="lead-mobile" />
        <Field label="Email (optional)" value={email} onChange={setEmail} keyboard="default" testID="lead-email" />

        <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.md, marginBottom: spacing.xs }]}>
          Loan type
        </Text>
        <View style={styles.chipRow}>
          {LOAN_TYPES.map((t) => {
            const active = t.key === loanType;
            return (
              <Pressable
                key={t.key}
                onPress={() => setLoanType(t.key)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
                accessibilityLabel={`type-${t.key}`}
              >
                <Text style={{ color: active ? colors.textInverted : colors.text, fontWeight: "700" }}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Field label="Amount (₹, optional)" value={amount} onChange={setAmount} keyboard="number-pad" testID="lead-amount" />
        <Field label="City (optional)" value={city} onChange={setCity} testID="lead-city" />

        <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.md, marginBottom: spacing.xs }]}>
          Notes
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          placeholder="Anything important about this enquiry?"
          placeholderTextColor={colors.textMuted}
          style={[styles.notes, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          accessibilityLabel="lead-notes"
        />

        <Pressable
          onPress={submit}
          disabled={saving}
          style={[styles.cta, { backgroundColor: colors.primary, opacity: saving ? 0.7 : 1 }]}
          accessibilityLabel="create-lead-btn"
        >
          {saving ? (
            <ActivityIndicator color={colors.textInverted} />
          ) : (
            <Text style={{ color: colors.textInverted, fontWeight: "800", fontSize: 16 }}>Create lead</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboard?: "default" | "number-pad";
  testID?: string;
}> = ({ label, value, onChange, keyboard = "default", testID }) => {
  const { colors } = useTheme();
  return (
    <View style={{ marginTop: spacing.md }}>
      <Text style={[typography.caption, { color: colors.textMuted, marginBottom: spacing.xs }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard}
        testID={testID}
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.pill, borderWidth: 1 },
  input: { borderRadius: radii.md, borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: 12, fontSize: 15 },
  notes: { borderRadius: radii.md, borderWidth: 1, padding: spacing.md, fontSize: 15, minHeight: 80, textAlignVertical: "top" },
  cta: { marginTop: spacing.xxl, paddingVertical: 16, borderRadius: radii.pill, alignItems: "center" },
});
