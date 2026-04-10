"use client";

import { useEffect, useRef, useState } from "react";
import {
  getSeedManagedContents,
  type ManagedContentEntry,
  type ManagedContentSection,
  type ManagedContentStatus,
} from "./data";

export const MANAGED_CONTENT_STORE_EVENT = "querypie:managed-content:changed";
<<<<<<< HEAD

type ManagedContentChangeDetail = {
  section?: ManagedContentSection;
  shouldRefetch?: boolean;
};

const snapshotCache = new Map<string, ManagedContentEntry[]>();

function getCacheKey(section?: ManagedContentSection) {
  return section ?? "__all__";
}

function writeSnapshotCache(items: ManagedContentEntry[], section?: ManagedContentSection) {
  snapshotCache.set(getCacheKey(section), items);

  if (section) {
    const allItems = snapshotCache.get(getCacheKey());

    if (allItems) {
      snapshotCache.set(
        getCacheKey(),
        [...allItems.filter((item) => item.section !== section), ...items],
      );
    }
  }
}

function readSnapshotCache(section?: ManagedContentSection) {
  return snapshotCache.get(getCacheKey(section));
}

function emitChange(detail?: ManagedContentChangeDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ManagedContentChangeDetail>(MANAGED_CONTENT_STORE_EVENT, { detail }));
}

async function readState(section?: ManagedContentSection) {
  const search = section ? `?section=${section}` : "";
  const response = await fetch(`/api/admin/content/state${search}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to read content state.");
  }

  const payload = (await response.json()) as { items?: ManagedContentEntry[] };
  const items = payload.items ?? [];
  writeSnapshotCache(items, section);
  return items;
}

export async function getManagedContentsSnapshot(section?: ManagedContentSection) {
  return readState(section);
}

export async function persistManagedContents(items: ManagedContentEntry[]) {
  const response = await fetch("/api/admin/content/state", {
    body: JSON.stringify({ items }),
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

export async function upsertManagedContent(item: ManagedContentEntry, currentId?: string) {
  const response = await fetch("/api/admin/content/state", {
    body: JSON.stringify({ currentId, item }),
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
  const cacheSection = item?.section;
  const previousSectionSnapshot = cacheSection ? readSnapshotCache(cacheSection) : undefined;

  if (item && previousSectionSnapshot) {
    writeSnapshotCache(
      previousSectionSnapshot.map((entry) => (entry.id === id ? { ...entry, status } : entry)),
      cacheSection,
    );
    emitChange({ section: cacheSection, shouldRefetch: false });
  }

  const response = await fetch("/api/admin/content/state", {
    body: JSON.stringify({ id, item, status }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });

  const payload = (await response.json()) as { error?: string };

  if (!response.ok) {
    if (cacheSection && previousSectionSnapshot) {
      writeSnapshotCache(previousSectionSnapshot, cacheSection);
      emitChange({ section: cacheSection, shouldRefetch: false });
    }
    throw new Error(payload.error ?? "Failed to update content status.");
  }

  emitChange({ section: cacheSection, shouldRefetch: false });
}

=======

function emitChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(MANAGED_CONTENT_STORE_EVENT));
}

async function readState(section?: ManagedContentSection) {
  const search = section ? `?section=${section}` : "";
  const response = await fetch(`/api/admin/content/state${search}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to read content state.");
  }

  const payload = (await response.json()) as { items?: ManagedContentEntry[] };
  return payload.items ?? [];
}

export async function getManagedContentsSnapshot(section?: ManagedContentSection) {
  return readState(section);
}

export async function persistManagedContents(items: ManagedContentEntry[]) {
  const response = await fetch("/api/admin/content/state", {
    body: JSON.stringify({ items }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to persist content state.");
  }

  emitChange();
}

export async function upsertManagedContent(item: ManagedContentEntry, currentId?: string) {
  const response = await fetch("/api/admin/content/state", {
    body: JSON.stringify({ currentId, item }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
  });

  const payload = (await response.json()) as { error?: string; item?: ManagedContentEntry };

  if (!response.ok || !payload.item) {
    throw new Error(payload.error ?? "Failed to save content.");
  }

  emitChange();
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

  emitChange();
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

  emitChange();
}

>>>>>>> origin/main
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

  await persistManagedContents([...normalizedItems, ...otherItems]);
}

export function useManagedContents(
  section?: ManagedContentSection,
  initialItems?: ManagedContentEntry[],
) {
  const initialItemsRef = useRef(initialItems);
  const [items, setItems] = useState<ManagedContentEntry[]>(() =>
<<<<<<< HEAD
    readSnapshotCache(section) ??
      initialItemsRef.current ??
      (section ? getSeedManagedContents(section) : getSeedManagedContents()),
=======
    initialItemsRef.current ?? (section ? getSeedManagedContents(section) : getSeedManagedContents()),
>>>>>>> origin/main
  );

  useEffect(() => {
    let active = true;

    const sync = () => {
      void getManagedContentsSnapshot(section)
        .then((nextItems) => {
          if (!active) return;
          setItems(nextItems);
        })
        .catch(() => {
          if (!active) return;
          setItems(initialItemsRef.current ?? (section ? getSeedManagedContents(section) : getSeedManagedContents()));
        });
<<<<<<< HEAD
    };

    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<ManagedContentChangeDetail>).detail;
      const matchesSection = !detail?.section || detail.section === section;

      if (!matchesSection) {
        return;
      }

      if (detail?.shouldRefetch === false) {
        const cached = readSnapshotCache(section);

        if (cached && active) {
          setItems(cached);
        }

        return;
      }

      sync();
    };

    sync();
    window.addEventListener(MANAGED_CONTENT_STORE_EVENT, handleChange as EventListener);

    return () => {
      active = false;
      window.removeEventListener(MANAGED_CONTENT_STORE_EVENT, handleChange as EventListener);
=======
    };

    sync();
    window.addEventListener(MANAGED_CONTENT_STORE_EVENT, sync);

    return () => {
      active = false;
      window.removeEventListener(MANAGED_CONTENT_STORE_EVENT, sync);
>>>>>>> origin/main
    };
  }, [section]);

  return items;
}

export function useManagedContentsLoading(section?: ManagedContentSection) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const sync = () => {
      if (!active) return;
      setIsLoading(true);

      void getManagedContentsSnapshot(section)
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

    sync();
    window.addEventListener(MANAGED_CONTENT_STORE_EVENT, handleChange as EventListener);

    return () => {
      active = false;
      window.removeEventListener(MANAGED_CONTENT_STORE_EVENT, handleChange as EventListener);
    };
  }, [section]);

  return isLoading;
}
