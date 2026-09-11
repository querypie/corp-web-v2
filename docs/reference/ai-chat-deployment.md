# AI 상담 RAG·PostgreSQL 배포 체크리스트

이 저장소의 기존 자동 배포 흐름을 사용한다. PR 생성·업데이트는 Preview, `main` push는 Staging 배포를 실행한다. Production은 별도 수동 workflow이며 PR 병합은 사람이 진행한다.

## 코드 배포와 운영 연결은 별개

커밋에는 서버 API, 승인된 제품 지식, PostgreSQL 스키마, 색인 스크립트만 포함한다. `.env.local`, DB 비밀번호, 조회 키, 로컬 DB 데이터, 내부 Slack 리서치는 포함하지 않는다. Docker Compose는 로컬 개발용이며 Vercel이 이 컨테이너들을 대신 실행하지 않는다.

### 배포 환경에 필요한 설정

| 환경변수 | 용도 |
| --- | --- |
| `AI_CHAT_ENABLED=true` | 연결 검증을 마친 환경에서 상담 활성화 |
| `AI_CHAT_BASE_URL`, `AI_CHAT_MODEL`, `AI_CHAT_API_KEY` | 배포 서버가 접근 가능한 채팅 모델 API |
| `AI_CHAT_EMBEDDING_BASE_URL`, `AI_CHAT_EMBEDDING_MODEL`, `AI_CHAT_EMBEDDING_API_KEY` | BGE-M3 OpenAI 호환 임베딩 API, 1,024차원 |
| `AI_CHAT_DATABASE_URL` | pgvector를 지원하는 PostgreSQL 연결 문자열, 운영에서는 TLS 연결 사용 |
| `AI_CHAT_RATE_LIMIT_SALT` | 모든 인스턴스가 공유하는 충분히 긴 무작위 비밀값 |
| `AI_CHAT_RATE_LIMIT_PER_MINUTE=10` | 익명 요청 키별 분당 제한 |
| `AI_CHAT_REPORT_API_KEY` | 미답변 조회 전용 무작위 Bearer 키, 다른 API 키와 분리 |

DB와 임베딩 주소에 `localhost`, `127.0.0.1`, 개발 PC 주소를 넣지 않는다. 서버 간 연결을 확인하고 모델 API의 인증·네트워크 접근 정책을 유지한다. 임베딩 모델을 변경하면 기존 벡터와 섞지 말고 전체 재색인한다.

키와 연결 문자열은 배포 플랫폼의 비밀 환경변수로 등록한다. Preview, Staging(custom environment), Production에 각각 적용 범위를 확인한다. 기존 Preview 설정을 Staging이 자동 상속한다고 가정하지 않는다. 환경변수 변경 후에는 해당 환경을 다시 배포해야 한다.

## PostgreSQL 준비

운영 DB 생성·접속 권한을 확보한 다음, 해당 DB 환경변수를 주입한 관리 환경에서 실행한다. `.env.local`은 로컬 DB를 가리킬 수 있으므로 배포 DB 작업 시 명령 대상과 환경을 먼저 확인한다.

```bash
# AI_CHAT_DATABASE_URL 및 임베딩 환경변수가 대상 환경으로 주입된 상태
node scripts/ai-chat/setup-database.mjs
node scripts/ai-chat/index-knowledge.mjs
```

TypeScript 소스를 읽는 색인 스크립트는 Node.js 24 기준으로 검증한다. 색인 스크립트는 현재 코퍼스의 지식을 트랜잭션으로 반영하고 구버전 지식 청크만 정리한다. 미답변·승인 Q&A 테이블은 비우지 않는다. 기존 DB에 실행할 때는 먼저 백업과 대상 테이블을 확인한다.

현재 예상 검색 근거는 2,283개 섹션, 색인은 2,438개 청크다. 승인된 지식 파일이 갱신되면 수치는 달라질 수 있다. 운영 DB를 새로 만들 때 로컬 테스트 질문을 자동으로 복사하지 않는다.

## 배포 후 확인

1. 홈페이지 `/api/ai-chat`에서 제품 질문은 근거와 함께 응답하고, 제품 외 질문은 안내만 반환하는지 확인한다.
2. 근거가 부족한 테스트 질문이 PostgreSQL에 저장되고 동일 질문 재요청 시 횟수가 증가하는지 확인한다.
3. `/api/integrations/ai-chat/unanswered` 요청에 키가 없거나 잘못되면 `401`인지 확인한다. 키가 설정되지 않은 환경의 `503 NOT_CONFIGURED`는 인증 성공이 아니다.
4. 정확한 Bearer 키를 전송하면 `200`과 마스킹된 질문 목록을 반환하는지 확인한다. 응답의 `Cache-Control`은 `no-store`여야 한다.
5. 조회 키는 URL 파라미터·채팅·PR·로그에 넣지 않고 MCP의 비밀 헤더 설정에 보관한다.

```http
GET /api/integrations/ai-chat/unanswered?since=2026-09-01T00:00:00.000Z&limit=100
Authorization: Bearer <AI_CHAT_REPORT_API_KEY>
```

이 주소는 MCP 프로토콜 서버가 아니라 **MCP 도구가 호출할 수 있는 읽기 전용 HTTP API**다. `since` 미지정 시 최근 24시간을 반환한다. 오래 보관된 질문까지 조회하려면 명시적으로 조회 시작 시각을 지정한다. 키 소유자는 이 API를 사용할 수 있으므로 유출 시 즉시 키를 교체하고 재배포한다.

Slack 보고는 선택 사항이며 조회 API와 독립적이다. `CRON_SECRET`, Slack 봇 토큰과 대상 설정이 있어야 실제 보고가 전송된다. 이번 조회 API 연결만으로 Slack 알림이 설정된 것으로 간주하지 않는다.

## 확인 상태 (2026-09-11)

- 로컬 조회 키 생성·설정 완료. 값은 Git에 포함하지 않았다.
- 실제 로컬 API: 키 없음 `401`, 잘못된 키 `401`, 올바른 키 `200` 및 기존 미답변 12건 확인.
- 로컬 RAG 색인과 미답변 기록 동작 검증 완료.
- 배포 플랫폼의 키 등록, 운영 PostgreSQL 생성/연결, 운영 임베딩 연결과 배포 후 검증은 별도로 완료해야 한다. 코드의 자동 배포 성공만으로 위 연결이 완료됐다고 판단하지 않는다.
