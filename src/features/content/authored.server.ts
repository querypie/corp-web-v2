import "server-only";

import { existsSync, promises as fs } from "fs";
import path from "path";
import { locales, type Locale } from "@/constants/i18n";
import { getDefaultVisibleLocales, type ManagedContentCategorySlug, type ManagedContentEntry, type ManagedContentSection } from "./data";

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
  downloadPdfSrc?: string;
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
  | "downloadPdfSrc"
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
let authoredMetaCache: AuthoredContentMeta[] | null = null;
let authoredEntriesCache:
  | {
      withBodies: ManagedContentEntry[] | null;
      withoutBodies: ManagedContentEntry[] | null;
    }
  | null = null;
let authoredCacheVersion = 0;
let storageIdCreationQueue = Promise.resolve();
const reservedStorageIds = new Set<string>();

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
  authoredMetaCache = null;
  authoredEntriesCache = null;
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

  authoredMetaFilesCache = metaFiles.sort();
  return authoredMetaFilesCache;
}

async function readMetaFile(metaPath: string) {
  const rawMeta = await fs.readFile(metaPath, "utf8");

  try {
    return JSON.parse(rawMeta) as AuthoredContentMeta;
  } catch (error) {
    throw new Error(`Invalid meta.json: ${toPosix(path.relative(process.cwd(), metaPath))}`);
  }
}

async function readAllAuthoredMetas() {
  if (authoredMetaCache) {
    return authoredMetaCache;
  }

  const metaFiles = await readAuthoredMetaFiles();
  const metas = await Promise.all(metaFiles.map((metaPath) => readMetaFile(metaPath)));
  authoredMetaCache = metas;
  return metas;
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

export async function readAuthoredManagedContents(options?: { includeBodies?: boolean }) {
  const includeBodies = options?.includeBodies ?? true;
  const cachedEntries = authoredEntriesCache?.[includeBodies ? "withBodies" : "withoutBodies"];

  if (cachedEntries) {
    return cachedEntries;
  }

  await Promise.all(
    (["demo", "documentation", "news"] as const).map((section) =>
      ensureDir(getAuthoredSectionRoot(section)),
    ),
  );

  const metaFiles = await readAuthoredMetaFiles();
  const metas = await readAllAuthoredMetas();
  const entries: ManagedContentEntry[] = [];

  for (const [index, meta] of metas.entries()) {
    const bodyHtml = createEmptyLocalizedContent();
    const bodyRichText = createEmptyLocalizedContent();
    const nextLocales: Partial<Record<Locale, AuthoredLocaleRecord>> = {};

    if (includeBodies) {
      const metaFile = metaFiles[index];
      const entryDir = path.dirname(metaFile);

      for (const locale of locales) {
        const jsonPath = path.join(entryDir, `${locale}.tiptap.json`);
        const htmlPath = path.join(entryDir, `${locale}.html`);

        if (!existsSync(jsonPath) && !existsSync(htmlPath)) {
          continue;
        }

        bodyRichText[locale] = existsSync(jsonPath) ? await fs.readFile(jsonPath, "utf8") : "";
        bodyHtml[locale] = existsSync(htmlPath) ? await fs.readFile(htmlPath, "utf8") : "";

        nextLocales[locale] = {
          htmlPath: toPosix(path.relative(process.cwd(), htmlPath)),
          jsonPath: toPosix(path.relative(process.cwd(), jsonPath)),
        };
      }
    }

    const title = normalizeLocalizedRecord(meta.title);

    entries.push({
      authorName: meta.authorName,
      authorRole: meta.authorRole,
      bodyHtml,
      bodyRichText,
      categorySlug: meta.categorySlug,
      contentType: meta.contentType ?? "content",
      dateIso: meta.dateIso,
      downloadCoverImageSrc: meta.downloadCoverImageSrc ?? "",
      downloadPdfFileName: meta.downloadPdfFileName ?? "",
      downloadPdfSrc: meta.downloadPdfSrc ?? "",
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
    });
  }

  authoredEntriesCache = {
    withBodies: includeBodies ? entries : authoredEntriesCache?.withBodies ?? null,
    withoutBodies: includeBodies ? authoredEntriesCache?.withoutBodies ?? null : entries,
  };

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
    const html = input.bodyHtml[locale] ?? "";
    const jsonPath = path.join(entryDir, `${locale}.tiptap.json`);
    const htmlPath = path.join(entryDir, `${locale}.html`);

    if (input.contentType === "outlink") {
      await Promise.all([removeFileIfExists(jsonPath), removeFileIfExists(htmlPath)]);
      continue;
    }

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

  const meta: AuthoredContentMeta = {
    authorName: input.authorName,
    authorRole: input.authorRole,
    categorySlug: input.categorySlug,
    contentType: input.contentType,
    dateIso: input.dateIso,
    downloadCoverImageSrc: input.downloadCoverImageSrc,
    downloadPdfFileName: input.downloadPdfFileName,
    downloadPdfSrc: input.downloadPdfSrc,
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
