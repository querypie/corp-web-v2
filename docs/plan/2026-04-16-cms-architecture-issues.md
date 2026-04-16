# CMS 아키텍처 검토 항목

**작성일**: 2026-04-16  
**목적**: CMS 완성 전 구조적 문제점 검토 및 대안 정리. 구현 방향은 이 문서를 기반으로 별도 결정한다.

---

## 검토 항목 1 — content-state.json의 역할 문제

### 현황

Admin에서 콘텐츠를 저장할 때 두 곳에 동시 기록된다.

- `cnt_*/meta.json`, `cnt_*/*.html`, `cnt_*/*.tiptap.json` (개별 파일, `saveAuthoredContent`)
- `src/content/state/content-state.json` (단일 파일, `upsertContentState`)

읽기 시에는 `content-state.json`이 개별 파일보다 우선순위가 높게 merge되어, 사실상 `content-state.json`이 de facto SoT로 동작한다. 개별 파일은 "초기 시드" 역할에 머문다.

### 제약 및 문제점

- **파일 크기**: 160개 항목의 전체 본문을 단일 파일에 저장. 현재 ~13MB.
  - `bodyHtml` 6.6MB + `bodyRichText` 10.4MB (동일 본문을 HTML·Tiptap JSON 두 포맷으로 중복 저장)
  - 언어별(en/ko/ja)로 각 포맷이 저장되므로 항목당 본문 복사본 최대 6개
- **git diff 노이즈**: 어떤 콘텐츠 하나를 수정해도 13MB 파일 전체가 diff에 포함됨
- **읽기 비효율**: 항목 하나를 조회할 때도 전체 파일을 로드·파싱 후 필터링
- **이중 기록의 불일치 위험**: 두 저장소 간 sync가 어긋날 경우 어느 쪽이 맞는지 판단 기준 없음

### 대안

**대안 A — 개별 파일을 SoT로 전환, content-state.json 제거**

`saveAuthoredContent`(개별 파일 기록)만 유지하고, `content-state.json` 쓰기·읽기를 제거한다. 읽기 경로는 `readAuthoredManagedContents`만 사용한다.

- 장점: 이중 기록 제거, git diff가 항목 단위로 명확해짐, 파일 크기 문제 해소
- 단점: `content-state.json`과 개별 파일 간 현재 동기화 상태 먼저 검증 필요, 마이그레이션 확인 후 삭제

**대안 B — content-state.json을 읽기 캐시로만 사용**

쓰기는 개별 파일에만 하고, `content-state.json`은 빌드 시 또는 서버 시작 시 개별 파일로부터 생성되는 캐시 파일로 역할을 재정의한다.

- 장점: 기존 읽기 경로 변경 최소화
- 단점: 캐시 무효화 전략이 필요하고, 파일 크기·git diff 문제는 여전히 존재

**대안 C — 외부 경량 DB 도입 (SQLite 등)**

파일시스템 대신 SQLite(또는 Turso 등 libSQL)로 콘텐츠를 관리한다.

- 장점: 항목 단위 쿼리·업데이트 가능, 파일 크기 문제 없음, 동시성 안전
- 단점: git으로 콘텐츠 버전 관리가 어려워짐, 인프라 의존성 추가, 현재 구조와 가장 큰 변경 폭

---

## 검토 항목 2 — SEO 설정의 localStorage 의존

### 현황

Admin의 SEO 설정이 `window.localStorage`에만 저장된다. (`src/features/seo/clientStore.ts` 전체가 `localStorage` 기반)

SEO 기본값은 `src/features/seo/data.ts`의 `seoPageDefinitions`에 코드로 하드코딩되어 있으며, Admin에서 수정한 값은 해당 브라우저의 `localStorage`에만 존재한다.

### 제약 및 문제점

- **크롤러 미반영**: `<title>`, `<meta description>`, OG 태그는 서버 렌더링 HTML에 포함되어야 Google 등 크롤러에 반영된다. 서버는 `localStorage`를 읽을 수 없으므로 Admin에서 수정한 SEO 설정이 실제 배포 페이지에 반영되지 않는다.
- **휘발성**: 브라우저·기기별로 독립적이어서, 다른 컴퓨터에서 Admin 접속 시 설정이 없다. `localStorage` 초기화 시 설정 소실.
- **현재 동작**: 페이지의 `generateMetadata`는 `localStorage`를 읽지 않고 하드코딩된 기본값을 사용하고 있을 가능성이 높다. Admin SEO 편집 기능이 사실상 동작하지 않는 상태.

### 대안

**대안 A — 서버 파일로 저장**

콘텐츠(`cnt_*`)와 동일한 방식으로 SEO 설정을 서버 파일에 저장하고, 페이지 `generateMetadata`에서 서버 파일을 읽어 메타태그를 생성한다.

- 예: `src/content/seo/seo-state.json` 또는 `content/seo/seo-state.json`
- 장점: git으로 버전 관리 가능, 구조가 콘텐츠와 일관적
- 단점: 파일 기반 저장의 공통 문제(Vercel 쓰기 제한 등)를 동일하게 가짐

**대안 B — SEO Admin 편집 기능 제거, 코드로만 관리**

`seoPageDefinitions` 하드코딩을 유일한 SEO 소스로 인정하고, SEO 수정은 코드 변경 + 배포로만 처리한다. Admin SEO 편집 UI는 제거한다.

- 장점: 구현 복잡도 없음, SEO 변경이 git 이력에 명확히 남음
- 단점: 비개발자가 SEO를 수정할 수 없음, 현재 Admin UI 기능 손실

---

## 검토 항목 3 — 콘텐츠 디렉토리가 src/ 안에 위치

### 현황

런타임에 읽고 쓰는 콘텐츠 데이터 파일(`src/content/`)이 Next.js 소스 디렉토리(`src/`) 안에 위치한다.

### 제약 및 문제점

- **Next.js 파일 워처 간섭**: Next.js dev server는 `src/` 하위 파일 변경을 감지해 서버를 재시작(HMR)한다. Admin에서 저장할 때마다 `content-state.json`(13MB) 변경이 감지되어 서버가 재시작되고, 잠깐 응답이 끊기며 인메모리 캐시가 초기화된다.
- **Vercel 쓰기 제한**: Vercel 배포 환경에서 `process.cwd()` 하위 경로(`src/content/`)는 읽기 전용이다. Admin의 파일 쓰기 API가 Vercel에서 동작하지 않으며, CMS 편집 기능은 로컬 개발 환경에서만 동작한다.
- **소스 코드와 데이터의 혼재**: 버전 관리 대상인 소스 코드와 런타임 데이터가 같은 디렉토리에 섞여 있어 역할 구분이 불명확하다.

### 대안

**대안 A — next.config.ts watchOptions로 src/content/ 감시 제외**

Next.js의 `watchOptions.ignored` 설정으로 `src/content/`를 파일 워처 대상에서 제외한다.

- 장점: 최소한의 변경으로 dev 서버 재시작 문제 해결
- 단점: Vercel 쓰기 제한 문제는 해결되지 않음. 근본 원인(소스·데이터 혼재)은 그대로.

**대안 B — 콘텐츠 디렉토리를 src/ 바깥으로 이동**

`src/content/` → `content/`(프로젝트 루트)로 이동한다. 소스 코드와 런타임 데이터를 명확히 분리한다.

- 장점: 파일 워처 간섭 해소, 역할 구분 명확, 향후 Vercel 외 환경 대응 시 유연성
- 단점: `process.cwd()` 기준 경로를 사용하는 코드 전반 수정 필요, Vercel 쓰기 제한 문제는 여전히 존재

**대안 C — 현재 구조 유지**

`src/content/` 위치를 그대로 두고, dev 서버 재시작 문제를 감수한다.

- 장점: 변경 없음
- 단점: 로컬 개발 시 Admin 편집마다 서버 재시작 발생. Vercel 배포 후 CMS 편집 불가 상태 지속.

---

## 관련 문서

- [CMS 완성 계획](./2026-04-15-corp-web-v2-cms-completion-design.md)
