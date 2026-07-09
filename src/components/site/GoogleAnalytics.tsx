"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  COOKIE_PREFERENCE_CHANGE_EVENT,
  readCookiePreference,
} from "@/features/cookie-preferences/preferences";
import {
  buildGoogleAnalyticsBootstrapScript,
  buildGoogleAnalyticsPagePath,
} from "@/features/analytics/google";

type GoogleAnalyticsProps = {
  measurementId: string;
};

function getGtag() {
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;

  return typeof gtag === "function" ? gtag : null;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isBootstrapReady, setIsBootstrapReady] = useState(false);
  const lastSentPagePath = useRef<string | null>(null);
  const search = searchParams.toString();
  const pagePath = buildGoogleAnalyticsPagePath(pathname, search);

  const sendPageView = useCallback(() => {
    if (!measurementId || !isBootstrapReady || !readCookiePreference("analysis")) {
      return;
    }

    const gtag = getGtag();

    if (!gtag || lastSentPagePath.current === pagePath) {
      return;
    }

    lastSentPagePath.current = pagePath;

    gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: pagePath,
      page_title: document.title,
    });
  }, [isBootstrapReady, measurementId, pagePath]);

  useEffect(() => {
    sendPageView();
    window.addEventListener(COOKIE_PREFERENCE_CHANGE_EVENT, sendPageView);

    return () => {
      window.removeEventListener(COOKIE_PREFERENCE_CHANGE_EVENT, sendPageView);
    };
  }, [sendPageView]);

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        id="google-analytics-bootstrap"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: buildGoogleAnalyticsBootstrapScript(measurementId),
        }}
        onReady={() => setIsBootstrapReady(true)}
      />
      <Script
        async
        id="google-analytics-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="afterInteractive"
      />
    </>
  );
}
