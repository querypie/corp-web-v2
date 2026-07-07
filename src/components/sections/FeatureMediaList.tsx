"use client";

import { useEffect, useRef } from "react";
import TextButton from "@/components/ui/TextButton";
import { featureItemGapClassName } from "@/constants/layout";

type FeatureItem = {
  action?: {
    href: string;
    isExternal?: boolean;
    label: string;
  };
  body: string[];
  desktopTitle?: string[];
  iconSrc?: string;
  imageAlt: string;
  imageClassName?: string;
  imageSrc?: string;
  mediaClassName?: string;
  reverse?: boolean;
  title: string[];
  videoSrc?: string;
};

type FeatureMediaListProps = {
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
    imageSrc: "/assets/pages/home/features/feature-panel-a.png",
    title: ["Make product", "operations self-driving"],
  },
  {
    body: [
      "Turn conversations and customer feedback",
      "into actionable issues that are routed,",
      "labeled, and prioritized for the right team.",
    ],
    imageAlt: "Model selector preview",
    imageSrc: "/assets/pages/home/features/feature-panel-b.png",
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
    imageSrc: "/assets/pages/home/features/feature-panel-a.png",
    title: ["Make product", "operations self-driving"],
  },
  {
    body: [
      "Turn conversations and customer feedback",
      "into actionable issues that are routed,",
      "labeled, and prioritized for the right team.",
    ],
    imageAlt: "Model selector preview",
    imageSrc: "/assets/pages/home/features/feature-panel-b.png",
    reverse: true,
    title: ["Make product", "operations self-driving"],
  },
];

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function FeatureCopy({
  action,
  body,
  className,
  desktopTitle,
  iconSrc,
  title,
}: Pick<FeatureItem, "action" | "body" | "desktopTitle" | "iconSrc" | "title"> & { className?: string }) {
  return (
    /* 기능 설명 텍스트 블록 */
    <div className={cx("flex w-full min-w-0 flex-1 flex-col gap-3 not-italic md:gap-5 lg:min-w-[200px]", className)}>
      <div className="order-1 flex w-full min-w-0 items-center gap-3 md:contents">
        {iconSrc ? (
          <img
            alt=""
            aria-hidden="true"
            className="h-10 w-10 shrink-0 rounded-[10px] object-contain md:h-15 md:w-15 md:rounded-[14px]"
            src={iconSrc}
          />
        ) : null}
        <div className={cx("min-w-0 flex-1 break-words text-pretty type-h3 font-normal leading-6 tracking-[0] text-fg md:w-full md:flex-none md:type-h2 md:leading-8", desktopTitle && "md:hidden")}>
          {title.map((line) => (
            <p key={line} className="m-0">
              {line}
            </p>
          ))}
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
  setVideoRef,
  videoSrc,
}: Pick<FeatureItem, "imageAlt" | "imageClassName" | "imageSrc" | "videoSrc"> & {
  className?: string;
  setVideoRef?: (video: HTMLVideoElement | null) => void;
}) {
  if (!videoSrc && !imageSrc) return null;

  return (
    /* 기능 소개용 비주얼 패널 */
    <div
      className={cx(
        "overflow-hidden rounded-box",
        videoSrc ? "w-full shrink-0 lg:w-[790px] lg:max-w-[65%]" : "aspect-[2/1] w-full shrink-0 lg:w-[790px] lg:max-w-[65%]",
        className,
      )}
    >
      {videoSrc ? (
        <FeatureVideoPlayer
          setVideoRef={setVideoRef}
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
  setVideoRef,
  src,
  title,
}: {
  setVideoRef?: (video: HTMLVideoElement | null) => void;
  src: string;
  title: string;
}) {
  return (
    <video
      aria-label={title}
      className="block h-auto w-full"
      loop
      muted
      playsInline
      preload="auto"
      ref={setVideoRef}
      src={src}
    />
  );
}

export default function FeatureMediaList({
  className,
  items = defaultItems,
}: FeatureMediaListProps) {
  const videoRefs = useRef(new Map<number, HTMLVideoElement>());

  useEffect(() => {
    let rafId = 0;

    function updatePlayback() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (document.visibilityState !== "visible") {
          videoRefs.current.forEach((video) => video.pause());
          return;
        }

        const viewportCenter = window.innerHeight / 2;
        const activationDistance = Math.min(window.innerHeight * 0.48, 420);
        let activeIndex: number | null = null;
        let closestDistance = Number.POSITIVE_INFINITY;

        videoRefs.current.forEach((video, index) => {
          const rect = video.getBoundingClientRect();
          const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
          if (!isVisible) return;

          const videoCenter = rect.top + rect.height / 2;
          const distance = Math.abs(videoCenter - viewportCenter);
          if (distance > activationDistance) return;

          if (distance < closestDistance) {
            activeIndex = index;
            closestDistance = distance;
          }
        });

        videoRefs.current.forEach((video, index) => {
          if (index === activeIndex) {
            void video.play();
            return;
          }

          video.pause();
        });
      });
    }

    updatePlayback();
    window.addEventListener("scroll", updatePlayback, { passive: true });
    window.addEventListener("resize", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updatePlayback);
      window.removeEventListener("resize", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      videoRefs.current.forEach((video) => video.pause());
    };
  }, []);

  return (
    /* 텍스트/이미지 페어를 반복 렌더하는 기능 소개 섹션 */
    <section className={cx("flex w-full justify-center", className)}>
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
              style={{ transitionDelay: `${index * 90}ms` }}
            >
              <FeatureCopy
                action={item.action}
                body={item.body}
                className="order-2 lg:order-none"
                desktopTitle={item.desktopTitle}
                iconSrc={item.iconSrc}
                title={item.title}
              />
              <FeatureMedia
                className={cx("order-1 lg:order-none", item.mediaClassName)}
                imageAlt={item.imageAlt}
                imageClassName={item.imageClassName}
                imageSrc={item.imageSrc}
                setVideoRef={
                  item.videoSrc
                    ? (video) => {
                        if (video) {
                          videoRefs.current.set(index, video);
                          return;
                        }
                        videoRefs.current.delete(index);
                      }
                    : undefined
                }
                videoSrc={item.videoSrc}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
