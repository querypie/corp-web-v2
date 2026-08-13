import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import YoutubePreviewPlayer from "./YoutubePreviewPlayer";

describe("YoutubePreviewPlayer", () => {
  const play = vi.fn().mockResolvedValue(undefined);
  const pause = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(play);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(pause);
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    play.mockClear();
    pause.mockClear();
  });

  it("화면 중심에 들어오면 자동 재생하고 벗어나면 일시 정지한다", () => {
    render(
      <YoutubePreviewPlayer
        autoplayOnView
        thumbnailAlt="AIP thumbnail"
        thumbnailSrc="/aip-cover.png"
        title="AIP video"
        videoSrc="/aip.mp4"
      />,
    );

    const video = screen.getByLabelText("AIP video") as HTMLVideoElement;
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");

    vi.spyOn(video, "getBoundingClientRect").mockReturnValue({
      bottom: 650,
      height: 450,
      left: 0,
      right: 800,
      top: 200,
      width: 800,
      x: 0,
      y: 200,
      toJSON: () => ({}),
    });

    act(() => window.dispatchEvent(new Event("scroll")));
    expect(play).toHaveBeenCalled();

    vi.mocked(video.getBoundingClientRect).mockReturnValue({
      bottom: -50,
      height: 450,
      left: 0,
      right: 800,
      top: -500,
      width: 800,
      x: 0,
      y: -500,
      toJSON: () => ({}),
    });

    act(() => window.dispatchEvent(new Event("scroll")));
    expect(pause).toHaveBeenCalled();
  });
});
