import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ContentPdfActionButton from "./ContentPdfActionButton";

describe("ContentPdfActionButton", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("게이트가 잠겨 있으면 native confirm 대신 커스텀 확인 모달을 보여준다", () => {
    const confirmSpy = vi.spyOn(window, "confirm");

    render(
      <ContentPdfActionButton
        formTargetId="content-gate-form"
        href="/whitepaper.pdf"
        label="View PDF"
        locale="ko"
        requiresUnlock
        unlockCookieName="content-unlocked"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "View PDF" }));

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toHaveTextContent("독점 콘텐츠를 이용하시려면 양식을 작성해 주세요!");
  });

  it("확인을 누르면 게이팅 폼으로 스크롤한다", async () => {
    const scrollIntoView = vi.fn();
    const target = document.createElement("div");
    target.id = "content-gate-form";
    target.scrollIntoView = scrollIntoView;
    document.body.appendChild(target);

    render(
      <ContentPdfActionButton
        formTargetId="content-gate-form"
        href="/whitepaper.pdf"
        label="View PDF"
        locale="ko"
        requiresUnlock
        unlockCookieName="content-unlocked"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "View PDF" }));
    fireEvent.click(screen.getByRole("button", { name: "확인" }));

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    });
  });
});
