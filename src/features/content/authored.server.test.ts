// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { createLocalizedContent, type ManagedContentEntry } from "./data";

vi.mock("server-only", () => ({}));

const originalCwd = process.cwd();
let tempDir = "";

function makeEntry(overrides: Partial<ManagedContentEntry> = {}): ManagedContentEntry {
  return {
    authorName: "Author",
    authorRole: "",
    bodyHtml: createLocalizedContent("<p>body</p>"),
    bodyRichText: createLocalizedContent("{}"),
    categorySlug: "use-cases",
    contentType: "content",
    dateIso: "2026-01-01",
    downloadCoverImageSrc: "",
    downloadPdfFileName: "",
    downloadPdfSrc: "",
    enableDownloadButton: false,
    externalUrl: "",
    gatingLevel: "none",
    hideHeroImage: false,
    id: "item-1",
    imageSrc: "",
    relatedIds: [],
    section: "demo",
    sortOrder: 1,
    status: "published",
    summary: createLocalizedContent(),
    title: createLocalizedContent("Test Title"),
    visibleLocales: ["en"],
    ...overrides,
  };
}

async function writeExistingContent(entry: ManagedContentEntry) {
  const entryDir =
    entry.section === "news"
      ? path.join(tempDir, "src", "content", entry.section, entry.storageId!)
      : path.join(tempDir, "src", "content", entry.section, entry.categorySlug, entry.storageId!);

  await fs.mkdir(entryDir, { recursive: true });
  await fs.writeFile(path.join(entryDir, "en.html"), "<p>old body</p>", "utf8");
  await fs.writeFile(path.join(entryDir, "en.tiptap.json"), "{\"type\":\"doc\"}", "utf8");
  await fs.writeFile(
    path.join(entryDir, "meta.json"),
    `${JSON.stringify({
      authorName: entry.authorName,
      authorRole: entry.authorRole,
      categorySlug: entry.categorySlug,
      contentType: entry.contentType,
      dateIso: entry.dateIso,
      enableDownloadButton: entry.enableDownloadButton,
      externalUrl: entry.externalUrl,
      hideHeroImage: entry.hideHeroImage,
      id: entry.id,
      imageSrc: entry.imageSrc,
      relatedIds: entry.relatedIds,
      section: entry.section,
      sortOrder: entry.sortOrder,
      status: entry.status,
      storageId: entry.storageId,
      summary: entry.summary,
      title: entry.title,
      visibleLocales: entry.visibleLocales,
      locales: {
        en: {
          htmlPath: "src/content/demo/use-cases/cnt_000001/en.html",
          jsonPath: "src/content/demo/use-cases/cnt_000001/en.tiptap.json",
        },
      },
    }, null, 2)}\n`,
    "utf8",
  );

  return entryDir;
}

beforeEach(async () => {
  vi.resetModules();
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "querypie-authored-test-"));
  process.chdir(tempDir);
});

afterEach(async () => {
  process.chdir(originalCwd);
  await fs.rm(tempDir, { force: true, recursive: true });
});

describe("saveAuthoredContent", () => {
  it("outlink 저장 시 기존 locale 본문 파일을 제거한다", async () => {
    const existing = makeEntry({ storageId: "cnt_000001" });
    const entryDir = await writeExistingContent(existing);
    const { saveAuthoredContent } = await import("./authored.server");

    await saveAuthoredContent({
      ...existing,
      bodyHtml: createLocalizedContent(),
      bodyRichText: createLocalizedContent(),
      contentType: "outlink",
      externalUrl: "https://example.com",
    });

    await expect(fs.access(path.join(entryDir, "en.html"))).rejects.toThrow();
    await expect(fs.access(path.join(entryDir, "en.tiptap.json"))).rejects.toThrow();

    const meta = JSON.parse(await fs.readFile(path.join(entryDir, "meta.json"), "utf8")) as {
      contentType: string;
      locales: Record<string, unknown>;
    };
    expect(meta.contentType).toBe("outlink");
    expect(meta.locales).toEqual({});
  });

  it("storageId 기준으로 기존 폴더를 찾아 새 section/category 위치로 이동한다", async () => {
    const existing = makeEntry({ storageId: "cnt_000001" });
    const oldEntryDir = await writeExistingContent(existing);
    const { saveAuthoredContent } = await import("./authored.server");

    await saveAuthoredContent({
      ...existing,
      categorySlug: "blogs",
      section: "documentation",
    });

    const nextEntryDir = path.join(tempDir, "src", "content", "documentation", "blogs", "cnt_000001");

    await expect(fs.access(oldEntryDir)).rejects.toThrow();
    await expect(fs.access(path.join(nextEntryDir, "meta.json"))).resolves.toBeUndefined();

    const meta = JSON.parse(await fs.readFile(path.join(nextEntryDir, "meta.json"), "utf8")) as {
      categorySlug: string;
      section: string;
      storageId: string;
    };
    expect(meta).toMatchObject({
      categorySlug: "blogs",
      section: "documentation",
      storageId: "cnt_000001",
    });
  });
});
