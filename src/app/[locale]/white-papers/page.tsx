import { notFound, redirect } from "next/navigation";
import { getLocalePath, isLocale } from "@/constants/i18n";
import { buildPaginatedHref, parsePageParam } from "@/features/pagination";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function LegacyWhitePaperListRedirect({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page } = await searchParams;

  if (!isLocale(locale)) notFound();

  const canonicalHref = buildPaginatedHref(
    getLocalePath(locale, "/whitepapers"),
    parsePageParam(page),
  );

  redirect(canonicalHref);
}
