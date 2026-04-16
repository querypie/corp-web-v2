# corp-web-v2 프로젝트 계획

**작성일**: 2026-04-15  
**목표**: `corp-web-app` + `corp-web-contents`를 `corp-web-v2`로 대체

---

## 배경

QueryPie 공식 웹사이트는 현재 두 레포지토리로 운영된다.

- **corp-web-app**: Next.js 15 기반 메인 웹 애플리케이션 (외부 연동 다수 포함)
- **corp-web-contents**: MDX 기반 콘텐츠 레포지토리 (Vercel Blob에 업로드)

**corp-web-v2**는 이 두 레포를 하나의 Next.js 15 앱으로 통합·대체하는 것을 목표로 한다. 현재 약 85~90% 구현 완료 상태이며, 다국어(en/ko/ja) 지원, 파일 기반 CMS, Admin 대시보드가 갖춰져 있다.

대체는 단계적으로 진행한다. MVP 구현 후 Stage 환경에서 이용자 평가를 거쳐 Production 대체 여부를 결정한다.

---

## Phase 1 — MVP 구현

> **완료 기준**: corp-web-v2가 Stage 환경에서 이용자 평가를 받을 수 있는 상태

### ~~1-1. Community License 신청/발급 플로우~~ ✅ 완료

corp-web-app의 Community License 발급 기능이 corp-web-v2에 구현되었다.

- 신청 폼 UI (en/ko/ja, locale별 성이름 순서 처리)
- MX 레코드 이메일 유효성 검증
- 외부 라이선스 발급 API 연동 (`QUERYPIE_LICENSE_ISSUE_API_ENDPOINT`) — 환경변수 미설정 시 skip
- Salesforce 리드 전달 연동
- Slack 알림

2026-04-16 Staging E2E 검증 완료 (`stage-v2.querypie.com`).

→ [Community License 기능 상세](../reference/community-license.md)

### 1-2. 리드/폼 연동

⚠️ **Community License 경로만 구현 완료.** 문서 다운로드·데모 신청·문의하기 등 다른 전환 경로의 연동은 미구현이다.

- [x] Salesforce 리드 캡처 — Community License 폼
- [x] Slack 알림 — Community License 폼
- [ ] Salesforce / Slack 연동 — Contact Us, ContentLeadForm
- [ ] Google Sheets 연동 (웨이팅리스트 등)
- [ ] UTM 어트리뷰션 추적

→ [리드 캡처 폼 현황](../reference/lead-capture-forms.md)

### ~~1-3. Vercel 배포 자동화~~ ✅ 완료

GitHub Actions 기반 CI/CD 파이프라인이 구현되어 있다.

- `main` push → Staging 자동 배포 (`stage-v2.querypie.com`)
- Production 배포는 `workflow_dispatch` 수동 실행 (`www-v2.querypie.com`)
- PR open/sync → Preview 자동 배포
- PR → `main` 시 빌드 + 타입체크 검증

→ [Vercel 배포 구현 현황](../reference/vercel-deployment.md)

### 1-4. 개발 가이드 문서 작성

⚠️ 부분 완료. 배포 프로세스·AI 에이전트 작업 가이드 중심으로 작성되었다.

- [x] `AGENTS.md` — Source of Truth, 작업 규칙, 빠른 진단
- [x] `README.md` — 프로젝트 소개, 실행 방법, AI 에이전트 작업 흐름
- [x] 배포 프로세스 (`docs/reference/vercel-deployment.md`)
- [ ] 콘텐츠 작성 및 어드민 운영 가이드
- [ ] 아키텍처 개요 (콘텐츠 작성자 관점)

### ~~1-5. AI Agent용 Skill 보완~~ ✅ 완료

Claude Code 등 AI Agent가 이 레포에서 효과적으로 작업할 수 있는 스킬 구성이 완료되었다.

- `.claude/skills/branch`, `worktree`, `pr`, `commit`, `vercel` 스킬 추가
- `AGENTS.md`에 프로젝트 구조, Source of Truth, 작업 규칙, 체크리스트 문서화

---

## Phase 2 — 런치 검증

> **완료 기준**: 대체 여부 결정

- Stage 환경에서 내부 이용자 평가 진행
- corp-web-app과 corp-web-v2 병행 운영
- 평가 기준 항목 정의 후 검증
- 평가 결과에 따라 Production 전환 또는 보완 작업 결정

---

## Phase 3 — 오픈 이후 보완

> Phase 2 결과를 기반으로 우선순위 결정

### 후속 검토 항목

아래 항목들은 Phase 2 평가 이후 구현 여부와 우선순위를 결정한다.

| 항목 | 내용 |
|------|------|
| 트래킹 연동 | GA4, Hotjar, G2 전환 추적 |
| 채팅 위젯 | ChannelTalk 고객 지원 위젯 |
| 통합 검색 | Google Custom Search Engine (다국어) |
| SEO 인프라 | RSS 피드, WebSub, 동적 OG 이미지 생성 |
| 세션 리플레이 | RRWeb 기반 사용자 행동 추적 |
| Confluence 위키 | `/wiki` 경로 통합 |
| 일일 리포트 | LLM 기반 GA + Search Console 요약 |

---

## 현재 구현 현황 (참고)

corp-web-v2의 주요 구현 상태 요약:

| 영역 | 상태 | 비고 |
|------|------|------|
| 공개 페이지 전체 | ✅ 완료 | Home, Features, Company, Plans, Legal 등 |
| 다국어 (en/ko/ja) | ✅ 완료 | App Router locale 라우팅 |
| Admin CMS | ⚠️ 부분 완료 | Demo/Docs/News 관리 가능, Stage→Prod 워크플로우 미완 |
| Community License 발급 | ✅ 완료 | 2026-04-16 Staging E2E 검증 완료 |
| 폼/리드 연동 | ⚠️ 부분 완료 | Community License 경로만 (Salesforce/Slack). 나머지 전환 경로 미구현 |
| Vercel CI/CD | ✅ 완료 | [배포 현황 참고](../reference/vercel-deployment.md) |
| SEO 서버 저장 | ⚠️ 미완 | 현재 localStorage만 사용 |
| 자동화 테스트 | ✅ 완료 | Vitest, 166개 (유닛·통합·컴포넌트) |

---

## 관련 문서

- [CMS 완성 계획](./2026-04-15-corp-web-v2-cms-completion-design.md)
