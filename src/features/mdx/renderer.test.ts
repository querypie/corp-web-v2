import { describe, it, expect } from "vitest";
import { renderMdx } from "./renderer";

const SAMPLE_MDX = `---
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

describe("renderMdx", () => {
  it("frontmatter를 올바르게 파싱한다", async () => {
    const { frontmatter } = await renderMdx(SAMPLE_MDX, {});
    expect(frontmatter.title).toBe("Test Article");
    expect(frontmatter.layout).toBe("Article");
    expect(frontmatter.date).toBe("2026-01-01");
  });

  it("content를 반환한다", async () => {
    const { content } = await renderMdx(SAMPLE_MDX, {});
    expect(content).toBeDefined();
  });
});
