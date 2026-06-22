# AGENTS.md

이 레포지토리에서 AI 코딩 에이전트가 작업할 때 참고하는 최소 가이드입니다.

---

## 프로젝트 개요

`corp-web-v2`는 QueryPie 회사 홍보·소개 웹사이트입니다. 제품 소개, Features Demo, Documentation, Company, Plans, Legal 문서를 `en / ko / ja` 다국어로 제공합니다.

Admin CMS는 Demo / Documentation / News 콘텐츠를 편집·게시하기 위한 보조 기능입니다. 공개 웹사이트의 안정성과 콘텐츠 일관성이 우선입니다.

---

## 기술 스택

| 항목 | 버전 |
|------|------|
| Next.js App Router | 15.x |
| React | 19.x |
| TypeScript | 5.8 |
| Tailwind CSS | 3.4 |
| Tiptap | 3.x |

---

## 핵심 구조

```text
src/
├── app/
│   ├── [locale]/       # 공개 페이지: en / ko / ja
│   ├── admin/          # Admin CMS
│   └── api/            # 서버 API 라우트
├── components/
│   ├── common/         # 공용 UI
│   ├── layout/         # GNB, Footer, AdminShell
│   ├── pages/          # 페이지 조립 컴포넌트
│   └── sections/       # 섹션 컴포넌트
├── features/
│   ├── content/        # 콘텐츠 모델, 상태, 읽기/쓰기
│   └── seo/            # SEO 클라이언트 상태
├── content/
│   ├── demo/
│   ├── documentation/
│   ├── news/
│   └── legal/
└── constants/          # i18n, navigation, plans, legal 등
```

---

## 먼저 확인할 파일

작업 범위에 따라 아래 파일을 먼저 확인합니다.

| 목적 | 파일 |
|------|------|
| 라우팅 / locale rewrite | `next.config.ts`, `src/constants/i18n.ts` |
| 공개 메뉴 / 푸터 | `src/constants/navigation.ts` |
| 콘텐츠 카테고리 | `src/features/content/config.ts` |
| 콘텐츠 읽기 | `src/features/content/contentState.server.ts`, `src/features/content/data.ts` |
| Admin 저장 | `src/features/content/authored.server.ts` |
| 전역 스타일 / 폰트 | `src/styles/globals.css`, `src/app/layout.tsx`, `src/app/[locale]/layout.tsx` |

---

## 작업 규칙

- 기존 패턴을 먼저 찾고, 같은 방식으로 수정합니다.
- 요청 범위를 벗어나는 리팩터링은 하지 않습니다.
- 카테고리명, 공개 경로, locale 경로는 하드코딩하지 말고 기존 헬퍼와 설정을 사용합니다.
- 사용자가 만든 미완료 변경이 있을 수 있으므로, 관련 없는 변경은 되돌리지 않습니다.
- UI 변경은 기존 컴포넌트와 Tailwind 유틸리티를 우선 사용합니다.
- git에 올릴 때 commit message, PR 제목, PR 설명은 한국어로 작성합니다.

컴포넌트 확인 순서:

1. `src/components/common`
2. `src/components/layout`
3. `src/components/sections`
4. `src/components/pages`

---

## Figma Dev Mode MCP

Figma 디자인 구현 요청이 있으면 일반 Figma Remote MCP가 아니라 Figma Dev Mode MCP 연결을 우선 사용합니다.

- MCP endpoint: `http://127.0.0.1:3845/mcp`
- VS Code User config: `/Users/vin/Library/Application Support/Code/User/mcp.json`
- Workspace config는 필수가 아닙니다. 전역 User config를 우선 사용합니다.
- 전제: Figma Desktop 앱에서 Dev Mode MCP 서버가 실행 중이어야 합니다.
- Codex 도구에 Figma MCP가 직접 노출되지 않으면 로컬 HTTP JSON-RPC로 endpoint에 접근합니다.
- `lsof -nP -iTCP:3845 -sTCP:LISTEN`에서 Figma가 포트를 열고 있는데 일반 `curl`/`nc`가 `Failed to connect` 또는 `Operation not permitted`로 실패하면, Figma 문제가 아니라 Codex 샌드박스의 로컬 TCP 접근 제한일 수 있습니다. 이 경우 같은 MCP `curl` 요청을 `sandbox_permissions: require_escalated`로 즉시 재시도합니다.
- MCP HTTP 호출은 `initialize` 응답 헤더의 `mcp-session-id`를 이후 `tools/list`, `tools/call` 요청에 반드시 포함합니다.
- Figma 노드 구현 시 `get_design_context`를 우선 호출하고, MCP 응답 지침에 따라 `get_screenshot`도 함께 호출해 실제 시각 상태를 확인한 뒤 구현합니다.

---

## 콘텐츠 규칙

관리형 콘텐츠의 원본은 `src/content/{demo,documentation,news}/**/cnt_xxxxxx/` 아래 파일입니다.

- 메타데이터: `meta.json`
- locale 본문: `en.html`, `ko.html`, `ja.html`
- Tiptap 원본: `*.tiptap.json`

Admin 저장 흐름:

```text
/api/admin/content/state
→ src/features/content/authored.server.ts
→ src/content/**/cnt_xxxxxx/
```

콘텐츠 작업 시 관리자 화면과 공개 화면이 같은 데이터를 읽는지 확인합니다.

---

## 다국어 / 라우팅 주의사항

- locale은 `en`, `ko`, `ja`만 사용합니다.
- 공개 URL은 영어 포함 모든 locale에 `/{locale}` 접두사를 붙입니다. bare public path는 `/en/...`으로 redirect되며, 경로 생성은 `getLocalePath()`를 사용합니다.
- 공개 상세 경로는 `getPublicListHref()`, `getPublicDetailHref()` 사용 여부를 먼저 확인합니다.
- `src/app/[locale]/layout.tsx`에서 locale별 `lang`이 public 영역에 적용됩니다.
- Legal 문서에서 `ja`는 영어 버전을 fallback으로 사용할 수 있습니다.

---

## SEO 주의사항

현재 SEO 상태는 브라우저 `localStorage` 기반입니다.

- 클라이언트 저장소: `src/features/seo/clientStore.ts`
- SEO 이상 동작 시 브라우저 localStorage와 `SeoRuntime` 흐름을 먼저 확인합니다.

---

## 빠른 진단

| 증상 | 확인 위치 |
|------|-----------|
| 이미지 / 다운로드 깨짐 | `public/`, 콘텐츠 데이터, `next.config.ts`, 브라우저 요청 URL |
| Admin 콘텐츠 누락 | `/api/admin/content/state`, `src/content/**/meta.json`, `src/features/content/clientStore.ts` |
| 공개 콘텐츠 누락 | publish 상태, locale 본문, `isPublishedContentVisible()` |
| SEO 상태 이상 | `src/features/seo/clientStore.ts`, localStorage |
| locale / 폰트 이상 | `src/app/[locale]/layout.tsx`, `src/styles/globals.css` |

---

## 테스트

```bash
npm run typecheck
npm run test:run
```

변경 범위에 맞게 테스트를 추가하거나 수정합니다.

- 순수 함수 / 유틸 변경: 유닛 테스트 우선
- API 라우트 변경: mock 기반 통합 테스트
- UI 변경: 핵심 렌더링과 인터랙션 검증
- Next.js App Router / 공용 UI 변경: 서버 컴포넌트와 클라이언트 컴포넌트 경계 오류가 브라우저 런타임에서 늦게 드러날 수 있으므로 `npm run build`를 우선 실행해 검증합니다.
- `npm run typecheck`와 `npm run build`는 동시에 실행하지 않습니다. `.next/types`가 재생성되는 동안 typecheck가 일시적으로 실패할 수 있습니다.
- dev server가 실행 중인 상태에서 `npm run build`를 실행하지 않습니다. 둘 다 `.next`를 쓰기 때문에 dev server가 `Cannot find module './*.js'`, `vendor-chunks/next.js` 같은 깨진 산출물을 물 수 있습니다. 빌드 검증이 필요하면 dev server를 중지하고 `npm run build`를 실행한 뒤, 필요하면 `.next`를 정리하고 dev server를 다시 시작합니다.
- 서버 컴포넌트에서 사용하는 공용 컴포넌트는 이벤트 핸들러, 브라우저 API, client-only props가 섞이지 않았는지 먼저 확인합니다. 상호작용이 필요하면 `"use client"` 적용 여부를 명확히 판단합니다.
- 브라우저 흐름 확인: `docs/reference/local-e2e.md` 참고

---

## 배포 참고

| 환경 | 도메인 | 트리거 |
|------|--------|--------|
| Staging | `stage-v2.querypie.com` | `main` push |
| Production | `www-v2.querypie.com` | `workflow_dispatch` |
| Preview | Vercel preview URL | PR open / sync |

상세 배포 정보는 `docs/reference/vercel-deployment.md`를 확인합니다.

---

## 관련 문서

- `README.md` — 프로젝트 개요와 실행 방법
- `docs/reference/corp-web-v2-implementation-status.md` — 구현 현황
- `docs/reference/test-coverage.md` — 테스트 현황과 mock 패턴
- `docs/reference/local-e2e.md` — 로컬 Playwright E2E
- `docs/reference/github-settings.md` — GitHub 설정
- `.claude/skills/branch/SKILL.md` — 작업 브랜치 생성
- `.claude/skills/worktree/SKILL.md` — worktree 작업
- `.claude/skills/pr/SKILL.md` — PR 작성
- `.claude/skills/vercel/SKILL.md` — Vercel 로그 / 설정 확인
