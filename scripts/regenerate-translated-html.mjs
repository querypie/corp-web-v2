import { promises as fs } from "fs";
import path from "path";

const contentRoot = path.join(process.cwd(), "src", "content");
const targetLocales = new Set(["ko", "ja"]);
const shouldWrite = process.argv.includes("--write");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function renderAttributes(attrs = {}, allowedKeys) {
  return allowedKeys
    .map((key) => {
      const value = attrs[key];

      if (value === undefined || value === null || value === false || value === "") {
        return "";
      }

      if (value === true) {
        return ` ${key}`;
      }

      return ` ${key}="${escapeAttribute(value)}"`;
    })
    .join("");
}

function renderChildren(node) {
  return (node.content ?? []).map((child) => renderNode(child)).join("");
}

function renderText(node) {
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

function renderFigureMedia(node, mediaHtml) {
  const attrs = node.attrs ?? {};
  const width = typeof attrs.width === "string" && attrs.width.trim() ? attrs.width : "100%";
  const caption =
    typeof attrs.caption === "string" && attrs.caption.trim()
      ? `<figcaption>${escapeHtml(attrs.caption)}</figcaption>`
      : "";

  return `<figure data-width="${escapeAttribute(width)}" style="width:${escapeAttribute(width)};">${mediaHtml}${caption}</figure>`;
}

function renderNode(node) {
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
      const aspectRatio =
        typeof attrs.aspectRatio === "string" && attrs.aspectRatio.trim() ? attrs.aspectRatio : "16 / 9";
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

function renderTiptapHtml(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (trimmedValue.startsWith("<")) {
    return value;
  }

  try {
    return renderNode(JSON.parse(value));
  } catch {
    return "";
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".tiptap.json")) {
      files.push(fullPath);
    }
  }

  return files;
}

const tiptapFiles = await walk(contentRoot);
const changed = [];
const skipped = [];

for (const jsonPath of tiptapFiles) {
  const locale = path.basename(jsonPath, ".tiptap.json");

  if (!targetLocales.has(locale)) {
    continue;
  }

  const richText = await fs.readFile(jsonPath, "utf8");
  const html = renderTiptapHtml(richText);
  const htmlPath = path.join(path.dirname(jsonPath), `${locale}.html`);
  const relativeHtmlPath = path.relative(process.cwd(), htmlPath);

  if (!html.trim()) {
    skipped.push(relativeHtmlPath);
    continue;
  }

  let currentHtml = "";
  try {
    currentHtml = await fs.readFile(htmlPath, "utf8");
  } catch {
    currentHtml = "";
  }

  if (currentHtml === html) {
    continue;
  }

  changed.push(relativeHtmlPath);

  if (shouldWrite) {
    await fs.writeFile(htmlPath, html, "utf8");
  }
}

console.log(`${shouldWrite ? "Updated" : "Would update"} ${changed.length} HTML files.`);

for (const filePath of changed) {
  console.log(filePath);
}

if (skipped.length > 0) {
  console.error(`Skipped ${skipped.length} files because their Tiptap JSON rendered empty.`);
  for (const filePath of skipped) {
    console.error(filePath);
  }
  process.exitCode = 1;
}
