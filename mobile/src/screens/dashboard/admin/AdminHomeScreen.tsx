import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FileText, ShieldCheck, Users, Landmark, Coins, TrendingUp } from "lucide-react-native";
import { ApiUser, fetchAdminFunnel, getCachedUser } from "../../../api/credupe";
import { CredupeLogo } from "../../../components/CredupeLogo";
import { useTheme } from "../../../theme/ThemeProvider";
import { radii, spacing, typography } from "../../../theme/colors";

interface Props {
  onOpenApplications: (status?: string) => void;
  onOpenDocuments: () => void;
  onOpenUsers: () => void;
  onOpenLenders: () => void;
  onOpenProducts: () => void;
  onOpenLeads: () => void;
}

const FUNNEL_ORDER = ["LEAD", "LOGIN", "DOC_PENDING", "UNDER_REVIEW", "APPROVED", "DISBURSED", "REJECTED", "CANCELLED"];

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "primary"> = {
  DISBURSED: "success",
  APPROVED: "success",
  UNDER_REVIEW: "warning",
  DOC_PENDING: "warning",
  LOGIN: "warning",
  LEAD: "primary",
  REJECTED: "danger",
  CANCELLED: "danger",
};

export const AdminHomeScreen: React.FC<Props> = ({ onOpenApplications, onOpenDocuments, onOpenUsers, onOpenLenders, onOpenProducts, onOpenLeads }) => {
  const { colors, mode, toggle } = useTheme();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [total, setTotal] = useState(0);
  const [byStatus, setByStatus] = useState<Record<string, number>>({});
  const [leadsCount, setLeadsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const u = await getCachedUser();
    setUser(u);
    const r = await fetchAdminFunnel();
    if (r.success && r.data) {
      setTotal(r.data.total);
      setByStatus(r.data.byStatus);
      setLeadsCount((r.data as any).leadsCount ?? 0);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor={colors.primary}
          />
        }
      >


        <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.xl }]}>
          Admin console 🛠
        </Text>
        <Text style={[typography.display, { color: colors.text }]}>
          {(user?.fullName || user?.email?.split("@")[0] || "admin").toLowerCase()}
        </Text>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xxl }} />
        ) : (
          <>
            {/* Total apps hero */}
            <View style={[styles.heroCard, { backgroundColor: colors.cardElevated, shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: mode === "dark" ? 0.3 : 0.1, shadowRadius: 16, elevation: 8, borderWidth: 1, borderColor: colors.border }]}>
              <Text style={[typography.caption, { color: colors.textMuted, fontWeight: "600", letterSpacing: 1 }]}>LOAN APPLICATIONS</Text>
              <Text style={{ color: colors.primary, fontSize: 42, fontWeight: "600", marginTop: 4 }}>{total}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 4 }}>Across every stage</Text>
            </View>

            {/* Total leads hero */}
            <Pressable
              onPress={onOpenLeads}
              style={[styles.heroCard, { backgroundColor: colors.cardElevated, marginTop: spacing.md, shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: mode === "dark" ? 0.3 : 0.1, shadowRadius: 16, elevation: 8, borderWidth: 1, borderColor: colors.border }]}
              accessibilityLabel="admin-leads-hero"
            >
              <Text style={[typography.caption, { color: colors.textMuted, fontWeight: "600", letterSpacing: 1 }]}>B2B LEADS</Text>
              <Text style={{ color: colors.primary, fontSize: 42, fontWeight: "600", marginTop: 4 }}>{leadsCount}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 4 }}>Submitted via utility tool UTM links</Text>
            </Pressable>

            {/* Funnel grid */}
            <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.xxl, marginBottom: spacing.sm, fontWeight: "600", letterSpacing: 1 }]}>
              FUNNEL BY STATUS — TAP TO FILTER
            </Text>
             <View style={styles.funnelGrid}>
              {FUNNEL_ORDER.map((s) => {
                const count = byStatus[s] ?? 0;
                const tone = STATUS_TONE[s] ?? "primary";
                const tc =
                  tone === "success" ? colors.success : tone === "danger" ? colors.danger : tone === "warning" ? colors.warning : colors.primary;
                const formattedLabel = s.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
                return (
                  <Pressable
                    key={s}
                    onPress={() => onOpenApplications(s)}
                    style={[
                      styles.funnelTile,
                      { 
                        backgroundColor: tc + "0B", 
                        borderWidth: 1, 
                        borderColor: tc + "20",
                        paddingVertical: 14,
                        paddingHorizontal: 10,
                      }
                    ]}
                    accessibilityLabel={`funnel-${s}`}
                  >
                    <Text style={{ color: tc, fontSize: 22, fontWeight: "700" }}>{count}</Text>
                    <Text style={{ color: colors.text, fontSize: 11, fontWeight: "500", marginTop: 6 }}>
                      {formattedLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Quick links */}
            <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.xxl, marginBottom: spacing.md, fontWeight: "600", letterSpacing: 1 }]}>
              QUICK LINKS
            </Text>
            
            <View style={[styles.linksContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <LinkRow IconComponent={FileText} label="All applications" caption="State machine + manual transitions" onPress={() => onOpenApplications(undefined)} testID="qa-apps" showDivider />
              <LinkRow IconComponent={ShieldCheck} label="KYC review queue" caption="Verify or reject uploaded documents" onPress={onOpenDocuments} testID="qa-docs" showDivider />
              <LinkRow IconComponent={Users} label="Users" caption="All customers, partners & admins" onPress={onOpenUsers} testID="qa-users" showDivider />
              <LinkRow IconComponent={Landmark} label="Lenders" caption="Partner-lender catalogue — tap to edit / add" onPress={onOpenLenders} testID="qa-lenders" showDivider />
              <LinkRow IconComponent={Coins} label="Loan products" caption="Amount, tenure, rate & eligibility bands" onPress={onOpenProducts} testID="qa-products" showDivider />
              <LinkRow IconComponent={TrendingUp} label="Leads" caption="Manage B2B lead forms & submissions" onPress={onOpenLeads} testID="qa-leads" />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const LinkRow: React.FC<{
  IconComponent: React.ComponentType<{ color: string; size: number }>;
  label: string;
  caption: string;
  onPress: () => void;
  testID?: string;
  showDivider?: boolean;
}> = ({ IconComponent, label, caption, onPress, testID, showDivider }) => {
  const { colors } = useTheme();
  return (
    <View>
      <Pressable
        onPress={onPress}
        testID={testID}
        style={({ pressed }) => [
          styles.linkRow,
          { 
            backgroundColor: pressed ? (colors.border + "10") : "transparent",
          }
        ]}
      >
        <View style={[styles.linkIcon, { backgroundColor: colors.primaryMuted }]}>
          <IconComponent color={colors.primary} size={20} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontWeight: "600", fontSize: 15 }}>{label}</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 1 }}>{caption}</Text>
        </View>
        <Text style={{ color: colors.textMuted, fontSize: 20, fontWeight: "300", marginRight: 4 }}>›</Text>
      </Pressable>
      {showDivider && (
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  themeChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.pill, borderWidth: 1 },
  heroCard: { marginTop: spacing.xl, padding: spacing.lg, borderRadius: radii.lg, borderWidth: 1 },
  funnelGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  funnelTile: {
    width: "31.5%",
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  linksContainer: {
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    marginLeft: 40 + spacing.md + spacing.md, // Align divider cleanly with the text starting point
  },
});
