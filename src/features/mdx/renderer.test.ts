import { describe, it, expect } from "vitest";
import { renderMdx } from "./renderer";

const BASE_MDX = `---
layout: "Article"
category: "blog"
title: "Test Article"
date: "2026-01-01"
---

# Hello World

This is a paragraph.

## Section Two

More content here.
`;

const FULL_FRONTMATTER_MDX = `---
layout: "Article"
category: "blog"
title: "Full Article"
description: "A test description"
date: "2026-03-15"
author: "Test Author"
keywords: ["keyword1", "keyword2"]
hideHeroImage: true
hideTableOfContents: false
---

Content here.
`;

const GFM_TABLE_MDX = `---
layout: "Article"
category: "blog"
title: "Table Test"
date: "2026-01-01"
---

| Column A | Column B |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`;

const MINIMAL_FRONTMATTER_MDX = `---
layout: "Article"
title: "Minimal"
date: "2026-01-01"
---

Body text.
`;

describe("renderMdx", () => {
  describe("frontmatter 파싱", () => {
    it("필수 frontmatter 필드를 파싱한다", async () => {
      const { frontmatter } = await renderMdx(BASE_MDX, {});
      expect(frontmatter.title).toBe("Test Article");
      expect(frontmatter.layout).toBe("Article");
      expect(frontmatter.date).toBe("2026-01-01");
      expect(frontmatter.category).toBe("blog");
    });

    it("선택적 frontmatter 필드를 파싱한다", async () => {
      const { frontmatter } = await renderMdx(FULL_FRONTMATTER_MDX, {});
      expect(frontmatter.description).toBe("A test description");
      expect(frontmatter.author).toBe("Test Author");
      expect(frontmatter.keywords).toEqual(["keyword1", "keyword2"]);
      expect(frontmatter.hideHeroImage).toBe(true);
      expect(frontmatter.hideTableOfContents).toBe(false);
    });

    it("없는 선택적 필드는 undefined이다", async () => {
      const { frontmatter } = await renderMdx(MINIMAL_FRONTMATTER_MDX, {});
      expect(frontmatter.description).toBeUndefined();
      expect(frontmatter.author).toBeUndefined();
      expect(frontmatter.keywords).toBeUndefined();
      expect(frontmatter.hideHeroImage).toBeUndefined();
    });
  });

  describe("content 렌더링", () => {
    it("content를 반환한다", async () => {
      const { content } = await renderMdx(BASE_MDX, {});
      expect(content).toBeDefined();
    });

    it("에러 없이 렌더링된다", async () => {
      const { error } = await renderMdx(BASE_MDX, {});
      expect(error).toBeUndefined();
    });

    it("GFM 테이블을 포함한 MDX를 에러 없이 처리한다", async () => {
      const { content, error } = await renderMdx(GFM_TABLE_MDX, {});
      expect(error).toBeUndefined();
      expect(content).toBeDefined();
    });
  });

  describe("커스텀 컴포넌트", () => {
    it("커스텀 컴포넌트 맵을 전달할 수 있다", async () => {
      // 컴포넌트 함수를 전달해도 에러 없이 렌더링된다
      const CustomH1 = ({ children }: { children?: unknown }) => null;
      const { content, error } = await renderMdx(BASE_MDX, { h1: CustomH1 as any });
      expect(error).toBeUndefined();
      expect(content).toBeDefined();
    });

    it("빈 컴포넌트 맵으로도 정상 렌더링된다", async () => {
      const { content, error } = await renderMdx(BASE_MDX, {});
      expect(error).toBeUndefined();
      expect(content).toBeDefined();
    });
  });
});
