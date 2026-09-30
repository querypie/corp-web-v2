import type { Locale } from "@/constants/i18n";
import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/Cta";
import Button from "@/components/ui/Button";
import { getDlpDemoUrl } from "@/features/platforms/dlpDemo";
import { ArrowRight, ArrowUpRight, FileText, ScanSearch, ShieldCheck } from "lucide-react";

const processIcons = [ShieldCheck, ScanSearch, FileText];

export type DlpCopy = {
  demoItems: Array<{ description: string; imageSrc: string; title: string }>;
  demoLinkLabel: string;
  demoTitle: string;
  description: string;
  heading: string;
  huggingFaceDescription: string;
  huggingFaceLabel: string;
  huggingFaceTitle: string;
  label: string;
  modelSections: Array<{
    description: string;
    flow: Array<{ label: string; value: string }>;
    flowTitle: string;
    role: string;
    title: string;
  }>;
  processDescription: string;
  processSteps: Array<{ body: string; title: string }>;
  processTitle: string;
};

type Props = {
  copy: DlpCopy;
  demoUrl?: string;
  locale: Locale;
};

export default function DlpSolutionContent({ copy, demoUrl, locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
      <section className="flex w-full justify-center">
        <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
          <div>
            <p className="mb-3 type-body-md text-mute">{copy.label}</p>
            <h1 className="m-0 text-pretty type-h1 text-fg">{copy.heading}</h1>
          </div>
          <p className="m-0 max-w-[720px] text-pretty type-body-lg leading-relaxed text-fg">
            {copy.description}
          </p>
        </header>
      </section>

      <section className="flex w-full justify-center">
        <div className="w-full max-w-[1200px]">
          <div>
            <h2 className="m-0 text-pretty type-h2 text-fg">{copy.processTitle}</h2>
            <p className="mb-0 mt-3 text-pretty type-body-lg leading-relaxed text-mute">
              {copy.processDescription}
            </p>
          </div>

          <div className="mt-8 flex flex-col items-stretch gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)_3rem_minmax(0,1fr)] lg:gap-0">
            {copy.processSteps.map((step, index) => {
              const Icon = processIcons[index] ?? ShieldCheck;

              return (
                <div className="contents" key={step.title}>
                  <article className="flex min-h-[280px] flex-col rounded-box border border-border bg-bg-content p-6 md:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-bg">
                        <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
                      </span>
                      <span className="type-body-sm text-mute">0{index + 1}</span>
                    </div>
                    <h3 className="mb-0 mt-8 text-pretty type-h3 text-fg">{step.title}</h3>
                    <p className="mb-0 mt-4 text-pretty type-body-md leading-relaxed text-mute">
                      {step.body}
                    </p>
                  </article>
                  {index < copy.processSteps.length - 1 ? (
                    <div className="flex h-10 items-center justify-center lg:h-auto" aria-hidden="true">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg">
                        <ArrowRight className="h-4 w-4 rotate-90 text-mute lg:rotate-0" />
                      </span>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="flex w-full justify-center">
        <div className="flex w-full max-w-[1200px] flex-col gap-6 md:gap-8">
          {copy.modelSections.map((model) => (
            <article
              className="grid gap-8 rounded-box border border-border bg-bg-content p-6 md:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] lg:gap-12"
              key={model.role}
            >
              <div className="flex min-w-0 flex-col items-start">
                <span className="inline-flex rounded-full bg-primary px-3 py-1 type-body-md text-bg">
                  {copy.label}
                </span>
                <h2 className="mb-0 mt-6 text-pretty type-h1 text-fg">{model.role}</h2>
                <p className="mb-0 mt-4 text-pretty type-h3 text-fg">{model.title}</p>
                <p className="mb-0 mt-4 text-pretty type-body-lg leading-relaxed text-mute">
                  {model.description}
                </p>
              </div>

              <div className="rounded-box bg-bg p-5 md:p-6">
                <h3 className="m-0 type-h3 text-fg">{model.flowTitle}</h3>
                <ul className="mb-0 mt-5 flex list-none flex-col gap-3 p-0">
                  {model.flow.map((step) => (
                    <li
                      className="rounded-[12px] border border-border bg-bg-content p-4"
                      key={step.label}
                    >
                      <h4 className="m-0 type-body-md text-fg">{step.label}</h4>
                      <p className="mb-0 mt-1 text-pretty type-body-md leading-relaxed text-mute">{step.value}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="flex w-full justify-center">
        <div className="w-full max-w-[1200px]">
          <h2 className="m-0 type-h2 text-fg">{copy.demoTitle}</h2>
          <div className="mt-8 flex flex-col gap-6">
            {copy.demoItems.map((item) => (
              <a
                className="group grid overflow-hidden rounded-box border border-border bg-bg-content transition-colors hover:border-border-strong md:grid-cols-2"
                href={demoUrl ?? getDlpDemoUrl(locale)}
                key={item.title}
                rel="noreferrer noopener"
                target="_blank"
              >
                <img
                  alt={item.title}
                  className="block aspect-video h-full w-full object-cover"
                  src={item.imageSrc}
                />
                <div className="flex flex-col justify-center gap-5 p-6 md:p-10">
                  <h3 className="m-0 type-h3 text-fg">{item.title}</h3>
                  <p className="m-0 type-body-lg leading-relaxed text-mute">{item.description}</p>
                  <span className="inline-flex items-center gap-2 type-body-md text-primary">
                    {copy.demoLinkLabel}
                    <ArrowUpRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="flex w-full justify-center">
        <div className="flex w-full max-w-[1200px] flex-col items-center gap-6 text-center md:gap-8">
          <div className="flex flex-col items-center gap-3 md:gap-5">
            <h2 className="m-0 max-w-[920px] text-pretty type-h1 text-fg">{copy.huggingFaceTitle}</h2>
            <p className="m-0 max-w-[1200px] text-pretty type-body-lg leading-relaxed text-mute md:whitespace-nowrap">
              {copy.huggingFaceDescription}
            </p>
          </div>
          <Button
            arrow={false}
            className="min-w-[240px] md:min-w-[300px]"
            href="https://huggingface.co/querypieai"
            rel="noreferrer noopener"
            size="large"
            style="full"
            target="_blank"
            variant="secondary"
          >
            {copy.huggingFaceLabel}
          </Button>
        </div>
      </section>

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
