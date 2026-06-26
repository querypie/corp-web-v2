import type { ComponentProps } from "react";
import HomePage from "@/components/pages/home/HomePage";
import { getLocalePath, type Locale } from "@/constants/i18n";
import {
  demoCategoryConfigs,
  docsCategoryConfigs,
  getCategoryLabel,
} from "@/features/content/config";
import {
  compareDateIsoDesc,
  getContentThumbnailSrc,
  getManagedCategoryLabel,
  getLocalizedContent,
  getPublicDetailHref,
  isPublishedContentVisible,
} from "@/features/content/data";
import { readContentState } from "@/features/content/contentState.server";

type HomePageProps = ComponentProps<typeof HomePage>;

type McpIconSource = {
  className?: string;
  label: string;
  src: string;
};

const mcpIconSources: readonly McpIconSource[] = [
  { label: "Slack", src: "/assets/products/aip/integrations/slack.svg" },
  { label: "Discord", src: "/assets/products/aip/integrations/discord.svg" },
  {
    className: "invert grayscale brightness-125",
    label: "GitHub",
    src: "/assets/products/aip/integrations/github.svg",
  },
  { label: "Notion", src: "/assets/products/aip/integrations/notion.svg" },
  { label: "Confluence", src: "/assets/products/aip/integrations/confluence.svg" },
  { label: "Snowflake", src: "/assets/products/aip/integrations/snowflake.svg" },
  { label: "Google Calendar", src: "/assets/products/aip/integrations/google-calendar.svg" },
  { label: "Google Drive", src: "/assets/products/aip/integrations/google-drive.svg" },
  { label: "Gmail", src: "/assets/products/aip/integrations/google-gmail.svg" },
  { label: "Google Sheets", src: "/assets/products/aip/integrations/google-sheets.svg" },
  { label: "Microsoft 365", src: "/assets/products/aip/integrations/microsoft-365.svg" },
  { label: "Salesforce", src: "/assets/products/aip/integrations/salesforce.svg" },
  { label: "AWS", src: "/assets/products/aip/integrations/aws.svg" },
  { label: "Kubernetes", src: "/assets/products/aip/integrations/kubernetes.svg" },
  { label: "Datadog", src: "/assets/products/aip/integrations/datadog.svg" },
  { label: "PostgreSQL", src: "/assets/products/aip/integrations/postgresql.svg" },
  { label: "MySQL", src: "/assets/products/aip/integrations/mysql.svg" },
  { label: "Redis", src: "/assets/products/aip/integrations/redis.svg" },
];

const mcpItems = mcpIconSources.map(({ className, label, src }) => ({
  icon: (
    <img
      alt=""
      aria-hidden="true"
      className={["h-12 w-12 object-contain", className].filter(Boolean).join(" ")}
      src={src}
    />
  ),
  label,
}));

export async function getHomePageProps(locale: Locale): Promise<HomePageProps> {
  const publishedItems = await readContentState(undefined, { includeBodies: false });
    const visiblePublishedItems = publishedItems.filter((item) =>
      isPublishedContentVisible(item, locale),
    );
    const noticeItems = visiblePublishedItems
      .map((item) => {
        const title = getLocalizedContent(item.title, locale);
        const isExternal = item.contentType === "outlink" && Boolean(item.externalUrl.trim());

        if (!title) {
          return null;
        }

        return {
          category: getManagedCategoryLabel(item.section, item.categorySlug, locale),
          href: isExternal ? item.externalUrl : getPublicDetailHref(item.section, locale, item.id),
          imageSrc: getContentThumbnailSrc(item.imageSrc),
          isExternal,
          title,
          dateIso: item.dateIso,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((left, right) => compareDateIsoDesc(left.dateIso, right.dateIso))
      .slice(0, 3)
      .map(({ dateIso: _dateIso, ...item }) => item);
    const latestByCategory = (
      section: "demo" | "documentation",
      categorySlug: string,
    ) =>
      visiblePublishedItems
        .filter(
          (item) =>
            item.section === section &&
            item.categorySlug === categorySlug,
        )
        .sort((left, right) => compareDateIsoDesc(left.dateIso, right.dateIso))[0];

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
        heroHeading: "Experience a new AI business,",
        heroDescription: "QueryPie AI is the best way.",
        heroPrimaryCtaLabel: "Free start!",
        heroImageAlt: "QueryPie AI workspace preview",
        clientCaption: "Trusted every day by teams that build world-class software",
        contentListDescription:
          "Explore real-world guidance, strategies, and insights from a community of experts shaping the future of data access.",
        contentListItems,
        contentListLinks,
        contentListTitle: "Guides and Best Practices",
        featureItems: [
          {
            action: {
              href: getLocalePath(locale, "/solutions/aip"),
              label: "Learn more",
            },
            body: [
              "It is an economical AI innovation platform optimized for enterprise environments. It supports usage-based LLM deployment and MCP gateways, and Field Deployment Engineers (FDEs) provide customized AI agents to facilitate complete innovation.",
            ],
            iconSrc: "/assets/pages/home/features/icon-aip.png",
            imageAlt: "AIP workspace preview",
            imageSrc: "/assets/pages/home/features/feature-panel-a.png",
            title: ["AIP - AI Platform"],
          },
          {
            action: {
              href: getLocalePath(locale, "/solutions/acp"),
              label: "Learn more",
            },
            body: [
              "It supports authorization, monitoring, and audit-ready governance by centralizing access control for databases, systems, Kubernetes, and web applications.",
            ],
            iconSrc: "/assets/pages/home/features/icon-acp.png",
            imageAlt: "Model selector preview",
            imageSrc: "/assets/pages/home/features/feature-panel-b.png",
            reverse: true,
            title: ["ACP - Access Control Platform"],
          },
          {
            action: {
              href: "https://lingo.querypie.com/",
              isExternal: true,
              label: "Learn more",
            },
            body: [
              "As an AI-based real-time interpretation service, it supports real-time subtitling and translation in various environments, including in-person meetings as well as Google Meet, Zoom, Teams, and more.",
            ],
            iconSrc: "/assets/pages/home/features/icon-lingo.png",
            imageAlt: "AIP workspace preview",
            imageSrc: "/assets/pages/home/features/feature-panel-a.png",
            title: ["Lingo"],
          },
          {
            action: {
              href: "https://notepie.app.querypie.com/",
              isExternal: true,
              label: "Learn more",
            },
            body: [
              "Experience an innovative feature where AI directly learns from user-uploaded documents or web links and processes them into various forms of data.",
            ],
            iconSrc: "/assets/pages/home/features/icon-notepie.png",
            imageAlt: "Model selector preview",
            imageSrc: "/assets/pages/home/features/feature-panel-b.png",
            reverse: true,
            title: ["NotePie"],
          },
        ],
        mcpDescription: [
          "Turn conversations and customer feedback into",
          "actionable issues that are routed, labeled, and",
          "prioritized for the right team.",
        ],
        mcpAction: {
          href: getLocalePath(locale, "/solutions/aip/integrations"),
          label: "See All Available AIP Integrations",
        },
        mcpItems,
        mcpTitle: "Works with Almost All MCP Servers",
        reviewItems: [
          {
            body: "It was night and day from one batch to another, adoption went from single digits to over 80%. It just spread like wildfire, all the best builders were using AIP.",
            company: "TerraSky",
            imageSrc: "/assets/pages/home/reviews/reviewer-01.png",
            role: "General Partner, Y Combinator",
          },
          {
            body: "My favorite enterprise AI service is Cursor. Every one of our engineers, some 40,000, are now assisted by AI and our productivity has gone up incredibly.",
            company: "TerraSky",
            imageSrc: "/assets/pages/home/reviews/reviewer-02.png",
            role: "General Partner, Y Combinator",
          },
        ],
        reviewTitle: "Trusted by the world's best developers",
        newsItems: [
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            title: "TerraSky’s MCP-Compatible AI Platform ‘mitoco Buddy’ Officially Launched",
          },
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            title: "Payroll Partners with QueryPie on AI Security Solutions",
          },
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            title:
              "Security Solution Playing the Role of a “Door Lock” in the Cloud — Expanding to Japan and Europe",
          },
        ],
        newsTitle: "Lastest News",
        ctaActionLabel: "Make It Happen",
        ctaSection: [
          "Stop Thinking.",
          "Start Transforming.",
          "Sign up in seconds and secure your 14-day free trial now.",
        ],
        footerSections: [
          { title: "Solutions", items: ["AI Platform (AIP)", "Access Control Platform (ACP)"] },
          { title: "Features", items: ["Demo", "Documentation"] },
          { title: "Company", items: ["About Us", "Certifications", "News", "Contact Us", "Plans"] },
        ],
        legal: ["Cookie Preference", "Terms of Service", "Privacy Policy", "EULA"],
      },
      ko: {
        nav: ["솔루션", "기능", "회사", "요금제"],
        heroHeading: "새로운 AI 비즈니스를 경험하세요,",
        heroDescription: "QueryPie AI가 가장 좋은 방법입니다.",
        heroPrimaryCtaLabel: "무료로 시작하기",
        heroImageAlt: "QueryPie AI 워크스페이스 미리보기",
        clientCaption: "세계적인 소프트웨어 팀이 매일 신뢰하는 플랫폼",
        contentListDescription:
          "데이터 접근의 미래를 만드는 전문가 커뮤니티의 실제 가이드, 전략, 인사이트를 살펴보세요.",
        contentListItems,
        contentListLinks,
        contentListTitle: "가이드와 베스트 프랙티스",
        featureItems: [
          {
            action: {
              href: getLocalePath(locale, "/solutions/aip"),
              label: "자세히 보기",
            },
            body: [
              "엔터프라이즈 환경에 최적화된 경제적인 AI 혁신 플랫폼입니다. 사용량 기반 LLM 배포와 MCP 게이트웨이를 지원하며, Field Deployment Engineer(FDE)가 맞춤형 AI Agent를 제공해 완전한 혁신을 돕습니다.",
            ],
            iconSrc: "/assets/pages/home/features/icon-aip.png",
            imageAlt: "AIP 워크스페이스 미리보기",
            imageSrc: "/assets/pages/home/features/feature-panel-a.png",
            title: ["AIP - AI Platform"],
          },
          {
            action: {
              href: getLocalePath(locale, "/solutions/acp"),
              label: "자세히 보기",
            },
            body: [
              "데이터베이스, 시스템, Kubernetes, 웹 애플리케이션의 접근 제어를 중앙화해 권한 관리, 모니터링, 감사 대응 거버넌스를 지원합니다.",
            ],
            iconSrc: "/assets/pages/home/features/icon-acp.png",
            imageAlt: "모델 셀렉터 미리보기",
            imageSrc: "/assets/pages/home/features/feature-panel-b.png",
            reverse: true,
            title: ["ACP - Access Control Platform"],
          },
          {
            action: {
              href: "https://lingo.querypie.com/",
              isExternal: true,
              label: "자세히 보기",
            },
            body: [
              "AI 기반 실시간 통역 서비스로, 대면 회의는 물론 Google Meet, Zoom, Teams 등 다양한 환경에서 실시간 자막과 번역을 지원합니다.",
            ],
            iconSrc: "/assets/pages/home/features/icon-lingo.png",
            imageAlt: "AIP 워크스페이스 미리보기",
            imageSrc: "/assets/pages/home/features/feature-panel-a.png",
            title: ["Lingo"],
          },
          {
            action: {
              href: "https://notepie.app.querypie.com/",
              isExternal: true,
              label: "자세히 보기",
            },
            body: [
              "사용자가 업로드한 문서나 웹 링크를 AI가 직접 학습하고, 다양한 형태의 데이터로 가공하는 혁신적인 기능을 경험할 수 있습니다.",
            ],
            iconSrc: "/assets/pages/home/features/icon-notepie.png",
            imageAlt: "모델 셀렉터 미리보기",
            imageSrc: "/assets/pages/home/features/feature-panel-b.png",
            reverse: true,
            title: ["NotePie"],
          },
        ],
        mcpDescription: [
          "대화와 고객 피드백을 실행 가능한 이슈로 바꾸고,",
          "적절한 팀에 라우팅하고 라벨링하며,",
          "우선순위를 정할 수 있습니다.",
        ],
        mcpAction: {
          href: getLocalePath(locale, "/solutions/aip/integrations"),
          label: "사용 가능한 AIP 연동 모두 보기",
        },
        mcpItems,
        mcpTitle: "거의 모든 MCP 서버와 연동됩니다",
        reviewItems: [
          {
            body: "배치가 한 번 바뀌자 도입률이 한 자릿수에서 80% 이상으로 뛰었습니다. 최고의 빌더들이 AIP를 쓰기 시작하면서 순식간에 퍼졌습니다.",
            company: "TerraSky",
            imageSrc: "/assets/pages/home/reviews/reviewer-01.png",
            role: "General Partner, Y Combinator",
          },
          {
            body: "제가 가장 좋아하는 엔터프라이즈 AI 서비스는 Cursor입니다. 수만 명의 엔지니어가 AI의 도움을 받고 있고 생산성이 믿기지 않을 정도로 높아졌습니다.",
            company: "TerraSky",
            imageSrc: "/assets/pages/home/reviews/reviewer-02.png",
            role: "General Partner, Y Combinator",
          },
        ],
        reviewTitle: "최고의 개발자들이 신뢰합니다",
        newsItems: [
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            title: "TerraSky의 MCP 호환 AI 플랫폼 ‘mitoco Buddy’ 공식 출시",
          },
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            title: "Payroll, QueryPie와 AI 보안 솔루션 협력",
          },
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            title:
              "클라우드의 ‘도어락’ 역할을 하는 보안 솔루션 — 일본과 유럽으로 확장",
          },
        ],
        newsTitle: "최신 뉴스",
        ctaActionLabel: "지금 실현하기",
        ctaSection: [
          "생각은 멈추고.",
          "이제 전환하세요.",
          "지금 가입하고 14일 무료 체험을 바로 시작하세요.",
        ],
        footerSections: [
          { title: "솔루션", items: ["AI Platform (AIP)", "Access Control Platform (ACP)"] },
          { title: "기능", items: ["데모", "문서"] },
          { title: "회사", items: ["회사 소개", "인증", "뉴스", "문의하기", "요금제"] },
        ],
        legal: ["쿠키 설정", "이용약관", "개인정보처리방침", "EULA"],
      },
      ja: {
        nav: ["ソリューション", "機能", "会社", "プラン"],
        heroHeading: "新しいAIビジネスを体験するなら、",
        heroDescription: "QueryPie AIが最適です。",
        heroPrimaryCtaLabel: "無料で始める",
        heroImageAlt: "QueryPie AI ワークスペースプレビュー",
        clientCaption: "世界最高水準のソフトウェアチームが毎日信頼するプラットフォーム",
        contentListDescription:
          "データアクセスの未来を形づくる専門家コミュニティによる、実践的なガイド、戦略、インサイトをご覧ください。",
        contentListItems,
        contentListLinks,
        contentListTitle: "ガイドとベストプラクティス",
        featureItems: [
          {
            action: {
              href: getLocalePath(locale, "/solutions/aip"),
              label: "詳しく見る",
            },
            body: [
              "エンタープライズ環境に最適化された、経済的なAIイノベーションプラットフォームです。使用量ベースのLLMデプロイとMCP Gatewayをサポートし、Field Deployment Engineer(FDE)がカスタムAI Agentを提供して包括的な革新を支援します。",
            ],
            iconSrc: "/assets/pages/home/features/icon-aip.png",
            imageAlt: "AIP ワークスペースプレビュー",
            imageSrc: "/assets/pages/home/features/feature-panel-a.png",
            title: ["AIP - AI Platform"],
          },
          {
            action: {
              href: getLocalePath(locale, "/solutions/acp"),
              label: "詳しく見る",
            },
            body: [
              "データベース、システム、Kubernetes、Webアプリケーションのアクセス制御を一元化し、認可、モニタリング、監査対応のガバナンスを支援します。",
            ],
            iconSrc: "/assets/pages/home/features/icon-acp.png",
            imageAlt: "モデルセレクタープレビュー",
            imageSrc: "/assets/pages/home/features/feature-panel-b.png",
            reverse: true,
            title: ["ACP - Access Control Platform"],
          },
          {
            action: {
              href: "https://lingo.querypie.com/",
              isExternal: true,
              label: "詳しく見る",
            },
            body: [
              "AIベースのリアルタイム通訳サービスとして、対面会議に加え、Google Meet、Zoom、Teamsなど多様な環境でリアルタイム字幕と翻訳をサポートします。",
            ],
            iconSrc: "/assets/pages/home/features/icon-lingo.png",
            imageAlt: "AIP ワークスペースプレビュー",
            imageSrc: "/assets/pages/home/features/feature-panel-a.png",
            title: ["Lingo"],
          },
          {
            action: {
              href: "https://notepie.app.querypie.com/",
              isExternal: true,
              label: "詳しく見る",
            },
            body: [
              "ユーザーがアップロードしたドキュメントやWebリンクをAIが直接学習し、さまざまな形式のデータへ加工する革新的な機能を体験できます。",
            ],
            iconSrc: "/assets/pages/home/features/icon-notepie.png",
            imageAlt: "モデルセレクタープレビュー",
            imageSrc: "/assets/pages/home/features/feature-panel-b.png",
            reverse: true,
            title: ["NotePie"],
          },
        ],
        mcpDescription: [
          "会話と顧客フィードバックを実行可能な課題に変え、",
          "適切なチームへルーティングしラベル付けし、",
          "優先順位付けできます。",
        ],
        mcpAction: {
          href: getLocalePath(locale, "/solutions/aip/integrations"),
          label: "利用可能なAIP連携をすべて見る",
        },
        mcpItems,
        mcpTitle: "ほぼすべての MCP サーバーと連携",
        reviewItems: [
          {
            body: "バッチを切り替えた瞬間、導入率は一桁台から80%以上に跳ね上がりました。AIPは優れたビルダーの間で一気に広がりました。",
            company: "TerraSky",
            imageSrc: "/assets/pages/home/reviews/reviewer-01.png",
            role: "General Partner, Y Combinator",
          },
          {
            body: "私のお気に入りのエンタープライズAIサービスはCursorです。何万人ものエンジニアがAIに支援され、生産性が驚くほど向上しました。",
            company: "TerraSky",
            imageSrc: "/assets/pages/home/reviews/reviewer-02.png",
            role: "General Partner, Y Combinator",
          },
        ],
        reviewTitle: "世界最高の開発者たちに信頼されています",
        newsItems: [
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            title: "TerraSky の MCP 対応 AI プラットフォーム『mitoco Buddy』が正式リリース",
          },
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            title: "Payroll が QueryPie と AI セキュリティソリューションで提携",
          },
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            title:
              "クラウドの“ドアロック”として機能するセキュリティソリューション — 日本とヨーロッパへ拡大",
          },
        ],
        newsTitle: "最新ニュース",
        ctaActionLabel: "今すぐ実現する",
        ctaSection: [
          "考え続けるのをやめて。",
          "変革を始めよう。",
          "今すぐ登録して、14日間の無料トライアルを始めましょう。",
        ],
        footerSections: [
          { title: "ソリューション", items: ["AI Platform (AIP)", "Access Control Platform (ACP)"] },
          { title: "機能", items: ["デモ", "ドキュメント"] },
          { title: "会社", items: ["会社概要", "認証", "ニュース", "お問い合わせ", "プラン"] },
        ],
        legal: ["クッキー設定", "利用規約", "プライバシーポリシー", "EULA"],
      },
    }[locale];

    const newsItems = visiblePublishedItems
      .filter((item) => item.section === "news")
      .slice(0, 3)
      .map((item) => ({
        href: item.contentType === "outlink" ? item.externalUrl : getPublicDetailHref("news", locale, item.id),
        imageSrc: getContentThumbnailSrc(item.imageSrc),
        isExternal: item.contentType === "outlink",
        title: getLocalizedContent(item.title, locale),
      }));

  return {
    clientCaption: copy.clientCaption,
    contentListDescription: copy.contentListDescription,
    contentListItems: copy.contentListItems,
    contentListLinks: copy.contentListLinks,
    contentListTitle: copy.contentListTitle,
    ctaActionLabel: copy.ctaActionLabel,
    ctaDescription: copy.ctaSection[2],
    ctaEyebrow: copy.ctaSection[0],
    ctaTitle: copy.ctaSection[1],
    featureItems: copy.featureItems,
    heroDescription: copy.heroDescription,
    heroHeading: copy.heroHeading,
    heroImageAlt: copy.heroImageAlt,
    heroPrimaryCtaLabel: copy.heroPrimaryCtaLabel,
    locale,
    mcpAction: copy.mcpAction,
    mcpDescription: copy.mcpDescription,
    mcpItems: copy.mcpItems,
    mcpTitle: copy.mcpTitle,
    newsItems: newsItems.length > 0 ? newsItems : copy.newsItems,
    newsTitle: copy.newsTitle,
    noticeItems,
    reviewItems: copy.reviewItems,
    reviewTitle: copy.reviewTitle,
  };
}
