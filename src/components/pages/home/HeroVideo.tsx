"use client";

import { useEffect, useRef } from "react";

export default function HeroVideo({ src, title }: { src: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let visible = false;
    const updatePlayback = () => {
      if (visible && document.visibilityState === "visible") {
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    });
    observer.observe(video);
    document.addEventListener("visibilitychange", updatePlayback);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      video.pause();
    };
  }, [src]);

  return (
    <video
      aria-label={title}
      className="block h-auto w-full rounded-box"
      loop
      muted
      playsInline
      preload="metadata"
      ref={videoRef}
      src={`${src}#t=0.001`}
    />
  );
}
