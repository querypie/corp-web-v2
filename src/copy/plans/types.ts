import type { Locale } from "@/constants/i18n";

export type PricingProductKey = "aip" | "acp";

export type PlanCard = {
  billingLabel?: string;
  ctaLabel: string;
  description: string;
  features: PlanFeature[];
  href: string;
  name: string;
  priceLabel: string;
  tone?: "primary" | "secondary";
};

export type PlanFeature = string | ComparisonValue | PlanFeatureDivider;
export type PlanFeatureDivider = { type: "divider" };

export type ComparisonValue = {
  tone?: "danger" | "muted" | "success";
  value: string;
};

export type ComparisonRow = {
  label: string;
  values: ComparisonValue[];
};

export type ComparisonGroup = {
  rows: ComparisonRow[];
  title: string;
};

export type PricingProduct<Product extends PricingProductKey = PricingProductKey> = {
  productKey: Product;
  locale: Locale;
  cards: PlanCard[];
  comparisonGroups: ComparisonGroup[];
  plans: string[];
  tabLabel: string;
};

export type PricingProducts = {
  [Product in PricingProductKey]: PricingProduct<Product>;
};
