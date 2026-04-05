import type { Locale } from "@/constants/i18n";

type NewsStaticSource = {
  dateIso: string;
  externalUrl: string;
  imageSrc: string;
  slug: string;
  summary: Record<Locale, string>;
  title: Record<Locale, string>;
};

export type NewsStaticEntry = {
  dateIso: string;
  externalUrl: string;
  href: string;
  imageSrc: string;
  slug: string;
  summary: string;
  title: string;
};

const externalNewsHref = "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/";

const newsStaticSources: NewsStaticSource[] = [
  {
    dateIso: "2025-12-23",
    externalUrl: externalNewsHref,
    imageSrc: "/uploads/news-01.png",
    slug: "mitoco-buddy-launch",
    summary: {
      en: "QueryPie AI G.K. announces that TerraSky Co., Ltd.’s enterprise MCP-compatible AI platform, “mitoco Buddy,” has been officially launched.",
      ko: "QueryPie AI G.K.는 TerraSky의 기업용 MCP 호환 AI 플랫폼 ‘mitoco Buddy’가 정식 출시되었다고 발표했습니다.",
      ja: "QueryPie AI G.K. は、TerraSky のエンタープライズ向け MCP 対応 AI プラットフォーム「mitoco Buddy」が正式リリースされたことを発表しました。",
    },
    title: {
      en: "TerraSky’s MCP-Compatible AI Platform ‘mitoco Buddy’ Officially Launched",
      ko: "TerraSky의 MCP 호환 AI 플랫폼 ‘mitoco Buddy’ 공식 출시",
      ja: "TerraSky の MCP 対応 AI プラットフォーム「mitoco Buddy」が正式リリース",
    },
  },
  {
    dateIso: "2025-12-23",
    externalUrl: externalNewsHref,
    imageSrc: "/uploads/news-02.png",
    slug: "mitoco-buddy-work",
    summary: {
      en: "QueryPie AI G.K. announced a collaboration with TerraSky Co., Ltd. in the field of AI agent services through the launch of “mitoco Buddy” for enterprise work.",
      ko: "QueryPie AI G.K.는 TerraSky와 협력해 기업 업무용 ‘mitoco Buddy’를 통해 AI 에이전트 서비스 협업을 발표했습니다.",
      ja: "QueryPie AI G.K. は、TerraSky と連携し、業務向け「mitoco Buddy」を通じた AI エージェントサービスの協業を発表しました。",
    },
    title: {
      en: "TerraSky and QueryPie AI Unveil ‘mitoco Buddy’ for Work",
      ko: "TerraSky와 QueryPie AI, 업무용 ‘mitoco Buddy’ 공개",
      ja: "TerraSky と QueryPie AI、業務向け「mitoco Buddy」を公開",
    },
  },
  {
    dateIso: "2025-12-23",
    externalUrl: externalNewsHref,
    imageSrc: "/uploads/news-03.png",
    slug: "payroll-querypie-partnership",
    summary: {
      en: "Payroll Co., Ltd. and QueryPie announced a technology partnership focused on AI and security for enterprise payroll operations.",
      ko: "Payroll과 QueryPie는 기업용 급여 운영을 위한 AI 및 보안 기술 파트너십을 발표했습니다.",
      ja: "Payroll と QueryPie は、企業運用向けの AI およびセキュリティソリューションに関する技術提携を発表しました。",
    },
    title: {
      en: "Payroll Partners with QueryPie on AI Security Solutions",
      ko: "Payroll, QueryPie와 AI 보안 솔루션 협력",
      ja: "Payroll、QueryPie と AI セキュリティソリューションで提携",
    },
  },
];

export function getStaticNewsEntries(locale: Locale): NewsStaticEntry[] {
  return newsStaticSources.map((item) => ({
    dateIso: item.dateIso,
    externalUrl: item.externalUrl,
    href: item.externalUrl,
    imageSrc: item.imageSrc,
    slug: item.slug,
    summary: item.summary[locale],
    title: item.title[locale],
  }));
}
