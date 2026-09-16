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

기존 Custom Environment `staging`은 main 배포 워크플로우 변경의 병합 후 정리를 위해 잠시 유지한다.
전환 진행 상태는 아래 「표준 Preview 전환과 완료 확인」을 따른다.
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

위 표는 2026-09-16에 확인된 배포 연결 현황이다. `www-v2.querypie.ai`와
`stage-v2.querypie.ai`는 같은 환경의 `.com` 도메인과 동일한 콘텐츠를 제공한다.
이 작업에서 준비한 `querypie.ai`·`www.querypie.ai`의 일본어 전용 라우팅은 아래
「일본 / 글로벌 도메인 연결」을 따르며, 운영 적용에는 코드 배포와 도메인 이전이 필요하다.

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
- 기존 custom staging alias: `corp-web-v2-env-staging-querypie.vercel.app` (이전 배포 확인용)
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

### 표준 Preview 전환과 완료 확인

2026-09-16 Vercel 설정 변경과 첫 main Preview 배포를 완료했다.

- Vercel Production Branch는 `release`다.
  Production 워크플로우가 입력 소스로 `release`를 먼저 갱신한 뒤 `production` target으로 배포한다.
- 기존 Stage 전용 환경변수는 값을 유지하면서 Preview의 `main` 브랜치에도 적용했다.
  `NEXT_PUBLIC_SITE_URL=https://stage-v2.querypie.com`도 같은 범위에 등록했다.
- 기존 `deploy-preview.yml`을 `BRANCH=main`으로 실행하여 built-in Preview 배포의 `READY`를 확인했다.
- Stage 세 도메인을 Preview / `main`에 연결하자 새 Preview 배포로 alias가 자동 갱신됐다.
  배포 스크립트에 별도 alias 명령은 추가하지 않는다.
- 세 도메인의 `/en` 응답은 HTTP 200이며, canonical URL은 기존 기준인
  `https://stage-v2.querypie.com`을 유지하는 것을 확인했다.
- 기존 Custom Environment `staging`의 도메인과 브랜치 매칭은 해제했다.
  환경 자체는 이전 워크플로우와의 호환을 위해 잠시 유지한다.

이 변경의 `deploy-staging.yml`은 main push와 수동 실행 모두 `BRANCH=main`,
`TARGET_ENV=preview`를 사용한다.
main push 자동 전환은 이 워크플로우 변경을 main에 병합한 뒤 적용된다.
병합 후 자동 배포가 `READY`이고 Stage 세 도메인이 해당 배포를 가리키는지 확인한 다음,
기존 Custom Environment `staging` (`env_HGojlWaENVScWZk7uFjJUhtDyx4n`)을 제거한다.

main과 PR 배포 모두 같은 **Preview (= Stage = Staging)** 환경을 사용한다.
main 배포에는 위 세 고정 도메인을, PR 배포에는 각각의 Preview URL을 사용한다.
`git.deploymentEnabled: false`를 유지하여 GitHub Actions가 배포를 수행한다.
폼 제출 및 Slack 알림 수신 테스트는 요청에 따라 생략한다.

Vercel은 Production Branch를 Preview 도메인·환경변수의 특정 브랜치로 지정하는 것을
제한하므로 Production Branch를 `release`로 지정한다.
([공식 제약](https://vercel.com/docs/errors/error-list#production-branch-used-as-preview-branch),
[Preview 도메인 연결](https://vercel.com/docs/domains/working-with-domains/assign-domain-to-a-git-branch))

### 일본 / 글로벌 도메인 연결

- `querypie.ai`(사용 시 `www.querypie.ai`도)는 이 앱의 Production 배포에 연결한다. 글로벌 도메인으로 보내는 Vercel 도메인 리디렉션은 설정하지 않는다.
- `www.querypie.com`은 글로벌 사이트로 연결한다.
- 레포의 `next.config.ts`가 일본 도메인의 `/`와 locale 없는 공개 경로를 내부 `/ja`·`/ja/...`로 rewrite한다. 주소창에는 `/ja`가 표시되지 않는다. `/ja/...`·`/en/...`·`/ko/...` 접근은 prefix 없는 경로로 영구 리디렉션하며 쿼리스트링을 유지한다.
- 일본어 화면에서는 GNB 언어 선택과 언어 추천 배너가 숨겨진다. 영어·한국어 화면에서는 두 언어만 선택·추천하며, 글로벌 루트의 자동 언어 선택에서도 일본어를 제외한다.
- 기존 `/ja` 경로는 로컬·Preview·글로벌 도메인에서도 직접 확인할 수 있다.
- GNB·푸터의 내부 링크는 상대 경로로 현재 도메인을 유지한다. CMS 본문과 AI 채팅 출처의 `querypie.com`·`querypie.ai` 절대 링크도 렌더링 시 현재 도메인·언어의 상대 경로로 변환한다. 로그인·외부 문서·SNS 등 다른 서비스의 링크는 원래 목적지를 유지한다.
- 배포 후 `https://querypie.ai/`, `https://querypie.ai/en/demo/aip?utm_source=test`, `https://www.querypie.com/`를 확인한다. 도메인 연결과 DNS 설정은 Vercel 담당자가 수행해야 한다.

`VERCEL_TEAM_ID`, `VERCEL_PROJECT_ID`는 각 배포 워크플로우 파일에 직접 명시되어 있다. 리전 및 Git 설정은 `vercel.json`에서 관리한다.

`NEXT_PUBLIC_SITE_URL`이 설정되어 있으면 해당 값을 canonical / OG 절대 URL의 기준으로 사용한다.
main Preview에는 `https://stage-v2.querypie.com`을 명시하여 기존 Stage 기준을 유지한다.
미설정 시 `VERCEL_TARGET_ENV` 기준으로 자동 결정한다.

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
Preview 공통 값은 PR 배포에 사용하고, `main` 전용 값은 Preview의 브랜치 범위로 지정한다.
기존 Stage 전용 환경변수 8개는 원래 레코드의 값과 타입을 유지하면서 Preview / `main` 범위를 추가했다.
대상은 `AI_CHAT_ENABLED`, `AI_CHAT_API_KEY`, `SLACK_CHANNEL_ALERT_WEBSITE_FORM_SUBMISSION_TESTING`,
`QUERYPIE_LICENSE_ISSUE_API_ENDPOINT`, `QUERYPIE_LICENSE_ISSUE_API_KEY`, `SALESFORCE_ENDPOINT`, `SLACK_BOT_OAUTH_TOKEN`,
`SLACK_CHANNEL_ALERT_WEBSITE_BUSINESS_INQUIRIES`다.
기존 Stage와 Preview 공통으로 등록된 `DESKPIE_API_BASE_URL`, `DESKPIE_API_KEY`,
`DESKPIE_LEAD_API_KEY`, `DESKPIE_LEAD_API_ENDPOINT`는 기존 범위를 유지한다.
`NEXT_PUBLIC_SITE_URL=https://stage-v2.querypie.com`은 Preview / `main`에 추가했다.
Preview 공통 값은 덮어쓰지 않는다.

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
- Stage 전용 변수는 기존 `customEnvironmentIds`도 유지하므로, 워크플로우 전환이 병합될 때까지 기존 custom `staging` 배포도 같은 값을 사용한다.

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
