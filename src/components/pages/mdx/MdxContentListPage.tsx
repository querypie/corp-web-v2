import type { Locale } from "@/constants/i18n";
import ContentPreviewImage from "../../common/ContentPreviewImage";
import PaginationNav from "../../common/PaginationNav";
import Cta from "../../sections/Cta";

type MdxContentListItem = {
  date: string;
  description?: string;
  href: string;
  imageSrc: string;
  title: string;
};

type MdxContentListPageProps = {
  currentPage: number;
  emptyMessage?: string;
  items: MdxContentListItem[];
  locale: Locale;
  nextHref?: string | null;
  previousHref?: string | null;
  title: string;
  totalPages: number;
};

function MdxContentListCard({ date, description, href, imageSrc, title }: MdxContentListItem) {
  return (
    <a className="group flex w-full cursor-pointer flex-col gap-5" href={href}>
      <ContentPreviewImage
        alt={title}
        className="card-media-motion block h-full w-full object-cover"
        containerClassName="content-thumbnail-frame w-full overflow-hidden rounded-thumb bg-bg-content"
        src={imageSrc}
        useThumbnailFallback
      />
      <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
        <p className="m-0 type-body-md text-mute-fg">{date}</p>
        <p className="content-hover-title m-0 type-h3 text-fg">{title}</p>
        {description ? <p className="m-0 type-body-md text-mute-fg">{description}</p> : null}
      </div>
    </a>
  );
}

export default function MdxContentListPage({
  currentPage,
  emptyMessage,
  items,
  locale,
  nextHref,
  previousHref,
  title,
  totalPages,
}: MdxContentListPageProps) {
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
        <div className="flex w-full max-w-[1200px] flex-col gap-12">
          <header className="flex items-center justify-center">
            <h1 className="m-0 flex-1 type-h1 text-fg">{title}</h1>
          </header>

          {items.length > 0 ? (
            <>
              <div className="grid min-w-0 w-full grid-cols-1 gap-x-[30px] gap-y-16 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item, index) => (
                  <MdxContentListCard key={`${item.title}-${index}`} {...item} />
                ))}
              </div>
              <PaginationNav
                currentPage={currentPage}
                locale={locale}
                nextHref={nextHref}
                previousHref={previousHref}
                totalPages={totalPages}
              />
            </>
          ) : (
            <div className="flex min-h-[240px] items-center justify-center px-5 py-6 text-center">
              <p className="m-0 type-body-md text-mute-fg">{resolvedEmptyMessage}</p>
            </div>
          )}
        </div>
      </section>
      <Cta />
    </div>
  );
}
