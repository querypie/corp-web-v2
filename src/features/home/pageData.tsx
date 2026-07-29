import type { ComponentProps } from "react";
import HomePage from "@/components/pages/home/HomePage";
import { getLocalePath, type Locale } from "@/constants/i18n";
import {
  compareDateIsoDesc,
  getContentThumbnailSrc,
  getManagedCategoryLabel,
  getLocalizedContent,
  getPublicDetailHref,
  getPublicListHref,
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
      className={["h-8 w-8 object-contain md:h-12 md:w-12", className].filter(Boolean).join(" ")}
      src={src}
    />
  ),
  label,
}));

const resourceListCandidateCount = 10;

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
          href: isExternal ? item.externalUrl : getPublicDetailHref(item.section, locale, item.id, item.categorySlug),
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
    const contentListItems: Array<{
      category: string;
      href: string;
      imageSrc: string;
      isExternal?: boolean;
      title: string;
    }> = visiblePublishedItems
      .filter((item) => item.section === "demo" || item.section === "documentation")
      .map((item) => {
        const title = getLocalizedContent(item.title, locale);
        const isExternal = item.contentType === "outlink" && Boolean(item.externalUrl.trim());

        if (!title) {
          return null;
        }

        return {
          category: getManagedCategoryLabel(item.section, item.categorySlug, locale),
          href: isExternal ? item.externalUrl : getPublicDetailHref(item.section, locale, item.id, item.categorySlug),
          imageSrc: getContentThumbnailSrc(item.imageSrc),
          isExternal,
          title,
          dateIso: item.dateIso,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((left, right) => compareDateIsoDesc(left.dateIso, right.dateIso))
      .slice(0, resourceListCandidateCount)
      .map(({ dateIso: _dateIso, ...item }) => item);

    const contentListLinks = [
      {
        href: getPublicListHref("demo", locale),
        label: locale === "ko" ? "데모" : locale === "ja" ? "デモ" : "Demo",
      },
      {
        href: getPublicListHref("documentation", locale),
        label: locale === "ko" ? "다큐멘테이션" : locale === "ja" ? "ドキュメンテーション" : "Documentation",
      },
    ];

    // 홈 화면에서 사용하는 locale별 카피/데이터
    const copy = {
      en: {
        nav: ["Solutions", "Features", "Company", "Plans"],
        heroHeading: "Agentic AI Platform for Enterprises",
        heroDescription:
          "Securely connect all your data and systems.\nOperate trusted AI with built-in security and governance.",
        heroPrimaryCtaLabel: "Free start!",
        heroImageAlt: "QueryPie AI workspace preview",
        clientCaption: "Trusted every day by teams that build world-class software",
        contentListDescription:
          "Explore the latest demos and documentation for building governed AI workflows and secure enterprise access.",
        contentListItems,
        contentListLinks,
        contentListTitle: "QueryPie Resources",
        featureItems: [
          {
            action: {
              href: getLocalePath(locale, "/solutions/aip"),
              label: "Learn more",
            },
            body: [
              "It is an economical AI innovation platform optimized for enterprise environments. It supports usage-based LLM deployment and MCP gateways, and Forward Deployed Engineers (FDEs) provide customized AI agents to facilitate complete innovation.",
            ],
            iconSrc: "/assets/pages/home/features/icon-aip.png",
            imageAlt: "AIP workspace preview",
            videoSrc: "/assets/pages/home/features/Home-AIP.mp4",
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
            desktopTitle: ["ACP -", "Access Control Platform"],
            iconSrc: "/assets/pages/home/features/icon-acp.png",
            imageAlt: "Model selector preview",
            reverse: true,
            title: ["ACP - Access Control Platform"],
            videoSrc: "/assets/pages/home/features/Home-ACP.mp4",
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
            excludeFromSearchSnippet: true,
            iconSrc: "/assets/pages/home/features/icon-lingo.png",
            imageAlt: "AIP workspace preview",
            videoSrc: "/assets/pages/home/features/Home-Lingo.mp4",
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
            reverse: true,
            title: ["NotePie"],
            videoSrc: "/assets/pages/home/features/Home-NotePie.mp4",
          },
        ],
        mcpDescription: [
          "Connect AI agents to enterprise tools and data",
          "through a governed MCP gateway with centralized",
          "management, visibility, policy controls, and audit logs.",
        ],
        mcpAction: {
          href: getLocalePath(locale, "/solutions/aip/integrations"),
          label: "See All Available AIP Integrations",
        },
        mcpItems,
        mcpTitle: "Works with Almost All MCP Servers",
        reviewItems: [
          {
            body: "\"Managing our company's scattered, complex DB access permissions efficiently from a single, secure place really gives us great peace of mind.\nWith real-time auditing and automated data masking handling the rest, it significantly eases our worries regarding security and compliance.\"",
            company: "Mori Takeshi",
            href: getLocalePath(locale, "/voc/air-company-mori-takeshi"),
            imageSrc: "/assets/pages/home/reviews/voc1.png",
            role: "CEO of AIR Company",
          },
          {
            body: "\"Our engineering team can now deploy resources with agility while maintaining ironclad control over our cloud infrastructure access.\nBy unifying multi-cloud environments and Kubernetes access into one platform, it has beautifully streamlined both our security operations and developer productivity.\"",
            company: "Daniel Ku",
            href: getLocalePath(locale, "/voc/lg-uplus-daniel-ku"),
            imageSrc: "/assets/pages/home/reviews/voc2.png",
            role: "LG U+ Engineer",
          },
        ],
        reviewTitle: "Voice of the Customer",
        newsItems: [
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            isExternal: true,
            title: "TerraSky’s MCP-Compatible AI Platform ‘mitoco Buddy’ Officially Launched",
          },
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            isExternal: true,
            title: "Payroll Partners with QueryPie on AI Security Solutions",
          },
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            isExternal: true,
            title:
              "Security Solution Playing the Role of a “Door Lock” in the Cloud — Expanding to Japan and Europe",
          },
        ],
        newsTitle: "Lastest News",
        footerSections: [
          { title: "Solutions", items: ["AI Platform (AIP)", "Access Control Platform (ACP)"] },
          { title: "Features", items: ["Demo", "Documentation"] },
          { title: "Company", items: ["About Us", "Certifications", "News", "Contact Us", "Plans"] },
        ],
        legal: ["Cookie Preference", "Terms of Service", "Privacy Policy", "EULA"],
      },
      ko: {
        nav: ["솔루션", "기능", "회사", "요금제"],
        heroHeading: "엔터프라이즈 기업을 위한 Agentic AI Platform",
        heroDescription:
          "모든 데이터와 시스템을 안전하게 연결하고,\n보안과 거버넌스를 기반으로 신뢰할 수 있는 AI를 운영하세요.",
        heroPrimaryCtaLabel: "무료로 시작하기",
        heroImageAlt: "QueryPie AI 워크스페이스 미리보기",
        clientCaption: "세계적인 소프트웨어 팀이 매일 신뢰하는 플랫폼",
        contentListDescription:
          "거버넌스가 적용된 AI 워크플로와 안전한 엔터프라이즈 접근 관리를 위한 최신 데모와 문서를 확인하세요.",
        contentListItems,
        contentListLinks,
        contentListTitle: "QueryPie 리소스",
        featureItems: [
          {
            action: {
              href: getLocalePath(locale, "/solutions/aip"),
              label: "자세히 보기",
            },
            body: [
              "엔터프라이즈 환경에 최적화된 경제적인 AI 혁신 플랫폼입니다. 사용량 기반 LLM 배포와 MCP 게이트웨이를 지원하며, Forward Deployed Engineer (FDE)가 맞춤형 AI Agent를 제공해 완전한 혁신을 돕습니다.",
            ],
            iconSrc: "/assets/pages/home/features/icon-aip.png",
            imageAlt: "AIP 워크스페이스 미리보기",
            videoSrc: "/assets/pages/home/features/Home-AIP.mp4",
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
            desktopTitle: ["ACP -", "Access Control Platform"],
            iconSrc: "/assets/pages/home/features/icon-acp.png",
            imageAlt: "모델 셀렉터 미리보기",
            reverse: true,
            title: ["ACP - Access Control Platform"],
            videoSrc: "/assets/pages/home/features/Home-ACP.mp4",
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
            excludeFromSearchSnippet: true,
            iconSrc: "/assets/pages/home/features/icon-lingo.png",
            imageAlt: "AIP 워크스페이스 미리보기",
            videoSrc: "/assets/pages/home/features/Home-Lingo.mp4",
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
            reverse: true,
            title: ["NotePie"],
            videoSrc: "/assets/pages/home/features/Home-NotePie.mp4",
          },
        ],
        mcpDescription: [
          "AI 에이전트를 엔터프라이즈 도구와 데이터에 연결하고,",
          "MCP Gateway에서 중앙 관리, 가시성, 정책 제어,",
          "감사 로그까지 함께 제공합니다.",
        ],
        mcpAction: {
          href: getLocalePath(locale, "/solutions/aip/integrations"),
          label: "사용 가능한 AIP 연동 모두 보기",
        },
        mcpItems,
        mcpTitle: "거의 모든 MCP 서버와 연동됩니다",
        reviewItems: [
          {
            body: "\"회사 곳곳에 흩어져 있던 복잡한 DB 접근 권한을 하나의 안전한 환경에서 효율적으로 관리할 수 있어 큰 안심이 됩니다.\n실시간 감사와 자동 데이터 마스킹까지 함께 처리되니, 보안과 컴플라이언스에 대한 부담도 크게 줄었습니다.\"",
            company: "Mori Takeshi",
            href: getLocalePath(locale, "/voc/air-company-mori-takeshi"),
            imageSrc: "/assets/pages/home/reviews/voc1.png",
            role: "AIR Company CEO",
          },
          {
            body: "\"엔지니어링 팀은 이제 클라우드 인프라 접근을 견고하게 통제하면서도 민첩하게 리소스를 배포할 수 있습니다.\n멀티 클라우드 환경과 Kubernetes 접근을 하나의 플랫폼으로 통합해 보안 운영과 개발자 생산성이 모두 훨씬 간결해졌습니다.\"",
            company: "Daniel Ku",
            href: getLocalePath(locale, "/voc/lg-uplus-daniel-ku"),
            imageSrc: "/assets/pages/home/reviews/voc2.png",
            role: "LG U+ 엔지니어",
          },
        ],
        reviewTitle: "고객의 목소리",
        newsItems: [
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            isExternal: true,
            title: "TerraSky의 MCP 호환 AI 플랫폼 ‘mitoco Buddy’ 공식 출시",
          },
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            isExternal: true,
            title: "Payroll, QueryPie와 AI 보안 솔루션 협력",
          },
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            isExternal: true,
            title:
              "클라우드의 ‘도어락’ 역할을 하는 보안 솔루션 — 일본과 유럽으로 확장",
          },
        ],
        newsTitle: "최신 뉴스",
        footerSections: [
          { title: "솔루션", items: ["AI Platform (AIP)", "Access Control Platform (ACP)"] },
          { title: "기능", items: ["데모", "문서"] },
          { title: "회사", items: ["회사 소개", "인증", "뉴스", "문의하기", "요금제"] },
        ],
        legal: ["쿠키 설정", "이용약관", "개인정보처리방침", "EULA"],
      },
      ja: {
        nav: ["ソリューション", "機能", "会社", "プラン"],
        heroHeading: "エンタープライズ向け Agentic AI Platform",
        heroDescription:
          "すべてのデータとシステムを安全に接続し、\nセキュリティとガバナンスを内蔵した信頼できる AI を運用しましょう。",
        heroPrimaryCtaLabel: "無料で始める",
        heroImageAlt: "QueryPie AI ワークスペースプレビュー",
        clientCaption: "世界最高水準のソフトウェアチームが毎日信頼するプラットフォーム",
        contentListDescription:
          "ガバナンスの効いたAIワークフローと安全なエンタープライズアクセス管理に役立つ最新のデモとドキュメントをご覧ください。",
        contentListItems,
        contentListLinks,
        contentListTitle: "QueryPie リソース",
        featureItems: [
          {
            action: {
              href: getLocalePath(locale, "/solutions/aip"),
              label: "詳しく見る",
            },
            body: [
              "エンタープライズ環境に最適化された、経済的なAIイノベーションプラットフォームです。使用量ベースのLLMデプロイとMCP Gatewayをサポートし、Forward Deployed Engineer (FDE)がカスタムAI Agentを提供して包括的な革新を支援します。",
            ],
            iconSrc: "/assets/pages/home/features/icon-aip.png",
            imageAlt: "AIP ワークスペースプレビュー",
            videoSrc: "/assets/pages/home/features/Home-AIP.mp4",
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
            desktopTitle: ["ACP -", "Access Control Platform"],
            iconSrc: "/assets/pages/home/features/icon-acp.png",
            imageAlt: "モデルセレクタープレビュー",
            reverse: true,
            title: ["ACP - Access Control Platform"],
            videoSrc: "/assets/pages/home/features/Home-ACP.mp4",
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
            excludeFromSearchSnippet: true,
            iconSrc: "/assets/pages/home/features/icon-lingo.png",
            imageAlt: "AIP ワークスペースプレビュー",
            videoSrc: "/assets/pages/home/features/Home-Lingo.mp4",
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
            reverse: true,
            title: ["NotePie"],
            videoSrc: "/assets/pages/home/features/Home-NotePie.mp4",
          },
        ],
        mcpDescription: [
          "AIエージェントをエンタープライズツールとデータに接続し、",
          "MCP Gatewayで一元管理、可視化、ポリシー制御、",
          "監査ログまで提供します。",
        ],
        mcpAction: {
          href: getLocalePath(locale, "/solutions/aip/integrations"),
          label: "利用可能なAIP連携をすべて見る",
        },
        mcpItems,
        mcpTitle: "ほぼすべての MCP サーバーと連携",
        reviewItems: [
          {
            body: "\"社内に分散していた複雑なDBアクセス権限を、安全な1つの環境で効率的に管理できるようになり、大きな安心感があります。\nリアルタイム監査と自動データマスキングまで任せられるため、セキュリティとコンプライアンスに関する不安も大きく軽減されました。\"",
            company: "Mori Takeshi",
            href: getLocalePath(locale, "/voc/air-company-mori-takeshi"),
            imageSrc: "/assets/pages/home/reviews/voc1.png",
            role: "AIR Company CEO",
          },
          {
            body: "\"エンジニアリングチームは、クラウドインフラへのアクセスを強固に制御しながら、俊敏にリソースをデプロイできるようになりました。\nマルチクラウド環境とKubernetesアクセスを1つのプラットフォームに統合することで、セキュリティ運用と開発者の生産性がともに大きく効率化されました。\"",
            company: "Daniel Ku",
            href: getLocalePath(locale, "/voc/lg-uplus-daniel-ku"),
            imageSrc: "/assets/pages/home/reviews/voc2.png",
            role: "LG U+ エンジニア",
          },
        ],
        reviewTitle: "お客様の声",
        newsItems: [
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            isExternal: true,
            title: "TerraSky の MCP 対応 AI プラットフォーム『mitoco Buddy』が正式リリース",
          },
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            isExternal: true,
            title: "Payroll が QueryPie と AI セキュリティソリューションで提携",
          },
          {
            href: "https://www.terrasky.co.jp/news/2025/11/mitoco-buddy.php/",
            imageSrc: "/assets/common/fallback-contents.jpg",
            isExternal: true,
            title:
              "クラウドの“ドアロック”として機能するセキュリティソリューション — 日本とヨーロッパへ拡大",
          },
        ],
        newsTitle: "最新ニュース",
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
    contentListItems: contentListItems.length > 0 ? contentListItems : copy.contentListItems,
    contentListLinks: copy.contentListLinks,
    contentListTitle: copy.contentListTitle,
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
