import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/common/Cta";
import type { Locale } from "@/constants/i18n";
import Button from "@/components/ui/Button";
import ExternalLinkIcon from "@/components/ui/ExternalLinkIcon";
import { trustCenterCopy, trustCenterHref } from "@/copy/trustCenter";
import CertificationCard, { type CertificationItem } from "@/components/sections/common/CertificationCard";

type CertificationsPageProps = {
  intro: string;
  items: readonly CertificationItem[];
  locale: Locale;
  title: string;
};

export default function CertificationsPage({
  intro,
  items,
  locale,
  title,
}: CertificationsPageProps) {
  const trust = trustCenterCopy[locale];
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
      <section className="flex w-full justify-center">
        <div className="flex w-full max-w-[1200px] flex-col gap-10 sm:gap-8 md:gap-10 lg:gap-[60px]">
        {/* Figma 기준으로 좌측 제목 / 우측 소개 문구 2열 헤더를 구성 */}
        <header className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
          <h1 className="m-0 type-h1 text-fg">{title}</h1>
          <div className="min-w-0">
            <p className="m-0 type-body-lg text-fg">{intro}</p>
            <div className="mt-4">
              <p className="mb-6 mt-0 type-body-lg text-fg">{trust.description}</p>
              <Button href={trustCenterHref} target="_blank" rel="noopener noreferrer" variant="secondary" style="full" arrow={false} className="h-auto min-h-10 max-w-full py-2">
                {trust.action}<ExternalLinkIcon className="h-4 w-4 shrink-0" />
              </Button>
            </div>
          </div>
        </header>

        {/* 인증 카드는 동일한 정보 밀도를 유지하도록 공통 카드 컴포넌트로 렌더 */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {items.map((item, index) => (
            <CertificationCard key={`${item.title}-${item.imageSrc}-${index}`} {...item} />
          ))}
        </div>
        </div>
      </section>
      <Cta locale={locale} />
    </div>
  );
}
