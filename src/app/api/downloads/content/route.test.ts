// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockExistsSync, mockMkdir, mockReadFile, mockWriteFile } = vi.hoisted(() => ({
  mockExistsSync: vi.fn(),
  mockMkdir: vi.fn().mockResolvedValue(undefined),
  mockReadFile: vi.fn(),
  mockWriteFile: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("fs", () => ({
  existsSync: mockExistsSync,
  promises: {
    mkdir: mockMkdir,
    readFile: mockReadFile,
    writeFile: mockWriteFile,
  },
}));

import { POST } from "./route";

afterEach(() => {
  vi.clearAllMocks();
});

const BASE_DOWNLOAD_PAYLOAD = {
  form: { email: "test@example.com", name: "Test User" },
  attachmentUrl: "/uploads/doc.pdf",
  attachmentFileName: "doc.pdf",
  returnUrl: "/features/documentation/my-doc",
  pdfPreviewUrl: "/uploads/doc-preview.pdf",
};

describe("POST /api/downloads/content", () => {
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
  });

  describe("다운로드 모드", () => {
    beforeEach(() => {
      mockExistsSync.mockReturnValue(false);
      mockReadFile.mockResolvedValue("[]");
    });

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

    it("리드 데이터를 파일에 저장한다", async () => {
      const request = new Request("http://localhost/api/downloads/content", {
        method: "POST",
        body: JSON.stringify(BASE_DOWNLOAD_PAYLOAD),
      });
      await POST(request);

      expect(mockWriteFile).toHaveBeenCalledOnce();
      const writtenContent = JSON.parse(mockWriteFile.mock.calls[0][1] as string) as unknown[];
      expect(writtenContent).toHaveLength(1);
      expect((writtenContent[0] as Record<string, unknown>).form).toEqual(BASE_DOWNLOAD_PAYLOAD.form);
    });

    it("기존 리드가 있으면 앞에 추가한다", async () => {
      const existingLead = { form: { email: "old@example.com" }, createdAt: "2026-01-01T00:00:00.000Z" };
      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue(JSON.stringify([existingLead]));

      const request = new Request("http://localhost/api/downloads/content", {
        method: "POST",
        body: JSON.stringify(BASE_DOWNLOAD_PAYLOAD),
      });
      await POST(request);

      const writtenContent = JSON.parse(mockWriteFile.mock.calls[0][1] as string) as unknown[];
      expect(writtenContent).toHaveLength(2);
      // 새 리드가 앞에 온다
      expect((writtenContent[0] as Record<string, unknown>).form).toEqual(BASE_DOWNLOAD_PAYLOAD.form);
    });

    it("unlockCookieName이 있으면 쿠키를 설정한다", async () => {
      mockExistsSync.mockReturnValue(false);
      mockReadFile.mockResolvedValue("[]");

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
  });

  describe("잠금 해제(unlock) 모드", () => {
    beforeEach(() => {
      mockExistsSync.mockReturnValue(false);
      mockReadFile.mockResolvedValue("[]");
    });

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
