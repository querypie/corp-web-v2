"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import type { ContactField, ContactPageCopy } from "@/copy/contact";
import type { ManagedContentSection } from "@/features/content/data";
import {
  ContactCheckboxRow,
  ContactPrivacyNotice,
  ContactSelectField,
  ContactTextField,
  FieldLabel,
  splitContactFields,
} from "@/components/forms/ContactFormParts";
import { readUtmCookie } from "@/features/utm/utm";

type ContentLeadFormMode = "download" | "unlock";

type ContentLeadFormProps = {
  attachmentFileName?: string;
  attachmentUrl?: string;
  buttonLabel?: string;
  contactCopy: ContactPageCopy;
  contentId?: string;
  locale: "en" | "ko" | "ja";
  mode: ContentLeadFormMode;
  onSuccess?: () => void;
  pdfPreviewUrl?: string;
  returnUrl?: string;
  section?: Exclude<ManagedContentSection, "news">;
  title: string;
  unlockCookieName?: string;
};

type FormState = Record<string, string>;

type LeadFormErrorCode =
  | "content_unavailable"
  | "download_unavailable"
  | "invalid_email"
  | "invalid_mode"
  | "invalid_request"
  | "missing_required_fields"
  | "network"
  | "server_error";

type LeadFormResponse = {
  downloadUrl?: string;
  error?: string;
  errorCode?: LeadFormErrorCode;
  previewUrl?: string;
  unlocked?: boolean;
};

class LeadFormSubmitError extends Error {}

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

function getLocalizedCopy(locale: "en" | "ko" | "ja", mode: ContentLeadFormMode, buttonLabel?: string) {
  const defaultSubmitLabel = {
    download: {
      en: "Download Now",
      ko: "다운로드",
      ja: "ダウンロード",
    },
    unlock: {
      en: "Unlock Content",
      ko: "콘텐츠 열기",
      ja: "コンテンツを開く",
    },
  }[mode][locale];

  return {
    processing: {
      en: mode === "download" ? "Preparing your file..." : "Unlocking content...",
      ko: mode === "download" ? "파일을 준비하고 있습니다..." : "콘텐츠를 열고 있습니다...",
      ja: mode === "download" ? "ファイルを準備しています..." : "コンテンツを開放しています...",
    }[locale],
    submitError: {
      en: mode === "download"
        ? "We couldn't prepare the PDF. Please try again."
        : "We couldn't unlock this content. Please try again.",
      ko: mode === "download"
        ? "PDF를 준비하지 못했습니다. 다시 시도해 주세요."
        : "콘텐츠를 열지 못했습니다. 다시 시도해 주세요.",
      ja: mode === "download"
        ? "PDF を準備できませんでした。もう一度お試しください。"
        : "コンテンツを開放できませんでした。もう一度お試しください。",
    }[locale],
    submitLabel: buttonLabel ?? defaultSubmitLabel,
  };
}

function getLeadFormErrorMessage(
  locale: "en" | "ko" | "ja",
  mode: ContentLeadFormMode,
  code: LeadFormErrorCode | undefined,
  fallback: string,
) {
  const messages: Record<"en" | "ko" | "ja", Record<LeadFormErrorCode, string>> = {
    en: {
      content_unavailable: "This content is no longer available. Please go back to the list and choose another item.",
      download_unavailable: "The PDF file is not ready for download yet. Please try again later.",
      invalid_email: "Please check your email address. We couldn't verify that this email domain can receive messages.",
      invalid_mode: "We couldn't process this request. Please refresh the page and try again.",
      invalid_request: "Some information could not be submitted. Please refresh the page and try again.",
      missing_required_fields: "Please complete all required fields and select at least one product or service.",
      network: "We couldn't connect to the server. Please check your connection and try again.",
      server_error: mode === "download"
        ? "We couldn't prepare the PDF due to a temporary server issue. Please try again later."
        : "We couldn't unlock this content due to a temporary server issue. Please try again later.",
    },
    ko: {
      content_unavailable: "현재 이 콘텐츠를 이용할 수 없습니다. 목록으로 돌아가 다른 콘텐츠를 선택해 주세요.",
      download_unavailable: "PDF 파일이 아직 다운로드 가능한 상태가 아닙니다. 잠시 후 다시 시도해 주세요.",
      invalid_email: "이메일 주소를 확인해 주세요. 입력한 이메일 도메인으로 메일을 받을 수 있는지 확인하지 못했습니다.",
      invalid_mode: "요청을 처리하지 못했습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.",
      invalid_request: "입력한 정보를 제출하지 못했습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.",
      missing_required_fields: "필수 항목을 모두 입력하고 관심 제품 또는 서비스를 1개 이상 선택해 주세요.",
      network: "서버에 연결하지 못했습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요.",
      server_error: mode === "download"
        ? "일시적인 서버 문제로 PDF를 준비하지 못했습니다. 잠시 후 다시 시도해 주세요."
        : "일시적인 서버 문제로 콘텐츠를 열지 못했습니다. 잠시 후 다시 시도해 주세요.",
    },
    ja: {
      content_unavailable: "このコンテンツは現在利用できません。一覧に戻って別のコンテンツを選択してください。",
      download_unavailable: "PDFファイルはまだダウンロードできる状態ではありません。しばらくしてからもう一度お試しください。",
      invalid_email: "メールアドレスをご確認ください。入力されたメールドメインで受信できるか確認できませんでした。",
      invalid_mode: "リクエストを処理できませんでした。ページを再読み込みしてもう一度お試しください。",
      invalid_request: "入力内容を送信できませんでした。ページを再読み込みしてもう一度お試しください。",
      missing_required_fields: "必須項目をすべて入力し、興味のある製品・サービスを1つ以上選択してください。",
      network: "サーバーに接続できませんでした。ネットワーク状況を確認してもう一度お試しください。",
      server_error: mode === "download"
        ? "一時的なサーバーの問題によりPDFを準備できませんでした。しばらくしてからもう一度お試しください。"
        : "一時的なサーバーの問題によりコンテンツを開放できませんでした。しばらくしてからもう一度お試しください。",
    },
  };

  return code ? messages[locale][code] ?? fallback : fallback;
}

export default function ContentLeadForm({
  attachmentFileName,
  attachmentUrl,
  buttonLabel,
  contactCopy,
  contentId,
  locale,
  mode,
  onSuccess,
  pdfPreviewUrl,
  returnUrl,
  section,
  title,
  unlockCookieName,
}: ContentLeadFormProps) {
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
      const utmAttribution = readUtmCookie();
      const response = await fetch("/api/downloads/content", {
        body: JSON.stringify({
          attachmentFileName,
          attachmentUrl,
          contentId,
          form: {
            ...form,
            products: selectedProducts,
          },
          locale,
          mode,
          pdfPreviewUrl,
          referrerURL: window.location.href,
          returnUrl,
          section,
          title,
          utmAttribution,
          unlockCookieName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json()) as LeadFormResponse;

      if (!response.ok) {
        throw new LeadFormSubmitError(getLeadFormErrorMessage(locale, mode, payload.errorCode, localized.submitError));
      }

      if (mode === "download") {
        if (!payload.downloadUrl || !payload.previewUrl || !attachmentFileName || !returnUrl) {
          throw new LeadFormSubmitError(
            getLeadFormErrorMessage(locale, mode, "download_unavailable", localized.submitError),
          );
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
        throw new LeadFormSubmitError(getLeadFormErrorMessage(locale, mode, payload.errorCode, localized.submitError));
      }

      onSuccess?.();
    } catch (error) {
      if (previewWindow) {
        previewWindow.close();
      }

      setErrorMessage(
        error instanceof LeadFormSubmitError
          ? error.message
          : getLeadFormErrorMessage(locale, mode, "network", localized.submitError),
      );
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
                onChange={(checked) => updateValue(key, checked ? "true" : "")}
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

      <div>
        <ContactCheckboxRow
          checked={form.marketingConsent === "true"}
          label={contactCopy.consentLabel}
          name="marketingConsent"
          onChange={(checked) => updateValue("marketingConsent", checked ? "true" : "")}
        />
      </div>

      <ContactPrivacyNotice
        privacyPolicyHref={contactCopy.privacyPolicyHref}
        privacyPolicyLabel={contactCopy.privacyPolicyLabel}
        privacyTermsHref={contactCopy.privacyTermsHref}
        privacyTermsLabel={contactCopy.privacyTermsLabel}
        privacyText={contactCopy.privacyText}
      />

      {errorMessage ? <p className="m-0 type-body-sm text-[var(--color-destructive)]">{errorMessage}</p> : null}

      <div className={cx("flex", !canSubmit && "opacity-80")}>
        <Button
          arrow={false}
          className="w-full justify-center"
          disabled={!canSubmit}
          size="large"
          style="full"
          type="submit"
          variant="secondary"
        >
          {isSubmitting ? localized.processing : localized.submitLabel}
        </Button>
      </div>
    </form>
  );
}
