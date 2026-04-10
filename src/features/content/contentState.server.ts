import "server-only";

import { existsSync, promises as fs } from "fs";
import path from "path";
import {
  createLocalizedContent,
  sortManagedContents,
  type ManagedContentEntry,
  type ManagedContentSection,
  type ManagedContentStatus,
} from "./data";
import { readServerManagedContents } from "./serverSeed";

const stateRoot = path.join(process.cwd(), "src", "content", "state");
const statePath = path.join(stateRoot, "content-state.json");

async function ensureStateRoot() {
  await fs.mkdir(stateRoot, { recursive: true });
}

async function readStateFile() {
  if (!existsSync(statePath)) {
    return null;
  }

  try {
    const raw = await fs.readFile(statePath, "utf8");
    const parsed = JSON.parse(raw) as ManagedContentEntry[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function normalizeStateEntry(item: Partial<ManagedContentEntry>): ManagedContentEntry {
  return {
    authorName: item.authorName ?? "",
    authorRole: item.authorRole ?? "",
    bodyHtml: item.bodyHtml ?? createLocalizedContent(),
    bodyMarkdown: item.bodyMarkdown ?? createLocalizedContent(),
    bodyRichText: item.bodyRichText ?? createLocalizedContent(),
    categorySlug: item.categorySlug ?? "use-cases",
    contentFormat: item.contentFormat ?? "markdown",
    contentType: item.contentType ?? (item.section === "news" ? "outlink" : "content"),
    dateIso: item.dateIso ?? "",
<<<<<<< HEAD
    downloadCoverImageSrc: item.downloadCoverImageSrc ?? "",
    downloadPdfFileName: item.downloadPdfFileName ?? "",
    downloadPdfSrc: item.downloadPdfSrc ?? "",
    enableDownloadButton: item.enableDownloadButton ?? false,
    externalUrl: item.externalUrl ?? "",
    gatingLevel: item.gatingLevel ?? "none",
=======
    externalUrl: item.externalUrl ?? "",
>>>>>>> origin/main
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
  return fileState
    ? sortManagedContents(dedupeManagedEntries(filterManagedEntries(fileState.map(normalizeStateEntry))))
    : dedupeManagedEntries(filterManagedEntries(await readServerManagedContents()));
}

export async function readContentState(section?: ManagedContentSection) {
  const items = await readAllContentState();
  return section ? items.filter((item) => item.section === section) : items;
}

export async function writeContentState(items: ManagedContentEntry[]) {
  await ensureStateRoot();
  const sortedItems = sortManagedContents(dedupeManagedEntries(items));
  await fs.writeFile(statePath, `${JSON.stringify(sortedItems, null, 2)}\n`, "utf8");
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
