import { promises as fs } from "fs";
import { lookup } from "dns/promises";
import { isIP } from "net";
import path from "path";
import { NextResponse } from "next/server";
import sharp from "sharp";

const UPLOAD_DIR_PATHS = {
  uploads: path.join(process.cwd(), "public", "uploads"),
  news: path.join(process.cwd(), "public", "news"),
  documentation: path.join(process.cwd(), "public", "documentation"),
  "documentation/blogs": path.join(process.cwd(), "public", "documentation", "blogs"),
  "documentation/voc": path.join(process.cwd(), "public", "documentation", "voc"),
  "documentation/events": path.join(process.cwd(), "public", "documentation", "events"),
  "documentation/white-papers": path.join(process.cwd(), "public", "documentation", "white-papers"),
  "documentation/glossary": path.join(process.cwd(), "public", "documentation", "glossary"),
  "documentation/manuals": path.join(process.cwd(), "public", "documentation", "manuals"),
  "documentation/introduction": path.join(process.cwd(), "public", "documentation", "introduction"),
  demo: path.join(process.cwd(), "public", "demo"),
  "demo/use-cases": path.join(process.cwd(), "public", "demo", "use-cases"),
  "demo/aip-features": path.join(process.cwd(), "public", "demo", "aip-features"),
  "demo/acp-features": path.join(process.cwd(), "public", "demo", "acp-features"),
} as const;

type UploadDirName = keyof typeof UPLOAD_DIR_PATHS;

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
const MAX_REMOTE_IMAGE_BYTES = 12 * 1024 * 1024;
const MAX_REMOTE_REDIRECTS = 4;

function sanitizeBaseName(fileName: string) {
  const ext = path.extname(fileName);
  const baseName = path.basename(fileName, ext);
  const sanitized = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized || "upload";
}

function isPrivateIpv4(address: string) {
  const parts = address.split(".").map((part) => Number(part));

  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return true;
  }

  const [first, second] = parts;

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168) ||
    first >= 224
  );
}

function isPrivateIpv6(address: string) {
  const normalized = address.toLowerCase();

  return (
    normalized === "::1" ||
    normalized === "::" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80:")
  );
}

function isBlockedIpAddress(address: string) {
  const ipVersion = isIP(address);

  if (ipVersion === 4) {
    return isPrivateIpv4(address);
  }

  if (ipVersion === 6) {
    return isPrivateIpv6(address);
  }

  return true;
}

async function assertRemoteImageUrlAllowed(url: URL) {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http and https image URLs are allowed.");
  }

  const hostname = url.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "0.0.0.0" ||
    hostname === "::1"
  ) {
    throw new Error("Local image URLs are not allowed.");
  }

  if (isIP(hostname) && isBlockedIpAddress(hostname)) {
    throw new Error("Private image URLs are not allowed.");
  }

  const addresses = await lookup(hostname, { all: true, verbatim: true });

  if (addresses.length === 0 || addresses.some((entry) => isBlockedIpAddress(entry.address))) {
    throw new Error("Private image URLs are not allowed.");
  }
}

async function fetchRemoteImage(sourceUrl: string) {
  let nextUrl = new URL(sourceUrl);

  for (let redirectCount = 0; redirectCount <= MAX_REMOTE_REDIRECTS; redirectCount += 1) {
    await assertRemoteImageUrlAllowed(nextUrl);

    const response = await fetch(nextUrl, {
      redirect: "manual",
      signal: AbortSignal.timeout(15000),
    });

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");

      if (!location) {
        throw new Error("Remote image redirect is missing a location.");
      }

      nextUrl = new URL(location, nextUrl);
      continue;
    }

    if (!response.ok) {
      throw new Error(`Remote image request failed with ${response.status}.`);
    }

    const contentType = response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() ?? "";

    if (!ALLOWED_MIME_TYPES.has(contentType)) {
      throw new Error("Remote image type is not supported.");
    }

    const contentLength = Number(response.headers.get("content-length") ?? "0");

    if (contentLength > MAX_REMOTE_IMAGE_BYTES) {
      throw new Error("Remote image is too large.");
    }

    const bytes = Buffer.from(await response.arrayBuffer());

    if (bytes.byteLength > MAX_REMOTE_IMAGE_BYTES) {
      throw new Error("Remote image is too large.");
    }

    return {
      bytes,
      fileName: path.basename(nextUrl.pathname) || "remote-image",
    };
  }

  throw new Error("Remote image has too many redirects.");
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

function resolveUploadDirName(section: string | null, categorySlug: string | null): UploadDirName {
  if (section === "news") {
    return "news";
  }

  if (section === "documentation") {
    if (categorySlug === "blogs") return "documentation/blogs";
    if (categorySlug === "voc") return "documentation/voc";
    if (categorySlug === "events") return "documentation/events";
    if (categorySlug === "white-papers") return "documentation/white-papers";
    if (categorySlug === "glossary") return "documentation/glossary";
    if (categorySlug === "manuals") return "documentation/manuals";
    if (categorySlug === "introduction") return "documentation/introduction";
    return "documentation";
  }

  if (section === "demo") {
    if (categorySlug === "use-cases") return "demo/use-cases";
    if (categorySlug === "aip-features") return "demo/aip-features";
    if (categorySlug === "acp-features") return "demo/acp-features";
    return "demo";
  }

  return "uploads";
}

async function removeUpload(src: string, dirName: UploadDirName) {
  if (!src.startsWith(`/${dirName}/`) || src.includes("..")) {
    return;
  }

  const dirRoot = UPLOAD_DIR_PATHS[dirName];
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
  const rawSourceUrl = formData.get("sourceUrl");
  const rawSection = formData.get("section");
  const rawCategorySlug = formData.get("categorySlug");
  const sourceUrl = typeof rawSourceUrl === "string" ? rawSourceUrl.trim() : "";
  const section = typeof rawSection === "string" ? rawSection : null;
  const categorySlug = typeof rawCategorySlug === "string" ? rawCategorySlug : null;

  if (!(file instanceof File) && !sourceUrl) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  if (file instanceof File && !ALLOWED_MIME_TYPES.has(file.type) && !ALLOWED_VIDEO_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
  }

  const dirName = resolveUploadDirName(section, categorySlug);
  const uploadsDir = UPLOAD_DIR_PATHS[dirName];

  await fs.mkdir(uploadsDir, { recursive: true });

  if (file instanceof File && ALLOWED_VIDEO_MIME_TYPES.has(file.type)) {
    const baseName = sanitizeBaseName(file.name);
    const bytes = Buffer.from(await file.arrayBuffer());
    const extension = VIDEO_EXTENSIONS_BY_MIME_TYPE.get(file.type) ?? (path.extname(file.name).toLowerCase() || ".mp4");
    const { fileName, filePath } = await createUniqueFilePath(uploadsDir, baseName, extension);
    await fs.writeFile(filePath, bytes);

    return NextResponse.json({ src: `/${dirName}/${fileName}` });
  }

  let imageBytes: Buffer;
  let imageFileName: string;

  try {
    if (file instanceof File) {
      imageBytes = Buffer.from(await file.arrayBuffer());
      imageFileName = file.name;
    } else {
      const remoteImage = await fetchRemoteImage(sourceUrl);
      imageBytes = remoteImage.bytes;
      imageFileName = remoteImage.fileName;
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch remote image." },
      { status: 400 },
    );
  }

  const baseName = sanitizeBaseName(imageFileName);
  const optimizedImage = await sharp(imageBytes)
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
