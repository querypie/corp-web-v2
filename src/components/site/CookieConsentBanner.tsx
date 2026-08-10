"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import ButtonGroup from "@/components/ui/ButtonGroup";
import { getLocalePath, type Locale } from "@/constants/i18n";
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
    cookiePreferenceLinkLabel: string;
    sentenceAfterCookiePreference: string;
    privacyPolicyLinkLabel: string;
    sentenceAfterPrivacy: string;
    sentenceBeforeCookiePreference: string;
    sentenceBeforePrivacy: string;
    title: string;
  }
> = {
  en: {
    accept: "Yes, I accept",
    decline: "Decline",
    cookiePreferenceLinkLabel: "Cookie Preference",
    sentenceAfterCookiePreference: ".",
    privacyPolicyLinkLabel: "Privacy Policy",
    sentenceAfterPrivacy: ".",
    sentenceBeforeCookiePreference: "Decline, and we’ll respect your choice – no tracking involved.",
    sentenceBeforePrivacy: "To enhance your experience, we use cookies. Learn more about how we use them in our",
    title: "Cookie preferences",
  },
  ko: {
    accept: "동의합니다",
    decline: "거부",
    cookiePreferenceLinkLabel: "쿠키 설정",
    sentenceAfterCookiePreference: "에서 관리할 수 있습니다.",
    privacyPolicyLinkLabel: "개인정보처리방침",
    sentenceAfterPrivacy: "에서 확인할 수 있습니다.",
    sentenceBeforeCookiePreference: "세부 항목은",
    sentenceBeforePrivacy: "더 나은 경험을 제공하기 위해 쿠키를 사용합니다. 쿠키 사용 방식은",
    title: "쿠키 설정",
  },
  ja: {
    accept: "同意する",
    decline: "拒否",
    cookiePreferenceLinkLabel: "クッキー設定",
    sentenceAfterCookiePreference: "で管理できます。",
    privacyPolicyLinkLabel: "プライバシーポリシー",
    sentenceAfterPrivacy: "でご確認ください。",
    sentenceBeforeCookiePreference: "詳細な項目は",
    sentenceBeforePrivacy: "より良い体験を提供するために Cookie を使用します。Cookie の利用方法は",
    title: "クッキー設定",
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
      className="site-popover-surface fixed inset-x-0 bottom-0 z-50 px-5 py-6 backdrop-blur-[18px] md:px-10"
    >
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-[760px] flex-col gap-2">
          <p className="m-0 type-body-lg text-fg">{copy.title}</p>
          <p className="m-0 type-body-md text-mute">
            {copy.sentenceBeforePrivacy}{" "}
            <a
              className="text-brand transition-colors hover:text-fg"
              href={getLocalePath(locale, "/privacy-policy")}
            >
              {copy.privacyPolicyLinkLabel}
            </a>
            {copy.sentenceAfterPrivacy}
            <br />
            {copy.sentenceBeforeCookiePreference}{" "}
            <a
              className="text-brand transition-colors hover:text-fg"
              href={getLocalePath(locale, "/cookie-preference")}
            >
              {copy.cookiePreferenceLinkLabel}
            </a>
            {copy.sentenceAfterCookiePreference}
          </p>
        </div>
        <ButtonGroup className="flex-col sm:flex-row sm:items-center lg:shrink-0">
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
        </ButtonGroup>
      </div>
    </aside>
  );
}
