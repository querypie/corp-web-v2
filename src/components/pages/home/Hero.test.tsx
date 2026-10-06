import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { homeHeroCopyByLocale } from "@/copy/home";
import Hero from "./Hero";

vi.mock("@/components/mockups/aip/AipMockupShell", () => ({
  default: () => <div data-testid="aip-mockup" />,
}));

describe("Hero", () => {
  it.each(["en", "ko"] as const)("%s 히어로는 목업 대신 ACP 영상을 표시한다", (locale) => {
    const copy = homeHeroCopyByLocale[locale];
    render(
      <Hero
        ctaLabel="Free start!"
        description={copy.heroDescription}
        heroHeading={copy.heroHeading}
        imageAlt={copy.heroImageAlt}
        locale={locale}
        videoSrc={copy.heroVideoSrc}
      />,
    );

    expect(screen.getByRole("heading", { name: copy.heroHeading })).toBeInTheDocument();
    expect(screen.queryByTestId("aip-mockup")).not.toBeInTheDocument();
    const video = document.querySelector("video")!;
    expect(video).toHaveAttribute("src", `${copy.heroVideoSrc}#t=0.001`);
    expect(video).toHaveAttribute("aria-label", copy.heroImageAlt);
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");
    expect(video.muted).toBe(true);
    expect(screen.getByRole("link", { name: "Free start!" })).toHaveAttribute(
      "href",
      `https://docs.querypie.com/${locale}/installation/querypie-acp-community-edition`,
    );
  });

  it("일본어 히어로는 기존 목업과 시작 링크를 유지한다", () => {
    render(
      <Hero
        ctaLabel="無料で始める"
        description="説明"
        heroHeading="ヒーロー"
        imageAlt="プレビュー"
        locale="ja"
      />,
    );

    expect(screen.getAllByTestId("aip-mockup")).toHaveLength(2);
    expect(document.querySelector("video")).toBeNull();
    expect(screen.getByRole("link", { name: "無料で始める" })).toHaveAttribute(
      "href",
      "https://app.querypie.com/",
    );
  });
});
