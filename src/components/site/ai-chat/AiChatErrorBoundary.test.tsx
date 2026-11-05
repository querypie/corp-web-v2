import { Suspense, lazy } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { aiChatCopy } from "@/copy/aiChat";
import { MAX_DIAGNOSTIC_BYTES } from "@/features/ai-chat/clientDiagnostics";
import AiChatErrorBoundary from "./AiChatErrorBoundary";
import AiChatPanel from "./AiChatPanel";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 })));
  sessionStorage.clear();
});

afterEach(() => {
  cleanup();
  document.querySelectorAll("script[data-diagnostic-test]").forEach((script) => script.remove());
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("채팅 클라이언트 오류 격리", () => {
  it("lazy chunk 로딩 실패를 격리하고 배포 ID와 실패 URL을 자동 전송한다", async () => {
    const script = document.createElement("script");
    script.type = "application/json";
    script.dataset.diagnosticTest = "true";
    script.src = "/_next/static/chunks/webpack.js?dpl=dpl_previous";
    document.head.append(script);
    const url = "https://www.querypie.com/_next/static/chunks/chat.js?token=secret";
    const error = Object.assign(new Error(`Loading chunk 8255 failed. (${url})`), { name: "ChunkLoadError", request: url });
    const Panel = lazy(() => Promise.reject(error));
    render(<>
      <p>홈페이지 본문</p>
      <AiChatErrorBoundary locale="ko" onClose={vi.fn()} open>
        <Suspense fallback={null}><Panel /></Suspense>
      </AiChatErrorBoundary>
    </>);

    expect(await screen.findByRole("alert")).toHaveTextContent(aiChatCopy.ko.openError);
    expect(screen.getByText("홈페이지 본문")).toBeVisible();
    await waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    const [endpoint, options] = vi.mocked(fetch).mock.calls[0];
    expect(endpoint).toBe("/api/ai-chat/client-error");
    expect(options).toMatchObject({ keepalive: true, credentials: "omit" });
    const report = JSON.parse(options!.body as string);
    expect(report).toMatchObject({ name: "ChunkLoadError", locale: "ko", deploymentId: "dpl_previous", failedAsset: url.split("?")[0] });
    expect(options!.body).not.toContain("secret");
  });

  it.each(["en", "ko", "ja"] as const)("%s 패널 effect 예외를 포착하고 실패 안내를 닫을 수 있다", async (locale) => {
    vi.spyOn(HTMLDialogElement.prototype, "showModal").mockImplementation(() => {
      throw new DOMException("Dialog is already open", "InvalidStateError");
    });
    const onClose = vi.fn();
    const { rerender } = render(
      <AiChatErrorBoundary locale={locale} onClose={onClose} open>
        <AiChatPanel locale={locale} onClose={onClose} open />
      </AiChatErrorBoundary>,
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(aiChatCopy[locale].openError);
    expect(screen.getByRole("button", { name: aiChatCopy[locale].reload })).toBeVisible();
    await waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    expect(JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string)).toMatchObject({ name: "InvalidStateError" });
    fireEvent.click(screen.getByRole("button", { name: aiChatCopy[locale].close }));
    expect(onClose).toHaveBeenCalledOnce();
    rerender(<AiChatErrorBoundary locale={locale} onClose={onClose} open={false}><div /></AiChatErrorBoundary>);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("진단 전송이 실패해도 복구 안내를 계속 표시한다", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Offline"));
    function BrokenPanel(): never { throw new Error("Panel initialization failed"); }
    render(<AiChatErrorBoundary locale="ko" onClose={vi.fn()} open><BrokenPanel /></AiChatErrorBoundary>);
    await waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    expect(screen.getByRole("alert")).toHaveTextContent(aiChatCopy.ko.openError);
  });

  it("긴 다국어 stack도 서버의 바이트 제한 안에서 전송한다", async () => {
    function BrokenPanel(): never {
      const error = new Error("오류".repeat(300));
      error.stack = "Error\n" + "한".repeat(3000);
      throw error;
    }
    render(<AiChatErrorBoundary locale="ko" onClose={vi.fn()} open><BrokenPanel /></AiChatErrorBoundary>);
    await waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    const payload = vi.mocked(fetch).mock.calls[0][1]!.body as string;
    expect(new TextEncoder().encode(payload).byteLength).toBeLessThanOrEqual(MAX_DIAGNOSTIC_BYTES);
    expect(JSON.parse(payload).stack).not.toBe("");
  });
});
