import ClientSection from "./ClientSection";
import ContentListSection from "./ContentListSection";
import Cta from "./Cta";
import FeatureSection from "./FeatureSection";
import McpSection from "./McpSection";
import NewsListSection from "./NewsListSection";
import ReviewSection from "./ReviewSection";

export default function SectionComponentsGuide() {
  return (
    // 섹션 레벨 컴포넌트 샘플 프리뷰 가이드
    <section className="space-y-6">
      <h2>Section Components</h2>
      <p>
        Place page-level sections here, such as hero banners, feature grids, and CTA blocks.
      </p>
      <div className="overflow-hidden rounded-box border border-border bg-bg">
        <ClientSection />
      </div>
      <div className="overflow-hidden rounded-box border border-border bg-bg">
        <FeatureSection />
      </div>
      <div className="overflow-hidden rounded-box border border-border bg-bg">
        <McpSection
          description={[
            "Turn conversations and customer feedback into",
            "actionable issues that are routed, labeled, and",
            "prioritized for the right team.",
          ]}
          items={Array.from({ length: 16 }, (_, index) => ({
            icon: (
              <img
                alt=""
                aria-hidden="true"
                className="h-12 w-12 object-contain"
                src="/icons/ChatGPT.svg"
              />
            ),
            label: `MCP ${index + 1}`,
          }))}
          title="Supports almost all MCPs"
        />
      </div>
      <div className="overflow-hidden rounded-box border border-border bg-bg">
        <ReviewSection
          items={[
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
          ]}
          title="Trusted by the world's best developers"
        />
      </div>
      <div className="overflow-hidden rounded-box border border-border bg-bg">
        <NewsListSection
          items={[
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
              title: "Security Solution Playing the Role of a “Door Lock” in the Cloud — Expanding to Japan and Europe",
            },
          ]}
          title="Lastest News"
        />
      </div>
      <div className="overflow-hidden rounded-box border border-border bg-bg">
        <ContentListSection
          description="Explore real-world guidance, strategies, and insights from a community of experts shaping the future of data access."
          items={[
            {
              category: "DEMO",
              href: "/features/documentation/seo-analysis-aip-agent",
              imageSrc: "/images/common/fallback-contents.jpg",
              title:
                "SEO analysis, once considered the domain of specialists, can now be handled by an AIP agent.",
            },
            {
              category: "White Papers",
              href: "/features/documentation/guardrail-design-2026",
              imageSrc: "/images/common/fallback-contents.jpg",
              title:
                "Guardrail Design in the AI Agent Era (2026 Edition) — Part 1: Philosophy & Design",
            },
            {
              category: "Blogs",
              href: "/features/documentation/ai-security-threat-map-2026",
              imageSrc: "/images/common/fallback-contents.jpg",
              title:
                "AI Security Threat Map 2026 | 7 Attack Vectors and Practical Defense Framework for CxOs",
            },
          ]}
          links={[
            { href: "/features/demo?category=use-cases", label: "Use Cases" },
            { href: "/features/documentation?category=white-papers", label: "White Papers" },
            { href: "/features/documentation?category=blogs", label: "Blogs" },
          ]}
          title="Guides and Best Practices"
        />
      </div>
      <div className="overflow-hidden rounded-box border border-border bg-bg">
        <Cta />
      </div>
    </section>
  );
}
