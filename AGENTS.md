# AGENTS.md

이 레포지토리에서 AI 코딩 에이전트가 작업할 때 참고하는 최소 가이드입니다.

---

## 프로젝트 개요

`corp-web-v2`는 QueryPie 회사 홍보·소개 웹사이트입니다. 제품 소개, Demo, Documentation, Company, Plans, Legal 문서를 `en / ko / ja` 다국어로 제공합니다.

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

## 주요 구조

```text
src/
├── app/                # App Router: public locale routes, admin, api
├── components/
│   ├── ui/             # Button, Input, Select 등 순수 UI primitive
│   ├── content/        # 콘텐츠 미리보기, Tiptap, rich text 렌더링
│   ├── mockups/        # 제품 화면 mockup 컴포넌트
│   ├── sections/       # 페이지 섹션, common에는 여러 페이지 공유 섹션
│   │   ├── common/     # Cta, DetailContentList, FeatureMediaList 등 공유 섹션
│   │   └── *.tsx       # Home*, Aip* 등 페이지/도메인 접두사 섹션
│   ├── site/           # 쿠키 배너, UTM capture 등 전역 사이트 동작
│   ├── forms/          # 여러 페이지에서 공유하는 form 조각
│   ├── layout/         # GNB, Footer, Admin shell
│   ├── admin/          # Admin 전용 화면 컴포넌트
│   └── pages/          # 공개 페이지 조립 컴포넌트
├── constants/          # i18n, navigation, plans, legal 등
├── copy/               # 정적 페이지 문구와 metadata copy
├── content/            # demo, documentation, news, legal 원본
├── public/assets/      # 이미지, mockup asset 등 정적 리소스
└── features/           # content, seo, utm 등 동작 로직
```

컴포넌트 확인 순서:

1. `src/components/ui`
2. `src/components/layout`
3. `src/components/content`, `src/components/sections`, `src/components/forms`, `src/components/site`
4. `src/components/pages`, `src/components/admin`

---

## 먼저 확인할 파일

| 목적 | 파일 |
|------|------|
| 라우팅 / locale rewrite | `next.config.ts`, `src/constants/i18n.ts` |
| 공개 메뉴 / 푸터 | `src/constants/navigation.ts` |
| 정적 페이지 문구 / 메타 copy | `src/copy/*` |
| 콘텐츠 카테고리 | `src/features/content/config.ts` |
| 콘텐츠 읽기 | `src/features/content/contentState.server.ts`, `src/features/content/data.ts` |
| Admin 저장 | `src/features/content/authored.server.ts` |
| 전역 스타일 / 폰트 | `src/styles/globals.css`, `src/app/layout.tsx`, `src/app/[locale]/layout.tsx` |
| SEO / OG 이미지 | `src/features/seo/metadata.ts`, `src/features/seo/ogImage.tsx` |

---

## 작업 규칙

- 기존 패턴을 먼저 찾고, 같은 방식으로 수정합니다.
- 요청 범위를 벗어나는 리팩터링은 하지 않습니다.
- 관련 없는 사용자 변경은 되돌리지 않습니다.
- 정적 문구와 metadata copy는 `src/copy`에 둡니다. API, 저장, 브라우저 상태, 라우팅 계산 같은 동작 로직만 `src/features`에 둡니다.
- `src/app` 라우트 파일은 locale 확인, metadata 생성, 데이터 조회, 페이지 컴포넌트 연결만 담당하게 유지합니다.
- `src/app`에서 `components`, `constants`, `features`, `copy`를 import할 때는 깊은 상대경로 대신 `@/...` alias를 우선 사용합니다.
- `src/components/ui`에는 도메인 의존성이 없는 UI primitive만 둡니다. 콘텐츠/Tiptap 관련은 `components/content`, 페이지 섹션은 `components/sections`, 전역 사이트 동작은 `components/site`에 둡니다.
- 여러 페이지에서 공유하는 섹션은 `src/components/sections/common`에 둡니다. 특정 페이지나 도메인에 가까운 섹션은 `Home*`, `Aip*`처럼 접두사를 붙여 `src/components/sections`에 둡니다.
- 솔루션 페이지의 locale별 JSX 본문, 섹션 컴포넌트, 통합 필터/데이터는 `src/components/pages/solutions`에 둡니다. `src/app/[locale]/solutions`에는 route `page.tsx`와 route 테스트만 둡니다.
- 카테고리명, 공개 경로, locale 경로는 하드코딩하지 말고 기존 헬퍼와 설정을 사용합니다.
- UI 변경은 기존 컴포넌트와 Tailwind 유틸리티를 우선 사용합니다.
- B2B SaaS/보안/엔터프라이즈 화면은 신뢰감, 명확한 정보 구조, 절제된 시각 표현을 우선합니다.
- 다국어 화면에서는 긴 한국어·일본어 문구로 인한 줄바꿈과 overflow를 확인합니다.
- git에 올릴 때 commit message, PR 제목, PR 설명은 한국어로 작성합니다.

---

## 콘텐츠 규칙

관리형 콘텐츠 원본은 `src/content/{demo,documentation,news}/**/cnt_xxxxxx/` 아래 파일입니다.

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

## 다국어 / 라우팅

- locale은 `en`, `ko`, `ja`만 사용합니다.
- 공개 URL은 영어 포함 모든 locale에 `/{locale}` 접두사를 붙입니다.
- bare public path는 `/en/...`으로 redirect되며, 경로 생성은 `getLocalePath()`를 사용합니다.
- 공개 콘텐츠 상세 경로는 `getPublicListHref()`, `getPublicDetailHref()` 사용 여부를 먼저 확인합니다.
- Legal 문서에서 `ja`는 영어 버전을 fallback으로 사용할 수 있습니다.

---

## 테스트 / 검증

기본 검증:

```bash
npm run typecheck
npm run test:run
```

- 변경 범위에 맞게 테스트를 추가하거나 수정합니다.
- 순수 함수 / 유틸 변경: 유닛 테스트 우선
- API 라우트 변경: mock 기반 통합 테스트
- UI 변경: 핵심 렌더링과 인터랙션 검증
- Next.js App Router / 공용 UI 변경은 서버/클라이언트 컴포넌트 경계 오류가 늦게 드러날 수 있으므로 `npm run build`를 우선 고려합니다.
- `npm run typecheck`와 `npm run build`는 동시에 실행하지 않습니다. `.next/types` 재생성 중 typecheck가 일시 실패할 수 있습니다.
- dev server가 실행 중인 상태에서 `npm run build`를 실행하지 않습니다. 둘 다 `.next`를 쓰므로 빌드 검증이 필요하면 dev server를 중지하고 실행합니다.
- 로컬 테스트 서버는 3000번 포트만 사용합니다. 3000번이 점유되어 있으면 다른 포트로 우회하지 말고 점유 프로세스를 확인합니다.

---

## Figma

Figma 디자인 구현 요청이 있으면 일반 Figma Remote MCP가 아니라 Figma Dev Mode MCP를 우선 사용합니다.

- MCP endpoint: `http://127.0.0.1:3845/mcp`
- Figma Desktop 앱에서 Dev Mode MCP 서버가 실행 중이어야 합니다.
- 로컬 TCP 접근이 `Operation not permitted` 또는 connection error로 막히면 같은 MCP 요청을 `sandbox_permissions: require_escalated`로 재시도합니다.

---

## 빠른 진단

| 증상 | 확인 위치 |
|------|-----------|
| 이미지 / 다운로드 깨짐 | `public/`, 콘텐츠 데이터, `next.config.ts`, 브라우저 요청 URL |
| Admin 콘텐츠 누락 | `/api/admin/content/state`, `src/content/**/meta.json`, `src/features/content/clientStore.ts` |
| 공개 콘텐츠 누락 | publish 상태, locale 본문, `isPublishedContentVisible()` |
| locale / 폰트 이상 | `src/app/[locale]/layout.tsx`, `src/styles/globals.css` |
| SEO / OG 이상 | `src/features/seo/*`, 해당 route의 `generateMetadata()` |

---

## 배포 참고

| 환경 | 도메인 | 트리거 |
|------|--------|--------|
| Staging | `stage-v2.querypie.com` | `main` push |
| Production | `www-v2.querypie.com` | `workflow_dispatch` |
| Preview | Vercel preview URL | PR open / sync |

상세 배포 정보는 `docs/reference/vercel-deployment.md`를 확인합니다.

---

## 관련 문서 / 스킬

- `README.md` — 프로젝트 개요와 실행 방법
- `docs/reference/vercel-deployment.md` — 배포 정보
- `docs/reference/lead-capture-forms.md` — 리드폼 / 게이팅폼 흐름
- `docs/reference/utm-attribution.md` — UTM 저장과 전송 흐름
- `.claude/skills/branch/SKILL.md` — 작업 브랜치 생성
- `.claude/skills/worktree/SKILL.md` — worktree 작업
- `.claude/skills/pr/SKILL.md` — PR 작성
- `.claude/skills/vercel/SKILL.md` — Vercel 로그 / 설정 확인
