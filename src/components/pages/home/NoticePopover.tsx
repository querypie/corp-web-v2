"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import Button from "@/components/ui/Button";
import type { Locale } from "@/constants/i18n";

export type NoticeItem = {
  category: string;
  href: string;
  imageSrc: string;
  isExternal: boolean;
  title: string;
};

type NoticePopoverProps = {
  items: NoticeItem[];
  locale: Locale;
};

const NOTICE_COOKIE_NAME = "querypie-home-notice-hidden";
const NOTICE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const AUTO_ROLLING_INTERVAL_MS = 4000;
const DRAG_THRESHOLD_PX = 32;
const IMAGE_SLIDE_DURATION_MS = 260;
const noticePopoverCopy = {
  en: {
    closeLabel: "Close",
    noticeLabel: "Latest content notice",
    showNoticeLabel: (index: number) => `Show notice ${index}`,
  },
  ko: {
    closeLabel: "닫기",
    noticeLabel: "최신 콘텐츠 공지",
    showNoticeLabel: (index: number) => `공지 ${index} 보기`,
  },
  ja: {
    closeLabel: "閉じる",
    noticeLabel: "最新コンテンツのお知らせ",
    showNoticeLabel: (index: number) => `お知らせ ${index} を表示`,
  },
} satisfies Record<Locale, {
  closeLabel: string;
  noticeLabel: string;
  showNoticeLabel: (index: number) => string;
}>;

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function hasHiddenCookie() {
  return document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith(`${NOTICE_COOKIE_NAME}=`));
}

function setHiddenCookie() {
  document.cookie = `${NOTICE_COOKIE_NAME}=1; max-age=${NOTICE_COOKIE_MAX_AGE_SECONDS}; path=/; samesite=lax`;
}

export default function NoticePopover({ items, locale }: NoticePopoverProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isImageSliding, setIsImageSliding] = useState(false);
  const [slideDelta, setSlideDelta] = useState<-1 | 0 | 1>(0);
  const dragStartXRef = useRef<number | null>(null);
  const didDragRef = useRef(false);
  const slideTimerRef = useRef<number | null>(null);

  const getWrappedIndex = useCallback(
    (index: number) => (index + items.length) % items.length,
    [items.length],
  );

  const slideToIndex = useCallback(
    (targetIndex: number, direction: -1 | 1) => {
      if (items.length < 2 || isImageSliding) return;

      const normalizedTargetIndex = getWrappedIndex(targetIndex);

      if (normalizedTargetIndex === activeIndex) return;

      if (slideTimerRef.current) {
        window.clearTimeout(slideTimerRef.current);
      }

      setIsImageSliding(true);
      setSlideDelta(direction);
      setDragOffset(0);

      slideTimerRef.current = window.setTimeout(() => {
        setActiveIndex(normalizedTargetIndex);
        setIsImageSliding(false);
        setSlideDelta(0);
      }, IMAGE_SLIDE_DURATION_MS);
    },
    [activeIndex, getWrappedIndex, isImageSliding, items.length],
  );

  useEffect(() => {
    if (items.length > 0 && !hasHiddenCookie()) {
      setIsVisible(true);
    }
  }, [items.length]);

  useEffect(() => {
    if (!isVisible || items.length < 2 || isDragging || isImageSliding) return;

    const timerId = window.setInterval(() => {
      slideToIndex(activeIndex + 1, 1);
    }, AUTO_ROLLING_INTERVAL_MS);

    return () => window.clearInterval(timerId);
  }, [activeIndex, isDragging, isImageSliding, isVisible, items.length, slideToIndex]);

  useEffect(() => {
    return () => {
      if (slideTimerRef.current) {
        window.clearTimeout(slideTimerRef.current);
      }
    };
  }, []);

  const normalizedActiveIndex = items.length > 0 ? activeIndex % items.length : 0;
  const imageIndexes = useMemo(() => {
    if (items.length < 2) {
      return [normalizedActiveIndex];
    }

    return [
      getWrappedIndex(normalizedActiveIndex - 1),
      normalizedActiveIndex,
      getWrappedIndex(normalizedActiveIndex + 1),
    ];
  }, [getWrappedIndex, items.length, normalizedActiveIndex]);
  const imageTrackBasePercent =
    items.length < 2 ? 0 : (-100 + slideDelta * -100) / imageIndexes.length;

  if (!isVisible || items.length === 0) {
    return null;
  }

  const activeItem = items[normalizedActiveIndex];
  const copy = noticePopoverCopy[locale];

  const goToIndex = (index: number) => {
    const normalizedTargetIndex = getWrappedIndex(index);
    const nextIndex = getWrappedIndex(activeIndex + 1);
    const direction = normalizedTargetIndex === nextIndex ? 1 : -1;

    slideToIndex(normalizedTargetIndex, direction);
  };

  const reboundImage = () => {
    setIsImageSliding(true);
    setDragOffset(0);

    window.setTimeout(() => {
      setIsImageSliding(false);
    }, 180);
  };

  const handleClose = () => {
    setHiddenCookie();
    setIsVisible(false);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (isImageSliding) return;

    dragStartXRef.current = event.clientX;
    didDragRef.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (dragStartXRef.current === null) return;

    const nextOffset = event.clientX - dragStartXRef.current;
    setDragOffset(Math.max(-120, Math.min(120, nextOffset)));

    if (Math.abs(nextOffset) > 6) {
      didDragRef.current = true;
    }
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (dragStartXRef.current === null) return;

    const finalOffset = event.clientX - dragStartXRef.current;
    dragStartXRef.current = null;
    setIsDragging(false);

    if (Math.abs(finalOffset) >= DRAG_THRESHOLD_PX && items.length > 1) {
      event.preventDefault();
      const direction = finalOffset < 0 ? 1 : -1;
      slideToIndex(activeIndex + direction, direction);
    } else {
      reboundImage();
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (didDragRef.current) {
      event.preventDefault();
      didDragRef.current = false;
    }
  };

  return (
    <aside
      aria-label={copy.noticeLabel}
      className="fixed bottom-5 left-1/2 z-[55] w-[300px] max-w-[calc(100vw-40px)] -translate-x-1/2 overflow-hidden rounded-box bg-bg-deep shadow-[0_18px_48px_rgba(var(--color-overlay-rgb)/0.42)] md:bottom-auto md:left-auto md:right-10 md:top-[80%] md:-translate-x-0 md:-translate-y-1/2"
      data-node-id="810:1450"
    >
      <a
        className={cx(
          "block select-none touch-pan-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60",
          isDragging ? "cursor-grabbing" : "cursor-pointer",
        )}
        draggable={false}
        href={activeItem.href}
        onClick={handleClick}
        onDragStart={(event) => event.preventDefault()}
        onPointerCancel={handlePointerEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        rel={activeItem.isExternal ? "noreferrer noopener" : undefined}
        target={activeItem.isExternal ? "_blank" : undefined}
      >
        <div className="aspect-video w-full overflow-hidden bg-bg-content">
          <div
            className="flex h-full"
            style={{
              transform: `translate3d(calc(${imageTrackBasePercent}% + ${dragOffset}px), 0, 0)`,
              transition: isImageSliding ? `transform ${IMAGE_SLIDE_DURATION_MS}ms ease` : "none",
              width: `${imageIndexes.length * 100}%`,
            }}
          >
            {imageIndexes.map((imageIndex) => {
              const imageItem = items[imageIndex];

              return (
                <img
                  alt=""
                  className="block h-full object-cover"
                  decoding="async"
                  draggable={false}
                  key={`${imageItem.href}-${imageIndex}`}
                  loading="lazy"
                  src={imageItem.imageSrc}
                  style={{ width: `${100 / imageIndexes.length}%` }}
                />
              );
            })}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2.5 p-5">
          <div className="flex h-[66px] flex-col gap-1 break-words">
            <p className="m-0 type-body-sm text-mute">{activeItem.category}</p>
            <p className="m-0 h-[44px] line-clamp-2 text-[14px] font-normal leading-[22px] text-fg">
              {activeItem.title}
            </p>
          </div>
        </div>
      </a>

      <div className="flex items-center justify-end gap-2.5 px-5 pb-5">
        <div className="absolute left-1/2 flex h-8 -translate-x-1/2 items-center gap-1.5">
          {items.map((item, index) => (
            <button
              aria-label={copy.showNoticeLabel(index + 1)}
              aria-pressed={index === normalizedActiveIndex}
              className={cx(
                "h-2 rounded-full transition-all",
                index === normalizedActiveIndex ? "w-5 bg-fg" : "w-2 bg-placeholder hover:bg-mute",
              )}
              key={`${item.href}-${index}`}
              onClick={() => goToIndex(index)}
              type="button"
            />
          ))}
        </div>
        <Button
          arrow={false}
          onClick={handleClose}
          size="xsmall"
          style="full"
          type="button"
          variant="secondary"
        >
          {copy.closeLabel}
        </Button>
      </div>
    </aside>
  );
}
