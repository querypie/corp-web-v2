import { readFileSync } from "fs";
import { readdir, stat } from "fs/promises";
import path from "path";

const projectRoot = process.cwd();
const publicRoot = path.join(projectRoot, "public");

const textExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".mdx",
  ".html",
  ".css",
]);

const scanScopes = [
  path.join(projectRoot, "src", "app"),
  path.join(projectRoot, "src", "components"),
  path.join(projectRoot, "src", "constants"),
  path.join(projectRoot, "src", "content"),
  path.join(projectRoot, "src", "features"),
  path.join(projectRoot, "README.md"),
  path.join(projectRoot, "package.json"),
];

function normalizeWebPath(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("/")) {
    if (trimmed.startsWith("public/")) {
      return `/${trimmed.slice("public/".length)}`;
    }

    return null;
  }

  if (trimmed.startsWith("//") || trimmed.startsWith("/_next")) {
    return null;
  }

  return trimmed.split("?")[0].split("#")[0];
}

function addReference(refs, value, source) {
  const normalized = normalizeWebPath(value);

  if (normalized) {
    refs.set(normalized, source);
  }
}

function walkJson(value, refs, source) {
  if (Array.isArray(value)) {
    value.forEach((item) => walkJson(item, refs, source));
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      typeof nested === "string" &&
      ["src", "href", "poster", "imageSrc", "downloadCoverImageSrc", "downloadPdfSrc", "ogImage", "webPath"].includes(key)
    ) {
      addReference(refs, nested, source);
    }

    walkJson(nested, refs, source);
  }
}

function extractHtmlRefs(text, refs, source) {
  if (!text.includes("<")) {
    return;
  }

  const attrPattern = /\b(?:src|href|poster)=["']([^"']+)["']/g;
  const srcsetPattern = /\bsrcset=["']([^"']+)["']/g;

  for (const match of text.matchAll(attrPattern)) {
    addReference(refs, match[1], source);
  }

  for (const match of text.matchAll(srcsetPattern)) {
    match[1]
      .split(",")
      .map((entry) => entry.trim().split(/\s+/)[0])
      .forEach((entry) => addReference(refs, entry, source));
  }
}

function extractLooseTextRefs(text, refs, source) {
  const slashRefs = text.matchAll(/(^|["'\s(:=])(?<path>\/[^"'`\s)]+)\b/g);

  for (const match of slashRefs) {
    addReference(refs, match.groups?.path, source);
  }

  const markdownRefs = text.matchAll(/\]\((?<path>\/[^)\s]+)\)/g);

  for (const match of markdownRefs) {
    addReference(refs, match.groups?.path, source);
  }

  const publicPathRefs = text.matchAll(/(^|["'\s(:=])(?<path>(?:\.\.\/)+public\/[^"'`\s)]+|public\/[^"'`\s)]+)\b/g);

  for (const match of publicPathRefs) {
    const rawPath = match.groups?.path;

    if (!rawPath) {
      continue;
    }

    const publicIndex = rawPath.indexOf("public/");
    if (publicIndex === -1) {
      continue;
    }

    addReference(refs, `/${rawPath.slice(publicIndex + "public/".length)}`, source);
  }
}

function scanTextContents(text, refs, source) {
  extractHtmlRefs(text, refs, source);
  extractLooseTextRefs(text, refs, source);
}

async function walkFiles(targetPath, onFile) {
  const targetStat = await stat(targetPath);

  if (targetStat.isFile()) {
    await onFile(targetPath);
    return;
  }

  const entries = await readdir(targetPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(targetPath, entry.name);

    if (entry.isDirectory()) {
      await walkFiles(fullPath, onFile);
      continue;
    }

    if (entry.isFile()) {
      await onFile(fullPath);
    }
  }
}

async function scanProjectFiles(refs) {
  for (const scope of scanScopes) {
    await walkFiles(scope, async (filePath) => {
      if (!textExtensions.has(path.extname(filePath))) {
        return;
      }

      const relativePath = path.relative(projectRoot, filePath);
      let raw;

      try {
        raw = readFileSync(filePath, "utf8");
      } catch {
        return;
      }

      if (path.extname(filePath) === ".json") {
        try {
          walkJson(JSON.parse(raw), refs, relativePath);
        } catch {
          // fall through to text scan
        }
      }

      scanTextContents(raw, refs, relativePath);
    });
  }
}

async function listPublicFiles(rootDir) {
  const files = [];

  await walkFiles(rootDir, async (filePath) => {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      return;
    }

    files.push(filePath);
  });

  return files.sort();
}

function groupByTopLevel(paths) {
  const grouped = new Map();

  paths.forEach((webPath) => {
    const segments = webPath.split("/");
    const key = segments[1] || "<root>";
    grouped.set(key, (grouped.get(key) ?? 0) + 1);
  });

  return [...grouped.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
}

async function main() {
  const refs = new Map();

  await scanProjectFiles(refs);

  const publicFiles = await listPublicFiles(publicRoot);
  const unused = publicFiles
    .map((filePath) => `/${path.relative(publicRoot, filePath).split(path.sep).join("/")}`)
    .filter((webPath) => !refs.has(webPath));

  const grouped = groupByTopLevel(unused);

  console.log(`Unused public assets: ${unused.length}`);
  console.log("");
  console.log("By top-level directory:");
  grouped.forEach(([name, count]) => {
    console.log(`- ${name}: ${count}`);
  });

  console.log("");
  console.log("First 200 unused assets:");
  unused.slice(0, 200).forEach((item) => {
    console.log(item);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
