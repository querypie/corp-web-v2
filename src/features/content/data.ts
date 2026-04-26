import { getLocalePath, type Locale } from "@/constants/i18n";
import { getAipDemoHrefByContentId } from "@/features/demo/aip";
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

export function createEmptyManagedContentDraft(
  section: ManagedContentSection,
  categorySlug: ManagedContentCategorySlug,
): ManagedContentEntry {
  const useRichEditor = section !== "news";

  return {
    authorName: "",
    authorRole: "",
    bodyHtml: createLocalizedContent(useRichEditor ? createEmptyTiptapHtml() : ""),
    bodyRichText: createLocalizedContent(useRichEditor ? createEmptyTiptapJson() : ""),
    categorySlug,
    contentType: section === "news" ? "outlink" : "content",
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
  item: Pick<ManagedContentEntry, "status" | "title">,
  locale: Locale,
) {
  return item.status === "published" && hasLocalizedTitle(item.title, locale);
}

export function isPublishedContentAccessible(
  item: Pick<ManagedContentEntry, "status" | "title">,
) {
  return item.status === "published" && hasAnyLocalizedTitle(item.title);
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
    return getAipDemoHrefByContentId(locale, slug) ?? getLocalePath(locale, `/features/demo/${slug}`);
  }

  if (section === "documentation") {
    return getLocalePath(locale, `/features/documentation/${slug}`);
  }

  return getLocalePath(locale, `/company/news/${slug}`);
}
