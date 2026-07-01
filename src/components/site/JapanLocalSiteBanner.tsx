"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import { stripLocalePrefix, type Locale } from "@/constants/i18n";

const JAPAN_LOCAL_SITE_URL = "https://querypie.ai/";
const exitDurationMs = 280;

type JapanLocalSiteBannerProps = {
  currentLocale: Locale;
};

function isHomePath(pathname: string) {
  return stripLocalePrefix(pathname) === "/";
}

export default function JapanLocalSiteBanner({
  currentLocale,
}: JapanLocalSiteBannerProps) {
  const pathname = usePathname();
  const bannerRef = useRef<HTMLElement | null>(null);
  const shouldShow = currentLocale === "ja" && isHomePath(pathname);
  const [present, setPresent] = useState(shouldShow);
  const [active, setActive] = useState(shouldShow);

  useEffect(() => {
    if (!shouldShow) {
      setActive(false);
      document.documentElement.style.setProperty("--language-banner-offset", "0px");

      const timeout = window.setTimeout(() => {
        setPresent(false);
      }, exitDurationMs);

      return () => {
        window.clearTimeout(timeout);
      };
    }

    setPresent(true);
    const frame = window.requestAnimationFrame(() => {
      setActive(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [shouldShow]);

  useEffect(() => {
    const banner = bannerRef.current;

    if (!active || !banner) {
      if (!shouldShow) {
        document.documentElement.style.setProperty("--language-banner-offset", "0px");
      }
      return;
    }

    const syncOffset = () => {
      document.documentElement.style.setProperty(
        "--language-banner-offset",
        `${Math.ceil(banner.getBoundingClientRect().height)}px`,
      );
    };

    syncOffset();

    const observer = new ResizeObserver(syncOffset);
    observer.observe(banner);

    return () => {
      observer.disconnect();
      if (!shouldShow) {
        document.documentElement.style.setProperty("--language-banner-offset", "0px");
      }
    };
  }, [active, shouldShow]);

  useEffect(() => {
    return () => {
      document.documentElement.style.removeProperty("--language-banner-offset");
    };
  }, []);

  if (!present) {
    return null;
  }

  return (
    <aside
      aria-label="日本向けホームページの案内"
      className={[
        "fixed inset-x-0 top-0 z-[60] flex items-center justify-center border-b border-border bg-bg-deep px-5 py-3 text-fg shadow-[0_10px_24px_rgba(var(--color-overlay-rgb)/0.22)] transition-[opacity,transform] duration-300 ease-out md:px-10 md:py-5",
        active ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
      ].join(" ")}
      ref={bannerRef}
    >
      <div className="flex w-full max-w-[1200px] flex-row items-center justify-between gap-3 text-left md:justify-center md:gap-5 md:text-center">
        <p className="m-0 min-w-0 flex-1 type-body-md text-mute md:flex-none">
          日本の現地ホームページがあります。訪問してみませんか？
        </p>
        <a
          className="inline-flex shrink-0"
          href={JAPAN_LOCAL_SITE_URL}
          rel="noreferrer noopener"
          target="_blank"
        >
          <Button
            arrow={false}
            className="h-8 px-4 md:h-10 md:px-5"
            size="default"
            style="full"
            variant="secondary"
          >
            <span className="inline-flex items-center justify-center gap-2">
              訪問する
              <span aria-hidden="true" className="hidden md:inline">→</span>
            </span>
          </Button>
        </a>
      </div>
    </aside>
  );
}
