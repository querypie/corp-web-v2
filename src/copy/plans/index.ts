import type { Locale } from "@/constants/i18n";
import { acpPricingEn } from "./acp/acp-plans.en";
import { acpPricingJa } from "./acp/acp-plans.ja";
import { acpPricingKo } from "./acp/acp-plans.ko";
import { aipPricingEn } from "./aip/aip-plans.en";
import { aipPricingJa } from "./aip/aip-plans.ja";
import { aipPricingKo } from "./aip/aip-plans.ko";
import type { PricingProducts } from "./types";

export const pricingProductsByLocale: Record<Locale, PricingProducts> = {
  en: { aip: aipPricingEn, acp: acpPricingEn },
  ko: { aip: aipPricingKo, acp: acpPricingKo },
  ja: { aip: aipPricingJa, acp: acpPricingJa },
};

export type { ComparisonGroup, ComparisonValue, PlanCard, PlanFeature, PricingProduct } from "./types";
