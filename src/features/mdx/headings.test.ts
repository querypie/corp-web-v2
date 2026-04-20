import { describe, it, expect } from "vitest";
import { extractHeadingsFromMdx } from "./headings";

describe("extractHeadingsFromMdx", () => {
  describe("기본 헤딩 추출", () => {
    it("H1 단일 헤딩을 추출한다", () => {
      const result = extractHeadingsFromMdx("# Hello World");
      expect(result).toHaveLength(1);
      expect(result[0].text).toBe("Hello World");
      expect(result[0].targetId).toBe("hello-world");
    });

    it("여러 최상위 H1 헤딩을 추출한다", () => {
      const result = extractHeadingsFromMdx("# First\n\n# Second\n\n# Third");
      expect(result).toHaveLength(3);
      expect(result[0].text).toBe("First");
      expect(result[1].text).toBe("Second");
      expect(result[2].text).toBe("Third");
    });

    it("H2 단독으로 시작할 수 있다", () => {
      const result = extractHeadingsFromMdx("## Standalone Section");
      expect(result).toHaveLength(1);
      expect(result[0].text).toBe("Standalone Section");
    });

    it("list 없는 헤딩의 list는 undefined이다", () => {
      const result = extractHeadingsFromMdx("# Solo");
      expect(result[0].list).toBeUndefined();
    });
  });

  describe("중첩 구조", () => {
    it("H2는 H1의 자식으로 중첩된다", () => {
      const source = "# Parent\n\n## Child";
      const result = extractHeadingsFromMdx(source);
      expect(result).toHaveLength(1);
      expect(result[0].list).toHaveLength(1);
      expect(result[0].list![0].text).toBe("Child");
    });

    it("H3는 H2의 자식으로 중첩된다", () => {
      const source = "# Top\n\n## Middle\n\n### Bottom";
      const result = extractHeadingsFromMdx(source);
      expect(result).toHaveLength(1);
      expect(result[0].list).toHaveLength(1);
      expect(result[0].list![0].list).toHaveLength(1);
      expect(result[0].list![0].list![0].text).toBe("Bottom");
    });

    it("같은 레벨 형제 헤딩이 같은 부모 아래 나란히 추가된다", () => {
      const source = "# Parent\n\n## Child One\n\n## Child Two";
      const result = extractHeadingsFromMdx(source);
      expect(result[0].list).toHaveLength(2);
      expect(result[0].list![0].text).toBe("Child One");
      expect(result[0].list![1].text).toBe("Child Two");
    });

    it("H2 다음 H1은 다시 최상위에 추가된다", () => {
      const source = "# First\n\n## Sub\n\n# Second";
      const result = extractHeadingsFromMdx(source);
      expect(result).toHaveLength(2);
      expect(result[0].text).toBe("First");
      expect(result[1].text).toBe("Second");
    });
  });

  describe("코드 블록 무시", () => {
    it("코드 블록 안의 헤딩 라인을 무시한다", () => {
      const source = "# Real Heading\n\n```\n# Fake Heading\n```";
      const result = extractHeadingsFromMdx(source);
      expect(result).toHaveLength(1);
      expect(result[0].text).toBe("Real Heading");
    });

    it("코드 블록 이후 헤딩을 다시 인식한다", () => {
      const source = "```\n# Inside Block\n```\n\n# After Block";
      const result = extractHeadingsFromMdx(source);
      expect(result).toHaveLength(1);
      expect(result[0].text).toBe("After Block");
    });

    it("들여쓰기 있는 코드 블록 마커도 처리한다", () => {
      const source = "# Before\n\n  ```\n# Hidden\n  ```\n\n# After";
      const result = extractHeadingsFromMdx(source);
      expect(result).toHaveLength(2);
      expect(result[0].text).toBe("Before");
      expect(result[1].text).toBe("After");
    });
  });

  describe("마크다운 구문 제거", () => {
    it("볼드(**) 마크다운을 제거하고 텍스트를 유지한다", () => {
      const result = extractHeadingsFromMdx("## **Security** Best Practices");
      // cleanHeadingText removes bold markers, leaving plain text
      expect(result[0].targetId).toContain("best-practices");
    });

    it("링크 마크다운에서 링크 텍스트를 추출한다", () => {
      const result = extractHeadingsFromMdx("## [Link Text](https://example.com)");
      expect(result[0].text).toBe("Link Text");
      expect(result[0].targetId).toBe("link-text");
    });

    it("인라인 HTML 태그를 제거한다", () => {
      const result = extractHeadingsFromMdx("## Title <span>with tag</span>");
      expect(result[0].text).toBe("Title with tag");
    });
  });

  describe("슬러그 생성", () => {
    it("대문자를 소문자로 변환한다", () => {
      const result = extractHeadingsFromMdx("# UPPER CASE");
      expect(result[0].targetId).toBe("upper-case");
    });

    it("공백을 하이픈으로 변환한다", () => {
      const result = extractHeadingsFromMdx("# One Two Three");
      expect(result[0].targetId).toBe("one-two-three");
    });

    it("특수문자를 제거한다", () => {
      const result = extractHeadingsFromMdx("# Hello, World! (2026)");
      expect(result[0].targetId).toBe("hello-world-2026");
    });

    it("앞뒤 공백을 제거한 후 슬러그를 생성한다", () => {
      const result = extractHeadingsFromMdx("#   Padded Title   ");
      expect(result[0].targetId).toBe("padded-title");
    });

    it("한국어 제목을 보존해 슬러그를 생성한다", () => {
      const result = extractHeadingsFromMdx("# 소개 Introduction");
      expect(result[0].targetId).toBe("소개-introduction");
    });

    it("일본어 제목을 보존해 슬러그를 생성한다", () => {
      const result = extractHeadingsFromMdx("# Server Actionの内部動作方式");
      expect(result[0].targetId).toBe("server-actionの内部動作方式");
    });
  });

  describe("엣지 케이스", () => {
    it("빈 입력이면 빈 배열을 반환한다", () => {
      expect(extractHeadingsFromMdx("")).toHaveLength(0);
    });

    it("헤딩이 없는 본문이면 빈 배열을 반환한다", () => {
      const source = "Just some paragraph text.\n\nMore text here.";
      expect(extractHeadingsFromMdx(source)).toHaveLength(0);
    });

    it("헤딩 기호만 있고 텍스트 없으면 빈 targetId를 갖는다", () => {
      const result = extractHeadingsFromMdx("# ");
      // trimmed text is "", slugify("") = ""
      expect(result[0].targetId).toBe("");
    });
  });
});
