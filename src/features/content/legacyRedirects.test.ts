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

  it("removes one legacy folder segment from category download URLs", () => {
    expect(legacyContentRedirects).toContainEqual({
      source: "/:locale(en|ko|ja)/blog/:legacyFolder/:slug/download",
      destination: "/:locale/blog/:slug/download",
    });
    expect(legacyContentRedirects).toContainEqual({
      source: "/:locale(en|ko|ja)/whitepapers/:legacyFolder/:slug/download",
      destination: "/:locale/whitepapers/:slug/download",
    });
    expect(legacyContentRedirects).toContainEqual({
      source: "/:locale(en|ko|ja)/demo/use-cases/:legacyFolder/:slug/download",
      destination: "/:locale/demo/use-cases/:slug/download",
    });
  });

  it("maps legacy pdf URLs to current download URLs", () => {
    expect(legacyContentRedirects).toContainEqual({
      source: "/:locale(en|ko|ja)/blog/:legacyFolder/:slug/pdf",
      destination: "/:locale/blog/:slug/download",
    });
    expect(legacyContentRedirects).toContainEqual({
      source: "/:locale(en|ko|ja)/whitepapers/:legacyFolder/:slug/pdf",
      destination: "/:locale/whitepapers/:slug/download",
    });
    expect(legacyContentRedirects).toContainEqual({
      source: "/:locale(en|ko|ja)/demo/use-cases/:legacyFolder/:slug/pdf",
      destination: "/:locale/demo/use-cases/:slug/download",
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
    expect(legacyContentRedirects).toHaveLength(33);
  });
});
