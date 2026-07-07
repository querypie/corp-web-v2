import TextButton from "@/components/ui/TextButton";

type ResourceListItem = {
  category: string;
  href: string;
  imageSrc: string;
  isExternal?: boolean;
  title: string;
};

type ResourceListProps = {
  className?: string;
  description: string;
  items: ResourceListItem[];
  links: Array<{ href: string; label: string }>;
  title: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ResourceListCard({
  category,
  href,
  imageSrc,
  isExternal = false,
  title,
}: ResourceListItem) {
  return (
    /* 홈 전용 콘텐츠 리스트 카드 1개 */
    <a
      className="group flex w-full cursor-pointer flex-col gap-5 md:flex-row md:items-start"
      href={href}
      rel={isExternal ? "noreferrer noopener" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      <div className="content-thumbnail-frame w-full shrink-0 overflow-hidden rounded-box bg-bg-content md:w-[213px]">
        <img alt={title} className="card-media-motion block h-full w-full object-cover" src={imageSrc} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
        <p className="m-0 type-body-sm text-mute">{category}</p>
        <p className="content-hover-title m-0 type-h3 text-fg">
          <span>{title}</span>
          {isExternal ? <span aria-hidden="true" className="icon-outlink-mask ml-1.5 h-4 w-4 shrink-0 align-[-2px] text-mute" /> : null}
        </p>
      </div>
    </a>
  );
}

export default function ResourceList({
  className,
  description,
  items,
  links,
  title,
}: ResourceListProps) {
  return (
    /* 홈 하단용 콘텐츠 리스트 섹션 */
    <section className={cx("flex w-full justify-center overflow-hidden bg-bg-deep py-14 md:py-[100px]", className)}>
      <div className="flex w-full justify-center px-5 md:px-10">
        <div
          className="flex w-full max-w-[1200px] flex-col gap-8 md:flex-row md:items-start md:gap-[60px]"
        >
        {/* 좌측 제목/설명/필터 버튼 영역 */}
        <div className="flex w-full flex-col gap-5 md:w-[350px] md:min-w-[160px]">
          <h2 className="m-0 type-h2 text-fg">{title}</h2>
          <p className="m-0 type-body-lg text-mute">{description}</p>
          <div className="flex flex-row flex-wrap items-start gap-3 md:flex-col">
            {links.map((link) => (
              <TextButton href={link.href} key={link.href}>
                {link.label}
              </TextButton>
            ))}
          </div>
        </div>

        {/* 우측 카드 리스트 */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-8 md:min-w-[460px] md:gap-[30px]">
          {items.map((item) => (
            <ResourceListCard key={`${item.category}-${item.title}`} {...item} />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
