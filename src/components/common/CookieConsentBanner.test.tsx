import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import CookieConsentBanner from "./CookieConsentBanner";
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

describe("CookieConsentBanner", () => {
  beforeEach(() => {
    [
      COOKIE_PREFERENCE_KEYS.set,
      COOKIE_PREFERENCE_KEYS.performance,
      COOKIE_PREFERENCE_KEYS.functional,
      COOKIE_PREFERENCE_KEYS.analysis,
      COOKIE_PREFERENCE_KEYS.marketing,
    ].forEach(clearCookie);
  });

  it("선호값이 없으면 배너를 보여주고 전체 허용을 저장한다", () => {
    render(<CookieConsentBanner locale="ko" />);

    expect(screen.getAllByRole("button").map((button) => button.textContent)).toEqual([
      "Yes, I accept",
      "Decline",
    ]);
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/ko/privacy-policy",
    );
    expect(screen.getByRole("link", { name: "Cookie Preference" })).toHaveAttribute(
      "href",
      "/ko/cookie-preference",
    );

    fireEvent.click(screen.getByRole("button", { name: "Yes, I accept" }));

    expect(getCookie(COOKIE_PREFERENCE_KEYS.set)).toBe("1");
    expect(getCookie(COOKIE_PREFERENCE_KEYS.functional)).toBe("1");
    expect(getCookie(COOKIE_PREFERENCE_KEYS.performance)).toBe("1");
    expect(getCookie(COOKIE_PREFERENCE_KEYS.analysis)).toBe("1");
    expect(getCookie(COOKIE_PREFERENCE_KEYS.marketing)).toBe("1");
    expect(screen.queryByRole("complementary", { name: "쿠키 설정" })).not.toBeInTheDocument();
  });

  it("거부하면 비필수 쿠키를 모두 끄고 배너를 닫는다", () => {
    render(<CookieConsentBanner locale="en" />);

    fireEvent.click(screen.getByRole("button", { name: "Decline" }));

    expect(getCookie(COOKIE_PREFERENCE_KEYS.set)).toBe("1");
    expect(getCookie(COOKIE_PREFERENCE_KEYS.functional)).toBe("0");
    expect(getCookie(COOKIE_PREFERENCE_KEYS.performance)).toBe("0");
    expect(getCookie(COOKIE_PREFERENCE_KEYS.analysis)).toBe("0");
    expect(getCookie(COOKIE_PREFERENCE_KEYS.marketing)).toBe("0");
    expect(screen.queryByRole("complementary", { name: "Cookie preferences" })).not.toBeInTheDocument();
  });

  it("이미 선호값이 저장되어 있으면 배너를 보여주지 않는다", () => {
    document.cookie = `${COOKIE_PREFERENCE_KEYS.set}=1; path=/`;

    render(<CookieConsentBanner locale="ja" />);

    expect(screen.queryByRole("complementary", { name: "Cookie 設定" })).not.toBeInTheDocument();
  });
});
