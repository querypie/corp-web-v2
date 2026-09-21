type HeaderReader = Pick<Headers, "get">;

function getFirstHeaderValue(value: string | null) {
  return value?.split(",", 1)[0]?.trim() || undefined;
}

export function getSiteOrigin(headerStore: HeaderReader) {
  const host = getFirstHeaderValue(headerStore.get("x-forwarded-host")) ||
    getFirstHeaderValue(headerStore.get("host"));

  if (!host) {
    throw new Error("Request host header is required to determine the site origin");
  }

  const forwardedProtocol = getFirstHeaderValue(headerStore.get("x-forwarded-proto"));
  const localHostname = host.replace(/^\[|\](?::\d+)?$/g, "").split(":", 1)[0];
  const fallbackProtocol = localHostname === "localhost" || localHostname === "127.0.0.1"
    ? "http"
    : "https";
  const protocol = forwardedProtocol === "http" || forwardedProtocol === "https"
    ? forwardedProtocol
    : fallbackProtocol;

  const origin = new URL(`${protocol}://${host}`);

  if (
    origin.username ||
    origin.password ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash
  ) {
    throw new Error("Request host header must contain a valid HTTP host");
  }

  return origin;
}

export function getAbsoluteSiteUrl(pathOrUrl: string, origin: string | URL) {
  return new URL(pathOrUrl, origin).toString();
}

export const siteTitle = "QueryPie AI: AI That Gets How You Work";
