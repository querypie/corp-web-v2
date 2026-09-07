import { describe, expect, it } from "vitest";
import { normalizeYoutubeEmbedUrl } from "./youtubeUrl";

describe("normalizeYoutubeEmbedUrl", () => {
  it.each([
    ["https://www.youtube.com/watch?v=LaysvhRhZS8", "https://www.youtube-nocookie.com/embed/LaysvhRhZS8"],
    ["http://youtube.com/watch?v=LaysvhRhZS8", "https://www.youtube-nocookie.com/embed/LaysvhRhZS8"],
    ["https://youtu.be/LaysvhRhZS8?si=tracking", "https://www.youtube-nocookie.com/embed/LaysvhRhZS8"],
    ["https://youtube.com/shorts/LaysvhRhZS8", "https://www.youtube-nocookie.com/embed/LaysvhRhZS8"],
    ["https://www.youtube.com/live/LaysvhRhZS8", "https://www.youtube-nocookie.com/embed/LaysvhRhZS8"],
    ["https://www.youtube.com/embed/LaysvhRhZS8?si=tracking", "https://www.youtube-nocookie.com/embed/LaysvhRhZS8"],
  ])("%s를 embed URL로 변환한다", (input, expected) => {
    expect(normalizeYoutubeEmbedUrl(input)).toBe(expected);
  });

  it("재생 시작 시간과 플레이리스트 파라미터를 보존한다", () => {
    expect(normalizeYoutubeEmbedUrl("https://youtu.be/LaysvhRhZS8?t=1m30s&list=PL123&index=2")).toBe(
      "https://www.youtube-nocookie.com/embed/LaysvhRhZS8?start=90&index=2&list=PL123",
    );
  });

  it("YouTube 동영상 URL이 아니면 입력값을 유지한다", () => {
    expect(normalizeYoutubeEmbedUrl("https://example.com/video")).toBe("https://example.com/video");
  });
});
