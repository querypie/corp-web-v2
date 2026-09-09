import { beforeEach, describe, expect, it } from "vitest";
import { setLocalePreferenceCookie } from "./localePreference.client";

describe("setLocalePreferenceCookie", () => {
  beforeEach(() => {
    document.cookie = "querypie_locale_preference=; max-age=0; path=/";
  });

  it("사용자가 선택한 locale을 쿠키에 저장한다", () => {
    setLocalePreferenceCookie("ja");

    expect(document.cookie).toContain("querypie_locale_preference=ja");
  });
});
