import type { ComponentType } from "react";
import type { Locale } from "@/constants/i18n";
import type { SolutionEntry } from "./routes";
import AipENSolutionContent from "./static-content/aip/en";
import AipKOSolutionContent from "./static-content/aip/ko";
import AipJASolutionContent from "./static-content/aip/ja";
import AipUsageBasedLlmENSolutionContent from "./static-content/aip/usage-based-llm/en";
import AipUsageBasedLlmKOSolutionContent from "./static-content/aip/usage-based-llm/ko";
import AipUsageBasedLlmJASolutionContent from "./static-content/aip/usage-based-llm/ja";
import AipMcpGatewayENSolutionContent from "./static-content/aip/mcp-gateway/en";
import AipMcpGatewayKOSolutionContent from "./static-content/aip/mcp-gateway/ko";
import AipMcpGatewayJASolutionContent from "./static-content/aip/mcp-gateway/ja";
import AipFdeServicesENSolutionContent from "./static-content/aip/fde-services/en";
import AipFdeServicesKOSolutionContent from "./static-content/aip/fde-services/ko";
import AipFdeServicesJASolutionContent from "./static-content/aip/fde-services/ja";
import AipIntegrationsENSolutionContent from "./static-content/aip/integrations/en";
import AipIntegrationsKOSolutionContent from "./static-content/aip/integrations/ko";
import AipIntegrationsJASolutionContent from "./static-content/aip/integrations/ja";
import AcpENSolutionContent from "./static-content/acp/en";
import AcpKOSolutionContent from "./static-content/acp/ko";
import AcpJASolutionContent from "./static-content/acp/ja";
import AcpDatabaseAccessControllerENSolutionContent from "./static-content/acp/database-access-controller/en";
import AcpDatabaseAccessControllerKOSolutionContent from "./static-content/acp/database-access-controller/ko";
import AcpDatabaseAccessControllerJASolutionContent from "./static-content/acp/database-access-controller/ja";
import AcpSystemAccessControllerENSolutionContent from "./static-content/acp/system-access-controller/en";
import AcpSystemAccessControllerKOSolutionContent from "./static-content/acp/system-access-controller/ko";
import AcpSystemAccessControllerJASolutionContent from "./static-content/acp/system-access-controller/ja";
import AcpKubernetesAccessControllerENSolutionContent from "./static-content/acp/kubernetes-access-controller/en";
import AcpKubernetesAccessControllerKOSolutionContent from "./static-content/acp/kubernetes-access-controller/ko";
import AcpKubernetesAccessControllerJASolutionContent from "./static-content/acp/kubernetes-access-controller/ja";
import AcpWebAccessControllerENSolutionContent from "./static-content/acp/web-access-controller/en";
import AcpWebAccessControllerKOSolutionContent from "./static-content/acp/web-access-controller/ko";
import AcpWebAccessControllerJASolutionContent from "./static-content/acp/web-access-controller/ja";
import AcpIntegrationsENSolutionContent from "./static-content/acp/integrations/en";
import AcpIntegrationsKOSolutionContent from "./static-content/acp/integrations/ko";
import AcpIntegrationsJASolutionContent from "./static-content/acp/integrations/ja";

export type SolutionStaticContentProps = {
  locale: Locale;
  searchParams?: { category?: string };
};

export type SolutionStaticContentComponent = ComponentType<SolutionStaticContentProps>;

const solutionStaticContent: Record<
  SolutionEntry["id"],
  Record<Locale, SolutionStaticContentComponent>
> = {
  "aip": {
    en: AipENSolutionContent,
    ko: AipKOSolutionContent,
    ja: AipJASolutionContent,
  },
  "aip-usage-based-llm": {
    en: AipUsageBasedLlmENSolutionContent,
    ko: AipUsageBasedLlmKOSolutionContent,
    ja: AipUsageBasedLlmJASolutionContent,
  },
  "aip-mcp-gateway": {
    en: AipMcpGatewayENSolutionContent,
    ko: AipMcpGatewayKOSolutionContent,
    ja: AipMcpGatewayJASolutionContent,
  },
  "aip-fde-services": {
    en: AipFdeServicesENSolutionContent,
    ko: AipFdeServicesKOSolutionContent,
    ja: AipFdeServicesJASolutionContent,
  },
  "aip-integrations": {
    en: AipIntegrationsENSolutionContent,
    ko: AipIntegrationsKOSolutionContent,
    ja: AipIntegrationsJASolutionContent,
  },
  "acp": {
    en: AcpENSolutionContent,
    ko: AcpKOSolutionContent,
    ja: AcpJASolutionContent,
  },
  "acp-database-access-controller": {
    en: AcpDatabaseAccessControllerENSolutionContent,
    ko: AcpDatabaseAccessControllerKOSolutionContent,
    ja: AcpDatabaseAccessControllerJASolutionContent,
  },
  "acp-system-access-controller": {
    en: AcpSystemAccessControllerENSolutionContent,
    ko: AcpSystemAccessControllerKOSolutionContent,
    ja: AcpSystemAccessControllerJASolutionContent,
  },
  "acp-kubernetes-access-controller": {
    en: AcpKubernetesAccessControllerENSolutionContent,
    ko: AcpKubernetesAccessControllerKOSolutionContent,
    ja: AcpKubernetesAccessControllerJASolutionContent,
  },
  "acp-web-access-controller": {
    en: AcpWebAccessControllerENSolutionContent,
    ko: AcpWebAccessControllerKOSolutionContent,
    ja: AcpWebAccessControllerJASolutionContent,
  },
  "acp-integrations": {
    en: AcpIntegrationsENSolutionContent,
    ko: AcpIntegrationsKOSolutionContent,
    ja: AcpIntegrationsJASolutionContent,
  },
};

export function getSolutionStaticContent(
  id: SolutionEntry["id"],
  locale: Locale,
): SolutionStaticContentComponent | null {
  return solutionStaticContent[id]?.[locale] ?? null;
}
