# corp-web-v2

## 프로젝트 개요

- QueryPie 회사 홍보·소개 웹사이트
- Next.js App Router 기반 다국어 사이트
- 지원 locale: `en`, `ko`, `ja`
- 주요 공개 영역: Product, Features, Demo, Documentation, Company, Plans, Legal
- Admin CMS: Demo / Documentation / News 콘텐츠 편집·게시

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
├── components/
│   ├── ui/             # Button, Input, Select 등 UI primitive
│   ├── content/        # 콘텐츠 미리보기, Tiptap, rich text 렌더링
│   ├── mockups/        # 제품 화면 mockup 컴포넌트
│   ├── sections/       # 페이지 섹션
│   │   ├── common/     # Cta, DetailContentList, FeatureMediaList 등 공유 섹션
│   │   └── *.tsx       # Home*, Aip* 등 페이지/도메인 접두사 섹션
│   ├── site/           # 쿠키 배너, UTM capture 등 전역 사이트 동작
│   ├── forms/          # 공유 form 조각
│   ├── layout/         # GNB, Footer, Admin shell
│   ├── admin/          # Admin 전용 화면 컴포넌트
│   └── pages/          # 공개 페이지 조립 컴포넌트
├── features/           # content, seo, contact 등 도메인 로직
├── content/            # demo, documentation, news, legal 콘텐츠
├── constants/          # i18n, navigation, plans, legal 등
├── public/assets/      # 이미지, mockup asset 등 정적 리소스
└── styles/             # 전역 스타일
```

---

## 콘텐츠 구조

Admin 진입점: `/admin`

관리형 콘텐츠는 `src/content/{demo,documentation,news}/**/cnt_xxxxxx/` 아래 파일로 저장됩니다.

- `meta.json`: 제목, slug, 카테고리, 게시 상태 등 메타데이터
- `en.html`, `ko.html`, `ja.html`: locale별 본문
- `*.tiptap.json`: Admin editor 원본 데이터

### 개인정보처리방침 구조

```text
src/content/legal/privacy-policy/
├── en/
│   ├── 2026-06-01.md
│   └── ...
└── ko/
    ├── 2026-06-01.md
    └── ...
```

- 파일명: 적용일 기준 `YYYY-MM-DD.md`
- 추가 경로: `src/content/legal/privacy-policy/{en|ko}/YYYY-MM-DD.md`
- 최신 파일이 `/[locale]/privacy-policy`에 표시됩니다.
- 버전 URL: `/[locale]/privacy-policy/YYYY-MM-DD`
- `ja`는 `en` 파일을 fallback으로 사용합니다.

---

## 라우팅 / 다국어

- 지원 locale: `en`, `ko`, `ja`
- 공개 URL은 항상 locale prefix 사용. 예: `/en/solutions/aip`
- locale 없는 public path는 `/en/...`으로 redirect
- 콘텐츠 legacy redirect: `src/features/content/legacyRedirects.ts`, `next.config.ts`

### 일본어 홈 구성 방침

- `/en`, `/ko` 홈은 공통 `src/components/pages/home/HomePage.tsx`를 사용합니다.
- `/ja` 홈은 일본 시장에 맞춘 별도 `src/components/pages/home/japan/JapanHomePage.tsx`로 구성합니다.
- locale 선택은 `src/app/[locale]/page.tsx`에서 수행하며 `/ja` URL, 공통 GNB, Footer, locale 전환 구조는 그대로 유지합니다.
- 일본어 홈 전용 섹션은 `src/components/pages/home/japan`, 정적 문구와 metadata copy는 `src/copy/homeJapan.ts`, CMS 조회와 데이터 조합은 필요할 때 `src/features/home/japanPageData.ts`에 둡니다.
- 공통 UI와 재사용 가능한 섹션은 기존 컴포넌트를 사용하되, 일본어 홈의 서로 다른 레이아웃을 공통 `HomePage`의 조건문으로 누적하지 않습니다.

---

## SEO

SEO 메타데이터와 OG 이미지는 `src/features/seo`에서 관리합니다.

- 메타데이터 생성: `src/features/seo/metadata.ts`
- OG 이미지: `src/features/seo/ogImage.tsx`
- OG 제목 포맷: `src/features/seo/ogTitle.ts`

---

## 배포

| 환경 | 직접 서비스 도메인 | 트리거 |
|------|---------------------|--------|
| Staging | `stage.querypie.com`<br>`stage-v2.querypie.com`<br>`stage-v2.querypie.ai` | `main` push |
| Production | `www.querypie.com`<br>`www-v2.querypie.com`<br>`www-v2.querypie.ai` | `workflow_dispatch` |
| Preview | Vercel preview URL | PR open / sync |

상세 내용은 `docs/reference/vercel-deployment.md`를 확인합니다.

---

## 관련 문서

| 문서 | 설명 |
|------|------|
| [Vercel 배포](docs/reference/vercel-deployment.md) | GitHub Actions / Vercel 배포 구조 |
| [Lead Capture Forms](docs/reference/lead-capture-forms.md) | Contact Us, Community License, 콘텐츠 게이팅 폼 흐름 |
| [Contact Us API](docs/reference/contact-us-api.md) | Contact Us 폼 API 처리, Slack/DeskPie 연동, UTM 전달 |
| [Community License](docs/reference/community-license.md) | Community License 신청·발급 API와 외부 연동 |
| [UTM Attribution](docs/reference/utm-attribution.md) | UTM 쿠키 저장과 리드폼 전달 흐름 |
