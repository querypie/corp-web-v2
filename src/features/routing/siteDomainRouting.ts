const japaneseSiteHostPattern = "(?:[^.]+\\.)*querypie\\.ai";
const japaneseSiteHostnamePattern = new RegExp(`^(?:${japaneseSiteHostPattern})$`, "i");
const localePathPrefixPattern = /^\/(?:en|ko|ja)(?=\/|$)/;
const publicPathPattern = "/:path((?!$|admin(?:/|$)|api(?:/|$)|mockups(?:/|$)|_next(?:/|$)|en(?:/|$)|ko(?:/|$)|ja(?:/|$)|.*\\..*).*)";

const sitemapPathnameBySite = {
  japanese: "/sitemaps/japanese/sitemap.xml",
  multilingual: "/sitemaps/multilingual/sitemap.xml",
} as const;

export function isJapaneseSiteHostname(hostname: string) {
  return japaneseSiteHostnamePattern.test(hostname.split(":")[0]);
}

export function getPublicSitePathname(hostname: string, pathname: string) {
  if (!isJapaneseSiteHostname(hostname)) {
    return pathname;
  }

  return pathname.replace(localePathPrefixPattern, "") || "/";
}

export function getSiteSitemapPathname(hostname: string) {
  return isJapaneseSiteHostname(hostname)
    ? sitemapPathnameBySite.japanese
    : sitemapPathnameBySite.multilingual;
}

export function getJapaneseSiteHostnameCheckScript() {
  return `new RegExp(${JSON.stringify(japaneseSiteHostnamePattern.source)}, "i").test(window.location.hostname)`;
}

export function getSiteDomainRedirects() {
  return [
    {
      source: "/:locale(en|ko|ja)/:path*",
      has: [{ type: "host" as const, value: japaneseSiteHostPattern }],
      destination: "/:path*",
      permanent: true,
    },
    {
      source: publicPathPattern,
      missing: [{ type: "host" as const, value: japaneseSiteHostPattern }],
      destination: "/en/:path",
      permanent: true,
    },
  ];
}

export function getSiteDomainRewrites() {
  return [
    {
      source: "/",
      has: [{ type: "host" as const, value: japaneseSiteHostPattern }],
      destination: "/ja",
    },
    {
      source: publicPathPattern,
      has: [{ type: "host" as const, value: japaneseSiteHostPattern }],
      destination: "/ja/:path",
    },
  ];
}

type RootSiteRouting<MultilingualLocale> =
  | { kind: "japanese" }
  | { kind: "multilingual"; locale: MultilingualLocale };

export function resolveRootSiteRouting<MultilingualLocale>(
  hostname: string,
  resolveMultilingualLocale: () => MultilingualLocale,
): RootSiteRouting<MultilingualLocale> {
  if (isJapaneseSiteHostname(hostname)) {
    return { kind: "japanese" };
  }

  return {
    kind: "multilingual",
    locale: resolveMultilingualLocale(),
  };
}
