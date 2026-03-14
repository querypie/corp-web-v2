type FeatureItem = {
  body: string[];
  imageAlt: string;
  imageSrc: string;
  reverse?: boolean;
  title: string[];
};

type FeatureSectionProps = {
  className?: string;
  items?: FeatureItem[];
};

const defaultItems: FeatureItem[] = [
  {
    body: [
      "Turn conversations and customer feedback",
      "into actionable issues that are routed,",
      "labeled, and prioritized for the right team.",
    ],
    imageAlt: "AIP workspace preview",
    imageSrc: "/images/home/features/feature-panel-a.png",
    title: ["Make product", "operations self-driving"],
  },
  {
    body: [
      "Turn conversations and customer feedback",
      "into actionable issues that are routed,",
      "labeled, and prioritized for the right team.",
    ],
    imageAlt: "Model selector preview",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
    title: ["Make product", "operations self-driving"],
  },
  {
    body: [
      "Turn conversations and customer feedback",
      "into actionable issues that are routed,",
      "labeled, and prioritized for the right team.",
    ],
    imageAlt: "AIP workspace preview",
    imageSrc: "/images/home/features/feature-panel-a.png",
    title: ["Make product", "operations self-driving"],
  },
  {
    body: [
      "Turn conversations and customer feedback",
      "into actionable issues that are routed,",
      "labeled, and prioritized for the right team.",
    ],
    imageAlt: "Model selector preview",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
    title: ["Make product", "operations self-driving"],
  },
];

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function FeatureCopy({ body, title }: Pick<FeatureItem, "body" | "title">) {
  return (
    /* 기능 설명 텍스트 블록 */
    <div className="flex flex-1 flex-col gap-5 not-italic md:min-w-[200px]">
      <div className="w-full type-h2 leading-7 tracking-[-0.3px] text-fg">
        {title.map((line) => (
          <p key={line} className="m-0">
            {line}
          </p>
        ))}
      </div>
      <div className="w-full type-body-lg leading-6 text-mute-fg">
        {body.map((line) => (
          <p key={line} className="m-0">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function FeatureImage({ imageAlt, imageSrc }: Pick<FeatureItem, "imageAlt" | "imageSrc">) {
  return (
    /* 기능 소개용 비주얼 패널 */
    <div className="h-[220px] w-full overflow-hidden rounded-box bg-[linear-gradient(116.854deg,#303131_0%,#232323_100%)] md:h-[400px] md:w-[790px] md:max-w-[65%]">
      <img alt={imageAlt} className="block h-full w-full object-cover" src={imageSrc} />
    </div>
  );
}

export default function FeatureSection({
  className,
  items = defaultItems,
}: FeatureSectionProps) {
  return (
    /* 텍스트/이미지 페어를 반복 렌더하는 기능 소개 섹션 */
    <section className={cx("flex w-full justify-center", className)}>
      <div className="flex w-full max-w-[1200px] flex-col gap-12 md:gap-[100px]">
        {items.map((item, index) => (
          /* 모바일: 세로 배치, 데스크탑: 가로 배치 (reverse 시 flex-row-reverse) */
          <div
            key={`${item.imageSrc}-${index}`}
            className={cx(
              "flex flex-col items-start gap-8 md:flex-row md:gap-[60px]",
              item.reverse && "md:flex-row-reverse",
            )}
          >
            <FeatureCopy body={item.body} title={item.title} />
            <FeatureImage imageAlt={item.imageAlt} imageSrc={item.imageSrc} />
          </div>
        ))}
      </div>
    </section>
  );
}
