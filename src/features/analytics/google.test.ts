import { describe, expect, it } from "vitest";
import {
  buildGoogleAnalyticsBootstrapScript,
  buildGoogleAnalyticsPagePath,
} from "./google";

describe("buildGoogleAnalyticsPagePath", () => {
  it("query string이 있으면 page path에 포함한다", () => {
    expect(buildGoogleAnalyticsPagePath("/ko/features/demo", "utm_source=google")).toBe(
      "/ko/features/demo?utm_source=google",
    );
  });

  it("query string이 없으면 pathname만 반환한다", () => {
    expect(buildGoogleAnalyticsPagePath("/en", "")).toBe("/en");
  });
});

describe("buildGoogleAnalyticsBootstrapScript", () => {
  it("GA4 Measurement ID와 수동 page_view 설정을 포함한다", () => {
    const script = buildGoogleAnalyticsBootstrapScript("G-TEST1234");

    expect(script).toContain("window.dataLayer = window.dataLayer || []");
    expect(script).toContain("gtag('config', \"G-TEST1234\", { send_page_view: false })");
  });

  it("쿠키 동의 전 기본 consent는 denied로 설정한다", () => {
    const script = buildGoogleAnalyticsBootstrapScript("G-TEST1234");

    expect(script).toContain("analytics_storage: analyticsGranted ? 'granted' : 'denied'");
    expect(script).toContain("ad_storage: marketingGranted ? 'granted' : 'denied'");
    expect(script).toContain("cookie-preference-event");
    expect(script).toContain("cookie-preference-marketing");
  });
});
