import { headers } from "next/headers";

import { getAbsoluteSiteUrl, getSiteOrigin } from "@/constants/site";
import { getPublicSitePathname } from "@/features/routing/siteDomainRouting";

export async function getRequestSiteOrigin() {
  return getSiteOrigin(await headers());
}

export async function getRequestAbsoluteUrl(pathOrUrl: string) {
  return getAbsoluteSiteUrl(pathOrUrl, await getRequestSiteOrigin());
}

export async function getRequestPublicUrl(pathOrUrl: string) {
  const origin = await getRequestSiteOrigin();
  const url = new URL(pathOrUrl, origin);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return pathOrUrl;
  }

  url.protocol = origin.protocol;
  url.host = origin.host;
  url.pathname = getPublicSitePathname(origin.hostname, url.pathname);
  return url.toString();
}
