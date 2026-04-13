import "server-only";

import { existsSync, promises as fs } from "fs";
import path from "path";
import {
  createLocalizedContent,
  sortManagedContents,
  type ManagedContentCategorySlug,
  type ManagedContentEntry,
  type ManagedContentSection,
  type ManagedContentStatus,
} from "./data";
import { readAuthoredManagedContents } from "./authored.server";

const stateRoot = path.join(process.cwd(), "src", "content", "state");
const statePath = path.join(stateRoot, "content-state.json");
let cachedState:
  | {
      items: ManagedContentEntry[];
      mtimeMs: number;
      size: number;
    }
  | null = null;

async function ensureStateRoot() {
  await fs.mkdir(stateRoot, { recursive: true });
}

async function readStateFile() {
  if (!existsSync(statePath)) {
    cachedState = null;
    return null;
  }

  try {
    const stat = await fs.stat(statePath);

    if (
      cachedState &&
      cachedState.mtimeMs === stat.mtimeMs &&
      cachedState.size === stat.size
    ) {
      return cachedState.items;
    }

    const raw = await fs.readFile(statePath, "utf8");
    const parsed = JSON.parse(raw) as ManagedContentEntry[];
    if (!Array.isArray(parsed)) {
      cachedState = null;
      return null;
    }

    const normalizedItems = sortManagedContents(
      dedupeManagedEntries(filterManagedEntries(parsed.map(normalizeStateEntry))),
    );

    cachedState = {
      items: normalizedItems,
      mtimeMs: stat.mtimeMs,
      size: stat.size,
    };

    return normalizedItems;
  } catch {
    cachedState = null;
    return null;
  }
}

function normalizeStateEntry(item: Partial<ManagedContentEntry>): ManagedContentEntry {
  return {
    authorName: item.authorName ?? "",
    authorRole: item.authorRole ?? "",
    bodyHtml: item.bodyHtml ?? createLocalizedContent(),
    bodyRichText: item.bodyRichText ?? createLocalizedContent(),
    categorySlug: item.categorySlug ?? "use-cases",
    contentType: item.contentType ?? (item.section === "news" ? "outlink" : "content"),
    dateIso: item.dateIso ?? "",
    downloadCoverImageSrc: item.downloadCoverImageSrc ?? "",
    downloadPdfFileName: item.downloadPdfFileName ?? "",
    downloadPdfSrc: item.downloadPdfSrc ?? "",
    enableDownloadButton: item.enableDownloadButton ?? false,
    externalUrl: item.externalUrl ?? "",
    gatingLevel: item.gatingLevel ?? "none",
    hideHeroImage: item.hideHeroImage ?? false,
    id: item.id ?? "",
    imageSrc: item.imageSrc ?? "",
    relatedIds: item.relatedIds ?? [],
    section: item.section ?? "demo",
    sortOrder: item.sortOrder ?? 0,
    storageId: item.storageId,
    status: item.status ?? "published",
    summary: item.summary ?? createLocalizedContent(),
    title: item.title ?? createLocalizedContent(),
  };
}

function filterManagedEntries(items: ManagedContentEntry[]) {
  return items.filter((item) => !(item.section === "news" && !item.storageId));
}

function dedupeManagedEntries(items: ManagedContentEntry[]) {
  const map = new Map<string, ManagedContentEntry>();

  items.forEach((item) => {
    map.set(item.id, item);
  });

  return [...map.values()];
}

async function readAllContentState() {
  const fileState = await readStateFile();
  return fileState ?? dedupeManagedEntries(filterManagedEntries(await readAuthoredManagedContents()));
}

export async function readContentState(
  section?: ManagedContentSection,
  options?: { categorySlug?: ManagedContentCategorySlug },
) {
  const items = await readAllContentState();
  const sectionItems = section ? items.filter((item) => item.section === section) : items;

  if (!options?.categorySlug) {
    return sectionItems;
  }

  return sectionItems.filter((item) => item.categorySlug === options.categorySlug);
}

export async function readContentItem(
  section: ManagedContentSection,
  id: string,
  options?: { categorySlug?: ManagedContentCategorySlug },
) {
  const items = await readContentState(section, options);
  return items.find((item) => item.id === id) ?? null;
}

export async function writeContentState(items: ManagedContentEntry[]) {
  await ensureStateRoot();
  const sortedItems = sortManagedContents(dedupeManagedEntries(items));
  await fs.writeFile(statePath, `${JSON.stringify(sortedItems, null, 2)}\n`, "utf8");
  const stat = await fs.stat(statePath);
  cachedState = {
    items: sortedItems,
    mtimeMs: stat.mtimeMs,
    size: stat.size,
  };
  return sortedItems;
}

export async function replaceContentState(items: ManagedContentEntry[]) {
  return writeContentState(items);
}

export async function upsertContentState(item: ManagedContentEntry, currentId?: string) {
  const items = await readContentState();
  const nextItems = items.filter((entry) => entry.id !== currentId && entry.id !== item.id);
  return writeContentState([item, ...nextItems]);
}

export async function deleteContentState(id: string) {
  const items = await readContentState();
  return writeContentState(items.filter((item) => item.id !== id));
}

export async function updateContentStateStatus(id: string, status: ManagedContentStatus) {
  const items = await readContentState();
  return writeContentState(items.map((item) => (item.id === id ? { ...item, status } : item)));
}
