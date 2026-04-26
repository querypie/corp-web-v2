import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import sharp from "sharp";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const ALLOWED_VIDEO_MIME_TYPES = new Set([
  "video/mp4",
  "video/quicktime",
  "video/webm",
]);

const VIDEO_EXTENSIONS_BY_MIME_TYPE = new Map([
  ["video/mp4", ".mp4"],
  ["video/quicktime", ".mov"],
  ["video/webm", ".webm"],
]);

function sanitizeBaseName(fileName: string) {
  const ext = path.extname(fileName);
  const baseName = path.basename(fileName, ext);
  const sanitized = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized || "upload";
}

async function createUniqueFilePath(dirPath: string, baseName: string, extension = ".webp") {
  let index = 1;
  let nextName = `${baseName}${extension}`;
  let nextPath = path.join(dirPath, nextName);

  while (true) {
    try {
      await fs.access(nextPath);
      index += 1;
      nextName = `${baseName}-${index}${extension}`;
      nextPath = path.join(dirPath, nextName);
    } catch {
      return { fileName: nextName, filePath: nextPath };
    }
  }
}

function resolveUploadDirName(section: string | null, categorySlug: string | null) {
  if (section === "news") {
    return "news";
  }

  if (section === "documentation") {
    if (categorySlug === "blogs") return "documentation/blogs";
    if (categorySlug === "white-papers") return "documentation/white-papers";
    if (categorySlug === "glossary") return "documentation/glossary";
    if (categorySlug === "manuals") return "documentation/manuals";
    if (categorySlug === "introduction") return "documentation/introduction";
    return "documentation";
  }

  if (section === "demo") {
    if (categorySlug === "use-cases") return "demo/use-cases";
    if (categorySlug === "webinars") return "demo/webinars";
    if (categorySlug === "aip-features") return "demo/aip-features";
    if (categorySlug === "acp-features") return "demo/acp-features";
    return "demo";
  }

  return "uploads";
}

async function removeUpload(src: string, dirName: string) {
  if (!src.startsWith(`/${dirName}/`) || src.includes("..")) {
    return;
  }

  const dirRoot = path.join(process.cwd(), "public", dirName);
  const relativeSrc = src.slice(`/${dirName}/`.length);
  const filePath = path.join(dirRoot, relativeSrc);

  if (!filePath.startsWith(dirRoot)) {
    return;
  }

  await fs.rm(filePath, { force: true });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const rawSection = formData.get("section");
  const rawCategorySlug = formData.get("categorySlug");
  const section = typeof rawSection === "string" ? rawSection : null;
  const categorySlug = typeof rawCategorySlug === "string" ? rawCategorySlug : null;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.has(file.type) && !ALLOWED_VIDEO_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
  }

  const dirName = resolveUploadDirName(section, categorySlug);
  const uploadsDir = path.join(process.cwd(), "public", dirName);
  const baseName = sanitizeBaseName(file.name);
  const bytes = Buffer.from(await file.arrayBuffer());

  await fs.mkdir(uploadsDir, { recursive: true });

  if (ALLOWED_VIDEO_MIME_TYPES.has(file.type)) {
    const extension = VIDEO_EXTENSIONS_BY_MIME_TYPE.get(file.type) ?? (path.extname(file.name).toLowerCase() || ".mp4");
    const { fileName, filePath } = await createUniqueFilePath(uploadsDir, baseName, extension);
    await fs.writeFile(filePath, bytes);

    return NextResponse.json({ src: `/${dirName}/${fileName}` });
  }

  const optimizedImage = await sharp(bytes)
    .webp({ effort: 4, quality: 80 })
    .toBuffer();
  const { fileName, filePath } = await createUniqueFilePath(uploadsDir, baseName);
  await fs.writeFile(filePath, optimizedImage);

  return NextResponse.json({ src: `/${dirName}/${fileName}` });
}

export async function DELETE(request: Request) {
  const payload = await request.json().catch(() => null) as {
    categorySlug?: unknown;
    section?: unknown;
    src?: unknown;
  } | null;
  const section = typeof payload?.section === "string" ? payload.section : null;
  const categorySlug = typeof payload?.categorySlug === "string" ? payload.categorySlug : null;
  const src = typeof payload?.src === "string" ? payload.src : "";

  if (!src) {
    return NextResponse.json({ error: "src is required." }, { status: 400 });
  }

  await removeUpload(src, resolveUploadDirName(section, categorySlug));

  return NextResponse.json({ success: true });
}
