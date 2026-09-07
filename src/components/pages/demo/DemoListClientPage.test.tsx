import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DemoListClientPage from "./DemoListClientPage";

describe("DemoListClientPage", () => {
  it("콘텐츠가 없어도 locale별 Demo 카테고리를 노출하고 빈 상태를 표시한다", () => {
    render(
      <DemoListClientPage
        fallbackItems={[]}
        locale="ko"
        selectedCategory="aip-features"
        title="데모"
      />,
    );

    expect(screen.getByRole("link", { name: "전체" })).toHaveAttribute("href", "/ko/demo");
    expect(screen.getByRole("link", { name: "AIP 활용" })).toHaveAttribute("href", "/ko/demo/aip");
    expect(screen.getByRole("link", { name: "ACP 활용" })).toHaveAttribute("href", "/ko/demo/acp");
    expect(screen.queryByRole("link", { name: "활용 사례" })).not.toBeInTheDocument();
    expect(screen.getByText("게시물이 없습니다.")).toBeInTheDocument();
  });
});
