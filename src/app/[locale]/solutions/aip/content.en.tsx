import Cta from "@/components/sections/Cta";
import YoutubePreviewPlayer from "@/components/common/YoutubePreviewPlayer";
import AipThreeCardSection from "@/components/sections/AipThreeCardSection";
import FeatureSection from "@/components/sections/FeatureSection";
import type { Locale } from "@/constants/i18n";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "QueryPie AI Platform (AIP)",
  description:
    "QueryPie AIP is the platform that delivers enterprise AI transformation through economical, enterprise-ready solutions.",
  keywords: ["QueryPie AI", "AI Platform", "AIP", "MCP Gateway"],
} as const;

const featureItems = [
  {
    body: [
      "Deploy enterprise-ready LLM access with",
      "usage-based controls, cost visibility, and",
      "governance designed for production teams.",
    ],
    imageAlt: "Usage-based LLM deployment preview",
    imageSrc: "/images/home/features/feature-panel-a.png",
    title: ["Launch practical", "enterprise AI"],
  },
  {
    body: [
      "Connect AI agents to tools and data through",
      "a governed MCP gateway with visibility,",
      "policy enforcement, and audit-ready logs.",
    ],
    imageAlt: "MCP gateway preview",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
    title: ["Govern every", "MCP connection"],
  },
  {
    body: [
      "Forward Deployed Engineers help identify",
      "business workflows, build tailored agents,",
      "and move AI from pilot to measurable value.",
    ],
    imageAlt: "Forward deployed engineer workflow preview",
    imageSrc: "/images/home/features/feature-panel-a.png",
    title: ["Build agents", "around real work"],
  },
  {
    body: [
      "Bring prompt, model, tool, and usage activity",
      "into one operating layer so security and",
      "business teams can scale AI with confidence.",
    ],
    imageAlt: "AI operations visibility preview",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
    title: ["Scale AI with", "enterprise control"],
  },
];

export default function AipENSolutionContent({ locale }: Props) {
  return (
    <div className="flex w-full flex-col gap-14 px-5 pb-10 md:gap-[160px] md:px-10">
      <div className="flex flex-col gap-14 md:gap-20">
        <div>
          <section className="flex w-full justify-center">
            <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
              <h1 className="m-0 type-h1 text-fg">AI Platform</h1>
              <p className="m-0 max-w-[720px] type-body-lg leading-relaxed text-fg">
                The platform that delivers enterprise AI transformation through economical,
                enterprise-ready solutions—featuring usage-based LLM deployment and comprehensive MCP
                gateway. Complete transformation through Forward Deployed Engineers (FDE) delivering
                tailored AI agents.
              </p>
            </header>
          </section>
        </div>

        <div>
          <section className="flex w-full justify-center">
            <YoutubePreviewPlayer
              embedSrc="https://www.youtube.com/embed/nJGSCd6itUE?si=2wccYas88jLRO7q2"
              thumbnailAlt="QueryPie AI Platform video thumbnail"
              thumbnailSrc="/solutions/aip/aip-cover.jpg"
              title="QueryPie AI Platform video"
            />
          </section>
        </div>
      </div>

      <div className="-mx-5 md:-mx-10">
        <AipThreeCardSection locale={locale} />
      </div>

      <div id="features">
        <FeatureSection items={featureItems} />
      </div>

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
