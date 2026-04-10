import { existsSync, promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import {
  CONTENT_UNLOCK_COOKIE_MAX_AGE,
} from "@/features/content/gating";

type DownloadLeadPayload = {
  attachmentFileName?: string;
  attachmentUrl?: string;
  form?: Record<string, unknown>;
  locale?: string;
  mode?: "download" | "unlock";
  pdfPreviewUrl?: string;
  returnUrl?: string;
  title?: string;
  unlockCookieName?: string;
};

const leadsDir = path.join(process.cwd(), "src", "content", "state");
const leadsPath = path.join(leadsDir, "content-download-leads.json");

async function readLeads() {
  if (!existsSync(leadsPath)) {
    return [];
  }

  try {
    const raw = await fs.readFile(leadsPath, "utf8");
    const parsed = JSON.parse(raw) as unknown[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  const payload = (await request.json()) as DownloadLeadPayload;
  const mode = payload.mode ?? "download";

  if (!payload.form) {
    return NextResponse.json({ error: "Missing download payload." }, { status: 400 });
  }

  if (
    mode === "download" &&
    (!payload.attachmentUrl || !payload.attachmentFileName || !payload.returnUrl || !payload.pdfPreviewUrl)
  ) {
    return NextResponse.json({ error: "Missing download payload." }, { status: 400 });
  }

  await fs.mkdir(leadsDir, { recursive: true });
  const currentLeads = await readLeads();
  const nextLead = {
    attachmentFileName: payload.attachmentFileName,
    attachmentUrl: payload.attachmentUrl,
    createdAt: new Date().toISOString(),
    form: payload.form,
    locale: payload.locale ?? "en",
    mode,
    pdfPreviewUrl: payload.pdfPreviewUrl,
    returnUrl: payload.returnUrl,
    title: payload.title ?? "",
  };

  await fs.writeFile(leadsPath, `${JSON.stringify([nextLead, ...currentLeads], null, 2)}\n`, "utf8");

  const response =
    mode === "download"
      ? NextResponse.json({
          downloadUrl: `/api/downloads/file?${new URLSearchParams({
            fileName: payload.attachmentFileName ?? "download.pdf",
            src: payload.attachmentUrl ?? "",
          }).toString()}`,
          previewUrl: payload.pdfPreviewUrl,
        })
      : NextResponse.json({
          unlocked: true,
        });

  if (payload.unlockCookieName) {
    response.cookies.set({
      httpOnly: false,
      maxAge: CONTENT_UNLOCK_COOKIE_MAX_AGE,
      name: payload.unlockCookieName,
      path: "/",
      sameSite: "lax",
      value: "true",
    });
  }

  return response;
}
