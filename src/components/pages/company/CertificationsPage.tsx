type CertificationItem = {
  description: readonly string[];
  imageAlt: string;
  imageClassName?: string;
  imageContainerClassName?: string;
  imageSrc: string;
  title: string;
};

type CertificationsPageProps = {
  intro: string;
  items: readonly CertificationItem[];
  title: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function CertificationCard({
  description,
  imageAlt,
  imageClassName,
  imageContainerClassName,
  index,
  imageSrc,
  title,
}: CertificationItem & { index: number }) {
  return (
    <article
      className="flex min-h-[260px] flex-col items-center justify-center gap-6 rounded-box bg-bg-content px-5 py-7 text-center sm:min-h-[280px] sm:gap-7 sm:py-8 md:min-h-[300px] md:gap-8"
      data-reveal
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      {/* 인증 마크 크기가 제각각이라 카드별 래퍼 크기를 허용 */}
      <div
        className={cx(
          "flex h-[76px] w-[110px] items-center justify-center overflow-hidden sm:h-[84px] sm:w-[116px] md:h-[90px] md:w-[120px]",
          imageContainerClassName,
        )}
      >
        <img
          alt={imageAlt}
          className={cx("block h-auto max-h-full w-auto max-w-full object-contain", imageClassName)}
          src={imageSrc}
        />
      </div>
      <div className="flex w-full flex-col items-center gap-4 sm:gap-5">
        <p className="m-0 type-body-lg text-fg">{title}</p>
        <div className="flex flex-col type-body-md text-mute-fg">
          {description.map((line) => (
            <p key={line} className="m-0">
              {line}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function CertificationsPage({
  intro,
  items,
  title,
}: CertificationsPageProps) {
  return (
    <div className="flex w-full justify-center px-5 pb-10 md:px-10">
      <section className="flex w-full max-w-[900px] flex-col gap-20 sm:gap-16 md:gap-20 lg:gap-[120px]">
        {/* Figma 기준으로 좌측 제목 / 우측 소개 문구 2열 헤더를 구성 */}
        <header className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]" data-reveal>
          <h1 className="m-0 type-h1 text-fg">{title}</h1>
          <p className="m-0 type-body-lg text-fg">{intro}</p>
        </header>

        {/* 인증 카드는 동일한 정보 밀도를 유지하도록 공통 카드 컴포넌트로 렌더 */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {items.map((item, index) => (
            <CertificationCard key={`${item.title}-${item.imageSrc}-${index}`} {...item} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
