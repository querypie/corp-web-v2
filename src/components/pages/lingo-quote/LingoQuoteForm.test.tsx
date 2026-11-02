import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getLingoQuotePageCopy, type LingoQuotePageCopy } from "@/copy/lingoQuote";
import LingoQuoteForm from "./LingoQuoteForm";

function fillContact(copy: LingoQuotePageCopy) {
  fireEvent.change(screen.getByRole("textbox", { name: copy.companyLabel }), { target: { value: "Example Company" } });
  fireEvent.change(screen.getByRole("textbox", { name: copy.contactLabel }), { target: { value: "Alex Smith" } });
  fireEvent.change(screen.getByRole("textbox", { name: copy.departmentLabel }), { target: { value: "Sales" } });
  fireEvent.click(screen.getByRole("checkbox", { name: copy.consentLabel }));
}

describe("LingoQuoteForm quantity", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it.each(["ko", "en", "ja"] as const)("updates %s totals when quantity and plan change, and submits the selected quantity", async (locale) => {
    const copy = getLingoQuotePageCopy(locale);
    const fetchMock = vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ code: "INVALID_QUANTITY" }),
    } as Response);
    render(<LingoQuoteForm copy={copy} locale={locale} />);

    const quantity = screen.getByRole("spinbutton", { name: copy.quantityLabel });
    expect(quantity).toHaveValue(1);
    expect(screen.getByLabelText(copy.totalLabel)).toHaveTextContent("396,000");
    fireEvent.change(quantity, { target: { value: "2" } });
    expect(screen.getByLabelText(copy.totalLabel)).toHaveTextContent("792,000");
    expect(screen.getByText("144,000")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox", { name: copy.planLabel }), { target: { value: "production" } });
    expect(screen.getByLabelText(copy.totalLabel)).toHaveTextContent("2,640,000");
    fireEvent.change(quantity, { target: { value: "3" } });
    expect(screen.getByLabelText(copy.totalLabel)).toHaveTextContent("3,960,000");
    expect(screen.getByText("720,000")).toBeInTheDocument();

    fillContact(copy);
    fireEvent.click(screen.getByRole("button", { name: copy.submitLabel }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(JSON.parse(fetchMock.mock.calls[0][1]!.body as string)).toMatchObject({ plan: "production", quantity: 3, locale });
    expect(await screen.findByText(copy.errorQuantity)).toBeInTheDocument();
  });

  it.each(["", "0", "1.5", "1000"])("blocks invalid quantity %j before calling the API", (value) => {
    const copy = getLingoQuotePageCopy("ko");
    render(<LingoQuoteForm copy={copy} locale="ko" />);
    fillContact(copy);
    fireEvent.change(screen.getByRole("spinbutton", { name: copy.quantityLabel }), { target: { value } });
    fireEvent.submit(screen.getByRole("button", { name: copy.submitLabel }).closest("form")!);
    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getByText(copy.errorQuantity)).toBeInTheDocument();
  });
});
