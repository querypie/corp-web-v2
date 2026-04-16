import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getContactPageCopy } from "@/features/contact/copy";
import ContactForm from "./ContactForm";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/features/utm/utm", () => ({
  readUtmCookie: vi.fn().mockReturnValue(undefined),
  default: vi.fn(),
}));

const contactCopy = getContactPageCopy("en");

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
  const firstProductCheckbox = document.querySelector(`[name="product:${contactCopy.productOptions[0]}"]`) as HTMLInputElement | null;
  if (firstProductCheckbox) {
    fireEvent.click(firstProductCheckbox);
  }
  const messageField = document.querySelector('[name="message"]') as HTMLTextAreaElement | null;
  if (messageField && contactCopy.messageField.required) {
    fireEvent.change(messageField, { target: { value: "Test message" } });
  }
}

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    pushMock.mockClear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("폼 필드와 제출 버튼을 렌더링한다", () => {
    render(
      <ContactForm
        {...contactCopy}
        locale="en"
      />,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(document.querySelector('[name="firstName"]')).toBeInTheDocument();
  });

  it("필수 필드가 비어 있으면 제출 버튼이 비활성화된다", () => {
    render(
      <ContactForm
        {...contactCopy}
        locale="en"
      />,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("필수 필드 + 제품 선택 후 제출 버튼이 활성화된다", () => {
    render(
      <ContactForm
        {...contactCopy}
        locale="en"
      />,
    );
    fillRequiredFields();
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("제출 시 /api/contact-us로 POST 요청을 보낸다", async () => {
    const fetchMock = vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as unknown as Response);

    render(
      <ContactForm
        {...contactCopy}
        locale="en"
      />,
    );
    fillRequiredFields();
    fireEvent.submit(screen.getByRole("button").closest("form")!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/contact-us",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });
  });

  it("제출 중에는 버튼에 '...'을 표시한다", async () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

    render(
      <ContactForm
        {...contactCopy}
        locale="en"
      />,
    );
    fillRequiredFields();
    fireEvent.submit(screen.getByRole("button").closest("form")!);

    await waitFor(() => {
      expect(screen.getByRole("button").textContent).toBe("...");
    });
  });

  it("API { success: true } → 성공 화면에 successTitle이 표시된다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as unknown as Response);

    render(
      <ContactForm
        {...contactCopy}
        locale="en"
      />,
    );
    fillRequiredFields();
    fireEvent.submit(screen.getByRole("button").closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(contactCopy.successTitle)).toBeInTheDocument();
    });
  });

  it("성공 화면에서 버튼 클릭 시 router.push가 호출된다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as unknown as Response);

    render(
      <ContactForm
        {...contactCopy}
        locale="en"
      />,
    );
    fillRequiredFields();
    fireEvent.submit(screen.getByRole("button").closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(contactCopy.successButton)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(contactCopy.successButton));
    expect(pushMock).toHaveBeenCalled();
  });

  it("API { success: false, errorMessage: 'custom error' } → errorMessage가 표시된다", async () => {
    const customError = "Custom error message";
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, errorMessage: customError }),
    } as unknown as Response);

    render(
      <ContactForm
        {...contactCopy}
        locale="en"
      />,
    );
    fillRequiredFields();
    fireEvent.submit(screen.getByRole("button").closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(customError)).toBeInTheDocument();
    });
  });

  it("API { success: false } (errorMessage 없음) → errorGeneral이 표시된다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: false }),
    } as unknown as Response);

    render(
      <ContactForm
        {...contactCopy}
        locale="en"
      />,
    );
    fillRequiredFields();
    fireEvent.submit(screen.getByRole("button").closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(contactCopy.errorGeneral)).toBeInTheDocument();
    });
  });

  it("fetch 예외 발생 → errorGeneral이 표시된다", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

    render(
      <ContactForm
        {...contactCopy}
        locale="en"
      />,
    );
    fillRequiredFields();
    fireEvent.submit(screen.getByRole("button").closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(contactCopy.errorGeneral)).toBeInTheDocument();
    });
  });
});
