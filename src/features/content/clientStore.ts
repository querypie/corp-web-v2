"use client";

import { useEffect, useState } from "react";
import {
  createLocalizedContent,
  getSeedManagedContents,
  initialManagedContents,
  LEGACY_USE_CASE_STORAGE_KEY,
  MANAGED_CONTENT_STORAGE_KEY,
  MANAGED_CONTENT_STORE_EVENT,
  sortManagedContents,
  type LocalizedContent,
  type ManagedContentEntry,
  type ManagedContentSection,
  type ManagedContentStatus,
} from "./data";

function canUseStorage() {
  return typeof window !== "undefined";
}

function normalizeLocalizedContent(value: Partial<LocalizedContent> | string | undefined) {
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
    bodyMarkdown: normalizeLocalizedContent(item.bodyMarkdown),
    categorySlug: item.categorySlug ?? "use-cases",
    dateIso: item.dateIso ?? "",
    externalUrl: item.externalUrl ?? "",
    id: item.id ?? "",
    imageSrc: item.imageSrc ?? "",
    section: item.section ?? "demo",
    sortOrder: item.sortOrder ?? Number.MAX_SAFE_INTEGER,
    status: item.status ?? "draft",
    summary: normalizeLocalizedContent(item.summary),
    title: normalizeLocalizedContent(item.title),
  };
}

function readLegacyUseCases() {
  if (!canUseStorage()) return [];

  const raw = window.localStorage.getItem(LEGACY_USE_CASE_STORAGE_KEY);

  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Array<{
      authorName?: string;
      authorRole?: string;
      bodyMarkdown?: string;
      dateIso?: string;
      id?: string;
      imageSrc?: string;
      status?: ManagedContentStatus;
      title?: string;
    }>;
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item) =>
      normalizeEntry({
        authorName: item.authorName,
        authorRole: item.authorRole,
        bodyMarkdown: createLocalizedContent(item.bodyMarkdown),
        categorySlug: "use-cases",
        dateIso: item.dateIso,
        externalUrl: "",
        id: item.id,
        imageSrc: item.imageSrc,
        section: "demo",
        status: item.status,
        summary: createLocalizedContent(),
        title: createLocalizedContent(item.title),
      }),
    );
  } catch {
    return [];
  }
}

function mergeEntries(baseItems: ManagedContentEntry[], nextItems: ManagedContentEntry[]) {
  const map = new Map(baseItems.map((item) => [item.id, item]));
  nextItems.forEach((item) => {
    map.set(item.id, item);
  });
  return sortManagedContents([...map.values()]);
}

function readStoredItems() {
  if (!canUseStorage()) {
    return sortManagedContents(initialManagedContents);
  }

  const raw = window.localStorage.getItem(MANAGED_CONTENT_STORAGE_KEY);
  const legacyItems = readLegacyUseCases();

  if (!raw) {
    return mergeEntries(initialManagedContents, legacyItems);
  }

  try {
    const parsed = JSON.parse(raw) as Array<Partial<ManagedContentEntry>>;

    if (!Array.isArray(parsed)) {
      return mergeEntries(initialManagedContents, legacyItems);
    }

    return mergeEntries(
      initialManagedContents,
      mergeEntries(legacyItems, parsed.map(normalizeEntry)),
    );
  } catch {
    return mergeEntries(initialManagedContents, legacyItems);
  }
}

function emitChange() {
  if (!canUseStorage()) return;
  window.dispatchEvent(new Event(MANAGED_CONTENT_STORE_EVENT));
}

export function getManagedContentsSnapshot(section?: ManagedContentSection) {
  const items = readStoredItems();
  return section ? items.filter((item) => item.section === section) : items;
}

export function persistManagedContents(items: ManagedContentEntry[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(
    MANAGED_CONTENT_STORAGE_KEY,
    JSON.stringify(sortManagedContents(items)),
  );
  emitChange();
}

export function upsertManagedContent(item: ManagedContentEntry, currentId?: string) {
  const items = readStoredItems();
  const nextItems = items.filter((entry) => entry.id !== currentId && entry.id !== item.id);
  persistManagedContents([item, ...nextItems]);
}

export function deleteManagedContent(id: string) {
  const items = readStoredItems();
  persistManagedContents(items.filter((item) => item.id !== id));
}

export function updateManagedContentStatus(id: string, status: ManagedContentStatus) {
  const items = readStoredItems();
  persistManagedContents(items.map((item) => (item.id === id ? { ...item, status } : item)));
}

export function reorderManagedContents(orderedItems: ManagedContentEntry[]) {
  const normalizedItems = orderedItems.map((item, index) => ({
    ...item,
    sortOrder: index + 1,
  }));

  const currentItems = readStoredItems();
  const firstItem = normalizedItems[0];

  if (!firstItem) {
    return;
  }

  const otherItems = currentItems.filter(
    (item) =>
      !(
        item.section === firstItem.section &&
        item.categorySlug === firstItem.categorySlug
      ),
  );

  persistManagedContents([...normalizedItems, ...otherItems]);
}

export function useManagedContents(section?: ManagedContentSection) {
  const [items, setItems] = useState<ManagedContentEntry[]>(() =>
    section ? getSeedManagedContents(section) : getSeedManagedContents(),
  );

  useEffect(() => {
    const sync = () => {
      setItems(section ? getManagedContentsSnapshot(section) : getManagedContentsSnapshot());
    };

    sync();
    window.addEventListener(MANAGED_CONTENT_STORE_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(MANAGED_CONTENT_STORE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [section]);

  return items;
}
