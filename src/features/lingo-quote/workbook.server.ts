import "server-only";

import JSZip from "jszip";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { randomInt } from "node:crypto";
import { formatJapaneseDate, formatQuoteNumber, LINGO_QUOTE_SKUS, type LingoQuotePlan } from "./catalog";

const TEMPLATE_PATH = path.join(process.cwd(), "src/features/lingo-quote/template.xlsx");
const TAX_RATE = 0.1;

export type LingoQuoteInput = {
  companyName: string;
  contactName?: string;
  department?: string;
  plan: LingoQuotePlan;
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
  const match = sheetXml.match(new RegExp(`<c\\b[^>]*\\br="${cell}"[^>]*(?:/>|>[\\s\\S]*?<\\/c>)`));
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

function setSharedStringCell(sheetXml: string, cell: string, index: number) {
  const current = cellXml(sheetXml, cell);
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
  const current = cellXml(sheetXml, cell);
  const next = current.includes("<v>")
    ? current.replace(/<v>[\s\S]*?<\/v>/, `<v>${value}</v>`)
    : current.replace(/<\/c>$/, `<v>${value}</v></c>`);
  return replaceCellXml(sheetXml, cell, next);
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

function safeCellText(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "";

  // Do not let user input become a formula when the workbook is opened.
  return /^[=+\-@]/.test(trimmed) ? `'${trimmed}` : trimmed;
}

function buildRemarks() {
  return [
    "●利用期間：12か月",
    "●利用ユーザー：無制限",
    "●クレジットは１年間有効",
    "● LLM+AWSなど利用料も含む",
    "●クレジット残は次年度への繰り越しは不可",
  ].join("\n");
}

export async function createLingoQuoteWorkbook(input: LingoQuoteInput): Promise<LingoQuoteWorkbook> {
  const plan = LINGO_QUOTE_SKUS[input.plan];
  const issuedAt = input.issuedAt ?? new Date();
  const issuedDate = formatJapaneseDate(issuedAt);
  const validUntil = formatJapaneseDate(new Date(issuedAt.getTime() + 30 * 24 * 60 * 60 * 1000));
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
    `${safeCellText(input.companyName)} 御中`,
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
    `発行日 :                   ${issuedDate}`,
    `有効期限 :               ${validUntil}`,
    `見積もりNO# :         ${quoteNumber}`,
    "支払い期日 :            請求書発行月締め、翌月末支払い",
  ].join("\n")));
  sheetXml = setSharedStringCell(sheetXml, "A6", addString(plan.sku));
  sheetXml = setSharedStringCell(sheetXml, "B6", addString(plan.description));
  sheetXml = setNumericCell(sheetXml, "E6", 1);
  sheetXml = setNumericCell(sheetXml, "F6", plan.credit);
  sheetXml = setNumericCell(sheetXml, "G6", plan.retailPrice);
  sheetXml = setNumericCell(sheetXml, "H6", subtotal);
  sheetXml = setNumericCell(sheetXml, "H7", tax);
  sheetXml = setNumericCell(sheetXml, "H8", total);
  sheetXml = setNumericCell(sheetXml, "C3", total);
  sheetXml = setSharedStringCell(sheetXml, "I6", addString(buildRemarks()));
  sheetXml = setSharedStringCell(sheetXml, "B16", addString(safeCellText(input.companyName)));
  sheetXml = setSharedStringCell(sheetXml, "B17", addString(safeCellText(input.contactName)));
  sheetXml = setSharedStringCell(sheetXml, "B18", addString(safeCellText(input.department)));

  zip.file("xl/worksheets/sheet1.xml", sheetXml);
  zip.file("xl/sharedStrings.xml", sharedStringsXml);
  zip.file("xl/drawings/drawing1.xml", repairDrawingIds(await drawingFile.async("text")));
  const bytes = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  const fileDate = issuedDate.replaceAll("/", "");
  const fileName = `QP_Quotation_${fileDate}_${input.plan}.xlsx`;
  return { bytes, fileName, plan: input.plan, total };
}
