import type { Locale } from "@/constants/i18n";
import Image from "next/image";
import { pageContentWidthClassName, pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/Cta";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { getDlpDemoUrl } from "@/features/platforms/dlpDemo";
import { ArrowRight, Check } from "lucide-react";

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
    label?: string;
    role: string;
    sectionTitle?: string;
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
      <section className={pageContentWidthClassName}>
        <header className="grid w-full items-start gap-4 sm:gap-5 md:grid-cols-2 md:gap-7.5">
          <h1 className="m-0 min-w-0 text-pretty type-h1 text-fg">{copy.heading}</h1>
          <div className="min-w-0 space-y-6">
            <p className="m-0 text-pretty type-body-lg leading-relaxed text-fg">
              {copy.description}
            </p>
            <Image
              alt={copy.heading}
              className="h-auto w-full rounded-box"
              height={675}
              priority
              sizes="(min-width: 1280px) 585px, (min-width: 768px) 50vw, 100vw"
              src="/assets/pages/platforms/dlp/dlp-hero.webp"
              width={1200}
            />
          </div>
        </header>
      </section>

      <section className={pageContentWidthClassName}>
        <div className="space-y-10">
          <header className="grid w-full items-start gap-4 sm:gap-5 md:grid-cols-2 md:gap-7.5">
            <h2 className="m-0 min-w-0 text-pretty type-h2 text-fg">{copy.processTitle}</h2>
            <p className="m-0 min-w-0 text-pretty type-body-lg leading-relaxed text-mute">
              {copy.processDescription}
            </p>
          </header>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {copy.processSteps.map((step, index) => {
              return (
                <article className="relative flex min-w-0 flex-col rounded-box bg-bg-content p-6" key={step.title}>
                    <span className="type-h1 tabular-nums text-brand">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="mb-3 mt-6 text-pretty type-h3 text-fg">{step.title}</h3>
                    <p className="m-0 flex-1 text-pretty type-body-md text-mute">{step.body}</p>
                    {index < copy.processSteps.length - 1 ? (
                      <ArrowRight aria-hidden="true" className="absolute -right-6 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-brand lg:block" />
                    ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <div className={`${pageContentWidthClassName} grid gap-16 lg:grid-cols-2 lg:gap-[60px]`}>
      {copy.modelSections.map((model, index) => {
        const demo = copy.demoItems[index];
        if (!demo) return null;

        if (index === 0) {
          return (
            <section className="min-w-0" key={model.label ?? model.role}>
              <div className="space-y-10">
                <header>
                  <h2 className="m-0 min-w-0 text-pretty type-h2 text-fg">{model.role}</h2>
                </header>
                <p className="!mt-4 m-0 text-pretty type-body-lg leading-relaxed text-mute">{model.description}</p>

                <div className="flex flex-col gap-12">
                  <div className="order-1 min-w-0">
                    <h3 className="sr-only">{model.title}</h3>
                    <h4 className="sr-only">{model.role}</h4>
                    <h3 className="m-0 mb-4 type-h3 text-fg">{model.sectionTitle ?? "ELECTRA-based DLP"}</h3>
                    <div className="flex flex-col gap-3">
                      {model.flow.map((step) => (
                        <div className="flex items-start gap-3" key={step.label}>
                          <Check aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-brand" strokeWidth={1.8} />
                          <div className="min-w-0">
                            <p className="m-0 type-body-lg text-mute">{step.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-2 flex min-w-0 flex-col">
                    <h3 className="sr-only">{demo.title}</h3>
                    <h4 className="sr-only">{model.flowTitle}</h4>
                    <div className="grid items-stretch gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
                      <div className="h-full rounded-box bg-bg-content p-5">
                        <Badge variant="secondary">{locale === "ko" ? "검증 문장" : "Test sentence"}</Badge>
                        <p className="mb-0 mt-4 type-body-lg text-fg">{locale === "ko" ? "받은 파일에 다음과 같이 작성되어 있습니다:" : "The received file contains the following:"}<br />{locale === "ko" ? "접속 IP 198.51.100.227." : "Connection IP 198.51.100.227."}</p>
                      </div>
                      <ArrowRight aria-hidden="true" className="mx-auto self-center h-4 w-4 rotate-90 text-brand sm:rotate-0" />
                      <div className="h-full rounded-box bg-bg-content p-5">
                        <Badge variant="secondary">{locale === "ko" ? "위험 선별 결과" : "Risk screening result"}</Badge>
                        <p className="mb-0 mt-3 type-h1 text-brand">0.999</p>
                        <div className="mt-3 h-2 rounded-full bg-brand" />
                        <p className="mb-0 mt-3 type-body-sm text-mute">{locale === "ko" ? "차단 판정" : "Block decision"}</p>
                      </div>
                    </div>
                    <img alt={demo.title} className="sr-only" src={demo.imageSrc} />
                    <p className="mb-0 mt-4 type-body-md text-mute">{demo.description}</p>
                  </div>
                </div>
                <Button
                  arrow
                  className="!mt-4"
                  href={demoUrl ?? getDlpDemoUrl(locale)}
                  rel="noreferrer noopener"
                  size="default"
                  style="full"
                  target="_blank"
                  variant="primary"
                >
                  {copy.demoLinkLabel}
                </Button>
              </div>
            </section>
          );
        }

        return (
          <section className="min-w-0" key={model.label ?? model.role}>
            <div className="space-y-10">
              <header>
                <h2 className="m-0 min-w-0 text-pretty type-h2 text-fg">
                  {model.role}
                </h2>
              </header>
              <p className="!mt-4 m-0 text-pretty type-body-lg leading-relaxed text-mute">{model.description}</p>

              <div className="flex flex-col gap-12">
                <div className="order-2 min-w-0">
                  <div className="grid items-stretch gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
                    <div className="min-w-0 rounded-box bg-bg-content p-5">
                      <Badge variant="secondary">{locale === "ko" ? "입력 문서" : "Input document"}</Badge>
                      <p className="mb-0 mt-4 break-words type-body-lg leading-relaxed text-fg">
                        {locale === "ko" ? "담당자 김민수의" : "Contact Kim Minsu's"}<br />
                        <span className="break-all">minsu.kim@example.com</span><br />
                        {locale === "ko" ? "연락처 010-1234-5678" : "Phone 010-1234-5678"}
                      </p>
                    </div>
                    <ArrowRight aria-hidden="true" className="mx-auto self-center h-4 w-4 rotate-90 text-brand sm:rotate-0" />
                    <div className="min-w-0 rounded-box bg-bg-content p-5">
                      <Badge variant="secondary">{locale === "ko" ? "탐지 결과" : "Detection results"}</Badge>
                      <ul className="mb-0 mt-4 flex list-none flex-col gap-3 p-0 type-body-lg text-fg">
                        <li className="flex min-w-0 items-start gap-2">
                          <span className="shrink-0">{locale === "ko" ? "담당자" : "Contact"}</span>
                          <div className="flex min-w-0 flex-col items-start">
                            <span className="block text-[#f36f45]">{locale === "ko" ? "김민수" : "Kim Minsu"}</span>
                            <Badge className="!h-3.5 !bg-[#f36f45] !px-1 !text-[10px] !leading-none text-white" variant="brand"><strong>PERSON NAME</strong></Badge>
                          </div>
                          {locale === "ko" ? <span>의</span> : null}
                        </li>
                        <li className="flex min-w-0 flex-col items-start">
                          <span className="block break-all text-[#7c43ce]">minsu.kim@example.com</span>
                          <Badge className="!h-3.5 !bg-[#7c43ce] !px-1 !text-[10px] !leading-none text-white" variant="brand"><strong>EMAIL ADDRESS</strong></Badge>
                        </li>
                        <li className="flex min-w-0 items-start gap-2">
                          <span className="shrink-0">{locale === "ko" ? "연락처" : "Phone"}</span>
                          <div className="flex min-w-0 flex-col items-start">
                            <span className="block text-[#0f8b83]">010-1234-5678</span>
                            <Badge className="!h-3.5 !bg-[#0f8b83] !px-1 !text-[10px] !leading-none text-white" variant="brand"><strong>PHONE NUMBER</strong></Badge>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <p className="mb-0 mt-4 type-body-md text-mute">{demo.description}</p>
                </div>

                <div className="order-1 min-w-0">
                  <h3 className="m-0 mb-4 type-h3 text-fg">{model.sectionTitle ?? `${model.label ?? model.role} DLP`}</h3>
                  <div className="flex flex-col gap-3">
                    {model.flow.map((step) => (
                      <div className="flex items-start gap-3" key={step.label}>
                        <Check aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-brand" strokeWidth={1.8} />
                        <div className="min-w-0">
                          <p className="m-0 type-body-lg text-mute">{step.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                arrow
                className="!mt-4"
                href={demoUrl ?? getDlpDemoUrl(locale)}
                rel="noreferrer noopener"
                size="default"
                style="full"
                target="_blank"
                variant="primary"
              >
                {copy.demoLinkLabel}
              </Button>
            </div>
          </section>
        );
      })}
      </div>

      <section className={pageContentWidthClassName}>
        <div className="flex flex-col gap-5 rounded-box border border-border p-6 md:flex-row md:items-center md:p-8">
          <img
            alt=""
            aria-hidden="true"
            className="h-10 w-10 shrink-0 object-contain"
            height={40}
            src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg"
            width={40}
          />
          <div className="min-w-0 flex-1 space-y-2">
            <h2 className="m-0 text-pretty type-h2 text-fg">{copy.huggingFaceTitle}</h2>
            <p className="m-0 type-body-md text-mute">
              {copy.huggingFaceDescription}
            </p>
          </div>
          <Button
            arrow={false}
            className="self-start shrink-0 md:self-center"
            href="https://huggingface.co/querypieai"
            rel="noreferrer noopener"
            size="default"
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
