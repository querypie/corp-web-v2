import { publicCategoryPaths } from "./publicPathConfig";

const legacyFolderRedirectBasePaths = [
  ...Object.entries(publicCategoryPaths.demo)
    .filter(([categorySlug]) => categorySlug !== "all")
    .map(([, path]) => path),
  ...Object.entries(publicCategoryPaths.resources)
    .filter(([categorySlug]) => categorySlug !== "all")
    .map(([, path]) => path),
  ...Object.values(publicCategoryPaths.news),
];

// Redirects run before the Japanese site's locale rewrite. Match both URL forms.
// Exclude file paths and valid /:slug/download URLs from folder removal.
const legacySlug = ":slug((?!download(?:/|$)|pdf(?:/|$))[^/.]+)";
const legacyContentBases = [
  ...legacyFolderRedirectBasePaths.map((basePath) => ({ source: basePath, destination: basePath })),
  { source: "/demo/use-cases", destination: publicCategoryPaths.demo["aip-features"] },
];
const legacyFolderRedirects = legacyContentBases.flatMap((basePath) =>
  [
    { source: "/:locale(en|ko|ja)", destination: "/:locale" },
    { source: "", destination: "" },
  ].flatMap((prefix) =>
    [
      { source: "", destination: "" },
      { source: "/download", destination: "/download" },
      { source: "/pdf", destination: "/download" },
    ].map((suffix) => ({
      source: `${prefix.source}${basePath.source}/:legacyFolder/${legacySlug}${suffix.source}`,
      destination: `${prefix.destination}${basePath.destination}/:slug${suffix.destination}`,
    })),
  ),
);

export const legacyContentRedirects = [
  // Recover the customer story before generic use-case redirects send it to AIP.
  ...["/:locale(en|ko|ja)", ""].flatMap((prefix) =>
    [
      "/demo/use-cases/:legacyFolder/lovo-ai-tom-lee",
      "/demo/use-cases/lovo-ai-tom-lee",
      "/demo/aip/lovo-ai-tom-lee",
    ].map((source) => ({
      source: `${prefix}${source}`,
      destination: `${prefix ? "/:locale" : ""}${publicCategoryPaths.resources.voc}/lovo-ai-tom-lee`,
    })),
  ),
  {
    source: "/admin/documentation/:path*",
    destination: "/admin/resources/:path*",
  },
  {
    source: "/:locale(en|ko|ja)/features/documentation/:path*",
    destination: "/:locale/features/resources/:path*",
  },
  {
    source: "/features/documentation/:path*",
    destination: "/features/resources/:path*",
  },
  {
    source: "/documentation/:path*",
    destination: `${publicCategoryPaths.resources.all}/:path*`,
  },
  {
    source: "/:locale(en|ko|ja)/documentation/:path*",
    destination: `/:locale${publicCategoryPaths.resources.all}/:path*`,
  },
  ...legacyFolderRedirects,
];
