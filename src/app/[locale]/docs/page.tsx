import { notFound } from "next/navigation";
import { isLocale } from "../../../constants/i18n";
import DocsListPage from "../../../components/pages/docs/DocsListPage";

type DocsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DocsPage({ params }: DocsPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  // docs 리스트 화면의 locale별 제목/메뉴/카드 데이터
  const copy = {
    en: {
      items: [
        {
          category: "Introduction Decks",
          href: `/${locale}/docs/seo-analysis-aip-agent`,
          imageSrc: "/images/content/article-01.png",
          title:
            "SEO analysis, once considered the domain of specialists, can now be handled by an AIP agent.",
        },
        {
          category: "Manuals",
          href: `/${locale}/docs/guardrail-design-2026`,
          imageSrc: "/images/content/article-02.png",
          title:
            "Guardrail Design in the AI Agent Era (2026 Edition) — Part 1: Philosophy & Design",
        },
        {
          category: "Blogs",
          href: `/${locale}/docs/ai-security-threat-map-2026`,
          imageSrc: "/images/content/article-03.png",
          title:
            "AI Security Threat Map 2026 | 7 Attack Vectors and Practical Defense Framework for CxOs",
        },
        {
          category: "Introduction Decks",
          href: `/${locale}/docs/seo-analysis-aip-agent`,
          imageSrc: "/images/content/article-01.png",
          title:
            "SEO analysis, once considered the domain of specialists, can now be handled by an AIP agent.",
        },
        {
          category: "Manuals",
          href: `/${locale}/docs/guardrail-design-2026`,
          imageSrc: "/images/content/article-02.png",
          title:
            "Guardrail Design in the AI Agent Era (2026 Edition) — Part 1: Philosophy & Design",
        },
        {
          category: "Blogs",
          href: `/${locale}/docs/ai-security-threat-map-2026`,
          imageSrc: "/images/content/article-03.png",
          title:
            "AI Security Threat Map 2026 | 7 Attack Vectors and Practical Defense Framework for CxOs",
        },
        {
          category: "Introduction Decks",
          href: `/${locale}/docs/seo-analysis-aip-agent`,
          imageSrc: "/images/content/article-01.png",
          title:
            "Operational AI readiness checklist for teams moving from prototype to production.",
        },
        {
          category: "Manuals",
          href: `/${locale}/docs/guardrail-design-2026`,
          imageSrc: "/images/content/article-02.png",
          title:
            "How to design safe approval workflows for high-risk AI actions and MCP automations.",
        },
        {
          category: "Blogs",
          href: `/${locale}/docs/ai-security-threat-map-2026`,
          imageSrc: "/images/content/article-03.png",
          title:
            "What execution-based AI security means for platform, IAM, and infrastructure leaders.",
        },
      ],
      menu: ["All", "Introduction Decks", "Glossary", "Manuals", "Blogs"],
      title: "Documentation",
    },
    ko: {
      items: [
        {
          category: "소개 덱",
          href: `/${locale}/docs/seo-analysis-aip-agent`,
          imageSrc: "/images/content/article-01.png",
          title:
            "전문가의 영역으로 여겨지던 SEO 분석도 이제는 AIP 에이전트가 처리할 수 있습니다.",
        },
        {
          category: "매뉴얼",
          href: `/${locale}/docs/guardrail-design-2026`,
          imageSrc: "/images/content/article-02.png",
          title:
            "AI 에이전트 시대의 가드레일 설계 (2026 에디션) — Part 1: 철학과 설계",
        },
        {
          category: "블로그",
          href: `/${locale}/docs/ai-security-threat-map-2026`,
          imageSrc: "/images/content/article-03.png",
          title:
            "AI 보안 위협 맵 2026 | 7가지 공격 벡터와 CxO를 위한 실전 방어 프레임워크",
        },
        {
          category: "소개 덱",
          href: `/${locale}/docs/seo-analysis-aip-agent`,
          imageSrc: "/images/content/article-01.png",
          title:
            "전문가의 영역으로 여겨지던 SEO 분석도 이제는 AIP 에이전트가 처리할 수 있습니다.",
        },
        {
          category: "매뉴얼",
          href: `/${locale}/docs/guardrail-design-2026`,
          imageSrc: "/images/content/article-02.png",
          title:
            "AI 에이전트 시대의 가드레일 설계 (2026 에디션) — Part 1: 철학과 설계",
        },
        {
          category: "블로그",
          href: `/${locale}/docs/ai-security-threat-map-2026`,
          imageSrc: "/images/content/article-03.png",
          title:
            "AI 보안 위협 맵 2026 | 7가지 공격 벡터와 CxO를 위한 실전 방어 프레임워크",
        },
        {
          category: "소개 덱",
          href: `/${locale}/docs/seo-analysis-aip-agent`,
          imageSrc: "/images/content/article-01.png",
          title:
            "프로토타입에서 운영 단계로 넘어가기 전, AI 조직이 점검해야 할 실무 체크리스트.",
        },
        {
          category: "매뉴얼",
          href: `/${locale}/docs/guardrail-design-2026`,
          imageSrc: "/images/content/article-02.png",
          title:
            "고위험 AI 액션과 MCP 자동화를 위한 승인 워크플로 설계 방법.",
        },
        {
          category: "블로그",
          href: `/${locale}/docs/ai-security-threat-map-2026`,
          imageSrc: "/images/content/article-03.png",
          title:
            "실행 기반 AI 보안이 플랫폼, IAM, 인프라 팀에 중요한 이유.",
        },
      ],
      menu: ["전체", "소개 덱", "용어집", "매뉴얼", "블로그"],
      title: "도큐먼트",
    },
    ja: {
      items: [
        {
          category: "Introduction Decks",
          href: `/${locale}/docs/seo-analysis-aip-agent`,
          imageSrc: "/images/content/article-01.png",
          title:
            "専門家の領域だった SEO 分析も、いまでは AIP エージェントで実行できます。",
        },
        {
          category: "Manuals",
          href: `/${locale}/docs/guardrail-design-2026`,
          imageSrc: "/images/content/article-02.png",
          title:
            "AI エージェント時代のガードレール設計 (2026 Edition) — Part 1: Philosophy & Design",
        },
        {
          category: "Blogs",
          href: `/${locale}/docs/ai-security-threat-map-2026`,
          imageSrc: "/images/content/article-03.png",
          title:
            "AI Security Threat Map 2026 | 7 Attack Vectors and Practical Defense Framework for CxOs",
        },
        {
          category: "Introduction Decks",
          href: `/${locale}/docs/seo-analysis-aip-agent`,
          imageSrc: "/images/content/article-01.png",
          title:
            "専門家の領域だった SEO 分析も、いまでは AIP エージェントで実行できます。",
        },
        {
          category: "Manuals",
          href: `/${locale}/docs/guardrail-design-2026`,
          imageSrc: "/images/content/article-02.png",
          title:
            "AI エージェント時代のガードレール設計 (2026 Edition) — Part 1: Philosophy & Design",
        },
        {
          category: "Blogs",
          href: `/${locale}/docs/ai-security-threat-map-2026`,
          imageSrc: "/images/content/article-03.png",
          title:
            "AI Security Threat Map 2026 | 7 Attack Vectors and Practical Defense Framework for CxOs",
        },
        {
          category: "Introduction Decks",
          href: `/${locale}/docs/seo-analysis-aip-agent`,
          imageSrc: "/images/content/article-01.png",
          title:
            "プロトタイプから本番運用へ移行する前に確認すべき AI 導入チェックリスト。",
        },
        {
          category: "Manuals",
          href: `/${locale}/docs/guardrail-design-2026`,
          imageSrc: "/images/content/article-02.png",
          title:
            "高リスクな AI アクションと MCP 自動化のための承認フロー設計ガイド。",
        },
        {
          category: "Blogs",
          href: `/${locale}/docs/ai-security-threat-map-2026`,
          imageSrc: "/images/content/article-03.png",
          title:
            "実行ベースの AI セキュリティがプラットフォームと IAM チームに重要な理由。",
        },
      ],
      menu: ["All", "Introduction Decks", "Glossary", "Manuals", "Blogs"],
      title: "Documentation",
    },
  }[locale];

  return <DocsListPage items={copy.items} menu={copy.menu} title={copy.title} />;
}
