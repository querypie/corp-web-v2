import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import FeatureMediaList from "./FeatureMediaList";
import FeatureVideoPlayback from "./FeatureVideoPlayback";

describe("FeatureVideoPlayback", () => {
  let frame: FrameRequestCallback;
  let firstTop: number;
  let secondTop: number;
  const play = vi.fn().mockResolvedValue(undefined);
  const pause = vi.fn();

  beforeEach(() => {
    firstTop = 300;
    secondTop = 600;
    vi.stubGlobal("innerHeight", 1000);
    vi.stubGlobal("requestAnimationFrame", vi.fn(callback => { frame = callback; return 1; }));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(play);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(pause);
    vi.spyOn(HTMLVideoElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLVideoElement) {
      const top = this.getAttribute("aria-label") === "first" ? firstTop : secondTop;
      return { top, bottom: top + 200, height: 200 } as DOMRect;
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  function renderVideos() {
    return render(<FeatureVideoPlayback className="features"><video aria-label="first" /><video aria-label="second" /></FeatureVideoPlayback>);
  }

  it("화면 중앙에 가장 가까운 영상만 재생하고 스크롤하면 대상을 바꾼다", () => {
    renderVideos();
    act(() => frame(0));
    expect(play.mock.instances).toEqual([screen.getByLabelText("first")]);
    expect(pause.mock.instances).toEqual([screen.getByLabelText("second")]);

    play.mockClear();
    pause.mockClear();
    firstTop = -300;
    secondTop = 400;
    fireEvent.scroll(window);
    act(() => frame(0));
    expect(play.mock.instances).toEqual([screen.getByLabelText("second")]);
    expect(pause.mock.instances).toEqual([screen.getByLabelText("first")]);
  });

  it("탭이 숨겨지거나 섹션이 제거되면 모든 영상을 정지한다", () => {
    const view = renderVideos();
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    fireEvent(document, new Event("visibilitychange"));
    act(() => frame(0));
    expect(play).not.toHaveBeenCalled();
    expect(pause).toHaveBeenCalledTimes(2);
    view.unmount();
    expect(pause).toHaveBeenCalledTimes(4);
  });

  it("영상이 없는 기능 목록은 재생 제어를 시작하지 않는다", () => {
    render(<FeatureMediaList items={[{ title: ["Feature"], body: ["Description"], imageSrc: "/feature.webp", imageAlt: "Feature preview" }]} />);
    expect(screen.getByRole("img", { name: "Feature preview" })).toBeInTheDocument();
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });
});
