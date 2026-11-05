import { describe, expect, it, vi } from "vitest";
import { DOCUMENT_LOCALE_HEADER } from "@/features/routing/documentLocale";

const { headersMock } = vi.hoisted(() => ({ headersMock: vi.fn() }));
vi.mock("next/headers", () => ({ headers: headersMock }));
vi.mock("next/font/google", () => ({ JetBrains_Mono: () => ({ variable: "mono" }) }));
vi.mock("next/font/local", () => ({ default: () => ({ variable: "local" }) }));
vi.mock("@vercel/analytics/next", () => ({ Analytics: () => null }));

import RootLayout from "./layout";

describe("루트 HTML의 서버 언어 선언", () => {
  it.each(["ja", "ko", "en"])("스크립트 실행 전부터 lang=%s를 렌더링한다", async (locale) => {
    headersMock.mockResolvedValue(new Headers({ [DOCUMENT_LOCALE_HEADER]: locale }));
    const layout = await RootLayout({ children: null });
    expect(layout.type).toBe("html");
    expect(layout.props.lang).toBe(locale);
  });

  it.each([null, "invalid"])("언어 헤더가 %s이면 기본 언어를 사용한다", async (locale) => {
    headersMock.mockResolvedValue(new Headers(locale ? { [DOCUMENT_LOCALE_HEADER]: locale } : {}));
    const layout = await RootLayout({ children: null });
    expect(layout.props.lang).toBe("en");
  });
});
