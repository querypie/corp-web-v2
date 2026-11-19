"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  GnbLanguageIcon,
  GnbLanguagePopover,
  gnbLanguageOptionClassName,
} from "@/components/layout/GnbLanguageMenu";
import type { Locale } from "@/constants/i18n";
import { anniversaryCopy, anniversaryGnbCopy } from "@/copy/anniversary";
import { getAnniversaryPath } from "@/features/anniversary/routing";

const languageOptions = ["en", "ko"] as const;
const desktopPopoverCloseDelay = 160;
const isDesktopLayout = () => window.matchMedia("(min-width: 1024px)").matches;

function LanguageSelector({ locale }: { locale: (typeof languageOptions)[number] }) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const triggerPointer = useRef("");
  const id = useId();

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !menu.current?.contains(event.target))
        setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  return (
    <div
      className="relative z-50 shrink-0 lg:inline-flex"
      ref={menu}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse" || !isDesktopLayout()) return;
        window.clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse" || !isDesktopLayout() || menu.current?.querySelector(":focus-visible")) return;
        window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(() => setOpen(false), desktopPopoverCloseDelay);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !open) return;
        event.preventDefault();
        trigger.current?.focus();
        setOpen(false);
      }}
    >
      <button
        ref={trigger}
        className="group inline-flex h-10 w-10 items-center justify-center transition-colors duration-300 lg:h-7 lg:w-7"
        type="button"
        aria-label={anniversaryCopy[locale].language}
        aria-expanded={open}
        aria-controls={id}
        onFocus={(event) => {
          if (!isDesktopLayout() || !event.currentTarget.matches(":focus-visible")) return;
          window.clearTimeout(closeTimer.current);
          setOpen(true);
        }}
        onPointerDown={(event) => { triggerPointer.current = event.pointerType; }}
        onClick={(event) => {
          if (event.detail > 0 && triggerPointer.current === "mouse" && isDesktopLayout()) {
            setOpen(true);
          } else {
            setOpen((current) => !current);
          }
        }}
      >
        <GnbLanguageIcon className="h-6 w-6 lg:h-7 lg:w-7" />
      </button>
      <div
        id={id}
        inert={!open}
        className={`absolute right-0 top-full z-[60] pt-3 transition-all duration-200 lg:left-1/2 lg:right-auto lg:-translate-x-1/2 lg:translate-y-0 lg:transition-none ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <GnbLanguagePopover>
          {languageOptions.map((option) => (
            <a
              key={option}
              href={getAnniversaryPath(option)}
              hrefLang={option}
              lang={option}
              aria-current={option === locale ? "page" : undefined}
              className={`pressable text-fg hover:text-mute ${gnbLanguageOptionClassName}`}
              onClick={() => setOpen(false)}
            >
              {anniversaryGnbCopy.languages[option]}
            </a>
          ))}
        </GnbLanguagePopover>
      </div>
    </div>
  );
}

export default function AnniversaryGnb({ locale, homeHref }: { locale: Locale; homeHref: string }) {
  const copy = anniversaryCopy[locale];
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex w-full items-center justify-center bg-bg pl-5 pr-4 md:px-10">
      <div className="flex h-16 w-full max-w-[1200px] items-center justify-between gap-6 text-fg">
        <div className="inline-flex items-center gap-4">
          <a href={homeHref} target="_blank" rel="noopener noreferrer" aria-label={copy.home}>
            <img
              src="/assets/brand/logos/querypie-ai-logo.svg"
              alt=""
              className="theme-icon block h-5 w-[116px] shrink-0 transition-[filter,opacity] duration-300"
              width="116"
              height="20"
            />
          </a>
          <a href="#intro" aria-label={`${anniversaryGnbCopy.edition} — ${copy.top}`} className="whitespace-nowrap type-body-sm">
            <span lang="en">{anniversaryGnbCopy.edition}</span>
          </a>
        </div>
        {locale !== "ja" && <LanguageSelector locale={locale} />}
      </div>
    </header>
  );
}
