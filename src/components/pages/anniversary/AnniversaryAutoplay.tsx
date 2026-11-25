"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import styles from "./anniversary.module.css";

const wheelQuietLimitMs = 120;
const scrollKeys = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);

type Playback = "playing" | "paused" | "ended";
type Labels = { play: string; pause: string; replay: string };

export default function AnniversaryAutoplay({ labels }: { labels: Labels }) {
  const [playback, setPlayback] = useState<Playback>("paused");
  const toggle = useRef<(() => void) | null>(null);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const touch = matchMedia("(pointer: coarse)");
    let mode: Playback = "paused";
    let observedY = window.scrollY;
    let position = observedY;
    let end = 0;
    let settleFrames = 0;
    let lastManualActivity = 0;
    let holdingTouch = false;
    let touchHasScrolled = false;
    let holdingPointer = false;
    let frame = 0;
    let lastFrame = 0;

    function writeScroll(y: number) {
      window.scrollTo({ top: y, behavior: "instant" });
      observedY = window.scrollY;
    }

    function tick(now: number) {
      const elapsed = lastFrame ? Math.min(now - lastFrame, 50) : 0;
      lastFrame = now;
      if (settleFrames > 0) {
        // A wheel animation that no longer moves the page must not block playback.
        const wheelStillMoving = now - lastManualActivity < wheelQuietLimitMs
          && document.documentElement.classList.contains("lenis-smooth");
        if (!wheelStillMoving) settleFrames--;
        frame = requestAnimationFrame(tick);
        return;
      }
      const speed = touch.matches ? 54 : 64;
      position = Math.min(end, position + elapsed * speed / 1000);
      if (position - observedY >= 1 || position === end) writeScroll(position);
      if (position === end) {
        frame = 0;
        setMode("ended");
        return;
      }
      frame = requestAnimationFrame(tick);
    }

    function schedule() {
      cancelAnimationFrame(frame);
      frame = lastFrame = 0;
      if (mode !== "playing" || document.hidden || holdingTouch || holdingPointer) return;
      frame = requestAnimationFrame(tick);
    }

    function setMode(next: Playback) {
      mode = next;
      setPlayback(next);
      schedule();
    }

    function yieldToManualScroll() {
      lastManualActivity = performance.now();
      settleFrames = 2;
      if (mode === "playing") schedule();
    }

    function onScroll() {
      const y = Math.max(0, window.scrollY);
      // Writes made by this component have already been recorded synchronously.
      if (y === observedY) return;
      observedY = position = y;
      if (holdingTouch) touchHasScrolled = true;
      yieldToManualScroll();
      if (mode === "ended" && y < end - 1) setMode("paused");
    }

    function onWheel(event: WheelEvent) {
      // A release outside the page (for example on the browser scrollbar) may never reach us.
      if (event.buttons === 0) holdingPointer = false;
      yieldToManualScroll();
    }

    function onTouch(event: TouchEvent) {
      if (event.type === "touchstart" && !holdingTouch) touchHasScrolled = false;
      holdingTouch = event.touches.length > 0;
      yieldToManualScroll();
    }

    function onTouchScrollEnd() {
      if (!touchHasScrolled) return;
      touchHasScrolled = holdingTouch = false;
      settleFrames = 0;
      if (mode === "playing") schedule();
    }

    function onPointer(event: PointerEvent) {
      if (event.pointerType === "touch" || !event.isPrimary) return;
      holdingPointer = event.type === "pointerdown";
      yieldToManualScroll();
    }

    function onKey(event: KeyboardEvent) {
      if (scrollKeys.has(event.key)) yieldToManualScroll();
    }

    function onVisibility() {
      holdingPointer = holdingTouch = touchHasScrolled = false;
      schedule();
    }

    function onMotionChange() {
      if (motion.matches) setMode("paused");
    }

    function measure() {
      end = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }

    toggle.current = () => {
      if (mode === "playing") {
        setMode("paused");
        return;
      }
      if (mode === "ended") writeScroll(0);
      position = observedY = window.scrollY;
      settleFrames = 0;
      setMode("playing");
    };

    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    measure();
    const listeners = new AbortController();
    const passive = { signal: listeners.signal, passive: true };
    const captureGesture = { ...passive, capture: true };
    window.addEventListener("scroll", onScroll, passive);
    window.addEventListener("wheel", onWheel, captureGesture);
    window.addEventListener("touchstart", onTouch, captureGesture);
    window.addEventListener("touchend", onTouch, captureGesture);
    window.addEventListener("touchcancel", onTouch, captureGesture);
    window.addEventListener("pointerdown", onPointer, passive);
    window.addEventListener("pointerup", onPointer, passive);
    window.addEventListener("pointercancel", onPointer, passive);
    window.addEventListener("keydown", onKey, passive);
    window.addEventListener("resize", measure, passive);
    window.addEventListener("blur", onVisibility, passive);
    document.addEventListener("scrollend", onTouchScrollEnd, passive);
    document.addEventListener("visibilitychange", onVisibility, passive);
    motion.addEventListener("change", onMotionChange, passive);

    return () => {
      listeners.abort();
      observer.disconnect();
      cancelAnimationFrame(frame);
      toggle.current = null;
    };
  }, []);

  const Icon = playback === "playing" ? Pause : playback === "ended" ? RotateCcw : Play;
  const label = playback === "playing" ? labels.pause : playback === "ended" ? labels.replay : labels.play;
  return (
    <Button
      aria-label={label}
      title={label}
      data-playing={playback === "playing" || undefined}
      arrow={false}
      style="full"
      size="large"
      className={styles.autoplayButton}
      onClick={() => toggle.current?.()}
    >
      <Icon size={18} fill={playback === "ended" ? "none" : "currentColor"} aria-hidden="true" />
    </Button>
  );
}
