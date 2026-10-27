import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import JSZip from "jszip";
import { createLingoQuoteWorkbook } from "./workbook.server";

beforeAll(() => {
  process.env.TZ = "Asia/Tokyo";
});

describe("createLingoQuoteWorkbook", () => {
  it.each([
    ["application", "QP-AIP0615APP-Credit", 72_000, 360_000, 396_000],
    ["production", "QP-AIP0615Prod-Credit", 240_000, 1_200_000, 1_320_000],
  ] as const)("fills the %s SKU and totals", async (plan, sku, credit, subtotal, total) => {
    const result = await createLingoQuoteWorkbook({
      companyName: "株式会社テスト",
      contactName: "山田太郎",
      department: "営業部",
      plan,
      locale: "ja",
      issuedAt: new Date("2026-10-24T00:00:00.000Z"),
    });

    const zip = await JSZip.loadAsync(result.bytes);
    const sheet = await zip.file("xl/worksheets/sheet1.xml")?.async("text");
    const sharedStrings = await zip.file("xl/sharedStrings.xml")?.async("text");

    expect(sharedStrings).toContain("発注書");
    expect(sharedStrings).toContain("株式会社テスト 御中");
    expect(sharedStrings).toContain(sku);
    expect(sharedStrings).toContain("山田太郎");
    expect(sharedStrings).toContain("営業部");
    expect(sharedStrings).toContain("2026/10/24");
    expect(sharedStrings).toContain("2026/11/23");
    expect(sheet).toMatch(/<c\b(?=[^>]*\br="B14")(?=[^>]*\bs="46")(?=[^>]*\bt="s")[^>]*>/);
    expect(sheet).toMatch(/<c r="B15"[^>]*><v>46349<\/v><\/c>/);
    expect(sheet).toMatch(new RegExp(`<c r="F6"[^>]*><v>${credit}<\\/v><\\/c>`));
    expect(sheet).toMatch(new RegExp(`<c r="G6"[^>]*><v>${subtotal}<\\/v><\\/c>`));
    expect(sheet).toMatch(new RegExp(`<c r="H7"[^>]*><f>H6\\*0\\.1<\\/f><v>${subtotal * 0.1}<\\/v><\\/c>`));
    expect(sheet).toMatch(new RegExp(`<c r="H8"[^>]*><f>H6\\+H7<\\/f><v>${total}<\\/v><\\/c>`));
    expect(sheet).toMatch(new RegExp(`<c r="C3"[^>]*><f>H8<\\/f><v>${total}<\\/v><\\/c>`));
    expect(result.total).toBe(total);
    expect(result.fileName).toContain(`${plan}_ja.xlsx`);
  });

  it("neutralizes formula-like company input", async () => {
    const result = await createLingoQuoteWorkbook({
      companyName: "=HYPERLINK(\"https://evil.example\")",
      contactName: "테스트 담당자",
      department: "테스트 부서",
      plan: "application",
      locale: "ja",
    });
    const zip = await JSZip.loadAsync(result.bytes);
    const sharedStrings = await zip.file("xl/sharedStrings.xml")?.async("text");
    expect(sharedStrings).toContain("&apos;=HYPERLINK(&quot;https://evil.example&quot;) 御中");
  });

  it.each([
    ["ko", "견적서", "발주 회사", "2026-10-24"],
    ["en", "Quotation", "Ordering Company", "2026-10-24"],
  ] as const)("localizes the %s workbook labels", async (locale, title, companyLabel, date) => {
    const result = await createLingoQuoteWorkbook({
      companyName: "Sample Company",
      contactName: "Sample Contact",
      department: "Staff",
      plan: "application",
      locale,
      issuedAt: new Date("2026-10-24T00:00:00.000Z"),
    });
    const zip = await JSZip.loadAsync(result.bytes);
    const sheet = await zip.file("xl/worksheets/sheet1.xml")?.async("text");
    const sharedStrings = await zip.file("xl/sharedStrings.xml")?.async("text");
    expect(sharedStrings).toContain(title);
    expect(sharedStrings).toContain(companyLabel);
    expect(sharedStrings).toContain(date);
    expect(sheet).toContain("<c r=\"B15\" s=\"43\" t=\"s\">");
    expect(result.fileName).toContain(`_${locale}.xlsx`);
  });

  it.each([
    ["ko", "주식회사 쿼리파이", "유효기간:", "2026-11-23"],
    ["en", "CHEQUER Global, Inc.", "Valid Until:", "2026-11-23"],
    ["ja", "QueryPie AI合同会社", "有効期限：", "2026/11/23"],
  ] as const)("uses the %s issuer name and validity date", async (locale, issuerName, validityLabel, validityDate) => {
    const result = await createLingoQuoteWorkbook({
      companyName: "Sample Company",
      contactName: "Sample Contact",
      department: "Staff",
      plan: "application",
      locale,
      issuedAt: new Date("2026-10-24T00:00:00.000Z"),
    });
    const zip = await JSZip.loadAsync(result.bytes);
    const sheet = await zip.file("xl/worksheets/sheet1.xml")?.async("text");
    const sharedStrings = await zip.file("xl/sharedStrings.xml")?.async("text");
    expect(sharedStrings).toContain(issuerName);
    expect(sharedStrings).toContain(validityLabel);
    expect(sharedStrings).toContain(validityDate);
    expect(sheet).toMatch(/<row r="3" ht="33" customHeight="1">/);
  });
});
