type ReviewItem = {
  body: string;
  company: string;
  imageSrc: string;
  role: string;
};

type ReviewSectionProps = {
  className?: string;
  items: ReviewItem[];
  title: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ReviewCard({ body, company, imageSrc, role }: ReviewItem) {
  return (
    /* 후기 카드 1개 */
    <article className="card-hover flex h-auto min-w-0 w-full flex-col justify-between gap-5 rounded-box bg-bg-content px-6 py-[30px] md:h-[210px] md:flex-1 md:w-auto md:gap-0">
      <p className="m-0 type-body-lg text-fg">{body}</p>
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-lg">
          <img alt={company} className="block h-10 w-10 object-cover" src={imageSrc} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col type-body-md leading-5">
          <p className="m-0 text-fg">{company}</p>
          <p className="m-0 text-mute-fg">{role}</p>
        </div>
      </div>
    </article>
  );
}

export default function ReviewSection({
  className,
  items,
  title,
}: ReviewSectionProps) {
  return (
    /* 사용자 후기 카드 섹션 */
    <section className={cx("flex w-full justify-center", className)}>
      <div className="flex w-full max-w-[1200px] flex-col gap-[30px]">
        <h2 className="m-0 type-h2 text-fg">{title}</h2>
        {/* 데스크톱에서 가로 카드 2개 배치 */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-[30px]">
          {items.map((item, index) => (
            <ReviewCard key={`${item.company}-${item.role}-${index}`} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
