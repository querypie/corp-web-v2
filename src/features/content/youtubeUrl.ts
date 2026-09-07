const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

function parseStartTime(value: string | null) {
  if (!value) {
    return null;
  }

  if (/^\d+$/.test(value)) {
    return value;
  }

  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);

  if (!match) {
    return null;
  }

  const seconds = Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
  return seconds > 0 ? String(seconds) : null;
}

export function normalizeYoutubeEmbedUrl(value: string) {
  const trimmedValue = value.trim();

  try {
    const url = new URL(trimmedValue);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "").replace(/^m\./, "");
    let videoId = "";

    if (hostname === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (hostname === "youtube.com" || hostname === "youtube-nocookie.com") {
      const [pathType, pathId] = url.pathname.split("/").filter(Boolean);

      if (pathType === "watch") {
        videoId = url.searchParams.get("v") ?? "";
      } else if (["embed", "live", "shorts"].includes(pathType)) {
        videoId = pathId ?? "";
      }
    }

    if (!videoId || !YOUTUBE_VIDEO_ID_PATTERN.test(videoId)) {
      return trimmedValue;
    }

    const embedUrl = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
    const start = parseStartTime(url.searchParams.get("start") ?? url.searchParams.get("t"));

    if (start) {
      embedUrl.searchParams.set("start", start);
    }

    for (const key of ["end", "index", "list"] as const) {
      const parameter = url.searchParams.get(key);

      if (parameter) {
        embedUrl.searchParams.set(key, parameter);
      }
    }

    return embedUrl.toString();
  } catch {
    return trimmedValue;
  }
}
