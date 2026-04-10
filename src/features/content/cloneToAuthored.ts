import {
  ensureUniqueSlug,
  type ManagedContentEntry,
} from "./data";

export function cloneAsAuthoredContent(
  item: ManagedContentEntry,
  siblingItems: ManagedContentEntry[],
  options?: {
    slugSuffix?: string;
  },
): ManagedContentEntry {
  const nextId = ensureUniqueSlug(
    `${item.id}${options?.slugSuffix ?? ""}`,
    siblingItems,
  );

  return {
    ...item,
    contentFormat: item.contentType === "outlink" ? item.contentFormat : "tiptap",
    id: nextId,
    sortOrder: item.sortOrder,
    status: "hidden",
    storageId: undefined,
  };
}
