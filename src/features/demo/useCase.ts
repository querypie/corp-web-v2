import { getLocalePath, type Locale } from "@/constants/i18n";

export type UseCaseDemoEntry = {
  id: string;
  slug: string;
  contentId: string;
};

export const useCaseDemoEntries: readonly UseCaseDemoEntry[] = [
  { id: "1", slug: "allganize-changsu-lee", contentId: "allganize-changsu-lee" },
  { id: "2", slug: "lovo-ai-tom-lee", contentId: "lovo-ai-tom-lee" },
  { id: "3", slug: "air-company-mori-takeshi", contentId: "air-company-mori-takeshi" },
  { id: "4", slug: "superb-ai-hyun-kim", contentId: "superb-ai-hyun-kim" },
  { id: "5", slug: "lg-uplus-daniel-ku", contentId: "lg-uplus-daniel-ku" },
  { id: "6", slug: "querypie-ai-agent-demo", contentId: "querypie-ai-agent-demo" },
  { id: "7", slug: "data-analytics-agent", contentId: "data-analytics-agent" },
  { id: "8", slug: "data-analytics-agent-2", contentId: "data-analytics-agent-2" },
  { id: "9", slug: "server-access-agent", contentId: "server-access-agent" },
  { id: "10", slug: "kubernetes-manager-agent", contentId: "kubernetes-manager-agent" },
  { id: "11", slug: "security-audit-agent", contentId: "security-audit-agent" },
  { id: "12", slug: "work-collaboration-agent", contentId: "work-collaboration-agent" },
  { id: "13", slug: "m365-ai-agent", contentId: "m365-ai-agent" },
  { id: "14", slug: "credit-check-ai-agent", contentId: "credit-check-ai-agent" },
  { id: "15", slug: "factory-iot-ai-agent", contentId: "factory-iot-ai-agent" },
  { id: "16", slug: "dev-insight-ai-agent", contentId: "dev-insight-ai-agent" },
  { id: "17", slug: "aircraft-maintenance-ai-agent", contentId: "aircraft-maintenance-ai-agent" },
  { id: "18", slug: "baggage-operations-ai-agent", contentId: "baggage-operations-ai-agent" },
  { id: "19", slug: "aircrew-scheduler-ai-agent", contentId: "aircrew-scheduler-ai-agent" },
  { id: "20", slug: "military-hr-ai-agent", contentId: "military-hr-ai-agent" },
  { id: "21", slug: "incident-mgmt-ai-agent", contentId: "incident-mgmt-ai-agent" },
  { id: "22", slug: "aws-log-analytics-agent", contentId: "aws-log-analytics-agent" },
  { id: "23", slug: "aws-inspector-ai-agent", contentId: "aws-inspector-ai-agent" },
  { id: "24", slug: "aws-solutions-architect-ai-agent", contentId: "aws-solutions-architect-ai-agent" },
  { id: "25", slug: "portfolio-insight-ai-agent", contentId: "portfolio-insight-ai-agent" },
  { id: "26", slug: "investment-analyst-ai-agent", contentId: "investment-analyst-ai-agent" },
  { id: "27", slug: "quotation-ai-agent", contentId: "quotation-ai-agent" },
  { id: "28", slug: "quotation-analyze-ai-agent", contentId: "quotation-analyze-ai-agent" },
  { id: "29", slug: "seo-analyst", contentId: "seo-analyst" },
] as const;

const useCaseDemoEntryById = new Map(useCaseDemoEntries.map((entry) => [entry.id, entry]));
const useCaseDemoEntryByContentId = new Map(useCaseDemoEntries.map((entry) => [entry.contentId, entry]));

export function getUseCaseDemoEntry(id: string) {
  return useCaseDemoEntryById.get(id) ?? null;
}

export function getUseCaseDemoEntryByContentId(contentId: string) {
  return useCaseDemoEntryByContentId.get(contentId) ?? null;
}

export function getUseCaseDemoHref(locale: Locale, id: string) {
  const entry = getUseCaseDemoEntry(id);
  return entry ? getLocalePath(locale, `/demo/use-case/${entry.id}/${entry.slug}`) : null;
}

export function getUseCaseDemoHrefByContentId(locale: Locale, contentId: string) {
  const entry = getUseCaseDemoEntryByContentId(contentId);
  return entry ? getUseCaseDemoHref(locale, entry.id) : null;
}

export function resolveUseCaseDemoRoute(locale: Locale, id: string, rest?: string[]) {
  const entry = getUseCaseDemoEntry(id);

  if (!entry) {
    return {
      canonicalHref: null,
      entry: null,
      shouldRedirect: false,
    };
  }

  const canonicalHref = getLocalePath(locale, `/demo/use-case/${entry.id}/${entry.slug}`);
  const slug = rest?.[0];
  const shouldRedirect = !rest?.length || rest.length !== 1 || slug !== entry.slug;

  return {
    canonicalHref,
    entry,
    shouldRedirect,
  };
}
