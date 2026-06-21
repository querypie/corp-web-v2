"use client";

import { useState } from "react";

type YoutubePreviewPlayerProps = {
  embedSrc: string;
  thumbnailAlt: string;
  thumbnailSrc: string;
  title: string;
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
}: YoutubePreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="aspect-video w-full max-w-[1080px] overflow-hidden rounded-box bg-bg-content">
      {isPlaying ? (
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
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/35 backdrop-blur-xl transition duration-200 group-hover:scale-[1.04] group-hover:bg-black/45 md:h-16 md:w-16">
              <span className="ml-1 h-0 w-0 border-y-[8px] border-l-[14px] border-y-transparent border-l-white md:border-y-[10px] md:border-l-[17px]" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
