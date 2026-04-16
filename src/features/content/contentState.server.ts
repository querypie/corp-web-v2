import "server-only";

import { unstable_cache } from "next/cache";
import {
  sortManagedContents,
  type ManagedContentCategorySlug,
  type ManagedContentEntry,
  type ManagedContentSection,
} from "./data";
import { readAuthoredManagedContents } from "./authored.server";

export const CONTENT_STATE_CACHE_TAG = "managed-content-state";

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

const readCachedAllContentState = unstable_cache(
  async () =>
    sortManagedContents(
      dedupeManagedEntries(
        filterManagedEntries(
          await readAuthoredManagedContents({ includeBodies: false }),
        ),
      ),
    ),
  ["managed-content-state-list"],
  { tags: [CONTENT_STATE_CACHE_TAG] },
);

async function readAllContentStateWithOptions(options?: { includeBodies?: boolean }) {
  const includeBodies = options?.includeBodies ?? true;

  if (!includeBodies) {
    return readCachedAllContentState();
  }

  return sortManagedContents(
    dedupeManagedEntries(
      filterManagedEntries(
        await readAuthoredManagedContents({ includeBodies: true }),
      ),
    ),
  );
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
  options?: { categorySlug?: ManagedContentCategorySlug; includeBodies?: boolean },
) {
  const items = await readContentState(section, options);
  return items.find((item) => item.id === id) ?? null;
}
