import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildMdxComponents, type MdxComponentContext } from "./components";
import { getContactPageCopy } from "@/features/contact/copy";

// ArticleGatingFormOverlay는 useRouter를 사용하므로 mock 처리
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

// ContentLeadForm은 복잡한 렌더링 없이 mock 처리
vi.mock("@/components/pages/documentation/ContentLeadForm", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="content-lead-form">{title}</div>
  ),
}));

const baseCtx: MdxComponentContext = {
  locale: "en",
  isUnlocked: false,
  unlockCookieName: "querypie_content_unlocked_20",
  title: "Test Article",
  contactCopy: getContactPageCopy("en"),
};

function getComponents(overrides?: Partial<MdxComponentContext>) {
  return buildMdxComponents({ ...baseCtx, ...overrides });
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

    it("filepath와 src 모두 없으면 실제 이미지 경로가 없다", () => {
      const { ArticleFileImage } = getComponents() as any;
      const { container } = render(<ArticleFileImage alt="no-src" />);
      const img = container.querySelector("img");
      // src=""는 happy-dom에서 null로 반환될 수 있음
      expect(img?.getAttribute("src") ?? "").toBe("");
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
    it("isUnlocked=true이면 children을 렌더링한다", () => {
      const { ArticleGatingForm } = getComponents({ isUnlocked: true }) as any;
      render(
        <ArticleGatingForm>
          <p>Gated Content</p>
        </ArticleGatingForm>,
      );
      expect(screen.getByText("Gated Content")).toBeInTheDocument();
    });

    it("isUnlocked=false이면 ContentLeadForm(overlay)을 렌더링한다", () => {
      const { ArticleGatingForm } = getComponents({ isUnlocked: false }) as any;
      render(<ArticleGatingForm />);
      expect(screen.getByTestId("content-lead-form")).toBeInTheDocument();
    });

    it("isUnlocked=false이면 title을 overlay에 전달한다", () => {
      const { ArticleGatingForm } = getComponents({
        isUnlocked: false,
        title: "Special Article",
      }) as any;
      render(<ArticleGatingForm />);
      expect(screen.getByText("Special Article")).toBeInTheDocument();
    });

    it("isUnlocked=false이면 gated children을 노출하지 않는다", () => {
      const { ArticleGatingForm } = getComponents({ isUnlocked: false }) as any;
      render(
        <ArticleGatingForm>
          <p>Secret Content</p>
        </ArticleGatingForm>,
      );
      expect(screen.queryByText("Secret Content")).not.toBeInTheDocument();
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
