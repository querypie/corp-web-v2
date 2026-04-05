import { convertMarkdownToTiptap } from "./markdownToTiptap";
import {
  createLocalizedContent,
  ensureUniqueSlug,
  getLocalizedContent,
  slugifyTitle,
  type ManagedContentEntry,
} from "./data";

function createEmptyTiptapJson() {
  return JSON.stringify({
    content: [{ type: "paragraph" }],
    type: "doc",
  });
}

export function cloneAsAuthoredContent(
  item: ManagedContentEntry,
  siblingItems: ManagedContentEntry[],
  options?: {
    slugSuffix?: string;
  },
): ManagedContentEntry {
  const nextId = ensureUniqueSlug(
    `${slugifyTitle(getLocalizedContent(item.title, "en"))}${options?.slugSuffix ?? "-copy"}`,
    siblingItems,
  );

  if (item.contentFormat === "tiptap") {
    return {
      ...item,
      id: nextId,
      sortOrder: item.sortOrder,
      status: "hidden",
      storageId: undefined,
    };
  }

  const bodyHtml = createLocalizedContent("<p></p>");
  const bodyRichText = createLocalizedContent(createEmptyTiptapJson());

  (["en", "ko", "ja"] as const).forEach((locale) => {
    const sourceMarkdown = item.bodyMarkdown[locale] ?? "";

    if (!sourceMarkdown.trim()) {
      return;
    }

    const converted = convertMarkdownToTiptap(sourceMarkdown);
    bodyHtml[locale] = converted.html;
    bodyRichText[locale] = converted.json;
  });

  return {
    ...item,
    bodyHtml,
    bodyMarkdown: createLocalizedContent(),
    bodyRichText,
    contentFormat: "tiptap",
    id: nextId,
    sortOrder: item.sortOrder,
    status: "hidden",
    storageId: undefined,
  };
}
