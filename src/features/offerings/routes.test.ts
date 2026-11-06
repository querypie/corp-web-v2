import { describe, expect, it } from "vitest";
import { offeringEntries } from "@/constants/offerings";
import { getLocaleSwitchPath } from "@/constants/i18n";
import { getOfferingHref, getAiGatewayManualHref } from "./routes";

describe("메뉴와 독립된 제품·서비스 경로", () => {
  it("고유한 주소와 이전 주소를 등록한다", () => {
    const paths = offeringEntries.map(entry => entry.path);
    const legacy = offeringEntries.flatMap(entry => entry.legacyPaths);
    expect(new Set(paths).size).toBe(paths.length);
    expect(new Set(legacy).size).toBe(legacy.length);
    expect(paths.some(path => /^\/(platforms|solutions)\//.test(path))).toBe(false);
    expect(legacy.some(path => paths.includes(path))).toBe(false);
  });
  it.each(["en", "ko", "ja"] as const)("%s에서 독립 주소와 실제 제품 하위 주소를 사용한다", locale => {
    expect(getOfferingHref(locale, "ai-gateway")).toBe(`/${locale}/ai-gateway`);
    expect(getOfferingHref(locale, "fde-services")).toBe(`/${locale}/fde-services`);
    expect(getOfferingHref(locale, "aip-integrations")).toBe(`/${locale}/aip/integrations`);
    expect(getAiGatewayManualHref(locale)).toBe(`https://ai-gateway.dev.querypie.io/manual/${locale === "en" ? "" : `${locale}/`}`);
  });
  it("지원하지 않는 언어로 전환하면 홈으로 이동한다", () => {
    expect(getLocaleSwitchPath("/ja/local-llm", "ko")).toBe("/ko");
    expect(getLocaleSwitchPath("/ja/as400-cobol", "en")).toBe("/en");
    expect(getLocaleSwitchPath("/ko/dlp", "ja")).toBe("/ja");
    expect(getLocaleSwitchPath("/ja/ai-gateway", "ko")).toBe("/ko/ai-gateway");
  });
});
