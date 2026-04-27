import { getLocalePath, type Locale } from "@/constants/i18n";
import { slugifyTitle } from "@/features/content/data";
import type { MdxListCategory } from "./types";

function getMdxDetailBasePath(category: MdxListCategory) {
  return category === "blog" ? "/blog" : "/whitepapers";
}

export function getMdxDetailSlug(frontmatterSlug: string | undefined, title: string) {
  return frontmatterSlug || slugifyTitle(title);
}

export function getMdxDetailHref(
  category: MdxListCategory,
  locale: Locale,
  id: string,
  frontmatterSlug: string | undefined,
  title: string,
) {
  const slug = getMdxDetailSlug(frontmatterSlug, title);
  return getLocalePath(locale, `${getMdxDetailBasePath(category)}/${id}/${slug}`);
}

export function resolveMdxDetailRoute(
  category: MdxListCategory,
  locale: Locale,
  id: string,
  rest: string[] | undefined,
  frontmatterSlug: string | undefined,
  title: string,
) {
  const canonicalHref = getMdxDetailHref(category, locale, id, frontmatterSlug, title);
  const slug = getMdxDetailSlug(frontmatterSlug, title);
  const currentSlug = rest?.[0];
  const shouldRedirect = !rest?.length || rest.length !== 1 || currentSlug !== slug;

  return {
    canonicalHref,
    shouldRedirect,
  };
}
