import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { siteTitle, siteUrl } from "@/constants/site";
import "../styles/globals.css";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const monaSans = localFont({
  src: "../../public/fonts/MonaSansVF.woff2",
  display: "swap",
  variable: "--font-mona-sans",
  weight: "200 900",
  style: "normal",
});

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
  weight: "45 920",
  style: "normal",
  preload: false,
});

const mPlus1 = localFont({
  src: "../../public/fonts/MPLUS1-Regular.woff2",
  display: "swap",
  variable: "--font-m-plus-1",
  weight: "400",
  style: "normal",
  preload: false,
});

export const metadata: Metadata = {
  title: siteTitle,
  description: "QueryPie AI transforms how enterprises work with AI.",
  metadataBase: new URL(siteUrl),
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className={`${jetBrainsMono.variable} ${monaSans.variable} ${pretendard.variable} ${mPlus1.variable}`} lang="en">
      <body className="bg-bg">{children}</body>
    </html>
  );
}
