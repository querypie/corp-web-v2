# Vercel 배포 구현 현황

**최종 업데이트**: 2026-09-15

corp-web-v2의 Vercel 배포 자동화 구현을 기술한다.

---

## 배포 환경

| 환경 | 직접 서비스 도메인 | 트리거 |
|------|---------------------|--------|
| Staging | `stage.querypie.com`<br>`stage-v2.querypie.com`<br>`stage-v2.querypie.ai` | `main` 브랜치 push 시 자동 배포 |
| Production | `www.querypie.com`<br>`www-v2.querypie.com`<br>`www-v2.querypie.ai` | `workflow_dispatch` 수동 실행 |
| Preview | 배포별 Vercel Preview URL | PR open/sync 시 자동 배포 |

`stage` 브랜치는 존재하지 않는다. Staging 환경은 `main` 브랜치 기준으로 자동 배포된다.

### 현재 도메인 매핑

아래 도메인은 redirect가 아니라 해당 환경의 동일한 배포를 직접 서비스한다.

| 환경 | 도메인 | Vercel 연결 | 상태 |
|------|--------|-------------|------|
| Production | `www.querypie.com` | Production | Verified / 정상 서비스 |
| Production | `www-v2.querypie.com` | Production | Verified / 정상 서비스 |
| Production | `www-v2.querypie.ai` | Production | Verified / 정상 서비스 |
| Staging | `stage.querypie.com` | Custom Environment `staging` | Verified / 정상 서비스 |
| Staging | `stage-v2.querypie.com` | Custom Environment `staging` | Verified / 정상 서비스 |
| Staging | `stage-v2.querypie.ai` | Custom Environment `staging` | Verified / 정상 서비스 |

Staging custom environment의 ID는 `env_HGojlWaENVScWZk7uFjJUhtDyx4n`이며
`main` 브랜치와 연결되어 있다. Production 도메인은 custom environment ID 없이
Production target에 연결된다.

현재는 환경별 도메인이 모두 같은 배포와 콘텐츠를 제공한다. `.com`과 `.ai` 요청에
따른 콘텐츠 분기는 아직 구현되어 있지 않다.

### Redirect 도메인

다음 도메인은 별도 서비스를 제공하지 않고 Vercel에서 `www.querypie.com`으로 redirect한다.

| 도메인 | 대상 | 상태 코드 |
|--------|------|-----------|
| `querypie.com` | `www.querypie.com` | 308 |
| `blog.querypie.com` | `www.querypie.com` | 308 |
| `chequer.io` | `www.querypie.com` | 301 |
| `www.chequer.io` | `www.querypie.com` | 301 |

`querypie.ai`와 `www.querypie.ai`는 `corp-web-japan` 프로젝트의 도메인이므로 이 프로젝트의
Production 도메인에 포함하지 않는다.

### Vercel 시스템 도메인

- Production 기본 도메인: `corp-web-v2.vercel.app`
- Production 자동 alias: `corp-web-v2-querypie.vercel.app`,
  `corp-web-v2-git-main-querypie.vercel.app`
- Staging 자동 alias: `corp-web-v2-env-staging-querypie.vercel.app`
- Preview: 배포마다 별도 `*.vercel.app` URL이 생성된다.

Vercel 시스템 도메인은 배포 확인용이며 외부에 안내하는 서비스 URL로 간주하지 않는다.

---

## GitHub Actions 워크플로우

### 파일 구조

```
.github/workflows/
  ci.yml                # PR → main 빌드 + 타입체크 검증
  create-pr.yml         # 수동(workflow_dispatch) PR 생성
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
  - `validate-test` — `npm run test:run`
  - lint — 스크립트 구현 후 주석 해제 예정

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

`NEXT_PUBLIC_SITE_URL`이 설정되어 있으면 해당 값을 canonical / OG 절대 URL의 기준으로 사용한다. 미설정 시 `VERCEL_TARGET_ENV` 기준으로 자동 결정한다.

| `VERCEL_TARGET_ENV` | 기본 site URL |
|---------------------|---------------|
| `staging` | `https://stage-v2.querypie.com` |
| `preview` | `https://www-v2.querypie.com` |
| `production` | `https://www.querypie.com` |

추가된 `.ai` 도메인도 위 기본 site URL을 사용하므로 canonical URL과 OG 절대 URL은
기존 `.com` 기준을 유지한다.

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

`querypie.com`과 `querypie.ai`는 AWS Route53으로 관리된다.

### Terraform 관리 위치

| Hosted Zone | 저장소 | 파일 |
|-------------|--------|------|
| `querypie.com` | `chequer-io/cloud-platform` | `terraform/aws/chequer-inc/record_querypie_com.tf` |
| `querypie.ai` | `chequer-io/aws-resource` | `tf/account_shared/record_querypie_ai.tf` |

### 도메인 인증 (TXT)

| Name | Value |
|------|-------|
| `_vercel.querypie.com` | `vc-domain-verify=www-v2.querypie.com,a044783bea27666ce9d8` |
| `_vercel.querypie.com` | `vc-domain-verify=stage-v2.querypie.com,030aee6c0d76e6de9a8c` |

`querypie.ai`는 QueryPie Vercel 팀이 소유한 도메인이므로 `stage-v2.querypie.ai`와
`www-v2.querypie.ai`에는 별도의 `vc-domain-verify` TXT 레코드가 필요하지 않다.

### 도메인 연결 (CNAME)

| 환경 | Name | Value |
|------|------|-------|
| Production | `www.querypie.com` | `30b9851d69a3855d.vercel-dns-016.com.` |
| Production | `www-v2.querypie.com` | `82199b027e940a05.vercel-dns-016.com.` |
| Production | `www-v2.querypie.ai` | `82199b027e940a05.vercel-dns-016.com.` |
| Staging | `stage.querypie.com` | `30b9851d69a3855d.vercel-dns-016.com.` |
| Staging | `stage-v2.querypie.com` | `82199b027e940a05.vercel-dns-016.com.` |
| Staging | `stage-v2.querypie.ai` | `82199b027e940a05.vercel-dns-016.com.` |

- `querypie.com` v2 Route53 등록: [chequer-io/cloud-platform#610](https://github.com/chequer-io/cloud-platform/pulls/610)
- `querypie.ai` v2 Route53 등록: [chequer-io/aws-resource#768](https://github.com/chequer-io/aws-resource/pull/768)

---

## GitHub Secrets

| Secret | 용도 | 관리 위치 |
|--------|------|-----------|
| `VERCEL_TOKEN` | Vercel API 인증 | querypie organization secret |

`VERCEL_TEAM_ID`는 민감 정보가 아니므로 워크플로우 파일에 직접 명시되어 있다.

---

## 환경변수 기준값

Vercel 프로젝트에 설정해야 하는 기준값. 실제 등록값은 Vercel 대시보드 또는 `vercel env ls`로 확인한다.

### Community License 기능

| 변수 | Production | Staging | Preview | Development |
|------|------------|---------|---------|-------------|
| `DESKPIE_API_BASE_URL` | `https://api.deskpie.querypie.com` | ← 동일 | ← 동일 | — |
| `DESKPIE_API_KEY` | Encrypted | ← 동일 | ← 동일 | — |
| `SLACK_BOT_OAUTH_TOKEN` | Encrypted | Encrypted | Encrypted | — |
| `SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES` | `C08JNAZDU5A` (#alert-website-business-inquiries) | `C083Y0300M7` (#alert-website-form-submission-testing) | ← 동일 | ← 동일 |
| `SLACK_CHANNEL_ALERT_WEBSITE_FORM_SUBMISSION_TESTING` | — | `C083Y0300M7` (#alert-website-form-submission-testing) | ← 동일 | — |

**참고:**
- `DESKPIE_API_BASE_URL` 또는 `DESKPIE_API_KEY` 미설정 시 라이선스 발급 단계를 skip하고 Slack 알림만 진행한다.
- 테스트/개발용 라이선스 API(`https://licensepie.dev.querypie.io`)는 인터넷 접근 불가로 Vercel 환경에서 사용할 수 없다. Staging/Preview는 Production과 동일한 엔드포인트를 사용하며, Development(로컬)에서만 라이선스 발급 단계를 skip한다.
- `SLACK_BOT_OAUTH_TOKEN`은 Vercel 정책상 `development` 환경에 sensitive 타입으로 설정 불가. 로컬 개발 시 Slack 알림은 skip된다.
- 앱 코드는 `VERCEL_TARGET_ENV !== "production"`일 때 `SLACK_CHANNEL_ALERT_WEBSITE_FORM_SUBMISSION_TESTING`을 우선 사용하고, 미설정 시 `C083Y0300M7`로 fallback한다. Staging/Preview 입력폼이 production 영업 문의 채널로 전송되지 않게 하는 보호장치다.
- `Staging`은 custom environment(`main` 브랜치)로, 표준 `preview` 환경변수를 상속하지 않는다. `customEnvironmentIds`로 별도 등록되어 있다.

### Contact Us DeskPie 연동

| 변수 | Production | Staging | Preview | Development |
|------|------------|---------|---------|-------------|
| `DESKPIE_API_BASE_URL` | `https://api.deskpie.querypie.com` | ← 동일 | ← 동일 | — |
| `DESKPIE_API_KEY` | Encrypted | Encrypted | Encrypted | — |

**참고:**
- `DESKPIE_API_BASE_URL`, `DESKPIE_API_KEY` 중 하나라도 없으면 Contact Us와 Content Gating의 DeskPie 전송 단계는 skip된다.
- DeskPie 전송은 best-effort이므로 실패해도 Contact Us 제출 응답은 `{ success: true }`를 유지한다.

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
