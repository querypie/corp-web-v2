type DemoListItem = {
  category: string;
  href: string;
  imageSrc: string;
  title: string;
};

type DemoMenuItem = {
  href: string;
  isActive: boolean;
  label: string;
};

type DemoListPageProps = {
  emptyMessage?: string;
  items: DemoListItem[];
  menu: DemoMenuItem[];
  showCategory?: boolean;
  title: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function DemoListCard({
  category,
  href,
  imageSrc,
  index,
  showCategory,
  title,
}: DemoListItem & { index: number; showCategory: boolean }) {
  return (
    <a
      className="group flex w-full cursor-pointer flex-col gap-5"
      data-reveal
      href={href}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <div className="h-[180px] w-full overflow-hidden rounded-thumb bg-bg-content md:h-[200px]">
        <img
          alt={title}
          className="block h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={imageSrc}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
        {showCategory ? <p className="m-0 type-body-md text-mute-fg">{category}</p> : null}
        <p className="m-0 type-body-lg text-fg transition-colors group-hover:text-mute-fg">{title}</p>
      </div>
    </a>
  );
}

export default function DemoListPage({
  emptyMessage = "게시물이 없습니다",
  items,
  menu,
  showCategory = true,
  title,
}: DemoListPageProps) {
  return (
    <div className="flex w-full justify-center px-5 pb-10 md:px-10">
      <section className="flex w-full max-w-[1200px] flex-col gap-10">
        {/* 페이지 제목 */}
        <header className="flex items-center justify-center">
          <h1 className="m-0 flex-1 type-h1 text-fg">{title}</h1>
        </header>

        {/* 좌측 메뉴 + 우측 데모 리스트 */}
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

          <div className="grid min-w-0 w-full grid-cols-1 gap-x-[30px] gap-y-10 md:max-w-[790px] md:grid-cols-2">
            {items.length > 0 ? (
              items.map((item, index) => (
                <DemoListCard key={`${item.title}-${index}`} {...item} index={index} showCategory={showCategory} />
              ))
            ) : (
              <div className="col-span-full flex min-h-[240px] items-center justify-center px-5 py-6 text-center">
                <p className="m-0 type-body-md text-mute-fg">{emptyMessage}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
