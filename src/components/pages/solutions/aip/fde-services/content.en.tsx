import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Hero from "@/components/pages/solutions/aip/Hero";
import Cta from "@/components/sections/Cta";
import FeatureMediaList from "@/components/sections/FeatureMediaList";
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
    title: ["Find Problems"],
    body: [
      "AI experts help find what's blocking your AI transformation. Identify problems early before they cost you time and money.",
    ],
    imageAlt: "AI transformation problem discovery preview",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/assets/products/aip/fde-services/find-problems.webp",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
  {
    title: ["Make Plans"],
    body: [
      "Work with specialists to plan the right AI approach for your business. Turn challenges into clear, doable action steps.",
    ],
    imageAlt: "AI transformation planning preview",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/assets/products/aip/fde-services/make-plans.webp",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
    reverse: true,
  },
  {
    title: ["Build Custom AI Agents"],
    body: [
      "Get help building AI agents from first ideas to finished products—we guide you through every step.",
    ],
    imageAlt: "Custom AI agent build preview",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/assets/products/aip/fde-services/build-custom-ai-agents.webp",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
  {
    title: ["Make AI Work"],
    body: [
      "Get ongoing support to make your AI work in the real world. Expert guidance ensures your AI transformation actually succeeds.",
    ],
    imageAlt: "Production AI operations preview",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/assets/products/aip/fde-services/make-ai-work.webp",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
    reverse: true,
  },
];

export default function FdeServicesENSolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
      <div className="flex w-full flex-col gap-10 md:gap-[80px]">
        <section className="flex w-full justify-center">
          <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
            <div>
              <h1 className="m-0 text-pretty type-h1 text-fg">
                AI Transformation Expert
                <br className="hidden md:block" /> at Your Service
              </h1>
            </div>
            <p className="m-0 max-w-[720px] text-pretty type-body-lg leading-relaxed text-fg">
              Forward Deployed Engineers (FDE) embedded in your organization deliver comprehensive AI
              transformation—from strategy and development to production operations, ensuring your AI
              initiatives succeed.
            </p>
          </header>
        </section>
        <Hero
          imageAlt="FDE Services product preview"
          imageSrc="/assets/products/aip/fde-services/fde.svg"
        />
      </div>

      <FeatureMediaList items={featureItems} />

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
