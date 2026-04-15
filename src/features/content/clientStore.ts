"use client";

import { useEffect, useRef, useState } from "react";
import {
  type ManagedContentCategorySlug,
  type ManagedContentEntry,
  type ManagedContentSection,
  type ManagedContentStatus,
} from "./data";

export const MANAGED_CONTENT_STORE_EVENT = "querypie:managed-content:changed";

type ManagedContentChangeDetail = {
  section?: ManagedContentSection;
  shouldRefetch?: boolean;
};

type ManagedContentView = "full" | "list";
type SaveOptions = {
  preserveExistingBodies?: boolean;
};

const snapshotCache = new Map<string, ManagedContentEntry[]>();

function getCacheKey(section?: ManagedContentSection) {
  return section ?? "__all__";
}

function getScopedCacheKey(
  section?: ManagedContentSection,
  categorySlug?: ManagedContentCategorySlug | "all",
  view: ManagedContentView = "full",
) {
  return `${getCacheKey(section)}::${categorySlug ?? "__all__"}::${view}`;
}

function writeSnapshotCache(
  items: ManagedContentEntry[],
  section?: ManagedContentSection,
  categorySlug?: ManagedContentCategorySlug | "all",
  view: ManagedContentView = "full",
) {
  snapshotCache.set(getScopedCacheKey(section, categorySlug, view), items);

  if (section) {
    const sectionAllKey = getScopedCacheKey(section, "all", view);
    const sectionAllItems = snapshotCache.get(sectionAllKey);

    if (sectionAllItems) {
      snapshotCache.set(
        sectionAllKey,
        categorySlug && categorySlug !== "all"
          ? [
              ...sectionAllItems.filter((item) => item.categorySlug !== categorySlug),
              ...items,
            ]
          : items,
      );
    }

    const allItems = snapshotCache.get(getScopedCacheKey(undefined, "all", view));

    if (allItems) {
      snapshotCache.set(
        getScopedCacheKey(undefined, "all", view),
        [...allItems.filter((item) => item.section !== section), ...(snapshotCache.get(sectionAllKey) ?? items)],
      );
    }
  }
}

function readSnapshotCache(
  section?: ManagedContentSection,
  categorySlug?: ManagedContentCategorySlug | "all",
  view: ManagedContentView = "full",
) {
  return snapshotCache.get(getScopedCacheKey(section, categorySlug, view));
}

function emitChange(detail?: ManagedContentChangeDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ManagedContentChangeDetail>(MANAGED_CONTENT_STORE_EVENT, { detail }));
}

async function readState(
  section?: ManagedContentSection,
  categorySlug?: ManagedContentCategorySlug | "all",
  view: ManagedContentView = "full",
) {
  const params = new URLSearchParams();

  if (section) {
    params.set("section", section);
  }

  if (categorySlug && categorySlug !== "all") {
    params.set("categorySlug", categorySlug);
  }

  if (view === "list") {
    params.set("view", "list");
  }

  const search = params.size ? `?${params.toString()}` : "";
  const response = await fetch(`/api/admin/content/state${search}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to read content state.");
  }

  const payload = (await response.json()) as { items?: ManagedContentEntry[] };
  const items = payload.items ?? [];
  writeSnapshotCache(items, section, categorySlug, view);
  return items;
}

export async function getManagedContentsSnapshot(
  section?: ManagedContentSection,
  categorySlug?: ManagedContentCategorySlug | "all",
  view: ManagedContentView = "full",
) {
  return readState(section, categorySlug, view);
}

export async function getManagedContentDetail(
  section: ManagedContentSection,
  id: string,
) {
  const params = new URLSearchParams({
    id,
    section,
  });
  const response = await fetch(`/api/admin/content/state?${params.toString()}`, {
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => ({}))) as {
    error?: string;
    item?: ManagedContentEntry | null;
  };

  if (!response.ok) {
    throw new Error(payload.error ?? "Failed to read content detail.");
  }

  return payload.item ?? null;
}

export async function persistManagedContents(items: ManagedContentEntry[], options?: SaveOptions) {
  const response = await fetch("/api/admin/content/state", {
    body: JSON.stringify({ items, preserveExistingBodies: options?.preserveExistingBodies }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const payload = (await response.json().catch(() => ({}))) as { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Failed to persist content state.");
  }

  emitChange({ shouldRefetch: true });
}

export async function upsertManagedContent(
  item: ManagedContentEntry,
  currentId?: string,
  options?: SaveOptions,
) {
  const response = await fetch("/api/admin/content/state", {
    body: JSON.stringify({
      currentId,
      item,
      preserveExistingBodies: options?.preserveExistingBodies,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
  });

  const payload = (await response.json()) as { error?: string; item?: ManagedContentEntry };

  if (!response.ok || !payload.item) {
    throw new Error(payload.error ?? "Failed to save content.");
  }

  emitChange({ section: payload.item.section, shouldRefetch: true });
  return payload.item;
}

export async function deleteManagedContent(id: string, item?: ManagedContentEntry) {
  const response = await fetch("/api/admin/content/state", {
    body: JSON.stringify({ id, item }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
  });

  const payload = (await response.json()) as { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Failed to delete content.");
  }

  emitChange({ section: item?.section, shouldRefetch: true });
}

export async function updateManagedContentStatus(
  id: string,
  status: ManagedContentStatus,
  item?: ManagedContentEntry,
) {
  const response = await fetch("/api/admin/content/state", {
    body: JSON.stringify({ id, item, status }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });

  const payload = (await response.json()) as { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Failed to update content status.");
  }

  emitChange({ section: item?.section, shouldRefetch: true });
}

export async function reorderManagedContents(orderedItems: ManagedContentEntry[]) {
  const currentItems = await readState();
  const firstItem = orderedItems[0];

  if (!firstItem) {
    return;
  }

  const normalizedItems = orderedItems.map((item, index) => ({
    ...item,
    sortOrder: index + 1,
  }));

  const otherItems = currentItems.filter(
    (item) =>
      !(
        item.section === firstItem.section &&
        item.categorySlug === firstItem.categorySlug
      ),
  );

  await persistManagedContents([...normalizedItems, ...otherItems], {
    preserveExistingBodies: true,
  });
}

export function useManagedContents(
  section?: ManagedContentSection,
  initialItems?: ManagedContentEntry[],
  categorySlug?: ManagedContentCategorySlug | "all",
  view: ManagedContentView = "full",
) {
  const initialItemsRef = useRef(initialItems);
  const hasBootstrappedDataRef = useRef(Boolean(readSnapshotCache(section, categorySlug, view) ?? initialItemsRef.current?.length));
  const [items, setItems] = useState<ManagedContentEntry[]>(() =>
    readSnapshotCache(section, categorySlug, view) ?? initialItemsRef.current ?? [],
  );

  useEffect(() => {
    initialItemsRef.current = initialItems;

    if (initialItems !== undefined) {
      writeSnapshotCache(initialItems, section, categorySlug, view);
      setItems(initialItems);
    }
  }, [categorySlug, initialItems, section, view]);

  useEffect(() => {
    let active = true;

    const sync = () => {
      void getManagedContentsSnapshot(section, categorySlug, view)
        .then((nextItems) => {
          if (!active) return;
          setItems(nextItems);
        })
        .catch(() => {
          if (!active) return;
          setItems(initialItemsRef.current ?? []);
        });
    };

    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<ManagedContentChangeDetail>).detail;
      const matchesSection = !detail?.section || detail.section === section;

      if (!matchesSection) {
        return;
      }

      if (detail?.shouldRefetch === false) {
        const cached = readSnapshotCache(section, categorySlug, view);

        if (cached && active) {
          setItems(cached);
        }

        return;
      }

      sync();
    };

    if (!hasBootstrappedDataRef.current) {
      sync();
    } else {
      hasBootstrappedDataRef.current = false;
    }

    window.addEventListener(MANAGED_CONTENT_STORE_EVENT, handleChange as EventListener);

    return () => {
      active = false;
      window.removeEventListener(MANAGED_CONTENT_STORE_EVENT, handleChange as EventListener);
    };
  }, [categorySlug, section, view]);

  return items;
}

export function useManagedContentsLoading(
  section?: ManagedContentSection,
  initialItems?: ManagedContentEntry[],
  categorySlug?: ManagedContentCategorySlug | "all",
  view: ManagedContentView = "full",
) {
  const initialItemsRef = useRef(initialItems);
  const hasBootstrappedDataRef = useRef(Boolean(readSnapshotCache(section, categorySlug, view) ?? initialItemsRef.current?.length));
  const [isLoading, setIsLoading] = useState(() => !hasBootstrappedDataRef.current);

  useEffect(() => {
    initialItemsRef.current = initialItems;

    if (initialItems !== undefined) {
      writeSnapshotCache(initialItems, section, categorySlug, view);
      setIsLoading(false);
    }
  }, [categorySlug, initialItems, section, view]);

  useEffect(() => {
    let active = true;

    const sync = () => {
      if (!active) return;
      setIsLoading(true);

      void getManagedContentsSnapshot(section, categorySlug, view)
        .catch(() => {
          // Loading state should still resolve even if sync falls back to cached/initial data elsewhere.
        })
        .finally(() => {
          if (!active) return;
          setIsLoading(false);
        });
    };

    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<ManagedContentChangeDetail>).detail;
      const matchesSection = !detail?.section || detail.section === section;

      if (!matchesSection || detail?.shouldRefetch === false) {
        return;
      }

      sync();
    };

    if (!hasBootstrappedDataRef.current) {
      sync();
    } else {
      hasBootstrappedDataRef.current = false;
    }

    window.addEventListener(MANAGED_CONTENT_STORE_EVENT, handleChange as EventListener);

    return () => {
      active = false;
      window.removeEventListener(MANAGED_CONTENT_STORE_EVENT, handleChange as EventListener);
    };
  }, [categorySlug, section, view]);

  return isLoading;
}
