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
- 글로벌 공개 URL은 locale prefix를 사용합니다. 예: `/en/platforms/aip`. 일본 도메인은 `/platforms/aip`, `/solutions/ai-crew`처럼 prefix 없이 일본어 페이지를 표시합니다.
- locale 없는 public path는 글로벌 도메인에서 `/en/...`으로 redirect합니다. 일본 도메인에서는 주소를 유지하고 내부적으로 `/ja/...`를 렌더링합니다. 루트(`/`)의 언어 선택은 아래 정책을 따릅니다.
- 콘텐츠 legacy redirect: `src/features/content/legacyRedirects.ts`, `next.config.ts`

### 일본 / 글로벌 사이트 운영 정책

| 구분 | 도메인 | 언어 | GNB 언어 선택 | 언어 추천 배너 |
|------|--------|------|---------------|----------------|
| 일본 사이트 | `https://querypie.ai` | 일본어 | 숨김 | 숨김, 추천 API 호출 생략 |
| 글로벌 사이트 | `https://www.querypie.com` | 영어·한국어 | 영어·한국어만 표시 | 영어·한국어만 추천·선택 |

- 일본 도메인의 `/`는 주소 변경 없이 일본어 홈을 표시합니다. `/solutions/ai-crew`는 내부적으로 `/ja/solutions/ai-crew`를 렌더링합니다. `/ja/...`, `/en/...`, `/ko/...`으로 직접 접근하면 locale prefix 없는 경로로 영구 리디렉션하며 쿼리스트링을 유지합니다. `www.querypie.ai`에도 같은 규칙을 적용합니다.
- 글로벌 루트(`/`)는 저장된 영어·한국어 선택을 우선하고, 없으면 브라우저의 지원 언어를 사용합니다. 일본어는 자동 선택·추천에서 제외하며, 지원 언어가 없으면 영어를 사용합니다.
- 일본어 화면에서는 도메인과 관계없이 GNB 언어 선택과 언어 추천 배너를 숨깁니다. 기존 `/ja` 경로는 로컬·Preview·글로벌 도메인에서도 직접 확인할 수 있습니다.
- 사이트 내부 이동은 현재 도메인을 유지합니다. GNB·푸터는 상대 경로를 사용하며, CMS 본문과 AI 채팅 출처의 `querypie.com`·`querypie.ai` 절대 링크도 렌더링 시 현재 도메인·언어의 상대 경로로 변환합니다. 로그인·외부 문서·SNS 등 다른 서비스 링크는 원래 목적지로 이동합니다.
- 도메인 리디렉션은 `next.config.ts`, 자동 언어 선택은 `src/features/routing/localePreference.ts`, 본문·출처 링크 변환은 `src/features/routing/siteLinks.ts`에서 관리합니다.
- 운영 적용 시 Vercel 담당자가 `querypie.ai`와 `www.querypie.com`을 이 앱의 Production 배포에 연결해야 합니다. 일본 도메인을 글로벌 도메인으로 보내는 Vercel 리디렉션은 설정하지 않습니다. 상세 연결 지침은 [Vercel 배포 문서](docs/reference/vercel-deployment.md)를 참고합니다.

### GNB / 푸터 메뉴

- 공통 메뉴 순서는 **플랫폼 → 데모 → 리소스 → 회사 → 가격·플랜**입니다. 일본어에서는 **플랫폼 → 솔루션 → 데모 → 리소스 → 회사** 순서로 표시합니다.
- 플랫폼에는 AIP, ACP, FDE 서비스를 배치합니다. 기본 경로는 `/platforms/aip`, `/platforms/acp`, `/platforms/aip/fde-services`이며 AIP·ACP의 하위 페이지도 `/platforms` 아래에 둡니다.
- 솔루션 메뉴는 일본어에만 표시하며 AI Crew, AI Dashi, AS/400·COBOL을 포함합니다. 경로는 `/solutions/ai-crew`, `/solutions/ai-dashi`, `/solutions/as400-cobol`을 유지합니다.
- 기존 `/solutions/aip...`·`/solutions/acp...` 주소는 새 `/platforms/...` 주소로 영구 리디렉션합니다. 글로벌 도메인은 `/en`·`/ko` prefix를 유지하고, 일본 도메인은 prefix를 숨깁니다.
- 메뉴 구성은 `src/constants/navigation.ts`, 플랫폼 경로는 `src/features/platforms/routes.ts`, 솔루션 경로는 `src/features/solutions/routes.ts`에서 관리합니다.

플랫폼·솔루션 폴더는 공개 경로와 같은 기준으로 분리합니다.

```text
src/app/[locale]/
├── platforms/          # AIP·ACP 및 하위 페이지, 플랫폼 route 테스트
└── solutions/          # AI Crew·AI Dashi·COBOL, 솔루션 route 테스트
src/components/pages/
├── platforms/
│   ├── aip/            # FDE·MCP Gateway·LLM·통합 포함
│   ├── acp/
│   └── common/         # 플랫폼 본문 공통 렌더링 컴포넌트
└── solutions/japan/    # AI Crew·AI Dashi·COBOL 컴포넌트
src/features/
├── platforms/routes.ts
└── solutions/routes.ts
public/assets/pages/
├── platforms/          # AIP·ACP 이미지, 영상 및 통합 로고
└── solutions/          # AI Crew·AI Dashi·COBOL 전용 자산
```

기존 `/assets/products/...`와 `/assets/platforms/...` 자산 URL은 `/assets/pages/platforms/...`로 영구 리디렉션합니다.

### 일본어 홈 구성 방침

- `/en`, `/ko` 홈은 공통 `src/components/pages/home/HomePage.tsx`를 사용합니다.
- `/ja` 홈은 일본 시장에 맞춘 별도 `src/components/pages/home/japan/JapanHomePage.tsx`로 구성합니다.
- locale별 홈 연결은 `src/app/[locale]/page.tsx`에서 수행하며 `/ja` URL과 공통 GNB·Footer 구조를 유지합니다. 언어 선택 UI는 위 사이트 운영 정책을 따릅니다.
- 일본어 홈 전용 섹션은 `src/components/pages/home/japan`, 정적 문구와 metadata copy는 `src/copy/homeJapan.ts`, CMS 조회와 데이터 조합은 필요할 때 `src/features/home/japanPageData.ts`에 둡니다.
- 공통 UI와 재사용 가능한 섹션은 기존 컴포넌트를 사용하되, 일본어 홈의 서로 다른 레이아웃을 공통 `HomePage`의 조건문으로 누적하지 않습니다.

---

## SEO

SEO 메타데이터와 OG 이미지는 `src/features/seo`에서 관리합니다.

- 메타데이터 생성: `src/features/seo/metadata.ts`
- OG 이미지: `src/features/seo/ogImage.tsx`
- OG 제목 포맷: `src/features/seo/ogTitle.ts`

---

## 홈페이지 AI 챗봇

공식 사이트에서 질문과 관련된 페이지의 최신 본문을 읽고, 근거 페이지 링크를 출처로 표시합니다. 회사 홈페이지 출처는 현재 도메인·언어의 상대 경로로 변환하고, 외부 서비스 출처는 절대 URL을 유지합니다. 문서 본문을 파일이나 데이터베이스에 사전 저장하지 않습니다.

### 공식 출처 관리

상위 URL은 **`src/features/ai-chat/sources.ts`의 `chatSources` 한곳**에서 관리합니다. 수집과 출처 링크 검증이 같은 설정을 사용합니다.

| 출처 | 상위 URL |
|------|----------|
| 회사 홈페이지 | `https://www.querypie.com` |
| AIP 문서 | `https://aip-docs.app.querypie.com` |
| ACP 문서 | `https://docs.querypie.com` |
| Lingo | `https://lingo.querypie.ai` |

출처를 추가하거나 변경할 때 이 설정의 `product`, `url`을 수정하고 재배포합니다. 실제 운영 중인 HTTPS 공개 주소를 사용합니다. 회사 홈페이지도 로컬·Preview 주소가 아닌 위 공식 주소를 읽으므로, 아직 공식 사이트에 배포하지 않은 변경은 답변에 반영되지 않습니다. NotePie·CorpNavi는 현재 회사 홈페이지에서 발견되는 자료만 사용합니다.

### 페이지 발견 및 답변 흐름

1. 각 사이트의 `/sitemap.xml`과 locale별 홈의 내부 링크에서 하위 페이지를 발견합니다. 사이트맵 인덱스도 따라갑니다.
2. URL·제목만 서버 인스턴스 메모리에 1시간 동안 보관합니다. 만료 후 다음 질문에서 다시 발견하므로 사이트맵·내부 링크에 연결된 새 페이지가 자동 추가됩니다. 별도 cron이나 영구 저장소는 없으며 서버 재시작 시 다시 수집합니다.
3. 최근 사용자 질문 3개의 제품명·키워드와 언어를 바탕으로 관련 URL을 최대 8개 선택합니다.
4. 선택한 페이지를 `cache: no-store`로 다시 읽고 관련 본문 최대 8개와 최근 대화 최대 8개를 모델에 전달합니다. 본문은 해당 요청에서만 사용합니다.
5. 모델이 사용한 근거의 출처 링크를 답변에 표시합니다. 근거가 없으면 확인할 수 없다고 안내하며 과거 스냅샷으로 대체하지 않습니다.

탐색은 사이트·언어별 최대 사이트맵 8개, HTML 페이지 10개, URL 1,500개로 제한합니다. 사이트맵·링크에 없는 페이지, 제한을 초과한 영역, 로그인이나 JavaScript 실행이 필요한 본문은 발견·조회되지 않을 수 있습니다. 검색은 URL·제목 기반 키워드 방식이므로 본문에만 등장하는 주제를 놓칠 수 있습니다. 첫 질문과 목록 갱신 시에는 탐색으로 응답 시간이 늘어납니다.

등록된 공식 도메인만 읽으며 리다이렉트도 매 단계 검증합니다. 수집 제한 시간은 12초, 답변용 페이지 조회는 페이지당 7초, 응답 크기는 3MB입니다. 일부 페이지 조회 실패 시 읽기에 성공한 자료만 사용합니다. URL 목록 전체 갱신 실패 시 이전 URL 목록을 재사용하되 본문은 다시 조회합니다.

### 현재 어뷰징 방지

- 챗봇 API는 서버 인스턴스당 60초에 최대 30회, 동시 처리 최대 3개로 제한하며 초과 시 HTTP 429를 반환합니다. 문서 탐색·모델 호출 전에 적용합니다.
- 최신 질문은 최대 2,000자, 전달 대화는 최대 8개(메시지당 6,000자), 요청 본문은 최대 64,000바이트로 제한합니다.
- JSON 요청만 받으며, `Origin` 헤더가 있을 때 API와 다른 origin이면 차단합니다. 헤더가 없는 직접 호출까지 막는 인증 기능은 아닙니다.

현재 제한은 인스턴스 메모리 기준의 간단한 보호입니다. IP별 제한·서버 간 공유 카운터·일일 전체 한도·CAPTCHA는 없습니다. 키 없는 Preview에서는 동시 처리 제한이 서버의 근거 준비까지만 적용되며 브라우저의 모델 호출은 포함하지 않습니다.

### 실행 설정 및 구현

| 환경 변수 | 용도 |
|-----------|------|
| `AI_CHAT_ENABLED` | `true`로 챗봇 활성화 |
| `AI_CHAT_BASE_URL` | 모델 API의 base URL |
| `AI_CHAT_MODEL` | 사용할 모델 이름 |
| `AI_CHAT_API_KEY` | 필요할 경우 모델 인증 키, 서버에서만 관리 |

일반 환경은 명시적 설정이 필요합니다. `VERCEL_TARGET_ENV=preview`에서는 `src/features/ai/config.server.ts`의 사내 테스트 모델 기본값을 사용합니다. 기존 키 없는 Preview 전송 방식에서도 공식 페이지 조회는 서버가 수행하고 모델 요청만 직원 브라우저에서 수행합니다. 배포 서버에서 공식 사이트로의 HTTPS 접근이 가능해야 합니다.

- URL 발견·본문 조회: `src/features/ai-chat/liveKnowledge.server.ts`
- 관련 문단 검색: `src/features/ai-chat/knowledge.ts`
- 답변 프롬프트·모델 호출: `src/features/ai-chat/answer.server.ts`
- API: `src/app/api/ai-chat/route.ts`
- 검증: `npx vitest run src/features/ai-chat src/app/api/ai-chat`
- 실제 공식 사이트 접속 검증(선택): `AI_CHAT_LIVE_SMOKE=1 npx vitest run src/features/ai-chat/liveKnowledge.smoke.test.ts`

기존 `knowledge.snapshot.json`과 `chat:collect-knowledge` 수동 수집 명령은 제거했습니다.

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
