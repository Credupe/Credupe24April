# Credupe Workspace Architecture Guide (Root)

Welcome to the Credupe repository. This monorepo/multi-project workspace brings together a full-stack loan origination and financial management ecosystem consisting of three main parts:
1. **Web Frontend (Root)**: A Next.js web application.
2. **Backend API (api/)**: A Cloudflare Workers Hono service running Drizzle ORM and D1 Database.
3. **Mobile Client (mobile/)**: An Expo React Native app targeting partners, agents, and clients.

---

## 📂 Global Repository Structure

```
Credupe24April/
├── api/                       # [Cloudflare Workers API] D1 Database + Hono Framework
│   ├── src/
│   │   ├── db/                # Drizzle schema definition
│   │   ├── lib/               # Security, IDs, and payload envelopes
│   │   └── modules/           # Endpoint handlers (Auth, Leads, Products, SMS Engine)
│   └── brain.md               # Backend architecture, schema guide & API commands
│
├── mobile/                    # [React Native Client] Expo-based mobile app
│   ├── src/
│   │   ├── api/               # API endpoint fetch connectors
│   │   ├── components/        # Mobile-specific UI elements (Buttons, feedback)
│   │   └── screens/           # Auth, Partner dashboard, and admin tools
│   └── brain.md               # Mobile UI directory maps, emulator settings & build scripts
│
├── app/                       # [Next.js Routing] Route entries for the Web Application
│   ├── layout.tsx             # Root page wrappers
│   ├── page.tsx               # Web landing page
│   └── ...                    # Route directories (e.g. personal-loan, partner-dashboard)
│
├── screens/                   # [Web Views] The actual page components rendered by Next.js app/
│   ├── PersonalLoan.tsx
│   ├── PartnerDashboard.tsx
│   └── ...
│
├── components/                # [Web UI Components] Shared components for web layouts
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ui/                    # Atomic shadcn/ui components
│
├── hooks/                     # Custom React Web hooks (useAuth, useSidebarContent)
├── lib/                       # Web helper libraries
│   ├── credupe-api.ts         # Global backend API client for Next.js
│   ├── react-router-dom.tsx   # Compatibility shim mapping React Router to Next.js navigation
│   └── utils.ts               # CSS classes merger helper (clsx + tailwind-merge)
├── data/                      # Static configurations, sidebar mappings, and product mock data
├── public/                    # Web application assets (images, icons)
├── package.json               # Root dependencies and npm script bindings
├── tsconfig.json              # Main project compiler configurations and path mapping aliases
└── brain.md                   # (This file) Architecture overview and global workflows
```

---

## 🏗️ Architectural Frameworks & Patterns

### 1. The Next.js View Mapping Pattern
*   In `@/tsconfig.json`, the path alias `@/pages/*` is mapped directly to `./screens/*`.
*   The Next.js App Router routing directories (inside `app/`) host simple wrapper files. For instance, **[app/admin-dashboard/page.tsx](file:///E:/amar/development/Credupe24April/app/admin-dashboard/page.tsx)** consists of:
    ```tsx
    "use client";
    import Page from "@/pages/AdminDashboard"; // Maps to screens/AdminDashboard.tsx
    export default function RoutePage() {
      return <Page />;
    }
    ```
*   This pattern allows components written for Single Page Applications (SPAs) to be mounted seamlessly inside Next.js routes.

### 2. React Router v6 to Next.js Navigation Shim
*   Since many screens and pages import from `react-router-dom`, a compatibility shim was introduced in **[lib/react-router-dom.tsx](file:///E:/amar/development/Credupe24April/lib/react-router-dom.tsx)**.
*   The tsconfig.json paths entry redirects any imports of `"react-router-dom"` to this file:
    ```json
    "react-router-dom": ["./lib/react-router-dom.tsx"]
    ```
*   The shim translates React Router components (`Link`, `NavLink`, hooks like `useNavigate`, `useLocation`, `useParams`) into Next.js equivalent hooks (`useRouter`, `usePathname`, `useParams` from `next/navigation`).

### 3. API Integrations
*   **Web Client API**: Located in **[lib/credupe-api.ts](file:///E:/amar/development/Credupe24April/lib/credupe-api.ts)**. Persists credentials in `localStorage` under `credupe_access` and `credupe_refresh` tokens, and performs fetch calls against the Cloudflare Workers backend routing endpoints.
*   **Mobile Client API**: Located in **[mobile/src/api/credupe.ts](file:///E:/amar/development/Credupe24April/mobile/src/api/credupe.ts)**. It mirrors the exact backend endpoint shapes and manages asynchronous authentication headers using React Native's `AsyncStorage`.

---

## 🚀 Running The Ecosystem Locally

To run the full Credupe ecosystem on a development machine:

### 1. Run the Backend API
Start wrangler emulator in the `api` folder:
```powershell
cd api
npx wrangler dev --config wrangler.api.jsonc --ip 0.0.0.0
```
*(The `--ip 0.0.0.0` binding allows local devices on the same Wi-Fi network to call the API endpoint during mobile testing)*

### 2. Run the Next.js Web Client
Launch the Next.js development server from the repository root:
```powershell
npm run dev
```
*(Runs by default on [http://localhost:3000](http://localhost:3000))*

### 3. Run the Mobile App
Open the mobile folder and launch Expo developer portal:
```powershell
cd mobile
# Set emulator environment variables (if running on Windows with Android Studio)
$env:ANDROID_HOME="C:\Users\ASUS\AppData\Local\Android\Sdk"
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:Path += ";C:\Program Files\Android\Android Studio\jbr\bin"

# Start Metro Bundler
npm run start
```
Press `a` in Metro Console to launch on a running Android emulator.
