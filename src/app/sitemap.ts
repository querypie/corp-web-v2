import { getSiteSitemapLocales } from "@/features/routing/siteDomainRouting";
import { getRequestSiteOrigin } from "@/features/seo/requestUrl.server";
import { createSiteSitemap } from "@/features/seo/sitemap.server";

export default async function sitemap() {
  const origin = await getRequestSiteOrigin();
  return createSiteSitemap(getSiteSitemapLocales(origin.hostname));
}
