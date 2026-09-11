import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ISI from "@/components/layout/ISI";
import SpeedDial from "@/components/ui/SpeedDial";
import XRayGate from "@/components/xray/XRayGate";
import { css } from "../../styled-system/css";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://lactivae.vercel.app";
const TITLE = "LACTIVAE™ (raw milk, oral solution) - Traditional Nutrition Backed by Modern Research";
const DESCRIPTION =
  "LACTIVAE™ (raw milk, oral solution). Explore the science behind unpasteurized bovine milk with comprehensive research data and clinical studies.";

export const metadata: Metadata = {
  // metadataBase makes every relative image URL below absolute, which link
  // previews require. opengraph-image.png / twitter-image.png / icon.png /
  // apple-icon.png / favicon.ico in this folder are picked up by convention.
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | LACTIVAE™" },
  description: DESCRIPTION,
  applicationName: "LACTIVAE™",
  openGraph: {
    type: "website",
    siteName: "LACTIVAE™",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={css({
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          paddingBottom: "120px", // Space for ISI footer with preview text
        })}
      >
        <Header />
        <main
          className={css({
            flex: "1",
          })}
        >
          {children}
        </main>
        <Footer />
        <ISI />
        <SpeedDial />
        <XRayGate />
      </body>
    </html>
  );
}
