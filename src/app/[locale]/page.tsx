import { notFound } from "next/navigation";
import { isLocale } from "../../constants/i18n";
import HomePage from "../../components/pages/home/HomePage";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

const mcpIconSources = [
  "/icons/ChatGPT.svg",
  "/icons/Gemini.svg",
  "/icons/GoogleCalendar.svg",
  "/icons/Discord.svg",
  "/icons/Claude.svg",
  "/icons/GoogleDrive.svg",
  "/icons/Notion.svg",
  "/icons/Confluence.svg",
  "/icons/Slack.svg",
  "/icons/Upstage.svg",
  "/icons/Jira.svg",
  "/icons/Github.svg",
  "/icons/Atlassian.svg",
  "/icons/Google.svg",
  "/icons/Outlook.svg",
  "/icons/Apple.svg",
  "/icons/Gmail.svg",
  "/icons/Figma.svg",
] as const;

const mcpItems = mcpIconSources.map((src) => ({
  icon: (
    <img
      alt=""
      aria-hidden="true"
      className="h-12 w-12 object-contain"
      src={src}
    />
  ),
  label: src.split("/").pop()?.replace(".svg", "") ?? "MCP",
}));

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  // 홈 화면에서 사용하는 locale별 카피/데이터
  const copy = {
    en: {
      nav: ["Solutions", "Features", "Company", "Plans"],
      hero: ["Experience a new AI business,", "QueryPie AI is the best way."],
      heroPromptRotatingTexts: [
        "Experience a new AI business?",
        "Route the right task to the right agent.",
        "Turn product ops into self-driving systems.",
      ],
      clientCaption: "Trusted every day by teams that build world-class software",
      contentListDescription:
        "Explore real-world guidance, strategies, and insights from a community of experts shaping the future of data access.",
      contentListItems: [
        {
          category: "DEMO",
          href: `/${locale}/docs/seo-analysis-aip-agent`,
          imageSrc: "/images/content/article-01.png",
          title:
            "SEO analysis, once considered the domain of specialists, can now be handled by an AIP agent.",
        },
        {
          category: "White Papers",
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
      ],
      contentListLinks: ["DEMO", "White Papers", "Blogs"],
      contentListTitle: "Guides and Best Practices",
      featureItems: [
        {
          body: [
            "Turn conversations and customer feedback",
            "into actionable issues that are routed,",
            "labeled, and prioritized for the right team.",
          ],
          imageAlt: "AIP workspace preview",
          imageSrc: "/images/home/features/feature-panel-a.png",
          title: ["Make product", "operations self-driving"],
        },
        {
          body: [
            "Turn conversations and customer feedback",
            "into actionable issues that are routed,",
            "labeled, and prioritized for the right team.",
          ],
          imageAlt: "Model selector preview",
          imageSrc: "/images/home/features/feature-panel-b.png",
          reverse: true,
          title: ["Make product", "operations self-driving"],
        },
        {
          body: [
            "Turn conversations and customer feedback",
            "into actionable issues that are routed,",
            "labeled, and prioritized for the right team.",
          ],
          imageAlt: "AIP workspace preview",
          imageSrc: "/images/home/features/feature-panel-a.png",
          title: ["Make product", "operations self-driving"],
        },
        {
          body: [
            "Turn conversations and customer feedback",
            "into actionable issues that are routed,",
            "labeled, and prioritized for the right team.",
          ],
          imageAlt: "Model selector preview",
          imageSrc: "/images/home/features/feature-panel-b.png",
          reverse: true,
          title: ["Make product", "operations self-driving"],
        },
      ],
      mcpDescription: [
        "Turn conversations and customer feedback into",
        "actionable issues that are routed, labeled, and",
        "prioritized for the right team.",
      ],
      mcpItems,
      mcpTitle: "Supports almost all MCPs",
      reviewItems: [
        {
          body: "It was night and day from one batch to another, adoption went from single digits to over 80%. It just spread like wildfire, all the best builders were using AIP.",
          company: "TerraSky",
          imageSrc: "/images/home/reviews/reviewer-01.png",
          role: "General Partner, Y Combinator",
        },
        {
          body: "My favorite enterprise AI service is Cursor. Every one of our engineers, some 40,000, are now assisted by AI and our productivity has gone up incredibly.",
          company: "TerraSky",
          imageSrc: "/images/home/reviews/reviewer-02.png",
          role: "General Partner, Y Combinator",
        },
      ],
      reviewTitle: "Trusted by the world's best developers",
      newsItems: [
        {
          imageSrc: "/images/content/news-01.png",
          title: "TerraSky’s MCP-Compatible AI Platform ‘mitoco Buddy’ Officially Launched",
        },
        {
          imageSrc: "/images/content/news-02.png",
          title: "Payroll Partners with QueryPie on AI Security Solutions",
        },
        {
          imageSrc: "/images/content/news-03.png",
          title:
            "Security Solution Playing the Role of a “Door Lock” in the Cloud — Expanding to Japan and Europe",
        },
      ],
      newsTitle: "Lastest News",
      ctaActionLabel: "Get Start!",
      ctaSection: [
        "Stop Thinking.",
        "Start Transforming.",
        "Sign up in seconds and secure your 14-day free trial now.",
      ],
      footerSections: [
        { title: "Solutions", items: ["AI Platform (AIP)", "Access Control Platform (ACP)"] },
        { title: "Features", items: ["Demo", "Documentation"] },
        { title: "Company", items: ["About Us", "Certifications", "News", "Contact Us"] },
      ],
      legal: ["Cookie Preference", "Terms of Use", "Privacy Policy", "EULA"],
    },
    ko: {
      nav: ["솔루션", "기능", "회사", "요금제"],
      hero: ["새로운 AI 비즈니스를 경험하세요,", "QueryPie AI가 가장 좋은 방법입니다."],
      heroPromptRotatingTexts: [
        "새로운 AI 비즈니스를 경험해볼까요?",
        "적절한 에이전트에 작업을 자동으로 연결하세요.",
        "제품 운영을 스스로 움직이게 만드세요.",
      ],
      clientCaption: "세계적인 소프트웨어 팀이 매일 신뢰하는 플랫폼",
      contentListDescription:
        "데이터 접근의 미래를 만드는 전문가 커뮤니티의 실제 가이드, 전략, 인사이트를 살펴보세요.",
      contentListItems: [
        {
          category: "DEMO",
          href: `/${locale}/docs/seo-analysis-aip-agent`,
          imageSrc: "/images/content/article-01.png",
          title:
            "전문가의 영역으로 여겨지던 SEO 분석도 이제는 AIP 에이전트가 처리할 수 있습니다.",
        },
        {
          category: "White Papers",
          href: `/${locale}/docs/guardrail-design-2026`,
          imageSrc: "/images/content/article-02.png",
          title:
            "AI 에이전트 시대의 가드레일 설계 (2026 에디션) — Part 1: 철학과 설계",
        },
        {
          category: "Blogs",
          href: `/${locale}/docs/ai-security-threat-map-2026`,
          imageSrc: "/images/content/article-03.png",
          title:
            "AI 보안 위협 맵 2026 | 7가지 공격 벡터와 CxO를 위한 실전 방어 프레임워크",
        },
      ],
      contentListLinks: ["DEMO", "White Papers", "Blogs"],
      contentListTitle: "가이드와 베스트 프랙티스",
      featureItems: [
        {
          body: [
            "대화와 고객 피드백을 실행 가능한 이슈로 바꾸고,",
            "적절한 팀에 자동 라우팅하고, 라벨링하고,",
            "우선순위를 정할 수 있습니다.",
          ],
          imageAlt: "AIP 워크스페이스 미리보기",
          imageSrc: "/images/home/features/feature-panel-a.png",
          title: ["제품 운영을", "스스로 움직이게 만드세요"],
        },
        {
          body: [
            "대화와 고객 피드백을 실행 가능한 이슈로 바꾸고,",
            "적절한 팀에 자동 라우팅하고, 라벨링하고,",
            "우선순위를 정할 수 있습니다.",
          ],
          imageAlt: "모델 셀렉터 미리보기",
          imageSrc: "/images/home/features/feature-panel-b.png",
          reverse: true,
          title: ["제품 운영을", "스스로 움직이게 만드세요"],
        },
        {
          body: [
            "대화와 고객 피드백을 실행 가능한 이슈로 바꾸고,",
            "적절한 팀에 자동 라우팅하고, 라벨링하고,",
            "우선순위를 정할 수 있습니다.",
          ],
          imageAlt: "AIP 워크스페이스 미리보기",
          imageSrc: "/images/home/features/feature-panel-a.png",
          title: ["제품 운영을", "스스로 움직이게 만드세요"],
        },
        {
          body: [
            "대화와 고객 피드백을 실행 가능한 이슈로 바꾸고,",
            "적절한 팀에 자동 라우팅하고, 라벨링하고,",
            "우선순위를 정할 수 있습니다.",
          ],
          imageAlt: "모델 셀렉터 미리보기",
          imageSrc: "/images/home/features/feature-panel-b.png",
          reverse: true,
          title: ["제품 운영을", "스스로 움직이게 만드세요"],
        },
      ],
      mcpDescription: [
        "대화와 고객 피드백을 실행 가능한 이슈로 바꾸고,",
        "적절한 팀에 라우팅하고 라벨링하며,",
        "우선순위를 정할 수 있습니다.",
      ],
      mcpItems,
      mcpTitle: "거의 모든 MCP를 지원합니다",
      reviewItems: [
        {
          body: "배치가 한 번 바뀌자 도입률이 한 자릿수에서 80% 이상으로 뛰었습니다. 최고의 빌더들이 AIP를 쓰기 시작하면서 순식간에 퍼졌습니다.",
          company: "TerraSky",
          imageSrc: "/images/home/reviews/reviewer-01.png",
          role: "General Partner, Y Combinator",
        },
        {
          body: "제가 가장 좋아하는 엔터프라이즈 AI 서비스는 Cursor입니다. 수만 명의 엔지니어가 AI의 도움을 받고 있고 생산성이 믿기지 않을 정도로 높아졌습니다.",
          company: "TerraSky",
          imageSrc: "/images/home/reviews/reviewer-02.png",
          role: "General Partner, Y Combinator",
        },
      ],
      reviewTitle: "최고의 개발자들이 신뢰합니다",
      newsItems: [
        {
          imageSrc: "/images/content/news-01.png",
          title: "TerraSky의 MCP 호환 AI 플랫폼 ‘mitoco Buddy’ 공식 출시",
        },
        {
          imageSrc: "/images/content/news-02.png",
          title: "Payroll, QueryPie와 AI 보안 솔루션 협력",
        },
        {
          imageSrc: "/images/content/news-03.png",
          title:
            "클라우드의 ‘도어락’ 역할을 하는 보안 솔루션 — 일본과 유럽으로 확장",
        },
      ],
      newsTitle: "최신 뉴스",
      ctaActionLabel: "시작하기",
      ctaSection: [
        "생각은 멈추고.",
        "이제 전환하세요.",
        "지금 가입하고 14일 무료 체험을 바로 시작하세요.",
      ],
      footerSections: [
        { title: "솔루션", items: ["AI 플랫폼 (AIP)", "접근제어 플랫폼 (ACP)"] },
        { title: "기능", items: ["데모", "문서"] },
        { title: "회사", items: ["회사 소개", "인증", "뉴스", "문의하기"] },
      ],
      legal: ["쿠키 설정", "이용약관", "개인정보처리방침", "EULA"],
    },
    ja: {
      nav: ["ソリューション", "機能", "会社", "プラン"],
      hero: ["新しいAIビジネスを体験しよう。", "QueryPie AIが最適な方法です。"],
      heroPromptRotatingTexts: [
        "新しいAIビジネスを始めませんか？",
        "最適なエージェントへ自動でルーティング。",
        "プロダクト運用をセルフドライブ化する。",
      ],
      clientCaption: "世界最高水準のソフトウェアチームが毎日信頼するプラットフォーム",
      contentListDescription:
        "データアクセスの未来を形づくる専門家コミュニティによる、実践的なガイド、戦略、インサイトをご覧ください。",
      contentListItems: [
        {
          category: "DEMO",
          href: `/${locale}/docs/seo-analysis-aip-agent`,
          imageSrc: "/images/content/article-01.png",
          title:
            "専門家の領域だった SEO 分析も、いまでは AIP エージェントで実行できます。",
        },
        {
          category: "White Papers",
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
      ],
      contentListLinks: ["DEMO", "White Papers", "Blogs"],
      contentListTitle: "ガイドとベストプラクティス",
      featureItems: [
        {
          body: [
            "会話と顧客フィードバックを実行可能な課題に変え、",
            "適切なチームへ自動ルーティングし、",
            "ラベル付けと優先順位付けを行います。",
          ],
          imageAlt: "AIP ワークスペースプレビュー",
          imageSrc: "/images/home/features/feature-panel-a.png",
          title: ["プロダクト運用を", "セルフドライブ化する"],
        },
        {
          body: [
            "会話と顧客フィードバックを実行可能な課題に変え、",
            "適切なチームへ自動ルーティングし、",
            "ラベル付けと優先順位付けを行います。",
          ],
          imageAlt: "モデルセレクタープレビュー",
          imageSrc: "/images/home/features/feature-panel-b.png",
          reverse: true,
          title: ["プロダクト運用を", "セルフドライブ化する"],
        },
        {
          body: [
            "会話と顧客フィードバックを実行可能な課題に変え、",
            "適切なチームへ自動ルーティングし、",
            "ラベル付けと優先順位付けを行います。",
          ],
          imageAlt: "AIP ワークスペースプレビュー",
          imageSrc: "/images/home/features/feature-panel-a.png",
          title: ["プロダクト運用を", "セルフドライブ化する"],
        },
        {
          body: [
            "会話と顧客フィードバックを実行可能な課題に変え、",
            "適切なチームへ自動ルーティングし、",
            "ラベル付けと優先順位付けを行います。",
          ],
          imageAlt: "モデルセレクタープレビュー",
          imageSrc: "/images/home/features/feature-panel-b.png",
          reverse: true,
          title: ["プロダクト運用を", "セルフドライブ化する"],
        },
      ],
      mcpDescription: [
        "会話と顧客フィードバックを実行可能な課題に変え、",
        "適切なチームへルーティングしラベル付けし、",
        "優先順位付けできます。",
      ],
      mcpItems,
      mcpTitle: "ほぼすべての MCP をサポート",
      reviewItems: [
        {
          body: "バッチを切り替えた瞬間、導入率は一桁台から80%以上に跳ね上がりました。AIPは優れたビルダーの間で一気に広がりました。",
          company: "TerraSky",
          imageSrc: "/images/home/reviews/reviewer-01.png",
          role: "General Partner, Y Combinator",
        },
        {
          body: "私のお気に入りのエンタープライズAIサービスはCursorです。何万人ものエンジニアがAIに支援され、生産性が驚くほど向上しました。",
          company: "TerraSky",
          imageSrc: "/images/home/reviews/reviewer-02.png",
          role: "General Partner, Y Combinator",
        },
      ],
      reviewTitle: "世界最高の開発者たちに信頼されています",
      newsItems: [
        {
          imageSrc: "/images/content/news-01.png",
          title: "TerraSky の MCP 対応 AI プラットフォーム『mitoco Buddy』が正式リリース",
        },
        {
          imageSrc: "/images/content/news-02.png",
          title: "Payroll が QueryPie と AI セキュリティソリューションで提携",
        },
        {
          imageSrc: "/images/content/news-03.png",
          title:
            "クラウドの“ドアロック”として機能するセキュリティソリューション — 日本とヨーロッパへ拡大",
        },
      ],
      newsTitle: "最新ニュース",
      ctaActionLabel: "始める",
      ctaSection: [
        "考え続けるのをやめて。",
        "変革を始めよう。",
        "今すぐ登録して、14日間の無料トライアルを始めましょう。",
      ],
      footerSections: [
        { title: "ソリューション", items: ["AI Platform (AIP)", "Access Control Platform (ACP)"] },
        { title: "機能", items: ["デモ", "ドキュメント"] },
        { title: "会社", items: ["会社概要", "認証", "ニュース", "お問い合わせ"] },
      ],
      legal: ["Cookie Preference", "利用規約", "プライバシーポリシー", "EULA"],
    },
  }[locale];

  /* locale별 데이터를 HomePage 조립 컴포넌트에 전달 */
  return (
    <HomePage
      clientCaption={copy.clientCaption}
      contentListDescription={copy.contentListDescription}
      contentListItems={copy.contentListItems}
      contentListLinks={copy.contentListLinks}
      contentListTitle={copy.contentListTitle}
      ctaDescription={copy.ctaSection[2]}
      ctaEyebrow={copy.ctaSection[0]}
      ctaTitle={copy.ctaSection[1]}
      featureItems={copy.featureItems}
      heroHeadingMuted={copy.hero[0]}
      heroHeadingPrimary={copy.hero[1]}
      heroPromptRotatingTexts={copy.heroPromptRotatingTexts}
      mcpDescription={copy.mcpDescription}
      mcpItems={copy.mcpItems}
      mcpTitle={copy.mcpTitle}
      newsItems={copy.newsItems}
      newsTitle={copy.newsTitle}
      reviewItems={copy.reviewItems}
      reviewTitle={copy.reviewTitle}
    />
  );
}
