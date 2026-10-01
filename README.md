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

홈페이지는 Partner Portal의 Hermes Agent를 상담 주체로 사용합니다. 최근 대화 최대 8개를
Hermes Wrapper에 전달하고 `choices[0].message.content`를 답변으로 반환합니다.

### 책임 계약

답변의 지식, 문서 검색, 사실 정확성, 언어, 어조와 표현 방식은 Hermes Agent의 내부 설정과
동작에 의존합니다. 이 저장소는 별도의 시스템 프롬프트를 주입하거나 외부 문서를 조회하지
않으며, 답변의 완전성·품질·근거 충족 여부를 판정하지 않습니다.

웹사이트 BFF와 UI는 다음 책임만 가집니다.

- 입력 크기·형식·origin과 요청 빈도·동시성·timeout을 제한합니다.
- Partner Portal token을 브라우저에 노출하지 않고 안전한 공개 오류 코드만 반환합니다.
- Hermes 본문을 답변으로 전달하고, 본문에 포함된 Markdown 링크와 일반 HTTP(S) URL을
  최대 8개까지 `sources`로 구문적으로 정규화합니다.
- `sources`는 Hermes가 응답에 포함한 링크이며 웹사이트가 사실성이나 출처 적합성을
  검증했다는 의미가 아닙니다.
- 답변 본문의 링크를 안전한 새 창 링크로 렌더링하고 대화 세션·입력 복원 UI를 관리합니다.

BFF 응답은 `answer`, `sources`, 선택적인 `slackThreadToken`으로 구성합니다. 품질 판정값인
`answered`는 사용하지 않습니다.

### 현재 어뷰징 방지

- 챗봇 API는 서버 인스턴스당 60초에 최대 30회, 동시 처리 최대 3개로 제한하며 초과 시 HTTP 429를 반환합니다. 문서 탐색·모델 호출 전에 적용합니다.
- 최신 질문은 최대 2,000자, 전달 대화는 최대 8개(메시지당 6,000자), 요청 본문은 최대 64,000바이트로 제한합니다.
- JSON 요청만 받으며, `Origin` 헤더가 있을 때 API와 다른 origin이면 차단합니다. 헤더가 없는 직접 호출까지 막는 인증 기능은 아닙니다.

현재 제한은 인스턴스 메모리 기준의 간단한 보호입니다. IP별 제한·서버 간 공유 카운터·일일 전체 한도·CAPTCHA는 없습니다. 동시 처리 제한은 Hermes Wrapper 응답 처리까지 적용됩니다.

### 실행 설정 및 구현

| 환경 변수 | 용도 |
|-----------|------|
| `AI_CHAT_ENABLED` | `true`로 챗봇 활성화 |
| `AI_CHAT_API_KEY` | 환경별 Partner Portal token, Vercel의 서버 전용 비밀 환경변수 |

API 주소와 모델은 서버 전용 `src/features/ai/config.server.ts`의 이름 있는 상수로 고정합니다.

| 코드 상수 | 값 |
|-----------|----|
| `AI_CHAT_BASE_URL_PROD` | `https://partner-portal.app.querypie.com/api/hermes/v1` |
| `AI_CHAT_MODEL` | `querypie-product-guide` |

브라우저는 `/api/ai-chat`에 질문을 보내고 Hermes 답변과 응답에 포함된 링크를 받습니다. Partner Portal Wrapper의 `/chat/completions` 호출은 Vercel 서버에서 수행합니다. 모든 환경에서 `AI_CHAT_ENABLED=true`와 API 키가 필요하며, 미설정 시 API는 `503 NOT_CONFIGURED`를 반환합니다. CMS 번역 설정은 `CMS_TRANSLATION_*`로 별도 관리합니다.

환경은 Development, Preview(= Stage = Staging), Production 세 가지로 구분합니다. 모든 환경은 외부에서 접근 가능한 Production Partner Portal URL을 사용하되, token은 Partner Portal에서 환경별로 발급한 값을 사용합니다. Dev Partner Portal URL은 외부 인터넷에서 접근할 수 없으므로 Vercel upstream으로 사용하지 않습니다. `AI_CHAT_BASE_URL_PROD`와 `AI_CHAT_MODEL`은 환경변수로 등록하지 않고 위 코드 상수를 사용합니다.

| Vercel 등록 위치 | `AI_CHAT_API_KEY` 출처 | 등록 타입 | `AI_CHAT_ENABLED` |
|-------------|------------------------|-----------|-------------------|
| Development | `corp-web-v2-development` | encrypted | `true` |
| Preview PR | `corp-web-v2-preview` | sensitive | `true` |
| Preview Main (= Stage = Staging) | `corp-web-v2-stage` | sensitive | `true` |
| Production | `corp-web-v2-production` | sensitive | `false` |

Development는 로컬 pull을 위해 `encrypted`로 등록합니다. Vercel은 Development에서 `sensitive` 타입을 지원하지 않습니다. [공식 문서](https://vercel.com/docs/environment-variables/sensitive-environment-variables)

로컬 개발은 Vercel Development 환경 값을 사용합니다. 기존 `.env.local`을 덮어쓰지 않으려면 임시 gitignored 파일로 받은 뒤 필요한 두 줄만 병합합니다.

```bash
vercel env pull .env.vercel-development.local --environment=development
```

그 다음 임시 파일의 `AI_CHAT_ENABLED`와 `AI_CHAT_API_KEY`만 `.env.local`에 병합하고 임시 파일을 삭제합니다.

`.env.local`이 비어 있거나 새로 만드는 경우에는 `vercel env pull .env.local --environment=development`를 사용할 수 있습니다.

- Hermes Wrapper 호출: `src/features/ai-chat/answer.server.ts`
- 응답 본문·링크 정규화: `src/features/ai-chat/reply.ts`
- 답변 링크 UI: `src/components/site/ai-chat/HermesAnswer.tsx`
- API: `src/app/api/ai-chat/route.ts`
- 검증: `npx vitest run src/features/ai-chat src/app/api/ai-chat`

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
