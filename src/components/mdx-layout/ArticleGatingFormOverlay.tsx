"use client";

import { useRouter } from "next/navigation";
import ContentLeadForm from "@/components/pages/documentation/ContentLeadForm";
import type { ContactPageCopy } from "@/features/contact/copy";
import type { Locale } from "@/constants/i18n";

type Props = {
  contactCopy: ContactPageCopy;
  locale: Locale;
  title: string;
  unlockCookieName: string;
};

export default function ArticleGatingFormOverlay({
  contactCopy,
  locale,
  title,
  unlockCookieName,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-center gap-6 border-t border-border py-12">
      <ContentLeadForm
        contactCopy={contactCopy}
        locale={locale}
        mode="unlock"
        onSuccess={() => router.refresh()}
        title={title}
        unlockCookieName={unlockCookieName}
      />
    </div>
  );
}
