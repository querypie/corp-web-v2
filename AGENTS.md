# AGENTS.md

AI 코딩 에이전트(Claude Code, Codex 등)가 이 레포지토리에서 작업할 때 참고하는 가이드입니다.

---

## 프로젝트 목적

`corp-web-v2`는 **QueryPie의 회사 홍보·소개 웹사이트**입니다. 제품 소개, Features Demo, Documentation, Company 정보, Plans, Legal 문서 등을 다국어(en/ko/ja)로 제공합니다.

현재 운영 중인 두 레포지토리(`corp-web-app` + `corp-web-contents`)를 하나의 Next.js 15 앱으로 통합·대체하는 것이 목표입니다. 내부에 Admin 대시보드(CMS 기능)가 포함되어 있어 Demo / Documentation / News 콘텐츠를 편집·게시할 수 있지만, 이는 보조 기능이며 **웹사이트 자체의 목적은 회사 및 제품 홍보**입니다.

현재 약 85~90% 구현 완료 상태이며, Stage 환경 검증 후 Production 전환 예정입니다.

---

## 기술 스택

| 항목 | 버전 |
|------|------|
| Next.js (App Router) | 15.x |
| React | 19.x |
| TypeScript | 5.8 |
| Tailwind CSS | 3.4 |
| Tiptap (rich-text editor) | 3.x |

---

## 폴더 구조 핵심

```
src/
├── app/
│   ├── [locale]/       # 공개 페이지 (en / ko / ja)
│   ├── admin/          # Admin CMS 대시보드
│   └── api/            # 서버 API 라우트
├── components/
│   ├── common/         # 재사용 UI 컴포넌트
│   ├── layout/         # GNB, Footer, AdminShell
│   ├── pages/          # 라우트별 페이지 컴포넌트
│   └── sections/       # 페이지 섹션 단위 컴포넌트
├── features/
│   ├── content/        # 콘텐츠 모델·상태·쿼리
│   ├── seo/            # SEO 메타데이터 관리
│   └── contact/        # 문의 페이지 카피 데이터
├── content/
│   ├── demo/           # Demo 원본 콘텐츠
│   ├── documentation/  # Documentation 원본 콘텐츠
│   ├── news/           # News 원본 콘텐츠
│   ├── legal/          # 법무 문서 (privacy-policy 등)
│   └── state/
│       └── content-state.json   # ⭐ 최종 게시 상태 (source of truth)
└── constants/          # 내비게이션, i18n, plans, legal 정적 데이터
```

---

## Source of Truth

작업 전 반드시 아래 파일들을 우선 확인합니다.

| 역할 | 파일 |
|------|------|
| 최종 콘텐츠 상태 | `src/content/state/content-state.json` |
| 콘텐츠 읽기/쓰기 | `src/features/content/contentState.server.ts` |
| 카테고리/메뉴 정의 | `src/features/content/config.ts` |
| 퍼블릭 메뉴·푸터 카피 | `src/constants/navigation.ts` |
| 라우팅 규칙 | `next.config.ts` |

---

## 작업 규칙

### 작업 시작 전

- `README.md`, `next.config.ts`, `src/features/content/config.ts`, `src/constants/navigation.ts`를 먼저 확인합니다.
- 관련 도메인의 `src/app/*`, `src/components/pages/*`, `src/features/*`를 파악합니다.
- 기존 패턴을 먼저 찾고, 그 다음에 수정합니다.

### 콘텐츠 작업

- `src/content/**` 원본 파일과 `src/content/state/content-state.json` 양쪽이 영향받는지 확인합니다.
- 카테고리명, 경로, 메뉴 구성은 하드코딩하지 않습니다. `src/features/content/config.ts`와 `src/constants/*`에 정의가 있는지 먼저 확인합니다.
- 관리자 화면과 퍼블릭 화면이 같은 데이터를 읽는지 확인합니다.
- `src/content/mdx/**`의 MDX 본문 단락은 **한 줄에 한 문장(one sentence per line)** 형식으로 작성합니다.
- MDX 문단, 리스트 항목, JSX 기반 본문 텍스트를 수정할 때도 문장마다 줄바꿈을 유지하고, 여러 문장을 한 물리적 줄에 몰아 쓰지 않습니다.

### UI 작업

컴포넌트 재사용 확인 순서:

1. `src/components/common` → 공용 컴포넌트
2. `src/components/layout` → 레이아웃 컴포넌트
3. `src/components/sections` → 섹션 컴포넌트
4. `src/components/pages` → 페이지 컴포넌트

스타일 수정 시 `src/styles/globals.css`와 기존 Tailwind 유틸리티를 먼저 확인합니다.

### 범위 준수

- 요청 범위를 벗어나는 리팩터링은 하지 않습니다.
- 기존 구조를 바꿔야 한다면 왜 필요한지 근거를 먼저 확인합니다.

---

## 주의사항

### 라우팅

- `/` 요청은 `next.config.ts` rewrite 규칙에 의해 `/en`으로 처리됩니다.
- 퍼블릭 경로 수정 시 `getLocalePath()`, `getPublicListHref()`, `getPublicDetailHref()` 경로 생성 함수와 함께 확인합니다.
- rewrite 수정 시 `public/` 정적 자산 요청도 함께 점검합니다.

### SEO

- SEO 상태는 현재 브라우저 `localStorage` 기반(`src/features/seo/clientStore.ts`)입니다.
- SEO 이상 동작 시 `clientStore.ts`와 브라우저 localStorage를 먼저 확인합니다.

### 법무 문서

- 개인정보처리방침 버전 파일: `src/content/legal/privacy-policy/en`, `.../ko`
- `ja`는 영어 버전을 fallback으로 사용합니다.

### 미구현 영역

아래 항목은 현재 구현되어 있지 않습니다. 관련 작업 시 존재하지 않는 코드를 전제하지 않습니다.

| 항목 | 상태 |
|------|------|
| Community License 신청/발급 | ❌ 미구현 |
| 리드/폼 연동 (Salesforce, Slack, Google Sheets) | ❌ 미구현 |
| Blog / Whitepaper / Webinar Admin | ❌ 미구현 |
| SEO 서버 영속화 | ⚠️ localStorage만 사용 |

---

## 빠른 진단

| 증상 | 확인 위치 |
|------|-----------|
| 이미지·다운로드 경로 깨짐 | `public/` 파일 위치, 콘텐츠 데이터, `next.config.ts` rewrite, 브라우저 요청 URL |
| 관리자에서 콘텐츠 안 보임 | `/api/admin/content/state` → `content-state.json` → `src/features/content/clientStore.ts` |
| SEO 이상 동작 | `src/features/seo/clientStore.ts`, 브라우저 localStorage |

---

## 배포

| 환경 | 도메인 | 트리거 |
|------|--------|--------|
| Staging | `stage-v2.querypie.com` | `main` push 시 자동 |
| Production | `www-v2.querypie.com` | `workflow_dispatch` 수동 실행 |
| Preview | Vercel 자동 발급 URL | PR open/sync 시 자동 |

- CI/CD: GitHub Actions (`.github/workflows/`)
- 배포 플랫폼: Vercel (리전: `icn1`)
- `vercel.json`의 `"git": { "deploymentEnabled": false }`로 Vercel 자동 git 배포는 비활성화되어 있고, GHA가 배포를 직접 트리거합니다.
- GitHub Secret: `VERCEL_TOKEN` (querypie organization secret)

---

## 테스트

### 프레임워크

[Vitest](https://vitest.dev/) — 유닛 + 통합 테스트. 테스트 파일은 `src/**/*.test.ts` / `src/**/*.test.tsx` 형식으로 작성합니다.

```bash
npm run test        # watch 모드
npm run test:run    # CI 모드 (단일 실행)
```

### PR 작업 시 테스트 규칙

PR에 코드 변경이 포함될 경우, **변경된 로직에 대한 테스트를 함께 작성**합니다.

- 새 함수·유틸리티를 추가하면 해당 파일의 `.test.ts`에 유닛 테스트를 추가합니다.
- 새 API 라우트를 추가하면 Mock 기반 통합 테스트를 함께 작성합니다.
- 새 컴포넌트를 추가하면 렌더링·인터랙션 테스트를 함께 작성합니다.
- 기존 함수의 동작을 변경하면 영향받는 테스트를 함께 수정합니다.

### 테스트 대상 우선순위

| 우선순위 | 대상 |
|----------|------|
| 🔴 필수 | 순수 함수·유틸 (`data.ts`, `gating.ts`, `i18n.ts` 등) |
| 🔴 필수 | API 라우트 핸들러 — Mock으로 핵심 경로 검증 |
| 🟡 권장 | 컴포넌트 (Server / Client) — Mock·Fixture 활용 |
| 🟢 예외 허용 | happy-dom이 지원하지 않는 브라우저 API에 강하게 결합된 컴포넌트 (예: Tiptap 에디터) — 핵심 로직을 순수 함수로 분리해 테스트 |

### 환경 및 Mock 패턴

- 기본 환경: `happy-dom` / API 라우트 테스트: `// @vitest-environment node` pragma
- 상세 내용: [테스트 커버리지 현황](docs/reference/test-coverage.md)

---

## 관련 문서

아래 문서들은 `docs/` 디렉토리에 있으며 작업 맥락을 이해하는 데 도움이 됩니다.

### 계획 문서 (`docs/plan/`)

- [프로젝트 계획](docs/plan/2026-04-15-corp-web-v2-project-plan-design.md) — corp-web-app + corp-web-contents 통합 목표, Phase 1~3 로드맵, 전체 구현 현황 요약
- [CMS 완성 계획](docs/plan/2026-04-15-corp-web-v2-cms-completion-design.md) — SEO 서버 영속화, Blog/Whitepaper 콘텐츠 타입 확장, Stage→Production 릴리즈 워크플로우 설계
- [Community License 기능 설계](docs/plan/2026-04-15-community-license-design.md) — Community License 신청/발급 플로우 상세 설계 (파일 구조, API, i18n, 외부 연동)
- [Community License 구현 계획](docs/plan/2026-04-15-community-license-implementation-plan.md) — 위 설계를 바탕으로 한 단계별 구현 체크리스트

### 참조 문서 (`docs/reference/`)

- [구현 현황](docs/reference/corp-web-v2-implementation-status.md) — 공개 페이지·Admin CMS·API 라우트의 완성도, 디렉토리 구조, CMS 데이터 흐름 다이어그램
- [Vercel 배포 현황](docs/reference/vercel-deployment.md) — GitHub Actions 워크플로우 구조, 배포 스크립트 동작 방식, Vercel 프로젝트 설정, DNS 설정(Route53) 가이드

### 에이전트 스킬 (`.claude/skills/`)

| 스킬 | 설명 |
|------|------|
| [branch](.claude/skills/branch/SKILL.md) | 새 작업 시작 전 브랜치 생성 — main 업데이트, stale 브랜치 정리, feature 브랜치 생성 |
| [worktree](.claude/skills/worktree/SKILL.md) | git worktree 격리 작업 환경 — 병렬 작업이 필요할 때 |
| [pr](.claude/skills/pr/SKILL.md) | GHA workflow 기반 PR 생성 규칙 — 작업 완료 후 PR 작성 |
| [vercel](.claude/skills/vercel/SKILL.md) | Vercel CLI 사용 가이드 — deployment log 조회, 프로젝트 설정 확인 |

### README

- [README.md](README.md) — 기술 스택, 폴더 구조, 콘텐츠 동작 방식, 작업 체크리스트 등 전체 개요
