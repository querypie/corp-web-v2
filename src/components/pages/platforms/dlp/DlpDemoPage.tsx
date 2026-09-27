"use client";

import type { Locale } from "@/constants/i18n";
import { Play } from "lucide-react";
import { useState } from "react";

type Props = {
  demoUrl?: string;
  locale: Locale;
  tutorialUrl?: string;
};

export default function DlpDemoPage({
  locale,
  demoUrl = `https://querypie--dlp-demo.srv.kpb4r.mlxp.ncloud.com/?lang=${locale}`,
  tutorialUrl = "https://www.youtube.com/embed/8iZmadjxmP4?autoplay=1&controls=1&rel=0",
}: Props) {
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const copy = {
    en: { close: "Close", tutorial: "DLP demo video" },
    ko: { close: "닫기", tutorial: "DLP 데모 영상" },
    ja: { close: "閉じる", tutorial: "DLPデモ動画" },
  }[locale];

  return (
    <div className="fixed inset-0 z-30 overflow-hidden bg-bg pt-[calc(64px+var(--language-banner-offset,0px))]">
      <div className="flex h-full flex-col">
        <div className="flex h-12 shrink-0 items-center justify-end border-b border-border bg-bg px-5 md:px-10">
          <button
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-button border border-border-strong px-4 type-body-md text-fg transition-colors hover:bg-bg-content"
            onClick={() => setTutorialOpen(true)}
            type="button"
          >
            <Play aria-hidden="true" className="h-4 w-4 shrink-0" fill="currentColor" />
            {copy.tutorial}
          </button>
        </div>
        <iframe
          allow="clipboard-read; clipboard-write; fullscreen"
          className="block min-h-0 w-full flex-1 border-0 bg-bg"
          referrerPolicy="strict-origin-when-cross-origin"
          src={demoUrl}
          title="DLP demo"
        />
      </div>

      {tutorialOpen ? (
        <div
          aria-label={copy.tutorial}
          aria-modal="true"
          className="absolute inset-0 z-20 flex items-center justify-center bg-[rgb(var(--color-overlay-rgb)/0.72)] p-5 backdrop-blur-sm md:p-10"
          role="dialog"
        >
          <div className="w-full max-w-[1080px] overflow-hidden rounded-box bg-bg shadow-2xl">
            <div className="flex h-14 items-center justify-between border-b border-border px-5">
              <h1 className="m-0 type-h3 text-fg">{copy.tutorial}</h1>
              <button
                className="type-body-md text-link"
                onClick={() => setTutorialOpen(false)}
                type="button"
              >
                {copy.close}
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="block h-full w-full border-0"
                referrerPolicy="strict-origin-when-cross-origin"
                src={tutorialUrl}
                title={copy.tutorial}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
