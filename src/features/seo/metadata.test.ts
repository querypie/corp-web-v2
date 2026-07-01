import { describe, expect, it } from "vitest";

import { withDynamicOgImage } from "./metadata";
import { ogImageCacheVersion } from "./ogImageConfig";

describe("withDynamicOgImage", () => {
  it("canonical URL을 og:url로 반영한다", () => {
    const metadata = withDynamicOgImage(
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
      },
    );

    expect(metadata.openGraph?.url).toBe("/ko/news/product-update");
    expect(metadata.openGraph?.images).toEqual([
      {
        url: `/api/og?locale=ko&title=QueryPie+news&v=${ogImageCacheVersion}&description=QueryPie+update`,
        width: 1200,
        height: 630,
        alt: "QueryPie news",
      },
    ]);
    expect(metadata.twitter?.images).toEqual([
      `/api/og?locale=ko&title=QueryPie+news&v=${ogImageCacheVersion}&description=QueryPie+update`,
    ]);
  });

  it("기존 openGraph.url이 있으면 덮어쓰지 않는다", () => {
    const metadata = withDynamicOgImage(
      {
        alternates: {
          canonical: "/ko/news/product-update",
        },
        openGraph: {
          url: "/custom-og-url",
        },
      },
      {
        locale: "ko",
        title: "QueryPie news",
      },
    );

    expect(metadata.openGraph?.url).toBe("/custom-og-url");
  });

  it("콘텐츠 이미지를 OG image로 반영한다", () => {
    const metadata = withDynamicOgImage(
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
