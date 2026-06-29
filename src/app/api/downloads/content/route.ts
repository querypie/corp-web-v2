import dns from "dns";
import { existsSync, promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { WebClient } from "@slack/web-api";
import { filterXSS } from "xss";
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
import { toSalesforceFields } from "@/features/utm/utm";

type DownloadLeadPayload = {
  attachmentFileName?: string;
  attachmentUrl?: string;
  contentId?: string;
  form?: Record<string, unknown>;
  locale?: string;
  mode?: "download" | "unlock";
  pdfPreviewUrl?: string;
  referrerURL?: string;
  referrerUrl?: string;
  returnUrl?: string;
  section?: ManagedContentSection;
  title?: string;
  utmAttribution?: string;
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

function hasValidMXRecord(domain: string): Promise<boolean> {
  return new Promise((resolve) => {
    dns.resolveMx(domain, (error, addresses) => {
      if (error) {
        resolve(false);
        return;
      }

      resolve(Boolean(addresses?.length));
    });
  });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStringField(form: Record<string, unknown>, key: string) {
  const value = form[key];
  return typeof value === "string" ? value.trim() : "";
}

function getBooleanField(form: Record<string, unknown>, key: string) {
  const value = form[key];
  return value === true || value === "true";
}

function getStringArrayField(form: Record<string, unknown>, key: string) {
  const value = form[key];
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function buildSlackNotificationBody(formData: Record<string, unknown>) {
  const requestUri =
    typeof formData.Referrer_URL__c === "string" && formData.Referrer_URL__c
      ? formData.Referrer_URL__c
      : "-";

  const visibleEntries = Object.entries(formData)
    .filter(([key]) => !key.startsWith("Has") && !key.startsWith("Referrer"))
    .map(([key, value]) => `• *${key}*: ${value || "-"}`);

  visibleEntries.push(`• *RequestURI*: ${requestUri}`);
  return visibleEntries.join("\n");
}

function buildLeadNotificationPayload(
  payload: DownloadLeadPayload,
  resolvedPayload: Awaited<ReturnType<typeof resolvePayload>> & {},
  request: Request,
) {
  const form = payload.form ?? {};
  const products = getStringArrayField(form, "products");
  const plannedImplementationDate = getStringField(form, "plannedImplementationDate");
  const contentKey = payload.contentId && payload.section ? `${payload.section}:${payload.contentId}` : payload.contentId;
  const referrerUrl = payload.referrerURL ?? payload.referrerUrl ?? request.headers.get("referer") ?? "";
  const requestBody: Record<string, unknown> = {
    FirstName: filterXSS(getStringField(form, "firstName")),
    LastName: filterXSS(getStringField(form, "lastName")),
    Email: filterXSS(getStringField(form, "email")),
    Company: filterXSS(getStringField(form, "company")) || "None",
    Title: filterXSS(getStringField(form, "departmentTitle")),
    Objective__c: filterXSS(getStringField(form, "inquiryType")),
    HasOptedInMarketing__c: getBooleanField(form, "marketingConsent"),
    Referrer_URL__c: filterXSS(referrerUrl),
  };

  const phoneNumber = getStringField(form, "phoneNumber");
  if (phoneNumber) requestBody.MobilePhone = filterXSS(phoneNumber);

  const descriptionParts = [
    contentKey ? `GatedContentKey: ${filterXSS(contentKey)}` : "",
    resolvedPayload.title ? `ContentTitle: ${filterXSS(resolvedPayload.title)}` : "",
    products.length ? `Product: ${products.map((product) => filterXSS(product)).join(", ")}` : "",
    plannedImplementationDate ? `PlannedImplementationDate: ${filterXSS(plannedImplementationDate)}` : "",
  ].filter(Boolean);

  if (descriptionParts.length) {
    requestBody.Description = descriptionParts.join("\n");
  }

  if (payload.utmAttribution) {
    Object.assign(requestBody, toSalesforceFields(payload.utmAttribution));
  }

  return requestBody;
}

async function validateLeadEmail(form: Record<string, unknown>) {
  const email = getStringField(form, "email");
  const emailDomain = email.split("@")[1];

  if (!email || !emailDomain || !(await hasValidMXRecord(emailDomain))) {
    await delay(2000);
    return false;
  }

  return true;
}

async function sendLeadNotificationToSlack(
  requestBody: Record<string, unknown>,
  mode: NonNullable<DownloadLeadPayload["mode"]>,
  from?: ManagedContentSection,
) {
  const token = process.env.SLACK_BOT_OAUTH_TOKEN;
  const channel = process.env.SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES;

  if (!token || !channel) {
    return;
  }

  try {
    const web = new WebClient(token);
    const environmentTag = process.env.VERCEL_TARGET_ENV === "production" ? "" : "[TEST] ";
    const title = mode === "download"
      ? "Gating Form To Download Document"
      : "Gating Form To Unlock Document";
    const text = `${environmentTag}*New ${title} Received${from ? `(${from})` : ""}*\n\n${buildSlackNotificationBody(requestBody)}`;

    await web.chat.postMessage({
      channel,
      blocks: [{ type: "section", text: { type: "mrkdwn", text } }],
      text: `${environmentTag}New ${title} Received`,
    });
  } catch (error) {
    console.error("[content-downloads] slack: failed", error);
  }
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
    return NextResponse.json(
      { error: "Invalid download payload.", errorCode: "invalid_request" },
      { status: 400 },
    );
  }

  const mode = payload.mode ?? "download";

  if (!isLeadMode(mode)) {
    return NextResponse.json(
      { error: "Invalid download mode.", errorCode: "invalid_mode" },
      { status: 400 },
    );
  }

  if (!payload.form) {
    return NextResponse.json(
      { error: "Missing download payload.", errorCode: "missing_required_fields" },
      { status: 400 },
    );
  }

  const resolvedPayload = await resolvePayload(payload, mode);

  if (!resolvedPayload) {
    return NextResponse.json(
      { error: "Content is not available.", errorCode: "content_unavailable" },
      { status: 404 },
    );
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
    return NextResponse.json(
      { error: "Missing download payload.", errorCode: "download_unavailable" },
      { status: 400 },
    );
  }

  if (!(await validateLeadEmail(payload.form))) {
    return NextResponse.json(
      { error: "Please enter a valid email address.", errorCode: "invalid_email" },
      { status: 400 },
    );
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
    return NextResponse.json(
      { error: "Failed to save download lead.", errorCode: "server_error" },
      { status: 500 },
    );
  }

  const notificationPayload = buildLeadNotificationPayload(payload, resolvedPayload, request);
  await sendLeadNotificationToSlack(notificationPayload, mode, payload.section);

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
