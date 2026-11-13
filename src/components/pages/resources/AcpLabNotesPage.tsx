"use client";

import { useEffect, useState } from "react";
import DocsListPage from "./ResourcesListPage";
import { getAcpLabNotesCopy } from "@/copy/acpLabNotes";
import type { Locale } from "@/constants/i18n";
import { getResourcesPageCopy } from "@/copy/contentPages";
import { getResourcesSidebarMenuItems, type DocsCategorySlug } from "@/features/content/config";

export type LabNoteListItem = {
  href: string;
  title: string;
  summary: string;
  imageSrc: string;
  date?: string;
  topics: string[];
};

type Props = {
  locale?: Locale;
  items: LabNoteListItem[];
  visibleCategorySlugs: DocsCategorySlug[];
};

export default function AcpLabNotesPage({ items, visibleCategorySlugs, locale = "ko" }: Props) {
  const copy = getAcpLabNotesCopy(locale);
  const [topic, setTopic] = useState("");
  const storageKey = `querypie:acp-lab-notes:topic:${locale}`;
  const topics = Array.from(new Set(items.flatMap((item) => item.topics).filter(Boolean)));
  const filtered = topic ? items.filter((item) => item.topics.includes(topic)) : items;

  useEffect(() => {
    try {
      const savedTopic = sessionStorage.getItem(storageKey);
      setTopic(savedTopic && items.some((item) => item.topics.includes(savedTopic)) ? savedTopic : "");
    } catch {
      // Filtering still works when browser storage is unavailable.
    }
  }, [items, storageKey]);

  function selectTopic(value: string) {
    setTopic(value);
    try {
      if (value) sessionStorage.setItem(storageKey, value);
      else sessionStorage.removeItem(storageKey);
    } catch {
      // Storage restrictions should not interrupt filtering.
    }
  }

  return (
    <DocsListPage
      locale={locale}
      title={getResourcesPageCopy(locale).title}
      menu={getResourcesSidebarMenuItems(locale, "acp-lab-notes", visibleCategorySlugs)}
      showCategory={false}
      cardImageClassName="[html[data-theme=light]_&]:brightness-[0.95]"
      items={filtered.map((item) => ({
        category: copy.label,
        href: item.href,
        title: item.title,
        description: item.summary,
        imageSrc: item.imageSrc,
        date: item.date,
      }))}
      filters={
        <div className="flex flex-wrap gap-2" role="group" aria-label={copy.topicsLabel}>
          {["", ...topics].map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={topic === value}
              onClick={() => selectTopic(value)}
              className={`rounded-full border px-4 py-2 type-body-sm transition-colors ${topic === value ? "border-fg bg-fg text-bg" : "border-border text-mute hover:text-fg"}`}
            >
              {value || copy.all}
            </button>
          ))}
        </div>
      }
    />
  );
}
