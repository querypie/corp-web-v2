"use client";

import { type ReactNode, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import type { Locale } from "@/constants/i18n";

type ContentPdfActionButtonProps = {
  className?: string;
  formTargetId?: string;
  href: string;
  label: string;
  lockedLabel?: string;
  locale: Locale;
  renderUnlockForm?: (props: { onDirtyChange: (isDirty: boolean) => void; onSuccess: () => void }) => ReactNode;
  requiresLeadCapture?: boolean;
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

const CLOSE_LABEL: Record<Locale, string> = {
  en: "Close",
  ja: "閉じる",
  ko: "닫기",
};

const DEFAULT_LOCKED_LABEL: Record<Locale, string> = {
  en: "Unlock PDF",
  ja: "PDFのロック解除",
  ko: "PDF 잠금 해제",
};

const DISCARD_FORM_CONFIRM_MESSAGE: Record<Locale, string> = {
  en: "You have entered information. Close without submitting?",
  ja: "入力内容があります。送信せずに閉じますか？",
  ko: "입력한 내용이 있습니다. 제출하지 않고 닫을까요?",
};

function hasCookie(name: string) {
  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .some((cookie) => cookie === `${name}=true`);
}

function PdfIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.5 2.5h5.75L15.5 6.75V16a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 16V4a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      <path
        d="M11 2.75V6.5a.5.5 0 0 0 .5.5h3.75"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      <path
        d="M6.75 11.75h6.5M6.75 14h4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export default function ContentPdfActionButton({
  className,
  formTargetId,
  href,
  label,
  lockedLabel,
  locale,
  renderUnlockForm,
  requiresLeadCapture = false,
  requiresUnlock = false,
  unlockCookieName,
}: ContentPdfActionButtonProps) {
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLeadFormDirty, setIsLeadFormDirty] = useState(false);
  const [isLocallyUnlocked, setIsLocallyUnlocked] = useState(false);

  const hasUnlockedCookie = Boolean(unlockCookieName && typeof document !== "undefined" && hasCookie(unlockCookieName));
  const isLocked = requiresUnlock || (requiresLeadCapture && !isLocallyUnlocked && !hasUnlockedCookie);
  const buttonLabel = isLocked ? lockedLabel ?? DEFAULT_LOCKED_LABEL[locale] : label;

  useEffect(() => {
    if (!isPromptOpen && !isFormOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (isFormOpen) {
          handleRequestFormClose();
          return;
        }

        setIsPromptOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFormOpen, isLeadFormDirty, isPromptOpen, locale]);

  function scrollToForm() {
    if (!formTargetId) return;

    document.getElementById(formTargetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleClick() {
    if (!isLocked) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    setIsPromptOpen(true);
  }

  function handleConfirm() {
    setIsPromptOpen(false);

    if (requiresUnlock && formTargetId) {
      window.setTimeout(scrollToForm, 0);
      return;
    }

    if (renderUnlockForm) {
      setIsLeadFormDirty(false);
      setIsFormOpen(true);
    }
  }

  function handleRequestFormClose() {
    if (isLeadFormDirty && !window.confirm(DISCARD_FORM_CONFIRM_MESSAGE[locale])) {
      return;
    }

    setIsLeadFormDirty(false);
    setIsFormOpen(false);
  }

  function handleFormSuccess() {
    setIsLeadFormDirty(false);
    setIsLocallyUnlocked(true);
    setIsFormOpen(false);
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
        <PdfIcon />
        {buttonLabel}
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

      {isFormOpen && renderUnlockForm ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[rgb(var(--color-overlay-rgb)/0.6)] px-5 py-8"
          role="dialog"
        >
          <div
            className="relative w-full max-w-[420px] rounded-modal border border-border bg-[var(--color-bg-modal)] px-6 pb-7 pt-12 shadow-[0_24px_80px_rgb(0_0_0/0.35)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label={CLOSE_LABEL[locale]}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center bg-transparent text-fg transition-colors hover:text-mute"
              onClick={handleRequestFormClose}
              type="button"
            >
              <span aria-hidden="true" className="text-[24px] leading-none">×</span>
            </button>
            {renderUnlockForm({ onDirtyChange: setIsLeadFormDirty, onSuccess: handleFormSuccess })}
          </div>
        </div>
      ) : null}
    </>
  );
}
