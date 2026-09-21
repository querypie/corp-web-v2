# Vercel 배포 구현 현황

**최종 업데이트**: 2026-09-16

corp-web-v2의 Vercel 배포 자동화 구현을 기술한다.

---

## 배포 환경

환경은 **Development / Preview / Production** 세 가지다. **Preview = Stage = Staging**은
같은 환경을 뜻한다.
Stage 또는 Staging 배포는 특히 `main` 브랜치의 Preview Deployment를 가리킨다.
main 배포와 PR 배포는 Preview 환경 안의 서로 다른 배포다.

| 환경 | 접속 주소 | 트리거 |
|------|---------------------|--------|
| Development | `http://localhost:3000` | 로컬 개발 서버 실행 |
| Preview (= Stage = Staging) | main: `stage.querypie.com`, `stage-v2.querypie.com`, `stage-v2.querypie.ai`<br>PR: 배포별 Vercel Preview URL | `main` push 또는 PR open/sync 시 자동 배포 |
| Production | `www.querypie.com`<br>`www-v2.querypie.com`<br>`www-v2.querypie.ai` | `workflow_dispatch` 수동 실행 |

기존 Custom Environment `staging`은 삭제했으며, built-in Preview로 전환을 완료했다.
전환 결과는 아래 「표준 Preview 전환 완료」를 따른다.
`stage` 브랜치는 존재하지 않는다.

Production 수동 실행은 `BRANCH` 입력(기본값 `main`)의 HEAD로 `release`를 먼저 갱신한 뒤,
`release`에서 배포한다. 배포가 실패해도 `release`는 시도한 소스를
가리킨다. 실제 서비스 중인 Production 버전은 Vercel의 현재 배포 SHA로 확인한다.

### 현재 도메인 매핑

아래 도메인은 redirect가 아니라 해당 환경의 동일한 배포를 직접 서비스한다.

| 환경 | 도메인 | Vercel 연결 | 상태 |
|------|--------|-------------|------|
| Production | `www.querypie.com` | Production | Verified / 정상 서비스 |
| Production | `www-v2.querypie.com` | Production | Verified / 정상 서비스 |
| Production | `www-v2.querypie.ai` | Production | Verified / 정상 서비스 |
| Preview (= Stage = Staging) | `stage.querypie.com` | Preview / `main` | Verified / 정상 서비스 |
| Preview (= Stage = Staging) | `stage-v2.querypie.com` | Preview / `main` | Verified / 정상 서비스 |
| Preview (= Stage = Staging) | `stage-v2.querypie.ai` | Preview / `main` | Verified / 정상 서비스 |

Stage 세 도메인은 `gitBranch=main`, `customEnvironmentId=null`로 등록되어
`main`의 Preview Deployment를 서비스한다.
Production 도메인은 Production target에 연결된다.

위 표는 2026-09-16에 확인된 배포 연결 현황이다.
애플리케이션의 호스트·locale 동작은 [사이트 도메인 라우팅](site-domain-routing.md)을 따른다.

### Redirect 도메인

다음 도메인은 별도 서비스를 제공하지 않고 Vercel에서 `www.querypie.com`으로 redirect한다.

| 도메인 | 대상 | 상태 코드 |
|--------|------|-----------|
| `querypie.com` | `www.querypie.com` | 308 |
| `blog.querypie.com` | `www.querypie.com` | 308 |
| `chequer.io` | `www.querypie.com` | 301 |
| `www.chequer.io` | `www.querypie.com` | 301 |

위 연결 현황 확인 시점에 `querypie.ai`와 `www.querypie.ai`는 `corp-web-japan` 프로젝트의
도메인이다. 이 프로젝트의 일본 사이트로 전환할 때 Vercel 담당자가 Production 배포로 이전해야 한다.

### Vercel 시스템 도메인

- Production 기본 도메인: `corp-web-v2.vercel.app`
- Production 자동 alias: `corp-web-v2-querypie.vercel.app`
- main Preview 브랜치 alias: `corp-web-v2-git-main-querypie.vercel.app`
- 기존 custom staging alias: `corp-web-v2-env-staging-querypie.vercel.app` (과거 배포 확인용이며 현재 Stage 배포가 아님)
- PR 배포: 배포마다 별도 `*.vercel.app` URL이 생성된다.

Vercel 시스템 도메인은 배포 확인용이며 외부에 안내하는 서비스 URL로 간주하지 않는다.

---

## GitHub Actions 워크플로우

### 파일 구조

```
.github/workflows/
  ci.yml                # PR → main 빌드 + 타입체크 검증
  create-pr.yml         # 수동(workflow_dispatch) PR 생성
  deploy-preview.yml    # PR open/sync 시 Preview 배포
  deploy-staging.yml    # main push 시 고정 도메인용 Preview 배포
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

### `deploy-staging.yml` — main 자동 배포

- **트리거**: push to `main` + `workflow_dispatch`
- **표시 이름**: `Deploy Main on Preview` (기존 파일명 유지)
- **concurrency**: `preview-main` (cancel-in-progress)
- `TARGET_ENV=preview`, `BRANCH=main`
- 수동 실행도 항상 `main`을 배포하며, 별도 브랜치 입력을 받지 않는다.
- Stage 세 도메인은 Preview의 `main` 브랜치에 연결한다.

### `deploy-production.yml` — Production 수동 배포

- **트리거**: `workflow_dispatch` (input: BRANCH, 기본값 `main`)
- **GitHub environment**: `production` (보호 규칙 적용 가능)
- **순서**: 입력 `BRANCH`의 HEAD fetch → `release` 갱신 → `release`에서 Production 배포
- **배포 소스**: `TARGET_ENV=production`, `BRANCH=release`
- **동시 실행**: `release` 준비부터 Production 배포까지 같은 concurrency 그룹에서 직렬화하며, 실행 중인 배포를 취소하지 않는다(`cancel-in-progress: false`).
- **`release` 갱신**: 원격 `release`와 입력 브랜치를 fetch한 뒤 `--force-with-lease`로 push한다. 조회 후 다른 실행이 `release`를 변경하면 갱신을 거부한다.
- **인증**: Production job의 `contents: write` 권한과 checkout의 기본 `GITHUB_TOKEN`을 사용한다. 별도 GitHub secret은 필요하지 않다.
- 입력은 `main` 외의 브랜치도 허용한다. 이전 커밋을 배포하는 롤백에서는 `release` 갱신이 non-fast-forward일 수 있다.
- `release` 갱신이 실패하면 배포를 시작하지 않는다. 배포가 실패하면 이미 갱신한 `release`는 유지되며, 실제 Production은 이전 배포를 서비스할 수 있다. 실패 후에는 Vercel의 현재 Production 배포 SHA와 상태를 확인하여 재배포할 소스를 결정한다.

`release`는 Production에 배포할 소스를 준비하는 브랜치다. 직접 개발하거나 일반 PR을 병합하는
브랜치로 사용하지 않으며, 브랜치 보호 규칙을 추가할 때 워크플로우의 갱신 권한과
롤백에 필요한 non-fast-forward 갱신을 함께 고려한다.

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

1. `createDeployment` API 호출 (gitSource: `querypie/corp-web-v2`, ref: BRANCH). Production은 먼저 갱신한 `release`를 사용
2. `getDeployment`로 5초 간격 폴링 (기본 최대 20분, `DEPLOY_POLL_TIMEOUT_MS`로 조정)
3. `READY` 확인 후 URL 출력
4. 취소된 배포만 15초 후 1회 재시도 (총 최대 2회 시도). 그 외 실패는 즉시 종료

---

## Vercel 프로젝트 설정

### 표준 Preview 전환 완료

2026-09-16 PR #174 병합 후 main 자동 배포와 기존 Custom Environment 정리까지 완료했다.

- Vercel Production Branch는 `release`다.
  Production 워크플로우가 입력 소스로 `release`를 먼저 갱신한 뒤 `production` target으로 배포한다.
- 기존 Stage 전용 환경변수는 값을 유지하면서 Preview에 적용했다.
  AI Gateway Key는 Preview 전체에서 Stage 키를 사용하며, 나머지는 `main` 브랜치 범위에 등록했다.
- 기존 `deploy-preview.yml`을 `BRANCH=main`으로 실행하여 built-in Preview 배포의 `READY`를 확인했다.
- Stage 세 도메인을 Preview / `main`에 연결하자 새 Preview 배포로 alias가 자동 갱신됐다.
  배포 스크립트에 별도 alias 명령은 추가하지 않는다.
- PR #174 병합 커밋 `adba7d60`의 [main 자동 배포](https://github.com/querypie/corp-web-v2/actions/runs/35071982744)가 성공했다.
  built-in Preview 배포 `dpl_BY52P6gDeeDjvKVsvEQjt8Hun9pP`의 `READY`와 Stage 세 도메인 연결을 확인했다.
- 기존 Custom Environment `staging`을 삭제했다. 기존 Stage와 연결되어 있던 환경변수 12개의
  Preview 범위와 값·타입을 보존했으며, 삭제된 custom environment 연결은 남아 있지 않다.

`deploy-staging.yml`은 main push와 수동 실행 모두 `BRANCH=main`,
`TARGET_ENV=preview`를 사용한다.

main과 PR 배포 모두 같은 **Preview (= Stage = Staging)** 환경을 사용한다.
main 배포에는 위 세 고정 도메인을, PR 배포에는 각각의 Preview URL을 사용한다.
`git.deploymentEnabled: false`를 유지하여 GitHub Actions가 배포를 수행한다.
폼 제출 및 Slack 알림 수신 테스트는 요청에 따라 생략한다.

Vercel은 Production Branch를 Preview 도메인·환경변수의 특정 브랜치로 지정하는 것을
제한하므로 Production Branch를 `release`로 지정한다.
([공식 제약](https://vercel.com/docs/errors/error-list#production-branch-used-as-preview-branch),
[Preview 도메인 연결](https://vercel.com/docs/domains/working-with-domains/assign-domain-to-a-git-branch))

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
| Preview (= Stage = Staging) | `stage.querypie.com` | `30b9851d69a3855d.vercel-dns-016.com.` |
| Preview (= Stage = Staging) | `stage-v2.querypie.com` | `82199b027e940a05.vercel-dns-016.com.` |
| Preview (= Stage = Staging) | `stage-v2.querypie.ai` | `82199b027e940a05.vercel-dns-016.com.` |

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
Preview 공통 값은 main과 PR 배포에 사용하고, `main` 전용 값은 Preview의 브랜치 범위로 지정한다.
`AI_CHAT_API_KEY`는 기존 Stage 레코드의 값과 타입을 유지하면서 Preview 공통 범위로 옮겼다.
main과 PR 모두 `corp-web-v2-stage`의 Gateway Key를 사용하며, 기존 Development 키를 사용하던 Preview 항목은 제거했다.
나머지 Stage 전용 환경변수 7개는 원래 레코드의 값과 타입을 유지하면서 Preview / `main` 범위를 추가했다.
대상은 `AI_CHAT_ENABLED`, `SLACK_CHANNEL_ALERT_WEBSITE_FORM_SUBMISSION_TESTING`,
`QUERYPIE_LICENSE_ISSUE_API_ENDPOINT`, `QUERYPIE_LICENSE_ISSUE_API_KEY`, `SALESFORCE_ENDPOINT`, `SLACK_BOT_OAUTH_TOKEN`,
`SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES`다.
기존 Stage와 Preview 공통으로 등록된 `DESKPIE_API_BASE_URL`, `DESKPIE_API_KEY`,
`DESKPIE_LEAD_API_KEY`, `DESKPIE_LEAD_API_ENDPOINT`는 기존 Preview 범위를 유지한다.
### Community License 기능

| 변수 | Development | Preview (= Stage = Staging) | Production |
|------|-------------|----------------------------|------------|
| `DESKPIE_API_BASE_URL` | — | `https://api.deskpie.querypie.com` | `https://api.deskpie.querypie.com` |
| `DESKPIE_API_KEY` | — | Encrypted | Encrypted |
| `SLACK_BOT_OAUTH_TOKEN` | — | Encrypted | Encrypted |
| `SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES` | `C083Y0300M7` | `C083Y0300M7` (#alert-website-form-submission-testing) | `C08JNAZDU5A` (#alert-website-business-inquiries) |
| `SLACK_CHANNEL_ALERT_WEBSITE_FORM_SUBMISSION_TESTING` | — | `C083Y0300M7` (#alert-website-form-submission-testing) | — |

**참고:**
- `DESKPIE_API_BASE_URL` 또는 `DESKPIE_API_KEY` 미설정 시 라이선스 발급 단계를 skip하고 Slack 알림만 진행한다.
- 테스트/개발용 라이선스 API(`https://licensepie.dev.querypie.io`)는 인터넷 접근 불가로 Vercel 환경에서 사용할 수 없다. Preview는 Production과 동일한 엔드포인트를 사용하며, Development(로컬)에서만 라이선스 발급 단계를 skip한다.
- `SLACK_BOT_OAUTH_TOKEN`은 Vercel 정책상 `development` 환경에 sensitive 타입으로 설정 불가. 로컬 개발 시 Slack 알림은 skip된다.
- 앱 코드는 `VERCEL_TARGET_ENV !== "production"`일 때 `SLACK_CHANNEL_ALERT_WEBSITE_FORM_SUBMISSION_TESTING`을 우선 사용하고, 미설정 시 `C083Y0300M7`로 fallback한다. Preview 입력폼이 production 영업 문의 채널로 전송되지 않게 하는 보호장치다.
- 기존 custom `staging` 삭제 후에도 Preview 공통 및 `main` 전용 환경변수는 보존되어 있다.

### Contact Us DeskPie 연동

| 변수 | Development | Preview (= Stage = Staging) | Production |
|------|-------------|----------------------------|------------|
| `DESKPIE_API_BASE_URL` | — | `https://api.deskpie.querypie.com` | `https://api.deskpie.querypie.com` |
| `DESKPIE_API_KEY` | — | Encrypted | Encrypted |

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
