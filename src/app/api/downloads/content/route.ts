import dns from "dns";
import { NextResponse } from "next/server";
import { WebClient } from "@slack/web-api";
import { filterXSS } from "xss";
import { isLocale } from "@/constants/i18n";
import {
  CONTENT_UNLOCK_COOKIE_MAX_AGE,
  CONTENT_UNLOCK_COOKIE_PREFIX,
  getContentUnlockCookieName,
} from "@/features/content/gating";
import { readContentItem } from "@/features/content/contentState.server";
import {
  getContentDownloadPdfFileName,
  getContentDownloadPdfSrc,
  getLocalizedContent,
  getResolvedContentLocale,
  isDownloadableContentPdfSrc,
  isPublishedContentAccessible,
  type ManagedContentSection,
} from "@/features/content/data";
import { getLeadFormSlackChannel } from "@/features/slack/lead-form-channel";
import { buildUtmSlackFields } from "@/features/utm/utm";

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

function isDownloadSection(section: unknown): section is Exclude<ManagedContentSection, "news"> {
  return section === "demo" || section === "documentation";
}

function isLeadMode(mode: unknown): mode is NonNullable<DownloadLeadPayload["mode"]> {
  return mode === "download" || mode === "unlock";
}

function getPayloadLocale(payload: DownloadLeadPayload) {
  const locale = payload.locale;
  return typeof locale === "string" && isLocale(locale) ? locale : "en";
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

function getLeadNotificationSource(section: ManagedContentSection | undefined, categorySlug?: string) {
  if (section === "documentation") {
    if (categorySlug === "white-papers") return "whitepapers";
    if (categorySlug === "introduction") return "introduction-deck";
    if (categorySlug === "blogs") return "blog";
    if (categorySlug === "voc") return "voc";
    if (categorySlug === "events") return "events";
    if (categorySlug === "manuals") return "manuals";
    if (categorySlug === "glossary") return "glossary";
  }

  if (section === "demo") {
    if (categorySlug === "use-cases") return "use-cases";
    if (categorySlug === "aip-features") return "aip";
    if (categorySlug === "acp-features") return "acp";
  }

  return section;
}

function buildSlackNotificationBody(formData: Record<string, unknown>) {
  const requestUri =
    typeof formData["Referrer URL"] === "string" && formData["Referrer URL"]
      ? formData["Referrer URL"]
      : "-";

  const visibleEntries = Object.entries(formData)
    .filter(([key]) => key !== "Marketing Consent" && key !== "Referrer URL")
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
  const contentKey = payload.contentId && resolvedPayload.notificationSource
    ? `${resolvedPayload.notificationSource}:${payload.contentId}`
    : payload.contentId;
  const referrerUrl = payload.referrerURL ?? payload.referrerUrl ?? request.headers.get("referer") ?? "";
  const phoneNumber = getStringField(form, "phoneNumber");
  const requestBody: Record<string, unknown> = {
    "First Name": filterXSS(getStringField(form, "firstName")),
    "Last Name": filterXSS(getStringField(form, "lastName")),
    Email: filterXSS(getStringField(form, "email")),
    Company: filterXSS(getStringField(form, "company")) || "None",
    Title: filterXSS(getStringField(form, "departmentTitle")),
    "Mobile Phone": filterXSS(phoneNumber),
    "Inquiry Type": filterXSS(getStringField(form, "inquiryType")),
    "Marketing Consent": getBooleanField(form, "marketingConsent"),
    "Referrer URL": filterXSS(referrerUrl),
  };

  const descriptionParts = [
    contentKey ? `GatedContentKey: ${filterXSS(contentKey)}` : "",
    products.length ? `Product: ${products.map((product) => filterXSS(product)).join(", ")}` : "",
    plannedImplementationDate ? `PlannedImplementationDate: ${filterXSS(plannedImplementationDate)}` : "",
  ].filter(Boolean);

  if (descriptionParts.length) {
    requestBody.Description = descriptionParts.join("\n");
  }

  if (payload.utmAttribution) {
    Object.assign(requestBody, buildUtmSlackFields(payload.utmAttribution));
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
  from?: string,
) {
  const token = process.env.SLACK_BOT_OAUTH_TOKEN;
  const channel = getLeadFormSlackChannel();

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
      notificationSource: getLeadNotificationSource(payload.section),
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

  const locale = getPayloadLocale(payload);
  const attachmentUrl = getContentDownloadPdfSrc(item, locale);
  const attachmentFileName = getContentDownloadPdfFileName(item, locale);

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
    notificationSource: getLeadNotificationSource(item.section, item.categorySlug),
    pdfPreviewUrl: attachmentUrl,
    returnUrl: payload.returnUrl,
    title: payload.title ?? getLocalizedContent(item.title, getResolvedContentLocale(item, locale)),
  };
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

  const notificationPayload = buildLeadNotificationPayload(payload, resolvedPayload, request);
  await sendLeadNotificationToSlack(notificationPayload, mode, resolvedPayload.notificationSource);

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
