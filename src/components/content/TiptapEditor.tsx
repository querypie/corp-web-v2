"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bold,
  Clapperboard,
  Code,
  FileCode2,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  Table2,
  Video,
} from "lucide-react";
import { mergeAttributes, Node as TiptapNode } from "@tiptap/core";
import { EditorContent, ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import CodeBlock from "@tiptap/extension-code-block";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { TableKit } from "@tiptap/extension-table";
import Input from "@/components/ui/Input";
import Tab from "@/components/ui/Tab";
import TabGroup from "@/components/ui/TabGroup";
import TiptapCodeBlockView from "./TiptapCodeBlockView";
import Tooltip from "@/components/ui/Tooltip";
import { CONTENT_PREVIEW_RICH_CLASS } from "@/features/content/previewStyles";
import { normalizeYoutubeEmbedUrl } from "@/features/content/youtubeUrl";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function parseContent(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return {
      content: [{ type: "paragraph" }],
      type: "doc",
    };
  }

  try {
    return JSON.parse(trimmedValue);
  } catch {
    if (trimmedValue.startsWith("<")) {
      return trimmedValue;
    }

    return {
      content: [{ type: "paragraph" }],
      type: "doc",
    };
  }
}

type ImagePopoverState = {
  caption: string;
  left: number;
  top: number;
  visible: boolean;
  width: string;
};

type VideoPopoverState = {
  autoplayOnView: boolean;
  caption: string;
  left: number;
  loop: boolean;
  muted: boolean;
  top: number;
  visible: boolean;
};

type TableControlsState = {
  columnLeft: number;
  columnTop: number;
  isTopLeftCell: boolean;
  rowLeft: number;
  rowTop: number;
  targetPos: number;
  visible: boolean;
};

function isSameImagePopoverState(current: ImagePopoverState, next: ImagePopoverState) {
  return (
    current.caption === next.caption &&
    current.left === next.left &&
    current.top === next.top &&
    current.visible === next.visible &&
    current.width === next.width
  );
}

function isSameVideoPopoverState(current: VideoPopoverState, next: VideoPopoverState) {
  return (
    current.autoplayOnView === next.autoplayOnView &&
    current.caption === next.caption &&
    current.left === next.left &&
    current.loop === next.loop &&
    current.muted === next.muted &&
    current.top === next.top &&
    current.visible === next.visible
  );
}

function isSameTableControlsState(current: TableControlsState, next: TableControlsState) {
  return (
    current.columnLeft === next.columnLeft &&
    current.columnTop === next.columnTop &&
    current.isTopLeftCell === next.isTopLeftCell &&
    current.rowLeft === next.rowLeft &&
    current.rowTop === next.rowTop &&
    current.targetPos === next.targetPos &&
    current.visible === next.visible
  );
}

function updateImagePopoverState(
  setImagePopover: React.Dispatch<React.SetStateAction<ImagePopoverState>>,
  next: ImagePopoverState | ((current: ImagePopoverState) => ImagePopoverState),
) {
  setImagePopover((current) => {
    const nextState = typeof next === "function" ? next(current) : next;

    return isSameImagePopoverState(current, nextState) ? current : nextState;
  });
}

function updateVideoPopoverState(
  setVideoPopover: React.Dispatch<React.SetStateAction<VideoPopoverState>>,
  next: VideoPopoverState | ((current: VideoPopoverState) => VideoPopoverState),
) {
  setVideoPopover((current) => {
    const nextState = typeof next === "function" ? next(current) : next;

    return isSameVideoPopoverState(current, nextState) ? current : nextState;
  });
}

function updateTableControlsState(
  setTableControls: React.Dispatch<React.SetStateAction<TableControlsState>>,
  next: TableControlsState | ((current: TableControlsState) => TableControlsState),
) {
  setTableControls((current) => {
    const nextState = typeof next === "function" ? next(current) : next;

    return isSameTableControlsState(current, nextState) ? current : nextState;
  });
}

function sanitizePastedHtml(html: string) {
  if (typeof window === "undefined") {
    return html;
  }

  const document = new DOMParser().parseFromString(html, "text/html");

  document.querySelectorAll("iframe, embed, object").forEach((element) => element.remove());

  return document.body.innerHTML;
}

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

const VideoBlock = TiptapNode.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      aspectRatio: {
        default: "16 / 9",
        parseHTML: (element) => {
          if (!(element instanceof HTMLElement)) {
            return "16 / 9";
          }

          const figure = element.tagName === "FIGURE" ? element : element.closest("figure");
          return figure?.dataset.aspectRatio || "16 / 9";
        },
      },
      autoplayOnView: {
        default: false,
        parseHTML: (element) => {
          if (!(element instanceof HTMLElement)) {
            return false;
          }

          const figure = element.tagName === "FIGURE" ? element : element.closest("figure");
          return figure?.dataset.autoplayOnView === "true";
        },
      },
      caption: {
        default: "",
        parseHTML: (element) => {
          if (!(element instanceof HTMLElement)) {
            return "";
          }

          const figure = element.tagName === "FIGURE" ? element : element.closest("figure");
          return figure?.querySelector("figcaption")?.textContent?.trim() ?? "";
        },
      },
      controls: {
        default: true,
        parseHTML: (element) => {
          if (!(element instanceof HTMLElement)) {
            return true;
          }

          const video = element.tagName === "VIDEO" ? element : element.querySelector("video");
          return video instanceof HTMLVideoElement ? video.hasAttribute("controls") : true;
        },
      },
      loop: {
        default: false,
        parseHTML: (element) => {
          if (!(element instanceof HTMLElement)) {
            return false;
          }

          const video = element.tagName === "VIDEO" ? element : element.querySelector("video");
          return video instanceof HTMLVideoElement ? video.hasAttribute("loop") : false;
        },
      },
      muted: {
        default: false,
        parseHTML: (element) => {
          if (!(element instanceof HTMLElement)) {
            return false;
          }

          const video = element.tagName === "VIDEO" ? element : element.querySelector("video");
          return video instanceof HTMLVideoElement ? video.hasAttribute("muted") : false;
        },
      },
      poster: {
        default: "",
        parseHTML: (element) => {
          if (!(element instanceof HTMLElement)) {
            return "";
          }

          const video = element.tagName === "VIDEO" ? element : element.querySelector("video");
          return video instanceof HTMLVideoElement ? video.getAttribute("poster") ?? "" : "";
        },
      },
      src: {
        default: "",
        parseHTML: (element) => {
          if (!(element instanceof HTMLElement)) {
            return "";
          }

          const video = element.tagName === "VIDEO" ? element : element.querySelector("video");
          return video instanceof HTMLVideoElement ? video.getAttribute("src") ?? "" : "";
        },
      },
      width: {
        default: "100%",
        parseHTML: (element) => {
          if (!(element instanceof HTMLElement)) {
            return "100%";
          }

          const figure = element.tagName === "FIGURE" ? element : element.closest("figure");
          return figure?.style.width || figure?.dataset.width || "100%";
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure[data-qp-video]",
      },
      {
        tag: "video[src]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const {
      aspectRatio,
      autoplayOnView,
      caption,
      controls,
      loop,
      muted,
      poster,
      src,
      width,
    } = HTMLAttributes as {
      aspectRatio?: string;
      autoplayOnView?: boolean;
      caption?: string;
      controls?: boolean;
      loop?: boolean;
      muted?: boolean;
      poster?: string;
      src?: string;
      width?: string;
    };

    return [
      "figure",
      mergeAttributes({
        "data-aspect-ratio": aspectRatio || "16 / 9",
        "data-autoplay-on-view": autoplayOnView ? "true" : undefined,
        "data-qp-video": "true",
        "data-width": width || "100%",
        style: width ? `width:${width};` : undefined,
      }),
      [
        "div",
        {
          style: `aspect-ratio:${aspectRatio || "16 / 9"};overflow:hidden;width:100%;`,
        },
        [
          "video",
          {
            controls: controls === false ? undefined : "",
            controlsList: "nodownload",
            loop: loop ? "" : undefined,
            muted: muted ? "" : undefined,
            playsinline: "",
            poster: poster || undefined,
            preload: "metadata",
            src,
            style: "height:100%;width:100%;",
          },
        ],
      ],
      ...(caption ? [["figcaption", {}, caption]] : []),
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
  disabled = false,
  isActive = false,
  onClick,
  tooltip,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isActive?: boolean;
  onClick: () => void;
  tooltip: string;
}) {
  return (
    <Tooltip content={tooltip} offsetY={10}>
      <button
        aria-label={tooltip}
        className={cx(
          "inline-flex h-9 items-center justify-center rounded-button px-2.5 text-center type-body-sm transition-colors whitespace-nowrap",
          disabled && "cursor-not-allowed opacity-40",
          isActive
            ? "bg-fg text-bg"
            : "bg-transparent text-fg hover:bg-bg hover:text-fg disabled:hover:bg-transparent disabled:hover:text-fg",
          className,
        )}
        disabled={disabled}
        onMouseDown={(event) => {
          event.preventDefault();
          if (disabled) {
            return;
          }
          onClick();
        }}
        type="button"
      >
        <span className="inline-flex items-center justify-center text-center">{children}</span>
      </button>
    </Tooltip>
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
  );
}

function TableHandleButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-bg-modal)] text-[14px] font-semibold leading-none text-fg shadow-[0_6px_16px_rgba(0,0,0,0.22)] transition-colors hover:bg-fg hover:text-bg"
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
      type="button"
    >
      {children}
    </button>
  );
}

function VideoToggleButton({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={isActive}
      className={cx(
        "inline-flex h-9 min-w-[72px] items-center justify-center rounded-button border px-3 type-body-sm transition-colors",
        isActive
          ? "border-fg bg-fg text-bg"
          : "border-border bg-transparent text-fg hover:bg-bg hover:text-fg",
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
      type="button"
    >
      {children}
    </button>
  );
}

type Props = {
  className?: string;
  onChange: (payload: { html: string; json: string }) => void;
  onPrepareImage?: (file: File, replaceSrc?: string) => string;
  onPrepareVideo?: (file: File, replaceSrc?: string) => string;
  onRemoveImage?: (src: string) => void;
  onRemoveVideo?: (src: string) => void;
  toolbarStickyTop?: string;
  uiLocale?: "en" | "ja" | "ko";
  value: string;
};

const editorCopy = {
  ko: {
    "Add Column Right": "오른쪽에 열 추가",
    "Add Row Below": "아래에 행 추가",
    "Add a caption": "캡션 추가",
    Autoplay: "자동 재생",
    Blockquote: "인용문",
    Bold: "굵게",
    "Bullet List": "글머리 기호 목록",
    "Code Block": "코드 블록",
    "Delete Column": "열 삭제",
    "Delete Row": "행 삭제",
    Delete: "삭제",
    "Embed YouTube": "YouTube 삽입",
    "Horizontal Rule": "구분선",
    "Heading 1": "제목 1",
    "Heading 2": "제목 2",
    "Heading 3": "제목 3",
    "Image caption": "이미지 캡션",
    "Inline Code": "인라인 코드",
    "Insert Image": "이미지 삽입",
    "Insert Link": "링크 삽입",
    "Insert Table": "표 삽입",
    "Insert Video": "영상 삽입",
    Italic: "기울임",
    Loop: "반복",
    Muted: "음소거",
    "Numbered List": "번호 목록",
    Replace: "교체",
    Strikethrough: "취소선",
    "Toggle Header Column": "머리글 열 전환",
    "Toggle Header Row": "머리글 행 전환",
    "Video caption": "영상 캡션",
    "링크 URL을 입력하세요.": "링크 URL을 입력하세요.",
    "YouTube URL을 입력하세요.": "YouTube URL을 입력하세요.",
  },
  ja: {
    "Add Column Right": "右に列を追加",
    "Add Row Below": "下に行を追加",
    "Add a caption": "キャプションを追加",
    Autoplay: "自動再生",
    Blockquote: "引用",
    Bold: "太字",
    "Bullet List": "箇条書き",
    "Code Block": "コードブロック",
    "Delete Column": "列を削除",
    "Delete Row": "行を削除",
    Delete: "削除",
    "Embed YouTube": "YouTubeを埋め込む",
    "Horizontal Rule": "区切り線",
    "Heading 1": "見出し 1",
    "Heading 2": "見出し 2",
    "Heading 3": "見出し 3",
    "Image caption": "画像キャプション",
    "Inline Code": "インラインコード",
    "Insert Image": "画像を挿入",
    "Insert Link": "リンクを挿入",
    "Insert Table": "表を挿入",
    "Insert Video": "動画を挿入",
    Italic: "斜体",
    Loop: "ループ",
    Muted: "ミュート",
    "Numbered List": "番号付きリスト",
    Replace: "置き換え",
    Strikethrough: "取り消し線",
    "Toggle Header Column": "見出し列を切り替え",
    "Toggle Header Row": "見出し行を切り替え",
    "Video caption": "動画キャプション",
    "링크 URL을 입력하세요.": "リンクURLを入力してください。",
    "YouTube URL을 입력하세요.": "YouTube URLを入力してください。",
  },
} as const;

function getEditorCopy(locale: "en" | "ja" | "ko", copy: string) {
  return locale === "en" ? copy : (editorCopy[locale][copy as keyof (typeof editorCopy)[typeof locale]] ?? copy);
}

export default function TiptapEditor({
  className,
  onChange,
  onPrepareImage,
  onPrepareVideo,
  onRemoveImage,
  onRemoveVideo,
  toolbarStickyTop = "16px",
  uiLocale = "en",
  value,
}: Props) {
  const t = (copy: string) => getEditorCopy(uiLocale, copy);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const editorShellRef = useRef<HTMLDivElement | null>(null);
  const baselineContentRef = useRef("");
  const lastAppliedValueRef = useRef(value);
  const pendingContentSyncRef = useRef(0);
  const suppressNextUpdateRef = useRef(false);
  const [isImagePopoverPinned, setIsImagePopoverPinned] = useState(false);
  const [imagePopover, setImagePopover] = useState<ImagePopoverState>({
    caption: "",
    left: 0,
    top: 0,
    visible: false,
    width: "100%",
  });
  const [isVideoPopoverPinned, setIsVideoPopoverPinned] = useState(false);
  const [videoPopover, setVideoPopover] = useState<VideoPopoverState>({
    autoplayOnView: false,
    caption: "",
    left: 0,
    loop: false,
    muted: false,
    top: 0,
    visible: false,
  });
  const [tableControls, setTableControls] = useState<TableControlsState>({
    columnLeft: 0,
    columnTop: 0,
    isTopLeftCell: false,
    rowLeft: 0,
    rowTop: 0,
    targetPos: 0,
    visible: false,
  });
  const content = useMemo(() => parseContent(value), [value]);

  const editor = useEditor({
    content,
    editorProps: {
      attributes: {
        class:
          `${CONTENT_PREVIEW_RICH_CLASS} content-rich-editor min-h-[320px] outline-none [&_p.is-editor-empty:first-child::before]:pointer-events-none [&_p.is-editor-empty:first-child::before]:float-left [&_p.is-editor-empty:first-child::before]:h-0 [&_p.is-editor-empty:first-child::before]:text-mute [&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]`,
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
      },
      transformPastedHTML(html) {
        return sanitizePastedHtml(html);
      },
    },
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3] },
      }),
      StyledCodeBlock,
      Link.configure({
        openOnClick: false,
      }),
      ResizableImage,
      VideoBlock,
      Youtube.configure({
        allowFullscreen: true,
        controls: true,
        nocookie: true,
      }),
      TableKit,
    ],
    immediatelyRender: false,
    onCreate({ editor: currentEditor }) {
      baselineContentRef.current = JSON.stringify(currentEditor.getJSON());
      lastAppliedValueRef.current = baselineContentRef.current;
    },
    onUpdate({ editor: currentEditor }) {
      if (suppressNextUpdateRef.current) {
        suppressNextUpdateRef.current = false;
        return;
      }

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

    const syncId = pendingContentSyncRef.current + 1;
    pendingContentSyncRef.current = syncId;
    lastAppliedValueRef.current = value;

    window.queueMicrotask(() => {
      if (pendingContentSyncRef.current !== syncId || editor.isDestroyed) {
        return;
      }

      suppressNextUpdateRef.current = true;
      editor.commands.setContent(parseContent(value));
      baselineContentRef.current = JSON.stringify(editor.getJSON());
      lastAppliedValueRef.current = baselineContentRef.current;
    });

    return () => {
      if (pendingContentSyncRef.current === syncId) {
        pendingContentSyncRef.current += 1;
      }
    };
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

        updateImagePopoverState(setImagePopover, (current) => ({ ...current, visible: false }));
        return;
      }

      const selectedNode = editor.view.nodeDOM(editor.state.selection.from);

      if (!(selectedNode instanceof HTMLElement)) {
        updateImagePopoverState(setImagePopover, (current) => ({ ...current, visible: false }));
        return;
      }

      const shellRect =
        editorShellRef.current?.getBoundingClientRect() ??
        editor.view.dom.getBoundingClientRect();
      const imageRect = selectedNode.getBoundingClientRect();
      const attrs = editor.getAttributes("image");

      updateImagePopoverState(setImagePopover, {
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

  useEffect(() => {
    if (!editor) {
      return;
    }

    const updateVideoPopover = () => {
      if (!editor.isActive("video")) {
        if (isVideoPopoverPinned) {
          return;
        }

        updateVideoPopoverState(setVideoPopover, (current) => ({ ...current, visible: false }));
        return;
      }

      const selectedNode = editor.view.nodeDOM(editor.state.selection.from);

      if (!(selectedNode instanceof HTMLElement)) {
        updateVideoPopoverState(setVideoPopover, (current) => ({ ...current, visible: false }));
        return;
      }

      const shellRect =
        editorShellRef.current?.getBoundingClientRect() ??
        editor.view.dom.getBoundingClientRect();
      const videoRect = selectedNode.getBoundingClientRect();
      const attrs = editor.getAttributes("video");

      updateVideoPopoverState(setVideoPopover, {
        autoplayOnView: attrs.autoplayOnView === true,
        caption: typeof attrs.caption === "string" ? attrs.caption : "",
        left: videoRect.left - shellRect.left + videoRect.width / 2,
        loop: attrs.loop === true,
        muted: attrs.muted === true,
        top: videoRect.top - shellRect.top + 16,
        visible: true,
      });
    };

    updateVideoPopover();
    editor.on("selectionUpdate", updateVideoPopover);
    editor.on("transaction", updateVideoPopover);

    return () => {
      editor.off("selectionUpdate", updateVideoPopover);
      editor.off("transaction", updateVideoPopover);
    };
  }, [editor, isVideoPopoverPinned]);

  async function handleImageSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !editor || !onPrepareImage) {
      return;
    }

    const previousSrc = editor.isActive("image")
      ? editor.getAttributes("image").src
      : "";
    const imageSrc = onPrepareImage(
      file,
      typeof previousSrc === "string" ? previousSrc : "",
    );
    editor.chain().focus().setImage({ src: imageSrc }).run();
    event.target.value = "";
  }

  async function handleVideoSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !editor || !onPrepareVideo) {
      return;
    }

    const previousSrc = editor.isActive("video")
      ? editor.getAttributes("video").src
      : "";
    const videoSrc = onPrepareVideo(
      file,
      typeof previousSrc === "string" ? previousSrc : "",
    );

    if (editor.isActive("video")) {
      editor.chain().focus().updateAttributes("video", { src: videoSrc }).run();
    } else {
      editor.commands.insertContent({
        attrs: {
          aspectRatio: "16 / 9",
          autoplayOnView: true,
          caption: "",
          controls: true,
          loop: true,
          muted: true,
          src: videoSrc,
          width: "100%",
        },
        type: "video",
      });
    }

    event.target.value = "";
  }

  function promptLink() {
    if (!editor) {
      return;
    }

    const previousHref = editor.getAttributes("link").href;
    const href = window.prompt(t("링크 URL을 입력하세요."), previousHref || "");

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

    const url = window.prompt(t("YouTube URL을 입력하세요."));

    if (!url?.trim()) {
      return;
    }

    editor.chain().focus().setYoutubeVideo({ src: normalizeYoutubeEmbedUrl(url) }).run();
  }

  function setSelectedImageWidth(width: string) {
    if (!editor) {
      return;
    }

    editor.chain().focus().updateAttributes("image", { width }).run();
    updateImagePopoverState(setImagePopover, (current) => ({ ...current, width }));
  }

  function updateImageCaption(caption: string) {
    if (!editor) {
      return;
    }

    editor.commands.updateAttributes("image", { caption });
    updateImagePopoverState(setImagePopover, (current) => ({ ...current, caption }));
  }

  function deleteSelectedImage() {
    if (!editor) {
      return;
    }

    const src = editor.getAttributes("image").src;
    if (typeof src === "string" && src) {
      onRemoveImage?.(src);
    }

    editor.chain().focus().deleteSelection().run();
    updateImagePopoverState(setImagePopover, (current) => ({ ...current, visible: false }));
  }

  function updateVideoCaption(caption: string) {
    if (!editor) {
      return;
    }

    editor.commands.updateAttributes("video", { caption });
    updateVideoPopoverState(setVideoPopover, (current) => ({ ...current, caption }));
  }

  function toggleVideoAttribute(attribute: "loop" | "muted") {
    if (!editor) {
      return;
    }

    const nextValue = !videoPopover[attribute];
    editor.commands.updateAttributes("video", { [attribute]: nextValue });
    updateVideoPopoverState(setVideoPopover, (current) => ({ ...current, [attribute]: nextValue }));
  }

  function toggleVideoAutoplayOnView() {
    if (!editor) {
      return;
    }

    const nextValue = !videoPopover.autoplayOnView;
    const attrs = nextValue
      ? { autoplayOnView: true, muted: true }
      : { autoplayOnView: false };

    editor.commands.updateAttributes("video", attrs);
    updateVideoPopoverState(setVideoPopover, (current) => ({
      ...current,
      autoplayOnView: nextValue,
      muted: nextValue ? true : current.muted,
    }));
  }

  function deleteSelectedVideo() {
    if (!editor) {
      return;
    }

    const src = editor.getAttributes("video").src;
    if (typeof src === "string" && src) {
      onRemoveVideo?.(src);
    }

    editor.chain().focus().deleteSelection().run();
    updateVideoPopoverState(setVideoPopover, (current) => ({ ...current, visible: false }));
  }

  function hideTableControls() {
    updateTableControlsState(setTableControls, (current) => ({ ...current, visible: false }));
  }

  function handleEditorMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!editor) {
      return;
    }

    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      hideTableControls();
      return;
    }

    if (target.closest("[data-table-handle]")) {
      return;
    }

    const shellRect =
      editorShellRef.current?.getBoundingClientRect() ??
      editor.view.dom.getBoundingClientRect();

    const cell = target.closest("td,th");

    if (!(cell instanceof HTMLElement) || !editor.view.dom.contains(cell)) {
      hideTableControls();
      return;
    }

    const cellRect = cell.getBoundingClientRect();
    const row = cell.parentElement instanceof HTMLTableRowElement ? cell.parentElement : null;
    const table = cell.closest("table");
    const posAtCell = editor.view.posAtCoords({
      left: cellRect.left + Math.min(cellRect.width / 2, 12),
      top: cellRect.top + Math.min(cellRect.height / 2, 12),
    });

    if (!posAtCell) {
      hideTableControls();
      return;
    }

    updateTableControlsState(setTableControls, {
      columnLeft: cellRect.left - shellRect.left + cellRect.width / 2,
      columnTop: cellRect.top - shellRect.top - 13,
      isTopLeftCell:
        !!row &&
        !!table &&
        Array.from(row.children).indexOf(cell) === 0 &&
        Array.from(table.rows).indexOf(row) === 0,
      rowLeft: cellRect.left - shellRect.left - 13,
      rowTop: cellRect.top - shellRect.top + cellRect.height / 2,
      targetPos: posAtCell.pos,
      visible: true,
    });
  }

  function runTableAction(action: "addColumnAfter" | "addRowAfter" | "deleteColumn" | "deleteRow" | "toggleHeaderColumn" | "toggleHeaderRow") {
    if (!editor || !tableControls.visible) {
      return;
    }

    const chain = editor.chain().focus().setTextSelection(tableControls.targetPos);

    if (action === "addColumnAfter") {
      chain.addColumnAfter().run();
      return;
    }

    if (action === "deleteColumn") {
      chain.deleteColumn().run();
      hideTableControls();
      return;
    }

    if (action === "toggleHeaderColumn") {
      chain.toggleHeaderColumn().run();
      return;
    }

    if (action === "addRowAfter") {
      chain.addRowAfter().run();
      return;
    }

    if (action === "toggleHeaderRow") {
      chain.toggleHeaderRow().run();
      return;
    }

    chain.deleteRow().run();
    hideTableControls();
  }

  if (!editor) {
    return null;
  }

  return (
    <div className={cx("flex flex-col gap-3 pt-2", className)}>
      <div
        className="sticky z-20 -mx-1 overflow-x-auto rounded-button bg-transparent px-1"
        style={{ top: toolbarStickyTop }}
      >
        <div className="flex w-full justify-center">
          <div className="flex w-full items-center justify-center gap-0 rounded-button border border-border bg-bg-content px-2 py-1">
            <ToolButton isActive={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} tooltip={t("Heading 1")}>
              H1
            </ToolButton>
            <ToolButton isActive={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} tooltip={t("Heading 2")}>
              H2
            </ToolButton>
            <ToolButton isActive={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} tooltip={t("Heading 3")}>
              H3
            </ToolButton>
            <span aria-hidden="true" className="mx-1.5 h-4 w-px bg-border" />
            <ToolButton isActive={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} tooltip={t("Bold")}>
              <ToolbarIcon><Bold aria-hidden="true" className="h-4 w-4" /></ToolbarIcon>
          </ToolButton>
          <ToolButton isActive={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} tooltip={t("Italic")}>
            <ToolbarIcon><Italic aria-hidden="true" className="h-4 w-4" /></ToolbarIcon>
          </ToolButton>
            <ToolButton isActive={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} tooltip={t("Strikethrough")}>
              <ToolbarIcon><Strikethrough aria-hidden="true" className="h-4 w-4" /></ToolbarIcon>
            </ToolButton>
            <span aria-hidden="true" className="mx-1.5 h-4 w-px bg-border" />
            <ToolButton isActive={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} tooltip={t("Bullet List")}>
              <ToolbarIcon><List aria-hidden="true" className="h-4 w-4" /></ToolbarIcon>
          </ToolButton>
            <ToolButton isActive={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} tooltip={t("Numbered List")}>
              <ToolbarIcon><ListOrdered aria-hidden="true" className="h-4 w-4" /></ToolbarIcon>
            </ToolButton>
            <ToolButton isActive={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} tooltip={t("Blockquote")}>
              <ToolbarIcon><Quote aria-hidden="true" className="h-4 w-4" /></ToolbarIcon>
            </ToolButton>
            <ToolButton onClick={() => editor.chain().focus().setHorizontalRule().run()} tooltip={t("Horizontal Rule")}>
              <ToolbarIcon><Minus aria-hidden="true" className="h-4 w-4" /></ToolbarIcon>
            </ToolButton>
            <span aria-hidden="true" className="mx-1.5 h-4 w-px bg-border" />
            <ToolButton isActive={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()} tooltip={t("Inline Code")}>
              <ToolbarIcon><Code aria-hidden="true" className="h-4 w-4" /></ToolbarIcon>
          </ToolButton>
          <ToolButton isActive={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} tooltip={t("Code Block")}>
            <ToolbarIcon><FileCode2 aria-hidden="true" className="h-4 w-4" /></ToolbarIcon>
            </ToolButton>
            <span aria-hidden="true" className="mx-1.5 h-4 w-px bg-border" />
            <ToolButton isActive={editor.isActive("link")} onClick={promptLink} tooltip={t("Insert Link")}>
              <ToolbarIcon><LinkIcon aria-hidden="true" className="h-4 w-4" /></ToolbarIcon>
          </ToolButton>
          <ToolButton disabled={!onPrepareImage} onClick={() => imageInputRef.current?.click()} tooltip={t("Insert Image")}>
            <ToolbarIcon><ImagePlus aria-hidden="true" className="h-4 w-4" /></ToolbarIcon>
          </ToolButton>
          <ToolButton disabled={!onPrepareVideo} onClick={() => videoInputRef.current?.click()} tooltip={t("Insert Video")}>
            <ToolbarIcon><Video aria-hidden="true" className="h-4 w-4" /></ToolbarIcon>
          </ToolButton>
          <ToolButton onClick={promptYoutube} tooltip={t("Embed YouTube")}>
            <ToolbarIcon><Clapperboard aria-hidden="true" className="h-4 w-4" /></ToolbarIcon>
          </ToolButton>
            <ToolButton onClick={() => editor.chain().focus().insertTable({ cols: 3, rows: 3, withHeaderRow: true }).run()} tooltip={t("Insert Table")}>
              <ToolbarIcon><Table2 aria-hidden="true" className="h-4 w-4" /></ToolbarIcon>
          </ToolButton>
          </div>
        </div>
      </div>

      <div
        className="relative rounded-button border border-border bg-transparent px-5 py-4"
        onMouseLeave={hideTableControls}
        onMouseMove={handleEditorMouseMove}
        ref={editorShellRef}
      >
        {imagePopover.visible ? (
          <div
            className="absolute z-20 flex min-w-[420px] max-w-[480px] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 rounded-[20px] border border-border bg-[var(--color-bg-modal)] p-3 shadow-[0_12px_32px_rgba(0,0,0,0.32)] backdrop-blur-[12px]"
            style={{ left: `${imagePopover.left}px`, top: `${imagePopover.top}px` }}
          >
            <div className="flex items-center justify-center">
              <div className="flex w-full flex-wrap items-center justify-between gap-2">
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
                <button
                  className="inline-flex h-9 items-center justify-center rounded-button border border-border px-3 type-body-sm text-destructive transition-colors hover:bg-bg hover:text-destructive"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    deleteSelectedImage();
                  }}
                  type="button"
                >
                  {t("Delete")}
                </button>
              </div>
            </div>
            <label className="flex flex-col gap-2">
              <span className="sr-only">{t("Image caption")}</span>
              <Input
                className="w-full rounded-[14px] border border-border bg-bg-content"
                onBlur={() => setIsImagePopoverPinned(false)}
                onChange={(event) => updateImageCaption(event.target.value)}
                onFocus={() => setIsImagePopoverPinned(true)}
                placeholder={t("Add a caption")}
                type="text"
                value={imagePopover.caption}
              />
            </label>
          </div>
        ) : null}
        {videoPopover.visible ? (
          <div
            className="absolute z-20 flex min-w-[440px] max-w-[520px] -translate-x-1/2 flex-col gap-3 rounded-[20px] border border-border bg-[var(--color-bg-modal)] p-3 shadow-[0_12px_32px_rgba(0,0,0,0.32)] backdrop-blur-[12px]"
            style={{ left: `${videoPopover.left}px`, top: `${videoPopover.top}px` }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <VideoToggleButton
                  isActive={videoPopover.autoplayOnView}
                  onClick={toggleVideoAutoplayOnView}
                >
                  {t("Autoplay")}
                </VideoToggleButton>
                <VideoToggleButton
                  isActive={videoPopover.muted}
                  onClick={() => toggleVideoAttribute("muted")}
                >
                  {t("Muted")}
                </VideoToggleButton>
                <VideoToggleButton
                  isActive={videoPopover.loop}
                  onClick={() => toggleVideoAttribute("loop")}
                >
                  {t("Loop")}
                </VideoToggleButton>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex h-9 items-center justify-center rounded-button border border-border px-3 type-body-sm text-fg transition-colors hover:bg-bg hover:text-fg"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    videoInputRef.current?.click();
                  }}
                  type="button"
                >
                  {t("Replace")}
                </button>
                <button
                  className="inline-flex h-9 items-center justify-center rounded-button border border-border px-3 type-body-sm text-destructive transition-colors hover:bg-bg hover:text-destructive"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    deleteSelectedVideo();
                  }}
                  type="button"
                >
                  {t("Delete")}
                </button>
              </div>
            </div>
            <label className="flex flex-col gap-2">
              <span className="sr-only">{t("Video caption")}</span>
              <Input
                className="w-full rounded-[14px] border border-border bg-bg-content"
                onBlur={() => setIsVideoPopoverPinned(false)}
                onChange={(event) => updateVideoCaption(event.target.value)}
                onFocus={() => setIsVideoPopoverPinned(true)}
                placeholder={t("Add a caption")}
                type="text"
                value={videoPopover.caption}
              />
            </label>
          </div>
        ) : null}
        {tableControls.visible ? (
          <>
            <div
              className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-1 rounded-full border border-border bg-[var(--color-bg-modal)] p-1 shadow-[0_10px_24px_rgba(0,0,0,0.24)] backdrop-blur-[12px]"
              data-table-handle="row"
              style={{ left: `${tableControls.rowLeft}px`, top: `${tableControls.rowTop}px` }}
            >
              <TableHandleButton label={t("Add Row Below")} onClick={() => runTableAction("addRowAfter")}>
                +
              </TableHandleButton>
              <TableHandleButton label={t("Delete Row")} onClick={() => runTableAction("deleteRow")}>
                -
              </TableHandleButton>
              {tableControls.isTopLeftCell ? (
                <TableHandleButton label={t("Toggle Header Row")} onClick={() => runTableAction("toggleHeaderRow")}>
                  H
                </TableHandleButton>
              ) : null}
            </div>
            <div
              className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 gap-1 rounded-full border border-border bg-[var(--color-bg-modal)] p-1 shadow-[0_10px_24px_rgba(0,0,0,0.24)] backdrop-blur-[12px]"
              data-table-handle="column"
              style={{ left: `${tableControls.columnLeft}px`, top: `${tableControls.columnTop}px` }}
            >
              <TableHandleButton label={t("Add Column Right")} onClick={() => runTableAction("addColumnAfter")}>
                +
              </TableHandleButton>
              <TableHandleButton label={t("Delete Column")} onClick={() => runTableAction("deleteColumn")}>
                -
              </TableHandleButton>
              {tableControls.isTopLeftCell ? (
                <TableHandleButton label={t("Toggle Header Column")} onClick={() => runTableAction("toggleHeaderColumn")}>
                  H
                </TableHandleButton>
              ) : null}
            </div>
          </>
        ) : null}
        <EditorContent editor={editor} />
      </div>

      <input
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={handleImageSelection}
        ref={imageInputRef}
        type="file"
      />
      <input
        accept="video/mp4,video/webm,video/quicktime"
        className="sr-only"
        onChange={handleVideoSelection}
        ref={videoInputRef}
        type="file"
      />
    </div>
  );
}
