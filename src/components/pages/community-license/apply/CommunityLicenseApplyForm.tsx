"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  ContactCheckboxRow,
  ContactPrivacyNotice,
  FieldLabel,
} from "@/components/forms/ContactFormParts";
import type { CommunityLicenseApplyPageCopy } from "@/copy/communityLicense";

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

type FormValues = Record<string, string>;

type CommunityLicenseApplyFormProps = Pick<
  CommunityLicenseApplyPageCopy,
  | "errorGeneral"
  | "fields"
  | "homeHref"
  | "marketingLabel"
  | "privacyPolicyHref"
  | "privacyPolicyLabel"
  | "privacyTermsHref"
  | "privacyTermsLabel"
  | "privacyText"
  | "submitLabel"
  | "successButton"
  | "successDescription"
  | "successTitle"
>;

export default function CommunityLicenseApplyForm(copy: CommunityLicenseApplyFormProps) {
  const router = useRouter();
  const [marketing, setMarketing] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>(() =>
    Object.fromEntries(copy.fields.map((field) => [field.name, ""])),
  );
  const [formState, setFormState] = useState<FormState>({ status: "idle" });

  const canSubmit = useMemo(() => {
    const requiredSatisfied = copy.fields
      .filter((field) => field.required)
      .every((field) => formValues[field.name]?.trim());

    return requiredSatisfied && formState.status !== "submitting";
  }, [copy.fields, formState.status, formValues]);

  function updateValue(name: string, value: string) {
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setFormState({ status: "submitting" });

    const formData = new FormData(event.currentTarget);
    const body: Record<string, string | boolean> = {
      HasOptedInMarketing__c: marketing,
    };

    for (const [key, value] of formData.entries()) {
      body[key] = value as string;
    }

    try {
      const response = await fetch("/api/community-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = (await response.json()) as {
        success: boolean;
        errorMessage?: string;
      };

      if (result.success) {
        setFormState({ status: "success" });
        return;
      }

      setFormState({
        status: "error",
        message: result.errorMessage ?? copy.errorGeneral,
      });
    } catch {
      setFormState({ status: "error", message: copy.errorGeneral });
    }
  }

  if (formState.status === "success") {
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
            onClick={() => router.push(copy.homeHref)}
          >
            {copy.successButton}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form className="flex min-w-0 flex-1 basis-1/2 flex-col gap-5" onSubmit={handleSubmit}>
      {copy.fields.map((field) => (
        <div key={field.name} className="flex w-full flex-col gap-[10px]">
          <FieldLabel label={field.label} required={field.required} />
          <Input
            aria-label={field.label}
            className="w-full"
            name={field.name}
            onChange={(event) => updateValue(field.name, event.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            type={field.type}
            value={formValues[field.name]}
          />
        </div>
      ))}

      <div>
        <ContactCheckboxRow
          checked={marketing}
          label={copy.marketingLabel}
          name="HasOptedInMarketing__c"
          onChange={setMarketing}
        />
      </div>

      <ContactPrivacyNotice
        privacyPolicyHref={copy.privacyPolicyHref}
        privacyPolicyLabel={copy.privacyPolicyLabel}
        privacyTermsHref={copy.privacyTermsHref}
        privacyTermsLabel={copy.privacyTermsLabel}
        privacyText={copy.privacyText}
      />

      {formState.status === "error" ? (
        <p className="m-0 type-body-sm text-[var(--color-destructive)]">{formState.message}</p>
      ) : null}

      <div className="flex">
        <Button
          arrow={false}
          disabled={!canSubmit}
          style="full"
          type="submit"
          variant="secondary"
        >
          {formState.status === "submitting" ? "..." : copy.submitLabel}
        </Button>
      </div>
    </form>
  );
}
