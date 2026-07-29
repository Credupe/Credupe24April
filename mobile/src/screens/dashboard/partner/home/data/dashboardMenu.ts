export interface DashboardMenuItem {
  id: string;
  title: string;
  description: string;
  iconName: "Wallet" | "CreditCard" | "GraduationCap";
  route: string;
}

export const DASHBOARD_MENU: DashboardMenuItem[] = [
  {
    id: "apply_personal_loan",
    title: "Personal Loan",
    description: "Quick approval",
    iconName: "Wallet",
    route: "ApplyPersonalLoan",
  },
  // {
  //   id: "apply_credit_card",
  //   title: "Credit Card",
  //   description: "Best offers",
  //   iconName: "CreditCard",
  //   route: "ApplyCreditCard",
  // },
  {
    id: "apply_education_loan",
    title: "Education Loan",
    description: "Study without limits",
    iconName: "GraduationCap",
    route: "ApplyEducationLoan",
  },
];
