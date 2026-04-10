import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/docs",
        destination: "/features/documentation",
        permanent: true,
      },
      {
        source: "/docs/:slug",
        destination: "/features/documentation/:slug",
        permanent: true,
      },
      {
        source: "/ko/docs",
        destination: "/ko/features/documentation",
        permanent: true,
      },
      {
        source: "/ko/docs/:slug",
        destination: "/ko/features/documentation/:slug",
        permanent: true,
      },
      {
        source: "/ja/docs",
        destination: "/ja/features/documentation",
        permanent: true,
      },
      {
        source: "/ja/docs/:slug",
        destination: "/ja/features/documentation/:slug",
        permanent: true,
      },
      {
        source: "/documentation",
        destination: "/features/documentation",
        permanent: true,
      },
      {
        source: "/documentation/:slug",
        destination: "/features/documentation/:slug",
        permanent: true,
      },
      {
        source: "/ko/documentation",
        destination: "/ko/features/documentation",
        permanent: true,
      },
      {
        source: "/ko/documentation/:slug",
        destination: "/ko/features/documentation/:slug",
        permanent: true,
      },
      {
        source: "/ja/documentation",
        destination: "/ja/features/documentation",
        permanent: true,
      },
      {
        source: "/ja/documentation/:slug",
        destination: "/ja/features/documentation/:slug",
        permanent: true,
      },
      {
        source: "/demo",
        destination: "/features/demo",
        permanent: true,
      },
      {
        source: "/demo/:slug",
        destination: "/features/demo/:slug",
        permanent: true,
      },
      {
        source: "/ko/demo",
        destination: "/ko/features/demo",
        permanent: true,
      },
      {
        source: "/ko/demo/:slug",
        destination: "/ko/features/demo/:slug",
        permanent: true,
      },
      {
        source: "/ja/demo",
        destination: "/ja/features/demo",
        permanent: true,
      },
      {
        source: "/ja/demo/:slug",
        destination: "/ja/features/demo/:slug",
        permanent: true,
      },
      {
        source: "/news",
        destination: "/company/news",
        permanent: true,
      },
      {
        source: "/news/:slug",
        destination: "/company/news/:slug",
        permanent: true,
      },
      {
        source: "/ko/news",
        destination: "/ko/company/news",
        permanent: true,
      },
      {
        source: "/ko/news/:slug",
        destination: "/ko/company/news/:slug",
        permanent: true,
      },
      {
        source: "/ja/news",
        destination: "/ja/company/news",
        permanent: true,
      },
      {
        source: "/ja/news/:slug",
        destination: "/ja/company/news/:slug",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/company/about-us",
        permanent: true,
      },
      {
        source: "/ko/about-us",
        destination: "/ko/company/about-us",
        permanent: true,
      },
      {
        source: "/ja/about-us",
        destination: "/ja/company/about-us",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/company/contact-us",
        permanent: true,
      },
      {
        source: "/ko/contact-us",
        destination: "/ko/company/contact-us",
        permanent: true,
      },
      {
        source: "/ja/contact-us",
        destination: "/ja/company/contact-us",
        permanent: true,
      },
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
