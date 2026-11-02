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
  it("rejects a missing company or plan", async () => {
    const response = await POST(request({ companyName: "株式会社テスト", privacyConsent: true }));
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
      locale: "ko",
    }));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("spreadsheetml.sheet");
    expect(response.headers.get("content-disposition")).toContain("QP_Quotation");
    expect(response.headers.get("content-disposition")).toContain("_ko.xlsx");

    const bytes = await response.arrayBuffer();
    const zip = await JSZip.loadAsync(bytes);
    const sharedStrings = await zip.file("xl/sharedStrings.xml")?.async("text");
    expect(sharedStrings).toContain("QP-AIP0615APP-Credit");
    const sheet = await zip.file("xl/worksheets/sheet1.xml")?.async("text");
    expect(sheet).toMatch(/<c r="E6"[^>]*><v>1<\/v><\/c>/);
    expect(sheet).toMatch(/<c r="H8"[^>]*><f>H6\+H7<\/f><v>396000<\/v><\/c>/);
  });

  it.each([2, 3, 999])("generates the selected quantity %i", async (quantity) => {
    const response = await POST(request({
      companyName: "Example Company",
      contactName: "Alex Smith",
      department: "Sales",
      plan: "application",
      quantity,
      privacyConsent: true,
      locale: "en",
    }));
    expect(response.status).toBe(200);
    const zip = await JSZip.loadAsync(await response.arrayBuffer());
    const sheet = await zip.file("xl/worksheets/sheet1.xml")!.async("text");
    expect(sheet).toMatch(new RegExp(`<c r="E6"[^>]*><v>${quantity}<\\/v><\\/c>`));
    expect(sheet).toMatch(new RegExp(`<c r="H8"[^>]*><f>H6\\+H7<\\/f><v>${396_000 * quantity}<\\/v><\\/c>`));
  });

  it.each([0, -1, 1.5, 1000, "2", null, true, {}])("rejects invalid quantity %j", async (quantity) => {
    const response = await POST(request({
      companyName: "Example Company",
      contactName: "Alex Smith",
      department: "Sales",
      plan: "application",
      quantity,
      privacyConsent: true,
    }));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ code: "INVALID_QUANTITY" });
  });
});
