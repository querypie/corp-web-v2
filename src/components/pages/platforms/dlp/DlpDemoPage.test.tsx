import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DlpDemoPage from "./DlpDemoPage";

describe("DlpDemoPage", () => {
  it("현재 언어의 영상 버튼으로 튜토리얼을 열고 닫는다", () => {
    render(
      <DlpDemoPage
        demoUrl="about:blank"
        locale="ko"
        tutorialUrl="about:blank"
      />,
    );

    expect(screen.getByTitle("DLP demo")).toHaveAttribute("src", "about:blank");

    fireEvent.click(screen.getByRole("button", { name: "DLP 데모 영상" }));

    expect(screen.getByRole("dialog", { name: "DLP 데모 영상" })).toBeInTheDocument();
    expect(screen.getByTitle("DLP 데모 영상")).toHaveAttribute("src", "about:blank");

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    expect(screen.queryByRole("dialog", { name: "DLP 데모 영상" })).not.toBeInTheDocument();
  });
});
