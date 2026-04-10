import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import sharp from "sharp";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
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

async function createUniqueFilePath(dirPath: string, baseName: string) {
  let index = 1;
  let nextName = `${baseName}.webp`;
  let nextPath = path.join(dirPath, nextName);

  while (true) {
    try {
      await fs.access(nextPath);
      index += 1;
      nextName = `${baseName}-${index}.webp`;
      nextPath = path.join(dirPath, nextName);
    } catch {
      return { fileName: nextName, filePath: nextPath };
    }
  }
}

function resolveUploadDirName(section: string | null, categorySlug: string | null) {
  if (section === "news") {
    return "company/news";
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

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
  }

  const dirName = resolveUploadDirName(section, categorySlug);
  const uploadsDir = path.join(process.cwd(), "public", dirName);
  const baseName = sanitizeBaseName(file.name);
  const bytes = Buffer.from(await file.arrayBuffer());
  const optimizedImage = await sharp(bytes)
    .webp({ effort: 4, quality: 80 })
    .toBuffer();

  await fs.mkdir(uploadsDir, { recursive: true });
  const { fileName, filePath } = await createUniqueFilePath(uploadsDir, baseName);
  await fs.writeFile(filePath, optimizedImage);

  return NextResponse.json({ src: `/${dirName}/${fileName}` });
}
