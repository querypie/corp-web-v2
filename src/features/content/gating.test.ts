import { describe, expect, it } from "vitest";
import {
  buildContentPreviewHtml,
  getContentGatingRatio,
  getContentUnlockCookieName,
  hasUnlockedContentAccess,
  isContentGatingEnabled,
} from "./gating";

describe("getContentUnlockCookieName", () => {
  it("id를 기반으로 쿠키 이름을 생성한다", () => {
    expect(getContentUnlockCookieName("my-content")).toBe("querypie_content_unlocked_my-content");
  });

  it("허용되지 않는 문자를 언더스코어로 치환한다", () => {
    expect(getContentUnlockCookieName("content/with/slashes")).toBe(
      "querypie_content_unlocked_content_with_slashes",
    );
    expect(getContentUnlockCookieName("content.dot")).toBe(
      "querypie_content_unlocked_content_dot",
    );
  });
});

describe("isContentGatingEnabled", () => {
  it("news 섹션은 게이팅을 적용하지 않는다", () => {
    expect(isContentGatingEnabled({ section: "news", contentType: "content", gatingLevel: "30" })).toBe(false);
  });

  it("outlink 타입은 게이팅을 적용하지 않는다", () => {
    expect(isContentGatingEnabled({ section: "demo", contentType: "outlink", gatingLevel: "30" })).toBe(false);
  });

  it("gatingLevel이 none이면 게이팅을 적용하지 않는다", () => {
    expect(isContentGatingEnabled({ section: "demo", contentType: "content", gatingLevel: "none" })).toBe(false);
  });

  it("demo 섹션의 content 타입이고 gatingLevel이 있으면 게이팅을 적용한다", () => {
    expect(isContentGatingEnabled({ section: "demo", contentType: "content", gatingLevel: "30" })).toBe(true);
    expect(isContentGatingEnabled({ section: "documentation", contentType: "content", gatingLevel: "50" })).toBe(true);
  });
});

describe("getContentGatingRatio", () => {
  it("각 레벨에 해당하는 비율을 반환한다", () => {
    expect(getContentGatingRatio("10")).toBe(0.1);
    expect(getContentGatingRatio("30")).toBe(0.3);
    expect(getContentGatingRatio("50")).toBe(0.5);
  });

  it("none 레벨은 1을 반환한다 (제한 없음)", () => {
    expect(getContentGatingRatio("none")).toBe(1);
  });
});

describe("buildContentPreviewHtml", () => {
  it("ratio가 1 이상이면 전체 HTML을 반환한다", () => {
    const html = "<p>First</p><p>Second</p><p>Third</p>";
    expect(buildContentPreviewHtml(html, "none")).toBe(html);
  });

  it("빈 HTML은 그대로 반환한다", () => {
    expect(buildContentPreviewHtml("", "30")).toBe("");
    expect(buildContentPreviewHtml("  ", "30")).toBe("  ");
  });

  it("50% 게이팅 시 대략 절반만 반환한다", () => {
    const blocks = Array.from({ length: 10 }, (_, i) => `<p>Paragraph ${i + 1} with some text content</p>`);
    const html = blocks.join("");
    const preview = buildContentPreviewHtml(html, "50");
    expect(preview.length).toBeLessThan(html.length);
    expect(preview.length).toBeGreaterThan(0);
  });

  it("중첩된 HTML 구조에서 블록이 잘려나가지 않는다", () => {
    const html = "<div><p>First</p><p>Second</p></div><div><p>Third</p></div>";
    const preview = buildContentPreviewHtml(html, "50");
    // 블록 단위로 잘리므로 열린 태그가 닫히지 않는 경우가 없어야 한다
    const openTags = (preview.match(/<[^/][^>]*>/g) ?? []).filter(
      (t) => !t.endsWith("/>"),
    ).length;
    const closeTags = (preview.match(/<\/[^>]+>/g) ?? []).length;
    expect(openTags).toBe(closeTags);
  });

  it("10% 게이팅 시 매우 적은 양만 반환한다", () => {
    const blocks = Array.from({ length: 20 }, (_, i) => `<p>Paragraph ${i + 1} content here.</p>`);
    const html = blocks.join("");
    const preview = buildContentPreviewHtml(html, "10");
    expect(preview.length).toBeLessThan(html.length / 3);
  });
});

describe("hasUnlockedContentAccess", () => {
  it("'true' 문자열이면 접근 허용이다", () => {
    expect(hasUnlockedContentAccess("true")).toBe(true);
  });

  it("undefined이거나 다른 값이면 접근 불허이다", () => {
    expect(hasUnlockedContentAccess(undefined)).toBe(false);
    expect(hasUnlockedContentAccess("false")).toBe(false);
    expect(hasUnlockedContentAccess("1")).toBe(false);
  });
});
