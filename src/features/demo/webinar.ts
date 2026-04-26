import { getLocalePath, type Locale } from "@/constants/i18n";

export type WebinarDemoEntry = {
  id: string;
  slug: string;
  contentId: string;
};

export const webinarDemoEntries: readonly WebinarDemoEntry[] = [
  { id: "1", slug: "cloud-certification-shortest-path", contentId: "cloud-certification-shortest-path" },
  { id: "2", slug: "okta-paloalto-querypie-webinar", contentId: "okta-paloalto-querypie-webinar" },
  { id: "3", slug: "device-security-mdm-kandji", contentId: "device-security-mdm-kandji" },
  { id: "4", slug: "flex-querypie-secrets", contentId: "flex-querypie-secrets" },
  { id: "5", slug: "ztna-security-prisma-access", contentId: "ztna-security-prisma-access" },
  { id: "6", slug: "querypie-side-kick-teaser-ko", contentId: "querypie-side-kick-teaser-ko" },
  { id: "7", slug: "querypie-integrations-scim-slack-vault-ko", contentId: "querypie-integrations-scim-slack-vault-ko" },
  { id: "8", slug: "querypie-integrations-scim-slack-vault-ja", contentId: "querypie-integrations-scim-slack-vault-ja" },
  { id: "9", slug: "querypie-databases-nosql-ledger-ko", contentId: "querypie-databases-nosql-ledger-ko" },
  { id: "10", slug: "querypie-databases-nosql-ledger-ja", contentId: "querypie-databases-nosql-ledger-ja" },
  { id: "11", slug: "querypie-server-management-ko", contentId: "querypie-server-management-ko" },
  { id: "12", slug: "querypie-server-management-ja", contentId: "querypie-server-management-ja" },
  { id: "13", slug: "querypie-kubernetes-management-ko", contentId: "querypie-kubernetes-management-ko" },
  { id: "14", slug: "querypie-kubernetes-management-ja", contentId: "querypie-kubernetes-management-ja" },
  { id: "15", slug: "querypie-japan-webinar-security", contentId: "querypie-japan-webinar-security" },
  { id: "16", slug: "air-company-querypie-zerotrust-webinar", contentId: "air-company-querypie-zerotrust-webinar" },
  { id: "17", slug: "findy-querypie-mcp-webinar", contentId: "findy-querypie-mcp-webinar" },
  { id: "18", slug: "air-company-querypie-mcp-webinar", contentId: "air-company-querypie-mcp-webinar" },
  { id: "19", slug: "air-company-querypie-mcp-webinar", contentId: "air-company-querypie-mcp-webinar" },
  { id: "20", slug: "air-company-querypie-mcp-webinar", contentId: "air-company-querypie-mcp-webinar" },
  { id: "21", slug: "air-company-querypie-ai-webinar", contentId: "air-company-querypie-ai-webinar" },
  { id: "22", slug: "air-company-querypie-mcp-webinar", contentId: "air-company-querypie-mcp-webinar" },
  { id: "23", slug: "air-company-querypie-ai-webinar", contentId: "air-company-querypie-ai-webinar" },
  { id: "24", slug: "air-company-querypie-ai-webinar", contentId: "air-company-querypie-ai-webinar" },
  { id: "25", slug: "air-company-querypie-ai-usecase-webinar", contentId: "air-company-querypie-ai-usecase-webinar" },
  { id: "26", slug: "air-company-querypie-ai-usecase-webinar", contentId: "air-company-querypie-ai-usecase-webinar" },
] as const;

const webinarDemoEntryById = new Map(webinarDemoEntries.map((entry) => [entry.id, entry]));
const webinarDemoEntryByContentId = new Map(webinarDemoEntries.map((entry) => [entry.contentId, entry]));

export function getWebinarDemoEntry(id: string) {
  return webinarDemoEntryById.get(id) ?? null;
}

export function getWebinarDemoEntryByContentId(contentId: string) {
  return webinarDemoEntryByContentId.get(contentId) ?? null;
}

export function getWebinarDemoHref(locale: Locale, id: string) {
  const entry = getWebinarDemoEntry(id);
  const canonicalEntry = entry ? getWebinarDemoEntryByContentId(entry.contentId) : null;
  return canonicalEntry ? getLocalePath(locale, `/demo/webinar/${canonicalEntry.id}/${canonicalEntry.slug}`) : null;
}

export function getWebinarDemoHrefByContentId(locale: Locale, contentId: string) {
  const entry = getWebinarDemoEntryByContentId(contentId);
  return entry ? getLocalePath(locale, `/demo/webinar/${entry.id}/${entry.slug}`) : null;
}

export function resolveWebinarDemoRoute(locale: Locale, id: string, rest?: string[]) {
  const entry = getWebinarDemoEntry(id);

  if (!entry) {
    return {
      canonicalHref: null,
      entry: null,
      shouldRedirect: false,
    };
  }

  const canonicalEntry = getWebinarDemoEntryByContentId(entry.contentId);

  if (!canonicalEntry) {
    return {
      canonicalHref: null,
      entry: null,
      shouldRedirect: false,
    };
  }

  const canonicalHref = getLocalePath(locale, `/demo/webinar/${canonicalEntry.id}/${canonicalEntry.slug}`);
  const slug = rest?.[0];
  const shouldRedirect =
    id !== canonicalEntry.id || !rest?.length || rest.length !== 1 || slug !== canonicalEntry.slug;

  return {
    canonicalHref,
    entry: canonicalEntry,
    shouldRedirect,
  };
}
