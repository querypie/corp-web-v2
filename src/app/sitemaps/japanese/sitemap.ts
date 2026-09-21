import { createSiteSitemap } from "@/features/seo/sitemap.server";

export default function sitemap() {
  return createSiteSitemap(["ja"]);
}
