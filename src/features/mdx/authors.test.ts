import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));

import { formatResolvedAuthorNames, getAuthorIntroHeading, resolveArticleAuthors } from "./authors";

describe("resolveArticleAuthors", () => {
  it("locale별 등록된 author 정보를 해석한다", () => {
    const enAuthors = resolveArticleAuthors("brant", "en");
    const koAuthors = resolveArticleAuthors("brant", "ko");
    const jaAuthors = resolveArticleAuthors("terazawa", "ja");

    expect(enAuthors).toEqual([
      expect.objectContaining({
        id: "brant",
        isRegistered: true,
        name: "Brant Hwang",
        position: "CEO, Founder",
        profileImageSrc: "/crew/brant.png",
      }),
    ]);

    expect(koAuthors[0]).toEqual(
      expect.objectContaining({
        description: expect.stringContaining("브랜트는 QueryPie의 창립자이자 CEO"),
      }),
    );

    expect(jaAuthors[0]).toEqual(
      expect.objectContaining({
        name: "寺澤慎祐",
        position: "マーケティングコンサルタント",
        description: expect.stringContaining("出現する未来"),
      }),
    );
  });

  it("배열 author를 순서대로 해석하고 공백 값은 제거한다", () => {
    const authors = resolveArticleAuthors(["ravi", "", "noah"], "en");

    expect(authors.map((author) => author.id)).toEqual(["ravi", "noah"]);
  });

  it("등록되지 않은 author는 표시 이름만 유지한다", () => {
    const authors = resolveArticleAuthors("Jessica Kim", "en");

    expect(authors).toEqual([
      {
        id: "Jessica Kim",
        isRegistered: false,
        name: "Jessica Kim",
        description: undefined,
        position: undefined,
        profileImageSrc: undefined,
        links: [],
      },
    ]);
  });
});

describe("formatResolvedAuthorNames", () => {
  it("등록된 author는 locale 이름으로 헤더에 표시한다", () => {
    const authors = resolveArticleAuthors(["brant", "terazawa"], "ja");

    expect(formatResolvedAuthorNames(authors)).toBe("Brant Hwang, 寺澤慎祐");
  });
});

describe("getAuthorIntroHeading", () => {
  it("author box 제목을 locale별로 반환한다", () => {
    expect(getAuthorIntroHeading("en")).toBe("About the author");
    expect(getAuthorIntroHeading("ko")).toBe("작성자 소개");
    expect(getAuthorIntroHeading("ja")).toBe("著者紹介");
  });
});
