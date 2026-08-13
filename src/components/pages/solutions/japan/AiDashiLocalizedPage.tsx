import Image from "next/image";
import Cta from "@/components/sections/Cta";
import Badge from "@/components/ui/Badge";
import { getLocalePath, type Locale } from "@/constants/i18n";
import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import { getPublicDetailHref } from "@/features/content/data";
import { getAiDashiCopy } from "./aiDashiCopy";
import AiCrewWhitepaperSection from "./AiCrewWhitepaperSection";
import AiDashiRolloutSection from "./AiDashiRolloutSection";
import AiDashiValueHeadline from "./AiDashiValueHeadline";
import ComparisonAvailabilityIcon from "./ComparisonAvailabilityIcon";
import SolutionActionLink from "./SolutionActionLink";
import SolutionIcon from "./SolutionIcon";
import SolutionSectionHeading from "./SolutionSectionHeading";

export default function AiDashiLocalizedPage({ locale }: { locale: Exclude<Locale, "ja"> }) {
  const copy = getAiDashiCopy(locale);
  if (!copy) return null;

  const contactHref = getLocalePath(locale, "/company/contact-us");
  const whitepaperHref = getPublicDetailHref("documentation", locale, "saas-end-or-evolution", "white-papers");
  const [conceptTitleBefore, conceptTitleAfter] = copy.concept.title.split("AI Dashi");

  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
      <section className="relative -mx-5 -mt-[36px] min-h-[600px] overflow-hidden bg-bg-deep md:-mx-10 md:-mt-[76px] md:min-h-[560px]">
        <Image alt={copy.hero.imageAlt} className="object-cover" fill priority sizes="100vw" src="/assets/pages/solutions/ai-dashi/hero-ai.webp" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.5)_54%,rgba(0,0,0,0.08)_100%)]" />
        <div className="relative mx-auto flex min-h-[600px] w-full max-w-[1280px] items-center px-5 py-12 md:min-h-[560px] md:px-10 md:py-12">
          <div className="theme-dark flex max-w-[720px] flex-col items-start gap-6 text-white">
            <h1 className="m-0 text-pretty type-h1">
              <span className="md:hidden">{copy.hero.title.map((line) => <span className="block" key={line}>{line}</span>)}</span>
              <span className="hidden md:block"><span className="block">{copy.hero.title[0]} {copy.hero.title[1]}</span><span className="block">{copy.hero.title[2]}</span></span>
            </h1>
            <div className="max-w-[620px] space-y-2 type-body-lg text-white/80">{copy.hero.description.map((paragraph) => <p className="m-0" key={paragraph}>{paragraph}</p>)}</div>
            <SolutionActionLink href={contactHref} variant="primary">{copy.hero.action}</SolutionActionLink>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1200px] gap-10 md:grid-cols-2 md:items-center md:gap-[60px]">
        <div className="space-y-5"><h2 className="m-0 text-pretty type-h1 text-fg">{conceptTitleBefore}<span className="text-brand">AI Dashi</span>{conceptTitleAfter}</h2>{copy.concept.paragraphs.map((paragraph) => <p className="m-0 type-body-lg text-mute" key={paragraph}>{paragraph}</p>)}</div>
        <div className="w-full max-w-[480px] justify-self-center overflow-hidden rounded-box md:justify-self-end"><Image alt={copy.concept.imageAlt} className="block h-auto w-full" height={1088} sizes="(min-width: 768px) 480px, 100vw" src="/assets/pages/solutions/ai-dashi/about-visual.webp" width={1200} /></div>
      </section>

      <section className="-mx-5 bg-bg-deep px-5 py-[70px] md:-mx-10 md:px-10 md:py-[90px]">
        <div className="mx-auto w-full max-w-[1200px] space-y-10"><SolutionSectionHeading title={copy.values.title} /><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,680px)] lg:items-start lg:gap-10"><div className="flex flex-col gap-4">{copy.values.items.map((item) => <article className="flex flex-col rounded-box bg-bg p-6" key={item.number}><div><Badge variant="secondary">{item.title}</Badge></div><h3 className="mb-4 mt-5 type-h3 text-fg"><AiDashiValueHeadline accent={item.headlineAccent} headline={item.headline} /></h3><p className="m-0 type-body-md text-mute">{item.body}</p></article>)}</div><div className="relative mx-auto aspect-[1.14/1] w-full max-w-[680px] overflow-hidden rounded-box"><Image alt={copy.valueVisual.imageAlt} className="object-cover" fill sizes="(min-width: 1024px) 680px, (min-width: 640px) 600px, 100vw" src="/assets/pages/solutions/ai-dashi/value-diagram.webp" /></div></div></div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] space-y-10">
        <SolutionSectionHeading title={copy.risks.title} description={copy.risks.description} /><div className="grid gap-4 md:grid-cols-3">{copy.risks.items.map((item) => <article className="rounded-box bg-[var(--color-inverse-bg)] p-6" key={item.title}><div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-inverse-fg)] text-[var(--color-inverse-bg)]"><SolutionIcon name={item.icon} /></div><h3 className="mb-4 mt-8 type-h3 text-[var(--color-inverse-fg)]">{item.title}</h3><p className="m-0 type-body-md text-[var(--color-inverse-muted)]">{item.body}</p></article>)}</div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] space-y-10">
        <SolutionSectionHeading title={copy.security.title} description={copy.security.description} />
        <div className="grid gap-4 md:grid-cols-3">{copy.security.items.map((item) => <article className="rounded-box bg-bg-content p-6" key={item.title}><div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-bg text-fg"><SolutionIcon name={item.icon} /></div><h3 className="mb-4 mt-8 type-h3 text-fg">{item.title}</h3><p className="m-0 type-body-md text-mute">{item.body}</p></article>)}</div>
      </section>

      <section className="-mx-5 bg-bg-deep px-5 py-[70px] md:-mx-10 md:px-10 md:py-[90px]">
        <div className="mx-auto w-full max-w-[1100px] space-y-10">
          <SolutionSectionHeading title={copy.comparison.title} description={copy.comparison.description} />
          <div className="overflow-x-auto overflow-y-hidden rounded-box border border-border bg-bg"><div className="min-w-[800px]"><div className="grid grid-cols-[0.8fr_1.4fr_1.4fr] border-b border-border bg-bg text-fg"><span className="px-5 py-4" /><span className="relative z-10 -mb-px flex flex-col items-center gap-1 border-x-[3px] border-t-[3px] border-brand px-5 py-4 text-center"><h3 className="m-0 flex items-center gap-2 type-h3"><Badge variant="brand">{copy.comparison.recommended}</Badge>{copy.comparison.headers[1]}</h3><span className="type-body-sm text-mute">{copy.comparison.headerDescriptions[1]}</span></span><span className="flex flex-col items-center gap-1 px-5 py-4 text-center"><h3 className="m-0 type-h3">{copy.comparison.headers[2]}</h3><span className="type-body-sm text-mute">{copy.comparison.headerDescriptions[2]}</span></span></div>{copy.comparison.rows.map((row, index) => <div className="grid grid-cols-[0.8fr_1.4fr_1.4fr] border-b border-border last:border-b-0" key={row.label}><strong className="self-center px-5 py-4 type-body-lg text-fg">{row.label}</strong><div className={`relative z-10 -mb-px flex flex-col items-center border-x-[3px] border-brand px-5 py-4 text-center ${index === copy.comparison.rows.length - 1 ? "border-b-[3px]" : ""}`}><ComparisonAvailabilityIcon available /><p className="mb-0 mt-3 type-body-lg text-fg">{row.aip[0]}</p><p className="mb-0 mt-1 type-body-sm text-mute">{row.aip[1]}</p></div><div className="flex flex-col items-center px-5 py-4 text-center"><ComparisonAvailabilityIcon available={false} /><p className="mb-0 mt-3 type-body-lg text-fg">{row.inHouse[0]}</p><p className="mb-0 mt-1 type-body-sm text-mute">{row.inHouse[1]}</p></div></div>)}</div></div>
          <p className="m-0 text-center type-body-sm text-mute">{copy.comparison.note}</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] space-y-8 md:space-y-10">
        <SolutionSectionHeading title={copy.support.title} description={copy.support.description} />
        <div className="grid gap-4 md:gap-5 lg:grid-cols-3">{copy.support.items.map((item) => <article className="flex flex-col rounded-box bg-bg-content p-6 md:h-full md:min-h-[360px]" key={item.title}><div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-bg"><SolutionIcon name={item.icon} /></div><h3 className="mb-2 mt-5 type-h2 text-fg md:mt-7">{item.title}</h3><p className="m-0 type-body-md text-mute">{item.subtitle}</p><ul className="m-0 mt-5 flex list-none flex-col gap-2.5 p-0 md:mt-6 md:gap-3">{item.points.map((point) => <li className="flex items-start gap-1.5 type-body-md text-fg" key={point}><span className="inline-flex w-4 shrink-0 justify-center text-brand">✓</span><span>{point}</span></li>)}</ul></article>)}</div>
      </section>

      <AiDashiRolloutSection {...copy.rollout} />

      <AiCrewWhitepaperSection
        {...copy.whitepaper}
        href={whitepaperHref}
        imageSrc="/documentation/white-papers/thumbnail-26.webp"
      />

      <Cta actionHref={contactHref} actionLabel={copy.cta.action} compactHeading description={copy.cta.description} hideEyebrow locale={locale} secondaryActionHref="" secondaryActionLabel="" title={copy.cta.title} />
    </div>
  );
}
