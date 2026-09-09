# 사내 AI 제품 상담 테스트

현재 채팅 UI는 `/api/ai-chat`를 통해 사내 모델에 질문과 검색된 공식 문서 일부를 전달합니다. 문서는 수동 수집한 스냅샷이며, 전체 사이트를 실시간 검색하거나 임베딩 DB를 운영하는 구성은 아닙니다.

## 연결 설정

Vercel의 일반 **Preview**에서는 별도 AI 환경변수 등록 없이 사내 서버와 `glm-5.3-flash`를 기본 사용합니다. 기본값은 서버 전용 `src/features/ai/config.server.ts`에 있습니다. `VERCEL_TARGET_ENV=preview`일 때만 적용하므로 custom `staging`과 Production에서는 자동 활성화되지 않습니다. Vercel에서 시스템 환경변수 노출이 활성화되어 있어야 합니다.

로컬에서는 `.env.local`에서 설정합니다. 파일은 git에 포함하지 않습니다. 명시한 환경변수는 Preview 기본값보다 우선하며, `AI_CHAT_ENABLED=false`로 자동 활성화를 끌 수 있습니다.

```dotenv
AI_CHAT_ENABLED=true
AI_CHAT_BASE_URL=https://internal-llm.querypie.io/v1
AI_CHAT_MODEL=glm-5.3-flash
```

사내 서버는 API key 없이 동작합니다. 다른 인증 서버로 변경할 때만 `AI_CHAT_API_KEY`를 추가합니다. CMS 번역도 같은 서버와 모델을 사용하며 `CMS_TRANSLATION_BASE_URL`, `CMS_TRANSLATION_MODEL`, `CMS_TRANSLATION_API_KEY`로 별도 설정합니다. `CMS_TRANSLATION_*`는 레거시 `ANTHROPIC_*` / `OPENAI_*` 설정보다 우선하며, 별도로 지정하지 않은 기존 인증 토큰은 사내 서버에 전달하지 않습니다.

모델 목록: `GET https://internal-llm.querypie.io/v1/models`

서버가 `POST /v1/chat/completions`를 호출하며, 브라우저에는 모델 서버 주소나 인증 정보를 전달하지 않습니다. 실행하는 서버에서 사내 LLM에 접근할 수 있어야 합니다. 코드 기본값을 사용해도 Vercel 서버의 네트워크 접근 권한이 추가되는 것은 아닙니다. Preview 이외에서는 `AI_CHAT_ENABLED=true`로 명시적으로 활성화해야 합니다. CMS의 localhost 외 접근 차단 정책은 별도로 유지됩니다.

## 지식 갱신

로컬 홈페이지 최신 내용을 포함하려면 먼저 `npm run dev`로 3000번 서버를 실행한 뒤 다음 명령을 실행합니다. 수집 스크립트는 Node.js 24 기준으로 검증합니다.

```bash
npm run chat:collect-knowledge
```

원본:

- AIP: `https://aip-docs.app.querypie.com/`
- ACP: `https://docs.querypie.com/`
- Lingo: `https://lingo.querypie.ai/`
- 현재 홈페이지: `http://localhost:3000/{locale}`

한·영·일 진입 페이지와 선택된 가이드·FAQ·기능·요금 페이지를 수집합니다. 로그인한 제품 화면, 웹페이지 스크립트, 전체 문서 링크를 무제한으로 따라가지 않습니다. 사이트별 본문을 추출하고 섹션 단위로 저장합니다. 생성 파일은 `src/features/ai-chat/knowledge.snapshot.json`이며 수집 시각, URL, 언어, 제목과 실패 목록이 포함됩니다. 원본 사이트 하나라도 전부 실패하면 이전 스냅샷을 덮어쓰지 않습니다.

외부 홈페이지를 대신 수집하려면 `AI_CHAT_HOME_ORIGIN`을 수집 명령의 환경변수로 지정합니다. 홈페이지 출처 링크는 현재 웹사이트의 locale 경로로 표시됩니다.

## 동작과 범위

- 다국어 키워드와 제품 별칭을 사용해 관련 섹션 최대 8개를 검색합니다. 비교 질문은 양쪽 제품 근거를 우선 확보합니다.
- 최근 대화 최대 8개와 근거를 모델에 보냅니다. 답변 언어는 사용자의 질문을 따릅니다.
- 응답 JSON을 검증하고, 실제 제공한 문서 ID에 해당하는 출처만 링크로 표시합니다. 모델의 추론 필드·원시 응답은 사용자에게 표시하지 않습니다.
- 자료가 부족하면 이를 알리고 추가 설명을 요청합니다. 정확성을 보장하는 완성된 RAG가 아니므로 내부 테스트에서 답변과 출처를 검토해야 합니다.
- 대화는 현재 탭의 sessionStorage에 저장합니다. 서버 대화 DB나 미답변 관리 화면은 아직 없습니다.
- 초기화 시 진행 중인 요청을 취소하고 대화·초안을 지웁니다. 초기화 전 요청이 뒤늦게 완료되어도 새 대화에 표시하지 않습니다.
- 요청 실패 시 질문을 입력창에 복원합니다. 요청 중 페이지를 떠나면 저장된 초안을 다시 사용할 수 있습니다.
- 테스트용 제한은 서버 프로세스당 분당 30회, 동시 3회입니다. 다중 인스턴스에 적용되는 운영용 인증·사용량 제한을 대체하지 않습니다.

확인할 질문 예시: `AIP와 ACP는 어떤 차이가 있나요?`, `링고는 어떤 언어를 지원하나요?`, `Lingoをどうやって始めますか？`, `NotePie는 어떤 제품인가요?`.

운영 전에는 자동 동기화, 문서 버전·공개 범위 관리, 다국어 검색 품질 평가, 답변 피드백·미답변 기록, 배포 환경의 사내 서버 연결 가능 여부와 접근 제한을 별도로 준비합니다.
