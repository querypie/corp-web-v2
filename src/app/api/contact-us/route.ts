import dns from "dns";
import { filterXSS } from "xss";
import { WebClient } from "@slack/web-api";
import { after, NextResponse } from "next/server";
import { getLeadFormSlackChannel } from "@/features/slack/lead-form-channel";
import { buildLeadUtmFields } from "@/features/utm/utm";

type ContactUsBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  departmentTitle?: string;
  phoneNumber?: string;
  inquiryType?: string;
  plannedImplementationDate?: string;
  products?: string[];
  message?: string;
  marketingConsent?: boolean;
  referrerURL?: string;
  referrerUrl?: string;
  utmAttribution?: string;
};

function hasValidMXRecord(domain: string): Promise<boolean> {
  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err) return resolve(false);
      resolve(addresses && addresses.length > 0);
    });
  });
}

type DeskPieLeadPayload = {
  processType: string;
  requestBody: Record<string, unknown>;
};

async function sendToDeskPieLead(payload: DeskPieLeadPayload): Promise<void> {
  const endpoint = process.env.DESKPIE_LEAD_API_ENDPOINT;
  const apiKey = process.env.DESKPIE_LEAD_API_KEY;

  if (!endpoint || !apiKey) {
    return;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`[contact-us] deskpie: HTTP ${response.status}`);
    }
  } catch (error) {
    console.error("[contact-us] deskpie: request error", error);
  }
}

async function sendToSlack(requestBody: Record<string, unknown>): Promise<void> {
  const token = process.env.SLACK_BOT_OAUTH_TOKEN;
  const channel = getLeadFormSlackChannel();

  if (!token || !channel) {
    return;
  }

  const web = new WebClient(token);
  const isProduction = process.env.VERCEL_TARGET_ENV === "production";
  const environmentTag = isProduction ? "" : "[TEST] ";

  const requestUri =
    typeof requestBody.Referrer_URL__c === "string" && requestBody.Referrer_URL__c
      ? requestBody.Referrer_URL__c
      : "-";

  const visibleEntries = Object.entries(requestBody)
    .filter(([key]) => !key.startsWith("Has") && !key.startsWith("Referrer"))
    .map(([key, value]) => `• *${key}*: ${value || "-"}`);

  visibleEntries.push(`• *RequestURI*: ${requestUri}`);

  const text = `${environmentTag}*New Contact Sales Received(contact-us)*\n\n${visibleEntries.join("\n")}`;

  await web.chat.postMessage({
    channel,
    blocks: [{ type: "section", text: { type: "mrkdwn", text } }],
    text: `${environmentTag}New Contact Sales Received`,
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactUsBody | null;

  if (!body) {
    return NextResponse.json(
      { success: false, errorCode: "invalid_request", errorMessage: "Invalid request payload." },
      { status: 400 },
    );
  }

  const {
    firstName, lastName, email, company, departmentTitle,
    phoneNumber, inquiryType, plannedImplementationDate, referrerURL, referrerUrl,
    products, message, marketingConsent, utmAttribution,
  } = body;

  // 2. 필수 필드 검증
  if (!firstName || !lastName || !email || !company || !departmentTitle) {
    return NextResponse.json(
      { success: false, errorCode: "missing_required_fields", errorMessage: "Required fields are missing." },
      { status: 400 },
    );
  }

  // 3. MX 레코드 검증
  const emailDomain = email.split("@")[1];
  if (!emailDomain || !(await hasValidMXRecord(emailDomain))) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return NextResponse.json({
      success: false,
      errorCode: "invalid_email",
      errorMessage: "Please enter a valid email address.",
    });
  }

  // 4. XSS 필터링 + DeskPie 전달 payload 빌드
  const requestBody: Record<string, unknown> = {
    FirstName: filterXSS(firstName),
    LastName: filterXSS(lastName),
    Email: filterXSS(email),
    Company: filterXSS(company) || "None",
    Title: filterXSS(departmentTitle),
    Objective__c: filterXSS(inquiryType ?? ""),
    Questions__c: filterXSS(message ?? ""),
    HasOptedInMarketing__c: marketingConsent ?? false,
    Referrer_URL__c: filterXSS(referrerURL ?? referrerUrl ?? request.headers.get("referer") ?? ""),
  };

  if (phoneNumber) requestBody.MobilePhone = filterXSS(phoneNumber);

  // products + plannedImplementationDate → Description
  const descriptionParts: string[] = [];
  if (products?.length) {
    descriptionParts.push(`Product: ${products.map((p) => filterXSS(p)).join(", ")}`);
  }
  if (plannedImplementationDate) {
    descriptionParts.push(`PlannedImplementationDate: ${filterXSS(plannedImplementationDate)}`);
  }
  if (descriptionParts.length) requestBody.Description = descriptionParts.join("\n");

  // 5. UTM 필드 merge
  if (utmAttribution) {
    Object.assign(requestBody, buildLeadUtmFields(utmAttribution));
  }

  after(() => sendToDeskPieLead({ requestBody, processType: "LEAD_MS" }));

  // 6. Slack 알림 (best-effort)
  try {
    await sendToSlack(requestBody);
  } catch (error) {
    console.error("[contact-us] slack: failed", error);
  }

  return NextResponse.json({ success: true });
}
