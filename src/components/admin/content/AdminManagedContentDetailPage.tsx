"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LoadingText from "@/components/ui/LoadingText";
import Select from "@/components/ui/Select";
import Tab from "@/components/ui/Tab";
import TabGroup from "@/components/ui/TabGroup";
import Textarea from "@/components/ui/Textarea";
import TiptapEditor from "@/components/content/TiptapEditor";
import Tooltip from "@/components/ui/Tooltip";
import { PreviewModal } from "./AdminManagedContentListPage";
import { useAdminNavigationGuard } from "../../layout/admin/AdminNavigationGuard";
import {
  upsertManagedContent,
  useManagedContents,
} from "@/features/content/clientStore";
import type { Locale } from "@/constants/i18n";
import {
  createEmptyManagedContentDraft,
  DEFAULT_NEWS_FORMAT,
  getAdminCategoryHref,
  getContentThumbnailSrc,
  getLocalizedContent,
  getNewsFormatLabel,
  hasAnyLocalizedTitle,
  isDownloadableContentPdfSrc,
  NEWS_FORMATS,
  resolveManagedContentSlug,
  type ContentGatingLevel,
  type ManagedContentCategorySlug,
  type ManagedContentEntry,
  type ManagedContentSection,
  type ManagedContentType,
  type NewsFormat,
} from "@/features/content/data";
import {
  hasTranslatableBodyText,
  localeDisplayNames,
  type TranslationErrorCode,
} from "@/features/content/translation/tiptap";

type DialogState =
  | { type: "cancel" }
  | { description: string; highlightedLines?: string[]; title: string; type: "alert" }
  | { type: "translate-confirm" }
  | { sourceLocale: Locale; type: "translate-loading" }
  | {
      canRetry: boolean;
      code: TranslationErrorCode;
      description: string;
      detail?: string;
      title: string;
      type: "translate-error";
    };

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

const NEWS_FORMAT_LABELS: Record<NewsFormat, Record<Locale, string>> = {
  "Media Coverage": {
    en: "Media Coverage",
    ja: "メディア掲載",
    ko: "미디어 보도",
  },
  "Official Announcement": {
    en: "Official Announcement",
    ja: "公式発表",
    ko: "공식 발표",
  },
  "Press Release": {
    en: "Press Release",
    ja: "プレスリリース",
    ko: "보도자료",
  },
};

function getNewsFormatOptions(locale: Locale): Array<{ label: string; value: NewsFormat }> {
  return NEWS_FORMATS.map((format) => ({
    label: NEWS_FORMAT_LABELS[format][locale],
    value: format,
  }));
}

const TRANSLATION_ERROR_COPY: Record<TranslationErrorCode, { canRetry: boolean; message: string }> = {
  CONFIGURATION_ERROR: {
    canRetry: false,
    message: "번역 API 설정이 없습니다. 관리자에게 OPENAI_API_KEY 설정을 확인해 달라고 요청하세요.",
  },
  CONTENT_TOO_LONG: {
    canRetry: false,
    message: "본문이 너무 길어 한 번에 번역할 수 없습니다. 내용을 나누어 다시 시도하세요.",
  },
  EMPTY_CONTENT: {
    canRetry: false,
    message: "번역할 제목, 요약, 본문이 없습니다.",
  },
  INVALID_RESPONSE: {
    canRetry: true,
    message: "번역 결과 형식이 올바르지 않아 적용하지 못했습니다.",
  },
  NETWORK_ERROR: {
    canRetry: true,
    message: "서버에 연결하지 못했습니다. 네트워크 상태를 확인한 뒤 다시 시도하세요.",
  },
  PROVIDER_ERROR: {
    canRetry: true,
    message: "번역 서버에서 오류가 발생했습니다. 잠시 후 다시 시도하세요.",
  },
  RATE_LIMITED: {
    canRetry: true,
    message: "현재 번역 요청이 많아 처리하지 못했습니다. 잠시 후 다시 시도하세요.",
  },
  REQUEST_ABORTED: {
    canRetry: true,
    message: "번역이 취소되었습니다.",
  },
  UNAUTHORIZED: {
    canRetry: false,
    message: "번역 권한이 없습니다. 다시 로그인한 뒤 시도하세요.",
  },
  UNKNOWN: {
    canRetry: true,
    message: "알 수 없는 오류로 번역하지 못했습니다. 잠시 후 다시 시도하세요.",
  },
};

function getEditingLocalizedValue(
  content: { en: string; ja: string; ko: string },
  locale: Locale,
) {
  return content[locale] ?? "";
}

function getLocaleLabel(locale: Locale) {
  return localeDisplayNames[locale];
}

function hasLocaleTranslationSource(form: ManagedContentEntry, locale: Locale, includeBody: boolean) {
  return Boolean(
    form.title[locale]?.trim() ||
    form.summary[locale]?.trim() ||
    (includeBody && hasTranslatableBodyText(form.bodyRichText[locale])),
  );
}

function hasLocaleEditableContent(form: ManagedContentEntry, locale: Locale, includeBody: boolean) {
  return hasLocaleTranslationSource(form, locale, includeBody);
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
    visibleLocales: form.visibleLocales,
  });
}

function ConfirmDialog({
  className,
  cancelLabel = "닫기",
  confirmLabel,
  description,
  highlightedLines,
  hideCancel = false,
  onCancel,
  onConfirm,
  title,
}: {
  className?: string;
  cancelLabel?: string;
  confirmLabel: string;
  description: string;
  highlightedLines?: string[];
  hideCancel?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
}) {
  return (
    /* 취소/검증 경고에 공통으로 쓰는 확인 모달 */
    <div className={cx("fixed inset-0 z-50 flex items-center justify-center bg-[rgb(var(--color-overlay-rgb)/0.6)] px-5", className)} onClick={onCancel}>
      <div className="w-full max-w-[380px] rounded-modal border border-border bg-[var(--color-bg-modal)] px-6 py-8" onClick={(event) => event.stopPropagation()}>
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="m-0 type-h3 text-fg">{title}</h2>
            <p className="m-0 max-w-[320px] whitespace-pre-line type-body-md leading-7 text-mute">{description}</p>
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
          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            {hideCancel ? null : (
              <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={onCancel} style="round" variant="outline">
                {cancelLabel}
              </Button>
            )}
            <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={onConfirm} style="round" variant="secondary">
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TranslationProgressDialog({
  sourceLocale,
  onCancel,
}: {
  sourceLocale: Locale;
  onCancel: () => void;
}) {
  const targetLocales = (["en", "ko", "ja"] as const).filter((locale) => locale !== sourceLocale);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(var(--color-overlay-rgb)/0.6)] px-5">
      <div className="w-full max-w-[320px] rounded-modal border border-border bg-[var(--color-bg-modal)] px-5 py-8">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-fg border-t-transparent" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="m-0 type-h3 text-fg">번역 중</h2>
            <p className="m-0 type-body-md text-mute">
              {targetLocales.map((locale) => localeDisplayNames[locale]).join(", ")}를 작성하고 있습니다.
            </p>
          </div>
          <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={onCancel} style="round" variant="outline">
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}

function TranslationSourceDialog({
  onCancel,
  onConfirm,
  onSourceLocaleChange,
  sourceLocale,
  sourceLocales,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  onSourceLocaleChange: (locale: Locale) => void;
  sourceLocale: Locale;
  sourceLocales: Locale[];
}) {
  const targetLocales = (["en", "ko", "ja"] as const).filter((locale) => locale !== sourceLocale);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(var(--color-overlay-rgb)/0.6)] px-5" onClick={onCancel}>
      <div className="w-full max-w-[420px] rounded-modal border border-border bg-[var(--color-bg-modal)] px-6 py-8" onClick={(event) => event.stopPropagation()}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="m-0 type-h3 text-fg">기준 언어를 선택하세요.</h2>
            <p className="m-0 max-w-[340px] whitespace-pre-line type-body-md leading-7 text-mute">
              선택하신 언어를 기준으로 나머지 언어를 번역해서 넣습니다.
              {"\n"}번역될 언어의 원문은 사라집니다.
              {"\n"}실행 전 저장을 권장합니다.
            </p>
          </div>
          <label className="flex flex-col items-center gap-2 type-body-md text-fg">
            <span>기준 언어</span>
            <Select
              className="w-[200px]"
              onChange={(event) => onSourceLocaleChange(event.target.value as Locale)}
              options={sourceLocales.map((locale) => ({
                label: localeDisplayNames[locale],
                value: locale,
              }))}
              value={sourceLocale}
            />
          </label>
          <p className="m-0 text-center type-body-sm text-mute">
            {targetLocales.map((locale) => localeDisplayNames[locale]).join(", ")} 항목이 대체됩니다.
          </p>
          <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
            <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={onCancel} style="round" variant="outline">
              취소
            </Button>
            <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={onConfirm} style="round" variant="secondary">
              번역하기
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
        {helperText ? <span className="type-body-sm text-mute">{helperText}</span> : null}
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
  label: React.ReactNode;
}) {
  return (
    <div className="grid items-center gap-2 md:grid-cols-[60px_minmax(0,1fr)]">
      <label className="type-body-md text-fg">{label}</label>
      {children}
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

type PendingVideoUpload = {
  file: File;
  replaceSrc: string;
};

type PendingImageUpload = {
  file: File;
  replaceSrc: string;
};

const LOCALES = ["en", "ko", "ja"] as const;

function replaceAllExact(value: string, search: string, replacement: string) {
  return value.split(search).join(replacement);
}

function formContainsText(form: ManagedContentEntry, value: string) {
  return LOCALES.some((locale) =>
    form.bodyRichText[locale].includes(value) ||
    form.bodyHtml[locale].includes(value),
  );
}

export default function AdminManagedContentDetailPage({
  categorySlug,
  initialItem,
  initialItems,
  itemId,
  section,
}: Props) {
  const router = useRouter();
  const { allowNextNavigation, setHasUnsavedChanges } = useAdminNavigationGuard();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const stickyToolbarRef = useRef<HTMLElement | null>(null);
  const isInitializingRichTextRef = useRef(false);
  const pendingDeletedImageSrcsRef = useRef(new Set<string>());
  const pendingDeletedVideoSrcsRef = useRef(new Set<string>());
  const pendingImageUploadsRef = useRef(new Map<string, PendingImageUpload>());
  const pendingVideoUploadsRef = useRef(new Map<string, PendingVideoUpload>());
  const translationAbortControllerRef = useRef<AbortController | null>(null);
  const items = useManagedContents(section, initialItems, "all", "list") ?? [];
  const currentItem = itemId === "new" ? null : initialItem ?? null;
  const [form, setForm] = useState<ManagedContentEntry>(() => createEmptyManagedContentDraft(section, categorySlug));
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [pendingThumbnailFile, setPendingThumbnailFile] = useState<File | null>(null);
  const [pendingPdfFile, setPendingPdfFile] = useState<File | null>(null);
  const [pendingThumbnailPreviewSrc, setPendingThumbnailPreviewSrc] = useState("");
  const [thumbnailName, setThumbnailName] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [translationSourceLocale, setTranslationSourceLocale] = useState<Locale>("en");
  const [editorToolbarTop, setEditorToolbarTop] = useState("68px");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [translationSuccessMessage, setTranslationSuccessMessage] = useState("");
  const [initialFormSnapshot, setInitialFormSnapshot] = useState(() =>
    serializeDirtyCheckTarget(createEmptyManagedContentDraft(section, categorySlug)),
  );
  const hasUnsavedChanges =
    serializeDirtyCheckTarget(form) !== initialFormSnapshot ||
    Boolean(pendingThumbnailFile) ||
    Boolean(pendingPdfFile) ||
    pendingImageUploadsRef.current.size > 0 ||
    pendingVideoUploadsRef.current.size > 0;
  const isContentType = form.contentType === "content";
  const isOutlinkType = form.contentType === "outlink";
  const supportsLeadGate = section !== "news" && isContentType;
  const useRichEditor = isContentType;
  const translationSourceLocales = (["en", "ko", "ja"] as const).filter((locale) =>
    hasLocaleTranslationSource(form, locale, isContentType),
  );
  const canTranslateAnyLocale = translationSourceLocales.length > 0;

  useLayoutEffect(() => {
    const toolbar = stickyToolbarRef.current;

    if (!toolbar) {
      return;
    }

    const updateEditorToolbarTop = () => {
      const rect = toolbar.getBoundingClientRect();
      setEditorToolbarTop(`${Math.ceil(rect.top + rect.height + 4)}px`);
    };

    updateEditorToolbarTop();

    const resizeObserver = new ResizeObserver(updateEditorToolbarTop);
    resizeObserver.observe(toolbar);
    window.addEventListener("resize", updateEditorToolbarTop);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateEditorToolbarTop);
    };
  }, []);

  useEffect(() => {
    /* 수정 화면이면 기존 데이터를 채우고, 신규면 빈 초안을 준비한다 */
    if (pendingThumbnailPreviewSrc) {
      URL.revokeObjectURL(pendingThumbnailPreviewSrc);
      setPendingThumbnailPreviewSrc("");
    }
    for (const previewSrc of pendingImageUploadsRef.current.keys()) {
      URL.revokeObjectURL(previewSrc);
    }
    pendingImageUploadsRef.current.clear();
    pendingDeletedImageSrcsRef.current.clear();
    for (const previewSrc of pendingVideoUploadsRef.current.keys()) {
      URL.revokeObjectURL(previewSrc);
    }
    pendingVideoUploadsRef.current.clear();
    pendingDeletedVideoSrcsRef.current.clear();
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
      translationAbortControllerRef.current?.abort();
      if (pendingThumbnailPreviewSrc) {
        URL.revokeObjectURL(pendingThumbnailPreviewSrc);
      }
      for (const previewSrc of pendingImageUploadsRef.current.keys()) {
        URL.revokeObjectURL(previewSrc);
      }
      pendingImageUploadsRef.current.clear();
      pendingDeletedImageSrcsRef.current.clear();
      for (const previewSrc of pendingVideoUploadsRef.current.keys()) {
        URL.revokeObjectURL(previewSrc);
      }
      pendingVideoUploadsRef.current.clear();
      pendingDeletedVideoSrcsRef.current.clear();
    };
  }, [pendingThumbnailPreviewSrc]);

  useEffect(() => {
    if (!translationSuccessMessage) {
      return;
    }

    const timeout = window.setTimeout(() => setTranslationSuccessMessage(""), 4500);
    return () => window.clearTimeout(timeout);
  }, [translationSuccessMessage]);

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

  function toggleVisibleLocale(locale: "en" | "ko" | "ja", checked: boolean) {
    if (!hasLocaleEditableContent(form, locale, isContentType)) {
      return;
    }

    setForm((current) => ({
      ...current,
      visibleLocales: checked
        ? Array.from(new Set([...current.visibleLocales, locale]))
        : current.visibleLocales.filter((item) => item !== locale),
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
        setInitialFormSnapshot(serializeDirtyCheckTarget(nextForm));
        isInitializingRichTextRef.current = false;
      }

      return nextForm;
    });
  }

  function getTranslationFailureCopy(code: TranslationErrorCode, fallback?: string) {
    const copy = TRANSLATION_ERROR_COPY[code] ?? TRANSLATION_ERROR_COPY.UNKNOWN;
    return {
      canRetry: copy.canRetry,
      message: fallback || copy.message,
    };
  }

  function openTranslationConfirm() {
    if (!canTranslateAnyLocale) {
      const copy = getTranslationFailureCopy("EMPTY_CONTENT");
      setDialog({
        canRetry: false,
        code: "EMPTY_CONTENT",
        description: `${copy.message} 기존 입력 내용은 변경되지 않았습니다.`,
        title: "번역할 내용이 없습니다.",
        type: "translate-error",
      });
      return;
    }

    setTranslationSourceLocale(
      translationSourceLocales.includes(activeLocale)
        ? activeLocale
        : translationSourceLocales[0],
    );
    setDialog({ type: "translate-confirm" });
  }

  async function requestTranslation(targetLocale: Locale, sourceLocale: Locale, signal: AbortSignal) {
    const response = await fetch("/api/admin/content/translate", {
      body: JSON.stringify({
        bodyRichText: isContentType ? form.bodyRichText[sourceLocale] : "",
        locale: targetLocale,
        summary: form.summary[sourceLocale],
        title: form.title[sourceLocale],
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      signal,
    });

    const payload = (await response.json().catch(() => ({}))) as {
      bodyRichText?: string;
      code?: TranslationErrorCode;
      detail?: string;
      error?: string;
      message?: string;
      summary?: string;
      title?: string;
    };

    if (!response.ok) {
      const code = payload.code ?? "UNKNOWN";
      const copy = getTranslationFailureCopy(code, payload.error);

      throw Object.assign(new Error(copy.message), {
        detail: payload.detail,
        translationCode: code,
      });
    }

    return {
      bodyRichText: payload.bodyRichText ?? form.bodyRichText[sourceLocale],
      locale: targetLocale,
      summary: payload.summary ?? form.summary[sourceLocale],
      title: payload.title ?? form.title[sourceLocale],
    };
  }

  async function runTranslation(sourceLocale = translationSourceLocale) {
    if (
      dialog?.type === "translate-loading" ||
      !hasLocaleTranslationSource(form, sourceLocale, isContentType)
    ) {
      return;
    }

    const targetLocales = (["en", "ko", "ja"] as const).filter((locale) => locale !== sourceLocale);
    const controller = new AbortController();
    translationAbortControllerRef.current = controller;
    setTranslationSuccessMessage("");
    setDialog({ sourceLocale, type: "translate-loading" });

    try {
      const translations = await Promise.all(
        targetLocales.map((targetLocale) =>
          requestTranslation(targetLocale, sourceLocale, controller.signal),
        ),
      );

      setForm((current) => ({
        ...current,
        bodyRichText: {
          ...current.bodyRichText,
          ...Object.fromEntries(
            translations.map((translation) => [translation.locale, translation.bodyRichText]),
          ),
        },
        summary: {
          ...current.summary,
          ...Object.fromEntries(
            translations.map((translation) => [translation.locale, translation.summary]),
          ),
        },
        title: {
          ...current.title,
          ...Object.fromEntries(
            translations.map((translation) => [translation.locale, translation.title]),
          ),
        },
      }));
      setDialog(null);
      setTranslationSuccessMessage("번역이 완료되었습니다.");
    } catch (error) {
      if (controller.signal.aborted) {
        setDialog(null);
        setTranslationSuccessMessage("번역이 취소되었습니다. 기존 입력 내용은 변경되지 않았습니다.");
        return;
      }

      const code = (error as { translationCode?: TranslationErrorCode } | null)?.translationCode ?? "NETWORK_ERROR";
      const copy = getTranslationFailureCopy(code, error instanceof Error ? error.message : undefined);
      setDialog({
        canRetry: copy.canRetry,
        code,
        description: `${copy.message} 기존 입력 내용은 변경되지 않았습니다.`,
        detail: (error as { detail?: string } | null)?.detail,
        title: "번역 실패",
        type: "translate-error",
      });
    } finally {
      if (translationAbortControllerRef.current === controller) {
        translationAbortControllerRef.current = null;
      }
    }
  }

  function cancelTranslation() {
    translationAbortControllerRef.current?.abort();
  }

  function handleContentTypeChange(nextType: ManagedContentType) {
    setForm((current) => ({
      ...current,
      contentType: nextType,
      gatingLevel: nextType === "content" ? current.gatingLevel : "none",
      authorName: section === "news" && !current.authorName.trim() ? DEFAULT_NEWS_FORMAT : current.authorName,
      authorRole: section === "news" ? "" : current.authorRole,
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

  function prepareImagePreview(file: File, replaceSrc?: string) {
    const previewSrc = URL.createObjectURL(file);
    const normalizedReplaceSrc = replaceSrc ?? "";
    let serverReplaceSrc = normalizedReplaceSrc;

    if (normalizedReplaceSrc.startsWith("blob:")) {
      serverReplaceSrc = pendingImageUploadsRef.current.get(normalizedReplaceSrc)?.replaceSrc ?? "";
      URL.revokeObjectURL(normalizedReplaceSrc);
      pendingImageUploadsRef.current.delete(normalizedReplaceSrc);
    }

    pendingImageUploadsRef.current.set(previewSrc, {
      file,
      replaceSrc: serverReplaceSrc.startsWith("blob:") ? "" : serverReplaceSrc,
    });
    setHasUnsavedChanges(true);

    return previewSrc;
  }

  function trackRemovedImage(src: string) {
    if (src.startsWith("blob:")) {
      URL.revokeObjectURL(src);
      pendingImageUploadsRef.current.delete(src);
      return;
    }

    pendingDeletedImageSrcsRef.current.add(src);
    setHasUnsavedChanges(true);
  }

  function prepareVideoPreview(file: File, replaceSrc?: string) {
    const previewSrc = URL.createObjectURL(file);
    const normalizedReplaceSrc = replaceSrc ?? "";
    let serverReplaceSrc = normalizedReplaceSrc;

    if (normalizedReplaceSrc.startsWith("blob:")) {
      serverReplaceSrc = pendingVideoUploadsRef.current.get(normalizedReplaceSrc)?.replaceSrc ?? "";
      URL.revokeObjectURL(normalizedReplaceSrc);
      pendingVideoUploadsRef.current.delete(normalizedReplaceSrc);
    }

    pendingVideoUploadsRef.current.set(previewSrc, {
      file,
      replaceSrc: serverReplaceSrc.startsWith("blob:") ? "" : serverReplaceSrc,
    });
    setHasUnsavedChanges(true);

    return previewSrc;
  }

  function trackRemovedVideo(src: string) {
    if (src.startsWith("blob:")) {
      URL.revokeObjectURL(src);
      pendingVideoUploadsRef.current.delete(src);
      return;
    }

    pendingDeletedVideoSrcsRef.current.add(src);
    setHasUnsavedChanges(true);
  }

  async function uploadVideo(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("section", section);
    formData.append("categorySlug", categorySlug);

    const response = await fetch("/api/admin/uploads", {
      body: formData,
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("video upload failed");
    }

    const payload = (await response.json()) as { src?: string };

    if (!payload.src) {
      throw new Error("missing video src");
    }

    return payload.src;
  }

  async function deleteUploadedFile(src: string) {
    if (!src || src.startsWith("blob:")) {
      return;
    }

    await fetch("/api/admin/uploads", {
      body: JSON.stringify({ categorySlug, section, src }),
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
    });
  }

  async function finalizePendingImages(currentForm: ManagedContentEntry) {
    const pendingEntries = Array.from(pendingImageUploadsRef.current.entries()).filter(([previewSrc]) =>
      formContainsText(currentForm, previewSrc),
    );

    if (pendingEntries.length === 0) {
      return {
        finalizedForm: currentForm,
        oldImageSrcs: [] as string[],
        uploadedImageSrcs: [] as string[],
      };
    }

    let finalizedForm: ManagedContentEntry = {
      ...currentForm,
      bodyHtml: { ...currentForm.bodyHtml },
      bodyRichText: { ...currentForm.bodyRichText },
    };
    const oldImageSrcs: string[] = [];
    const uploadedImageSrcs: string[] = [];

    for (const [previewSrc, pendingImage] of pendingEntries) {
      const uploadedSrc = await uploadThumbnail(pendingImage.file);
      uploadedImageSrcs.push(uploadedSrc);

      finalizedForm = {
        ...finalizedForm,
        bodyHtml: {
          en: replaceAllExact(finalizedForm.bodyHtml.en, previewSrc, uploadedSrc),
          ko: replaceAllExact(finalizedForm.bodyHtml.ko, previewSrc, uploadedSrc),
          ja: replaceAllExact(finalizedForm.bodyHtml.ja, previewSrc, uploadedSrc),
        },
        bodyRichText: {
          en: replaceAllExact(finalizedForm.bodyRichText.en, previewSrc, uploadedSrc),
          ko: replaceAllExact(finalizedForm.bodyRichText.ko, previewSrc, uploadedSrc),
          ja: replaceAllExact(finalizedForm.bodyRichText.ja, previewSrc, uploadedSrc),
        },
      };

      if (pendingImage.replaceSrc && pendingImage.replaceSrc !== uploadedSrc) {
        oldImageSrcs.push(pendingImage.replaceSrc);
      }
    }

    return {
      finalizedForm,
      oldImageSrcs,
      uploadedImageSrcs,
    };
  }

  async function finalizePendingVideos(currentForm: ManagedContentEntry) {
    const pendingEntries = Array.from(pendingVideoUploadsRef.current.entries()).filter(([previewSrc]) =>
      formContainsText(currentForm, previewSrc),
    );

    if (pendingEntries.length === 0) {
      return {
        finalizedForm: currentForm,
        oldVideoSrcs: [] as string[],
        uploadedVideoSrcs: [] as string[],
      };
    }

    let finalizedForm: ManagedContentEntry = {
      ...currentForm,
      bodyHtml: { ...currentForm.bodyHtml },
      bodyRichText: { ...currentForm.bodyRichText },
    };
    const oldVideoSrcs: string[] = [];
    const uploadedVideoSrcs: string[] = [];

    for (const [previewSrc, pendingVideo] of pendingEntries) {
      const uploadedSrc = await uploadVideo(pendingVideo.file);
      uploadedVideoSrcs.push(uploadedSrc);

      finalizedForm = {
        ...finalizedForm,
        bodyHtml: {
          en: replaceAllExact(finalizedForm.bodyHtml.en, previewSrc, uploadedSrc),
          ko: replaceAllExact(finalizedForm.bodyHtml.ko, previewSrc, uploadedSrc),
          ja: replaceAllExact(finalizedForm.bodyHtml.ja, previewSrc, uploadedSrc),
        },
        bodyRichText: {
          en: replaceAllExact(finalizedForm.bodyRichText.en, previewSrc, uploadedSrc),
          ko: replaceAllExact(finalizedForm.bodyRichText.ko, previewSrc, uploadedSrc),
          ja: replaceAllExact(finalizedForm.bodyRichText.ja, previewSrc, uploadedSrc),
        },
      };

      if (pendingVideo.replaceSrc && pendingVideo.replaceSrc !== uploadedSrc) {
        oldVideoSrcs.push(pendingVideo.replaceSrc);
      }
    }

    return {
      finalizedForm,
      oldVideoSrcs,
      uploadedVideoSrcs,
    };
  }

  function validateForm(targetForm: ManagedContentEntry = form) {
    /* 저장/게시 전 필수 입력값만 간단히 검증한다 */
    const missing: string[] = [];
    if (!hasAnyLocalizedTitle(targetForm.title)) missing.push("제목 (EN/KO/JA 중 1개)");
    for (const locale of targetForm.visibleLocales) {
      if (!targetForm.title[locale]?.trim()) {
        missing.push(`${getLocaleLabel(locale)} 제목`);
      }
    }
    if (supportsLeadGate && targetForm.enableDownloadButton && !targetForm.downloadPdfSrc.trim() && !pendingPdfFile) {
      missing.push("PDF");
    }
    if (
      supportsLeadGate &&
      targetForm.enableDownloadButton &&
      targetForm.downloadPdfSrc.trim() &&
      !pendingPdfFile &&
      !isDownloadableContentPdfSrc(section, targetForm.downloadPdfSrc)
    ) {
      missing.push("PDF 경로 (/documentation/...pdf 또는 /demo/...pdf)");
    }
    if (isOutlinkType) {
      if (!targetForm.summary.en.trim()) missing.push("설명 (EN)");
      if (!targetForm.externalUrl.trim()) missing.push("URL");
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
    const missing = validateForm(currentForm);
    if (missing.length > 0) {
      const hasVisibleLocaleTitleMissing = currentForm.visibleLocales.some((locale) =>
        !currentForm.title[locale]?.trim(),
      );
      setDialog({
        description: hasVisibleLocaleTitleMissing
          ? "노출 체크된 언어는 제목이 필요합니다.\n제목이 없으면 공개 화면에서\n다른 언어 제목이 표시될 수 있습니다."
          : "다음 항목을 입력해야 저장할 수 있습니다.",
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
    let finalizedContentForm = currentForm;
    let oldImageSrcs: string[] = [];
    let uploadedImageSrcs: string[] = [];
    let oldVideoSrcs: string[] = [];
    let uploadedVideoSrcs: string[] = [];

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

    try {
      const finalizedImages = await finalizePendingImages(currentForm);
      finalizedContentForm = finalizedImages.finalizedForm;
      oldImageSrcs = finalizedImages.oldImageSrcs;
      uploadedImageSrcs = finalizedImages.uploadedImageSrcs;
    } catch {
      setDialog({
        description: "이미지를 저장하지 못했습니다. 다시 시도해 주세요.",
        title: "이미지 업로드에 실패했습니다.",
        type: "alert",
      });
      setIsSaving(false);
      return;
    }

    try {
      const finalizedVideos = await finalizePendingVideos(finalizedContentForm);
      finalizedContentForm = finalizedVideos.finalizedForm;
      oldVideoSrcs = finalizedVideos.oldVideoSrcs;
      uploadedVideoSrcs = finalizedVideos.uploadedVideoSrcs;
    } catch {
      setDialog({
        description: "영상을 저장하지 못했습니다. 다시 시도해 주세요.",
        title: "영상 업로드에 실패했습니다.",
        type: "alert",
      });
      setIsSaving(false);
      return;
    }

    const nextId = resolveManagedContentSlug({
      currentId: itemId === "new" ? undefined : itemId,
      enteredSlug: finalizedContentForm.id,
      items: items.filter((item) => item.section === section),
      title: finalizedContentForm.title,
    });

    const nextSortOrder =
      itemId === "new"
        ? 1
        : currentForm.sortOrder;

    const nextItem: ManagedContentEntry = {
      ...finalizedContentForm,
      categorySlug,
      id: nextId,
      downloadCoverImageSrc: nextDownloadCoverImageSrc || nextImageSrc,
      downloadPdfFileName: nextDownloadPdfFileName,
      downloadPdfSrc: nextDownloadPdfSrc,
      gatingLevel:
        section !== "news" && finalizedContentForm.contentType === "content"
          ? finalizedContentForm.gatingLevel
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
        { shiftSiblingsForNew: itemId === "new" },
      );
    } catch (error) {
      await Promise.all(uploadedImageSrcs.map((src) => deleteUploadedFile(src)));
      await Promise.all(uploadedVideoSrcs.map((src) => deleteUploadedFile(src)));
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
    const imageSrcsToDelete = Array.from(new Set([
      ...oldImageSrcs,
      ...pendingDeletedImageSrcsRef.current,
    ])).filter((src) => !formContainsText(nextItem, src));
    await Promise.all(imageSrcsToDelete.map((src) => deleteUploadedFile(src)));
    const videoSrcsToDelete = Array.from(new Set([
      ...oldVideoSrcs,
      ...pendingDeletedVideoSrcsRef.current,
    ])).filter((src) => !formContainsText(nextItem, src));
    await Promise.all(videoSrcsToDelete.map((src) => deleteUploadedFile(src)));
    for (const previewSrc of pendingImageUploadsRef.current.keys()) {
      URL.revokeObjectURL(previewSrc);
    }
    pendingImageUploadsRef.current.clear();
    pendingDeletedImageSrcsRef.current.clear();
    for (const previewSrc of pendingVideoUploadsRef.current.keys()) {
      URL.revokeObjectURL(previewSrc);
    }
    pendingVideoUploadsRef.current.clear();
    pendingDeletedVideoSrcsRef.current.clear();

    setPendingThumbnailFile(null);
    setPendingPdfFile(null);
    setPendingThumbnailPreviewSrc("");
    setHasUnsavedChanges(false);
    allowNextNavigation();
    window.location.assign(getAdminCategoryHref(section, categorySlug));
  }

  const previewItem: ManagedContentEntry = {
    ...form,
    bodyHtml: isOutlinkType ? { en: "", ko: "", ja: "" } : form.bodyHtml,
    bodyRichText: isOutlinkType ? { en: "", ko: "", ja: "" } : form.bodyRichText,
    imageSrc: pendingThumbnailPreviewSrc || form.imageSrc,
  };

  return (
    <section className="flex flex-col gap-4">
      {/* 편집 페이지 상단 스티키 툴바 */}
      <header className="sticky top-[60px] z-30 -mx-5 overflow-x-auto bg-bg px-5 py-3 md:top-0 md:-mx-10 md:px-10" ref={stickyToolbarRef}>
        <div className="flex w-full min-w-0 flex-nowrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-3">
            <div className="w-[180px] min-w-[140px] shrink">
              <Select
                onChange={(event) => handleContentTypeChange(event.target.value as ManagedContentType)}
                options={[
                  { label: "컨텐츠(기본)", value: "content" },
                  { label: "아웃링크", value: "outlink" },
                ]}
                value={form.contentType}
              />
            </div>
            {supportsLeadGate ? (
              <div className="w-[180px] min-w-[140px] shrink">
                <Select
                  onChange={(event) => updateForm("gatingLevel", event.target.value as ContentGatingLevel)}
                  options={CONTENT_GATING_OPTIONS}
                  value={form.gatingLevel}
                />
              </div>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-nowrap items-center justify-end gap-3">
            <TabGroup className="shrink-0 self-start">
              {(["en", "ko", "ja"] as const).map((locale) => {
                const canToggleLocale = hasLocaleEditableContent(form, locale, isContentType);

                return (
                  <Tab
                    className="gap-2 px-3 md:px-4"
                    key={locale}
                    onClick={() => setActiveLocale(locale)}
                    state={activeLocale === locale ? "on" : "off"}
                  >
                    <span>{locale.toUpperCase()}</span>
                    <Tooltip
                      content={
                        canToggleLocale
                          ? "해당 언어를 노출하려면 체크하세요."
                          : "해당 탭에 내용을 입력해야 노출할 수 있습니다."
                      }
                      placement="bottom"
                    >
                      <input
                        aria-label={`${locale.toUpperCase()} 노출`}
                        checked={form.visibleLocales.includes(locale)}
                        className="ml-1 h-3.5 w-3.5 shrink-0 self-center rounded border-border bg-bg-content accent-[var(--color-success)] disabled:opacity-40"
                        disabled={!canToggleLocale}
                        onChange={(event) => toggleVisibleLocale(locale, event.target.checked)}
                        onClick={(event) => event.stopPropagation()}
                        type="checkbox"
                      />
                    </Tooltip>
                  </Tab>
                );
              })}
            </TabGroup>
            <Button
              arrow={false}
              className="shrink-0 justify-center whitespace-nowrap"
              disabled={!canTranslateAnyLocale || dialog?.type === "translate-loading"}
              onClick={openTranslationConfirm}
              style="round"
              variant="outline"
            >
              번역
            </Button>
            <div className="flex shrink-0 flex-nowrap items-center gap-3">
              <Button arrow={false} className="shrink-0 justify-center whitespace-nowrap" onClick={() => setPreviewOpen(true)} style="round" variant="outline">
                미리보기
              </Button>
              <Button
                arrow={false}
                className="shrink-0 justify-center whitespace-nowrap"
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
                className="shrink-0 justify-center whitespace-nowrap"
                disabled={isSaving}
                onClick={() => commit(itemId === "new" ? "hidden" : form.status)}
                style="round"
                variant="primary"
              >
                {isSaving ? <LoadingText text="저장 중..." tone="dark" /> : "저장"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[720px]">
        <div className="flex min-w-0 w-full flex-col gap-5 overflow-visible">
          {/* 좌측 작성 폼 본문 */}
          <div className="grid gap-5 pt-3">
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
            {section === "news" ? (
              <InlineField label="형식">
                <Select
                  onChange={(event) => updateForm("authorName", event.target.value as NewsFormat)}
                  options={getNewsFormatOptions(activeLocale)}
                  value={getNewsFormatLabel(form)}
                />
              </InlineField>
            ) : isContentType ? (
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
                  <Input className="w-full bg-bg-content" inputClassName="text-mute" readOnly type="text" value={form.dateIso} />
                  {form.dateIso ? (
                    <button
                      className="shrink-0 bg-transparent p-0 type-body-md text-mute transition-colors hover:text-fg"
                      onClick={clearDate}
                      type="button"
                    >
                      삭제
                    </button>
                  ) : null}
                </div>
                <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={handleDateButtonClick} style="round" variant="outline">선택</Button>
                {supportsLeadGate ? (
                  <label className="flex items-center gap-2 type-body-sm text-mute sm:ml-5">
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
                        className="shrink-0 bg-transparent p-0 type-body-md text-mute transition-colors hover:text-fg"
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
                        className="shrink-0 bg-transparent p-0 type-body-md text-mute transition-colors hover:text-fg"
                        onClick={clearThumbnail}
                        type="button"
                      >
                        삭제
                      </button>
                    ) : null}
                  </div>
                  <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={() => fileInputRef.current?.click()} style="round" variant="outline">추가</Button>
                  <label className="flex items-center gap-2 type-body-sm text-mute lg:ml-1">
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
                        className="shrink-0 bg-transparent p-0 type-body-md text-mute transition-colors hover:text-fg"
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
                  onPrepareImage={prepareImagePreview}
                  onRemoveVideo={trackRemovedVideo}
                  onRemoveImage={trackRemovedImage}
                  onPrepareVideo={prepareVideoPreview}
                  toolbarStickyTop={editorToolbarTop}
                  value={getEditingLocalizedValue(form.bodyRichText, activeLocale)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {previewOpen ? (
        <PreviewModal
          item={previewItem}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}

      {translationSuccessMessage ? (
        <div className="fixed left-1/2 top-5 z-[60] -translate-x-1/2 rounded-[8px] border border-border bg-[var(--color-bg-modal)] px-5 py-3 text-center shadow-[0_12px_32px_rgba(0,0,0,0.32)] backdrop-blur-[12px] type-body-sm text-fg">
          {translationSuccessMessage}
        </div>
      ) : null}

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
          hideCancel
          highlightedLines={dialog.highlightedLines}
          onCancel={() => setDialog(null)}
          onConfirm={() => setDialog(null)}
          title={dialog.title}
        />
      ) : null}

      {dialog?.type === "translate-confirm" ? (
        <TranslationSourceDialog
          onCancel={() => setDialog(null)}
          onConfirm={() => void runTranslation(translationSourceLocale)}
          onSourceLocaleChange={setTranslationSourceLocale}
          sourceLocale={translationSourceLocale}
          sourceLocales={translationSourceLocales}
        />
      ) : null}

      {dialog?.type === "translate-loading" ? (
        <TranslationProgressDialog sourceLocale={dialog.sourceLocale} onCancel={cancelTranslation} />
      ) : null}

      {dialog?.type === "translate-error" ? (
        <ConfirmDialog
          cancelLabel="닫기"
          confirmLabel={dialog.canRetry ? "다시 시도" : "확인"}
          description={
            dialog.detail
              ? `${dialog.description} 오류 상세: ${dialog.detail}`
              : dialog.description
          }
          onCancel={() => setDialog(null)}
          onConfirm={() => {
            if (!dialog.canRetry) {
              setDialog(null);
              return;
            }

            void runTranslation(translationSourceLocale);
          }}
          title={dialog.title}
        />
      ) : null}
    </section>
  );
}
