import type { MetadataRoute } from "next";
import { getRequestAbsoluteUrl } from "@/features/seo/requestUrl.server";

export default async function robots(): Promise<MetadataRoute.Robots> {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: await getRequestAbsoluteUrl("/sitemap.xml"),
  };
}
