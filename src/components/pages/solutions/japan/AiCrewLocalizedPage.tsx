import Image from "next/image";
import Cta from "@/components/sections/Cta";
import Badge from "@/components/ui/Badge";
import ButtonGroup from "@/components/ui/ButtonGroup";
import { getLocalePath, type Locale } from "@/constants/i18n";
import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import { getPublicDetailHref } from "@/features/content/data";
import AiCrewBeforeAfter from "./AiCrewBeforeAfter";
import AiCrewPlatformDiagram from "./AiCrewPlatformDiagram";
import AiCrewUseCaseCard from "./AiCrewUseCaseCard";
import AiCrewWhitepaperSection from "./AiCrewWhitepaperSection";
import { getAiCrewCopy } from "./aiCrewCopy";
import SolutionActionLink from "./SolutionActionLink";
import SolutionIcon from "./SolutionIcon";
import SolutionSectionHeading from "./SolutionSectionHeading";

const introductionStepIcons = ["search", "folder", "spark", "check", "connect"] as const;

export default function AiCrewLocalizedPage({ locale }: { locale: Exclude<Locale, "ja"> }) {
  const copy = getAiCrewCopy(locale);
  if (!copy) return null;

  const contactHref = getLocalePath(locale, "/company/contact-us");
  const demoHref = getLocalePath(locale, "/demo/use-cases");
  const whitepaperHref = getPublicDetailHref("documentation", locale, "ai-transformation-japan", "white-papers");
  const [heroTitleBefore, heroTitleAfter] = copy.hero.title[1].split("AI Crew");

  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
      <section className="mx-auto grid w-full max-w-[1200px] items-start gap-10 md:grid-cols-2 md:items-center md:gap-[30px]">
        <div className="flex flex-col items-start gap-6">
          <h1 className="m-0 text-pretty type-h1 text-fg">{copy.hero.title[0]}<br />{heroTitleBefore}<span className="text-brand">AI Crew</span>{heroTitleAfter}</h1>
          <div className="max-w-[560px] space-y-3 type-body-lg text-mute">
            {copy.hero.descriptions.map((description) => <p className="m-0" key={description}>{description}</p>)}
          </div>
          <ButtonGroup className="flex-wrap"><SolutionActionLink href={contactHref}>{copy.hero.primaryAction}</SolutionActionLink><SolutionActionLink href={demoHref} variant="outline">{copy.hero.secondaryAction}</SolutionActionLink></ButtonGroup>
        </div>
        <div className="relative aspect-[16/9] overflow-hidden rounded-box bg-bg-content"><Image alt={copy.hero.imageAlt} className="object-cover" fill priority sizes="(min-width: 768px) 50vw, 100vw" src="/assets/pages/solutions/ai-crew/hero-visual.webp" /></div>
      </section>

      <section className="-mx-5 bg-bg-deep px-5 py-[70px] md:-mx-10 md:px-10 md:py-[90px]">
        <div className="mx-auto w-full max-w-[1200px] space-y-10">
          <SolutionSectionHeading title={copy.beforeAfter.titleLines} description={copy.beforeAfter.description} />
          <AiCrewBeforeAfter {...copy.beforeAfter} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] space-y-10">
        <SolutionSectionHeading title={copy.introduction.title} description={copy.introduction.description} />
        <ol className="grid gap-4 md:grid-cols-5">{copy.introduction.steps.map(([number, title, body], index) => <li className="relative rounded-box border border-border bg-bg p-6" key={number}><div className="flex items-center justify-between gap-3"><Badge variant="primary">Step {number}</Badge><span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-bg-content text-fg"><SolutionIcon name={introductionStepIcons[index] ?? "check"} /></span></div><h3 className="mb-3 mt-6 type-h3 text-fg">{title}</h3><p className="m-0 type-body-md text-mute">{body}</p></li>)}</ol>
        <ButtonGroup className="flex-wrap justify-center">
          <SolutionActionLink href={contactHref} variant="secondary">{copy.introduction.action}</SolutionActionLink>
          <SolutionActionLink href={demoHref} variant="outline">{copy.hero.secondaryAction}</SolutionActionLink>
        </ButtonGroup>
      </section>

      <section className="-mx-5 bg-bg-deep px-5 py-[70px] md:-mx-10 md:px-10 md:py-[90px]">
        <div className="mx-auto w-full max-w-[1200px] space-y-6"><SolutionSectionHeading title={copy.platform.title} description={copy.platform.description} /><AiCrewPlatformDiagram coreBody={copy.platform.coreBody} items={copy.platform.items} /></div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] space-y-10">
        <SolutionSectionHeading title={copy.useCases.title} description={copy.useCases.description} />
        <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 lg:grid-cols-3">
          {copy.useCases.items.map((item) => (
            <AiCrewUseCaseCard
              body={item.body}
              href={getPublicDetailHref("demo", locale, item.id, "use-cases")}
              key={item.id}
              imageSrc={item.imageSrc}
              tags={item.tags}
              title={item.title}
            />
          ))}
        </div>
        <div className="flex justify-center"><SolutionActionLink href={demoHref} variant="outline">{copy.useCases.action}</SolutionActionLink></div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] space-y-10">
        <SolutionSectionHeading title={copy.voices.title} />
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">{copy.voices.items.map(([initials, role, organization, quote]) => <figure className="m-0 rounded-box bg-bg-content p-6 text-left" key={initials}><blockquote className="m-0 whitespace-pre-line type-body-lg text-fg">“{quote}”</blockquote><figcaption className="mt-6 flex items-center gap-4"><span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-fg type-body-md text-bg">{initials}</span><div className="min-w-0"><p className="m-0 type-body-sm text-fg">{role}</p><p className="m-0 type-body-sm text-mute">{organization}</p></div></figcaption></figure>)}</div>
          <div className="grid gap-4 rounded-box bg-bg-content p-6 md:grid-cols-2">
            <div className="flex flex-col justify-start"><h2 className="m-0 text-pretty type-h2 text-fg">{copy.pricing.title}</h2><p className="mb-0 mt-5 type-body-lg text-mute">{copy.pricing.description}</p></div>
            <div className="grid gap-4 sm:grid-cols-2">{copy.pricing.cards.map(([icon, title, body]) => <article className="rounded-box bg-bg p-6" key={title}><SolutionIcon name={icon} /><h3 className="mb-3 mt-8 type-h3 text-fg">{title}</h3><p className="m-0 type-body-md text-mute">{body}</p></article>)}</div>
          </div>
        </div>
      </section>

      <AiCrewWhitepaperSection {...copy.whitepaper} href={whitepaperHref} />

      <Cta actionHref={contactHref} actionLabel={copy.cta.action} compactHeading description={copy.cta.description} hideEyebrow locale={locale} secondaryActionHref={demoHref} secondaryActionLabel={copy.cta.secondaryAction} secondaryActionVariant="outline" title={copy.cta.title} />
    </div>
  );
}
