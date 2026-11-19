import { describe, expect, it } from "vitest";
import { getAnniversaryHomeHref } from "./routing";

describe("10주년 로고 링크", () => {
  it.each([
    ["ko", "https://www.querypie.com/ko"],
    ["en", "https://www.querypie.com/en"],
    ["ja", "https://querypie.ai/"],
  ] as const)("%s의 공식 홈페이지로 연결한다", (locale, homepage) => {
    expect(getAnniversaryHomeHref(locale)).toBe(homepage);
  });
});
