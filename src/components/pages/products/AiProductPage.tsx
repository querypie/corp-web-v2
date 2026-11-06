import Cta from "@/components/sections/Cta";
import { getLocalePath, type Locale } from "@/constants/i18n";
import { pageContentWidthClassName, pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import type { AiProductId } from "@/copy/aiProducts.ja";
import { aiProductsCopy, aiProductAction } from "@/copy/aiProducts";
import AiGatewayPage from "./ai-gateway/AiGatewayPage";
import SolutionSectionHeading from "@/components/pages/shared/SolutionSectionHeading";

export default function AiProductPage({ id, locale }: { id: AiProductId; locale: Locale }) {
  if (id === "ai-gateway") return <AiGatewayPage locale={locale} />;
  const copy = aiProductsCopy[locale][id];
  const contactHref = getLocalePath(locale, "/contact-us");

  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
        <section className={pageContentWidthClassName}>
          <header className="grid items-start gap-4 sm:gap-5 md:grid-cols-2 md:gap-7.5">
            <h1 className="m-0 min-w-0 text-pretty type-h1 text-fg">{copy.hero.title}<br />{copy.hero.accent}{copy.hero.accentAfter}</h1>
            <div className="min-w-0 space-y-6">
              <div className="space-y-3 type-body-lg leading-relaxed text-fg">{copy.hero.description.map((text) => <p className="m-0 text-pretty" key={text}>{text}</p>)}</div>
              <div className="flex aspect-[16/9] items-center justify-center rounded-box border border-dashed border-border bg-bg-content p-6 text-center type-body-md text-mute">
                <span className="max-w-[240px]">{copy.hero.imageLabel}</span>
              </div>
            </div>
          </header>
        </section>

      {copy.sections.map((section, index) => (
        <section className={index === 0 ? `-mx-5 bg-bg-deep py-16 md:-mx-10 md:py-[100px] ${pageXPaddingClassName}` : undefined} key={section.title}>
          <div className={`${pageContentWidthClassName} space-y-10`}>
            <SolutionSectionHeading description={section.description} title={section.title} layout="split" />
            <div className="grid gap-4 md:grid-cols-3">{section.cards.map((card) => <article className="min-w-0 overflow-hidden rounded-box bg-bg-content" key={card.title}>
              <div className="flex min-h-[200px] flex-col justify-center p-6"><h3 className="m-0 type-h3 text-fg">{card.title}</h3><p className="mb-0 mt-4 type-body-md text-mute">{card.body}</p></div>
            </article>)}</div>
          </div>
        </section>
      ))}

      <Cta actionHref={contactHref} actionLabel={aiProductAction[locale]} compactHeading description={copy.cta.description} hideEyebrow locale={locale} secondaryActionLabel="" title={copy.cta.title} />
    </div>
  );
}
