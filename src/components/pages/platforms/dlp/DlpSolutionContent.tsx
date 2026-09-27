import type { Locale } from "@/constants/i18n";
import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/Cta";
import FeatureMediaList from "@/components/sections/FeatureMediaList";
import { Play } from "lucide-react";

export type DlpCopy = {
  benefitItems: Array<{ body: string; title: string }>;
  demoDescription: string;
  demoLaunchLabel: string;
  demoTitle: string;
  description: string;
  featureBody: string;
  featureImageAlt: string;
  featureImageSrc: string;
  featureTitle: string;
  heading: string;
  label: string;
  tutorialTitle: string;
};

type Props = {
  copy: DlpCopy;
  locale: Locale;
};

export default function DlpSolutionContent({ copy, locale }: Props) {
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

      <FeatureMediaList
        items={[{
          body: [copy.featureBody],
          imageAlt: copy.featureImageAlt,
          imageClassName: "h-auto w-full",
          imageSrc: copy.featureImageSrc,
          mediaClassName: "aspect-auto h-auto w-full md:w-fit md:max-w-full",
          title: [copy.featureTitle],
        }]}
      />

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
              <h2 className="m-0 type-h2 text-fg">{copy.demoTitle}</h2>
              <p className="mb-0 mt-2 max-w-[760px] type-body-md leading-relaxed text-mute">
                {copy.demoDescription}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-4">
              <a
                className="inline-flex min-h-11 items-center justify-center rounded-button bg-primary px-5 type-body-md text-bg transition-opacity hover:opacity-80"
                href={`/${locale}/platforms/dlp/demo`}
              >
                {copy.demoLaunchLabel}
              </a>
              <a
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-button border border-border-strong px-5 type-body-md text-fg transition-colors hover:bg-bg-content"
                href="https://youtu.be/8iZmadjxmP4"
                rel="noreferrer noopener"
                target="_blank"
              >
                <Play aria-hidden="true" className="h-4 w-4 shrink-0" fill="currentColor" />
                {copy.tutorialTitle}
              </a>
            </div>
          </div>
          <div className="mt-8 overflow-hidden rounded-box border border-border bg-bg-content">
            <iframe
              allow="clipboard-read; clipboard-write; fullscreen"
              className="block h-[1200px] w-full border-0 bg-bg md:h-[1500px] xl:h-[1800px]"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              src={`https://querypie--dlp-demo.srv.kpb4r.mlxp.ncloud.com/?lang=${locale}`}
              title={copy.demoTitle}
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
