import React, { useMemo, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";
import { calcEmi, createQuote, Quote, QuoteInput } from "../api/credupe";
import { inr, pct } from "../lib/format";
import Toast from "react-native-toast-message";

const LOAN_TYPES = [
  { key: "PERSONAL_LOAN", label: "Personal" },
  { key: "HOME_LOAN", label: "Home" },
  { key: "BUSINESS_LOAN", label: "Business" },
  { key: "CAR_LOAN", label: "Car" },
  { key: "GOLD_LOAN", label: "Gold" },
];

interface Props {
  initialLoanType?: string;
  onQuoteCreated: (quote: Quote) => void;
  onBack: () => void;
}

export const QuoteBuilderScreen: React.FC<Props> = ({ initialLoanType, onQuoteCreated, onBack }) => {
  const { colors } = useTheme();
  const [loanType, setLoanType] = useState(initialLoanType ?? "PERSONAL_LOAN");
  const [amount, setAmount] = useState("500000");
  const [tenure, setTenure] = useState("36");
  const [rate, setRate] = useState("12.5");
  const [income, setIncome] = useState("");
  const [cibil, setCibil] = useState("");
  const [loading, setLoading] = useState(false);

  const previewEmi = useMemo(() => {
    const p = Number(amount) || 0;
    const r = Number(rate) || 0;
    const n = Number(tenure) || 0;
    const e = calcEmi(p, r, n);
    const total = e * n;
    return { emi: e, totalInterest: total - p, totalPayable: total };
  }, [amount, tenure, rate]);

  const submit = useCallback(async () => {
    const a = Number(amount);
    const n = Number(tenure);
    if (!a || a <= 0) {
      Toast.show({ type: "error", text1: "Enter a valid amount" });
      return;
    }
    if (!n || n <= 0) {
      Toast.show({ type: "error", text1: "Enter a valid tenure (months)" });
      return;
    }
    const input: QuoteInput = {
      loanType,
      amount: a,
      tenureMonths: n,
      monthlyIncome: Number(income) || undefined,
      cibilScore: Number(cibil) || undefined,
    };
    setLoading(true);
    const r = await createQuote(input);
    setLoading(false);
    if (!r.success || !r.data) {
      Toast.show({
        type: "info",
        text1: "No offers",
        text2: r.error?.message?.join("\n") ?? "Try a different amount or tenure",
      });
      return;
    }
    onQuoteCreated(r.data);
  }, [amount, tenure, loanType, income, cibil, onQuoteCreated]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <Pressable onPress={onBack} style={{ marginBottom: spacing.md }} accessibilityLabel="back-btn">
          <Text style={{ color: colors.primary, fontWeight: "700" }}>‹ Back</Text>
        </Pressable>

        <Text style={[typography.h1, { color: colors.text }]}>Build a quote</Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>
          See offers from every matching lender in one shot.
        </Text>

        {/* Loan type chips */}
        <Text style={[typography.micro, { color: colors.textMuted, marginTop: spacing.xl }]}>LOAN TYPE</Text>
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
                <Text style={{ color: active ? colors.textInverted : colors.text, fontWeight: "700" }}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Amount */}
        <LabeledField
          label="Loan amount (₹)"
          value={amount}
          onChange={setAmount}
          keyboard="number-pad"
          testID="amount-input"
        />

        {/* Tenure */}
        <LabeledField
          label="Tenure (months)"
          value={tenure}
          onChange={setTenure}
          keyboard="number-pad"
          testID="tenure-input"
        />

        {/* Rate preview */}
        <LabeledField
          label="Indicative rate (% p.a.) — for the EMI preview only"
          value={rate}
          onChange={setRate}
          keyboard="decimal-pad"
          testID="rate-input"
        />

        {/* EMI Preview */}
        <View style={[styles.previewCard, { backgroundColor: colors.cardElevated, borderColor: colors.primary }]}>
          <Text style={[typography.micro, { color: colors.textMuted }]}>EMI PREVIEW</Text>
          <Text style={{ color: colors.primary, fontSize: 36, fontWeight: "800", marginTop: 2 }}>
            {inr(previewEmi.emi)} <Text style={{ fontSize: 14, color: colors.textMuted }}>/ month</Text>
          </Text>
          <View style={styles.statsRow}>
            <Stat label="Total interest" value={inr(previewEmi.totalInterest)} />
            <Stat label="Total payable" value={inr(previewEmi.totalPayable)} />
            <Stat label="At" value={pct(Number(rate) || 0, 2)} />
          </View>
        </View>

        {/* Optional refinement */}
        <Text style={[typography.micro, { color: colors.textMuted, marginTop: spacing.xl }]}>
          OPTIONAL — for tighter matching
        </Text>
        <LabeledField label="Monthly income (₹)" value={income} onChange={setIncome} keyboard="number-pad" />
        <LabeledField label="CIBIL score" value={cibil} onChange={setCibil} keyboard="number-pad" />

        {/* CTA */}
        <Pressable
          onPress={submit}
          disabled={loading}
          style={[styles.cta, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
          accessibilityLabel="get-offers-btn"
        >
          {loading ? (
            <ActivityIndicator color={colors.textInverted} />
          ) : (
            <Text style={{ color: colors.textInverted, fontWeight: "800", fontSize: 16 }}>
              Get matching offers
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const LabeledField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboard?: "default" | "number-pad" | "decimal-pad";
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
        style={[
          styles.input,
          { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
        ]}
      />
    </View>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: "600", letterSpacing: 0.4 }}>
        {label.toUpperCase()}
      </Text>
      <Text style={{ color: colors.text, fontSize: 15, fontWeight: "700", marginTop: 2 }}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: spacing.sm },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.pill, borderWidth: 1 },
  input: { borderRadius: radii.md, borderWidth: 1, paddingHorizontal: spacing.lg, paddingVertical: 14, fontSize: 16 },
  previewCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 2,
  },
  statsRow: { flexDirection: "row", marginTop: spacing.md, gap: spacing.md },
  cta: {
    marginTop: spacing.xxl,
    paddingVertical: 16,
    borderRadius: radii.pill,
    alignItems: "center",
  },
});
