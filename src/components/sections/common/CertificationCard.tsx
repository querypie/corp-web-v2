export type CertificationItem = {
  description: readonly string[];
  imageAlt: string;
  imageClassName?: string;
  imageContainerClassName?: string;
  imageSrc: string;
  title: string;
};

export default function CertificationCard({ description, imageAlt, imageClassName, imageContainerClassName, imageSrc, title }: CertificationItem) {
  return <article className="flex min-h-[260px] flex-col items-center justify-center gap-6 rounded-box bg-bg-content px-5 py-7 text-center sm:min-h-[280px] sm:gap-7 sm:py-8 md:min-h-[300px] md:gap-8">
    <div className={["flex h-[76px] w-[110px] items-center justify-center overflow-hidden sm:h-[84px] sm:w-[116px] md:h-[90px] md:w-[120px]", imageContainerClassName].filter(Boolean).join(" ")}>
      <img alt={imageAlt} className={["block h-auto max-h-full w-auto max-w-full object-contain", imageClassName].filter(Boolean).join(" ")} src={imageSrc} />
    </div>
    <div className="flex w-full flex-col items-center gap-4 sm:gap-5">
      <p className="m-0 type-body-lg text-fg">{title}</p>
      <p className="m-0 max-w-[240px] text-pretty type-body-md text-mute">{description.join(" ")}</p>
    </div>
  </article>;
}
