"use client";

import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
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
    privacyPolicyLinkLabel: "Privacy Policy",
    sentenceAfterPrivacy: ".",
    sentenceBeforeCookiePreference: "Decline, and we’ll respect your choice – no tracking involved.",
    sentenceBeforePrivacy: "To enhance your experience, we use cookies. Learn more about how we use them in our",
    title: "Cookie preferences",
  },
  ko: {
    accept: "Yes, I accept",
    decline: "Decline",
    cookiePreferenceLinkLabel: "Cookie Preference",
    privacyPolicyLinkLabel: "Privacy Policy",
    sentenceAfterPrivacy: ".",
    sentenceBeforeCookiePreference: "Decline, and we’ll respect your choice – no tracking involved.",
    sentenceBeforePrivacy: "To enhance your experience, we use cookies. Learn more about how we use them in our",
    title: "쿠키 설정",
  },
  ja: {
    accept: "Yes, I accept",
    decline: "Decline",
    cookiePreferenceLinkLabel: "Cookie Preference",
    privacyPolicyLinkLabel: "Privacy Policy",
    sentenceAfterPrivacy: ".",
    sentenceBeforeCookiePreference: "Decline, and we’ll respect your choice – no tracking involved.",
    sentenceBeforePrivacy: "To enhance your experience, we use cookies. Learn more about how we use them in our",
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
          <p className="m-0 type-body-md text-mute">
            {copy.sentenceBeforePrivacy}{" "}
            <a
              className="text-fg underline underline-offset-4 transition-colors hover:text-brand"
              href={getLocalePath(locale, "/privacy-policy")}
            >
              {copy.privacyPolicyLinkLabel}
            </a>
            {copy.sentenceAfterPrivacy}
            <br />
            {copy.sentenceBeforeCookiePreference}{" "}
            <a
              className="text-fg underline underline-offset-4 transition-colors hover:text-brand"
              href={getLocalePath(locale, "/cookie-preference")}
            >
              {copy.cookiePreferenceLinkLabel}
            </a>
            .
          </p>
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
