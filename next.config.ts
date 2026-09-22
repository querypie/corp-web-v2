import type { NextConfig } from "next";
import { legacyContentRedirects } from "./src/features/content/legacyRedirects";
import { publicCategoryPaths } from "./src/features/content/publicPathConfig";
import { koEnLegacyRedirects } from "./src/features/routing/koEnLegacyRedirects";
import { getSiteDomainRedirects, getSiteDomainRewrites } from "./src/features/routing/siteDomainRouting";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/use-cases",
        destination: publicCategoryPaths.demo.all,
        permanent: true,
      },
      {
        source: "/:locale(en|ko|ja)/use-cases",
        destination: `/:locale${publicCategoryPaths.demo.all}`,
        permanent: true,
      },
      {
        source: "/company/:page(certifications|contact-us|about-us)",
        destination: "/:page",
        permanent: true,
      },
      {
        source: "/:locale(en|ko|ja)/company/:page(certifications|contact-us|about-us)",
        destination: "/:locale/:page",
        permanent: true,
      },
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
      ...getSiteDomainRedirects(),
    ];
  },
  async rewrites() {
    return {
      beforeFiles: getSiteDomainRewrites(),
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
