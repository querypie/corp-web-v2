import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("dns", () => ({
  default: { resolveMx: vi.fn() },
}));

const postMessageMock = vi.fn().mockResolvedValue({ ok: true });
vi.mock("@slack/web-api", () => {
  class WebClient {
    chat = { postMessage: postMessageMock };
  }
  return { WebClient };
});

vi.mock("next/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/server")>();
  return {
    ...actual,
    after: (callback: () => void | Promise<void>) => {
      void callback();
    },
  };
});

import dns from "dns";
import { POST } from "./route";

function stubMxRecord(valid: boolean) {
  (dns.resolveMx as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    (_domain: string, callback: (err: Error | null, addresses: object[]) => void) => {
      valid
        ? callback(null, [{ exchange: "mx.example.com", priority: 10 }])
        : callback(new Error("ENODATA"), []);
    },
  );
}

function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/contact-us", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      referer: "https://www.querypie.com/ko/company/contact-us",
    },
    body: JSON.stringify(body),
  });
}

const validBody = {
  firstName: "Gildong",
  lastName: "Hong",
  email: "gildong@example.com",
  company: "Test Corp",
  departmentTitle: "Engineering",
  inquiryType: "Request for Product Demo",
  plannedImplementationDate: "Within 3 months",
  products: ["AI Platform QueryPie AIP"],
  message: "I have a question.",
  marketingConsent: false,
  referrerURL: "https://www.querypie.com/ko/company/contact-us",
};

function stubDeskPieEnv() {
  vi.stubEnv("DESKPIE_LEAD_API_ENDPOINT", "https://api.deskpie.example/api/v1/public/leads");
  vi.stubEnv("DESKPIE_LEAD_API_KEY", "deskpie-key");
}

function mockDeskPieFetch() {
  return vi.spyOn(global, "fetch").mockImplementation(async (input) => {
    const url = String(input);
    if (url === "https://api.deskpie.example/api/v1/public/leads") {
      return { ok: true, json: async () => ({ leadId: "lead-123" }) } as Response;
    }
    throw new Error(`unexpected fetch ${url}`);
  });
}

function findDeskPieCall(fetchSpy: ReturnType<typeof mockDeskPieFetch>) {
  return fetchSpy.mock.calls.find(([url]) => url === "https://api.deskpie.example/api/v1/public/leads");
}

describe("POST /api/contact-us", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("SLACK_BOT_OAUTH_TOKEN", "xoxb-test-token");
    vi.stubEnv("SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES", "C123TEST");
    stubMxRecord(true);
  });

  afterEach(() => {
    postMessageMock.mockReset();
    postMessageMock.mockResolvedValue({ ok: true });
    vi.restoreAllMocks();
  });

  describe("서버 설정 검증", () => {
    it("SLACK_BOT_OAUTH_TOKEN 미설정 시에도 success:true를 반환한다", async () => {
      vi.unstubAllEnvs();
      vi.stubEnv("SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES", "C123TEST");

      const res = await POST(makeRequest(validBody));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(postMessageMock).not.toHaveBeenCalled();
    });

    it("SLACK_CHANNEL 미설정 시에도 success:true를 반환한다", async () => {
      vi.unstubAllEnvs();
      vi.stubEnv("SLACK_BOT_OAUTH_TOKEN", "xoxb-test");

      const res = await POST(makeRequest(validBody));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(postMessageMock).not.toHaveBeenCalled();
    });
  });

  describe("입력 검증", () => {
    it("firstName 누락 시 400을 반환한다", async () => {
      const { firstName: _, ...rest } = validBody;
      const res = await POST(makeRequest(rest));
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.errorCode).toBe("missing_required_fields");
    });

    it("departmentTitle 누락 시 400을 반환한다", async () => {
      const { departmentTitle: _, ...rest } = validBody;
      const res = await POST(makeRequest(rest));
      expect(res.status).toBe(400);
    });

    it("lastName 누락 시 400을 반환한다", async () => {
      const { lastName: _, ...rest } = validBody;
      const res = await POST(makeRequest(rest));
      expect(res.status).toBe(400);
    });

    it("email 누락 시 400을 반환한다", async () => {
      const { email: _, ...rest } = validBody;
      const res = await POST(makeRequest(rest));
      expect(res.status).toBe(400);
    });

    it("company 누락 시 400을 반환한다", async () => {
      const { company: _, ...rest } = validBody;
      const res = await POST(makeRequest(rest));
      expect(res.status).toBe(400);
    });
  });

  describe("MX 레코드 검증", () => {
    it("MX 레코드가 없으면 success:false와 errorMessage를 반환한다", async () => {
      vi.useFakeTimers();
      stubMxRecord(false);

      const resPromise = POST(makeRequest(validBody));
      await vi.runAllTimersAsync();
      const res = await resPromise;
      vi.useRealTimers();

      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.errorCode).toBe("invalid_email");
      expect(body.errorMessage).toBe("Please enter a valid email address.");
    });
  });

  describe("Slack best-effort 알림", () => {
    it("Slack 성공 시 success:true를 반환한다", async () => {
      const res = await POST(makeRequest(validBody));
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(postMessageMock).toHaveBeenCalledOnce();
      const slackPayload = postMessageMock.mock.calls[0][0] as { blocks: Array<{ text: { text: string } }> };
      expect(slackPayload.blocks[0].text.text).toContain("New Contact Sales Received(contact-us)");
      expect(slackPayload.blocks[0].text.text).toContain("RequestURI");
      expect(slackPayload.blocks[0].text.text).toContain("https://www.querypie.com/ko/company/contact-us");
    });

    it("Slack 실패 시에도 success:true를 반환한다", async () => {
      postMessageMock.mockRejectedValueOnce(new Error("Slack down"));

      const res = await POST(makeRequest(validBody));
      const body = await res.json();
      expect(body.success).toBe(true);
    });
  });

  describe("DeskPie Lead API best-effort", () => {
    it("DeskPie env가 있으면 기존 Salesforce-style payload를 after hook으로 전송한다", async () => {
      stubDeskPieEnv();
      const fetchSpy = mockDeskPieFetch();

      const res = await POST(makeRequest({ ...validBody, phoneNumber: "01012345678" }));

      expect(res.status).toBe(200);
      await vi.waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledWith(
          "https://api.deskpie.example/api/v1/public/leads",
          expect.objectContaining({ method: "POST" }),
        );
      });
      const deskPieCall = findDeskPieCall(fetchSpy);
      expect(deskPieCall?.[1]?.headers).toMatchObject({
        "content-type": "application/json",
        "X-API-KEY": "deskpie-key",
      });
      const sent = JSON.parse(deskPieCall?.[1]?.body as string);
      expect(sent.processType).toBe("LEAD_MS");
      expect(sent.requestBody.MobilePhone).toBe("01012345678");
      expect(sent.requestBody.Objective__c).toBe("Request for Product Demo");
      expect(sent.requestBody.Description).toContain("Product: AI Platform QueryPie AIP");
      expect(sent.requestBody.Description).toContain("PlannedImplementationDate: Within 3 months");
    });

    it("DeskPie endpoint와 API key가 모두 없으면 DeskPie를 호출하지 않는다", async () => {
      const fetchSpy = vi.spyOn(global, "fetch");

      const res = await POST(makeRequest(validBody));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("DeskPie endpoint만 있으면 DeskPie를 호출하지 않는다", async () => {
      vi.stubEnv("DESKPIE_LEAD_API_ENDPOINT", "https://api.deskpie.example/api/v1/public/leads");
      const fetchSpy = vi.spyOn(global, "fetch");

      const res = await POST(makeRequest(validBody));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("DeskPie API key만 있으면 DeskPie를 호출하지 않는다", async () => {
      vi.stubEnv("DESKPIE_LEAD_API_KEY", "deskpie-key");
      const fetchSpy = vi.spyOn(global, "fetch");

      const res = await POST(makeRequest(validBody));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("DeskPie network 실패는 Contact Us 성공 응답을 막지 않는다", async () => {
      stubDeskPieEnv();
      vi.spyOn(global, "fetch").mockImplementation(async (input) => {
        const url = String(input);
        if (url === "https://api.deskpie.example/api/v1/public/leads") {
          throw new Error("DeskPie down");
        }
        throw new Error(`unexpected fetch ${url}`);
      });

      const res = await POST(makeRequest(validBody));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
    });

    it("DeskPie HTTP 실패도 Contact Us 성공 응답을 막지 않는다", async () => {
      stubDeskPieEnv();
      vi.spyOn(global, "fetch").mockImplementation(async (input) => {
        const url = String(input);
        if (url === "https://api.deskpie.example/api/v1/public/leads") {
          return { ok: false, status: 500, json: async () => ({}) } as Response;
        }
        throw new Error(`unexpected fetch ${url}`);
      });

      const res = await POST(makeRequest(validBody));
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
    });
  });

  describe("DeskPie payload 필드 매핑", () => {
    beforeEach(() => {
      stubDeskPieEnv();
    });

    it("processType은 항상 LEAD_MS이다", async () => {
      const fetchSpy = mockDeskPieFetch();

      await POST(makeRequest(validBody));
      const sent = JSON.parse(findDeskPieCall(fetchSpy)?.[1]?.body as string);
      expect(sent.processType).toBe("LEAD_MS");
    });

    it("products와 plannedImplementationDate가 Description 필드로 합산된다", async () => {
      const fetchSpy = mockDeskPieFetch();

      await POST(makeRequest(validBody));
      const sent = JSON.parse(findDeskPieCall(fetchSpy)?.[1]?.body as string);
      expect(sent.requestBody.Description).toContain("Product:");
      expect(sent.requestBody.Description).toContain("PlannedImplementationDate:");
      expect(sent.requestBody).not.toHaveProperty("products");
      expect(sent.requestBody).not.toHaveProperty("plannedImplementationDate");
    });

    it("inquiryType은 Objective__c로 매핑된다", async () => {
      const fetchSpy = mockDeskPieFetch();

      await POST(makeRequest(validBody));
      const sent = JSON.parse(findDeskPieCall(fetchSpy)?.[1]?.body as string);
      expect(sent.requestBody.Objective__c).toBe("Request for Product Demo");
    });

    it("message는 Questions__c로 매핑된다", async () => {
      const fetchSpy = mockDeskPieFetch();

      await POST(makeRequest(validBody));
      const sent = JSON.parse(findDeskPieCall(fetchSpy)?.[1]?.body as string);
      expect(sent.requestBody.Questions__c).toBe("I have a question.");
    });

    it("UTM 쿠키가 포함되면 pi__ 필드가 requestBody에 추가된다", async () => {
      const fetchSpy = mockDeskPieFetch();

      const attribution = {
        first: { landing: "/en/", ts: "2026-01-01T00:00:00Z" },
        recent: [{ source: "linkedin", medium: "paid", landing: "/en/contact", ts: "2026-03-01T00:00:00Z" }],
      };
      const utmAttribution = encodeURIComponent(JSON.stringify(attribution));

      await POST(makeRequest({ ...validBody, utmAttribution }));
      const sent = JSON.parse(findDeskPieCall(fetchSpy)?.[1]?.body as string);
      expect(sent.requestBody["pi__utm_source__c"]).toBe("linkedin");
      expect(sent.requestBody["pi__utm_medium__c"]).toBe("paid");
      expect(sent.requestBody["pi__first_touch_url__c"]).toBe("/en/");
    });

    it("XSS 페이로드는 필터링된다", async () => {
      const fetchSpy = mockDeskPieFetch();

      await POST(makeRequest({ ...validBody, firstName: "<script>alert(1)</script>" }));
      const sent = JSON.parse(findDeskPieCall(fetchSpy)?.[1]?.body as string);
      expect(sent.requestBody.FirstName).not.toContain("<script>");
    });

    it("company 값이 주어지면 Company로 매핑된다", async () => {
      const fetchSpy = mockDeskPieFetch();

      await POST(makeRequest({ ...validBody, company: "Acme Corp" }));
      const sent = JSON.parse(findDeskPieCall(fetchSpy)?.[1]?.body as string);
      expect(sent.requestBody.Company).toBe("Acme Corp");
    });

    it("marketingConsent는 HasOptedInMarketing__c로 매핑된다", async () => {
      const fetchSpy = mockDeskPieFetch();

      await POST(makeRequest({ ...validBody, marketingConsent: true }));
      const sent = JSON.parse(findDeskPieCall(fetchSpy)?.[1]?.body as string);
      expect(sent.requestBody.HasOptedInMarketing__c).toBe(true);
    });

    it("phoneNumber가 있으면 MobilePhone으로 매핑된다", async () => {
      const fetchSpy = mockDeskPieFetch();

      await POST(makeRequest({ ...validBody, phoneNumber: "+82-10-1234-5678" }));
      const sent = JSON.parse(findDeskPieCall(fetchSpy)?.[1]?.body as string);
      expect(sent.requestBody.MobilePhone).toBe("+82-10-1234-5678");
    });

    it("phoneNumber가 없으면 MobilePhone 필드를 포함하지 않는다", async () => {
      const fetchSpy = mockDeskPieFetch();

      const { phoneNumber: _, ...bodyWithoutPhone } = { ...validBody, phoneNumber: undefined };
      await POST(makeRequest(bodyWithoutPhone));
      const sent = JSON.parse(findDeskPieCall(fetchSpy)?.[1]?.body as string);
      expect(sent.requestBody).not.toHaveProperty("MobilePhone");
    });
  });
});
