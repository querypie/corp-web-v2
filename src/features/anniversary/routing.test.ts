import { describe, expect, it } from "vitest";
import { getAnniversaryLocaleHref } from "./routing";

describe("10주년 언어 전환", () => {
  it.each(["localhost", "www.querypie.com", "stage-v2.querypie.com"])(
    "%s에서는 언어 접두사가 있는 기념 페이지로 이동한다",
    (hostname) => {
      expect(getAnniversaryLocaleHref(hostname, "ja")).toBe("/ja/10th");
      expect(getAnniversaryLocaleHref(hostname, "ko")).toBe("/ko/10th");
    },
  );

  it.each([
    ["querypie.ai", "https://www.querypie.com"],
    ["www.querypie.ai", "https://www.querypie.com"],
    ["stage-v2.querypie.ai", "https://stage-v2.querypie.com"],
  ])("%s에서 다른 언어를 선택하면 해당 환경의 다국어 사이트로 이동한다", (hostname, origin) => {
    expect(getAnniversaryLocaleHref(hostname, "ja")).toBe("/10th");
    expect(getAnniversaryLocaleHref(hostname, "en")).toBe(`${origin}/en/10th`);
    expect(getAnniversaryLocaleHref(hostname, "ko")).toBe(`${origin}/ko/10th`);
  });
});
