import { describe, expect, it } from "vitest";
import {
  buildGoogleAnalyticsBootstrapScript,
  buildGoogleAnalyticsPagePath,
  getGoogleAnalyticsMeasurementId,
  JAPAN_GOOGLE_ANALYTICS_ID,
} from "./google";

describe("getGoogleAnalyticsMeasurementId", () => {
  it.each(["querypie.ai", "www.querypie.ai", "stage-v2.querypie.ai"])(
    "%s에서는 Japan 스트림으로 전송한다",
    (hostname) => {
      expect(getGoogleAnalyticsMeasurementId(hostname, "G-GLOBAL")).toBe(JAPAN_GOOGLE_ANALYTICS_ID);
    },
  );

  it.each(["www.querypie.com", "querypie.com", "localhost", "querypie.ai.example.com"])(
    "%s에서는 기존 Global 설정을 유지한다",
    (hostname) => {
      expect(getGoogleAnalyticsMeasurementId(hostname, "G-GLOBAL")).toBe("G-GLOBAL");
    },
  );

  it("Japan ID는 별도로 지정할 수 있고 Global ID가 없어도 동작한다", () => {
    expect(getGoogleAnalyticsMeasurementId("querypie.ai", "", "G-JAPAN")).toBe("G-JAPAN");
    expect(getGoogleAnalyticsMeasurementId("www.querypie.com", "", "G-JAPAN")).toBe("");
  });
});

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
