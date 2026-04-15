"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import AdminHeader from "../../layout/admin/AdminHeader";
import Button from "../../common/Button";
import Input from "../../common/Input";
import LoadingText from "../../common/LoadingText";
import Switch from "../../common/Switch";
import Tab from "../../common/Tab";
import TabGroup from "../../common/TabGroup";
import AdminContentPreview from "./AdminContentPreview";
import {
  persistManagedContents,
  deleteManagedContent,
  getManagedContentDetail,
  reorderManagedContents,
  updateManagedContentStatus,
  useManagedContentsLoading,
  useManagedContents,
} from "@/features/content/clientStore";
import {
  formatPublicDate,
  getAdminCategoryHref,
  getAdminDetailHref,
  getContentThumbnailSrc,
  getDownloadPreviewProps,
  hasLocalizedTitle,
  getManagedCategoryLabel,
  getLocalizedContent,
  getWriterLabel,
  type ManagedContentCategorySlug,
  type ManagedContentEntry,
  type ManagedContentSection,
} from "@/features/content/data";
import { cloneAsAuthoredContent } from "@/features/content/cloneToAuthored";
import useHydrated from "@/hooks/useHydrated";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

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
      className="w-full md:w-[260px]"
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
            <p className="m-0 type-body-md text-mute-fg">이 작업은 되돌릴 수 없습니다.</p>
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
            <p className="m-0 whitespace-pre-line type-body-md text-mute-fg">
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
    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-mute-fg">
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

function PreviewModal({
  item,
  isLoading = false,
  onClose,
}: {
  item: ManagedContentEntry;
  isLoading?: boolean;
  onClose: () => void;
}) {
  const [activeLocale, setActiveLocale] = useState<"en" | "ko" | "ja">("en");
  const localizedBodyHtml = getLocalizedContent(item.bodyHtml, activeLocale);

  return (
    /* 리스트 카드 클릭 시 퍼블릭 상세 형태로 보여주는 미리보기 모달 */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(var(--color-overlay-rgb)/0.72)] px-5 py-6" onClick={onClose}>
      <div
        className="flex max-h-[calc(100vh-48px)] w-full max-w-[980px] flex-col overflow-hidden rounded-[28px] border border-border bg-bg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-border px-5 py-4 md:px-6">
          <div className="flex justify-center">
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
          </div>
        </div>
        <div className="overflow-auto px-5 py-5 md:px-6">
          {isLoading ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <LoadingText className="type-body-md" text="불러오는 중..." />
            </div>
          ) : (
            <AdminContentPreview
              bodyHtml={localizedBodyHtml}
              date={formatPublicDate(activeLocale, item.dateIso)}
              {...getDownloadPreviewProps(item)}
              heroImageAlt={getLocalizedContent(item.title, activeLocale)}
              heroImageSrc={getContentThumbnailSrc(item.imageSrc)}
              hideHeroImage={item.hideHeroImage}
              section={item.section}
              summary={getLocalizedContent(item.summary, activeLocale)}
              title={getLocalizedContent(item.title, activeLocale)}
              url={item.externalUrl || "#"}
              writer={item.section === "news" ? "" : getWriterLabel(item)}
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
  rowRef,
  onMoveDown,
  onMoveUp,
  onOpenPreview,
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
  rowRef: (node: HTMLDivElement | null) => void;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onOpenPreview: () => void;
  onTogglePublished: () => void;
  showCategory: boolean;
}) {
  const isPublished = item.status === "published";
  const statusLabel = isPublished ? "On" : "Off";
  const localizedTitle = getLocalizedContent(item.title, activeLocale);
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
        onOpenPreview();
      }}
      onKeyDown={(event) => {
        if (isReorderMode) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenPreview();
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
          <button className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-button text-[15px] leading-none text-mute-fg transition-colors hover:bg-bg hover:text-fg" onClick={onMoveUp} type="button">
            ↑
          </button>
          <button className="ml-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-button text-[15px] leading-none text-mute-fg transition-colors hover:bg-bg hover:text-fg md:ml-0" onClick={onMoveDown} type="button">
            ↓
          </button>
        </div>
      ) : null}

      <div className="content-thumbnail-frame w-full overflow-hidden rounded-thumb bg-bg-deep md:w-[132px]">
        <img alt={localizedTitle} className="block h-full w-full object-cover" src={getContentThumbnailSrc(item.imageSrc)} />
      </div>

      <div className="min-w-0 self-center pr-0 md:pr-2">
        {showCategory ? (
          <p className="mb-2 mt-0 type-body-sm text-mute-fg">
            {getManagedCategoryLabel(item.section, item.categorySlug, activeLocale)}
          </p>
        ) : null}
        <p className="m-0 type-body-lg text-fg">{localizedTitle}</p>
      </div>

      <div className="flex items-center justify-between gap-4 md:contents">
        <div className="type-body-md text-mute-fg md:self-center md:whitespace-nowrap">{formatPublicDate(activeLocale, item.dateIso)}</div>

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
            <span className={cx("type-body-sm", isPublished ? "text-fg" : "text-mute-fg")}>
              {statusLabel}
            </span>
          </div>
          {!isReorderMode ? (
            <div className="relative" ref={menuRef}>
              <button
                aria-expanded={menuOpen}
                aria-label="더보기"
                className="inline-flex h-10 w-10 items-center justify-center rounded-button text-mute-fg transition-colors hover:bg-bg hover:text-fg"
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
                  <a
                    className="flex items-center gap-2 whitespace-nowrap py-1 text-left type-body-md text-fg transition-colors hover:text-mute-fg"
                    href={getAdminDetailHref(item.section, item.categorySlug, item.id)}
                  >
                    <MenuIcon>
                      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <path d="M12 20h9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
                      </svg>
                    </MenuIcon>
                    수정
                  </a>
                  <button
                    className="flex items-center gap-2 whitespace-nowrap py-1 text-left type-body-md text-fg transition-colors hover:text-mute-fg"
                    onClick={onDuplicate}
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
                    className="flex items-center gap-2 whitespace-nowrap py-1 text-left type-body-md text-fg transition-colors hover:text-mute-fg"
                    onClick={onDelete}
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
  description: string;
  initialItems?: ManagedContentEntry[];
  section: ManagedContentSection;
  title: string;
};

export default function AdminManagedContentListPage({
  categorySlug,
  description,
  initialItems,
  section,
  title,
}: Props) {
  const scopedCategorySlug = categorySlug === "all" ? "all" : categorySlug;
  const items = useManagedContents(section, initialItems, scopedCategorySlug, "list");
  const isLoading = useManagedContentsLoading(section, initialItems, scopedCategorySlug, "list");
  const isHydrated = useHydrated();
  const [query, setQuery] = useState("");
  const [pendingDuplicateItem, setPendingDuplicateItem] = useState<ManagedContentEntry | null>(null);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<ManagedContentEntry | null>(null);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [previewItem, setPreviewItem] = useState<ManagedContentEntry | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [activeLocale, setActiveLocale] = useState<"en" | "ko" | "ja">("en");
  const [draftItems, setDraftItems] = useState<ManagedContentEntry[]>([]);
  const rowRefs = useRef(new Map<string, HTMLDivElement>());
  const previousPositions = useRef(new Map<string, number>());

  const categoryItems = useMemo(
    () =>
      categorySlug === "all"
        ? items
        : items.filter(
            (item) => item.section === section && item.categorySlug === categorySlug,
          ),
    [categorySlug, items, section],
  );

  const filteredItems = useMemo(() => {
    /* 카테고리와 검색어 기준으로 화면에 보여줄 항목을 계산한다 */
    const normalized = query.trim().toLowerCase();
    const localeVisibleItems = categoryItems.filter((item) => hasLocalizedTitle(item.title, activeLocale));

    if (!normalized) return localeVisibleItems;

    return localeVisibleItems.filter((item) =>
      getLocalizedContent(item.title, activeLocale).toLowerCase().includes(normalized),
    );
  }, [activeLocale, categoryItems, query]);

  const writeHref =
    section === "news"
      ? "/admin/news/new"
        : categorySlug === "all"
          ? getAdminCategoryHref(section, section === "demo" ? "use-cases" : "blogs") + "/new"
          : getAdminCategoryHref(section, categorySlug) + "/new";

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

    void getManagedContentDetail(item.section, item.id)
      .then((fullItem) => {
        if (!fullItem) {
          throw new Error("원본 콘텐츠를 불러오지 못했습니다.");
        }

        const siblingItems = items.filter(
          (entry) => entry.section === item.section && entry.categorySlug === item.categorySlug,
        );
        const reindexedItems = items.map((entry) =>
          entry.section === item.section &&
          entry.categorySlug === item.categorySlug &&
          entry.sortOrder >= item.sortOrder
            ? { ...entry, sortOrder: entry.sortOrder + 1 }
            : entry,
        );
        const duplicatedItem = cloneAsAuthoredContent(fullItem, siblingItems);

        return persistManagedContents([duplicatedItem, ...reindexedItems], {
          preserveExistingBodies: true,
        });
      })
      .then(() => {
        setPendingDuplicateItem(null);
        setPreviewItem(null);
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

  function handleOpenPreview(item: ManagedContentEntry) {
    setPreviewItem(item);
    setIsPreviewLoading(true);

    void getManagedContentDetail(item.section, item.id)
      .then((detailItem) => {
        setPreviewItem(detailItem ?? item);
      })
      .catch(() => {
        setPreviewItem(item);
      })
      .finally(() => {
        setIsPreviewLoading(false);
      });
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
      {/* 리스트 페이지 헤더 */}
      <AdminHeader description={description} title={title} />

      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <SearchField onChange={setQuery} value={query} />
            <TabGroup className="self-start">
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
          </div>
          {categorySlug !== "all" ? (
            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
              {isReorderMode ? (
                <>
                  <Button arrow={false} className="w-full shrink-0 justify-center whitespace-nowrap md:w-auto" onClick={() => {
                    setDraftItems(categoryItems);
                    setIsReorderMode(false);
                  }} style="round" variant="outline">
                    취소
                  </Button>
                  <Button arrow={false} className="w-full shrink-0 justify-center whitespace-nowrap md:w-auto" onClick={() => {
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
                    className="w-full shrink-0 justify-center whitespace-nowrap md:w-auto"
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
                  <a className="w-full md:w-auto" href={writeHref}>
                    <Button arrow={false} className="w-full shrink-0 justify-center whitespace-nowrap md:w-auto" style="round" variant="secondary">
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

        <p className="m-0 type-body-md text-mute-fg">
          <span className="text-fg">{displayedItems.length}개</span> 컨텐츠
        </p>

        {/* 실제 콘텐츠 리스트 / 빈 상태 영역 */}
        <div className="flex flex-col gap-3">
          {!isHydrated ? (
            <div className="flex min-h-[240px] items-center justify-center px-5 py-6 text-center" />
          ) : isLoading ? (
            <div className="flex min-h-[240px] items-center justify-center px-5 py-6 text-center">
              <LoadingText className="type-body-md" text="불러오는 중..." />
            </div>
          ) : displayedItems.length > 0 ? (
            displayedItems.map((item, index) => (
              <ContentRow
                activeLocale={activeLocale}
                isReorderMode={isReorderMode}
                isTogglePending={isStatusUpdating}
                key={item.id}
                index={index}
                item={item}
                onDelete={() => setPendingDeleteItem(item)}
                onDuplicate={() => setPendingDuplicateItem(item)}
                rowRef={(node) => {
                  if (node) {
                    rowRefs.current.set(item.id, node);
                  } else {
                    rowRefs.current.delete(item.id);
                  }
                }}
                onMoveDown={() => moveItem(item.id, "down")}
                onMoveUp={() => moveItem(item.id, "up")}
                onOpenPreview={() => handleOpenPreview(item)}
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
              <p className="m-0 type-body-md text-mute-fg">게시물이 없습니다.</p>
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
                setPreviewItem((current) => (current?.id === pendingDeleteItem.id ? null : current));
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

      {/* 카드 클릭 미리보기 모달 */}
      {previewItem ? (
        <PreviewModal
          item={previewItem}
          isLoading={isPreviewLoading}
          onClose={() => setPreviewItem(null)}
        />
      ) : null}
    </section>
  );
}
