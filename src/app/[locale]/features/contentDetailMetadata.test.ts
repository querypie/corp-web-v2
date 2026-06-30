import { describe, expect, it, vi } from "vitest";

import { createLocalizedContent, type ManagedContentEntry } from "@/features/content/data";

const mockReadContentItem = vi.fn();

vi.mock("@/features/content/contentState.server", () => ({
  readContentItem: mockReadContentItem,
  readContentState: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
  redirect: vi.fn(),
}));

function makeEntry(overrides: Partial<ManagedContentEntry> = {}): ManagedContentEntry {
  return {
    authorName: "QueryPie",
    authorRole: "",
    bodyHtml: createLocalizedContent("<p>body</p>"),
    bodyRichText: createLocalizedContent("{}"),
    categorySlug: "blogs",
    contentType: "content",
    dateIso: "2026-01-01",
    downloadCoverImageSrc: "",
    downloadPdfFileName: "",
    downloadPdfFileNameByLocale: createLocalizedContent(),
    downloadPdfSrc: "",
    downloadPdfSrcByLocale: createLocalizedContent(),
    enableDownloadButton: false,
    externalUrl: "",
    gatingLevel: "none",
    hideHeroImage: false,
    id: "security-guide",
    imageSrc: "/images/content/security-guide.webp",
    relatedIds: [],
    section: "documentation",
    sortOrder: 0,
    status: "published",
    summary: createLocalizedContent("Summary"),
    title: createLocalizedContent("Security Guide"),
    visibleLocales: ["en", "ko", "ja"],
    ...overrides,
  };
}

describe("content detail metadata", () => {
  it("documentation 상세 OG image에 콘텐츠 섬네일을 사용한다", async () => {
    const { generateMetadata } = await import("./documentation/[slug]/page");
    mockReadContentItem.mockResolvedValueOnce(makeEntry());

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en", slug: "security-guide" }),
    });

    expect(metadata.openGraph?.images).toEqual([
      {
        url: "/uploads/security-guide.webp",
        width: 1600,
        height: 840,
        alt: "Security Guide",
      },
    ]);
    expect(metadata.openGraph?.url).toBe("/en/blog/security-guide");
    expect(metadata.twitter?.images).toEqual(["/uploads/security-guide.webp"]);
  });

  it("demo 상세 OG image에 콘텐츠 섬네일을 사용한다", async () => {
    const { generateMetadata } = await import("./demo/[slug]/page");
    mockReadContentItem.mockResolvedValueOnce(makeEntry({
      categorySlug: "use-cases",
      id: "aip-demo",
      imageSrc: "/demo/aip-thumbnail.webp",
      section: "demo",
      title: createLocalizedContent("AIP Demo"),
    }));

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en", slug: "aip-demo" }),
    });

    expect(metadata.openGraph?.images).toEqual([
      {
        url: "/demo/aip-thumbnail.webp",
        width: 1600,
        height: 840,
        alt: "AIP Demo",
      },
    ]);
    expect(metadata.openGraph?.url).toBe("/en/demo/use-cases/aip-demo");
    expect(metadata.twitter?.images).toEqual(["/demo/aip-thumbnail.webp"]);
  });
});
