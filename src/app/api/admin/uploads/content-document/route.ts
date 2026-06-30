import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const ALLOWED_MIME_TYPES = new Set(["application/pdf"]);

function sanitizeBaseName(fileName: string) {
  const ext = path.extname(fileName);
  const baseName = path.basename(fileName, ext);
  const sanitized = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized || "document";
}

async function createUniqueFilePath(dirPath: string, baseName: string, extension: string) {
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

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const section = formData.get("section");
  const categorySlug = formData.get("categorySlug");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
  }

  if (typeof section !== "string" || section === "news" || typeof categorySlug !== "string") {
    return NextResponse.json({ error: "Downloadable content PDFs only." }, { status: 400 });
  }

  const uploadsDir =
    section === "documentation"
      ? path.join(process.cwd(), "public", "documentation", categorySlug)
      : path.join(process.cwd(), "public", "demo", categorySlug);
  const baseName = sanitizeBaseName(file.name);
  const bytes = Buffer.from(await file.arrayBuffer());

  await fs.mkdir(uploadsDir, { recursive: true });
  const { fileName, filePath } = await createUniqueFilePath(uploadsDir, baseName, ".pdf");
  await fs.writeFile(filePath, bytes);

  const pdfSrc = `/${path.relative(path.join(process.cwd(), "public"), filePath).split(path.sep).join("/")}`;

  return NextResponse.json({
    fileName,
    src: pdfSrc,
  });
}
