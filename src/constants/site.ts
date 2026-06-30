const siteUrlByTarget = {
  preview: "https://www-v2.querypie.com",
  production: "https://www.querypie.com",
  staging: "https://stage-v2.querypie.com",
} as const;

type SiteUrlTarget = keyof typeof siteUrlByTarget;

function isSiteUrlTarget(value: string | undefined): value is SiteUrlTarget {
  return Boolean(value && value in siteUrlByTarget);
}

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
  (isSiteUrlTarget(process.env.VERCEL_TARGET_ENV)
    ? siteUrlByTarget[process.env.VERCEL_TARGET_ENV]
    : "https://www.querypie.com");

export const publicSiteUrl = "https://www.querypie.com";

export function getAbsolutePublicUrl(pathOrUrl: string) {
  return new URL(pathOrUrl, publicSiteUrl).toString();
}

export const siteTitle = "QueryPie AI: AI That Gets How You Work";
