import { getLocalePath, type Locale } from "@/constants/i18n";

export type PlatformEntry = {
  id: "aip" | "acp" | "usage-based-llm" | "mcp-gateway" | "fde-services" | "aip-integrations" | "acp-integrations";
  locales?: Locale[];
  slug: string[];
};

export const platformEntries: PlatformEntry[] = [
  { id: "aip", slug: ["aip"] },
  { id: "usage-based-llm", slug: ["aip", "usage-based-llm"] },
  { id: "mcp-gateway", slug: ["aip", "mcp-gateway"] },
  { id: "fde-services", slug: ["aip", "fde-services"] },
  { id: "aip-integrations", slug: ["aip", "integrations"] },
  { id: "acp", slug: ["acp"] },
  { id: "acp-integrations", slug: ["acp", "integrations"] },
];

export function getPlatformEntryById(id: PlatformEntry["id"]): PlatformEntry | null {
  return platformEntries.find((entry) => entry.id === id) ?? null;
}

export function getPlatformEntryBySlug(slug: string[]): PlatformEntry | null {
  const joined = slug.join("/");
  return platformEntries.find((entry) => entry.slug.join("/") === joined) ?? null;
}

export function getPlatformHref(locale: Locale, id: PlatformEntry["id"]): string {
  const entry = getPlatformEntryById(id);
  if (!entry) {
    throw new Error(`Unknown platform id: ${id}`);
  }

  return getLocalePath(locale, `/platforms/${entry.slug.join("/")}`);
}
