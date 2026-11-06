import type { MetadataRoute } from "next";
import { getAbsoluteSiteUrl } from "@/constants/site";
import { getRequestSiteOrigin } from "@/features/seo/requestUrl.server";
import { isPreviewSeoHost } from "@/features/seo/languages";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await getRequestSiteOrigin();

  return {
    rules: isPreviewSeoHost(origin.hostname) ? { userAgent: "*", disallow: "/" } : {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: getAbsoluteSiteUrl("/sitemap.xml", origin),
  };
}
