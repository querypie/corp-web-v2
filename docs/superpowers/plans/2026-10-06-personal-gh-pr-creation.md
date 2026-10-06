# 개인 GitHub 계정 PR 생성 전환 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** GitHub Actions Bot 기반 PR 생성 장치를 제거하고, 활성화된 개인 GitHub CLI 계정으로 PR을 직접 생성·검증한다.

**Architecture:** 전용 PR 생성 workflow를 삭제해 Bot 진입점을 없앤다. 저장소 PR 스킬을 로컬 인증 확인 → 직접 생성 → 작성자 검증 흐름으로 바꾸고, workflow 목록 문서를 실제 파일 구조와 동기화한다.

**Tech Stack:** GitHub Actions YAML, GitHub CLI (`gh`), Markdown, Git

---

## Chunk 1: Bot 생성 경로 제거와 개인 계정 흐름 적용

### Task 1: 기존 동작을 실패하는 정적 계약으로 확인

**Files:**
- Inspect: `.github/workflows/create-pr.yml`
- Inspect: `.claude/skills/pr/SKILL.md`
- Inspect: `docs/reference/vercel-deployment.md`

- [ ] **Step 1: workflow 삭제 계약이 현재 실패하는지 확인**

Run: `test ! -e .github/workflows/create-pr.yml`

Expected: FAIL because the Bot-based workflow still exists.

- [ ] **Step 2: 기존 Bot 경로의 모든 참조를 기록**

Search for `create-pr.yml`, `gh workflow run create-pr.yml`, `github-actions[bot]`, and `gh pr create` in workflow and Markdown files.

Expected: matches in the workflow, PR skill, and Vercel deployment reference.

### Task 2: PR 생성 경로 전환

**Files:**
- Delete: `.github/workflows/create-pr.yml`
- Modify: `.claude/skills/pr/SKILL.md`
- Modify: `docs/reference/vercel-deployment.md`

- [ ] **Step 1: Bot 전용 workflow 삭제**

Delete `.github/workflows/create-pr.yml` completely so no `GITHUB_TOKEN`-based PR creation entry point remains.

- [ ] **Step 2: 스킬의 인증 사전 점검 추가**

Document these commands before PR creation:

```bash
gh auth status
```

State that PR creation stops when the active account is missing or is not the intended personal account.

- [ ] **Step 3: 스킬의 PR 생성 명령 교체**

Replace the workflow dispatch command with:

```bash
gh pr create \
  --base main \
  --head "<branch>" \
  --title "<type>: <subject>" \
  --body-file "<body-file>"
```

Use a temporary body file to avoid shell quoting errors, then remove it after successful creation.

- [ ] **Step 4: 작성자 검증 절차 추가**

Document:

```bash
gh pr view "<branch>" --json author,url --jq '{url: .url, author: .author.login}'
```

Require `author` to match the login reported by `gh api user --jq .login`.

- [ ] **Step 5: workflow 목록 문서 동기화**

Remove only the `create-pr.yml` line from `docs/reference/vercel-deployment.md`.

- [ ] **Step 6: 구현 커밋과 push**

```bash
git add .github/workflows/create-pr.yml .claude/skills/pr/SKILL.md docs/reference/vercel-deployment.md docs/superpowers
git commit -m "chore: PR 생성을 개인 GitHub 계정으로 전환"
git push -u origin chore/use-personal-gh-for-pr
```

## Chunk 2: PR 생성과 검증

### Task 3: 개인 계정으로 PR 생성

**Files:**
- Verify: all files changed against `origin/main`

- [ ] **Step 1: scope gate 실행**

```bash
git fetch origin --prune
git log --oneline origin/main..HEAD
git diff --name-status origin/main...HEAD
```

Expected: this task's documentation, workflow deletion, PR skill update, and deployment reference update only.

- [ ] **Step 2: 활성 개인 계정 확인**

```bash
gh auth status
```

Expected: authenticated personal account `jk-kim0`.

- [ ] **Step 3: 직접 PR 생성**

Run `gh pr create` with base `main`, head `chore/use-personal-gh-for-pr`, and Korean title/body.

- [ ] **Step 4: PR 작성자 확인**

```bash
gh pr view chore/use-personal-gh-for-pr --json author,url --jq '{url: .url, author: .author.login}'
```

Expected: `author` is `jk-kim0`.

### Task 4: 로컬 회귀 검증과 후속 반영

**Files:**
- Verify: `.github/workflows/`
- Verify: `.claude/skills/pr/SKILL.md`
- Verify: `docs/reference/vercel-deployment.md`

- [ ] **Step 1: 정적 계약이 통과하는지 확인**

Run: `test ! -e .github/workflows/create-pr.yml`

Expected: PASS.

Search the repository for removed Bot PR creation references.

Expected: no stale `create-pr.yml`, `gh workflow run create-pr.yml`, or `github-actions[bot]` PR creation references.

- [ ] **Step 2: 타입 검사 실행**

Run: `npm run typecheck`

Expected: PASS with exit code 0.

- [ ] **Step 3: 전체 테스트 실행**

Run: `npm run test:run`

Expected: PASS with zero failed tests.

- [ ] **Step 4: 검증 중 수정이 생기면 별도 커밋 후 push**

```bash
git add <corrected-files>
git commit -m "docs: PR 생성 절차 검증 보완"
git push
```

- [ ] **Step 5: 최종 PR 상태 확인**

Run: `gh pr checks <pr-number>` and report the current check state without approving or merging the PR.
