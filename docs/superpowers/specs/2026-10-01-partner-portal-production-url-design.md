# Partner Portal Production URL 통합 설계

## 목표

Vercel의 Preview, Preview Main과 Production에서 AI Chat upstream을 모두
`https://partner-portal.app.querypie.com/api/hermes/v1`로 통일한다.

## 배경과 결정

`https://partner-portal.app.dev.querypie.io/api/hermes/v1`은 외부 인터넷에서 접근 가능한
주소가 아니므로 Vercel Function의 upstream으로 사용할 수 없다. 환경별 URL 분기를
유지하지 않고 하나의 Production URL 상수를 사용해 잘못된 Dev 주소가 다시 선택될
가능성을 제거한다. API credential은 모든 Vercel 배포에서 Production Partner Portal
환경에 유효한 값을 사용한다.

## 변경 범위

- `src/features/ai/config.server.ts`: AI Chat base URL을 단일 Production 상수로 통합한다.
- `src/features/ai/config.server.test.ts`: Preview, Preview Main, Production이 모두 같은 URL을
  선택하는지 검증한다.
- `docs/reference/ai-product-chat-test.md`: Partner Portal Wrapper 연결과 환경별 credential
  계약을 현행화한다.
- `docs/reference/vercel-deployment.md`: Dev Portal 주소의 외부 네트워크 제약과 단일
  Production upstream 결정을 기록한다.

## 검증

관련 설정 테스트를 red-green으로 실행한 뒤 전체 typecheck와 test suite를 수행한다.
PR Preview가 준비되면 진단 페이지의 Base URL과 고정 모델 probe의 HTTP 200 및 `OK`
응답을 확인한다.
