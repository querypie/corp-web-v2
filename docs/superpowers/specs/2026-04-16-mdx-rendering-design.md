# MDX 렌더링 시스템 설계

**날짜**: 2026-04-16  
**상태**: 확정  
**범위**: Blog, Whitepaper (Article 레이아웃) 우선 구현

---

## 배경 및 목표

`corp-web-app` + `corp-web-contents`에서 운영 중인 MDX 기반 Blog/Whitepaper 렌더링을 `corp-web-v2`에서 동등하게 구현한다. `corp-web-v2`는 두 레포를 대체하는 통합 앱이며, 현재 Tiptap 기반 CMS 콘텐츠는 기존 라우트를 그대로 유지한다.

### 성공 기준

- Blog/Whitepaper MDX 파일이 corp-web-v2에서 올바르게 HTML로 렌더링된다.
- MDX 라우트와 Tiptap 라우트가 파일 시스템 레벨에서 명확히 구분된다.
- 빌드 시간에 영향을 주지 않는다 (사전 정적 생성 없음).
- MDX 파일 변경 시 corp-web-v2를 재배포하면 반영된다 (파일 감시·ISR 불필요).

---

## 아키텍처 개요

```
런타임 요청:
  GET /[locale]/features/documentation/blog/[slug]
  GET /[locale]/features/documentation/white-paper/[slug]
         ↓
  Server Component (page.tsx)
         ↓
  loader.ts: fs.readFile(src/content/mdx/{category}/{slug}/{locale}.mdx)
         ↓
  next-mdx-remote-client/rsc: evaluate({ source, components })
         ↓
  MDX 컴포넌트 레지스트리 (Tailwind 구현)
         ↓
  ArticleLayout 렌더링 → HTML 응답
         ↓
  Vercel Edge Cache (이후 요청은 캐시 제공)
```

### 핵심 결정

| 항목 | 결정 | 이유 |
|------|------|------|
| MDX 렌더러 | `next-mdx-remote-client/rsc` | corp-web-app에서 검증됨, RSC 지원, JSX 삽입 완전 지원 |
| 렌더링 시점 | 런타임 SSR | 빌드 시간 증가 없음. MDX 파일 수 증가에 선형적으로 대응 가능 |
| 파일 감시 | 불필요 | MDX 변경은 항상 재배포를 수반함 |
| 컴포넌트 스타일 | Tailwind (신규 구현) | corp-web-v2의 디자인 시스템 통일 |
| 라우트 분리 | MDX / Tiptap 완전 분리 | 개발자가 라우트 파일만 보고 렌더링 방식 즉시 구분 가능 |

---

## 라우트 구조

### 기존 (변경 없음)

```
/[locale]/features/documentation/[slug]
→ src/app/[locale]/features/documentation/[slug]/page.tsx
→ Tiptap HTML 렌더링
```

### 신규 (MDX)

```
/[locale]/features/documentation/blog/[slug]
→ src/app/[locale]/features/documentation/blog/[slug]/page.tsx

/[locale]/features/documentation/white-paper/[slug]
→ src/app/[locale]/features/documentation/white-paper/[slug]/page.tsx
```

두 MDX 라우트는 corp-web-app의 기존 URL 패턴과 자연스럽게 일치한다.

---

## 파일 구조

```
src/
├── app/
│   └── [locale]/features/documentation/
│       ├── [slug]/               # 기존 Tiptap 라우트 (변경 없음)
│       │   └── page.tsx
│       ├── blog/
│       │   └── [slug]/           # 신규 MDX blog 라우트
│       │       └── page.tsx
│       └── white-paper/
│           └── [slug]/           # 신규 MDX whitepaper 라우트
│               └── page.tsx
│
├── content/
│   └── mdx/
│       ├── blog/
│       │   └── {slug}/           # e.g. nextjs-server-action-security/
│       │       ├── en.mdx
│       │       ├── ko.mdx
│       │       └── ja.mdx
│       └── white-paper/
│           └── {slug}/           # e.g. personal-data-identification-analysis-ai/
│               ├── en.mdx
│               ├── ko.mdx
│               └── ja.mdx
│
├── features/
│   └── mdx/
│       ├── loader.ts             # fs.readFile 래퍼
│       ├── components.tsx        # MDX 컴포넌트 레지스트리
│       └── renderer.tsx          # evaluate() 호출 Server Component
│
└── components/
    └── mdx-layout/
        └── ArticleLayout.tsx     # Blog/Whitepaper 공통 레이아웃
```

### MDX 파일 네이밍 규칙

- `{slug}`는 corp-web-v2의 콘텐츠 ID 기준 (e.g. `nextjs-server-action-security`)
- 각 슬러그 폴더 안에 `en.mdx`, `ko.mdx`, `ja.mdx` 세 파일이 나란히 위치
- 번역 추가·수정 시 동일 폴더 내에서 해당 로케일 파일만 편집하면 됨
- 특정 로케일 파일이 없으면 `en.mdx`로 폴백

---

## MDX 렌더링 파이프라인

### loader.ts

```ts
// src/features/mdx/loader.ts
import path from "path";
import { promises as fs } from "fs";
import type { Locale } from "@/constants/i18n";

const MDX_ROOT = path.join(process.cwd(), "src", "content", "mdx");

export async function loadMdxSource(
  category: "blog" | "white-paper",
  slug: string,
  locale: Locale,
): Promise<string | null> {
  const filePath = path.join(MDX_ROOT, category, slug, `${locale}.mdx`);
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    // locale 파일 없으면 en fallback
    if (locale !== "en") {
      const fallback = path.join(MDX_ROOT, category, slug, "en.mdx");
      return fs.readFile(fallback, "utf-8").catch(() => null);
    }
    return null;
  }
}
```

### renderer.tsx (Server Component)

```ts
// src/features/mdx/renderer.tsx
import { evaluate } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./components";
import type { MdxFrontmatter } from "./types";

export async function renderMdx(source: string) {
  return evaluate<MdxFrontmatter>({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
  });
}
```

### page.tsx 패턴

```ts
// src/app/[locale]/features/documentation/blog/[slug]/page.tsx
export default async function BlogMdxPage({ params }) {
  const { locale, slug } = await params;
  const source = await loadMdxSource("blog", slug, locale);
  if (!source) notFound();

  const { content, frontmatter } = await renderMdx(source);
  return <ArticleLayout frontmatter={frontmatter}>{content}</ArticleLayout>;
}
```

---

## MDX 컴포넌트 레지스트리

Blog/Whitepaper MDX에서 실제로 사용되는 컴포넌트만 구현한다.

### 사용 빈도 (corp-web-contents 실측)

| 컴포넌트 | 출현 횟수 | 구현 전략 |
|----------|-----------|-----------|
| `table` (GFM) | 8,668 | Tailwind prose 스타일 HTML table 오버라이드 |
| `ArticleFileImage` | 651 | Next.js `<Image>`, `filepath="public/..."` → `/` 경로 변환 |
| `Box` | 648 | `<div className="flex justify-center">` 래퍼 |
| `Link` | 96 | Next.js `<Link>` |
| `State` | 90 | Tailwind 인라인 뱃지 |
| `ArticleGatingForm` | 45 | corp-web-v2 기존 gating 로직 연동 |
| `ButtonLink` | 27 | corp-web-v2 기존 Button 컴포넌트 활용 |
| `Youtube` | 27 | `<iframe>` responsive embed |
| `InfoNote` | 21 | Tailwind callout 박스 (파란 테두리) |
| `SplitView` | 9 | Tailwind 2-column grid |

### HTML 요소 오버라이드

Tailwind Typography (`@tailwindcss/typography`) prose 클래스를 기반으로 `h1`~`h6`, `p`, `a`, `code`, `pre`, `ul`, `ol`, `li`, `table` 요소를 오버라이드한다.

### ArticleGatingForm 연동

MDX 내 `<ArticleGatingForm>` 태그는 corp-web-v2의 기존 gating 기능과 연동한다.

- `src/features/content/gating.ts`의 `isContentGatingEnabled()`, `buildContentPreviewHtml()` 활용
- `page.tsx`에서 gating 상태를 판단하여 `ArticleGatingForm` 컴포넌트에 prop으로 전달
- 인증 쿠키는 기존 `getContentUnlockCookieName()` 방식 그대로 사용

---

## ArticleLayout

Blog/Whitepaper 공통 레이아웃을 Tailwind로 신규 구현한다.

### 레이아웃 구조

```
┌─────────────────────────────────────────────────┐
│  카테고리 뱃지 / 제목 / 날짜 / 저자               │
│  히어로 이미지 (hideHeroImage 프론트매터 지원)     │
├─────────────────────────────┬───────────────────┤
│  MDX 본문 콘텐츠             │  목차 (TOC)        │
│  (prose-lg Tailwind 스타일)  │  (sticky, 데스크탑)│
├─────────────────────────────┴───────────────────┤
│  관련 글 카드 (relatedPosts frontmatter)          │
└─────────────────────────────────────────────────┘
```

### Frontmatter 스펙 (기존 corp-web-contents 호환)

```yaml
---
layout: "Article"          # 필수: Article | ArticleType2
category: "blog"           # blog | whitepaper
title: "제목"
description: "설명"
date: "2025-03-20"
author: "teddy"            # author ID (향후 프로필 연동 가능)
ogImage: "public/blog/b-thumb-20.png"
keywords: ["키워드1", "키워드2"]
relatedPosts:
  - "/features/documentation/blog/secure-login-token-management"  # corp-web-v2 slug 기준
hideHeroImage: false       # optional
---
```

> **마이그레이션 주의**: corp-web-contents의 기존 MDX 파일은 `relatedPosts` 경로에 숫자 ID가 포함된 구 URL 형식(`/features/documentation/blog/8/...`)을 사용한다. corp-web-v2로 이식 시 slug 기준 경로로 변환이 필요하다.

### TOC 생성

MDX 소스 문자열에서 `#`, `##`, `###` 헤딩을 파싱하여 목차를 생성한다 (corp-web-app의 `extractHeadingFromMdx` 방식 동일). 클라이언트 컴포넌트에서 IntersectionObserver로 현재 위치를 하이라이트한다.

---

## 의존성 추가

```json
{
  "dependencies": {
    "next-mdx-remote-client": "^2.x",
    "remark-gfm": "^4.x"
  }
}
```

`remark-gfm`은 corp-web-app에서 이미 사용 중인 버전(`^4.0.1`)과 동일하다.

---

## 테스트 전략

- 단위 테스트: `loader.ts` (파일 없음/있음/locale 폴백 케이스)
- 통합 테스트: `renderMdx()` (실제 MDX 소스 → frontmatter·content 검증)
- 샘플 콘텐츠: blog 1개, whitepaper 1개를 `src/content/mdx/`에 배치하여 렌더링 검증

---

## 미포함 (향후 과제)

- 빌드 타임 사전 생성 (`generateStaticParams`) — 파일 수 증가 후 빌드 최적화 필요 시 추가
- 렌더링 결과 캐싱 (React `cache()` 또는 Redis) — 트래픽 증가 시 최적화
- `ArticleType2` 레이아웃 — Article 이후 필요 시 추가
- `ArticleList` 레이아웃 (목록 페이지)
- corp-web-contents 기존 MDX 파일 일괄 마이그레이션 스크립트
