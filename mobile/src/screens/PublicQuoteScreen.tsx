import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchSharedQuote, Quote } from "../api/credupe";
import { CredupeLogo } from "../components/CredupeLogo";
import { inr, pct } from "../lib/format";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";

interface Props {
  slug: string;
  onOpenLogin: () => void;
}

/**
 * Public, unauthenticated quote-share view.
 * Reached via `credupe://q/<slug>` or `https://credupe-app.preview.emergentagent.com/q/<slug>`.
 */
export const PublicQuoteScreen: React.FC<Props> = ({ slug, onOpenLogin }) => {
  const { colors, mode, toggle } = useTheme();
  const [quote, setQuote] = useState<Omit<Quote, "id"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const r = await fetchSharedQuote(slug);
    if (!r.success || !r.data) {
      setError(r.error?.message?.join("\n") ?? "Quote not found or expired");
      setLoading(false);
      return;
    }
    setQuote(r.data);
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  if (error || !quote) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
        <View style={styles.errorBox}>
          <CredupeLogo size={48} layout="stacked" />
          <Text style={[typography.h1, { color: colors.text, marginTop: spacing.lg, textAlign: "center" }]}>
            Quote unavailable
          </Text>
          <Text style={{ color: colors.textMuted, textAlign: "center", marginTop: spacing.sm }}>
            {error}
          </Text>
          <Pressable
            onPress={onOpenLogin}
            style={[styles.cta, { backgroundColor: colors.primary }]}
            accessibilityLabel="open-login-btn"
          >
            <Text style={{ color: colors.textInverted, fontWeight: "800", fontSize: 16 }}>Open CreduPe</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const best = quote.offers[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <View style={styles.headerRow}>
          <CredupeLogo size={28} layout="row" />
          <Pressable
            onPress={toggle}
            style={[styles.themeChip, { borderColor: colors.border, backgroundColor: colors.card }]}
            accessibilityLabel="toggle-theme"
          >
            <Text style={{ color: colors.text, fontWeight: "700" }}>{mode === "dark" ? "☾" : "☀"}</Text>
          </Pressable>
        </View>

        <View style={[styles.shareBadge, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
          <Text style={[typography.micro, { color: colors.primary }]}>SHARED QUOTE</Text>
        </View>

        <Text style={[typography.display, { color: colors.text, marginTop: spacing.md }]}>
          {quote.offers.length} {quote.offers.length === 1 ? "offer" : "offers"} for{" "}
          {quote.loanType.replace(/_/g, " ").toLowerCase()}
        </Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>
          {inr(quote.amount)} · {quote.tenureMonths} months
        </Text>

        {/* Best offer hero */}
        {best ? (
          <View style={[styles.bestCard, { backgroundColor: colors.cardElevated, borderColor: colors.primary }]}>
            <Text style={[typography.micro, { color: colors.textMuted }]}>BEST RATE</Text>
            <Text style={{ color: colors.primary, fontSize: 36, fontWeight: "800", marginTop: 2 }}>
              {pct(best.minRate)} <Text style={{ fontSize: 14, color: colors.textMuted }}>p.a.</Text>
            </Text>
            <Text style={{ color: colors.text, fontWeight: "800", fontSize: 18, marginTop: 4 }}>
              {best.lender?.name ?? "Top lender"}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>{best.productName}</Text>
            <View style={styles.statsRow}>
              <Stat label="EMI" value={inr(best.estEmi)} />
              <Stat label="Proc. fee" value={best.processingFeePct != null ? pct(best.processingFeePct, 2) : "—"} />
            </View>
          </View>
        ) : null}

        {/* Other offers */}
        {quote.offers.slice(1).length > 0 ? (
          <Text style={[typography.micro, { color: colors.textMuted, marginTop: spacing.xxl, marginBottom: spacing.sm }]}>
            OTHER MATCHING OFFERS
          </Text>
        ) : null}
        {quote.offers.slice(1).map((o, i) => (
          <View
            key={o.productId}
            style={[styles.offerRow, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.rank, { backgroundColor: colors.primaryMuted }]}>
              <Text style={{ color: colors.primary, fontWeight: "800" }}>#{i + 2}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: "800", fontSize: 14 }}>
                {o.lender?.name ?? "Lender"}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>{o.productName}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: colors.text, fontWeight: "800" }}>{pct(o.minRate)}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 11 }}>{inr(o.estEmi)}/mo</Text>
            </View>
          </View>
        ))}

        {/* CTA to open the app */}
        <Pressable
          onPress={onOpenLogin}
          style={[styles.cta, { backgroundColor: colors.primary }]}
          accessibilityLabel="apply-cta-btn"
        >
          <Text style={{ color: colors.textInverted, fontWeight: "800", fontSize: 16 }}>
            Open CreduPe to apply →
          </Text>
        </Pressable>

        <Text style={{ color: colors.textMuted, fontSize: 11, textAlign: "center", marginTop: spacing.lg }}>
          Rates and offers are subject to lender approval. Quote is read-only and PII has been stripped.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: "700", letterSpacing: 0.4 }}>
        {label.toUpperCase()}
      </Text>
      <Text style={{ color: colors.text, fontSize: 17, fontWeight: "800", marginTop: 2 }}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  themeChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.pill, borderWidth: 1 },
  shareBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.pill,
    borderWidth: 1,
    marginTop: spacing.xl,
  },
  bestCard: { marginTop: spacing.xl, padding: spacing.lg, borderRadius: radii.lg, borderWidth: 2 },
  statsRow: { flexDirection: "row", marginTop: spacing.md, gap: spacing.md },
  offerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  rank: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  cta: {
    marginTop: spacing.xxl,
    paddingVertical: 16,
    borderRadius: radii.pill,
    alignItems: "center",
  },
  errorBox: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
});
