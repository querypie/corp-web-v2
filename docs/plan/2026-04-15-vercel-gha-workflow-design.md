# Design: Vercel GHA Workflow

**Date:** 2026-04-15  
**Status:** Approved

## Overview

GitHub Actions 기반 Vercel 배포 워크플로우를 구현한다. `corp-web-app` 및 `querypie-docs` 프로젝트의 패턴을 기준으로, `corp-web-v2`에 맞게 적용한다.

## Architecture

### 파일 구조

```
.github/workflows/
  ci.yml                # PR → main 시 build + typecheck 검증
  deploy-preview.yml    # PR open/sync 시 Vercel preview 배포
  deploy-staging.yml    # main 브랜치 push 시 Vercel staging 배포
  deploy-production.yml # workflow_dispatch로 production 배포
  delete-deploy.yml     # 브랜치 삭제 시 preview deployment 정리

scripts/deploy/
  index.js              # @vercel/sdk 기반 배포 스크립트 (create + poll)
  delete-deploy.js      # preview deployment 삭제 스크립트
  package.json          # deploy 스크립트 전용 의존성

vercel.json             # Vercel 프로젝트 설정 (git auto-deploy 비활성화)
```

### Secrets (GitHub Actions)

| Secret | 용도 |
|--------|------|
| `VERCEL_TOKEN` | Vercel API 인증 토큰 |
| `VERCEL_TEAM_ID` | Vercel 팀 ID |

`.env` 파일 생성 없이 GH secrets → workflow env vars → `process.env`로 직접 전달 (`corp-web-app` 패턴).

## Workflow 상세

### `ci.yml`

- **트리거:** PR to `main`
- **잡:**
  - `validate-next-build` — `npm run build`
  - `validate-typecheck` — `npm run typecheck`
  - `validate-lint` — `npm run lint` (주석 처리, lint 스크립트 구현 후 활성화)
  - `validate-test` — `npm run test:run` (주석 처리, test 스크립트 구현 후 활성화)

### `deploy-preview.yml`

- **트리거:** PR open/sync + `workflow_dispatch` (브랜치 직접 지정)
- **concurrency:** `preview-{PR번호 or 브랜치}` — 같은 PR의 이전 실행 자동 취소
- **env:** `TARGET_ENV=preview`, `BRANCH={head_ref}`
- **동작:** `scripts/deploy/`에서 `npm run deploy`

### `deploy-staging.yml`

- **트리거:** push to `main` + `workflow_dispatch`
- **concurrency:** `staging-{ref}` — cancel-in-progress
- **env:** `TARGET_ENV=staging`, `BRANCH=main`
- **동작:** `scripts/deploy/`에서 `npm run deploy`

### `deploy-production.yml`

- **트리거:** `workflow_dispatch` (input: BRANCH, 기본값 `main`)
- **env:** `TARGET_ENV=production`, `BRANCH={input}`
- **동작:** `scripts/deploy/`에서 `npm run deploy`

### `delete-deploy.yml`

- **트리거:** `delete` 이벤트 (브랜치 삭제)
- **조건:** `github.event.ref_type == 'branch'`
- **동작:** `scripts/deploy/`에서 `npm run delete-deploy` — 해당 브랜치의 preview 배포 삭제

## Deploy 스크립트

레퍼런스 프로젝트와 동일한 로직:

- `@vercel/sdk`의 `createDeployment` API 호출 → 배포 생성
- `getDeployment`로 5초 간격 polling (최대 10분)
- `READY` 상태 확인 후 URL 출력
- 취소/실패 시 최대 2회 재시도 (15초 대기)
- `delete-deploy.js`: 해당 브랜치의 `name='corp-web-v2'` preview 배포 목록 조회 후 삭제

**프로젝트 식별자:**
```js
name: 'corp-web-v2'
repo: 'corp-web-v2'
org: 'querypie'
```

## `vercel.json`

```json
{
  "framework": "nextjs",
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "outputDirectory": ".next",
  "regions": ["icn1"],
  "trailingSlash": false,
  "git": {
    "deploymentEnabled": false
  }
}
```

`git.deploymentEnabled: false` — Vercel이 GitHub push를 직접 감지하지 않도록 설정. 모든 배포는 GHA workflow를 통해서만 진행.
