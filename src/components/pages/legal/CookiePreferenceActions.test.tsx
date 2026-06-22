import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import CookiePreferenceActions from "./CookiePreferenceActions";
import { COOKIE_PREFERENCE_KEYS } from "@/features/cookie-preferences/preferences";

function clearCookie(key: string) {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

function getCookie(key: string) {
  const cookie = document.cookie
    .split(";")
    .find((item) => item.trim().startsWith(`${key}=`));

  return cookie ? cookie.trim().slice(key.length + 1) : null;
}

describe("CookiePreferenceActions", () => {
  beforeEach(() => {
    [
      COOKIE_PREFERENCE_KEYS.set,
      COOKIE_PREFERENCE_KEYS.performance,
      COOKIE_PREFERENCE_KEYS.functional,
      COOKIE_PREFERENCE_KEYS.analysis,
      COOKIE_PREFERENCE_KEYS.marketing,
    ].forEach(clearCookie);
  });

  it("전체 허용과 전체 거부를 운영 쿠키명으로 저장한다", () => {
    render(<CookiePreferenceActions acceptLabel="Accept all" declineLabel="Decline all" />);

    fireEvent.click(screen.getByRole("button", { name: "Accept all" }));

    expect(getCookie(COOKIE_PREFERENCE_KEYS.functional)).toBe("1");
    expect(getCookie(COOKIE_PREFERENCE_KEYS.performance)).toBe("1");
    expect(getCookie(COOKIE_PREFERENCE_KEYS.analysis)).toBe("1");
    expect(getCookie(COOKIE_PREFERENCE_KEYS.marketing)).toBe("1");

    fireEvent.click(screen.getByRole("button", { name: "Decline all" }));

    expect(getCookie(COOKIE_PREFERENCE_KEYS.functional)).toBe("0");
    expect(getCookie(COOKIE_PREFERENCE_KEYS.performance)).toBe("0");
    expect(getCookie(COOKIE_PREFERENCE_KEYS.analysis)).toBe("0");
    expect(getCookie(COOKIE_PREFERENCE_KEYS.marketing)).toBe("0");
    expect(getCookie(COOKIE_PREFERENCE_KEYS.set)).toBe("1");
  });
});
