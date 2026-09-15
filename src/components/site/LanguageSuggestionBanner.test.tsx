import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import LanguageSuggestionBanner from "./LanguageSuggestionBanner";

vi.mock("next/navigation", () => ({ usePathname: () => "/en" }));

describe("LanguageSuggestionBanner", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("일본어에서는 추천 요청과 배너를 모두 생략한다", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { container } = render(<LanguageSuggestionBanner currentLocale="ja" />);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(container).toBeEmptyDOMElement();
  });

  it("글로벌 배너는 영어와 한국어 선택지만 제공한다", async () => {
    vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ recommendedLocale: "ko", visible: true }),
    }));
    render(<LanguageSuggestionBanner currentLocale="en" />);
    await screen.findByRole("complementary", { name: "언어 제안" });
    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual(["한국어", "English"]);
  });
});
