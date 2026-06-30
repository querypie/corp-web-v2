"use client";

import { useEffect, useMemo, useState } from "react";

import type { Locale } from "@/constants/i18n";

type ContentShareActionsProps = {
  locale: Locale;
  shareUrl?: string;
  title: string;
};

type ShareCopy = {
  copiedLabel: string;
  copyLabel: string;
  facebookLabel: string;
  linkedinLabel: string;
  statusLabel: string;
  xLabel: string;
};

const shareCopyByLocale: Record<Locale, ShareCopy> = {
  en: {
    copiedLabel: "Copied",
    copyLabel: "Copy URL",
    facebookLabel: "Share on Facebook",
    linkedinLabel: "Share on LinkedIn",
    statusLabel: "URL copied",
    xLabel: "Share on X",
  },
  ko: {
    copiedLabel: "복사됨",
    copyLabel: "URL 복사",
    facebookLabel: "Facebook에 공유",
    linkedinLabel: "Share on LinkedIn",
    statusLabel: "URL이 복사되었습니다",
    xLabel: "Share on X",
  },
  ja: {
    copiedLabel: "コピー済み",
    copyLabel: "URLをコピー",
    facebookLabel: "Facebookで共有",
    linkedinLabel: "Share on LinkedIn",
    statusLabel: "URLをコピーしました",
    xLabel: "Share on X",
  },
};

function getCurrentPageUrl() {
  return `${window.location.origin}${window.location.pathname}${window.location.search}`;
}

function getCanonicalPageUrl() {
  return document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href || "";
}

function copyWithFallback(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  copyWithFallback(value);
}

export default function ContentShareActions({
  locale,
  shareUrl: initialShareUrl,
  title,
}: ContentShareActionsProps) {
  const [shareUrl, setShareUrl] = useState(initialShareUrl ?? "");
  const [copied, setCopied] = useState(false);
  const copy = shareCopyByLocale[locale];

  useEffect(() => {
    setShareUrl(initialShareUrl || getCanonicalPageUrl() || getCurrentPageUrl());
  }, [initialShareUrl]);

  useEffect(() => {
    if (!copied) return;

    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const shareLinks = useMemo(() => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);

    return [
      {
        href: shareUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` : undefined,
        iconSrc: "/assets/brand/icons/Facebook.svg",
        label: copy.facebookLabel,
      },
      {
        href: shareUrl ? `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` : undefined,
        iconSrc: "/assets/brand/icons/x.svg",
        label: copy.xLabel,
      },
      {
        href: shareUrl ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` : undefined,
        iconSrc: "/assets/brand/icons/linkedin.svg",
        label: copy.linkedinLabel,
      },
    ];
  }, [copy.facebookLabel, copy.linkedinLabel, copy.xLabel, shareUrl, title]);

  async function handleCopyUrl() {
    const url = getCurrentPageUrl();
    await copyToClipboard(url);
    setCopied(true);
  }

  return (
    <div className="flex w-full justify-end gap-[10px]" aria-label="Share this content">
      {shareLinks.map((link) => (
        <a
          key={link.label}
          aria-disabled={!link.href}
          aria-label={link.label}
          className="inline-flex h-7 w-7 items-center justify-center opacity-100 transition-opacity hover:opacity-60 aria-disabled:pointer-events-none aria-disabled:opacity-40"
          href={link.href}
          rel="noopener noreferrer"
          target="_blank"
          title={link.label}
        >
          <img alt="" aria-hidden="true" className="h-7 w-7 object-contain" src={link.iconSrc} />
        </a>
      ))}
      <div className="relative inline-flex h-7 w-7 items-center justify-center">
        <button
          aria-label={copied ? copy.copiedLabel : copy.copyLabel}
          className="inline-flex h-7 w-7 items-center justify-center opacity-100 transition-opacity hover:opacity-60"
          onClick={handleCopyUrl}
          title={copied ? copy.copiedLabel : copy.copyLabel}
          type="button"
        >
          <img alt="" aria-hidden="true" className="h-7 w-7 object-contain" src="/assets/ui/icons/URL.svg" />
        </button>
        {copied ? (
          <div
            className="pointer-events-none absolute bottom-[calc(100%+10px)] right-0 z-10 whitespace-nowrap rounded-[8px] bg-[rgb(var(--color-bg-gnb-popover-rgb)/0.92)] px-3 py-2 type-body-sm text-fg shadow-[0_12px_32px_rgb(0_0_0/0.24)] backdrop-blur-[18px]"
            role="status"
          >
            {copy.statusLabel}
          </div>
        ) : null}
      </div>
    </div>
  );
}
