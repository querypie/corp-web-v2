# AI 제품 상담 운영 가이드

채팅 UI는 `/api/ai-chat`에서 승인된 제품 문서를 하이브리드 검색하고 서버에서 모델을 호출합니다. 브라우저에는 모델 endpoint, 인증 정보, 원문 근거 묶음을 노출하지 않습니다. 문서는 수동 수집한 스냅샷과 담당자가 승인한 Q&A이며, PostgreSQL의 pgvector 인덱스는 이 기준 데이터에서 재생성합니다.

## 연결 설정

자동 배포와 운영 연결의 구분, 비밀값 등록, DB 준비, 조회 API 검증은 [배포 체크리스트](./ai-chat-deployment.md)를 따른다.

모든 환경에서 AI 상담 설정을 명시해야 합니다. 로컬에서는 `.env.local`, 배포 환경에서는 Vercel 환경변수에 등록하며 파일은 git에 포함하지 않습니다. Vercel 서버에서 접근할 수 있는 OpenAI-compatible endpoint를 사용합니다.

```dotenv
AI_CHAT_ENABLED=true
AI_CHAT_BASE_URL=https://your-provider.example/v1
AI_CHAT_MODEL=your-model
AI_CHAT_API_KEY=secret
AI_CHAT_EMBEDDING_BASE_URL=https://your-embedding-provider.example/v1
AI_CHAT_EMBEDDING_MODEL=bge-m3
AI_CHAT_EMBEDDING_API_KEY=secret
```

키 없는 사내 서버라면 `AI_CHAT_API_KEY`를 비울 수 있지만, 공개 운영에서는 접근 제어가 적용된 provider 또는 gateway를 권장합니다. CMS 번역은 `CMS_TRANSLATION_BASE_URL`, `CMS_TRANSLATION_MODEL`, `CMS_TRANSLATION_API_KEY`로 별도 설정합니다.

서버는 provider의 `POST /chat/completions`를 호출합니다. 설정이 없으면 `/api/ai-chat`은 `503 NOT_CONFIGURED`를 반환합니다. CMS의 localhost 외 접근 차단 정책은 별도로 유지됩니다.

## 운영 저장소와 요청 제한

미답변 질문, 공용 요청 제한, RAG 벡터는 pgvector 확장을 지원하는 PostgreSQL을 사용합니다.

```dotenv
AI_CHAT_DATABASE_URL=postgres://...
AI_CHAT_RATE_LIMIT_SALT=long-random-secret
AI_CHAT_RATE_LIMIT_PER_MINUTE=10
```

최초 한 번 스키마를 적용합니다.

```bash
npm run chat:setup-database
npm run chat:index-knowledge
```

로컬에서는 Docker Desktop을 실행한 뒤 아래 순서로 PostgreSQL과 BGE-M3를 준비합니다.

```bash
npm run chat:local:start
npm run chat:local:pull-embedding
npm run chat:setup-database
npm run chat:index-knowledge
```

로컬 기본 연결은 PostgreSQL `127.0.0.1:55432`, Ollama OpenAI 호환 API `127.0.0.1:11434/v1`입니다. 배포 환경에서는 localhost를 사용할 수 없으므로 관리형 PostgreSQL과 Vercel에서 접근 가능한 HTTPS 임베딩 endpoint를 환경변수에 등록해야 합니다.

질문 원문에는 이메일과 전화번호 마스킹을 적용하며 IP 원문은 저장하지 않습니다. 요청 제한 키는 `AI_CHAT_RATE_LIMIT_SALT`를 이용한 HMAC 해시입니다. DB 또는 salt가 없으면 단일 프로세스용 제한으로 fallback하므로 운영 환경에서는 두 값을 모두 설정해야 합니다.

## 지식 수집과 색인 갱신

로컬 홈페이지 최신 내용을 포함하려면 먼저 `npm run dev`로 3000번 서버를 실행한 뒤 다음 명령을 실행합니다. 수집 스크립트는 Node.js 24 기준으로 검증합니다.

```bash
npm run chat:collect-knowledge
```

원본:

- AIP: `https://aip-docs.app.querypie.com/`
- ACP: `https://docs.querypie.com/`
- Lingo: `https://lingo.querypie.ai/`
- Lingo 제품 문서: `https://aip-docs.app.querypie.com/{locale}/apps/lingo/`
- 현재 홈페이지: 기본값 `http://localhost:3000/{locale}` 또는 `AI_CHAT_HOME_ORIGIN`

한·영·일의 공개 페이지 중 방문자가 물을 가능성이 높은 제품 개요, 기능, 사용법, 연동, 요금, 보안, 인증, 관리자 정책 페이지를 명시적인 허용 목록으로 수집합니다. Lingo 홈페이지 Help/FAQ와 실시간 통역(Lingo Voice) 제품 문서를 필수 원본으로 검사합니다. 로그인한 제품 화면, 웹페이지 스크립트, 릴리스별 상세 문서, 문서 안의 링크를 무제한으로 따라가지 않습니다.

본문을 제목 단위로 나누되 FAQ는 질문과 답변을 같은 청크에 보존합니다. 내비게이션, 버튼, 폼, 쿠키·푸터 문구, CTA, 고객사 인용, 뉴스 목록, 단순 문의 유도, 동일한 중복 사실은 제거합니다. 표는 셀 경계를 `|`로 보존해 값이 붙지 않게 합니다. 생성 파일은 `src/features/ai-chat/knowledge.snapshot.json`이며 수집 시각, 원본 URL, 언어, 제목과 실패 목록이 포함됩니다. 필수 Lingo 원본이나 원본 사이트 하나가 누락되면 이전 스냅샷을 덮어쓰지 않습니다.

외부 홈페이지를 대신 수집하려면 `AI_CHAT_HOME_ORIGIN`을 수집 명령의 환경변수로 지정합니다. 스냅샷에는 실제로 수집한 원본 URL이 출처로 저장됩니다.

수집 또는 승인 답변 반영 후 `npm run chat:index-knowledge`를 실행합니다. 본문은 800자/120자 중첩으로 나뉘며 BGE-M3 1,024차원 벡터와 제품·locale·공개 범위·코퍼스 버전을 `ai_chat_knowledge_chunks`에 저장합니다. 색인이 없거나 임베딩 endpoint가 일시적으로 실패하면 방문자 요청은 기존 키워드 검색으로 자동 fallback합니다.

## 동작과 범위

- 다국어 키워드와 제품 별칭을 사용해 관련 섹션 최대 8개를 검색합니다. 비교 질문은 양쪽 제품 근거를 우선 확보합니다.
- 최근 대화 최대 8개와 근거를 모델에 보냅니다. 답변 언어는 사용자의 질문을 따릅니다.
- 응답 JSON을 검증하고, 실제 제공한 문서 ID에 해당하는 출처만 링크로 표시합니다. 모델의 추론 필드·원시 응답은 사용자에게 표시하지 않습니다.
- 답변 상태는 `answered`, `insufficient_evidence`, `out_of_scope`로 구분합니다. 제품 범위는 GLM의 시스템 프롬프트가 판정하며, 제품 외 질문에는 서버가 고정 안내 문구를 반환합니다.
- 제품 질문의 자료가 부족하면 고정 안내를 반환하고 PostgreSQL에 중복 집계합니다. 일반 대화와 provider 장애는 Q&A 후보로 저장하지 않습니다.
- 대화는 현재 탭의 sessionStorage에 저장합니다. 서버에는 전체 대화 이력을 저장하지 않습니다.
- 초기화 시 진행 중인 요청을 취소하고 대화·초안을 지웁니다. 초기화 전 요청이 뒤늦게 완료되어도 새 대화에 표시하지 않습니다.
- 요청 실패 시 질문을 입력창에 복원합니다. 요청 중 페이지를 떠나면 저장된 초안을 다시 사용할 수 있습니다.
- DB와 salt가 설정되면 익명 요청 키별 분당 제한을 모든 서버 인스턴스가 공유합니다. DB 미설정 환경에서는 프로세스별 제한과 동시 3회 제한을 사용합니다.

## 미답변 검토와 RAG 반영

로컬 서버의 `/admin/ai-chat`에서 대기 중인 미답변 질문을 확인합니다. DB 연결값이 없으면 빈 목록으로 오인하지 않도록 설정 안내를 표시합니다. 답변 승인에는 제품, 답변, 허용된 공식 출처 URL이 필요합니다. 승인 시 `src/features/ai-chat/approved-knowledge.json`을 다시 생성하며, 이 파일을 커밋·배포하면 기존 문서 스냅샷과 함께 검색됩니다. 제외한 질문과 승인 전 답변은 지식에 들어가지 않습니다.

## 매일 아침 Slack 보고

Vercel Cron은 매일 `00:00 UTC`(한국시간 오전 9시)에 `/api/cron/ai-chat-unanswered`를 호출합니다.

```dotenv
CRON_SECRET=secret
SLACK_BOT_OAUTH_TOKEN=xoxb-...
SLACK_USER_ALERT_AI_CHAT_UNANSWERED=production-user-id
SLACK_CHANNEL_ALERT_AI_CHAT_UNANSWERED_TESTING=test-channel-id
```

운영 환경에서는 `SLACK_USER_ALERT_AI_CHAT_UNANSWERED`의 사용자와 DM을 열어 전날 미답변을 동일 질문별로 묶어 횟수 순으로 전달합니다. Slack 앱에는 `chat:write`와 `im:write` 권한이 필요합니다. 비운영 환경은 테스트 채널로 보냅니다. 방문자 입력은 Slack mention으로 해석되지 않도록 이스케이프합니다. DB가 설정되지 않은 경우에는 이를 0건으로 오인한 보고를 보내지 않습니다.

## MCP용 미답변 조회 API

운영자 화면에 접근하지 않고 외부 MCP에서 미답변을 조회할 때는 읽기 전용 API를 사용합니다. PostgreSQL 연결값은 외부에 제공하지 않습니다.

```http
GET /api/integrations/ai-chat/unanswered?since=2026-09-09T00:00:00.000Z&limit=100
Authorization: Bearer <AI_CHAT_REPORT_API_KEY>
```

`since`를 생략하면 최근 24시간, `limit`을 생략하면 최대 100개를 반환합니다. 반환 항목은 마스킹된 질문, 언어, 미답변 사유, 누적 발생 횟수, 최초·최근 발생 시각으로 제한됩니다. `AI_CHAT_REPORT_API_KEY`와 `AI_CHAT_DATABASE_URL`은 Vercel 서버 환경변수로만 관리합니다.

확인할 질문 예시: `AIP와 ACP는 어떤 차이가 있나요?`, `링고는 어떤 언어를 지원하나요?`, `Lingoをどうやって始めますか？`, `NotePie는 어떤 제품인가요?`.

운영 전에는 공식 원문 자료와 공개 범위, 미답변 보관 기간, 다국어 검색 품질 평가, 배포 환경의 provider·DB·Slack 연결값을 확정합니다. 전체 계획과 진행 상태는 `docs/reference/ai-product-chat-production-plan.md`에서 관리합니다.
