import { getButtonStyle } from "@/components/ui/Button";
import { getLocalePath, type Locale } from "@/constants/i18n";
import { pageXPaddingClassName } from "@/constants/layout";
import type { SlackAppPageCopy } from "@/copy/apps";
import type { ReactNode } from "react";

type SlackAppPageProps = SlackAppPageCopy & { locale: Locale };

function SectionItem({ children, title }: { children: ReactNode; title: string }) {
  return (
    <article className="border-b border-border pb-6 last:border-b-0">
      <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)] md:gap-[30px]">
        <h2 className="m-0 type-body-lg text-fg">{title}</h2>
        <div className="type-body-md leading-relaxed text-mute">{children}</div>
      </div>
    </article>
  );
}

export default function SlackAppPage({
  benefits,
  connectionSteps,
  connectionTitle,
  contactCta,
  description,
  locale,
  notice,
  noticeLabel,
  overview,
  overviewTitle,
  supportDescription,
  supportTitle,
  title,
  whyDescription,
  whyTitle,
}: SlackAppPageProps) {
  const contactButton = getButtonStyle("secondary", "full", "default", "default");

  return (
    <div className={`flex w-full justify-center ${pageXPaddingClassName} pb-10`}>
      <section className="flex w-full max-w-[900px] flex-col gap-10 sm:gap-8 md:gap-10 lg:gap-[60px]">
        <header className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
          <div className="flex flex-col gap-4">
            <h1 className="m-0 type-h1 text-fg">{title}</h1>
          </div>
          <div className="flex flex-col items-start gap-4 sm:gap-5">
            <p className="m-0 type-body-lg leading-relaxed text-fg">{description}</p>
            <a className={`${contactButton.container} ${contactButton.text} group cursor-pointer`} href={getLocalePath(locale, "/company/contact-us")}>
              {contactCta}
            </a>
          </div>
        </header>

        <div className="flex flex-col gap-[30px]">
          <img alt="Slack" className="size-16" height="64" src="/assets/products/acp/integrations/slack.svg" width="64" />

          <section className="flex flex-col gap-6 md:gap-8">
            <SectionItem title={overviewTitle}><p className="m-0">{overview}</p></SectionItem>
            <SectionItem title={whyTitle}>
              <p className="m-0">{whyDescription}</p>
              <div className="mt-5 flex flex-col gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit.title}>
                    <h3 className="m-0 type-body-md font-medium text-fg">{benefit.title}</h3>
                    <p className="mb-0 mt-1.5">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </SectionItem>
            <SectionItem title={connectionTitle}>
              <ol className="m-0 flex list-decimal flex-col gap-2 pl-5">
                {connectionSteps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </SectionItem>
            <SectionItem title={supportTitle}>
              <p className="m-0">{supportDescription}</p>
            </SectionItem>
          </section>
        </div>

        <aside className="rounded-box bg-bg-content p-5 md:p-6">
          <p className="m-0 type-body-md leading-relaxed text-mute"><span className="text-fg">{noticeLabel}</span> {notice}</p>
        </aside>
      </section>
    </div>
  );
}
