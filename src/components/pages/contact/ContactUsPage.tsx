import Button from "../../common/Button";
import type { ContactField, ContactLink } from "@/features/contact/copy";
import {
  ContactCheckboxRow,
  ContactPrivacyNotice,
  ContactSelectField,
  ContactTextAreaField,
  ContactTextField,
  FieldLabel,
  splitContactFields,
} from "./ContactFormParts";

type ContactUsPageProps = {
  consentLabel: string;
  emailLinks: ContactLink[];
  formDescription: string;
  formFields: ContactField[];
  messageField: ContactField;
  privacyText: string;
  privacyTermsHref: string;
  privacyTermsLabel: string;
  privacyPolicyHref: string;
  privacyPolicyLabel: string;
  productFieldLabel: string;
  productOptions: string[];
  submitLabel: string;
  titleLines: string[];
};

export default function ContactUsPage({
  consentLabel,
  emailLinks,
  formDescription,
  formFields,
  messageField,
  privacyPolicyHref,
  privacyPolicyLabel,
  privacyTermsHref,
  privacyTermsLabel,
  privacyText,
  productFieldLabel,
  productOptions,
  submitLabel,
  titleLines,
}: ContactUsPageProps) {
  const { afterProductFields, beforeProductFields } = splitContactFields(formFields);

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
                    <a className="text-mute-fg underline decoration-solid transition-colors hover:text-fg" href={item.href}>
                      {item.value}
                    </a>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* 우측 실제 문의 폼 */}
          <form className="flex min-w-0 flex-1 basis-1/2 flex-col gap-5">
            {beforeProductFields.map((field) => (
              field.type === "select" ? (
                <ContactSelectField key={field.name} field={field} />
              ) : (
                <ContactTextField key={field.name} field={field} />
              )
            ))}

            <div className="flex w-full flex-col gap-[10px]">
              <FieldLabel label={productFieldLabel} required />
              <div className="flex flex-col gap-[10px]">
                {productOptions.map((option) => (
                  <ContactCheckboxRow key={option} label={option} name={option} />
                ))}
              </div>
            </div>

            {afterProductFields.map((field) => (
              field.type === "select" ? (
                <ContactSelectField key={field.name} field={field} />
              ) : (
                <ContactTextField key={field.name} field={field} />
              )
            ))}

            <ContactTextAreaField field={messageField} />

            <div>
              <ContactCheckboxRow label={consentLabel} name="updates" />
            </div>

            <ContactPrivacyNotice
              privacyPolicyHref={privacyPolicyHref}
              privacyPolicyLabel={privacyPolicyLabel}
              privacyTermsHref={privacyTermsHref}
              privacyTermsLabel={privacyTermsLabel}
              privacyText={privacyText}
            />

<<<<<<< HEAD
            <div className="flex">
              <Button arrow={false} style="full" variant="secondary">
=======
            <div className="flex" data-reveal style={{ transitionDelay: `${(formFields.length + 4) * 70}ms` }}>
              <Button arrow={false} style="round" variant="secondary">
>>>>>>> origin/main
                {submitLabel}
              </Button>
            </div>
          </form>
      </section>
    </div>
  );
}
