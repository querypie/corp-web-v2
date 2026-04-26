import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MdxContentListPage from "@/components/pages/mdx/MdxContentListPage";
import { getLocalePath, isLocale } from "@/constants/i18n";
import { formatPublicDate } from "@/features/content/data";
import { buildPaginatedHref, paginateItems, parsePageParam } from "@/features/pagination";
import { loadMdxListItems, MDX_LIST_PAGE_SIZE } from "@/features/mdx/list";
import { getMdxListPageCopy } from "@/features/mdx/pageCopy";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function BlogListPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page } = await searchParams;

  if (!isLocale(locale)) notFound();

  const requestedPage = parsePageParam(page);
  const allItems = await loadMdxListItems("blog", locale);
  const paginated = paginateItems(allItems, requestedPage, MDX_LIST_PAGE_SIZE);
  const basePath = getLocalePath(locale, "/blog");
  const copy = getMdxListPageCopy("blog", locale);

  return (
    <MdxContentListPage
      currentPage={paginated.currentPage}
      items={paginated.items.map((item) => ({
        date: formatPublicDate(locale, item.dateIso),
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

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const { page } = await searchParams;

  if (!isLocale(locale)) return {};

  const copy = getMdxListPageCopy("blog", locale);
  const requestedPage = parsePageParam(page);
  const allItems = await loadMdxListItems("blog", locale);
  const paginated = paginateItems(allItems, requestedPage, MDX_LIST_PAGE_SIZE);
  const basePath = getLocalePath(locale, "/blog");
  const canonical = buildPaginatedHref(basePath, paginated.currentPage);

  return {
    alternates: {
      canonical,
    },
    title: copy.metadataTitle,
  };
}
