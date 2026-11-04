import Cta from "@/components/sections/Cta";
import { getLocalePath } from "@/constants/i18n";
import { pageContentWidthClassName, pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import { japanAiSolutionsCopy, type JapanAiSolutionId } from "@/copy/japanAiSolutions";
import AiGatewayDiagram from "./AiGatewayDiagram";
import AiGatewayContent from "./AiGatewayContent";
import SolutionActionLink from "./SolutionActionLink";
import SolutionSectionHeading from "./SolutionSectionHeading";

export default function JapanAiSolutionPage({ id }: { id: JapanAiSolutionId }) {
  const copy = japanAiSolutionsCopy[id];
  const contactHref = getLocalePath("ja", "/contact-us");

  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
      {id === "ai-gateway" ? (
        <section className={pageContentWidthClassName}>
          <header className="grid items-start gap-4 sm:gap-5 md:grid-cols-2 md:gap-7.5">
            <h1 className="m-0 text-pretty type-h1 text-fg">{copy.hero.title}<br />{copy.hero.accent}{copy.hero.accentAfter}</h1>
            <div className="min-w-0 space-y-3 type-body-lg leading-relaxed text-fg">{copy.hero.description.map((text) => <p className="m-0" key={text}>{text}</p>)}</div>
          </header>
          <div className="mt-12 md:mt-16"><AiGatewayDiagram /></div>
        </section>
      ) : (
        <section className="mx-auto grid w-full max-w-[1200px] items-start gap-10 md:grid-cols-2 md:gap-[30px]">
          <div className="flex min-w-0 flex-col items-start gap-6">
            <h1 className="m-0 text-pretty type-h1 text-fg">{copy.hero.title}<br /><span className="text-brand">{copy.hero.accent}</span>{copy.hero.accentAfter}</h1>
            <div className="max-w-[560px] space-y-3 type-body-lg text-mute">{copy.hero.description.map((text) => <p className="m-0" key={text}>{text}</p>)}</div>
            <SolutionActionLink href={contactHref}>相談する</SolutionActionLink>
          </div>
          <div aria-label={copy.hero.imageLabel} className="relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-box border border-dashed border-brand/40 bg-bg-content p-6 text-center type-body-md text-mute" role="img">
            <span className="max-w-[240px]">{copy.hero.imageLabel}</span>
          </div>
        </section>
      )}

      {id === "ai-gateway" ? <AiGatewayContent /> : copy.sections.map((section, index) => (
        <section className={`${index % 2 === 0 ? "-mx-5 bg-bg-deep px-5 md:-mx-10 md:px-10" : "mx-auto w-full max-w-[1200px]"} py-[70px] md:py-[100px]`} key={section.title}>
          <div className="mx-auto w-full max-w-[1200px] space-y-10">
            <SolutionSectionHeading description={section.description} title={section.title} />
            <div className="grid gap-4 md:grid-cols-3">{section.cards.map((card) => <article className="min-w-0 overflow-hidden rounded-box bg-bg-content" key={card.title}>
              <div className="p-6"><h3 className="m-0 type-h3 text-fg">{card.title}</h3><p className="mb-0 mt-4 type-body-md text-mute">{card.body}</p></div>
            </article>)}</div>
          </div>
        </section>
      ))}

      <Cta actionHref={contactHref} actionLabel="相談する" compactHeading description={copy.cta.description} hideEyebrow locale="ja" secondaryActionLabel="" title={copy.cta.title} />
    </div>
  );
}
