import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const slackPostMessage = vi.hoisted(() => vi.fn().mockResolvedValue({ ok: true }));

vi.mock("dns", () => ({
  default: {
    resolveMx: vi.fn(),
  },
}));

vi.mock("@slack/web-api", () => {
  class WebClient {
    chat = { postMessage: slackPostMessage };
  }
  return { WebClient };
});

import dns from "dns";
import { POST } from "./route";

function stubMxRecord(valid: boolean) {
  (dns.resolveMx as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    (_domain: string, callback: (err: Error | null, addresses: object[]) => void) => {
      if (valid) {
        callback(null, [{ exchange: "mx.example.com", priority: 10 }]);
        return;
      }

      callback(new Error("ENODATA"), []);
    },
  );
}

function makeRequest(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/community-license", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    referrer: headers.Referer ?? headers.referer,
    body: JSON.stringify(body),
  });
}

const validBody = {
  FirstName: "Gildong",
  LastName: "Hong",
  Email: "gildong@example.com",
  Company: "Test Corp",
};

describe("POST /api/community-license", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("SLACK_BOT_OAUTH_TOKEN", "test-slack-token");
    vi.stubEnv("SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES", "C123");
    slackPostMessage.mockClear();
    stubMxRecord(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("입력 검증", () => {
    it("FirstName 누락 시 400을 반환한다", async () => {
      const res = await POST(makeRequest({ LastName: "Hong", Email: "a@b.com", Company: "Co" }));
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
    });

    it("Email 누락 시 400을 반환한다", async () => {
      const res = await POST(
        makeRequest({ FirstName: "Gil", LastName: "Hong", Company: "Co" }),
      );
      expect(res.status).toBe(400);
    });

    it("Company 누락 시 400을 반환한다", async () => {
      const res = await POST(
        makeRequest({ FirstName: "Gil", LastName: "Hong", Email: "a@b.com" }),
      );
      expect(res.status).toBe(400);
    });
  });

  describe("MX 레코드 검증", () => {
    it("MX 레코드가 없는 이메일이면 success:false와 errorMessage를 반환한다", async () => {
      vi.useFakeTimers();
      stubMxRecord(false);

      const resPromise = POST(makeRequest(validBody));
      await vi.runAllTimersAsync();
      const res = await resPromise;

      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.errorMessage).toBe("Please enter a valid email address.");
    });
  });

  describe("Slack 연동", () => {
    it("유효한 신청이면 success:true를 반환하고 Slack 메시지를 보낸다", async () => {
      const fetchSpy = vi.spyOn(global, "fetch");

      const res = await POST(
        makeRequest(validBody, {
          Referer: "https://www.querypie.com/querypie/license/community/apply",
        }),
      );
      const body = await res.json();

      expect(body.success).toBe(true);
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(slackPostMessage).toHaveBeenCalledTimes(1);
      expect(slackPostMessage.mock.calls[0][0].channel).toBe("C123");
      expect(slackPostMessage.mock.calls[0][0].blocks[0].text.text).toContain(
        "New Request QueryPie Community License Received",
      );
      expect(slackPostMessage.mock.calls[0][0].blocks[0].text.text).toContain(
        "*RequestURI*:",
      );
    });

    it("XSS 필터링된 값을 Slack에 전송한다", async () => {
      await POST(
        makeRequest({
          ...validBody,
          FirstName: "<script>alert(1)</script>",
          Company: "<b>Evil Corp</b>",
        }),
      );

      const text = slackPostMessage.mock.calls[0][0].blocks[0].text.text as string;
      expect(text).not.toContain("<script>");
      expect(text).toContain("Evil Corp");
    });

    it("Title과 Website는 값이 있을 때만 Slack 메시지에 포함된다", async () => {
      await POST(makeRequest(validBody));
      const textWithoutOptional = slackPostMessage.mock.calls[0][0].blocks[0].text.text as string;
      expect(textWithoutOptional).not.toContain("*Title*");
      expect(textWithoutOptional).not.toContain("*Website*");

      slackPostMessage.mockClear();

      await POST(
        makeRequest({
          ...validBody,
          Title: "Security Engineer",
          Website: "https://example.com",
        }),
      );
      const textWithOptional = slackPostMessage.mock.calls[0][0].blocks[0].text.text as string;
      expect(textWithOptional).toContain("*Title*: Security Engineer");
      expect(textWithOptional).toContain("*Website*: https://example.com");
    });

    it("Slack 환경변수가 없으면 Slack 전송 없이 success:true를 반환한다", async () => {
      vi.unstubAllEnvs();
      stubMxRecord(true);

      const res = await POST(makeRequest(validBody));
      const body = await res.json();

      expect(body.success).toBe(true);
      expect(slackPostMessage).not.toHaveBeenCalled();
    });
  });

  describe("issueLicense 연동", () => {
    beforeEach(() => {
      vi.stubEnv("DESKPIE_COMMUNITY_LICENSE_API_ENDPOINT", "https://license.example.com");
      vi.stubEnv("PUBLIC_API_KEY", "test-key");
    });

    it("issueLicense API가 실패하면 success:false를 반환하고 Slack을 호출하지 않는다", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      } as Response);

      const res = await POST(makeRequest(validBody));
      const body = await res.json();

      expect(body.success).toBe(false);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(slackPostMessage).not.toHaveBeenCalled();
    });

    it("issueLicense 성공 후 Slack 메시지를 보내고 success:true를 반환한다", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ licenseId: "license-id", customerCompanyId: "company-id" }),
      } as Response);

      const res = await POST(makeRequest(validBody));
      const body = await res.json();

      expect(body.success).toBe(true);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(slackPostMessage).toHaveBeenCalledTimes(1);
    });
  });

  describe("마케팅 동의", () => {
    it("marketingConsent 값은 Slack 표시 항목에서 제외된다", async () => {
      await POST(makeRequest({ ...validBody, marketingConsent: true }));

      const text = slackPostMessage.mock.calls[0][0].blocks[0].text.text as string;
      expect(text).not.toContain("Marketing Consent");
    });
  });
});
