import { describe, expect, it } from "vitest";
import { contactInquiryLabels, contactProductLabels, getContactPageCopy } from "@/copy/contact";
import { getContactInitialProducts } from "./initialProducts";
import { getContactHref, getContactInitialInquiry } from "./prefill";

describe("contact prefill", () => {
  it.each(["en", "ko", "ja"] as const)("%s CTA 파라미터를 실제 폼 옵션으로 변환한다", (locale) => {
    const copy = getContactPageCopy(locale);
    for (const product of Object.keys(contactProductLabels) as (keyof typeof contactProductLabels)[]) {
      for (const inquiry of Object.keys(contactInquiryLabels) as (keyof typeof contactInquiryLabels)[]) {
        const url = new URL(getContactHref(locale, product, inquiry), "https://example.com");
        expect(url.pathname).toBe(`/${locale}/contact-us`);
        const query = Object.fromEntries(url.searchParams);
        const products = getContactInitialProducts(locale, query);
        const productLabels: Partial<Record<typeof locale, string>> = contactProductLabels[product];
        expect(products).toEqual(productLabels[locale] ? [productLabels[locale]] : []);
        if (products.length) expect(copy.productOptions).toContain(products[0]);
        const selectedInquiry = getContactInitialInquiry(locale, query);
        const inquiryLabels: Partial<Record<typeof locale, string>> = contactInquiryLabels[inquiry];
        expect(selectedInquiry).toBe(inquiryLabels[locale]);
        if (selectedInquiry) expect(copy.formFields.find((field) => field.name === "inquiryType")?.options).toContain(selectedInquiry);
      }
    }
  });

  it.each([undefined, "invalid", "toString", "__proto__", ["ai-crew", "aip"]])("잘못되거나 중복된 파라미터는 무시한다: %j", (value) => {
    expect(getContactInitialProducts("ja", { product: value })).toEqual([]);
    expect(getContactInitialInquiry("ja", { inquiry: value })).toBeUndefined();
  });

  it("명시적인 제품 선택을 Aru 출처보다 우선한다", () => {
    expect(getContactInitialProducts("ja", { product: "ai-crew", utm_source: "aru" })).toEqual([contactProductLabels["ai-crew"].ja]);
  });

  it.each(["en", "ko"] as const)("%s에는 일본어 전용 옵션을 선택하거나 다른 제품으로 대체하지 않는다", (locale) => {
    for (const product of ["ai-crew", "ai-dashi"]) {
      expect(getContactInitialProducts(locale, { product })).toEqual([]);
    }
    expect(getContactInitialInquiry(locale, { inquiry: "ai-consulting" })).toBeUndefined();
    const copy = getContactPageCopy(locale);
    expect(copy.productOptions).toHaveLength(8);
    expect(copy.formFields.find((field) => field.name === "inquiryType")?.options).toHaveLength(5);
  });
});
