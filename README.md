# CMS

Next.js App Router 기반의 퍼블릭 사이트와 관리자 CMS를 함께 운영하는 프로젝트입니다.

## 개요

이 저장소는 두 축으로 구성됩니다.

- 퍼블릭 사이트
  - 다국어 로케일: `en`, `ko`, `ja`
  - 주요 영역: Home, Features Demo, Features Documentation, Company, Plans, Legal
- 관리자 CMS
  - Demo / Documentation / News 콘텐츠 관리
  - 업로드 API 및 콘텐츠 상태 저장
  - SEO 설정 관리

## 기술 스택

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Tiptap

## 실행 방법

```bash
npm install
npm run dev
```

기본 개발 서버 주소:

- `http://localhost:3000`

기타 스크립트:

```bash
npm run typecheck
npm run build
npm run start
npm run audit:public-assets
```

## 실제 폴더 구조

프로젝트는 `src/app`, `src/features`, `src/content` 세 축이 핵심입니다.

### 1. 라우팅 계층: `src/app`

- `src/app/[locale]`
  - 퍼블릭 페이지 진입점
  - 실제 주요 경로
    - `company/about-us`
    - `company/certifications`
    - `company/contact-us`
    - `company/news`
    - `features/demo`
    - `features/documentation`
    - `plans`
    - `privacy-policy`
    - `terms-of-service`
    - `eula`
    - `cookie-preference`
- `src/app/admin`
  - 관리자 페이지
  - `demo`, `documentation`, `news`, `seo`
- `src/app/api`
  - 관리자 콘텐츠 상태, 업로드, SEO 관련 API

### 2. UI 계층: `src/components`

- `src/components/pages`
  - 라우트 단위 페이지 컴포넌트
- `src/components/sections`
  - 페이지를 구성하는 섹션 단위 UI
- `src/components/layout`
  - GNB, Footer, AdminShell 등 공통 레이아웃
- `src/components/common`
  - 버튼, 입력, 탭, 에디터 등 공용 컴포넌트

### 3. 도메인 계층: `src/features`

- `src/features/content`
  - 콘텐츠 모델, 카테고리 설정, 서버 상태 읽기/쓰기, 클라이언트 store
- `src/features/seo`
  - SEO 상태 관리
- `src/features/contact`
  - 문의 관련 문구 데이터

`src/features/content/config.ts`가 Demo / Documentation 카테고리 정의의 기준점입니다.

### 4. 콘텐츠 저장소: `src/content`

- `src/content/demo`
  - Demo 콘텐츠 원본
  - 하위 카테고리: `use-cases`, `aip-features`, `acp-features`, `webinars`
- `src/content/documentation`
  - Documentation 원본
  - 하위 카테고리: `introduction`, `glossary`, `manuals`, `white-papers`, `blogs`
- `src/content/news`
  - News 원본
- `src/content/legal`
  - 개인정보처리방침 등 법무 문서
- `src/content/state/content-state.json`
  - 퍼블릭/어드민이 공통으로 읽는 최종 콘텐츠 상태

실제 운영 기준으로 콘텐츠의 최종 source of truth는 `src/content/state/content-state.json`입니다.

## 콘텐츠 동작 방식

콘텐츠는 두 층으로 이해하면 됩니다.

1. `src/content/**`
   - authored 원본 콘텐츠
2. `src/content/state/content-state.json`
   - 어드민 변경사항이 반영된 최종 상태

`src/features/content/contentState.server.ts`가 이 파일을 읽고 쓰며, 관리자 화면은 `/api/admin/content/state`를 통해 이 상태를 갱신합니다.

## Source Of Truth

콘텐츠 관련 작업에서는 아래 기준을 우선합니다.

- 최종 콘텐츠 상태: `src/content/state/content-state.json`
- 콘텐츠 상태 읽기/쓰기: `src/features/content/contentState.server.ts`
- 카테고리/메뉴 정의: `src/features/content/config.ts`
- 퍼블릭 메뉴/푸터 카피: `src/constants/navigation.ts`

## SEO 동작 방식

- 콘텐츠 상태와 달리 SEO 설정은 현재 `src/features/seo/clientStore.ts` 기준으로 브라우저 `localStorage`를 사용합니다.
- 따라서 기존 README의 "관리자 콘텐츠와 SEO 일부가 localStorage 기반" 설명 중 콘텐츠 부분은 현재 기준으로 틀리고, SEO 쪽만 맞습니다.

SEO 관련 작업에서는 아래 기준을 우선합니다.

- 클라이언트 저장소: `src/features/seo/clientStore.ts`
- 현재 SEO 상태는 브라우저 `localStorage` 의존이 있습니다.

## 라우팅 규칙

`next.config.ts` 기준 핵심 규칙은 다음과 같습니다.

- `/` 요청은 `/en`으로 rewrite 됩니다.
- locale이 없는 퍼블릭 경로는 기본적으로 `/en/*`로 rewrite 됩니다.

주의:

- 퍼블릭 경로를 수정할 때는 `getLocalePath()`, `getPublicListHref()`, `getPublicDetailHref()` 같은 경로 생성 함수와 함께 확인합니다.
- rewrite를 수정할 때는 `public/` 정적 자산 요청까지 함께 점검해야 합니다.

## 법무 문서

개인정보처리방침 버전 파일은 아래 경로에서 관리합니다.

- `src/content/legal/privacy-policy/en`
- `src/content/legal/privacy-policy/ko`

현재 `ja`는 별도 원문 폴더가 없고 영어 버전을 fallback으로 사용합니다.

## 작업 시 기준

- 작업 시작 전에 아래 파일을 우선 확인합니다.
  - `README.md`
  - `next.config.ts`
  - `src/features/content/config.ts`
  - `src/constants/navigation.ts`
  - 관련 도메인의 `src/app/*`, `src/components/pages/*`, `src/features/*`
- UI 변경은 먼저 `src/components/common`, `src/components/layout`, `src/components/sections`에서 재사용 가능한 패턴이 있는지 확인합니다.
- 퍼블릭 메뉴와 Footer 카피는 `src/constants/navigation.ts`를 우선 확인합니다.
- 카테고리명, 경로, 메뉴 구성은 하드코딩하지 말고 `src/features/content/config.ts`, `src/constants/*`에 이미 정의가 있는지 먼저 확인합니다.
- 콘텐츠 관련 변경은 `src/content/**`와 `src/content/state/content-state.json`이 함께 영향받는지 확인합니다.
- 먼저 기존 패턴을 찾고, 그다음 수정합니다.
- 이미 공용 컴포넌트가 있으면 새 컴포넌트를 만들기 전에 재사용 가능성을 확인합니다.
- 범위를 벗어나는 리팩터링은 사용자 요청이 없으면 하지 않습니다.
- 기존 구조를 바꿔야 한다면, 왜 필요한지 먼저 근거를 확인합니다.

## 작업 체크리스트

콘텐츠 작업:

- 어떤 섹션인지 확인
  - `demo`
  - `documentation`
  - `news`
- 어떤 카테고리인지 확인
- 원본 콘텐츠 변경인지, 최종 상태 변경인지 구분
- `src/content/**`와 `src/content/state/content-state.json` 중 어디가 영향을 받는지 확인
- 관리자 화면과 퍼블릭 화면이 같은 데이터를 읽는지 확인

UI 작업:

- 먼저 `src/components/common`
- 그다음 `src/components/layout`
- 그다음 `src/components/sections`
- 마지막으로 `src/components/pages`

스타일 수정 시에는 아래를 우선 확인합니다.

- `src/styles/globals.css`
- 기존 Tailwind 유틸리티
- 반복되는 시각 패턴의 공통화 가능성

## 빠른 진단 포인트

- 이미지나 다운로드 경로가 깨지면 `public/` 실제 파일 위치, 콘텐츠 데이터, `next.config.ts` rewrite, 실제 브라우저 요청 URL을 같이 확인합니다.
- 관리자에서 콘텐츠가 안 보이면 `/api/admin/content/state`, `src/content/state/content-state.json`, `src/features/content/clientStore.ts` 흐름을 먼저 확인합니다.
- SEO 이상 동작은 `src/features/seo/clientStore.ts`와 브라우저 `localStorage` 상태를 먼저 의심하는 편이 맞습니다.
