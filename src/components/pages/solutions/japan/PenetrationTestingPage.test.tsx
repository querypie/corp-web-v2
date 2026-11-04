import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PenetrationTestingPage from "./PenetrationTestingPage";

describe("PenetrationTestingPage", () => {
  it("3초마다 다른 검사 경로를 선택하고 언마운트 시 반복을 해제한다", () => {
    vi.useFakeTimers();
    const view = render(<PenetrationTestingPage />);
    try {
      const initial = screen.getByRole("button", { pressed: true });
      act(() => vi.advanceTimersByTime(2999));
      expect(initial).toHaveAttribute("aria-pressed", "true");
      act(() => vi.advanceTimersByTime(1));
      const next = screen.getByRole("button", { pressed: true });
      expect(next).not.toBe(initial);
      act(() => vi.advanceTimersByTime(3000));
      expect(screen.getByRole("button", { pressed: true })).not.toBe(next);
      view.unmount();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      view.unmount();
      vi.useRealTimers();
    }
  });
  it("서비스 소개 5개 섹션과 가격 없는 일본어 문의 동선을 제공한다", () => {
    render(<PenetrationTestingPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("AIが探し、攻撃し、");
    for (const title of ["攻撃経路の探索・検証", "報告から修正・再検証へ", "安全な運用とデータ保護", "実際のサービスでの活用", "ご利用の流れ"]) {
      expect(screen.getByRole("heading", { name: title, level: 2 })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "お問い合わせ" })).toHaveAttribute("href", "/ja/contact-us");
    expect(screen.queryByText(/1,500,000|料金/)).not.toBeInTheDocument();
  });

  it("검사 카드를 선택한다", () => {
    render(<PenetrationTestingPage />);
    const nodes = screen.getAllByRole("button", { pressed: false });
    expect(nodes.length).toBe(29);
    const node = nodes.find(item => item.getAttribute("data-dimmed") === "true")!;
    fireEvent.click(node);
    expect(node).toHaveAttribute("aria-pressed", "true");
    expect(node).toHaveAttribute("data-dimmed", "false");
    expect(nodes.some(item => item.getAttribute("data-dimmed") === "true")).toBe(true);
  });
});
