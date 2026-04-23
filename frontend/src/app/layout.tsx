import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";
import { themePreloadScript } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Credupe59",
  description: "Credupe — one place for loans, credit cards, and credit scores.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Credupe59",
    description: "Credupe — one place for loans, credit cards, and credit scores.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before React hydration so we never flash the wrong theme. */}
        <Script
          id="credupe-theme-preload"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themePreloadScript }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
