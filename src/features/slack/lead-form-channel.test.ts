import { afterEach, describe, expect, it, vi } from "vitest";
import { getLeadFormSlackChannel } from "./lead-form-channel";

describe("getLeadFormSlackChannel", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("토큰이 없으면 채널을 반환하지 않는다", () => {
    vi.stubEnv("SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES", "C08JNAZDU5A");

    expect(getLeadFormSlackChannel()).toBeUndefined();
  });

  it("production은 business inquiries 채널을 사용한다", () => {
    vi.stubEnv("SLACK_BOT_OAUTH_TOKEN", "xoxb-test");
    vi.stubEnv("VERCEL_TARGET_ENV", "production");
    vi.stubEnv("SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES", "C08JNAZDU5A");

    expect(getLeadFormSlackChannel()).toBe("C08JNAZDU5A");
  });

  it("staging은 business inquiries env가 있어도 form submission testing 채널을 사용한다", () => {
    vi.stubEnv("SLACK_BOT_OAUTH_TOKEN", "xoxb-test");
    vi.stubEnv("VERCEL_TARGET_ENV", "staging");
    vi.stubEnv("SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES", "C08JNAZDU5A");

    expect(getLeadFormSlackChannel()).toBe("C083Y0300M7");
  });

  it("VERCEL_TARGET_ENV가 없고 VERCEL_ENV가 preview여도 testing 채널을 사용한다", () => {
    vi.stubEnv("SLACK_BOT_OAUTH_TOKEN", "xoxb-test");
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES", "C08JNAZDU5A");

    expect(getLeadFormSlackChannel()).toBe("C083Y0300M7");
  });

  it("non-production 테스트 채널 env가 있으면 그 값을 우선한다", () => {
    vi.stubEnv("SLACK_BOT_OAUTH_TOKEN", "xoxb-test");
    vi.stubEnv("VERCEL_TARGET_ENV", "preview");
    vi.stubEnv("SLACK_CHANNEL_ALERT_WEBSITE_FORM_SUBMISSION_TESTING", "COVERRIDE");

    expect(getLeadFormSlackChannel()).toBe("COVERRIDE");
  });
});
