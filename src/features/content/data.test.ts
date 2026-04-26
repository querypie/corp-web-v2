import { describe, expect, it } from "vitest";
import {
  createLocalizedContent,
  ensureUniqueSlug,
  formatPublicDate,
  getContentThumbnailSrc,
  getLocalizedContent,
  getPublicDetailHref,
  getWriterLabel,
  hasLocalizedTitle,
  isPublishedContentVisible,
  slugifyTitle,
  sortManagedContents,
  stripManagedContentBodies,
  type ManagedContentEntry,
} from "./data";

function makeEntry(overrides: Partial<ManagedContentEntry> = {}): ManagedContentEntry {
  return {
    authorName: "",
    authorRole: "",
    bodyHtml: createLocalizedContent("<p>body</p>"),
    bodyRichText: createLocalizedContent("{}"),
    categorySlug: "use-cases",
    contentType: "content",
    dateIso: "2026-01-01",
    downloadCoverImageSrc: "",
    downloadPdfFileName: "",
    downloadPdfSrc: "",
    enableDownloadButton: false,
    externalUrl: "",
    gatingLevel: "none",
    hideHeroImage: false,
    id: "test-item",
    imageSrc: "",
    relatedIds: [],
    section: "demo",
    sortOrder: 0,
    status: "published",
    summary: createLocalizedContent(),
    title: createLocalizedContent("Test Title"),
    ...overrides,
  };
}

describe("createLocalizedContent", () => {
  it("모든 locale에 동일한 값을 설정한다", () => {
    expect(createLocalizedContent("hello")).toEqual({ en: "hello", ko: "hello", ja: "hello" });
  });

  it("기본값은 빈 문자열이다", () => {
    expect(createLocalizedContent()).toEqual({ en: "", ko: "", ja: "" });
  });
});

describe("getLocalizedContent", () => {
  it("해당 locale의 값을 반환한다", () => {
    const content = { en: "English", ko: "한국어", ja: "日本語" };
    expect(getLocalizedContent(content, "en")).toBe("English");
    expect(getLocalizedContent(content, "ko")).toBe("한국어");
    expect(getLocalizedContent(content, "ja")).toBe("日本語");
  });

  it("locale 값이 없으면 en으로 fallback한다", () => {
    const content = { en: "English", ko: "", ja: "" };
    expect(getLocalizedContent(content, "ko")).toBe("English");
    expect(getLocalizedContent(content, "ja")).toBe("English");
  });

  it("en도 없으면 ko로 fallback한다", () => {
    const content = { en: "", ko: "한국어", ja: "" };
    expect(getLocalizedContent(content, "ja")).toBe("한국어");
  });
});

describe("hasLocalizedTitle", () => {
  it("해당 locale에 제목이 있으면 true를 반환한다", () => {
    const content = { en: "Title", ko: "제목", ja: "" };
    expect(hasLocalizedTitle(content, "en")).toBe(true);
    expect(hasLocalizedTitle(content, "ko")).toBe(true);
  });

  it("공백만 있는 경우 false를 반환한다", () => {
    const content = { en: "  ", ko: "", ja: "" };
    expect(hasLocalizedTitle(content, "en")).toBe(false);
  });
});

describe("isPublishedContentVisible", () => {
  it("published 상태이고 제목이 있으면 true를 반환한다", () => {
    const item = { status: "published" as const, title: createLocalizedContent("Title") };
    expect(isPublishedContentVisible(item, "en")).toBe(true);
  });

  it("hidden 상태이면 false를 반환한다", () => {
    const item = { status: "hidden" as const, title: createLocalizedContent("Title") };
    expect(isPublishedContentVisible(item, "en")).toBe(false);
  });

  it("해당 locale의 제목이 없으면 false를 반환한다", () => {
    const item = { status: "published" as const, title: { en: "Title", ko: "", ja: "" } };
    expect(isPublishedContentVisible(item, "ko")).toBe(false);
  });
});

describe("slugifyTitle", () => {
  it("제목을 slug 형식으로 변환한다", () => {
    expect(slugifyTitle("Hello World")).toBe("hello-world");
    expect(slugifyTitle("  QueryPie  Features  ")).toBe("querypie-features");
  });

  it("특수문자를 제거한다", () => {
    expect(slugifyTitle("Hello, World!")).toBe("hello-world");
    expect(slugifyTitle("A & B")).toBe("a-and-b");
  });

  it("한글을 포함한 slug를 생성한다", () => {
    expect(slugifyTitle("QueryPie 소개")).toBe("querypie-소개");
  });

  it("빈 문자열은 타임스탬프 기반 fallback을 반환한다", () => {
    expect(slugifyTitle("!!!")).toMatch(/^content-\d+$/);
  });

  it("연속 하이픈을 하나로 합친다", () => {
    expect(slugifyTitle("a - b")).toBe("a-b");
  });
});

describe("ensureUniqueSlug", () => {
  const items = [
    makeEntry({ id: "my-slug" }),
    makeEntry({ id: "my-slug-2" }),
  ];

  it("충돌이 없으면 원본 id를 반환한다", () => {
    expect(ensureUniqueSlug("new-slug", items)).toBe("new-slug");
  });

  it("충돌이 있으면 숫자 접미사를 붙인다", () => {
    expect(ensureUniqueSlug("my-slug", items)).toBe("my-slug-3");
  });

  it("현재 편집 중인 항목은 충돌에서 제외한다", () => {
    expect(ensureUniqueSlug("my-slug", items, "my-slug")).toBe("my-slug");
  });
});

describe("sortManagedContents", () => {
  it("sortOrder 오름차순으로 정렬한다", () => {
    const items = [makeEntry({ id: "b", sortOrder: 2 }), makeEntry({ id: "a", sortOrder: 1 })];
    const sorted = sortManagedContents(items);
    expect(sorted[0].id).toBe("a");
    expect(sorted[1].id).toBe("b");
  });

  it("sortOrder가 같으면 dateIso 내림차순으로 정렬한다", () => {
    const items = [
      makeEntry({ id: "old", sortOrder: 1, dateIso: "2026-01-01" }),
      makeEntry({ id: "new", sortOrder: 1, dateIso: "2026-03-01" }),
    ];
    const sorted = sortManagedContents(items);
    expect(sorted[0].id).toBe("new");
    expect(sorted[1].id).toBe("old");
  });

  it("원본 배열을 변경하지 않는다", () => {
    const items = [makeEntry({ id: "b", sortOrder: 2 }), makeEntry({ id: "a", sortOrder: 1 })];
    sortManagedContents(items);
    expect(items[0].id).toBe("b");
  });
});

describe("getContentThumbnailSrc", () => {
  it("빈 이미지는 fallback 경로를 반환한다", () => {
    expect(getContentThumbnailSrc("")).toBe("/images/common/fallback-contents.jpg");
    expect(getContentThumbnailSrc("  ")).toBe("/images/common/fallback-contents.jpg");
  });

  it("/images/content/ 경로를 /uploads/ 로 변환한다", () => {
    expect(getContentThumbnailSrc("/images/content/foo.jpg")).toBe("/uploads/foo.jpg");
  });

  it("그 외 경로는 그대로 반환한다", () => {
    expect(getContentThumbnailSrc("https://cdn.example.com/img.jpg")).toBe("https://cdn.example.com/img.jpg");
    expect(getContentThumbnailSrc("/uploads/bar.jpg")).toBe("/uploads/bar.jpg");
  });
});

describe("formatPublicDate", () => {
  it("ISO 날짜를 locale에 맞게 포맷한다", () => {
    const result = formatPublicDate("en", "2026-04-15");
    expect(result).toContain("2026");
    expect(result).toContain("April");
  });

  it("빈 날짜는 빈 문자열을 반환한다", () => {
    expect(formatPublicDate("en", "")).toBe("");
  });

  it("유효하지 않은 날짜는 빈 문자열을 반환한다", () => {
    expect(formatPublicDate("en", "not-a-date")).toBe("");
  });
});

describe("getPublicDetailHref", () => {
  it("AIP demo는 짧은 demo/aip 경로를 반환한다", () => {
    expect(getPublicDetailHref("demo", "en", "google-oauth-demo")).toBe("/demo/aip/1/google-oauth-demo");
    expect(getPublicDetailHref("demo", "ko", "google-oauth-demo")).toBe("/ko/demo/aip/1/google-oauth-demo");
  });

  it("use-case demo는 짧은 demo/use-case 경로를 반환한다", () => {
    expect(getPublicDetailHref("demo", "en", "allganize-changsu-lee")).toBe("/demo/use-case/1/allganize-changsu-lee");
    expect(getPublicDetailHref("demo", "ko", "allganize-changsu-lee")).toBe("/ko/demo/use-case/1/allganize-changsu-lee");
  });

  it("webinar demo는 짧은 demo/webinar 경로를 반환한다", () => {
    expect(getPublicDetailHref("demo", "en", "air-company-querypie-mcp-webinar")).toBe(
      "/demo/webinar/22/air-company-querypie-mcp-webinar",
    );
    expect(getPublicDetailHref("demo", "ko", "air-company-querypie-mcp-webinar")).toBe(
      "/ko/demo/webinar/22/air-company-querypie-mcp-webinar",
    );
  });

  it("그 외 demo는 기존 features/demo 경로를 유지한다", () => {
    expect(getPublicDetailHref("demo", "en", "some-other-demo")).toBe("/features/demo/some-other-demo");
  });
});

describe("getWriterLabel", () => {
  it("이름과 역할이 있으면 슬래시로 구분하여 반환한다", () => {
    expect(getWriterLabel({ authorName: "Kim", authorRole: "Engineer" })).toBe("Kim / Engineer");
  });

  it("역할이 없으면 이름만 반환한다", () => {
    expect(getWriterLabel({ authorName: "Kim", authorRole: "" })).toBe("Kim");
  });

  it("공백으로만 이루어진 역할은 무시한다", () => {
    expect(getWriterLabel({ authorName: "Kim", authorRole: "  " })).toBe("Kim");
  });
});

describe("stripManagedContentBodies", () => {
  it("bodyHtml과 bodyRichText를 빈 값으로 초기화한다", () => {
    const item = makeEntry();
    const stripped = stripManagedContentBodies(item);
    expect(stripped.bodyHtml).toEqual(createLocalizedContent());
    expect(stripped.bodyRichText).toEqual(createLocalizedContent());
  });

  it("다른 필드는 변경하지 않는다", () => {
    const item = makeEntry({ title: { en: "My Title", ko: "제목", ja: "タイトル" } });
    const stripped = stripManagedContentBodies(item);
    expect(stripped.title).toEqual(item.title);
  });
});
