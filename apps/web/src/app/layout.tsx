import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "THE WANS - Papua New Guinea & Pacific Islander Streaming",
  description: "The premier streaming platform for Papua New Guinea, Pacific Islander, and world cinema. Watch authentic stories from PNG and the Pacific.",
  keywords: ["Papua New Guinea", "Pacific Islander", "streaming", "films", "movies", "PNG", "THE WANS"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="antialiased">
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
