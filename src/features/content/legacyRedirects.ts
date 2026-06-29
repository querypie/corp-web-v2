import { publicCategoryPaths } from "./publicPathConfig";

const legacyFolderRedirectBasePaths = [
  ...Object.entries(publicCategoryPaths.demo)
    .filter(([categorySlug]) => categorySlug !== "all")
    .map(([, path]) => path),
  ...Object.entries(publicCategoryPaths.documentation)
    .filter(([categorySlug]) => categorySlug !== "all")
    .map(([, path]) => path),
  ...Object.values(publicCategoryPaths.news),
];

const legacyFolderRedirects = legacyFolderRedirectBasePaths.map((basePath) => ({
  source: `/:locale(en|ko|ja)${basePath}/:legacyFolder/:slug`,
  destination: `/:locale${basePath}/:slug`,
}));

export const legacyContentRedirects = legacyFolderRedirects;
