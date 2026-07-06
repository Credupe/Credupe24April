# CreduPe Mobile (Expo / React Native)

Phase-1 native client for CreduPe, sharing the same Hono + D1 backend as the Next.js web app.

## Themes

Two opinionated themes, persisted across sessions via AsyncStorage and toggleable from the login screen and the Profile tab:

| Mode  | Surface       | Accent       | Maps to                  |
|-------|---------------|--------------|--------------------------|
| dark  | `#0B0F14`     | `#D8FF85`    | Next.js "night-mode neon"|
| light | `#F7F5FF`     | `#7C3AED`    | credupe.com "day-mode violet" |

Defined in `src/theme/colors.ts`, provided by `src/theme/ThemeProvider.tsx`.

## Logo

The CreduPe pin-P glyph is a custom `react-native-svg` component in `src/components/CredupeLogo.tsx` — no asset files, theme-aware (it picks up the active primary colour).

## Backend

`EXPO_PUBLIC_BACKEND_URL` in `.env` points to the same preview backend the Next.js app uses. JWT access + refresh are stored in AsyncStorage by `src/api/credupe.ts`, which transparently handles 401 → refresh → retry.

## Run

### Browser preview (Expo Web on the platform preview URL)
```bash
bash /app/scripts/preview-mobile.sh        # swap supervisor to Expo on :3000
bash /app/scripts/preview-web.sh           # swap back to Next.js
```

### Native preview (Expo Go on phone)
```bash
bash /app/scripts/preview-mobile-tunnel.sh # prints a QR; scan with Expo Go
```

### Direct yarn commands (inside /app/mobile)
```bash
yarn expo start --web --port 3000          # web only
yarn expo start --tunnel                   # phone via Expo Go
yarn expo start --ios                      # iOS Simulator
yarn expo start --android                  # Android Emulator
```

## Demo logins

Same credentials as the web app — see `/app/memory/test_credentials.md`.

### Admin mode (role-aware bottom tabs)
- `AdminHomeScreen` — Total-applications hero, **funnel-by-status grid** (LEAD → LOGIN → DOC_PENDING → UNDER_REVIEW → APPROVED → DISBURSED → REJECTED → CANCELLED, every tile tap-filters into Apps), quick-link rows for All applications, KYC review, Users, Lenders
- `AdminApplicationsScreen` — Every loan application across all customers, status filter chips, tap any row to invoke a transition action sheet (move to any of 8 statuses)
- `AdminKycReviewScreen` — Cross-user document queue with UPLOADED/VERIFIED/REJECTED filter and per-doc ✓ Approve / ✕ Reject buttons (`POST /documents/:id/verify`)
- `AdminUsersScreen` — All users with ALL/CUSTOMER/PARTNER/ADMIN role filter
- `AdminLendersScreen` — Full lender catalogue with tap-to-edit + `+ New` button
- `AdminLenderEditScreen` — Create or edit a lender (name, slug, logo, webhook, MOCK / LIVE toggle, active switch) → `POST /lenders` or `PATCH /lenders/:id`
- `AdminProductsScreen` — All loan products with type-filter chips, tap-to-edit + `+ New` button, per-row rate pill
- `AdminProductEditScreen` — Create or edit a loan product (lender picker, loan-type chips, amount/tenure/rate bands, eligibility fields, active switch) → `POST /loan-products` or `PATCH /loan-products/:id`

## Phase-1 + 2 + 3 + 4 + 5 screen coverage

### Customer mode
- `LoginScreen` — Mobile-OTP and Email-Password tabs, theme toggle pill
- `HomeScreen` — Greeting, eligibility CTA, 5 loan categories (tap → QuoteBuilder), "My applications" preview
- `LoansScreen` — Full product catalogue from `/api/v1/loan-products`
- `ApplicationsScreen` — Customer's applications with stage tracker
- `QuoteBuilderScreen` — Loan-type chips, amount/tenure/rate inputs, **live EMI preview**, optional income+CIBIL
- `QuoteResultsScreen` — Ranked offers (best-rate badge), per-offer EMI/rate/proc-fee, **native Share.share**, "Apply" creates a tracked `/loan-applications` row
- `KycScreen` — Full profile editor, 5 document slots (PAN/Aadhaar/Selfie/Income/Bank-statement), `expo-image-picker` + `expo-document-picker`, end-to-end **presign → PUT → register**

### Partner mode (role-aware bottom tabs)
- `PartnerHomeScreen` — Total payout hero card, pending/approved/paid breakdown, 5-bucket lead-pipeline grid (each tile drills into filtered leads), "+ Add new lead" CTA
- `LeadsScreen` — Full lead inbox, status filter chips with counts, avatar initials, tap a row → detail
- `LeadDetailScreen` — Customer card with **tap-to-call & WhatsApp** quick actions, status workflow (NEW → CONTACTED → QUALIFIED → CONVERTED/DROPPED), notes editor, **schedule follow-up**
- `NewLeadScreen` — Capture customer name / mobile / email / loan-type chips / amount / city / notes → `POST /leads`
- `CommissionsScreen` — Live ledger of commission rows with status filter (ALL/PENDING/APPROVED/PAID/CANCELLED), KPI hero

### Public (no-auth)
- `PublicQuoteScreen` — Deep-link target for `https://credupe-app.preview.emergentagent.com/q/:slug` and `credupe://q/:slug`. Renders the shared quote (best-rate hero + ranked offers, PII stripped) and CTAs into the app.

### Both modes
- `ProfileScreen` — User card, Notifications entry, KYC entry (customer), theme picker, sign-out
- `NotificationsScreen` — In-app inbox with unread badge, per-row tap-to-read, "Mark all read" CTA

## Roadmap (full parity with Next.js, phased)

- ✅ **Phase 1**: auth + dashboard + product listing + applications + theme picker
- ✅ **Phase 2**: quote create + EMI calculator + share link + apply-from-quote
- ✅ **Phase 3**: KYC profile + document uploads (image / PDF) via the presign pipeline
- ✅ **Phase 4**: Partner cockpit (lead inbox, drill-down, follow-ups, commission ledger)
- ✅ **Phase 5**: Admin lite (funnel, all-applications + transitions, KYC review, users, lenders)
- ✅ **Phase 6**: Expo Notifications + deep-link `credupe://q/:slug` (public quote share view) + in-app notifications inbox
