# AI 제품 상담 연결 및 검증

브라우저는 같은 사이트의 `POST /api/ai-chat`만 호출합니다. Vercel 서버가 공식 자료를 조회하고 AI Gateway Stage에 모델 요청을 전송한 뒤, 검증된 답변과 출처만 반환합니다.

## 연결 설정

서버 전용 `src/features/ai/config.server.ts`에서 공개 설정을 관리합니다.

| 코드 상수 | 값 |
|-----------|----|
| `AI_CHAT_BASE_URL` | `https://ai-gateway.stg.querypie.com/v1` |
| `AI_CHAT_MODEL` | `querypie-internal/glm53/glm-5.3` |

`querypie-internal`은 Gateway Provider 이름이며, `glm53/glm-5.3`은 Provider 내부 모델 이름입니다. 모델을 변경할 때는 Gateway의 `GET /v1/models`가 반환하는 전체 ID를 사용합니다.

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
- 근거가 없으면 모델 호출 없이 근거 부족 안내를 반환합니다.
- 대화는 현재 탭의 sessionStorage에 저장합니다. 초기화 시 진행 중인 요청을 취소하고 대화·초안을 지웁니다.
- 요청 실패 시 질문을 입력창에 복원합니다. 요청 중 페이지를 떠나면 저장된 초안을 다시 사용할 수 있습니다.
- 서버 인스턴스당 분당 30회, 동시 3회의 제한이 자료 조회와 모델 호출 전체에 적용됩니다. 다중 인스턴스에 공유되는 사용량 제한은 아닙니다.

## 검증

```bash
npm run test:run
npm run build
npm run typecheck
```

`domRuntime.test.ts`는 `require(ESM)`이 비활성화된 Node 프로세스에서 HTML·XML 파서 로딩을 확인합니다. `jsdom` 버전을 변경할 때는 이 테스트와 실제 Vercel Function의 cold start를 함께 확인합니다.

배포 검증은 다음 순서로 진행합니다.

1. 대상 Vercel 배포의 SHA와 두 환경변수의 적용 범위를 확인합니다.
2. `/api/ai-chat`에 공식 자료가 있는 제품 질문을 보내 답변과 출처를 확인합니다.
3. Vercel 서버에서 Gateway로 실제 요청이 전달됐는지 Gateway 호출 기록 등과 대조합니다. 근거 부족 응답도 HTTP 200이므로 상태 코드만으로 LLM 호출 성공을 판단하지 않습니다.
4. 브라우저 네트워크에서 모델 호출이 없고 `/api/ai-chat`만 호출되는지 확인합니다. 응답은 `answer`, `sources`, `answered`를 사용합니다.
5. 비활성화·키 누락, Gateway 오류와 시간 초과 시 안전한 오류 응답 및 입력 복원을 확인합니다.

질문 예시: `AIP와 ACP는 어떤 차이가 있나요?`, `Lingoをどうやって始めますか？`.
