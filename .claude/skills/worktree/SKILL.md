---
name: worktree
description: 격리된 작업 환경이 필요할 때 git worktree 생성 및 정리
tags: [git, worktree, workflow]
---

# Worktree Workflow

## 목적

현재 작업 브랜치를 오염시키지 않고 별도 디렉토리에서 독립적으로 작업한다.

## 수행 절차

### 1. main 최신화

```bash
git checkout main
git pull origin main
```

### 2. worktree 생성

```bash
git worktree add .worktrees/<topic> -b <prefix>/<topic>
```

> **경로 패턴:** `.worktrees/<topic>` (`.gitignore` 등록 확인 필수)

예시:
```bash
git worktree add .worktrees/blog-section -b feat/blog-section
```

### 3. 의존성 설치 및 검증

```bash
cd .worktrees/<topic>
npm install
npm run test:run
```

테스트가 모두 통과하면 작업을 시작한다.

### 4. 작업 및 커밋

worktree 디렉토리에서 일반적인 git 작업을 수행한다.

```bash
# worktree 내에서 커밋
git add <files>
git commit -m "feat: ..."
git push -u origin <prefix>/<topic>
```

### 5. 완료 후 정리

PR 병합 확인 후 worktree를 제거한다.

```bash
# main 또는 다른 디렉토리로 이동 후 실행
git worktree remove .worktrees/<topic>
git branch -d <prefix>/<topic>
```

## 빠른 참조

| 단계 | 명령어 |
|------|--------|
| worktree 목록 확인 | `git worktree list` |
| worktree 생성 | `git worktree add .worktrees/<topic> -b <branch>` |
| worktree 제거 | `git worktree remove .worktrees/<topic>` |
| stale worktree 정리 | `git worktree prune` |

## 흔한 실수

| 실수 | 해결 |
|------|------|
| `.worktrees/` 가 gitignore에 없음 | `git check-ignore -q .worktrees` 로 먼저 확인 |
| worktree에서 `npm install` 누락 | 생성 후 반드시 의존성 설치 |
| PR 병합 전 worktree 제거 | PR 상태 확인 후 제거 |

## 관련 스킬

- [branch](../branch/SKILL.md) — 일반 브랜치 작업
- [pr](../pr/SKILL.md) — 작업 완료 후 PR 생성
