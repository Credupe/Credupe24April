import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer, DefaultTheme, DarkTheme, LinkingOptions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Linking from "expo-linking";

import { ThemeProvider, useTheme } from "./src/theme/ThemeProvider";
import { LoginScreen } from "./src/screens/LoginScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LoansScreen } from "./src/screens/LoansScreen";
import { ApplicationsScreen } from "./src/screens/ApplicationsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { QuoteBuilderScreen } from "./src/screens/QuoteBuilderScreen";
import { QuoteResultsScreen } from "./src/screens/QuoteResultsScreen";
import { KycScreen } from "./src/screens/KycScreen";
import { PartnerHomeScreen } from "./src/screens/PartnerHomeScreen";
import { LeadsScreen } from "./src/screens/LeadsScreen";
import { LeadDetailScreen } from "./src/screens/LeadDetailScreen";
import { NewLeadScreen } from "./src/screens/NewLeadScreen";
import { CommissionsScreen } from "./src/screens/CommissionsScreen";
import { BulkLeadsImportScreen } from "./src/screens/BulkLeadsImportScreen";
import { AdminHomeScreen } from "./src/screens/AdminHomeScreen";
import { AdminApplicationsScreen } from "./src/screens/AdminApplicationsScreen";
import { AdminKycReviewScreen } from "./src/screens/AdminKycReviewScreen";
import { AdminUsersScreen } from "./src/screens/AdminUsersScreen";
import { AdminLendersScreen } from "./src/screens/AdminLendersScreen";
import { AdminLenderEditScreen } from "./src/screens/AdminLenderEditScreen";
import { AdminProductsScreen } from "./src/screens/AdminProductsScreen";
import { AdminProductEditScreen } from "./src/screens/AdminProductEditScreen";
import { PublicQuoteScreen } from "./src/screens/PublicQuoteScreen";
import { NotificationsScreen } from "./src/screens/NotificationsScreen";
import { SignupSelectionScreen } from "./src/screens/auth/partner/SignupSelectionScreen";
import { SignupContactDetailsScreen } from "./src/screens/auth/partner/SignupContactDetailsScreen";
import { SignupVerificationScreen } from "./src/screens/auth/partner/SignupVerificationScreen";
import { SignupBusinessDetailsScreen } from "./src/screens/auth/partner/SignupBusinessDetailsScreen";
import { SignupKycDocumentsScreen } from "./src/screens/auth/partner/SignupKycDocumentsScreen";
import { SignupPayoutAccountScreen } from "./src/screens/auth/partner/SignupPayoutAccountScreen";
import { PartnerOnboardingSuccessScreen } from "./src/screens/auth/partner/PartnerOnboardingSuccessScreen";
import { registerForPushNotifications } from "./src/lib/push";
import { getCachedUser, Lead, Lender, LoanProduct, Quote } from "./src/api/credupe";

export type RootStackParamList = {
  Login: undefined;
  SignupSelection: undefined;
  SignupContactDetails: { businessType?: string };
  SignupVerification: { name: string; mobile: string; email: string; businessType?: string };
  SignupBusinessDetails: undefined;
  SignupKycDocuments: undefined;
  SignupPayoutAccount: undefined;
  PartnerOnboardingSuccess: undefined;
  PartnerHomeDirect: undefined;
  Main: undefined;
  QuoteBuilder: { loanType?: string };
  QuoteResults: { quote: Quote };
  Kyc: undefined;
  Leads: { initialStatus?: string };
  LeadDetail: { lead: Lead };
  NewLead: undefined;
  BulkLeadsImport: undefined;
  Commissions: undefined;
  AdminApplications: { initialStatus?: string };
  AdminKycReview: undefined;
  AdminUsers: undefined;
  AdminLenders: undefined;
  AdminLenderEdit: { lender?: Lender };
  AdminProducts: undefined;
  AdminProductEdit: { product?: LoanProduct };
  PublicQuote: { slug: string };
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator();

const TabIcon: React.FC<{ glyph: string; focused: boolean }> = ({ glyph, focused }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? colors.primaryMuted : "transparent",
      }}
    >
      <Text style={{ color: focused ? colors.tabActive : colors.tabInactive, fontSize: 18, fontWeight: "800" }}>
        {glyph}
      </Text>
    </View>
  );
};

interface MainTabsProps {
  role: "CUSTOMER" | "PARTNER" | "ADMIN";
  onSignedOut: () => void;
  onSelectCategory: (k: string) => void;
  onOpenKyc: () => void;
  onOpenLeads: (status?: string) => void;
  onOpenLead: (lead: Lead) => void;
  onNewLead: () => void;
  onBulkImport: () => void;
  onOpenCommissions: () => void;
  onOpenAdminApps: (status?: string) => void;
  onOpenAdminKyc: () => void;
  onOpenAdminUsers: () => void;
  onOpenAdminLenders: () => void;
  onOpenAdminProducts: () => void;
  onOpenNotifications: () => void;
}

const MainTabs: React.FC<MainTabsProps> = ({
  role,
  onSignedOut,
  onSelectCategory,
  onOpenKyc,
  onOpenLeads,
  onOpenLead,
  onNewLead,
  onBulkImport,
  onOpenCommissions,
  onOpenAdminApps,
  onOpenAdminKyc,
  onOpenAdminUsers,
  onOpenAdminLenders,
  onOpenAdminProducts,
  onOpenNotifications,
}) => {
  const { colors } = useTheme();
  const tabBarStyle = {
    backgroundColor: colors.tabBg,
    borderTopColor: colors.border,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
  };

  if (role === "ADMIN") {
    return (
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle,
          tabBarActiveTintColor: colors.tabActive,
          tabBarInactiveTintColor: colors.tabInactive,
          tabBarLabelStyle: { fontWeight: "700", fontSize: 11 },
          tabBarIcon: ({ focused }) => {
            const glyph =
              route.name === "Console"
                ? "⌂"
                : route.name === "Apps"
                ? "▤"
                : route.name === "KYC"
                ? "✓"
                : "◉";
            return <TabIcon glyph={glyph} focused={focused} />;
          },
        })}
      >
        <Tabs.Screen name="Console">
          {() => (
            <AdminHomeScreen
              onOpenApplications={onOpenAdminApps}
              onOpenDocuments={onOpenAdminKyc}
              onOpenUsers={onOpenAdminUsers}
              onOpenLenders={onOpenAdminLenders}
              onOpenProducts={onOpenAdminProducts}
            />
          )}
        </Tabs.Screen>
        <Tabs.Screen name="Apps">
          {() => <AdminApplicationsScreen />}
        </Tabs.Screen>
        <Tabs.Screen name="KYC">
          {() => <AdminKycReviewScreen />}
        </Tabs.Screen>
        <Tabs.Screen name="Profile">
          {() => <ProfileScreen onSignedOut={onSignedOut} onOpenKyc={onOpenKyc} onOpenNotifications={onOpenNotifications} />}
        </Tabs.Screen>
      </Tabs.Navigator>
    );
  }

  if (role === "PARTNER") {
    return (
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle,
          tabBarActiveTintColor: colors.tabActive,
          tabBarInactiveTintColor: colors.tabInactive,
          tabBarLabelStyle: { fontWeight: "700", fontSize: 11 },
          tabBarIcon: ({ focused }) => {
            const glyph =
              route.name === "Dashboard"
                ? "⌂"
                : route.name === "Leads"
                ? "▤"
                : route.name === "Commissions"
                ? "₹"
                : "◉";
            return <TabIcon glyph={glyph} focused={focused} />;
          },
        })}
      >
        <Tabs.Screen name="Dashboard">
          {() => (
            <PartnerHomeScreen
              onOpenLeads={onOpenLeads}
              onOpenCommissions={onOpenCommissions}
              onNewLead={onNewLead}
              onBulkImport={onBulkImport}
            />
          )}
        </Tabs.Screen>
        <Tabs.Screen name="Leads">
          {() => <LeadsScreen onOpenLead={onOpenLead} onNewLead={onNewLead} />}
        </Tabs.Screen>
        <Tabs.Screen name="Commissions">
          {() => <CommissionsScreen />}
        </Tabs.Screen>
        <Tabs.Screen name="Profile">
          {() => <ProfileScreen onSignedOut={onSignedOut} onOpenKyc={onOpenKyc} onOpenNotifications={onOpenNotifications} />}
        </Tabs.Screen>
      </Tabs.Navigator>
    );
  }

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: { fontWeight: "700", fontSize: 11 },
        tabBarIcon: ({ focused }) => {
          const glyph =
            route.name === "Home"
              ? "⌂"
              : route.name === "Loans"
              ? "₹"
              : route.name === "Applications"
              ? "▤"
              : "◉";
          return <TabIcon glyph={glyph} focused={focused} />;
        },
      })}
    >
      <Tabs.Screen name="Home">
        {() => <HomeScreen onSelectCategory={onSelectCategory} />}
      </Tabs.Screen>
      <Tabs.Screen name="Loans" component={LoansScreen} />
      <Tabs.Screen name="Applications" component={ApplicationsScreen} />
      <Tabs.Screen name="Profile">
        {() => <ProfileScreen onSignedOut={onSignedOut} onOpenKyc={onOpenKyc} onOpenNotifications={onOpenNotifications} />}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
};

const Root: React.FC = () => {
  const { mode, colors } = useTheme();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [role, setRole] = useState<"CUSTOMER" | "PARTNER" | "ADMIN">("CUSTOMER");

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem("credupe.access");
      const u = await getCachedUser();
      if (u?.role) setRole(u.role);
      setAuthed(!!t);
    })();
  }, []);

  // Best-effort push token registration once authed (no-op on web / Expo Go).
  useEffect(() => {
    if (authed) registerForPushNotifications();
  }, [authed]);

  const navTheme = {
    ...(mode === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.bg,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  /**
   * Deep-link routing — handles three URL shapes:
   *   credupe://q/<slug>
   *   https://credupe-app.preview.emergentagent.com/q/<slug>
   *   exp://…/--/q/<slug>   (development with Expo Go)
   */
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [
      Linking.createURL("/"),
      "credupe://",
      "https://credupe-app.preview.emergentagent.com",
    ],
    config: {
      screens: {
        PublicQuote: "q/:slug",
        Notifications: "notifications",
        Main: "*",
      },
    },
  };

  if (authed === null) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme} linking={linking}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Public deep-link target — available in both auth states. */}
        <Stack.Screen name="PublicQuote">
          {({ navigation, route }) => {
            const slug = route.params?.slug;
            if (!slug) {
              navigation.replace(authed ? "Main" : "Login");
              return null;
            }
            return (
              <PublicQuoteScreen
                slug={slug}
                onOpenLogin={() => navigation.navigate(authed ? "Main" : "Login")}
              />
            );
          }}
        </Stack.Screen>

        {!authed ? (
          <>
          <Stack.Screen name="Login">
            {({ navigation }) => (
              <LoginScreen
                onSignup={() => navigation.navigate("SignupSelection")}
                onAuthed={async () => {
                  const u = await getCachedUser();
                  if (u?.role) setRole(u.role);
                  setAuthed(true);
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="SignupSelection" component={SignupSelectionScreen} />
          <Stack.Screen name="SignupContactDetails" component={SignupContactDetailsScreen} />
          <Stack.Screen name="SignupVerification" component={SignupVerificationScreen} />
          <Stack.Screen name="SignupBusinessDetails" component={SignupBusinessDetailsScreen} />
          <Stack.Screen name="SignupKycDocuments" component={SignupKycDocumentsScreen} />
          <Stack.Screen name="SignupPayoutAccount" component={SignupPayoutAccountScreen} />
          <Stack.Screen name="PartnerOnboardingSuccess" component={PartnerOnboardingSuccessScreen} />
          <Stack.Screen name="PartnerHomeDirect" component={PartnerHomeScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main">
              {({ navigation }) => (
                <MainTabs
                  role={role}
                  onSignedOut={() => setAuthed(false)}
                  onSelectCategory={(loanType) => navigation.navigate("QuoteBuilder", { loanType })}
                  onOpenKyc={() => navigation.navigate("Kyc")}
                  onOpenLeads={(status) => navigation.navigate("Leads", { initialStatus: status })}
                  onOpenLead={(lead) => navigation.navigate("LeadDetail", { lead })}
                  onNewLead={() => navigation.navigate("NewLead")}
                  onBulkImport={() => navigation.navigate("BulkLeadsImport")}
                  onOpenCommissions={() => navigation.navigate("Commissions")}
                  onOpenAdminApps={(status) => navigation.navigate("AdminApplications", { initialStatus: status })}
                  onOpenAdminKyc={() => navigation.navigate("AdminKycReview")}
                  onOpenAdminUsers={() => navigation.navigate("AdminUsers")}
                  onOpenAdminLenders={() => navigation.navigate("AdminLenders")}
                  onOpenAdminProducts={() => navigation.navigate("AdminProducts")}
                  onOpenNotifications={() => navigation.navigate("Notifications")}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="QuoteBuilder">
              {({ navigation, route }) => (
                <QuoteBuilderScreen
                  initialLoanType={route.params?.loanType}
                  onBack={() => navigation.goBack()}
                  onQuoteCreated={(quote) => navigation.navigate("QuoteResults", { quote })}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="QuoteResults">
              {({ navigation, route }) => (
                <QuoteResultsScreen
                  quote={route.params.quote}
                  onBack={() => navigation.goBack()}
                  onApplied={() => navigation.navigate("Main")}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Kyc">
              {({ navigation }) => <KycScreen onBack={() => navigation.goBack()} />}
            </Stack.Screen>
            <Stack.Screen name="Leads">
              {({ navigation, route }) => (
                <LeadsScreen
                  initialStatus={route.params?.initialStatus as any}
                  onBack={() => navigation.goBack()}
                  onOpenLead={(lead) => navigation.navigate("LeadDetail", { lead })}
                  onNewLead={() => navigation.navigate("NewLead")}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="LeadDetail">
              {({ navigation, route }) => (
                <LeadDetailScreen
                  lead={route.params.lead}
                  onBack={() => navigation.goBack()}
                  onUpdated={() => navigation.goBack()}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="NewLead">
              {({ navigation }) => (
                <NewLeadScreen
                  onBack={() => navigation.goBack()}
                  onCreated={() => navigation.goBack()}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="BulkLeadsImport">
              {({ navigation }) => (
                <BulkLeadsImportScreen
                  onBack={() => navigation.goBack()}
                  onDone={() => navigation.goBack()}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Commissions">
              {({ navigation }) => <CommissionsScreen onBack={() => navigation.goBack()} />}
            </Stack.Screen>
            <Stack.Screen name="AdminApplications">
              {({ navigation, route }) => (
                <AdminApplicationsScreen
                  initialStatus={route.params?.initialStatus as any}
                  onBack={() => navigation.goBack()}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="AdminKycReview">
              {({ navigation }) => <AdminKycReviewScreen onBack={() => navigation.goBack()} />}
            </Stack.Screen>
            <Stack.Screen name="AdminUsers">
              {({ navigation }) => <AdminUsersScreen onBack={() => navigation.goBack()} />}
            </Stack.Screen>
            <Stack.Screen name="AdminLenders">
              {({ navigation }) => (
                <AdminLendersScreen
                  onBack={() => navigation.goBack()}
                  onEdit={(lender) => navigation.navigate("AdminLenderEdit", { lender })}
                  onCreate={() => navigation.navigate("AdminLenderEdit", {})}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="AdminLenderEdit">
              {({ navigation, route }) => (
                <AdminLenderEditScreen
                  lender={route.params?.lender}
                  onBack={() => navigation.goBack()}
                  onSaved={() => navigation.goBack()}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="AdminProducts">
              {({ navigation }) => (
                <AdminProductsScreen
                  onBack={() => navigation.goBack()}
                  onEdit={(product) => navigation.navigate("AdminProductEdit", { product })}
                  onCreate={() => navigation.navigate("AdminProductEdit", {})}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="AdminProductEdit">
              {({ navigation, route }) => (
                <AdminProductEditScreen
                  product={route.params?.product}
                  onBack={() => navigation.goBack()}
                  onSaved={() => navigation.goBack()}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Notifications">
              {({ navigation }) => <NotificationsScreen onBack={() => navigation.goBack()} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
