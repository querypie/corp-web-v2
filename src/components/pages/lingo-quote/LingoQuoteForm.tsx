"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import {
  ContactCheckboxRow,
  ContactPrivacyNotice,
  FieldLabel,
} from "@/components/forms/ContactFormParts";
import type { LingoQuotePageCopy } from "@/copy/lingoQuote";
import { LINGO_QUOTE_SKUS, type LingoQuotePlan } from "@/features/lingo-quote/catalog";
import type { Locale } from "@/constants/i18n";

type FormState = "idle" | "submitting" | "success";

const errorMessages: Record<Locale, Record<string, string>> = {
  en: {
    INVALID_REQUEST: "Please check the information and try again.",
    INVALID_ORIGIN: "This request cannot be completed from this page.",
    MISSING_REQUIRED_FIELDS: "Enter the ordering company, contact person and department, select a credit plan, and agree to the privacy notice.",
    RATE_LIMITED: "Too many requests. Please wait a moment and try again.",
  },
  ko: {
    INVALID_REQUEST: "입력한 정보를 확인한 뒤 다시 시도해주세요.",
    INVALID_ORIGIN: "현재 페이지에서 요청을 처리할 수 없습니다.",
    MISSING_REQUIRED_FIELDS: "발주 회사명·담당자명·부서와 크레딧 상품을 입력하고 개인정보 수집 및 이용에 동의해주세요.",
    RATE_LIMITED: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
  },
  ja: {
    INVALID_REQUEST: "入力内容を確認してもう一度お試しください。",
    INVALID_ORIGIN: "このページからリクエストを処理できません。",
    MISSING_REQUIRED_FIELDS: "発注会社名・担当者名・部署とクレジット商品を入力し、個人情報の収集・利用に同意してください。",
    RATE_LIMITED: "リクエストが多すぎます。しばらくしてからもう一度お試しください。",
  },
};

function getDownloadName(response: Response) {
  const disposition = response.headers.get("content-disposition") ?? "";
  const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (encoded) {
    try {
      return decodeURIComponent(encoded);
    } catch {
      return "QP_Quotation.xlsx";
    }
  }
  return disposition.match(/filename="([^"]+)"/i)?.[1] ?? "QP_Quotation.xlsx";
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  return url;
}

export default function LingoQuoteForm({
  copy,
  locale,
  initialPlan = "application",
}: {
  copy: LingoQuotePageCopy;
  locale: Locale;
  initialPlan?: LingoQuotePlan;
}) {
  const [plan, setPlan] = useState<LingoQuotePlan>(initialPlan);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [department, setDepartment] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadName, setDownloadName] = useState("QP_Quotation.xlsx");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !department.trim() || !consent || status === "submitting") {
      setError(copy.errorRequired);
      return;
    }

    setStatus("submitting");
    setError("");
    try {
      const response = await fetch("/api/lingo-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, companyName, contactName, department, locale, privacyConsent: consent }),
      });
      if (!response.ok) {
        let code = "";
        try {
          code = String((await response.json()).code ?? "");
        } catch {
          // Keep the localized generic error.
        }
        setStatus("idle");
        setError(errorMessages[locale][code] ?? copy.errorGeneral);
        return;
      }
      const blob = await response.blob();
      const fileName = getDownloadName(response);
      const url = downloadBlob(blob, fileName);
      setDownloadUrl(url);
      setDownloadName(fileName);
      setStatus("success");
    } catch {
      setStatus("idle");
      setError(copy.errorGeneral);
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col gap-5">
        <h2 className="type-h3 text-fg">{copy.successTitle}</h2>
        <p className="m-0 type-body-md text-mute">{copy.successDescription}</p>
        <a
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-bg-inverse px-6 type-body-md text-fg-inverse"
          download={downloadName}
          href={downloadUrl}
        >
          {copy.downloadLabel}
        </a>
      </div>
    );
  }

  const planOptions = Object.entries(LINGO_QUOTE_SKUS).map(([key, value]) => ({
    label: `${value.description} · ¥${value.retailPrice.toLocaleString("ja-JP")}`,
    value: key,
  }));

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex w-full flex-col gap-[10px]">
        <FieldLabel label={copy.planLabel} required />
        <Select
          aria-label={copy.planLabel}
          name="plan"
          onChange={(event) => setPlan(event.target.value as LingoQuotePlan)}
          options={planOptions}
          value={plan}
        />
      </div>
      <div className="flex w-full flex-col gap-[10px]">
        <FieldLabel label={copy.companyLabel} required />
        <Input
          aria-label={copy.companyLabel}
          className="w-full"
          onChange={(event) => setCompanyName(event.target.value)}
          placeholder={copy.companyPlaceholder}
          required
          type="text"
          value={companyName}
        />
      </div>
      <div className="flex w-full flex-col gap-[10px]">
        <FieldLabel label={copy.contactLabel} required />
        <Input
          aria-label={copy.contactLabel}
          className="w-full"
          onChange={(event) => setContactName(event.target.value)}
          placeholder={copy.contactPlaceholder}
          required
          type="text"
          value={contactName}
        />
      </div>
      <div className="flex w-full flex-col gap-[10px]">
        <FieldLabel label={copy.departmentLabel} required />
        <Input
          aria-label={copy.departmentLabel}
          className="w-full"
          onChange={(event) => setDepartment(event.target.value)}
          placeholder={copy.departmentPlaceholder}
          required
          type="text"
          value={department}
        />
      </div>
      <ContactCheckboxRow
        checked={consent}
        label={copy.consentLabel}
        name="quotePrivacyConsent"
        onChange={setConsent}
      />
      <ContactPrivacyNotice
        conjunction={locale === "ko" ? "및" : locale === "ja" ? "と" : "&"}
        privacyPolicyHref={copy.privacyPolicyHref}
        privacyPolicyLabel={copy.privacyPolicyLabel}
        privacyTermsHref={copy.privacyTermsHref}
        privacyTermsLabel={copy.privacyTermsLabel}
        privacyText={copy.privacyText}
      />
      {error ? <p className="m-0 type-body-md text-destructive">{error}</p> : null}
      <div className="flex">
        <Button
          arrow={false}
          disabled={status === "submitting"}
          style="full"
          type="submit"
          variant="secondary"
        >
          {status === "submitting" ? copy.submittingLabel : copy.submitLabel}
        </Button>
      </div>
    </form>
  );
}
