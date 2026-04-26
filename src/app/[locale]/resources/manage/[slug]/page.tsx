import { notFound, permanentRedirect } from "next/navigation";
import { getLocalePath, isLocale } from "@/constants/i18n";
import { resolveLegacySolutionAlias } from "@/features/solutions/routes";

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function LegacyResourcesManageAliasRedirect({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const canonicalPath = resolveLegacySolutionAlias(`/resources/manage/${slug}`);
  if (!canonicalPath) notFound();

  permanentRedirect(getLocalePath(locale, canonicalPath));
}
