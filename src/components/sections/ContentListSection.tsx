import Button from "../common/Button";

type ContentListItem = {
  category: string;
  href: string;
  imageSrc: string;
  title: string;
};

type ContentListSectionProps = {
  className?: string;
  description: string;
  items: ContentListItem[];
  links: string[];
  title: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ContentListCard({ category, href, imageSrc, title }: ContentListItem) {
  return (
    /* 홈 전용 콘텐츠 리스트 카드 1개 */
    <a className="group flex w-full cursor-pointer items-start gap-5" href={href}>
      <div className="h-[80px] w-[120px] shrink-0 overflow-hidden rounded-box bg-bg-content md:h-[120px] md:w-[213px]">
        <img alt={title} className="block h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" src={imageSrc} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
        <p className="m-0 type-body-md text-mute-fg">{category}</p>
        <p className="m-0 type-body-lg text-fg transition-colors group-hover:text-mute-fg">{title}</p>
      </div>
    </a>
  );
}

export default function ContentListSection({
  className,
  description,
  items,
  links,
  title,
}: ContentListSectionProps) {
  return (
    /* 홈 하단용 콘텐츠 리스트 섹션 */
    <section className={cx("flex w-full justify-center overflow-hidden bg-bg-deep py-12 md:py-[100px]", className)}>
      <div className="flex w-full justify-center px-5 md:px-10">
        <div
          className="flex w-full max-w-[1200px] flex-col gap-8 md:flex-row md:items-start md:gap-[60px]"
        >
        {/* 좌측 제목/설명/필터 버튼 영역 */}
        <div className="flex w-full flex-col gap-5 md:w-[350px] md:min-w-[160px]">
          <h2 className="m-0 type-h2 text-fg">{title}</h2>
          <p className="m-0 type-body-lg text-mute-fg">{description}</p>
          <div className="flex flex-row flex-wrap items-start gap-3 md:flex-col">
            {links.map((link) => (
              <Button key={link} variant="text">
                {link}
              </Button>
            ))}
          </div>
        </div>

        {/* 우측 카드 리스트 */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-5 md:min-w-[460px] md:gap-[30px]">
          {items.map((item) => (
            <ContentListCard key={`${item.category}-${item.title}`} {...item} />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
