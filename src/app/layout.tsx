import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { siteTitle, siteUrl } from "../constants/site";
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
    <html className={`${jetBrainsMono.variable} ${monaSans.variable}`} lang="en">
      <head>
        <link crossOrigin="anonymous" href="https://cdn.jsdelivr.net" rel="preconnect" />
        <link
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
          rel="stylesheet"
        />
        <link
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-jp-dynamic-subset.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg">{children}</body>
    </html>
  );
}
