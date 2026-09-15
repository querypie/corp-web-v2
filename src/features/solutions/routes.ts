import { getLocalePath, type Locale } from "@/constants/i18n";

export type SolutionEntry = {
  id: "ai-crew" | "ai-dashi" | "as400-cobol";
  locales?: Locale[];
  slug: string[];
};

export const solutionEntries: SolutionEntry[] = [
  { id: "ai-crew", slug: ["ai-crew"] },
  { id: "ai-dashi", slug: ["ai-dashi"] },
  { id: "as400-cobol", slug: ["as400-cobol"], locales: ["ja"] },
];

export function getSolutionEntryById(id: SolutionEntry["id"]): SolutionEntry | null {
  return solutionEntries.find((entry) => entry.id === id) ?? null;
}

export function getSolutionEntryBySlug(slug: string[]): SolutionEntry | null {
  const joined = slug.join("/");
  return solutionEntries.find((entry) => entry.slug.join("/") === joined) ?? null;
}

export function getSolutionHref(locale: Locale, id: SolutionEntry["id"]): string {
  const entry = getSolutionEntryById(id);
  if (!entry) {
    throw new Error(`Unknown solution id: ${id}`);
  }

  return getLocalePath(locale, `/solutions/${entry.slug.join("/")}`);
}
