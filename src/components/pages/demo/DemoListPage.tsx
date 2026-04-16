import type { Locale } from "@/constants/i18n";
import ContentPreviewImage from "../../common/ContentPreviewImage";
import Cta from "../../sections/Cta";

type DemoListItem = {
  category: string;
  date?: string;
  description?: string;
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
  locale: Locale;
  menu: DemoMenuItem[];
  showCategory?: boolean;
  title: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function DemoListCard({
  category,
  date,
  description,
  href,
  imageSrc,
  showCategory,
  title,
}: DemoListItem & { showCategory: boolean }) {
  return (
    <a
      className="group flex w-full cursor-pointer flex-col gap-5"
      href={href}
    >
      <ContentPreviewImage
        alt={title}
        className="card-media-motion block h-full w-full object-cover"
        containerClassName="content-thumbnail-frame w-full overflow-hidden rounded-thumb bg-bg-content"
        src={imageSrc}
        useThumbnailFallback
      />
      <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
        {showCategory ? <p className="m-0 type-mono text-brand">{category}</p> : null}
        <p className="content-hover-title m-0 type-h3 text-fg">{title}</p>
        {description ? <p className="m-0 type-body-md text-mute-fg">{description}</p> : null}
        {date ? <p className="m-0 type-body-md text-mute-fg">{date}</p> : null}
      </div>
    </a>
  );
}

export default function DemoListPage({
  emptyMessage,
  items,
  locale,
  menu,
  showCategory = true,
  title,
}: DemoListPageProps) {
  const resolvedEmptyMessage =
    emptyMessage ??
    (
      {
        en: "No posts available.",
        ja: "投稿がありません。",
        ko: "게시물이 없습니다.",
      } satisfies Record<Locale, string>
    )[locale];

  return (
    <div className="flex w-full flex-col gap-20 px-5 pb-10 md:gap-[160px] md:px-10">
      <section className="flex w-full justify-center">
        <div className="flex w-full max-w-[1200px] flex-col">
        {/* 좌측 메뉴 + 우측 데모 리스트 */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-[60px]">
          <div className="flex w-full flex-col gap-10 md:w-fit md:shrink-0 md:self-start md:sticky md:top-0">
            <header className="flex items-center justify-center">
              <h1 className="m-0 flex-1 type-h1 text-fg">{title}</h1>
            </header>

            <nav className="flex w-full flex-row flex-wrap gap-[10px] type-body-md md:w-fit md:self-start md:flex-col">
              {menu.map((item) => (
                <a
                  key={item.href}
                  className={cx(
                    "whitespace-nowrap transition-colors hover:text-fg",
                    item.isActive ? "text-fg" : "text-mute-fg",
                  )}
                  href={item.href}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="grid min-w-0 w-full grid-cols-1 gap-x-[30px] gap-y-16 md:max-w-[790px] md:grid-cols-2">
            {items.length > 0 ? (
              items.map((item, index) => (
                <DemoListCard key={`${item.title}-${index}`} {...item} showCategory={showCategory} />
              ))
            ) : (
              <div className="col-span-full flex min-h-[240px] items-center justify-center px-5 py-6 text-center">
                <p className="m-0 type-body-md text-mute-fg">{resolvedEmptyMessage}</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </section>
      <Cta />
    </div>
  );
}
