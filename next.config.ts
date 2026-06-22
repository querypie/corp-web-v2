import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: true,
      },
      {
        // Redirect bare public routes to the explicit default locale.
        source: "/:path((?!admin(?:/|$)|api(?:/|$)|_next(?:/|$)|en(?:/|$)|ko(?:/|$)|ja(?:/|$)|.*\\..*).*)",
        destination: "/en/:path",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
