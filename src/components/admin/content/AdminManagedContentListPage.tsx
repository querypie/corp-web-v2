"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import ContentPreviewImage from "@/components/content/ContentPreviewImage";
import Input from "@/components/ui/Input";
import LoadingText from "@/components/ui/LoadingText";
import Switch from "@/components/ui/Switch";
import Tab from "@/components/ui/Tab";
import TabGroup from "@/components/ui/TabGroup";
import AdminContentPreview from "./AdminContentPreview";
import type { Locale } from "@/constants/i18n";
import {
  deleteManagedContent,
  getManagedContentDetail,
  reorderManagedContents,
  updateManagedContentStatus,
  updateManagedContentSortOrders,
  upsertManagedContent,
  useManagedContentsLoading,
  useManagedContents,
} from "@/features/content/clientStore";
import {
  formatPublicDate,
  getAdminCreateHref,
  getAdminDetailHref,
  getDownloadPreviewProps,
  getManagedCategoryLabel,
  getNewsFormatLabel,
  getWriterLabel,
  type ManagedContentCategorySlug,
  type ManagedContentEntry,
  type ManagedContentSection,
} from "@/features/content/data";
import { cloneAsAuthoredContent } from "@/features/content/cloneToAuthored";
import { renderTiptapHtml } from "@/features/content/tiptapHtml";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const localeBadgeClassName = {
  en: "border-[color:color-mix(in_srgb,var(--color-warning)_35%,transparent)] bg-bg-content text-warning",
  ko: "border-[color:color-mix(in_srgb,var(--color-point)_35%,transparent)] bg-bg-content text-point",
  ja: "border-[color:color-mix(in_srgb,var(--color-brand)_35%,transparent)] bg-bg-content text-brand",
} satisfies Record<"en" | "ko" | "ja", string>;

function SearchField({
  value,
  onChange,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    /* 리스트 상단 검색 필드 */
    <Input
      className="w-full min-w-[140px]"
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search content"
      type="text"
      value={value}
    />
  );
}

function DeleteConfirmDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    /* 리스트/미리보기에서 공통으로 쓰는 삭제 확인 모달 */
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgb(var(--color-overlay-rgb)/0.6)] px-5" onClick={onCancel}>
      <div className="w-full max-w-[300px] rounded-modal border border-border bg-[var(--color-bg-modal)] px-5 py-8" onClick={(event) => event.stopPropagation()}>
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="m-0 type-h3 text-fg">삭제하시겠습니까?</h2>
            <p className="m-0 type-body-md text-mute">이 작업은 되돌릴 수 없습니다.</p>
          </div>
          <div className="flex justify-center gap-3">
            <Button arrow={false} onClick={onCancel} style="round" variant="outline">
              취소
            </Button>
            <Button arrow={false} onClick={onConfirm} style="round" variant="secondary">
              확인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DuplicateConfirmDialog({
  isSubmitting = false,
  onCancel,
  onConfirm,
}: {
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgb(var(--color-overlay-rgb)/0.6)] px-5" onClick={onCancel}>
      <div className="w-full max-w-[320px] rounded-modal border border-border bg-[var(--color-bg-modal)] px-5 py-8" onClick={(event) => event.stopPropagation()}>
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="m-0 type-h3 text-fg">게시물을 복제할까요?</h2>
            <p className="m-0 whitespace-pre-line type-body-md text-mute">
              복사된 게시물은 비노출 상태로 저장됩니다.
              {"\n"}
              변경된 slug(URL) 확인해 주세요.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button arrow={false} onClick={onCancel} style="round" variant="outline">
              취소
            </Button>
            <Button arrow={false} disabled={isSubmitting} onClick={onConfirm} style="round" variant="secondary">
              {isSubmitting ? <LoadingText text="복제 중..." /> : "복제하기"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-mute">
      {children}
    </span>
  );
}

function ActionIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
      {children}
    </span>
  );
}

function getItemDisplayLocale(item: ManagedContentEntry): Locale {
  const locales = ["en", "ko", "ja"] as const;
  return (
    locales.find((locale) => item.title[locale].trim()) ??
    item.visibleLocales[0] ??
    "en"
  );
}

function matchesQuery(item: ManagedContentEntry, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return (["en", "ko", "ja"] as const).some((locale) =>
    item.title[locale].toLowerCase().includes(normalized) ||
    item.summary[locale].toLowerCase().includes(normalized),
  );
}

export function PreviewModal({
  item,
  initialLocale = "en",
  isLoading = false,
  onClose,
}: {
  initialLocale?: Locale;
  item: ManagedContentEntry;
  isLoading?: boolean;
  onClose: () => void;
}) {
  const [activeLocale, setActiveLocale] = useState<Locale>(initialLocale);
  const localizedRichTextHtml = renderTiptapHtml(item.bodyRichText[activeLocale] ?? "");
  const localizedBodyHtml = localizedRichTextHtml || (item.bodyHtml[activeLocale] ?? "");
  const localizedSummary = item.summary[activeLocale] ?? "";
  const localizedTitle = item.title[activeLocale] ?? "";

  useEffect(() => {
    setActiveLocale(initialLocale);
  }, [initialLocale, item.id, item.storageId]);

  return (
    /* 리스트 카드 클릭 시 퍼블릭 상세 형태로 보여주는 미리보기 모달 */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(var(--color-overlay-rgb)/0.72)] px-5 py-6" onClick={onClose}>
      <div
        className="flex max-h-[calc(100vh-48px)] w-full max-w-[980px] flex-col overflow-hidden rounded-[28px] border border-border bg-bg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-border px-5 py-4 md:px-6">
          <div className="flex items-center justify-between gap-4">
            <TabGroup>
              {(["en", "ko", "ja"] as const).map((locale) => (
                <Tab
                  key={locale}
                  onClick={() => setActiveLocale(locale)}
                  state={activeLocale === locale ? "on" : "off"}
                >
                  {locale.toUpperCase()}
                </Tab>
              ))}
            </TabGroup>
            <button
              aria-label="미리보기 닫기"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-button text-mute transition-colors hover:bg-bg-content hover:text-fg"
              onClick={onClose}
              type="button"
            >
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
                <path d="M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
              </svg>
            </button>
          </div>
        </div>
        <div className="overflow-auto px-5 py-5 md:px-6">
          {isLoading ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <LoadingText className="type-body-md" text="불러오는 중..." />
            </div>
          ) : (
            <AdminContentPreview
              key={`${item.id}-${activeLocale}`}
              bodyHtml={localizedBodyHtml}
              category={getManagedCategoryLabel(item.section, item.categorySlug, activeLocale)}
              contentType={item.contentType}
              date={formatPublicDate(activeLocale, item.dateIso)}
              {...getDownloadPreviewProps(item)}
              gatingLevel={item.gatingLevel}
              heroImageAlt={localizedTitle}
              heroImageSrc={item.imageSrc}
              hideHeroImage={item.hideHeroImage}
              section={item.section}
              summary={localizedSummary}
              title={localizedTitle}
              url={item.externalUrl || "#"}
              writer={item.section === "news" ? getNewsFormatLabel(item, activeLocale) : getWriterLabel(item)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ContentRow({
  activeLocale,
  isReorderMode,
  isTogglePending,
  index,
  item,
  onDelete,
  onDuplicate,
  onPreview,
  rowRef,
  onMoveDown,
  onMoveUp,
  onOpenDetail,
  onTogglePublished,
  showCategory,
}: {
  activeLocale: "en" | "ko" | "ja";
  isReorderMode: boolean;
  isTogglePending: boolean;
  index: number;
  item: ManagedContentEntry;
  onDelete: () => void;
  onDuplicate: () => void;
  onPreview: () => void;
  rowRef: (node: HTMLDivElement | null) => void;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onOpenDetail: () => void;
  onTogglePublished: () => void;
  showCategory: boolean;
}) {
  const isPublished = item.status === "published";
  const statusLabel = isPublished ? "On" : "Off";
  const localizedTitle = item.title[activeLocale].trim();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [menuOpen]);

  return (
    /* 관리자 콘텐츠 리스트의 개별 카드 row */
    <div
      className={cx(
        "flex flex-col gap-4 rounded-box border border-transparent bg-bg-content p-4 focus-visible:outline-none md:grid md:gap-6 md:px-5 md:py-5",
        !isReorderMode && "card-hover",
        isReorderMode ? "cursor-default" : "cursor-pointer",
        isReorderMode
          ? "md:grid-cols-[28px_132px_minmax(0,1.9fr)_128px_76px] md:items-center"
          : "md:grid-cols-[132px_minmax(0,1.8fr)_144px_116px] md:items-center",
      )}
      ref={rowRef}
      onClick={() => {
        if (isReorderMode) return;
        onOpenDetail();
      }}
      onKeyDown={(event) => {
        if (isReorderMode) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenDetail();
        }
      }}
      role={isReorderMode ? undefined : "button"}
      tabIndex={isReorderMode ? -1 : 0}
    >
      {isReorderMode ? (
        <div
          className="flex items-center justify-start md:flex-col md:justify-center md:gap-1"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <button className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-button text-[15px] leading-none text-mute transition-colors hover:bg-bg hover:text-fg" onClick={onMoveUp} type="button">
            ↑
          </button>
          <button className="ml-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-button text-[15px] leading-none text-mute transition-colors hover:bg-bg hover:text-fg md:ml-0" onClick={onMoveDown} type="button">
            ↓
          </button>
        </div>
      ) : null}

      <ContentPreviewImage
        alt={localizedTitle}
        className="block h-full w-full object-cover"
        containerClassName="content-thumbnail-frame w-full overflow-hidden rounded-button bg-bg-deep md:w-[132px]"
        src={item.imageSrc}
        useThumbnailFallback
      />

      <div className="min-w-0 self-center pr-0 md:pr-2">
        {showCategory ? (
          <p className="mb-2 mt-0 type-body-sm text-mute">
            {getManagedCategoryLabel(item.section, item.categorySlug, activeLocale)}
          </p>
        ) : null}
        <p className="m-0 type-body-md text-fg">
          <span>{localizedTitle}</span>
          {item.contentType === "outlink" ? <span aria-hidden="true" className="icon-outlink-mask ml-1 h-3.5 w-3.5 shrink-0 align-[-2px] text-mute" /> : null}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 md:contents">
        <div className="flex flex-col gap-2 md:self-center md:whitespace-nowrap">
          <div className="flex flex-wrap gap-1">
            {item.visibleLocales.slice(0, 3).map((locale) => (
              <span
                key={locale}
                className={cx(
                  "inline-flex h-[18px] items-center rounded-full border px-1.5 text-[10px] font-normal uppercase leading-none",
                  localeBadgeClassName[locale],
                )}
              >
                {locale}
              </span>
            ))}
          </div>
          <div className="type-body-md text-mute">{formatPublicDate(activeLocale, item.dateIso)}</div>
        </div>

        <div className="flex items-center justify-end gap-2 md:col-start-auto md:justify-between md:gap-3">
          <div className="flex flex-col items-center gap-2">
            <div
              className="inline-flex"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (isTogglePending) return;
                onTogglePublished();
              }}
            >
              <Switch checked={isPublished} disabled={isTogglePending} onChange={() => {}} size="compact" />
            </div>
            <span className={cx("type-body-sm", isPublished ? "text-fg" : "text-mute")}>
              {statusLabel}
            </span>
          </div>
          {!isReorderMode ? (
            <div className="relative" ref={menuRef}>
              <button
                aria-expanded={menuOpen}
                aria-label="더보기"
                className="inline-flex h-10 w-10 items-center justify-center rounded-button text-mute transition-colors hover:bg-bg hover:text-fg"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setMenuOpen((current) => !current);
                }}
                type="button"
              >
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <circle cx="10" cy="4" r="1.5" />
                  <circle cx="10" cy="10" r="1.5" />
                  <circle cx="10" cy="16" r="1.5" />
                </svg>
              </button>

              {menuOpen ? (
                <div
                  className="absolute right-0 top-full z-10 mt-2 flex w-max flex-col gap-2 overflow-hidden rounded-[8px] bg-[var(--color-bg-modal)] px-[30px] pb-[14px] pt-3 shadow-[0_12px_32px_rgba(0,0,0,0.32)]"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <button
                    className="flex items-center gap-2 whitespace-nowrap py-1 text-left type-body-md text-fg transition-colors hover:text-mute"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setMenuOpen(false);
                      onPreview();
                    }}
                    type="button"
                  >
                    <MenuIcon>
                      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                        <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.75" />
                      </svg>
                    </MenuIcon>
                    미리보기
                  </button>
                  <button
                    className="flex items-center gap-2 whitespace-nowrap py-1 text-left type-body-md text-fg transition-colors hover:text-mute"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setMenuOpen(false);
                      onDuplicate();
                    }}
                    type="button"
                  >
                    <MenuIcon>
                      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <rect x="9" y="9" width="10" height="10" rx="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                        <rect x="5" y="5" width="10" height="10" rx="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                      </svg>
                    </MenuIcon>
                    복제
                  </button>
                  <button
                    className="flex items-center gap-2 whitespace-nowrap py-1 text-left type-body-md text-fg transition-colors hover:text-mute"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setMenuOpen(false);
                      onDelete();
                    }}
                    type="button"
                  >
                    <MenuIcon>
                      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <path d="M4 7h16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                        <path d="M10 11v6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                        <path d="M14 11v6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                        <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                      </svg>
                    </MenuIcon>
                    삭제
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type Props = {
  categorySlug: ManagedContentCategorySlug | "all";
  initialItems?: ManagedContentEntry[];
  section: ManagedContentSection;
};

export default function AdminManagedContentListPage({
  categorySlug,
  initialItems,
  section,
}: Props) {
  const scopedCategorySlug = categorySlug === "all" ? "all" : categorySlug;
  const items = useManagedContents(section, initialItems, scopedCategorySlug, "list");
  const isLoading = useManagedContentsLoading(section, initialItems, scopedCategorySlug, "list");
  const [query, setQuery] = useState("");
  const [pendingDuplicateItem, setPendingDuplicateItem] = useState<ManagedContentEntry | null>(null);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<ManagedContentEntry | null>(null);
  const [previewItem, setPreviewItem] = useState<ManagedContentEntry | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [draftItems, setDraftItems] = useState<ManagedContentEntry[]>([]);
  const rowRefs = useRef(new Map<string, HTMLDivElement>());
  const previousPositions = useRef(new Map<string, number>());

  const categoryItems = useMemo(
    () =>
      items.filter((item) =>
        categorySlug === "all"
          ? item.section === section
          : item.section === section && item.categorySlug === categorySlug,
      ),
    [categorySlug, items, section],
  );

  const filteredItems = useMemo(() => {
    /* 카테고리와 검색어 기준으로 화면에 보여줄 항목을 계산한다. 언어 노출 상태로 리스트 항목을 숨기지 않는다. */
    return categoryItems.filter((item) => matchesQuery(item, query));
  }, [categoryItems, query]);
  const listCountLabel =
    categorySlug === "all"
      ? section === "demo"
        ? "Demo"
        : section === "documentation"
          ? "Documentation"
          : "News"
      : getManagedCategoryLabel(section, categorySlug, "en");

  const writeHref =
    getAdminCreateHref(section, categorySlug);

  function moveItem(itemId: string, direction: "down" | "up") {
    previousPositions.current = new Map(
      draftItems
        .map((item) => {
          const node = rowRefs.current.get(item.id);
          return node ? ([item.id, node.getBoundingClientRect().top] as const) : null;
        })
        .filter((entry): entry is readonly [string, number] => entry !== null),
    );

    const nextItems = [...draftItems];
    const currentIndex = nextItems.findIndex((item) => item.id === itemId);

    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= nextItems.length) return;

    [nextItems[currentIndex], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[currentIndex]];
    setDraftItems(nextItems);
  }

  const displayedItems = isReorderMode ? draftItems : filteredItems;

  function handleDuplicateItem(item: ManagedContentEntry) {
    setIsDuplicating(true);

    void getManagedContentDetail(item.section, item.id, {
      categorySlug: item.categorySlug,
      storageId: item.storageId,
    })
      .then((fullItem) => {
        if (!fullItem) {
          throw new Error("원본 콘텐츠를 불러오지 못했습니다.");
        }

        const siblingItems = items.filter(
          (entry) => entry.section === item.section && entry.categorySlug === item.categorySlug,
        );
        const duplicatedItem = cloneAsAuthoredContent(fullItem, siblingItems);
        const orderedWithDuplicate = siblingItems
          .slice()
          .sort((left, right) => left.sortOrder - right.sortOrder)
          .flatMap((entry) =>
            entry.id === item.id
              ? [duplicatedItem, entry]
              : [entry],
          );

        return upsertManagedContent(duplicatedItem)
          .then((savedItem) =>
            updateManagedContentSortOrders(
              orderedWithDuplicate.map((entry) =>
                entry.id === duplicatedItem.id ? savedItem : entry,
              ),
            ),
          );
      })
      .then(() => {
        setPendingDuplicateItem(null);
      })
      .catch((error: unknown) => {
        window.alert(
          error instanceof Error
            ? error.message
            : "콘텐츠를 복제하지 못했습니다. 다시 시도해 주세요.",
        );
      })
      .finally(() => {
        setIsDuplicating(false);
      });
  }

  function handlePreviewItem(item: ManagedContentEntry) {
    setPreviewItem(item);
    setIsPreviewLoading(true);

    void getManagedContentDetail(item.section, item.id, {
      categorySlug: item.categorySlug,
      storageId: item.storageId,
    })
      .then((fullItem) => {
        if (!fullItem) {
          throw new Error("콘텐츠를 불러오지 못했습니다.");
        }

        setPreviewItem(fullItem);
      })
      .catch((error: unknown) => {
        window.alert(
          error instanceof Error
            ? error.message
            : "미리보기를 불러오지 못했습니다. 다시 시도해 주세요.",
        );
        setPreviewItem(null);
      })
      .finally(() => {
        setIsPreviewLoading(false);
      });
  }

  async function handleDeleteItem(item: ManagedContentEntry) {
    await deleteManagedContent(item.id, item);
  }

  async function handleTogglePublished(item: ManagedContentEntry) {
    if (isStatusUpdating) {
      return;
    }

    const nextStatus = item.status === "published" ? "hidden" : "published";
    setIsStatusUpdating(true);

    try {
      await updateManagedContentStatus(item.id, nextStatus, item);
    } finally {
      setIsStatusUpdating(false);
    }
  }

  useLayoutEffect(() => {
    if (!isReorderMode || previousPositions.current.size === 0) return;

    displayedItems.forEach((item) => {
      const node = rowRefs.current.get(item.id);
      const previousTop = previousPositions.current.get(item.id);

      if (!node || previousTop === undefined) return;

      const currentTop = node.getBoundingClientRect().top;
      const delta = previousTop - currentTop;

      if (delta !== 0) {
        node.animate(
          [
            { transform: `translateY(${delta}px)` },
            { transform: "translateY(0)" },
          ],
          {
            duration: 220,
            easing: "ease-out",
          },
        );
      }
    });

    previousPositions.current.clear();
  }, [displayedItems, isReorderMode]);

  return (
    <section className="flex flex-col gap-4">
      {/* 리스트 페이지 상단 스티키 툴바 */}
      <header className="sticky top-[60px] z-30 -mx-5 overflow-x-auto bg-bg px-5 py-3 md:top-0 md:-mx-10 md:px-10">
        <div className="flex w-full min-w-0 flex-nowrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-3">
            <div className="w-[220px] min-w-[140px] shrink">
              <SearchField onChange={setQuery} value={query} />
            </div>
          </div>
          <div className="flex shrink-0 flex-nowrap items-center justify-end gap-3">
            {categorySlug !== "all" ? (
              <div className="flex shrink-0 flex-nowrap items-center gap-3">
                {isReorderMode ? (
                  <>
                    <Button arrow={false} className="shrink-0 justify-center whitespace-nowrap" onClick={() => {
                      setDraftItems(categoryItems);
                      setIsReorderMode(false);
                    }} style="round" variant="outline">
                      취소
                    </Button>
                    <Button arrow={false} className="shrink-0 justify-center whitespace-nowrap" onClick={() => {
                      void reorderManagedContents(draftItems)
                        .then(() => {
                          setIsReorderMode(false);
                        })
                        .catch((error: unknown) => {
                          window.alert(
                            error instanceof Error
                              ? error.message
                              : "순서를 저장하지 못했습니다. 다시 시도해 주세요.",
                          );
                        });
                    }} style="round" variant="secondary">
                      확인
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      arrow={false}
                      className="shrink-0 justify-center whitespace-nowrap"
                      onClick={() => {
                        setDraftItems(categoryItems);
                        setIsReorderMode(true);
                      }}
                      style="round"
                      variant="outline"
                    >
                      <ActionIcon>
                        <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <path d="M6.5 8.5 9.5 5.5l3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                          <path d="M9.5 6v12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                          <path d="M14.5 15.5 17.5 18.5l3-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                          <path d="M17.5 6v12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                        </svg>
                      </ActionIcon>
                      순서변경
                    </Button>
                    <a className="shrink-0" href={writeHref}>
                      <Button arrow={false} className="shrink-0 justify-center whitespace-nowrap" style="round" variant="secondary">
                        <ActionIcon>
                          <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
                            <path d="M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
                          </svg>
                        </ActionIcon>
                        글 작성
                      </Button>
                    </a>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-4">
        <p className="m-0 flex items-center gap-2 type-body-md text-mute">
          <span>{listCountLabel}</span>
          <span className="text-fg">{displayedItems.length}개</span>
        </p>

        {/* 실제 콘텐츠 리스트 / 빈 상태 영역 */}
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="flex min-h-[240px] items-center justify-center px-5 py-6 text-center">
              <LoadingText className="type-body-md" text="불러오는 중..." />
            </div>
          ) : displayedItems.length > 0 ? (
            displayedItems.map((item, index) => (
              <ContentRow
                activeLocale={getItemDisplayLocale(item)}
                isReorderMode={isReorderMode}
                isTogglePending={isStatusUpdating}
                key={item.id}
                index={index}
                item={item}
                onDelete={() => setPendingDeleteItem(item)}
                onDuplicate={() => setPendingDuplicateItem(item)}
                onPreview={() => handlePreviewItem(item)}
                rowRef={(node) => {
                  if (node) {
                    rowRefs.current.set(item.id, node);
                  } else {
                    rowRefs.current.delete(item.id);
                  }
                }}
                onMoveDown={() => moveItem(item.id, "down")}
                onMoveUp={() => moveItem(item.id, "up")}
                onOpenDetail={() => {
                  window.location.assign(getAdminDetailHref(item.section, item.categorySlug, item.id));
                }}
                onTogglePublished={() => {
                  void handleTogglePublished(item).catch((error: unknown) => {
                    window.alert(
                      error instanceof Error
                        ? error.message
                        : "게시 상태를 변경하지 못했습니다. 다시 시도해 주세요.",
                    );
                  });
                }}
                showCategory={categorySlug === "all"}
              />
            ))
          ) : (
            <div className="flex min-h-[240px] items-center justify-center px-5 py-6 text-center">
              <p className="m-0 type-body-md text-mute">게시물이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {pendingDeleteItem ? (
        <DeleteConfirmDialog
          onCancel={() => setPendingDeleteItem(null)}
          onConfirm={() => {
            void handleDeleteItem(pendingDeleteItem)
              .then(() => {
                setPendingDeleteItem(null);
              })
              .catch((error: unknown) => {
                window.alert(
                  error instanceof Error
                    ? error.message
                    : "콘텐츠를 삭제하지 못했습니다. 다시 시도해 주세요.",
                );
              });
          }}
        />
      ) : null}

      {pendingDuplicateItem ? (
        <DuplicateConfirmDialog
          isSubmitting={isDuplicating}
          onCancel={() => setPendingDuplicateItem(null)}
          onConfirm={() => handleDuplicateItem(pendingDuplicateItem)}
        />
      ) : null}

      {previewItem ? (
        <PreviewModal
          initialLocale={getItemDisplayLocale(previewItem)}
          isLoading={isPreviewLoading}
          item={previewItem}
          onClose={() => {
            setPreviewItem(null);
            setIsPreviewLoading(false);
          }}
        />
      ) : null}

    </section>
  );
}
