import type { MetadataRoute } from "next";
import { getAbsoluteSiteUrl } from "@/constants/site";
import { getSiteSitemapPathname } from "@/features/routing/siteDomainRouting";
import { getRequestSiteOrigin } from "@/features/seo/requestUrl.server";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await getRequestSiteOrigin();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: getAbsoluteSiteUrl(getSiteSitemapPathname(origin.hostname), origin),
  };
}
