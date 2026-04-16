import dns from "dns";
import { filterXSS } from "xss";
import { WebClient } from "@slack/web-api";
import { NextResponse } from "next/server";
import { toSalesforceFields } from "@/features/utm/utm";

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

async function sendToSlack(requestBody: Record<string, unknown>): Promise<void> {
  const web = new WebClient(process.env.SLACK_BOT_OAUTH_TOKEN);
  const isProduction = process.env.VERCEL_TARGET_ENV === "production";
  const environmentTag = isProduction ? "" : "[TEST] ";

  const formattedData = Object.entries(requestBody)
    .filter(([key]) => !key.startsWith("Has") && !key.startsWith("Referrer") && !key.startsWith("pi__"))
    .map(([key, value]) => `• *${key}*: ${value || "-"}`)
    .join("\n");

  const text = `${environmentTag}*New Contact Sales Received*\n\n${formattedData}`;

  await web.chat.postMessage({
    channel: process.env.SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES as string,
    blocks: [{ type: "section", text: { type: "mrkdwn", text } }],
    text: `${environmentTag}New Contact Sales Received`,
  });
}

export async function POST(request: Request) {
  // 1. Slack 환경변수 검증 (필수)
  if (!process.env.SLACK_BOT_OAUTH_TOKEN || !process.env.SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES) {
    console.error("[contact-us] Slack environment variables not configured");
    return NextResponse.json(
      { success: false, errorMessage: "Server configuration error. Please contact support." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as ContactUsBody;
  const {
    firstName, lastName, email, company, departmentTitle,
    phoneNumber, inquiryType, plannedImplementationDate,
    products, message, marketingConsent, utmAttribution,
  } = body;

  // 2. 필수 필드 검증
  if (!firstName || !lastName || !email || !company || !departmentTitle) {
    return NextResponse.json(
      { success: false, errorMessage: "Required fields are missing." },
      { status: 400 },
    );
  }

  // 3. MX 레코드 검증
  const emailDomain = email.split("@")[1];
  if (!emailDomain || !(await hasValidMXRecord(emailDomain))) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return NextResponse.json({
      success: false,
      errorMessage: "Please enter a valid email address.",
    });
  }

  // 4. XSS 필터링 + Salesforce 필드 빌드
  const requestBody: Record<string, unknown> = {
    FirstName: filterXSS(firstName),
    LastName: filterXSS(lastName),
    Email: filterXSS(email),
    Company: filterXSS(company) || "None",
    Title: filterXSS(departmentTitle),
    Objective__c: filterXSS(inquiryType ?? ""),
    Questions__c: filterXSS(message ?? ""),
    HasOptedInMarketing__c: marketingConsent ?? false,
    Referrer_URL__c: request.headers.get("referer") ?? "",
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
    Object.assign(requestBody, toSalesforceFields(utmAttribution));
  }

  // 6. Salesforce POST (best-effort)
  if (process.env.SALESFORCE_ENDPOINT) {
    try {
      const sfResult = await fetch(process.env.SALESFORCE_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json", charset: "utf-8" },
        body: JSON.stringify({ requestBody, processType: "LEAD_MS" }),
      });

      try {
        const json = (await sfResult.json()) as { recordUUID?: string };
        if (!json.recordUUID) {
          console.error("[contact-us] salesforce: no recordUUID in response");
        } else {
          console.info(`[contact-us] salesforce: success recordUUID=${json.recordUUID}`);
        }
      } catch {
        console.error("[contact-us] salesforce: JSON parse error");
      }

      if (!sfResult.ok) {
        console.error(`[contact-us] salesforce: HTTP ${sfResult.status}`);
      }
    } catch (error) {
      console.error("[contact-us] salesforce: request error", error);
    }
  } else {
    console.warn("[contact-us] salesforce: skipped (env not set)");
  }

  // 7. Slack 알림 (필수 — 실패 시 success:false)
  try {
    await sendToSlack(requestBody);
  } catch (error) {
    console.error("[contact-us] slack: failed", error);
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true });
}
