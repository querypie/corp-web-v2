import { existsSync, promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import {
  CONTENT_UNLOCK_COOKIE_MAX_AGE,
  CONTENT_UNLOCK_COOKIE_PREFIX,
  getContentUnlockCookieName,
} from "@/features/content/gating";
import { readContentItem } from "@/features/content/contentState.server";
import {
  getLocalizedContent,
  isDownloadableContentPdfSrc,
  isPublishedContentAccessible,
  type ManagedContentSection,
} from "@/features/content/data";

type DownloadLeadPayload = {
  attachmentFileName?: string;
  attachmentUrl?: string;
  contentId?: string;
  form?: Record<string, unknown>;
  locale?: string;
  mode?: "download" | "unlock";
  pdfPreviewUrl?: string;
  returnUrl?: string;
  section?: ManagedContentSection;
  title?: string;
  unlockCookieName?: string;
};

const leadsDir = path.join(process.cwd(), "src", "content", "state");
const leadsPath = path.join(leadsDir, "content-download-leads.json");
let leadWriteQueue = Promise.resolve();

function isDownloadSection(section: unknown): section is Exclude<ManagedContentSection, "news"> {
  return section === "demo" || section === "documentation";
}

function isLeadMode(mode: unknown): mode is NonNullable<DownloadLeadPayload["mode"]> {
  return mode === "download" || mode === "unlock";
}

function isSafeCookieName(value: string) {
  return value.startsWith(`${CONTENT_UNLOCK_COOKIE_PREFIX}_`) && /^[a-zA-Z0-9_-]+$/.test(value);
}

function getFallbackCookieName(payload: DownloadLeadPayload) {
  if (payload.unlockCookieName && isSafeCookieName(payload.unlockCookieName)) {
    return payload.unlockCookieName;
  }

  return undefined;
}

function isFallbackDownloadablePdfSrc(section: ManagedContentSection | undefined, src: string) {
  if (isDownloadSection(section)) {
    return isDownloadableContentPdfSrc(section, src);
  }

  return isDownloadableContentPdfSrc("documentation", src) || isDownloadableContentPdfSrc("demo", src);
}

async function resolvePayload(payload: DownloadLeadPayload, mode: NonNullable<DownloadLeadPayload["mode"]>) {
  if (!payload.contentId || !isDownloadSection(payload.section)) {
    return {
      attachmentFileName: payload.attachmentFileName,
      attachmentUrl: payload.attachmentUrl,
      cookieName: getFallbackCookieName(payload),
      pdfPreviewUrl: payload.pdfPreviewUrl,
      returnUrl: payload.returnUrl,
      title: payload.title ?? "",
    };
  }

  const item = await readContentItem(payload.section, payload.contentId, { includeBodies: false });

  if (
    !item ||
    !isPublishedContentAccessible(item) ||
    item.contentType !== "content"
  ) {
    return null;
  }

  const attachmentUrl = item.downloadPdfSrc.trim();
  const attachmentFileName = item.downloadPdfFileName || `${item.id}.pdf`;

  if (
    mode === "download" &&
    (!item.enableDownloadButton || !isDownloadableContentPdfSrc(item.section, attachmentUrl))
  ) {
    return null;
  }

  return {
    attachmentFileName,
    attachmentUrl,
    cookieName: getContentUnlockCookieName(item.id, item.section),
    pdfPreviewUrl: attachmentUrl,
    returnUrl: payload.returnUrl,
    title: payload.title ?? getLocalizedContent(item.title, "en"),
  };
}

async function readLeads() {
  if (!existsSync(leadsPath)) {
    return [];
  }

  try {
    const raw = await fs.readFile(leadsPath, "utf8");
    const parsed = JSON.parse(raw) as unknown[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    throw new Error("Failed to read content download leads.");
  }
}

async function writeLeads(nextLead: Record<string, unknown>) {
  const writeTask = leadWriteQueue
    .catch(() => undefined)
    .then(async () => {
      await fs.mkdir(leadsDir, { recursive: true });
      const currentLeads = await readLeads();
      const tempPath = `${leadsPath}.tmp-${process.pid}-${Date.now()}`;

      await fs.writeFile(tempPath, `${JSON.stringify([nextLead, ...currentLeads], null, 2)}\n`, "utf8");
      await fs.rename(tempPath, leadsPath);
    });

  leadWriteQueue = writeTask.then(() => undefined, () => undefined);
  return writeTask;
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as DownloadLeadPayload | null;

  if (!payload) {
    return NextResponse.json({ error: "Invalid download payload." }, { status: 400 });
  }

  const mode = payload.mode ?? "download";

  if (!isLeadMode(mode)) {
    return NextResponse.json({ error: "Invalid download mode." }, { status: 400 });
  }

  if (!payload.form) {
    return NextResponse.json({ error: "Missing download payload." }, { status: 400 });
  }

  const resolvedPayload = await resolvePayload(payload, mode);

  if (!resolvedPayload) {
    return NextResponse.json({ error: "Content is not available." }, { status: 404 });
  }

  if (
    mode === "download" &&
    (
      !resolvedPayload.attachmentUrl ||
      !resolvedPayload.attachmentFileName ||
      !resolvedPayload.returnUrl ||
      !resolvedPayload.pdfPreviewUrl ||
      !isFallbackDownloadablePdfSrc(payload.section, resolvedPayload.attachmentUrl)
    )
  ) {
    return NextResponse.json({ error: "Missing download payload." }, { status: 400 });
  }

  const nextLead = {
    attachmentFileName: resolvedPayload.attachmentFileName,
    attachmentUrl: resolvedPayload.attachmentUrl,
    contentId: payload.contentId,
    createdAt: new Date().toISOString(),
    form: payload.form,
    locale: payload.locale ?? "en",
    mode,
    pdfPreviewUrl: resolvedPayload.pdfPreviewUrl,
    returnUrl: resolvedPayload.returnUrl,
    section: payload.section,
    title: resolvedPayload.title,
  };

  try {
    await writeLeads(nextLead);
  } catch {
    return NextResponse.json({ error: "Failed to save download lead." }, { status: 500 });
  }

  const response =
    mode === "download"
      ? NextResponse.json({
          downloadUrl: `/api/downloads/file?${new URLSearchParams({
            fileName: resolvedPayload.attachmentFileName ?? "download.pdf",
            src: resolvedPayload.attachmentUrl ?? "",
          }).toString()}`,
          previewUrl: resolvedPayload.pdfPreviewUrl,
        })
      : NextResponse.json({
          unlocked: true,
        });

  if (resolvedPayload.cookieName) {
    response.cookies.set({
      httpOnly: false,
      maxAge: CONTENT_UNLOCK_COOKIE_MAX_AGE,
      name: resolvedPayload.cookieName,
      path: "/",
      sameSite: "lax",
      value: "true",
    });
  }

  return response;
}
