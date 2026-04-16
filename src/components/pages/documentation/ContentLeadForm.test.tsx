import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getContactPageCopy } from "@/features/contact/copy";
import ContentLeadForm from "./ContentLeadForm";

const contactCopy = getContactPageCopy("en");

// 필수 필드(required=true)를 모두 채운 최소 폼 데이터
function fillRequiredFields() {
  const requiredFields = contactCopy.formFields.filter((f) => f.required);
  for (const field of requiredFields) {
    const input = document.querySelector(`[name="${field.name}"]`) as HTMLInputElement | HTMLSelectElement | null;
    if (!input) continue;
    if (input.tagName === "SELECT") {
      const options = Array.from(input.querySelectorAll("option")).filter((o) => !o.disabled);
      if (options[0]) fireEvent.change(input, { target: { value: options[0].value } });
    } else {
      fireEvent.change(input, { target: { value: "Test Value" } });
    }
  }
  // 제품 옵션 중 하나 체크
  const firstProductCheckbox = document.querySelector(`[name="product:${contactCopy.productOptions[0]}"]`) as HTMLInputElement | null;
  if (firstProductCheckbox) {
    fireEvent.click(firstProductCheckbox);
  }
}

describe("ContentLeadForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.spyOn(window, "open").mockReturnValue(
      { location: { href: "" }, close: vi.fn() } as unknown as WindowProxy,
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("폼 필드와 제출 버튼을 렌더링한다", () => {
    render(
      <ContentLeadForm
        contactCopy={contactCopy}
        locale="en"
        mode="download"
        title="Test Doc"
      />,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
    // 필수 텍스트 필드 중 하나(First Name) 존재 확인
    expect(document.querySelector('[name="firstName"]')).toBeInTheDocument();
  });

  it("필수 필드가 비어 있으면 제출 버튼이 비활성화된다", () => {
    render(
      <ContentLeadForm
        contactCopy={contactCopy}
        locale="en"
        mode="download"
        title="Test Doc"
      />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("필수 필드를 모두 채우면 제출 버튼이 활성화된다", () => {
    render(
      <ContentLeadForm
        contactCopy={contactCopy}
        locale="en"
        mode="download"
        title="Test Doc"
      />,
    );
    fillRequiredFields();
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("API 실패 시 에러 메시지를 표시한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "server error" }),
    } as unknown as Response);

    render(
      <ContentLeadForm
        contactCopy={contactCopy}
        locale="en"
        mode="download"
        attachmentUrl="/uploads/doc.pdf"
        attachmentFileName="doc.pdf"
        returnUrl="/features/documentation/my-doc"
        pdfPreviewUrl="/uploads/doc-preview.pdf"
        title="Test Doc"
      />,
    );
    fillRequiredFields();
    fireEvent.submit(screen.getByRole("button").closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/couldn't prepare/i)).toBeInTheDocument();
    });
  });

  it("unlock 모드에서 성공 시 onSuccess 콜백을 호출한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ unlocked: true }),
    } as unknown as Response);

    const onSuccess = vi.fn();
    render(
      <ContentLeadForm
        contactCopy={contactCopy}
        locale="en"
        mode="unlock"
        title="Test Doc"
        onSuccess={onSuccess}
      />,
    );
    fillRequiredFields();
    fireEvent.submit(screen.getByRole("button").closest("form")!);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce();
    });
  });

  it("제출 중에는 버튼에 처리 중 텍스트를 표시한다", async () => {
    // fetch가 즉시 resolve되지 않도록 보류 (never-resolving promise)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(fetch).mockReturnValue(new Promise<any>(() => {}));

    render(
      <ContentLeadForm
        contactCopy={contactCopy}
        locale="en"
        mode="download"
        title="Test Doc"
      />,
    );
    fillRequiredFields();
    fireEvent.submit(screen.getByRole("button").closest("form")!);

    await waitFor(() => {
      expect(screen.getByRole("button").textContent).toContain("Preparing");
    });
  });

  it("ko locale이면 에러 메시지가 한국어로 표시된다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "server error" }),
    } as unknown as Response);

    const koCopy = getContactPageCopy("ko");
    render(
      <ContentLeadForm
        contactCopy={koCopy}
        locale="ko"
        mode="download"
        attachmentUrl="/uploads/doc.pdf"
        attachmentFileName="doc.pdf"
        returnUrl="/features/documentation/my-doc"
        pdfPreviewUrl="/uploads/doc-preview.pdf"
        title="테스트 문서"
      />,
    );
    fillRequiredFields();
    fireEvent.submit(screen.getByRole("button").closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/준비하지 못했습니다/)).toBeInTheDocument();
    });
  });
});
