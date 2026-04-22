import { describe, expect, it } from "vitest";
import { getInternalMdxSegments } from "./internalPaths";

describe("getInternalMdxSegments", () => {
  it("/internal 루트는 빈 세그먼트로 매핑한다", () => {
    expect(getInternalMdxSegments(undefined)).toEqual([]);
  });

  it("허용된 mdx-guide 하위 경로를 반환한다", () => {
    expect(getInternalMdxSegments(["mdx-guide", "basic-syntax"])).toEqual([
      "mdx-guide",
      "basic-syntax",
    ]);
    expect(getInternalMdxSegments(["mdx-guide", "mermaid-diagrams"])).toEqual([
      "mdx-guide",
      "mermaid-diagrams",
    ]);
  });

  it("sample-article 경로를 반환한다", () => {
    expect(getInternalMdxSegments(["sample-article"])).toEqual(["sample-article"]);
  });

  it("plans 경로는 제외한다", () => {
    expect(getInternalMdxSegments(["plans"])).toBeNull();
  });

  it("mdx-preview 경로는 제외한다", () => {
    expect(getInternalMdxSegments(["mdx-preview"])).toBeNull();
  });

  it("허용되지 않은 internal 경로는 null을 반환한다", () => {
    expect(getInternalMdxSegments(["unknown"])).toBeNull();
    expect(getInternalMdxSegments(["mdx-guide", "unknown"])).toBeNull();
  });
});
