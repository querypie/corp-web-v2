# corp-web-v2 구현 현황

**최종 업데이트**: 2026-04-15

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
│   ├── common/            # 재사용 UI 컴포넌트
│   ├── layout/            # GNB, Footer, Admin 레이아웃
│   ├── pages/             # 페이지별 컴포넌트
│   └── sections/          # 페이지 섹션 컴포넌트
├── features/
│   ├── content/           # 콘텐츠 시스템 (상태 관리, 쿼리, 게이팅)
│   ├── seo/               # SEO 메타데이터 관리
│   └── contact/           # 문의 페이지 복사본
├── content/               # 콘텐츠 파일 (소스)
│   ├── demo/
│   ├── documentation/
│   ├── news/
│   ├── legal/
│   └── state/content-state.json   # 최종 게시 상태 (핵심 파일)
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
| `/company/about-us` | ✅ | 회사 소개 |
| `/company/certifications` | ✅ | 인증 현황 |
| `/company/contact-us` | ✅ | 문의 폼 |
| `/company/news` | ✅ | 뉴스 목록 |
| `/company/news/[slug]` | ✅ | 뉴스 상세 |
| `/plans` | ✅ | 가격/플랜 |
| `/privacy-policy`, `/privacy-policy/[version]` | ✅ | 버전 관리 포함 |
| `/terms-of-service` | ✅ | |
| `/eula` | ✅ | |
| `/cookie-preference` | ✅ | |

모든 공개 경로는 `[locale]` 래퍼를 통해 다국어 지원. `next.config.ts`의 rewrite 규칙으로 `/` → `/en` 자동 처리.

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
| `/admin/seo` | ⚠️ | SEO 메타데이터 편집 (localStorage 저장, 서버 미영속화) |
| Blog 관리 | ❌ | 미구현 |
| Whitepaper 관리 | ❌ | 미구현 |
| Webinar 관리 | ❌ | 미구현 |

---

## API 라우트

| 경로 | 메서드 | 역할 |
|------|--------|------|
| `/api/admin/content/state` | POST | content-state.json 업데이트 |
| `/api/admin/seo/discover` | GET | SEO 메타데이터 조회 |
| `/api/admin/uploads` | POST | 파일 업로드 |
| `/api/admin/uploads/content-document` | POST | 문서 업로드 |
| `/api/downloads/content` | GET | 공개 콘텐츠 다운로드 |
| `/api/downloads/file` | GET | 파일 다운로드 |

---

## CMS 데이터 흐름

```
src/content/**          ← 원본 콘텐츠 파일 (html, tiptap.json, meta.json)
        ↓
content-state.json      ← Admin 변경사항 반영된 최종 상태 (6,600+ lines)
        ↓
contentState.server.ts  ← 서버사이드 파일 I/O
        ↓
data.ts                 ← 콘텐츠 쿼리 / 필터링 / 상세 조회
        ↓
Page Components         ← 렌더링
```

콘텐츠 게이팅(`gating.ts`)으로 다운로드 전 리드폼 제출 요구 가능.

---

## 현재 미구현 항목

| 항목 | 우선순위 | 비고 |
|------|----------|------|
| Community License 신청/발급 | 🔴 최우선 | corp-web-app 대체 필수 |
| 리드/폼 연동 (Salesforce, Slack, Google Sheets) | 🔴 필수 | |
| Vercel CI/CD (GitHub Actions) | 🔴 필수 | |
| SEO 서버 영속화 | 🟡 | localStorage → 파일 저장 전환 필요 |
| Blog / Whitepaper / Webinar Admin | 🟡 | CMS 완성 계획 참고 |
| Stage→Production 릴리즈 워크플로우 | 🟡 | CMS 완성 계획 참고 |
| 자동화 테스트 | 🟠 | 테스트 파일 없음 |

---

## 인프라 및 배포

- 배포 플랫폼: Vercel (명시적 설정 파일 없음, 기본값 사용 중)
- CI/CD: 미구성 (GitHub Actions 없음)
- 환경변수: `.env.local.example` 참고
- 브랜치 전략: 미정 (계획 문서 참고)

---

## 관련 문서

- [프로젝트 계획](../plan/2026-04-15-corp-web-v2-project-plan-design.md)
- [CMS 완성 계획](../plan/2026-04-15-corp-web-v2-cms-completion-design.md)
