import { promises as fs } from "fs";
import path from "path";

const rootDir = process.cwd();
const publicRoot = path.join(rootDir, "public");
const srcRoot = path.join(rootDir, "src");

const rootMappings = [
  { from: "/blog", to: "/documentation/blogs" },
  { from: "/use-cases", to: "/demo/use-cases" },
  { from: "/webinar", to: "/demo/webinars" },
  { from: "/white-paper", to: "/documentation/white-papers" },
];

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

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function getTargetWebPath(sourceWebPath) {
  const mapping = rootMappings.find((item) => sourceWebPath.startsWith(`${item.from}/`));

  if (!mapping) {
    throw new Error(`No root mapping for ${sourceWebPath}`);
  }

  return sourceWebPath.replace(mapping.from, mapping.to);
}

async function replaceReferences(mapping) {
  const files = await walk(srcRoot);
  let changedFiles = 0;

  for (const filePath of files) {
    const ext = path.extname(filePath);

    if (!textExtensions.has(ext)) {
      continue;
    }

    const original = await fs.readFile(filePath, "utf8");
    let next = original;

    for (const [from, to] of mapping.entries()) {
      next = next.split(from).join(to);
    }

    if (next === original) {
      continue;
    }

    await fs.writeFile(filePath, next, "utf8");
    changedFiles += 1;
  }

  return changedFiles;
}

async function moveAsset(fromWebPath, toWebPath) {
  const fromPath = path.join(publicRoot, fromWebPath.slice(1));
  const toPath = path.join(publicRoot, toWebPath.slice(1));

  await fs.mkdir(path.dirname(toPath), { recursive: true });

  if (await pathExists(toPath)) {
    await fs.unlink(fromPath);
    return;
  }

  await fs.rename(fromPath, toPath);
}

async function main() {
  const mapping = new Map();

  for (const rootMapping of rootMappings) {
    const sourceDir = path.join(publicRoot, rootMapping.from.slice(1));

    if (!(await pathExists(sourceDir))) {
      continue;
    }

    const files = await walk(sourceDir);

    for (const filePath of files) {
      const relative = toPosix(path.relative(publicRoot, filePath));
      const fromWebPath = `/${relative}`;
      const baseName = path.basename(filePath);

      if (baseName === "README.md" || baseName === ".DS_Store") {
        await fs.unlink(filePath);
        continue;
      }

      mapping.set(fromWebPath, getTargetWebPath(fromWebPath));
    }
  }

  const changedFiles = await replaceReferences(mapping);

  for (const [fromWebPath, toWebPath] of mapping.entries()) {
    await moveAsset(fromWebPath, toWebPath);
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
