import Cta from "@/components/sections/Cta";
import FeatureSection from "@/components/sections/FeatureSection";
import type { Locale } from "@/constants/i18n";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "FDE Services",
  description:
    "Forward Deployed Engineers help identify business workflows, build tailored AI agents, and move AI from pilot to measurable value.",
  keywords: ["FDE Services", "Forward Deployed Engineers", "AI agents"],
} as const;

const featureItems = [
  {
    title: ["Find", "Problems"],
    body: [
      "AI experts help identify what blocks",
      "your AI transformation before those issues",
      "cost time, budget, and momentum.",
    ],
    imageAlt: "AI transformation problem discovery preview",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
  {
    title: ["Make", "Plans"],
    body: [
      "Work with specialists to define the right",
      "AI approach for your business and turn",
      "challenges into clear action steps.",
    ],
    imageAlt: "AI transformation planning preview",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
  },
  {
    title: ["Build Custom", "AI Agents"],
    body: [
      "Get support from first ideas to finished products.",
      "We help design, build, and refine AI agents",
      "around real business workflows.",
    ],
    imageAlt: "Custom AI agent build preview",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
  {
    title: ["Make AI", "Work"],
    body: [
      "Receive ongoing support to run AI in production.",
      "Expert guidance helps your transformation",
      "move from demo to durable value.",
    ],
    imageAlt: "Production AI operations preview",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
  },
];

export default function FdeServicesENSolutionContent({ locale }: Props) {
  return (
    <div className="flex w-full flex-col gap-14 px-5 pb-10 md:gap-[160px] md:px-10">
      <section className="flex w-full justify-center">
        <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
          <div>
            <h1 className="m-0 type-h1 text-fg">
              <span className="block">AI Transformation Expert</span>
              <span className="block">at Your Service</span>
            </h1>
          </div>
          <p className="m-0 max-w-[720px] type-body-lg leading-relaxed text-fg">
            Forward Deployed Engineers (FDE) embedded in your organization deliver comprehensive AI
            transformation—from strategy and development to production operations, ensuring your AI
            initiatives succeed.
          </p>
        </header>
      </section>

      <FeatureSection items={featureItems} />

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
