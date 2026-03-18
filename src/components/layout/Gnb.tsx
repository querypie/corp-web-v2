"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Button from "../common/Button";

/* 솔루션 서브메뉴 */
function getSolutionsSubItems(locale: string) {
  return [
    { label: "AI Platform (AIP)", href: `/${locale}/aip-not-found` },
    { label: "Access Control Platform (ACP)", href: `/${locale}/acp-not-found` },
    { label: "Forward Deployed Engineer Service (FDES)", href: `/${locale}/fdes-not-found` },
  ];
}

/* 피처스 서브메뉴 */
function getFeaturesSubItems(locale: string) {
  return [
    { label: "Demo", href: `/${locale}/demo` },
    { label: "Documentation", href: `/${locale}/docs` },
  ];
}

/* 컴퍼니 서브메뉴 */
function getCompanySubItems(locale: string) {
  return [
    { label: "About Us", href: `/${locale}/about-us` },
    { label: "Certifications", href: `/${locale}/certifications` },
    { label: "News", href: `/${locale}/news` },
    { label: "Contact Us", href: `/${locale}/contact-us` },
  ];
}

type GnbProps = {
  actionLabel?: string;
  className?: string;
  items?: string[];
  locale?: string;
  localeIcon?: ReactNode;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getNavHref(item: string, locale: string) {
  /* 최상위 메뉴 중 Plans만 별도 라우트로 연결 */
  if (item === "Plans" || item === "요금제" || item === "プラン") {
    return `/${locale}/plans`;
  }

  return "/";
}

function getLocaleHref(pathname: string, locale: string) {
  /* 현재 경로의 첫 세그먼트(locale)만 바꿔 같은 페이지에서 언어 전환 */
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${locale}`;
  }

  segments[0] = locale;
  return `/${segments.join("/")}`;
}

export default function Gnb({
  actionLabel = "Free start!",
  className,
  items = ["Solutions", "Features", "Company", "Plans"],
  locale = "en",
  localeIcon,
}: GnbProps) {
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);
  const pathname = usePathname();

  /* 언어 드롭다운은 현재 페이지를 유지한 채 locale만 변경 */
  const localeSubItems = [
    { label: "English", href: getLocaleHref(pathname, "en") },
    { label: "日本語", href: getLocaleHref(pathname, "ja") },
    { label: "한국어", href: getLocaleHref(pathname, "ko") },
  ];

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 flex w-full items-center justify-center bg-[rgba(8,9,10,0.5)] px-5 backdrop-blur-[12px] md:px-10",
        className,
      )}
    >
      <div className="flex h-[60px] w-full max-w-[1200px] items-center justify-between gap-6 text-fg">
        <a aria-label="QueryPie AI" className="inline-flex h-5 w-[116px] shrink-0 items-center text-fg" href={`/${locale}`}>
          <img
            alt="QueryPie AI"
            className="block h-5 w-[116px]"
            src="/icons/querypie-ai-logo.svg"
          />
        </a>
        <div className="flex items-center gap-[30px]">
          {/* 데스크톱 전용 글로벌 네비게이션 */}
          <nav aria-label="Global" className="hidden items-center gap-[30px] md:flex">
            {items.map((item, index) => {
              const navSlot = index;

              if (navSlot === 0) {
                return (
                  <div
                    key={item}
                    className="relative"
                    onMouseEnter={() => setSolutionsOpen(true)}
                    onMouseLeave={() => setSolutionsOpen(false)}
                  >
                    <button
                      className={cx(
                        "type-body-md transition-colors",
                        solutionsOpen ? "text-fg" : "text-mute-fg hover:text-fg",
                      )}
                      type="button"
                    >
                      {item}
                    </button>

                    {/* Solutions 서브메뉴 */}
                    <div
                      className={cx(
                        "absolute left-1/2 top-full pt-3 -translate-x-1/2 transition-all duration-200",
                        solutionsOpen ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1",
                      )}
                    >
                      <div className="overflow-hidden rounded-[8px] border border-border bg-[rgba(18,19,20,0.9)] px-[14px] pb-[10px] pt-2 shadow-xl backdrop-blur-[16px]">
                        {getSolutionsSubItems(locale).map((sub) => (
                          <a
                            key={sub.label}
                            className="flex items-center whitespace-nowrap py-1 type-body-md text-fg transition-colors hover:text-mute-fg"
                            href={sub.href}
                          >
                            {sub.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              if (navSlot === 1) {
                return (
                  <div
                    key={item}
                    className="relative"
                    onMouseEnter={() => setFeaturesOpen(true)}
                    onMouseLeave={() => setFeaturesOpen(false)}
                  >
                    <button
                      className={cx(
                        "type-body-md transition-colors",
                        featuresOpen ? "text-fg" : "text-mute-fg hover:text-fg",
                      )}
                      type="button"
                    >
                      {item}
                    </button>

                    {/* Features 서브메뉴 */}
                    <div
                      className={cx(
                        "absolute left-1/2 top-full pt-3 -translate-x-1/2 transition-all duration-200",
                        featuresOpen ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1",
                      )}
                    >
                      <div className="overflow-hidden rounded-[8px] border border-border bg-[rgba(18,19,20,0.9)] px-[14px] pb-[10px] pt-2 shadow-xl backdrop-blur-[16px]">
                        {getFeaturesSubItems(locale).map((sub) => (
                          <a
                            key={sub.label}
                            className="flex items-center whitespace-nowrap py-1 type-body-md text-fg transition-colors hover:text-mute-fg"
                            href={sub.href}
                          >
                            {sub.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              if (navSlot === 2) {
                return (
                  <div
                    key={item}
                    className="relative"
                    onMouseEnter={() => setCompanyOpen(true)}
                    onMouseLeave={() => setCompanyOpen(false)}
                  >
                    <button
                      className={cx(
                        "type-body-md transition-colors",
                        companyOpen ? "text-fg" : "text-mute-fg hover:text-fg",
                      )}
                      type="button"
                    >
                      {item}
                    </button>

                    {/* Company 서브메뉴 */}
                    <div
                      className={cx(
                        "absolute left-1/2 top-full pt-3 -translate-x-1/2 transition-all duration-200",
                        companyOpen ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1",
                      )}
                    >
                      <div className="overflow-hidden rounded-[8px] border border-border bg-[rgba(18,19,20,0.9)] px-[14px] pb-[10px] pt-2 shadow-xl backdrop-blur-[16px]">
                        {getCompanySubItems(locale).map((sub) => (
                          <a
                            key={sub.label}
                            className="flex items-center whitespace-nowrap py-1 type-body-md text-fg transition-colors hover:text-mute-fg"
                            href={sub.href}
                          >
                            {sub.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={item}
                  className="type-body-md text-mute-fg transition-colors hover:text-fg"
                  href={getNavHref(item, locale)}
                >
                  {item}
                </a>
              );
            })}
          </nav>
          {/* 현재 경로 기준 locale만 바꾸는 언어 선택 드롭다운 */}
          <div
            className="relative hidden md:inline-flex"
            onMouseEnter={() => setLocaleOpen(true)}
            onMouseLeave={() => setLocaleOpen(false)}
          >
            <button
              aria-label="Change language"
              className="opacity-60 transition-opacity hover:opacity-100"
              type="button"
            >
              {localeIcon ?? (
                <img
                  alt=""
                  aria-hidden="true"
                  className="h-6 w-6"
                  src="/icons/global.svg"
                />
              )}
            </button>

            <div
              className={cx(
                "absolute left-1/2 top-full pt-3 -translate-x-1/2 transition-all duration-200",
                localeOpen ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1",
              )}
            >
              <div className="overflow-hidden rounded-[8px] border border-border bg-[rgba(18,19,20,0.9)] px-[14px] pb-[10px] pt-2 shadow-xl backdrop-blur-[16px]">
                {localeSubItems.map((sub) => (
                  <a
                    key={sub.label}
                    className="flex items-center whitespace-nowrap py-1 type-body-md text-fg transition-colors hover:text-mute-fg"
                    href={sub.href}
                  >
                    {sub.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <a href="/admin">
            <Button arrow={false} variant="gnb">
              {actionLabel}
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
