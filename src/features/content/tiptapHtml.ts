import { generateHTML, mergeAttributes, Node as TiptapNode, type JSONContent } from "@tiptap/core";
import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { TableKit } from "@tiptap/extension-table";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";
import { parseTiptapJson, type TiptapJsonNode } from "@/features/content/translation/tiptap";

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: { default: "" },
      width: { default: "100%" },
    };
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
      ...(caption ? [["figcaption", {}, caption]] : []),
    ];
  },
});

const VideoBlock = TiptapNode.create({
  name: "video",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      aspectRatio: { default: "16 / 9" },
      autoplayOnView: { default: false },
      caption: { default: "" },
      controls: { default: true },
      loop: { default: false },
      muted: { default: false },
      poster: { default: "" },
      src: { default: "" },
      width: { default: "100%" },
    };
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
        { style: `aspect-ratio:${aspectRatio || "16 / 9"};overflow:hidden;width:100%;` },
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

const renderExtensions = [
  StarterKit.configure({
    codeBlock: false,
    link: false,
    heading: { levels: [1, 2, 3] },
  }),
  CodeBlock,
  Link,
  ResizableImage,
  VideoBlock,
  Youtube.configure({
    allowFullscreen: true,
    controls: true,
    nocookie: true,
  }),
  TableKit,
];

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function renderAttributes(attrs: Record<string, unknown>, allowedKeys: string[]) {
  return allowedKeys
    .map((key) => {
      const value = attrs[key];

      if (value === undefined || value === null || value === false || value === "") {
        return "";
      }

      if (value === true) {
        return ` ${key}`;
      }

      return ` ${key}="${escapeAttribute(String(value))}"`;
    })
    .join("");
}

function renderChildren(node: TiptapJsonNode) {
  return (node.content ?? []).map((child) => renderNode(child)).join("");
}

function renderText(node: TiptapJsonNode) {
  let html = escapeHtml(node.text ?? "");

  for (const mark of node.marks ?? []) {
    const attrs = mark.attrs ?? {};

    switch (mark.type) {
      case "bold":
        html = `<strong>${html}</strong>`;
        break;
      case "italic":
        html = `<em>${html}</em>`;
        break;
      case "code":
        html = `<code>${html}</code>`;
        break;
      case "link":
        html = `<a${renderAttributes(attrs, ["href", "target", "rel", "class", "title"])}>${html}</a>`;
        break;
      case "strike":
        html = `<s>${html}</s>`;
        break;
      case "underline":
        html = `<u>${html}</u>`;
        break;
      default:
        break;
    }
  }

  return html;
}

function renderFigureMedia(node: TiptapJsonNode, mediaHtml: string) {
  const attrs = node.attrs ?? {};
  const width = typeof attrs.width === "string" && attrs.width.trim() ? attrs.width : "100%";
  const caption = typeof attrs.caption === "string" && attrs.caption.trim()
    ? `<figcaption>${escapeHtml(attrs.caption)}</figcaption>`
    : "";

  return `<figure data-width="${escapeAttribute(width)}" style="width:${escapeAttribute(width)};">${mediaHtml}${caption}</figure>`;
}

function renderNode(node: TiptapJsonNode): string {
  const attrs = node.attrs ?? {};
  const children = renderChildren(node);

  switch (node.type) {
    case "doc":
      return children;
    case "text":
      return renderText(node);
    case "paragraph":
      return `<p>${children}</p>`;
    case "heading": {
      const level = Number(attrs.level);
      const tag = level === 1 || level === 2 || level === 3 ? `h${level}` : "h2";
      return `<${tag}>${children}</${tag}>`;
    }
    case "bulletList":
      return `<ul>${children}</ul>`;
    case "orderedList":
      return `<ol>${children}</ol>`;
    case "listItem":
      return `<li>${children}</li>`;
    case "blockquote":
      return `<blockquote>${children}</blockquote>`;
    case "codeBlock": {
      const language = typeof attrs.language === "string" ? attrs.language : "";
      return `<pre><code${language ? ` class="language-${escapeAttribute(language)}"` : ""}>${escapeHtml(node.content?.[0]?.text ?? "")}</code></pre>`;
    }
    case "hardBreak":
      return "<br>";
    case "horizontalRule":
      return "<hr>";
    case "image": {
      const imageHtml = `<img${renderAttributes(attrs, ["alt", "src", "title"])} style="width:100%;">`;
      return renderFigureMedia(node, imageHtml);
    }
    case "youtube":
      return `<iframe${renderAttributes(attrs, ["src"])} title="Watch video"></iframe>`;
    case "video": {
      const videoAttrs = {
        controls: attrs.controls === false ? undefined : true,
        controlsList: "nodownload",
        loop: attrs.loop,
        muted: attrs.muted,
        playsinline: true,
        poster: attrs.poster,
        preload: "metadata",
        src: attrs.src,
        style: "height:100%;width:100%;",
      };
      const aspectRatio = typeof attrs.aspectRatio === "string" && attrs.aspectRatio.trim()
        ? attrs.aspectRatio
        : "16 / 9";
      const videoHtml = `<div style="aspect-ratio:${escapeAttribute(aspectRatio)};overflow:hidden;width:100%;"><video${renderAttributes(videoAttrs, ["controls", "controlsList", "loop", "muted", "playsinline", "poster", "preload", "src", "style"])}></video></div>`;
      return renderFigureMedia(node, videoHtml);
    }
    case "table":
      return `<table><tbody>${children}</tbody></table>`;
    case "tableRow":
      return `<tr>${children}</tr>`;
    case "tableCell":
      return `<td${renderAttributes(attrs, ["colspan", "rowspan"])}>${children}</td>`;
    case "tableHeader":
      return `<th${renderAttributes(attrs, ["colspan", "rowspan"])}>${children}</th>`;
    default:
      return children;
  }
}

function renderTiptapJsonFallback(node: TiptapJsonNode | null) {
  return node ? renderNode(node) : "";
}

export function renderTiptapHtml(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (trimmedValue.startsWith("<")) {
    return value;
  }

  const parsed = parseTiptapJson(value);

  if (!parsed) {
    return "";
  }

  try {
    return generateHTML(parsed as JSONContent, renderExtensions);
  } catch {
    return renderTiptapJsonFallback(parsed);
  }
}
