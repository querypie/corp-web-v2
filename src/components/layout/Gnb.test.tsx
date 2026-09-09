import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Gnb from "./Gnb";

const routerPush = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ push: routerPush }),
}));

describe("Gnb", () => {
  beforeEach(() => {
    routerPush.mockClear();
    document.cookie = "querypie_locale_preference=; max-age=0; path=/";
  });

  it("상위 메뉴와 데모·자료 팝오버를 요청한 구조로 노출한다", () => {
    render(<Gnb locale="ko" items={["솔루션", "데모", "자료", "회사", "가격 · 플랜"]} />);

    const globalNav = screen.getByRole("navigation", { name: "Global" });
    const topLevelLabels = Array.from(globalNav.children).map(
      (item) => (item.matches("button, a") ? item : item.querySelector(":scope > button, :scope > a"))?.textContent,
    );

    expect(topLevelLabels).toEqual(["솔루션", "데모", "자료", "회사", "가격 · 플랜"]);
    expect(screen.getByRole("link", { name: "AIP 활용" })).toHaveAttribute("href", "/ko/demo/aip");
    expect(screen.getByRole("link", { name: "ACP 활용" })).toHaveAttribute("href", "/ko/demo/acp");
    expect(screen.queryByRole("link", { name: "활용 사례" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "고객의 목소리" })).toHaveAttribute("href", "/ko/voc");
  });

  it("팝오버 메뉴를 누르는 동안 blur가 발생해도 click 전에는 닫히지 않는다", () => {
    render(<Gnb locale="en" />);

    const trigger = screen.getByRole("button", { name: "Solutions" });
    const popoverRoot = trigger.parentElement;

    if (!popoverRoot) {
      throw new Error("Solutions popover root not found");
    }

    fireEvent.mouseEnter(popoverRoot);

    const item = screen.getByRole("link", { name: "AI Platform (AIP)" });
    const popover = item.closest(".absolute");

    expect(popover).toHaveClass("pointer-events-auto");

    fireEvent.pointerDown(item);
    fireEvent.blur(trigger, { relatedTarget: null });

    expect(popover).toHaveClass("pointer-events-auto");

    fireEvent.pointerUp(item);
    fireEvent.click(item, { ctrlKey: true });

    expect(popover).toHaveClass("pointer-events-none");
  });

  it("locale별 공개 메뉴 노출 규칙을 적용한다", () => {
    const { rerender } = render(
      <Gnb locale="en" items={["Solutions", "Demo", "Resource", "Company", "Plans"]} />,
    );

    expect(screen.queryByText("Workplace Productivity | AI Crew")).not.toBeInTheDocument();
    expect(screen.queryByText("AI for Your Service | AI Dashi")).not.toBeInTheDocument();
    expect(screen.getByText("Plans")).toBeInTheDocument();

    rerender(<Gnb locale="ja" items={["ソリューション", "デモ", "リソース", "会社"]} />);

    expect(screen.queryByText("価格・プラン")).not.toBeInTheDocument();
    expect(screen.getAllByText("社内業務効率化｜AI Crew")).not.toHaveLength(0);
    expect(screen.getAllByText("自社サービスAI化｜AI Dashi")).not.toHaveLength(0);
  });

  it("사용자가 선택한 언어를 쿠키에 저장한다", () => {
    render(<Gnb locale="en" />);

    fireEvent.click(screen.getAllByRole("link", { name: "日本語" })[0]);

    expect(document.cookie).toContain("querypie_locale_preference=ja");
    expect(routerPush).toHaveBeenCalledWith("/ja", { scroll: false });
  });
});
