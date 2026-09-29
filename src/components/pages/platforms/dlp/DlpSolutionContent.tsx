import type { Locale } from "@/constants/i18n";
import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/Cta";
import { getDlpDemoUrl } from "@/features/platforms/dlpDemo";
import { ArrowRight, FileText, Maximize2, ScanSearch, ShieldCheck } from "lucide-react";

const processIcons = [ShieldCheck, ScanSearch, FileText];

export type DlpCopy = {
  benefitItems: Array<{ body: string; title: string }>;
  demoEmbedTitle: string;
  description: string;
  fullScreenDemoLabel: string;
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
        <div className="grid w-full max-w-[1200px] gap-4 md:grid-cols-3">
          {copy.benefitItems.map((item) => (
            <article className="rounded-box bg-bg-content p-6 md:p-8" key={item.title}>
              <h2 className="m-0 type-h3 text-fg">{item.title}</h2>
              <p className="mb-0 mt-4 type-body-md leading-relaxed text-mute">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex w-full justify-center">
        <div className="w-full max-w-[1600px]">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-6">
            <div>
              <h2 className="m-0 type-h2 text-fg">{copy.huggingFaceTitle}</h2>
              <p className="mb-0 mt-2 max-w-[760px] type-body-md leading-relaxed text-mute">
                {copy.huggingFaceDescription}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-4">
              <a
                className="inline-flex min-h-11 items-center justify-center rounded-button bg-primary px-5 type-body-md text-bg transition-opacity hover:opacity-80"
                href="https://huggingface.co/querypieai"
                rel="noreferrer noopener"
                target="_blank"
              >
                {copy.huggingFaceLabel}
              </a>
              <a
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button border border-border-strong px-5 type-body-md text-fg transition-colors hover:bg-bg-content"
                href={`/${locale}/platforms/dlp/demo`}
              >
                <Maximize2 aria-hidden="true" className="h-4 w-4 shrink-0" />
                {copy.fullScreenDemoLabel}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="flex w-full justify-center">
        <div className="w-full max-w-[1600px]">
          <h2 className="m-0 type-h2 text-fg">{copy.demoEmbedTitle}</h2>
          <div className="mt-8 overflow-hidden rounded-box border border-border bg-bg-content">
            <iframe
              allow="clipboard-read; clipboard-write; fullscreen"
              className="block h-[1200px] w-full border-0 bg-bg md:h-[1500px] xl:h-[1800px]"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              src={demoUrl ?? getDlpDemoUrl(locale)}
              title={copy.demoEmbedTitle}
            />
          </div>
        </div>
      </section>

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
