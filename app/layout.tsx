import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/brand";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteUrl } from "@/lib/site-url";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME} | Interactive Kiosks for Trade Shows and Lobbies`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Custom interactive kiosks and installations for trade shows and corporate lobbies. Touchscreens, LED lighting, physical buttons and sensors, built end to end in Portland, Oregon.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
      <GoogleAnalytics gaId="G-M2WVRYNXYJ" />
    </html>
  );
}
