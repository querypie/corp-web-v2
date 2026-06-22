import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import PreferenceItem from "./PreferenceItem";
import {
  COOKIE_PREFERENCE_KEYS,
  USER_SELECTED_LOCALE_COOKIE_KEY,
} from "@/features/cookie-preferences/preferences";
import type { CookieCategory } from "@/constants/legal";

const baseItem = {
  description: "Description",
  detail: "Detail",
  status: "optional",
  title: "Performance Cookies",
} satisfies Omit<CookieCategory, "id">;

function clearCookie(key: string) {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

function getCookie(key: string) {
  const cookie = document.cookie
    .split(";")
    .find((item) => item.trim().startsWith(`${key}=`));

  return cookie ? cookie.trim().slice(key.length + 1) : null;
}

describe("PreferenceItem", () => {
  beforeEach(() => {
    [
      COOKIE_PREFERENCE_KEYS.set,
      COOKIE_PREFERENCE_KEYS.performance,
      COOKIE_PREFERENCE_KEYS.functional,
      COOKIE_PREFERENCE_KEYS.analysis,
      COOKIE_PREFERENCE_KEYS.marketing,
      USER_SELECTED_LOCALE_COOKIE_KEY,
    ].forEach(clearCookie);
  });

  it("저장된 운영 쿠키 값을 초기 스위치 상태로 복원한다", async () => {
    document.cookie = `${COOKIE_PREFERENCE_KEYS.performance}=1; path=/`;

    render(<PreferenceItem {...baseItem} id="performance" />);

    await waitFor(() => {
      expect(screen.getByRole("switch", { name: "Performance Cookies" })).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });
  });

  it("토글하면 운영과 같은 쿠키명으로 선호값과 set 플래그를 저장한다", () => {
    render(<PreferenceItem {...baseItem} id="performance" />);

    fireEvent.click(screen.getByRole("switch", { name: "Performance Cookies" }));

    expect(getCookie(COOKIE_PREFERENCE_KEYS.performance)).toBe("1");
    expect(getCookie(COOKIE_PREFERENCE_KEYS.set)).toBe("1");

    fireEvent.click(screen.getByRole("switch", { name: "Performance Cookies" }));

    expect(getCookie(COOKIE_PREFERENCE_KEYS.performance)).toBe("0");
    expect(getCookie(COOKIE_PREFERENCE_KEYS.set)).toBe("1");
  });

  it("기능 쿠키를 끄면 운영처럼 선택 locale 쿠키를 삭제한다", async () => {
    document.cookie = `${COOKIE_PREFERENCE_KEYS.functional}=1; path=/`;
    document.cookie = `${USER_SELECTED_LOCALE_COOKIE_KEY}=ko; path=/`;

    render(<PreferenceItem {...baseItem} id="functional" title="Functional Cookies" />);

    const switchControl = screen.getByRole("switch", { name: "Functional Cookies" });

    await waitFor(() => {
      expect(switchControl).toHaveAttribute("aria-checked", "true");
    });

    fireEvent.click(switchControl);

    expect(getCookie(COOKIE_PREFERENCE_KEYS.functional)).toBe("0");
    expect(getCookie(USER_SELECTED_LOCALE_COOKIE_KEY)).toBeNull();
  });

  it("필수 쿠키는 항상 켜져 있고 비활성화되어 있다", async () => {
    render(
      <PreferenceItem
        description="Required"
        detail="Detail"
        id="necessary"
        status="required"
        title="Strictly Necessary Cookies"
      />,
    );

    const switchControl = screen.getByRole("switch", { name: "Strictly Necessary Cookies" });

    await waitFor(() => {
      expect(switchControl).toHaveAttribute("aria-checked", "true");
    });
    expect(switchControl).toBeDisabled();
  });
});
