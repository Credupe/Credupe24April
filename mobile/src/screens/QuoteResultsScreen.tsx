import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeProvider";
import { radii, spacing, typography } from "../theme/colors";
import { applyFromQuote, Quote, QuoteOffer, shareQuote } from "../api/credupe";
import { inr, pct } from "../lib/format";
import Toast from "react-native-toast-message";

interface Props {
  quote: Quote;
  onBack: () => void;
  onApplied?: (refNo: string) => void;
}

export const QuoteResultsScreen: React.FC<Props> = ({ quote, onBack, onApplied }) => {
  const { colors } = useTheme();
  const [sharing, setSharing] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const onShare = useCallback(async () => {
    setSharing(true);
    const r = await shareQuote(quote.id);
    setSharing(false);
    if (!r.success || !r.data) {
      Toast.show({
        type: "error",
        text1: "Could not create share link",
        text2: r.error?.message?.join("\n") ?? "Try again",
      });
      return;
    }
    const base = process.env.EXPO_PUBLIC_BACKEND_URL ?? "";
    const fullUrl = `${base}/q/${r.data.slug}`;
    setShareUrl(fullUrl);

    const bestOffer = quote.offers[0];
    const message =
      `My CreduPe ${quote.loanType.replace(/_/g, " ").toLowerCase()} quote — ` +
      `${quote.offers.length} offers, EMIs from ${inr(bestOffer.estEmi)}/mo.\n\n${fullUrl}`;

    try {
      await Share.share({ message, url: fullUrl, title: "CreduPe quote" });
    } catch {
      // user cancelled — no-op
    }
  }, [quote]);

  const onApply = useCallback(
    async (offer: QuoteOffer) => {
      setApplyingId(offer.productId);
      const r = await applyFromQuote(quote.id, offer);
      setApplyingId(null);
      if (!r.success || !r.data) {
        Toast.show({
          type: "error",
          text1: "Could not apply",
          text2: r.error?.message?.join("\n") ?? "Try again",
        });
        return;
      }
      Toast.show({
        type: "success",
        text1: "Application created",
        text2: `Reference: ${r.data.referenceNo}`,
      });
      onApplied?.(r.data.referenceNo);
    },
    [quote, onApplied],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <Pressable onPress={onBack} accessibilityLabel="back-btn">
          <Text style={{ color: colors.primary, fontWeight: "700" }}>‹ Back</Text>
        </Pressable>

        {/* Summary */}
        <Text style={[typography.h1, { color: colors.text, marginTop: spacing.md }]}>
          {quote.offers.length} matching offers
        </Text>
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 2 }]}>
          {quote.loanType.replace(/_/g, " ")} · {inr(quote.amount)} · {quote.tenureMonths} months
        </Text>

        {/* Share button */}
        <Pressable
          onPress={onShare}
          disabled={sharing}
          style={[
            styles.shareBtn,
            { borderColor: colors.primary, backgroundColor: colors.primaryMuted },
          ]}
          accessibilityLabel="share-quote-btn"
        >
          {sharing ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={{ color: colors.primary, fontWeight: "800" }}>
              ⇪ Share my quote {shareUrl ? "again" : "via WhatsApp / email"}
            </Text>
          )}
        </Pressable>
        {shareUrl ? (
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 6 }} selectable>
            {shareUrl}
          </Text>
        ) : null}

        {/* Offers */}
        <View style={{ marginTop: spacing.xl }}>
          {quote.offers.map((o, i) => (
            <OfferCard
              key={o.productId}
              offer={o}
              rank={i + 1}
              applying={applyingId === o.productId}
              onApply={() => onApply(o)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const OfferCard: React.FC<{
  offer: QuoteOffer;
  rank: number;
  applying: boolean;
  onApply: () => void;
}> = ({ offer, rank, applying, onApply }) => {
  const { colors } = useTheme();
  const best = rank === 1;
  return (
    <View
      style={[
        styles.offerCard,
        {
          backgroundColor: colors.card,
          borderColor: best ? colors.primary : colors.border,
          borderWidth: best ? 2 : 1,
        },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
        <View style={[styles.rankBubble, { backgroundColor: best ? colors.primary : colors.primaryMuted }]}>
          <Text style={{ color: best ? colors.textInverted : colors.primary, fontWeight: "800" }}>#{rank}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>
            {offer.lender?.name ?? "Lender"}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>{offer.productName}</Text>
        </View>
        {best ? (
          <View style={{ backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill }}>
            <Text style={{ color: colors.textInverted, fontWeight: "800", fontSize: 11 }}>BEST RATE</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.offerStats}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: "600" }}>EMI</Text>
          <Text style={{ color: colors.text, fontWeight: "800", fontSize: 18 }}>{inr(offer.estEmi)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: "600" }}>RATE p.a.</Text>
          <Text style={{ color: colors.text, fontWeight: "800", fontSize: 18 }}>{pct(offer.minRate)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: "600" }}>PROC. FEE</Text>
          <Text style={{ color: colors.text, fontWeight: "800", fontSize: 18 }}>
            {offer.processingFeePct != null ? pct(offer.processingFeePct, 2) : "—"}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onApply}
        disabled={applying}
        style={[
          styles.applyBtn,
          { backgroundColor: best ? colors.primary : "transparent", borderColor: colors.primary },
        ]}
        accessibilityLabel={`apply-${offer.productId}`}
      >
        {applying ? (
          <ActivityIndicator color={best ? colors.textInverted : colors.primary} />
        ) : (
          <Text
            style={{
              color: best ? colors.textInverted : colors.primary,
              fontWeight: "800",
            }}
          >
            Apply with {offer.lender?.name ?? "this lender"}
          </Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  shareBtn: {
    marginTop: spacing.xl,
    paddingVertical: 14,
    borderRadius: radii.pill,
    borderWidth: 2,
    alignItems: "center",
  },
  offerCard: {
    padding: spacing.lg,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
  },
  rankBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  offerStats: {
    flexDirection: "row",
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  applyBtn: {
    marginTop: spacing.lg,
    paddingVertical: 12,
    borderRadius: radii.pill,
    borderWidth: 2,
    alignItems: "center",
  },
});
