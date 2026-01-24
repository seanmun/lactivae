import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ISI from "@/components/layout/ISI";
import SpeedDial from "@/components/ui/SpeedDial";
import { css } from "../../styled-system/css";

export const metadata: Metadata = {
  title: "LACTIVAE™ (raw milk, oral solution) - Traditional Nutrition Backed by Modern Research",
  description: "LACTIVAE™ (raw milk, oral solution). Explore the science behind unpasteurized bovine milk with comprehensive research data and clinical studies.",
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
      </body>
    </html>
  );
}
