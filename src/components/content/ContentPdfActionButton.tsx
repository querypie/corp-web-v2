"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import type { Locale } from "@/constants/i18n";

type ContentPdfActionButtonProps = {
  className?: string;
  formTargetId?: string;
  href: string;
  label: string;
  locale: Locale;
  requiresUnlock?: boolean;
  unlockCookieName?: string;
};

const EXCLUSIVE_CONTENT_FORM_MESSAGE: Record<Locale, string> = {
  en: "Please fill out the form to access this exclusive content!",
  ja: "限定コンテンツをご利用いただくにはフォームにご入力ください。",
  ko: "독점 콘텐츠를 이용하시려면 양식을 작성해 주세요!",
};

const EXCLUSIVE_CONTENT_FORM_TITLE: Record<Locale, string> = {
  en: "Exclusive content",
  ja: "限定コンテンツ",
  ko: "독점 콘텐츠",
};

const CONFIRM_LABEL: Record<Locale, string> = {
  en: "OK",
  ja: "確認",
  ko: "확인",
};

const CANCEL_LABEL: Record<Locale, string> = {
  en: "Cancel",
  ja: "キャンセル",
  ko: "취소",
};

function hasCookie(name: string) {
  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .some((cookie) => cookie === `${name}=true`);
}

export default function ContentPdfActionButton({
  className,
  formTargetId,
  href,
  label,
  locale,
  requiresUnlock = false,
  unlockCookieName,
}: ContentPdfActionButtonProps) {
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  useEffect(() => {
    if (!isPromptOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsPromptOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPromptOpen]);

  function scrollToForm() {
    if (!formTargetId) return;

    document.getElementById(formTargetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleClick() {
    if (!requiresUnlock || (unlockCookieName && hasCookie(unlockCookieName))) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    setIsPromptOpen(true);
  }

  function handleConfirm() {
    setIsPromptOpen(false);
    window.setTimeout(scrollToForm, 0);
  }

  return (
    <>
      <Button
        arrow={false}
        className={className}
        onClick={handleClick}
        size="large"
        style="full"
        type="button"
        variant="secondary"
      >
        {label}
      </Button>

      {isPromptOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgb(var(--color-overlay-rgb)/0.6)] px-5"
          onClick={() => setIsPromptOpen(false)}
          role="dialog"
        >
          <div
            className="w-full max-w-[380px] rounded-modal border border-border bg-[var(--color-bg-modal)] px-6 py-8 shadow-[0_24px_80px_rgb(0_0_0/0.35)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="m-0 type-h3 text-fg">{EXCLUSIVE_CONTENT_FORM_TITLE[locale]}</h2>
                <p className="m-0 max-w-[300px] type-body-md leading-7 text-mute">
                  {EXCLUSIVE_CONTENT_FORM_MESSAGE[locale]}
                </p>
              </div>
              <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                <Button
                  arrow={false}
                  className="w-full justify-center sm:w-auto"
                  onClick={() => setIsPromptOpen(false)}
                  style="round"
                  variant="outline"
                >
                  {CANCEL_LABEL[locale]}
                </Button>
                <Button
                  arrow={false}
                  className="w-full justify-center sm:w-auto"
                  onClick={handleConfirm}
                  style="round"
                  variant="secondary"
                >
                  {CONFIRM_LABEL[locale]}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
