import { describe, expect, it } from "vitest";
import { renderTiptapHtml } from "./tiptapHtml";

describe("renderTiptapHtml", () => {
  it("YouTube 일반 URL을 iframe용 embed URL로 렌더링한다", () => {
    const value = JSON.stringify({
      content: [
        {
          attrs: { src: "https://www.youtube.com/watch?v=LaysvhRhZS8" },
          type: "youtube",
        },
      ],
      type: "doc",
    });

    const html = renderTiptapHtml(value);

    expect(html).toContain('src="https://www.youtube-nocookie.com/embed/LaysvhRhZS8');
    expect(html).not.toContain("youtube.com/watch");
  });
});
