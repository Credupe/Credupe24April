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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme preload */}
        <Script
          id="credupe-theme-preload"
          src="/theme-preload.js"
          strategy="beforeInteractive"
        />

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xdjagtlazq");
          `}
        </Script>
      </head>

      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}