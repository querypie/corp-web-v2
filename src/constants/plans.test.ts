import { describe, expect, it } from "vitest";
import { pricingProductsByLocale } from "./plans";

describe("pricingProductsByLocale", () => {
  it.each(["en", "ko", "ja"] as const)("contains one comparison value per current plan in %s", (locale) => {
    for (const product of Object.values(pricingProductsByLocale[locale])) {
      expect(product.cards).toHaveLength(product.plans.length);
      for (const group of product.comparisonGroups) {
        for (const row of group.rows) {
          expect(row.values, `${product.tabLabel}: ${row.label}`).toHaveLength(product.plans.length);
        }
      }
    }

    const aip = pricingProductsByLocale[locale].aip;
    expect(aip.cards.map((card) => card.name)).toEqual(aip.plans);
    expect(aip.plans).toEqual(["Business", "Enterprise"]);
    expect(JSON.stringify(aip)).not.toMatch(/\$20(?:\/| per)/);
    expect(aip.comparisonGroups[0].rows[0].values[0].value).toContain("$650/");
  });
});
