import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { aiChatCopy } from "@/copy/aiChat";
import { readPreviewSession } from "@/features/ai-chat/previewSession";
import AiChatPanel from "./AiChatPanel";

const reply = { answer: "공식 문서를 바탕으로 한 답변입니다.", answered: true, sources: [{ title: "AIP 공식 문서", url: "https://aip-docs.app.querypie.com/ko" }] };
const response = () => new Response(JSON.stringify(reply), { headers: { "Content-Type": "application/json" } });

describe("AI 제품 상담", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response()));
    vi.spyOn(HTMLDialogElement.prototype, "showModal").mockImplementation(function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    });
    vi.spyOn(HTMLDialogElement.prototype, "close").mockImplementation(function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it.each(["en", "ko", "ja"] as const)("%s 문구와 기본 채팅 컨트롤을 표시한다", (locale) => {
    render(<AiChatPanel locale={locale} onClose={vi.fn()} open />);
    const copy = aiChatCopy[locale];
    expect(screen.getByRole("dialog", { name: copy.title })).toHaveAttribute("lang", locale);
    expect(screen.getByRole("textbox", { name: copy.placeholder })).toBeVisible();
    expect(screen.getByRole("button", { name: copy.send })).toBeDisabled();
    expect(screen.getByRole("button", { name: copy.reset })).toHaveAttribute("title", copy.reset);
    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(document.querySelector('input[type="file"]')).toBeNull();
  });

  it("빈 메시지를 막고 실제 API 답변과 검증된 출처를 표시한다", async () => {
    render(<AiChatPanel locale="ko" onClose={vi.fn()} open />);
    const input = screen.getByRole("textbox");
    const send = screen.getByRole("button", { name: aiChatCopy.ko.send });
    fireEvent.change(input, { target: { value: "   " } });
    expect(send).toBeDisabled();
    fireEvent.change(input, { target: { value: "AIP와 Lingo의 차이는 무엇인가요?" } });
    fireEvent.click(send);
    expect(screen.getByText("AIP와 Lingo의 차이는 무엇인가요?")).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent(aiChatCopy.ko.loading);
    expect(send).toBeDisabled();
    expect(await screen.findByText(reply.answer)).toBeVisible();
    expect(screen.getByRole("link", { name: "AIP 공식 문서" })).toHaveAttribute("href", reply.sources[0].url);
    expect(input).toHaveValue("");
    expect(fetch).toHaveBeenCalledOnce();
    expect(JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string)).toEqual({ locale: "ko", messages: [{ role: "user", content: "AIP와 Lingo의 차이는 무엇인가요?" }] });
  });

  it("한·일 IME 조합과 Shift+Enter로는 전송하지 않고 Enter로만 전송한다", async () => {
    render(<AiChatPanel locale="ja" onClose={vi.fn()} open />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "製品について" } });
    fireEvent.keyDown(input, { key: "Enter", isComposing: true });
    fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: true });
    expect(input).toHaveValue("製品について");
    expect(screen.queryByText(aiChatCopy.ja.unavailable)).not.toBeInTheDocument();
    fireEvent.keyDown(input, { key: "Enter" });
    expect(input).toHaveValue("");
    expect(screen.getByText("製品について")).toBeVisible();
    await screen.findByText(reply.answer);
  });

  it("페이지·언어 변경 후에도 이 탭의 메시지와 초안을 복원한다", async () => {
    const { unmount } = render(<AiChatPanel locale="ko" onClose={vi.fn()} open />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "NotePie 소개" } });
    fireEvent.click(screen.getByRole("button", { name: aiChatCopy.ko.send }));
    await screen.findByText(reply.answer);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "추가 질문" } });
    unmount();
    render(<AiChatPanel locale="en" onClose={vi.fn()} open />);
    expect(screen.getByText("NotePie 소개")).toHaveAttribute("lang", "ko");
    expect(screen.getByRole("textbox")).toHaveValue("추가 질문");
    expect(screen.getByText(reply.answer)).toBeVisible();
  });

  it("초기화하면 대화·초안·저장된 세션을 비우고 입력창에 포커스를 둔다", async () => {
    const onClose = vi.fn();
    const { unmount } = render(<AiChatPanel locale="ko" onClose={onClose} open />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "AIP 소개" } });
    fireEvent.click(screen.getByRole("button", { name: aiChatCopy.ko.send }));
    await screen.findByText(reply.answer);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "작성 중인 질문" } });
    fireEvent.click(screen.getByRole("button", { name: aiChatCopy.ko.reset }));

    expect(screen.queryByText("AIP 소개")).not.toBeInTheDocument();
    expect(screen.getByText(aiChatCopy.ko.heading)).toBeVisible();
    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(screen.getByRole("textbox")).toHaveFocus();
    expect(readPreviewSession()).toEqual({ draft: "", messages: [] });
    expect(onClose).not.toHaveBeenCalled();

    unmount();
    render(<AiChatPanel locale="ko" onClose={onClose} open />);
    expect(screen.getByText(aiChatCopy.ko.heading)).toBeVisible();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("연결 실패 시 질문을 입력창에 복원하고 재전송할 수 있게 한다", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network unavailable"));
    render(<AiChatPanel locale="ko" onClose={vi.fn()} open />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Lingo 지원 언어" } });
    fireEvent.click(screen.getByRole("button", { name: aiChatCopy.ko.send }));
    expect(await screen.findByRole("alert")).toHaveTextContent(aiChatCopy.ko.error);
    expect(screen.getByRole("textbox")).toHaveValue("Lingo 지원 언어");
    expect(screen.getByRole("button", { name: aiChatCopy.ko.send })).toBeEnabled();
  });

  it("초기화 이후 늦게 도착한 응답이 새 대화에 들어오지 않는다", async () => {
    let resolve!: (value: ReturnType<typeof response>) => void;
    vi.mocked(fetch).mockReturnValueOnce(new Promise((done) => { resolve = done; }) as Promise<Response>);
    render(<AiChatPanel locale="ko" onClose={vi.fn()} open />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "AIP 소개" } });
    fireEvent.click(screen.getByRole("button", { name: aiChatCopy.ko.send }));
    fireEvent.click(screen.getByRole("button", { name: aiChatCopy.ko.reset }));
    await act(async () => { resolve(response()); });
    expect(screen.queryByText(reply.answer)).not.toBeInTheDocument();
    expect(screen.getByText(aiChatCopy.ko.heading)).toBeVisible();
    expect(readPreviewSession()).toEqual({ draft: "", messages: [] });
  });

  it("닫기와 Escape를 처리하고 닫힌 뒤 페이지 스크롤을 복원한다", () => {
    document.body.style.overflow = "auto";
    const onClose = vi.fn();
    const { rerender } = render(<AiChatPanel locale="ko" onClose={onClose} open />);
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(screen.getByRole("button", { name: aiChatCopy.ko.close }));
    expect(onClose).toHaveBeenCalledOnce();
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { bubbles: false, cancelable: true }));
    expect(onClose).toHaveBeenCalledTimes(2);
    rerender(<AiChatPanel locale="ko" onClose={onClose} open={false} />);
    expect(document.body.style.overflow).toBe("auto");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
