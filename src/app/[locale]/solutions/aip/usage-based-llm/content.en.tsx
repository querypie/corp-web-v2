import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import AipSolutionHeroMedia from "@/components/sections/AipSolutionHeroMedia";
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
    title: ["Pay-Per-Use Pricing"],
    body: [
      "Pay only for what you use—no fixed costs, no waste. AI adoption becomes affordable and scalable for any organization size.",
    ],
    imageAlt: "Usage-based pricing preview",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/usage-based-llm/aip_function_pay.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
  {
    title: ["Premium LLM Models at Your Choice"],
    body: [
      "Access OpenAI, Anthropic, Google, and more industry-leading models. Choose the right AI for your needs and boost team productivity instantly.",
    ],
    imageAlt: "LLM model selector preview",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/usage-based-llm/aip_function_llmmodel.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
    reverse: true,
  },
  {
    title: ["SSO & Central Management"],
    body: [
      "Seamless login with existing identity provider through SSO. Centrally manage all accounts for better security and administrative control.",
    ],
    imageAlt: "SSO and central management preview",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/usage-based-llm/aip_function_sso.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
];

export default function UsageBasedLlmENSolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
      <div className="flex w-full flex-col gap-10 md:gap-[80px]">
        <section className="flex w-full justify-center">
          <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
            <div>
              <h1 className="m-0 text-pretty type-h1 text-fg">
                Usage-Based Enterprise AI
                <br className="hidden md:block" /> That Works
              </h1>
            </div>
            <p className="m-0 max-w-[720px] text-pretty type-body-lg leading-relaxed text-fg">
              Browser-based platform with instant access—no downloads, no setup, no fixed costs. Up to
              90% savings vs. ChatGPT makes enterprise-wide AI adoption finally achievable.
            </p>
          </header>
        </section>
        <AipSolutionHeroMedia
          imageAlt="Usage-Based LLM product preview"
          imageSrc="/solutions/aip/usage-based-llm/usage-based-llm.svg"
        />
      </div>

      <FeatureSection items={featureItems} />

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
