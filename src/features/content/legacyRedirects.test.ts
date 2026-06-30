import { describe, expect, it } from "vitest";
import { legacyContentRedirects } from "./legacyRedirects";

describe("legacyContentRedirects", () => {
  it("removes one legacy folder segment from category detail URLs", () => {
    expect(legacyContentRedirects).toContainEqual({
      source: "/:locale(en|ko|ja)/blog/:legacyFolder/:slug",
      destination: "/:locale/blog/:slug",
    });
    expect(legacyContentRedirects).toContainEqual({
      source: "/:locale(en|ko|ja)/whitepapers/:legacyFolder/:slug",
      destination: "/:locale/whitepapers/:slug",
    });
    expect(legacyContentRedirects).toContainEqual({
      source: "/:locale(en|ko|ja)/voc/:legacyFolder/:slug",
      destination: "/:locale/voc/:slug",
    });
    expect(legacyContentRedirects).toContainEqual({
      source: "/:locale(en|ko|ja)/demo/use-cases/:legacyFolder/:slug",
      destination: "/:locale/demo/use-cases/:slug",
    });
    expect(legacyContentRedirects).toContainEqual({
      source: "/:locale(en|ko|ja)/news/:legacyFolder/:slug",
      destination: "/:locale/news/:slug",
    });
  });

  it("does not redirect valid demo category detail URLs as section-level legacy URLs", () => {
    expect(legacyContentRedirects).not.toContainEqual({
      source: "/:locale(en|ko|ja)/demo/:legacyFolder/:slug",
      destination: "/:locale/demo/:slug",
    });
  });

  it("does not include previous company news URL redirects", () => {
    expect(legacyContentRedirects).not.toContainEqual({
      source: "/:locale(en|ko|ja)/company/news",
      destination: "/:locale/news",
    });
    expect(legacyContentRedirects).not.toContainEqual({
      source: "/:locale(en|ko|ja)/company/news/:slug",
      destination: "/:locale/news/:slug",
    });
  });

  it("keeps the redirect list scoped to public content categories", () => {
    expect(legacyContentRedirects).toHaveLength(11);
  });
});
