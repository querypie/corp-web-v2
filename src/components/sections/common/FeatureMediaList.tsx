import TextButton from "@/components/ui/TextButton";
import { featureItemGapClassName } from "@/constants/layout";
import FeatureVideoPlayback from "./FeatureVideoPlayback";

export type FeatureItem = {
  action?: {
    href: string;
    isExternal?: boolean;
    label: string;
  };
  body: string[];
  desktopTitle?: string[];
  iconSrc?: string;
  iconSurface?: boolean;
  imageAlt: string;
  imageClassName?: string;
  imageSrc?: string;
  excludeFromSearchSnippet?: boolean;
  mediaClassName?: string;
  reverse?: boolean;
  title: string[];
  titleLeadLarge?: boolean;
  videoSrc?: string;
};

type FeatureMediaListProps = {
  className?: string;
  items: FeatureItem[];
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function FeatureCopy({
  action,
  body,
  className,
  desktopTitle,
  iconSrc,
  iconSurface,
  title,
  titleLeadLarge,
}: Pick<FeatureItem, "action" | "body" | "desktopTitle" | "iconSrc" | "iconSurface" | "title" | "titleLeadLarge"> & { className?: string }) {
  return (
    /* 기능 설명 텍스트 블록 */
    <div className={cx("flex w-full min-w-0 flex-1 flex-col gap-3 not-italic md:gap-5 lg:min-w-[200px]", className)}>
      <div className="order-1 flex w-full min-w-0 items-center gap-3 md:contents">
        {iconSrc ? (
          <span
            className={cx(
              "inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-[10px] md:h-15 md:w-15 md:rounded-[14px]",
              iconSurface && "home-feature-icon-surface bg-secondary",
            )}
          >
            <img
              alt=""
              aria-hidden="true"
              className="h-full w-full object-contain"
              src={iconSrc}
            />
          </span>
        ) : null}
        <div
          className={cx(
            "min-w-0 flex-1 break-words text-pretty font-normal tracking-[0] text-fg md:w-full md:flex-none",
            !titleLeadLarge && "type-h3 leading-6 md:type-h2 md:leading-8",
            desktopTitle && "md:hidden",
          )}
        >
          {title.map((line, index) =>
            titleLeadLarge && index === 0 ? (
              <h2 key={line} className="m-0 type-h1">
                {line}
              </h2>
            ) : (
              <p
                key={line}
                className={cx("m-0", titleLeadLarge && "type-h3 leading-6")}
              >
                {line}
              </p>
            ),
          )}
        </div>
        {desktopTitle ? (
          <div className="hidden min-w-0 flex-1 break-words text-pretty font-normal tracking-[0] text-fg md:block md:w-full md:flex-none md:type-h2 md:leading-8">
            {desktopTitle.map((line) => (
              <p key={line} className="m-0">
                {line}
              </p>
            ))}
          </div>
        ) : null}
      </div>
      <div className="order-2 w-full break-words text-pretty type-body-lg leading-6 text-mute md:order-none md:leading-[26px]">
        {body.map((line) => (
          <p key={line} className="m-0">
            {line}
          </p>
        ))}
      </div>
      {action ? (
        <TextButton
          className="order-3 justify-start self-start md:order-none"
          href={action.href}
          rel={action.isExternal ? "noreferrer noopener" : undefined}
          target={action.isExternal ? "_blank" : undefined}
        >
          {action.label}
        </TextButton>
      ) : null}
    </div>
  );
}

function FeatureMedia({
  className,
  imageAlt,
  imageClassName,
  imageSrc,
  videoSrc,
}: Pick<FeatureItem, "imageAlt" | "imageClassName" | "imageSrc" | "videoSrc"> & {
  className?: string;
}) {
  if (!videoSrc && !imageSrc) return null;
  const isGif = imageSrc?.toLowerCase().endsWith(".gif") ?? false;

  return (
    /* 기능 소개용 비주얼 패널 */
    <div
      className={cx(
        "overflow-hidden rounded-box",
        videoSrc ? "w-full shrink-0 lg:w-[790px] lg:max-w-[65%]" : "aspect-[2/1] w-full shrink-0 lg:w-[790px] lg:max-w-[65%]",
        isGif && "feature-gif-frame",
        className,
      )}
    >
      {videoSrc ? (
        <FeatureVideoPlayer
          src={videoSrc}
          title={imageAlt}
        />
      ) : (
        <img
          alt={imageAlt}
          className={cx("block object-contain", imageClassName ?? "h-full w-full")}
          src={imageSrc}
        />
      )}
    </div>
  );
}

function FeatureVideoPlayer({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const previewSrc = `${src}#t=0.001`;

  return (
    <video
      aria-label={title}
      className="block h-auto w-full"
      loop
      muted
      playsInline
      preload="metadata"
      src={previewSrc}
    />
  );
}

export default function FeatureMediaList({
  className,
  items,
}: FeatureMediaListProps) {
  const content = (
      <div className={`flex w-full max-w-[1200px] flex-col ${featureItemGapClassName}`}>
        {items.map((item, index) => {
          const shouldReverse = item.reverse ?? index % 2 === 1;

          return (
            /* 모바일: 미디어 먼저, 데스크탑: 가로 배치 (reverse 시 미디어/텍스트 순서 교차) */
            <div
              key={`${item.videoSrc ?? item.imageSrc}-${index}`}
              className={cx(
                "flex min-w-0 flex-col items-start gap-5 lg:flex-row lg:gap-[60px]",
                shouldReverse && "lg:flex-row-reverse",
              )}
              data-reveal
              data-nosnippet={item.excludeFromSearchSnippet || undefined}
              style={{ transitionDelay: `${index * 90}ms` }}
            >
              <FeatureCopy
                action={item.action}
                body={item.body}
                className="order-2 lg:order-none"
                desktopTitle={item.desktopTitle}
                iconSrc={item.iconSrc}
                iconSurface={item.iconSurface}
                title={item.title}
                titleLeadLarge={item.titleLeadLarge}
              />
              <FeatureMedia
                className={cx("order-1 lg:order-none", item.mediaClassName)}
                imageAlt={item.imageAlt}
                imageClassName={item.imageClassName}
                imageSrc={item.imageSrc}
                videoSrc={item.videoSrc}
              />
            </div>
          );
        })}
      </div>
  );
  const sectionClassName = cx("flex w-full justify-center", className);
  return items.some(item => item.videoSrc)
    ? <FeatureVideoPlayback className={sectionClassName}>{content}</FeatureVideoPlayback>
    : <section className={sectionClassName}>{content}</section>;
}
