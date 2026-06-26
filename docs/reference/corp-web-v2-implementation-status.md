# corp-web-v2 구현 현황

**최종 업데이트**: 2026-06-25 (폼 연동, 테스트, API 현황 반영)

corp-web-v2의 현재 구현 상태를 영역별로 기술한다.

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript 5.8 |
| UI | React 19 |
| 스타일 | Tailwind CSS 3.4 + CSS custom properties |
| 에디터 | Tiptap 3 (rich text, 이미지/링크/테이블/YouTube 확장) |
| 폰트 | Mona Sans VF (로컬), Pretendard Variable / JP (CDN), JetBrains Mono |
| 다국어 | en / ko / ja (App Router `[locale]` 라우팅) |

---

## 디렉토리 구조

```
src/
├── app/
│   ├── [locale]/          # 공개 웹사이트 (en, ko, ja)
│   ├── admin/             # Admin CMS 대시보드
│   └── api/               # 서버 API 라우트
├── components/
│   ├── ui/                # Button, Input, Select 등 UI primitive
│   ├── content/           # 콘텐츠 미리보기, Tiptap, rich text 렌더링
│   ├── layout/            # GNB, Footer, Admin 레이아웃
│   ├── pages/             # 페이지별 컴포넌트
│   ├── sections/          # 페이지 섹션 컴포넌트
│   │   ├── common/        # Cta, DetailContentList, FeatureMediaList 등 공유 섹션
│   │   └── *.tsx          # Home*, Aip* 등 페이지/도메인 접두사 섹션
│   ├── site/              # 쿠키 배너, UTM capture 등 전역 사이트 동작
│   ├── forms/             # 공유 form 조각
│   └── admin/             # Admin 전용 화면 컴포넌트
├── features/
│   ├── content/           # 콘텐츠 시스템 (상태 관리, 쿼리, 게이팅)
│   ├── seo/               # SEO 메타데이터 관리
│   ├── contact/           # 문의 페이지 복사본
│   ├── community-license/ # Community License 신청/발급
│   └── utm/               # UTM attribution
├── content/               # 콘텐츠 파일 (소스)
│   ├── demo/              # category/cnt_xxxxxx/meta.json + locale 본문
│   ├── documentation/     # category/cnt_xxxxxx/meta.json + locale 본문
│   ├── news/              # cnt_xxxxxx/meta.json
│   └── legal/
└── constants/             # 내비게이션, i18n, plans, legal 등 정적 데이터
```

---

## 공개 페이지 구현 상태

| 경로 | 상태 | 비고 |
|------|------|------|
| `/` | ✅ | 홈 (Hero, MCP 캐러셀, 뉴스, 기능 프리뷰) |
| `/features/demo` | ✅ | 데모 목록 + 카테고리 필터 |
| `/features/demo/[slug]` | ✅ | 데모 상세 |
| `/features/demo/[slug]/download` | ✅ | 게이팅 다운로드 |
| `/features/documentation` | ✅ | 문서 목록 |
| `/features/documentation/[slug]` | ✅ | 문서 상세 |
| `/features/documentation/[slug]/download` | ✅ | 게이팅 다운로드 |
| `/community-license` | ✅ | Community License 신청 |
| `/company/about-us` | ✅ | 회사 소개 |
| `/company/certifications` | ✅ | 인증 현황 |
| `/company/contact-us` | ✅ | 문의 폼 |
| `/company/news` | ✅ | 뉴스 목록 |
| `/company/news/[slug]` | ✅ | 뉴스 상세 |
| `/plans` | ✅ | `/plans/aip`로 redirect |
| `/plans/aip` | ✅ | AIP 가격/플랜 |
| `/plans/acp` | ✅ | ACP 가격/플랜 |
| `/privacy-policy`, `/privacy-policy/[version]` | ✅ | 버전 관리 포함 |
| `/terms-of-service` | ✅ | |
| `/eula` | ✅ | |
| `/cookie-preference` | ✅ | |

모든 공개 경로는 `[locale]` 래퍼를 통해 다국어 지원. 실제 공개 URL은 영어 포함 모든 locale에 `/{locale}` 접두사를 사용한다. 예: `/en/solutions/aip`, `/ko/solutions/aip`, `/ja/solutions/aip`

위 표의 경로는 locale을 제외한 논리 경로이며, `next.config.ts`의 redirect 규칙으로 `/` 및 locale 없는 public path는 `/en`, `/en/...`으로 이동한다.

---

## Admin CMS 구현 상태

| 경로 | 상태 | 비고 |
|------|------|------|
| `/admin` | ✅ | 대시보드 |
| `/admin/demo` | ✅ | Demo 콘텐츠 목록 |
| `/admin/demo/[category]/[slug]` | ✅ | Demo 콘텐츠 편집 |
| `/admin/documentation` | ✅ | Documentation 목록 |
| `/admin/documentation/[category]/[slug]` | ✅ | Documentation 편집 |
| `/admin/news` | ✅ | 뉴스 목록 |
| `/admin/news/new` | ✅ | 새 뉴스 작성 |
| `/admin/news/[slug]` | ✅ | 뉴스 편집 |
| Blog 관리 | ✅ | Documentation Blogs 카테고리 |
| Whitepaper 관리 | ✅ | Documentation White Papers 카테고리 |
| Webinar 관리 | ✅ | Demo Webinars 카테고리 |

---

## API 라우트

| 경로 | 메서드 | 역할 |
|------|--------|------|
| `/api/admin/content/state` | GET/POST/PUT/PATCH/DELETE | 관리형 콘텐츠 파일 조회·저장·상태 변경·삭제 |
| `/api/admin/content/translate` | POST | Admin 콘텐츠 번역 보조 |
| `/api/admin/uploads` | POST | 파일 업로드 |
| `/api/admin/uploads/content-document` | POST | 문서 업로드 |
| `/api/community-license` | POST | Community License 신청, 라이선스 발급, Salesforce/Slack 연동 |
| `/api/contact-us` | POST | Contact Us 제출, UTM 수집, Salesforce/Slack 연동 |
| `/api/downloads/content` | POST | 공개 콘텐츠 다운로드 리드 저장·언락 |
| `/api/downloads/file` | GET | 파일 다운로드 |
| `/api/language-suggestion` | GET | 언어 제안 |
| `/api/og` | GET | OG 이미지 생성 |

---

## CMS 데이터 흐름

```
Admin CMS
        ↓
/api/admin/content/state
        ↓
authored.server.ts      ← src/content/**/cnt_xxxxxx 파일 I/O
        ↓
src/content/**          ← meta.json, locale별 html/tiptap.json
        ↓
contentState.server.ts  ← 서버사이드 콘텐츠 조회
        ↓
data.ts                 ← 콘텐츠 유틸 / 필터링 / 경로 생성
        ↓
Page Components         ← 렌더링
```

관리형 콘텐츠의 물리 저장 단위는 `cnt_xxxxxx` 디렉토리이며, `meta.json`의 `storageId`가 영구 식별자다. 공개 URL slug인 `id`, `section`, `categorySlug`는 변경될 수 있으므로 Admin 변경 API는 `storageId`를 우선 사용하고, `section/categorySlug/id`는 호환용 보조 식별자로만 사용한다.

저장 시 `section/categorySlug`가 바뀌면 기존 `storageId` 디렉토리를 새 위치로 이동한다. 본문이 비어 있거나 `contentType`이 `outlink`로 바뀐 locale은 기존 `*.html`, `*.tiptap.json` 파일을 제거해 오래된 본문이 다시 노출되지 않게 한다. 신규 `storageId` 생성은 프로세스 내 예약 큐로 같은 번호 중복 생성을 줄인다.

콘텐츠 게이팅(`gating.ts`)으로 다운로드 전 리드폼 제출 요구 가능.

---

## 남은 정리 항목

| 항목 | 우선순위 | 비고 |
|------|----------|------|
| SEO 서버 영속화 | 🟡 | localStorage → 파일 저장 전환 필요 |
| Google Sheets 연동 | 🟡 | 현재 Contact Us / Community License는 Salesforce + Slack 기준 |
| Stage→Production 운영 체크리스트 | 🟡 | 배포 워크플로우는 구현됨. 릴리즈 절차 문서화 필요 |
| UI E2E 확대 | 🟠 | Vitest 304개 통과. 로컬 Playwright는 Contact Us stage 흐름 중심 |

---

## 인프라 및 배포

- 배포 플랫폼: Vercel (팀: QueryPie AI, 프로젝트: `corp-web-v2`, 리전: `icn1`)
- CI/CD: GitHub Actions 구현 완료 (`ci.yml`, `deploy-*.yml`, `delete-deploy.yml`)
- 배포 전략:
  - `main` push → Staging 자동 배포 (`stage-v2.querypie.com`)
  - Production은 `workflow_dispatch` 수동 실행 (`www-v2.querypie.com`)
  - PR → Preview 자동 배포
- 환경변수: `.env.local.example` 참고, GitHub Secret: `VERCEL_TOKEN`
- DNS: Route53 레코드 등록 대기 중

→ [Vercel 배포 구현 현황](./vercel-deployment.md)

---

## 관련 문서

- [Vercel 배포 현황](./vercel-deployment.md)
