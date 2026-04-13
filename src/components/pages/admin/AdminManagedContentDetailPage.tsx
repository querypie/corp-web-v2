"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../../layout/admin/AdminHeader";
import Button from "../../common/Button";
import Input from "../../common/Input";
import LoadingText from "../../common/LoadingText";
import Select from "../../common/Select";
import Tab from "../../common/Tab";
import TabGroup from "../../common/TabGroup";
import Textarea from "../../common/Textarea";
import TiptapEditor from "../../common/TiptapEditor";
import AdminContentPreview from "./AdminContentPreview";
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
  getDownloadPreviewProps,
  getManagedCategoryLabel,
  getLocalizedContent,
  getWriterLabel,
  slugifyTitle,
  type ContentGatingLevel,
  type ManagedContentCategorySlug,
  type ManagedContentEntry,
  type ManagedContentSection,
  type ManagedContentType,
} from "@/features/content/data";

type DialogState =
  | { type: "cancel" }
  | { description: string; highlightedLines?: string[]; title: string; type: "alert" };

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function pathSafeBaseName(value: string) {
  const segments = value.split("/");
  return segments[segments.length - 1] ?? value;
}

const CONTENT_GATING_OPTIONS: Array<{ label: string; value: ContentGatingLevel }> = [
  { label: "Gating 없음", value: "none" },
  { label: "Gating 10%", value: "10" },
  { label: "Gating 30%", value: "30" },
  { label: "Gating 50%", value: "50" },
];

function getEditingLocalizedValue(
  content: { en: string; ja: string; ko: string },
  locale: "en" | "ko" | "ja",
) {
  return content[locale] ?? "";
}

function hydrateRichTextFromHtml(entry: ManagedContentEntry): ManagedContentEntry {
  if (entry.contentType !== "content") {
    return entry;
  }

  return {
    ...entry,
    bodyRichText: {
      en: entry.bodyRichText.en.trim() ? entry.bodyRichText.en : entry.bodyHtml.en,
      ko: entry.bodyRichText.ko.trim() ? entry.bodyRichText.ko : entry.bodyHtml.ko,
      ja: entry.bodyRichText.ja.trim() ? entry.bodyRichText.ja : entry.bodyHtml.ja,
    },
  };
}

function serializeDirtyCheckTarget(form: ManagedContentEntry) {
  return JSON.stringify({
    authorName: form.authorName,
    authorRole: form.authorRole,
    bodyHtml: form.bodyHtml,
    bodyRichText: form.bodyRichText,
    contentType: form.contentType,
    dateIso: form.dateIso,
    downloadCoverImageSrc: form.downloadCoverImageSrc,
    downloadPdfFileName: form.downloadPdfFileName,
    downloadPdfSrc: form.downloadPdfSrc,
    enableDownloadButton: form.enableDownloadButton,
    externalUrl: form.externalUrl,
    gatingLevel: form.gatingLevel,
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
    <div className={cx("fixed inset-0 z-50 flex items-center justify-center bg-[rgb(var(--color-overlay-rgb)/0.6)] px-5", className)} onClick={onCancel}>
      <div className="w-full max-w-[320px] rounded-modal border border-border bg-[var(--color-bg-modal)] px-5 py-8" onClick={(event) => event.stopPropagation()}>
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
            <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={onCancel} style="round" variant="outline">
              {cancelLabel}
            </Button>
            <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={onConfirm} style="round" variant="secondary">
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
      <Input
        className="w-full"
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
        <Textarea
          className={cx("resize-y bg-bg-content", rowsClassName ?? "min-h-[320px]", textareaClassName)}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
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
    <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
      {trailing}
    </div>
  );
}

type Props = {
  categorySlug: ManagedContentCategorySlug;
  initialItem?: ManagedContentEntry | null;
  initialItems?: ManagedContentEntry[];
  itemId: string;
  section: ManagedContentSection;
};

export default function AdminManagedContentDetailPage({
  categorySlug,
  initialItem,
  initialItems,
  itemId,
  section,
}: Props) {
  const router = useRouter();
  const { setHasUnsavedChanges } = useAdminNavigationGuard();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const isInitializingRichTextRef = useRef(false);
  const items = useManagedContents(section, initialItems, "all", "list") ?? [];
  const currentItem = itemId === "new" ? null : initialItem ?? null;
  const [form, setForm] = useState<ManagedContentEntry>(() => createEmptyManagedContentDraft(section, categorySlug));
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [pendingThumbnailFile, setPendingThumbnailFile] = useState<File | null>(null);
  const [pendingPdfFile, setPendingPdfFile] = useState<File | null>(null);
  const [pendingThumbnailPreviewSrc, setPendingThumbnailPreviewSrc] = useState("");
  const [thumbnailName, setThumbnailName] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [activeLocale, setActiveLocale] = useState<"en" | "ko" | "ja">("en");
const [isSaving, setIsSaving] = useState(false);
  const categoryLabel = getManagedCategoryLabel(section, categorySlug, "en");
  const [initialFormSnapshot, setInitialFormSnapshot] = useState(() =>
    serializeDirtyCheckTarget(createEmptyManagedContentDraft(section, categorySlug)),
  );
  const hasUnsavedChanges =
    serializeDirtyCheckTarget(form) !== initialFormSnapshot ||
    Boolean(pendingThumbnailFile) ||
    Boolean(pendingPdfFile);
  const showPreview = true;
  const isContentType = form.contentType === "content";
  const isOutlinkType = form.contentType === "outlink";
  const supportsLeadGate = section !== "news" && isContentType;
  const useRichEditor = isContentType;

  useEffect(() => {
    /* 수정 화면이면 기존 데이터를 채우고, 신규면 빈 초안을 준비한다 */
    if (pendingThumbnailPreviewSrc) {
      URL.revokeObjectURL(pendingThumbnailPreviewSrc);
      setPendingThumbnailPreviewSrc("");
    }
    setPendingThumbnailFile(null);
    setPendingPdfFile(null);

    if (currentItem) {
      const hydratedItem = hydrateRichTextFromHtml(currentItem);
      isInitializingRichTextRef.current = true;
      setForm(hydratedItem);
      setInitialFormSnapshot(serializeDirtyCheckTarget(hydratedItem));
      setThumbnailName(hydratedItem.imageSrc);
      setPdfName(hydratedItem.downloadPdfFileName || hydratedItem.downloadPdfSrc);
      return;
    }
    const initialDraft = createEmptyManagedContentDraft(section, categorySlug);
    isInitializingRichTextRef.current = true;
    setForm(initialDraft);
    setInitialFormSnapshot(serializeDirtyCheckTarget(initialDraft));
    setThumbnailName("");
    setPdfName("");
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
    key: "title" | "summary",
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
    setForm((current) => {
      const isSameAsCurrentRichText =
        current.bodyRichText[locale] === payload.json &&
        current.bodyHtml[locale] === payload.html;

      const nextForm = {
        ...current,
        bodyHtml: {
          ...current.bodyHtml,
          [locale]: payload.html,
        },
        bodyRichText: {
          ...current.bodyRichText,
          [locale]: payload.json,
        },
      };

      if (isInitializingRichTextRef.current) {
        if (isSameAsCurrentRichText) {
          setInitialFormSnapshot(serializeDirtyCheckTarget(nextForm));
        }

        isInitializingRichTextRef.current = false;
      }

      return nextForm;
    });
  }

  function handleContentTypeChange(nextType: ManagedContentType) {
    if (section === "news") {
      return;
    }

    setForm((current) => ({
      ...current,
      contentType: nextType,
      gatingLevel: nextType === "content" ? current.gatingLevel : "none",
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

  function clearDate() {
    updateForm("dateIso", "");
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

  function handlePdfChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPendingPdfFile(file);
    setPdfName(file.name);
  }

  function clearPdf() {
    setPendingPdfFile(null);
    setPdfName("");
    updateForm("downloadPdfFileName", "");
    updateForm("downloadPdfSrc", "");
    updateForm("downloadCoverImageSrc", "");

    if (pdfInputRef.current) {
      pdfInputRef.current.value = "";
    }
  }

  function handlePdfInputChange(value: string) {
    setPendingPdfFile(null);
    updateForm("downloadPdfFileName", value ? pathSafeBaseName(value) : "");
    updateForm("downloadPdfSrc", value);
    setPdfName(value);
  }

  async function uploadPdf(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("section", section);
    formData.append("categorySlug", categorySlug);

    const response = await fetch("/api/admin/uploads/content-document", {
      body: formData,
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("pdf upload failed");
    }

    const payload = (await response.json()) as { coverSrc?: string; fileName?: string; src?: string };

    if (!payload.src || !payload.fileName) {
      throw new Error("missing pdf src");
    }

    return payload;
  }

  function handleThumbnailInputChange(value: string) {
    if (pendingThumbnailPreviewSrc) {
      URL.revokeObjectURL(pendingThumbnailPreviewSrc);
    }

    setPendingThumbnailFile(null);
    setPendingThumbnailPreviewSrc("");
    updateForm("imageSrc", value);
    setThumbnailName(value);
  }

  async function uploadThumbnail(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("section", section);
    formData.append("categorySlug", categorySlug);

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
    if (supportsLeadGate && form.enableDownloadButton && !form.downloadPdfSrc.trim() && !pendingPdfFile) {
      missing.push("PDF");
    }
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
    let nextDownloadPdfSrc = currentForm.downloadPdfSrc;
    let nextDownloadPdfFileName = currentForm.downloadPdfFileName;
    let nextDownloadCoverImageSrc = currentForm.downloadCoverImageSrc;

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

    if (pendingPdfFile) {
      try {
        const uploadedPdf = await uploadPdf(pendingPdfFile);
        nextDownloadPdfSrc = uploadedPdf.src ?? "";
        nextDownloadPdfFileName = uploadedPdf.fileName ?? "";
        nextDownloadCoverImageSrc = uploadedPdf.coverSrc || nextImageSrc;
      } catch {
        setDialog({
          description: "PDF를 저장하지 못했습니다. 다시 시도해 주세요.",
          title: "PDF 업로드에 실패했습니다.",
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
      downloadCoverImageSrc: nextDownloadCoverImageSrc || nextImageSrc,
      downloadPdfFileName: nextDownloadPdfFileName,
      downloadPdfSrc: nextDownloadPdfSrc,
      gatingLevel:
        section !== "news" && currentForm.contentType === "content"
          ? currentForm.gatingLevel
          : "none",
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
    setPendingPdfFile(null);
    setPendingThumbnailPreviewSrc("");
    setHasUnsavedChanges(false);
    router.push(getAdminCategoryHref(section, categorySlug));
  }

  const previewData = {
    bodyHtml: getEditingLocalizedValue(form.bodyHtml, activeLocale),
    date: formatPublicDate("ko", form.dateIso),
    ...getDownloadPreviewProps(form),
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
      <div className={cx(showPreview ? "flex flex-col gap-5 md:gap-6 min-[1440px]:flex-row min-[1440px]:flex-wrap min-[1440px]:items-start min-[1440px]:gap-10" : "mx-auto w-full max-w-[720px]")}>
        <div className="flex min-w-0 w-full max-w-[720px] self-start flex-col gap-5 overflow-visible min-[1440px]:w-[720px] min-[1440px]:flex-none">
          <PanelHeader
            trailing={
              <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {section !== "news" ? (
                  <div className="flex w-full flex-col gap-3 sm:max-w-[500px] sm:flex-row">
                    <div className="w-full sm:max-w-[180px]">
                      <Select
                        defaultValue={form.contentType}
                        onChange={(event) => handleContentTypeChange(event.target.value as ManagedContentType)}
                        options={[
                          { label: "컨텐츠(기본)", value: "content" },
                          { label: "아웃링크", value: "outlink" },
                        ]}
                      />
                    </div>
                    {supportsLeadGate ? (
                      <div className="w-full sm:max-w-[180px]">
                        <Select
                          onChange={(event) => updateForm("gatingLevel", event.target.value as ContentGatingLevel)}
                          options={CONTENT_GATING_OPTIONS}
                          value={form.gatingLevel}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : <div />}
                <div className="flex items-center gap-3 sm:justify-end">
                  <TabGroup className="self-start">
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
                  </TabGroup>
                </div>
              </div>
            }
          />

          {/* 좌측 작성 폼 본문 */}
          <div className="grid gap-5 pt-3 md:pt-4">
            <InlineField label="제목">
              <div className="flex items-center gap-3">
                <Input
                  className="w-full"
                  onChange={(event) => updateLocalizedField("title", activeLocale, event.target.value)}
                  type="text"
                  value={getEditingLocalizedValue(form.title, activeLocale)}
                />
              </div>
            </InlineField>
            {isContentType ? (
              <InlineField label="Slug">
                <Input
                  className="w-full"
                  onChange={(event) => updateForm("id", event.target.value)}
                  type="text"
                  value={form.id === "new" ? "" : form.id}
                />
              </InlineField>
            ) : null}
            {isContentType ? (
              <InlineField label="요약">
                <Textarea
                  className="min-h-[88px] resize-y bg-bg-content"
                  onChange={(event) => updateLocalizedField("summary", activeLocale, event.target.value)}
                  value={getEditingLocalizedValue(form.summary, activeLocale)}
                />
              </InlineField>
            ) : null}
            {isContentType ? (
              <div className="grid gap-3 md:grid-cols-2">
                <InlineField label="작성자">
                  <Input
                    className="w-full"
                    onChange={(event) => updateForm("authorName", event.target.value)}
                    type="text"
                    value={form.authorName}
                  />
                </InlineField>
                <InlineField label="직책">
                  <Input
                    className="w-full"
                    onChange={(event) => updateForm("authorRole", event.target.value)}
                    type="text"
                    value={form.authorRole}
                  />
                </InlineField>
              </div>
            ) : null}
            <InlineField label="날짜">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Input className="w-full bg-bg-content" inputClassName="text-mute-fg" readOnly type="text" value={form.dateIso} />
                  {form.dateIso ? (
                    <button
                      className="shrink-0 bg-transparent p-0 type-body-md text-mute-fg transition-colors hover:text-fg"
                      onClick={clearDate}
                      type="button"
                    >
                      삭제
                    </button>
                  ) : null}
                </div>
                <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={handleDateButtonClick} style="round" variant="outline">선택</Button>
                {supportsLeadGate ? (
                  <label className="flex items-center gap-2 type-body-sm text-mute-fg sm:ml-5">
                    <input
                      checked={form.enableDownloadButton}
                      className="h-4 w-4 rounded border-border bg-bg-content accent-[var(--color-success)]"
                      onChange={(event) => updateForm("enableDownloadButton", event.target.checked)}
                      type="checkbox"
                    />
                    <span>다운로드 버튼</span>
                  </label>
                ) : null}
                <input className="sr-only" onChange={(event) => updateForm("dateIso", event.target.value)} ref={dateInputRef} type="date" value={form.dateIso} />
              </div>
            </InlineField>
            {supportsLeadGate && form.enableDownloadButton ? (
              <InlineField label="PDF">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Input
                      className="w-full"
                      onChange={(event) => handlePdfInputChange(event.target.value)}
                      type="text"
                      value={pendingPdfFile ? pdfName : form.downloadPdfSrc}
                    />
                    {pdfName ? (
                      <button
                        className="shrink-0 bg-transparent p-0 type-body-md text-mute-fg transition-colors hover:text-fg"
                        onClick={clearPdf}
                        type="button"
                      >
                        삭제
                      </button>
                    ) : null}
                  </div>
                  <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={() => pdfInputRef.current?.click()} style="round" variant="outline">추가</Button>
                  <input accept="application/pdf" className="sr-only" onChange={handlePdfChange} ref={pdfInputRef} type="file" />
                </div>
              </InlineField>
            ) : null}
            {isOutlinkType ? (
              <InlineField label="요약">
                <Textarea
                  className="min-h-[120px] resize-y bg-bg-content"
                  onChange={(event) => updateLocalizedField("summary", activeLocale, event.target.value)}
                  value={getEditingLocalizedValue(form.summary, activeLocale)}
                />
              </InlineField>
            ) : isContentType ? (
              <InlineField label="썸네일">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Input
                      className="w-full"
                      onChange={(event) => handleThumbnailInputChange(event.target.value)}
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
                  <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={() => fileInputRef.current?.click()} style="round" variant="outline">추가</Button>
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
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Input
                      className="w-full"
                      onChange={(event) => handleThumbnailInputChange(event.target.value)}
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
                  <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={() => fileInputRef.current?.click()} style="round" variant="outline">추가</Button>
                </div>
                <input accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleThumbnailChange} ref={fileInputRef} type="file" />
              </InlineField>
            ) : null}
            {isOutlinkType ? (
              <InlineField label="URL">
                <Input
                  className="w-full"
                  onChange={(event) => updateForm("externalUrl", event.target.value)}
                  type="text"
                  value={form.externalUrl}
                />
              </InlineField>
            ) : null}
            {isContentType && useRichEditor ? (
              <div className="flex flex-col gap-[10px]">
                <TiptapEditor
                  onChange={(payload) => updateRichText(activeLocale, payload)}
                  onUploadImage={uploadThumbnail}
                  value={getEditingLocalizedValue(form.bodyRichText, activeLocale)}
                />
              </div>
            ) : null}
          </div>

          {/* 하단 액션 버튼 영역 */}
          <div className="flex flex-col gap-3 pb-5 sm:flex-row sm:flex-wrap sm:justify-center md:pb-6">
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
              {isSaving ? <LoadingText text="저장 중..." tone="dark" /> : "저장"}
            </Button>
          </div>
        </div>

        {/* 우측 퍼블릭 상세 미리보기 */}
        {showPreview ? (
          <div className="min-w-0 w-full self-start min-[1440px]:flex-1 min-[1440px]:sticky min-[1440px]:top-4">
            <div className="max-h-[calc(100vh-32px)] overflow-auto">
              {isOutlinkType ? (
                <AdminContentPreview
                  date={previewData.date}
                  heroImageAlt={previewData.heroImageAlt}
                  heroImageSrc={previewData.heroImageSrc}
                  section="news"
                  summary={previewData.summary}
                  title={previewData.title}
                  url={previewData.url}
                />
              ) : (
                <AdminContentPreview {...previewData} section={section} />
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
    </section>
  );
}
