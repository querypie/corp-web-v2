"use client";

import { pageXPaddingClassName } from "@/constants/layout";
import type { ContactPageCopy } from "@/copy/contact";
import type { ManagedContentSection } from "@/features/content/data";
import ContentLeadForm from "./ContentLeadForm";

type ContentDownloadPageProps = {
  attachmentFileName: string;
  attachmentUrl: string;
  contactCopy: ContactPageCopy;
  contentId: string;
  coverImageSrc: string;
  locale: "en" | "ko" | "ja";
  pdfPreviewUrl: string;
  returnUrl: string;
  section: Exclude<ManagedContentSection, "news">;
  title: string;
  unlockCookieName?: string;
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

export default function ContentDownloadPage({
  attachmentFileName,
  attachmentUrl,
  contactCopy,
  contentId,
  coverImageSrc,
  locale,
  pdfPreviewUrl,
  returnUrl,
  section,
  title,
  unlockCookieName,
}: ContentDownloadPageProps) {
  const localized = getLocalizedCopy(locale);

  return (
    <div className={`flex w-full justify-center ${pageXPaddingClassName} pb-10`}>
      <section className="mx-auto flex w-full max-w-[900px] flex-col gap-20 pb-10 md:flex-row md:items-start md:gap-[80px]">
        <div className="flex min-w-0 flex-1 basis-1/2 flex-col gap-6">
          <div className="w-full overflow-hidden rounded-thumb bg-bg-content">
            <img alt={`${title} cover`} className="block h-auto w-full object-cover" src={coverImageSrc} />
          </div>
          <div className="flex flex-col gap-[10px]">
            <h1 className="m-0 type-h3 text-fg">{title}</h1>
            <p className="m-0 type-body-md text-mute">{localized.helperText}</p>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 basis-1/2">
          <ContentLeadForm
            attachmentFileName={attachmentFileName}
            attachmentUrl={attachmentUrl}
            contactCopy={contactCopy}
            contentId={contentId}
            locale={locale}
            mode="download"
            pdfPreviewUrl={pdfPreviewUrl}
            returnUrl={returnUrl}
            section={section}
            title={title}
            unlockCookieName={unlockCookieName}
          />
        </div>
      </section>
    </div>
  );
}
