type DocsListItem = {
  category: string;
  href: string;
  imageSrc: string;
  title: string;
};

type DocsMenuItem = {
  href: string;
  isActive: boolean;
  label: string;
};

type DocsListPageProps = {
  emptyMessage?: string;
  items: DocsListItem[];
  menu: DocsMenuItem[];
  showCategory?: boolean;
  title: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function DocsListCard({
  category,
  href,
  imageSrc,
  index,
  showCategory,
  title,
}: DocsListItem & { index: number; showCategory: boolean }) {
  return (
    /* 문서 리스트 카드 1개 */
    <a
      className="group flex w-full cursor-pointer items-start gap-5"
      data-reveal
      href={href}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <div className="h-[80px] w-[120px] shrink-0 overflow-hidden rounded-box bg-bg-content md:h-[120px] md:w-[213px]">
        <img alt={title} className="card-media-motion block h-full w-full object-cover" src={imageSrc} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
        {showCategory ? <p className="m-0 type-body-md text-mute-fg">{category}</p> : null}
        <p className="content-hover-title m-0 type-body-lg text-fg">{title}</p>
      </div>
    </a>
  );
}

export default function DocsListPage({
  emptyMessage = "게시물이 없습니다",
  items,
  menu,
  showCategory = true,
  title,
}: DocsListPageProps) {
  return (
    <div className="flex w-full justify-center px-5 pb-10 md:px-10">
      <section className="flex w-full max-w-[1200px] flex-col gap-10">
        {/* 페이지 제목 */}
        <header className="flex items-center justify-center">
          <h1 className="m-0 flex-1 type-h1 text-fg">{title}</h1>
        </header>

        {/* 좌측 카테고리 메뉴 + 우측 문서 카드 목록 */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-[60px]">
          <nav className="flex w-full flex-row flex-wrap gap-[10px] type-body-md md:w-[118px] md:shrink-0 md:flex-col md:sticky md:top-[80px]">
            {menu.map((item) => (
              <a
                key={item.href}
                className={cx(
                  "transition-colors hover:text-fg",
                  item.isActive ? "text-fg" : "text-mute-fg",
                )}
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex min-w-0 w-full flex-col justify-center gap-5 md:max-w-[790px] md:gap-[30px]">
            {items.length > 0 ? (
              items.map((item, index) => (
                <DocsListCard key={`${item.title}-${index}`} {...item} index={index} showCategory={showCategory} />
              ))
            ) : (
              <div className="flex min-h-[240px] items-center justify-center px-5 py-6 text-center">
                <p className="m-0 type-body-md text-mute-fg">{emptyMessage}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
