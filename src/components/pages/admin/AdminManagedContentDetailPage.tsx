"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../../layout/admin/AdminHeader";
import Button from "../../common/Button";
import Select from "../../common/Select";
import Tab from "../../common/Tab";
import TiptapEditor from "../../common/TiptapEditor";
import { useAdminNavigationGuard } from "../../layout/admin/AdminNavigationGuard";
import {
  upsertManagedContent,
  useManagedContents,
} from "@/features/content/clientStore";
import {
  createEmptyManagedContentDraft,
  ensureUniqueSlug,
  getAdminDetailHref,
  formatPublicDate,
  getAdminCategoryHref,
  getContentThumbnailSrc,
  getNextSortOrder,
  getManagedCategoryLabel,
  getLocalizedContent,
  getPublicListHref,
  getWriterLabel,
  slugifyTitle,
  type ManagedContentCategorySlug,
  type ManagedContentEntry,
  type ManagedContentSection,
  type ManagedContentType,
} from "@/features/content/data";
import { cloneAsAuthoredContent } from "@/features/content/cloneToAuthored";
import { convertMarkdownToTiptap } from "@/features/content/markdownToTiptap";
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
  CONTENT_PREVIEW_UL_CLASS,
} from "@/features/content/previewStyles";
import { highlightCodeBlocksInHtml, renderLineNumberedCodeBlock } from "@/features/content/codeHighlight";
import { normalizeFencedCodeLines, splitMarkdownBlocks } from "@/features/content/markdownBlocks";

type DialogState =
  | { type: "cancel" }
  | { description: string; highlightedLines?: string[]; title: string; type: "alert" };

const AI_INSTRUCTION_DEFAULT =
  "다음 규칙을 지켜 마크다운 초안을 작성해 주세요.\n- 결과는 마크다운만 사용합니다.\n- 제목 구조를 포함합니다.\n- 필요한 경우 리스트를 사용합니다.\n- 시작 부분에 짧은 요약 문단을 넣습니다.\n- HTML은 사용하지 않습니다.\n- 과도한 수식, 이모지, 장식적 문구는 사용하지 않습니다.";

const AI_SETUP_HELPER_TEXT =
  "작동하지 않으면 루트의 .env.local에 OPENAI_API_KEY를 추가하고 개발 서버를 다시 시작하세요.";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ButtonSpinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  );
}

function getEditingLocalizedValue(
  content: { en: string; ja: string; ko: string },
  locale: "en" | "ko" | "ja",
) {
  return content[locale] ?? "";
}

function serializeDirtyCheckTarget(form: ManagedContentEntry) {
  return JSON.stringify({
    authorName: form.authorName,
    authorRole: form.authorRole,
    bodyHtml: form.bodyHtml,
    bodyMarkdown: form.bodyMarkdown,
    bodyRichText: form.bodyRichText,
    contentFormat: form.contentFormat,
    contentType: form.contentType,
    dateIso: form.dateIso,
    externalUrl: form.externalUrl,
    hideHeroImage: form.hideHeroImage,
    id: form.id,
    imageSrc: form.imageSrc,
    storageId: form.storageId ?? null,
    summary: form.summary,
    title: form.title,
  });
}

function ConfirmDialog({
  className,
  cancelLabel = "닫기",
  confirmLabel,
  description,
  highlightedLines,
  onCancel,
  onConfirm,
  title,
}: {
  className?: string;
  cancelLabel?: string;
  confirmLabel: string;
  description: string;
  highlightedLines?: string[];
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
}) {
  return (
    /* 취소/검증 경고에 공통으로 쓰는 확인 모달 */
    <div className={cx("fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,9,10,0.6)] px-5", className)} onClick={onCancel}>
      <div className="w-full max-w-[320px] rounded-modal bg-bg-content px-5 py-8" onClick={(event) => event.stopPropagation()}>
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="m-0 type-h3 text-fg">{title}</h2>
            <p className="m-0 whitespace-pre-line type-body-md text-mute-fg">{description}</p>
            {highlightedLines?.length ? (
              <div className="flex flex-col items-center gap-1 text-center">
                {highlightedLines.map((line) => (
                  <p key={line} className="m-0 type-body-md text-fg">
                    {line}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
            <Button size="default" arrow={false} className="w-full justify-center sm:w-auto" onClick={onCancel} style="round" variant="outline">
              {cancelLabel}
            </Button>
            <Button size="default" arrow={false} className="w-full justify-center sm:w-auto" onClick={onConfirm} style="round" variant="secondary">
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AiDraftDialog({
  bodyValue,
  inputValue,
  instructionValue,
  isGenerating,
  onApply,
  onBodyChange,
  onCancel,
  onGenerate,
  onInputChange,
  onInstructionChange,
}: {
  bodyValue: string;
  inputValue: string;
  instructionValue: string;
  isGenerating: boolean;
  onApply: () => void;
  onBodyChange: (value: string) => void;
  onCancel: () => void;
  onGenerate: () => void;
  onInputChange: (value: string) => void;
  onInstructionChange: (value: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(8,9,10,0.68)] px-5 py-6">
      <div
        className="flex max-h-[min(760px,calc(100vh-48px))] w-full max-w-[760px] flex-col overflow-hidden rounded-modal border border-border bg-bg px-5 py-5 md:px-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pr-1">
          <TextField
            label="제목"
            onChange={onInputChange}
            value={inputValue}
          />
          <TextAreaField
            helperText="추가로 지시하고 싶은 사항을 넣으세요."
            label="보조 지시문"
            onChange={onInstructionChange}
            rowsClassName="min-h-[140px]"
            value={instructionValue}
          />
          <p className="m-0 type-body-sm text-mute-fg">{AI_SETUP_HELPER_TEXT}</p>
          <div className="flex justify-center">
            <Button
              arrow={false}
              className="justify-center"
              onClick={onGenerate}
              style="round"
              variant="secondary"
            >
              {isGenerating ? "생성 중..." : "AI로 생성"}
            </Button>
          </div>
          <TextAreaField
            helperText="Markdown"
            label="내용"
            onChange={onBodyChange}
            rowsClassName="min-h-[260px]"
            value={bodyValue}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button size="default" arrow={false} className="w-full justify-center sm:w-auto" onClick={onCancel} style="round" variant="outline">
            취소
          </Button>
          <Button size="default" arrow={false} className="w-full justify-center sm:w-auto" onClick={onApply} style="round" variant="primary">
            적용
          </Button>
        </div>
      </div>
    </div>
  );
}

function TextField({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    /* 단일 줄 텍스트 입력 필드 */
    <div className="flex w-full flex-col gap-[10px]">
      <label className="type-body-md text-fg">{label}</label>
      <input
        className="ui-field h-11 w-full rounded-button bg-bg-content px-3 type-body-md text-fg outline-none placeholder:text-mute-fg"
        onChange={(event) => onChange(event.target.value)}
        type="text"
        value={value}
      />
    </div>
  );
}

function TextAreaField({
  containerClassName,
  helperText,
  label,
  onChange,
  placeholder,
  textareaClassName,
  textareaWrapperClassName,
  rowsClassName,
  value,
}: {
  containerClassName?: string;
  helperText?: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  textareaClassName?: string;
  textareaWrapperClassName?: string;
  rowsClassName?: string;
  value: string;
}) {
  return (
    /* 마크다운 본문 입력 영역 */
    <div className={cx("flex w-full flex-col gap-[10px]", containerClassName)}>
      <div className="flex items-end justify-between gap-4">
        <label className="type-body-md text-fg">{label}</label>
        {helperText ? <span className="type-body-sm text-mute-fg">{helperText}</span> : null}
      </div>
      <div className={cx("relative", textareaWrapperClassName)}>
        <textarea
          className={cx("ui-field w-full resize-y rounded-button bg-bg-content px-4 py-4 type-body-md text-fg outline-none placeholder:text-mute-fg", rowsClassName ?? "min-h-[320px]", textareaClassName)}
          onChange={(event) => onChange(event.target.value)}
          value={value}
        />
      </div>
    </div>
  );
}

function InlineField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="grid items-center gap-2 md:grid-cols-[60px_minmax(0,1fr)]">
      <label className="type-body-md text-fg">{label}</label>
      {children}
    </div>
  );
}

function NewsPreviewCard({
  date,
  imageSrc,
  summary,
  title,
  url,
}: {
  date: string;
  imageSrc: string;
  summary: string;
  title: string;
  url: string;
}) {
  return (
    <a className="flex w-full flex-col gap-4 md:flex-row md:items-start md:gap-[30px]" href={url || "#"} rel="noreferrer noopener" target="_blank">
      <div className="order-2 flex min-w-0 flex-1 flex-col gap-[10px] md:order-1">
        <p className="m-0 type-body-md text-mute-fg">{date}</p>
        <h2 className="m-0 type-h2 text-fg">{title}</h2>
        <p className="m-0 type-body-md text-mute-fg">{summary}</p>
      </div>
      {imageSrc ? (
        <div className="content-thumbnail-frame order-1 w-full shrink-0 overflow-hidden rounded-thumb bg-bg-content md:order-2 md:w-[380px]">
          <img alt={title} className="block h-full w-full object-cover" src={imageSrc} />
        </div>
      ) : null}
    </a>
  );
}

function renderInlineMarkdown(text: string) {
  const tokens = text.split(/(<a\s+href="[^"]+"[^>]*>.*?<\/a>|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g);
  return tokens.filter(Boolean).map((token, index) => {
    if (/^<a\s+href="[^"]+"[^>]*>.*<\/a>$/.test(token)) {
      const match = token.match(/^<a\s+href="([^"]+)"[^>]*>([\s\S]*)<\/a>$/);
      if (!match) return token;
      return <a key={index} className="text-brand underline underline-offset-4 hover:text-fg" href={match[1]}>{match[2].replace(/<[^>]+>/g, "")}</a>;
    }
    if (/^\[[^\]]+\]\([^)]+\)$/.test(token)) {
      const match = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (!match) return token;
      return <a key={index} className="text-brand underline underline-offset-4 hover:text-fg" href={match[2]}>{match[1]}</a>;
    }
    if (/^`[^`]+`$/.test(token)) {
      return <code key={index} className="rounded-[8px] bg-bg-content px-2 py-1 type-content-mono text-fg">{token.slice(1, -1)}</code>;
    }
    if (/^(\*\*|__)[\s\S]+(\*\*|__)$/.test(token)) {
      return <strong key={index} className="font-semibold text-fg">{token.slice(2, -2)}</strong>;
    }
    if (/^(\*|_)[\s\S]+(\*|_)$/.test(token)) {
      return <em key={index} className="italic text-fg">{token.slice(1, -1)}</em>;
    }
    return token;
  });
}

function normalizeContentAssetSrc(src: string) {
  return src.startsWith("public/") ? `/${src.slice("public/".length)}` : src;
}

function normalizeContentHtml(html: string) {
  const normalized = html.replace(
    /(src=|href=)(["'])public\//g,
    (_, attribute, quote) => `${attribute}${quote}/`,
  );

  return highlightCodeBlocksInHtml(normalized);
}

function parseMarkdownImage(block: string) {
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
    /* 퍼블릭 상세와 유사한 형태로 마크다운을 미리 렌더링 */
    <div className="flex flex-col gap-4 text-fg">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n");
        const firstLine = lines[0] ?? "";
        const trimmedBlock = block.trim();
        const imageMatch = parseMarkdownImage(trimmedBlock);

        if (imageMatch) {
          return <figure key={blockIndex} className="m-0 overflow-hidden rounded-box bg-bg-content"><img alt={imageMatch.alt} className="block h-full w-full object-cover" src={imageMatch.src} /></figure>;
        }
        if (/^\s*```/.test(firstLine) && /^\s*```\s*$/.test(lines[lines.length - 1] ?? "")) {
          const language = firstLine.replace(/^```/, "").trim();
          const code = normalizeFencedCodeLines(firstLine, lines.slice(1, -1)).join("\n");
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
          return <blockquote key={blockIndex} className={CONTENT_PREVIEW_BLOCKQUOTE_CLASS}>{lines.map((line, idx) => <p key={idx} className="m-0">{renderInlineMarkdown(line.replace(/^>\s?/, ""))}</p>)}</blockquote>;
        }
        if (lines.every((line) => /^\d+\.\s+/.test(line))) {
          return <ol key={blockIndex} className={CONTENT_PREVIEW_OL_CLASS}>{lines.map((line, idx) => <li key={idx}>{renderInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>)}</ol>;
        }
        if (lines.every((line) => /^-\s+/.test(line))) {
          return <ul key={blockIndex} className={CONTENT_PREVIEW_UL_CLASS}>{lines.map((line, idx) => <li key={idx}>{renderInlineMarkdown(line.replace(/^-\s+/, ""))}</li>)}</ul>;
        }
        if (
          lines.length >= 2 &&
          lines.every((line) => /^\|.*\|$/.test(line.trim())) &&
          /^\|(\s*:?-{3,}:?\s*\|)+$/.test(lines[1].trim())
        ) {
          const rows = lines.map((line) =>
            line
              .trim()
              .slice(1, -1)
              .split("|")
              .map((cell) => cell.trim()),
          );
          const [headerRow, , ...bodyRows] = rows;

          return (
            <div key={blockIndex} className="overflow-x-auto rounded-[20px] border border-border bg-bg-content">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border">
                    {headerRow.map((cell, cellIndex) => (
                      <th key={cellIndex} className="px-4 py-3 type-content-body text-fg">
                        {renderInlineMarkdown(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-border last:border-b-0">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3 align-top type-content-body text-mute-fg">
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

function PreviewHtml({ html }: { html: string }) {
  return (
    <div
      className={CONTENT_PREVIEW_RICH_CLASS}
      dangerouslySetInnerHTML={{ __html: normalizeContentHtml(html) }}
    />
  );
}

function StatusBadge({ children }: { children: React.ReactNode }) {
  return <div className="rounded-full border border-border bg-bg-content px-3 py-1 type-body-sm leading-4 text-mute-fg">{children}</div>;
}

function PanelHeader({
  trailing,
}: {
  trailing?: React.ReactNode;
}) {
  return (
    /* 작성 폼/미리보기 상단 공통 헤더 */
    <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 md:px-6">
      {trailing}
    </div>
  );
}

function ContentPreview({
  bodyHtml,
  bodyMarkdown,
  contentFormat = "markdown",
  date,
  hideHeroImage = false,
  heroImageAlt,
  heroImageSrc,
  summary,
  title,
  writer,
}: {
  bodyHtml?: string;
  bodyMarkdown: string;
  contentFormat?: "markdown" | "tiptap";
  date: string;
  hideHeroImage?: boolean;
  heroImageAlt: string;
  heroImageSrc: string;
  summary?: string;
  title: string;
  writer: string;
}) {
  const hasRichHtmlContent =
    contentFormat === "tiptap" &&
    !!bodyHtml &&
    bodyHtml.trim() !== "<p></p>";

  return (
    /* 우측 미리보기 패널의 실제 콘텐츠 영역 */
    <div className="mx-auto flex w-full max-w-[680px] flex-col gap-[80px] pb-10">
      <div className="flex flex-col gap-[10px]">
        <h1 className="m-0 type-h1 leading-[42px] text-fg">{title}</h1>
        {summary ? <p className="m-0 type-body-md text-mute-fg">{summary}</p> : null}
        {writer ? <div className="type-body-md text-fg">{writer}</div> : null}
        {date ? <p className="m-0 type-body-md text-mute-fg">{date}</p> : null}
      </div>
      {heroImageSrc && !hideHeroImage ? (
        <div className="content-thumbnail-frame w-full overflow-hidden rounded-box bg-bg-content">
          <img alt={heroImageAlt} className="block h-full w-full object-cover" src={heroImageSrc} />
        </div>
      ) : null}
      {hasRichHtmlContent ? (
        <PreviewHtml html={bodyHtml} />
      ) : (
        <PreviewMarkdown markdown={bodyMarkdown} />
      )}
    </div>
  );
}

type Props = {
  categorySlug: ManagedContentCategorySlug;
  initialItems?: ManagedContentEntry[];
  itemId: string;
  section: ManagedContentSection;
};

export default function AdminManagedContentDetailPage({
  categorySlug,
  initialItems,
  itemId,
  section,
}: Props) {
  const router = useRouter();
  const { setHasUnsavedChanges } = useAdminNavigationGuard();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const items = useManagedContents(section, initialItems);
  const currentItem = useMemo(
    () =>
      itemId === "new"
        ? null
        : items.find(
            (item) =>
              item.id === itemId &&
              item.section === section &&
              item.categorySlug === categorySlug,
          ) ?? null,
    [categorySlug, itemId, items, section],
  );
  const [form, setForm] = useState<ManagedContentEntry>(() => createEmptyManagedContentDraft(section, categorySlug));
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [pendingThumbnailFile, setPendingThumbnailFile] = useState<File | null>(null);
  const [pendingThumbnailPreviewSrc, setPendingThumbnailPreviewSrc] = useState("");
  const [thumbnailName, setThumbnailName] = useState("");
  const [activeLocale, setActiveLocale] = useState<"en" | "ko" | "ja">("en");
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiInputValue, setAiInputValue] = useState("");
  const [aiInstructionValue, setAiInstructionValue] = useState(AI_INSTRUCTION_DEFAULT);
  const [aiBodyValue, setAiBodyValue] = useState("");
  const [aiPendingBodyValue, setAiPendingBodyValue] = useState<string | null>(null);
  const [aiConfirmType, setAiConfirmType] = useState<"discard" | "replace" | null>(null);
  const [copyConfirmLocale, setCopyConfirmLocale] = useState<"ko" | "ja" | null>(null);
  const [showConvertConfirm, setShowConvertConfirm] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const categoryLabel = getManagedCategoryLabel(section, categorySlug, "en");
  const initialFormState = useMemo(
    () => currentItem ?? createEmptyManagedContentDraft(section, categorySlug),
    [categorySlug, currentItem, section],
  );
  const hasUnsavedChanges =
    serializeDirtyCheckTarget(form) !== serializeDirtyCheckTarget(initialFormState) ||
    Boolean(pendingThumbnailFile);
  const showPreview = true;
  const isContentType = form.contentType === "content";
  const isOutlinkType = form.contentType === "outlink";
  const useRichEditor = isContentType && form.contentFormat === "tiptap";

  useEffect(() => {
    /* 수정 화면이면 기존 데이터를 채우고, 신규면 빈 초안을 준비한다 */
    if (pendingThumbnailPreviewSrc) {
      URL.revokeObjectURL(pendingThumbnailPreviewSrc);
      setPendingThumbnailPreviewSrc("");
    }
    setPendingThumbnailFile(null);

    if (currentItem) {
      setForm(currentItem);
      setThumbnailName(currentItem.imageSrc);
      return;
    }
    const draft = createEmptyManagedContentDraft(section, categorySlug);
    setForm(section === "news" ? { ...draft, contentFormat: "markdown", contentType: "outlink" } : draft);
    setThumbnailName("");
  }, [categorySlug, currentItem, section]);

  useEffect(() => {
    setHasUnsavedChanges(hasUnsavedChanges);

    return () => {
      setHasUnsavedChanges(false);
    };
  }, [hasUnsavedChanges, setHasUnsavedChanges]);

  useEffect(() => {
    return () => {
      if (pendingThumbnailPreviewSrc) {
        URL.revokeObjectURL(pendingThumbnailPreviewSrc);
      }
    };
  }, [pendingThumbnailPreviewSrc]);

  function updateForm<K extends keyof ManagedContentEntry>(key: K, value: ManagedContentEntry[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateLocalizedField(
    key: "title" | "summary" | "bodyMarkdown",
    locale: "en" | "ko" | "ja",
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [key]: {
        ...current[key],
        [locale]: value,
      },
    }));
  }

  function updateRichText(locale: "en" | "ko" | "ja", payload: { html: string; json: string }) {
    setForm((current) => ({
      ...current,
      bodyHtml: {
        ...current.bodyHtml,
        [locale]: payload.html,
      },
      bodyRichText: {
        ...current.bodyRichText,
        [locale]: payload.json,
      },
    }));
  }

  function handleContentTypeChange(nextType: ManagedContentType) {
    if (section === "news") {
      return;
    }

    setForm((current) => ({
      ...current,
      contentFormat: nextType === "content" ? "tiptap" : "markdown",
      contentType: nextType,
    }));
  }

  function applyCopyLocaleFromEn(targetLocale: "ko" | "ja") {
    setForm((current) => ({
      ...current,
      bodyHtml: {
        ...current.bodyHtml,
        [targetLocale]: current.bodyHtml.en,
      },
      bodyMarkdown: {
        ...current.bodyMarkdown,
        [targetLocale]: current.bodyMarkdown.en,
      },
      bodyRichText: {
        ...current.bodyRichText,
        [targetLocale]: current.bodyRichText.en,
      },
      summary: {
        ...current.summary,
        [targetLocale]: current.summary.en,
      },
      title: {
        ...current.title,
        [targetLocale]: current.title.en,
      },
    }));
  }

  function copyLocaleFromEn(targetLocale: "ko" | "ja") {
    const hasExistingContent = [
      getEditingLocalizedValue(form.title, targetLocale),
      getEditingLocalizedValue(form.summary, targetLocale),
      getEditingLocalizedValue(form.bodyMarkdown, targetLocale),
      getEditingLocalizedValue(form.bodyRichText, targetLocale),
      getEditingLocalizedValue(form.bodyHtml, targetLocale),
    ].some((value) => value.trim().length > 0 && value.trim() !== "<p></p>");

    if (hasExistingContent) {
      setCopyConfirmLocale(targetLocale);
      return;
    }

    applyCopyLocaleFromEn(targetLocale);
  }

  function openAiDialog() {
    setAiInputValue(getEditingLocalizedValue(form.title, activeLocale));
    setAiInstructionValue(AI_INSTRUCTION_DEFAULT);
    setAiBodyValue("");
    setAiPendingBodyValue(null);
    setAiConfirmType(null);
    setAiDialogOpen(true);
  }

  function closeAiDialog() {
    setAiDialogOpen(false);
    setAiPendingBodyValue(null);
    setAiConfirmType(null);
    setIsAiGenerating(false);
  }

  function buildAiDraft(title: string, instruction: string) {
    const normalizedTitle = title.trim() || "Untitled";
    const instructionLines = instruction
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    return [
      `# ${normalizedTitle}`,
      "",
      `## Summary`,
      `${normalizedTitle}에 대한 핵심 내용을 짧게 정리한 초안입니다. 실제 AI 연결 전까지는 편집 흐름을 검증하기 위한 기본 생성 결과를 제공합니다.`,
      "",
      `## Key Points`,
      "- 핵심 메시지를 한눈에 이해할 수 있도록 정리합니다.",
      "- 필요 시 목록과 소제목으로 내용을 구조화합니다.",
      "- 최종 게시 전 문맥과 사실관계를 직접 검토합니다.",
      "",
      `## Notes`,
      ...instructionLines.map((line) => `- ${line}`),
    ].join("\n");
  }

  function handleAiGenerate() {
    if (!aiInputValue.trim()) {
      setDialog({
        description: "제목을 입력한 뒤 AI 생성을 시도해 주세요.",
        title: "제목이 비어 있습니다.",
        type: "alert",
      });
      return;
    }

    setIsAiGenerating(true);
    void fetch("/api/admin/content/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instruction: aiInstructionValue,
        locale: activeLocale,
        title: aiInputValue,
      }),
    })
      .then(async (response) => {
        const payload = (await response.json()) as { error?: string; markdown?: string; status?: number };

        if (!response.ok || !payload.markdown) {
          const status = payload.status ?? response.status;

          if (status === 429) {
            throw new Error("OpenAI API 사용량 한도를 초과했습니다. OpenAI Billing/Usage에서 quota와 결제 상태를 확인해 주세요.");
          }

          if (status === 401 || status === 403) {
            throw new Error("OpenAI API 인증에 실패했습니다. API 키가 올바른지, 현재 프로젝트에서 사용할 수 있는 키인지 확인해 주세요.");
          }

          if (status === 500 && payload.error?.includes("OPENAI_API_KEY")) {
            throw new Error("OPENAI_API_KEY가 설정되지 않았습니다. 루트의 .env.local에 OPENAI_API_KEY를 추가하고 개발 서버를 다시 시작해 주세요.");
          }

          throw new Error(payload.error ?? "AI 초안을 생성하지 못했습니다.");
        }

        setAiBodyValue(payload.markdown);
      })
      .catch((error: unknown) => {
        setDialog({
          description:
            error instanceof Error
              ? error.message
              : "AI 초안을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.",
          title: "AI 생성에 실패했습니다.",
          type: "alert",
        });
      })
      .finally(() => {
        setIsAiGenerating(false);
      });
  }

  function handleAiCancel() {
    if (aiBodyValue.trim()) {
      setAiConfirmType("discard");
      return;
    }

    closeAiDialog();
  }

  function handleAiApply() {
    if (!aiBodyValue.trim()) {
      setDialog({
        description: "적용할 AI 초안이 없습니다. 먼저 내용을 생성하거나 직접 입력해 주세요.",
        title: "적용할 내용이 없습니다.",
        type: "alert",
      });
      return;
    }

    const currentBody = getEditingLocalizedValue(form.bodyMarkdown, activeLocale).trim();

    if (currentBody) {
      setAiPendingBodyValue(aiBodyValue);
      setAiConfirmType("replace");
      return;
    }

    updateLocalizedField("bodyMarkdown", activeLocale, aiBodyValue);
    closeAiDialog();
  }

  function handleDateButtonClick() {
    /* 브라우저 기본 날짜 피커를 버튼으로 연다 */
    const dateInput = dateInputRef.current as (HTMLInputElement & { showPicker?: () => void }) | null;
    if (!dateInput) return;
    if (typeof dateInput.showPicker === "function") {
      dateInput.showPicker();
      return;
    }
    dateInput.click();
  }

  function handleThumbnailChange(event: React.ChangeEvent<HTMLInputElement>) {
    /* 파일을 고르는 순간에는 로컬 프리뷰만 만들고, 실제 업로드는 저장 시점에 한다 */
    const file = event.target.files?.[0];
    if (!file) return;

    if (pendingThumbnailPreviewSrc) {
      URL.revokeObjectURL(pendingThumbnailPreviewSrc);
    }

    setPendingThumbnailFile(file);
    setPendingThumbnailPreviewSrc(URL.createObjectURL(file));
    setThumbnailName(file.name);
  }

  function clearThumbnail() {
    if (pendingThumbnailPreviewSrc) {
      URL.revokeObjectURL(pendingThumbnailPreviewSrc);
    }

    setPendingThumbnailFile(null);
    setPendingThumbnailPreviewSrc("");
    updateForm("imageSrc", "");
    setThumbnailName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function uploadThumbnail(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/uploads", {
      body: formData,
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("upload failed");
    }

    const payload = (await response.json()) as { src?: string };

    if (!payload.src) {
      throw new Error("missing src");
    }

    return payload.src;
  }

  function validateForm() {
    /* 저장/게시 전 필수 입력값만 간단히 검증한다 */
    const missing: string[] = [];
    if (!form.title.en.trim()) missing.push("제목 (EN)");
    if (isOutlinkType) {
      if (!form.summary.en.trim()) missing.push("설명 (EN)");
      if (!form.externalUrl.trim()) missing.push("URL");
    }
    return missing;
  }

  async function commit(status: "hidden" | "published", overrideForm?: ManagedContentEntry) {
    /* 저장/게시 저장을 같은 함수에서 상태만 바꿔 처리한다 */
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    const currentForm = overrideForm ?? form;
    const missing = validateForm();
    if (status === "published" && missing.length > 0) {
      setDialog({
        description: "다음 항목을 입력해야 저장할 수 있습니다.",
        highlightedLines: missing,
        title: "입력되지 않은 항목이 있습니다.",
        type: "alert",
      });
      setIsSaving(false);
      return;
    }

    let nextImageSrc = currentForm.imageSrc;

    if (pendingThumbnailFile) {
      try {
        nextImageSrc = await uploadThumbnail(pendingThumbnailFile);
      } catch {
        setDialog({
          description: "파일을 public/uploads 에 저장하지 못했습니다. 다시 시도해 주세요.",
          title: "썸네일 업로드에 실패했습니다.",
          type: "alert",
        });
        setIsSaving(false);
        return;
      }
    }

    const nextId = ensureUniqueSlug(
      itemId === "new"
        ? slugifyTitle(currentForm.title.en || currentForm.title.ko || currentForm.title.ja)
        : currentForm.id,
      items.filter((item) => item.section === section),
      itemId === "new" ? undefined : itemId,
    );

    const nextSortOrder =
      itemId === "new"
        ? 1
        : currentForm.sortOrder;

    if (itemId === "new") {
      for (const item of items.filter((entry) => entry.section === section && entry.categorySlug === categorySlug)) {
        await upsertManagedContent(
          {
            ...item,
            sortOrder: item.sortOrder + 1,
          },
          item.id,
        );
      }
    }

    const nextItem: ManagedContentEntry = {
      ...currentForm,
      categorySlug,
      id: nextId,
      imageSrc: nextImageSrc,
      section,
      sortOrder: nextSortOrder,
      status,
    };

    let savedItem = nextItem;

    try {
      savedItem = await upsertManagedContent(
        nextItem,
        itemId === "new" ? undefined : itemId,
      );
    } catch (error) {
      setDialog({
        description:
          error instanceof Error
            ? error.message
            : "콘텐츠를 저장하지 못했습니다. 다시 시도해 주세요.",
        title: "콘텐츠 저장에 실패했습니다.",
        type: "alert",
      });
      setIsSaving(false);
      return;
    }

    if (pendingThumbnailPreviewSrc) {
      URL.revokeObjectURL(pendingThumbnailPreviewSrc);
    }

    setPendingThumbnailFile(null);
    setPendingThumbnailPreviewSrc("");
    setHasUnsavedChanges(false);
    router.push(getAdminCategoryHref(section, categorySlug));
  }

  async function handleConvertToTiptap() {
    const currentForm: ManagedContentEntry = {
      ...form,
      categorySlug,
      section,
    };

    let nextImageSrc = currentForm.imageSrc;

    if (pendingThumbnailFile) {
      nextImageSrc = await uploadThumbnail(pendingThumbnailFile);
    }

    const siblingItems = items.filter(
      (entry) => entry.section === section && entry.categorySlug === categorySlug,
    );
    const duplicatedItem = cloneAsAuthoredContent(
      {
        ...currentForm,
        imageSrc: nextImageSrc,
      },
      siblingItems,
      { slugSuffix: "-tiptap" },
    );

    const nextItem: ManagedContentEntry = {
      ...duplicatedItem,
      sortOrder: getNextSortOrder(items, section, categorySlug),
      status: "hidden",
    };

    const savedItem = await upsertManagedContent(nextItem);

    if (pendingThumbnailPreviewSrc) {
      URL.revokeObjectURL(pendingThumbnailPreviewSrc);
    }

    setPendingThumbnailFile(null);
    setPendingThumbnailPreviewSrc("");
    setHasUnsavedChanges(false);
    router.push(getAdminDetailHref(section, categorySlug, savedItem.id));
  }

  const previewData = {
    bodyHtml: getEditingLocalizedValue(form.bodyHtml, activeLocale),
    bodyMarkdown: getEditingLocalizedValue(form.bodyMarkdown, activeLocale) || "작성한 본문이 이 영역에 실시간 표시됩니다.",
    contentFormat: form.contentFormat,
    date: formatPublicDate("ko", form.dateIso),
    hideHeroImage: form.hideHeroImage,
    heroImageAlt: getEditingLocalizedValue(form.title, activeLocale) || "Content thumbnail preview",
    heroImageSrc: pendingThumbnailPreviewSrc || form.imageSrc,
    summary: getEditingLocalizedValue(form.summary, activeLocale) || "",
    title: getEditingLocalizedValue(form.title, activeLocale) || "제목을 입력하면 여기에 반영됩니다.",
    url: form.externalUrl,
    writer: getWriterLabel({
      authorName: form.authorName || "작성자 이름",
      authorRole: form.authorRole || "직책",
    }) || "작성자 이름 / 직책",
  };
  return (
    <section className="flex flex-col gap-4">
      {/* 페이지 상단 설명과 현재 작업 상태를 표시 */}
      <AdminHeader
        description="콘텐츠 작성, 수정, 비노출 저장, 게시 전 미리보기를 이 화면에서 관리합니다."
        title={itemId === "new" ? `${categoryLabel} > Create Content` : `${categoryLabel} > Modify Content`}
      />

      {/* 미리보기 on/off에 따라 2단 또는 단일 컬럼으로 전환 */}
      <div className={cx("grid gap-5 md:gap-6", showPreview ? "xl:grid-cols-[minmax(0,780px)_minmax(0,1fr)]" : "mx-auto w-full max-w-[780px]")}>
        <div className="flex min-w-0 w-full max-w-[780px] self-start flex-col gap-5 overflow-visible rounded-[28px] border border-border bg-bg">
          <PanelHeader
            trailing={
              <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {section !== "news" ? (
                  <div className="w-full max-w-[220px]">
                    <Select
                      defaultValue={form.contentType}
                      onChange={(event) => handleContentTypeChange(event.target.value as ManagedContentType)}
                      options={[
                        { label: "컨텐츠(기본)", value: "content" },
                        { label: "아웃링크", value: "outlink" },
                      ]}
                    />
                  </div>
                ) : <div />}
                <div className="flex items-center gap-3 sm:justify-end">
                  {activeLocale !== "en" ? (
                    <Button
                      arrow={false}
                      className="justify-center"
                      onClick={() => copyLocaleFromEn(activeLocale)}
                      style="round"
                      variant="outline"
                    >
                      EN 내용 복제
                    </Button>
                  ) : null}
                  <div className="inline-flex self-start rounded-full bg-bg-deep p-1">
                    <div className="inline-flex items-center rounded-full">
                      {(["en", "ko", "ja"] as const).map((locale) => (
                        <Tab
                          className="px-3 md:px-5"
                          key={locale}
                          onClick={() => setActiveLocale(locale)}
                          state={activeLocale === locale ? "on" : "off"}
                        >
                          {locale.toUpperCase()}
                        </Tab>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            }
          />

          {/* 좌측 작성 폼 본문 */}
          <div className="grid gap-5 px-5 pt-3 md:px-6 md:pt-4">
            <InlineField label="제목">
              <div className="flex items-center gap-3">
                <input
                  className="ui-field h-11 w-full rounded-button bg-bg-content px-3 type-body-md text-fg outline-none placeholder:text-mute-fg"
                  onChange={(event) => updateLocalizedField("title", activeLocale, event.target.value)}
                  type="text"
                  value={getEditingLocalizedValue(form.title, activeLocale)}
                />
                {isContentType && !useRichEditor && itemId === "new" ? (
                  <Button size="default" arrow={false} className="shrink-0 justify-center" onClick={openAiDialog} style="round" variant="outline">
                    AI 작성
                  </Button>
                ) : null}
              </div>
            </InlineField>
            {isContentType ? (
              <InlineField label="Slug">
                <input
                  className="ui-field h-11 w-full rounded-button bg-bg-content px-3 type-body-md text-fg outline-none placeholder:text-mute-fg"
                  onChange={(event) => updateForm("id", event.target.value)}
                  type="text"
                  value={form.id === "new" ? "" : form.id}
                />
              </InlineField>
            ) : null}
            {isContentType ? (
              <InlineField label="설명">
                <textarea
                  className="ui-field min-h-[88px] w-full resize-y rounded-button bg-bg-content px-4 py-4 type-body-md text-fg outline-none placeholder:text-mute-fg"
                  onChange={(event) => updateLocalizedField("summary", activeLocale, event.target.value)}
                  value={getEditingLocalizedValue(form.summary, activeLocale)}
                />
              </InlineField>
            ) : null}
            {isContentType ? (
              <div className="grid gap-3 md:grid-cols-2">
                <InlineField label="작성자">
                  <input
                    className="ui-field h-11 w-full rounded-button bg-bg-content px-3 type-body-md text-fg outline-none placeholder:text-mute-fg"
                    onChange={(event) => updateForm("authorName", event.target.value)}
                    type="text"
                    value={form.authorName}
                  />
                </InlineField>
                <InlineField label="직책">
                  <input
                    className="ui-field h-11 w-full rounded-button bg-bg-content px-3 type-body-md text-fg outline-none placeholder:text-mute-fg"
                    onChange={(event) => updateForm("authorRole", event.target.value)}
                    type="text"
                    value={form.authorRole}
                  />
                </InlineField>
              </div>
            ) : null}
            <InlineField label="날짜">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input className="h-11 flex-1 rounded-button border border-transparent bg-bg-content px-3 type-body-md text-mute-fg outline-none" readOnly type="text" value={form.dateIso} />
                <Button size="default" arrow={false} className="h-11 w-full justify-center sm:w-auto" onClick={handleDateButtonClick} style="round" variant="outline">선택</Button>
                <input className="sr-only" onChange={(event) => updateForm("dateIso", event.target.value)} ref={dateInputRef} type="date" value={form.dateIso} />
              </div>
            </InlineField>
            {isOutlinkType ? (
              <InlineField label="설명">
                <textarea
                  className="ui-field min-h-[120px] w-full resize-y rounded-button bg-bg-content px-4 py-4 type-body-md text-fg outline-none placeholder:text-mute-fg"
                  onChange={(event) => updateLocalizedField("summary", activeLocale, event.target.value)}
                  value={getEditingLocalizedValue(form.summary, activeLocale)}
                />
              </InlineField>
            ) : isContentType ? (
              <InlineField label="썸네일">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 h-11 flex-1 items-center justify-between gap-3 rounded-button border border-transparent bg-bg-content px-3">
                    <input
                      className="w-full border-0 bg-transparent type-body-md text-fg outline-none"
                      onChange={(event) => {
                        if (pendingThumbnailPreviewSrc) {
                          URL.revokeObjectURL(pendingThumbnailPreviewSrc);
                        }
                        setPendingThumbnailFile(null);
                        setPendingThumbnailPreviewSrc("");
                        updateForm("imageSrc", event.target.value);
                        setThumbnailName(event.target.value);
                      }}
                      type="text"
                      value={pendingThumbnailFile ? thumbnailName : form.imageSrc}
                    />
                    {thumbnailName ? (
                      <button
                        className="shrink-0 bg-transparent p-0 type-body-md text-mute-fg transition-colors hover:text-fg"
                        onClick={clearThumbnail}
                        type="button"
                      >
                        삭제
                      </button>
                    ) : null}
                  </div>
                  <Button size="default" arrow={false} className="h-11 w-full justify-center sm:w-auto" onClick={() => fileInputRef.current?.click()} style="round" variant="outline">추가</Button>
                  <label className="flex items-center gap-2 type-body-sm text-mute-fg lg:ml-1">
                    <input
                      checked={form.hideHeroImage}
                      className="h-4 w-4 rounded border-border bg-bg-content accent-[var(--color-success)]"
                      onChange={(event) => updateForm("hideHeroImage", event.target.checked)}
                      type="checkbox"
                    />
                    <span>본문 노출 제외</span>
                  </label>
                  <input accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleThumbnailChange} ref={fileInputRef} type="file" />
                </div>
              </InlineField>
            ) : null}
            {isOutlinkType ? (
              <InlineField label="썸네일">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex min-w-0 h-11 flex-1 items-center justify-between gap-3 rounded-button border border-transparent bg-bg-content px-3">
                    <input
                      className="w-full border-0 bg-transparent type-body-md text-fg outline-none"
                      onChange={(event) => {
                        if (pendingThumbnailPreviewSrc) {
                          URL.revokeObjectURL(pendingThumbnailPreviewSrc);
                        }
                        setPendingThumbnailFile(null);
                        setPendingThumbnailPreviewSrc("");
                        updateForm("imageSrc", event.target.value);
                        setThumbnailName(event.target.value);
                      }}
                      type="text"
                      value={pendingThumbnailFile ? thumbnailName : form.imageSrc}
                    />
                    {thumbnailName ? (
                      <button
                        className="shrink-0 bg-transparent p-0 type-body-md text-mute-fg transition-colors hover:text-fg"
                        onClick={clearThumbnail}
                        type="button"
                      >
                        삭제
                      </button>
                    ) : null}
                  </div>
                  <Button size="default" arrow={false} className="h-11 w-full justify-center sm:w-auto" onClick={() => fileInputRef.current?.click()} style="round" variant="outline">추가</Button>
                </div>
                <input accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleThumbnailChange} ref={fileInputRef} type="file" />
              </InlineField>
            ) : null}
            {isOutlinkType ? (
              <InlineField label="URL">
                <input
                  className="ui-field h-11 w-full rounded-button bg-bg-content px-3 type-body-md text-fg outline-none placeholder:text-mute-fg"
                  onChange={(event) => updateForm("externalUrl", event.target.value)}
                  type="text"
                  value={form.externalUrl}
                />
              </InlineField>
            ) : null}
            {isContentType ? (
              useRichEditor ? (
                <div className="flex flex-col gap-[10px]">
                  <TiptapEditor
                    onChange={(payload) => updateRichText(activeLocale, payload)}
                    onUploadImage={uploadThumbnail}
                    value={getEditingLocalizedValue(form.bodyRichText, activeLocale)}
                  />
                </div>
              ) : (
                <TextAreaField
                  helperText="Markdown"
                  label="내용"
                  onChange={(value) => updateLocalizedField("bodyMarkdown", activeLocale, value)}
                  rowsClassName="min-h-[560px]"
                  value={getEditingLocalizedValue(form.bodyMarkdown, activeLocale)}
                />
              )
            ) : null}
          </div>

          {/* 하단 액션 버튼 영역 */}
          <div className="flex flex-col gap-3 px-5 pb-5 sm:flex-row sm:flex-wrap sm:justify-center md:px-6 md:pb-6">
            <Button
              arrow={false}
              className="w-full justify-center sm:w-auto"
              onClick={() => {
                if (!hasUnsavedChanges) {
                  setHasUnsavedChanges(false);
                  router.push(getAdminCategoryHref(section, categorySlug));
                  return;
                }

                setDialog({ type: "cancel" });
              }}
              style="round"
              variant="outline"
            >
              취소
            </Button>
            <Button
              arrow={false}
              className="w-full justify-center sm:w-auto"
              disabled={isSaving}
              onClick={() => commit(itemId === "new" ? "hidden" : form.status)}
              style="round"
              variant="primary"
            >
              <span className="inline-flex items-center gap-2">
                {isSaving ? <ButtonSpinner /> : null}
                <span>{isSaving ? "저장 중..." : "저장"}</span>
              </span>
            </Button>
            {isContentType && itemId !== "new" && form.contentFormat === "markdown" ? (
              <Button
                arrow={false}
                className="w-full justify-center sm:w-auto"
                onClick={() => setShowConvertConfirm(true)}
                style="round"
                variant="outline"
              >
                Convert to TipTap
              </Button>
            ) : null}
          </div>
        </div>

        {/* 우측 퍼블릭 상세 미리보기 */}
        {showPreview ? (
          <div className="min-w-0 self-start overflow-hidden rounded-[20px] border border-border bg-bg-content/40 xl:sticky xl:top-4">
            <div className="max-h-[calc(100vh-32px)] overflow-auto px-4 py-5 sm:px-5 sm:py-6 md:px-6">
              {isOutlinkType ? (
                <NewsPreviewCard
                  date={previewData.date}
                  imageSrc={previewData.heroImageSrc}
                  summary={previewData.summary}
                  title={previewData.title}
                  url={previewData.url}
                />
              ) : (
                <ContentPreview {...previewData} />
              )}
            </div>
          </div>
        ) : null}
      </div>

      {dialog?.type === "cancel" ? (
        <ConfirmDialog
          cancelLabel="계속 작성하기"
          confirmLabel="취소하기"
          description="작성 중인 내용은 저장되지 않습니다."
          onCancel={() => setDialog(null)}
          onConfirm={() => {
            setHasUnsavedChanges(false);
            router.push(getAdminCategoryHref(section, categorySlug));
          }}
          title="취소하겠습니까?"
        />
      ) : null}

      {dialog?.type === "alert" ? (
        <ConfirmDialog
          confirmLabel="확인"
          description={dialog.description}
          highlightedLines={dialog.highlightedLines}
          onCancel={() => setDialog(null)}
          onConfirm={() => setDialog(null)}
          title={dialog.title}
        />
      ) : null}

      {aiDialogOpen ? (
        <AiDraftDialog
          bodyValue={aiBodyValue}
          inputValue={aiInputValue}
          instructionValue={aiInstructionValue}
          isGenerating={isAiGenerating}
          onApply={handleAiApply}
          onBodyChange={setAiBodyValue}
          onCancel={handleAiCancel}
          onGenerate={handleAiGenerate}
          onInputChange={setAiInputValue}
          onInstructionChange={setAiInstructionValue}
        />
      ) : null}

      {aiConfirmType === "discard" ? (
        <ConfirmDialog
          className="z-[80]"
          cancelLabel="계속 작성하기"
          confirmLabel="취소하기"
          description="AI 작성 모달에서 작성 중인 내용이 사라집니다."
          onCancel={() => setAiConfirmType(null)}
          onConfirm={closeAiDialog}
          title="취소하겠습니까?"
        />
      ) : null}

      {aiConfirmType === "replace" ? (
        <ConfirmDialog
          className="z-[80]"
          confirmLabel="대체하기"
          description="현재 내용 필드에 작성된 내용을 AI 초안으로 대체합니다."
          onCancel={() => {
            setAiConfirmType(null);
            setAiPendingBodyValue(null);
          }}
          onConfirm={() => {
            if (aiPendingBodyValue) {
              updateLocalizedField("bodyMarkdown", activeLocale, aiPendingBodyValue);
            }
            closeAiDialog();
          }}
          title="기존 내용을 대체할까요?"
        />
      ) : null}

      {copyConfirmLocale ? (
        <ConfirmDialog
          className="z-[80]"
          cancelLabel="취소"
          confirmLabel="대체하기"
          description={`${copyConfirmLocale.toUpperCase()}에 작성 중인 내용이 EN 내용으로 대체됩니다.`}
          onCancel={() => setCopyConfirmLocale(null)}
          onConfirm={() => {
            applyCopyLocaleFromEn(copyConfirmLocale);
            setCopyConfirmLocale(null);
          }}
          title="기존 내용을 대체할까요?"
        />
      ) : null}

      {showConvertConfirm ? (
        <ConfirmDialog
          className="z-[80]"
          cancelLabel="취소"
          confirmLabel="새 버전 만들기"
          description="현재 레거시 markdown 콘텐츠를 보존한 채, TipTap 편집용 새 버전을 hidden 상태로 생성합니다."
          onCancel={() => setShowConvertConfirm(false)}
          onConfirm={() => {
            setShowConvertConfirm(false);
            void handleConvertToTiptap().catch((error: unknown) => {
              setDialog({
                description:
                  error instanceof Error
                    ? error.message
                    : "TipTap 변환에 실패했습니다. 다시 시도해 주세요.",
                title: "변환에 실패했습니다.",
                type: "alert",
              });
            });
          }}
          title="새 TipTap 버전으로 변환할까요?"
        />
      ) : null}
    </section>
  );
}
