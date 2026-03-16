import Button from "../../common/Button";

type ContactLink = {
  href: string;
  label: string;
  value: string;
};

type ContactField = {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
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
}: {
  field: ContactField;
}) {
  return (
    /* 단일 줄 입력 필드 */
    <div className="flex w-full flex-col gap-[10px]">
      <FieldLabel label={field.label} required={field.required} />
      <input
        aria-label={field.label}
        className="ui-field h-10 w-full rounded-button bg-bg-content px-3 type-body-md text-fg outline-none placeholder:text-mute-fg"
        name={field.name}
        type="text"
      />
    </div>
  );
}

function TextAreaField({
  field,
}: {
  field: ContactField;
}) {
  return (
    /* 여러 줄 추가 정보 입력 */
    <div className="flex w-full flex-col gap-[10px]">
      <FieldLabel label={field.label} required={field.required} />
      <textarea
        aria-label={field.label}
        className="ui-field min-h-[120px] w-full resize-none rounded-button bg-bg-content px-3 py-2.5 type-body-md text-fg outline-none placeholder:text-mute-fg"
        name={field.name}
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
    <section className="mx-auto flex w-full max-w-[1000px] flex-col gap-12 px-5 pb-10 md:flex-row md:items-start md:gap-[60px] md:px-10">
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
            {formFields.map((field) => (
              <TextField key={field.name} field={field} />
            ))}

            <div className="flex w-full flex-col gap-[10px]">
              <FieldLabel label={productFieldLabel} required />
              <div className="flex flex-col gap-[10px]">
                {productOptions.map((option) => (
                  <CheckboxRow key={option} label={option} name={option} />
                ))}
              </div>
            </div>

            <TextAreaField field={messageField} />

            <CheckboxRow label={consentLabel} name="updates" />

            <p className="m-0 type-body-md leading-5 text-fg">
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

            <div className="flex">
              <Button arrow={false} variant="secondary">
                {submitLabel}
              </Button>
            </div>
          </form>
        </section>
  );
}
