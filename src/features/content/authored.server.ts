import "server-only";

import { existsSync, promises as fs } from "fs";
import path from "path";
import { locales, type Locale } from "@/constants/i18n";
import type { ManagedContentCategorySlug, ManagedContentEntry, ManagedContentSection } from "./data";

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
<<<<<<< HEAD
  downloadCoverImageSrc?: string;
  downloadPdfFileName?: string;
  downloadPdfSrc?: string;
  enableDownloadButton: boolean;
  externalUrl: string;
  gatingLevel?: ManagedContentEntry["gatingLevel"];
=======
  externalUrl: string;
>>>>>>> origin/main
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
  locales: Partial<Record<Locale, AuthoredLocaleRecord>>;
};

type SaveAuthoredContentInput = Pick<
  ManagedContentEntry,
  | "authorName"
  | "authorRole"
  | "bodyHtml"
  | "bodyRichText"
  | "categorySlug"
  | "contentFormat"
  | "contentType"
  | "dateIso"
<<<<<<< HEAD
  | "downloadCoverImageSrc"
  | "downloadPdfFileName"
  | "downloadPdfSrc"
  | "enableDownloadButton"
  | "externalUrl"
  | "gatingLevel"
=======
  | "externalUrl"
>>>>>>> origin/main
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
>;

const contentRoot = path.join(process.cwd(), "src", "content");

function getAuthoredSectionRoot(section: ManagedContentSection) {
  if (section === "documentation") {
<<<<<<< HEAD
    return path.join(contentRoot, "documentation");
=======
    return path.join(contentRoot, "docs");
>>>>>>> origin/main
  }

  return path.join(contentRoot, section);
}

function getAuthoredSeedPath(section: ManagedContentSection) {
  return path.join(getAuthoredSectionRoot(section), "content-seed.json");
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

function createSeedEntry(entry: ManagedContentEntry): ManagedContentEntry {
  return {
    ...entry,
    bodyHtml: createEmptyLocalizedContent(),
    bodyMarkdown: createEmptyLocalizedContent(),
    bodyRichText: createEmptyLocalizedContent(),
  };
}

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

<<<<<<< HEAD
async function writeFileAtomic(filePath: string, contents: string) {
  const tempPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  await fs.writeFile(tempPath, contents, "utf8");
  await fs.rename(tempPath, filePath);
}

async function listStorageIds() {
  const storageIds: string[] = [];

  async function walk(currentDir: string) {
=======
async function listStorageIds() {
  const storageIds: string[] = [];

  async function walk(currentDir: string, depth: number) {
>>>>>>> origin/main
    if (!existsSync(currentDir)) {
      return;
    }

    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (!entry.isDirectory()) {
        continue;
      }

<<<<<<< HEAD
      if (/^cnt_\d+$/.test(entry.name)) {
=======
      if (depth === 2) {
>>>>>>> origin/main
        storageIds.push(entry.name);
        continue;
      }

<<<<<<< HEAD
      await walk(fullPath);
=======
      await walk(fullPath, depth + 1);
>>>>>>> origin/main
    }
  }

  await Promise.all(
    (["demo", "documentation", "news"] as const).map((section) =>
<<<<<<< HEAD
      walk(getAuthoredSectionRoot(section)),
=======
      walk(getAuthoredSectionRoot(section), 0),
>>>>>>> origin/main
    ),
  );

  return storageIds;
}

async function createNextStorageId() {
  const storageIds = await listStorageIds();
  const numericIds = storageIds
    .map((storageId) => Number(storageId.replace(/^cnt_/, "")))
    .filter((value) => Number.isFinite(value));
  const nextValue = (numericIds.length ? Math.max(...numericIds) : 0) + 1;

  return `cnt_${String(nextValue).padStart(6, "0")}`;
}

async function readAuthoredMetaFiles() {
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

<<<<<<< HEAD
async function readMetaFile(metaPath: string) {
  const rawMeta = await fs.readFile(metaPath, "utf8");

  try {
    return JSON.parse(rawMeta) as AuthoredContentMeta;
  } catch (error) {
    throw new Error(`Invalid meta.json: ${toPosix(path.relative(process.cwd(), metaPath))}`);
  }
}

=======
>>>>>>> origin/main
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
    return getEntryDir(section, categorySlug, storageId);
  }

  const metaFiles = await readAuthoredMetaFiles();

  for (const metaFile of metaFiles) {
<<<<<<< HEAD
    const meta = await readMetaFile(metaFile);
=======
    const rawMeta = await fs.readFile(metaFile, "utf8");
    const meta = JSON.parse(rawMeta) as AuthoredContentMeta;
>>>>>>> origin/main

    if (meta.id === id && meta.section === section && meta.categorySlug === categorySlug) {
      return path.dirname(metaFile);
    }
  }

  return null;
}

export async function readAuthoredManagedContents() {
  await Promise.all(
    (["demo", "documentation", "news"] as const).map((section) =>
      ensureDir(getAuthoredSectionRoot(section)),
    ),
  );

  const metaFiles = await readAuthoredMetaFiles();
  const seedEntriesBySection: Record<ManagedContentSection, ManagedContentEntry[]> = {
    demo: [],
    documentation: [],
    news: [],
  };

  for (const metaFile of metaFiles) {
<<<<<<< HEAD
    const meta = await readMetaFile(metaFile);
=======
    const rawMeta = await fs.readFile(metaFile, "utf8");
    const meta = JSON.parse(rawMeta) as AuthoredContentMeta;
>>>>>>> origin/main
    const bodyHtml = createEmptyLocalizedContent();
    const bodyRichText = createEmptyLocalizedContent();
    const entryDir = path.dirname(metaFile);
    const nextLocales: Partial<Record<Locale, AuthoredLocaleRecord>> = {};

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

    const normalizedMeta: AuthoredContentMeta = {
      ...meta,
      locales: nextLocales,
    };

<<<<<<< HEAD
    await writeFileAtomic(metaFile, `${JSON.stringify(normalizedMeta, null, 2)}\n`);
=======
    await fs.writeFile(metaFile, `${JSON.stringify(normalizedMeta, null, 2)}\n`, "utf8");
>>>>>>> origin/main

    seedEntriesBySection[meta.section].push({
      authorName: meta.authorName,
      authorRole: meta.authorRole,
      bodyHtml,
      bodyMarkdown: createEmptyLocalizedContent(),
      bodyRichText,
      categorySlug: meta.categorySlug,
      contentFormat: meta.contentType === "content" ? "tiptap" : "markdown",
      contentType: meta.contentType ?? "content",
      dateIso: meta.dateIso,
<<<<<<< HEAD
      downloadCoverImageSrc: meta.downloadCoverImageSrc ?? "",
      downloadPdfFileName: meta.downloadPdfFileName ?? "",
      downloadPdfSrc: meta.downloadPdfSrc ?? "",
      enableDownloadButton: meta.enableDownloadButton ?? false,
      externalUrl: meta.externalUrl,
      gatingLevel: meta.gatingLevel ?? "none",
=======
      externalUrl: meta.externalUrl,
>>>>>>> origin/main
      hideHeroImage: meta.hideHeroImage,
      id: meta.id,
      imageSrc: meta.imageSrc,
      relatedIds: meta.relatedIds ?? [],
      section: meta.section,
      sortOrder: meta.sortOrder,
      status: meta.status,
      storageId: meta.storageId,
      summary: normalizeLocalizedRecord(meta.summary),
      title: normalizeLocalizedRecord(meta.title),
    });
  }

  return [
    ...seedEntriesBySection.demo,
    ...seedEntriesBySection.documentation,
    ...seedEntriesBySection.news,
  ];
}

export async function regenerateAuthoredContentSeed() {
  const entries = await readAuthoredManagedContents();
  const entriesBySection: Record<ManagedContentSection, ManagedContentEntry[]> = {
    demo: [],
    documentation: [],
    news: [],
  };

  entries.forEach((entry) => {
    entriesBySection[entry.section].push(createSeedEntry(entry));
  });

  await Promise.all(
    (Object.entries(entriesBySection) as Array<[ManagedContentSection, ManagedContentEntry[]]>).map(
      async ([section, sectionEntries]) => {
<<<<<<< HEAD
        await writeFileAtomic(
          getAuthoredSeedPath(section),
          `${JSON.stringify(sectionEntries, null, 2)}\n`,
=======
        await fs.writeFile(
          getAuthoredSeedPath(section),
          `${JSON.stringify(sectionEntries, null, 2)}\n`,
          "utf8",
>>>>>>> origin/main
        );
      },
    ),
  );

  return entries;
}

<<<<<<< HEAD
export async function saveAuthoredContent(
  input: SaveAuthoredContentInput,
  options?: { regenerateSeed?: boolean },
) {
=======
export async function saveAuthoredContent(input: SaveAuthoredContentInput) {
>>>>>>> origin/main
  if (input.contentType === "content" && input.contentFormat !== "tiptap") {
    throw new Error("Content-type authored entries must be saved as TipTap content.");
  }

  const storageId = input.storageId || (await createNextStorageId());
  const entryDir = getEntryDir(input.section, input.categorySlug, storageId);

  await ensureDir(entryDir);

  const localesMap: Partial<Record<Locale, AuthoredLocaleRecord>> = {};

  for (const locale of locales) {
    const richText = input.bodyRichText[locale] ?? "";
    const html = input.bodyHtml[locale] ?? "";

    if (input.contentType === "outlink") {
      continue;
    }

    if (!richText.trim() && !html.trim()) {
      continue;
    }

    const jsonRelativePath = toPosix(
      path.relative(process.cwd(), path.join(entryDir, `${locale}.tiptap.json`)),
    );
    const htmlRelativePath = toPosix(
      path.relative(process.cwd(), path.join(entryDir, `${locale}.html`)),
    );

<<<<<<< HEAD
    await writeFileAtomic(path.join(entryDir, `${locale}.tiptap.json`), richText);
    await writeFileAtomic(path.join(entryDir, `${locale}.html`), html);
=======
    await fs.writeFile(path.join(entryDir, `${locale}.tiptap.json`), richText, "utf8");
    await fs.writeFile(path.join(entryDir, `${locale}.html`), html, "utf8");
>>>>>>> origin/main

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
<<<<<<< HEAD
    downloadCoverImageSrc: input.downloadCoverImageSrc,
    downloadPdfFileName: input.downloadPdfFileName,
    downloadPdfSrc: input.downloadPdfSrc,
    enableDownloadButton: input.enableDownloadButton,
    externalUrl: input.externalUrl,
    gatingLevel: input.gatingLevel,
=======
    externalUrl: input.externalUrl,
>>>>>>> origin/main
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
    locales: localesMap,
  };

<<<<<<< HEAD
  await writeFileAtomic(path.join(entryDir, "meta.json"), `${JSON.stringify(meta, null, 2)}\n`);

  if (options?.regenerateSeed !== false) {
    await regenerateAuthoredContentSeed();
  }
=======
  await fs.writeFile(path.join(entryDir, "meta.json"), `${JSON.stringify(meta, null, 2)}\n`, "utf8");
  await regenerateAuthoredContentSeed();
>>>>>>> origin/main

  return {
    ...input,
    bodyMarkdown: createEmptyLocalizedContent(),
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
    await regenerateAuthoredContentSeed();
    return { deleted: false };
  }

  await fs.rm(entryDir, { force: true, recursive: true });
  await regenerateAuthoredContentSeed();

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
<<<<<<< HEAD
  const currentMeta = await readMetaFile(metaPath);
=======
  const rawMeta = await fs.readFile(metaPath, "utf8");
  const currentMeta = JSON.parse(rawMeta) as AuthoredContentMeta;
>>>>>>> origin/main
  const nextMeta: AuthoredContentMeta = {
    ...currentMeta,
    ...updates,
  };

<<<<<<< HEAD
  await writeFileAtomic(metaPath, `${JSON.stringify(nextMeta, null, 2)}\n`);
=======
  await fs.writeFile(metaPath, `${JSON.stringify(nextMeta, null, 2)}\n`, "utf8");
>>>>>>> origin/main
  await regenerateAuthoredContentSeed();

  return nextMeta;
}
