import { notFound } from "next/navigation";
import DemoListPage from "../../../components/pages/demo/DemoListPage";
import { isLocale } from "../../../constants/i18n";

type DemoPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DemoPage({ params }: DemoPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const copy = {
    en: {
      items: [
        {
          category: "Use Cases",
          href: `/${locale}/demo/seo-analysis`,
          imageSrc: "/images/content/article-01.png",
          title: "SEO analysis, once considered the domain of specialists, can now be handled by an AIP agent.",
        },
        {
          category: "AIP Features",
          href: `/${locale}/demo/guardrail-design`,
          imageSrc: "/images/content/article-02.png",
          title: "Guardrail Design in the AI Agent Era (2026 Edition) — Part 1: Philosophy & Design",
        },
        {
          category: "ACP Features",
          href: `/${locale}/demo/ai-security-map`,
          imageSrc: "/images/content/article-03.png",
          title: "AI Security Threat Map 2026 | 7 Attack Vectors and Practical Defense Framework for CxOs",
        },
        {
          category: "Use Cases",
          href: `/${locale}/demo/seo-analysis`,
          imageSrc: "/images/content/article-01.png",
          title: "SEO analysis, once considered the domain of specialists, can now be handled by an AIP agent.",
        },
        {
          category: "AIP Features",
          href: `/${locale}/demo/guardrail-design`,
          imageSrc: "/images/content/article-02.png",
          title: "Guardrail Design in the AI Agent Era (2026 Edition) — Part 1: Philosophy & Design",
        },
        {
          category: "ACP Features",
          href: `/${locale}/demo/ai-security-map`,
          imageSrc: "/images/content/article-03.png",
          title: "AI Security Threat Map 2026 | 7 Attack Vectors and Practical Defense Framework for CxOs",
        },
      ],
      menu: ["All", "Use Cases", "AIP Features", "ACP Features", "Webinars"],
      title: "Demo",
    },
    ko: {
      items: [
        {
          category: "활용 사례",
          href: `/${locale}/demo/seo-analysis`,
          imageSrc: "/images/content/article-01.png",
          title: "전문가의 영역으로 여겨지던 SEO 분석도 이제는 AIP 에이전트가 처리할 수 있습니다.",
        },
        {
          category: "AIP 기능",
          href: `/${locale}/demo/guardrail-design`,
          imageSrc: "/images/content/article-02.png",
          title: "AI 에이전트 시대의 가드레일 설계 (2026 에디션) — Part 1: 철학과 설계",
        },
        {
          category: "ACP 기능",
          href: `/${locale}/demo/ai-security-map`,
          imageSrc: "/images/content/article-03.png",
          title: "AI 보안 위협 맵 2026 | 7가지 공격 벡터와 CxO를 위한 실전 방어 프레임워크",
        },
        {
          category: "활용 사례",
          href: `/${locale}/demo/seo-analysis`,
          imageSrc: "/images/content/article-01.png",
          title: "전문가의 영역으로 여겨지던 SEO 분석도 이제는 AIP 에이전트가 처리할 수 있습니다.",
        },
        {
          category: "AIP 기능",
          href: `/${locale}/demo/guardrail-design`,
          imageSrc: "/images/content/article-02.png",
          title: "AI 에이전트 시대의 가드레일 설계 (2026 에디션) — Part 1: 철학과 설계",
        },
        {
          category: "ACP 기능",
          href: `/${locale}/demo/ai-security-map`,
          imageSrc: "/images/content/article-03.png",
          title: "AI 보안 위협 맵 2026 | 7가지 공격 벡터와 CxO를 위한 실전 방어 프레임워크",
        },
      ],
      menu: ["All", "Use Cases", "AIP Features", "ACP Features", "Webinars"],
      title: "데모",
    },
    ja: {
      items: [
        {
          category: "Use Cases",
          href: `/${locale}/demo/seo-analysis`,
          imageSrc: "/images/content/article-01.png",
          title: "専門家の領域だった SEO 分析も、いまでは AIP エージェントで実行できます。",
        },
        {
          category: "AIP Features",
          href: `/${locale}/demo/guardrail-design`,
          imageSrc: "/images/content/article-02.png",
          title: "AI エージェント時代のガードレール設計 (2026 Edition) — Part 1: Philosophy & Design",
        },
        {
          category: "ACP Features",
          href: `/${locale}/demo/ai-security-map`,
          imageSrc: "/images/content/article-03.png",
          title: "AI Security Threat Map 2026 | 7 Attack Vectors and Practical Defense Framework for CxOs",
        },
        {
          category: "Use Cases",
          href: `/${locale}/demo/seo-analysis`,
          imageSrc: "/images/content/article-01.png",
          title: "専門家の領域だった SEO 分析も、いまでは AIP エージェントで実行できます。",
        },
        {
          category: "AIP Features",
          href: `/${locale}/demo/guardrail-design`,
          imageSrc: "/images/content/article-02.png",
          title: "AI エージェント時代のガードレール設計 (2026 Edition) — Part 1: Philosophy & Design",
        },
        {
          category: "ACP Features",
          href: `/${locale}/demo/ai-security-map`,
          imageSrc: "/images/content/article-03.png",
          title: "AI Security Threat Map 2026 | 7 Attack Vectors and Practical Defense Framework for CxOs",
        },
      ],
      menu: ["All", "Use Cases", "AIP Features", "ACP Features", "Webinars"],
      title: "Demo",
    },
  }[locale];

  return <DemoListPage {...copy} />;
}
