# corp-web-v2

## 프로젝트 개요

- QueryPie 회사 홍보·소개 웹사이트
- Next.js App Router 기반 다국어 사이트
- 지원 locale: `en`, `ko`, `ja`
- 주요 공개 영역: Product, Features, Demo, Resources, Company, Plans, Legal
- Admin CMS: Demo / Resources / News 콘텐츠 편집·게시

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
├── content/            # demo, resources, news, legal 콘텐츠
├── constants/          # i18n, navigation, plans, legal 등
├── public/assets/      # 이미지, mockup asset 등 정적 리소스
└── styles/             # 전역 스타일
```

---

## 콘텐츠 구조

Admin 진입점: `/admin`

관리형 콘텐츠는 `src/content/{demo,resources,news}/**/cnt_xxxxxx/` 아래 파일로 저장됩니다.

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
- 사이트 도메인과 locale 라우팅의 유일한 명세는 [사이트 도메인 라우팅](docs/reference/site-domain-routing.md)을 따릅니다.
- 콘텐츠 legacy redirect: `src/features/content/legacyRedirects.ts`, `next.config.ts`

### GNB / 푸터 메뉴

- 공통 메뉴 순서는 **플랫폼 → 데모 → 리소스 → 회사 → 가격·플랜**입니다. 일본어에서는 **플랫폼 → 솔루션 → 데모 → 리소스 → 회사** 순서로 표시합니다.
- 플랫폼에는 AIP, ACP, FDE 서비스를 배치합니다. 기본 경로는 `/platforms/aip`, `/platforms/acp`, `/platforms/aip/fde-services`이며 AIP·ACP의 하위 페이지도 `/platforms` 아래에 둡니다.
- 솔루션 메뉴는 일본어에만 표시하며 AI Crew, AI Dashi, AS/400·COBOL을 포함합니다. 경로는 `/solutions/ai-crew`, `/solutions/ai-dashi`, `/solutions/as400-cobol`을 유지합니다.
- 기존 `/solutions/aip...`·`/solutions/acp...` 주소는 새 `/platforms/...` 주소로 영구 리디렉션합니다.
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

현재 제한은 인스턴스 메모리 기준의 간단한 보호입니다. IP별 제한·서버 간 공유 카운터·일일 전체 한도·CAPTCHA는 없습니다. 동시 처리 제한은 공식 자료 조회부터 Gateway 응답 처리까지 적용됩니다.

### 실행 설정 및 구현

| 환경 변수 | 용도 |
|-----------|------|
| `AI_CHAT_ENABLED` | `true`로 챗봇 활성화 |
| `AI_CHAT_API_KEY` | AI Gateway Key, Vercel의 서버 전용 비밀 환경변수 |

API 주소와 모델은 서버 전용 `src/features/ai/config.server.ts`의 이름 있는 상수로 고정합니다.

| 코드 상수 | 값 |
|-----------|----|
| `AI_CHAT_BASE_URL` | `https://ai-gateway.stg.querypie.com/v1` |
| `AI_CHAT_MODEL` | `querypie-internal/glm53-flash/glm-5.3-flash` |

브라우저는 `/api/ai-chat`에 질문을 보내고 답변과 출처를 받습니다. 공식 페이지 조회와 Gateway의 `/chat/completions` 호출은 Vercel 서버에서 수행합니다. 모든 환경에서 `AI_CHAT_ENABLED=true`와 API 키가 필요하며, 미설정 시 API는 `503 NOT_CONFIGURED`를 반환합니다. Preview에는 기존 Stage용 AI 설정을 공통으로 등록하고 재배포합니다. CMS 번역 설정은 `CMS_TRANSLATION_*`로 별도 관리합니다.

환경은 Development, Preview(= Stage = Staging), Production 세 가지로 구분합니다. Preview의 PR 배포와 `main` 배포는 모두 같은 Stage Gateway Key를 사용합니다. `AI_CHAT_BASE_URL`과 `AI_CHAT_MODEL`은 환경변수로 등록하지 않고 위 코드 상수를 사용합니다.

| Vercel 등록 위치 | `AI_CHAT_API_KEY` 출처 | 등록 타입 | `AI_CHAT_ENABLED` |
|-------------|------------------------|-----------|-------------------|
| Development | 1Password `corp-web-v2 AI Chat`의 `corp-web-v2-development` | encrypted | `true` |
| Preview (= Stage = Staging, main 및 PR) | 1Password `corp-web-v2 AI Chat`의 `corp-web-v2-stage` | sensitive | `true` |
| Production | 1Password `corp-web-v2 AI Chat`의 `corp-web-v2-production` | sensitive | `false` |

Development는 로컬 pull을 위해 `encrypted`로 등록합니다. Vercel은 Development에서 `sensitive` 타입을 지원하지 않습니다. [공식 문서](https://vercel.com/docs/environment-variables/sensitive-environment-variables)

로컬 개발은 Vercel Development 환경 값을 사용합니다. 기존 `.env.local`을 덮어쓰지 않으려면 임시 gitignored 파일로 받은 뒤 필요한 두 줄만 병합합니다.

```bash
vercel env pull .env.vercel-development.local --environment=development
```

그 다음 임시 파일의 `AI_CHAT_ENABLED`와 `AI_CHAT_API_KEY`만 `.env.local`에 병합하고 임시 파일을 삭제합니다.

`.env.local`이 비어 있거나 새로 만드는 경우에는 `vercel env pull .env.local --environment=development`를 사용할 수 있습니다.

- URL 발견·본문 조회: `src/features/ai-chat/liveKnowledge.server.ts`
- 관련 문단 검색: `src/features/ai-chat/knowledge.ts`
- 답변 프롬프트·모델 호출: `src/features/ai-chat/answer.server.ts`
- API: `src/app/api/ai-chat/route.ts`
- 검증: `npx vitest run src/features/ai-chat src/app/api/ai-chat`
- 실제 공식 사이트 접속 검증(선택): `AI_CHAT_LIVE_SMOKE=1 npx vitest run src/features/ai-chat/liveKnowledge.smoke.test.ts`

기존 `knowledge.snapshot.json`과 `chat:collect-knowledge` 수동 수집 명령은 제거했습니다.

---

## 배포

| 환경 | 정규 FQDN 및 별칭 처리 | 트리거 |
|------|---------------------|--------|
| Development | `localhost:3000` | 로컬 `npm run dev` |
| Preview / Stage / Staging | main: `stage.querypie.com`, `stage-v2.querypie.com`, `stage-v2.querypie.ai`<br>PR: Vercel Preview URL | `main` push / PR open·sync |
| Production | 정규: `www.querypie.com`, `querypie.ai`<br>별칭 FQDN은 Vercel에서 정규 FQDN으로 redirect | `workflow_dispatch` |

Preview, Stage, Staging은 같은 환경을 뜻합니다.
Stage 또는 Staging 배포는 특히 `main` 브랜치의 Preview Deployment를 가리키며 위 세 고정 도메인을 사용합니다.
PR 배포는 같은 Preview 환경에서 각각의 Vercel URL을 사용합니다.
Preview에는 FQDN 정규화 redirect를 적용하지 않으며, 각 Preview FQDN을 그대로 사용합니다.
`deploy-staging.yml`은 `main` push 또는 수동 실행 시 항상 `main`을 Preview에 배포합니다.

Production은 선택한 소스 브랜치(기본 `main`)로 `release`를 먼저 갱신한 뒤 `release`를 배포합니다. 배포가 실패해도 `release`는 갱신된 상태로 남습니다.
Vercel Production Branch는 `release`로 지정하고, Git 자동 배포는 끄고 모든 배포를 GitHub Actions로 실행합니다.

상세 내용은 [Vercel 배포 문서](docs/reference/vercel-deployment.md)를 확인합니다.

---

## 관련 문서

| 문서 | 설명 |
|------|------|
| [Vercel 배포](docs/reference/vercel-deployment.md) | GitHub Actions / Vercel 배포 구조 |
| [Lead Capture Forms](docs/reference/lead-capture-forms.md) | Contact Us, Community License, 콘텐츠 게이팅 폼 흐름 |
| [Contact Us API](docs/reference/contact-us-api.md) | Contact Us 폼 API 처리, Slack/DeskPie 연동, UTM 전달 |
| [Community License](docs/reference/community-license.md) | Community License 신청·발급 API와 외부 연동 |
| [UTM Attribution](docs/reference/utm-attribution.md) | UTM 쿠키 저장과 리드폼 전달 흐름 |
