// One-time migration of the imported ACP notes. Preserve source pixels and captions.
// Old files are moved outside the repository for recovery after all references update.
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import sharp from "sharp";
import { getLabNoteThumbnailSrc } from "./lib/acp-lab-note-images.mjs";

const assetRoot = path.resolve("public/assets/content/acp-lab-notes");
const contentRoot = path.resolve("src/content/resources/acp-lab-notes");
const backupRoot = await fs.mkdtemp(path.join(os.tmpdir(), "acp-lab-original-images-"));
const replacements = new Map();
const obsolete = [];
let oldBytes = 0;
let newBytes = 0;
for (const dir of await fs.readdir(assetRoot, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  for (const file of await fs.readdir(path.join(assetRoot, dir.name))) {
    const source = path.join(assetRoot, dir.name, file);
    if (file === "cover.png" || file === "thumbnail.webp") { obsolete.push(source); continue; }
    if (!/^\d+\.(png|jpe?g)$/i.test(file)) continue;
    const destination = source.replace(/\.[^.]+$/, ".webp");
    try { await fs.access(destination); throw new Error(`Refusing to overwrite ${destination}`); }
    catch (error) { if (error.code !== "ENOENT") throw error; }
    const before = await sharp(source).metadata();
    await sharp(source).webp({ lossless: true, effort: 6 }).toFile(destination);
    const after = await sharp(destination).metadata();
    if (before.width !== after.width || before.height !== after.height) throw new Error(`Image dimensions changed: ${source}`);
    const originalPixels = await sharp(source).ensureAlpha().raw().toBuffer();
    const convertedPixels = await sharp(destination).ensureAlpha().raw().toBuffer();
    if (!originalPixels.equals(convertedPixels)) throw new Error(`Pixel mismatch: ${source}`);
    oldBytes += (await fs.stat(source)).size;
    newBytes += (await fs.stat(destination)).size;
    replacements.set(`/${path.relative("public", source)}`, `/${path.relative("public", destination)}`);
    obsolete.push(source);
  }
  console.log(`Converted ${dir.name}`);
}

let thumbnails = 0;
for (const directory of await fs.readdir(contentRoot)) {
  const dir = path.join(contentRoot, directory);
  const metaPath = path.join(dir, "meta.json");
  const meta = JSON.parse(await fs.readFile(metaPath, "utf8"));
  const episode = Number(meta.authorName.match(/^(\d+)\s*편/)?.[1]) || meta.sortOrder;
  meta.imageSrc = getLabNoteThumbnailSrc(meta.id, episode);
  for (const file of await fs.readdir(dir)) {
    if (!/\.(html|tiptap\.json)$/.test(file)) continue;
    let body = await fs.readFile(path.join(dir, file), "utf8");
    for (const [from, to] of replacements) body = body.replaceAll(from, to);
    await fs.writeFile(path.join(dir, file), body);
  }
  await fs.writeFile(metaPath, JSON.stringify(meta, null, 2) + "\n");
  thumbnails++;
}

for (const source of obsolete) {
  const destination = path.join(backupRoot, path.relative(assetRoot, source));
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.rename(source, destination);
}
console.log(JSON.stringify({ converted: replacements.size, updatedThumbnails: thumbnails, removedThumbnailFiles: obsolete.length - replacements.size, oldBytes, newBytes, backupRoot }, null, 2));
