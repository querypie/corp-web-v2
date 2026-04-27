"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Button from "../common/Button";
import {
  getCompanySubItems,
  getDemoSubItems,
  getPlansSubItems,
  getPrimaryNavHref,
  getResourcesSubItems,
  getSolutionsSubItems,
} from "../../constants/navigation";
import { defaultLocale, getLocalePath, isLocale, type Locale } from "../../constants/i18n";

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

const mobileMenuBackdropClassName = "bg-bg";

function getLocaleHref(pathname: string, locale: string, search: string) {
  /* 현재 경로를 유지한 채 locale만 교체한다. 기본 locale(en)는 접두를 숨긴다. */
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    const nextHref = getLocalePath(locale as Locale, "/");
    return search ? `${nextHref}?${search}` : nextHref;
  }

  const pathWithoutLocale = isLocale(segments[0])
    ? `/${segments.slice(1).join("/")}`
    : pathname;
  const nextPathname = getLocalePath(locale as Locale, pathWithoutLocale || "/");
  return search ? `${nextPathname}?${search}` : nextPathname;
}

export default function Gnb({
  actionLabel = "Free start!",
  className,
  items = ["Solutions", "Demo", "Resources", "Company", "Plans"],
  locale = "en",
  localeIcon,
}: GnbProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const [desktopLocaleOpen, setDesktopLocaleOpen] = useState(false);
  const [mobileLocaleOpen, setMobileLocaleOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSearch, setCurrentSearch] = useState("");
  const pathname = usePathname();
  const mobileLocaleRef = useRef<HTMLDivElement | null>(null);
  const homeHref = getLocalePath(locale as Locale, "/");
  const isHomePage =
    pathname === homeHref || (locale === defaultLocale && pathname === "/en");
  const isHomeTop = isHomePage && !mobileMenuOpen && !isScrolled;

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuVisible(true);
      return;
    }

    if (!mobileMenuVisible) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setMobileMenuVisible(false);
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [mobileMenuOpen, mobileMenuVisible]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDesktopLocaleOpen(false);
    setMobileLocaleOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nextSearch = window.location.search.replace(/^\?/, "");
    setCurrentSearch((current) => (current === nextSearch ? current : nextSearch));
  });

  /* 언어 드롭다운은 현재 페이지를 유지한 채 locale만 변경 */
  const localeSubItems = [
    { label: "English", href: getLocaleHref(pathname, "en", currentSearch) },
    { label: "日本語", href: getLocaleHref(pathname, "ja", currentSearch) },
    { label: "한국어", href: getLocaleHref(pathname, "ko", currentSearch) },
  ];
  const mobileSections = [
    { title: items[0], items: getSolutionsSubItems(locale) },
    { title: items[1], items: getDemoSubItems(locale) },
    { title: items[2], items: getResourcesSubItems(locale) },
    { title: items[3], items: getCompanySubItems(locale) },
    { title: items[4], items: getPlansSubItems(locale) },
  ];

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-50 flex w-full items-center justify-center pl-5 pr-4 transition-[background-color,backdrop-filter] duration-300 md:px-10",
          mobileMenuOpen
            ? mobileMenuBackdropClassName
            : isHomeTop
              ? "bg-transparent"
              : "bg-bg",
          className,
        )}
      >
        <div className={cx("flex h-[56px] w-full max-w-[1200px] items-center justify-between gap-6 transition-colors duration-300 md:h-16", isHomeTop ? "text-bg" : "text-fg")}>
          <a
            aria-label="QueryPie AI"
            className={cx("inline-flex h-[18px] shrink-0 items-center transition-colors duration-300 md:h-5 md:w-[116px]", isHomeTop ? "text-bg" : "text-fg")}
            href={homeHref}
            onClick={() => {
              setMobileMenuOpen(false);
            }}
          >
            <img
              alt="QueryPie AI"
              className={cx("block h-[18px] w-auto transition-[filter,opacity] duration-300 md:h-5 md:w-[116px]", isHomeTop && "brightness-0")}
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
                          isHomeTop
                            ? solutionsOpen
                              ? "text-bg"
                              : "text-bg/70 hover:text-bg"
                            : solutionsOpen
                              ? "text-mute-fg"
                              : "text-fg hover:text-mute-fg",
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
                        <div className="relative overflow-hidden rounded-[8px] bg-[rgb(var(--color-bg-gnb-popover-rgb)/0.8)] px-6 pb-[14px] pt-3 backdrop-blur-[18px]">
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
                      onMouseEnter={() => setDemoOpen(true)}
                      onMouseLeave={() => setDemoOpen(false)}
                    >
                      <button
                        className={cx(
                          "type-body-md transition-colors",
                          isHomeTop
                            ? demoOpen
                              ? "text-bg"
                              : "text-bg/70 hover:text-bg"
                            : demoOpen
                              ? "text-mute-fg"
                              : "text-fg hover:text-mute-fg",
                        )}
                        type="button"
                      >
                        {item}
                      </button>

                      <div
                        className={cx(
                          "absolute left-1/2 top-full pt-3 -translate-x-1/2 transition-all duration-200",
                          demoOpen ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1",
                        )}
                      >
                        <div className="relative overflow-hidden rounded-[8px] bg-[rgb(var(--color-bg-gnb-popover-rgb)/0.8)] px-6 pb-[14px] pt-3 backdrop-blur-[18px]">
                          {getDemoSubItems(locale).map((sub) => (
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
                      onMouseEnter={() => setResourcesOpen(true)}
                      onMouseLeave={() => setResourcesOpen(false)}
                    >
                      <button
                        className={cx(
                          "type-body-md transition-colors",
                          isHomeTop
                            ? resourcesOpen
                              ? "text-bg"
                              : "text-bg/70 hover:text-bg"
                            : resourcesOpen
                              ? "text-mute-fg"
                              : "text-fg hover:text-mute-fg",
                        )}
                        type="button"
                      >
                        {item}
                      </button>

                      <div
                        className={cx(
                          "absolute left-1/2 top-full pt-3 -translate-x-1/2 transition-all duration-200",
                          resourcesOpen ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1",
                        )}
                      >
                        <div className="relative overflow-hidden rounded-[8px] bg-[rgb(var(--color-bg-gnb-popover-rgb)/0.8)] px-6 pb-[14px] pt-3 backdrop-blur-[18px]">
                          {getResourcesSubItems(locale).map((sub) => (
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

                if (navSlot === 3) {
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
                          isHomeTop
                            ? companyOpen
                              ? "text-bg"
                              : "text-bg/70 hover:text-bg"
                            : companyOpen
                              ? "text-mute-fg"
                              : "text-fg hover:text-mute-fg",
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
                        <div className="relative overflow-hidden rounded-[8px] bg-[rgb(var(--color-bg-gnb-popover-rgb)/0.8)] px-6 pb-[14px] pt-3 backdrop-blur-[18px]">
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
                  <div
                    key={item}
                    className="relative"
                    onMouseEnter={() => setPlansOpen(true)}
                    onMouseLeave={() => setPlansOpen(false)}
                  >
                    <button
                      className={cx(
                        "type-body-md transition-colors",
                        isHomeTop
                          ? plansOpen
                            ? "text-bg"
                            : "text-bg/70 hover:text-bg"
                          : plansOpen
                            ? "text-mute-fg"
                            : "text-fg hover:text-mute-fg",
                      )}
                      onClick={() => {
                        router.push(getPrimaryNavHref(item, locale));
                      }}
                      type="button"
                    >
                      {item}
                    </button>
                  </div>
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
                className="group transition-colors duration-300"
                type="button"
              >
                {localeIcon ?? (
                  <img
                    alt=""
                    aria-hidden="true"
                    className={cx(
                      "h-6 w-6 object-contain transition-[filter,opacity] duration-300",
                      isHomeTop ? "brightness-0" : "group-hover:opacity-50",
                    )}
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
                <div className="relative overflow-hidden rounded-[8px] bg-[rgb(var(--color-bg-gnb-popover-rgb)/0.8)] px-6 pb-[14px] pt-3 backdrop-blur-[18px]">
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
                className="group inline-flex h-10 w-10 items-center justify-center transition-colors duration-300"
                onClick={() => setMobileLocaleOpen((current) => !current)}
                type="button"
              >
                {localeIcon ?? (
                  <img
                    alt=""
                    aria-hidden="true"
                    className={cx(
                      "h-6 w-6 object-contain transition-[filter,opacity] duration-300",
                      isHomeTop ? "brightness-0" : "group-hover:opacity-50",
                    )}
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
                <div className="relative overflow-hidden rounded-[8px] bg-[rgb(var(--color-bg-gnb-popover-rgb)/0.8)] px-6 pb-[14px] pt-3 backdrop-blur-[18px]">
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
              className={cx("inline-flex h-8 w-8 items-center justify-center md:hidden", isHomeTop && "text-bg")}
              onClick={() => setMobileMenuOpen((current) => !current)}
              type="button"
            >
              <img
                alt=""
                aria-hidden="true"
                className={cx("h-8 w-8 object-contain", isHomeTop && "brightness-0")}
                src={mobileMenuOpen ? "/icons/m-Close.svg" : "/icons/m-Menu.svg"}
              />
            </button>
            <a className="hidden md:inline-flex" href="/admin" rel="noreferrer noopener" target="_blank">
              <Button
                arrow={false}
                size="small"
                style="full"
                variant={isHomeTop ? "secondary" : "primary"}
              >
                {actionLabel}
              </Button>
            </a>
          </div>
        </div>
      </header>

      {mobileMenuVisible ? (
        <div className={cx(
          "fixed inset-x-0 bottom-0 top-[56px] z-40 overflow-y-auto md:hidden",
          mobileMenuOpen
            ? "animate-[mobile-menu-sheet-enter_320ms_cubic-bezier(0.22,1,0.36,1)_both]"
            : "animate-[mobile-menu-sheet-exit_280ms_cubic-bezier(0.4,0,0.2,1)_both]",
          mobileMenuBackdropClassName,
        )}>
          <nav className="flex w-full flex-col gap-[30px] px-5 py-[30px]" aria-label="Mobile global">
            {mobileSections.map((section) => (
              <div
                key={section.title}
                className="flex w-full flex-col gap-[10px]"
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

          </nav>
        </div>
      ) : null}
    </>
  );
}
