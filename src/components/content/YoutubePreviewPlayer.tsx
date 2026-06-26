"use client";

import { useState } from "react";
import MediaPlayButton from "@/components/ui/MediaPlayButton";

type YoutubePreviewPlayerProps = {
  embedSrc?: string;
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
  embedSrc,
  thumbnailAlt,
  thumbnailSrc,
  title,
  videoSrc,
}: YoutubePreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="aspect-video w-full max-w-[1080px] overflow-hidden rounded-box bg-bg-content">
      {isPlaying && videoSrc ? (
        <video
          autoPlay
          className="block h-full w-full bg-black object-cover"
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
