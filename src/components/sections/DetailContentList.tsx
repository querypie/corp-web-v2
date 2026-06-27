import Link from "next/link";
import ContentPreviewImage from "@/components/content/ContentPreviewImage";

type DetailContentItem = {
  category: string;
  href: string;
  imageSrc: string;
  isExternal?: boolean;
  title: string;
};

type DetailContentListProps = {
  className?: string;
  items: DetailContentItem[];
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function DetailContentCard({
  category,
  href,
  imageSrc,
  isExternal = false,
  title,
}: DetailContentItem) {
  const cardClassName = "group flex w-full cursor-pointer items-start gap-5";
  const cardContent = (
    <>
      <ContentPreviewImage
        alt={title}
        className="card-media-motion block h-full w-full object-cover"
        containerClassName="content-thumbnail-frame w-[120px] shrink-0 overflow-hidden rounded-box bg-bg-content md:w-[213px]"
        src={imageSrc}
        useThumbnailFallback
      />
      <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
        <p className="m-0 type-body-md text-mute">{category}</p>
        <p className="content-hover-title m-0 type-body-lg text-fg">
          <span>{title}</span>
          {isExternal ? <span aria-hidden="true" className="icon-outlink-mask ml-1 h-3.5 w-3.5 shrink-0 align-[-2px] text-mute" /> : null}
        </p>
      </div>
    </>
  );

  if (isExternal) {
    return (
      /* 상세 페이지 하단용 콘텐츠 카드 1개 */
      <a
        className={cardClassName}
        href={href}
        rel="noreferrer noopener"
        target="_blank"
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link className={cardClassName} href={href}>
      {cardContent}
    </Link>
  );
}

export default function DetailContentList({
  className,
  items,
}: DetailContentListProps) {
  return (
    /* 상세 페이지 하단용 콘텐츠 리스트 */
    <section className={cx("flex w-full justify-center", className)}>
      <div className="flex w-full max-w-[680px] flex-col justify-center gap-5 md:gap-[30px]">
        {items.map((item) => (
          <DetailContentCard key={`${item.category}-${item.title}`} {...item} />
        ))}
      </div>
    </section>
  );
}
