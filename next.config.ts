import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/en",
        destination: "/",
        permanent: true,
      },
      {
        source: "/en/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/en",
        },
        {
          // Rewrite only bare public routes; keep admin/api/static and explicit locales untouched.
          source: "/:path((?!admin(?:/|$)|api(?:/|$)|_next(?:/|$)|en(?:/|$)|ko(?:/|$)|ja(?:/|$)|.*\\..*).*)",
          destination: "/en/:path",
        },
      ],
    };
  },
};

export default nextConfig;
