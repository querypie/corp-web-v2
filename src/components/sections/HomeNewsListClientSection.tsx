"use client";

import NewsListSection from "./NewsListSection";
import type { Locale } from "@/constants/i18n";
import { useManagedContents } from "@/features/content/clientStore";
import { getContentThumbnailSrc, getLocalizedContent } from "@/features/content/data";
import useHydrated from "@/hooks/useHydrated";

type HomeNewsItem = {
  href: string;
  imageSrc: string;
  title: string;
};

type HomeNewsListClientSectionProps = {
  fallbackItems: HomeNewsItem[];
  locale: Locale;
  title: string;
};

export default function HomeNewsListClientSection({
  fallbackItems,
  locale,
  title,
}: HomeNewsListClientSectionProps) {
  const items = useManagedContents("news");
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return <NewsListSection items={fallbackItems} title={title} />;
  }

  const publishedItems = items
    .filter((item) => item.status === "published")
    .slice(0, 3)
    .map((item) => ({
      href: item.externalUrl,
      imageSrc: getContentThumbnailSrc(item.imageSrc),
      title: getLocalizedContent(item.title, locale),
    }));

  return (
    <NewsListSection
      items={publishedItems.length > 0 ? publishedItems : fallbackItems}
      title={title}
    />
  );
}
