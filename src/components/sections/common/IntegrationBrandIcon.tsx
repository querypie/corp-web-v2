import { integrationItems } from "@/components/pages/platforms/aip/integrations/integrationData";
import IntegrationIcon from "./IntegrationIcon";

const itemsByName = new Map(integrationItems.map(item => [item.name, item]));

export default function IntegrationBrandIcon({ name, className }: { name: string; className?: string }) {
  const item = itemsByName.get(name);
  if (!item) return null;

  return <IntegrationIcon
    className={className}
    darkPlate={item.darkPlate}
    enhanceIconContrast={item.enhanceIconContrast}
    icon={item.icon}
    invertIcon={item.invertIcon}
  />;
}
