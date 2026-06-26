import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/Cta";
import YoutubePreviewPlayer from "@/components/content/YoutubePreviewPlayer";
import ThreeCard from "@/components/pages/solutions/aip/ThreeCard";
import FeatureMediaList from "@/components/sections/FeatureMediaList";
import { getLocalePath, type Locale } from "@/constants/i18n";

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

function getFeatureItems(locale: Locale) {
  return [
    {
      body: [
        "Start with a simple prompt in your Preset Instructions and let our auto-generation create comprehensive, optimized prompts that maximize your AI agent effectiveness.",
      ],
      imageAlt: "Prompt Auto-Generation",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/solutions/aip/aip_function_prompt.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      title: ["Prompt Auto-Generation"],
    },
    {
      action: {
        href: getLocalePath(locale, "/solutions/aip/integrations"),
        label: "See All Available AIP Integrations",
      },
      body: [
        "Easily connect your working tools through OAuth authorization.",
        "Beyond our provided integrations, add your custom and internal tools to create business workflow automation tailored to your needs.",
      ],
      imageAlt: "Simple Integrations",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/solutions/aip/aip_function_integration.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      reverse: true,
      title: ["Simple Integrations"],
    },
    {
      body: [
        "Turn your documents into knowledge bundles for smarter AI responses.",
        "RAG-powered agents pull from your organization's information instantly, delivering accurate answers based on your business context.",
      ],
      imageAlt: "Contextual Knowledge Bundles",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/solutions/aip/aip_function_knowledge.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      title: ["Contextual Knowledge Bundles"],
    },
    {
      body: [
        "Install pre-built agents from our comprehensive library or create custom solutions tailoring each agent's capabilities to your specific operational requirements.",
      ],
      imageAlt: "Custom Agent Creation",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/solutions/aip/aip_function_createagent.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      reverse: true,
      title: ["Custom Agent Creation"],
    },
    {
      body: [
        "Enhance AI responses with charts, graphs, and interactive elements.",
        "Make complex insights easier to understand through visual aids, then export polished reports for stakeholders and decision-makers.",
      ],
      imageAlt: "Artifact Visualization",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/solutions/aip/aip_function_visualization.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      title: ["Artifact Visualization"],
    },
    {
      body: [
        "Automate routine tasks by scheduling AI agents at specified intervals.",
        "Configure recurring operations through simple agent conversations, reducing manual effort while ensuring consistent execution.",
      ],
      imageAlt: "Schedule Agents",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/solutions/aip/aip_function_schedule.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      reverse: true,
      title: ["Schedule Agents"],
    },
  ];
}

export default function AipENSolutionContent({ locale }: Props) {
  const featureItems = getFeatureItems(locale);

  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
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
              thumbnailAlt="QueryPie AI Platform video thumbnail"
              thumbnailSrc="/solutions/aip/aip-cover.jpg"
              title="QueryPie AI Platform video"
              videoSrc="/solutions/aip/QueryPie%20AIP%20-%20Secure%20Enterprise%20Agentic%20AI%20Platform.mp4"
            />
          </section>
        </div>
      </div>

      <div className="-mx-5 md:-mx-10">
        <ThreeCard locale={locale} />
      </div>

      <div id="features">
        <FeatureMediaList items={featureItems} />
      </div>

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
