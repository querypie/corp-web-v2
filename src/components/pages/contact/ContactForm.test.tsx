import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { aruProductLabels, getContactPageCopy } from "@/copy/contact";
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

function fillRequiredFields(copy = contactCopy) {
  const requiredFields = copy.formFields.filter((f) => f.required);
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
  const firstProductCheckbox = document.querySelector(`[name="product:${copy.productOptions[0]}"]`) as HTMLInputElement | null;
  if (firstProductCheckbox && !firstProductCheckbox.checked) {
    fireEvent.click(firstProductCheckbox);
  }
  const messageField = document.querySelector('[name="message"]') as HTMLTextAreaElement | null;
  if (messageField && copy.messageField.required) {
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

  it.each(["en", "ko", "ja"] as const)("%s 폼 첫 번째에 Aru를 표시하며 일반 방문 시 선택하지 않는다", (locale) => {
    render(<ContactForm {...getContactPageCopy(locale)} locale={locale} />);
    const products = screen.getAllByRole("checkbox");
    expect(products[0]).toHaveAccessibleName(aruProductLabels[locale]);
    expect(products[0]).not.toBeChecked();
  });

  it.each(["en", "ko", "ja"] as const)("%s 기본 선택된 Aru는 해제하거나 다른 제품과 함께 선택할 수 있다", (locale) => {
    const copy = getContactPageCopy(locale);
    render(<ContactForm {...copy} initialProducts={[aruProductLabels[locale]]} locale={locale} />);
    const aru = screen.getByRole("checkbox", { name: aruProductLabels[locale] });
    const lingo = screen.getByRole("checkbox", { name: copy.productOptions[1] });
    expect(aru).toBeChecked();
    expect(lingo).not.toBeChecked();
    fireEvent.click(lingo);
    expect(aru).toBeChecked();
    expect(lingo).toBeChecked();
    fireEvent.click(aru);
    expect(aru).not.toBeChecked();
  });

  it.each(["en", "ko", "ja"] as const)("%s Aru 기본 선택 상태로 제출하면 제품명과 유입 URL을 API로 전달한다", async (locale) => {
    const fetchMock = vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ success: true }) } as Response);
    const copy = getContactPageCopy(locale);
    render(<ContactForm {...copy} initialProducts={[aruProductLabels[locale]]} locale={locale} />);
    fillRequiredFields(copy);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const payload = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(payload.products).toEqual([aruProductLabels[locale]]);
    expect(payload.referrerURL).toBe(window.location.href);
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

  it("submit 버튼 클릭 시 /api/contact-us로 POST 요청을 보낸다", async () => {
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
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/contact-us",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    const payload = JSON.parse(fetchMock.mock.calls[0][1]?.body as string) as Record<string, unknown>;
    expect(payload.referrerURL).toBe(window.location.href);
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

  it("API가 invalid_email errorCode를 반환하면 사용자 친화적인 다국어 메시지를 표시한다", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, errorCode: "invalid_email" }),
    } as unknown as Response);

    const koCopy = getContactPageCopy("ko");
    render(
      <ContactForm
        {...koCopy}
        locale="ko"
      />,
    );
    fillRequiredFields(koCopy);
    fireEvent.submit(screen.getByRole("button").closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/이메일 주소를 확인해 주세요/)).toBeInTheDocument();
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

  it("fetch 예외 발생 → 네트워크 오류 메시지가 표시된다", async () => {
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
      expect(screen.getByText(/couldn't connect to the server/i)).toBeInTheDocument();
    });
  });

  it.each(["en", "ko", "ja"] as const)("%s 빈 500 응답은 서버 오류로 표시한다", async (locale) => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 500 }));
    const copy = getContactPageCopy(locale);
    render(<ContactForm {...copy} locale={locale} />);
    fillRequiredFields(copy);
    fireEvent.submit(screen.getByRole("button").closest("form")!);
    const messages = {
      en: /temporary server issue/,
      ko: /일시적인 서버 문제로 문의를 제출하지 못했습니다/,
      ja: /一時的なサーバーの問題/,
    };
    await waitFor(() => expect(screen.getByText(messages[locale])).toBeInTheDocument());
  });
});
