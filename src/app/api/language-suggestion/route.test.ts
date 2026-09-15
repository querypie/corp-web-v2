import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const state = vi.hoisted(() => ({ language: "ko-KR", dismissed: false }));
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "accept-language": state.language }),
  cookies: async () => ({ has: () => state.dismissed }),
}));

describe("언어 추천", () => {
  beforeEach(() => {
    state.language = "ko-KR";
    state.dismissed = false;
  });

  it("일본어 화면에는 언어 추천을 표시하지 않는다", async () => {
    const response = await GET(new NextRequest("https://querypie.ai/api/language-suggestion?locale=ja"));
    expect(await response.json()).toMatchObject({ visible: false });
  });

  it.each([
    ["en", "ko-KR", "ko", true],
    ["ko", "en-US", "en", true],
    ["en", "ja-JP", "en", false],
    ["en", "ja-JP,ko;q=0.8", "ko", true],
  ])("%s 화면에서 %s는 %s만 추천한다", async (locale, language, recommendedLocale, visible) => {
    state.language = language;
    const response = await GET(new NextRequest(`https://www.querypie.com/api/language-suggestion?locale=${locale}`));
    expect(await response.json()).toEqual({ recommendedLocale, visible });
  });

  it("닫은 배너는 다시 추천하지 않는다", async () => {
    state.dismissed = true;
    const response = await GET(new NextRequest("https://www.querypie.com/api/language-suggestion?locale=en"));
    expect(await response.json()).toMatchObject({ visible: false });
  });
});
