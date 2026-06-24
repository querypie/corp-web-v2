import { getLocalePath, type Locale } from "@/constants/i18n";
import {
  demoCategoryConfigs,
  docsCategoryConfigs,
  type DemoCategorySlug,
  type DocsCategorySlug,
  type NewsCategorySlug,
} from "./config";

export type ManagedContentSection = "demo" | "documentation" | "news";
export type ManagedContentStatus = "hidden" | "published";
export type ManagedContentCategorySlug = Exclude<DemoCategorySlug | DocsCategorySlug, "all"> | NewsCategorySlug;
export type ManagedContentType = "content" | "outlink";
export type ContentGatingLevel = "none" | "10" | "30" | "50";
export type NewsFormat = "Press Release" | "Official Announcement" | "Media Coverage";
export type LocalizedContent = Record<Locale, string>;

export type ManagedContentEntry = {
  authorName: string;
  authorRole: string;
  bodyHtml: LocalizedContent;
  bodyRichText: LocalizedContent;
  categorySlug: ManagedContentCategorySlug;
  contentType: ManagedContentType;
  dateIso: string;
  downloadCoverImageSrc: string;
  downloadPdfFileName: string;
  downloadPdfSrc: string;
  enableDownloadButton: boolean;
  externalUrl: string;
  gatingLevel: ContentGatingLevel;
  hideHeroImage: boolean;
  id: string;
  imageSrc: string;
  relatedIds: string[];
  section: ManagedContentSection;
  sortOrder: number;
  storageId?: string;
  status: ManagedContentStatus;
  summary: LocalizedContent;
  title: LocalizedContent;
  visibleLocales: Locale[];
};

export function stripManagedContentBodies(item: ManagedContentEntry): ManagedContentEntry {
  return {
    ...item,
    bodyHtml: createLocalizedContent(),
    bodyRichText: createLocalizedContent(),
  };
}

export const MANAGED_CONTENT_STORAGE_KEY = "querypie-admin-managed-content";
export const MANAGED_CONTENT_STORE_EVENT = "querypie:managed-content:changed";
export const CONTENT_DOWNLOAD_BUTTON_LABEL = "Download File";
export const CONTENT_UNLOCK_BUTTON_LABEL = "Unlock Content";
export const NEWS_FORMATS: NewsFormat[] = [
  "Press Release",
  "Official Announcement",
  "Media Coverage",
];
export const DEFAULT_NEWS_FORMAT: NewsFormat = "Media Coverage";
const ADJACENT_CONTENT_LABELS: Record<"next" | "previous", Record<Locale, string>> = {
  next: {
    en: "Next post",
    ja: "次の記事",
    ko: "다음 글",
  },
  previous: {
    en: "Previous Post",
    ja: "前の記事",
    ko: "이전 글",
  },
};
const NEWS_FORMAT_LABELS: Record<NewsFormat, Record<Locale, string>> = {
  "Media Coverage": {
    en: "Media Coverage",
    ja: "メディア掲載",
    ko: "미디어 보도",
  },
  "Official Announcement": {
    en: "Official Announcement",
    ja: "公式発表",
    ko: "공식 발표",
  },
  "Press Release": {
    en: "Press Release",
    ja: "プレスリリース",
    ko: "보도자료",
  },
};

export function createEmptyManagedContentDraft(
  section: ManagedContentSection,
  categorySlug: ManagedContentCategorySlug,
): ManagedContentEntry {
  return {
    authorName: section === "news" ? DEFAULT_NEWS_FORMAT : "",
    authorRole: "",
    bodyHtml: createLocalizedContent(createEmptyTiptapHtml()),
    bodyRichText: createLocalizedContent(createEmptyTiptapJson()),
    categorySlug,
    contentType: "content",
    dateIso: "",
    downloadCoverImageSrc: "",
    downloadPdfFileName: "",
    downloadPdfSrc: "",
    enableDownloadButton: false,
    externalUrl: "",
    gatingLevel: "none",
    hideHeroImage: false,
    id: "new",
    imageSrc: "",
    relatedIds: [],
    section,
    sortOrder: 0,
    status: "hidden",
    summary: createLocalizedContent(),
    title: createLocalizedContent(),
    visibleLocales: [],
  };
}

export function createLocalizedContent(value = ""): LocalizedContent {
  return {
    en: value,
    ko: value,
    ja: value,
  };
}

function createEmptyTiptapJson() {
  return JSON.stringify({
    content: [{ type: "paragraph" }],
    type: "doc",
  });
}

function createEmptyTiptapHtml() {
  return "<p></p>";
}

export function getLocalizedContent(content: LocalizedContent, locale: Locale) {
  return content[locale] || content.en || content.ko || content.ja || "";
}

export function hasLocalizedTitle(content: LocalizedContent, locale: Locale) {
  return Boolean(content[locale]?.trim());
}

export function hasAnyLocalizedTitle(content: LocalizedContent) {
  return Boolean(content.en?.trim() || content.ko?.trim() || content.ja?.trim());
}

export function isPublishedContentVisible(
  item: Pick<ManagedContentEntry, "status" | "visibleLocales">,
  locale: Locale,
) {
  return item.status === "published" && item.visibleLocales.includes(locale);
}

export function isPublishedContentAccessible(
  item: Pick<ManagedContentEntry, "status" | "visibleLocales">,
) {
  return item.status === "published" && item.visibleLocales.length > 0;
}

export function getDefaultVisibleLocales(title: LocalizedContent) {
  return (["en", "ko", "ja"] as const).filter((locale) => title[locale]?.trim());
}

export function getResolvedContentLocale(
  item: Pick<ManagedContentEntry, "visibleLocales">,
  locale: Locale,
) {
  if (item.visibleLocales.includes(locale)) {
    return locale;
  }

  return (["en", "ko", "ja"] as const).find((fallbackLocale) =>
    item.visibleLocales.includes(fallbackLocale),
  ) ?? locale;
}

export function getContentThumbnailSrc(imageSrc: string) {
  const trimmedImageSrc = imageSrc.trim();

  if (!trimmedImageSrc) {
    return "/images/common/fallback-contents.jpg";
  }

  if (trimmedImageSrc.startsWith("/images/content/")) {
    return trimmedImageSrc.replace("/images/content/", "/uploads/");
  }

  return trimmedImageSrc;
}

export function slugifyTitle(title: string) {
  const normalized = title
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || `content-${Date.now()}`;
}

export function ensureUniqueSlug(id: string, items: ManagedContentEntry[], currentId?: string) {
  const taken = new Set(items.filter((item) => item.id !== currentId).map((item) => item.id));

  if (!taken.has(id)) {
    return id;
  }

  let index = 2;
  let nextId = `${id}-${index}`;

  while (taken.has(nextId)) {
    index += 1;
    nextId = `${id}-${index}`;
  }

  return nextId;
}

export function resolveManagedContentSlug({
  currentId,
  enteredSlug,
  items,
  title,
}: {
  currentId?: string;
  enteredSlug: string;
  items: ManagedContentEntry[];
  title: LocalizedContent;
}) {
  const trimmedSlug = enteredSlug.trim();
  const baseSlug =
    trimmedSlug && trimmedSlug !== "new"
      ? slugifyTitle(trimmedSlug)
      : currentId
        ? currentId
        : slugifyTitle(title.en || title.ko || title.ja);

  return ensureUniqueSlug(baseSlug, items, currentId);
}

export function sortManagedContents(items: ManagedContentEntry[]) {
  return [...items].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return right.dateIso.localeCompare(left.dateIso);
  });
}

export function getNextSortOrder(
  items: ManagedContentEntry[],
  section: ManagedContentSection,
  categorySlug: ManagedContentCategorySlug,
) {
  return (
    items
      .filter((item) => item.section === section && item.categorySlug === categorySlug)
      .reduce((max, item) => Math.max(max, item.sortOrder), 0) + 1
  );
}

export function formatPublicDate(locale: Locale, dateIso: string) {
  if (!dateIso) {
    return "";
  }

  const date = new Date(`${dateIso}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getWriterLabel(item: Pick<ManagedContentEntry, "authorName" | "authorRole">) {
  return item.authorRole.trim()
    ? `${item.authorName.trim()} / ${item.authorRole.trim()}`
    : item.authorName.trim();
}

export function getNewsFormatLabel(item: Pick<ManagedContentEntry, "authorName">, locale?: Locale) {
  const value = item.authorName.trim();
  const format = NEWS_FORMATS.includes(value as NewsFormat) ? (value as NewsFormat) : DEFAULT_NEWS_FORMAT;
  return locale ? NEWS_FORMAT_LABELS[format][locale] : format;
}

export function getAdjacentContentLabel(direction: "next" | "previous", locale: Locale) {
  return ADJACENT_CONTENT_LABELS[direction][locale];
}

export function getDownloadPreviewProps(
  item: Pick<
    ManagedContentEntry,
    "downloadPdfSrc" | "enableDownloadButton" | "section"
  >,
) {
  const shouldShow = item.section !== "news" && item.enableDownloadButton;

  return {
    downloadHref: shouldShow ? item.downloadPdfSrc || "#" : undefined,
    downloadLabel: CONTENT_DOWNLOAD_BUTTON_LABEL,
  };
}

export function isDownloadableContentPdfSrc(
  section: ManagedContentSection,
  src: string,
) {
  const trimmedSrc = src.trim();
  const expectedPrefix =
    section === "documentation"
      ? "/documentation/"
      : section === "demo"
        ? "/demo/"
        : "";

  return Boolean(
    expectedPrefix &&
    trimmedSrc.startsWith(expectedPrefix) &&
    trimmedSrc.toLowerCase().endsWith(".pdf"),
  );
}

export function getManagedCategoryLabel(
  section: ManagedContentSection,
  categorySlug: ManagedContentCategorySlug,
  locale: Locale,
) {
  if (section === "news") {
    return locale === "ko" ? "뉴스" : "News";
  }

  const configs = section === "demo" ? demoCategoryConfigs : docsCategoryConfigs;
  return configs.find((config) => config.slug === categorySlug)?.label[locale] ?? "";
}

export function getAdminCategoryHref(
  section: ManagedContentSection,
  categorySlug: ManagedContentCategorySlug,
) {
  if (section === "news") {
    return "/admin/news";
  }
  return `/admin/${section}/${categorySlug}`;
}

export function getAdminDetailHref(
  section: ManagedContentSection,
  categorySlug: ManagedContentCategorySlug,
  slug: string,
) {
  if (section === "news") {
    return `/admin/news/${slug}`;
  }
  return `/admin/${section}/${categorySlug}/${slug}`;
}

export function getPublicListHref(section: ManagedContentSection, locale: Locale) {
  if (section === "demo") return getLocalePath(locale, "/features/demo");
  if (section === "documentation") return getLocalePath(locale, "/features/documentation");
  return getLocalePath(locale, "/company/news");
}

export function getPublicDetailHref(
  section: ManagedContentSection,
  locale: Locale,
  slug: string,
) {
  if (section === "demo") {
    return getLocalePath(locale, `/features/demo/${slug}`);
  }

  if (section === "documentation") {
    return getLocalePath(locale, `/features/documentation/${slug}`);
  }

  return getLocalePath(locale, `/company/news/${slug}`);
}
