import { getLocaleSwitchPath, type Locale } from "@/constants/i18n";

const websiteHosts = new Set(["querypie.com", "www.querypie.com", "querypie.ai", "www.querypie.ai"]);

/** Render links to either company website on the current origin. */
export function getSameSiteHref(href: string, locale: Locale): string {
  if (!/^(https?:)?\/\//i.test(href)) return href;

  try {
    const url = new URL(href, "https://www.querypie.com");
    if (!websiteHosts.has(url.hostname) || url.username || url.password || url.port) return href;

    const isAsset = /\.[^/]+$/.test(url.pathname);
    const path = isAsset ? url.pathname : getLocaleSwitchPath(url.pathname, locale);
    return `${path}${url.search}${url.hash}`;
  } catch {
    return href;
  }
}

export function localizeContentLinks(html: string, locale: Locale): string {
  return html.replace(
    /(<a\b[^>]*?\shref\s*=\s*)(["'])(.*?)\2/gi,
    (_, prefix, quote, href) => `${prefix}${quote}${getSameSiteHref(href, locale)}${quote}`,
  );
}
