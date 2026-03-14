import { notFound } from "next/navigation";
import NewsListPage from "../../../components/pages/news/NewsListPage";
import { isLocale } from "../../../constants/i18n";

type NewsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function NewsPage({ params }: NewsPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const externalNewsHref = "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/";

  const copy = {
    en: {
      items: [
        {
          date: "December 23, 2025",
          href: externalNewsHref,
          imageSrc: "/images/content/news-01.png",
          summary:
            "QueryPie AI G.K. announces that TerraSky Co., Ltd.’s enterprise MCP-compatible AI platform, “mitoco Buddy,” has been officially launched.",
          title: "TerraSky’s MCP-Compatible AI Platform ‘mitoco Buddy’ Officially Launched",
        },
        {
          date: "December 23, 2025",
          href: externalNewsHref,
          imageSrc: "/images/content/news-02.png",
          summary:
            "QueryPie AI G.K. announced a collaboration with TerraSky Co., Ltd. in the field of AI agent services through the launch of “mitoco Buddy” for enterprise work.",
          title: "TerraSky and QueryPie AI Unveil ‘mitoco Buddy’ for Work",
        },
        {
          date: "December 23, 2025",
          href: externalNewsHref,
          imageSrc: "/images/content/news-03.png",
          summary:
            "Payroll Co., Ltd. and QueryPie announced a technology partnership focused on AI and security for enterprise payroll operations.",
          title: "Payroll Partners with QueryPie on AI Security Solutions",
        },
        {
          date: "December 23, 2025",
          href: externalNewsHref,
          imageSrc: "/images/content/news-01.png",
          summary:
            "QueryPie AI G.K. announces that TerraSky Co., Ltd.’s enterprise MCP-compatible AI platform, “mitoco Buddy,” has been officially launched.",
          title: "TerraSky’s MCP-Compatible AI Platform ‘mitoco Buddy’ Officially Launched",
        },
        {
          date: "December 23, 2025",
          href: externalNewsHref,
          imageSrc: "/images/content/news-02.png",
          summary:
            "QueryPie AI G.K. announced a collaboration with TerraSky Co., Ltd. in the field of AI agent services through the launch of “mitoco Buddy” for enterprise work.",
          title: "TerraSky and QueryPie AI Unveil ‘mitoco Buddy’ for Work",
        },
        {
          date: "December 23, 2025",
          href: externalNewsHref,
          imageSrc: "/images/content/news-03.png",
          summary:
            "Payroll Co., Ltd. and QueryPie announced a technology partnership focused on AI and security for enterprise payroll operations.",
          title: "Payroll Partners with QueryPie on AI Security Solutions",
        },
      ],
      title: "News",
    },
    ko: {
      items: [
        {
          date: "2025년 12월 23일",
          href: externalNewsHref,
          imageSrc: "/images/content/news-01.png",
          summary:
            "QueryPie AI G.K.는 TerraSky의 기업용 MCP 호환 AI 플랫폼 ‘mitoco Buddy’가 정식 출시되었다고 발표했습니다.",
          title: "TerraSky의 MCP 호환 AI 플랫폼 ‘mitoco Buddy’ 공식 출시",
        },
        {
          date: "2025년 12월 23일",
          href: externalNewsHref,
          imageSrc: "/images/content/news-02.png",
          summary:
            "QueryPie AI G.K.는 TerraSky와 협력해 기업 업무용 ‘mitoco Buddy’를 통해 AI 에이전트 서비스 협업을 발표했습니다.",
          title: "TerraSky와 QueryPie AI, 업무용 ‘mitoco Buddy’ 공개",
        },
        {
          date: "2025년 12월 23일",
          href: externalNewsHref,
          imageSrc: "/images/content/news-03.png",
          summary:
            "Payroll과 QueryPie는 기업용 급여 운영을 위한 AI 및 보안 기술 파트너십을 발표했습니다.",
          title: "Payroll, QueryPie와 AI 보안 솔루션 협력",
        },
        {
          date: "2025년 12월 23일",
          href: externalNewsHref,
          imageSrc: "/images/content/news-01.png",
          summary:
            "QueryPie AI G.K.는 TerraSky의 기업용 MCP 호환 AI 플랫폼 ‘mitoco Buddy’가 정식 출시되었다고 발표했습니다.",
          title: "TerraSky의 MCP 호환 AI 플랫폼 ‘mitoco Buddy’ 공식 출시",
        },
        {
          date: "2025년 12월 23일",
          href: externalNewsHref,
          imageSrc: "/images/content/news-02.png",
          summary:
            "QueryPie AI G.K.는 TerraSky와 협력해 기업 업무용 ‘mitoco Buddy’를 통해 AI 에이전트 서비스 협업을 발표했습니다.",
          title: "TerraSky와 QueryPie AI, 업무용 ‘mitoco Buddy’ 공개",
        },
        {
          date: "2025년 12월 23일",
          href: externalNewsHref,
          imageSrc: "/images/content/news-03.png",
          summary:
            "Payroll과 QueryPie는 기업용 급여 운영을 위한 AI 및 보안 기술 파트너십을 발표했습니다.",
          title: "Payroll, QueryPie와 AI 보안 솔루션 협력",
        },
      ],
      title: "뉴스",
    },
    ja: {
      items: [
        {
          date: "December 23, 2025",
          href: externalNewsHref,
          imageSrc: "/images/content/news-01.png",
          summary:
            "QueryPie AI G.K. announced that TerraSky’s enterprise MCP-compatible AI platform, “mitoco Buddy,” has officially launched.",
          title: "TerraSky’s MCP-Compatible AI Platform ‘mitoco Buddy’ Officially Launched",
        },
        {
          date: "December 23, 2025",
          href: externalNewsHref,
          imageSrc: "/images/content/news-02.png",
          summary:
            "QueryPie AI G.K. announced a collaboration with TerraSky around AI agent services through the release of “mitoco Buddy” for work.",
          title: "TerraSky and QueryPie AI Unveil ‘mitoco Buddy’ for Work",
        },
        {
          date: "December 23, 2025",
          href: externalNewsHref,
          imageSrc: "/images/content/news-03.png",
          summary:
            "Payroll and QueryPie announced a technology partnership focused on AI and security solutions for enterprise operations.",
          title: "Payroll Partners with QueryPie on AI Security Solutions",
        },
        {
          date: "December 23, 2025",
          href: externalNewsHref,
          imageSrc: "/images/content/news-01.png",
          summary:
            "QueryPie AI G.K. announced that TerraSky’s enterprise MCP-compatible AI platform, “mitoco Buddy,” has officially launched.",
          title: "TerraSky’s MCP-Compatible AI Platform ‘mitoco Buddy’ Officially Launched",
        },
        {
          date: "December 23, 2025",
          href: externalNewsHref,
          imageSrc: "/images/content/news-02.png",
          summary:
            "QueryPie AI G.K. announced a collaboration with TerraSky around AI agent services through the release of “mitoco Buddy” for work.",
          title: "TerraSky and QueryPie AI Unveil ‘mitoco Buddy’ for Work",
        },
        {
          date: "December 23, 2025",
          href: externalNewsHref,
          imageSrc: "/images/content/news-03.png",
          summary:
            "Payroll and QueryPie announced a technology partnership focused on AI and security solutions for enterprise operations.",
          title: "Payroll Partners with QueryPie on AI Security Solutions",
        },
      ],
      title: "News",
    },
  }[locale];

  return <NewsListPage items={copy.items} title={copy.title} />;
}
