import LingoQuoteForm from "./LingoQuoteForm";
import type { LingoQuotePageCopy } from "@/copy/lingoQuote";
import type { Locale } from "@/constants/i18n";
import type { LingoQuotePlan } from "@/features/lingo-quote/catalog";

export default function LingoQuotePage({
  copy,
  locale,
  initialPlan,
}: {
  copy: LingoQuotePageCopy;
  locale: Locale;
  initialPlan?: LingoQuotePlan;
}) {
  return (
    <div className="flex w-full justify-center px-5 md:px-10">
      <section className="mx-auto flex w-full max-w-[900px] flex-col gap-12 pb-10 md:flex-row md:items-start md:gap-[80px]">
        <div className="flex min-w-0 flex-1 basis-1/2 flex-col gap-5">
          <h1 className="m-0 type-h2 text-fg">{copy.title}</h1>
          <p className="m-0 whitespace-pre-line type-body-md text-mute">{copy.description}</p>
        </div>
        <div className="flex min-w-0 flex-1 basis-1/2 flex-col gap-5">
          <LingoQuoteForm copy={copy} initialPlan={initialPlan} locale={locale} />
        </div>
      </section>
    </div>
  );
}
