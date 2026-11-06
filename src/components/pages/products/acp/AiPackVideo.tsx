"use client";

import { useEffect, useRef } from "react";

type AiPackVideoProps = {
  title: string;
};

export default function AiPackVideo({ title }: AiPackVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let rafId = 0;

    function updatePlayback() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const video = videoRef.current;
        if (!video) return;

        if (document.visibilityState !== "visible") {
          video.pause();
          return;
        }

        const rect = video.getBoundingClientRect();
        const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
        const viewportCenter = window.innerHeight / 2;
        const activationDistance = Math.min(window.innerHeight * 0.34, 280);
        const videoCenter = rect.top + rect.height / 2;
        const shouldPlay = isVisible && Math.abs(videoCenter - viewportCenter) <= activationDistance;

        if (shouldPlay) {
          void video.play();
          return;
        }

        video.pause();
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
      videoRef.current?.pause();
    };
  }, []);

  return (
    <video
      aria-label={title}
      className="block h-auto w-full"
      loop
      muted
      playsInline
      preload="metadata"
      ref={videoRef}
      src="/assets/pages/home/features/Home-ACP.mp4#t=0.001"
    />
  );
}
