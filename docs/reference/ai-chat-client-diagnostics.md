# AI 상담 브라우저 오류 진단

채팅 패널을 불러오거나 렌더링하는 중 발생한 예외는 `AiChatErrorBoundary`가 격리한다.
홈페이지 본문은 유지하고 상담 영역에 새로고침 안내를 표시한다.
대화나 초안을 지우거나 페이지를 자동으로 새로고침하지 않는다.

## 자동 기록

예외가 발생하면 브라우저가 같은 Origin의 `POST /api/ai-chat/client-error`로 한 번 전송한다.
Vercel Function 로그에서 `[ai-chat-client-error]`로 검색한다.

- 발생 시각(UTC), 서버 수신 시각, locale, 페이지 pathname
- 브라우저 User-Agent와 온라인 여부
- 오류 이름, 메시지, JS stack, React component stack
- 오류 객체에 `request`가 포함된 경우 실패한 청크 URL
- 클라이언트 script URL의 `dpl`, 서버의 배포 ID와 commit SHA(환경변수가 있을 때)

진단에는 대화 세션, 초안, 답변, Slack thread token을 첨부하지 않는다.
URL query/hash를 제거하고 각 텍스트 길이를 제한한다.
서버는 허용된 필드만 기록하고, 다른 Origin 요청과 12,000바이트 초과 본문을 거부한다.
로그량은 인스턴스당 분당 20건으로 제한하며 전역 rate limiter는 아니다.

## 조회 및 판단

Vercel 스킬의 토큰·프로젝트 설정으로 다음 명령을 실행한다.

```bash
vercel logs --environment production --search 'ai-chat-client-error' --since 24h --expand
```

1. `occurredAt`와 `receivedAt`로 발생 시각을 확인한다.
2. `deploymentId`와 `serverDeploymentId`가 모두 있다면 서로 다른 배포인지 비교한다.
3. `ChunkLoadError` 또는 CSS 청크 로딩 오류면 `failedAsset`의 상태와 배포 기록을 확인한다.
4. `InvalidStateError`, `TypeError` 등은 stack/componentStack과 해당 commit 코드를 대조한다.

배포 완료 후 새로 연 페이지에서도 발생할 수 있으므로 청크 오류라고 미리 단정하지 않는다.
오류를 격리하는 것은 원인 수정과 별개다. 자동 수집된 실제 예외를 근거로 수정한다.

## 수집 범위

오류 경계는 채팅 패널의 lazy import, render, effect 예외를 포착한다.
이벤트 핸들러·비동기 콜백의 처리되지 않은 예외와 앱 전체의 오류를 수집하는 전역 모니터링은 아니다.
모델/API 응답 실패는 기존 상담창의 오류 처리로 관리한다.
브라우저가 오프라인이거나 진단 요청 자체가 차단되면 서버 기록이 남지 않을 수 있다.
원인을 추적할 수 있는 자동 기록은 이 변경이 배포된 이후의 오류부터 적용된다.
