# Vercel 배포 구현 현황

**최종 업데이트**: 2026-04-16

corp-web-v2의 Vercel 배포 자동화 구현을 기술한다.

---

## 배포 환경

| 환경 | 도메인 | 트리거 |
|------|--------|--------|
| Staging | `stage-v2.querypie.com` | `main` 브랜치 push 시 자동 배포 |
| Production | `www-v2.querypie.com` | `workflow_dispatch` 수동 실행 |
| Preview | Vercel 자동 발급 URL | PR open/sync 시 자동 배포 |

`stage` 브랜치는 존재하지 않는다. Staging 환경은 `main` 브랜치 기준으로 자동 배포된다.

---

## GitHub Actions 워크플로우

### 파일 구조

```
.github/workflows/
  ci.yml                # PR → main 빌드 + 타입체크 검증
  deploy-preview.yml    # PR open/sync 시 Preview 배포
  deploy-staging.yml    # main push 시 Staging 자동 배포
  deploy-production.yml # 수동(workflow_dispatch) Production 배포
  delete-deploy.yml     # 브랜치 삭제 시 Preview 배포 정리
```

### `ci.yml` — PR 검증

- **트리거**: PR → `main`
- **검증 항목**:
  - `validate-next-build` — `npm run build`
  - `validate-typecheck` — `npm run typecheck`
  - lint, test — 스크립트 구현 후 주석 해제 예정

### `deploy-staging.yml` — Staging 자동 배포

- **트리거**: push to `main` + `workflow_dispatch`
- **concurrency**: `staging-{ref}` (cancel-in-progress)
- `TARGET_ENV=staging`, `BRANCH=main`

### `deploy-production.yml` — Production 수동 배포

- **트리거**: `workflow_dispatch` (input: BRANCH, 기본값 `main`)
- **GitHub environment**: `production` (보호 규칙 적용 가능)
- `TARGET_ENV=production`

### `deploy-preview.yml` — PR Preview 배포

- **트리거**: PR open/sync + `workflow_dispatch`
- **concurrency**: `preview-{PR번호 or 브랜치}` (cancel-in-progress)
- `TARGET_ENV=preview`, `BRANCH={head_ref}`

### `delete-deploy.yml` — Preview 배포 정리

- **트리거**: 브랜치 삭제 이벤트
- 삭제된 브랜치의 Preview 배포를 Vercel에서 제거

---

## 배포 스크립트

`scripts/deploy/` — `@vercel/sdk` 기반 Node.js 스크립트

```
scripts/deploy/
  index.js          # 배포 생성 + 상태 폴링
  delete-deploy.js  # Preview 배포 삭제
  package.json      # 전용 의존성 (@vercel/sdk, dotenv)
```

**배포 흐름** (`index.js`):

1. `createDeployment` API 호출 (gitSource: `querypie/corp-web-v2`, ref: BRANCH)
2. `getDeployment`로 5초 간격 폴링 (최대 10분)
3. `READY` 확인 후 URL 출력
4. 취소/실패 시 최대 2회 재시도 (15초 대기)

---

## Vercel 프로젝트 설정

`VERCEL_TEAM_ID`, `VERCEL_PROJECT_ID`는 각 배포 워크플로우 파일에 직접 명시되어 있다. 리전 및 Git 설정은 `vercel.json`에서 관리한다.

### `vercel.json`

```json
{
  "framework": "nextjs",
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "outputDirectory": ".next",
  "regions": ["icn1"],
  "trailingSlash": false,
  "git": { "deploymentEnabled": false }
}
```

---

## DNS 설정 (Route53)

`querypie.com`은 AWS Route53으로 관리된다. 아래 레코드 등록이 필요하다.

### 도메인 인증 (TXT)

| Name | Value |
|------|-------|
| `_vercel.querypie.com` | `vc-domain-verify=www-v2.querypie.com,a044783bea27666ce9d8` |
| `_vercel.querypie.com` | `vc-domain-verify=stage-v2.querypie.com,030aee6c0d76e6de9a8c` |

### 도메인 연결 (CNAME)

| Name | Value |
|------|-------|
| `www-v2.querypie.com` | `cname.vercel-dns.com` |
| `stage-v2.querypie.com` | `cname.vercel-dns.com` |

→ Route53 등록 PR: [chequer-io/cloud-platform#610](https://github.com/chequer-io/cloud-platform/pulls/610)

---

## GitHub Secrets

| Secret | 용도 | 관리 위치 |
|--------|------|-----------|
| `VERCEL_TOKEN` | Vercel API 인증 | querypie organization secret |

`VERCEL_TEAM_ID`는 민감 정보가 아니므로 워크플로우 파일에 직접 명시되어 있다.

---

## 환경변수

Vercel 프로젝트에 등록된 환경변수 목록. Vercel 대시보드 또는 `vercel env ls`로 확인 가능.

### Community License 기능

| 변수 | Production | Staging | Preview | Development |
|------|------------|---------|---------|-------------|
| `SALESFORCE_ENDPOINT` | production | sandbox | sandbox | sandbox |
| `QUERYPIE_LICENSE_ISSUE_API_ENDPOINT` | `https://license.querypie.com/license/community` | ← 동일 | ← 동일 | — |
| `QUERYPIE_LICENSE_ISSUE_API_KEY` | Encrypted | ← 동일 | ← 동일 | — |
| `SLACK_BOT_OAUTH_TOKEN` | Encrypted | Encrypted | Encrypted | — |
| `SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES` | `C08JNAZDU5A` (#alert-website-business-inquiries) | `C083Y0300M7` (#alert-website-form-submission-testing) | ← 동일 | ← 동일 |

**참고:**
- `QUERYPIE_LICENSE_ISSUE_API_*` 미설정 시 라이선스 발급 단계를 skip하고 Salesforce로 진행한다.
- 테스트/개발용 라이선스 API(`https://licensepie.dev.querypie.io`)는 인터넷 접근 불가로 Vercel 환경에서 사용할 수 없다. Staging/Preview는 Production과 동일한 엔드포인트를 사용하며, Development(로컬)에서만 라이선스 발급 단계를 skip한다.
- `SLACK_BOT_OAUTH_TOKEN`은 Vercel 정책상 `development` 환경에 sensitive 타입으로 설정 불가. 로컬 개발 시 Slack 알림은 skip된다.
- `Staging`은 custom environment(`main` 브랜치)로, 표준 `preview` 환경변수를 상속하지 않는다. `customEnvironmentIds`로 별도 등록되어 있다.
- 값의 원본은 `corp-web-app` Vercel 프로젝트에서 관리된다.

### 환경변수 pull (로컬 개발)

```bash
vercel env pull .env.local --environment=development -y
```

### 환경변수 추가/수정

`production` / `development` 환경변수는 Vercel CLI로 추가 가능하다:

```bash
vercel env add VAR_NAME production --value "value" --yes
```

`preview` 환경의 전체 브랜치 공통 변수는 CLI 대신 REST API를 사용한다:

```bash
curl -X POST \
  "https://api.vercel.com/v10/projects/$PROJECT_ID/env?teamId=$TEAM_ID" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"VAR_NAME","value":"value","type":"plain","target":["preview"]}'
```

`type`은 `plain` 또는 `sensitive`. `sensitive`는 `development` 환경에 설정 불가.

---

## 관련 문서

- [프로젝트 계획](../plan/2026-04-15-corp-web-v2-project-plan-design.md)
