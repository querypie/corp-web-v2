const siteUrlByTarget = {
  preview: "https://www-v2.querypie.com",
  production: "https://www.querypie.com",
  staging: "https://stage-v2.querypie.com",
} as const;

type SiteUrlTarget = keyof typeof siteUrlByTarget;

function isSiteUrlTarget(value: string | undefined): value is SiteUrlTarget {
  return Boolean(value && value in siteUrlByTarget);
}

const fallbackSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
  (isSiteUrlTarget(process.env.VERCEL_TARGET_ENV)
    ? siteUrlByTarget[process.env.VERCEL_TARGET_ENV]
    : "https://www.querypie.com");

type HeaderReader = Pick<Headers, "get">;

function getFirstHeaderValue(value: string | null) {
  return value?.split(",", 1)[0]?.trim() || undefined;
}

export function getSiteOrigin(headerStore: HeaderReader) {
  const host = getFirstHeaderValue(headerStore.get("x-forwarded-host")) ||
    getFirstHeaderValue(headerStore.get("host"));

  if (!host) {
    return new URL(fallbackSiteUrl);
  }

  const forwardedProtocol = getFirstHeaderValue(headerStore.get("x-forwarded-proto"));
  const localHostname = host.replace(/^\[|\](?::\d+)?$/g, "").split(":", 1)[0];
  const fallbackProtocol = localHostname === "localhost" || localHostname === "127.0.0.1"
    ? "http"
    : "https";
  const protocol = forwardedProtocol === "http" || forwardedProtocol === "https"
    ? forwardedProtocol
    : fallbackProtocol;

  try {
    const origin = new URL(`${protocol}://${host}`);

    if (
      origin.username ||
      origin.password ||
      origin.pathname !== "/" ||
      origin.search ||
      origin.hash
    ) {
      return new URL(fallbackSiteUrl);
    }

    return origin;
  } catch {
    return new URL(fallbackSiteUrl);
  }
}

export function getAbsoluteSiteUrl(pathOrUrl: string, origin: string | URL) {
  return new URL(pathOrUrl, origin).toString();
}

export const siteTitle = "QueryPie AI: AI That Gets How You Work";
