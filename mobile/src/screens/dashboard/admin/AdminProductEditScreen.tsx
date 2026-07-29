import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  createLoanProduct,
  fetchLenders,
  Lender,
  LoanProduct,
  updateLoanProduct,
  deleteLoanProduct,
} from "../../../api/credupe";
import { useTheme } from "../../../theme/ThemeProvider";
import { radii, spacing, typography } from "../../../theme/colors";

const LOAN_TYPES = [
  { key: "PERSONAL_LOAN", label: "Personal" },
  { key: "HOME_LOAN", label: "Home" },
  { key: "BUSINESS_LOAN", label: "Business" },
  { key: "CAR_LOAN", label: "Car" },
  { key: "GOLD_LOAN", label: "Gold" },
];

interface Props {
  product?: LoanProduct;
  onBack: () => void;
  onSaved: () => void;
}

export const AdminProductEditScreen: React.FC<Props> = ({ product, onBack, onSaved }) => {
  const { colors } = useTheme();
  const isNew = !product;

  const [lenders, setLenders] = useState<Lender[]>([]);
  const [lenderId, setLenderId] = useState(product?.lender?.id ?? product?.lenderId ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [loanType, setLoanType] = useState(product?.loanType ?? "PERSONAL_LOAN");
  const [minAmount, setMinAmount] = useState(String(product?.minAmount ?? ""));
  const [maxAmount, setMaxAmount] = useState(String(product?.maxAmount ?? ""));
  const [minTenure, setMinTenure] = useState(String(product?.minTenureMonths ?? ""));
  const [maxTenure, setMaxTenure] = useState(String(product?.maxTenureMonths ?? ""));
  const [minRate, setMinRate] = useState(String(product?.minInterestRate ?? ""));
  const [maxRate, setMaxRate] = useState(String(product?.maxInterestRate ?? ""));
  const [procFee, setProcFee] = useState(String(product?.processingFeePct ?? ""));
  const [minIncome, setMinIncome] = useState(String(product?.minMonthlyIncome ?? ""));
  const [minCibil, setMinCibil] = useState(String(product?.minCibilScore ?? ""));
  const [active, setActive] = useState(product?.active !== false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLenders().then((r) => {
      if (r.success && r.data?.items) setLenders(r.data.items);
    });
  }, []);

  const selectedLender = useMemo(() => lenders.find((l) => l.id === lenderId), [lenders, lenderId]);

  const submit = useCallback(async () => {
    if (!name.trim()) {
      Toast.show({ type: "error", text1: "Product name is required" });
      return;
    }
    if (!lenderId) {
      Toast.show({ type: "error", text1: "Pick a lender" });
      return;
    }
    const mn = Number(minAmount);
    const mx = Number(maxAmount);
    const tmn = Number(minTenure);
    const tmx = Number(maxTenure);
    const rmn = Number(minRate);
    const rmx = Number(maxRate);
    if (!mn || !mx || mn > mx) {
      Toast.show({ type: "error", text1: "Amount bands invalid (min ≤ max, both positive)" });
      return;
    }
    if (!tmn || !tmx || tmn > tmx) {
      Toast.show({ type: "error", text1: "Tenure bands invalid (min ≤ max, both positive)" });
      return;
    }
    if (rmn == null || rmx == null || rmn > rmx) {
      Toast.show({ type: "error", text1: "Interest-rate bands invalid (min ≤ max)" });
      return;
    }

    const payload = {
      lenderId,
      name: name.trim(),
      loanType,
      minAmount: mn,
      maxAmount: mx,
      minTenureMonths: tmn,
      maxTenureMonths: tmx,
      minInterestRate: rmn,
      maxInterestRate: rmx,
      processingFeePct: procFee ? Number(procFee) : undefined,
      minMonthlyIncome: minIncome ? Number(minIncome) : undefined,
      minCibilScore: minCibil ? Number(minCibil) : undefined,
      active,
    };

    setSaving(true);
    const r = isNew ? await createLoanProduct(payload as any) : await updateLoanProduct(product!.id, payload as any);
    setSaving(false);
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
      text1: isNew ? "Product created" : "Product saved",
      text2: "Changes applied.",
    });
    onSaved();
  }, [name, lenderId, loanType, minAmount, maxAmount, minTenure, maxTenure, minRate, maxRate, procFee, minIncome, minCibil, active, isNew, product, onSaved]);

  const handleDelete = useCallback(async () => {
    if (isNew || !product) return;
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete ${product.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setSaving(true);
            const r = await deleteLoanProduct(product.id);
            setSaving(false);
            if (!r.success) {
              Toast.show({
                type: "error",
                text1: "Delete failed",
                text2: r.error?.message?.join("\n") ?? "Try again",
              });
              return;
            }
            Toast.show({
              type: "success",
              text1: "Product deleted",
              text2: "Changes applied successfully.",
            });
            onSaved();
          }
        }
      ]
    );
  }, [isNew, product, onSaved]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }} keyboardShouldPersistTaps="handled">
        <Pressable onPress={onBack} accessibilityLabel="back-btn">
          <Text style={{ color: colors.primary, fontWeight: "700" }}>‹ Back</Text>
        </Pressable>

        <Text style={[typography.h1, { color: colors.text, marginTop: spacing.md }]}>
          {isNew ? "New loan product" : "Edit product"}
        </Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>
          {isNew
            ? "Define amount, tenure, rate & eligibility bands."
            : `${product?.name} · v${product?.id ? "" : ""}`}
        </Text>

        {/* Lender picker */}
        <Section title="Lender">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {lenders.map((l) => {
              const a = l.id === lenderId;
              return (
                <Pressable
                  key={l.id}
                  onPress={() => setLenderId(l.id)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: a ? colors.primary : colors.card,
                      borderColor: a ? colors.primary : colors.border,
                    },
                  ]}
                  accessibilityLabel={`lender-${l.slug}`}
                >
                  <Text style={{ color: a ? colors.textInverted : colors.text, fontWeight: "700", fontSize: 12 }}>
                    {l.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          {selectedLender ? (
            <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>
              Selected: {selectedLender.name} ({selectedLender.integrationMode ?? "mock"})
            </Text>
          ) : null}
        </Section>

        <Field label="Display name" value={name} onChange={setName} testID="product-name" />

        <Section title="Loan type">
          <View style={styles.chipRow}>
            {LOAN_TYPES.map((t) => {
              const a = t.key === loanType;
              return (
                <Pressable
                  key={t.key}
                  onPress={() => setLoanType(t.key)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: a ? colors.primary : colors.card,
                      borderColor: a ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={{ color: a ? colors.textInverted : colors.text, fontWeight: "700" }}>{t.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="Amount (₹)">
          <Row>
            <Field label="Min" value={minAmount} onChange={setMinAmount} keyboard="number-pad" />
            <Field label="Max" value={maxAmount} onChange={setMaxAmount} keyboard="number-pad" />
          </Row>
        </Section>

        <Section title="Tenure (months)">
          <Row>
            <Field label="Min" value={minTenure} onChange={setMinTenure} keyboard="number-pad" />
            <Field label="Max" value={maxTenure} onChange={setMaxTenure} keyboard="number-pad" />
          </Row>
        </Section>

        <Section title="Interest rate (% p.a.)">
          <Row>
            <Field label="Min" value={minRate} onChange={setMinRate} keyboard="decimal-pad" />
            <Field label="Max" value={maxRate} onChange={setMaxRate} keyboard="decimal-pad" />
          </Row>
        </Section>

        <Section title="Eligibility (optional)">
          <Field label="Processing fee (% of loan)" value={procFee} onChange={setProcFee} keyboard="decimal-pad" />
          <Field label="Min monthly income (₹)" value={minIncome} onChange={setMinIncome} keyboard="number-pad" />
          <Field label="Min CIBIL score" value={minCibil} onChange={setMinCibil} keyboard="number-pad" />
        </Section>

        {/* Active */}
        <View style={[styles.activeRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: "700" }}>Active</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              {active ? "Matched in customer quotes." : "Hidden from quotes."}
            </Text>
          </View>
          <Switch
            value={active}
            onValueChange={setActive}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor={active ? colors.textInverted : colors.textMuted}
            accessibilityLabel="active-switch"
          />
        </View>

        <Pressable
          onPress={submit}
          disabled={saving}
          style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: saving ? 0.7 : 1 }]}
          accessibilityLabel="save-product-btn"
        >
          {saving ? (
            <ActivityIndicator color={colors.textInverted} />
          ) : (
            <Text style={{ color: colors.textInverted, fontWeight: "800", fontSize: 16 }}>
              {isNew ? "Create product" : "Save changes"}
            </Text>
          )}
        </Pressable>

        {!isNew ? (
          <Pressable
            onPress={handleDelete}
            disabled={saving}
            style={[styles.deleteBtn, { borderColor: "#EF4444", borderWidth: 1, opacity: saving ? 0.7 : 1 }]}
            accessibilityLabel="delete-product-btn"
          >
            {saving ? (
              <ActivityIndicator color="#EF4444" />
            ) : (
              <Text style={{ color: "#EF4444", fontWeight: "800", fontSize: 16 }}>
                Delete Product
              </Text>
            )}
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const { colors } = useTheme();
  return (
    <View style={{ marginTop: spacing.lg }}>
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

const styles = StyleSheet.create({
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.pill, borderWidth: 1 },
  input: {
    marginTop: 4,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
  },
  activeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginTop: spacing.lg,
  },
  saveBtn: {
    marginTop: spacing.xxl,
    paddingVertical: 16,
    borderRadius: radii.pill,
    alignItems: "center",
  },
  deleteBtn: {
    marginTop: spacing.md,
    paddingVertical: 16,
    borderRadius: radii.pill,
    alignItems: "center",
    borderWidth: 1,
  },
});
