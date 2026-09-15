"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/constants/i18n";
import { localizeContentLinks } from "@/features/routing/siteLinks";
import {
  CONTENT_PREVIEW_RICH_CLASS,
} from "@/features/content/previewStyles";
import { highlightCodeBlocksInHtml } from "@/features/content/codeHighlight";

function normalizeContentHtml(html: string) {
  return highlightCodeBlocksInHtml(html.replace(
    /(src=|href=)(["'])public\//g,
    (_, attribute, quote) => `${attribute}${quote}/`,
  ));
}

type ContentBodyPreviewProps = {
  bodyHtml?: string;
  locale?: Locale;
};

export default function ContentBodyPreview({
  bodyHtml = "",
  locale,
}: ContentBodyPreviewProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const root = contentRef.current;

    if (!root) {
      return;
    }

    const videos = Array.from(
      root.querySelectorAll<HTMLVideoElement>("figure[data-autoplay-on-view='true'] video"),
    );

    if (videos.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target instanceof HTMLVideoElement ? entry.target : null;

          if (!video) {
            continue;
          }

          if (entry.isIntersecting) {
            video.muted = true;
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.55 },
    );

    videos.forEach((video) => {
      video.muted = true;
      video.playsInline = true;
      observer.observe(video);
    });

    return () => {
      observer.disconnect();
    };
  }, [bodyHtml]);

  if (!bodyHtml.trim()) {
    return null;
  }

  return (
    <div
      className={CONTENT_PREVIEW_RICH_CLASS}
      dangerouslySetInnerHTML={{ __html: normalizeContentHtml(locale ? localizeContentLinks(bodyHtml, locale) : bodyHtml) }}
      ref={contentRef}
    />
  );
}
