// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockReadContentItem,
  mockResolveMx,
  mockSlackPostMessage,
} = vi.hoisted(() => ({
  mockReadContentItem: vi.fn(),
  mockResolveMx: vi.fn(),
  mockSlackPostMessage: vi.fn().mockResolvedValue({ ok: true }),
}));

vi.mock("@/features/content/contentState.server", () => ({
  readContentItem: mockReadContentItem,
}));

vi.mock("dns", () => ({
  default: { resolveMx: mockResolveMx },
}));

vi.mock("@slack/web-api", () => {
  class WebClient {
    chat = { postMessage: mockSlackPostMessage };
  }
  return { WebClient };
});

import { POST } from "./route";

function stubMxRecord(valid: boolean) {
  mockResolveMx.mockImplementation(
    (_domain: string, callback: (error: Error | null, addresses: object[]) => void) => {
      valid
        ? callback(null, [{ exchange: "mx.example.com", priority: 10 }])
        : callback(new Error("ENODATA"), []);
    },
  );
}

afterEach(() => {
  vi.clearAllMocks();
  mockSlackPostMessage.mockResolvedValue({ ok: true });
  vi.unstubAllEnvs();
});

const BASE_DOWNLOAD_PAYLOAD = {
  form: { email: "test@example.com", name: "Test User" },
  attachmentUrl: "/documentation/white-papers/doc.pdf",
  attachmentFileName: "doc.pdf",
  returnUrl: "/features/documentation/my-doc",
  pdfPreviewUrl: "/documentation/white-papers/doc.pdf",
};

const BASE_CONTENT_ITEM = {
  bodyHtml: { en: "", ko: "", ja: "" },
  bodyRichText: { en: "", ko: "", ja: "" },
  categorySlug: "white-papers",
  contentType: "content",
  downloadPdfFileName: "server-doc.pdf",
  downloadPdfFileNameByLocale: { en: "", ko: "", ja: "" },
  downloadPdfSrc: "/documentation/white-papers/server-doc.pdf",
  downloadPdfSrcByLocale: { en: "", ko: "", ja: "" },
  enableDownloadButton: true,
  id: "server-doc",
  section: "documentation",
  status: "published",
  title: { en: "Server Doc", ko: "", ja: "" },
  visibleLocales: ["en"],
};

describe("POST /api/downloads/content", () => {
  beforeEach(() => {
    stubMxRecord(true);
  });

  describe("입력 검증", () => {
    it("form이 없으면 400을 반환한다", async () => {
      const request = new Request("http://localhost/api/downloads/content", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json() as { error: string };
      expect(data.error).toBeTruthy();
    });

    it("download 모드에서 attachmentUrl이 없으면 400을 반환한다", async () => {
      const request = new Request("http://localhost/api/downloads/content", {
        method: "POST",
        body: JSON.stringify({
          form: { email: "test@example.com" },
          mode: "download",
          // attachmentUrl 누락
        }),
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("MX 레코드가 없으면 400을 반환한다", async () => {
      vi.useFakeTimers();
      stubMxRecord(false);

      const request = new Request("http://localhost/api/downloads/content", {
        method: "POST",
        body: JSON.stringify(BASE_DOWNLOAD_PAYLOAD),
      });
      const responsePromise = POST(request);
      await vi.runAllTimersAsync();
      const response = await responsePromise;
      vi.useRealTimers();

      expect(response.status).toBe(400);
      const data = await response.json() as { error: string; errorCode: string };
      expect(data.errorCode).toBe("invalid_email");
      expect(data.error).toBe("Please enter a valid email address.");
    });
  });

  describe("다운로드 모드", () => {
    it("성공 시 downloadUrl과 previewUrl을 반환한다", async () => {
      const request = new Request("http://localhost/api/downloads/content", {
        method: "POST",
        body: JSON.stringify(BASE_DOWNLOAD_PAYLOAD),
      });
      const response = await POST(request);
      const data = await response.json() as { downloadUrl: string; previewUrl: string };

      expect(response.status).toBe(200);
      expect(data.downloadUrl).toContain("/api/downloads/file");
      expect(data.downloadUrl).toContain("doc.pdf");
      expect(data.previewUrl).toBe(BASE_DOWNLOAD_PAYLOAD.pdfPreviewUrl);
    });

    it("unlockCookieName이 있으면 쿠키를 설정한다", async () => {
      const request = new Request("http://localhost/api/downloads/content", {
        method: "POST",
        body: JSON.stringify({
          ...BASE_DOWNLOAD_PAYLOAD,
          unlockCookieName: "querypie_content_unlocked_my-item",
        }),
      });
      const response = await POST(request);

      const setCookie = response.headers.get("set-cookie");
      expect(setCookie).toContain("querypie_content_unlocked_my-item=true");
    });

    it("contentId와 section이 있으면 서버의 콘텐츠 메타로 다운로드 URL과 쿠키를 만든다", async () => {
      mockReadContentItem.mockResolvedValue(BASE_CONTENT_ITEM);

      const request = new Request("http://localhost/api/downloads/content", {
        method: "POST",
        body: JSON.stringify({
          ...BASE_DOWNLOAD_PAYLOAD,
          attachmentUrl: "/documentation/white-papers/client-doc.pdf",
          attachmentFileName: "client-doc.pdf",
          contentId: "server-doc",
          section: "documentation",
          unlockCookieName: "querypie_content_unlocked_client-doc",
        }),
      });
      const response = await POST(request);
      const data = await response.json() as { downloadUrl: string };

      expect(response.status).toBe(200);
      expect(data.downloadUrl).toContain("server-doc.pdf");
      expect(data.downloadUrl).not.toContain("client-doc.pdf");
      expect(response.headers.get("set-cookie")).toContain("querypie_content_unlocked_documentation_server-doc=true");
    });

    it("locale별 PDF가 있으면 요청 locale의 파일을 우선 사용한다", async () => {
      mockReadContentItem.mockResolvedValue({
        ...BASE_CONTENT_ITEM,
        downloadPdfFileName: "",
        downloadPdfFileNameByLocale: {
          en: "",
          ko: "",
          ja: "server-doc-ja.pdf",
        },
        downloadPdfSrc: "",
        downloadPdfSrcByLocale: {
          en: "",
          ko: "",
          ja: "/documentation/white-papers/server-doc-ja.pdf",
        },
      });

      const request = new Request("http://localhost/api/downloads/content", {
        method: "POST",
        body: JSON.stringify({
          ...BASE_DOWNLOAD_PAYLOAD,
          contentId: "server-doc",
          locale: "ja",
          section: "documentation",
        }),
      });
      const response = await POST(request);
      const data = await response.json() as { downloadUrl: string; previewUrl: string };

      expect(response.status).toBe(200);
      expect(data.downloadUrl).toContain("server-doc-ja.pdf");
      expect(data.previewUrl).toBe("/documentation/white-papers/server-doc-ja.pdf");
    });

    it("contentId가 가리키는 콘텐츠가 다운로드 불가이면 404를 반환한다", async () => {
      mockReadContentItem.mockResolvedValue({
        ...BASE_CONTENT_ITEM,
        downloadPdfSrc: "",
        enableDownloadButton: false,
      });

      const request = new Request("http://localhost/api/downloads/content", {
        method: "POST",
        body: JSON.stringify({
          ...BASE_DOWNLOAD_PAYLOAD,
          contentId: "server-doc",
          section: "documentation",
        }),
      });
      const response = await POST(request);

      expect(response.status).toBe(404);
    });

    it("Slack 환경변수가 있으면 게이팅 폼 알림을 보낸다", async () => {
      vi.stubEnv("SLACK_BOT_OAUTH_TOKEN", "xoxb-test-token");
      vi.stubEnv("SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES", "C123TEST");
      mockReadContentItem.mockResolvedValue(BASE_CONTENT_ITEM);
      const utmAttribution = encodeURIComponent(JSON.stringify({
        first: { source: "google", landing: "/en/whitepapers", ts: "2026-01-01T00:00:00.000Z" },
        recent: [{
          source: "newsletter",
          medium: "email",
          campaign: "whitepaper",
          content: "hero",
          landing: "/en/whitepapers/test",
          ts: "2026-01-02T00:00:00.000Z",
        }],
      }));

      const request = new Request("http://localhost/api/downloads/content", {
        method: "POST",
        headers: { referer: "https://www.querypie.com/en/whitepapers/test" },
        body: JSON.stringify({
          ...BASE_DOWNLOAD_PAYLOAD,
          contentId: "doc",
          form: {
            company: "QueryPie",
            departmentTitle: "Marketing",
            email: "reader@example.com",
            firstName: "Reader",
            inquiryType: "Request for Product Demo",
            lastName: "Kim",
            marketingConsent: "true",
            plannedImplementationDate: "Within 3 months",
            products: ["AI Platform QueryPie AIP"],
          },
          mode: "unlock",
          referrerURL: "https://www.querypie.com/en/whitepapers/test",
          section: "documentation",
          title: "Test Whitepaper",
          utmAttribution,
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockSlackPostMessage).toHaveBeenCalledOnce();
      const slackPayload = mockSlackPostMessage.mock.calls[0][0] as { text: string; blocks: Array<{ text: { text: string } }> };
      expect(slackPayload.text).toContain("New Gating Form To Unlock Document Received");
      expect(slackPayload.blocks[0].text.text).toContain("New Gating Form To Unlock Document Received(whitepapers)");
      expect(slackPayload.blocks[0].text.text).toContain("GatedContentKey: whitepapers:doc");
      expect(slackPayload.blocks[0].text.text).toContain("Product: AI Platform QueryPie AIP");
      expect(slackPayload.blocks[0].text.text).toContain("MobilePhone");
      expect(slackPayload.blocks[0].text.text).toContain("UTM Source");
      expect(slackPayload.blocks[0].text.text).toContain("newsletter");
      expect(slackPayload.blocks[0].text.text).toContain("UTM Last Landing URL");
      expect(slackPayload.blocks[0].text.text).toContain("RequestURI");
    });
  });

  describe("잠금 해제(unlock) 모드", () => {
    it("attachment 필드 없이도 성공한다", async () => {
      const request = new Request("http://localhost/api/downloads/content", {
        method: "POST",
        body: JSON.stringify({
          form: { email: "test@example.com" },
          mode: "unlock",
        }),
      });
      const response = await POST(request);
      const data = await response.json() as { unlocked: boolean };

      expect(response.status).toBe(200);
      expect(data.unlocked).toBe(true);
    });
  });
});
