import { locales } from "@/constants/i18n";
import { createSiteSitemap } from "@/features/seo/sitemap.server";

export default function sitemap() {
  return createSiteSitemap(locales);
}
