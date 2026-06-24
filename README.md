# corp-web-v2

QueryPie 회사 홍보·소개 웹사이트입니다. 제품 소개, Features Demo, Documentation, Company, Plans, Legal 문서를 `en / ko / ja` 다국어로 제공합니다.

Admin CMS는 Demo / Documentation / News 콘텐츠를 편집·게시하기 위한 보조 기능으로 포함되어 있습니다.

---

## 실행

```bash
npm install
npm run dev
```

개발 서버:

```text
http://localhost:3000
```

---

## 주요 명령

```bash
npm run dev
npm run typecheck
npm run test:run
npm run build
npm run start
npm run audit:public-assets
```

로컬 전용 Playwright E2E:

```bash
npm run e2e:local:contact-us:stage
```

설정과 실행 조건은 `docs/reference/local-e2e.md`를 확인합니다.

---

## 기술 스택

| 항목 | 버전 |
|------|------|
| Next.js App Router | 15.x |
| React | 19.x |
| TypeScript | 5.8 |
| Tailwind CSS | 3.4 |
| Tiptap | 3.x |
| Vitest | 3.x |

---

## 디렉토리 개요

```text
src/
├── app/
│   ├── [locale]/       # 공개 페이지: en / ko / ja
│   ├── admin/          # Admin CMS
│   └── api/            # 서버 API 라우트
├── components/         # common, layout, pages, sections
├── features/           # content, seo, contact 등 도메인 로직
├── content/            # demo, documentation, news, legal 콘텐츠
├── constants/          # i18n, navigation, plans, legal 등
└── styles/             # 전역 스타일
```

---

## 콘텐츠 구조

관리형 콘텐츠는 `src/content/{demo,documentation,news}/**/cnt_xxxxxx/` 아래 파일을 원본으로 사용합니다.

- `meta.json`
- `en.html`, `ko.html`, `ja.html`
- `*.tiptap.json`

`cnt_xxxxxx`는 콘텐츠의 물리 저장 ID(`storageId`)입니다. 공개 URL slug(`id`), 섹션, 카테고리는 변경될 수 있으므로 Admin 저장·상태 변경·삭제 흐름에서는 `storageId`를 우선 식별자로 사용합니다. 본문이 비거나 outlink 콘텐츠로 전환되면 기존 locale 본문 파일은 저장 시 정리됩니다.

콘텐츠 읽기/쓰기 관련 코드는 아래 파일을 먼저 확인합니다.

- `src/features/content/contentState.server.ts`
- `src/features/content/authored.server.ts`
- `src/features/content/data.ts`
- `src/features/content/config.ts`

---

## 라우팅 / 다국어

- locale은 `en`, `ko`, `ja`를 지원합니다.
- 공개 URL은 영어 포함 모든 locale에 `/{locale}` 접두사를 붙입니다. 예: `/en/solutions/aip`, `/ko/solutions/aip`, `/ja/solutions/aip`
- `/` 및 locale 없는 public path는 영어 경로(`/en`, `/en/...`)로 redirect됩니다.
- 공개 경로 생성은 `src/constants/i18n.ts`의 `getLocalePath()`를 우선 사용합니다.
- 공개 콘텐츠 상세 경로는 `getPublicListHref()`, `getPublicDetailHref()` 사용 여부를 먼저 확인합니다.
- locale별 public 영역의 `lang`은 `src/app/[locale]/layout.tsx`에서 적용합니다.

---

## SEO

현재 SEO 상태는 브라우저 `localStorage` 기반입니다.

- 클라이언트 저장소: `src/features/seo/clientStore.ts`
- 런타임 적용: `src/components/common/SeoRuntime.tsx`

---

## 배포

| 환경 | 도메인 | 트리거 |
|------|--------|--------|
| Staging | `stage-v2.querypie.com` | `main` push |
| Production | `www-v2.querypie.com` | `workflow_dispatch` |
| Preview | Vercel preview URL | PR open / sync |

상세 내용은 `docs/reference/vercel-deployment.md`를 확인합니다.

---

## 관련 문서

| 문서 | 설명 |
|------|------|
| [AGENTS.md](AGENTS.md) | 에이전트 작업 규칙 |
| [구현 현황](docs/reference/corp-web-v2-implementation-status.md) | 공개 페이지, Admin CMS, API 구현 현황 |
| [테스트 커버리지](docs/reference/test-coverage.md) | 테스트 파일 목록과 mock 패턴 |
| [Local E2E](docs/reference/local-e2e.md) | 로컬 Playwright E2E 실행 방법 |
| [Vercel 배포](docs/reference/vercel-deployment.md) | GitHub Actions / Vercel 배포 구조 |
| [GitHub 설정](docs/reference/github-settings.md) | CI 워크플로우와 브랜치 보호 |
| [Contact Us API](docs/reference/contact-us-api.md) | 문의 API와 리드 캡처 흐름 |
| [UTM Attribution](docs/reference/utm-attribution.md) | UTM 저장과 전송 흐름 |
