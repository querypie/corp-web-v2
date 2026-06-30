import { describe, expect, it } from "vitest";

import { withDynamicOgImage } from "./metadata";

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

    expect(metadata.openGraph?.url).toBe("https://www.querypie.com/ko/news/product-update");
    expect(metadata.openGraph?.images).toEqual([
      {
        url: "https://www.querypie.com/api/og?locale=ko&title=QueryPie+news&description=QueryPie+update",
        width: 1600,
        height: 840,
        alt: "QueryPie news",
      },
    ]);
    expect(metadata.twitter?.images).toEqual([
      "https://www.querypie.com/api/og?locale=ko&title=QueryPie+news&description=QueryPie+update",
    ]);
  });

  it("기존 openGraph.url이 있으면 운영 도메인 절대 URL로 반영한다", () => {
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

    expect(metadata.openGraph?.url).toBe("https://www.querypie.com/custom-og-url");
  });

  it("콘텐츠 이미지도 운영 도메인 절대 URL로 반영한다", () => {
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
        url: "https://www.querypie.com/uploads/product-update.webp",
        width: 1600,
        height: 840,
        alt: "Product update",
      },
    ]);
    expect(metadata.twitter?.images).toEqual([
      "https://www.querypie.com/uploads/product-update.webp",
    ]);
  });
});
