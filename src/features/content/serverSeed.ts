import "server-only";

import { promises as fs } from "fs";
import path from "path";
import type { Locale } from "@/constants/i18n";
import type {
  LocalizedContent,
  ManagedContentEntry,
  ManagedContentSection,
} from "./data";
import { sortManagedContents } from "./data";
import { readAuthoredManagedContents } from "./authored.server";

function createLocalizedContent(value = ""): LocalizedContent {
  return {
    en: value,
    ko: value,
    ja: value,
  };
}

function normalizeLocalizedContent(value: Partial<LocalizedContent> | string | undefined): LocalizedContent {
  if (typeof value === "string") {
    return createLocalizedContent(value);
  }

  return {
    en: value?.en ?? "",
    ko: value?.ko ?? value?.en ?? "",
    ja: value?.ja ?? value?.en ?? "",
  };
}

function normalizeEntry(item: Partial<ManagedContentEntry>): ManagedContentEntry {
  return {
    authorName: item.authorName ?? "",
    authorRole: item.authorRole ?? "",
    bodyHtml: normalizeLocalizedContent(item.bodyHtml),
    bodyMarkdown: normalizeLocalizedContent(item.bodyMarkdown),
    bodyRichText: normalizeLocalizedContent(item.bodyRichText),
    categorySlug: item.categorySlug ?? "use-cases",
    contentFormat: item.contentFormat ?? "markdown",
    contentType: item.contentType ?? (item.section === "news" ? "outlink" : "content"),
    dateIso: item.dateIso ?? "",
    externalUrl: item.externalUrl ?? "",
    hideHeroImage: item.hideHeroImage ?? false,
    id: item.id ?? "",
    imageSrc: item.imageSrc ?? "",
    relatedIds: item.relatedIds ?? [],
    section: item.section ?? "demo",
    sortOrder: item.sortOrder ?? 0,
    storageId: item.storageId,
    status: item.status ?? "published",
    summary: normalizeLocalizedContent(item.summary),
    title: normalizeLocalizedContent(item.title),
  };
}

async function readJsonArray<T>(absolutePath: string) {
  try {
    const raw = await fs.readFile(absolutePath, "utf8");
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function dedupeManagedEntries(items: ManagedContentEntry[]) {
  const map = new Map<string, ManagedContentEntry>();

  items.forEach((item) => {
    map.set(item.id, item);
  });

  return [...map.values()];
}

export async function readServerManagedContents(section?: ManagedContentSection) {
  const root = process.cwd();
  const managedPath = path.join(root, "src", "content", "managed", "content-seed.json");

  const authored = await readAuthoredManagedContents();
  const managed = (await readJsonArray<Partial<ManagedContentEntry>>(managedPath)).map(normalizeEntry);
  const allItems = sortManagedContents(dedupeManagedEntries([...managed, ...authored]));

  return section ? allItems.filter((item) => item.section === section) : allItems;
}
