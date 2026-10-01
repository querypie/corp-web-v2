# Partner Portal Production URL Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 모든 Vercel AI Chat 배포가 외부 접근 가능한 Partner Portal Production Wrapper를 사용하게 한다.

**Architecture:** 환경별 base URL 선택을 제거하고 서버 전용 설정에서 하나의 Production URL을 반환한다. 기존 API key와 활성화 환경변수 경계는 유지하며 URL·credential 운영 계약만 문서화한다.

**Tech Stack:** TypeScript, Vitest, Next.js 15, Vercel

---

## Chunk 1: 설정과 문서

### Task 1: URL 회귀 테스트

**Files:**
- Modify: `src/features/ai/config.server.test.ts`
- Test: `src/features/ai/config.server.test.ts`

- [x] Preview, Preview Main, Production이 Production URL을 기대하도록 테스트를 변경한다.
- [x] `npm run test:run -- src/features/ai/config.server.test.ts`를 실행해 Dev URL 반환 때문에 실패하는지 확인한다.

### Task 2: 단일 Production URL 구현

**Files:**
- Modify: `src/features/ai/config.server.ts`

- [x] Dev URL 상수와 환경별 선택 함수를 제거한다.
- [x] 모든 환경에서 Production URL을 반환한다.
- [x] 관련 설정 테스트를 다시 실행해 통과를 확인한다.

### Task 3: 운영 계약 문서화

**Files:**
- Modify: `docs/reference/ai-product-chat-test.md`
- Modify: `docs/reference/vercel-deployment.md`

- [x] Dev Partner Portal 주소가 외부 인터넷에서 접근 불가함을 기록한다.
- [x] Preview, Preview Main, Production이 Production Wrapper URL과 credential을 사용함을 기록한다.

### Task 4: PR과 배포 검증

- [x] 변경 파일과 커밋 범위를 확인한다.
- [x] 1차 구현을 커밋·푸시하고 저장소 Workflow로 PR을 생성한다.
- [x] `npm run typecheck`, `npm run test:run`을 순서대로 실행한다.
- [ ] PR Preview 진단 페이지에서 Production Base URL을 확인한다.
- [ ] 고정 모델 probe가 HTTP 200과 `OK`를 반환하는지 확인한다.
