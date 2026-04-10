import { promises as fs } from "fs";
import path from "path";

const rootDir = process.cwd();
const srcRoot = path.join(rootDir, "src");
const publicRoot = path.join(rootDir, "public");

const fromWebPath = "/documentation/introduction-decks/";
const toWebPath = "/documentation/introduction/";
const textExtensions = new Set([
  ".css",
  ".html",
  ".json",
  ".md",
  ".mdx",
  ".ts",
  ".tsx",
]);

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

async function replaceReferences() {
  const files = await walk(srcRoot);
  let changedFiles = 0;

  for (const filePath of files) {
    const ext = path.extname(filePath);

    if (!textExtensions.has(ext)) {
      continue;
    }

    const original = await fs.readFile(filePath, "utf8");
    const next = original.split(fromWebPath).join(toWebPath);

    if (next === original) {
      continue;
    }

    await fs.writeFile(filePath, next, "utf8");
    changedFiles += 1;
  }

  return changedFiles;
}

async function main() {
  const fromPath = path.join(publicRoot, "documentation", "introduction-decks");
  const toPath = path.join(publicRoot, "documentation", "introduction");

  await replaceReferences();
  await fs.rename(fromPath, toPath);

  console.log(
    JSON.stringify(
      {
        from: fromWebPath,
        to: toWebPath,
      },
      null,
      2,
    ),
  );
}

await main();
