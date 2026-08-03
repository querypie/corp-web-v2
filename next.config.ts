import type { NextConfig } from "next";
import { legacyContentRedirects } from "./src/features/content/legacyRedirects";
import {
  japaneseExactRedirects,
  japaneseFallbackRedirects,
} from "./src/features/routing/jaRedirects";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...japaneseExactRedirects,
      ...japaneseFallbackRedirects,
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
