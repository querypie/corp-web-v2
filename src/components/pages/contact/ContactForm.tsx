"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import type { ContactField, ContactPageCopy } from "@/copy/contact";
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
} from "@/components/forms/ContactFormParts";

type FormState = Record<string, string>;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

type ContactSubmitErrorCode =
  | "invalid_email"
  | "invalid_request"
  | "missing_required_fields"
  | "server_error";

type ContactFormErrorCode = ContactSubmitErrorCode | "network";

type ContactSubmitResponse = {
  success: boolean;
  errorCode?: ContactSubmitErrorCode;
  errorMessage?: string;
};

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

function getContactErrorMessage(
  locale: Locale,
  code: ContactFormErrorCode | undefined,
  fallback: string,
) {
  const messages: Record<Locale, Record<ContactFormErrorCode, string>> = {
    en: {
      invalid_email: "Please check your email address. We couldn't verify that this email domain can receive messages.",
      invalid_request: "Some information could not be submitted. Please refresh the page and try again.",
      missing_required_fields: "Please complete all required fields and select at least one product or service.",
      network: "We couldn't connect to the server. Please check your connection and try again.",
      server_error: "We couldn't submit your inquiry due to a temporary server issue. Please try again later.",
    },
    ko: {
      invalid_email: "이메일 주소를 확인해 주세요. 입력한 이메일 도메인으로 메일을 받을 수 있는지 확인하지 못했습니다.",
      invalid_request: "입력한 정보를 제출하지 못했습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.",
      missing_required_fields: "필수 항목을 모두 입력하고 관심 제품 또는 서비스를 1개 이상 선택해 주세요.",
      network: "서버에 연결하지 못했습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요.",
      server_error: "일시적인 서버 문제로 문의를 제출하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    },
    ja: {
      invalid_email: "メールアドレスをご確認ください。入力されたメールドメインで受信できるか確認できませんでした。",
      invalid_request: "入力内容を送信できませんでした。ページを再読み込みしてもう一度お試しください。",
      missing_required_fields: "必須項目をすべて入力し、興味のある製品・サービスを1つ以上選択してください。",
      network: "サーバーに接続できませんでした。ネットワーク状況を確認してもう一度お試しください。",
      server_error: "一時的なサーバーの問題によりお問い合わせを送信できませんでした。しばらくしてからもう一度お試しください。",
    },
  };

  return code ? messages[locale][code] ?? fallback : fallback;
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
          referrerURL: window.location.href,
          utmAttribution,
        }),
      });

      const result = (await response.json()) as ContactSubmitResponse;

      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(getContactErrorMessage(locale, result.errorCode, copy.errorGeneral));
      }
    } catch {
      setStatus("error");
      setErrorMessage(getContactErrorMessage(locale, "network", copy.errorGeneral));
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col gap-5 md:min-w-0 md:flex-1 md:basis-1/2">
        <h2 className="type-h3 text-fg">{copy.successTitle}</h2>
        <p className="m-0 whitespace-pre-line type-body-md text-mute">
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
