# AI 제품 상담 연결 및 검증

브라우저는 같은 사이트의 `POST /api/ai-chat`만 호출합니다. Vercel 서버가 공식 자료를 조회하고 AI Gateway Stage에 모델 요청을 전송한 뒤, 검증된 답변과 출처만 반환합니다.

## 연결 설정

서버 전용 `src/features/ai/config.server.ts`에서 공개 설정을 관리합니다.

| 코드 상수 | 값 |
|-----------|----|
| `AI_CHAT_BASE_URL` | `https://ai-gateway.stg.querypie.com/v1` |
| `AI_CHAT_MODEL` | `querypie-internal/glm53-flash/glm-5.3-flash` |

`querypie-internal`은 Gateway Provider 이름이며, `glm53-flash/glm-5.3-flash`는 Provider 내부 모델 이름입니다. 모델을 변경할 때는 Gateway의 `GET /v1/models`가 반환하는 전체 ID를 사용합니다.

Vercel Project에는 다음 두 환경변수만 설정합니다. 로컬 개발에서는 Vercel Development 환경 값을 git에 포함되지 않는 `.env.local`로 가져와 사용합니다.

```dotenv
# Development / Preview / staging 예시. Production은 false로 설정합니다.
AI_CHAT_ENABLED=true
AI_CHAT_API_KEY=<Gateway Key>
```

`AI_CHAT_API_KEY`는 서버 전용 비밀 환경변수로 등록합니다. 키 값은 1Password의 `corp-web-v2 AI Chat` 항목에서 가져오며, 코드, PR, 로그, 브라우저 응답에 포함하지 않습니다. `AI_CHAT_BASE_URL`과 `AI_CHAT_MODEL`은 Vercel 환경변수나 비밀정보가 아니라 서버 코드의 상수입니다.

| Vercel 환경 | `AI_CHAT_API_KEY` 출처 | 등록 타입 | `AI_CHAT_ENABLED` |
|-------------|------------------------|-----------|-------------------|
| Development | `corp-web-v2-development` | encrypted | `true` |
| Preview | `corp-web-v2-development` | sensitive | `true` |
| custom `staging` | `corp-web-v2-stage` | sensitive | `true` |
| Production | `corp-web-v2-production` | sensitive | `false` |

Development는 로컬 pull을 위해 `encrypted`로 등록합니다. Vercel은 Development에서 `sensitive` 타입을 지원하지 않습니다. [공식 문서](https://vercel.com/docs/environment-variables/sensitive-environment-variables)

Preview와 custom `staging`은 별개 환경이므로 각각 설정하고 재배포해야 합니다. Preview는 Development와 같은 Gateway Key를 사용하지만 Vercel Preview 환경에 별도로 등록합니다. 키가 없으면 공식 자료나 모델을 호출하기 전에 `503 NOT_CONFIGURED`를 반환합니다. CMS 번역은 기존 `CMS_TRANSLATION_*` 설정을 사용합니다.

로컬 개발용 `.env.local`이 이미 있다면 `vercel env pull .env.local --environment=development`가 파일 전체를 바꿀 수 있으므로 임시 파일로 받은 뒤 필요한 값만 병합합니다.

```bash
vercel env pull .env.vercel-development.local --environment=development
```

그 다음 임시 파일의 `AI_CHAT_ENABLED`와 `AI_CHAT_API_KEY`만 `.env.local`에 병합하고 임시 파일을 삭제합니다.

`.env.local`이 비어 있거나 새로 만드는 경우에는 곧바로 `.env.local`로 pull할 수 있습니다.

## 자료 조회와 응답

- 공식 출처는 `src/features/ai-chat/sources.ts`에서 관리합니다. 각 사이트의 사이트맵과 내부 링크에서 페이지를 발견하고 질문에 관련된 최신 본문을 서버에서 읽습니다.
- URL 목록은 서버 인스턴스 메모리에 캐시하며, 본문은 질문마다 조회합니다. 조회 범위·시간·크기와 리다이렉트 출처를 제한합니다. 상세 흐름·제한은 README의 홈페이지 AI 챗봇 설명을 참고합니다.
- 근거 최대 8개와 최근 대화 최대 8개를 Gateway에 전달합니다. 답변 언어는 사용자의 질문을 따릅니다.
- 서버가 모델 응답 JSON과 출처 ID를 검증합니다. 원시 모델 요청·응답과 내부 추론은 브라우저에 반환하지 않습니다.
- 검색된 근거가 없어도 모델을 호출해 인사·자기소개·상담 범위 질문에 사용자의 언어로 답변합니다. 근거 없는 제품 사실은 추정하지 않고, 출처 없는 `answered: true` 응답은 서버 검증에서 거부합니다.
- 대화는 현재 탭의 sessionStorage에 저장합니다. 초기화 시 진행 중인 요청을 취소하고 대화·초안을 지웁니다.
- 요청 실패 시 질문을 입력창에 복원합니다. 요청 중 페이지를 떠나면 저장된 초안을 다시 사용할 수 있습니다.
- 서버 인스턴스당 분당 30회, 동시 3회의 제한이 자료 조회와 모델 호출 전체에 적용됩니다. 다중 인스턴스에 공유되는 사용량 제한은 아닙니다.

## Slack 대화 알림

기존 서버 환경변수 `SLACK_BOT_OAUTH_TOKEN`을 재사용합니다. 별도 토큰이나 채널 환경변수는 추가하지 않습니다.

| 환경 | 알림 채널 |
|------|----------|
| Production | `C08FXKA72SU` (`#alert-website-chatbot`) |
| Preview / staging / Development | `C0C211STFRR` (`#alert-website-chatbot-dev`) |

환경은 `VERCEL_TARGET_ENV`, `VERCEL_ENV`, `development` 순서로 결정합니다. 기존 Bot이 대상 채널에 메시지를 쓸 수 있어야 하며, 토큰이 없는 환경에서는 Slack 알림을 건너뜁니다. Production의 기존 `AI_CHAT_ENABLED=false` 정책은 유지합니다.

유효성 검사와 사용량 제한을 통과한 질문은 최신 사용자 메시지와 서버에서 검증한 AI 답변을 기록합니다. AI 응답에 실패하면 질문과 공개 오류 코드만 기록합니다. 이전 대화 전체나 원시 모델 응답·내부 추론을 재전송하지 않습니다.

첫 질문·답변은 Slack 부모 메시지로, 연속된 대화는 같은 부모의 `thread_ts`를 지정한 댓글로 보냅니다. 서버가 기존 Bot 토큰으로 서명한 `slackThreadToken`을 응답하며, 브라우저는 이를 탭의 대화와 함께 `sessionStorage`에 저장합니다. 페이지 이동·새로고침 후에도 이어지고, 대화 초기화 시 연결값도 지워집니다. 서버 메모리나 별도 DB에 의존하지 않으며, 서명과 환경·채널을 검증하므로 임의의 스레드 ID를 지정할 수 없습니다. Bot 토큰이 바뀌면 다음 대화부터 새 스레드로 기록합니다.

첫 전송은 스레드 ID를 받아야 하므로 최대 2초의 Slack 요청을 기다립니다. 후속 전송은 Next.js `after()`에서 처리합니다. 실패나 rate limit에 자동 재시도하지 않으며 챗 응답은 유지합니다. 알림은 최선 노력 방식으로, 실패한 메시지는 유실될 수 있습니다. 첫 응답 수신 전에 페이지를 떠나거나 저장소를 사용할 수 없으면 연결값을 보존하지 못해 다음 요청에서 새 스레드가 만들어질 수 있습니다. 런타임 로그에는 본문이나 토큰 대신 `slack_notification_error`만 남깁니다.

Preview 배포에서 질문 2개를 이어 보내 같은 Slack 스레드에 기록되는지, 새로고침 후에도 이어지는지, 초기화 후에는 새 부모 메시지가 생성되는지 확인합니다.

## 검증

```bash
npm run test:run
npm run build
npm run typecheck
```

기본 모델은 응답 지연을 줄이기 위해 GLM-5.3 Flash를 사용하고, `reasoning_effort: "low"`를 명시합니다. Development 키로 동일 Gateway의 Flash 모델에 고정 요청을 보내 HTTP 200 / `OK` 응답을 약 443ms에 확인했습니다. 실제 소요 시간은 부하와 요청에 따라 달라집니다.

`domRuntime.test.ts`는 `require(ESM)`이 비활성화된 Node 프로세스에서 HTML·XML 파서 로딩을 확인합니다. `jsdom` 버전을 변경할 때는 이 테스트와 실제 Vercel Function의 cold start를 함께 확인합니다.

배포 검증은 다음 순서로 진행합니다.

1. 대상 Vercel 배포의 SHA와 두 환경변수의 적용 범위를 확인합니다.
2. `/api/ai-chat`에 공식 자료가 있는 제품 질문을 보내 답변과 출처를 확인합니다.
3. Vercel 서버에서 Gateway로 실제 요청이 전달됐는지 Gateway 호출 기록 등과 대조합니다. 근거 부족 응답도 HTTP 200이므로 상태 코드만으로 LLM 호출 성공을 판단하지 않습니다.
4. 브라우저 네트워크에서 모델 호출이 없고 `/api/ai-chat`만 호출되는지 확인합니다. 응답은 `answer`, `sources`, `answered`를 사용합니다.
5. 비활성화·키 누락, Gateway 오류와 시간 초과 시 안전한 오류 응답 및 입력 복원을 확인합니다.

Vercel Runtime Logs의 `[ai-chat]` 이벤트로 자료 조회, Gateway 요청, 연결 실패, HTTP 오류, 응답 해석 실패를 구분합니다. 로그에는 단계·소요 시간·HTTP 상태·허용된 오류 코드와 자료/메시지 개수만 남기며, API Key·질문·공식 자료 본문·모델 원문·내부 추론은 기록하지 않습니다. `provider_fetch_error`는 Gateway 응답을 받기 전 연결 단계 오류이며, `provider_http_error`는 Gateway가 오류 상태를 반환한 경우입니다.

질문 예시: `AIP와 ACP는 어떤 차이가 있나요?`, `Lingoをどうやって始めますか？`.

## 공개 상태 페이지

`/{locale}/internal/ai-chat-status`에서 현재 서버의 모델·Gateway 주소·활성화 상태·키 설정 여부를 확인하고 **기본 요청 테스트**를 실행할 수 있습니다. `locale`은 `en`, `ko`, `ja`를 사용하며, 페이지 문구와 metadata는 라우트가 소유하는 locale별 copy에서 선택합니다. locale 없는 `/internal/ai-chat-status`는 기존 공개 경로 규칙에 따라 기본 locale로 이동합니다. 키 값은 표시하지 않습니다. 공개 경로이며 기존 `/admin`의 로컬 접근 제한과 별개입니다.

테스트는 `POST /api/internal/ai-chat-status`에서 서버에 고정된 `Reply with exactly OK and no other text.`만 전송합니다. 사용자 지정 프롬프트·모델·주소·키를 받지 않으며, 공식 자료 검색을 거치지 않아 LLM 연결 자체를 분리해서 검사할 수 있습니다. 화면에는 upstream HTTP 상태, 소요 시간, 최종 응답과 성공·실패를 표시합니다. HTTP 403의 HTML/ALB 응답은 Gateway 앞단 접근 거부로 안내하며, 특정 WAF 규칙까지 판정하지 않습니다.

호출은 버튼을 눌렀을 때만 실행하고, 서버 인스턴스당 분당 30회·동시 1회로 제한합니다. 제한 초과에는 `429`와 `Retry-After`를 반환합니다. 이 제한은 서버 메모리 기반이며 여러 인스턴스 간에 공유되는 전역 한도는 아닙니다. 페이지는 검색 색인과 응답 캐시를 사용하지 않습니다.

`AI_CHAT_ENABLED=false` 또는 키 미설정이면 진단 요청도 LLM을 호출하지 않습니다. 따라서 Production의 비활성화 정책은 진단 페이지에서도 유지됩니다.
