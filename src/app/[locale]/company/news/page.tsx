import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocalePath, isLocale } from "../../../../constants/i18n";
import NewsListClientPage from "../../../../components/pages/news/NewsListClientPage";
import { formatPublicDate, getContentThumbnailSrc, getLocalizedContent } from "@/features/content/data";
import { readContentState } from "@/features/content/contentState.server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const copy = {
    en: { title: "News" },
    ko: { title: "뉴스" },
    ja: { title: "News" },
  }[locale];

  const fallbackItems = (await readContentState("news"))
    .filter((item) => item.status === "published")
    .map((item) => ({
      date: formatPublicDate(locale, item.dateIso),
      href: item.contentType === "outlink" ? item.externalUrl : getLocalePath(locale, `/company/news/${item.id}`),
      imageSrc: getContentThumbnailSrc(item.imageSrc),
      isExternal: item.contentType === "outlink",
      summary: getLocalizedContent(item.summary, locale),
      title: getLocalizedContent(item.title, locale),
    }));

  return <NewsListClientPage fallbackItems={fallbackItems} locale={locale} title={copy.title} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  return {
    alternates: {
      canonical: getLocalePath(locale, "/company/news"),
    },
  };
}
