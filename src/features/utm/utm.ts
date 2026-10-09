"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { getCookie, setCookie } from "./cookie";

import {
  parseUtm,
  updateUtmAttribution,
  UTM_ATTRIBUTION_COOKIE_KEY,
  type UtmAttribution,
} from "./attribution";

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
