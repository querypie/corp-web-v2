import { describe, expect, it } from "vitest";
import { getMdxDetailHref, resolveMdxDetailRoute } from "./routes";

describe("mdx detail routes", () => {
  it("blog canonical href를 frontmatter slug 기준 id/slug 형식으로 생성한다", () => {
    expect(
      getMdxDetailHref(
        "blog",
        "en",
        "6",
        "integration-connection-paradigm",
        "QueryPie’s New Paradigm: Beyond Integration, Toward True Connectivity",
      ),
    ).toBe("/blog/6/integration-connection-paradigm");
  });

  it("white-paper canonical href를 locale prefix와 함께 생성한다", () => {
    expect(
      getMdxDetailHref(
        "white-paper",
        "ko",
        "1",
        "nextjs-server-action-and-frontend-security",
        "Next.js Server Action and Frontend Security",
      ),
    ).toBe("/ko/white-papers/1/nextjs-server-action-and-frontend-security");
  });

  it("frontmatter slug가 없으면 title 기반 slug를 fallback으로 사용한다", () => {
    expect(getMdxDetailHref("blog", "en", "6", undefined, "Hello World")).toBe("/blog/6/hello-world");
  });

  it("slug가 없으면 redirect 대상으로 판단한다", () => {
    expect(
      resolveMdxDetailRoute("blog", "en", "6", undefined, "integration-connection-paradigm", "Hello World"),
    ).toMatchObject({
      canonicalHref: "/blog/6/integration-connection-paradigm",
      shouldRedirect: true,
    });
  });

  it("slug가 다르면 redirect 대상으로 판단한다", () => {
    expect(
      resolveMdxDetailRoute(
        "white-paper",
        "ja",
        "1",
        ["wrong-slug"],
        "nextjs-server-action-and-frontend-security",
        "Hello World",
      ),
    ).toMatchObject({
      canonicalHref: "/ja/white-papers/1/nextjs-server-action-and-frontend-security",
      shouldRedirect: true,
    });
  });

  it("정확한 slug 하나만 있으면 redirect하지 않는다", () => {
    expect(
      resolveMdxDetailRoute(
        "blog",
        "ko",
        "6",
        ["integration-connection-paradigm"],
        "integration-connection-paradigm",
        "Hello World",
      ),
    ).toMatchObject({
      canonicalHref: "/ko/blog/6/integration-connection-paradigm",
      shouldRedirect: false,
    });
  });
}
);
