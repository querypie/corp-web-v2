"use client";

import { useEffect, useRef, useState } from "react";
import MediaPlayButton from "@/components/ui/MediaPlayButton";

type YoutubePreviewPlayerProps = {
  autoplayOnView?: boolean;
  cropEdges?: boolean;
  embedSrc?: string;
  framed?: boolean;
  thumbnailAlt: string;
  thumbnailSrc: string;
  title: string;
  videoSrc?: string;
};

function withPlaybackParams(src: string) {
  const url = new URL(src);
  url.searchParams.set("autoplay", "1");
  url.searchParams.set("controls", "1");
  url.searchParams.set("iv_load_policy", "3");
  url.searchParams.set("modestbranding", "1");
  url.searchParams.set("playsinline", "1");
  url.searchParams.set("rel", "0");
  return url.toString();
}

export default function YoutubePreviewPlayer({
  autoplayOnView = false,
  cropEdges = false,
  embedSrc,
  framed = false,
  thumbnailAlt,
  thumbnailSrc,
  title,
  videoSrc,
}: YoutubePreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoClassName = `block h-full w-full bg-black object-cover ${cropEdges ? "scale-[1.01]" : ""}`;

  useEffect(() => {
    if (!autoplayOnView || !videoSrc) return;

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
        const viewportCenter = window.innerHeight / 2;
        const videoCenter = rect.top + rect.height / 2;
        const activationDistance = Math.min(window.innerHeight * 0.48, 420);
        const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
        const isFocused = Math.abs(videoCenter - viewportCenter) <= activationDistance;

        if (isVisible && isFocused) {
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
  }, [autoplayOnView, videoSrc]);

  return (
    <div className={`aspect-video w-full max-w-[1080px] overflow-hidden rounded-box bg-bg-content ${framed ? "feature-gif-frame" : ""}`}>
      {autoplayOnView && videoSrc ? (
        <video
          aria-label={title}
          className={videoClassName}
          controls
          loop
          muted
          playsInline
          poster={thumbnailSrc}
          preload="metadata"
          ref={videoRef}
          src={`${videoSrc}#t=0.001`}
        />
      ) : isPlaying && videoSrc ? (
        <video
          autoPlay
          className={videoClassName}
          controls
          playsInline
          poster={thumbnailSrc}
          src={videoSrc}
          title={title}
        />
      ) : isPlaying && embedSrc ? (
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="block h-full w-full"
          referrerPolicy="strict-origin-when-cross-origin"
          src={withPlaybackParams(embedSrc)}
          title={title}
        />
      ) : (
        <button
          aria-label={`Play ${title}`}
          className="group relative block h-full w-full overflow-hidden bg-bg-content text-fg"
          onClick={() => setIsPlaying(true)}
          type="button"
        >
          <img
            alt={thumbnailAlt}
            className="block h-full w-full object-cover"
            height={1152}
            src={thumbnailSrc}
            width={2048}
          />
          <MediaPlayButton />
        </button>
      )}
    </div>
  );
}
