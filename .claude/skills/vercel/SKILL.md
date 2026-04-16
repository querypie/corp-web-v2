---
name: vercel
description: Vercel CLI를 사용한 corp-web-v2 배포 로그 조회 및 프로젝트 설정 확인
tags: [vercel, deployment, logs, debugging]
---

# Vercel CLI — corp-web-v2

## 사전 조건: VERCEL_TOKEN 설정

Vercel CLI 명령을 실행하기 전 `VERCEL_TOKEN` 환경변수가 올바르게 설정되어 있어야 한다.

### 토큰 확인

```bash
echo $VERCEL_TOKEN
```

출력이 없거나, 아래 에러가 발생하면 토큰 설정이 필요하다.

```
Error: The token provided via VERCEL_TOKEN environment variable is not valid.
Error: Not authorized: Trying to access resource under scope "querypie-4030s-projects".
```

### 토큰 발급 방법

1. **1Password** → [QueryPie AI Vercel Token](https://start.1password.com/open/i?a=W2QE5422ENEWNN6FOEG6XAW6VY&v=6fjntva3it4cr2iktm6itpjaci&i=stujuvsgucel7cb22s2fz2u6su&h=chequer.1password.com) 에서 토큰을 확인한다.
2. 또는 [Vercel 대시보드](https://vercel.com) → **QueryPie AI 팀**으로 전환 → Settings → Tokens → Create Token

> **주의:** 토큰은 반드시 **QueryPie AI 팀** 컨텍스트에서 발급해야 한다. 개인 계정(`querypie-4030`)에서 발급한 토큰은 기본 scope가 달라 에러가 발생한다.

### 환경변수 설정

```bash
export VERCEL_TOKEN=<발급받은_토큰>
```

영구 설정은 `~/.zshrc` 또는 `~/.zshenv`에 추가한다.

---

## 프로젝트 정보

| 항목 | 값 |
|------|-----|
| 팀 slug | `querypie` |
| 팀 ID | `team_8DsCdrF1uCfwY30OS8F8lREn` |
| 프로젝트명 | `corp-web-v2` |
| Staging 도메인 | `stage-v2.querypie.com` |
| Production 도메인 | `www-v2.querypie.com` |

---

## Deployment Log 조회

### 기본 조회

```bash
# 최근 에러 로그 (staging)
vercel logs --environment preview --level error --since 1h

# 최근 에러 로그 (production)
vercel logs --environment production --level error --since 1h

# 전체 로그 실시간 스트리밍
vercel logs --follow
```

### 주요 옵션

| 옵션 | 설명 | 예시 |
|------|------|------|
| `--environment` | 환경 필터 | `preview` (staging), `production` |
| `--level` | 로그 레벨 | `error`, `warning`, `info`, `fatal` |
| `--since` | 시작 시간 | `1h`, `30m`, `2h` |
| `--limit` | 결과 수 | `--limit 50` |
| `--expand` | 전체 메시지 출력 | (플래그만 사용) |
| `--branch` | 브랜치 필터 | `--branch main` |
| `--status-code` | HTTP 상태코드 필터 | `--status-code 500` |
| `--search` | 고급 검색 | `--search 'status:500 error'` |
| `--json` | JSON 출력 (파이핑용) | `--json` |

### 실용 예시

```bash
# 최근 1시간 에러 로그 전체 메시지 확인
vercel logs --environment preview --level error --since 1h --expand

# 500 에러만 JSON으로 추출
vercel logs --environment preview --status-code 500 --json | jq '.message'

# 특정 키워드 검색
vercel logs --environment preview --search 'community-license' --expand

# 특정 API 에러 확인
vercel logs --environment preview --level error --since 24h --json | jq 'select(.message | contains("api/"))'

# 특정 배포 ID의 로그 실시간 확인
vercel logs dpl_xxxxx --follow
```

---

## 배포 환경 확인

### 배포 목록 조회

```bash
# 최근 배포 목록
vercel ls

# 특정 환경만
vercel ls --environment preview
vercel ls --environment production
```

### 특정 배포 상태 확인

```bash
# 배포 ID로 상세 정보 확인
vercel inspect dpl_xxxxx
```

---

## 프로젝트 설정 확인

### 환경변수 목록

```bash
# 모든 환경변수 확인
vercel env ls

# 특정 환경만
vercel env ls production
vercel env ls preview
```

### 도메인 설정 확인

```bash
vercel domains ls
```

### 프로젝트 연결 확인

```bash
# 현재 연결된 프로젝트 정보 (.vercel/project.json)
cat .vercel/project.json
```

---

## 배포 환경 구조 (corp-web-v2)

| 환경 | 도메인 | 트리거 |
|------|--------|--------|
| Staging | `stage-v2.querypie.com` | `main` 브랜치 push (GHA 자동) |
| Production | `www-v2.querypie.com` | `workflow_dispatch` 수동 실행 |
| Preview | Vercel 자동 발급 URL | PR open/sync (GHA 자동) |

> **참고:** `vercel.json`의 `"git": { "deploymentEnabled": false }` 설정으로 Vercel 자동 git 배포는 비활성화되어 있다. 모든 배포는 GitHub Actions(`.github/workflows/`)가 트리거한다.

---

## 흔한 에러 및 해결

| 에러 | 원인 | 해결 |
|------|------|------|
| `Not authorized: scope "querypie-4030s-projects"` | 토큰이 개인 계정 scope로 발급됨 | QueryPie AI 팀 컨텍스트에서 토큰 재발급 |
| `token is not valid` | 토큰 값이 잘못됨 | 1Password에서 토큰 재확인 후 재설정 |
| 로그 조회 시 빈 결과 | `--since` 범위 내 로그 없음 | `--since` 범위를 늘리거나 `--level` 조건 완화 |

## 관련 문서

- [Vercel 배포 현황](../../../docs/reference/vercel-deployment.md) — GHA 워크플로우, 배포 스크립트, DNS 설정
- [pr](../pr/SKILL.md) — PR 생성 워크플로우
