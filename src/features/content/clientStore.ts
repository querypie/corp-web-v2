"use client";

import { useEffect, useState } from "react";
import {
  getSeedManagedContents,
  initialManagedContents,
  MANAGED_CONTENT_STORAGE_KEY,
  MANAGED_CONTENT_STORE_EVENT,
  sortManagedContents,
  type ManagedContentEntry,
  type ManagedContentSection,
  type ManagedContentStatus,
} from "./data";
import { USE_CASE_STORAGE_KEY, type UseCaseEntry } from "@/features/useCases/data";

function canUseStorage() {
  return typeof window !== "undefined";
}

function normalizeEntry(item: Partial<ManagedContentEntry>): ManagedContentEntry {
  return {
    authorName: item.authorName ?? "",
    authorRole: item.authorRole ?? "",
    bodyMarkdown: item.bodyMarkdown ?? "",
    categorySlug: item.categorySlug ?? "use-cases",
    dateIso: item.dateIso ?? "",
    id: item.id ?? "",
    imageSrc: item.imageSrc ?? "",
    section: item.section ?? "demo",
    status: item.status ?? "draft",
    title: item.title ?? "",
  };
}

function readLegacyUseCases() {
  if (!canUseStorage()) return [];

  const raw = window.localStorage.getItem(USE_CASE_STORAGE_KEY);

  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Array<Partial<UseCaseEntry>>;
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item) =>
      normalizeEntry({
        authorName: item.authorName,
        authorRole: item.authorRole,
        bodyMarkdown: item.bodyMarkdown,
        categorySlug: "use-cases",
        dateIso: item.dateIso,
        id: item.id,
        imageSrc: item.imageSrc,
        section: "demo",
        status: item.status,
        title: item.title,
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
