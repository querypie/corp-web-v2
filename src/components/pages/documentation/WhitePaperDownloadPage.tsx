"use client";

import type { ContactPageCopy } from "@/features/contact/copy";
import WhitePaperLeadForm from "./WhitePaperLeadForm";

type WhitePaperDownloadPageProps = {
  attachmentFileName: string;
  attachmentUrl: string;
  contactCopy: ContactPageCopy;
  coverImageSrc: string;
  locale: "en" | "ko" | "ja";
  pdfPreviewUrl: string;
  returnUrl: string;
  title: string;
};

function getLocalizedCopy(locale: "en" | "ko" | "ja") {
  return {
    helperText: {
      en: "⬇️ Enter your information below to download.",
      ko: "⬇️ 아래 정보를 입력하고 다운로드 받으세요.",
      ja: "⬇️ 以下の情報を入力してダウンロードしてください。",
    }[locale],
  };
}

export default function WhitePaperDownloadPage({
  attachmentFileName,
  attachmentUrl,
  contactCopy,
  coverImageSrc,
  locale,
  pdfPreviewUrl,
  returnUrl,
  title,
}: WhitePaperDownloadPageProps) {
  const localized = getLocalizedCopy(locale);

  return (
    <div className="flex w-full justify-center px-5 pb-10 md:px-10">
      <section className="mx-auto flex w-full max-w-[900px] flex-col gap-20 pb-10 md:flex-row md:items-start md:gap-[80px]">
        <div className="flex min-w-0 flex-1 basis-1/2 flex-col gap-6">
          <div className="w-full overflow-hidden rounded-thumb bg-bg-content">
            <img alt={`${title} cover`} className="block h-auto w-full object-cover" src={coverImageSrc} />
          </div>
          <div className="flex flex-col gap-[10px]">
            <h1 className="m-0 type-h3 text-fg">{title}</h1>
            <p className="m-0 type-body-md text-mute-fg">{localized.helperText}</p>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 basis-1/2">
          <WhitePaperLeadForm
            attachmentFileName={attachmentFileName}
            attachmentUrl={attachmentUrl}
            contactCopy={contactCopy}
            locale={locale}
            mode="download"
            pdfPreviewUrl={pdfPreviewUrl}
            returnUrl={returnUrl}
            title={title}
          />
        </div>
      </section>
    </div>
  );
}
