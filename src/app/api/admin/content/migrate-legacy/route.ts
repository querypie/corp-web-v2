import { NextResponse } from "next/server";
import { cloneAsAuthoredContent } from "@/features/content/cloneToAuthored";
import { saveAuthoredContent } from "@/features/content/authored.server";
import { readContentState, replaceContentState } from "@/features/content/contentState.server";
import type { ManagedContentEntry } from "@/features/content/data";

function hasExistingTiptapClone(source: ManagedContentEntry, items: ManagedContentEntry[]) {
  return items.some((item) =>
    item.id !== source.id &&
    item.section === source.section &&
    item.categorySlug === source.categorySlug &&
    item.contentType === source.contentType &&
    item.contentFormat === "tiptap" &&
    item.status === "hidden" &&
    item.dateIso === source.dateIso &&
    item.title.en === source.title.en &&
    item.title.ko === source.title.ko &&
    item.title.ja === source.title.ja,
  );
}

export async function POST() {
  const currentItems = await readContentState();
  const workingItems = [...currentItems];
  const createdItems: ManagedContentEntry[] = [];

  const legacyItems = currentItems.filter((item) =>
    (item.section === "demo" || item.section === "documentation") &&
    item.contentType === "content" &&
    item.contentFormat === "markdown",
  );

  for (const item of legacyItems) {
    if (hasExistingTiptapClone(item, workingItems)) {
      continue;
    }

    const siblingItems = workingItems.filter((entry) =>
      entry.section === item.section && entry.categorySlug === item.categorySlug,
    );

    const duplicatedItem = cloneAsAuthoredContent(item, siblingItems, { slugSuffix: "-tiptap" });
    const savedItem = await saveAuthoredContent(duplicatedItem);

    createdItems.push(savedItem);
    workingItems.unshift(savedItem);
  }

  if (createdItems.length > 0) {
    await replaceContentState([...createdItems, ...currentItems]);
  }

  return NextResponse.json({
    created: createdItems.length,
    skipped: legacyItems.length - createdItems.length,
    totalLegacy: legacyItems.length,
  });
}
