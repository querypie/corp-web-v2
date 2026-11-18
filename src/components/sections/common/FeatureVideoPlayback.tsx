"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = { children: ReactNode; className: string };

export default function FeatureVideoPlayback({ children, className }: Props) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const videos = Array.from(containerRef.current?.querySelectorAll("video") ?? []);
    let rafId = 0;

    function updatePlayback() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (document.visibilityState !== "visible") {
          videos.forEach(video => video.pause());
          return;
        }

        const viewportCenter = window.innerHeight / 2;
        const activationDistance = Math.min(window.innerHeight * 0.48, 420);
        let activeVideo: HTMLVideoElement | undefined;
        let closestDistance = Number.POSITIVE_INFINITY;

        videos.forEach(video => {
          const rect = video.getBoundingClientRect();
          if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
          const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
          if (distance <= activationDistance && distance < closestDistance) {
            activeVideo = video;
            closestDistance = distance;
          }
        });

        videos.forEach(video => {
          if (video === activeVideo) void video.play()?.catch(() => {});
          else video.pause();
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
      videos.forEach(video => video.pause());
    };
  }, [children]);

  return <section className={className} ref={containerRef}>{children}</section>;
}
