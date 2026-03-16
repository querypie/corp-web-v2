"use client";

import DemoDetailPage from "./DemoDetailPage";
import type { Locale } from "@/constants/i18n";
import type { DocsDetailPageProps } from "../docs/DocsDetailPage";
import { useManagedContents } from "@/features/content/clientStore";
import { demoCategoryConfigs, getCategoryLabel } from "@/features/content/config";
import { formatPublicDate, getPublicDetailHref, getWriterLabel } from "@/features/content/data";

type DemoDetailClientPageProps = {
  fallbackProps: DocsDetailPageProps;
  locale: Locale;
  slug: string;
};

export default function DemoDetailClientPage({
  fallbackProps,
  locale,
  slug,
}: DemoDetailClientPageProps) {
  const items = useManagedContents("demo");

  const currentUseCase = items.find(
    (item) => item.id === slug && item.status === "published",
  );

  if (!currentUseCase) {
    return <DemoDetailPage {...fallbackProps} />;
  }

  const relatedPublishedItems = items
    .filter((item) => item.section === "demo")
    .filter((item) => item.status === "published" && item.id !== slug)
    .map((item) => ({
      category: getCategoryLabel(demoCategoryConfigs, item.categorySlug, locale),
      href: getPublicDetailHref("demo", locale, item.id),
      imageSrc: item.imageSrc,
      title: item.title,
    }));

  return (
    <DemoDetailPage
      {...fallbackProps}
      bodyMarkdown={currentUseCase.bodyMarkdown}
      category={getCategoryLabel(demoCategoryConfigs, currentUseCase.categorySlug, locale)}
      contentListItems={relatedPublishedItems}
      date={formatPublicDate(locale, currentUseCase.dateIso)}
      heroImageAlt={currentUseCase.title}
      heroImageSrc={currentUseCase.imageSrc}
      title={currentUseCase.title}
      writer={getWriterLabel(currentUseCase)}
    />
  );
}
