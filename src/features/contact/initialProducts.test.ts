import { describe, expect, it } from "vitest";
import { aruProductLabels } from "@/copy/contact";
import { getContactInitialProducts } from "./initialProducts";

describe("getContactInitialProducts", () => {
  it.each(["en", "ko", "ja"] as const)("%s Aru CTA의 기본 선택을 해당 언어의 제품명으로 반환한다", (locale) => {
    expect(getContactInitialProducts(locale, { utm_source: "aru" })).toEqual([aruProductLabels[locale]]);
  });

  it.each([{}, { utm_source: "other" }, { utm_source: ["aru", "other"] }])(
    "일반 방문이나 중복된 출처에는 기본 선택하지 않는다: %j",
    (searchParams) => {
      expect(getContactInitialProducts("ja", searchParams)).toEqual([]);
    },
  );
});
