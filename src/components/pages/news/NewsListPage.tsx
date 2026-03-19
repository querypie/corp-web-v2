type NewsListItem = {
  date: string;
  href: string;
  imageSrc: string;
  summary: string;
  title: string;
};

type NewsListPageProps = {
  items: NewsListItem[];
  title: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function NewsListCard({
  date,
  href,
  imageSrc,
  index,
  summary,
  title,
}: NewsListItem & { index: number }) {
  return (
    /* 뉴스 카드 1개: 모바일은 세로, 데스크톱은 텍스트/썸네일 2열 */
    <a
      className="group flex w-full flex-col gap-4 md:flex-row md:items-start md:gap-[30px]"
      data-reveal
      href={href}
      rel="noreferrer noopener"
      style={{ transitionDelay: `${index * 70}ms` }}
      target="_blank"
    >
      {/* 날짜 / 제목 / 요약 텍스트 영역 */}
      <div className="order-2 flex min-w-0 flex-1 flex-col gap-[10px] md:order-1">
        <p className="m-0 type-body-md text-mute-fg">{date}</p>
        <h2 className="content-hover-title m-0 type-h2 text-fg">{title}</h2>
        <p className="m-0 type-body-md text-mute-fg">{summary}</p>
      </div>
      {/* 우측 썸네일 영역 */}
      <div className="order-1 h-[180px] w-full shrink-0 overflow-hidden rounded-thumb bg-bg-content md:order-2 md:h-[200px] md:w-[380px]">
        <img
          alt={title}
          className="card-media-motion block h-full w-full object-cover"
          src={imageSrc}
        />
      </div>
    </a>
  );
}

export default function NewsListPage({
  items,
  title,
}: NewsListPageProps) {
  return (
    <div className="flex w-full justify-center px-5 pb-10 md:px-10">
      <section className="flex w-full max-w-[900px] flex-col gap-20">
        {/* 뉴스 카드 목록 */}
        <div className="flex min-w-0 w-full flex-col gap-10">
          {items.map((item, index) => (
            <NewsListCard key={`${item.title}-${index}`} {...item} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
