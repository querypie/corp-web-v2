import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MdxContentListPage from "@/components/pages/mdx/MdxContentListPage";
import { getLocalePath, isLocale, type Locale } from "@/constants/i18n";
import { formatPublicDate } from "@/features/content/data";
import { getPublicDemoListItems } from "@/features/demo/public";
import { MDX_LIST_PAGE_SIZE } from "@/features/mdx/list";
import { buildPaginatedHref, paginateItems, parsePageParam } from "@/features/pagination";

const WEBINARS_PAGE_COPY: Record<Locale, { metadataTitle: string; title: string }> = {
  en: { metadataTitle: "Webinars", title: "Webinars" },
  ja: { metadataTitle: "ウェビナー", title: "ウェビナー" },
  ko: { metadataTitle: "Webinars", title: "Webinars" },
};

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function WebinarsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page } = await searchParams;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = WEBINARS_PAGE_COPY[locale];
  const requestedPage = parsePageParam(page);
  const allItems = getPublicDemoListItems(locale, "webinars");
  const paginated = paginateItems(allItems, requestedPage, MDX_LIST_PAGE_SIZE);
  const basePath = getLocalePath(locale, "/webinars");

  return (
    <MdxContentListPage
      currentPage={paginated.currentPage}
      items={paginated.items.map((item) => ({
        date: item.date ? formatPublicDate(locale, item.date) : "",
        description: item.description,
        href: item.href,
        imageSrc: item.imageSrc,
        title: item.title,
      }))}
      locale={locale}
      nextHref={
        paginated.nextPage ? buildPaginatedHref(basePath, paginated.nextPage) : null
      }
      previousHref={
        paginated.previousPage ? buildPaginatedHref(basePath, paginated.previousPage) : null
      }
      title={copy.title}
      totalPages={paginated.totalPages}
    />
  );
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { page } = await searchParams;

  if (!isLocale(locale)) {
    return {};
  }

  const copy = WEBINARS_PAGE_COPY[locale];
  const requestedPage = parsePageParam(page);
  const allItems = getPublicDemoListItems(locale, "webinars");
  const paginated = paginateItems(allItems, requestedPage, MDX_LIST_PAGE_SIZE);
  const basePath = getLocalePath(locale, "/webinars");
  const canonical = buildPaginatedHref(basePath, paginated.currentPage);

  return {
    title: copy.metadataTitle,
    alternates: {
      canonical,
    },
  };
}
