import type { NextConfig } from "next";
import { legacyContentRedirects } from "./src/features/content/legacyRedirects";
import { koEnLegacyRedirects } from "./src/features/routing/koEnLegacyRedirects";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/assets/products/:path*",
        destination: "/assets/pages/platforms/:path*",
        permanent: true,
      },
      {
        source: "/assets/platforms/:path*",
        destination: "/assets/pages/platforms/:path*",
        permanent: true,
      },
      {
        source: "/:locale(en|ko|ja)/solutions/:platform(aip|acp)/:path*",
        destination: "/:locale/platforms/:platform/:path*",
        permanent: true,
      },
      {
        source: "/solutions/:platform(aip|acp)/:path*",
        destination: "/platforms/:platform/:path*",
        permanent: true,
      },
      ...koEnLegacyRedirects,
      ...legacyContentRedirects.map((redirect) => ({
        ...redirect,
        permanent: true,
      })),
      // Japanese URLs omit the locale while the app keeps its /ja routes.
      ...["querypie.ai", "www.querypie.ai"].map((host) => ({
        source: "/:locale(en|ko|ja)/:path*",
        has: [{ type: "host" as const, value: host.replaceAll(".", "\\.") }],
        destination: "/:path*",
        permanent: true,
      })),
      {
        // Redirect bare public routes to the explicit default locale.
        source: "/:path((?!$|admin(?:/|$)|api(?:/|$)|mockups(?:/|$)|_next(?:/|$)|en(?:/|$)|ko(?:/|$)|ja(?:/|$)|.*\\..*).*)",
        missing: [{ type: "host", value: "(?:www\\.)?querypie\\.ai" }],
        destination: "/en/:path",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: ["querypie.ai", "www.querypie.ai"].flatMap((host) => [
        {
          source: "/",
          has: [{ type: "host" as const, value: host.replaceAll(".", "\\.") }],
          destination: "/ja",
        },
        {
          source: "/:path((?!$|admin(?:/|$)|api(?:/|$)|mockups(?:/|$)|_next(?:/|$)|en(?:/|$)|ko(?:/|$)|ja(?:/|$)|.*\\..*).*)",
          has: [{ type: "host" as const, value: host.replaceAll(".", "\\.") }],
          destination: "/ja/:path",
        },
      ]),
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
