"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type TooltipProps = {
  children: React.ReactNode;
  className?: string;
  content: string;
  delayMs?: number;
};

export default function Tooltip({
  children,
  className,
  content,
  delayMs = 500,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const timerRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLSpanElement | null>(null);

  function updatePosition() {
    const rect = triggerRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    setPosition({
      left: rect.left + rect.width / 2,
      top: rect.top - 10,
    });
  }

  function clearTooltipTimer() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function openWithDelay() {
    clearTooltipTimer();
    timerRef.current = window.setTimeout(() => {
      updatePosition();
      setIsOpen(true);
      timerRef.current = null;
    }, delayMs);
  }

  function closeTooltip() {
    clearTooltipTimer();
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const syncPosition = () => updatePosition();

    window.addEventListener("scroll", syncPosition, true);
    window.addEventListener("resize", syncPosition);

    return () => {
      window.removeEventListener("scroll", syncPosition, true);
      window.removeEventListener("resize", syncPosition);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      clearTooltipTimer();
    };
  }, []);

  return (
    <span
      ref={triggerRef}
      className={cx("relative inline-flex", className)}
      onBlur={closeTooltip}
      onFocus={openWithDelay}
      onMouseEnter={openWithDelay}
      onMouseLeave={closeTooltip}
    >
      {children}
      {isOpen && position
        ? createPortal(
            <span
              aria-hidden={!isOpen}
              className="pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-full"
              role="tooltip"
              style={{ left: `${position.left}px`, top: `${position.top}px` }}
            >
              <span className="relative block whitespace-pre-line rounded-[6px] border border-border bg-bg-modal px-[10px] py-[6px] text-center type-body-sm text-fg shadow-[0_12px_28px_rgba(var(--color-overlay-rgb)/0.34)]">
                {content}
                <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-border bg-bg-modal" />
              </span>
            </span>,
            document.body,
          )
        : null}
    </span>
  );
}
