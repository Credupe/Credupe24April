import React, { useCallback, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { createLender, Lender, updateLender } from "../api/credupe";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";

interface Props {
  lender?: Lender;            // undefined → create mode
  onBack: () => void;
  onSaved: () => void;
}

export const AdminLenderEditScreen: React.FC<Props> = ({ lender, onBack, onSaved }) => {
  const { colors } = useTheme();
  const isNew = !lender;
  const [name, setName] = useState(lender?.name ?? "");
  const [slug, setSlug] = useState(lender?.slug ?? "");
  const [logoUrl, setLogoUrl] = useState(lender?.logoUrl ?? "");
  const [webhookUrl, setWebhookUrl] = useState(lender?.webhookUrl ?? "");
  const [active, setActive] = useState(lender?.active !== false);
  const [integrationMode, setIntegrationMode] = useState<"mock" | "live">(
    lender?.integrationMode ?? "mock",
  );
  const [saving, setSaving] = useState(false);

  const submit = useCallback(async () => {
    if (!name.trim()) return Alert.alert("Lender name is required");
    setSaving(true);
    const payload = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      logoUrl: logoUrl.trim() || undefined,
      webhookUrl: webhookUrl.trim() || undefined,
      active,
      integrationMode,
    };
    const r = isNew
      ? await createLender(payload)
      : await updateLender(lender!.id, payload);
    setSaving(false);
    if (!r.success) {
      Alert.alert("Save failed", r.error?.message?.join("\n") ?? "Try again");
      return;
    }
    Alert.alert(isNew ? "Lender created" : "Lender saved", "Changes applied.");
    onSaved();
  }, [name, slug, logoUrl, webhookUrl, active, integrationMode, isNew, lender, onSaved]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }} keyboardShouldPersistTaps="handled">
        <Pressable onPress={onBack} accessibilityLabel="back-btn">
          <Text style={{ color: colors.primary, fontWeight: "700" }}>‹ Back</Text>
        </Pressable>

        <Text style={[typography.h1, { color: colors.text, marginTop: spacing.md }]}>
          {isNew ? "New lender" : "Edit lender"}
        </Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>
          {isNew
            ? "Onboard a new bank, NBFC or fintech partner."
            : `Update ${lender?.name}.`}
        </Text>

        <Field label="Display name" value={name} onChange={setName} testID="lender-name" />
        <Field
          label={`Slug (auto-derived if left blank${slug ? "" : ` — e.g. "${slugify(name)}"`})`}
          value={slug}
          onChange={(v) => setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
          testID="lender-slug"
        />
        <Field label="Logo URL" value={logoUrl ?? ""} onChange={setLogoUrl} testID="lender-logo" />
        <Field label="Webhook URL (for live callbacks)" value={webhookUrl ?? ""} onChange={setWebhookUrl} testID="lender-webhook" />

        {/* Integration mode toggle */}
        <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.lg, marginBottom: spacing.xs }]}>
          Integration mode
        </Text>
        <View style={[styles.toggleRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {(["mock", "live"] as const).map((m) => {
            const a = integrationMode === m;
            return (
              <Pressable
                key={m}
                onPress={() => setIntegrationMode(m)}
                style={[
                  styles.toggleBtn,
                  {
                    backgroundColor: a ? colors.primary : "transparent",
                  },
                ]}
                accessibilityLabel={`mode-${m}`}
              >
                <Text style={{ color: a ? colors.textInverted : colors.text, fontWeight: "700" }}>{m.toUpperCase()}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Active switch */}
        <View style={[styles.activeRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: "700" }}>Active</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              {active ? "Lender is visible to customers and matched in quotes." : "Hidden from quotes."}
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
          accessibilityLabel="save-lender-btn"
        >
          {saving ? (
            <ActivityIndicator color={colors.textInverted} />
          ) : (
            <Text style={{ color: colors.textInverted, fontWeight: "800", fontSize: 16 }}>
              {isNew ? "Create lender" : "Save changes"}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  testID?: string;
}> = ({ label, value, onChange, testID }) => {
  const { colors } = useTheme();
  return (
    <View style={{ marginTop: spacing.md }}>
      <Text style={[typography.caption, { color: colors.textMuted, marginBottom: spacing.xs }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        autoCapitalize="none"
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
  input: { borderRadius: radii.md, borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: 12, fontSize: 15 },
  toggleRow: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.pill,
    alignItems: "center",
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
});
