import {
  japaneseRedirects,
  resolveJapaneseRedirectSource,
} from "../src/features/routing/jaRedirects.ts";

const SOURCE_SITEMAP_URL = "https://www.querypie.com/sitemap.xml";
const DESTINATION_SITEMAP_URL = "https://querypie.ai/sitemap.xml";

async function fetchSitemap(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

function extractPaths(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname);
}

const [sourceXml, destinationXml] = await Promise.all([
  fetchSitemap(SOURCE_SITEMAP_URL),
  fetchSitemap(DESTINATION_SITEMAP_URL),
]);

const japaneseSourcePaths = extractPaths(sourceXml).filter(
  (source) => source === "/ja" || source.startsWith("/ja/"),
);
const destinationPaths = new Set(extractPaths(destinationXml));

const results = japaneseSourcePaths.map((source) => {
  const redirect = resolveJapaneseRedirectSource(source);
  return {
    source,
    redirect,
    destinationPath: redirect ? new URL(redirect.destination).pathname : null,
  };
});

const unmapped = results.filter(({ redirect }) => !redirect);
const fallbackMatches = results.filter(({ redirect }) => redirect?.source.endsWith(":path*"));
const missingDestinations = results.filter(
  ({ destinationPath }) => destinationPath && !destinationPaths.has(destinationPath),
);

const summary = {
  generatedRedirects: japaneseRedirects.length,
  japaneseSitemapPaths: japaneseSourcePaths.length,
  exactMappings: results.length - fallbackMatches.length - unmapped.length,
  fallbackMatches: fallbackMatches.length,
  unmapped: unmapped.length,
  destinationsMissingFromQueryPieAiSitemap: missingDestinations.length,
};

console.log(JSON.stringify(summary, null, 2));

if (unmapped.length || fallbackMatches.length || missingDestinations.length) {
  console.error(
    JSON.stringify(
      {
        unmapped: unmapped.map(({ source }) => source),
        fallbackMatches: fallbackMatches.map(({ source, redirect }) => ({
          source,
          rule: redirect?.source,
          destination: redirect?.destination,
        })),
        missingDestinations: missingDestinations.map(({ source, destinationPath }) => ({
          source,
          destinationPath,
        })),
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
}
