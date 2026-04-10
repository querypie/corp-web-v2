import TextButton from "../common/TextButton";

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
  links: Array<{ href: string; label: string }>;
  title: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ContentListCard({ category, href, imageSrc, title }: ContentListItem) {
  return (
    /* 홈 전용 콘텐츠 리스트 카드 1개 */
    <a className="group flex w-full cursor-pointer flex-col gap-5 md:flex-row md:items-start" href={href}>
      <div className="content-thumbnail-frame w-full shrink-0 overflow-hidden rounded-box bg-bg-content md:w-[213px]">
        <img alt={title} className="card-media-motion block h-full w-full object-cover" src={imageSrc} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
        <p className="m-0 type-mono text-brand">{category}</p>
        <p className="content-hover-title m-0 type-h3 text-fg">{title}</p>
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
<<<<<<< HEAD
              <a key={link.href} href={link.href}>
                <TextButton>
                  {link.label}
                </TextButton>
              </a>
=======
              <TextButton key={link}>
                {link}
              </TextButton>
>>>>>>> origin/main
            ))}
          </div>
        </div>

        {/* 우측 카드 리스트 */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-8 md:min-w-[460px] md:gap-[30px]">
          {items.map((item) => (
            <ContentListCard key={`${item.category}-${item.title}`} {...item} />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
