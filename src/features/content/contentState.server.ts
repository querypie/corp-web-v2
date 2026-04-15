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
import { getAuthoredCacheVersion, readAuthoredManagedContents } from "./authored.server";

const stateRoot = path.join(process.cwd(), "src", "content", "state");
const statePath = path.join(stateRoot, "content-state.json");
let cachedState:
  | {
      fullItems: ManagedContentEntry[];
      listItems: ManagedContentEntry[];
      mtimeMs: number;
      size: number;
    }
  | null = null;
const mergedStateCache = new Map<string, ManagedContentEntry[]>();

async function ensureStateRoot() {
  await fs.mkdir(stateRoot, { recursive: true });
}

function invalidateMergedStateCache() {
  mergedStateCache.clear();
}

async function readStateFile(options?: { includeBodies?: boolean }) {
  if (!existsSync(statePath)) {
    cachedState = null;
    invalidateMergedStateCache();
    return null;
  }

  try {
    const stat = await fs.stat(statePath);

    if (
      cachedState &&
      cachedState.mtimeMs === stat.mtimeMs &&
      cachedState.size === stat.size
    ) {
      return options?.includeBodies === false ? cachedState.listItems : cachedState.fullItems;
    }

    const raw = await fs.readFile(statePath, "utf8");
    const parsed = JSON.parse(raw) as ManagedContentEntry[];
    if (!Array.isArray(parsed)) {
      cachedState = null;
      invalidateMergedStateCache();
      return null;
    }

    const fullItems = sortManagedContents(
      dedupeManagedEntries(filterManagedEntries(parsed.map((item) => normalizeStateEntry(item, true)))),
    );
    const listItems = sortManagedContents(
      dedupeManagedEntries(filterManagedEntries(parsed.map((item) => normalizeStateEntry(item, false)))),
    );

    cachedState = {
      fullItems,
      listItems,
      mtimeMs: stat.mtimeMs,
      size: stat.size,
    };
    invalidateMergedStateCache();

    return options?.includeBodies === false ? listItems : fullItems;
  } catch {
    cachedState = null;
    invalidateMergedStateCache();
    return null;
  }
}

function normalizeStateEntry(
  item: Partial<ManagedContentEntry>,
  includeBodies = true,
): ManagedContentEntry {
  return {
    authorName: item.authorName ?? "",
    authorRole: item.authorRole ?? "",
    bodyHtml: includeBodies ? item.bodyHtml ?? createLocalizedContent() : createLocalizedContent(),
    bodyRichText: includeBodies ? item.bodyRichText ?? createLocalizedContent() : createLocalizedContent(),
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

function mergeManagedEntries(
  baseItems: ManagedContentEntry[],
  overrideItems: ManagedContentEntry[],
) {
  const map = new Map(baseItems.map((item) => [item.id, item]));

  overrideItems.forEach((item) => {
    const baseItem = map.get(item.id);

    if (!baseItem) {
      map.set(item.id, item);
      return;
    }

    const hasOverrideBody =
      Object.values(item.bodyHtml).some((value) => value.trim().length > 0)
      || Object.values(item.bodyRichText).some((value) => value.trim().length > 0);
    const hasBaseBody =
      Object.values(baseItem.bodyHtml).some((value) => value.trim().length > 0)
      || Object.values(baseItem.bodyRichText).some((value) => value.trim().length > 0);

    map.set(
      item.id,
      hasOverrideBody || !hasBaseBody
        ? item
        : {
            ...item,
            bodyHtml: baseItem.bodyHtml,
            bodyRichText: baseItem.bodyRichText,
          },
    );
  });

  return [...map.values()];
}

async function readAllContentState() {
  return readAllContentStateWithOptions();
}

async function readAllContentStateWithOptions(options?: { includeBodies?: boolean }) {
  const includeBodies = options?.includeBodies ?? true;
  const fileState = await readStateFile({ includeBodies });
  const stateSignature = cachedState
    ? `${cachedState.mtimeMs}:${cachedState.size}`
    : "missing";
  const cacheKey = `${includeBodies ? "full" : "list"}::${stateSignature}::${getAuthoredCacheVersion()}`;
  const mergedCached = mergedStateCache.get(cacheKey);

  if (mergedCached) {
    return mergedCached;
  }

  const authoredState = dedupeManagedEntries(
    filterManagedEntries(
      await readAuthoredManagedContents({ includeBodies }),
    ),
  );

  if (!fileState) {
    mergedStateCache.set(cacheKey, authoredState);
    return authoredState;
  }

  const mergedItems = sortManagedContents(
    dedupeManagedEntries(mergeManagedEntries(authoredState, fileState)),
  );
  mergedStateCache.set(cacheKey, mergedItems);
  return mergedItems;
}

export async function readContentState(
  section?: ManagedContentSection,
  options?: { categorySlug?: ManagedContentCategorySlug; includeBodies?: boolean },
) {
  const items = await readAllContentStateWithOptions({
    includeBodies: options?.includeBodies,
  });
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
    fullItems: sortedItems,
    listItems: sortedItems.map((item) => normalizeStateEntry(item, false)),
    mtimeMs: stat.mtimeMs,
    size: stat.size,
  };
  invalidateMergedStateCache();
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
