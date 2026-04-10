"use client";

import { useMemo, useState } from "react";
import Button from "../../common/Button";
import type { ContactField, ContactPageCopy } from "@/features/contact/copy";
import { WHITE_PAPER_UNLOCK_BUTTON_LABEL } from "@/features/content/data";
import {
  ContactCheckboxRow,
  ContactPrivacyNotice,
  ContactSelectField,
  ContactTextField,
  FieldLabel,
  splitContactFields,
} from "../contact/ContactFormParts";

type WhitePaperLeadFormMode = "download" | "unlock";

type WhitePaperLeadFormProps = {
  attachmentFileName?: string;
  attachmentUrl?: string;
  buttonLabel?: string;
  contactCopy: ContactPageCopy;
  locale: "en" | "ko" | "ja";
  mode: WhitePaperLeadFormMode;
  onSuccess?: () => void;
  pdfPreviewUrl?: string;
  returnUrl?: string;
  title: string;
};

type FormState = Record<string, string>;

type LeadFormResponse = {
  downloadUrl?: string;
  previewUrl?: string;
  unlocked?: boolean;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function fieldValue(form: FormState, field: ContactField) {
  return form[field.name] ?? "";
}

function makeInitialForm(copy: ContactPageCopy) {
  const base: FormState = {
    marketingConsent: "",
  };

  for (const field of copy.formFields) {
    base[field.name] = "";
  }

  for (const option of copy.productOptions) {
    base[`product:${option}`] = "";
  }

  return base;
}

function isRequiredSatisfied(copy: ContactPageCopy, form: FormState) {
  const requiredFields = copy.formFields.filter((field) => field.required);
  const hasRequiredFields = requiredFields.every((field) => fieldValue(form, field).trim());
  const hasProduct = copy.productOptions.some((option) => form[`product:${option}`] === "true");

  return hasRequiredFields && hasProduct;
}

function getLocalizedCopy(locale: "en" | "ko" | "ja", mode: WhitePaperLeadFormMode, buttonLabel?: string) {
  return {
    processing: {
      en: mode === "download" ? "Preparing your file..." : "Unlocking white paper...",
      ko: mode === "download" ? "파일을 준비하고 있습니다..." : "화이트페이퍼를 열고 있습니다...",
      ja: mode === "download" ? "ファイルを準備しています..." : "ホワイトペーパーを開放しています...",
    }[locale],
    submitError: {
      en: mode === "download"
        ? "We couldn't prepare the PDF. Please try again."
        : "We couldn't unlock this white paper. Please try again.",
      ko: mode === "download"
        ? "PDF를 준비하지 못했습니다. 다시 시도해 주세요."
        : "화이트페이퍼를 열지 못했습니다. 다시 시도해 주세요.",
      ja: mode === "download"
        ? "PDF を準備できませんでした。もう一度お試しください。"
        : "ホワイトペーパーを開放できませんでした。もう一度お試しください。",
    }[locale],
    submitLabel: buttonLabel ?? (mode === "download" ? "Download Now" : WHITE_PAPER_UNLOCK_BUTTON_LABEL),
  };
}

export default function WhitePaperLeadForm({
  attachmentFileName,
  attachmentUrl,
  buttonLabel,
  contactCopy,
  locale,
  mode,
  onSuccess,
  pdfPreviewUrl,
  returnUrl,
  title,
}: WhitePaperLeadFormProps) {
  const [form, setForm] = useState<FormState>(() => makeInitialForm(contactCopy));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const localized = getLocalizedCopy(locale, mode, buttonLabel);
  const canSubmit = useMemo(() => isRequiredSatisfied(contactCopy, form) && !isSubmitting, [contactCopy, form, isSubmitting]);
  const { afterProductFields, beforeProductFields } = useMemo(
    () => splitContactFields(contactCopy.formFields),
    [contactCopy.formFields],
  );

  function updateValue(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setErrorMessage("");
    const previewWindow = mode === "download" ? window.open("", "_blank") : null;

    try {
      const selectedProducts = contactCopy.productOptions.filter((option) => form[`product:${option}`] === "true");
      const response = await fetch("/api/downloads/white-paper", {
        body: JSON.stringify({
          attachmentFileName,
          attachmentUrl,
          form: {
            ...form,
            products: selectedProducts,
          },
          locale,
          mode,
          pdfPreviewUrl,
          returnUrl,
          title,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json()) as LeadFormResponse;

      if (!response.ok) {
        throw new Error(localized.submitError);
      }

      if (mode === "download") {
        if (!payload.downloadUrl || !payload.previewUrl || !attachmentFileName || !returnUrl) {
          throw new Error(localized.submitError);
        }

        const link = document.createElement("a");
        link.href = payload.downloadUrl;
        link.download = attachmentFileName;
        document.body.appendChild(link);
        link.click();
        link.remove();

        if (previewWindow) {
          previewWindow.location.href = payload.previewUrl;
        }

        window.location.replace(returnUrl);
        return;
      }

      if (!payload.unlocked) {
        throw new Error(localized.submitError);
      }

      onSuccess?.();
    } catch (error) {
      if (previewWindow) {
        previewWindow.close();
      }

      setErrorMessage(error instanceof Error ? error.message : localized.submitError);
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex min-w-0 flex-1 flex-col gap-5" onSubmit={handleSubmit}>
      {beforeProductFields.map((field) => (
        field.type === "select" ? (
          <ContactSelectField
            field={field}
            key={field.name}
            name={field.name}
            onChange={(value) => updateValue(field.name, value)}
            value={fieldValue(form, field)}
          />
        ) : (
          <ContactTextField
            field={field}
            key={field.name}
            name={field.name}
            onChange={(value) => updateValue(field.name, value)}
            value={fieldValue(form, field)}
          />
        )
      ))}

      <div className="flex w-full flex-col gap-[10px]">
        <FieldLabel label={contactCopy.productFieldLabel} required />
        <div className="grid gap-[10px]">
          {contactCopy.productOptions.map((option) => {
            const key = `product:${option}`;
            return (
              <ContactCheckboxRow
                checked={form[key] === "true"}
                key={option}
                label={option}
                name={key}
                onChange={(checked) => updateValue(key, String(checked))}
              />
            );
          })}
        </div>
      </div>

      {afterProductFields.map((field) => (
        field.type === "select" ? (
          <ContactSelectField
            field={field}
            key={field.name}
            name={field.name}
            onChange={(value) => updateValue(field.name, value)}
            value={fieldValue(form, field)}
          />
        ) : (
          <ContactTextField
            field={field}
            key={field.name}
            name={field.name}
            onChange={(value) => updateValue(field.name, value)}
            value={fieldValue(form, field)}
          />
        )
      ))}

      <ContactCheckboxRow
        checked={form.marketingConsent === "true"}
        label={contactCopy.consentLabel}
        name="marketingConsent"
        onChange={(checked) => updateValue("marketingConsent", String(checked))}
      />

      <ContactPrivacyNotice
        privacyPolicyHref={contactCopy.privacyPolicyHref}
        privacyPolicyLabel={contactCopy.privacyPolicyLabel}
        privacyTermsHref={contactCopy.privacyTermsHref}
        privacyTermsLabel={contactCopy.privacyTermsLabel}
        privacyText={contactCopy.privacyText}
      />

      {errorMessage ? <p className="m-0 type-body-sm text-destructive">{errorMessage}</p> : null}

      <div className="flex">
        <Button arrow={false} className={cx("w-full justify-center", !canSubmit && "pointer-events-none opacity-40")} disabled={!canSubmit} size="large" style="full" type="submit" variant="secondary">
          {isSubmitting ? localized.processing : localized.submitLabel}
        </Button>
      </div>
    </form>
  );
}
