import type { Locale } from "@/constants/i18n";

type PaginationNavProps = {
  currentPage: number;
  locale: Locale;
  nextHref?: string | null;
  previousHref?: string | null;
  totalPages: number;
};

const PAGINATION_COPY: Record<Locale, { next: string; previous: string }> = {
  en: {
    next: "Next Page",
    previous: "Previous Page",
  },
  ja: {
    next: "次のページ",
    previous: "前のページ",
  },
  ko: {
    next: "다음 페이지",
    previous: "이전 페이지",
  },
};

function linkClassName(isVisible: boolean) {
  return [
    "inline-flex min-w-[120px] items-center justify-center rounded-full border border-line px-4 py-2 type-body-md transition-colors",
    isVisible ? "text-fg hover:border-fg" : "pointer-events-none invisible",
  ].join(" ");
}

export default function PaginationNav({
  currentPage,
  locale,
  nextHref,
  previousHref,
  totalPages,
}: PaginationNavProps) {
  const copy = PAGINATION_COPY[locale];

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-center gap-4 border-t border-line pt-8">
        <span className="type-body-md text-mute-fg">1 / 1</span>
      </div>
    );
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-4 border-t border-line pt-8"
    >
      {previousHref ? (
        <a className={linkClassName(true)} href={previousHref}>
          {copy.previous}
        </a>
      ) : (
        <span aria-hidden="true" className={linkClassName(false)}>
          {copy.previous}
        </span>
      )}

      <span className="type-body-md text-mute-fg">
        {currentPage} / {totalPages}
      </span>

      {nextHref ? (
        <a className={linkClassName(true)} href={nextHref}>
          {copy.next}
        </a>
      ) : (
        <span aria-hidden="true" className={linkClassName(false)}>
          {copy.next}
        </span>
      )}
    </nav>
  );
}
