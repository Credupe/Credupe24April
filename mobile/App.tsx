import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer, DefaultTheme, DarkTheme, LinkingOptions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Linking from "expo-linking";

import { ThemeProvider, useTheme } from "./src/theme/ThemeProvider";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { House, User, Link2, Menu, DollarSign, FileText, ShieldCheck } from "lucide-react-native";
import { LoginScreen } from "./src/screens/LoginScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LoansScreen } from "./src/screens/LoansScreen";
import { ApplicationsScreen } from "./src/screens/ApplicationsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { QuoteBuilderScreen } from "./src/screens/QuoteBuilderScreen";
import { QuoteResultsScreen } from "./src/screens/QuoteResultsScreen";
import { KycScreen } from "./src/screens/KycScreen";
import { PartnerHomeScreen } from "./src/screens/dashboard/partner/home/PartnerHomeScreen";
import { LeadsScreen } from "./src/screens/LeadsScreen";
import { LeadDetailScreen } from "./src/screens/LeadDetailScreen";
import { NewLeadScreen } from "./src/screens/NewLeadScreen";
import { CommissionsScreen } from "./src/screens/CommissionsScreen";
import { BulkLeadsImportScreen } from "./src/screens/BulkLeadsImportScreen";
import { AdminHomeScreen } from "./src/screens/dashboard/admin/AdminHomeScreen";
import { AdminApplicationsScreen } from "./src/screens/dashboard/admin/AdminApplicationsScreen";
import { AdminKycReviewScreen } from "./src/screens/dashboard/admin/AdminKycReviewScreen";
import { AdminUsersScreen } from "./src/screens/dashboard/admin/AdminUsersScreen";
import { AdminLendersScreen } from "./src/screens/dashboard/admin/AdminLendersScreen";
import { AdminLenderEditScreen } from "./src/screens/dashboard/admin/AdminLenderEditScreen";
import { AdminProductsScreen } from "./src/screens/dashboard/admin/AdminProductsScreen";
import { AdminProductEditScreen } from "./src/screens/dashboard/admin/AdminProductEditScreen";
import { PublicQuoteScreen } from "./src/screens/PublicQuoteScreen";
import { NotificationsScreen } from "./src/screens/NotificationsScreen";
import { SignupSelectionScreen } from "./src/screens/dashboard/partner/kyc/SignupSelectionScreen";
import { SignupBasicDetailsScreen } from "./src/screens/dashboard/partner/kyc/SignupBasicDetailsScreen";
import { SignupContactDetailsScreen } from "./src/screens/auth/partner/SignupContactDetailsScreen";
import { SignupVerificationScreen } from "./src/screens/auth/partner/SignupVerificationScreen";
import { SignupBusinessDetailsScreen } from "./src/screens/auth/partner/SignupBusinessDetailsScreen";
import { SignupKycDocumentsScreen } from "./src/screens/dashboard/partner/kyc/SignupKycDocumentsScreen";
import { PartnerKycStatusScreen } from "./src/screens/dashboard/partner/kyc/PartnerKycStatusScreen";
import { SignupPayoutAccountScreen } from "./src/screens/auth/partner/SignupPayoutAccountScreen";
import { PartnerOnboardingSuccessScreen } from "./src/screens/auth/partner/PartnerOnboardingSuccessScreen";
import { ApplyPersonalLoanScreen } from "./src/screens/dashboard/partner/home/ApplyPersonalLoan/ApplyPersonalLoanScreen";
import { ApplyBusinessLoanScreen } from "./src/screens/dashboard/partner/home/ApplyBusinessLoan/ApplyBusinessLoanScreen";
import { ApplyHomeLoanScreen } from "./src/screens/dashboard/partner/home/ApplyHomeLoan/ApplyHomeLoanScreen";
import { ApplyVehicleLoanScreen } from "./src/screens/dashboard/partner/home/ApplyVehicleLoan/ApplyVehicleLoanScreen";
import { ApplyLAPScreen } from "./src/screens/dashboard/partner/home/ApplyLAP/ApplyLAPScreen";
import { ApplyCreditCardScreen } from "./src/screens/dashboard/partner/home/ApplyCreditCard/ApplyCreditCardScreen";
import { ApplyEducationLoanScreen } from "./src/screens/dashboard/partner/home/ApplyEducationLoan/ApplyEducationLoanScreen";
import { ExistingApplicationsScreen } from "./src/screens/dashboard/partner/home/ExistingApplications/ExistingApplicationsScreen";
import { MyTeamScreen } from "./src/screens/dashboard/partner/home/MyTeam/MyTeamScreen";
import { MyBrokerageScreen } from "./src/screens/dashboard/partner/home/MyBrokerage/MyBrokerageScreen";
import { ApplyInsuranceScreen } from "./src/screens/dashboard/partner/home/ApplyInsurance/ApplyInsuranceScreen";
import { InsuranceLoginScreen } from "./src/screens/dashboard/partner/home/InsuranceLogin/InsuranceLoginScreen";
import { ReportsScreen } from "./src/screens/dashboard/partner/home/Reports/ReportsScreen";
import { EligibilityScreen } from "./src/screens/dashboard/partner/home/Eligibility/EligibilityScreen";
import { ReferEarnScreen } from "./src/screens/dashboard/partner/home/ReferEarn/ReferEarnScreen";
import { UtilityToolScreen } from "./src/screens/dashboard/partner/home/UtilityTool/UtilityToolScreen";
import { MoreScreen } from "./src/screens/dashboard/partner/home/More/MoreScreen";
import { registerForPushNotifications } from "./src/lib/push";
import { getCachedUser, fetchPartnerProfile, Lead, Lender, LoanProduct, Quote } from "./src/api/credupe";
import { Header } from "./src/components/ui/Header";
import { DrawerContent } from "./src/navigation/DrawerContent";

export type RootStackParamList = {
  Login: undefined;
  SignupSelection: undefined;
  SignupBasicDetails: { businessType?: string };
  SignupContactDetails: { businessType?: string };
  SignupVerification: { name: string; mobile: string; email: string; businessType?: string; onboardingToken: string };
  SignupBusinessDetails: { onboardingToken: string };
  SignupKycDocuments: {
    businessType?: string;
    basicDetails?: {
      fullName: string;
      month: string | null;
      day: string | null;
      year: string | null;
      gender: "Male" | "Female" | "Other" | null;
    };
  };
  SignupPayoutAccount: {
    onboardingToken: string;
    businessName: string;
    gstNumber?: string;
    panNumber?: string;
    city?: string;
    state?: string;
    pincode?: string;
    address?: string;
  };
  PartnerOnboardingSuccess: { partnerCode: string; tempPassword?: string };
  PartnerHomeDirect: undefined;
  Main: undefined;
  QuoteBuilder: { loanType?: string };
  QuoteResults: { quote: Quote };
  Kyc: undefined;
  PartnerKycStatus: undefined;
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
  ApplyPersonalLoan: undefined;
  ApplyBusinessLoan: undefined;
  ApplyHomeLoan: undefined;
  ApplyVehicleLoan: undefined;
  ApplyLAP: undefined;
  ApplyCreditCard: undefined;
  ApplyEducationLoan: undefined;
  ExistingApplications: undefined;
  MyTeam: undefined;
  MyBrokerage: undefined;
  ApplyInsurance: undefined;
  InsuranceLogin: undefined;
  Reports: undefined;
  Eligibility: undefined;
  ReferEarn: undefined;
  UtilityTool: undefined;
  More: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

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

  const commonScreenOptions = {
    header: ({ route }: any) => <Header title={route.name} />,
    drawerStyle: { width: "80%" },
  };

  if (role === "ADMIN") {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} role={role} onSignedOut={onSignedOut} />}
        screenOptions={commonScreenOptions}
      >
        <Drawer.Screen name="Console">
          {() => (
            <AdminHomeScreen
              onOpenApplications={onOpenAdminApps}
              onOpenDocuments={onOpenAdminKyc}
              onOpenUsers={onOpenAdminUsers}
              onOpenLenders={onOpenAdminLenders}
              onOpenProducts={onOpenAdminProducts}
              onOpenLeads={() => onOpenLeads(undefined)}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen name="Apps">
          {() => <AdminApplicationsScreen />}
        </Drawer.Screen>
        <Drawer.Screen name="KYC">
          {() => <AdminKycReviewScreen />}
        </Drawer.Screen>
        <Drawer.Screen name="Profile">
          {() => <ProfileScreen onSignedOut={onSignedOut} onOpenKyc={onOpenKyc} onOpenNotifications={onOpenNotifications} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    );
  }

  if (role === "PARTNER") {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} role={role} onSignedOut={onSignedOut} />}
        screenOptions={commonScreenOptions}
      >
        <Drawer.Screen name="Home">
          {() => (
            <PartnerHomeScreen
              onOpenLeads={onOpenLeads}
              onOpenCommissions={onOpenCommissions}
              onNewLead={onNewLead}
              onBulkImport={onBulkImport}
              onOpenKyc={onOpenKyc}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen name="Profile">
          {() => <ProfileScreen onSignedOut={onSignedOut} onOpenKyc={onOpenKyc} onOpenNotifications={onOpenNotifications} />}
        </Drawer.Screen>
        <Drawer.Screen name="Utility Tool">
          {() => <UtilityToolScreen />}
        </Drawer.Screen>
        <Drawer.Screen name="More">
          {() => <MoreScreen />}
        </Drawer.Screen>
      </Drawer.Navigator>
    );
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} role={role} onSignedOut={onSignedOut} />}
      screenOptions={commonScreenOptions}
    >
      <Drawer.Screen name="Home">
        {() => <HomeScreen onSelectCategory={onSelectCategory} />}
      </Drawer.Screen>
      <Drawer.Screen name="Loans" component={LoansScreen} />
      <Drawer.Screen name="Applications" component={ApplicationsScreen} />
      <Drawer.Screen name="Profile">
        {() => <ProfileScreen onSignedOut={onSignedOut} onOpenKyc={onOpenKyc} onOpenNotifications={onOpenNotifications} />}
      </Drawer.Screen>
    </Drawer.Navigator>
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
                  onSignup={() => navigation.navigate("SignupContactDetails")}
                  onAuthed={async () => {
                    const u = await getCachedUser();
                    if (u?.role) setRole(u.role);
                    setAuthed(true);
                  }}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="PartnerOnboardingSuccess">
              {({ navigation, route }) => (
                <PartnerOnboardingSuccessScreen
                  navigation={navigation}
                  route={route}
                  onAuthed={async () => {
                    const u = await getCachedUser();
                    if (u?.role) setRole(u.role);
                    setAuthed(true);
                  }}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="PartnerHomeDirect">
              {({ navigation }) => (
                <MainTabs
                  role="PARTNER"
                  onSignedOut={() => setAuthed(false)}
                  onSelectCategory={(loanType) => navigation.navigate("QuoteBuilder", { loanType })}
                  onOpenKyc={async () => {
                    try {
                      const res = await fetchPartnerProfile();
                      if (res.success && res.data?.profile?.onboardingStep === "COMPLETE") {
                        navigation.navigate("PartnerKycStatus");
                      } else {
                        navigation.navigate("SignupSelection");
                      }
                    } catch {
                      navigation.navigate("SignupSelection");
                    }
                  }}
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
          </>
        ) : (
          <>
            <Stack.Screen name="Main">
              {({ navigation }) => (
                <MainTabs
                  role={role}
                  onSignedOut={() => setAuthed(false)}
                  onSelectCategory={(loanType) => navigation.navigate("QuoteBuilder", { loanType })}
                  onOpenKyc={async () => {
                    if (role === "PARTNER") {
                      try {
                        const res = await fetchPartnerProfile();
                        if (res.success && res.data?.profile?.onboardingStep === "COMPLETE") {
                          navigation.navigate("PartnerKycStatus");
                        } else {
                          navigation.navigate("SignupSelection");
                        }
                      } catch {
                        navigation.navigate("SignupSelection");
                      }
                    } else {
                      navigation.navigate("Kyc");
                    }
                  }}
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
            <Stack.Screen name="PartnerKycStatus">
              {() => <PartnerKycStatusScreen />}
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
        <Stack.Screen name="SignupSelection" component={SignupSelectionScreen} />
        <Stack.Screen name="SignupBasicDetails" component={SignupBasicDetailsScreen} />
        <Stack.Screen name="SignupContactDetails" component={SignupContactDetailsScreen} />
        <Stack.Screen name="SignupVerification" component={SignupVerificationScreen} />
        <Stack.Screen name="SignupBusinessDetails" component={SignupBusinessDetailsScreen} />
        <Stack.Screen name="SignupKycDocuments" component={SignupKycDocumentsScreen} />
        <Stack.Screen name="SignupPayoutAccount" component={SignupPayoutAccountScreen} />
        <Stack.Screen name="ApplyPersonalLoan" component={ApplyPersonalLoanScreen} />
        <Stack.Screen name="ApplyBusinessLoan" component={ApplyBusinessLoanScreen} />
        <Stack.Screen name="ApplyHomeLoan" component={ApplyHomeLoanScreen} />
        <Stack.Screen name="ApplyVehicleLoan" component={ApplyVehicleLoanScreen} />
        <Stack.Screen name="ApplyLAP" component={ApplyLAPScreen} />
        <Stack.Screen name="ApplyCreditCard" component={ApplyCreditCardScreen} />
        <Stack.Screen name="ApplyEducationLoan" component={ApplyEducationLoanScreen} />
        <Stack.Screen name="ExistingApplications" component={ExistingApplicationsScreen} />
        <Stack.Screen name="MyTeam" component={MyTeamScreen} />
        <Stack.Screen name="MyBrokerage" component={MyBrokerageScreen} />
        <Stack.Screen name="ApplyInsurance" component={ApplyInsuranceScreen} />
        <Stack.Screen name="InsuranceLogin" component={InsuranceLoginScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="Eligibility" component={EligibilityScreen} />
        <Stack.Screen name="ReferEarn" component={ReferEarnScreen} />
        <Stack.Screen name="UtilityTool" component={UtilityToolScreen} />
        <Stack.Screen name="More" component={MoreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Root />
        <Toast />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
