import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ContentPdfActionButton from "./ContentPdfActionButton";

describe("ContentPdfActionButton", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("게이트가 잠겨 있으면 별도 확인 모달 없이 게이팅 폼으로 스크롤한다", async () => {
    const confirmSpy = vi.spyOn(window, "confirm");
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

    fireEvent.click(screen.getByRole("button", { name: "PDF 잠금 해제" }));

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    });
  });

  it("잠금 해제 버튼을 누르면 입력폼 모달을 바로 보여준다", () => {
    render(
      <ContentPdfActionButton
        href="/whitepaper.pdf"
        label="View PDF"
        locale="ko"
        renderUnlockForm={() => <div>Lead form</div>}
        requiresLeadCapture
        unlockCookieName="content-unlocked"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "PDF 잠금 해제" }));

    expect(screen.getByText("독점 콘텐츠를 이용하시려면 양식을 작성해 주세요.")).toHaveClass("text-left");
    expect(screen.getByRole("dialog")).toHaveTextContent("Lead form");
  });

  it("입력폼 모달은 낮은 화면에서도 상하단을 모두 스크롤할 수 있는 구조를 사용한다", () => {
    render(
      <ContentPdfActionButton
        href="/whitepaper.pdf"
        label="View PDF"
        locale="ko"
        renderUnlockForm={() => <div>Lead form</div>}
        requiresLeadCapture
        unlockCookieName="content-unlocked"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "PDF 잠금 해제" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("overflow-y-auto");
    expect(dialog.firstElementChild).toHaveClass("min-h-full", "items-start");
    expect(dialog.firstElementChild?.firstElementChild).toHaveClass("my-auto");
  });

  it("다운로드 입력폼 외곽을 클릭해도 모달을 닫지 않는다", () => {
    render(
      <ContentPdfActionButton
        href="/whitepaper.pdf"
        label="View PDF"
        locale="ko"
        renderUnlockForm={() => <div>Lead form</div>}
        requiresLeadCapture
        unlockCookieName="content-unlocked"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "PDF 잠금 해제" }));
    fireEvent.click(screen.getByRole("dialog"));

    expect(screen.getByRole("dialog")).toHaveTextContent("Lead form");
  });

  it("다운로드 입력폼에 값이 있으면 닫기 전에 확인창을 띄운다", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

    render(
      <ContentPdfActionButton
        href="/whitepaper.pdf"
        label="View PDF"
        locale="ko"
        renderUnlockForm={({ onDirtyChange }) => (
          <input
            aria-label="이름"
            onChange={(event) => onDirtyChange(event.currentTarget.value.length > 0)}
          />
        )}
        requiresLeadCapture
        unlockCookieName="content-unlocked"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "PDF 잠금 해제" }));
    fireEvent.change(screen.getByLabelText("이름"), { target: { value: "Mina" } });
    fireEvent.click(screen.getAllByRole("button", { name: "닫기" }).at(-1)!);

    expect(confirmSpy).toHaveBeenCalledWith("입력한 내용이 있습니다. 제출하지 않고 닫을까요?");
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    confirmSpy.mockReturnValue(true);
    fireEvent.click(screen.getAllByRole("button", { name: "닫기" }).at(-1)!);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
