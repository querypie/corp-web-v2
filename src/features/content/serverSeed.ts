import "server-only";

import type { ManagedContentSection } from "./data";
import { sortManagedContents } from "./data";
import { readAuthoredManagedContents } from "./authored.server";

export async function readServerManagedContents(section?: ManagedContentSection) {
  const authored = await readAuthoredManagedContents();
  const allItems = sortManagedContents(authored);

  return section ? allItems.filter((item) => item.section === section) : allItems;
}
