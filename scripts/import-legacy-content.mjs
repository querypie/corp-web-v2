import { existsSync, promises as fs } from "fs";
import path from "path";

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, "backup");
const targetRoot = path.join(projectRoot, "src", "content", "managed");
const publicRoot = path.join(projectRoot, "public");

const localePattern = /^(en|ko|ja)$/;

const categoryMapping = {
  "demo/acp-features": { section: "demo", category: "acp-features" },
  "demo/aip-features": { section: "demo", category: "aip-features" },
  "demo/use-cases": { section: "demo", category: "use-cases" },
  "demo/webinars": { section: "demo", category: "webinars" },
  "documentation/blog": { section: "documentation", category: "blogs" },
  "documentation/glossary": { section: "documentation", category: "glossary" },
  "documentation/introduction-decks": {
    section: "documentation",
    category: "introduction-decks",
  },
  "documentation/manual": { section: "documentation", category: "manuals" },
  "documentation/white-paper": {
    section: "documentation",
    category: "white-papers",
  },
};

const localeOrder = ["en", "ko", "ja"];

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function getAttributeValue(source, attributeName) {
  const match = source.match(
    new RegExp(`${attributeName}\\s*=\\s*["']([^"']+)["']`),
  );

  return match?.[1] ?? "";
}

function parseInlineValue(rawValue) {
  const value = rawValue.trim();

  if (!value) {
    return "";
  }

  if (value === "true") return true;
  if (value === "false") return false;

  if (value.startsWith("[") && value.endsWith("]")) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return stripQuotes(value);
}

function parseIndentedBlock(blockLines) {
  const meaningfulLines = blockLines.filter((line) => line.trim().length > 0);

  if (meaningfulLines.length === 0) {
    return "";
  }

  const normalizedLines = meaningfulLines.map((line) =>
    line.replace(/^\s{2}/, ""),
  );

  if (normalizedLines.every((line) => line.trim().startsWith("- "))) {
    const items = [];
    let currentObject = null;

    for (const line of normalizedLines) {
      const trimmed = line.trim();

      if (!trimmed.startsWith("- ")) {
        continue;
      }

      const itemValue = trimmed.slice(2).trim();

      if (!itemValue) {
        currentObject = {};
        items.push(currentObject);
        continue;
      }

      const objectMatch = itemValue.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.+)$/);

      if (objectMatch) {
        currentObject = {
          [objectMatch[1]]: parseInlineValue(objectMatch[2]),
        };
        items.push(currentObject);
        continue;
      }

      currentObject = null;
      items.push(parseInlineValue(itemValue));
    }

    return items;
  }

  if (
    normalizedLines.every((line) =>
      /^[A-Za-z][A-Za-z0-9_-]*:\s*/.test(line.trim()),
    )
  ) {
    const result = {};

    for (const line of normalizedLines) {
      const match = line.trim().match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.+)$/);

      if (!match) continue;
      result[match[1]] = parseInlineValue(match[2]);
    }

    return result;
  }

  return meaningfulLines.join("\n");
}

function parseFrontmatter(frontmatter) {
  const result = {};
  const lines = frontmatter.split(/\r?\n/);

  for (let index = 0; index < lines.length; ) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);

    if (!keyMatch) {
      index += 1;
      continue;
    }

    const [, key, rest] = keyMatch;

    if (rest.trim()) {
      result[key] = parseInlineValue(rest);
      index += 1;
      continue;
    }

    const blockLines = [];
    index += 1;

    while (index < lines.length) {
      const nextLine = lines[index];

      if (
        nextLine.trim() &&
        !nextLine.startsWith(" ") &&
        /^[A-Za-z][A-Za-z0-9_-]*:\s*/.test(nextLine)
      ) {
        break;
      }

      blockLines.push(nextLine);
      index += 1;
    }

    result[key] = parseIndentedBlock(blockLines);
  }

  return result;
}

function splitFrontmatter(raw) {
  if (!raw.startsWith("---\n")) {
    return { body: raw, frontmatter: "", rawFrontmatter: null };
  }

  const closingIndex = raw.indexOf("\n---\n", 4);

  if (closingIndex < 0) {
    return { body: raw, frontmatter: "", rawFrontmatter: null };
  }

  const rawFrontmatter = raw.slice(4, closingIndex);
  const body = raw.slice(closingIndex + 5);

  return {
    body,
    frontmatter: parseFrontmatter(rawFrontmatter),
    rawFrontmatter,
  };
}

function buildEntryIdentity(groupParts) {
  const sourceCategoryKey = `${groupParts[0]}/${groupParts[1]}`;
  const mapped = categoryMapping[sourceCategoryKey];

  if (!mapped) {
    return null;
  }

  let legacyId = null;
  let slug = "";
  let extraSegments = [];

  if (groupParts[2] && /^\d+$/.test(groupParts[2])) {
    legacyId = groupParts[2];
    slug = groupParts[3] ?? groupParts[2];
    extraSegments = groupParts.slice(4);
  } else {
    slug = groupParts[2] ?? groupParts[1];
    extraSegments = groupParts.slice(3);
  }

  const isDownload = extraSegments.includes("download");
  const baseId = isDownload ? `${slug}-download` : slug;
  const folderName = legacyId ? `${baseId}--${legacyId}` : baseId;

  return {
    entryId: folderName,
    extraSegments,
    isDownload,
    legacyId,
    mapped,
    slug,
    sourceCategory: groupParts[1],
    sourceGroupPath: groupParts.join("/"),
  };
}

function deriveContentKind(section, category, frontmatter, body, isDownload) {
  if (isDownload || frontmatter.gatingForm) {
    return "gated-download";
  }

  if (category === "webinars") {
    return "webinar";
  }

  if (/<Youtube\b/.test(body)) {
    return "video";
  }

  if (section === "documentation" && category === "glossary") {
    return "glossary";
  }

  return "article";
}

function extractAssetRefs(raw) {
  const matches =
    raw.match(
      /(?<![A-Za-z0-9:/_-])public\/[A-Za-z0-9_./-]+\.[A-Za-z0-9]+/g,
    ) ?? [];

  return [...new Set(matches)].map((assetPath) => ({
    exists: existsSync(path.join(publicRoot, assetPath.slice("public/".length))),
    sourcePath: assetPath,
    webPath: `/${assetPath.slice("public/".length)}`,
  }));
}

function cleanInlineWhitespace(value) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function convertTableBlock(block) {
  const rows = [...block.matchAll(/<Table\.Tr>([\s\S]*?)<\/Table\.Tr>/g)].map(
    (match) => match[1],
  );

  if (rows.length === 0) {
    return "";
  }

  const parsedRows = rows
    .map((row) =>
      [...row.matchAll(/<Table\.(?:Th|Td)[^>]*>([\s\S]*?)<\/Table\.(?:Th|Td)>/g)]
        .map((match) => cleanInlineWhitespace(match[1])),
    )
    .filter((row) => row.length > 0);

  if (parsedRows.length === 0) {
    return "";
  }

  const header = parsedRows[0];
  const bodyRows = parsedRows.slice(1);
  const separator = header.map(() => "---");
  const markdownRows = [
    `| ${header.join(" | ")} |`,
    `| ${separator.join(" | ")} |`,
    ...bodyRows.map((row) => `| ${row.join(" | ")} |`),
  ];

  return markdownRows.join("\n");
}

function normalizeMdxBody(body) {
  let normalized = body;

  normalized = normalized.replace(/<Box[^>]*>/g, "");
  normalized = normalized.replace(/<\/Box>/g, "");

  normalized = normalized.replace(
    /<ArticleFileImage[\s\S]*?filepath="([^"]+)"[\s\S]*?alt="([^"]*)"[\s\S]*?\/>/g,
    (_, filepath, alt) => `![${alt}](/${filepath.replace(/^public\//, "")})`,
  );

  normalized = normalized.replace(
    /<Youtube[\s\S]*?src="([^"]+)"[\s\S]*?\/>/g,
    (_, src) => `[Watch video](${src})`,
  );

  normalized = normalized.replace(
    /<ButtonLink[\s\S]*?href="([^"]+)"[\s\S]*?label="([^"]*)"[\s\S]*?\/>/g,
    (_, href, label) => `[${label || href}](${href})`,
  );

  normalized = normalized.replace(
    /<InlineLink[\s\S]*?href="([^"]+)"[\s\S]*?>([\s\S]*?)<\/InlineLink>/g,
    (_, href, text) => `[${cleanInlineWhitespace(text)}](${href})`,
  );

  normalized = normalized.replace(
    /<InfoNote[^>]*>([\s\S]*?)<\/InfoNote>/g,
    (_, text) =>
      cleanInlineWhitespace(text)
        .split(/\n+/)
        .filter(Boolean)
        .map((line) => `> ${line}`)
        .join("\n"),
  );

  normalized = normalized.replace(/<Table[\s\S]*?<\/Table>/g, (block) =>
    convertTableBlock(block),
  );

  normalized = normalized.replace(/<\/?[A-Z][A-Za-z0-9.]*[^>]*>/g, "");
  normalized = normalized.replace(/<br\s*\/?>/gi, "\n");
  normalized = normalized.replace(/\n{3,}/g, "\n\n");

  return `${normalized.trim()}\n`;
}

function getPrimaryImagePath(frontmatter, assetRefs) {
  if (typeof frontmatter.ogImage === "string" && frontmatter.ogImage.startsWith("public/")) {
    return `/${frontmatter.ogImage.slice("public/".length)}`;
  }

  const firstImageAsset = assetRefs.find((assetRef) =>
    /\.(png|jpe?g|webp|gif|svg)$/i.test(assetRef.sourcePath),
  );

  return firstImageAsset?.webPath ?? "";
}

function normalizeAuthorName(authorValue) {
  if (Array.isArray(authorValue)) {
    return authorValue.join(", ");
  }

  return typeof authorValue === "string" ? authorValue : "";
}

async function cleanTargetRoot() {
  await fs.mkdir(targetRoot, { recursive: true });
  const entries = await fs.readdir(targetRoot, { withFileTypes: true });

  await Promise.all(
    entries
      .filter((entry) => entry.name !== "README.md")
      .map((entry) =>
        fs.rm(path.join(targetRoot, entry.name), {
          force: true,
          recursive: true,
        }),
      ),
  );
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function main() {
  const groups = new Map();
  const sourceFiles = [];
  const seedEntries = [];

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (entry.name !== "content.mdx") {
        continue;
      }

      const relPath = path.relative(sourceRoot, fullPath);
      const parts = relPath.split(path.sep);

      if (parts.length < 4) {
        continue;
      }

      const locale = parts.at(-2);

      if (!locale || !localePattern.test(locale)) {
        continue;
      }

      const groupParts = parts.slice(0, -2);
      const identity = buildEntryIdentity(groupParts);

      if (!identity) {
        continue;
      }

      const groupKey = identity.sourceGroupPath;
      const existing = groups.get(groupKey) ?? {
        entryId: identity.entryId,
        extraSegments: identity.extraSegments,
        isDownload: identity.isDownload,
        legacyId: identity.legacyId,
        locales: {},
        mapped: identity.mapped,
        slug: identity.slug,
        sourceCategory: identity.sourceCategory,
        sourceGroupPath: identity.sourceGroupPath,
      };

      existing.locales[locale] = {
        filePath: fullPath,
        relativePath: toPosix(relPath),
      };
      groups.set(groupKey, existing);
      sourceFiles.push(fullPath);
    }
  }

  await walk(sourceRoot);
  await cleanTargetRoot();

  const manifestEntries = [];
  const missingAssetRefs = new Set();

  for (const group of [...groups.values()].sort((left, right) =>
    left.entryId.localeCompare(right.entryId),
  )) {
    const entryDir = path.join(
      targetRoot,
      group.mapped.section,
      group.mapped.category,
      group.entryId,
    );

    await ensureDir(entryDir);

    const localeMeta = {};
    const localizedBodyMarkdown = {};
    const localizedSummary = {};
    const localizedTitle = {};
    let sharedContentKind = null;
    let sharedDateIso = "";
    let sharedAuthorName = "";
    let sharedHideHeroImage = false;
    let sharedImageSrc = "";

    for (const locale of localeOrder) {
      const localeFile = group.locales[locale];

      if (!localeFile) {
        continue;
      }

      const raw = await fs.readFile(localeFile.filePath, "utf8");
      const { body, frontmatter, rawFrontmatter } = splitFrontmatter(raw);
      const contentKind = deriveContentKind(
        group.mapped.section,
        group.mapped.category,
        frontmatter,
        body,
        group.isDownload,
      );
      const normalizedBody = normalizeMdxBody(body);
      const assetRefs = extractAssetRefs(raw);

      for (const assetRef of assetRefs) {
        if (!assetRef.exists) {
          missingAssetRefs.add(assetRef.sourcePath);
        }
      }

      sharedContentKind = sharedContentKind ?? contentKind;
      sharedDateIso =
        sharedDateIso ||
        (typeof frontmatter.date === "string" ? frontmatter.date : "");
      sharedAuthorName =
        sharedAuthorName || normalizeAuthorName(frontmatter.author);
      sharedHideHeroImage =
        sharedHideHeroImage ||
        (typeof frontmatter.hideOgImage === "boolean"
          ? frontmatter.hideOgImage
          : false);
      sharedImageSrc = sharedImageSrc || getPrimaryImagePath(frontmatter, assetRefs);

      localizedBodyMarkdown[locale] = normalizedBody;
      localizedSummary[locale] =
        typeof frontmatter.description === "string" ? frontmatter.description : "";
      localizedTitle[locale] =
        typeof frontmatter.title === "string" ? frontmatter.title : "";
      await fs.writeFile(path.join(entryDir, `${locale}.mdx`), raw, "utf8");

      localeMeta[locale] = {
        assetRefs,
        bodyPath: toPosix(
          path.relative(projectRoot, path.join(entryDir, `${locale}.mdx`)),
        ),
        contentKind,
        description:
          typeof frontmatter.description === "string"
            ? frontmatter.description
            : "",
        hideOgImage:
          typeof frontmatter.hideOgImage === "boolean"
            ? frontmatter.hideOgImage
            : false,
        hideTableOfContents:
          typeof frontmatter.hideTableOfContents === "boolean"
            ? frontmatter.hideTableOfContents
            : false,
        keywords: Array.isArray(frontmatter.keywords)
          ? frontmatter.keywords
          : [],
        layout: typeof frontmatter.layout === "string" ? frontmatter.layout : "",
        ogImage:
          typeof frontmatter.ogImage === "string"
            ? `/${frontmatter.ogImage.slice("public/".length)}`
            : "",
        rawFrontmatter,
        relatedPosts: Array.isArray(frontmatter.relatedPosts)
          ? frontmatter.relatedPosts
          : [],
        sourcePath: localeFile.relativePath,
        title: typeof frontmatter.title === "string" ? frontmatter.title : "",
        frontmatter,
      };
    }

    const entryMeta = {
      category: group.mapped.category,
      contentKind: sharedContentKind ?? "article",
      entryId: group.entryId,
      legacy: {
        extraSegments: group.extraSegments,
        legacyId: group.legacyId,
        sourceCategory: group.sourceCategory,
        sourceGroupPath: group.sourceGroupPath,
        sourceUrl: `/features/${group.sourceGroupPath}`,
      },
      locales: localeMeta,
      section: group.mapped.section,
      slug: group.slug,
    };

    await fs.writeFile(
      path.join(entryDir, "meta.json"),
      `${JSON.stringify(entryMeta, null, 2)}\n`,
      "utf8",
    );

    seedEntries.push({
      authorName: sharedAuthorName,
      authorRole: "",
      bodyHtml: {
        en: "",
        ko: "",
        ja: "",
      },
      bodyMarkdown: {
        en: localizedBodyMarkdown.en ?? localizedBodyMarkdown.ko ?? localizedBodyMarkdown.ja ?? "",
        ko: localizedBodyMarkdown.ko ?? localizedBodyMarkdown.en ?? localizedBodyMarkdown.ja ?? "",
        ja: localizedBodyMarkdown.ja ?? localizedBodyMarkdown.en ?? localizedBodyMarkdown.ko ?? "",
      },
      bodyRichText: {
        en: "",
        ko: "",
        ja: "",
      },
      categorySlug: group.mapped.category,
      contentFormat: "markdown",
      dateIso: sharedDateIso,
      externalUrl: "",
      hideHeroImage: sharedHideHeroImage,
      id: group.entryId,
      imageSrc: sharedImageSrc,
      relatedIds: [],
      section: group.mapped.section,
      sortOrder: 0,
      storageId: undefined,
      status: "published",
      summary: {
        en: localizedSummary.en ?? localizedSummary.ko ?? localizedSummary.ja ?? "",
        ko: localizedSummary.ko ?? localizedSummary.en ?? localizedSummary.ja ?? "",
        ja: localizedSummary.ja ?? localizedSummary.en ?? localizedSummary.ko ?? "",
      },
      title: {
        en: localizedTitle.en ?? localizedTitle.ko ?? localizedTitle.ja ?? "",
        ko: localizedTitle.ko ?? localizedTitle.en ?? localizedTitle.ja ?? "",
        ja: localizedTitle.ja ?? localizedTitle.en ?? localizedTitle.ko ?? "",
      },
    });

    manifestEntries.push({
      category: entryMeta.category,
      contentKind: entryMeta.contentKind,
      entryId: entryMeta.entryId,
      locales: Object.keys(localeMeta),
      metaPath: toPosix(path.relative(projectRoot, path.join(entryDir, "meta.json"))),
      section: entryMeta.section,
      slug: entryMeta.slug,
      sourceUrl: entryMeta.legacy.sourceUrl,
    });
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    missingAssetRefs: [...missingAssetRefs].sort(),
    sourceRoot: toPosix(path.relative(projectRoot, sourceRoot)),
    targetRoot: toPosix(path.relative(projectRoot, targetRoot)),
    totalEntries: manifestEntries.length,
    totalLocaleFiles: sourceFiles.length,
    entries: manifestEntries,
  };

  await fs.writeFile(
    path.join(targetRoot, "index.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  await fs.writeFile(
    path.join(targetRoot, "content-seed.json"),
    `${JSON.stringify(seedEntries, null, 2)}\n`,
    "utf8",
  );

  console.log(
    JSON.stringify(
      {
        missingAssetRefs: manifest.missingAssetRefs.length,
        targetRoot: manifest.targetRoot,
        totalEntries: manifest.totalEntries,
        totalLocaleFiles: manifest.totalLocaleFiles,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
