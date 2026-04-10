import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { NextResponse } from "next/server";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
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

async function generatePdfCover({
  baseName,
  pdfPath,
  uploadsDir,
}: {
  baseName: string;
  pdfPath: string;
  uploadsDir: string;
}) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "querypie-pdf-cover-"));
  const tempPngPath = path.join(tempDir, `${baseName}.png`);

  try {
    await execFileAsync("/usr/bin/sips", ["-s", "format", "png", pdfPath, "--out", tempPngPath]);
    const coverBuffer = await sharp(tempPngPath).webp({ effort: 4, quality: 86 }).toBuffer();
    const { fileName, filePath } = await createUniqueFilePath(uploadsDir, `${baseName}-cover`, ".webp");
    await fs.writeFile(filePath, coverBuffer);
    return `/${path.relative(path.join(process.cwd(), "public"), filePath).split(path.sep).join("/")}`;
  } catch {
    return "";
  } finally {
    await fs.rm(tempDir, { force: true, recursive: true });
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

  if (section !== "documentation" || categorySlug !== "white-papers") {
    return NextResponse.json({ error: "White paper PDFs only." }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), "public", "documentation", "white-papers");
  const baseName = sanitizeBaseName(file.name);
  const bytes = Buffer.from(await file.arrayBuffer());

  await fs.mkdir(uploadsDir, { recursive: true });
  const { fileName, filePath } = await createUniqueFilePath(uploadsDir, baseName, ".pdf");
  await fs.writeFile(filePath, bytes);

  const pdfSrc = `/${path.relative(path.join(process.cwd(), "public"), filePath).split(path.sep).join("/")}`;
  const coverSrc = await generatePdfCover({
    baseName: path.basename(fileName, ".pdf"),
    pdfPath: filePath,
    uploadsDir,
  });

  return NextResponse.json({
    coverSrc,
    fileName,
    src: pdfSrc,
  });
}
