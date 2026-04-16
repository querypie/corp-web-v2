"use client";

import { useEffect, useRef, useState } from "react";
import type { MdxHeading } from "@/features/mdx/types";

type Props = {
  headings: MdxHeading[];
  locale: "en" | "ko" | "ja";
};

const ON_THIS_PAGE_LABEL = {
  en: "On This Page",
  ko: "목차",
  ja: "目次",
};

export default function ArticleToc({ headings, locale }: Props) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const ids = headings.flatMap((h) => [
      h.targetId,
      ...(h.list?.map((sub) => sub.targetId) ?? []),
    ]);

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "0px 0px -60% 0px" },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-mute-fg">
        {ON_THIS_PAGE_LABEL[locale]}
      </p>
      <ul className="flex flex-col gap-1">
        {headings.map((heading) => (
          <li key={heading.targetId}>
            <a
              href={`#${heading.targetId}`}
              className={[
                "block text-sm transition-colors",
                activeId === heading.targetId
                  ? "font-medium text-fg"
                  : "text-mute-fg hover:text-fg",
              ].join(" ")}
            >
              {heading.text}
            </a>
            {heading.list && heading.list.length > 0 && (
              <ul className="ml-3 mt-1 flex flex-col gap-1">
                {heading.list.map((sub) => (
                  <li key={sub.targetId}>
                    <a
                      href={`#${sub.targetId}`}
                      className={[
                        "block text-sm transition-colors",
                        activeId === sub.targetId
                          ? "font-medium text-fg"
                          : "text-mute-fg hover:text-fg",
                      ].join(" ")}
                    >
                      {sub.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
