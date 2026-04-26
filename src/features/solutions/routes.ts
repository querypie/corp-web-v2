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

const placeholderPathMap = {
  "/aip-not-found": "/solutions/aip",
  "/acp-not-found": "/solutions/acp",
  "/fdes-not-found": "/solutions/aip/fde-services",
} as const;

const acpAliasSlugMap = {
  "database-access-controller": "database-access-controller",
  "system-access-controller": "system-access-controller",
  "kubernetes-access-controller": "kubernetes-access-controller",
  "web-access-controller": "web-access-controller",
  "web-application-access-controller": "web-access-controller",
} as const;

function normalizePathname(pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return normalized.replace(/\/+$/, "") || "/";
}

export function getSolutionEntryBySlug(slug: string[]): SolutionEntry | null {
  const joined = slug.join("/");
  return solutionEntries.find((entry) => entry.slug.join("/") === joined) ?? null;
}

export function getSolutionHref(locale: Locale, id: SolutionEntry["id"]): string {
  const entry = solutionEntries.find((item) => item.id === id);
  if (!entry) {
    throw new Error(`Unknown solution id: ${id}`);
  }

  return getLocalePath(locale, `/solutions/${entry.slug.join("/")}`);
}

export function resolveLegacyPlaceholderPath(pathname: string): string | null {
  const normalized = normalizePathname(pathname);
  return placeholderPathMap[normalized as keyof typeof placeholderPathMap] ?? null;
}

export function resolveLegacySolutionAlias(pathname: string): string | null {
  const normalized = normalizePathname(pathname);

  if (normalized === "/platform/ai/aip" || normalized.startsWith("/platform/ai/aip/")) {
    return normalized.replace(/^\/platform\/ai\/aip/, "/solutions/aip");
  }

  if (normalized === "/resources/integrations" || normalized === "/resources/discover/integrations") {
    return "/solutions/acp/integrations";
  }

  const acpAliasMatch = normalized.match(
    /^\/(?:products|platform\/security|resources\/manage)\/(database-access-controller|system-access-controller|kubernetes-access-controller|web-access-controller|web-application-access-controller)$/,
  );
  if (acpAliasMatch?.[1]) {
    const targetSlug = acpAliasSlugMap[acpAliasMatch[1] as keyof typeof acpAliasSlugMap];
    return `/solutions/acp/${targetSlug}`;
  }

  return null;
}
