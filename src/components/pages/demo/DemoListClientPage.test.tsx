import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DemoListClientPage from "./DemoListClientPage";

describe("DemoListClientPage", () => {
  it.each(["en", "ko"] as const)("%s ACP도 공통 데모 목록과 콘텐츠 상세 링크를 사용한다", (locale) => {
    const title = locale === "ko" ? "데모" : "Demo";
    const itemTitle = locale === "ko"
      ? "ACP 사용 사례: DAC 데이터 업무를 Skill로 자동화"
      : "ACP Use Case: Automate DAC Data Workflows with Skills";
    const href = `/${locale}/demo/acp/dac-ai-account-review`;
    render(
      <DemoListClientPage
        fallbackItems={[{
          category: "ACP",
          description: "AI Chat",
          href,
          imageSrc: "/demo/acp-features/recordings/dac-ai-chat.webp",
          title: itemTitle,
        }]}
        locale={locale}
        selectedCategory="acp-features"
        title={title}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: new RegExp(itemTitle) })).toHaveAttribute("href", href);
    expect(screen.getByRole("link", {
      name: locale === "ko" ? "AIP 활용" : "AIP Use Cases",
    })).toHaveAttribute("href", `/${locale}/demo/aip`);
    expect(document.querySelector("video")).not.toBeInTheDocument();
  });

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
