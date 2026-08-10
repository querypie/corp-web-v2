import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { siteTitle, siteUrl } from "@/constants/site";
import { themeInitializationScript } from "@/features/theme/themeScript";
import "../styles/globals.css";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const monaSans = localFont({
  src: "../../public/assets/fonts/MonaSansVF.woff2",
  display: "swap",
  variable: "--font-mona-sans",
  weight: "200 900",
  style: "normal",
});

const pretendard = localFont({
  src: "../../public/assets/fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
  weight: "45 920",
  style: "normal",
  preload: false,
});

const pretendardJp = localFont({
  src: "../../public/assets/fonts/PretendardJPVariable.woff2",
  display: "swap",
  variable: "--font-pretendard-jp",
  weight: "45 920",
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
    <html className={`${jetBrainsMono.variable} ${monaSans.variable} ${pretendard.variable} ${pretendardJp.variable}`} lang="en" suppressHydrationWarning>
      <head>
        <meta content="#FFFFFF" name="theme-color" />
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      </head>
      <body className="bg-bg">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
