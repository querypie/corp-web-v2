"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { getCookie, setCookie } from "./cookie";

export const UTM_ATTRIBUTION_COOKIE_KEY = "utm-attribution";

export type UtmTouch = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  landing: string;
  ts: string;
};

export type UtmAttribution = {
  first: UtmTouch;
  recent: UtmTouch[]; // 시간순 오름차순, 최대 2개. recent[recent.length - 1]이 last-touch
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export function parseUtm(params: URLSearchParams, landing: string): UtmTouch | null {
  if (!UTM_KEYS.some((key) => params.get(key))) return null;

  const touch: UtmTouch = { landing, ts: new Date().toISOString() };
  if (params.get("utm_source"))   touch.source   = params.get("utm_source")!;
  if (params.get("utm_medium"))   touch.medium   = params.get("utm_medium")!;
  if (params.get("utm_campaign")) touch.campaign = params.get("utm_campaign")!;
  if (params.get("utm_term"))     touch.term     = params.get("utm_term")!;
  if (params.get("utm_content"))  touch.content  = params.get("utm_content")!;
  return touch;
}

export function updateUtmAttribution(
  current: UtmAttribution | null,
  newTouch: UtmTouch,
): UtmAttribution {
  if (!current) return { first: newTouch, recent: [newTouch] };
  return { first: current.first, recent: [...current.recent, newTouch].slice(-2) };
}

export function toSalesforceFields(encodedAttribution: string): Record<string, string> {
  try {
    const attribution: UtmAttribution = JSON.parse(decodeURIComponent(encodedAttribution));
    const fields: Record<string, string> = {};
    const lastTouch = attribution.recent[attribution.recent.length - 1];
    if (lastTouch?.source)          fields["pi__utm_source__c"]      = lastTouch.source;
    if (lastTouch?.medium)          fields["pi__utm_medium__c"]      = lastTouch.medium;
    if (lastTouch?.campaign)        fields["pi__utm_campaign__c"]    = lastTouch.campaign;
    if (lastTouch?.content)         fields["pi__utm_content__c"]     = lastTouch.content;
    if (lastTouch?.term)            fields["pi__utm_term__c"]        = lastTouch.term;
    if (attribution.first?.landing) fields["pi__first_touch_url__c"] = attribution.first.landing;
    return fields;
  } catch {
    return {};
  }
}

export function readUtmCookie(): string | undefined {
  return getCookie(UTM_ATTRIBUTION_COOKIE_KEY) ?? undefined;
}

export default function useUtmCapture(): void {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const newTouch = parseUtm(new URLSearchParams(searchParams.toString()), pathname);
    if (!newTouch) return;

    let current: UtmAttribution | null = null;
    try {
      const raw = getCookie(UTM_ATTRIBUTION_COOKIE_KEY);
      if (raw) current = JSON.parse(decodeURIComponent(raw));
    } catch {
      // 손상된 쿠키는 무시하고 새로 생성
    }

    setCookie(
      UTM_ATTRIBUTION_COOKIE_KEY,
      encodeURIComponent(JSON.stringify(updateUtmAttribution(current, newTouch))),
    );
  }, [pathname, searchParams]);
}
