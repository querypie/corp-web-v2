import type { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import JapanHomePage from "./JapanHomePage";

vi.mock("@/components/sections/Cta", () => ({
  default: () => <div data-testid="cta" />,
}));
vi.mock("../Clients", () => ({
  default: () => <div data-testid="clients" />,
}));
vi.mock("../Hero", () => ({
  default: ({ headingAccessory }: { headingAccessory?: ReactNode }) => (
    <div data-testid="hero">{headingAccessory}</div>
  ),
}));
vi.mock("../News", () => ({
  default: () => <div data-testid="news" />,
}));
vi.mock("../NoticePopover", () => ({
  default: () => <div data-testid="notice" />,
}));
vi.mock("../ResourceList", () => ({
  default: () => <div data-testid="resources" />,
}));
vi.mock("./JapanAxContent", () => ({
  default: () => <div data-testid="ax-content" />,
}));

describe("JapanHomePage", () => {
  it("일본어 홈에 필요한 섹션만 렌더링한다", () => {
    render(
      <JapanHomePage
        clientCaption="導入企業"
        contentListDescription="リソースの説明"
        contentListItems={[]}
        contentListLinks={[]}
        contentListTitle="QueryPie リソース"
        heroDescription="ヒーローの説明"
        heroHeading="ヒーロー"
        heroImageAlt="プレビュー"
        heroPrimaryCtaLabel="無料で始める"
        locale="ja"
        newsItems={[]}
        newsTitle="最新ニュース"
        noticeItems={[]}
      />,
    );

    expect(screen.getAllByTestId(/^(notice|hero|clients|ax-content|resources|news|cta)$/).map((element) => element.dataset.testid)).toEqual([
      "notice",
      "hero",
      "clients",
      "ax-content",
      "resources",
      "news",
      "cta",
    ]);
    const hero = within(screen.getByTestId("hero"));
    const productList = hero.getByRole("list", { name: "QueryPie AI製品" });
    const productImages = hero.getAllByRole("img");

    expect(productList).toHaveClass("hidden", "gap-3", "lg:flex");
    expect(productList).not.toHaveClass("ml-auto");
    expect(productImages.map((image) => image.getAttribute("alt"))).toEqual([
      "AIP",
      "ACP",
      "Lingo",
      "NotePie",
    ]);
    productImages.forEach((image) => expect(image.parentElement).toHaveClass("rounded-[14px]"));
    expect(productImages[0]?.parentElement).not.toHaveClass("home-feature-icon-surface");
    expect(productImages[1]?.parentElement).not.toHaveClass("home-feature-icon-surface");
    expect(productImages[2]?.parentElement).toHaveClass("home-feature-icon-surface", "bg-secondary");
    expect(productImages[3]?.parentElement).toHaveClass("home-feature-icon-surface", "bg-secondary");
  });
});
