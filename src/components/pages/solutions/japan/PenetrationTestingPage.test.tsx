import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PenetrationTestingPage from "./PenetrationTestingPage";
import { pentestProcessCopy } from "@/copy/pentestProcess";
import { pentestLocalizedMockCopy } from "@/copy/penetrationTestingLocalized";
import { pentestDeliverablesCopy } from "@/copy/pentestDeliverables";
import { pentestCaseStudyCopy } from "@/copy/pentestCaseStudy";

describe("PenetrationTestingPage", () => {
  it.each(["ko", "en", "ja"] as const)("%s에서 에이전트 프로세스와 반복 검증을 설명한다", locale => {
    render(<PenetrationTestingPage locale={locale} />);
    const copy = pentestProcessCopy[locale];
    const diagram = screen.getByRole("figure", { name: copy.label });
    const steps = within(diagram).getAllByRole("listitem");
    expect(steps).toHaveLength(3);
    copy.steps.forEach((step, index) => {
      expect(within(steps[index]).getByRole("heading", { name: step.agent })).toBeInTheDocument();
      expect(within(steps[index]).getByText(step.body)).toBeInTheDocument();
    });
    expect(within(diagram).getByText(copy.loopBody)).toBeInTheDocument();
  });
  it.each(["ko", "en", "ja"] as const)("%s 확대 목업 위에 전체 지도와 현재 영역을 항상 보여준다", locale => {
    render(<PenetrationTestingPage locale={locale} />);
    const copy = pentestLocalizedMockCopy[locale];
    const overview = screen.getByRole("complementary", { name: copy.overview });
    expect(within(overview).getByText(copy.viewport)).toBeInTheDocument();
    expect(within(overview).getByRole("img")).toBeInTheDocument();
    expect(within(overview).queryByRole("button")).not.toBeInTheDocument();
    expect(within(screen.getByRole("region", { name: copy.title })).getAllByRole("button")).toHaveLength(30);
  });
  it("3초마다 다른 검사 경로를 선택하고 언마운트 시 반복을 해제한다", () => {
    vi.useFakeTimers();
    const view = render(<PenetrationTestingPage />);
    try {
      const initial = screen.getByRole("button", { pressed: true });
      act(() => vi.advanceTimersByTime(2999));
      expect(initial).toHaveAttribute("aria-pressed", "true");
      act(() => vi.advanceTimersByTime(1));
      expect(screen.getByRole("button", { pressed: true })).not.toBe(initial);
      view.unmount();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      view.unmount();
      vi.useRealTimers();
    }
  });
  it.each(["ko", "en", "ja"] as const)("%s 결과물 설명과 간결한 취약점 보고서를 제공한다", locale => {
    render(<PenetrationTestingPage locale={locale} />);
    const copy = pentestDeliverablesCopy[locale];
    expect(screen.getByRole("heading", { name: copy.title, level: 2 })).toBeInTheDocument();
    const mockup = screen.getByRole("figure", { name: copy.sample });
    expect(within(mockup).getAllByRole("row")).toHaveLength(7);
    copy.findings.forEach(finding => expect(within(mockup).getByText(finding)).toBeInTheDocument());
    expect(within(mockup).getByRole("columnheader", { name: copy.statusLabel })).toBeInTheDocument();
    Object.values(copy.statuses).forEach(status => expect(within(within(mockup).getByRole("table")).getAllByText(status)).toHaveLength(2));
    expect(within(mockup).queryByRole("button")).not.toBeInTheDocument();
    expect(within(mockup).queryByText("AI Pentesting")).not.toBeInTheDocument();
    expect(screen.queryByText("SAST")).not.toBeInTheDocument();
  });
  it("확대 화면의 검사 카드를 선택한다", () => {
    render(<PenetrationTestingPage />);
    const nodes = screen.getAllByRole("button", { pressed: false });
    expect(nodes).toHaveLength(29);
    const node = nodes.find(item => item.getAttribute("data-dimmed") === "true")!;
    fireEvent.click(node);
    expect(node).toHaveAttribute("aria-pressed", "true");
    expect(node).toHaveAttribute("data-dimmed", "false");
  });
  it.each(["ko", "en", "ja"] as const)("%s 실제 검증 사례에서 완료 조치와 대응 방안을 구분한다", locale => {
    render(<PenetrationTestingPage locale={locale} />);
    const copy = pentestCaseStudyCopy[locale];
    const section = screen.getByRole("heading", { name: copy.title }).closest("section")!;
    expect(within(section).getAllByRole("article")).toHaveLength(3);
    expect(within(section).getByText(copy.description)).toBeInTheDocument();
    expect(within(section).getAllByText(copy.visual.completed)).toHaveLength(2);
    expect(within(section).getByText(copy.visual.proposed)).toBeInTheDocument();
  });
  it("검증 결과와 실제 사례, 가격 없는 일본어 문의 동선을 제공한다", () => {
    render(<PenetrationTestingPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("AIが探し、攻撃し、");
    for (const title of [pentestDeliverablesCopy.ja.title, pentestCaseStudyCopy.ja.title]) {
      expect(screen.getByRole("heading", { name: title, level: 2 })).toBeInTheDocument();
    }
    for (const title of ["ご利用の流れ", "報告から修正・再検証へ", "安全な運用とデータ保護", "実際のサービスでの活用"]) {
      expect(screen.queryByRole("heading", { name: title, level: 2 })).not.toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "お問い合わせ" })).toHaveAttribute("href", "/ja/contact-us?inquiry=ai-consulting&product=penetrationtest");
    expect(screen.getByRole("link", { name: "お問い合わせ" })).not.toHaveAttribute("target");
    expect(screen.queryByText(/1,500,000|料金/)).not.toBeInTheDocument();
  });

});
