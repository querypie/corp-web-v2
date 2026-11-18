"use client";

import { useEffect, useRef, useState } from "react";

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

export default function TurnstileWidget({
  onToken,
  unavailableMessage,
}: {
  onToken: (token: string | undefined) => void;
  unavailableMessage?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const [unavailable, setUnavailable] = useState(false);
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
          setUnavailable(true);
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
  return (
    <div>
      {unavailable && unavailableMessage ? (
        <p className="m-0 mb-2 type-body-sm leading-5 text-fg">{unavailableMessage}</p>
      ) : null}
      <div ref={containerRef} />
    </div>
  );
}
