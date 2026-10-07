import { describe, expect, it, vi } from "vitest";
import { getHomePageProps } from "./pageData";

vi.mock("@/features/content/contentState.server", () => ({
  readContentState: vi.fn(async () => []),
}));

describe("getHomePageProps", () => {
  it.each(["en", "ko"] as const)("%s 홈은 ACP 히어로와 교차 배치된 앱 3개를 제공한다", async (locale) => {
    const props = await getHomePageProps(locale);

    expect(props.heroVideoSrc).toBe("/assets/pages/home/features/Home-ACP.mp4");
    expect(props.heroPrimaryCtaLabel).toBe(locale === "en" ? "Contact Us" : "문의하기");
    expect(props.heroDescription).toContain("QueryPie ACP");
    expect(props.featureItems.map((item) => item.videoSrc)).toEqual([
      "/assets/pages/home/features/Home-AIP.mp4",
      "/assets/pages/home/features/Home-Lingo.mp4",
      "/assets/pages/home/features/Home-NotePie.mp4",
    ]);
    expect(props.featureItems.map((item, index) => item.reverse ?? index % 2 === 1)).toEqual([
      false, true, false,
    ]);
  });

  it("일본어 홈의 기존 히어로와 앱 데이터는 유지한다", async () => {
    const props = await getHomePageProps("ja");

    expect(props.heroVideoSrc).toBeUndefined();
    expect(props.heroPrimaryCtaLabel).toBe("無料で始める");
    expect(props.heroHeading).toBe("エンタープライズ向け Agentic AI Platform");
    expect(props.heroImageAlt).toBe("QueryPie AI ワークスペースプレビュー");
    expect(props.featureItems.map((item) => item.videoSrc)).toEqual([
      "/assets/pages/home/features/Home-AIP.mp4",
      "/assets/pages/home/features/Home-ACP.mp4",
      "/assets/pages/home/features/Home-Lingo.mp4",
      "/assets/pages/home/features/Home-NotePie.mp4",
    ]);
  });
});
