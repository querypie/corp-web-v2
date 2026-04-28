import MdxContentListPage from "@/components/pages/mdx/MdxContentListPage";
import type { Locale } from "@/constants/i18n";
import { formatPublicDate } from "@/features/content/data";
import { MDX_LIST_PAGE_SIZE } from "@/features/mdx/list";
import { buildPaginatedHref, paginateItems, parsePageParam } from "@/features/pagination";
import { getPublicDemoListItems } from "./public";
import {
  getPublicDemoListHref,
  getPublicDemoListPageCopy,
  getPublicDemoMenuItems,
  type PublicDemoListCategory,
} from "./navigation";

export function renderPublicDemoListPage(
  locale: Locale,
  category: PublicDemoListCategory,
  page: string | undefined,
) {
  const copy = getPublicDemoListPageCopy(locale, category);
  const requestedPage = parsePageParam(page);
  const allItems = getPublicDemoListItems(locale, category);
  const paginated = paginateItems(allItems, requestedPage, MDX_LIST_PAGE_SIZE);
  const basePath = getPublicDemoListHref(locale, category);

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
      menu={getPublicDemoMenuItems(locale, category)}
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

export function buildPublicDemoListMetadata(
  locale: Locale,
  category: PublicDemoListCategory,
  page: string | undefined,
) {
  const copy = getPublicDemoListPageCopy(locale, category);
  const requestedPage = parsePageParam(page);
  const allItems = getPublicDemoListItems(locale, category);
  const paginated = paginateItems(allItems, requestedPage, MDX_LIST_PAGE_SIZE);
  const basePath = getPublicDemoListHref(locale, category);
  const canonical = buildPaginatedHref(basePath, paginated.currentPage);

  return {
    alternates: {
      canonical,
    },
    title: copy.metadataTitle,
  };
}
