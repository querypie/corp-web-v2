"use client";

import DocsDetailPage, { type DocsDetailPageProps } from "./DocsDetailPage";
import type { Locale } from "@/constants/i18n";
import { useManagedContents } from "@/features/content/clientStore";
import { docsCategoryConfigs, getCategoryLabel } from "@/features/content/config";
import { formatPublicDate, getPublicDetailHref, getWriterLabel } from "@/features/content/data";

type DocsDetailClientPageProps = {
  fallbackProps: DocsDetailPageProps;
  locale: Locale;
  slug: string;
};

export default function DocsDetailClientPage({
  fallbackProps,
  locale,
  slug,
}: DocsDetailClientPageProps) {
  const items = useManagedContents("documentation");

  const currentItem = items.find((item) => item.id === slug && item.status === "published");

  if (!currentItem) {
    return <DocsDetailPage {...fallbackProps} />;
  }

  const relatedItems = items
    .filter((item) => item.status === "published" && item.id !== slug)
    .map((item) => ({
      category: getCategoryLabel(docsCategoryConfigs, item.categorySlug, locale),
      href: getPublicDetailHref("documentation", locale, item.id),
      imageSrc: item.imageSrc,
      title: item.title,
    }));

  return (
    <DocsDetailPage
      {...fallbackProps}
      bodyMarkdown={currentItem.bodyMarkdown}
      category={getCategoryLabel(docsCategoryConfigs, currentItem.categorySlug, locale)}
      contentListItems={relatedItems}
      date={formatPublicDate(locale, currentItem.dateIso)}
      heroImageAlt={currentItem.title}
      heroImageSrc={currentItem.imageSrc}
      title={currentItem.title}
      writer={getWriterLabel(currentItem)}
    />
  );
}
