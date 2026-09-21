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

다국어 사이트의 공개 URL은 locale prefix를 사용합니다.
루트 언어는 저장된 선택과 브라우저 언어를 기준으로 결정합니다.

## 생성 URL 기준

canonical URL, Open Graph URL, sitemap, robots의 sitemap URL, 소셜 공유 URL처럼
웹사이트가 생성하는 절대 URL은 현재 요청의 protocol과 host를 그대로 사용합니다.
`*.querypie.ai` 요청을 `*.querypie.com` URL로 바꾸거나 그 반대로 바꾸지 않습니다.

`NEXT_PUBLIC_SITE_URL`과 배포 환경별 기본 URL은 요청 host를 알 수 없는 실행 문맥의 fallback일 뿐이며,
실제 요청의 host를 대체하지 않습니다.

## Sitemap 경로

다국어 사이트는 `/sitemaps/multilingual/sitemap.xml`, 일본어 전용 사이트는
`/sitemaps/japanese/sitemap.xml`에서 sitemap을 각각 생성합니다.
각 sitemap 안의 URL과 `robots.txt`가 안내하는 sitemap URL은 현재 요청의 protocol과 host를 사용합니다.

## 호스트 간 redirect 금지

웹사이트 코드는 요청을 다른 호스트로 redirect하지 않습니다.
같은 호스트 안에서 경로를 정규화하는 redirect만 허용합니다.

`www.querypie.ai`에서 `querypie.ai`로의 redirect처럼 호스트를 바꾸는 규칙은 Vercel Hosting에서 관리합니다.
DNS와 Vercel 도메인 연결이 없는 호스트의 접속성은 애플리케이션이 보장하지 않습니다.

## 구현 규칙

`src/features/routing/siteDomainRouting.ts`만 사이트 호스트 판별과 도메인 라우팅 규칙을 구현합니다.
다른 코드에서 `querypie.ai` 비교, suffix 판별, 호스트별 locale 분기를 반복하지 않습니다.

`next.config.ts`는 이 모듈이 제공하는 redirect·rewrite 규칙을 등록합니다.
`src/middleware.ts`는 이 모듈이 결정한 루트 라우팅 결과만 적용합니다.
