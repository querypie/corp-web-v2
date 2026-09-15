import type { Locale } from "@/constants/i18n";
import type { ContactPageCopy } from "@/copy/contact";
import ExternalLinkIcon from "@/components/ui/ExternalLinkIcon";
import ContactForm from "./ContactForm";

type ContactUsPageProps = ContactPageCopy & { locale: Locale };

export default function ContactUsPage(props: ContactUsPageProps) {
  const {
    contactHighlights,
    emailLinks,
    formDescription,
    supportLink,
    titleLines,
  } = props;

  return (
    <div className="flex w-full justify-center px-5 md:px-10">
      <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-20 pb-10 md:flex-row md:items-start md:gap-[80px]">
        {/* 좌측 히어로/안내 카피 */}
        <div className="flex min-w-0 flex-1 basis-1/2 flex-col gap-5">
          <h1 className="m-0 type-h2 text-fg">
            {titleLines.map((line, index) => (
              <span key={`${line}-${index}`} className="block">
                {line}
              </span>
            ))}
          </h1>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5">
              <p className="m-0 type-body-md text-mute">{formDescription}</p>
              <ul className="m-0 flex list-disc flex-col gap-2 pl-5 type-body-md text-mute">
                {contactHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-0.5 type-body-md text-fg">
                {emailLinks.map((item) => (
                  <p key={item.label} className="m-0">
                    <span className="text-fg">{item.label}:</span>{" "}
                    <a
                      className="text-brand decoration-1 underline-offset-4 hover:underline"
                      href={item.href}
                    >
                      {item.value}
                    </a>
                  </p>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="m-0 type-body-md text-mute">{supportLink.title}</p>
              <a
                className="inline-flex self-start items-center gap-1.5 type-body-md text-brand decoration-1 underline-offset-4 hover:underline"
                href={supportLink.href}
                rel="noreferrer noopener"
                target="_blank"
              >
                <span>{supportLink.label}</span>
                <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* 우측 폼 */}
        <ContactForm {...props} />
      </section>
    </div>
  );
}
