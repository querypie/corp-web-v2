import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const DOWNLOADABLE_PUBLIC_ROOTS = [
  {
    prefix: "/documentation/",
    root: path.join(process.cwd(), "public", "documentation"),
  },
  {
    prefix: "/demo/",
    root: path.join(process.cwd(), "public", "demo"),
  },
];

function resolvePublicFile(src: string) {
  for (const { prefix, root } of DOWNLOADABLE_PUBLIC_ROOTS) {
    if (!src.startsWith(prefix)) {
      continue;
    }

    const relativeSrc = src.slice(prefix.length);
    const absolutePath = path.join(root, relativeSrc);

    if (absolutePath.startsWith(root)) {
      return absolutePath;
    }
  }

  throw new Error("Invalid path.");
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
