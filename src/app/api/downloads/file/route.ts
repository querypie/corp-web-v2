import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

function resolvePublicFile(src: string) {
  const relativeSrc = src.startsWith("/") ? src.slice(1) : src;
  const publicRoot = path.join(process.cwd(), "public");
  const absolutePath = path.join(publicRoot, relativeSrc);

  if (!absolutePath.startsWith(publicRoot)) {
    throw new Error("Invalid path.");
  }

  return absolutePath;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const src = url.searchParams.get("src");
  const fileName = url.searchParams.get("fileName") ?? "download.pdf";

  if (!src || !src.endsWith(".pdf")) {
    return NextResponse.json({ error: "PDF source is required." }, { status: 400 });
  }

  try {
    const filePath = resolvePublicFile(src);
    const buffer = await fs.readFile(filePath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "application/pdf",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }
}
