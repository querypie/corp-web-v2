"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Button from "../common/Button";
import {
  getCompanySubItems,
  getFeaturesSubItems,
  getPrimaryNavHref,
  getSolutionsSubItems,
} from "../../constants/navigation";

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

const mobileMenuBackdropClassName = "bg-[rgba(8,9,10,0.9)]";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [desktopLocaleOpen, setDesktopLocaleOpen] = useState(false);
  const [mobileLocaleOpen, setMobileLocaleOpen] = useState(false);
  const pathname = usePathname();
  const mobileLocaleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDesktopLocaleOpen(false);
    setMobileLocaleOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileLocaleOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (mobileLocaleRef.current?.contains(target)) {
        return;
      }

      setMobileLocaleOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [mobileLocaleOpen]);

  /* 언어 드롭다운은 현재 페이지를 유지한 채 locale만 변경 */
  const localeSubItems = [
    { label: "English", href: getLocaleHref(pathname, "en") },
    { label: "日本語", href: getLocaleHref(pathname, "ja") },
    { label: "한국어", href: getLocaleHref(pathname, "ko") },
  ];
  const mobileSections = [
    { title: items[0], items: getSolutionsSubItems(locale) },
    { title: items[1], items: getFeaturesSubItems(locale) },
    { title: items[2], items: getCompanySubItems(locale) },
  ];
  const plansLabel = items[3];

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-50 flex w-full items-center justify-center px-5 backdrop-blur-[12px] md:px-10",
          mobileMenuOpen ? mobileMenuBackdropClassName : "bg-[rgba(8,9,10,0.5)]",
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
          <div className="flex items-center gap-[10px] md:gap-[30px]">
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
                    href={getPrimaryNavHref(item, locale)}
                  >
                    {item}
                  </a>
                );
              })}
            </nav>
            <div
              className="relative hidden md:inline-flex"
              onMouseEnter={() => setDesktopLocaleOpen(true)}
              onMouseLeave={() => setDesktopLocaleOpen(false)}
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
                  desktopLocaleOpen ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1",
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
            <div className="relative z-50 md:hidden" ref={mobileLocaleRef}>
              <button
                aria-expanded={mobileLocaleOpen}
                aria-label="Change language"
                className="inline-flex h-10 w-10 items-center justify-center"
                onClick={() => setMobileLocaleOpen((current) => !current)}
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
                  "absolute right-0 top-full z-50 pt-3 transition-all duration-200",
                  mobileLocaleOpen ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1",
                )}
              >
                <div className="overflow-hidden rounded-[8px] border border-border bg-[rgba(18,19,20,0.96)] px-[14px] pb-[10px] pt-2 shadow-xl backdrop-blur-[16px]">
                  {localeSubItems.map((sub) => (
                    <a
                      key={sub.label}
                      className="flex items-center whitespace-nowrap py-1 type-body-md text-fg transition-colors hover:text-mute-fg"
                      href={sub.href}
                      onClick={() => setMobileLocaleOpen(false)}
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <button
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center md:hidden"
              onClick={() => setMobileMenuOpen((current) => !current)}
              type="button"
            >
              <img
                alt=""
                aria-hidden="true"
                className="h-10 w-10 object-contain"
                src={mobileMenuOpen ? "/icons/m-Close.svg" : "/icons/m-Menu.svg"}
              />
            </button>
            <a className="hidden md:inline-flex" href="/admin" rel="noreferrer noopener" target="_blank">
              <Button arrow={false} variant="gnb">
                {actionLabel}
              </Button>
            </a>
          </div>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className={cx("fixed inset-x-0 bottom-0 top-[60px] z-40 overflow-y-auto backdrop-blur-[10px] md:hidden", mobileMenuBackdropClassName)}>
          <nav className="flex w-full flex-col gap-[30px] px-5 py-[30px]" aria-label="Mobile global">
            {mobileSections.map((section, index) => (
              <div
                key={section.title}
                className="flex w-full flex-col gap-[10px]"
                style={{ animation: `hero-copy-enter 0.45s ease-out ${index * 80}ms both` }}
              >
                <p className="m-0 type-body-sm text-mute-fg">{section.title}</p>
                <div className="flex w-full flex-col gap-[10px]">
                  {section.items.map((item) => (
                    <a
                      key={item.label}
                      className="type-body-lg text-fg transition-transform active:scale-[0.98]"
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}

            <a
              className="type-body-lg text-fg transition-transform active:scale-[0.98]"
              href={getPrimaryNavHref(plansLabel, locale)}
              onClick={() => setMobileMenuOpen(false)}
              style={{ animation: "hero-copy-enter 0.45s ease-out 240ms both" }}
            >
              {plansLabel}
            </a>
          </nav>
        </div>
      ) : null}
    </>
  );
}
