"use client";

import type { FocusEvent as ReactFocusEvent, MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import {
  getCompanySubItems,
  getFeaturesSubItems,
  getPlansSubItems,
  getPrimaryNavHref,
  getSolutionsSubItems,
} from "@/constants/navigation";
import { getLocalePath, isLocale, type Locale } from "@/constants/i18n";

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
const desktopPopoverCloseDelayMs = 160;

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
  items = ["Solutions", "Features", "Company", "Plans"],
  locale = "en",
  localeIcon,
}: GnbProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const [mobileLocaleOpen, setMobileLocaleOpen] = useState(false);
  const [desktopPopoverOpen, setDesktopPopoverOpen] = useState<string | null>(null);
  const [currentSearch, setCurrentSearch] = useState("");
  const pathname = usePathname();
  const mobileLocaleRef = useRef<HTMLDivElement | null>(null);
  const desktopPopoverCloseTimeoutRef = useRef<number | null>(null);
  const desktopPopoverItemPressRef = useRef(false);
  const homeHref = getLocalePath(locale as Locale, "/");

  const clearDesktopPopoverCloseTimeout = () => {
    if (desktopPopoverCloseTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(desktopPopoverCloseTimeoutRef.current);
    desktopPopoverCloseTimeoutRef.current = null;
  };

  const openDesktopPopover = (key: string) => {
    clearDesktopPopoverCloseTimeout();
    setDesktopPopoverOpen(key);
  };

  const closeDesktopPopover = () => {
    clearDesktopPopoverCloseTimeout();
    desktopPopoverItemPressRef.current = false;
    setDesktopPopoverOpen(null);
  };

  const scheduleDesktopPopoverClose = () => {
    clearDesktopPopoverCloseTimeout();

    if (desktopPopoverItemPressRef.current) {
      return;
    }

    desktopPopoverCloseTimeoutRef.current = window.setTimeout(() => {
      desktopPopoverCloseTimeoutRef.current = null;

      if (desktopPopoverItemPressRef.current) {
        return;
      }

      setDesktopPopoverOpen(null);
    }, desktopPopoverCloseDelayMs);
  };

  const handleDesktopPopoverItemPointerDown = () => {
    clearDesktopPopoverCloseTimeout();
    desktopPopoverItemPressRef.current = true;
  };

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
    clearDesktopPopoverCloseTimeout();
    setMobileMenuOpen(false);
    setMobileLocaleOpen(false);
    setDesktopPopoverOpen(null);
  }, [pathname]);

  useEffect(() => {
    const releaseDesktopPopoverItemPress = () => {
      desktopPopoverItemPressRef.current = false;
    };

    window.addEventListener("pointerup", releaseDesktopPopoverItemPress);
    window.addEventListener("pointercancel", releaseDesktopPopoverItemPress);

    return () => {
      clearDesktopPopoverCloseTimeout();
      window.removeEventListener("pointerup", releaseDesktopPopoverItemPress);
      window.removeEventListener("pointercancel", releaseDesktopPopoverItemPress);
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
  const handleLocaleClick = (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    setMobileLocaleOpen(false);
    setDesktopPopoverOpen(null);
    router.push(href, { scroll: false });
  };
  const handleDesktopPopoverBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (desktopPopoverItemPressRef.current) {
      return;
    }

    const nextTarget = event.relatedTarget;

    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      closeDesktopPopover();
    }
  };
  const mobileSections = [
    { title: items[0], items: getSolutionsSubItems(locale) },
    { title: items[1], items: getFeaturesSubItems(locale) },
    { title: items[2], items: getCompanySubItems(locale) },
    { title: items[3], items: getPlansSubItems(locale) },
  ];
  const isDesktopLocaleOpen = desktopPopoverOpen === "locale";

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-[var(--language-banner-offset,0px)] z-50 flex w-full items-center justify-center pl-5 pr-4 transition-[background-color,backdrop-filter,top] duration-300 md:px-10",
          mobileMenuOpen ? mobileMenuBackdropClassName : "bg-bg",
          className,
        )}
      >
        <div className="flex h-16 w-full max-w-[1200px] items-center justify-between gap-6 text-fg transition-colors duration-300">
          <Link
            aria-label="QueryPie AI"
            className="inline-flex h-5 w-[116px] shrink-0 items-center text-fg transition-colors duration-300"
            href={homeHref}
            onClick={() => {
              setMobileMenuOpen(false);
            }}
          >
            <img
              alt="QueryPie AI"
              className="theme-icon block h-5 w-[116px] transition-[filter,opacity] duration-300"
              src="/assets/brand/logos/querypie-ai-logo.svg"
            />
          </Link>
          <div className="flex items-center gap-[10px] md:gap-[30px]">
            {/* 데스크톱 전용 글로벌 네비게이션 */}
            <nav aria-label="Global" className="hidden items-center gap-[30px] md:flex">
              {items.map((item, index) => {
                const navSlot = index;

                if (navSlot === 0) {
                  const isOpen = desktopPopoverOpen === item;

                  return (
                    <div
                      key={item}
                      className="relative"
                      onBlur={handleDesktopPopoverBlur}
                      onMouseEnter={() => openDesktopPopover(item)}
                      onMouseLeave={scheduleDesktopPopoverClose}
                    >
                      <button
                        className={cx(
                          "type-body-md transition-colors hover:text-mute",
                          isOpen ? "text-mute" : "text-fg",
                        )}
                        onFocus={() => openDesktopPopover(item)}
                        type="button"
                      >
                        {item}
                      </button>

                      <div
                        className={cx(
                          "absolute left-1/2 top-full z-[60] -translate-x-1/2 pt-3",
                          isOpen
                            ? "pointer-events-auto opacity-100"
                            : "pointer-events-none opacity-0",
                        )}
                        onMouseEnter={() => openDesktopPopover(item)}
                      >
                        <div className="gnb-popover-surface relative overflow-hidden rounded-[8px] px-6 pb-[14px] pt-3 backdrop-blur-[18px]">
                          {getSolutionsSubItems(locale).map((sub) => (
                            <Link
                              key={sub.label}
                              className="pressable flex items-center whitespace-nowrap py-1 type-body-md text-fg hover:text-mute"
                              href={sub.href}
                              onClick={closeDesktopPopover}
                              onPointerDown={handleDesktopPopoverItemPointerDown}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (navSlot === 1) {
                  const isOpen = desktopPopoverOpen === item;

                  return (
                    <div
                      key={item}
                      className="relative"
                      onBlur={handleDesktopPopoverBlur}
                      onMouseEnter={() => openDesktopPopover(item)}
                      onMouseLeave={scheduleDesktopPopoverClose}
                    >
                      <button
                        className={cx(
                          "type-body-md transition-colors hover:text-mute",
                          isOpen ? "text-mute" : "text-fg",
                        )}
                        onFocus={() => openDesktopPopover(item)}
                        type="button"
                      >
                        {item}
                      </button>

                      <div
                        className={cx(
                          "absolute left-1/2 top-full z-[60] -translate-x-1/2 pt-3",
                          isOpen
                            ? "pointer-events-auto opacity-100"
                            : "pointer-events-none opacity-0",
                        )}
                        onMouseEnter={() => openDesktopPopover(item)}
                      >
                        <div className="gnb-popover-surface relative overflow-hidden rounded-[8px] px-6 pb-[14px] pt-3 backdrop-blur-[18px]">
                          {getFeaturesSubItems(locale).map((sub) => (
                            <Link
                              key={sub.label}
                              className="pressable flex items-center whitespace-nowrap py-1 type-body-md text-fg hover:text-mute"
                              href={sub.href}
                              onClick={closeDesktopPopover}
                              onPointerDown={handleDesktopPopoverItemPointerDown}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (navSlot === 2) {
                  const isOpen = desktopPopoverOpen === item;

                  return (
                    <div
                      key={item}
                      className="relative"
                      onBlur={handleDesktopPopoverBlur}
                      onMouseEnter={() => openDesktopPopover(item)}
                      onMouseLeave={scheduleDesktopPopoverClose}
                    >
                      <button
                        className={cx(
                          "type-body-md transition-colors hover:text-mute",
                          isOpen ? "text-mute" : "text-fg",
                        )}
                        onFocus={() => openDesktopPopover(item)}
                        type="button"
                      >
                        {item}
                      </button>

                      <div
                        className={cx(
                          "absolute left-1/2 top-full z-[60] -translate-x-1/2 pt-3",
                          isOpen
                            ? "pointer-events-auto opacity-100"
                            : "pointer-events-none opacity-0",
                        )}
                        onMouseEnter={() => openDesktopPopover(item)}
                      >
                        <div className="gnb-popover-surface relative overflow-hidden rounded-[8px] px-6 pb-[14px] pt-3 backdrop-blur-[18px]">
                          {getCompanySubItems(locale).map((sub) => (
                            <Link
                              key={sub.label}
                              className="pressable flex items-center whitespace-nowrap py-1 type-body-md text-fg hover:text-mute"
                              href={sub.href}
                              onClick={closeDesktopPopover}
                              onPointerDown={handleDesktopPopoverItemPointerDown}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item}
                    className={cx(
                      "relative type-body-md transition-colors",
                      plansOpen ? "text-mute" : "text-fg hover:text-mute",
                    )}
                    href={getPrimaryNavHref(item, locale)}
                    onMouseEnter={() => setPlansOpen(true)}
                    onMouseLeave={() => setPlansOpen(false)}
                  >
                    {item}
                  </Link>
                );
              })}
            </nav>
            <div
              className="relative hidden md:inline-flex"
              onBlur={handleDesktopPopoverBlur}
              onMouseEnter={() => openDesktopPopover("locale")}
              onMouseLeave={scheduleDesktopPopoverClose}
            >
              <button
                aria-label="Change language"
                className="group transition-colors duration-300"
                onFocus={() => openDesktopPopover("locale")}
                type="button"
              >
                {localeIcon ?? (
                  <img
                    alt=""
                    aria-hidden="true"
                    className="theme-icon h-7 w-7 object-contain transition-[filter,opacity] duration-300 group-hover:opacity-50"
                    src="/assets/ui/icons/global.svg"
                  />
                )}
              </button>

              <div
                className={cx(
                  "absolute left-1/2 top-full z-[60] -translate-x-1/2 pt-3",
                  isDesktopLocaleOpen
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0",
                )}
                onMouseEnter={() => openDesktopPopover("locale")}
              >
                <div className="gnb-popover-surface relative overflow-hidden rounded-[8px] px-6 pb-[14px] pt-3 backdrop-blur-[18px]">
                  {localeSubItems.map((sub) => (
                    <a
                      key={sub.label}
                      className="pressable flex items-center whitespace-nowrap py-1 type-body-md text-fg hover:text-mute"
                      href={sub.href}
                      onClick={(event) => handleLocaleClick(event, sub.href)}
                      onPointerDown={handleDesktopPopoverItemPointerDown}
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
                    className="theme-icon h-6 w-6 object-contain transition-[filter,opacity] duration-300 group-hover:opacity-50"
                    src="/assets/ui/icons/global.svg"
                  />
                )}
              </button>

              <div
                className={cx(
                  "absolute right-0 top-full z-50 pt-3 transition-all duration-200",
                  mobileLocaleOpen ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1",
                )}
              >
                <div className="gnb-popover-surface relative overflow-hidden rounded-[8px] px-6 pb-[14px] pt-3 backdrop-blur-[18px]">
                  {localeSubItems.map((sub) => (
                    <a
                      key={sub.label}
                      className="pressable flex items-center whitespace-nowrap py-1 type-body-md text-fg hover:text-mute"
                      href={sub.href}
                      onClick={(event) => handleLocaleClick(event, sub.href)}
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
              className="inline-flex h-9 w-9 items-center justify-center md:hidden"
              onClick={() => setMobileMenuOpen((current) => !current)}
              type="button"
            >
              <img
                alt=""
                aria-hidden="true"
                className="theme-icon h-9 w-9 object-contain"
                src={mobileMenuOpen ? "/assets/ui/icons/m-Close.svg" : "/assets/ui/icons/m-Menu.svg"}
              />
            </button>
            <a className="hidden md:inline-flex" href="https://app.querypie.com/" rel="noreferrer noopener" target="_blank">
              <Button
                arrow={false}
                size="small"
                style="full"
                variant="primary"
              >
                {actionLabel}
              </Button>
            </a>
          </div>
        </div>
      </header>

      {mobileMenuVisible ? (
        <div className={cx(
          "fixed inset-x-0 bottom-0 top-[calc(64px+var(--language-banner-offset,0px))] z-40 overflow-y-auto transition-[top] duration-300 md:hidden",
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
                <p className="m-0 type-body-md text-mute">{section.title}</p>
                <div className="flex w-full flex-col gap-[10px]">
                  {section.items.map((item) => (
                    <Link
                      key={item.label}
                      className="pressable type-h2 text-fg"
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
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
