// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import JSZip from "jszip";

vi.mock("server-only", () => ({}));

import { POST } from "./route";

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/lingo-quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin: "http://localhost",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/lingo-quote", () => {
  it("rejects a missing required ordering field", async () => {
    const response = await POST(request({
      companyName: "株式会社テスト",
      contactName: "山田太郎",
      privacyConsent: true,
    }));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ code: "MISSING_REQUIRED_FIELDS" });
  });

  it("rejects a cross-origin request", async () => {
    const response = await POST(request({ companyName: "株式会社テスト", plan: "application" }, {
      origin: "https://evil.example",
    }));
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ code: "INVALID_ORIGIN" });
  });

  it("returns a generated workbook for a valid SKU", async () => {
    const response = await POST(request({
      companyName: "株式会社テスト",
      contactName: "山田太郎",
      department: "営業部",
      plan: "application",
      privacyConsent: true,
    }));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("spreadsheetml.sheet");
    expect(response.headers.get("content-disposition")).toContain("QP_Quotation");

    const bytes = await response.arrayBuffer();
    const zip = await JSZip.loadAsync(bytes);
    const sharedStrings = await zip.file("xl/sharedStrings.xml")?.async("text");
    expect(sharedStrings).toContain("QP-AIP0615APP-Credit");
  });
});
