"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import {
  ContactCheckboxRow,
  FieldLabel,
} from "@/components/pages/contact/ContactFormParts";
import type { CommunityLicensePageCopy } from "@/features/community-license/copy";

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

type FormCopy = Pick<
  CommunityLicensePageCopy,
  | "fields"
  | "marketingLabel"
  | "submitLabel"
  | "successTitle"
  | "successDescription"
  | "successButton"
  | "homeHref"
  | "errorGeneral"
>;

export default function CommunityLicenseForm({ copy }: { copy: FormCopy }) {
  const router = useRouter();
  const [marketing, setMarketing] = useState(false);
  const [formState, setFormState] = useState<FormState>({ status: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState({ status: "submitting" });

    const data = new FormData(event.currentTarget);
    const body: Record<string, string | boolean> = {};
    for (const [key, value] of data.entries()) {
      body[key] = value as string;
    }
    body.HasOptedInMarketing__c = marketing;

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
      } else {
        setFormState({
          status: "error",
          message: result.errorMessage ?? copy.errorGeneral,
        });
      }
    } catch {
      setFormState({ status: "error", message: copy.errorGeneral });
    }
  }

  if (formState.status === "success") {
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
            onClick={() => router.push(copy.homeHref)}
          >
            {copy.successButton}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {copy.fields.map((field) => (
        <div key={field.name} className="flex w-full flex-col gap-[10px]">
          <FieldLabel label={field.label} required={field.required} />
          <Input
            className="w-full"
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            type={field.type}
          />
        </div>
      ))}

      <ContactCheckboxRow
        checked={marketing}
        label={copy.marketingLabel}
        name="HasOptedInMarketing__c"
        onChange={setMarketing}
      />

      {formState.status === "error" && (
        <p className="m-0 type-body-md text-destructive">{formState.message}</p>
      )}

      <div className="flex">
        <Button
          arrow={false}
          disabled={formState.status === "submitting"}
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
