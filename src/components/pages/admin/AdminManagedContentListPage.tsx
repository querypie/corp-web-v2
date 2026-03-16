"use client";

import { useEffect, useMemo, useState } from "react";
import AdminHeader from "../../layout/admin/AdminHeader";
import Button from "../../common/Button";
import {
  deleteManagedContent,
  updateManagedContentStatus,
  useManagedContents,
} from "@/features/content/clientStore";
import {
  formatPublicDate,
  getAdminCategoryHref,
  getAdminDetailHref,
  getManagedCategoryLabel,
  getWriterLabel,
  type ManagedContentCategorySlug,
  type ManagedContentEntry,
  type ManagedContentSection,
} from "@/features/content/data";
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
    <div className="flex h-10 w-full items-center rounded-button bg-bg-content px-3 md:max-w-[320px]">
      <input
        className="w-full border-0 bg-transparent type-body-md text-fg outline-none placeholder:text-mute-fg"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search content"
        type="text"
        value={value}
      />
    </div>
  );
}

function VisibilitySwitch({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <button
      aria-label={checked ? "노출 중" : "비노출"}
      className={cx(
        "relative inline-flex h-7 w-[50px] items-center rounded-full transition-colors",
        disabled && "cursor-not-allowed opacity-40",
        checked ? "bg-success/30" : "bg-bg-deep",
      )}
      disabled={disabled}
      onClick={onChange}
      type="button"
    >
      <span
        className={cx(
          "inline-block h-5 w-5 rounded-full transition-transform",
          checked ? "translate-x-[26px] bg-success" : "translate-x-[3px] bg-mute-fg",
        )}
      />
    </button>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,9,10,0.6)] px-5" onClick={onCancel}>
      <div className="w-full max-w-[300px] rounded-modal bg-bg-content px-5 py-8" onClick={(event) => event.stopPropagation()}>
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="m-0 type-h3 text-fg">Are you sure?</h2>
            <p className="m-0 type-body-md text-mute-fg">This action cannot be undone.</p>
          </div>
          <div className="flex justify-center gap-3">
            <Button arrow={false} onClick={onCancel} variant="outline">
              Cancel
            </Button>
            <Button arrow={false} onClick={onConfirm} variant="secondary">
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderInlineMarkdown(text: string) {
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
        <code key={index} className="rounded-[8px] bg-bg-content px-2 py-1 type-body-lg text-fg">
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

function PreviewMarkdown({ markdown }: { markdown: string }) {
  const blocks = markdown.trim().split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return (
    <div className="flex flex-col gap-5 text-fg">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n");
        const firstLine = lines[0] ?? "";

        if (/^```/.test(firstLine) && /^```$/.test(lines[lines.length - 1] ?? "")) {
          return (
            <pre key={blockIndex} className="m-0 overflow-x-auto rounded-[20px] bg-bg-content px-4 py-4 type-body-lg text-fg">
              <code>{lines.slice(1, -1).join("\n")}</code>
            </pre>
          );
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

function PreviewModal({
  item,
  onClose,
  onDelete,
}: {
  item: ManagedContentEntry;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,9,10,0.72)] px-5 py-6" onClick={onClose}>
      <div
        className="flex max-h-[calc(100vh-48px)] w-full max-w-[980px] flex-col overflow-hidden rounded-[28px] border border-border bg-bg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="overflow-auto px-5 py-5 md:px-6">
          <div className="mx-auto flex w-full max-w-[680px] flex-col gap-[80px] py-5">
            <div className="flex flex-col gap-[10px]">
              <h1 className="m-0 type-h1 leading-[42px] text-fg">{item.title}</h1>
              <div className="type-body-md text-fg">{getWriterLabel(item)}</div>
              <p className="m-0 type-body-md text-mute-fg">{formatPublicDate("ko", item.dateIso)}</p>
            </div>
            <div className="h-[220px] w-full overflow-hidden rounded-box bg-bg-content md:h-[380px]">
              <img alt={item.title} className="block h-full w-full object-cover" src={item.imageSrc} />
            </div>
            <PreviewMarkdown markdown={item.bodyMarkdown} />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={onClose} variant="outline">
            Close
          </Button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a className="w-full sm:w-auto" href={getAdminDetailHref(item.section, item.categorySlug, item.id)}>
              <Button arrow={false} className="w-full justify-center sm:w-auto" variant="outline">
                Modify
              </Button>
            </a>
            <Button arrow={false} className="w-full justify-center sm:w-auto" onClick={onDelete} variant="secondary">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentRow({
  index,
  item,
  onOpenPreview,
  onTogglePublished,
  showCategory,
}: {
  index: number;
  item: ManagedContentEntry;
  onOpenPreview: () => void;
  onTogglePublished: () => void;
  showCategory: boolean;
}) {
  const isDraft = item.status === "draft";
  const isPublished = item.status === "published";
  const statusLabel = isDraft ? "작성중" : isPublished ? "view" : "hidden";

  return (
    <div
      className="card-hover flex cursor-pointer flex-col gap-4 rounded-box border border-transparent bg-bg-content p-4 focus-visible:outline-none md:grid md:grid-cols-[120px_minmax(0,1fr)_120px_120px] md:items-center md:gap-4"
      data-reveal
      onClick={onOpenPreview}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenPreview();
        }
      }}
      role="button"
      style={{ transitionDelay: `${index * 70}ms` }}
      tabIndex={0}
    >
      <div className="h-[180px] w-full overflow-hidden rounded-thumb bg-bg-deep md:h-20 md:w-[120px]">
        <img alt={item.title} className="block h-full w-full object-cover" src={item.imageSrc} />
      </div>

      <div className="min-w-0">
        {showCategory ? (
          <p className="mb-2 mt-0 type-body-md text-mute-fg">
            {getManagedCategoryLabel(item.section, item.categorySlug, "en")}
          </p>
        ) : null}
        <p className="m-0 type-body-lg text-fg">{item.title}</p>
      </div>

      <div className="flex items-center justify-between gap-4 md:contents">
        <div className="type-body-md text-mute-fg md:block">{formatPublicDate("en", item.dateIso)}</div>

        <div className="flex items-center justify-end gap-3 md:contents">
          <div className="flex items-center gap-3 md:justify-start">
            <div
              className="inline-flex"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (!isDraft) onTogglePublished();
              }}
            >
              <VisibilitySwitch checked={isPublished} disabled={isDraft} onChange={() => {}} />
            </div>
            <span className={cx("type-body-md", isPublished ? "text-fg" : "text-mute-fg")}>
              {statusLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  categorySlug: ManagedContentCategorySlug | "all";
  description: string;
  section: ManagedContentSection;
  title: string;
};

export default function AdminManagedContentListPage({
  categorySlug,
  description,
  section,
  title,
}: Props) {
  const items = useManagedContents(section);
  const isHydrated = useHydrated();
  const [query, setQuery] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<ManagedContentEntry | null>(null);

  const filteredItems = useMemo(() => {
    const byCategory =
      categorySlug === "all"
        ? items
        : items.filter((item) => item.categorySlug === categorySlug);

    const normalized = query.trim().toLowerCase();
    if (!normalized) return byCategory;
    return byCategory.filter((item) => item.title.toLowerCase().includes(normalized));
  }, [categorySlug, items, query]);

  const writeHref =
    categorySlug === "all"
      ? getAdminCategoryHref(section, section === "demo" ? "use-cases" : "blogs") + "/new"
      : getAdminCategoryHref(section, categorySlug) + "/new";

  return (
    <section className="flex flex-col gap-8">
      <AdminHeader description={description} title={title} />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchField onChange={setQuery} value={query} />
        {categorySlug !== "all" ? (
          <a className="w-full md:w-auto" href={writeHref}>
            <Button arrow={false} className="w-full justify-center md:w-auto" variant="secondary">
              Create Content
            </Button>
          </a>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        {!isHydrated ? (
          <div className="flex min-h-[240px] items-center justify-center px-5 py-6 text-center" />
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <ContentRow
              key={item.id}
              index={index}
              item={item}
              onOpenPreview={() => setPreviewItem(item)}
              onTogglePublished={() =>
                updateManagedContentStatus(
                  item.id,
                  item.status === "published" ? "hidden" : "published",
                )
              }
              showCategory={categorySlug === "all"}
            />
          ))
        ) : (
          <div className="flex min-h-[240px] items-center justify-center px-5 py-6 text-center">
            <p className="m-0 type-body-md text-mute-fg">게시물이 없습니다.</p>
          </div>
        )}
      </div>

      {pendingDeleteId ? (
        <DeleteConfirmDialog
          onCancel={() => setPendingDeleteId(null)}
          onConfirm={() => {
            deleteManagedContent(pendingDeleteId);
            setPreviewItem((current) => (current?.id === pendingDeleteId ? null : current));
            setPendingDeleteId(null);
          }}
        />
      ) : null}

      {previewItem ? (
        <PreviewModal
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onDelete={() => {
            setPreviewItem(null);
            setPendingDeleteId(previewItem.id);
          }}
        />
      ) : null}
    </section>
  );
}
