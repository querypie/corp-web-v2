import Input from "../../common/Input";
import Select from "../../common/Select";
import Textarea from "../../common/Textarea";
import type { ContactField } from "@/features/contact/copy";

function RequiredMark() {
  return <span className="text-destructive">*</span>;
}

export function FieldLabel({
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

export function ContactTextField({
  field,
  name,
  onChange,
  value,
}: {
  field: ContactField;
  name?: string;
  onChange?: (value: string) => void;
  value?: string;
}) {
  return (
    <div className="flex w-full flex-col gap-[10px]">
      <FieldLabel label={field.label} required={field.required} />
      <Input
        aria-label={field.label}
        className="w-full"
        name={name ?? field.name}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        placeholder={field.placeholder}
        type="text"
        value={value}
      />
    </div>
  );
}

export function ContactSelectField({
  field,
  name,
  onChange,
  value,
}: {
  field: ContactField;
  name?: string;
  onChange?: (value: string) => void;
  value?: string;
}) {
  return (
    <div className="flex w-full flex-col gap-[10px]">
      <FieldLabel label={field.label} required={field.required} />
      <Select
        aria-label={field.label}
        name={name ?? field.name}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        options={(field.options ?? []).map((option) => ({ label: option, value: option }))}
        placeholder={field.placeholder ?? field.label}
        value={value}
      />
    </div>
  );
}

export function ContactTextAreaField({
  field,
  name,
  onChange,
  value,
}: {
  field: ContactField;
  name?: string;
  onChange?: (value: string) => void;
  value?: string;
}) {
  return (
    <div className="flex w-full flex-col gap-[10px]">
      <FieldLabel label={field.label} required={field.required} />
      <Textarea
        aria-label={field.label}
        className="min-h-[120px] resize-none bg-bg-content"
        name={name ?? field.name}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        placeholder={field.placeholder}
        value={value}
      />
    </div>
  );
}

export function ContactCheckboxRow({
  checked,
  label,
  name,
  onChange,
}: {
  checked?: boolean;
  label: string;
  name: string;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label className="flex w-full items-start gap-[10px]">
      <input
        checked={checked}
        className="mt-[1px] size-[18px] shrink-0 rounded-[4px] border-0 accent-fg"
        name={name}
        onChange={onChange ? (event) => onChange(event.target.checked) : undefined}
        type="checkbox"
      />
      <span className="type-body-md text-fg">{label}</span>
    </label>
  );
}

export function ContactPrivacyNotice({
  privacyPolicyHref,
  privacyPolicyLabel,
  privacyTermsHref,
  privacyTermsLabel,
  privacyText,
}: {
  privacyPolicyHref: string;
  privacyPolicyLabel: string;
  privacyTermsHref: string;
  privacyTermsLabel: string;
  privacyText: string;
}) {
  return (
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
  );
}

export function splitContactFields(fields: ContactField[]) {
  const plannedIndex = fields.findIndex((field) => field.name === "plannedImplementationDate");

  if (plannedIndex < 0) {
    return {
      afterProductFields: [] as ContactField[],
      beforeProductFields: fields,
    };
  }

  return {
    afterProductFields: fields.slice(plannedIndex),
    beforeProductFields: fields.slice(0, plannedIndex),
  };
}
