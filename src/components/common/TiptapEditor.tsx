"use client";

<<<<<<< HEAD
import { useEffect, useMemo, useRef, useState } from "react";
import { mergeAttributes } from "@tiptap/core";
import { EditorContent, ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import CodeBlock from "@tiptap/extension-code-block";
=======
import { useEffect, useMemo, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
>>>>>>> origin/main
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { TableKit } from "@tiptap/extension-table";
<<<<<<< HEAD
import Input from "./Input";
import Tab from "./Tab";
import TabGroup from "./TabGroup";
import TiptapCodeBlockView from "./TiptapCodeBlockView";
import { CONTENT_PREVIEW_RICH_CLASS } from "@/features/content/previewStyles";
=======
>>>>>>> origin/main

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function parseContent(value: string) {
<<<<<<< HEAD
  const trimmedValue = value.trim();

  if (!trimmedValue) {
=======
  if (!value.trim()) {
>>>>>>> origin/main
    return {
      content: [{ type: "paragraph" }],
      type: "doc",
    };
  }

  try {
<<<<<<< HEAD
    return JSON.parse(trimmedValue);
  } catch {
    if (trimmedValue.startsWith("<")) {
      return trimmedValue;
    }

=======
    return JSON.parse(value);
  } catch {
>>>>>>> origin/main
    return {
      content: [{ type: "paragraph" }],
      type: "doc",
    };
  }
}

<<<<<<< HEAD
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: "",
        parseHTML: (element) => {
          if (!(element instanceof HTMLElement)) {
            return "";
          }

          if (element.tagName === "FIGURE") {
            return element.querySelector("figcaption")?.textContent?.trim() ?? "";
          }

          return element.closest("figure")?.querySelector("figcaption")?.textContent?.trim() ?? "";
        },
      },
      width: {
        default: "100%",
        parseHTML: (element) => {
          if (!(element instanceof HTMLElement)) {
            return "100%";
          }

          if (element.tagName === "FIGURE") {
            return element.style.width || element.dataset.width || "100%";
          }

          return element.closest("figure")?.style.width || element.style.width || "100%";
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "figure[data-qp-image]",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) {
            return false;
          }

          const image = element.querySelector("img");

          if (!image) {
            return false;
          }

          return {
            alt: image.getAttribute("alt") ?? "",
            caption: element.querySelector("figcaption")?.textContent?.trim() ?? "",
            src: image.getAttribute("src") ?? "",
            width: element.style.width || element.dataset.width || "100%",
          };
        },
      },
      {
        tag: "img[src]",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const {
      alt,
      caption,
      src,
      width,
      ...restAttributes
    } = HTMLAttributes as {
      alt?: string;
      caption?: string;
      src?: string;
      width?: string;
      [key: string]: unknown;
    };

    return [
      "figure",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-qp-image": "true",
        "data-width": width || "100%",
        style: width ? `width:${width};` : undefined,
      }),
      [
        "img",
        mergeAttributes(restAttributes, {
          alt,
          src,
          style: "width:100%;",
        }),
      ],
      ...(caption
        ? [["figcaption", {}, caption]]
        : []),
    ];
  },
});

const StyledCodeBlock = CodeBlock.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TiptapCodeBlockView);
  },
});

function ToolButton({
  children,
  className,
=======
function ToolButton({
  children,
>>>>>>> origin/main
  isActive = false,
  onClick,
}: {
  children: React.ReactNode;
<<<<<<< HEAD
  className?: string;
=======
>>>>>>> origin/main
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cx(
<<<<<<< HEAD
        "inline-flex h-9 items-center justify-center rounded-button px-3 text-center type-body-sm transition-colors whitespace-nowrap",
        isActive
          ? "bg-fg text-bg"
          : "bg-transparent text-fg hover:bg-[#323232] hover:text-fg",
        className,
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
      type="button"
    >
      <span className="inline-flex items-center justify-center text-center">{children}</span>
    </button>
  );
}

function ToolbarIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex h-4 w-4 items-center justify-center">
      {children}
    </span>
=======
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
>>>>>>> origin/main
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
<<<<<<< HEAD
  const editorShellRef = useRef<HTMLDivElement | null>(null);
  const baselineContentRef = useRef("");
  const lastAppliedValueRef = useRef(value);
  const suppressNextUpdateRef = useRef(false);
  const [isImagePopoverPinned, setIsImagePopoverPinned] = useState(false);
  const [imagePopover, setImagePopover] = useState<{
    caption: string;
    left: number;
    top: number;
    visible: boolean;
    width: string;
  }>({
    caption: "",
    left: 0,
    top: 0,
    visible: false,
    width: "100%",
  });
=======
  const lastAppliedValueRef = useRef(value);
>>>>>>> origin/main
  const content = useMemo(() => parseContent(value), [value]);

  const editor = useEditor({
    content,
    editorProps: {
      attributes: {
        class:
<<<<<<< HEAD
          `${CONTENT_PREVIEW_RICH_CLASS} min-h-[320px] outline-none [&_p.is-editor-empty:first-child::before]:pointer-events-none [&_p.is-editor-empty:first-child::before]:float-left [&_p.is-editor-empty:first-child::before]:h-0 [&_p.is-editor-empty:first-child::before]:text-mute-fg [&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]`,
      },
      handleKeyDown(view, event) {
        const isUndoKey = (event.metaKey || event.ctrlKey) && !event.shiftKey && event.key.toLowerCase() === "z";

        if (!isUndoKey) {
          return false;
        }

        const currentContent = JSON.stringify(view.state.doc.toJSON());

        if (currentContent === baselineContentRef.current) {
          event.preventDefault();
          return true;
        }

        return false;
=======
          "min-h-[320px] outline-none type-content-body text-fg [&_a]:text-fg [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded-[8px] [&_code]:bg-bg-content [&_code]:px-2 [&_code]:py-1 [&_code]:type-content-mono [&_h1]:type-content-h1 [&_h2]:type-content-h2 [&_h3]:type-content-h3 [&_img]:w-full [&_img]:rounded-box [&_p.is-editor-empty:first-child::before]:pointer-events-none [&_p.is-editor-empty:first-child::before]:float-left [&_p.is-editor-empty:first-child::before]:h-0 [&_p.is-editor-empty:first-child::before]:text-mute-fg [&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_pre]:overflow-x-auto [&_pre]:rounded-[10px] [&_pre]:bg-bg-content [&_pre]:px-2 [&_pre]:py-4 [&_pre]:type-content-mono [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-border [&_th]:bg-bg-content [&_th]:px-3 [&_th]:py-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
>>>>>>> origin/main
      },
    },
    extensions: [
      StarterKit.configure({
<<<<<<< HEAD
        codeBlock: false,
        heading: { levels: [1, 2, 3] },
      }),
      StyledCodeBlock,
      Link.configure({
        openOnClick: false,
      }),
      ResizableImage,
=======
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
>>>>>>> origin/main
      Youtube.configure({
        allowFullscreen: true,
        controls: true,
        nocookie: true,
      }),
      TableKit,
    ],
    immediatelyRender: false,
    onCreate({ editor: currentEditor }) {
<<<<<<< HEAD
      baselineContentRef.current = JSON.stringify(currentEditor.getJSON());
      lastAppliedValueRef.current = baselineContentRef.current;
      onChange({
        html: currentEditor.getHTML(),
        json: baselineContentRef.current,
      });
    },
    onUpdate({ editor: currentEditor }) {
      if (suppressNextUpdateRef.current) {
        suppressNextUpdateRef.current = false;
        return;
      }

=======
      onChange({
        html: currentEditor.getHTML(),
        json: JSON.stringify(currentEditor.getJSON()),
      });
    },
    onUpdate({ editor: currentEditor }) {
>>>>>>> origin/main
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
<<<<<<< HEAD
    suppressNextUpdateRef.current = true;
    editor.commands.setContent(parseContent(value));
    baselineContentRef.current = JSON.stringify(editor.getJSON());
    lastAppliedValueRef.current = baselineContentRef.current;
  }, [editor, value]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const updateImagePopover = () => {
      if (!editor.isActive("image")) {
        if (isImagePopoverPinned) {
          return;
        }

        setImagePopover((current) => ({ ...current, visible: false }));
        return;
      }

      const selectedNode = editor.view.nodeDOM(editor.state.selection.from);

      if (!(selectedNode instanceof HTMLElement)) {
        setImagePopover((current) => ({ ...current, visible: false }));
        return;
      }

      const shellRect =
        editorShellRef.current?.getBoundingClientRect() ??
        editor.view.dom.getBoundingClientRect();
      const imageRect = selectedNode.getBoundingClientRect();
      const attrs = editor.getAttributes("image");

      setImagePopover({
        caption: typeof attrs.caption === "string" ? attrs.caption : "",
        left: imageRect.left - shellRect.left + imageRect.width / 2,
        top: imageRect.top - shellRect.top + imageRect.height / 2,
        visible: true,
        width: typeof attrs.width === "string" ? attrs.width : "100%",
      });
    };

    updateImagePopover();
    editor.on("selectionUpdate", updateImagePopover);
    editor.on("transaction", updateImagePopover);

    return () => {
      editor.off("selectionUpdate", updateImagePopover);
      editor.off("transaction", updateImagePopover);
    };
  }, [editor, isImagePopoverPinned]);

=======
    editor.commands.setContent(parseContent(value));
  }, [editor, value]);

>>>>>>> origin/main
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

<<<<<<< HEAD
  function setSelectedImageWidth(width: string) {
    if (!editor) {
      return;
    }

    editor.chain().focus().updateAttributes("image", { width }).run();
    setImagePopover((current) => ({ ...current, width }));
  }

  function updateImageCaption(caption: string) {
    if (!editor) {
      return;
    }

    editor.commands.updateAttributes("image", { caption });
    setImagePopover((current) => ({ ...current, caption }));
  }

=======
>>>>>>> origin/main
  if (!editor) {
    return null;
  }

  return (
    <div className={cx("flex flex-col gap-3 pt-2", className)}>
      <div className="sticky top-4 z-20 -mx-1 overflow-x-auto rounded-button bg-transparent px-1 py-1">
<<<<<<< HEAD
        <div className="flex w-full justify-center">
          <div className="flex w-full items-center justify-center gap-0 rounded-button border border-border bg-bg-content px-2 py-1">
            <ToolButton isActive={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              H1
            </ToolButton>
            <ToolButton isActive={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              H2
            </ToolButton>
            <ToolButton isActive={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              H3
            </ToolButton>
            <span aria-hidden="true" className="mx-1.5 h-4 w-px bg-border" />
            <ToolButton isActive={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
              <ToolbarIcon>
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M4 3.5H8.6C10.4 3.5 11.5 4.4 11.5 5.9C11.5 7 10.8 7.8 9.7 8.1C11.1 8.3 12 9.3 12 10.7C12 12.4 10.7 13.5 8.7 13.5H4V3.5ZM6 7.3H8.2C9.2 7.3 9.8 6.8 9.8 5.9C9.8 5 9.2 4.6 8.2 4.6H6V7.3ZM6 12.4H8.5C9.7 12.4 10.3 11.8 10.3 10.8C10.3 9.7 9.6 9.1 8.3 9.1H6V12.4Z" fill="currentColor"/>
              </svg>
            </ToolbarIcon>
          </ToolButton>
          <ToolButton isActive={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <ToolbarIcon>
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M6.5 3.5H11.5V4.8H9.6L7.5 11.2H9.5V12.5H4.5V11.2H6.4L8.5 4.8H6.5V3.5Z" fill="currentColor"/>
              </svg>
            </ToolbarIcon>
          </ToolButton>
            <ToolButton isActive={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
              <ToolbarIcon>
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M4 4.6C4 3.6 5.2 3 7.1 3C8.9 3 10.1 3.5 11 4.3L10.1 5.2C9.4 4.6 8.3 4.2 7.1 4.2C5.9 4.2 5.3 4.5 5.3 5C5.3 5.6 6 5.8 7.6 6.1C9.7 6.5 11.4 7 11.4 8.9C11.4 10.4 10.1 11.6 8 11.9V13.2H6.8V11.9C5.2 11.7 3.9 11.1 3 10.1L3.9 9.2C4.8 10 5.9 10.5 7.2 10.7H8C9.4 10.7 10.1 10.1 10.1 9.3C10.1 8.5 9.2 8.2 7.6 7.9C5.5 7.5 4 7 4 5.2V4.6ZM2.5 7.2H13.5V8.4H2.5V7.2Z" fill="currentColor"/>
                </svg>
              </ToolbarIcon>
            </ToolButton>
            <span aria-hidden="true" className="mx-1.5 h-4 w-px bg-border" />
            <ToolButton isActive={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
              <ToolbarIcon>
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <circle cx="3.25" cy="4.25" r="1.25" fill="currentColor"/>
                <circle cx="3.25" cy="8" r="1.25" fill="currentColor"/>
                <circle cx="3.25" cy="11.75" r="1.25" fill="currentColor"/>
                <path d="M6 4.25H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M6 8H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M6 11.75H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </ToolbarIcon>
          </ToolButton>
            <ToolButton isActive={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              <ToolbarIcon>
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M2.8 3.2H4V8H2.8V4.5H2V3.6L2.8 3.2Z" fill="currentColor"/>
                <path d="M2 10.1C2 9.1 2.8 8.4 4 8.4C5.2 8.4 6 9.1 6 10C6 10.7 5.7 11.1 4.9 11.7L3.3 12.9H6V14H2.1V13C2.1 12.4 2.4 12 3.2 11.4L4.2 10.7C4.7 10.4 4.9 10.2 4.9 9.9C4.9 9.5 4.5 9.2 4 9.2C3.4 9.2 3 9.5 3 10.1H2Z" fill="currentColor"/>
                <path d="M8 4.25H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M8 8H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M8 11.75H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </ToolbarIcon>
            </ToolButton>
            <ToolButton isActive={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
              <ToolbarIcon>
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <path d="M3 5.5H6.2V8.7H4.7C4.7 10 5.4 10.8 6.6 11.2L6 12.3C4 11.7 3 10.1 3 8V5.5ZM9.8 5.5H13V8.7H11.5C11.5 10 12.2 10.8 13.4 11.2L12.8 12.3C10.8 11.7 9.8 10.1 9.8 8V5.5Z" fill="currentColor"/>
                </svg>
              </ToolbarIcon>
            </ToolButton>
            <ToolButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>
              <ToolbarIcon>
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <path d="M2.5 8H13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </ToolbarIcon>
            </ToolButton>
            <span aria-hidden="true" className="mx-1.5 h-4 w-px bg-border" />
            <ToolButton isActive={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
              <ToolbarIcon>
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M5.5 4L2.5 8L5.5 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.5 4L13.5 8L10.5 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ToolbarIcon>
          </ToolButton>
          <ToolButton isActive={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <ToolbarIcon>
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <rect x="2.25" y="3" width="11.5" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M5.2 6L4 7.6L5.2 9.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.8 6L12 7.6L10.8 9.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.8 5.8L7.2 9.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </ToolbarIcon>
            </ToolButton>
            <span aria-hidden="true" className="mx-1.5 h-4 w-px bg-border" />
            <ToolButton isActive={editor.isActive("link")} onClick={promptLink}>
              <ToolbarIcon>
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M5.6 8.7L9.8 4.5C10.8 3.5 12.4 3.5 13.4 4.5C14.4 5.5 14.4 7.1 13.4 8.1L8.1 13.4C6.8 14.7 4.7 14.7 3.4 13.4C2.1 12.1 2.1 10 3.4 8.7L8 4.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ToolbarIcon>
          </ToolButton>
          <ToolButton onClick={() => fileInputRef.current?.click()}>
            <ToolbarIcon>
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <rect x="2.25" y="3" width="11.5" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <circle cx="5.5" cy="6" r="1.1" fill="currentColor"/>
                <path d="M4 11L7.1 8.3C7.5 7.95 8.1 7.96 8.5 8.32L10 9.6L11 8.7C11.4 8.34 11.98 8.33 12.4 8.68L13 9.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ToolbarIcon>
          </ToolButton>
          <ToolButton onClick={promptYoutube}>
            <ToolbarIcon>
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M13.8 5.1C13.65 4.45 13.15 3.95 12.5 3.8C11.35 3.5 8 3.5 8 3.5C8 3.5 4.65 3.5 3.5 3.8C2.85 3.95 2.35 4.45 2.2 5.1C2 6.25 2 8 2 8C2 8 2 9.75 2.2 10.9C2.35 11.55 2.85 12.05 3.5 12.2C4.65 12.5 8 12.5 8 12.5C8 12.5 11.35 12.5 12.5 12.2C13.15 12.05 13.65 11.55 13.8 10.9C14 9.75 14 8 14 8C14 8 14 6.25 13.8 5.1Z" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M6.8 10.1V5.9L10.4 8L6.8 10.1Z" fill="currentColor"/>
              </svg>
            </ToolbarIcon>
          </ToolButton>
            <ToolButton onClick={() => editor.chain().focus().insertTable({ cols: 3, rows: 3, withHeaderRow: true }).run()}>
              <ToolbarIcon>
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <rect x="2.25" y="3" width="11.5" height="10" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M2.5 6.5H13.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M2.5 9.5H13.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M7.75 3.2V12.8" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            </ToolbarIcon>
          </ToolButton>
          </div>
        </div>
      </div>

      <div className="relative rounded-button border border-border bg-transparent px-5 py-4" ref={editorShellRef}>
        {imagePopover.visible ? (
          <div
            className="absolute z-20 flex min-w-[420px] max-w-[480px] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 rounded-[20px] border border-border bg-[var(--color-bg-modal)] p-3 shadow-[0_12px_32px_rgba(0,0,0,0.32)] backdrop-blur-[12px]"
            style={{ left: `${imagePopover.left}px`, top: `${imagePopover.top}px` }}
          >
            <div className="flex items-center justify-center">
              <TabGroup className="bg-bg-content/60">
                {(["50%", "75%", "100%"] as const).map((width) => (
                  <Tab
                    className="min-w-[72px] px-4"
                    key={width}
                    onClick={() => setSelectedImageWidth(width)}
                    state={imagePopover.width === width ? "on" : "off"}
                  >
                    {width}
                  </Tab>
                ))}
              </TabGroup>
            </div>
            <label className="flex flex-col gap-2">
              <span className="sr-only">Image caption</span>
              <Input
                className="w-full rounded-[14px] border border-border bg-bg-content"
                onBlur={() => setIsImagePopoverPinned(false)}
                onChange={(event) => updateImageCaption(event.target.value)}
                onFocus={() => setIsImagePopoverPinned(true)}
                placeholder="Add a caption"
                type="text"
                value={imagePopover.caption}
              />
            </label>
          </div>
        ) : null}
=======
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
>>>>>>> origin/main
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
