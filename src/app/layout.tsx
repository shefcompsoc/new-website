import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { calendarOrigin } from "@/lib/calendar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(calendarOrigin),
  openGraph: {
    type: "website",
    siteName: "Sheffield CompSoc",
    locale: "en_GB",
    images: [{ url: "/brand/cover.png", width: 2976, height: 1572, alt: "Sheffield CompSoc" }],
  },
  twitter: { card: "summary_large_image", images: ["/brand/cover.png"] },
  title: {
    default: "Sheffield CompSoc",
    template: "%s | Sheffield CompSoc",
  },
  description:
    "The University of Sheffield Computer Science Society - events, resources and community.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
