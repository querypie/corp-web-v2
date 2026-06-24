"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getLocalePath, isLocale, type Locale } from "../../constants/i18n";
import Button from "./Button";
import Select from "./Select";

const BANNER_COOKIE = "querypie_language_banner_dismissed";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 730;

const labels: Record<Locale, string> = {
  en: "English",
  ko: "한국어",
  ja: "日本語",
};

const copy: Record<Locale, {
  bannerLabel: string;
  closeLabel: string;
  message: string;
  selectLabel: string;
  shortMessage: string;
  submitLabel: string;
}> = {
  en: {
    bannerLabel: "Language suggestion",
    closeLabel: "Close language suggestion",
    message: "View this page in your preferred language.",
    selectLabel: "Preferred language",
    shortMessage: "Select language",
    submitLabel: "OK",
  },
  ko: {
    bannerLabel: "언어 제안",
    closeLabel: "언어 제안 닫기",
    message: "이 페이지를 선호하는 언어로 변경해서 볼 수 있어요.",
    selectLabel: "선호 언어",
    shortMessage: "언어 선택",
    submitLabel: "확인",
  },
  ja: {
    bannerLabel: "言語の提案",
    closeLabel: "言語の提案を閉じる",
    message: "このページを希望する言語で表示できます。",
    selectLabel: "希望する言語",
    shortMessage: "言語を選択",
    submitLabel: "確認",
  },
};

type LanguageSuggestionBannerProps = {
  currentLocale: Locale;
};

type LanguageSuggestionResponse = {
  recommendedLocale: Locale;
  visible: boolean;
};

function getLocaleHref(pathname: string, locale: Locale) {
  const segments = pathname.split("/").filter(Boolean);
  const pathWithoutLocale = isLocale(segments[0] ?? "")
    ? `/${segments.slice(1).join("/")}`
    : pathname;

  const nextPathname = getLocalePath(locale, pathWithoutLocale || "/");

  if (typeof window === "undefined" || !window.location.search) {
    return nextPathname;
  }

  return `${nextPathname}${window.location.search}`;
}

function setDismissedCookie() {
  document.cookie = `${BANNER_COOKIE}=1; max-age=${COOKIE_MAX_AGE_SECONDS}; path=/; samesite=lax`;
}

export default function LanguageSuggestionBanner({
  currentLocale,
}: LanguageSuggestionBannerProps) {
  const pathname = usePathname();
  const bannerRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [recommendedLocale, setRecommendedLocale] = useState<Locale>("en");
  const [selectedLocale, setSelectedLocale] = useState<Locale>("en");

  useEffect(() => {
    const banner = bannerRef.current;

    if (!visible || !banner) {
      document.documentElement.style.setProperty("--language-banner-offset", "0px");
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
      document.documentElement.style.removeProperty("--language-banner-offset");
    };
  }, [visible]);

  useEffect(() => {
    if (document.cookie.includes(`${BANNER_COOKIE}=`)) {
      setVisible(false);
      return;
    }

    const controller = new AbortController();

    fetch(`/api/language-suggestion?locale=${currentLocale}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load language suggestion.");
        }

        return response.json() as Promise<LanguageSuggestionResponse>;
      })
      .then((data) => {
        setRecommendedLocale(data.recommendedLocale);
        setSelectedLocale(data.recommendedLocale);
        setVisible(data.visible);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setVisible(false);
      });

    return () => {
      controller.abort();
    };
  }, [currentLocale]);

  if (!visible || currentLocale === recommendedLocale) {
    return null;
  }

  const close = () => {
    setDismissedCookie();
    setVisible(false);
  };

  const changeLanguage = (locale: Locale) => {
    if (locale === currentLocale) {
      return;
    }

    setDismissedCookie();
    setVisible(false);
    window.location.href = getLocaleHref(pathname, locale);
  };
  const localizedCopy = copy[recommendedLocale];

  return (
    <aside
      aria-label={localizedCopy.bannerLabel}
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center border-b border-border bg-bg px-3 py-2 pr-12 text-fg shadow-[0_10px_24px_rgba(var(--color-overlay-rgb)/0.22)] md:px-10 md:pr-18"
      ref={bannerRef}
    >
      <div className="flex w-full max-w-[1120px] flex-nowrap items-center justify-center gap-2 md:gap-3">
        <p className="m-0 shrink-0 whitespace-nowrap text-center type-body-sm text-mute md:type-body-md">
          <span className="md:hidden">{localizedCopy.shortMessage}</span>
          <span className="hidden md:inline">{localizedCopy.message}</span>
        </p>

        <div className="flex min-w-0 shrink-0 items-center justify-center gap-2">
          <Select
            aria-label={localizedCopy.selectLabel}
            className="w-[132px]"
            onChange={(event) => setSelectedLocale(event.target.value as Locale)}
            options={[
              { label: labels.ko, value: "ko" },
              { label: labels.ja, value: "ja" },
              { label: labels.en, value: "en" },
            ]}
            value={selectedLocale}
          />

          <Button
            arrow={false}
            className="px-4"
            onClick={() => changeLanguage(selectedLocale)}
            size="default"
            type="button"
            variant="secondary"
          >
            {localizedCopy.submitLabel}
          </Button>
        </div>
      </div>
      <button
        aria-label={localizedCopy.closeLabel}
        className="pressable absolute inset-y-0 right-0 flex w-12 items-center justify-center text-mute transition-colors hover:bg-secondary hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border md:w-16"
        onClick={close}
        type="button"
      >
        <span
          aria-hidden="true"
          className="relative block h-5 w-5 before:absolute before:left-1/2 before:top-1/2 before:h-px before:w-6 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:rounded-full before:bg-current after:absolute after:left-1/2 after:top-1/2 after:h-px after:w-6 after:-translate-x-1/2 after:-translate-y-1/2 after:-rotate-45 after:rounded-full after:bg-current md:h-6 md:w-6 md:before:w-7 md:after:w-7"
        />
      </button>
    </aside>
  );
}
