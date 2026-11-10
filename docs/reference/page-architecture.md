# 페이지 구조와 URL 관리

메뉴, 공개 주소, 내부 구현 폴더는 각각의 책임에 따라 관리한다.

| 책임 | 관리 위치 |
|---|---|
| GNB·푸터의 그룹·순서·표시명 | `src/constants/navigation.ts` |
| 페이지 ID·주소·지원 언어·이전 주소 | `src/constants/offerings.ts` |
| locale별 링크 생성 | `src/features/offerings/routes.ts` |
| 이전 주소 호환 | `src/features/routing/offeringRedirects.ts` |
| 라우트·metadata·데이터 조회 | `src/app/[locale]/{고유 주소}/page.tsx` |
| 제품·서비스 구현 | `components/pages/products`, `services`, `solutions` |
| 공용 UI 구성 | `components/pages/shared` |
| 정적 문구 | `src/copy` |

## URL 규칙

제품과 서비스는 `/aip`, `/acp`, `/ai-gateway`, `/penetration-testing`, `/fde-services`처럼 고유 주소를 유지한다. AI Crew·AI Dashi·Local LLM·COBOL도 같은 기준을 따른다. 메뉴에서 제품을 플랫폼으로 표시하거나 솔루션 그룹으로 옮겨도 주소는 바꾸지 않는다.

제품의 통합 목록 등 실제 종속 내용만 `/aip/integrations`, `/acp/integrations`처럼 계층을 사용한다. 데모·블로그·자료는 콘텐츠 유형에 따른 기존 경로를 유지한다. 정적 자산 경로는 공개 페이지 경로와 별개이며 이번 이전에서 바꾸지 않는다.

다국어 사이트는 locale prefix를 유지한다. 일본어 도메인의 prefix 없는 주소와 도메인별 정규화는 [사이트 도메인 라우팅](site-domain-routing.md)을 따른다.

## 페이지 추가와 변경

1. `offerings`에 고유 ID와 주소를 등록한다. 특정 언어만 제공하면 `locales`를 명시한다.
2. 라우트는 해당 제품·서비스 폴더의 구현을 연결한다. 다국어 페이지는 `locale`을 전달하며 언어별 문구는 copy 모듈에 둔다.
3. 메뉴·CTA·metadata는 `getOfferingHref(locale, id)`를 사용한다.
4. 주소 이전이 필요하면 기존 경로를 `legacyPaths`에 남긴다. 자동 생성되는 308 규칙은 locale 유무와 쿼리스트링을 유지한다.
5. 사이트맵은 같은 목록과 지원 언어를 사용한다. 준비 중인 QLM·QEV와 외부 데모 진입 라우트는 `sitemap: false`로 제외한다.

## 내부 폴더

`products/ai-gateway`, `services/penetration-testing`, `services/fde`처럼 페이지별 컴포넌트·스타일·테스트를 함께 둔다. 공용 제목·본문과 피처 카드 스타일은 `shared`에 두어 다른 제품의 전용 스타일에 의존하지 않게 한다.

AI Crew·AI Dashi의 일본어 전용 본문과 영어·한국어 본문은 해당 솔루션 폴더 안에서 유지한다. 실제 시장별 내용 차이를 없애는 번역 통합은 하지 않는다. 일본어 홈의 `home/japan`은 별도 레이아웃을 위한 의도된 경계이므로 유지한다.

## 이전 검증

기존 주소에서 새 주소로의 308 응답, 새 페이지의 canonical, locale 전환, 사이트맵, GNB·푸터를 함께 검증한다. `npm run typecheck`, `npm run test:run`, `npm run build`를 실행하며, dev 서버와 build를 동시에 실행하지 않는다.
