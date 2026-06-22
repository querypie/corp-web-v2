import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/Cta";
import FeatureSection from "@/components/sections/FeatureSection";
import type { Locale } from "@/constants/i18n";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "Usage-Based LLM",
  description:
    "Deploy enterprise LLM access with usage-based controls, cost visibility, and governance for production AI teams.",
  keywords: ["Usage-Based LLM", "Enterprise AI", "LLM governance"],
} as const;

const featureItems = [
  {
    title: ["Pay-Per-Use", "Pricing"],
    body: [
      "Pay only for what you use with no fixed cost.",
      "AI adoption becomes affordable and scalable",
      "for teams of any size.",
    ],
    imageAlt: "Usage-based pricing preview",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
  {
    title: ["Premium LLM", "Models"],
    body: [
      "Access OpenAI, Anthropic, Google, and more",
      "industry-leading models from one place.",
      "Choose the right AI for each workflow.",
    ],
    imageAlt: "LLM model selector preview",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
  },
  {
    title: ["SSO & Central", "Management"],
    body: [
      "Use your existing identity provider through SSO.",
      "Centrally manage accounts, permissions,",
      "and administrative control.",
    ],
    imageAlt: "SSO and central management preview",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
];

export default function UsageBasedLlmENSolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
      <section className="flex w-full justify-center">
        <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
          <div>
            <h1 className="m-0 type-h1 text-fg">
              <span className="block">Usage-Based Enterprise AI</span>
              <span className="block">That Works</span>
            </h1>
          </div>
          <p className="m-0 max-w-[720px] type-body-lg leading-relaxed text-fg">
            Browser-based platform with instant access—no downloads, no setup, no fixed costs. Up to
            90% savings vs. ChatGPT makes enterprise-wide AI adoption finally achievable.
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
