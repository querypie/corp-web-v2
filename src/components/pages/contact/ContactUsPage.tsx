import type { Locale } from "@/constants/i18n";
import type { ContactPageCopy } from "@/features/contact/copy";
import ContactForm from "./ContactForm";

type ContactUsPageProps = ContactPageCopy & { locale: Locale };

export default function ContactUsPage(props: ContactUsPageProps) {
  const { titleLines, formDescription, emailLinks } = props;

  return (
    <div className="flex w-full justify-center px-5 md:px-10">
      <section className="mx-auto flex w-full max-w-[900px] flex-col gap-20 pb-10 md:flex-row md:items-start md:gap-[80px]">
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
            <p className="m-0 type-body-md text-mute-fg">{formDescription}</p>
            <div className="flex flex-col gap-0.5 type-body-md text-fg">
              {emailLinks.map((item) => (
                <p key={item.label} className="m-0">
                  <span className="text-fg">{item.label} :</span>{" "}
                  <a
                    className="text-mute-fg underline decoration-solid transition-colors hover:text-fg"
                    href={item.href}
                  >
                    {item.value}
                  </a>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* 우측 폼 */}
        <ContactForm {...props} />
      </section>
    </div>
  );
}
