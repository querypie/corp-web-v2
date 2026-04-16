import "server-only";

import {
  sortManagedContents,
  type ManagedContentCategorySlug,
  type ManagedContentEntry,
  type ManagedContentSection,
} from "./data";
import { getAuthoredCacheVersion, readAuthoredManagedContents } from "./authored.server";

const authoredStateCache = new Map<string, ManagedContentEntry[]>();

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

async function readAllContentStateWithOptions(options?: { includeBodies?: boolean }) {
  const includeBodies = options?.includeBodies ?? true;
  const cacheKey = `${includeBodies ? "full" : "list"}::${getAuthoredCacheVersion()}`;
  const cachedItems = authoredStateCache.get(cacheKey);

  if (cachedItems) {
    return cachedItems;
  }

  const items = sortManagedContents(
    dedupeManagedEntries(
      filterManagedEntries(
        await readAuthoredManagedContents({ includeBodies }),
      ),
    ),
  );

  authoredStateCache.set(cacheKey, items);
  return items;
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
