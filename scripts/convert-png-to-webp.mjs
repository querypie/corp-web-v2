import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

const repoRoot = process.cwd();
const targetDirs = process.argv.slice(2);

if (targetDirs.length === 0) {
  console.error("Usage: node scripts/convert-png-to-webp.mjs <dir> [dir...]");
  process.exit(1);
}

const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mdx",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

async function walk(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      results.push(...(await walk(fullPath)));
      continue;
    }

    results.push(fullPath);
  }

  return results;
}

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function collectPngFiles() {
  const files = [];

  for (const dir of targetDirs) {
    const allFiles = await walk(dir);
    files.push(...allFiles.filter((filePath) => filePath.toLowerCase().endsWith(".png")));
  }

  return files.sort();
}

async function collectTextFiles() {
  const roots = [
    path.join(repoRoot, "src"),
    path.join(repoRoot, "public"),
    path.join(repoRoot, "scripts"),
  ];
  const files = [];

  for (const dir of roots) {
    try {
      const allFiles = await walk(dir);
      files.push(
        ...allFiles.filter((filePath) => textExtensions.has(path.extname(filePath).toLowerCase())),
      );
    } catch {
      // Ignore missing roots.
    }
  }

  return files;
}

async function main() {
  const pngFiles = await collectPngFiles();

  if (pngFiles.length === 0) {
    console.log("No PNG files found.");
    return;
  }

  const replacementPairs = [];

  for (const pngPath of pngFiles) {
    const webpPath = pngPath.replace(/\.png$/i, ".webp");

    await sharp(pngPath)
      .webp({ quality: 80 })
      .toFile(webpPath);

    const stat = await fs.stat(webpPath);

    if (!stat.isFile() || stat.size === 0) {
      throw new Error(`Failed to create WEBP: ${webpPath}`);
    }

    const relativeFromRepo = toPosix(path.relative(repoRoot, pngPath));
    const relativeWebpFromRepo = relativeFromRepo.replace(/\.png$/i, ".webp");
    const publicWebPath = `/${toPosix(path.relative(path.join(repoRoot, "public"), pngPath))}`;
    const publicWebpPath = publicWebPath.replace(/\.png$/i, ".webp");

    replacementPairs.push([relativeFromRepo, relativeWebpFromRepo]);
    replacementPairs.push([publicWebPath, publicWebpPath]);
  }

  const textFiles = await collectTextFiles();

  for (const filePath of textFiles) {
    let content = await fs.readFile(filePath, "utf8");
    let changed = false;

    for (const [from, to] of replacementPairs) {
      if (!content.includes(from)) {
        continue;
      }

      content = content.replace(new RegExp(escapeRegExp(from), "g"), to);
      changed = true;
    }

    if (changed) {
      await fs.writeFile(filePath, content, "utf8");
    }
  }

  for (const pngPath of pngFiles) {
    const webpPath = pngPath.replace(/\.png$/i, ".webp");
    const stat = await fs.stat(webpPath);

    if (!stat.isFile() || stat.size === 0) {
      throw new Error(`WEBP missing before PNG delete: ${webpPath}`);
    }

    await fs.unlink(pngPath);
  }

  console.log(`Converted ${pngFiles.length} PNG files to WEBP.`);
}

await main();
