import type { NextConfig } from "next";
import { legacyContentRedirects } from "./src/features/content/legacyRedirects";
import { koEnLegacyRedirects } from "./src/features/routing/koEnLegacyRedirects";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...koEnLegacyRedirects,
      ...legacyContentRedirects.map((redirect) => ({
        ...redirect,
        permanent: true,
      })),
      {
        // Redirect bare public routes to the explicit default locale.
        source: "/:path((?!$|admin(?:/|$)|api(?:/|$)|mockups(?:/|$)|_next(?:/|$)|en(?:/|$)|ko(?:/|$)|ja(?:/|$)|.*\\..*).*)",
        destination: "/en/:path",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/en",
      },
    ];
  },
};

export default nextConfig;
