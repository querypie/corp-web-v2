import { promises as fs } from "fs";
import path from "path";

const rootDir = process.cwd();
const srcRoot = path.join(rootDir, "src");
const publicRoot = path.join(rootDir, "public");

const documentationCategoryByName = new Map([
  ["docu-thumb-acp-introduction.webp", "introduction-decks"],
  ["docu-thumb-introduction-aip.webp", "introduction-decks"],
  ["docu-thumb-introduction-ai_hub.webp", "introduction-decks"],
  ["docu-thumb-introduction.webp", "introduction-decks"],
  ["docu-thumb-intro.webp", "introduction-decks"],
  ["docu-thumb-glossary.webp", "glossary"],
  ["docu-thumb-notes.webp", "glossary"],
  ["docu-thumb-admin.webp", "glossary"],
  ["docu-thumb-user.webp", "glossary"],
  ["docu-thumb-community-install-guide.webp", "manuals"],
  ["docu-thumb-acp-manual.webp", "manuals"],
  ["docu-thumb-aip-manual.webp", "manuals"],
  ["docu-thumb-ai-hub-user-manual.webp", "manuals"],
  ["docu-thumb-api.webp", "manuals"],
  ["docu-thumb-audit.webp", "manuals"],
  ["docu-thumb-customer.webp", "manuals"],
  ["install-guide-1.webp", "manuals"],
  ["install-guide-2.webp", "manuals"],
  ["install-guide-3.webp", "manuals"],
  ["install-guide-4.webp", "manuals"],
  ["install-guide-5.webp", "manuals"],
  ["install-guide-6.webp", "manuals"],
]);

const textExtensions = new Set([
  ".css",
  ".html",
  ".json",
  ".md",
  ".mdx",
  ".ts",
  ".tsx",
]);

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function getDemoTarget(oldWebPath) {
  const fileName = path.basename(oldWebPath);

  if (fileName === "de-thumb-google-oauth.webp") {
    return `/demo/aip-features/${fileName}`;
  }

  if (fileName.startsWith("de-thumb-")) {
    return `/demo/acp-features/${fileName}`;
  }

  return `/demo/use-cases/${fileName}`;
}

function getDocumentationTarget(oldWebPath) {
  const fileName = path.basename(oldWebPath);
  const category = documentationCategoryByName.get(fileName);

  if (!category) {
    throw new Error(`No target category mapping for ${oldWebPath}`);
  }

  return `/documentation/${category}/${fileName}`;
}

async function walk(dirPath, collected = []) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const nextPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await walk(nextPath, collected);
      continue;
    }

    collected.push(nextPath);
  }

  return collected;
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function moveFile(oldWebPath, nextWebPath) {
  const oldPath = path.join(publicRoot, oldWebPath.slice(1));
  const nextPath = path.join(publicRoot, nextWebPath.slice(1));

  await fs.mkdir(path.dirname(nextPath), { recursive: true });

  if (await pathExists(nextPath)) {
    await fs.unlink(oldPath);
    return;
  }

  await fs.rename(oldPath, nextPath);
}

async function replaceReferences(mapping) {
  const files = await walk(srcRoot);
  let changedCount = 0;

  for (const filePath of files) {
    const ext = path.extname(filePath);

    if (!textExtensions.has(ext)) {
      continue;
    }

    const original = await fs.readFile(filePath, "utf8");
    let next = original;

    for (const [oldWebPath, nextWebPath] of mapping.entries()) {
      next = next.split(oldWebPath).join(nextWebPath);
    }

    if (next === original) {
      continue;
    }

    await fs.writeFile(filePath, next, "utf8");
    changedCount += 1;
  }

  return changedCount;
}

async function main() {
  const mapping = new Map();
  const demoRoot = path.join(publicRoot, "demo");
  const documentationRoot = path.join(publicRoot, "documentation");
  const demoFiles = (await fs.readdir(demoRoot))
    .filter((name) => !name.startsWith("."))
    .map((name) => `/demo/${name}`);
  const documentationFiles = (await fs.readdir(documentationRoot))
    .filter((name) => !name.startsWith(".") && name !== "README.md")
    .map((name) => `/documentation/${name}`);

  for (const oldWebPath of demoFiles) {
    mapping.set(oldWebPath, getDemoTarget(oldWebPath));
  }

  for (const oldWebPath of documentationFiles) {
    mapping.set(oldWebPath, getDocumentationTarget(oldWebPath));
  }

  const changedFiles = await replaceReferences(mapping);

  for (const [oldWebPath, nextWebPath] of mapping.entries()) {
    await moveFile(oldWebPath, nextWebPath);
  }

  const documentationReadme = path.join(documentationRoot, "README.md");
  if (await pathExists(documentationReadme)) {
    await fs.unlink(documentationReadme);
  }

  console.log(
    JSON.stringify(
      {
        changedFiles,
        movedAssets: mapping.size,
        sampleMappings: [...mapping.entries()].slice(0, 12).map(([from, to]) => ({ from, to })),
      },
      null,
      2,
    ),
  );
}

await main();
