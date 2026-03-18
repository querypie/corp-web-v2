"use client";

import NewsListPage from "./NewsListPage";
import type { Locale } from "@/constants/i18n";
import { useManagedContents } from "@/features/content/clientStore";
import useHydrated from "@/hooks/useHydrated";
import { formatPublicDate, getContentThumbnailSrc, getLocalizedContent } from "@/features/content/data";

export default function NewsListClientPage({
  locale,
  title,
}: {
  locale: Locale;
  title: string;
}) {
  const items = useManagedContents("news");
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return <NewsListPage items={[]} title={title} />;
  }

  return (
    <NewsListPage
      items={items
        .filter((item) => item.status === "published")
        .map((item) => ({
          date: formatPublicDate(locale, item.dateIso),
          href: item.externalUrl,
          imageSrc: getContentThumbnailSrc(item.imageSrc),
          summary: getLocalizedContent(item.summary, locale),
          title: getLocalizedContent(item.title, locale),
        }))}
      title={title}
    />
  );
}
