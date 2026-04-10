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

function ensureUniqueSlug(id, items, currentId) {
  const taken = new Set(items.filter((item) => item.id !== currentId).map((item) => item.id));

  if (!taken.has(id)) {
    return id;
  }

  let index = 2;
  let nextId = `${id}-${index}`;

  while (taken.has(nextId)) {
    index += 1;
    nextId = `${id}-${index}`;
  }

  return nextId;
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

function findMatchingLegacyItem(items, authoredItem) {
  const candidates = items.filter(
    (item) =>
      item.section === authoredItem.section &&
      item.categorySlug === authoredItem.categorySlug &&
      item.contentFormat === "markdown" &&
      item.contentType === "content" &&
      item.title?.en === authoredItem.title?.en,
  );

  if (candidates.length <= 1) {
    return candidates[0] ?? null;
  }

  const sameDate = candidates.find((item) => item.dateIso && item.dateIso === authoredItem.dateIso);
  if (sameDate) {
    return sameDate;
  }

  const sameImage = candidates.find((item) => item.imageSrc && item.imageSrc === authoredItem.imageSrc);
  if (sameImage) {
    return sameImage;
  }

  return candidates[0] ?? null;
}

function updateRelatedIds(items, idMap) {
  return items.map((item) => ({
    ...item,
    relatedIds: Array.isArray(item.relatedIds)
      ? item.relatedIds.map((relatedId) => idMap.get(relatedId) ?? relatedId)
      : [],
  }));
}

const stateItems = await readJson(statePath);
const metaFiles = await findAuthoredMetaFiles();
const authoredMetas = await Promise.all(
  metaFiles.map(async (metaPath) => ({
    meta: await readJson(metaPath),
    metaPath,
  })),
);

const idMap = new Map();
const nextStateItems = [...stateItems];

for (const { meta, metaPath } of authoredMetas) {
  const matchingStateItem = nextStateItems.find(
    (item) =>
      item.storageId &&
      meta.storageId &&
      item.storageId === meta.storageId &&
      item.section === meta.section,
  );

  if (!matchingStateItem || matchingStateItem.contentType !== "content") {
    continue;
  }

  const legacyItem = findMatchingLegacyItem(nextStateItems, matchingStateItem);
  if (!legacyItem) {
    continue;
  }

  const baseSlug = getLegacyBaseSlug(legacyItem.id);
  const nextId = ensureUniqueSlug(baseSlug, nextStateItems, matchingStateItem.id);

  if (!nextId || nextId === matchingStateItem.id) {
    continue;
  }

  idMap.set(matchingStateItem.id, nextId);
  matchingStateItem.id = nextId;
  meta.id = nextId;
  await writeJson(metaPath, meta);
}

if (idMap.size === 0) {
  console.log("No authored entries required slug migration.");
  process.exit(0);
}

const normalizedStateItems = updateRelatedIds(nextStateItems, idMap);
await writeJson(statePath, normalizedStateItems);

for (const seedPath of sectionSeedPaths) {
  const seedItems = await readJson(seedPath);
  const nextSeedItems = updateRelatedIds(
    seedItems.map((item) =>
      item.storageId && normalizedStateItems.some((stateItem) => stateItem.storageId === item.storageId)
        ? {
            ...item,
            id:
              normalizedStateItems.find((stateItem) => stateItem.storageId === item.storageId)?.id ??
              item.id,
          }
        : item,
    ),
    idMap,
  );
  await writeJson(seedPath, nextSeedItems);
}

console.log(`Migrated ${idMap.size} authored entries to legacy-first slugs.`);
for (const [fromId, toId] of idMap.entries()) {
  console.log(`${fromId} -> ${toId}`);
}
