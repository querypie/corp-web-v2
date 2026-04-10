# CMS Renewal

Next.js 기반의 퍼블릭 웹사이트와 관리자 CMS를 함께 관리하는 프로젝트입니다.

## Overview

이 프로젝트는 두 영역으로 구성됩니다.

- Public site
  - 다국어(`en`, `ko`, `ja`) 기반 퍼블릭 페이지
  - Home / Demo / Documentation / News / Plans
  - About Us / Certifications / Contact Us
- Admin CMS
  - 콘텐츠 생성, 수정, 임시저장, 게시 상태 관리
  - Demo / Documentation / News 관리
  - SEO 설정 관리

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## Run Locally

```bash
npm install
npm run dev
```

Type check:

```bash
npm run typecheck
```

## Project Structure

- `src/app/[locale]`
  - 퍼블릭 라우트
  - `about-us`, `certifications`, `contact-us`, `demo`, `docs`, `news`, `plans`
- `src/app/admin`
  - 관리자 라우트
  - `demo`, `documentation`, `news`, `seo`
  - 공통 리스트/상세 기반의 관리 화면 사용
- `src/app/api/admin/seo`
  - SEO 관리용 보조 API
- `src/components/common`
  - 버튼, 입력, 셀렉트, 탭, reveal 등 공통 UI
- `src/components/layout`
  - GNB, Footer, AdminShell 등 공통 레이아웃
- `src/components/sections`
  - 페이지를 구성하는 섹션 단위 UI
- `src/components/pages`
  - 실제 라우트에서 사용하는 페이지 단위 컴포넌트
- `src/features`
  - 콘텐츠, SEO 등 도메인별 상태/모델/스토어
- `src/constants`
  - 여러 파일에서 공유되는 정적 상수
- `src/styles`
  - 전역 스타일 및 타이포 유틸리티

## Styling Guide

- 스타일은 기존 디자인 토큰과 Tailwind 유틸리티를 우선 사용합니다.
- 임의의 px 값은 꼭 필요한 경우에만 사용하고, 가능하면 기존 spacing / radius / color 토큰에 맞춥니다.
- 타이포는 `src/styles/globals.css`의 `type-*` 유틸리티를 우선 사용합니다.
- 색상 토큰은 `src/styles/globals.css`의 CSS 변수와 `tailwind.config.ts` 토큰을 함께 기준으로 사용합니다.
- 반복되는 hover / focus / card 스타일은 공용 유틸리티 또는 공용 컴포넌트로 정리합니다.

### Shared UI Patterns

- 카드 hover 배경은 `card-hover` 유틸리티를 우선 사용합니다.
- 퍼블릭 컨텐츠 카드 제목 hover 색상은 `content-hover-title` 유틸리티를 우선 사용합니다.
- 입력 계열 포커스 스타일은 `ui-field`, `ui-field-shell` 유틸리티를 우선 사용합니다.

## Icons

- 가능한 경우 `/public/icons`의 SVG 자산을 재사용합니다.
- 여러 곳에서 반복 사용되는 아이콘은 `src/components/common/`의 독립 컴포넌트로 분리합니다.
- SVG 코드를 직접 인라인으로 넣는 경우는 재사용성 또는 접근성 이유가 명확할 때만 허용합니다.

## Naming

- 파일명과 컴포넌트명은 `PascalCase`를 사용합니다.
- 훅은 `useCamelCase` 형식을 사용합니다.
- 상수는 의미가 명확한 이름을 사용하고 필요 이상 축약하지 않습니다.

## Data Rules

- 한 파일 내부에서만 사용하는 데이터는 해당 파일 안에 둡니다.
- 여러 컴포넌트/페이지에서 공유되는 정적 데이터만 `src/constants/`로 분리합니다.
- 도메인 로직과 저장 구조는 가능하면 `src/features/` 아래에 둡니다.
- 콘텐츠 관리 로직은 `src/features/content`를 단일 소스로 유지합니다.
- SEO 관리 로직은 `src/features/seo` 아래에 둡니다.

## Content Architecture

- 퍼블릭 Demo / Documentation / News는 공통 콘텐츠 모델을 사용합니다.
- 어드민 Demo / Documentation / News도 공통 리스트/상세 페이지를 재사용합니다.
- 카테고리별 제목, 설명, 경로 메타는 가능한 한 `src/features/content/config.ts`에서 관리합니다.
- 다국어 콘텐츠는 locale별 필드를 저장하고 퍼블릭에서 현재 locale 기준으로 읽습니다.
- 최종 콘텐츠 source of truth는 `src/content/state/content-state.json` 입니다.
- 파일 기반 authored 콘텐츠는 `src/content/{demo,documentation,news}` 아래에서 관리합니다.

## Comment Rules

- 주석은 한글로 작성합니다.
- 구현 의도, 예외 처리 이유, 구조 판단 근거가 필요한 부분에만 추가합니다.
- 코드가 그대로 설명하는 내용은 주석으로 반복하지 않습니다.

## Change Rules

- 기존 패턴이 있는 화면은 새 스타일을 임의로 만들지 말고 기존 패턴을 우선 따릅니다.
- 공통으로 쓰일 가능성이 있는 UI/로직은 먼저 재사용 가능한 구조인지 검토합니다.
- 새로운 페이지나 관리 기능을 추가할 때는 퍼블릭/어드민/데이터 구조가 함께 맞물리는지 확인합니다.

## Menu Updates

- GNB 상단 메뉴명과 실제 Footer 메뉴명은 `src/constants/navigation.ts`의 `getShellMenuCopy()`에서 공통으로 관리합니다.
- 따라서 다음 항목을 수정하려면 `getShellMenuCopy()`를 먼저 봅니다.
  - 상단 GNB 1차 메뉴명
  - Footer 섹션 제목
  - Footer 섹션 하위 메뉴명
  - 404 페이지에서 사용하는 GNB / Footer 메뉴명
- GNB 드롭다운 하위 메뉴명은 같은 파일의 아래 함수에서 관리합니다.
  - `getSolutionsSubItems()`
  - `getFeaturesSubItems()`
  - `getCompanySubItems()`
- 메뉴 링크 경로는 같은 파일의 아래 함수에서 관리합니다.
  - `getPrimaryNavHref()`
  - `getFooterHref()`
  - `getLegalHref()`
- 메뉴명을 수정할 때는 아래를 함께 확인합니다.
  - `en`, `ko`, `ja` 라벨이 모두 맞는지
  - GNB 1차 메뉴와 Footer 메뉴가 같은 용어를 쓰는지
  - 드롭다운 하위 메뉴명과 Footer 하위 메뉴명이 의도적으로 다른지, 아니면 통일해야 하는지
  - 라벨 변경 후 링크 매핑 조건도 함께 수정해야 하는지

## Notes

- 현재 관리자 콘텐츠와 SEO 설정 중 일부는 브라우저 저장소(`localStorage`) 기반으로 동작합니다.
- SEO는 현재 런타임 메타 반영 방식으로 연결되어 있습니다.
- 새 퍼블릭 페이지가 추가되면 SEO 메뉴의 `미등록 페이지 탐색` 또는 `고급 정의 편집` 흐름도 함께 점검합니다.

## Legal Pages

### Privacy Policy Versioning

- 개인정보처리방침 원본은 `src/content/legal/privacy-policy/` 아래에서 버전별 HTML 파일로 관리합니다.
  - 영어 원본: `src/content/legal/privacy-policy/en`
  - 한국어 원본: `src/content/legal/privacy-policy/ko`
- 앱은 각 버전의 `.html` 파일을 직접 읽어 렌더링합니다.
  - 예: `src/content/legal/privacy-policy/en/26-01-15.html`
  - 예: `src/content/legal/privacy-policy/ko/26-01-15.html`
- 일본어(`ja`) 로케일은 별도 원문을 두지 않고 영어 버전을 fallback으로 사용합니다.
- 새 버전 추가 방법:
  - 가장 최근 버전 파일을 복사해 새 날짜 파일을 만듭니다.
  - 변경된 문구만 수정합니다.
  - 예: `26-01-15.html`을 복사해 `26-03-01.html` 생성
- 새 `.html` 파일이 추가되면 아래가 자동으로 갱신됩니다.
  - 최신 개인정보처리방침 페이지: `/[locale]/privacy-policy`
  - 과거 버전 페이지: `/[locale]/privacy-policy/[version]`
  - 헤더 우측 버전 셀렉트 옵션
