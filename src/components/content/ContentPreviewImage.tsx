import { getContentThumbnailSrc } from "@/features/content/data";

type ContentPreviewImageProps = {
  alt: string;
  className?: string;
  containerClassName?: string;
  src: string;
  useThumbnailFallback?: boolean;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function ContentPreviewImage({
  alt,
  className = "block h-full w-full object-cover",
  containerClassName,
  src,
  useThumbnailFallback = false,
}: ContentPreviewImageProps) {
  const resolvedSrc = useThumbnailFallback ? getContentThumbnailSrc(src) : src.trim();

  if (!resolvedSrc) {
    return null;
  }

  return (
    <div className={cx(containerClassName)}>
      <img alt={alt} className={className} decoding="async" loading="lazy" src={resolvedSrc} />
    </div>
  );
}
