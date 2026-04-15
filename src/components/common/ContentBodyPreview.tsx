import {
  CONTENT_PREVIEW_RICH_CLASS,
} from "@/features/content/previewStyles";
import { highlightCodeBlocksInHtml } from "@/features/content/codeHighlight";

function normalizeContentHtml(html: string) {
  return highlightCodeBlocksInHtml(html.replace(
    /(src=|href=)(["'])public\//g,
    (_, attribute, quote) => `${attribute}${quote}/`,
  ));
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
