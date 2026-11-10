import Cta from "@/components/sections/Cta";
import type { Locale } from "@/constants/i18n";
import { pageContentWidthClassName, pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import { aiProductsCopy, aiProductAction } from "@/copy/aiProducts";
import { aiGatewayManualLabel } from "@/copy/aiGatewayLocalized";
import { getContactHref } from "@/features/contact/prefill";
import { getAiGatewayManualHref } from "@/features/offerings/routes";
import AiGatewayDiagram from "./AiGatewayDiagram";
import AiGatewayContent from "./AiGatewayContent";

export default function AiGatewayPage({ locale }: { locale: Locale }) {
  const copy = aiProductsCopy[locale]["ai-gateway"];
  return <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
    <section className={pageContentWidthClassName}>
      <header className="grid items-start gap-4 sm:gap-5 md:grid-cols-2 md:gap-7.5">
        <h1 className="m-0 text-pretty type-h1 text-fg">{copy.hero.title}<br />{copy.hero.accent}{copy.hero.accentAfter}</h1>
        <div className="min-w-0 space-y-3 type-body-lg leading-relaxed text-fg">{copy.hero.description.map(text => <p className="m-0" key={text}>{text}</p>)}</div>
      </header>
      <div className="mt-12 md:mt-16"><AiGatewayDiagram locale={locale} /></div>
    </section>
    <AiGatewayContent locale={locale} />
    <Cta actionHref={getContactHref(locale, "aig")} actionLabel={aiProductAction[locale]} compactHeading description={copy.cta.description} hideEyebrow locale={locale} preserveActionOrder secondaryActionLabel={aiGatewayManualLabel[locale]} secondaryActionHref={getAiGatewayManualHref(locale)} title={copy.cta.title} />
  </div>;
}
