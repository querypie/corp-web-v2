import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { getLocalePath } from "@/constants/i18n";
import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import {
  as400CobolCopy as copy,
  type As400CobolCard,
  type As400CobolSection,
  type As400CobolText,
} from "@/copy/as400Cobol";
import SolutionActionLink from "./SolutionActionLink";
import SolutionIcon from "./SolutionIcon";
import SolutionSectionHeading from "./SolutionSectionHeading";

const backgroundInsightIcons = ["layers", "connect", "brain"] as const;

function SourceText({ value }: { value: As400CobolText }) {
  return <>{value.text}{value.reference ? (
    <sup className="ml-1">
      <a aria-label={value.reference.label} className="text-mute underline underline-offset-4 hover:text-brand" href={value.reference.href} rel="noreferrer noopener" target="_blank">
        {value.reference.text}
      </a>
    </sup>
  ) : null}</>;
}

function ContentCard({ bordered = true, item }: { bordered?: boolean; item: As400CobolCard }) {
  return (
    <article className={`min-w-0 rounded-box bg-bg p-6 ${bordered ? "border border-border" : ""}`}>
      <h3 className="m-0 text-pretty type-h3 text-fg">{item.title}</h3>
      {item.label ? <div className="mt-3"><Badge variant="primary">{item.label}</Badge></div> : null}
      <p className="mb-0 mt-4 type-body-md text-mute"><SourceText value={item.body} /></p>
    </article>
  );
}

function BackgroundInsightCard({ item, index }: { item: As400CobolCard; index: number }) {
  const iconName = backgroundInsightIcons[index] ?? "spark";

  return (
    <article className="min-w-0 rounded-box bg-bg p-6">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-button bg-bg-content text-fg">
          <SolutionIcon className="h-5 w-5" name={iconName} />
        </span>
        <h3 className="m-0 min-w-0 text-pretty type-h3 text-fg">{item.title}</h3>
      </div>
      <p className="mb-0 mt-4 type-body-md text-mute"><SourceText value={item.body} /></p>
    </article>
  );
}

function ProcessFlow({ bordered = true, stages }: { bordered?: boolean; stages: As400CobolSection["stages"] }) {
  return (
    <ol className="grid gap-8 md:grid-cols-3">
      {stages.map((stage, index) => (
        <li className={`theme-dark relative min-w-0 rounded-box bg-bg p-6 ${bordered ? "border border-border" : ""}`} key={stage.title}>
          <h3 className="m-0 text-pretty type-h3 text-fg">{stage.title}</h3>
          <div className="mt-3"><Badge variant="primary">{stage.label}</Badge></div>
          <ul className="mb-0 mt-6 space-y-3">
            {stage.items.map((item) => (
              <li className="flex items-start gap-3 type-body-md text-mute" key={item}>
                <span aria-hidden="true" className="mt-0.5 shrink-0 text-brand"><SolutionIcon name="check" /></span>
                <span className="min-w-0">{item}</span>
              </li>
            ))}
          </ul>
          {index < stages.length - 1 ? (
            <ArrowRight aria-hidden="true" className="absolute -bottom-7 left-1/2 h-5 w-5 -translate-x-1/2 rotate-90 text-mute md:-right-6 md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:rotate-0" />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function ContentSection({ section, shaded }: { section: As400CobolSection; shaded: boolean }) {
  return (
    <section className={shaded ? "-mx-5 bg-bg-deep px-5 py-[70px] md:-mx-10 md:px-10 md:py-[90px]" : "w-full"} id={section.id}>
      <div className="mx-auto w-full max-w-[1200px] space-y-10">
        <div className="w-full space-y-4 text-center">
          <SolutionSectionHeading title={section.title} />
          <p className="m-0 w-full whitespace-pre-line text-pretty type-body-lg text-mute"><SourceText value={section.description} /></p>
        </div>

        {section.stats.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {section.stats.map((stat) => (
              <article className={`theme-dark min-w-0 rounded-box bg-bg p-6 ${shaded ? "" : "border border-border"}`} key={stat.title}>
                <p className="m-0 type-h2 text-brand">{stat.value}</p>
                <h3 className="mb-0 mt-4 type-h3 text-fg">{stat.title}</h3>
                <p className="mb-0 mt-3 type-body-sm text-mute"><SourceText value={stat.body} /></p>
              </article>
            ))}
          </div>
        ) : null}

        {section.insights.length ? (
          section.paragraphs.length ? (
            <div className="space-y-8">
              <div className="w-full space-y-5 whitespace-pre-line text-pretty type-body-lg text-mute">
                {section.paragraphs.map((paragraph) => <p className="m-0" key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {section.insights.map((item, index) => <BackgroundInsightCard index={index} item={item} key={item.title} />)}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {section.insights.map((item) => <ContentCard bordered={!shaded} item={item} key={item.title} />)}
            </div>
          )
        ) : null}

        {section.stages.length ? <ProcessFlow bordered={!shaded} stages={section.stages} /> : null}
        {section.cards.length ? (
          <div className={section.cards.length === 4 ? "grid gap-4 md:grid-cols-2 lg:grid-cols-4" : "grid gap-4 md:grid-cols-2 lg:grid-cols-3"}>
            {section.cards.map((item) => <ContentCard bordered={!shaded} item={item} key={item.title} />)}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function As400CobolPage() {
  const contactHref = getLocalePath("ja", "/contact-us");

  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
      <section className="mx-auto grid w-full max-w-[1200px] items-start gap-10 md:grid-cols-2 md:items-center md:gap-[30px]">
        <div className="flex flex-col items-start gap-6">
          <h1 className="m-0 text-pretty type-h1 text-fg">{copy.hero.title}</h1>
          <div className="max-w-[560px] space-y-3 type-body-lg text-fg">
            <p className="m-0">{copy.hero.subtitle}</p>
            <p className="m-0">{copy.hero.description}</p>
          </div>
          <SolutionActionLink href={contactHref}>{copy.hero.action}</SolutionActionLink>
        </div>
        <figure className="relative m-0 aspect-[16/9] overflow-hidden rounded-box bg-bg-content">
          <Image alt={copy.hero.imageAlt} className="h-auto w-full" height={941} priority sizes="(min-width: 1280px) 585px, (min-width: 768px) 50vw, 100vw" src="/assets/pages/solutions/as400-cobol/hero-modernization-flow.png" width={1672} />
          <figcaption className="absolute inset-x-4 bottom-4 hidden grid-cols-3 gap-3 lg:grid">
            {copy.hero.labels.map(([title, description]) => (
              <div className="min-w-0 rounded-box bg-bg px-4 py-3 shadow-lg" key={title}>
                <p className="m-0 type-body-sm text-fg">{title}</p>
                <p className="mb-0 mt-1 type-body-sm text-mute">{description}</p>
              </div>
            ))}
          </figcaption>
        </figure>
      </section>

      {copy.sections.map((section, index) => <ContentSection key={section.id} section={section} shaded={index % 2 === 0} />)}

      <section className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-6 pb-5 pt-10 text-center md:pb-10 md:pt-20">
        <SolutionSectionHeading description={copy.contact.description} title={copy.contact.title} />
        <SolutionActionLink href={contactHref}>{copy.contact.action}</SolutionActionLink>
      </section>
    </div>
  );
}
