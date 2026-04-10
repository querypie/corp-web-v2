import { notFound } from "next/navigation";
import { getLocalePath, isLocale } from "../../constants/i18n";
import HomePage from "../../components/pages/home/HomePage";
import {
  demoCategoryConfigs,
  docsCategoryConfigs,
  getCategoryLabel,
} from "@/features/content/config";
import {
  getContentThumbnailSrc,
  getLocalizedContent,
  getPublicDetailHref,
} from "@/features/content/data";
import { readContentState } from "@/features/content/contentState.server";

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

  const publishedItems = await readContentState();
  const latestByCategory = (
    section: "demo" | "documentation",
    categorySlug: string,
  ) =>
    publishedItems
      .filter(
        (item) =>
          item.section === section &&
          item.categorySlug === categorySlug &&
          item.status === "published",
      )
      .sort((left, right) => (right.dateIso || "").localeCompare(left.dateIso || ""))[0];

  const latestUseCase = latestByCategory("demo", "use-cases");
  const latestWhitePaper = latestByCategory("documentation", "white-papers");
  const latestBlog = latestByCategory("documentation", "blogs");

  const contentListItems: Array<{
    category: string;
    href: string;
    imageSrc: string;
    title: string;
  }> = [
    latestUseCase
      ? {
          category: getCategoryLabel(demoCategoryConfigs, "use-cases", locale),
          href:
            latestUseCase.contentType === "outlink"
              ? latestUseCase.externalUrl
              : getPublicDetailHref("demo", locale, latestUseCase.id),
          imageSrc: getContentThumbnailSrc(latestUseCase.imageSrc),
          title: getLocalizedContent(latestUseCase.title, locale),
        }
      : null,
    latestWhitePaper
      ? {
          category: getCategoryLabel(docsCategoryConfigs, "white-papers", locale),
          href:
            latestWhitePaper.contentType === "outlink"
              ? latestWhitePaper.externalUrl
              : getPublicDetailHref("documentation", locale, latestWhitePaper.id),
          imageSrc: getContentThumbnailSrc(latestWhitePaper.imageSrc),
          title: getLocalizedContent(latestWhitePaper.title, locale),
        }
      : null,
    latestBlog
      ? {
          category: getCategoryLabel(docsCategoryConfigs, "blogs", locale),
          href:
            latestBlog.contentType === "outlink"
              ? latestBlog.externalUrl
              : getPublicDetailHref("documentation", locale, latestBlog.id),
          imageSrc: getContentThumbnailSrc(latestBlog.imageSrc),
          title: getLocalizedContent(latestBlog.title, locale),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => !!item);

  const contentListLinks = [
    {
      href: getLocalePath(locale, "/features/demo?category=use-cases"),
      label: getCategoryLabel(demoCategoryConfigs, "use-cases", locale),
    },
    {
      href: getLocalePath(locale, "/features/documentation?category=white-papers"),
      label: getCategoryLabel(docsCategoryConfigs, "white-papers", locale),
    },
    {
      href: getLocalePath(locale, "/features/documentation?category=blogs"),
      label: getCategoryLabel(docsCategoryConfigs, "blogs", locale),
    },
  ];

  // 홈 화면에서 사용하는 locale별 카피/데이터
  const copy = {
    en: {
      nav: ["Solutions", "Features", "Company", "Plans"],
      heroHeading: "AI That Gets How You Work",
      heroDescription:
        "QueryPie AI is here to help you achieve successful AI transformation in your life and business.",
      heroPrimaryCtaLabel: "Experience it now",
      heroPromptRotatingTexts: [
        "Experience a new AI business?",
        "Route the right task to the right agent.",
        "Turn product ops into self-driving systems.",
      ],
      clientCaption: "Trusted every day by teams that build world-class software",
      contentListDescription:
        "Explore real-world guidance, strategies, and insights from a community of experts shaping the future of data access.",
      contentListItems,
      contentListLinks,
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
          href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
          imageSrc: "/images/common/fallback-contents.jpg",
          title: "TerraSky’s MCP-Compatible AI Platform ‘mitoco Buddy’ Officially Launched",
        },
        {
          href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
          imageSrc: "/images/common/fallback-contents.jpg",
          title: "Payroll Partners with QueryPie on AI Security Solutions",
        },
        {
          href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
          imageSrc: "/images/common/fallback-contents.jpg",
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
        { title: "Solutions", items: ["AI Platform (AIP)", "Access Control Platform (ACP)", "Forward Deployed Engineer Service (FDES)"] },
        { title: "Features", items: ["Demo", "Documentation"] },
        { title: "Company", items: ["About Us", "Certifications", "News", "Contact Us", "Plans"] },
      ],
      legal: ["Cookie Preference", "Terms of Use", "Privacy Policy", "EULA"],
    },
    ko: {
      nav: ["솔루션", "기능", "회사", "요금제"],
      heroHeading: "당신의 일하는 방식을 이해하는 AI",
      heroDescription:
        "QueryPie AI는 당신의 일과 비즈니스 전반에서 성공적인 AI 전환을 이룰 수 있도록 돕습니다.",
      heroPrimaryCtaLabel: "지금 체험하기",
      heroPromptRotatingTexts: [
        "새로운 AI 비즈니스를 경험해볼까요?",
        "적절한 에이전트에 작업을 자동으로 연결하세요.",
        "제품 운영을 스스로 움직이게 만드세요.",
      ],
      clientCaption: "세계적인 소프트웨어 팀이 매일 신뢰하는 플랫폼",
      contentListDescription:
        "데이터 접근의 미래를 만드는 전문가 커뮤니티의 실제 가이드, 전략, 인사이트를 살펴보세요.",
      contentListItems,
      contentListLinks,
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
          href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
          imageSrc: "/images/common/fallback-contents.jpg",
          title: "TerraSky의 MCP 호환 AI 플랫폼 ‘mitoco Buddy’ 공식 출시",
        },
        {
          href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
          imageSrc: "/images/common/fallback-contents.jpg",
          title: "Payroll, QueryPie와 AI 보안 솔루션 협력",
        },
        {
          href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
          imageSrc: "/images/common/fallback-contents.jpg",
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
        { title: "솔루션", items: ["AI Platform (AIP)", "Access Control Platform (ACP)", "Forward Deployed Engineer 서비스 (FDES)"] },
        { title: "기능", items: ["데모", "문서"] },
        { title: "회사", items: ["회사 소개", "인증", "뉴스", "문의하기", "요금제"] },
      ],
      legal: ["쿠키 설정", "이용약관", "개인정보처리방침", "EULA"],
    },
    ja: {
      nav: ["ソリューション", "機能", "会社", "プラン"],
      heroHeading: "働き方を理解する AI",
      heroDescription:
        "QueryPie AI は、あなたの仕事とビジネスにおける AI 変革を成功へ導くお手伝いをします。",
      heroPrimaryCtaLabel: "今すぐ体験する",
      heroPromptRotatingTexts: [
        "Experience a new AI business?",
        "最適なエージェントへ自動でルーティング。",
        "プロダクト運用をセルフドライブ化する。",
      ],
      clientCaption: "世界最高水準のソフトウェアチームが毎日信頼するプラットフォーム",
      contentListDescription:
        "データアクセスの未来を形づくる専門家コミュニティによる、実践的なガイド、戦略、インサイトをご覧ください。",
      contentListItems,
      contentListLinks,
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
          href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
          imageSrc: "/images/common/fallback-contents.jpg",
          title: "TerraSky の MCP 対応 AI プラットフォーム『mitoco Buddy』が正式リリース",
        },
        {
          href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
          imageSrc: "/images/common/fallback-contents.jpg",
          title: "Payroll が QueryPie と AI セキュリティソリューションで提携",
        },
        {
          href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
          imageSrc: "/images/common/fallback-contents.jpg",
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
        { title: "ソリューション", items: ["AI Platform (AIP)", "Access Control Platform (ACP)", "Forward Deployed Engineer サービス (FDES)"] },
        { title: "機能", items: ["デモ", "ドキュメント"] },
        { title: "会社", items: ["会社概要", "認証", "ニュース", "お問い合わせ", "プラン"] },
      ],
      legal: ["クッキー設定", "利用規約", "プライバシーポリシー", "EULA"],
    },
  }[locale];

  const newsItems = (await readContentState("news"))
    .filter((item) => item.status === "published")
    .slice(0, 3)
    .map((item) => ({
      href: item.contentType === "outlink" ? item.externalUrl : getLocalePath(locale, `/news/${item.id}`),
      imageSrc: getContentThumbnailSrc(item.imageSrc),
      isExternal: item.contentType === "outlink",
      title: getLocalizedContent(item.title, locale),
    }));

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
      heroDescription={copy.heroDescription}
      heroHeading={copy.heroHeading}
      heroPrimaryCtaLabel={copy.heroPrimaryCtaLabel}
      locale={locale}
      heroPromptRotatingTexts={copy.heroPromptRotatingTexts}
      mcpDescription={copy.mcpDescription}
      mcpItems={copy.mcpItems}
      mcpTitle={copy.mcpTitle}
      newsItems={newsItems.length > 0 ? newsItems : copy.newsItems}
      newsTitle={copy.newsTitle}
      reviewItems={copy.reviewItems}
      reviewTitle={copy.reviewTitle}
    />
  );
}
