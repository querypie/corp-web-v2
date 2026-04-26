import { notFound, permanentRedirect } from "next/navigation";
import { getLocalePath, isLocale } from "@/constants/i18n";
import { resolveLegacySolutionAlias } from "@/features/solutions/routes";

type Props = { params: Promise<{ locale: string; rest?: string[] }> };

export default async function LegacyAipAliasRedirect({ params }: Props) {
  const { locale, rest } = await params;
  if (!isLocale(locale)) notFound();

  const aliasPath = `/platform/ai/aip${rest?.length ? `/${rest.join("/")}` : ""}`;
  const canonicalPath = resolveLegacySolutionAlias(aliasPath);
  if (!canonicalPath) notFound();

  permanentRedirect(getLocalePath(locale, canonicalPath));
}
