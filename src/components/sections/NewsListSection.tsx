type NewsItem = {
  imageSrc: string;
  title: string;
};

type NewsListSectionProps = {
  className?: string;
  items: NewsItem[];
  title: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function NewsCard({ imageSrc, title }: NewsItem) {
  return (
    /* 뉴스 카드 1개 */
    <article className="group flex w-full cursor-pointer flex-col gap-5 md:flex-1">
      <div className="h-[200px] w-full overflow-hidden rounded-box bg-bg-content">
        <img
          alt={title}
          className="block h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={imageSrc}
        />
      </div>
      <p className="content-hover-title m-0 type-body-lg text-fg">{title}</p>
    </article>
  );
}

export default function NewsListSection({
  className,
  items,
  title,
}: NewsListSectionProps) {
  return (
    /* 최신 뉴스 카드 리스트 섹션 */
    <section className={cx("flex w-full justify-center", className)}>
      <div className="flex w-full max-w-[1200px] flex-col gap-[30px]">
        <h2 className="m-0 type-h2 text-fg">{title}</h2>
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-[30px]">
          {items.map((item) => (
            <NewsCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
