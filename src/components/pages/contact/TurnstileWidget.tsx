"use client";

import { useEffect, useRef } from "react";

const RENDER_TIMEOUT_MS = 15_000;

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

export default function TurnstileWidget({ onToken }: { onToken: (token: string | undefined) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    let cancelled = false;
    let timer: number | undefined;
    const startedAt = Date.now();
    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => onToken(token),
        "expired-callback": () => onToken(undefined),
        "error-callback": () => onToken(undefined),
      });
      if (timer !== undefined) window.clearInterval(timer);
    };

    renderWidget();
    if (!widgetIdRef.current) {
      timer = window.setInterval(() => {
        if (Date.now() - startedAt >= RENDER_TIMEOUT_MS) {
          if (timer !== undefined) window.clearInterval(timer);
          timer = undefined;
          return;
        }
        renderWidget();
      }, 200);
    }

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearInterval(timer);
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = undefined;
    };
  }, [onToken, siteKey]);

  if (!siteKey) return null;
  return <div ref={containerRef} />;
}
