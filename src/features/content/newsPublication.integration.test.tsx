// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  notFound: () => { throw new Error("NOT_FOUND"); },
  redirect: () => { throw new Error("REDIRECT"); },
}));
vi.mock("@/components/pages/news/NewsDetailPage", () => ({ default: () => null }));
vi.mock("@/components/pages/news/NewsListClientPage", () => ({ default: () => null }));
vi.mock("@/features/seo/metadata", () => ({ withDynamicOgImage: (metadata: unknown) => metadata }));
vi.mock("@/features/seo/requestUrl.server", () => ({
  getRequestPublicUrl: (path: string) => `https://querypie.ai${path}`,
  getRequestSiteOrigin: () => new URL("https://querypie.ai"),
}));

import NewsDetailRoute, { generateMetadata } from "@/app/[locale]/company/news/[slug]/page";
import NewsListRoute from "@/app/[locale]/company/news/page";
import { createSiteSitemap } from "@/features/seo/sitemap.server";
import { readContentItem } from "./contentState.server";

const slug = "ai-penetration-testing-service-launch";
const params = Promise.resolve({ locale: "ja", slug });
afterEach(() => vi.useRealTimers());

describe("AI pentesting news publication across public surfaces", () => {
  it("opens the cached article on the first request at 08:00 JST", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-05T22:59:59.999Z"));
    // The CMS must retain the complete scheduled entry even before publication.
    expect((await readContentItem("news", slug, { includeBodies: true }))?.publishAt)
      .toBe("2026-11-06T08:00:00+09:00");
    const beforeList = await NewsListRoute({ params });
    expect(beforeList.props.fallbackItems.some((item: { href: string }) => item.href.includes(slug))).toBe(false);
    await expect(NewsDetailRoute({ params })).rejects.toThrow("NOT_FOUND");
    expect(await generateMetadata({ params })).toEqual({});
    expect((await createSiteSitemap(["ja"])).some(item => item.url.includes(slug))).toBe(false);

    vi.setSystemTime(new Date("2026-11-05T23:00:00Z"));
    const afterList = await NewsListRoute({ params });
    expect(afterList.props.fallbackItems[0].href).toContain(slug);
    expect(afterList.props.fallbackItems[0].imageSrc).toBe("/news/ai-pentesting/thumbnail.png");
    const detail = await NewsDetailRoute({ params });
    expect(detail.props.bodyHtml).toContain("■ 代表コメント");
    expect(detail.props.bodyHtml).not.toContain("【会社概要】");
    expect(detail.props.hideHeroImage).toBe(true);
    expect((await generateMetadata({ params })).title).toContain("AIペネトレーションテストサービス");
    expect((await createSiteSitemap(["ja"])).some(item => item.url.endsWith(`/news/${slug}`))).toBe(true);
  });
});
