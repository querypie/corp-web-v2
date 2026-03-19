type DocsContentListItem = {
  category: string;
  href: string;
  imageSrc: string;
  title: string;
};

type DocsContentListSectionProps = {
  className?: string;
  items: DocsContentListItem[];
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function DocsContentListCard({ category, href, imageSrc, title }: DocsContentListItem) {
  return (
    /* docs 상세 하단용 콘텐츠 카드 1개 */
    <a className="group flex w-full cursor-pointer items-start gap-5" href={href}>
      <div className="h-[80px] w-[120px] shrink-0 overflow-hidden rounded-box bg-bg-content md:h-[120px] md:w-[213px]">
        <img
          alt={title}
          className="card-media-motion block h-full w-full object-cover"
          src={imageSrc}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
        <p className="m-0 type-body-md text-mute-fg">{category}</p>
        <p className="content-hover-title m-0 type-body-lg text-fg">{title}</p>
      </div>
    </a>
  );
}

export default function DocsContentListSection({
  className,
  items,
}: DocsContentListSectionProps) {
  return (
    /* docs 상세 하단 전용 콘텐츠 리스트 */
    <section className={cx("flex w-full justify-center", className)}>
      <div className="flex w-full max-w-[680px] flex-col justify-center gap-5 md:gap-[30px]">
        {items.map((item) => (
          <DocsContentListCard key={`${item.category}-${item.title}`} {...item} />
        ))}
      </div>
    </section>
  );
}
