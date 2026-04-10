"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import AdminHeader from "../../layout/admin/AdminHeader";
import Button from "../../common/Button";
import Input from "../../common/Input";
import LoadingText from "../../common/LoadingText";
import MermaidDiagram from "../../common/MermaidDiagram";
import Switch from "../../common/Switch";
import Tab from "../../common/Tab";
import TabGroup from "../../common/TabGroup";
import AdminContentPreview from "./AdminContentPreview";
import {
  persistManagedContents,
  deleteManagedContent,
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
  getManagedCategoryLabel,
  getLocalizedContent,
  getWriterLabel,
  type ManagedContentCategorySlug,
  type ManagedContentEntry,
  type ManagedContentSection,
} from "@/features/content/data";
import { cloneAsAuthoredContent } from "@/features/content/cloneToAuthored";
import { splitLegacyQuotedListLine } from "@/features/content/legacyQuoteList";
import { shouldRenderMermaid } from "@/features/content/mermaid";
import { parseMarkdownTable } from "@/features/content/markdownTable";
import {
  CONTENT_PREVIEW_BLOCKQUOTE_CLASS,
  CONTENT_PREVIEW_BODY_CLASS,
  CONTENT_PREVIEW_CODEBLOCK_CLASS,
  CONTENT_PREVIEW_H1_CLASS,
  CONTENT_PREVIEW_H2_CLASS,
  CONTENT_PREVIEW_H3_CLASS,
  CONTENT_PREVIEW_H1_TOP_PADDING,
  CONTENT_PREVIEW_H2_TOP_PADDING,
  CONTENT_PREVIEW_H3_TOP_PADDING,
  CONTENT_PREVIEW_OL_CLASS,
  CONTENT_PREVIEW_RICH_CLASS,
  CONTENT_PREVIEW_TABLE_CELL_CLASS,
  CONTENT_PREVIEW_TABLE_CLASS,
  CONTENT_PREVIEW_TABLE_HEADER_CELL_CLASS,
  CONTENT_PREVIEW_TABLE_ROW_CLASS,
  CONTENT_PREVIEW_TABLE_WRAPPER_CLASS,
  CONTENT_PREVIEW_UL_CLASS,
} from "@/features/content/previewStyles";
import { highlightCodeBlocksInHtml, renderLineNumberedCodeBlock } from "@/features/content/codeHighlight";
import { normalizeFencedCodeLines, splitMarkdownBlocks } from "@/features/content/markdownBlocks";
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
      className="w-full md:max-w-[320px]"
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

function renderInlineMarkdown(text: string) {
  if (/^(\*\*|__)[\s\S]+(\*\*|__)$/.test(text)) {
    return <strong className="font-semibold text-fg">{renderInlineMarkdown(text.slice(2, -2))}</strong>;
  }

  if (/^(\*|_)[\s\S]+(\*|_)$/.test(text)) {
    return <em className="italic text-fg">{renderInlineMarkdown(text.slice(1, -1))}</em>;
  }

  const tokens = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g);

  return tokens.filter(Boolean).map((token, index) => {
    if (/^\[[^\]]+\]\([^)]+\)$/.test(token)) {
      const match = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (!match) return token;
      return (
        <a key={index} className="text-fg underline underline-offset-4" href={match[2]}>
          {match[1]}
        </a>
      );
    }

    if (/^`[^`]+`$/.test(token)) {
      return (
        <code key={index} className="rounded-[8px] bg-bg-content px-2 py-1 type-content-mono text-fg">
          {token.slice(1, -1)}
        </code>
      );
    }

    if (/^(\*\*|__)[\s\S]+(\*\*|__)$/.test(token)) {
      return (
        <strong key={index} className="font-semibold text-fg">
          {token.slice(2, -2)}
        </strong>
      );
    }

    if (/^(\*|_)[\s\S]+(\*|_)$/.test(token)) {
      return (
        <em key={index} className="italic text-fg">
          {token.slice(1, -1)}
        </em>
      );
    }

    return token;
  });
}

function normalizeContentAssetSrc(src: string) {
  return src.startsWith("public/") ? `/${src.slice("public/".length)}` : src;
}

function parseMarkdownImage(block: string) {
  const legacyFigureLabelMatch = block.match(/^!\[\[([^\]]+)\]\s*([^\]]+)\]\(([^)]+)\)$/);

  if (legacyFigureLabelMatch) {
    const caption = `[${legacyFigureLabelMatch[1]}] ${legacyFigureLabelMatch[2]}`.trim();
    return {
      alt: caption,
      caption,
      src: normalizeContentAssetSrc(legacyFigureLabelMatch[3]),
    };
  }

  const legacyBracketMatch = block.match(/^!\[\[(.+)\]\(([^)]+)\)$/);

  if (legacyBracketMatch) {
    return {
      alt: legacyBracketMatch[1],
      src: normalizeContentAssetSrc(legacyBracketMatch[2]),
    };
  }

  const doubleBracketMatch = block.match(/^!\[\[(.+)\]\]\(([^)]+)\)$/);

  if (doubleBracketMatch) {
    return {
      alt: doubleBracketMatch[1],
      src: normalizeContentAssetSrc(doubleBracketMatch[2]),
    };
  }

  const standardMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);

  if (standardMatch) {
    return {
      alt: standardMatch[1],
      src: normalizeContentAssetSrc(standardMatch[2]),
    };
  }

  return null;
}

function PreviewMarkdown({ markdown }: { markdown: string }) {
  const blocks = splitMarkdownBlocks(markdown);

  return (
    /* 카드 클릭 시 뜨는 모달 내부에서 본문 미리보기 렌더링 */
    <div className="flex flex-col gap-4 text-fg">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n");
        const firstLine = lines[0] ?? "";
        const trimmedBlock = block.trim();
        const imageMatch = parseMarkdownImage(trimmedBlock);

        if (imageMatch) {
          const caption = imageMatch.caption ?? imageMatch.alt;
          return <figure key={blockIndex} className="m-0 flex flex-col gap-3"><div className="overflow-hidden rounded-box bg-bg-content"><img alt={imageMatch.alt} className="block h-full w-full object-cover" src={imageMatch.src} /></div>{caption ? <figcaption className="m-0 text-center type-content-caption text-mute-fg">{caption}</figcaption> : null}</figure>;
        }

        if (/^\s*```/.test(firstLine) && /^\s*```\s*$/.test(lines[lines.length - 1] ?? "")) {
          const language = firstLine.replace(/^```/, "").trim();
          const code = normalizeFencedCodeLines(firstLine, lines.slice(1, -1)).join("\n");

          if (shouldRenderMermaid(code, language)) {
            return <MermaidDiagram key={blockIndex} code={code} />;
          }

          return <div key={blockIndex} className={CONTENT_PREVIEW_CODEBLOCK_CLASS} dangerouslySetInnerHTML={{ __html: renderLineNumberedCodeBlock(code, language) }} />;
        }

        if (/^---+$/.test(block) || /^\*\*\*+$/.test(block)) {
          return <hr key={blockIndex} className="border-0 border-t border-border" />;
        }

        if (block.startsWith("# ")) {
          return <h1 key={blockIndex} className={cx(CONTENT_PREVIEW_H1_CLASS, blockIndex > 0 && CONTENT_PREVIEW_H1_TOP_PADDING)}>{renderInlineMarkdown(block.replace(/^#\s+/, ""))}</h1>;
        }

        if (block.startsWith("## ")) {
          return <h2 key={blockIndex} className={cx(CONTENT_PREVIEW_H2_CLASS, blockIndex > 0 && CONTENT_PREVIEW_H2_TOP_PADDING)}>{renderInlineMarkdown(block.replace(/^##\s+/, ""))}</h2>;
        }

        if (block.startsWith("### ")) {
          return <h3 key={blockIndex} className={cx(CONTENT_PREVIEW_H3_CLASS, blockIndex > 0 && CONTENT_PREVIEW_H3_TOP_PADDING)}>{renderInlineMarkdown(block.replace(/^###\s+/, ""))}</h3>;
        }

        if (lines.every((line) => /^>\s?/.test(line))) {
          const quoteLines = lines.flatMap((line) => splitLegacyQuotedListLine(line.replace(/^>\s?/, "")));

          if (
            quoteLines.every((line) => /^\d+\.\s+/.test(line))
          ) {
            return <blockquote key={blockIndex} className={CONTENT_PREVIEW_BLOCKQUOTE_CLASS}><ol className={CONTENT_PREVIEW_OL_CLASS}>{quoteLines.map((line, idx) => <li key={idx}>{renderInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>)}</ol></blockquote>;
          }

          if (quoteLines.every((line) => /^\s*[-*]\s+/.test(line))) {
            return <blockquote key={blockIndex} className={CONTENT_PREVIEW_BLOCKQUOTE_CLASS}><ul className={CONTENT_PREVIEW_UL_CLASS}>{quoteLines.map((line, idx) => <li key={idx}>{renderInlineMarkdown(line.replace(/^\s*[-*]\s+/, ""))}</li>)}</ul></blockquote>;
          }

          return <blockquote key={blockIndex} className={CONTENT_PREVIEW_BLOCKQUOTE_CLASS}>{quoteLines.map((line, idx) => <p key={idx} className="m-0">{renderInlineMarkdown(line)}</p>)}</blockquote>;
        }

        if (lines.every((line) => /^\d+\.\s+/.test(line))) {
          return <ol key={blockIndex} className={CONTENT_PREVIEW_OL_CLASS}>{lines.map((line, idx) => <li key={idx}>{renderInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>)}</ol>;
        }

        if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
          return <ul key={blockIndex} className={CONTENT_PREVIEW_UL_CLASS}>{lines.map((line, idx) => <li key={idx} className="type-content-body text-fg">{renderInlineMarkdown(line.replace(/^\s*[-*]\s+/, ""))}</li>)}</ul>;
        }
        const table = parseMarkdownTable(lines);
        if (table) {
          const { bodyRows, headerRow } = table;

          return (
            <div key={blockIndex} className={CONTENT_PREVIEW_TABLE_WRAPPER_CLASS}>
              <table className={CONTENT_PREVIEW_TABLE_CLASS}>
                <thead>
                  <tr className={CONTENT_PREVIEW_TABLE_ROW_CLASS}>
                    {headerRow.map((cell, cellIndex) => (
                      <th key={cellIndex} className={CONTENT_PREVIEW_TABLE_HEADER_CELL_CLASS}>
                        {renderInlineMarkdown(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, rowIndex) => (
                    <tr key={rowIndex} className={CONTENT_PREVIEW_TABLE_ROW_CLASS}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className={CONTENT_PREVIEW_TABLE_CELL_CLASS}>
                          {renderInlineMarkdown(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return <p key={blockIndex} className={CONTENT_PREVIEW_BODY_CLASS}>{lines.map((line, idx) => <span key={idx}>{renderInlineMarkdown(line)}{idx < lines.length - 1 ? <br /> : null}</span>)}</p>;
      })}
    </div>
  );
}

function normalizeContentHtml(html: string) {
  const normalized = html.replace(
    /(src=|href=)(["'])public\//g,
    (_, attribute, quote) => `${attribute}${quote}/`,
  );

  return highlightCodeBlocksInHtml(normalized);
}

function PreviewHtml({ html }: { html: string }) {
  return (
    <div
      className={CONTENT_PREVIEW_RICH_CLASS}
      dangerouslySetInnerHTML={{ __html: normalizeContentHtml(html) }}
    />
  );
}

function PreviewModal({
  item,
  onClose,
}: {
  item: ManagedContentEntry;
  onClose: () => void;
}) {
  const [activeLocale, setActiveLocale] = useState<"en" | "ko" | "ja">("en");
  const localizedBodyHtml = getLocalizedContent(item.bodyHtml, activeLocale);
  const localizedBodyMarkdown = getLocalizedContent(item.bodyMarkdown, activeLocale);
  const useRichHtmlPreview =
    item.contentFormat === "tiptap" &&
    localizedBodyHtml.trim() !== "" &&
    localizedBodyHtml.trim() !== "<p></p>";

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
          <AdminContentPreview
            bodyHtml={localizedBodyHtml}
            bodyMarkdown={localizedBodyMarkdown}
            contentFormat={item.contentFormat}
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
        </div>
      </div>
    </div>
  );
}

function ContentRow({
  isReorderMode,
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
  isReorderMode: boolean;
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
  const isLegacyContent = item.section !== "news" && item.contentFormat === "markdown";
  const statusLabel = isPublished ? "게시중" : "비노출";
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
        <img alt={getLocalizedContent(item.title, "en")} className="block h-full w-full object-cover" src={getContentThumbnailSrc(item.imageSrc)} />
      </div>

      <div className="min-w-0 self-center pr-0 md:pr-2">
        {isLegacyContent ? (
          <p className="mb-2 mt-0 type-body-sm text-[var(--color-destructive)]">Legacy</p>
        ) : null}
        {showCategory ? (
          <p className="mb-2 mt-0 type-body-sm text-mute-fg">
            {getManagedCategoryLabel(item.section, item.categorySlug, "en")}
          </p>
        ) : null}
        <p className="m-0 type-body-lg text-fg">{getLocalizedContent(item.title, "en")}</p>
      </div>

      <div className="flex items-center justify-between gap-4 md:contents">
        <div className="type-body-md text-mute-fg md:self-center md:whitespace-nowrap">{formatPublicDate("en", item.dateIso)}</div>

        <div className="flex items-center justify-end gap-2 md:col-start-auto md:justify-between md:gap-3">
          <div className="flex flex-col items-center gap-2">
            <div
              className="inline-flex"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onTogglePublished();
              }}
            >
              <Switch checked={isPublished} onChange={() => {}} size="compact" />
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
  const items = useManagedContents(section, initialItems);
  const isLoading = useManagedContentsLoading(section);
  const isHydrated = useHydrated();
  const [query, setQuery] = useState("");
  const [pendingDuplicateItem, setPendingDuplicateItem] = useState<ManagedContentEntry | null>(null);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<ManagedContentEntry | null>(null);
  const [previewItem, setPreviewItem] = useState<ManagedContentEntry | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);
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
    if (!normalized) return categoryItems;
    return categoryItems.filter((item) =>
      getLocalizedContent(item.title, "en").toLowerCase().includes(normalized),
    );
  }, [categoryItems, query]);

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
    const duplicatedItem = cloneAsAuthoredContent(item, siblingItems);

    void persistManagedContents([duplicatedItem, ...reindexedItems])
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
    const nextStatus = item.status === "published" ? "hidden" : "published";
    await updateManagedContentStatus(item.id, nextStatus, item);
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
          <SearchField onChange={setQuery} value={query} />
          {categorySlug !== "all" ? (
            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
              {isReorderMode ? (
                <>
                  <Button arrow={false} className="w-full justify-center md:w-auto" onClick={() => {
                    setDraftItems(categoryItems);
                    setIsReorderMode(false);
                  }} style="round" variant="outline">
                    취소
                  </Button>
                  <Button arrow={false} className="w-full justify-center md:w-auto" onClick={() => {
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
                    className="w-full justify-center md:w-auto"
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
                    <Button arrow={false} className="w-full justify-center md:w-auto" style="round" variant="secondary">
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
                isReorderMode={isReorderMode}
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
                onOpenPreview={() => setPreviewItem(item)}
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
          onClose={() => setPreviewItem(null)}
        />
      ) : null}
    </section>
  );
}
