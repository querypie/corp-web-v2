"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../../layout/admin/AdminHeader";
import Button from "../../common/Button";
import Tab from "../../common/Tab";
import { useAdminNavigationGuard } from "../../layout/admin/AdminNavigationGuard";
import {
  upsertManagedContent,
  useManagedContents,
} from "@/features/content/clientStore";
import {
  createEmptyManagedContentDraft,
  ensureUniqueSlug,
  formatPublicDate,
  getAdminCategoryHref,
  getContentThumbnailSrc,
  getManagedCategoryLabel,
  getNextSortOrder,
  getLocalizedContent,
  getPublicListHref,
  getWriterLabel,
  slugifyTitle,
  type ManagedContentCategorySlug,
  type ManagedContentEntry,
  type ManagedContentSection,
} from "@/features/content/data";

type DialogState =
  | { type: "cancel" }
  | { description: string; title: string; type: "alert" };

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ConfirmDialog({
  confirmLabel,
  description,
  onCancel,
  onConfirm,
  title,
}: {
  confirmLabel: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
}) {
  return (
    /* 취소/검증 경고에 공통으로 쓰는 확인 모달 */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,9,10,0.6)] px-5" onClick={onCancel}>
      <div className="w-full max-w-[320px] rounded-modal bg-bg-content px-5 py-8" onClick={(event) => event.stopPropagation()}>
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="m-0 type-h3 text-fg">{title}</h2>
            <p className="m-0 whitespace-pre-line type-body-md text-mute-fg">{description}</p>
          </div>
          <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
            <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={onCancel} variant="outline">
              닫기
            </Button>
            <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={onConfirm} variant="secondary">
              {confirmLabel}
            </Button>
          </div>
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
  helperText,
  label,
  onChange,
  placeholder,
  rowsClassName,
  value,
}: {
  helperText?: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rowsClassName?: string;
  value: string;
}) {
  return (
    /* 마크다운 본문 입력 영역 */
    <div className="flex w-full flex-col gap-[10px]">
      <div className="flex items-end justify-between gap-4">
        <label className="type-body-md text-fg">{label}</label>
        {helperText ? <span className="type-body-sm text-mute-fg">{helperText}</span> : null}
      </div>
      <textarea
        className={cx("ui-field w-full resize-y rounded-button bg-bg-content px-4 py-4 type-body-md text-fg outline-none placeholder:text-mute-fg", rowsClassName ?? "min-h-[320px]")}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
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
        <div className="order-1 h-[180px] w-full shrink-0 overflow-hidden rounded-thumb bg-bg-content md:order-2 md:h-[200px] md:w-[380px]">
          <img alt={title} className="block h-full w-full object-cover" src={imageSrc} />
        </div>
      ) : null}
    </a>
  );
}

function renderInlineMarkdown(text: string) {
  const tokens = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g);
  return tokens.filter(Boolean).map((token, index) => {
    if (/^\[[^\]]+\]\([^)]+\)$/.test(token)) {
      const match = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (!match) return token;
      return <a key={index} className="text-fg underline underline-offset-4" href={match[2]}>{match[1]}</a>;
    }
    if (/^`[^`]+`$/.test(token)) {
      return <code key={index} className="rounded-[8px] bg-bg-content px-2 py-1 type-body-lg text-fg">{token.slice(1, -1)}</code>;
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

function PreviewMarkdown({ markdown }: { markdown: string }) {
  const blocks = markdown.trim().split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  return (
    /* 퍼블릭 상세와 유사한 형태로 마크다운을 미리 렌더링 */
    <div className="flex flex-col gap-5 text-fg">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n");
        const firstLine = lines[0] ?? "";
        if (/^```/.test(firstLine) && /^```$/.test(lines[lines.length - 1] ?? "")) {
          return <pre key={blockIndex} className="m-0 overflow-x-auto rounded-[20px] bg-bg-content px-4 py-4 type-body-lg text-fg"><code>{lines.slice(1, -1).join("\n")}</code></pre>;
        }
        if (/^---+$/.test(block) || /^\*\*\*+$/.test(block)) {
          return <hr key={blockIndex} className="border-0 border-t border-border" />;
        }
        if (block.startsWith("# ")) {
          return <h1 key={blockIndex} className={cx("m-0 type-h1 leading-[42px] text-fg", blockIndex > 0 && "pt-10")}>{renderInlineMarkdown(block.replace(/^#\s+/, ""))}</h1>;
        }
        if (block.startsWith("## ")) {
          return <h2 key={blockIndex} className={cx("m-0 type-h2 leading-[30px] text-fg", blockIndex > 0 && "pt-10")}>{renderInlineMarkdown(block.replace(/^##\s+/, ""))}</h2>;
        }
        if (block.startsWith("### ")) {
          return <h3 key={blockIndex} className={cx("m-0 type-h3 text-fg", blockIndex > 0 && "pt-5")}>{renderInlineMarkdown(block.replace(/^###\s+/, ""))}</h3>;
        }
        if (lines.every((line) => /^>\s?/.test(line))) {
          return <blockquote key={blockIndex} className="m-0 border-l-2 border-border pl-4 type-body-lg italic text-fg">{lines.map((line, idx) => <p key={idx} className="m-0">{renderInlineMarkdown(line.replace(/^>\s?/, ""))}</p>)}</blockquote>;
        }
        if (lines.every((line) => /^\d+\.\s+/.test(line))) {
          return <ol key={blockIndex} className="m-0 flex list-decimal flex-col gap-0 pl-6 type-body-lg text-fg">{lines.map((line, idx) => <li key={idx}>{renderInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>)}</ol>;
        }
        if (lines.every((line) => /^-\s+/.test(line))) {
          return <ul key={blockIndex} className="m-0 flex list-disc flex-col gap-0 pl-6 type-body-lg text-fg">{lines.map((line, idx) => <li key={idx}>{renderInlineMarkdown(line.replace(/^-\s+/, ""))}</li>)}</ul>;
        }
        return <p key={blockIndex} className="m-0 type-body-lg whitespace-pre-wrap text-fg">{lines.map((line, idx) => <span key={idx}>{renderInlineMarkdown(line)}{idx < lines.length - 1 ? <br /> : null}</span>)}</p>;
      })}
    </div>
  );
}

function StatusBadge({ children }: { children: React.ReactNode }) {
  return <div className="rounded-full border border-border bg-bg-content px-3 py-1 type-body-sm leading-4 text-mute-fg">{children}</div>;
}

function ToggleSwitch({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button aria-label={label} aria-pressed={checked} className="inline-flex items-center gap-3 self-start sm:self-auto" onClick={onChange} type="button">
      <span className="type-body-sm text-mute-fg">{label}</span>
      <span className={cx("relative inline-flex h-6 w-11 items-center rounded-full transition-colors", checked ? "bg-success/30" : "bg-bg-content")}>
        <span className={cx("inline-block h-4 w-4 rounded-full transition-transform", checked ? "translate-x-6 bg-success" : "translate-x-[4px] bg-mute-fg")} />
      </span>
    </button>
  );
}

function PanelHeader({
  trailing,
}: {
  trailing?: React.ReactNode;
}) {
  return (
    /* 작성 폼/미리보기 상단 공통 헤더 */
    <div className="flex items-center justify-between gap-4 border-b border-border/80 px-5 py-4 md:px-6">
      {trailing}
    </div>
  );
}

function ContentPreview({
  bodyMarkdown,
  date,
  heroImageAlt,
  heroImageSrc,
  title,
  writer,
}: {
  bodyMarkdown: string;
  date: string;
  heroImageAlt: string;
  heroImageSrc: string;
  title: string;
  writer: string;
}) {
  return (
    /* 우측 미리보기 패널의 실제 콘텐츠 영역 */
    <div className="mx-auto flex w-full max-w-[680px] flex-col gap-[80px] pb-10">
      <div className="flex flex-col gap-[10px]">
        <h1 className="m-0 type-h1 leading-[42px] text-fg">{title}</h1>
        <div className="type-body-md text-fg">{writer}</div>
        <p className="m-0 type-body-md text-mute-fg">{date}</p>
      </div>
      {heroImageSrc ? (
        <div className="h-[220px] w-full overflow-hidden rounded-box bg-bg-content md:h-[380px]">
          <img alt={heroImageAlt} className="block h-full w-full object-cover" src={heroImageSrc} />
        </div>
      ) : null}
      <PreviewMarkdown markdown={bodyMarkdown} />
    </div>
  );
}

type Props = {
  categorySlug: ManagedContentCategorySlug;
  itemId: string;
  section: ManagedContentSection;
};

export default function AdminManagedContentDetailPage({
  categorySlug,
  itemId,
  section,
}: Props) {
  const router = useRouter();
  const { setHasUnsavedChanges } = useAdminNavigationGuard();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const items = useManagedContents(section);
  const currentItem = useMemo(
    () => items.find((item) => item.id === itemId && item.section === section && item.categorySlug === categorySlug),
    [categorySlug, itemId, items, section],
  );
  const [form, setForm] = useState<ManagedContentEntry>(() => createEmptyManagedContentDraft(section, categorySlug));
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [thumbnailName, setThumbnailName] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [activeLocale, setActiveLocale] = useState<"en" | "ko" | "ja">("en");
  const categoryLabel = getManagedCategoryLabel(section, categorySlug, "en");
  const initialFormState = useMemo(
    () => currentItem ?? createEmptyManagedContentDraft(section, categorySlug),
    [categorySlug, currentItem, section],
  );

  useEffect(() => {
    /* 수정 화면이면 기존 데이터를 채우고, 신규면 빈 초안을 준비한다 */
    if (currentItem) {
      setForm(currentItem);
      setThumbnailName(currentItem.imageSrc);
      return;
    }
    setForm(createEmptyManagedContentDraft(section, categorySlug));
    setThumbnailName("");
  }, [categorySlug, currentItem, section]);

  useEffect(() => {
    const hasChanged =
      form.title !== initialFormState.title ||
      form.authorName !== initialFormState.authorName ||
      form.authorRole !== initialFormState.authorRole ||
      form.dateIso !== initialFormState.dateIso ||
      form.externalUrl !== initialFormState.externalUrl ||
      form.imageSrc !== initialFormState.imageSrc ||
      form.summary !== initialFormState.summary ||
      form.bodyMarkdown !== initialFormState.bodyMarkdown;

    setHasUnsavedChanges(hasChanged);

    return () => {
      setHasUnsavedChanges(false);
    };
  }, [form, initialFormState, setHasUnsavedChanges]);

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
    /* 업로드한 이미지를 즉시 로컬 미리보기 가능한 data URL로 보관한다 */
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateForm("imageSrc", reader.result);
        setThumbnailName(file.name);
      }
    };
    reader.readAsDataURL(file);
  }

  function clearThumbnail() {
    updateForm("imageSrc", "");
    setThumbnailName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function validateForm() {
    /* 게시 전 필수 입력값만 간단히 검증한다 */
    const missing: string[] = [];
    if (!getLocalizedContent(form.title, activeLocale).trim()) missing.push("제목");
    if (section === "news") {
      if (!getLocalizedContent(form.summary, activeLocale).trim()) missing.push("요약");
      if (!form.externalUrl.trim()) missing.push("URL");
    } else if (!getLocalizedContent(form.bodyMarkdown, activeLocale).trim()) {
      missing.push("내용");
      if (!form.authorName.trim()) missing.push("작성자 이름");
      if (!form.authorRole.trim()) missing.push("직책");
    }
    return missing;
  }

  function commit(status: "draft" | "published") {
    /* 임시저장/게시 저장을 같은 함수에서 상태만 바꿔 처리한다 */
    const missing = validateForm();
    if (status === "published" && missing.length > 0) {
      setDialog({
        description: `다음 항목을 입력해야 저장할 수 있습니다.\n${missing.join(", ")}`,
        title: "입력되지 않은 항목이 있습니다.",
        type: "alert",
      });
      return;
    }

    const nextId = ensureUniqueSlug(
      itemId === "new" ? slugifyTitle(getLocalizedContent(form.title, activeLocale)) : form.id,
      items.filter((item) => item.section === section),
      itemId === "new" ? undefined : itemId,
    );

    upsertManagedContent(
      {
        ...form,
        categorySlug,
        id: nextId,
        section,
        sortOrder:
          itemId === "new"
            ? getNextSortOrder(items, section, categorySlug)
            : form.sortOrder,
        status,
      },
      itemId === "new" ? undefined : itemId,
    );

    setHasUnsavedChanges(false);
    router.push(getAdminCategoryHref(section, categorySlug));
  }

  const previewData = {
    bodyMarkdown: getLocalizedContent(form.bodyMarkdown, activeLocale) || "작성한 본문이 이 영역에 실시간 표시됩니다.",
    date: formatPublicDate("ko", form.dateIso),
    heroImageAlt: getLocalizedContent(form.title, activeLocale) || "Content thumbnail preview",
    heroImageSrc: form.imageSrc,
    summary: getLocalizedContent(form.summary, activeLocale) || "뉴스 요약을 입력하면 여기에 반영됩니다.",
    title: getLocalizedContent(form.title, activeLocale) || "제목을 입력하면 여기에 반영됩니다.",
    url: form.externalUrl,
    writer: getWriterLabel({
      authorName: form.authorName || "작성자 이름",
      authorRole: form.authorRole || "직책",
    }) || "작성자 이름 / 직책",
  };

  return (
    <section className="flex flex-col gap-8">
      {/* 페이지 상단 설명과 현재 작업 상태를 표시 */}
      <AdminHeader
        description="콘텐츠 작성, 수정, 임시저장, 게시 전 미리보기를 이 화면에서 관리합니다."
        title={itemId === "new" ? `${categoryLabel} > Create Content` : "Modify Content"}
      />

      {/* 미리보기 on/off에 따라 2단 또는 단일 컬럼으로 전환 */}
      <div className={cx("grid gap-5 md:gap-6", showPreview ? "xl:grid-cols-[minmax(0,740px)_minmax(0,1fr)]" : "mx-auto w-full max-w-[740px]")}>
        <div className="flex min-w-0 w-full max-w-[740px] flex-col gap-5 overflow-hidden rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
          <PanelHeader
            trailing={
              <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
                <div className="rounded-full bg-bg-deep p-1">
                  <div className="flex items-center rounded-full">
                    {(["en", "ko", "ja"] as const).map((locale) => (
                      <Tab
                        key={locale}
                        onClick={() => setActiveLocale(locale)}
                        state={activeLocale === locale ? "on" : "off"}
                      >
                        {locale.toUpperCase()}
                      </Tab>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end sm:flex-1">
                  <ToggleSwitch checked={showPreview} label="미리보기" onChange={() => setShowPreview((current) => !current)} />
                </div>
              </div>
            }
          />

          {/* 좌측 작성 폼 본문 */}
          <div className="grid gap-5 px-5 pt-5 md:px-6 md:pt-6">
            {section === "news" ? (
              <TextField label="연결 URL" onChange={(value) => updateForm("externalUrl", value)} value={form.externalUrl} />
            ) : null}
            <TextField label="제목" onChange={(value) => updateLocalizedField("title", activeLocale, value)} value={getLocalizedContent(form.title, activeLocale)} />
            {section !== "news" ? (
              <div className="grid gap-5 md:grid-cols-2">
                <TextField label="작성자 이름" onChange={(value) => updateForm("authorName", value)} value={form.authorName} />
                <TextField label="직책" onChange={(value) => updateForm("authorRole", value)} value={form.authorRole} />
              </div>
            ) : null}
            <div className="flex flex-col gap-[10px]">
              <label className="type-body-md text-fg">날짜</label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input className="h-11 flex-1 rounded-button border border-transparent bg-bg-content px-3 type-body-md text-mute-fg outline-none" readOnly type="text" value={form.dateIso} />
                <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={handleDateButtonClick} variant="outline">날짜 지정</Button>
                <input className="sr-only" onChange={(event) => updateForm("dateIso", event.target.value)} ref={dateInputRef} type="date" value={form.dateIso} />
              </div>
            </div>
            <div className="flex flex-col gap-[10px]">
              <label className="type-body-md text-fg">썸네일</label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex min-w-0 h-11 flex-1 items-center justify-between gap-3 rounded-button border border-transparent bg-bg-content px-3">
                  <input
                    className="w-full border-0 bg-transparent type-body-md text-fg outline-none"
                    onChange={(event) => {
                      updateForm("imageSrc", event.target.value);
                      setThumbnailName(event.target.value);
                    }}
                    type="text"
                    value={form.imageSrc}
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
                <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={() => fileInputRef.current?.click()} variant="outline">썸네일 추가</Button>
              </div>
              <input accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleThumbnailChange} ref={fileInputRef} type="file" />
            </div>
            {section === "news" ? (
              <TextAreaField
                label="요약"
                onChange={(value) => updateLocalizedField("summary", activeLocale, value)}
                rowsClassName="min-h-[160px]"
                value={getLocalizedContent(form.summary, activeLocale)}
              />
            ) : null}
            {section !== "news" ? (
              <TextAreaField helperText="Markdown" label="내용" onChange={(value) => updateLocalizedField("bodyMarkdown", activeLocale, value)} value={getLocalizedContent(form.bodyMarkdown, activeLocale)} />
            ) : null}
          </div>

          {/* 하단 액션 버튼 영역 */}
          <div className="flex flex-col gap-3 px-5 pb-5 sm:flex-row sm:flex-wrap sm:justify-center md:px-6 md:pb-6">
            <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={() => setDialog({ type: "cancel" })} variant="outline">취소</Button>
            <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={() => commit("draft")} variant="outline">임시저장</Button>
            <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={() => commit("published")} variant="primary">저장</Button>
          </div>
        </div>

        {/* 우측 퍼블릭 상세 미리보기 */}
        {showPreview ? (
          <div className="min-w-0 overflow-hidden rounded-[20px] border border-border bg-bg-content/40">
            <div className="max-h-[calc(100vh-180px)] overflow-auto px-4 py-5 sm:px-5 sm:py-6 md:px-6">
              {section === "news" ? (
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
          onCancel={() => setDialog(null)}
          onConfirm={() => setDialog(null)}
          title={dialog.title}
        />
      ) : null}
    </section>
  );
}
