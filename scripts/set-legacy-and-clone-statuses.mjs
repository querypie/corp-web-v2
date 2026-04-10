import { promises as fs } from "fs";
import path from "path";

const rootDir = process.cwd();
const statePath = path.join(rootDir, "src", "content", "state", "content-state.json");
const sectionSeedPaths = [
  path.join(rootDir, "src", "content", "demo", "content-seed.json"),
  path.join(rootDir, "src", "content", "docs", "content-seed.json"),
  path.join(rootDir, "src", "content", "news", "content-seed.json"),
];
const authoredRoots = [
  path.join(rootDir, "src", "content", "demo"),
  path.join(rootDir, "src", "content", "docs"),
  path.join(rootDir, "src", "content", "news"),
];

function getLegacyBaseSlug(id) {
  return id.replace(/--\d+$/, "");
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function findAuthoredMetaFiles() {
  const metaFiles = [];

  async function walk(currentDir) {
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

  for (const authoredRoot of authoredRoots) {
    await walk(authoredRoot);
  }

  return metaFiles.sort();
}

const stateItems = await readJson(statePath);
const nextStateItems = [...stateItems];

const legacyItems = nextStateItems.filter(
  (item) => item.section !== "news" && item.contentFormat === "markdown",
);
const cloneIdsToPublish = new Set();
const cloneStorageIdsToPublish = new Set();

for (const legacyItem of legacyItems) {
  legacyItem.status = "hidden";

  const cloneId = getLegacyBaseSlug(legacyItem.id);
  const cloneItem = nextStateItems.find(
    (item) =>
      item.section === legacyItem.section &&
      item.categorySlug === legacyItem.categorySlug &&
      item.contentFormat === "tiptap" &&
      item.contentType === "content" &&
      item.id === cloneId,
  );

  if (!cloneItem) {
    continue;
  }

  cloneItem.status = "published";
  cloneIdsToPublish.add(cloneItem.id);
  if (cloneItem.storageId) {
    cloneStorageIdsToPublish.add(cloneItem.storageId);
  }
}

await writeJson(statePath, nextStateItems);

const metaFiles = await findAuthoredMetaFiles();

for (const metaPath of metaFiles) {
  const meta = await readJson(metaPath);

  if (
    cloneIdsToPublish.has(meta.id) ||
    (meta.storageId && cloneStorageIdsToPublish.has(meta.storageId))
  ) {
    meta.status = "published";
    await writeJson(metaPath, meta);
  }
}

for (const seedPath of sectionSeedPaths) {
  const seedItems = await readJson(seedPath);
  let changed = false;

  for (const item of seedItems) {
    if (item.section !== "news" && item.contentFormat === "markdown") {
      if (item.status !== "hidden") {
        item.status = "hidden";
        changed = true;
      }
      continue;
    }

    if (
      cloneIdsToPublish.has(item.id) ||
      (item.storageId && cloneStorageIdsToPublish.has(item.storageId))
    ) {
      if (item.status !== "published") {
        item.status = "published";
        changed = true;
      }
    }
  }

  if (changed) {
    await writeJson(seedPath, seedItems);
  }
}

console.log(
  JSON.stringify(
    {
      hiddenLegacyCount: legacyItems.length,
      publishedCloneCount: cloneIdsToPublish.size,
      publishedCloneStorageCount: cloneStorageIdsToPublish.size,
    },
    null,
    2,
  ),
);
