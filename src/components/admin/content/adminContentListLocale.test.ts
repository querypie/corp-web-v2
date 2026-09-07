import { describe, expect, it } from "vitest";
import { createLocalizedContent } from "@/features/content/data";
import {
  getAdminContentListDisplayLocale,
  getOrderedVisibleLocales,
} from "./adminContentListLocale";

describe("adminContentListLocale", () => {
  it("JA만 활성화되어 있으면 JA 제목을 선택한다", () => {
    expect(
      getAdminContentListDisplayLocale({
        title: { en: "English", ja: "日本語", ko: "한국어" },
        visibleLocales: ["ja"],
      }),
    ).toBe("ja");
  });

  it("활성 언어 중 EN, KO, JA 순서로 제목 언어를 선택한다", () => {
    const title = { en: "English", ja: "日本語", ko: "한국어" };

    expect(getAdminContentListDisplayLocale({ title, visibleLocales: ["ja", "ko"] })).toBe("ko");
    expect(getAdminContentListDisplayLocale({ title, visibleLocales: ["ja", "en", "ko"] })).toBe("en");
  });

  it("활성 언어가 없으면 값이 있는 첫 제목으로 대체한다", () => {
    expect(
      getAdminContentListDisplayLocale({
        title: { ...createLocalizedContent(), ja: "日本語" },
        visibleLocales: [],
      }),
    ).toBe("ja");
  });

  it("언어 배지도 EN, KO, JA 순서로 정렬한다", () => {
    expect(getOrderedVisibleLocales(["ja", "en", "ko"])).toEqual(["en", "ko", "ja"]);
  });
});
