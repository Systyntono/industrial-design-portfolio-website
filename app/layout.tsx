import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tyson Jiang — Industrial Design Portfolio",
  description: "Industrial design portfolio and case studies.",
};

// TEMPORARY debug tool — on-screen console for mobile testing (iOS Safari,
// no Mac available for remote inspection). Currently switched off; flip to
// true to bring the floating console back on every build (dev + prod).
const SHOW_DEBUG_CONSOLE = false;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {SHOW_DEBUG_CONSOLE && (
          <>
            <Script src="https://cdn.jsdelivr.net/npm/eruda" strategy="beforeInteractive" />
            <Script id="eruda-init" strategy="beforeInteractive">
              {`if (typeof eruda !== "undefined") { eruda.init(); }`}
            </Script>
          </>
        )}
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
