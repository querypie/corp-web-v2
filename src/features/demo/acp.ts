import { getLocalePath, type Locale } from "@/constants/i18n";

export type AcpDemoEntry = {
  id: string;
  slug: string;
};

export const acpDemoEntries: readonly AcpDemoEntry[] = [
  { id: "1", slug: "integrating-querypie-with-redash" },
  { id: "2", slug: "integrating-querypie-with-metabase" },
  { id: "3", slug: "integrating-querypie-with-tableau" },
  { id: "4", slug: "connect-kubernetes-agent" },
  { id: "5", slug: "grant-roles-users" },
  { id: "6", slug: "register-kubernetes-protect" },
  { id: "7", slug: "review-audit-logs" },
  { id: "8", slug: "connect-servers-agent" },
  { id: "9", slug: "submit-role-access-workflow" },
  { id: "10", slug: "submit-server-access-workflow" },
  { id: "11", slug: "use-web-terminal" },
  { id: "12", slug: "grant-permissions-users-2" },
  { id: "13", slug: "grant-permissions-users" },
  { id: "14", slug: "register-servers" },
  { id: "15", slug: "review-audit-logs" },
  { id: "16", slug: "connect-database-querypie-agent" },
  { id: "17", slug: "submit-sql-export-workflow" },
  { id: "18", slug: "submit-sql-request-workflow" },
  { id: "19", slug: "submit-db-access-workflow" },
  { id: "20", slug: "apply-data-masking-policies" },
  { id: "21", slug: "apply-data-access-policies" },
  { id: "22", slug: "use-web-editor" },
  { id: "23", slug: "grant-permissions-users" },
  { id: "24", slug: "register-databases" },
  { id: "25", slug: "review-audit-logs" },
  { id: "26", slug: "integrate-sso-with-okta" },
] as const;

const acpDemoEntryById = new Map(acpDemoEntries.map((entry) => [entry.id, entry]));

export function getAcpDemoEntry(id: string) {
  return acpDemoEntryById.get(id) ?? null;
}

export function getAcpDemoMdxSlug(id: string) {
  const entry = getAcpDemoEntry(id);
  return entry ? `acp/${entry.id}` : null;
}

export function getAcpDemoHref(locale: Locale, id: string) {
  const entry = getAcpDemoEntry(id);
  return entry ? getLocalePath(locale, `/demo/acp/${entry.id}/${entry.slug}`) : null;
}

export function resolveAcpDemoRoute(locale: Locale, id: string, rest?: string[]) {
  const entry = getAcpDemoEntry(id);

  if (!entry) {
    return {
      canonicalHref: null,
      entry: null,
      shouldRedirect: false,
    };
  }

  const canonicalHref = getLocalePath(locale, `/demo/acp/${entry.id}/${entry.slug}`);
  const slug = rest?.[0];
  const shouldRedirect = !rest?.length || rest.length !== 1 || slug !== entry.slug;

  return {
    canonicalHref,
    entry,
    shouldRedirect,
  };
}
