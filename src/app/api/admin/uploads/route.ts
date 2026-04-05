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

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const fileName = `${sanitizeBaseName(file.name)}-${Date.now()}.webp`;
  const filePath = path.join(uploadsDir, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());
  const optimizedImage = await sharp(bytes)
    .webp({ effort: 4, quality: 80 })
    .toBuffer();

  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(filePath, optimizedImage);

  return NextResponse.json({ src: `/uploads/${fileName}` });
}
