export interface DashboardMenuItem {
  id: string;
  title: string;
  icon: string;
  iconType: "MaterialCommunityIcons" | "FontAwesome" | "Ionicons";
  route: string;
}

export const DASHBOARD_MENU: DashboardMenuItem[] = [
  {
    id: "apply_personal_loan",
    title: "Apply Personal Loan",
    icon: "account-cash-outline",
    iconType: "MaterialCommunityIcons",
    route: "ApplyPersonalLoan",
  },
  /*
  {
    id: "apply_business_loan",
    title: "Apply Business Loan",
    icon: "briefcase-outline",
    iconType: "MaterialCommunityIcons",
    route: "ApplyBusinessLoan",
  },
  {
    id: "apply_home_loan",
    title: "Apply Home Loan",
    icon: "home-outline",
    iconType: "MaterialCommunityIcons",
    route: "ApplyHomeLoan",
  },
  {
    id: "apply_vehicle_loan",
    title: "Apply Vehicle Loan",
    icon: "car-outline",
    iconType: "MaterialCommunityIcons",
    route: "ApplyVehicleLoan",
  },
  {
    id: "apply_lap",
    title: "Apply LAP",
    icon: "home-currency-usd",
    iconType: "MaterialCommunityIcons",
    route: "ApplyLAP",
  },
  */
  {
    id: "apply_credit_card",
    title: "Apply Credit Card",
    icon: "credit-card-outline",
    iconType: "MaterialCommunityIcons",
    route: "ApplyCreditCard",
  },
  {
    id: "apply_education_loan",
    title: "Apply Education Loan",
    icon: "school-outline",
    iconType: "MaterialCommunityIcons",
    route: "ApplyEducationLoan",
  },
  /*
  {
    id: "existing_applications",
    title: "Existing Applications",
    icon: "file-document-outline",
    iconType: "MaterialCommunityIcons",
    route: "ExistingApplications",
  },
  {
    id: "my_team",
    title: "My Team",
    icon: "account-group-outline",
    iconType: "MaterialCommunityIcons",
    route: "MyTeam",
  },
  {
    id: "my_brokerage",
    title: "My Brokerage",
    icon: "wallet-outline",
    iconType: "MaterialCommunityIcons",
    route: "MyBrokerage",
  },
  {
    id: "apply_insurance",
    title: "Apply Insurance",
    icon: "shield-check-outline",
    iconType: "MaterialCommunityIcons",
    route: "ApplyInsurance",
  },
  {
    id: "insurance_login",
    title: "Insurance Login",
    icon: "shield-key-outline",
    iconType: "MaterialCommunityIcons",
    route: "InsuranceLogin",
  },
  {
    id: "reports",
    title: "Reports",
    icon: "chart-bar",
    iconType: "MaterialCommunityIcons",
    route: "Reports",
  },
  {
    id: "eligibility",
    title: "Eligibility",
    icon: "checkbox-marked-circle-outline",
    iconType: "MaterialCommunityIcons",
    route: "Eligibility",
  },
  {
    id: "refer_earn",
    title: "Refer & Earn",
    icon: "gift-outline",
    iconType: "MaterialCommunityIcons",
    route: "ReferEarn",
  },
  */
];
