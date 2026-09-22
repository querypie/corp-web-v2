import type { MetadataRoute } from "next";
import { getAbsoluteSiteUrl } from "@/constants/site";
import { getRequestSiteOrigin } from "@/features/seo/requestUrl.server";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await getRequestSiteOrigin();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: getAbsoluteSiteUrl("/sitemap.xml", origin),
  };
}
