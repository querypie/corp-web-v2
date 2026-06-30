import "server-only";

import { existsSync, promises as fs } from "fs";
import path from "path";
import { locales, type Locale } from "@/constants/i18n";
import {
  getDefaultVisibleLocales,
  normalizeDateIso,
  type ManagedContentCategorySlug,
  type ManagedContentEntry,
  type ManagedContentSection,
} from "./data";
import { renderTiptapHtml } from "./tiptapHtml";

type AuthoredLocaleRecord = {
  htmlPath: string;
  jsonPath: string;
};

type AuthoredContentMeta = {
  authorName: string;
  authorRole: string;
  categorySlug: ManagedContentCategorySlug;
  contentType: "content" | "outlink";
  dateIso: string;
  downloadCoverImageSrc?: string;
  downloadPdfFileName?: string;
  downloadPdfFileNameByLocale?: Partial<Record<Locale, string>>;
  downloadPdfSrc?: string;
  downloadPdfSrcByLocale?: Partial<Record<Locale, string>>;
  enableDownloadButton: boolean;
  externalUrl: string;
  gatingLevel?: ManagedContentEntry["gatingLevel"];
  hideHeroImage: boolean;
  id: string;
  imageSrc: string;
  relatedIds: string[];
  section: ManagedContentSection;
  sortOrder: number;
  status: "hidden" | "published";
  storageId: string;
  summary: Record<Locale, string>;
  title: Record<Locale, string>;
  visibleLocales?: Locale[];
  locales: Partial<Record<Locale, AuthoredLocaleRecord>>;
};

type SaveAuthoredContentInput = Pick<
  ManagedContentEntry,
  | "authorName"
  | "authorRole"
  | "bodyHtml"
  | "bodyRichText"
  | "categorySlug"
  | "contentType"
  | "dateIso"
  | "downloadCoverImageSrc"
  | "downloadPdfFileName"
  | "downloadPdfFileNameByLocale"
  | "downloadPdfSrc"
  | "downloadPdfSrcByLocale"
  | "enableDownloadButton"
  | "externalUrl"
  | "gatingLevel"
  | "hideHeroImage"
  | "id"
  | "imageSrc"
  | "relatedIds"
  | "section"
  | "sortOrder"
  | "status"
  | "storageId"
  | "summary"
  | "title"
  | "visibleLocales"
>;

const contentRoot = path.join(process.cwd(), "src", "content");
let authoredMetaFilesCache: string[] | null = null;
let authoredMetaFilesPromise: Promise<string[]> | null = null;
let authoredMetaCache: AuthoredContentMeta[] | null = null;
let authoredMetaPromise: Promise<AuthoredContentMeta[]> | null = null;
let authoredEntriesCache:
  | {
      withBodies: ManagedContentEntry[] | null;
      withoutBodies: ManagedContentEntry[] | null;
    }
  | null = null;
let authoredEntriesPromise:
  | {
      withBodies: Promise<ManagedContentEntry[]> | null;
      withoutBodies: Promise<ManagedContentEntry[]> | null;
    }
  | null = null;
let authoredCacheVersion = 0;
let storageIdCreationQueue = Promise.resolve();
const reservedStorageIds = new Set<string>();

export class TiptapHtmlRenderError extends Error {
  code = "TIPTAP_HTML_RENDER_FAILED" as const;
  locale: Locale;
  reason: string;
  suggestions: string[];

  constructor(locale: Locale, reason: string, suggestions: string[]) {
    super(`Failed to render ${locale} Tiptap JSON to HTML.`);
    this.name = "TiptapHtmlRenderError";
    this.locale = locale;
    this.reason = reason;
    this.suggestions = suggestions;
  }
}

const supportedTiptapNodeTypes = new Set([
  "blockquote",
  "bulletList",
  "codeBlock",
  "doc",
  "hardBreak",
  "heading",
  "horizontalRule",
  "image",
  "listItem",
  "orderedList",
  "paragraph",
  "table",
  "tableCell",
  "tableHeader",
  "tableRow",
  "text",
  "video",
  "youtube",
]);

function collectUnsupportedTiptapNodes(node: unknown, unsupported = new Set<string>()) {
  if (!node || typeof node !== "object") {
    return unsupported;
  }

  const candidate = node as { content?: unknown; type?: unknown };

  if (typeof candidate.type === "string" && !supportedTiptapNodeTypes.has(candidate.type)) {
    unsupported.add(candidate.type);
  }

  if (Array.isArray(candidate.content)) {
    for (const child of candidate.content) {
      collectUnsupportedTiptapNodes(child, unsupported);
    }
  }

  return unsupported;
}

function diagnoseTiptapHtmlRenderFailure(richText: string) {
  const trimmedRichText = richText.trim();

  if (!trimmedRichText) {
    return {
      reason: "본문 JSON이 비어 있습니다.",
      suggestions: ["에디터 본문에 내용을 입력한 뒤 다시 저장하세요."],
    };
  }

  try {
    const parsed = JSON.parse(trimmedRichText) as { content?: unknown; type?: unknown };

    if (!parsed || typeof parsed !== "object") {
      return {
        reason: "Tiptap JSON 최상위 값이 문서 객체가 아닙니다.",
        suggestions: ["본문을 에디터에서 다시 열고 내용을 한 번 수정한 뒤 저장하세요."],
      };
    }

    if (parsed.type !== "doc") {
      return {
        reason: "Tiptap JSON 최상위 type이 doc이 아닙니다.",
        suggestions: ["본문을 에디터에서 다시 열고 내용을 한 번 수정한 뒤 저장하세요."],
      };
    }

    const unsupportedNodes = Array.from(collectUnsupportedTiptapNodes(parsed)).sort();

    if (unsupportedNodes.length > 0) {
      return {
        reason: `HTML 변환기가 지원하지 않는 Tiptap 노드가 있습니다: ${unsupportedNodes.join(", ")}`,
        suggestions: [
          "해당 블록을 에디터에서 삭제하거나 기본 문단/제목/목록/이미지/영상/표 블록으로 다시 작성하세요.",
          "새 커스텀 블록이 필요한 경우 해당 노드의 HTML 렌더러를 추가해야 합니다.",
        ],
      };
    }

    return {
      reason: "Tiptap JSON은 파싱됐지만 렌더링 결과가 비어 있습니다.",
      suggestions: [
        "본문에 실제 텍스트나 렌더링 가능한 블록이 있는지 확인하세요.",
        "문제가 계속되면 에디터에서 본문을 복사해 새 문단으로 다시 붙여넣은 뒤 저장하세요.",
      ],
    };
  } catch (error) {
    return {
      reason: `Tiptap JSON 문법이 깨져 있습니다: ${error instanceof Error ? error.message : "Invalid JSON"}`,
      suggestions: [
        "에디터 본문을 다시 열어 내용을 한 번 수정한 뒤 저장하세요.",
        "직접 JSON 파일을 수정했다면 JSON 문법 오류를 고치거나, 문제가 있는 locale의 본문을 다시 작성하세요.",
      ],
    };
  }
}

function normalizeBodyHtmlForSave(richText: string, html: string, locale: Locale) {
  if (!richText.trim()) {
    return html;
  }

  const renderedHtml = renderTiptapHtml(richText);

  if (!renderedHtml.trim()) {
    const diagnosis = diagnoseTiptapHtmlRenderFailure(richText);
    throw new TiptapHtmlRenderError(locale, diagnosis.reason, diagnosis.suggestions);
  }

  return renderedHtml;
}

function getAuthoredSectionRoot(section: ManagedContentSection) {
  if (section === "documentation") {
    return path.join(contentRoot, "documentation");
  }

  return path.join(contentRoot, section);
}

function getEntryDir(
  section: ManagedContentSection,
  categorySlug: ManagedContentCategorySlug,
  storageId: string,
) {
  if (section === "news") {
    return path.join(getAuthoredSectionRoot(section), storageId);
  }

  return path.join(getAuthoredSectionRoot(section), categorySlug, storageId);
}

function toPosix(value: string) {
  return value.split(path.sep).join("/");
}

function createEmptyLocalizedContent() {
  return {
    en: "",
    ko: "",
    ja: "",
  };
}

function normalizeLocalizedRecord(value: Partial<Record<Locale, string>> | undefined) {
  return {
    en: value?.en ?? "",
    ko: value?.ko ?? value?.en ?? "",
    ja: value?.ja ?? value?.en ?? "",
  };
}

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function writeFileAtomic(filePath: string, contents: string) {
  const tempPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  await fs.writeFile(tempPath, contents, "utf8");
  await fs.rename(tempPath, filePath);
}

async function removeFileIfExists(filePath: string) {
  await fs.rm(filePath, { force: true });
}

function invalidateAuthoredCaches() {
  authoredMetaFilesCache = null;
  authoredMetaFilesPromise = null;
  authoredMetaCache = null;
  authoredMetaPromise = null;
  authoredEntriesCache = null;
  authoredEntriesPromise = null;
  authoredCacheVersion += 1;
}

export function getAuthoredCacheVersion() {
  return authoredCacheVersion;
}

async function listStorageIds() {
  const metas = await readAllAuthoredMetas();
  return metas
    .map((meta) => meta.storageId)
    .filter((storageId): storageId is string => /^cnt_\d+$/.test(storageId));
}

async function createNextStorageIdUnlocked() {
  const storageIds = await listStorageIds();
  const numericIds = storageIds
    .map((storageId) => Number(storageId.replace(/^cnt_/, "")))
    .filter((value) => Number.isFinite(value));
  let nextValue = (numericIds.length ? Math.max(...numericIds) : 0) + 1;

  let nextStorageId = `cnt_${String(nextValue).padStart(6, "0")}`;

  while (storageIds.includes(nextStorageId) || reservedStorageIds.has(nextStorageId)) {
    nextValue += 1;
    nextStorageId = `cnt_${String(nextValue).padStart(6, "0")}`;
  }

  reservedStorageIds.add(nextStorageId);
  return nextStorageId;
}

async function createNextStorageId() {
  const previousQueue = storageIdCreationQueue;
  let releaseQueue = () => {};
  storageIdCreationQueue = new Promise<void>((resolve) => {
    releaseQueue = resolve;
  });

  await previousQueue;

  try {
    return await createNextStorageIdUnlocked();
  } finally {
    releaseQueue();
  }
}

async function readAuthoredMetaFiles() {
  if (authoredMetaFilesCache) {
    return authoredMetaFilesCache;
  }

  if (authoredMetaFilesPromise) {
    return authoredMetaFilesPromise;
  }

  authoredMetaFilesPromise = readAuthoredMetaFilesUncached();

  try {
    authoredMetaFilesCache = await authoredMetaFilesPromise;
    return authoredMetaFilesCache;
  } catch (error) {
    authoredMetaFilesPromise = null;
    throw error;
  }
}

async function readAuthoredMetaFilesUncached() {
  const metaFiles: string[] = [];

  async function walk(currentDir: string) {
    if (!existsSync(currentDir)) {
      return;
    }

    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (entry.name === "meta.json") {
        metaFiles.push(fullPath);
      }
    }
  }

  await Promise.all(
    (["demo", "documentation", "news"] as const).map((section) =>
      walk(getAuthoredSectionRoot(section)),
    ),
  );

  return metaFiles.sort();
}

async function readMetaFile(metaPath: string) {
  const rawMeta = await fs.readFile(metaPath, "utf8");

  try {
    return JSON.parse(rawMeta) as AuthoredContentMeta;
  } catch (error) {
    throw new Error(`Invalid meta.json: ${toPosix(path.relative(process.cwd(), metaPath))}`);
  }
}

async function readAuthoredEntryBodies(entryDir: string) {
  const bodyHtml = createEmptyLocalizedContent();
  const bodyRichText = createEmptyLocalizedContent();
  const nextLocales: Partial<Record<Locale, AuthoredLocaleRecord>> = {};

  await Promise.all(
    locales.map(async (locale) => {
      const jsonPath = path.join(entryDir, `${locale}.tiptap.json`);
      const htmlPath = path.join(entryDir, `${locale}.html`);

      if (!existsSync(jsonPath) && !existsSync(htmlPath)) {
        return;
      }

      const [richText, html] = await Promise.all([
        existsSync(jsonPath) ? fs.readFile(jsonPath, "utf8") : Promise.resolve(""),
        existsSync(htmlPath) ? fs.readFile(htmlPath, "utf8") : Promise.resolve(""),
      ]);

      bodyRichText[locale] = richText;
      bodyHtml[locale] = html.trim() ? html : renderTiptapHtml(richText);

      nextLocales[locale] = {
        htmlPath: toPosix(path.relative(process.cwd(), htmlPath)),
        jsonPath: toPosix(path.relative(process.cwd(), jsonPath)),
      };
    }),
  );

  return { bodyHtml, bodyRichText, locales: nextLocales };
}

async function createManagedContentEntry(
  meta: AuthoredContentMeta,
  options?: { includeBodies?: boolean; entryDir?: string },
): Promise<ManagedContentEntry> {
  const title = normalizeLocalizedRecord(meta.title);
  const bodies = options?.includeBodies
    ? await readAuthoredEntryBodies(options.entryDir ?? getEntryDir(meta.section, meta.categorySlug, meta.storageId))
    : {
        bodyHtml: createEmptyLocalizedContent(),
        bodyRichText: createEmptyLocalizedContent(),
      };

  return {
    authorName: meta.authorName,
    authorRole: meta.authorRole,
    bodyHtml: bodies.bodyHtml,
    bodyRichText: bodies.bodyRichText,
    categorySlug: meta.categorySlug,
    contentType: meta.contentType ?? "content",
    dateIso: normalizeDateIso(meta.dateIso),
    downloadCoverImageSrc: meta.downloadCoverImageSrc ?? "",
    downloadPdfFileName: meta.downloadPdfFileName ?? "",
    downloadPdfFileNameByLocale: normalizeLocalizedRecord(meta.downloadPdfFileNameByLocale),
    downloadPdfSrc: meta.downloadPdfSrc ?? "",
    downloadPdfSrcByLocale: normalizeLocalizedRecord(meta.downloadPdfSrcByLocale),
    enableDownloadButton: meta.enableDownloadButton ?? false,
    externalUrl: meta.externalUrl,
    gatingLevel: meta.gatingLevel ?? "none",
    hideHeroImage: meta.hideHeroImage,
    id: meta.id,
    imageSrc: meta.imageSrc,
    relatedIds: meta.relatedIds ?? [],
    section: meta.section,
    sortOrder: meta.sortOrder,
    status: meta.status,
    storageId: meta.storageId,
    summary: normalizeLocalizedRecord(meta.summary),
    title,
    visibleLocales: meta.visibleLocales ?? getDefaultVisibleLocales(title),
  };
}

async function readAllAuthoredMetas() {
  if (authoredMetaCache) {
    return authoredMetaCache;
  }

  if (authoredMetaPromise) {
    return authoredMetaPromise;
  }

  authoredMetaPromise = readAllAuthoredMetasUncached();

  try {
    authoredMetaCache = await authoredMetaPromise;
    return authoredMetaCache;
  } catch (error) {
    authoredMetaPromise = null;
    throw error;
  }
}

async function readAllAuthoredMetasUncached() {
  const metaFiles = await readAuthoredMetaFiles();
  return Promise.all(metaFiles.map((metaPath) => readMetaFile(metaPath)));
}

async function findAuthoredMetaPathByStorageId(storageId: string) {
  const metaFiles = await readAuthoredMetaFiles();

  for (const metaPath of metaFiles) {
    const meta = await readMetaFile(metaPath);

    if (meta.storageId === storageId) {
      return metaPath;
    }
  }

  return null;
}

async function findAuthoredEntryDir({
  categorySlug,
  id,
  section,
  storageId,
}: {
  categorySlug: ManagedContentCategorySlug;
  id: string;
  section: ManagedContentSection;
  storageId?: string;
}) {
  if (storageId) {
    const metaPath = await findAuthoredMetaPathByStorageId(storageId);

    if (metaPath) {
      return path.dirname(metaPath);
    }
  }

  const metas = await readAllAuthoredMetas();

  for (const meta of metas) {
    if (meta.id === id && meta.section === section && meta.categorySlug === categorySlug) {
      return getEntryDir(meta.section, meta.categorySlug, meta.storageId);
    }
  }

  return null;
}

export async function readAuthoredManagedContentItem(
  section: ManagedContentSection,
  id: string,
  options?: {
    categorySlug?: ManagedContentCategorySlug;
    includeBodies?: boolean;
  },
) {
  const metas = await readAllAuthoredMetas();
  const meta = metas.find((candidate) =>
    candidate.section === section &&
    candidate.id === id &&
    (!options?.categorySlug || candidate.categorySlug === options.categorySlug),
  );

  if (!meta || (meta.section === "news" && !meta.storageId)) {
    return null;
  }

  return createManagedContentEntry(meta, {
    includeBodies: options?.includeBodies,
  });
}

export async function readAuthoredManagedContents(options?: { includeBodies?: boolean }) {
  const includeBodies = options?.includeBodies ?? true;
  const cachedEntries = authoredEntriesCache?.[includeBodies ? "withBodies" : "withoutBodies"];

  if (cachedEntries) {
    return cachedEntries;
  }

  const pendingEntries = authoredEntriesPromise?.[includeBodies ? "withBodies" : "withoutBodies"];

  if (pendingEntries) {
    return pendingEntries;
  }

  const nextEntriesPromise = readAuthoredManagedContentsUncached(includeBodies);
  authoredEntriesPromise = {
    withBodies: includeBodies ? nextEntriesPromise : authoredEntriesPromise?.withBodies ?? null,
    withoutBodies: includeBodies ? authoredEntriesPromise?.withoutBodies ?? null : nextEntriesPromise,
  };

  try {
    const entries = await nextEntriesPromise;
    authoredEntriesCache = {
      withBodies: includeBodies ? entries : authoredEntriesCache?.withBodies ?? null,
      withoutBodies: includeBodies ? authoredEntriesCache?.withoutBodies ?? null : entries,
    };
    return entries;
  } catch (error) {
    authoredEntriesPromise = {
      withBodies: includeBodies ? null : authoredEntriesPromise?.withBodies ?? null,
      withoutBodies: includeBodies ? authoredEntriesPromise?.withoutBodies ?? null : null,
    };
    throw error;
  }
}

async function readAuthoredManagedContentsUncached(includeBodies: boolean) {
  await Promise.all(
    (["demo", "documentation", "news"] as const).map((section) =>
      ensureDir(getAuthoredSectionRoot(section)),
    ),
  );

  const metaFiles = await readAuthoredMetaFiles();
  const metas = await readAllAuthoredMetas();
  const entries: ManagedContentEntry[] = [];

  for (const [index, meta] of metas.entries()) {
    entries.push(await createManagedContentEntry(meta, {
      entryDir: path.dirname(metaFiles[index]),
      includeBodies,
    }));
  }

  return entries;
}

export async function saveAuthoredContent(
  input: SaveAuthoredContentInput,
) {
  const storageId = input.storageId || (await createNextStorageId());
  const currentEntryDir = input.storageId
    ? await findAuthoredEntryDir({
        categorySlug: input.categorySlug,
        id: input.id,
        section: input.section,
        storageId: input.storageId,
      })
    : null;
  const entryDir = getEntryDir(input.section, input.categorySlug, storageId);

  if (currentEntryDir && currentEntryDir !== entryDir) {
    await ensureDir(path.dirname(entryDir));
    await fs.rm(entryDir, { force: true, recursive: true });
    await fs.rename(currentEntryDir, entryDir);
  } else {
    await ensureDir(entryDir);
  }

  const localesMap: Partial<Record<Locale, AuthoredLocaleRecord>> = {};

  for (const locale of locales) {
    const richText = input.bodyRichText[locale] ?? "";
    const jsonPath = path.join(entryDir, `${locale}.tiptap.json`);
    const htmlPath = path.join(entryDir, `${locale}.html`);

    if (input.contentType === "outlink") {
      await Promise.all([removeFileIfExists(jsonPath), removeFileIfExists(htmlPath)]);
      continue;
    }

    const html = normalizeBodyHtmlForSave(richText, input.bodyHtml[locale] ?? "", locale);

    if (!richText.trim() && !html.trim()) {
      await Promise.all([removeFileIfExists(jsonPath), removeFileIfExists(htmlPath)]);
      continue;
    }

    const jsonRelativePath = toPosix(
      path.relative(process.cwd(), jsonPath),
    );
    const htmlRelativePath = toPosix(
      path.relative(process.cwd(), htmlPath),
    );

    await writeFileAtomic(jsonPath, richText);
    await writeFileAtomic(htmlPath, html);

    localesMap[locale] = {
      htmlPath: htmlRelativePath,
      jsonPath: jsonRelativePath,
    };
  }

  const normalizedDateIso = normalizeDateIso(input.dateIso);
  const meta: AuthoredContentMeta = {
    authorName: input.authorName,
    authorRole: input.authorRole,
    categorySlug: input.categorySlug,
    contentType: input.contentType,
    dateIso: normalizedDateIso,
    downloadCoverImageSrc: input.downloadCoverImageSrc,
    downloadPdfFileName: input.downloadPdfFileName,
    downloadPdfFileNameByLocale: input.downloadPdfFileNameByLocale,
    downloadPdfSrc: input.downloadPdfSrc,
    downloadPdfSrcByLocale: input.downloadPdfSrcByLocale,
    enableDownloadButton: input.enableDownloadButton,
    externalUrl: input.externalUrl,
    gatingLevel: input.gatingLevel,
    hideHeroImage: input.hideHeroImage,
    id: input.id,
    imageSrc: input.imageSrc,
    relatedIds: input.relatedIds,
    section: input.section,
    sortOrder: input.sortOrder,
    status: input.status,
    storageId,
    summary: normalizeLocalizedRecord(input.summary),
    title: normalizeLocalizedRecord(input.title),
    visibleLocales: input.visibleLocales,
    locales: localesMap,
  };

  await writeFileAtomic(path.join(entryDir, "meta.json"), `${JSON.stringify(meta, null, 2)}\n`);
  invalidateAuthoredCaches();

  return {
    ...input,
    dateIso: normalizedDateIso,
    storageId,
  } satisfies ManagedContentEntry;
}

export async function deleteAuthoredContent({
  categorySlug,
  id,
  section,
  storageId,
}: {
  categorySlug: ManagedContentCategorySlug;
  id: string;
  section: ManagedContentSection;
  storageId?: string;
}) {
  const entryDir = await findAuthoredEntryDir({ categorySlug, id, section, storageId });

  if (!entryDir || !existsSync(entryDir)) {
    return { deleted: false };
  }

  await fs.rm(entryDir, { force: true, recursive: true });
  invalidateAuthoredCaches();

  return { deleted: true };
}

export async function updateAuthoredContentMeta({
  categorySlug,
  id,
  section,
  storageId,
  updates,
}: {
  categorySlug: ManagedContentCategorySlug;
  id: string;
  section: ManagedContentSection;
  storageId?: string;
  updates: Partial<Pick<AuthoredContentMeta, "sortOrder" | "status">>;
}) {
  const entryDir = await findAuthoredEntryDir({ categorySlug, id, section, storageId });

  if (!entryDir || !existsSync(entryDir)) {
    throw new Error("Authored content entry not found.");
  }

  const metaPath = path.join(entryDir, "meta.json");
  const currentMeta = await readMetaFile(metaPath);
  const nextMeta: AuthoredContentMeta = {
    ...currentMeta,
    ...updates,
  };

  await writeFileAtomic(metaPath, `${JSON.stringify(nextMeta, null, 2)}\n`);
  invalidateAuthoredCaches();

  return nextMeta;
}
