import type { ManagedContentEntry } from "./data";
import type { Locale } from "@/constants/i18n";
import { acpLabNoteTopics } from "@/copy/acpLabNotes";

type LabNoteEntry = Pick<ManagedContentEntry, "categorySlug" | "authorName" | "authorRole" | "sortOrder">;
export type LabNote = { episode: number; topics: string[] };

// ACP notes store topics in authorName; sortOrder retains the episode number.
export function getLabNote(item: LabNoteEntry): LabNote | undefined {
  if (item.categorySlug !== "acp-lab-notes") return undefined;
  return {
    episode: item.sortOrder,
    topics: item.authorName.split(/[·,|]/).map((topic) => topic.trim()).filter(Boolean),
  };
}

export function sortLabNotes<T extends LabNoteEntry>(items: T[]): T[] {
  return [...items].sort((a, b) => (getLabNote(a)?.episode ?? a.sortOrder) - (getLabNote(b)?.episode ?? b.sortOrder));
}

export function getLocalizedLabNote(item: LabNoteEntry, locale: Locale): LabNote | undefined {
  const note = getLabNote(item);
  return note ? { ...note, topics: note.topics.map((topic) => acpLabNoteTopics[topic]?.[locale] ?? topic) } : undefined;
}

export function getLabNoteWriterLabel(item: LabNoteEntry, locale: Locale) {
  const note = getLocalizedLabNote(item, locale);
  if (!note) return "";
  return note.topics.join(" · ");
}
