import dns from "dns";
import { filterXSS } from "xss";
import { WebClient } from "@slack/web-api";
import { NextResponse } from "next/server";
import { issueLicense } from "@/features/community-license/license-service";

type ApplyBody = {
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Company?: string;
  Title?: string;
  Website?: string;
  HasOptedInMarketing__c?: boolean;
};

function hasValidMXRecord(domain: string): Promise<boolean> {
  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err) return resolve(false);
      resolve(addresses && addresses.length > 0);
    });
  });
}

async function sendToSlack(formData: Record<string, unknown>): Promise<void> {
  try {
    const token = process.env.SLACK_BOT_OAUTH_TOKEN;
    const channel = process.env.SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES;

    if (!token || !channel) {
      return;
    }

    const web = new WebClient(token);
    const isProduction = process.env.VERCEL_TARGET_ENV === "production";
    const environmentTag = isProduction ? "" : "[TEST] ";
    const requestUri =
      typeof formData.Referrer_URL__c === "string" && formData.Referrer_URL__c
        ? formData.Referrer_URL__c
        : "-";

    const visibleEntries = Object.entries(formData)
      .filter(([key]) => !key.startsWith("Has") && !key.startsWith("Referrer"))
      .map(([key, value]) => `• *${key}*: ${value || "-"}`);

    visibleEntries.push(`• *RequestURI*: ${requestUri}`);

    const text = `${environmentTag}*New Request QueryPie Community License Received*\n\n${visibleEntries.join("\n")}`;

    await web.chat.postMessage({
      channel,
      blocks: [{ type: "section", text: { type: "mrkdwn", text } }],
      text: `${environmentTag}New Request QueryPie Community License Received`,
    });
  } catch (error) {
    console.error("Failed to send to Slack:", error);
    // Slack 실패는 전체 흐름에 영향을 주지 않는다
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as ApplyBody;
  const { FirstName, LastName, Email, Company, Title, Website, HasOptedInMarketing__c } = body;

  // 1. 필수 필드 검증
  if (!FirstName || !LastName || !Email || !Company) {
    return NextResponse.json(
      { success: false, errorMessage: "Required fields are missing." },
      { status: 400 },
    );
  }

  // 2. MX 레코드 검증
  const emailDomain = Email.split("@")[1];
  if (!emailDomain || !(await hasValidMXRecord(emailDomain))) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return NextResponse.json({
      success: false,
      errorMessage: "Please enter a valid email address.",
    });
  }

  // XSS 필터링 및 requestBody 구성
  const requestBody: Record<string, unknown> = {
    FirstName: filterXSS(FirstName),
    LastName: filterXSS(LastName),
    Email: filterXSS(Email),
    Company: filterXSS(Company) || "None",
    HasOptedInMarketing__c: HasOptedInMarketing__c ?? false,
    Referrer_URL__c: request.headers.get("referer") ?? request.referrer ?? "",
  };

  if (Title) requestBody.Title = filterXSS(Title);
  if (Website) requestBody.Website = filterXSS(Website);

  try {
    // 3. 라이선스 발급 (환경변수 없으면 skip)
    await issueLicense(
      requestBody.Company as string,
      requestBody.Email as string,
    );

    // 4. Slack 알림 (실패해도 무시)
    await sendToSlack(requestBody);

    // 5. 성공
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Community license apply error:", error);
    return NextResponse.json({ success: false });
  }
}
