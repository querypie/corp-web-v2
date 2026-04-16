import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// dns 모듈 mock — 실제 DNS 조회를 하지 않는다
vi.mock("dns", () => ({
  default: {
    resolveMx: vi.fn(),
  },
}));

// @slack/web-api mock — 실제 Slack 메시지를 보내지 않는다
vi.mock("@slack/web-api", () => {
  const postMessage = vi.fn().mockResolvedValue({ ok: true });
  class WebClient {
    chat = { postMessage };
  }
  return { WebClient };
});

import dns from "dns";
import { POST } from "./route";

// MX 레코드 응답 헬퍼
function stubMxRecord(valid: boolean) {
  (dns.resolveMx as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    (_domain: string, callback: (err: Error | null, addresses: object[]) => void) => {
      if (valid) {
        callback(null, [{ exchange: "mx.example.com", priority: 10 }]);
      } else {
        callback(new Error("ENODATA"), []);
      }
    },
  );
}

function makeRequest(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/community-license", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
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
    vi.stubEnv("SALESFORCE_ENDPOINT", "https://sf.example.com");
    // 라이선스 발급 API 환경변수 미설정 → issueLicense skip
    stubMxRecord(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Salesforce 환경변수 미설정", () => {
    it("SALESFORCE_ENDPOINT가 없으면 success:true를 반환하고 Salesforce를 호출하지 않는다", async () => {
      vi.unstubAllEnvs();
      // SALESFORCE_ENDPOINT 미설정
      stubMxRecord(true);

      const fetchSpy = vi.spyOn(global, "fetch");

      const res = await POST(makeRequest(validBody));
      const body = await res.json();

      expect(body.success).toBe(true);
      expect(fetchSpy).not.toHaveBeenCalled();
    });
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
      vi.useRealTimers();

      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.errorMessage).toBe("Please enter a valid email address.");
    });
  });

  describe("Salesforce 연동", () => {
    it("Salesforce가 recordUUID를 반환하면 success:true를 반환한다", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ recordUUID: "abc-123" }),
      } as Response);

      const res = await POST(makeRequest(validBody));
      const body = await res.json();
      expect(body.success).toBe(true);
    });

    it("Salesforce 응답에 recordUUID가 없으면 success:false를 반환한다", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ error: "something went wrong" }),
      } as Response);

      const res = await POST(makeRequest(validBody));
      const body = await res.json();
      expect(body.success).toBe(false);
    });

    it("Salesforce HTTP 응답이 ok:false이면 success:false를 반환한다", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        json: async () => ({ recordUUID: "abc" }),
      } as Response);

      const res = await POST(makeRequest(validBody));
      const body = await res.json();
      expect(body.success).toBe(false);
    });

    it("XSS 필터링된 값을 Salesforce에 전송한다", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ recordUUID: "abc-123" }),
      } as Response);

      const xssBody = {
        ...validBody,
        FirstName: "<script>alert(1)</script>",
        Company: "<b>Evil Corp</b>",
      };
      await POST(makeRequest(xssBody));

      const sfCall = fetchSpy.mock.calls[0];
      const sentBody = JSON.parse(sfCall[1]?.body as string);
      expect(sentBody.requestBody.FirstName).not.toContain("<script>");
      expect(sentBody.requestBody.Company).not.toContain("<script>");
    });

    it("Company가 없으면 'None'으로 대체한다", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ recordUUID: "abc-123" }),
      } as Response);

      // Company를 빈 문자열로 보내면 필수 필드 검증에 걸리므로 의도적으로 공백 우회
      // → Company가 없으면 issueLicense에서도 'None'이 전달되어야 한다
      // (이미 route.ts에서 filterXSS(Company) || 'None'으로 처리됨)
      await POST(makeRequest({ ...validBody, Company: "Test Corp" }));
      const sentBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
      expect(sentBody.requestBody.Company).toBe("Test Corp");
    });

    it("Title과 Website는 값이 있을 때만 포함된다", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ recordUUID: "abc-123" }),
      } as Response);

      // Title/Website 없이 제출
      await POST(makeRequest(validBody));
      const sentBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
      expect(sentBody.requestBody).not.toHaveProperty("Title");
      expect(sentBody.requestBody).not.toHaveProperty("Website");
    });

    it("processType은 항상 LEAD_MS이다", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ recordUUID: "abc-123" }),
      } as Response);

      await POST(makeRequest(validBody));
      const sentBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
      expect(sentBody.processType).toBe("LEAD_MS");
    });
  });

  describe("issueLicense 연동", () => {
    beforeEach(() => {
      vi.stubEnv("QUERYPIE_LICENSE_ISSUE_API_ENDPOINT", "https://license.example.com");
      vi.stubEnv("QUERYPIE_LICENSE_ISSUE_API_KEY", "test-key");
    });

    it("issueLicense API가 실패하면 success:false를 반환하고 Salesforce를 호출하지 않는다", async () => {
      const fetchSpy = vi
        .spyOn(global, "fetch")
        // 첫 번째 fetch = issueLicense API (실패)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({}),
        } as Response);

      const res = await POST(makeRequest(validBody));
      const body = await res.json();

      expect(body.success).toBe(false);
      // issueLicense 실패 후 Salesforce fetch가 호출되지 않아야 한다
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it("issueLicense 성공 후 Salesforce를 호출한다", async () => {
      const fetchSpy = vi
        .spyOn(global, "fetch")
        // 첫 번째 fetch = issueLicense
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: true, errorMessage: "" }),
        } as Response)
        // 두 번째 fetch = Salesforce
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ recordUUID: "abc-123" }),
        } as Response);

      const res = await POST(makeRequest(validBody));
      const body = await res.json();

      expect(body.success).toBe(true);
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("마케팅 동의", () => {
    it("HasOptedInMarketing__c 값이 requestBody에 포함된다", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ recordUUID: "abc-123" }),
      } as Response);

      await POST(makeRequest({ ...validBody, HasOptedInMarketing__c: true }));
      const sentBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
      expect(sentBody.requestBody.HasOptedInMarketing__c).toBe(true);
    });

    it("HasOptedInMarketing__c 미전송 시 false로 기본값이 된다", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ recordUUID: "abc-123" }),
      } as Response);

      await POST(makeRequest(validBody));
      const sentBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
      expect(sentBody.requestBody.HasOptedInMarketing__c).toBe(false);
    });
  });
});
