import { notFound, permanentRedirect } from "next/navigation";
import { getLocalePath, isLocale } from "@/constants/i18n";
import { resolveLegacySolutionAlias } from "@/features/solutions/routes";

type Props = { params: Promise<{ locale: string }> };

export default async function LegacyResourcesIntegrationsAliasRedirect({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const canonicalPath = resolveLegacySolutionAlias("/resources/integrations");
  if (!canonicalPath) notFound();

  permanentRedirect(getLocalePath(locale, canonicalPath));
}
