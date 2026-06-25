import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Credupe",
  description: "Credupe — one place for loans, credit cards, and credit scores.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Credupe",
    description: "Credupe — one place for loans, credit cards, and credit scores.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Theme preload script is served as a static file from /public/
          (see public/theme-preload.js). Using `src` instead of
          dangerouslySetInnerHTML removes the inline-script XSS surface
          even though the content is a compile-time constant.
        */}
        <Script
          id="credupe-theme-preload"
          src="/theme-preload.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
