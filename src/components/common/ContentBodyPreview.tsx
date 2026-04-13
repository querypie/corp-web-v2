import {
  CONTENT_PREVIEW_RICH_CLASS,
  CONTENT_PREVIEW_TABLE_WRAPPER_CLASS,
} from "@/features/content/previewStyles";
import { highlightCodeBlocksInHtml } from "@/features/content/codeHighlight";

function normalizeContentHtml(html: string) {
  const normalized = html.replace(
    /(src=|href=)(["'])public\//g,
    (_, attribute, quote) => `${attribute}${quote}/`,
  );

  return highlightCodeBlocksInHtml(normalized).replace(
    /<table\b[\s\S]*?<\/table>/g,
    (tableHtml) => `<div class="${CONTENT_PREVIEW_TABLE_WRAPPER_CLASS}">${tableHtml}</div>`,
  );
}

type ContentBodyPreviewProps = {
  bodyHtml?: string;
};

export default function ContentBodyPreview({
  bodyHtml = "",
}: ContentBodyPreviewProps) {
  if (!bodyHtml.trim()) {
    return null;
  }

  return (
    <div
      className={CONTENT_PREVIEW_RICH_CLASS}
      dangerouslySetInnerHTML={{ __html: normalizeContentHtml(bodyHtml) }}
    />
  );
}
