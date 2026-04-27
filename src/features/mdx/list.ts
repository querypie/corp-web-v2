import "server-only";

import path from "path";
import { promises as fs } from "fs";
import { unstable_cache } from "next/cache";
import { getLocalePath, type Locale } from "@/constants/i18n";
import { getContentThumbnailSrc } from "@/features/content/data";
import { loadMdxSource } from "./loader";
import { renderMdx } from "./renderer";
import type { MdxListCategory } from "./types";

const MDX_ROOT = path.join(process.cwd(), "src", "content", "mdx");

export const MDX_LIST_PAGE_SIZE = 12;

export type MdxListItem = {
  dateIso: string;
  description?: string;
  href: string;
  id: string;
  imageSrc: string;
  title: string;
};

function getMdxListPath(category: MdxListCategory) {
  return category === "blog" ? "/blog" : "/white-papers";
}

function getMdxCategoryDirectory(category: MdxListCategory) {
  return category === "white-paper" ? "white-papers" : category;
}

function sortMdxListItems(left: MdxListItem, right: MdxListItem) {
  const dateCompare = right.dateIso.localeCompare(left.dateIso);

  if (dateCompare !== 0) {
    return dateCompare;
  }

  return Number(right.id) - Number(left.id);
}

const loadCachedMdxListItems = unstable_cache(
  async (category: MdxListCategory, locale: Locale): Promise<MdxListItem[]> => {
    const categoryRoot = path.join(MDX_ROOT, getMdxCategoryDirectory(category));
    const entries = await fs.readdir(categoryRoot, { withFileTypes: true });
    const slugs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

    const items = await Promise.all(
      slugs.map(async (slug) => {
        const source = await loadMdxSource(category, slug, locale);

        if (!source) {
          return null;
        }

        const { frontmatter } = await renderMdx(source, {});
        const href = getLocalePath(locale, `${getMdxListPath(category)}/${slug}`);
        const imageSrc = frontmatter.ogImage
          ? getContentThumbnailSrc(frontmatter.ogImage.replace(/^public\//, "/"))
          : getContentThumbnailSrc("");

        return {
          dateIso: frontmatter.date,
          description: frontmatter.description,
          href,
          id: slug,
          imageSrc,
          title: frontmatter.title,
        } satisfies MdxListItem;
      }),
    );

    return items
      .filter((item) => item !== null)
      .map((item) => item as MdxListItem)
      .sort(sortMdxListItems);
  },
  ["mdx-list-items"],
);

export async function loadMdxListItems(
  category: MdxListCategory,
  locale: Locale,
): Promise<MdxListItem[]> {
  return loadCachedMdxListItems(category, locale);
}
