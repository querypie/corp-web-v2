# MDX 렌더링 시스템 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Blog/Whitepaper MDX 파일을 `/[locale]/features/documentation/blog/[slug]` 및 `/[locale]/features/documentation/white-paper/[slug]` 라우트에서 SSR 방식으로 렌더링한다.

**Architecture:** `next-mdx-remote-client/rsc`의 `evaluate()`로 MDX를 서버에서 컴파일·렌더링한다. MDX 파일은 `src/content/mdx/{category}/{slug}/{locale}.mdx`에 저장하며, 기존 Tiptap 라우트(`/features/documentation/[slug]`)는 변경하지 않는다. HTML 요소 스타일은 기존 `CONTENT_PREVIEW_RICH_CLASS`를 래퍼에 그대로 적용하고, 커스텀 컴포넌트는 실제 사용 목록(10개)만 Tailwind로 새로 구현한다.

**Tech Stack:** `next-mdx-remote-client@^2`, `remark-gfm@^4`, Next.js 15 App Router, Tailwind CSS 3.4, Vitest

---

## 파일 목록

| 상태 | 경로 | 역할 |
|------|------|------|
| 신규 | `src/features/mdx/types.ts` | MdxFrontmatter 타입, MdxHeading 타입 |
| 신규 | `src/features/mdx/loader.ts` | fs.readFile + locale fallback |
| 신규 | `src/features/mdx/loader.test.ts` | loader 단위 테스트 |
| 신규 | `src/features/mdx/headings.ts` | MDX 소스에서 목차 추출 |
| 신규 | `src/features/mdx/components.tsx` | buildMdxComponents() 팩토리 |
| 신규 | `src/features/mdx/renderer.ts` | evaluate() 래퍼 |
| 신규 | `src/features/mdx/renderer.test.ts` | renderer 통합 테스트 |
| 신규 | `src/components/mdx-layout/ArticleGatingFormOverlay.tsx` | 게이팅 폼 Client Component |
| 신규 | `src/components/mdx-layout/ArticleLayout.tsx` | Blog/WP 공통 레이아웃 |
| 신규 | `src/components/mdx-layout/ArticleToc.tsx` | 목차 사이드바 Client Component |
| 신규 | `src/content/mdx/blog/nextjs-server-action-security/en.mdx` | 테스트용 샘플 블로그 |
| 신규 | `src/content/mdx/white-paper/personal-data-identification-analysis-ai/en.mdx` | 테스트용 샘플 WP |
| 신규 | `src/app/[locale]/features/documentation/blog/[slug]/page.tsx` | Blog MDX 라우트 |
| 신규 | `src/app/[locale]/features/documentation/white-paper/[slug]/page.tsx` | Whitepaper MDX 라우트 |
| 수정 | `package.json` | 의존성 추가 |

---

## Task 1: 의존성 설치

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 패키지 설치**

```bash
npm install next-mdx-remote-client remark-gfm
```

Expected output: `package.json`의 `dependencies`에 `next-mdx-remote-client`와 `remark-gfm` 추가.

- [ ] **Step 2: 설치 확인**

```bash
node -e "require('next-mdx-remote-client'); console.log('ok')"
```

Expected output: `ok`

- [ ] **Step 3: 커밋**

```bash
git add package.json package-lock.json
git commit -m "chore: add next-mdx-remote-client and remark-gfm"
```

---

## Task 2: 타입 정의 + MDX 로더

**Files:**
- Create: `src/features/mdx/types.ts`
- Create: `src/features/mdx/loader.ts`
- Create: `src/features/mdx/loader.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/features/mdx/loader.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { promises as fs } from "fs";

vi.mock("fs", () => ({
  promises: {
    readFile: vi.fn(),
  },
}));

describe("loadMdxSource", () => {
  beforeEach(() => vi.clearAllMocks());

  it("locale 파일이 있으면 해당 파일 내용을 반환한다", async () => {
    vi.mocked(fs.readFile).mockResolvedValueOnce("# Hello" as any);
    const { loadMdxSource } = await import("./loader");
    const result = await loadMdxSource("blog", "my-post", "ko");
    expect(result).toBe("# Hello");
  });

  it("locale 파일이 없으면 en으로 폴백한다", async () => {
    vi.mocked(fs.readFile)
      .mockRejectedValueOnce(new Error("ENOENT"))
      .mockResolvedValueOnce("# English" as any);
    const { loadMdxSource } = await import("./loader");
    const result = await loadMdxSource("blog", "my-post", "ja");
    expect(result).toBe("# English");
  });

  it("en 파일도 없으면 null을 반환한다", async () => {
    vi.mocked(fs.readFile).mockRejectedValue(new Error("ENOENT"));
    const { loadMdxSource } = await import("./loader");
    const result = await loadMdxSource("blog", "missing-slug", "en");
    expect(result).toBeNull();
  });
});
```

- [ ] **Step 2: 테스트가 실패하는 것 확인**

```bash
npx vitest run src/features/mdx/loader.test.ts
```

Expected: `FAIL` — `loadMdxSource` not found

- [ ] **Step 3: 타입 파일 생성**

`src/features/mdx/types.ts`:
```ts
export type MdxCategory = "blog" | "white-paper";

export type MdxFrontmatter = {
  layout: "Article";
  category: string;
  title: string;
  description?: string;
  date: string;
  author?: string;
  ogImage?: string;
  keywords?: string[];
  relatedPosts?: string[];
  hideHeroImage?: boolean;
  hideTableOfContents?: boolean;
};

export type MdxHeading = {
  targetId: string;
  text: string;
  list?: MdxHeading[];
};
```

- [ ] **Step 4: 로더 구현**

`src/features/mdx/loader.ts`:
```ts
import path from "path";
import { promises as fs } from "fs";
import type { Locale } from "@/constants/i18n";
import type { MdxCategory } from "./types";

const MDX_ROOT = path.join(process.cwd(), "src", "content", "mdx");

export async function loadMdxSource(
  category: MdxCategory,
  slug: string,
  locale: Locale,
): Promise<string | null> {
  const primaryPath = path.join(MDX_ROOT, category, slug, `${locale}.mdx`);
  try {
    return await fs.readFile(primaryPath, "utf-8");
  } catch {
    if (locale === "en") return null;
    const fallbackPath = path.join(MDX_ROOT, category, slug, "en.mdx");
    return fs.readFile(fallbackPath, "utf-8").catch(() => null);
  }
}
```

- [ ] **Step 5: 테스트 통과 확인**

```bash
npx vitest run src/features/mdx/loader.test.ts
```

Expected: `PASS` — 3 tests

- [ ] **Step 6: 커밋**

```bash
git add src/features/mdx/types.ts src/features/mdx/loader.ts src/features/mdx/loader.test.ts
git commit -m "feat(mdx): add frontmatter types and MDX file loader"
```

---

## Task 3: MDX 헤딩 추출기

**Files:**
- Create: `src/features/mdx/headings.ts`

> TOC 생성에 사용한다. corp-web-app의 `extractHeadingFromMdx` 로직을 이식한다.

- [ ] **Step 1: 헤딩 추출 유틸 작성**

`src/features/mdx/headings.ts`:
```ts
import type { MdxHeading } from "./types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function cleanHeadingText(text: string): string {
  return text
    .replace(/^(#+)\s+|(\*\*|__|\*|_|`|~{1,2})(.*?)\1/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();
}

export function extractHeadingsFromMdx(mdxSource: string): MdxHeading[] {
  const result: MdxHeading[] = [];
  const stack: { level: number; heading: MdxHeading }[] = [];
  const headingRegex = /^(#{1,6})\s+(.*)$/;
  const codeBlockRegex = /^```/;
  let inCodeBlock = false;

  for (const line of mdxSource.split("\n")) {
    if (codeBlockRegex.test(line.trim())) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = headingRegex.exec(line);
    if (!match) continue;

    const level = match[1].length;
    const raw = match[2].trim();
    const text = cleanHeadingText(raw);
    const heading: MdxHeading = { targetId: slugify(text), text };

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      result.push(heading);
    } else {
      const parent = stack[stack.length - 1].heading;
      parent.list = parent.list ?? [];
      parent.list.push(heading);
    }
    stack.push({ level, heading });
  }

  return result;
}
```

- [ ] **Step 2: 동작 확인 (빠른 스모크 테스트)**

```bash
node -e "
const { extractHeadingsFromMdx } = require('./src/features/mdx/headings.ts');
" 2>&1 | head -5
```

> TypeScript 파일이므로 직접 실행 불가. 다음 Task에서 renderer 테스트로 간접 검증한다.

- [ ] **Step 3: 커밋**

```bash
git add src/features/mdx/headings.ts
git commit -m "feat(mdx): add heading extractor for TOC generation"
```

---

## Task 4: MDX 컴포넌트 레지스트리

**Files:**
- Create: `src/features/mdx/components.tsx`

Blog/Whitepaper MDX에서 실제 사용되는 컴포넌트만 구현한다. HTML 요소(`h1`~`h6`, `p`, `table` 등)는 오버라이드하지 않는다 — `ArticleLayout`에서 `CONTENT_PREVIEW_RICH_CLASS` 래퍼로 스타일링한다.

- [ ] **Step 1: 컴포넌트 레지스트리 작성**

`src/features/mdx/components.tsx`:
```tsx
import type { MDXComponents } from "mdx/types";
import type { Locale } from "@/constants/i18n";
import type { ContactPageCopy } from "@/features/contact/copy";
import ArticleGatingFormOverlay from "@/components/mdx-layout/ArticleGatingFormOverlay";

export type MdxComponentContext = {
  locale: Locale;
  isUnlocked: boolean;
  unlockCookieName: string;
  title: string;
  contactCopy: ContactPageCopy;
};

export function buildMdxComponents(ctx: MdxComponentContext): MDXComponents {
  return {
    // ── 레이아웃 ──────────────────────────────────────────────
    Box: ({ center, children }: { center?: boolean; children?: React.ReactNode }) => (
      <div className={center ? "flex justify-center" : undefined}>{children}</div>
    ),

    SplitView: ({ children }: { children?: React.ReactNode }) => (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{children}</div>
    ),

    // ── 미디어 ───────────────────────────────────────────────
    ArticleFileImage: ({
      filepath,
      src,
      alt,
      caption,
    }: {
      filepath?: string;
      src?: string;
      alt?: string;
      caption?: string;
    }) => {
      // filepath="public/blog/foo.png" → "/blog/foo.png"
      const resolvedSrc = (filepath ?? src ?? "").replace(/^public\//, "/");
      return (
        <figure className="mx-auto my-0 flex max-w-full flex-col gap-3">
          <img
            src={resolvedSrc}
            alt={alt ?? ""}
            className="mx-auto block h-auto max-w-full rounded-box bg-bg-content"
          />
          {caption && (
            <figcaption className="m-0 text-center type-content-caption text-[var(--color-content-image-caption-fg)]">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    },

    Youtube: ({ src, title: videoTitle }: { src?: string; title?: string }) => (
      <div className="aspect-video w-full overflow-hidden rounded-box">
        <iframe
          src={src}
          title={videoTitle ?? "YouTube video"}
          className="h-full w-full border-0"
          allowFullScreen
        />
      </div>
    ),

    // ── UI 요소 ──────────────────────────────────────────────
    State: ({
      children,
      color,
    }: {
      children?: React.ReactNode;
      color?: string;
    }) => (
      <span
        className={[
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
          color === "blue"
            ? "bg-blue-100 text-blue-700"
            : color === "green"
            ? "bg-green-100 text-green-700"
            : color === "red"
            ? "bg-red-100 text-red-700"
            : "bg-fg/10 text-fg",
        ].join(" ")}
      >
        {children}
      </span>
    ),

    InfoNote: ({ children }: { children?: React.ReactNode }) => (
      <div className="rounded-box border border-blue-200 bg-blue-50 p-4 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
        {children}
      </div>
    ),

    Link: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
      <a
        href={href}
        className="text-brand underline underline-offset-4 transition-colors hover:text-fg"
      >
        {children}
      </a>
    ),

    ButtonLink: ({
      href,
      children,
    }: {
      href?: string;
      children?: React.ReactNode;
    }) => (
      <a
        href={href}
        className="inline-flex items-center rounded-button bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        {children}
      </a>
    ),

    // ── 게이팅 ───────────────────────────────────────────────
    ArticleGatingForm: ({ children }: { children?: React.ReactNode }) => {
      if (ctx.isUnlocked) return <>{children}</>;
      return (
        <ArticleGatingFormOverlay
          contactCopy={ctx.contactCopy}
          locale={ctx.locale}
          title={ctx.title}
          unlockCookieName={ctx.unlockCookieName}
        />
      );
    },
  };
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/features/mdx/components.tsx
git commit -m "feat(mdx): add MDX component registry with Tailwind implementations"
```

---

## Task 5: MDX 렌더러

**Files:**
- Create: `src/features/mdx/renderer.ts`
- Create: `src/features/mdx/renderer.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/features/mdx/renderer.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { renderMdx } from "./renderer";

const SAMPLE_MDX = `---
layout: "Article"
category: "blog"
title: "Test Article"
date: "2026-01-01"
---

# Hello World

This is a paragraph.

## Section Two

More content here.
`;

describe("renderMdx", () => {
  it("frontmatter를 올바르게 파싱한다", async () => {
    const { frontmatter } = await renderMdx(SAMPLE_MDX, {});
    expect(frontmatter.title).toBe("Test Article");
    expect(frontmatter.layout).toBe("Article");
    expect(frontmatter.date).toBe("2026-01-01");
  });

  it("content를 반환한다", async () => {
    const { content } = await renderMdx(SAMPLE_MDX, {});
    expect(content).toBeDefined();
  });
});
```

- [ ] **Step 2: 테스트가 실패하는 것 확인**

```bash
npx vitest run src/features/mdx/renderer.test.ts
```

Expected: `FAIL` — `renderMdx` not found

- [ ] **Step 3: 렌더러 구현**

`src/features/mdx/renderer.ts`:
```ts
import { evaluate } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import type { MDXComponents } from "mdx/types";
import type { MdxFrontmatter } from "./types";

export async function renderMdx(source: string, components: MDXComponents) {
  return evaluate<MdxFrontmatter>({
    source,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
  });
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npx vitest run src/features/mdx/renderer.test.ts
```

Expected: `PASS` — 2 tests

- [ ] **Step 5: 커밋**

```bash
git add src/features/mdx/renderer.ts src/features/mdx/renderer.test.ts
git commit -m "feat(mdx): add renderMdx helper wrapping next-mdx-remote-client evaluate()"
```

---

## Task 6: ArticleGatingFormOverlay (Client Component)

**Files:**
- Create: `src/components/mdx-layout/ArticleGatingFormOverlay.tsx`

- [ ] **Step 1: 컴포넌트 작성**

`src/components/mdx-layout/ArticleGatingFormOverlay.tsx`:
```tsx
"use client";

import { useRouter } from "next/navigation";
import ContentLeadForm from "@/components/pages/documentation/ContentLeadForm";
import type { ContactPageCopy } from "@/features/contact/copy";
import type { Locale } from "@/constants/i18n";

type Props = {
  contactCopy: ContactPageCopy;
  locale: Locale;
  title: string;
  unlockCookieName: string;
};

export default function ArticleGatingFormOverlay({
  contactCopy,
  locale,
  title,
  unlockCookieName,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-center gap-6 border-t border-border py-12">
      <ContentLeadForm
        contactCopy={contactCopy}
        locale={locale}
        mode="unlock"
        onSuccess={() => router.refresh()}
        title={title}
        unlockCookieName={unlockCookieName}
      />
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/mdx-layout/ArticleGatingFormOverlay.tsx
git commit -m "feat(mdx): add ArticleGatingFormOverlay client component for content gating"
```

---

## Task 7: ArticleLayout + ArticleToc

**Files:**
- Create: `src/components/mdx-layout/ArticleToc.tsx`
- Create: `src/components/mdx-layout/ArticleLayout.tsx`

- [ ] **Step 1: 목차 사이드바 작성 (Client Component)**

`src/components/mdx-layout/ArticleToc.tsx`:
```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { MdxHeading } from "@/features/mdx/types";

type Props = {
  headings: MdxHeading[];
  locale: "en" | "ko" | "ja";
};

const ON_THIS_PAGE_LABEL = {
  en: "On This Page",
  ko: "목차",
  ja: "目次",
};

export default function ArticleToc({ headings, locale }: Props) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const ids = headings.flatMap((h) => [
      h.targetId,
      ...(h.list?.map((sub) => sub.targetId) ?? []),
    ]);

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "0px 0px -60% 0px" },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-mute-fg">
        {ON_THIS_PAGE_LABEL[locale]}
      </p>
      <ul className="flex flex-col gap-1">
        {headings.map((heading) => (
          <li key={heading.targetId}>
            <a
              href={`#${heading.targetId}`}
              className={[
                "block text-sm transition-colors",
                activeId === heading.targetId
                  ? "font-medium text-fg"
                  : "text-mute-fg hover:text-fg",
              ].join(" ")}
            >
              {heading.text}
            </a>
            {heading.list && heading.list.length > 0 && (
              <ul className="ml-3 mt-1 flex flex-col gap-1">
                {heading.list.map((sub) => (
                  <li key={sub.targetId}>
                    <a
                      href={`#${sub.targetId}`}
                      className={[
                        "block text-sm transition-colors",
                        activeId === sub.targetId
                          ? "font-medium text-fg"
                          : "text-mute-fg hover:text-fg",
                      ].join(" ")}
                    >
                      {sub.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: ArticleLayout 작성**

`src/components/mdx-layout/ArticleLayout.tsx`:
```tsx
import type { ReactNode } from "react";
import type { Locale } from "@/constants/i18n";
import type { MdxFrontmatter, MdxHeading } from "@/features/mdx/types";
import { CONTENT_PREVIEW_RICH_CLASS } from "@/features/content/previewStyles";
import ArticleToc from "./ArticleToc";

type Props = {
  children: ReactNode;
  frontmatter: MdxFrontmatter;
  headings: MdxHeading[];
  locale: Locale;
};

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

export default function ArticleLayout({ children, frontmatter, headings, locale }: Props) {
  const heroImageSrc = frontmatter.ogImage
    ? frontmatter.ogImage.replace(/^public\//, "/")
    : "";
  const showHero = Boolean(heroImageSrc) && !frontmatter.hideHeroImage;
  const showToc = !frontmatter.hideTableOfContents && headings.length > 0;

  return (
    <div className="flex w-full justify-center px-5 pb-10 md:px-10">
      <article className="flex w-full max-w-[1200px] flex-col gap-[120px]">
        <div className="flex w-full flex-col gap-6 md:grid md:grid-cols-[1fr_minmax(0,680px)_1fr] md:gap-x-5 md:gap-y-0">
          {/* 왼쪽 여백 (사이드바 없음) */}
          <div />

          {/* 본문 영역 */}
          <div className="flex w-full max-w-[680px] flex-col gap-14 md:justify-self-center md:gap-20">
            {/* 헤더: 제목·날짜·저자 */}
            <div className="flex flex-col gap-[10px]">
              <h1 className="m-0 type-h1 leading-[42px] text-fg">{frontmatter.title}</h1>
              {frontmatter.author && (
                <div className="type-body-md text-fg">{frontmatter.author}</div>
              )}
              {frontmatter.date && (
                <p className="m-0 type-body-md text-mute-fg">
                  {formatDate(frontmatter.date, locale)}
                </p>
              )}
            </div>

            {/* 히어로 이미지 */}
            {showHero && (
              <div className="w-full overflow-hidden rounded-box bg-bg-content">
                <img
                  src={heroImageSrc}
                  alt={frontmatter.title}
                  className="block h-auto w-full"
                />
              </div>
            )}

            {/* MDX 본문 */}
            <div className={CONTENT_PREVIEW_RICH_CLASS}>{children}</div>
          </div>

          {/* 오른쪽 사이드바: TOC */}
          {showToc && (
            <div className="hidden md:block">
              <div className="sticky top-[160px]">
                <ArticleToc headings={headings} locale={locale} />
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
```

- [ ] **Step 3: 커밋**

```bash
git add src/components/mdx-layout/ArticleToc.tsx src/components/mdx-layout/ArticleLayout.tsx
git commit -m "feat(mdx): add ArticleLayout and ArticleToc components"
```

---

## Task 8: 샘플 MDX 콘텐츠

**Files:**
- Create: `src/content/mdx/blog/nextjs-server-action-security/en.mdx`
- Create: `src/content/mdx/white-paper/personal-data-identification-analysis-ai/en.mdx`

렌더링 검증을 위한 최소 샘플 파일. 실제 콘텐츠 마이그레이션은 별도 작업이다.

- [ ] **Step 1: 디렉토리 생성**

```bash
mkdir -p src/content/mdx/blog/nextjs-server-action-security
mkdir -p src/content/mdx/white-paper/personal-data-identification-analysis-ai
```

- [ ] **Step 2: 블로그 샘플 작성**

`src/content/mdx/blog/nextjs-server-action-security/en.mdx`:
```mdx
---
layout: "Article"
category: "blog"
title: "Next.js Server Action and Frontend Security"
description: "Next.js Server Actions may lead developers to make security mistakes. This article analyzes these risks."
date: "2025-03-20"
author: "QueryPie Team"
ogImage: "public/documentation/blogs/b-thumb-20.webp"
keywords: ["Next.js", "Security", "Server Action"]
---

# Basic Concepts and Usage of Next.js Server Action

Next.js Server Actions allow you to call server-side functions from React components.

## How It Works

Define a function with the `use server` directive:

```typescript
'use server';

export async function createAction(data: FormData) {
  // server-side logic
}
```

## Security Considerations

<InfoNote>
Always validate inputs on the server side. Never trust client-provided data.
</InfoNote>

<Box center>
  <ArticleFileImage
    filepath="public/documentation/blogs/b-thumb-20.webp"
    alt="Server Action Security Diagram"
  />
</Box>

<ArticleGatingForm>

## Full Analysis (Gated Content)

This section is only visible after unlocking.

### Attack Vectors

Content here requires form submission.

</ArticleGatingForm>
```

- [ ] **Step 3: 화이트페이퍼 샘플 작성**

`src/content/mdx/white-paper/personal-data-identification-analysis-ai/en.mdx`:
```mdx
---
layout: "Article"
category: "whitepaper"
title: "Improving Personal Data Identification and Analysis with AI"
description: "Utilize QueryPie's AI to analyze personal data for better privacy management."
date: "2024-11-22"
author: "QueryPie Research"
ogImage: "public/documentation/white-papers/wp-thumb-1.webp"
keywords: ["QueryPie", "AI", "Personal Data", "Privacy"]
hideTableOfContents: false
---

# Introduction

Companies face the challenge of managing vast amounts of data while safeguarding personal information.

# Challenges

| Challenge | Description |
|-----------|-------------|
| Data Diversity | Addresses and names lack standardized formats |
| Regulatory Compliance | GDPR, CCPA, HIPAA each have unique requirements |
| Traditional Limitations | Regex-based systems require frequent updates |

## Regulatory Overview

- **GDPR** — EU data subject rights and transparency
- **CCPA** — California consumer privacy rights  
- **HIPAA** — US health information protection

<ArticleGatingForm>

# Solution Architecture

This gated section describes the full AI-powered solution.

## Technical Details

QueryPie's approach uses transformer-based models for entity recognition.

</ArticleGatingForm>
```

- [ ] **Step 4: 커밋**

```bash
git add src/content/mdx/
git commit -m "feat(mdx): add sample blog and whitepaper MDX files for testing"
```

---

## Task 9: Blog MDX 라우트

**Files:**
- Create: `src/app/[locale]/features/documentation/blog/[slug]/page.tsx`

- [ ] **Step 1: 라우트 파일 작성**

`src/app/[locale]/features/documentation/blog/[slug]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { isLocale, type Locale } from "@/constants/i18n";
import { loadMdxSource } from "@/features/mdx/loader";
import { renderMdx } from "@/features/mdx/renderer";
import { buildMdxComponents } from "@/features/mdx/components";
import { extractHeadingsFromMdx } from "@/features/mdx/headings";
import ArticleLayout from "@/components/mdx-layout/ArticleLayout";
import { getContactPageCopy } from "@/features/contact/copy";
import { getContentUnlockCookieName, hasUnlockedContentAccess } from "@/features/content/gating";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const source = await loadMdxSource("blog", slug, locale as Locale);
  if (!source) return {};

  const { frontmatter } = await renderMdx(source, {});
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
  };
}

export default async function BlogMdxPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const source = await loadMdxSource("blog", slug, locale as Locale);
  if (!source) notFound();

  const cookieStore = await cookies();
  const unlockCookieName = getContentUnlockCookieName(slug);
  const isUnlocked = hasUnlockedContentAccess(
    cookieStore.get(unlockCookieName)?.value,
  );
  const contactCopy = getContactPageCopy(locale as Locale);

  const components = buildMdxComponents({
    locale: locale as Locale,
    isUnlocked,
    unlockCookieName,
    title: "",        // frontmatter.title은 아래에서 채운다
    contactCopy,
  });

  const { content, frontmatter } = await renderMdx(source, components);

  // title을 frontmatter에서 가져와 gating 컴포넌트에 전달하려면
  // components를 재빌드한다 (title은 gating form UI에만 사용)
  const componentsWithTitle = buildMdxComponents({
    locale: locale as Locale,
    isUnlocked,
    unlockCookieName,
    title: frontmatter.title,
    contactCopy,
  });
  const { content: finalContent } = await renderMdx(source, componentsWithTitle);

  const headings = extractHeadingsFromMdx(source);

  return (
    <ArticleLayout frontmatter={frontmatter} headings={headings} locale={locale as Locale}>
      {finalContent}
    </ArticleLayout>
  );
}
```

> **Note:** `renderMdx`를 두 번 호출하는 것은 `frontmatter.title`을 `buildMdxComponents`에 넘기기 위한 것이다. 이를 피하려면 `ArticleGatingFormOverlay`가 `title`을 별도 prop으로 받거나, 첫 번째 evaluate에서 frontmatter만 파싱(`components={}`)하고 두 번째에서 content를 렌더링하면 된다. 현재 구현은 정확성 우선이며 최적화는 별도 작업이다.

- [ ] **Step 2: 커밋**

```bash
git add "src/app/[locale]/features/documentation/blog/[slug]/page.tsx"
git commit -m "feat(mdx): add blog MDX route at /[locale]/features/documentation/blog/[slug]"
```

---

## Task 10: Whitepaper MDX 라우트

**Files:**
- Create: `src/app/[locale]/features/documentation/white-paper/[slug]/page.tsx`

- [ ] **Step 1: 라우트 파일 작성**

`src/app/[locale]/features/documentation/white-paper/[slug]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { isLocale, type Locale } from "@/constants/i18n";
import { loadMdxSource } from "@/features/mdx/loader";
import { renderMdx } from "@/features/mdx/renderer";
import { buildMdxComponents } from "@/features/mdx/components";
import { extractHeadingsFromMdx } from "@/features/mdx/headings";
import ArticleLayout from "@/components/mdx-layout/ArticleLayout";
import { getContactPageCopy } from "@/features/contact/copy";
import { getContentUnlockCookieName, hasUnlockedContentAccess } from "@/features/content/gating";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const source = await loadMdxSource("white-paper", slug, locale as Locale);
  if (!source) return {};

  const { frontmatter } = await renderMdx(source, {});
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
  };
}

export default async function WhitepaperMdxPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const source = await loadMdxSource("white-paper", slug, locale as Locale);
  if (!source) notFound();

  const cookieStore = await cookies();
  const unlockCookieName = getContentUnlockCookieName(slug);
  const isUnlocked = hasUnlockedContentAccess(
    cookieStore.get(unlockCookieName)?.value,
  );
  const contactCopy = getContactPageCopy(locale as Locale);

  // Step 1: frontmatter만 파싱 (title 획득용)
  const { frontmatter } = await renderMdx(source, {});

  // Step 2: title을 포함한 컴포넌트로 최종 렌더링
  const components = buildMdxComponents({
    locale: locale as Locale,
    isUnlocked,
    unlockCookieName,
    title: frontmatter.title,
    contactCopy,
  });
  const { content } = await renderMdx(source, components);

  const headings = extractHeadingsFromMdx(source);

  return (
    <ArticleLayout frontmatter={frontmatter} headings={headings} locale={locale as Locale}>
      {content}
    </ArticleLayout>
  );
}
```

> **Note:** Blog 라우트와 달리 두 번의 evaluate 호출을 명시적으로 분리했다 (Step1: frontmatter 파싱, Step2: 최종 렌더링). 이 패턴을 blog 라우트에도 소급 적용해도 된다.

- [ ] **Step 2: 커밋**

```bash
git add "src/app/[locale]/features/documentation/white-paper/[slug]/page.tsx"
git commit -m "feat(mdx): add whitepaper MDX route at /[locale]/features/documentation/white-paper/[slug]"
```

---

## Task 11: 동작 확인

- [ ] **Step 1: 빌드 타입 체크**

```bash
npm run typecheck
```

Expected: 오류 없음

- [ ] **Step 2: 전체 테스트 실행**

```bash
npx vitest run src/features/mdx/
```

Expected: `PASS` — loader 3 tests + renderer 2 tests

- [ ] **Step 3: 개발 서버 실행 후 라우트 확인**

```bash
npm run dev
```

브라우저에서:
- `http://localhost:3000/features/documentation/blog/nextjs-server-action-security` 접속 → 블로그 본문 렌더링 확인
- `http://localhost:3000/features/documentation/white-paper/personal-data-identification-analysis-ai` 접속 → 화이트페이퍼 본문 렌더링 확인

확인 항목:
- [ ] 제목·날짜·저자가 표시된다
- [ ] 본문 Markdown(heading, paragraph, code block, table)이 올바른 스타일로 렌더링된다
- [ ] `<Box>` + `<ArticleFileImage>`가 이미지를 표시한다 (이미지 파일 없으면 broken image — 정상)
- [ ] `<InfoNote>`가 파란 callout으로 표시된다
- [ ] `<ArticleGatingForm>` 이후 콘텐츠가 잠금 상태에서 보이지 않고 게이팅 폼이 표시된다
- [ ] TOC 사이드바가 데스크탑에서 표시된다
- [ ] 기존 Tiptap 라우트(`/features/documentation/[slug]`)가 여전히 정상 작동한다

- [ ] **Step 4: 최종 커밋**

```bash
git add .
git commit -m "feat(mdx): MDX rendering system complete — blog and whitepaper routes"
```

---

## 알려진 제약 / 후속 작업

| 항목 | 설명 |
|------|------|
| `renderMdx` 이중 호출 | frontmatter.title을 gating 컴포넌트에 넘기기 위해 2회 evaluate. 최적화는 별도 작업 |
| 이미지 경로 | MDX의 `filepath="public/X"` → `/X`. 이미지 파일을 `public/` 하위에 실제로 복사해야 표시됨 |
| `relatedPosts` URL | corp-web-contents 구 URL 형식(`/features/documentation/blog/8/...`) → corp-web-v2 slug 형식으로 수동 변환 필요 |
| SSR 캐싱 | 현재 요청마다 evaluate() 실행. 트래픽 증가 시 React `cache()` 또는 CDN 캐싱으로 최적화 |
| `ArticleType2` 레이아웃 | 미구현. 필요 시 `ArticleLayout` 변형으로 추가 |
| 콘텐츠 마이그레이션 | corp-web-contents MDX → `src/content/mdx/` 이관 스크립트 별도 작업 |
