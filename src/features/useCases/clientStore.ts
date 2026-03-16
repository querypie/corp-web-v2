"use client";

import { useEffect, useState } from "react";
import {
  initialUseCases,
  sortUseCases,
  USE_CASE_STORAGE_KEY,
  USE_CASE_STORE_EVENT,
  type UseCaseEntry,
  type UseCaseStatus,
} from "./data";

function canUseStorage() {
  return typeof window !== "undefined";
}

function readStoredItems() {
  if (!canUseStorage()) {
    return sortUseCases(initialUseCases);
  }

  const raw = window.localStorage.getItem(USE_CASE_STORAGE_KEY);

  if (!raw) {
    return sortUseCases(initialUseCases);
  }

  try {
    const parsed = JSON.parse(raw) as Array<Partial<UseCaseEntry>>;

    if (!Array.isArray(parsed)) {
      return sortUseCases(initialUseCases);
    }

    return sortUseCases(
      parsed.map((item) => ({
        authorName: item.authorName ?? "",
        authorRole: item.authorRole ?? "",
        bodyMarkdown: item.bodyMarkdown ?? "",
        categorySlug: "use-cases",
        dateIso: item.dateIso ?? "",
        id: item.id ?? "",
        imageSrc: item.imageSrc ?? "",
        status: item.status ?? "draft",
        title: item.title ?? "",
      })),
    );
  } catch {
    return sortUseCases(initialUseCases);
  }
}

function emitChange() {
  if (!canUseStorage()) return;
  window.dispatchEvent(new Event(USE_CASE_STORE_EVENT));
}

export function getUseCasesSnapshot() {
  return readStoredItems();
}

export function persistUseCases(items: UseCaseEntry[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(USE_CASE_STORAGE_KEY, JSON.stringify(sortUseCases(items)));
  emitChange();
}

export function upsertUseCase(item: UseCaseEntry, currentId?: string) {
  const items = readStoredItems();
  const nextItems = items.filter((entry) => entry.id !== currentId && entry.id !== item.id);
  persistUseCases([item, ...nextItems]);
}

export function deleteUseCase(id: string) {
  const items = readStoredItems();
  persistUseCases(items.filter((item) => item.id !== id));
}

export function updateUseCaseStatus(id: string, status: UseCaseStatus) {
  const items = readStoredItems();
  persistUseCases(
    items.map((item) => (item.id === id ? { ...item, status } : item)),
  );
}

export function useUseCases() {
  const [items, setItems] = useState<UseCaseEntry[]>(() => sortUseCases(initialUseCases));

  useEffect(() => {
    const sync = () => {
      setItems(readStoredItems());
    };

    sync();

    window.addEventListener(USE_CASE_STORE_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(USE_CASE_STORE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return items;
}
