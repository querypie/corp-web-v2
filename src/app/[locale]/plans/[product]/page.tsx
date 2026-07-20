import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import PlansPage from "@/components/pages/plans/PlansPage";
import { getLocalePath, isLocale, type Locale } from "@/constants/i18n";
import { getPlansPageCopy } from "@/copy/contentPages";
import { withDynamicOgImage } from "@/features/seo/metadata";

const planProducts = ["aip", "acp"] as const;
const enterpriseCountryCodes = new Set(["TH", "VN"]);
const fallbackCountryCode = "XX";

type PlanProduct = (typeof planProducts)[number];

type PlansProductRouteParams = {
  params: Promise<{ locale: string; product: string }>;
};

type PlansProductRouteProps = PlansProductRouteParams & {
  searchParams: Promise<{ "ip-country"?: string | string[] }>;
};

function isPlanProduct(value: string): value is PlanProduct {
  return planProducts.includes(value as PlanProduct);
}

function normalizeCountryCode(value: string | null | undefined) {
  const countryCode = value?.trim().toUpperCase();
  return countryCode && /^[A-Z]{2}$/.test(countryCode) ? countryCode : null;
}

function getQueryCountry(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return planProducts.map((product) => ({ product }));
}

export async function generateMetadata({ params }: PlansProductRouteParams): Promise<Metadata> {
  const { locale, product } = await params;

  if (!isLocale(locale) || !isPlanProduct(product)) return {};

  const { metadataDescription, metadataTitle } = getPlansPageCopy(locale);

  return withDynamicOgImage({
    title: metadataTitle,
    description: metadataDescription,
    alternates: {
      canonical: getLocalePath(locale, `/plans/${product}`),
    },
  }, { locale, title: metadataTitle, description: metadataDescription });
}

export default async function PlansProductRoute({ params, searchParams }: PlansProductRouteProps) {
  const { locale, product } = await params;

  if (!isLocale(locale) || !isPlanProduct(product)) notFound();

  if (product === "aip") {
    const [headerStore, routeSearchParams] = await Promise.all([headers(), searchParams]);
    const ipCountryQuery = getQueryCountry(routeSearchParams["ip-country"]);
    const xVercelIpCountry = headerStore.get("x-vercel-ip-country");
    const countryCode =
      normalizeCountryCode(ipCountryQuery) ??
      normalizeCountryCode(xVercelIpCountry) ??
      fallbackCountryCode;

    console.info("[plans/aip] country detection", {
      ipCountryQuery: ipCountryQuery ?? null,
      resolvedCountry: countryCode,
      xVercelIpCountry,
    });

    if (enterpriseCountryCodes.has(countryCode)) {
      return (
        <PlansPage
          enterpriseOnly
          locale={locale}
          productKey="aip"
        />
      );
    }
  }

  return <PlansPage locale={locale as Locale} productKey={product} />;
}
