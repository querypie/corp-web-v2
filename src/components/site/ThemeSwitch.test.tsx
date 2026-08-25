import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { THEME_STORAGE_KEY } from "@/features/theme/theme";
import ThemeSwitch from "./ThemeSwitch";

function mockMatchMedia(matches: boolean) {
  const addEventListener = vi.fn();
  const removeEventListener = vi.fn();

  vi.stubGlobal("matchMedia", vi.fn().mockImplementation(() => ({
    addEventListener,
    dispatchEvent: vi.fn(),
    matches,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    removeEventListener,
  })));

  return { addEventListener, removeEventListener };
}

describe("ThemeSwitch", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
    mockMatchMedia(false);
  });

  it("시스템, 라이트, 다크 옵션을 표시하고 선택한 테마를 저장한다", async () => {
    render(<ThemeSwitch locale="ko" />);

    const systemTheme = screen.getByRole("radio", { name: "시스템 모드" });
    const lightTheme = screen.getByRole("radio", { name: "라이트 모드" });
    const darkTheme = screen.getByRole("radio", { name: "다크 모드" });
    expect(screen.getByRole("radiogroup", { name: "컬러 테마 선택" })).toBeInTheDocument();
    expect(systemTheme).toBeChecked();
    expect(lightTheme).not.toBeChecked();
    expect(darkTheme).not.toBeChecked();

    fireEvent.click(darkTheme);

    await waitFor(() => {
      expect(darkTheme).toBeChecked();
    });
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

    fireEvent.click(systemTheme);

    await waitFor(() => {
      expect(systemTheme).toBeChecked();
    });
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it("저장값이 없으면 시스템 모드로 표시하고 초기화된 문서 테마를 따른다", async () => {
    document.documentElement.dataset.theme = "dark";
    mockMatchMedia(true);

    render(<ThemeSwitch locale="en" />);

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "System mode" })).toBeChecked();
    });
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("시스템 모드에서는 OS 테마 변경을 반영한다", async () => {
    const { addEventListener } = mockMatchMedia(false);

    render(<ThemeSwitch locale="en" />);

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "System mode" })).toBeChecked();
    });

    const changeHandler = addEventListener.mock.calls.find(([eventName]) => eventName === "change")?.[1];
    expect(changeHandler).toBeTypeOf("function");

    act(() => {
      changeHandler({ matches: true } as MediaQueryListEvent);
    });

    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
