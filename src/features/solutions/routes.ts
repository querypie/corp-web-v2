import { getLocalePath, type Locale } from "@/constants/i18n";

export type SolutionEntry = {
  id:
    | "aip"
    | "aip-usage-based-llm"
    | "aip-mcp-gateway"
    | "aip-fde-services"
    | "aip-integrations"
    | "acp"
    | "acp-database-access-controller"
    | "acp-system-access-controller"
    | "acp-kubernetes-access-controller"
    | "acp-web-access-controller"
    | "acp-integrations";
  slug: string[];
};

export const solutionEntries: SolutionEntry[] = [
  { id: "aip", slug: ["aip"] },
  { id: "aip-usage-based-llm", slug: ["aip", "usage-based-llm"] },
  { id: "aip-mcp-gateway", slug: ["aip", "mcp-gateway"] },
  { id: "aip-fde-services", slug: ["aip", "fde-services"] },
  { id: "aip-integrations", slug: ["aip", "integrations"] },
  { id: "acp", slug: ["acp"] },
  { id: "acp-database-access-controller", slug: ["acp", "database-access-controller"] },
  { id: "acp-system-access-controller", slug: ["acp", "system-access-controller"] },
  { id: "acp-kubernetes-access-controller", slug: ["acp", "kubernetes-access-controller"] },
  { id: "acp-web-access-controller", slug: ["acp", "web-access-controller"] },
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
