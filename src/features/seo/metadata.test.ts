import { describe, expect, it, vi } from "vitest";

import { withDynamicOgImage } from "./metadata";
import { ogImageCacheVersion } from "./ogImageConfig";

vi.mock("next/headers", () => ({
  headers: async () => new Headers({
    host: "stage-v2.querypie.ai",
    "x-forwarded-proto": "https",
  }),
}));

describe("withDynamicOgImage", () => {
  it("현재 일본어 사이트 URL을 canonical과 og:url로 반영한다", async () => {
    const metadata = await withDynamicOgImage(
      {
        title: "QueryPie news",
        alternates: {
          canonical: "/ja/news/product-update",
        },
      },
      {
        locale: "ja",
        title: "QueryPie news",
        description: "QueryPie update",
      },
    );

    expect(metadata.alternates?.canonical).toBe("https://stage-v2.querypie.ai/news/product-update");
    expect(metadata.openGraph?.url).toBe("https://stage-v2.querypie.ai/news/product-update");
    expect(metadata.openGraph?.images).toEqual([
      {
        url: `/api/og?locale=ja&title=QueryPie+news&v=${ogImageCacheVersion}&description=QueryPie+update`,
        width: 1200,
        height: 630,
        alt: "QueryPie news",
      },
    ]);
    expect(metadata.twitter?.images).toEqual([
      `/api/og?locale=ja&title=QueryPie+news&v=${ogImageCacheVersion}&description=QueryPie+update`,
    ]);
  });

  it("기존 openGraph 경로를 유지하면서 현재 사이트 도메인을 적용한다", async () => {
    const metadata = await withDynamicOgImage(
      {
        alternates: {
          canonical: "/ko/news/product-update",
        },
        openGraph: {
          url: "https://www.querypie.com/custom-og-url",
        },
      },
      {
        locale: "ko",
        title: "QueryPie news",
      },
    );

    expect(metadata.openGraph?.url).toBe("https://stage-v2.querypie.ai/custom-og-url");
  });

  it("콘텐츠 이미지를 OG image로 반영한다", async () => {
    const metadata = await withDynamicOgImage(
      {
        title: "QueryPie news",
        alternates: {
          canonical: "/ko/news/product-update",
        },
      },
      {
        locale: "ko",
        title: "QueryPie news",
        description: "QueryPie update",
        image: {
          url: "/uploads/product-update.webp",
          alt: "Product update",
        },
      },
    );

    expect(metadata.openGraph?.images).toEqual([
      {
        url: "/uploads/product-update.webp",
        width: 1200,
        height: 630,
        alt: "Product update",
      },
    ]);
    expect(metadata.twitter?.images).toEqual([
      "/uploads/product-update.webp",
    ]);
  });
});
