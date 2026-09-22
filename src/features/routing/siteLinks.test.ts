import { describe, expect, it } from "vitest";
import { getSameSiteHref, localizeContentLinks } from "./siteLinks";

describe("사이트 도메인 유지", () => {
  it("일본어 본문의 글로벌 절대 URL을 일본어 상대 경로로 바꾼다", () => {
    expect(getSameSiteHref("https://www.querypie.com/en/demo/aip?utm_source=test#video", "ja"))
      .toBe("/ja/demo/aip?utm_source=test#video");
    expect(getSameSiteHref("https://querypie.com", "ja")).toBe("/ja");
  });

  it("글로벌 본문의 일본 절대 URL도 현재 언어로 바꾼다", () => {
    expect(getSameSiteHref("https://www.querypie.ai/ja/about-us", "ko")).toBe("/ko/about-us");
    expect(getSameSiteHref("//querypie.ai/ja", "en")).toBe("/en");
  });

  it.each(["https://app.querypie.com/", "https://docs.querypie.com/ko", "https://querypie.ai.example.com/", "mailto:pr@querypie.com", "/ko/demo/aip", "#section"])("외부 서비스와 기존 상대 링크를 유지한다: %s", (href) => {
    expect(getSameSiteHref(href, "ja")).toBe(href);
  });

  it("다운로드 경로에는 locale을 추가하지 않는다", () => {
    expect(getSameSiteHref("https://www.querypie.com/assets/guide.pdf", "ja")).toBe("/assets/guide.pdf");
  });

  it("본문 링크만 변환하며 이미지와 본문 원문을 유지한다", () => {
    const html = '<p>https://www.querypie.com</p><a href="https://www.querypie.com/en?a=1&amp;b=2">Site</a><img src="https://www.querypie.com/a.png">';
    expect(localizeContentLinks(html, "ja")).toBe('<p>https://www.querypie.com</p><a href="/ja?a=1&amp;b=2">Site</a><img src="https://www.querypie.com/a.png">');
  });
});
