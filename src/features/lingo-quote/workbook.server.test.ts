import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import JSZip from "jszip";
import { createLingoQuoteWorkbook } from "./workbook.server";

beforeAll(() => {
  process.env.TZ = "Asia/Tokyo";
});

describe("createLingoQuoteWorkbook", () => {
  it.each([
    ["application", 2, 72_000, 360_000, 720_000, 72_000, 792_000],
    ["application", 3, 72_000, 360_000, 1_080_000, 108_000, 1_188_000],
    ["production", 2, 240_000, 1_200_000, 2_400_000, 240_000, 2_640_000],
    ["production", 3, 240_000, 1_200_000, 3_600_000, 360_000, 3_960_000],
  ] as const)("calculates %s × %i with live formulas and correct cached totals", async (plan, quantity, credit, unitPrice, subtotal, tax, total) => {
    const result = await createLingoQuoteWorkbook({
      companyName: "Example Company",
      contactName: "Alex Smith",
      department: "Sales",
      plan,
      quantity,
      locale: "en",
    });
    const zip = await JSZip.loadAsync(result.bytes);
    const sheet = await zip.file("xl/worksheets/sheet1.xml")!.async("text");
    for (const [cell, value] of [["E6", quantity], ["F6", credit], ["G6", unitPrice]] as const) {
      expect(sheet).toMatch(new RegExp(`<c r="${cell}"[^>]*><v>${value}<\\/v><\\/c>`));
    }
    for (const [cell, formula, value] of [
      ["H6", "G6*E6", subtotal], ["H7", "H6*0.1", tax], ["H8", "H6+H7", total], ["C3", "H8", total],
    ] as const) {
      const cellXml = sheet.match(new RegExp(`<c r="${cell}"[^>]*>[\\s\\S]*?<\\/c>`))![0];
      expect(cellXml).toContain(`<f>${formula}</f><v>${value}</v>`);
    }
    expect(result.total).toBe(total);
  });

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

  it.each(["ko", "en", "ja"] as const)("omits the quotation number while keeping %s quotation terms", async (locale) => {
    const result = await createLingoQuoteWorkbook({
      companyName: "Sample Company",
      contactName: "Sample Contact",
      department: "Sales",
      plan: "application",
      locale,
      issuedAt: new Date("2026-10-24T00:00:00.000Z"),
    });
    const zip = await JSZip.loadAsync(result.bytes);
    const sheet = await zip.file("xl/worksheets/sheet1.xml")!.async("text");
    const sharedStrings = await zip.file("xl/sharedStrings.xml")!.async("text");
    const metadataCell = sheet.match(/<c\b(?=[^>]*\br="A2")[^>]*>[\s\S]*?<\/c>/)![0];
    const metadataIndex = Number(metadataCell.match(/<v>(\d+)<\/v>/)![1]);
    const metadata = [...sharedStrings.matchAll(/<si>[\s\S]*?<\/si>/g)][metadataIndex][0];
    const lines = metadata.match(/<t[^>]*>([\s\S]*?)<\/t>/)![1].split("\n");

    expect(lines).toHaveLength(3);
    expect(lines[0]).toContain(locale === "ja" ? "2026/10/24" : "2026-10-24");
    expect(lines[1]).toContain(locale === "ja" ? "2026/11/23" : "2026-11-23");
    expect(lines[2]).toContain({ ko: "지급기한", en: "Payment Terms", ja: "支払い期日" }[locale]);
    expect(sharedStrings).not.toMatch(/QPJ-|견적번호|Quotation No#|見積もりNO#/);
  });
});
