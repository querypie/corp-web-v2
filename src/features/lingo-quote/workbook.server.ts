import "server-only";

import JSZip from "jszip";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { randomInt } from "node:crypto";
import type { Locale } from "@/constants/i18n";
import { formatQuoteNumber, LINGO_QUOTE_SKUS, type LingoQuotePlan } from "./catalog";

const TEMPLATE_PATH = path.join(process.cwd(), "src/features/lingo-quote/template.xlsx");
const TAX_RATE = 0.1;

export type LingoQuoteInput = {
  companyName: string;
  contactName: string;
  department: string;
  plan: LingoQuotePlan;
  locale: Locale;
  issuedAt?: Date;
};

export type LingoQuoteWorkbook = {
  bytes: Buffer;
  fileName: string;
  plan: LingoQuotePlan;
  total: number;
};

const XML_ESCAPE_RE = /[&<>"']/g;
const XML_ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(value: string) {
  return value.replace(XML_ESCAPE_RE, (character) => XML_ESCAPE[character]);
}

function cellXml(sheetXml: string, cell: string) {
  const match = sheetXml.match(new RegExp(`<c\\b(?=[^>]*\\br="${cell}")[^>]*?(?:\\/>|>[\\s\\S]*?<\\/c>)`));
  if (!match) throw new Error(`Quotation template cell is missing: ${cell}`);
  return match[0];
}

function sharedStringIndex(sheetXml: string, cell: string) {
  const xml = cellXml(sheetXml, cell);
  const match = xml.match(/<v>(\d+)<\/v>/);
  if (!xml.includes('t="s"') || !match) throw new Error(`Quotation template cell is not a shared string: ${cell}`);
  return Number(match[1]);
}

function replaceCellXml(sheetXml: string, cell: string, next: string) {
  const current = cellXml(sheetXml, cell);
  return sheetXml.replace(current, next);
}

function addCellXml(sheetXml: string, cell: string, next: string) {
  const row = cell.match(/\d+$/)?.[0];
  if (!row) throw new Error(`Quotation template cell has invalid address: ${cell}`);
  const rowPattern = new RegExp(`(<row\\b[^>]*\\br="${row}"[^>]*>)([\\s\\S]*?)(</row>)`);
  if (!rowPattern.test(sheetXml)) throw new Error(`Quotation template row is missing: ${row}`);
  return sheetXml.replace(rowPattern, `$1$2${next}$3`);
}

function setSharedStringCell(sheetXml: string, cell: string, index: number) {
  let current: string;
  try {
    current = cellXml(sheetXml, cell);
  } catch {
    return addCellXml(sheetXml, cell, `<c r="${cell}" t="s"><v>${index}</v></c>`);
  }
  const openTag = current.match(/^<c\b[^>]*?(?:\/>|>)/)?.[0];
  if (!openTag) throw new Error(`Quotation template cell has invalid XML: ${cell}`);
  const nextOpenTag = openTag.includes('t="s"')
    ? openTag
    : openTag.endsWith("/>")
      ? `${openTag.slice(0, -2)} t="s">`
      : openTag.replace(/>$/, ' t="s">');
  return replaceCellXml(sheetXml, cell, `${nextOpenTag}<v>${index}</v></c>`);
}

function setNumericCell(sheetXml: string, cell: string, value: number) {
  let current: string;
  try {
    current = cellXml(sheetXml, cell);
  } catch {
    return addCellXml(sheetXml, cell, `<c r="${cell}"><v>${value}</v></c>`);
  }
  const next = current.endsWith("/>")
    ? `${current.slice(0, -2)}><v>${value}</v></c>`
    : current.includes("<v>")
      ? current.replace(/<v>[\s\S]*?<\/v>/, `<v>${value}</v>`)
      : current.replace(/<\/c>$/, `<v>${value}</v></c>`);
  return replaceCellXml(sheetXml, cell, next);
}

function copyCellStyle(sheetXml: string, targetCell: string, sourceCell: string) {
  const source = cellXml(sheetXml, sourceCell);
  const styleId = source.match(/\bs="([^"]+)"/)?.[1];
  if (!styleId) throw new Error(`Quotation template cell has no style: ${sourceCell}`);

  let target = cellXml(sheetXml, targetCell);
  target = /\bs="[^"]+"/.test(target)
    ? target.replace(/\bs="[^"]+"/, `s="${styleId}"`)
    : target.replace(/^<c\b/, `<c s="${styleId}"`);
  return replaceCellXml(sheetXml, targetCell, target);
}

function appendSharedString(sharedStringsXml: string, value: string) {
  const entries = [...sharedStringsXml.matchAll(/<si>[\s\S]*?<\/si>/g)];
  const index = entries.length;
  const nextEntry = `<si><t xml:space="preserve">${escapeXml(value)}</t></si>`;
  const nextXml = sharedStringsXml
    .replace(/count="\d+"/, (match) => `count="${index + 1}"`)
    .replace(/uniqueCount="\d+"/, (match) => `uniqueCount="${index + 1}"`)
    .replace(/<\/sst>$/, `${nextEntry}</sst>`);
  return { index, xml: nextXml };
}

function replaceLastSharedStringText(sharedStringsXml: string, index: number, value: string) {
  const entries = [...sharedStringsXml.matchAll(/<si>[\s\S]*?<\/si>/g)];
  const entry = entries[index]?.[0];
  if (!entry) throw new Error(`Quotation template shared string is missing: ${index}`);
  const textRuns = [...entry.matchAll(/<t(?:\s[^>]*)?>[\s\S]*?<\/t>/g)];
  const lastRun = textRuns.at(-1)?.[0];
  if (!lastRun) throw new Error(`Quotation template shared string has no text: ${index}`);
  const nextEntry = entry.replace(lastRun, lastRun.replace(/(<t(?:\s[^>]*)?>)[\s\S]*?(<\/t>)/, `$1${escapeXml(value)}$2`));
  return sharedStringsXml.replace(entry, nextEntry);
}

function replaceFirstSharedStringText(sharedStringsXml: string, index: number, value: string) {
  const entries = [...sharedStringsXml.matchAll(/<si>[\s\S]*?<\/si>/g)];
  const entry = entries[index]?.[0];
  if (!entry) throw new Error(`Quotation template shared string is missing: ${index}`);
  const firstRun = [...entry.matchAll(/<t(?:\s[^>]*)?>[\s\S]*?<\/t>/g)][0]?.[0];
  if (!firstRun) throw new Error(`Quotation template shared string has no text: ${index}`);
  const nextEntry = entry.replace(firstRun, firstRun.replace(/(<t(?:\s[^>]*)?>)[\s\S]*?(<\/t>)/, `$1${escapeXml(value)}$2`));
  return sharedStringsXml.replace(entry, nextEntry);
}

function replaceSharedStringWithText(sharedStringsXml: string, index: number, value: string) {
  const entries = [...sharedStringsXml.matchAll(/<si>[\s\S]*?<\/si>/g)];
  const entry = entries[index]?.[0];
  if (!entry) throw new Error(`Quotation template shared string is missing: ${index}`);
  const firstRunProperties = entry.match(/<rPr>[\s\S]*?<\/rPr>/)?.[0];
  const nextEntry = firstRunProperties
    ? `<si><r>${firstRunProperties}<t xml:space="preserve">${escapeXml(value)}</t></r></si>`
    : `<si><t xml:space="preserve">${escapeXml(value)}</t></si>`;
  return sharedStringsXml.replace(entry, nextEntry);
}

function setRowHeight(sheetXml: string, row: number, height: number) {
  const rowPattern = new RegExp(`(<row\\b[^>]*\\br="${row}"[^>]*)(>)`);
  if (!rowPattern.test(sheetXml)) throw new Error(`Quotation template row is missing: ${row}`);
  return sheetXml.replace(rowPattern, (_match, prefix: string, suffix: string) => {
    const nextPrefix = prefix
      .replace(/\sht="[^"]*"/, "")
      .replace(/\scustomHeight="[^"]*"/, "");
    return `${nextPrefix} ht="${height}" customHeight="1"${suffix}`;
  });
}

function repairDrawingIds(drawingXml: string) {
  const used = new Set<number>();
  let nextId = 1;
  return drawingXml.replace(/(<xdr:cNvPr\b[^>]*\bid=")([0-9]+)(")/g, (_match, prefix: string, rawId: string, suffix: string) => {
    let id = Number(rawId);
    if (used.has(id)) {
      while (used.has(nextId)) nextId++;
      id = nextId++;
    }
    used.add(id);
    return `${prefix}${id}${suffix}`;
  });
}

function excelDateSerial(dateText: string) {
  const [year, month, day] = dateText.split(/[/-]/).map(Number);
  return Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(1899, 11, 30)) / 86_400_000);
}

function formatQuoteDate(locale: Locale, date: Date) {
  const parts = new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : locale === "ko" ? "ko-KR" : "en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return locale === "ja" ? `${values.year}/${values.month}/${values.day}` : `${values.year}-${values.month}-${values.day}`;
}

type LocalizedWorkbookCopy = {
  title: string;
  suffix: string;
  issuerName: string;
  issueDate: string;
  validUntil: string;
  quoteNumber: string;
  paymentTerms: string;
  total: string;
  item: string;
  description: string;
  quantity: string;
  credit: string;
  unitPrice: string;
  sum: string;
  remarks: string;
  tax: string;
  totalLabel: string;
  conditions: string;
  orderDate: string;
  validityDate: string;
  orderingCompany: string;
  contact: string;
  signature: string;
  department: string;
  notes: string;
  descriptionValue: string;
};

function getLocalizedWorkbookCopy(locale: Locale, plan: LingoQuotePlan): LocalizedWorkbookCopy {
  if (locale === "ja") {
    return {
      title: "発注書  ORDER", suffix: " 御中", issuerName: "QueryPie AI合同会社", issueDate: "発行日", validUntil: "有効期限", quoteNumber: "見積もりNO#",
      paymentTerms: "支払い期日 :            請求書発行月締め、翌月末支払い", total: "総合計（税込）", item: "項目名", description: "詳細",
      quantity: "Qty", credit: "Credit", unitPrice: "単価", sum: "合計", remarks: "備考", tax: "消費税", totalLabel: "TOTAL",
      conditions: "記載条件で発注いたします。", orderDate: "発注日：", validityDate: "有効期限：", orderingCompany: "発注者会社：",
      contact: "ご担当者：", signature: "署名", department: "部署：",
      notes: ["●利用期間：12か月", "●利用ユーザー：無制限", "●クレジットは１年間有効", "● LLM+AWSなど利用料も含む", "●クレジット残は次年度への繰り越しは不可"].join("\n"),
      descriptionValue: plan === "production" ? "AIP Production Credit" : "AIP Application Credit (Lingo or NotePie)",
    };
  }
  if (locale === "ko") {
    return {
      title: "견적서  QUOTATION", suffix: " 귀중", issuerName: "주식회사 쿼리파이", issueDate: "발행일", validUntil: "유효기간", quoteNumber: "견적번호",
      paymentTerms: "지급기한 : 청구서 발행월 말일 기준, 익월 말 지급", total: "총합계 (부가세 포함)", item: "항목명", description: "상세",
      quantity: "수량", credit: "크레딧", unitPrice: "단가", sum: "합계", remarks: "비고", tax: "소비세", totalLabel: "합계",
      conditions: "상기 조건에 따른 견적입니다.", orderDate: "견적 발행일:", validityDate: "유효기간:", orderingCompany: "발주 회사:",
      contact: "담당자:", signature: "서명", department: "부서:",
      notes: ["● 이용 기간: 12개월", "● 사용자 수: 무제한", "● 크레딧은 1년간 유효", "● LLM·AWS 등의 이용료 포함", "● 잔여 크레딧은 다음 연도로 이월되지 않음"].join("\n"),
      descriptionValue: plan === "production" ? "AIP 프로덕션 크레딧" : "AIP 애플리케이션 크레딧 (Lingo 또는 NotePie)",
    };
  }
  return {
    title: "Quotation  ORDER", suffix: "", issuerName: "CHEQUER Global, Inc.", issueDate: "Issue Date", validUntil: "Valid Until", quoteNumber: "Quotation No#",
    paymentTerms: "Payment Terms: Invoice month-end, payment by the end of the following month", total: "Grand Total (incl. tax)", item: "Item", description: "Description",
    quantity: "Qty", credit: "Credit", unitPrice: "Unit Price", sum: "Total", remarks: "Remarks", tax: "Consumption Tax", totalLabel: "TOTAL",
    conditions: "This quotation is based on the conditions stated above.", orderDate: "Quotation Date:", validityDate: "Valid Until:", orderingCompany: "Ordering Company:",
    contact: "Contact Person:", signature: "Signature", department: "Department:",
    notes: ["● Term: 12 months", "● Users: Unlimited", "● Credits are valid for one year", "● Includes LLM and AWS usage fees", "● Unused credits cannot be carried over to the next year"].join("\n"),
    descriptionValue: plan === "production" ? "AIP Production Credit" : "AIP Application Credit (Lingo or NotePie)",
  };
}

function safeCellText(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "";

  // Do not let user input become a formula when the workbook is opened.
  return /^[=+\-@]/.test(trimmed) ? `'${trimmed}` : trimmed;
}

export async function createLingoQuoteWorkbook(input: LingoQuoteInput): Promise<LingoQuoteWorkbook> {
  const plan = LINGO_QUOTE_SKUS[input.plan];
  const issuedAt = input.issuedAt ?? new Date();
  const copy = getLocalizedWorkbookCopy(input.locale, input.plan);
  const issuedDate = formatQuoteDate(input.locale, issuedAt);
  const validUntil = formatQuoteDate(input.locale, new Date(issuedAt.getTime() + 30 * 24 * 60 * 60 * 1000));
  const quoteNumber = formatQuoteNumber(issuedAt, randomInt(1, 1000));
  const subtotal = plan.retailPrice;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  const zip = await JSZip.loadAsync(await readFile(TEMPLATE_PATH));
  const sheetFile = zip.file("xl/worksheets/sheet1.xml");
  const sharedStringsFile = zip.file("xl/sharedStrings.xml");
  const drawingFile = zip.file("xl/drawings/drawing1.xml");
  if (!sheetFile || !sharedStringsFile || !drawingFile) throw new Error("Quotation template XML is missing");
  let sheetXml = await sheetFile.async("text");
  let sharedStringsXml = await sharedStringsFile.async("text");

  // A1 is a rich-text cell containing the fixed ORDER title and the customer name.
  // Replace only its final text run so the title and its formatting remain intact.
  sharedStringsXml = replaceLastSharedStringText(
    sharedStringsXml,
    sharedStringIndex(sheetXml, "A1"),
    `${safeCellText(input.companyName)}${copy.suffix}`,
  );
  sharedStringsXml = replaceFirstSharedStringText(sharedStringsXml, sharedStringIndex(sheetXml, "A1"), copy.title);
  sharedStringsXml = replaceSharedStringWithText(
    sharedStringsXml,
    sharedStringIndex(sheetXml, "D1"),
    copy.issuerName,
  );

  const strings = new Map<string, number>();
  function addString(value: string) {
    const existing = strings.get(value);
    if (existing !== undefined) return existing;
    const appended = appendSharedString(sharedStringsXml, value);
    sharedStringsXml = appended.xml;
    strings.set(value, appended.index);
    return appended.index;
  }

  sheetXml = setSharedStringCell(sheetXml, "A2", addString([
    `${copy.issueDate} :                   ${issuedDate}`,
    `${copy.validUntil} :               ${validUntil}`,
    `${copy.quoteNumber} :         ${quoteNumber}`,
    copy.paymentTerms,
  ].join("\n")));
  sheetXml = setSharedStringCell(sheetXml, "A6", addString(plan.sku));
  sheetXml = setSharedStringCell(sheetXml, "B6", addString(copy.descriptionValue));
  sheetXml = setNumericCell(sheetXml, "E6", 1);
  sheetXml = setNumericCell(sheetXml, "F6", plan.credit);
  sheetXml = setNumericCell(sheetXml, "G6", plan.retailPrice);
  sheetXml = setNumericCell(sheetXml, "H6", subtotal);
  sheetXml = setNumericCell(sheetXml, "H7", tax);
  sheetXml = setNumericCell(sheetXml, "H8", total);
  sheetXml = setNumericCell(sheetXml, "C3", total);
  // Korean and English total labels wrap to two lines. Keep the entire label visible.
  sheetXml = setRowHeight(sheetXml, 3, 33);
  sheetXml = setSharedStringCell(sheetXml, "I6", addString(copy.notes));
  for (const [cell, value] of Object.entries({
    B3: copy.total, A5: copy.item, B5: copy.description, E5: copy.quantity, F5: copy.credit,
    G5: copy.unitPrice, H5: copy.sum, I5: copy.remarks, A7: copy.tax, A8: copy.totalLabel,
    A9: copy.remarks, A12: copy.conditions, A14: copy.orderDate, A15: copy.validityDate,
    A16: copy.orderingCompany, A17: copy.contact, C17: copy.signature, A18: copy.department,
  })) {
    sheetXml = setSharedStringCell(sheetXml, cell, addString(value));
  }
  sheetXml = setSharedStringCell(sheetXml, "B14", addString(issuedDate));
  // B14 is added to the template at runtime; copy the existing value-cell style
  // so its font matches the labels and the other customer detail values.
  sheetXml = copyCellStyle(sheetXml, "B14", "B18");
  if (input.locale === "ja") sheetXml = setNumericCell(sheetXml, "B15", excelDateSerial(validUntil));
  else sheetXml = setSharedStringCell(sheetXml, "B15", addString(validUntil));
  sheetXml = setSharedStringCell(sheetXml, "B16", addString(safeCellText(input.companyName)));
  sheetXml = setSharedStringCell(sheetXml, "B17", addString(safeCellText(input.contactName)));
  sheetXml = setSharedStringCell(sheetXml, "B18", addString(safeCellText(input.department)));

  zip.file("xl/worksheets/sheet1.xml", sheetXml);
  zip.file("xl/sharedStrings.xml", sharedStringsXml);
  zip.file("xl/drawings/drawing1.xml", repairDrawingIds(await drawingFile.async("text")));
  const bytes = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  const fileDate = issuedDate.replaceAll("/", "").replaceAll("-", "");
  const fileName = `QP_Quotation_${fileDate}_${input.plan}_${input.locale}.xlsx`;
  return { bytes, fileName, plan: input.plan, total };
}
