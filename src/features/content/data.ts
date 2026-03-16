import type { Locale } from "@/constants/i18n";
import {
  demoCategoryConfigs,
  docsCategoryConfigs,
  type DemoCategorySlug,
  type DocsCategorySlug,
} from "./config";
import { getStaticDemoEntries } from "./demoStatic";
import { getStaticDocsEntries } from "./docsStatic";
import { initialUseCases } from "@/features/useCases/data";

export type ManagedContentSection = "demo" | "documentation";
export type ManagedContentStatus = "draft" | "hidden" | "published";
export type ManagedContentCategorySlug = Exclude<DemoCategorySlug | DocsCategorySlug, "all">;

export type ManagedContentEntry = {
  authorName: string;
  authorRole: string;
  bodyMarkdown: string;
  categorySlug: ManagedContentCategorySlug;
  dateIso: string;
  id: string;
  imageSrc: string;
  section: ManagedContentSection;
  status: ManagedContentStatus;
  title: string;
};

export const MANAGED_CONTENT_STORAGE_KEY = "querypie-admin-managed-content";
export const MANAGED_CONTENT_STORE_EVENT = "querypie:managed-content:changed";

export function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function createEmptyManagedContentDraft(
  section: ManagedContentSection,
  categorySlug: ManagedContentCategorySlug,
): ManagedContentEntry {
  return {
    authorName: "",
    authorRole: "",
    bodyMarkdown: "",
    categorySlug,
    dateIso: getTodayIsoDate(),
    id: "new",
    imageSrc: "",
    section,
    status: "draft",
    title: "",
  };
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
  return [...items].sort((left, right) => right.dateIso.localeCompare(left.dateIso));
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

export function getManagedCategoryLabel(
  section: ManagedContentSection,
  categorySlug: ManagedContentCategorySlug,
  locale: Locale,
) {
  const configs = section === "demo" ? demoCategoryConfigs : docsCategoryConfigs;
  return configs.find((config) => config.slug === categorySlug)?.label[locale] ?? "";
}

export function getAdminCategoryHref(
  section: ManagedContentSection,
  categorySlug: ManagedContentCategorySlug,
) {
  return `/admin/${section}/${categorySlug}`;
}

export function getAdminDetailHref(
  section: ManagedContentSection,
  categorySlug: ManagedContentCategorySlug,
  slug: string,
) {
  return `/admin/${section}/${categorySlug}/${slug}`;
}

export function getPublicListHref(section: ManagedContentSection, locale: Locale) {
  return section === "demo" ? `/${locale}/demo` : `/${locale}/docs`;
}

export function getPublicDetailHref(
  section: ManagedContentSection,
  locale: Locale,
  slug: string,
) {
  return section === "demo" ? `/${locale}/demo/${slug}` : `/${locale}/docs/${slug}`;
}

export const initialManagedContents: ManagedContentEntry[] = sortManagedContents([
  ...initialUseCases.map((item) => ({
    authorName: item.authorName,
    authorRole: item.authorRole,
    bodyMarkdown: item.bodyMarkdown,
    categorySlug: item.categorySlug,
    dateIso: item.dateIso,
    id: item.id,
    imageSrc: item.imageSrc,
    section: "demo" as const,
    status: item.status,
    title: item.title,
  })),
  ...getStaticDemoEntries("en").map((item) => ({
    authorName: item.writer,
    authorRole: "",
    bodyMarkdown: item.bodyMarkdown,
    categorySlug: item.categorySlug,
    dateIso: item.date,
    id: item.slug,
    imageSrc: item.imageSrc,
    section: "demo" as const,
    status: "published" as const,
    title: item.title,
  })),
  ...getStaticDocsEntries("en").map((item) => ({
    authorName: item.writer,
    authorRole: "",
    bodyMarkdown: item.bodyMarkdown,
    categorySlug: item.categorySlug,
    dateIso: item.date,
    id: item.slug,
    imageSrc: item.imageSrc,
    section: "documentation" as const,
    status: "published" as const,
    title: item.title,
  })),
]);

export function getSeedManagedContents(section?: ManagedContentSection) {
  return section
    ? initialManagedContents.filter((item) => item.section === section)
    : initialManagedContents;
}
