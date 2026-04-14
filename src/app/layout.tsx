import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Topbar } from "@/components/layout/Topbar";

import { Footer } from "@/components/layout/Footer";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Startle Labs — Branding & Creative Agency",
  description:
    "Brand strategy, creative direction, and digital design that inspires. Startle Labs builds brands that move markets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground font-sans">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Topbar />
        <main id="main-content">{children}</main>
        <Footer />

        {/* Google Analytics — replace GA_MEASUREMENT_ID with actual ID */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
