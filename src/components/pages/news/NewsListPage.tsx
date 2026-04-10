import type { Locale } from "@/constants/i18n";
import Cta from "../../sections/Cta";

type NewsListItem = {
  date: string;
  href: string;
  imageSrc: string;
  isExternal?: boolean;
  summary: string;
  title: string;
};

export type { NewsListItem };

type NewsListPageProps = {
  emptyMessage?: string;
  items: NewsListItem[];
  locale: Locale;
  title: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function NewsListCard({
  date,
  href,
  imageSrc,
  isExternal = true,
  summary,
  title,
}: NewsListItem) {
  const resolvedImageSrc = imageSrc.trim();

  return (
    /* 뉴스 카드 1개: 모바일은 세로, 데스크톱은 텍스트/썸네일 2열 */
    <a
      className="group flex w-full flex-col gap-4 md:flex-row md:items-start md:gap-[30px]"
      href={href}
      rel={isExternal ? "noreferrer noopener" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      {/* 날짜 / 제목 / 요약 텍스트 영역 */}
      <div className="order-2 flex min-w-0 flex-1 flex-col gap-[10px] md:order-1">
        <p className="m-0 type-body-md text-mute-fg">{date}</p>
        <h2 className="content-hover-title m-0 type-h3 text-fg">{title}</h2>
        <p className="m-0 hidden type-body-md text-mute-fg md:block">{summary}</p>
      </div>
      {/* 우측 썸네일 영역 */}
      {resolvedImageSrc ? (
        <div className="content-thumbnail-frame order-1 w-full shrink-0 overflow-hidden rounded-thumb bg-bg-content md:order-2 md:w-[380px]">
          <img
            alt={title}
            className="card-media-motion block h-full w-full object-cover"
            decoding="async"
            loading="lazy"
            src={resolvedImageSrc}
          />
        </div>
      ) : null}
    </a>
  );
}

export default function NewsListPage({
  emptyMessage,
  items,
  locale,
  title,
}: NewsListPageProps) {
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
        <div className="flex w-full max-w-[900px] flex-col gap-20">
        {/* 뉴스 카드 목록 */}
        <div className="flex min-w-0 w-full flex-col gap-10">
          {items.length > 0 ? (
            items.map((item, index) => (
              <NewsListCard key={`${item.title}-${index}`} {...item} />
            ))
          ) : (
            <div className="flex min-h-[240px] items-center justify-center px-5 py-6 text-center">
              <p className="m-0 type-body-md text-mute-fg">{resolvedEmptyMessage}</p>
            </div>
            )}
          </div>
        </div>
      </section>
      <Cta />
    </div>
  );
}
