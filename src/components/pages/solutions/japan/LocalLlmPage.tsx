import Image from "next/image";
import Cta from "@/components/sections/Cta";
import { getLocalePath } from "@/constants/i18n";
import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import { localLlmCopy as copy } from "@/copy/localLlm";
import LocalLlmAgentFlow from "./LocalLlmAgentFlow";
import LocalLlmComparison from "./LocalLlmComparison";
import LocalLlmDevelopmentCards from "./LocalLlmDevelopmentCards";
import LocalLlmPlatformDiagram from "./LocalLlmPlatformDiagram";
import SolutionActionLink from "./SolutionActionLink";
import SolutionSectionHeading from "./SolutionSectionHeading";

export default function LocalLlmPage() {
  const contactHref = getLocalePath("ja", "/contact-us");

  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
      <section className="mx-auto grid w-full max-w-[1200px] items-start gap-10 md:grid-cols-2 md:items-center md:gap-[30px]">
        <div className="flex min-w-0 flex-col items-start gap-6">
          <h1 className="m-0 text-pretty type-h1 text-fg">
            {copy.hero.title}
            <br />
            <span className="text-brand">{copy.hero.accent}</span>{copy.hero.accentAfter}
          </h1>
          <div className="max-w-[560px] space-y-3 type-body-lg text-mute">
            {copy.hero.descriptions.map((text) => <p className="m-0" key={text}>{text}</p>)}
          </div>
          <SolutionActionLink href={contactHref}>{copy.action}</SolutionActionLink>
        </div>
        <div className="relative aspect-[16/9] overflow-hidden rounded-box bg-bg-content">
          <Image alt={copy.hero.imageAlt} className="object-cover" fill priority sizes="(min-width: 1280px) 585px, (min-width: 768px) 50vw, 100vw" src="/assets/pages/solutions/local-llm/hero-visual.webp" />
        </div>
      </section>

      <section className="-mx-5 bg-bg-deep px-5 py-[70px] md:-mx-10 md:px-10 md:py-[100px]">
        <div className="mx-auto w-full max-w-[1200px] space-y-10">
          <SolutionSectionHeading {...copy.environment} />
          <LocalLlmComparison />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] space-y-10">
        <SolutionSectionHeading title={copy.development.title} description={copy.development.description} />
        <LocalLlmDevelopmentCards />
      </section>

      <section className="-mx-5 bg-bg-deep px-5 py-[70px] md:-mx-10 md:px-10 md:py-[100px]">
        <div className="mx-auto w-full max-w-[1200px] space-y-10">
          <SolutionSectionHeading title={copy.agents.title} description={copy.agents.description} />
          <LocalLlmAgentFlow />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] space-y-10 [&_h2]:text-balance">
        <SolutionSectionHeading title={copy.platform.title} description={copy.platform.description} />
        <LocalLlmPlatformDiagram />
      </section>

      <Cta actionHref={contactHref} actionLabel={copy.action} compactHeading description={copy.cta.description} hideEyebrow locale="ja" secondaryActionLabel="" title={copy.cta.title} />
    </div>
  );
}
