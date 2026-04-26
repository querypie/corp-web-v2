import { getLocalePath, type Locale } from "@/constants/i18n";

export type AipDemoEntry = {
  id: string;
  slug: string;
  contentId: string;
};

export const aipDemoEntries: readonly AipDemoEntry[] = [
  { id: "1", slug: "google-oauth-demo", contentId: "google-oauth-demo" },
] as const;

const aipDemoEntryById = new Map(aipDemoEntries.map((entry) => [entry.id, entry]));
const aipDemoEntryByContentId = new Map(aipDemoEntries.map((entry) => [entry.contentId, entry]));

export function getAipDemoEntry(id: string) {
  return aipDemoEntryById.get(id) ?? null;
}

export function getAipDemoEntryByContentId(contentId: string) {
  return aipDemoEntryByContentId.get(contentId) ?? null;
}

export function getAipDemoHref(locale: Locale, id: string) {
  const entry = getAipDemoEntry(id);
  return entry ? getLocalePath(locale, `/demo/aip/${entry.id}/${entry.slug}`) : null;
}

export function getAipDemoHrefByContentId(locale: Locale, contentId: string) {
  const entry = getAipDemoEntryByContentId(contentId);
  return entry ? getAipDemoHref(locale, entry.id) : null;
}

export function resolveAipDemoRoute(locale: Locale, id: string, rest?: string[]) {
  const entry = getAipDemoEntry(id);

  if (!entry) {
    return {
      canonicalHref: null,
      entry: null,
      shouldRedirect: false,
    };
  }

  const canonicalHref = getLocalePath(locale, `/demo/aip/${entry.id}/${entry.slug}`);
  const slug = rest?.[0];
  const shouldRedirect = !rest?.length || rest.length !== 1 || slug !== entry.slug;

  return {
    canonicalHref,
    entry,
    shouldRedirect,
  };
}
