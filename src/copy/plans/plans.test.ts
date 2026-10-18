import { describe, expect, it } from "vitest";
import { pricingProductsByLocale } from ".";

describe("pricingProductsByLocale", () => {
  it.each(["en", "ko", "ja"] as const)("contains one comparison value per current plan in %s", (locale) => {
    for (const [productKey, product] of Object.entries(pricingProductsByLocale[locale])) {
      expect(product.productKey).toBe(productKey);
      expect(product.locale).toBe(locale);
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
    expect(JSON.stringify(aip)).not.toMatch(/Community|Standard|\$50\//);

    const acp = pricingProductsByLocale[locale].acp;
    expect(acp.cards).toHaveLength(3);
    expect(acp.comparisonGroups).toEqual([]);
    expect(JSON.stringify(acp)).not.toMatch(/\$650|20,000|\$(?:29|590)\//);
  });
});
