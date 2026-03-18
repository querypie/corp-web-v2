import Button from "../../common/Button";
import Select from "../../common/Select";

type ContactLink = {
  href: string;
  label: string;
  value: string;
};

type ContactField = {
  label: string;
  name: string;
  options?: string[];
  placeholder?: string;
  required?: boolean;
  type?: "select" | "text";
};

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

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function RequiredMark() {
  return <span className="text-destructive">*</span>;
}

/* 폼 라벨: 필수 항목인 경우 별표 표시 */
function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="type-body-md text-fg">
      {required ? <RequiredMark /> : null}
      {required ? " " : null}
      {label}
    </label>
  );
}

function TextField({
  field,
  index,
}: {
  field: ContactField;
  index: number;
}) {
  return (
    /* 단일 줄 입력 필드 */
    <div className="flex w-full flex-col gap-[10px]" data-reveal style={{ transitionDelay: `${index * 70}ms` }}>
      <FieldLabel label={field.label} required={field.required} />
      <input
        aria-label={field.label}
        className="ui-field h-10 w-full rounded-button bg-bg-content px-3 type-body-md text-fg outline-none placeholder:text-mute-fg"
        name={field.name}
        placeholder={field.placeholder}
        type="text"
      />
    </div>
  );
}

function SelectField({
  field,
  index,
}: {
  field: ContactField;
  index: number;
}) {
  return (
    <div className="flex w-full flex-col gap-[10px]" data-reveal style={{ transitionDelay: `${index * 70}ms` }}>
      <FieldLabel label={field.label} required={field.required} />
      <Select
        aria-label={field.label}
        options={(field.options ?? []).map((option) => ({ label: option, value: option }))}
        placeholder={field.placeholder ?? field.label}
        name={field.name}
      />
    </div>
  );
}

function TextAreaField({
  field,
  index,
}: {
  field: ContactField;
  index: number;
}) {
  return (
    /* 여러 줄 추가 정보 입력 */
    <div className="flex w-full flex-col gap-[10px]" data-reveal style={{ transitionDelay: `${index * 70}ms` }}>
      <FieldLabel label={field.label} required={field.required} />
      <textarea
        aria-label={field.label}
        className="ui-field min-h-[120px] w-full resize-none rounded-button bg-bg-content px-3 py-2.5 type-body-md text-fg outline-none placeholder:text-mute-fg"
        name={field.name}
        placeholder={field.placeholder}
      />
    </div>
  );
}

function CheckboxRow({
  label,
  name,
}: {
  label: string;
  name: string;
}) {
  return (
    /* 제품 선택/동의 항목용 체크박스 행 */
    <label className="flex w-full items-start gap-[10px]">
      <input
        className="mt-[1px] size-[18px] shrink-0 rounded-[4px] border-0 accent-fg"
        name={name}
        type="checkbox"
      />
      <span className="type-body-md text-fg">{label}</span>
    </label>
  );
}

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
  return (
    <div className="flex w-full justify-center px-5 md:px-10">
      <section className="mx-auto flex w-full max-w-[900px] flex-col gap-20 pb-10 md:flex-row md:items-start md:gap-[60px]">
          {/* 좌측 히어로/안내 카피 */}
          <div className="flex min-w-0 flex-1 basis-1/2 flex-col gap-5" data-reveal>
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
            {formFields.map((field, index) => (
              field.type === "select" ? (
                <SelectField key={field.name} field={field} index={index} />
              ) : (
                <TextField key={field.name} field={field} index={index} />
              )
            ))}

            <div className="flex w-full flex-col gap-[10px]" data-reveal style={{ transitionDelay: `${formFields.length * 70}ms` }}>
              <FieldLabel label={productFieldLabel} required />
              <div className="flex flex-col gap-[10px]">
                {productOptions.map((option) => (
                  <CheckboxRow key={option} label={option} name={option} />
                ))}
              </div>
            </div>

            <TextAreaField field={messageField} index={formFields.length + 1} />

            <div data-reveal style={{ transitionDelay: `${(formFields.length + 2) * 70}ms` }}>
              <CheckboxRow label={consentLabel} name="updates" />
            </div>

            <p className="m-0 type-body-md leading-5 text-fg" data-reveal style={{ transitionDelay: `${(formFields.length + 3) * 70}ms` }}>
              {privacyText}{" "}
              <a className="text-mute-fg underline decoration-solid transition-colors hover:text-fg" href={privacyTermsHref}>
                {privacyTermsLabel}
              </a>{" "}
              &{" "}
              <a className="text-mute-fg underline decoration-solid transition-colors hover:text-fg" href={privacyPolicyHref}>
                {privacyPolicyLabel}
              </a>
              .
            </p>

            <div className="flex" data-reveal style={{ transitionDelay: `${(formFields.length + 4) * 70}ms` }}>
              <Button arrow={false} variant="secondary">
                {submitLabel}
              </Button>
            </div>
          </form>
      </section>
    </div>
  );
}
