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
  showLoading?: boolean;
  shouldRefetch?: boolean;
};

type ManagedContentView = "full" | "list";
type SaveOptions = {
  preserveExistingBodies?: boolean;
};

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
  return payload.items ?? [];
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

  emitChange({ section: item?.section, shouldRefetch: true, showLoading: false });
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
  options?: { liveSync?: boolean },
) {
  const liveSync = options?.liveSync ?? true;
  const initialItemsRef = useRef(initialItems);
  const [items, setItems] = useState<ManagedContentEntry[]>(() => initialItemsRef.current ?? []);

  useEffect(() => {
    initialItemsRef.current = initialItems;

    if (initialItems !== undefined) {
      setItems(initialItems);
    }
  }, [categorySlug, initialItems, section, view]);

  useEffect(() => {
    if (!liveSync) {
      return;
    }

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

      sync();
    };

    sync();

    window.addEventListener(MANAGED_CONTENT_STORE_EVENT, handleChange as EventListener);

    return () => {
      active = false;
      window.removeEventListener(MANAGED_CONTENT_STORE_EVENT, handleChange as EventListener);
    };
  }, [categorySlug, liveSync, section, view]);

  return items;
}

export function useManagedContentsLoading(
  section?: ManagedContentSection,
  initialItems?: ManagedContentEntry[],
  categorySlug?: ManagedContentCategorySlug | "all",
  view: ManagedContentView = "full",
) {
  const initialItemsRef = useRef(initialItems);
  const [isLoading, setIsLoading] = useState(() => !initialItemsRef.current?.length);

  useEffect(() => {
    initialItemsRef.current = initialItems;

    if (initialItems !== undefined) {
      setIsLoading(false);
    }
  }, [categorySlug, initialItems, section, view]);

  useEffect(() => {
    let active = true;
    const shouldLoadOnMount = !initialItemsRef.current?.length;

    const sync = (showLoading = true) => {
      if (!active) return;
      if (showLoading) {
        setIsLoading(true);
      }

      void getManagedContentsSnapshot(section, categorySlug, view)
        .catch(() => {
          // Loading state should still resolve even if sync falls back to cached/initial data elsewhere.
        })
        .finally(() => {
          if (!showLoading || !active) return;
          setIsLoading(false);
        });
    };

    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<ManagedContentChangeDetail>).detail;
      const matchesSection = !detail?.section || detail.section === section;

      if (!matchesSection || detail?.shouldRefetch === false) {
        return;
      }

      sync(detail?.showLoading ?? true);
    };

    sync(shouldLoadOnMount);

    window.addEventListener(MANAGED_CONTENT_STORE_EVENT, handleChange as EventListener);

    return () => {
      active = false;
      window.removeEventListener(MANAGED_CONTENT_STORE_EVENT, handleChange as EventListener);
    };
  }, [categorySlug, section, view]);

  return isLoading;
}
