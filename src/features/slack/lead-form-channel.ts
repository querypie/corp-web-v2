const TEST_LEAD_FORM_CHANNEL = "C083Y0300M7";

function isVercelNonProduction() {
  if (process.env.VERCEL_TARGET_ENV) {
    return process.env.VERCEL_TARGET_ENV !== "production";
  }

  return Boolean(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production");
}

export function getLeadFormSlackChannel() {
  const token = process.env.SLACK_BOT_OAUTH_TOKEN;

  if (!token) {
    return undefined;
  }

  if (isVercelNonProduction()) {
    return process.env.SLACK_CHANNEL_ALERT_WEBSITE_FORM_SUBMISSION_TESTING ?? TEST_LEAD_FORM_CHANNEL;
  }

  return process.env.SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES;
}
