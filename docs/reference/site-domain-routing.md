# 사이트 도메인 라우팅

이 문서는 일본어 전용 사이트와 다국어 사이트를 판별하는 유일한 명세입니다.
도메인 판별 규칙을 다른 문서에 복제하지 않습니다.

## 사이트 판별

호스트가 `querypie.ai`와 같거나 `.querypie.ai`로 끝나면 일본어 전용 사이트입니다.
apex, 한 단계 서브도메인, 다단계 서브도메인에 모두 같은 규칙을 적용합니다.

`querypie.ai` 하위가 아닌 모든 호스트는 다국어 사이트입니다.
`querypie.ai.example.com`같은 유사 도메인을 일본어 사이트로 판별하지 않습니다.

## URL 동작

일본어 전용 사이트의 locale 없는 공개 경로는 주소를 바꾸지 않고 내부 `/ja` 경로로 rewrite합니다.
locale prefix가 들어온 일본어 사이트 URL은 같은 호스트의 prefix 없는 경로로 정규화합니다.

콘텐츠의 이전 폴더형 URL(예: `/blog/27/shadow-ai-risk-cxo-countermeasures`)은
locale prefix 유무와 관계없이 폴더를 제거한 URL로 308 redirect합니다.
데모·리소스의 모든 카테고리와 뉴스에 적용하며, 이전 `/pdf` 경로는 `/download`로 연결합니다.
이 규칙은 일본어 `/ja` rewrite보다 먼저 적용해야 하며, 정상 다운로드 URL과 정적 파일은 제외합니다.

다국어 사이트의 공개 URL은 locale prefix를 사용합니다.
루트 언어는 저장된 선택과 브라우저 언어를 기준으로 결정합니다.

## 생성 URL 기준

canonical URL, Open Graph URL, sitemap, robots의 sitemap URL, 소셜 공유 URL처럼
웹사이트가 생성하는 절대 URL은 현재 요청의 protocol과 host를 그대로 사용합니다.
`*.querypie.ai` 요청을 `*.querypie.com` URL로 바꾸거나 그 반대로 바꾸지 않습니다.
Vercel에서 호스트 redirect가 완료된 뒤 애플리케이션에 전달되는 현재 서비스 FQDN을 기준으로 URL을 생성합니다.

## FQDN 정규화 책임

Production 다국어 사이트의 정규 FQDN은 `www.querypie.com`입니다.
Production 일본어 전용 사이트의 정규 FQDN은 `querypie.ai`입니다.

Production의 `querypie.com`, `blog.querypie.com` 등 다국어 사이트 별칭 FQDN은 Vercel에서
`www.querypie.com`으로 영구 redirect합니다.
Production의 `www.querypie.ai` 등 일본어 전용 사이트 별칭 FQDN은 Vercel에서
`querypie.ai`로 영구 redirect합니다.

Preview에서는 FQDN 정규화와 호스트 간 redirect를 적용하지 않습니다.
main Preview의 고정 Stage FQDN과 PR별 Vercel Preview FQDN은 각각 독립적으로 서비스를 제공합니다.

Production 정규 FQDN과 별칭 FQDN의 Deployment 연결, DNS 레코드, 영구 redirect는
Vercel Project와 DNS 관리 영역에서 설정합니다.
웹사이트 코드는 호스트 간 redirect를 구현하거나 정규 FQDN을 하드코딩하지 않습니다.

Production에서는 Vercel redirect를 통과한 정규 FQDN을 현재 서비스 FQDN으로 사용합니다.
Preview에서는 redirect 없이 요청받은 Preview FQDN을 현재 서비스 FQDN으로 사용합니다.
웹사이트 코드가 생성하는 sitemap과 소셜 공유 URL은 현재 서비스의 protocol·host FQDN을 사용합니다.
canonical·Open Graph·robots의 sitemap URL도 같은 규칙을 따릅니다.

## Sitemap 경로

모든 사이트의 canonical sitemap은 `/sitemap.xml`입니다.
`querypie.ai` 및 하위 도메인에서는 일본어(`ja`) 콘텐츠만 생성하고, 그 외 다국어 사이트에서는
영어(`en`)와 한국어(`ko`) 콘텐츠만 생성합니다.
Sitemap 안의 URL과 `robots.txt`가 안내하는 sitemap URL은 현재 요청의 protocol과 host를 사용합니다.

기존 `/sitemaps/multilingual/sitemap.xml` 및 `/sitemaps/japanese/sitemap.xml` 경로는 호환성을 위해
유지되며, 각각 다국어(`en`·`ko`)와 일본어(`ja`) sitemap을 제공합니다.

## 호스트 간 redirect 금지

웹사이트 코드는 요청을 다른 호스트로 redirect하지 않습니다.
같은 호스트 안에서 경로를 정규화하는 redirect만 허용합니다.

Production의 `querypie.com`에서 `www.querypie.com`으로의 redirect나
`www.querypie.ai`에서 `querypie.ai`로의 redirect처럼 호스트를 바꾸는 규칙은 Vercel Hosting에서 관리합니다.
Preview에는 이 호스트 redirect 규칙을 연결하지 않습니다.
DNS와 Vercel 도메인 연결이 없는 호스트의 접속성은 애플리케이션이 보장하지 않습니다.

## 구현 규칙

`src/features/routing/siteDomainRouting.ts`만 사이트 호스트 판별과 도메인 라우팅 규칙을 구현합니다.
다른 코드에서 `querypie.ai` 비교, suffix 판별, 호스트별 locale 분기를 반복하지 않습니다.

`next.config.ts`는 이 모듈이 제공하는 redirect·rewrite 규칙을 등록합니다.
`src/middleware.ts`는 이 모듈이 결정한 루트 라우팅 결과만 적용합니다.
