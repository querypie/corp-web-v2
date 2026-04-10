"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import ContentLeadForm from "./ContentLeadForm";
import type { ContactPageCopy } from "@/features/contact/copy";

type ContentGateOverlayProps = {
  contactCopy: ContactPageCopy;
  locale: "en" | "ko" | "ja";
  onUnlock: () => void;
  title: string;
  unlockCookieName: string;
};

function getLocalizedCopy(locale: "en" | "ko" | "ja") {
  return {
    description: {
      en: "Fill out the form to unlock the full content.",
      ko: "폼 정보를 입력하면 전체 콘텐츠를 볼 수 있습니다.",
      ja: "フォームを入力するとコンテンツ全体を閲覧できます。",
    }[locale],
    eyebrow: {
      en: "Want to see more?",
      ko: "더 보시겠어요?",
      ja: "続きを読むには",
    }[locale],
  };
}

export default function ContentGateOverlay({
  contactCopy,
  locale,
  onUnlock,
  title,
  unlockCookieName,
}: ContentGateOverlayProps) {
  const router = useRouter();
  const localized = getLocalizedCopy(locale);

  function handleSuccess() {
    startTransition(() => {
      onUnlock();
      router.refresh();
    });
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[max(120px,35%)]">
      <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-10">
        <div className="h-[400px] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,var(--color-bg)_100%)]" />
        <div className="w-full bg-bg">
          <div className="mx-auto flex w-full max-w-[400px] flex-col gap-6 pb-8">
            <div className="flex flex-col gap-3 pt-8 text-center">
              <h2 className="m-0 type-h2 text-fg">{localized.eyebrow}</h2>
              <p className="m-0 type-body-md text-mute-fg">{localized.description}</p>
            </div>
            <ContentLeadForm
              contactCopy={contactCopy}
              locale={locale}
              mode="unlock"
              onSuccess={handleSuccess}
              title={title}
              unlockCookieName={unlockCookieName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
