# Credupe Mobile Workspace Guide

This file provides a complete overview of the directory structure, architecture, and file usage for the React Native / Expo application located in the [mobile](file:///E:/amar/development/Credupe24April/mobile) directory.

---

## 📂 Directory Structure Outline

```
mobile/
├── .claude/                   # Assistant configuration / scratch files
├── .expo/                     # Expo CLI metadata and build cache
├── android/                   # Generated native Android project folder
├── assets/                    # Asset files (images, icons, splash screen, fonts)
├── src/                       # Main source code directory
│   ├── api/                   # API client configuration
│   │   └── credupe.ts         # Central API requests interface & fetch utility
│   ├── components/            # Reusable React Native UI components
│   │   ├── auth/              # Auth-specific components
│   │   ├── feedback/          # Feedback and rating modals
│   │   └── ui/                # Base UI elements (Button, Card, Input, Text)
│   ├── lib/                   # Utility libraries and helpers
│   │   ├── csv.ts             # CSV parsing/importing utilities
│   │   ├── format.ts          # Formatting functions (currency, date)
│   │   └── push.ts            # Push notification registration & handling
│   ├── screens/               # Screen components representing application routes
│   │   ├── auth/              # Authentication screens (onboarding)
│   │   └── dashboard/         # Role-based dashboard interfaces
│   │       ├── admin/         # Administrative dashboards
│   │       └── partner/       # Broker & Partner onboarding/portal dashboards
│   └── theme/                 # Global UI themes and colors
│       ├── ThemeProvider.tsx  # Dynamic dark/light theme context provider
│       └── colors.ts          # Color palettes for UI rendering
├── App.tsx                    # Application entry component and React Navigation setup
├── app.json                   # Expo configuration file
├── eas.json                   # EAS Build settings (profiles for android/ios builds)
├── google-services.json       # Firebase credentials for push notifications
├── index.ts                   # Entry script loading App.tsx
├── package.json               # JavaScript dependencies and scripts
└── tsconfig.json              # TypeScript compilation config
```

---

## 📄 File Index & Usage Guide

### 1. App Entry & Routing Configurations

*   **[App.tsx](file:///E:/amar/development/Credupe24April/mobile/App.tsx)**
    *   **Purpose**: Bootstraps the application. Sets up global providers: `ThemeProvider` (dynamic styling), `SafeAreaProvider`, and `Toast`.
    *   **Navigation**: Implements the main navigation stack using `@react-navigation/native-stack` (`createNativeStackNavigator`) and bottom tabs via `@react-navigation/bottom-tabs` (`createBottomTabNavigator`). It handles routing between Login, Partner/Admin Onboarding, and dashboards based on user session state.
*   **[index.ts](file:///E:/amar/development/Credupe24April/mobile/index.ts)**
    *   **Purpose**: Tiny entry file that registers the App root via Expo's environment.
*   **[app.json](file:///E:/amar/development/Credupe24April/mobile/app.json)**
    *   **Purpose**: Configures app metadata (app name, bundle identifiers, splash screen layout, orientation, and plug-in configurations for Expo SDK).
*   **[eas.json](file:///E:/amar/development/Credupe24April/mobile/eas.json)**
    *   **Purpose**: Configuration for Expo Application Services (EAS) cloud builds. Specifying profiles for testing, staging, and production-ready bundles.

---

### 2. The Core Source Code (`src/`)

#### 🔌 API Layer (`src/api/`)
*   **[credupe.ts](file:///E:/amar/development/Credupe24April/mobile/src/api/credupe.ts)**
    *   **Purpose**: The single source of truth for back-end networking. Exports functions for:
        *   User authentication (OTP generation, validation, refresh, logout)
        *   Partner onboarding steps (basic info, verification, payout configs)
        *   Lead management (CRUD, bulk importing, follow-up scheduling)
        *   Loan product eligibility calculations and quotation building.

#### 🧱 Shared Components (`src/components/`)
*   **[CredupeLogo.tsx](file:///E:/amar/development/Credupe24April/mobile/src/components/CredupeLogo.tsx)**: Standardized SVG logo component.
*   **[SignupOptionsList.tsx](file:///E:/amar/development/Credupe24April/mobile/src/components/SignupOptionsList.tsx)**: Renders selection choices during partner registration.
*   **`auth/`**
    *   **[SignupOptionCard.tsx](file:///E:/amar/development/Credupe24April/mobile/src/components/auth/SignupOptionCard.tsx)**: Card UI component to choose partner category.
*   **`feedback/`**
    *   **[FeedbackModal.tsx](file:///E:/amar/development/Credupe24April/mobile/src/components/feedback/FeedbackModal.tsx)**: Modal overlay prompting for feedback.
    *   **[EmojiRating.tsx](file:///E:/amar/development/Credupe24April/mobile/src/components/feedback/EmojiRating.tsx)**: Interactive emoji-based rating selector.
    *   **[GradientButton.tsx](file:///E:/amar/development/Credupe24April/mobile/src/components/feedback/GradientButton.tsx)**: Stylized linear gradient button for CTAs.
*   **`ui/`**
    *   **[Button.tsx](file:///E:/amar/development/Credupe24April/mobile/src/components/ui/Button.tsx)**, **[Card.tsx](file:///E:/amar/development/Credupe24April/mobile/src/components/ui/Card.tsx)**, **[Input.tsx](file:///E:/amar/development/Credupe24April/mobile/src/components/ui/Input.tsx)**, **[Text.tsx](file:///E:/amar/development/Credupe24April/mobile/src/components/ui/Text.tsx)**: Modular atomic layout components that match the global application theme.

#### ⚙️ Helper Utilities (`src/lib/`)
*   **[csv.ts](file:///E:/amar/development/Credupe24April/mobile/src/lib/csv.ts)**: Parser utility used to read, map, and validate Excel/CSV files when performing bulk uploads of customer leads.
*   **[format.ts](file:///E:/amar/development/Credupe24April/mobile/src/lib/format.ts)**: Formatter helpers for currencies (INR ₹ format) and localized timestamps.
*   **[push.ts](file:///E:/amar/development/Credupe24April/mobile/src/lib/push.ts)**: Integrates `expo-notifications` with native device platforms. Handles fetching Expo Push Tokens and registering device IDs.

#### 🖥️ App Screens (`src/screens/`)
*   **General Screens**:
    *   **[LoginScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/LoginScreen.tsx)**: Handle credentials, email OTP requests, and phone authentication.
    *   **[HomeScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/HomeScreen.tsx)**: Route landing dashboard containing active action panels.
    *   **[KycScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/KycScreen.tsx)**: Renders KYC upload flows, tracking status verification.
    *   **[QuoteBuilderScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/QuoteBuilderScreen.tsx)**: Interactive form building loan quotes.
    *   **[QuoteResultsScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/QuoteResultsScreen.tsx)**: Shows matching lender offers side by side.
    *   **[BulkLeadsImportScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/BulkLeadsImportScreen.tsx)**: Screen facilitating file selections for bulk uploading.
    *   **[LeadsScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/LeadsScreen.tsx)** & **[LeadDetailScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/LeadDetailScreen.tsx)**: Active pipelines of customer details.
*   **`auth/partner/` (Partner Signups)**:
    *   **[SignupBasicDetailsScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/dashboard/partner/kyc/SignupBasicDetailsScreen.tsx)**: Onboarding basic identity fields.
    *   **[SignupBusinessDetailsScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/auth/partner/SignupBusinessDetailsScreen.tsx)**: Collects business profile metadata.
    *   **[SignupContactDetailsScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/auth/partner/SignupContactDetailsScreen.tsx)**: Address and secondary phone validation.
    *   **[SignupPayoutAccountScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/auth/partner/SignupPayoutAccountScreen.tsx)**: Collects bank routing numbers and account details for commissions.
    *   **[SignupVerificationScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/auth/partner/SignupVerificationScreen.tsx)**: Multi-step documents upload portal.
*   **`dashboard/admin/` (Administrative tools)**:
    *   **[AdminHomeScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/dashboard/admin/AdminHomeScreen.tsx)**: Renders high level stats, quick metrics, approval queue alerts.
    *   **[AdminKycReviewScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/dashboard/admin/AdminKycReviewScreen.tsx)**: Admin approval portal to approve/reject partner uploaded documents.
    *   **[AdminLendersScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/dashboard/admin/AdminLendersScreen.tsx)** & **[AdminLenderEditScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/dashboard/admin/AdminLenderEditScreen.tsx)**: Lender management panel.
*   **`dashboard/partner/home/` (Partners/Broker Tools)**:
    *   **[PartnerHomeScreen.tsx](file:///E:/amar/development/Credupe24April/mobile/src/screens/dashboard/partner/home/PartnerHomeScreen.tsx)**: Core partner portal containing grid navigation to various application submodules:
        *   `ApplyBusinessLoan`, `ApplyCreditCard`, `ApplyHomeLoan`, `ApplyLAP`, `ApplyPersonalLoan`, etc.
        *   `Eligibility`: Instant credit eligibility engine.
        *   `MyBrokerage` & `MyTeam`: Monitors pay-outs, commission scales, and sub-broker networks.

#### 🎨 Custom Theming (`src/theme/`)
*   **[ThemeProvider.tsx](file:///E:/amar/development/Credupe24April/mobile/src/theme/ThemeProvider.tsx)**: React Context supplying dark mode toggles and global device screen styling values.
*   **[colors.ts](file:///E:/amar/development/Credupe24April/mobile/src/theme/colors.ts)**: Semantic color definitions for background layers, texts, and active highlights.

---

## 🛠️ Developer Scripts & Tools

### Running Mobile Locally

Make sure you have Android SDK and Java JDB environment variables mapped correctly in your terminal, then trigger:
```powershell
# For Windows environments:
$env:ANDROID_HOME="C:\Users\ASUS\AppData\Local\Android\Sdk"
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:Path += ";C:\Program Files\Android\Android Studio\jbr\bin"

# Start Expo Developer Server
npm run start

# Run directly in Android emulator/device
npm run android
```

### Packaging & Builds

*   **Custom Build script**: Run `.\build.ps1` from PowerShell to bundle assets.
*   **Cloud Build**: Run `npx eas build --platform android --profile previewbf` to queue a preview APK build on Expo's EAS cloud servers.
