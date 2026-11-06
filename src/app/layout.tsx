import type { Metadata } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { siteTitle } from "@/constants/site";
import { defaultLocale, isLocale } from "@/constants/i18n";
import { DOCUMENT_LOCALE_HEADER } from "@/features/routing/documentLocale";
import { getRequestSiteOrigin } from "@/features/seo/requestUrl.server";
import { themeInitializationScript } from "@/features/theme/themeScript";
import { isPreviewSeoHost } from "@/features/seo/languages";
import { getHomeMetadataDescription } from "@/copy/homeMetadata";
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

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestSiteOrigin();
  const requestLocale = (await headers()).get(DOCUMENT_LOCALE_HEADER);
  const locale = requestLocale && isLocale(requestLocale) ? requestLocale : defaultLocale;
  return {
    title: siteTitle,
    description: getHomeMetadataDescription(locale),
    metadataBase: origin,
    ...(isPreviewSeoHost(origin.hostname) ? { robots: { index: false, follow: true } } : {}),
    formatDetection: { telephone: false },
  };
}

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const requestLocale = (await headers()).get(DOCUMENT_LOCALE_HEADER);
  const locale = requestLocale && isLocale(requestLocale) ? requestLocale : defaultLocale;

  return (
    <html className={`${jetBrainsMono.variable} ${monaSans.variable} ${pretendard.variable} ${pretendardJp.variable}`} lang={locale} suppressHydrationWarning>
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
