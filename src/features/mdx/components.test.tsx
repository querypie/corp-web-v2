import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildMdxComponents } from "./components";

function getComponents() {
  return buildMdxComponents();
}

describe("buildMdxComponents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ArticleFileImage", () => {
    it("filepath의 'public/' 접두사를 제거한다", () => {
      const { ArticleFileImage } = getComponents() as any;
      const { container } = render(
        <ArticleFileImage filepath="public/blog/thumb.png" alt="test" />,
      );
      const img = container.querySelector("img");
      expect(img?.getAttribute("src")).toBe("/blog/thumb.png");
    });

    it("src prop을 직접 사용한다", () => {
      const { ArticleFileImage } = getComponents() as any;
      const { container } = render(
        <ArticleFileImage src="/direct/path.png" alt="direct" />,
      );
      const img = container.querySelector("img");
      expect(img?.getAttribute("src")).toBe("/direct/path.png");
    });

    it("filepath와 src 모두 없으면 아무것도 렌더링하지 않는다", () => {
      const { ArticleFileImage } = getComponents() as any;
      const { container } = render(<ArticleFileImage alt="no-src" />);
      expect(container.firstChild).toBeNull();
    });

    it("caption prop이 있으면 figcaption을 렌더링한다", () => {
      const { ArticleFileImage } = getComponents() as any;
      render(
        <ArticleFileImage filepath="public/img.png" caption="Image Caption" />,
      );
      expect(screen.getByText("Image Caption")).toBeInTheDocument();
    });

    it("caption prop이 없으면 figcaption을 렌더링하지 않는다", () => {
      const { ArticleFileImage } = getComponents() as any;
      const { container } = render(
        <ArticleFileImage filepath="public/img.png" />,
      );
      expect(container.querySelector("figcaption")).toBeNull();
    });
  });

  describe("ArticleGatingForm", () => {
    it("첫 번째 MDX 렌더링 PR 범위에서는 등록하지 않는다", () => {
      expect("ArticleGatingForm" in getComponents()).toBe(false);
    });
  });

  describe("Box", () => {
    it("center=true이면 flex justify-center 클래스를 적용한다", () => {
      const { Box } = getComponents() as any;
      const { container } = render(
        <Box center={true}>
          <span>Centered</span>
        </Box>,
      );
      expect(container.firstChild).toHaveClass("flex", "justify-center");
    });

    it("center=false이면 클래스를 적용하지 않는다", () => {
      const { Box } = getComponents() as any;
      const { container } = render(
        <Box center={false}>
          <span>Not Centered</span>
        </Box>,
      );
      // className이 undefined면 class 속성 없음
      expect(container.firstChild).not.toHaveClass("flex");
    });

    it("children을 렌더링한다", () => {
      const { Box } = getComponents() as any;
      render(
        <Box>
          <span>Box Child</span>
        </Box>,
      );
      expect(screen.getByText("Box Child")).toBeInTheDocument();
    });
  });

  describe("SplitView", () => {
    it("grid 2-column 클래스를 적용한다", () => {
      const { SplitView } = getComponents() as any;
      const { container } = render(
        <SplitView>
          <div>Left</div>
          <div>Right</div>
        </SplitView>,
      );
      expect(container.firstChild).toHaveClass("grid");
      expect(container.firstChild).toHaveClass("md:grid-cols-2");
    });
  });

  describe("Table", () => {
    it("compound table components를 렌더링한다", () => {
      const { Table } = getComponents() as any;
      const { container } = render(
        <Table center>
          <Table.Thead>
            <Table.Tr>
              <Table.Th cellBackgroundColor="gray">Head</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Cell</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>,
      );

      expect(container.firstChild).toHaveClass("flex", "justify-center");
      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: "Head" })).toHaveClass("bg-bg-deep");
      expect(screen.getByRole("cell", { name: "Cell" })).toBeInTheDocument();
    });
  });

  describe("State", () => {
    it("color=blue이면 파란 배경 클래스를 적용한다", () => {
      const { State } = getComponents() as any;
      const { container } = render(<State color="blue">Active</State>);
      expect(container.firstChild).toHaveClass("bg-blue-100");
    });

    it("color=green이면 초록 배경 클래스를 적용한다", () => {
      const { State } = getComponents() as any;
      const { container } = render(<State color="green">Done</State>);
      expect(container.firstChild).toHaveClass("bg-green-100");
    });

    it("color=red이면 빨간 배경 클래스를 적용한다", () => {
      const { State } = getComponents() as any;
      const { container } = render(<State color="red">Error</State>);
      expect(container.firstChild).toHaveClass("bg-red-100");
    });

    it("color가 없으면 기본 클래스를 적용한다", () => {
      const { State } = getComponents() as any;
      const { container } = render(<State>Default</State>);
      expect(container.firstChild).toHaveClass("bg-fg/10");
    });
  });

  describe("InfoNote", () => {
    it("파란 테두리 callout 클래스를 갖는다", () => {
      const { InfoNote } = getComponents() as any;
      const { container } = render(<InfoNote>Note text</InfoNote>);
      expect(container.firstChild).toHaveClass("border-blue-200");
      expect(container.firstChild).toHaveClass("bg-blue-50");
    });

    it("children을 렌더링한다", () => {
      const { InfoNote } = getComponents() as any;
      render(<InfoNote>Important note</InfoNote>);
      expect(screen.getByText("Important note")).toBeInTheDocument();
    });
  });

  describe("Link", () => {
    it("href 속성을 갖는다", () => {
      const { Link } = getComponents() as any;
      render(<Link href="/some/path">Click here</Link>);
      const anchor = screen.getByRole("link", { name: "Click here" });
      expect(anchor).toHaveAttribute("href", "/some/path");
    });
  });

  describe("InlineLink", () => {
    it("href 속성을 갖는다", () => {
      const { InlineLink } = getComponents() as any;
      render(<InlineLink href="/inline/path">Inline text</InlineLink>);
      const anchor = screen.getByRole("link", { name: "Inline text" });
      expect(anchor).toHaveAttribute("href", "/inline/path");
    });
  });

  describe("heading 컴포넌트 (TOC id 주입)", () => {
    it("h1에 텍스트 기반 id를 주입한다", () => {
      const { h1: H1 } = getComponents() as any;
      const { container } = render(<H1>Hello World</H1>);
      expect(container.querySelector("h1")).toHaveAttribute("id", "hello-world");
    });

    it("h2에 텍스트 기반 id를 주입한다", () => {
      const { h2: H2 } = getComponents() as any;
      const { container } = render(<H2>Section Two</H2>);
      expect(container.querySelector("h2")).toHaveAttribute("id", "section-two");
    });

    it("h3에 텍스트 기반 id를 주입한다", () => {
      const { h3: H3 } = getComponents() as any;
      const { container } = render(<H3>Sub Section</H3>);
      expect(container.querySelector("h3")).toHaveAttribute("id", "sub-section");
    });

    it("특수문자를 제거한 id를 생성한다", () => {
      const { h2: H2 } = getComponents() as any;
      const { container } = render(<H2>Hello, World! (2026)</H2>);
      expect(container.querySelector("h2")).toHaveAttribute("id", "hello-world-2026");
    });

    it("한국어 텍스트를 보존한 id를 생성한다", () => {
      const { h2: H2 } = getComponents() as any;
      const { container } = render(<H2>서버 액션의 내부 동작 방식</H2>);
      expect(container.querySelector("h2")).toHaveAttribute("id", "서버-액션의-내부-동작-방식");
    });

    it("일본어 텍스트를 보존한 id를 생성한다", () => {
      const { h2: H2 } = getComponents() as any;
      const { container } = render(<H2>Server Actionの内部動作方式</H2>);
      expect(container.querySelector("h2")).toHaveAttribute("id", "server-actionの内部動作方式");
    });

    it("중첩된 children에서 텍스트를 추출한다", () => {
      const { h2: H2 } = getComponents() as any;
      const { container } = render(
        <H2>
          <strong>Bold</strong> Heading
        </H2>,
      );
      expect(container.querySelector("h2")).toHaveAttribute("id", "bold-heading");
    });
  });
});
