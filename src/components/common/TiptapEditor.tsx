"use client";

import { useEffect, useMemo, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { TableKit } from "@tiptap/extension-table";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function parseContent(value: string) {
  if (!value.trim()) {
    return {
      content: [{ type: "paragraph" }],
      type: "doc",
    };
  }

  try {
    return JSON.parse(value);
  } catch {
    return {
      content: [{ type: "paragraph" }],
      type: "doc",
    };
  }
}

function ToolButton({
  children,
  isActive = false,
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cx(
        "rounded-button px-3.5 py-2 type-body-sm transition-colors whitespace-nowrap",
        isActive
          ? "bg-fg text-bg"
          : "bg-transparent text-fg hover:bg-secondary hover:text-fg",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

type Props = {
  className?: string;
  onChange: (payload: { html: string; json: string }) => void;
  onUploadImage?: (file: File) => Promise<string>;
  value: string;
};

export default function TiptapEditor({
  className,
  onChange,
  onUploadImage,
  value,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastAppliedValueRef = useRef(value);
  const content = useMemo(() => parseContent(value), [value]);

  const editor = useEditor({
    content,
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] outline-none type-content-body text-fg [&_a]:text-fg [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded-[8px] [&_code]:bg-bg-content [&_code]:px-2 [&_code]:py-1 [&_code]:type-content-mono [&_h1]:type-content-h1 [&_h2]:type-content-h2 [&_h3]:type-content-h3 [&_img]:w-full [&_img]:rounded-box [&_p.is-editor-empty:first-child::before]:pointer-events-none [&_p.is-editor-empty:first-child::before]:float-left [&_p.is-editor-empty:first-child::before]:h-0 [&_p.is-editor-empty:first-child::before]:text-mute-fg [&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_pre]:overflow-x-auto [&_pre]:rounded-[10px] [&_pre]:bg-bg-content [&_pre]:px-2 [&_pre]:py-4 [&_pre]:type-content-mono [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-border [&_th]:bg-bg-content [&_th]:px-3 [&_th]:py-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
      },
    },
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Youtube.configure({
        allowFullscreen: true,
        controls: true,
        nocookie: true,
      }),
      TableKit,
    ],
    immediatelyRender: false,
    onCreate({ editor: currentEditor }) {
      onChange({
        html: currentEditor.getHTML(),
        json: JSON.stringify(currentEditor.getJSON()),
      });
    },
    onUpdate({ editor: currentEditor }) {
      const nextJson = JSON.stringify(currentEditor.getJSON());
      lastAppliedValueRef.current = nextJson;
      onChange({
        html: currentEditor.getHTML(),
        json: nextJson,
      });
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (value === lastAppliedValueRef.current) {
      return;
    }

    lastAppliedValueRef.current = value;
    editor.commands.setContent(parseContent(value));
  }, [editor, value]);

  async function handleImageSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !editor || !onUploadImage) {
      return;
    }

    const imageSrc = await onUploadImage(file);
    editor.chain().focus().setImage({ src: imageSrc }).run();
    event.target.value = "";
  }

  function promptLink() {
    if (!editor) {
      return;
    }

    const previousHref = editor.getAttributes("link").href;
    const href = window.prompt("링크 URL을 입력하세요.", previousHref || "");

    if (href === null) {
      return;
    }

    if (!href.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run();
  }

  function promptYoutube() {
    if (!editor) {
      return;
    }

    const url = window.prompt("YouTube URL을 입력하세요.");

    if (!url?.trim()) {
      return;
    }

    editor.chain().focus().setYoutubeVideo({ src: url.trim() }).run();
  }

  if (!editor) {
    return null;
  }

  return (
    <div className={cx("flex flex-col gap-3 pt-2", className)}>
      <div className="sticky top-4 z-20 -mx-1 overflow-x-auto rounded-button bg-transparent px-1 py-1">
        <div className="inline-flex min-w-full items-center gap-1 rounded-button border border-border bg-bg-content px-2 py-1.5">
          <ToolButton isActive={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            H1
          </ToolButton>
          <ToolButton isActive={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            H2
          </ToolButton>
          <ToolButton isActive={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            H3
          </ToolButton>
          <ToolButton isActive={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
            Bold
          </ToolButton>
          <ToolButton isActive={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
            In Code
          </ToolButton>
          <ToolButton isActive={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            Code
          </ToolButton>
          <ToolButton isActive={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            List
          </ToolButton>
          <ToolButton isActive={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            Quote
          </ToolButton>
          <ToolButton isActive={editor.isActive("link")} onClick={promptLink}>
            Link
          </ToolButton>
          <ToolButton onClick={() => fileInputRef.current?.click()}>
            Image
          </ToolButton>
          <ToolButton onClick={promptYoutube}>
            YouTube
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().insertTable({ cols: 3, rows: 3, withHeaderRow: true }).run()}>
            Table
          </ToolButton>
        </div>
      </div>

      <div className="rounded-button border border-border bg-transparent px-5 py-4">
        <EditorContent editor={editor} />
      </div>

      <input
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={handleImageSelection}
        ref={fileInputRef}
        type="file"
      />
    </div>
  );
}
