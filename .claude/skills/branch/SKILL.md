---
name: branch
description: 새 작업 시작 전 브랜치 생성 — main 업데이트, stale 브랜치 정리, feature 브랜치 생성
tags: [git, branch, workflow]
---

# Branch Workflow

## 목적

코드 수정 전 항상 feature 브랜치를 확인하고, main 위에서 깨끗하게 작업을 시작한다.

## 필수 규칙

> **코드 변경 전 반드시 브랜치 확인**
>
> `git branch --show-current` 로 확인 후 main이면 즉시 feature 브랜치를 생성한다.

```bash
git branch --show-current
# main이면 → 아래 절차 수행
```

## 수행 절차

### 1. main 업데이트

```bash
git checkout main
git pull origin main
```

### 2. stale 브랜치 정리 (선택)

```bash
# 브랜치 목록과 PR 상태 확인
git branch -a
gh pr list --state all \
  --json number,headRefName,state \
  --jq '.[] | "\(.headRefName) \(.state)"'

# MERGED/CLOSED PR의 로컬 브랜치 삭제
git branch -d <branch-name>
git remote prune origin
```

### 3. 새 feature 브랜치 생성

```bash
git checkout -b <prefix>/<descriptive-name> origin/main
```

> 브랜치 시작점은 항상 `origin/main` 으로 고정한다.

## 브랜치 네이밍

| 접두사 | 용도 | 예시 |
|--------|------|------|
| `feat/` | 새 기능 | `feat/add-blog-section` |
| `fix/` | 버그 수정 | `fix/locale-fallback` |
| `docs/` | 문서 변경 | `docs/update-readme` |
| `refactor/` | 리팩토링 | `refactor/extract-seo-utils` |
| `test/` | 테스트 추가 | `test/api-route-coverage` |

## 빠른 참조

| 단계 | 명령어 |
|------|--------|
| main 이동 & 업데이트 | `git checkout main && git pull origin main` |
| 현재 브랜치 확인 | `git branch --show-current` |
| PR 상태 확인 | `gh pr list --state all` |
| 로컬 브랜치 삭제 | `git branch -d <branch-name>` |
| 원격 추적 정리 | `git remote prune origin` |
| 새 브랜치 생성 | `git checkout -b feat/<name> origin/main` |

## 흔한 실수

| 실수 | 해결 |
|------|------|
| main에서 코드 수정 시작 | 수정 전 `git branch --show-current` 필수 |
| 다른 feature 브랜치에서 분기 | 항상 `origin/main` 을 시작점으로 |
| main에 직접 push | 절대 금지 — PR을 통해서만 반영 |

## 관련 스킬

- [worktree](../worktree/SKILL.md) — 병렬 작업이 필요할 때
- [pr](../pr/SKILL.md) — 작업 완료 후 PR 생성
