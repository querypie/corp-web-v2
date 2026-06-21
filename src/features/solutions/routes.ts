import { getLocalePath, type Locale } from "@/constants/i18n";

export type SolutionEntry = {
  id:
    | "aip"
    | "acp"
    | "usage-based-llm"
    | "mcp-gateway"
    | "fde-services"
    | "acp-integrations";
  slug: string[];
};

export const solutionEntries: SolutionEntry[] = [
  { id: "aip", slug: ["aip"] },
  { id: "usage-based-llm", slug: ["aip", "usage-based-llm"] },
  { id: "mcp-gateway", slug: ["aip", "mcp-gateway"] },
  { id: "fde-services", slug: ["aip", "fde-services"] },
  { id: "acp", slug: ["acp"] },
  { id: "acp-integrations", slug: ["acp", "integrations"] },
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
