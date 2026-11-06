import type { Locale } from "./i18n";

type OfferingEntry = { path: string; locales?: readonly Locale[]; legacyPaths: readonly string[]; sitemap?: boolean };

/** Stable page identities. Navigation groups and component folders do not define URLs. */
export const offerings = {
  aip: { path: "/aip", legacyPaths: ["/platforms/aip", "/solutions/aip"] },
  acp: { path: "/acp", legacyPaths: ["/platforms/acp", "/solutions/acp"] },
  "ai-gateway": { path: "/ai-gateway", legacyPaths: ["/solutions/ai-gateway"] },
  "usage-based-llm": { path: "/aip/usage-based-llm", legacyPaths: ["/platforms/aip/usage-based-llm", "/solutions/aip/usage-based-llm"] },
  "mcp-gateway": { path: "/aip/mcp-gateway", legacyPaths: ["/platforms/aip/mcp-gateway", "/solutions/aip/mcp-gateway"] },
  "aip-integrations": { path: "/aip/integrations", legacyPaths: ["/platforms/aip/integrations", "/solutions/aip/integrations"] },
  "acp-integrations": { path: "/acp/integrations", legacyPaths: ["/platforms/acp/integrations", "/solutions/acp/integrations"] },
  "fde-services": { path: "/fde-services", legacyPaths: ["/platforms/aip/fde-services", "/solutions/aip/fde-services"] },
  "penetration-testing": { path: "/penetration-testing", legacyPaths: ["/solutions/penetration-testing"] },
  "ai-crew": { path: "/ai-crew", legacyPaths: ["/solutions/ai-crew"] },
  "ai-dashi": { path: "/ai-dashi", legacyPaths: ["/solutions/ai-dashi"] },
  "local-llm": { path: "/local-llm", locales: ["ja"], legacyPaths: ["/solutions/local-llm"] },
  "as400-cobol": { path: "/as400-cobol", locales: ["ja"], legacyPaths: ["/solutions/as400-cobol"] },
  dlp: { path: "/dlp", locales: ["en", "ko"], legacyPaths: ["/platforms/dlp"] },
  "dlp-demo": { path: "/dlp/demo", locales: ["en", "ko"], legacyPaths: ["/platforms/dlp/demo"], sitemap: false },
  qlm: { path: "/qlm", legacyPaths: ["/solutions/qlm"], sitemap: false },
  qev: { path: "/qev", legacyPaths: ["/solutions/qev"], sitemap: false },
} as const satisfies Record<string, OfferingEntry>;

export type OfferingId = keyof typeof offerings;
export const offeringEntries = Object.entries(offerings).map(([id, entry]) => ({ id: id as OfferingId, ...entry } as OfferingEntry & { id: OfferingId }));
