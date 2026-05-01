"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../common/Button";
import type { ContactField, ContactPageCopy } from "@/features/contact/copy";
import type { Locale } from "@/constants/i18n";
import { getLocalePath } from "@/constants/i18n";
import { readUtmCookie } from "@/features/utm/utm";
import {
  ContactCheckboxRow,
  ContactPrivacyNotice,
  ContactSelectField,
  ContactTextAreaField,
  ContactTextField,
  FieldLabel,
  splitContactFields,
} from "./ContactFormParts";

type FormState = Record<string, string>;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

function makeInitialForm(copy: ContactPageCopy): FormState {
  const base: FormState = { marketingConsent: "", message: "" };
  for (const field of copy.formFields) {
    base[field.name] = "";
  }
  for (const option of copy.productOptions) {
    base[`product:${option}`] = "";
  }
  return base;
}

function isRequiredSatisfied(copy: ContactPageCopy, form: FormState): boolean {
  const requiredFields = copy.formFields.filter((f) => f.required);
  const hasRequired = requiredFields.every((f) => form[f.name]?.trim());
  const hasProduct = copy.productOptions.some((o) => form[`product:${o}`] === "true");
  const hasMessage = copy.messageField.required ? form.message?.trim() : true;
  return Boolean(hasRequired && hasProduct && hasMessage);
}

type ContactFormProps = ContactPageCopy & { locale: Locale };

export default function ContactForm(props: ContactFormProps) {
  const { locale, ...copy } = props;
  const router = useRouter();

  const [form, setForm] = useState<FormState>(() => makeInitialForm(copy));
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit = useMemo(
    () => isRequiredSatisfied(copy, form) && status !== "submitting",
    [copy, form, status],
  );

  const { beforeProductFields, afterProductFields } = useMemo(
    () => splitContactFields(copy.formFields),
    [copy.formFields],
  );

  function updateValue(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setStatus("submitting");
    setErrorMessage("");

    const selectedProducts = copy.productOptions.filter((o) => form[`product:${o}`] === "true");
    const utmAttribution = readUtmCookie();

    try {
      const response = await fetch("/api/contact-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          company: form.company,
          departmentTitle: form.departmentTitle,
          phoneNumber: form.phoneNumber || undefined,
          inquiryType: form.inquiryType,
          plannedImplementationDate: form.plannedImplementationDate,
          products: selectedProducts,
          message: form.message,
          marketingConsent: form.marketingConsent === "true",
          utmAttribution,
        }),
      });

      const result = (await response.json()) as { success: boolean; errorMessage?: string };

      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(result.errorMessage ?? copy.errorGeneral);
      }
    } catch {
      setStatus("error");
      setErrorMessage(copy.errorGeneral);
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col gap-5">
        <h2 className="type-h3 text-fg">{copy.successTitle}</h2>
        <p className="m-0 whitespace-pre-line type-body-md text-mute-fg">
          {copy.successDescription}
        </p>
        <div className="flex">
          <Button
            arrow={false}
            style="full"
            type="button"
            variant="secondary"
            onClick={() => router.push(getLocalePath(locale))}
          >
            {copy.successButton}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form className="flex min-w-0 flex-1 basis-1/2 flex-col gap-5" onSubmit={handleSubmit}>
      {beforeProductFields.map((field: ContactField) =>
        field.type === "select" ? (
          <ContactSelectField
            field={field}
            key={field.name}
            onChange={(value) => updateValue(field.name, value)}
            value={form[field.name]}
          />
        ) : (
          <ContactTextField
            field={field}
            key={field.name}
            onChange={(value) => updateValue(field.name, value)}
            value={form[field.name]}
          />
        ),
      )}

      <div className="flex w-full flex-col gap-[10px]">
        <FieldLabel label={copy.productFieldLabel} required />
        <div className="flex flex-col gap-[10px]">
          {copy.productOptions.map((option) => {
            const key = `product:${option}`;
            return (
              <ContactCheckboxRow
                checked={form[key] === "true"}
                key={option}
                label={option}
                name={key}
                onChange={(checked) => updateValue(key, checked ? "true" : "")}
              />
            );
          })}
        </div>
      </div>

      {afterProductFields.map((field: ContactField) =>
        field.type === "select" ? (
          <ContactSelectField
            field={field}
            key={field.name}
            onChange={(value) => updateValue(field.name, value)}
            value={form[field.name]}
          />
        ) : (
          <ContactTextField
            field={field}
            key={field.name}
            onChange={(value) => updateValue(field.name, value)}
            value={form[field.name]}
          />
        ),
      )}

      <ContactTextAreaField
        field={copy.messageField}
        onChange={(value) => updateValue("message", value)}
        value={form.message}
      />

      <div>
        <ContactCheckboxRow
          checked={form.marketingConsent === "true"}
          label={copy.consentLabel}
          name="marketingConsent"
          onChange={(checked) => updateValue("marketingConsent", checked ? "true" : "")}
        />
      </div>

      <ContactPrivacyNotice
        privacyPolicyHref={copy.privacyPolicyHref}
        privacyPolicyLabel={copy.privacyPolicyLabel}
        privacyTermsHref={copy.privacyTermsHref}
        privacyTermsLabel={copy.privacyTermsLabel}
        privacyText={copy.privacyText}
      />

      {errorMessage ? (
        <p className="m-0 type-body-sm text-[var(--color-destructive)]">{errorMessage}</p>
      ) : null}

      <div className="flex">
        <Button
          arrow={false}
          disabled={!canSubmit}
          style="full"
          type="submit"
          variant="secondary"
        >
          {status === "submitting" ? "..." : copy.submitLabel}
        </Button>
      </div>
    </form>
  );
}
