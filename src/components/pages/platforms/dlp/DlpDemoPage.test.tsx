import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DlpDemoPage from "./DlpDemoPage";

describe("DlpDemoPage", () => {
  it("영상 버튼 없이 현재 언어의 데모만 전체 화면에 표시한다", () => {
    render(<DlpDemoPage demoUrl="about:blank" locale="ko" />);

    expect(screen.getByTitle("DLP 탐지 데모")).toHaveAttribute("src", "about:blank");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
