"use client";

import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import type { Locale } from "@/constants/i18n";
import {
  acceptAllCookiePreferences,
  declineAllCookiePreferences,
  hasCookiePreferenceSet,
} from "@/features/cookie-preferences/preferences";

type CookieConsentBannerProps = {
  locale: Locale;
};

const copyByLocale: Record<
  Locale,
  {
    accept: string;
    decline: string;
    description: string;
    title: string;
  }
> = {
  en: {
    accept: "Accept all",
    decline: "Decline",
    description:
      "We use cookies to keep the site reliable, understand performance, and improve your experience. You can accept all cookies, decline non-essential cookies, or manage each category.",
    title: "Cookie preferences",
  },
  ko: {
    accept: "모두 허용",
    decline: "거부",
    description:
      "사이트 안정성 유지, 성능 분석, 더 나은 경험 제공을 위해 쿠키를 사용합니다. 모든 쿠키를 허용하거나 비필수 쿠키를 거부하고, 항목별 설정도 관리할 수 있습니다.",
    title: "쿠키 설정",
  },
  ja: {
    accept: "すべて許可",
    decline: "拒否",
    description:
      "サイトの安定性維持、パフォーマンス分析、体験改善のために Cookie を使用します。すべて許可するか、必須以外を拒否し、カテゴリ別に管理できます。",
    title: "Cookie 設定",
  },
};

export default function CookieConsentBanner({ locale }: CookieConsentBannerProps) {
  const [visible, setVisible] = useState(false);
  const copy = copyByLocale[locale];

  useEffect(() => {
    setVisible(!hasCookiePreferenceSet());
  }, []);

  if (!visible) {
    return null;
  }

  const closeWith = (action: () => void) => {
    action();
    setVisible(false);
  };

  return (
    <aside
      aria-label={copy.title}
      className="fixed inset-x-0 bottom-0 z-50 bg-[rgb(var(--color-bg-gnb-popover-rgb)/0.8)] px-5 py-6 backdrop-blur-[18px] md:px-10"
    >
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-[760px] flex-col gap-2">
          <p className="m-0 type-body-lg text-fg">{copy.title}</p>
          <p className="m-0 type-body-md text-mute">{copy.description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
          <Button
            arrow={false}
            onClick={() => closeWith(acceptAllCookiePreferences)}
            size="default"
            variant="primary"
          >
            {copy.accept}
          </Button>
          <Button
            arrow={false}
            onClick={() => closeWith(declineAllCookiePreferences)}
            size="default"
            variant="secondary"
          >
            {copy.decline}
          </Button>
        </div>
      </div>
    </aside>
  );
}
