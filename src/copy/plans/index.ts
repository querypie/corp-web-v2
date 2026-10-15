import type { Locale } from "@/constants/i18n";
import { acpPricingEn } from "./acp/en";
import { acpPricingJa } from "./acp/ja";
import { acpPricingKo } from "./acp/ko";
import { aipPricingEn } from "./aip/en";
import { aipPricingJa } from "./aip/ja";
import { aipPricingKo } from "./aip/ko";
import type { PricingProducts } from "./types";

export const pricingProductsByLocale: Record<Locale, PricingProducts> = {
  en: { aip: aipPricingEn, acp: acpPricingEn },
  ko: { aip: aipPricingKo, acp: acpPricingKo },
  ja: { aip: aipPricingJa, acp: acpPricingJa },
};

export type { ComparisonGroup, ComparisonValue, PlanCard, PlanFeature, PricingProduct } from "./types";
